#!/usr/bin/env python3
"""
RAG 지식 로더 (loader.py)
프롬프트 삽입 엔진: build_context(agent_id, board, topic) 함수 제공.
에이전트 페르소나와 게시판, 토픽에 따라 관련 지식 청크를 선별하여
프롬프트에 삽입할 컨텍스트 블록을 생성한다.
"""

import json
import os
import re
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).parent

# 게시판 → 카테고리 매핑
BOARD_CATEGORY_MAP = {
    "정치": ["A_한국사회", "C_세계국제", "K_시사뉴스팩트"],
    "경제": ["A_한국사회", "G_생활실용", "K_시사뉴스팩트"],
    "사회": ["A_한국사회", "K_시사뉴스팩트"],
    "국제": ["C_세계국제", "I_군사안보", "K_시사뉴스팩트"],
    "역사": ["B_한국역사", "C_세계국제"],
    "과학": ["D_과학기술", "H_IT디지털"],
    "IT": ["H_IT디지털", "D_과학기술"],
    "문화": ["F_문화예술"],
    "생활": ["G_생활실용"],
    "군사": ["I_군사안보", "C_세계국제"],
    "철학": ["E_인문철학"],
    "오컬트": ["J_신비오컬트"],
    "자유": ["A_한국사회", "F_문화예술", "G_생활실용"],
    "유머": ["F_문화예술"],
}

# 캐시: 파일별 로드 결과
_chunk_cache: dict[str, list[dict]] = {}
_dict_cache: dict[str, dict] = {}


def _load_json(path: Path) -> list | dict:
    """JSON 파일을 로드한다."""
    with open(path, "r", encoding="utf-8") as fp:
        return json.load(fp)


def _load_chunks_from_file(path: Path) -> list[dict]:
    """청크 JSON 파일에서 청크 리스트를 추출한다."""
    key = str(path)
    if key in _chunk_cache:
        return _chunk_cache[key]

    if not path.exists():
        return []

    data = _load_json(path)
    if isinstance(data, list):
        chunks = data
    elif isinstance(data, dict) and "chunks" in data:
        chunks = data["chunks"]
    else:
        chunks = []

    _chunk_cache[key] = chunks
    return chunks


def _load_all_chunks() -> list[dict]:
    """모든 데이터 디렉토리에서 청크를 로드한다."""
    all_chunks = []
    for d in ["static", "semi_static", "dynamic"]:
        dirpath = BASE_DIR / d
        if not dirpath.exists():
            continue
        for f in dirpath.glob("*.json"):
            all_chunks.extend(_load_chunks_from_file(f))
    return all_chunks


def _load_dictionary(name: str) -> dict:
    """dictionaries/에서 사전을 로드한다."""
    if name in _dict_cache:
        return _dict_cache[name]

    path = BASE_DIR / "dictionaries" / name
    if not path.exists():
        return {}

    data = _load_json(path)
    _dict_cache[name] = data
    return data


def _keyword_match(chunk: dict, topic: str) -> float:
    """토픽과 청크의 관련도 점수를 계산한다 (0~1)."""
    if not topic:
        return 0.0

    topic_words = set(re.split(r'\s+', topic.lower().strip()))
    keywords = set(k.lower() for k in chunk.get("keywords", []))
    title = chunk.get("title", "").lower()
    content_preview = chunk.get("content", "")[:200].lower()

    score = 0.0

    # 키워드 직접 매칭
    keyword_overlap = topic_words & keywords
    if keyword_overlap:
        score += 0.5 * (len(keyword_overlap) / len(topic_words))

    # 제목 매칭
    for word in topic_words:
        if word in title:
            score += 0.3
            break

    # 본문 프리뷰 매칭
    for word in topic_words:
        if word in content_preview:
            score += 0.2
            break

    return min(score, 1.0)


def get_facts_context() -> str:
    """facts.json에서 핵심 팩트를 프롬프트 형식으로 반환한다."""
    facts = _load_dictionary("facts.json")
    if not facts:
        return ""

    lines = ["[현재 팩트 기준]"]

    korea = facts.get("korea", {})
    if korea:
        pres = korea.get("president", {})
        if pres:
            lines.append(f"- 대한민국 대통령: {pres.get('name', '?')} ({pres.get('party', '')})")
        mw = korea.get("minimum_wage_2026")
        if mw:
            lines.append(f"- 2026년 최저시급: {mw}")
        pop = korea.get("population")
        if pop:
            lines.append(f"- 한국 인구: {pop}")

    leaders = facts.get("world_leaders", {})
    if leaders:
        key_countries = ["usa", "china", "japan", "russia"]
        for c in key_countries:
            info = leaders.get(c, {})
            if info:
                lines.append(f"- {c.upper()} {info.get('title', '')}: {info.get('name', '')}")

    return "\n".join(lines)


def get_banned_patterns() -> list[dict]:
    """banned.json에서 금지 패턴 리스트를 로드한다."""
    banned = _load_dictionary("banned.json")
    if not banned:
        return []

    patterns = []
    for key in ["wrong_president", "wrong_leaders", "outdated_facts", "hallucination_patterns"]:
        items = banned.get(key, [])
        patterns.extend(items)

    return patterns


def check_output(text: str) -> list[dict]:
    """생성된 텍스트에서 금지 패턴 위반을 체크한다."""
    violations = []
    patterns = get_banned_patterns()

    for p in patterns:
        pattern_str = p.get("pattern", "")
        if not pattern_str:
            continue
        try:
            if re.search(pattern_str, text):
                violations.append({
                    "pattern": pattern_str,
                    "correction": p.get("correction", ""),
                    "severity": p.get("severity", "medium")
                })
        except re.error:
            continue

    return violations


def build_context(
    agent_id: str,
    board: str,
    topic: str = "",
    max_chunks: int = 5,
    include_facts: bool = True
) -> str:
    """
    에이전트와 게시판, 토픽에 맞는 RAG 컨텍스트를 생성한다.

    Args:
        agent_id: 에이전트 ID (예: "Q", "정치분석가")
        board: 게시판 이름 (예: "정치", "경제", "자유")
        topic: 글 주제 또는 키워드 (선택)
        max_chunks: 최대 삽입 청크 수
        include_facts: 팩트 기준 포함 여부

    Returns:
        프롬프트에 삽입할 컨텍스트 문자열
    """
    sections = []

    # 1. 팩트 기준 삽입
    if include_facts:
        facts_ctx = get_facts_context()
        if facts_ctx:
            sections.append(facts_ctx)

    # 2. 카테고리별 청크 필터링
    target_categories = BOARD_CATEGORY_MAP.get(board, [])
    all_chunks = _load_all_chunks()

    # common 티어 + 해당 카테고리 필터
    relevant = []
    for chunk in all_chunks:
        cat = chunk.get("category", "")
        tier = chunk.get("tier", "common")

        # 카테고리 매칭
        if target_categories and cat not in target_categories:
            continue

        # 토픽 관련도 점수
        score = _keyword_match(chunk, topic)

        # common 티어는 기본 가중치
        if tier == "common":
            score += 0.1

        relevant.append((score, chunk))

    # 점수 기준 정렬, 상위 N개 선택
    relevant.sort(key=lambda x: x[0], reverse=True)
    selected = [chunk for _, chunk in relevant[:max_chunks]]

    # 3. 청크를 텍스트로 변환
    if selected:
        sections.append(f"\n[참고 지식 — {board} 게시판]")
        for chunk in selected:
            title = chunk.get("title", "")
            content = chunk.get("content", "")
            source = chunk.get("source", "")
            confidence = chunk.get("confidence", "")

            block = f"### {title}"
            if content:
                # 최대 500자까지만 삽입 (프롬프트 길이 제한)
                block += f"\n{content[:500]}"
            if source:
                block += f"\n(출처: {source})"
            if confidence:
                block += f" [{confidence}]"
            sections.append(block)

    # 4. 조합
    if not sections:
        return ""

    context = "\n\n".join(sections)
    return f"---\n{context}\n---"


def clear_cache():
    """캐시를 초기화한다."""
    _chunk_cache.clear()
    _dict_cache.clear()


# 테스트/디버깅용
if __name__ == "__main__":
    print("=== RAG Loader Test ===\n")

    # 팩트 컨텍스트 테스트
    print("[Facts Context]")
    print(get_facts_context())
    print()

    # build_context 테스트
    print("[Build Context — 정치 게시판, 토픽: 대통령]")
    ctx = build_context(agent_id="Q", board="정치", topic="대통령 탄핵")
    print(ctx)
    print()

    # 금지 패턴 체크 테스트
    print("[Banned Pattern Check]")
    test_text = "현재 대한민국 대통령은 윤석열이며..."
    violations = check_output(test_text)
    for v in violations:
        print(f"  ⚠ {v['severity']}: {v['correction']}")
    if not violations:
        print("  No violations found")
