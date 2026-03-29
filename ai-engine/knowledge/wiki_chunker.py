#!/usr/bin/env python3
"""
위키 파싱 결과를 RAG 청크 JSON으로 변환 (v2).
- 카테고리별 JSONL → 문서 단위 그룹핑 → 1문서 1청크 → 서브카테고리 균등 분배
- 동일 문서에서 최대 1청크만 추출
- 서브카테고리별 라운드로빈으로 다양성 확보
"""

import json
import os
import random
import re
import sys
from datetime import date
from pathlib import Path

# Windows CP949 인코딩 문제 방지
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).parent
RAW_DIR = BASE_DIR / "wiki_raw"

# 시드 고정 (재현 가능)
random.seed(42)

# 카테고리 → 출력 파일 매핑
CATEGORY_CONFIG = {
    "B_한국역사": {"file": "static/history.json", "prefix": "B", "subcategory_map": {
        "고조선": "고대", "단군": "고대", "위만조선": "고대", "삼한": "고대",
        "고구려": "삼국시대", "백제": "삼국시대", "신라": "삼국시대", "가야": "삼국시대",
        "통일신라": "남북국", "발해": "남북국",
        "고려": "고려", "왕건": "고려",
        "조선": "조선", "세종": "조선", "이순신": "조선", "임진왜란": "조선",
        "대한제국": "근대", "갑오개혁": "근대", "을사조약": "근대",
        "일제": "일제강점기", "독립운동": "일제강점기", "3·1": "일제강점기",
        "광복": "현대사", "한국 전쟁": "현대사", "6·25": "현대사",
        "4·19": "현대사", "5·18": "현대사", "제주 4·3": "현대사",
    }},
    "D_과학기술": {"file": "static/science.json", "prefix": "D", "subcategory_map": {
        "물리": "물리학", "양자": "물리학", "상대성": "물리학", "전자기": "물리학", "열역학": "물리학",
        "화학": "화학", "원소": "화학", "분자": "화학", "주기율표": "화학",
        "생물": "생물학", "세포": "생물학", "유전": "생물학", "DNA": "생물학", "진화": "생물학",
        "천문": "천문학", "우주": "천문학", "태양계": "천문학", "은하": "천문학", "블랙홀": "천문학",
        "의학": "의학", "바이러스": "의학", "백신": "의학", "면역": "의학", "질병": "의학",
        "수학": "수학", "미적분": "수학", "확률": "수학", "기하학": "수학",
        "반도체": "첨단기술", "나노": "첨단기술", "로봇": "첨단기술",
    }},
    "F_문화예술": {"file": "static/culture.json", "prefix": "F", "subcategory_map": {
        "한류": "한류", "K-pop": "한류", "케이팝": "한류", "BTS": "한류", "방탄": "한류", "블랙핑크": "한류",
        "영화": "영화", "봉준호": "영화", "기생충": "영화", "박찬욱": "영화",
        "문학": "문학", "소설": "문학", "시인": "문학", "윤동주": "문학",
        "미술": "미술", "도자기": "미술", "서예": "미술",
        "축구": "스포츠", "야구": "스포츠", "올림픽": "스포츠", "태권도": "스포츠",
        "유네스코": "문화유산", "문화유산": "문화유산", "종묘": "문화유산",
        "한식": "음식문화", "김치": "음식문화", "비빔밥": "음식문화",
        "판소리": "전통문화", "국악": "전통문화", "아리랑": "전통문화", "탈춤": "전통문화",
        "웹툰": "대중문화", "만화": "대중문화", "게임": "대중문화",
    }},
    "G_생활실용": {"file": "semi_static/living.json", "prefix": "G", "subcategory_map": {
        "부동산": "부동산", "아파트": "부동산", "전세": "부동산", "주택": "부동산",
        "세금": "세금·재정", "소득세": "세금·재정", "연말정산": "세금·재정",
        "건강": "건강", "운동": "건강", "다이어트": "건강", "영양": "건강",
        "요리": "요리", "레시피": "요리", "음식": "요리",
        "교통": "교통", "지하철": "교통", "KTX": "교통", "고속도로": "교통",
        "보험": "사회보장", "국민연금": "사회보장", "건강보험": "사회보장",
        "대출": "금융", "금리": "금융", "투자": "금융", "주식": "금융",
        "취업": "취업·자격", "자격증": "취업·자격", "공무원": "취업·자격",
        "결혼": "생활", "출산": "생활", "육아": "생활", "교육": "생활",
    }},
    "H_IT디지털": {"file": "semi_static/tech.json", "prefix": "H", "subcategory_map": {
        "프로그래밍": "프로그래밍", "파이썬": "프로그래밍", "자바": "프로그래밍",
        "운영 체제": "OS", "리눅스": "OS", "윈도우": "OS", "안드로이드": "OS",
        "웹": "웹개발", "앱": "앱개발", "데이터베이스": "데이터",
        "인공지능": "AI", "머신러닝": "AI", "딥러닝": "AI",
        "보안": "보안", "해킹": "보안", "암호": "보안",
        "스마트폰": "하드웨어", "GPU": "하드웨어", "CPU": "하드웨어",
        "삼성": "기업", "애플": "기업", "구글": "기업", "네이버": "기업", "카카오": "기업",
        "5G": "통신", "와이파이": "통신", "네트워크": "통신",
    }},
    "I_군사안보": {"file": "static/military.json", "prefix": "I", "subcategory_map": {
        "육군": "한국군", "해군": "한국군", "공군": "한국군", "해병대": "한국군", "국군": "한국군",
        "징병": "병역", "병역": "병역",
        "한미동맹": "동맹", "주한미군": "동맹", "NATO": "동맹",
        "핵": "핵·미사일", "미사일": "핵·미사일", "ICBM": "핵·미사일",
        "전쟁": "전쟁사", "한국 전쟁": "전쟁사", "6·25": "전쟁사", "DMZ": "전쟁사",
        "전투기": "무기체계", "전차": "무기체계", "자주포": "무기체계", "KF-21": "무기체계",
        "특수부대": "특수전", "특전사": "특수전",
        "방산": "방위산업", "수출": "방위산업",
    }},
    "J_신비오컬트": {"file": "static/occult.json", "prefix": "J", "subcategory_map": {
        "타로": "타로", "메이저": "타로", "마이너": "타로",
        "사주": "명리학", "팔자": "명리학", "천간": "명리학", "오행": "명리학", "주역": "명리학",
        "풍수": "풍수", "관상": "관상",
        "무속": "무속", "무당": "무속", "굿": "무속", "샤머니즘": "무속",
        "별자리": "점성술", "점성술": "점성술", "황도": "점성술",
        "꿈해몽": "해몽", "해몽": "해몽",
        "UFO": "초자연", "외계인": "초자연", "초능력": "초자연", "심령": "초자연",
        "수비학": "서양밀교", "카발라": "서양밀교", "연금술": "서양밀교",
    }},
}

# 파싱 잔해 필터링 패턴
RE_CURLY = re.compile(r'[{}]')
RE_BRACKET = re.compile(r'[\[\]]')
RE_MULTI_NEWLINE = re.compile(r'\n{2,}')
RE_JAPANESE = re.compile(r'[\u3040-\u309F\u30A0-\u30FF]')
RE_GARBAGE = re.compile(r'(000/|[\x00-\x08\x0b\x0c\x0e-\x1f]|&[a-z]+;|<[^>]+>)')
RE_INFOBOX_LINE = re.compile(r'^\s*\|.*=\s*', re.MULTILINE)
RE_TABLE_MARKUP = re.compile(r'^\s*[{|!][\-|}]?\s*$', re.MULTILINE)

# 카테고리별 제외 키워드
EXCLUDE_TITLES = {
    "J_신비오컬트": ["산타로사", "무당파 의원", "무당벌레", "무당거미"],
    "F_문화예술": ["혐한류"],
}


def deep_clean(text: str) -> str:
    """위키 마크업 잔여물을 추가 정제."""
    # 인포박스 잔여물 제거
    if text.count('|') > 5:
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith('|') and '=' in stripped:
                continue
            if stripped in ('|', '|-', '|}', '{|'):
                continue
            cleaned_lines.append(line)
        text = '\n'.join(cleaned_lines)

    text = RE_CURLY.sub('', text)
    text = RE_BRACKET.sub('', text)
    text = RE_GARBAGE.sub('', text)
    text = RE_INFOBOX_LINE.sub('', text)
    text = RE_TABLE_MARKUP.sub('', text)
    text = RE_MULTI_NEWLINE.sub('\n\n', text)
    text = text.strip()
    return text


def is_clean_text(text: str) -> bool:
    """텍스트 품질 검증. 파싱 잔해가 아닌 실제 내용인지 확인."""
    if len(text) < 200:
        return False
    if RE_JAPANESE.search(text):
        return False
    # 파이프 비율이 높으면 테이블 잔해
    if text.count('|') > len(text) / 50:
        return False
    # = 비율이 높으면 인포박스 잔해
    if text.count('=') > len(text) / 30:
        return False
    # 한글 비율이 너무 낮으면 (최소 30%)
    korean_chars = len(re.findall(r'[가-힣]', text))
    if korean_chars < len(text) * 0.3:
        return False
    return True


def guess_subcategory(title: str, text: str, subcat_map: dict) -> str:
    """문서 내용으로 세부 카테고리를 추정."""
    combined = title + " " + text[:500]
    for keyword, subcat in subcat_map.items():
        if keyword in combined:
            return subcat
    return "일반"


def extract_keywords(title: str, text: str, max_kw: int = 5) -> list[str]:
    """제목과 본문에서 키워드 추출."""
    keywords = [title]
    parens = re.findall(r'[（(]([^)）]+)[)）]', title)
    keywords.extend(parens)

    words = re.findall(r'[가-힣]{2,6}', text[:1000])
    freq = {}
    for w in words:
        if len(w) >= 2:
            freq[w] = freq.get(w, 0) + 1

    top_words = sorted(freq.items(), key=lambda x: -x[1])
    for w, cnt in top_words:
        if w not in keywords and cnt >= 2:
            keywords.append(w)
        if len(keywords) >= max_kw:
            break

    return keywords[:max_kw]


def truncate_to_range(text: str, min_len: int = 200, max_len: int = 500) -> str:
    """텍스트를 200~500자 범위로 자름. 문장 경계에서 자른다."""
    if len(text) <= max_len:
        return text

    # max_len 근처에서 문장 경계(다. 이다. 등) 찾기
    candidate = text[:max_len]
    # 마지막 문장 종결 위치 찾기
    last_end = -1
    for m in re.finditer(r'[.!?다]\s', candidate):
        if m.end() >= min_len:
            last_end = m.end()

    if last_end >= min_len:
        return candidate[:last_end].strip()

    # 문장 경계를 못 찾으면 마지막 공백에서 자름
    cut = candidate.rfind(' ')
    if cut >= min_len:
        return candidate[:cut].strip()

    return candidate.strip()


def pick_best_section(sections: list[dict]) -> dict | None:
    """문서의 여러 섹션 중 가장 내용이 충실한 섹션 1개를 선택.

    우선순위:
    1. 200자 이상인 섹션만 후보
    2. '개요', '정의', '역사', '개설' 등 핵심 섹션 우선
    3. 같은 우선순위면 가장 긴 섹션
    """
    PREFERRED_SECTIONS = {"개요", "정의", "역사", "개설", "설명", "소개", "배경", "특징", "개념", "기원"}

    best = None
    best_score = -1

    for sec in sections:
        text = deep_clean(sec.get("text", ""))
        if not is_clean_text(text):
            continue

        text = truncate_to_range(text)
        if len(text) < 200:
            continue

        section_name = sec.get("section", "")
        # 점수: 선호 섹션 보너스 + 길이 보너스
        score = len(text)
        if section_name in PREFERRED_SECTIONS:
            score += 10000  # 선호 섹션은 무조건 우선

        if score > best_score:
            best_score = score
            best = {
                "text": text,
                "section": section_name,
                "original_sec": sec,
            }

    return best


def score_article_relevance(title: str, sections: list[dict], cat: str) -> int:
    """문서의 카테고리 관련도 점수."""
    from wiki_parser import CATEGORY_KEYWORDS
    keywords = CATEGORY_KEYWORDS.get(cat, [])

    for exc in EXCLUDE_TITLES.get(cat, []):
        if exc in title:
            return 0

    combined = title
    for sec in sections[:3]:
        combined += " " + sec.get("text", "")[:500]

    score = 0
    for kw in keywords:
        if kw in title:
            score += 10
        elif kw in combined:
            score += 1
    return score


def process_category(cat: str, config: dict, target_chunks: int = 90) -> list[dict]:
    """카테고리 JSONL 파일을 읽어 RAG 청크로 변환.

    핵심 변경사항 (v2):
    - 동일 문서에서 최대 1청크만 추출
    - 서브카테고리별 라운드로빈으로 다양성 확보
    - 최소 50개 이상 서로 다른 문서에서 추출
    """
    jsonl_path = RAW_DIR / f"{cat}.jsonl"
    if not jsonl_path.exists():
        print(f"  [SKIP] {jsonl_path} 없음")
        return []

    prefix = config["prefix"]
    subcat_map = config["subcategory_map"]
    today = date.today().isoformat()

    # 1단계: 모든 섹션을 문서(title)별로 그룹핑
    title_sections: dict[str, list[dict]] = {}
    line_count = 0
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            line_count += 1
            try:
                doc = json.loads(line)
                t = doc["title"]
                if t not in title_sections:
                    title_sections[t] = []
                title_sections[t].append(doc)
            except (json.JSONDecodeError, KeyError):
                continue

    print(f"  {cat}: {line_count:,}줄, {len(title_sections):,}개 문서 로드")

    # 2단계: 각 문서에서 최고 섹션 1개 선택 + 관련도 점수 계산
    candidates = []  # (score, title, best_section_info)
    for title, secs in title_sections.items():
        score = score_article_relevance(title, secs, cat)
        if score == 0:
            continue

        best = pick_best_section(secs)
        if best is None:
            continue

        subcat = guess_subcategory(title, best["text"], subcat_map)
        candidates.append({
            "score": score,
            "title": title,
            "text": best["text"],
            "section": best["section"],
            "subcategory": subcat,
        })

    print(f"  후보 문서: {len(candidates):,}개 (관련도 > 0, 200자+ 섹션 보유)")

    # 3단계: 서브카테고리별 그룹핑
    subcat_groups: dict[str, list[dict]] = {}
    for cand in candidates:
        sc = cand["subcategory"]
        if sc not in subcat_groups:
            subcat_groups[sc] = []
        subcat_groups[sc].append(cand)

    # 각 서브카테고리 내에서 관련도순 정렬 후 셔플 (상위권 내에서 다양성)
    for sc in subcat_groups:
        group = subcat_groups[sc]
        # 관련도순 정렬
        group.sort(key=lambda x: -x["score"])
        # 상위 절반은 유지, 나머지는 셔플하여 다양성 확보
        mid = max(len(group) // 2, 10)
        top = group[:mid]
        rest = group[mid:]
        random.shuffle(rest)
        subcat_groups[sc] = top + rest

    # 4단계: 라운드로빈으로 서브카테고리 균등 선택
    selected = []
    used_titles = set()
    subcats = sorted(subcat_groups.keys())
    subcat_indices = {sc: 0 for sc in subcats}

    rounds = 0
    max_rounds = target_chunks * 3  # 무한루프 방지

    while len(selected) < target_chunks and rounds < max_rounds:
        progress = False
        for sc in subcats:
            if len(selected) >= target_chunks:
                break
            group = subcat_groups[sc]
            idx = subcat_indices[sc]

            # 이 서브카테고리에서 아직 사용 안 한 문서 찾기
            while idx < len(group):
                cand = group[idx]
                idx += 1
                if cand["title"] not in used_titles:
                    selected.append(cand)
                    used_titles.add(cand["title"])
                    progress = True
                    break

            subcat_indices[sc] = idx

        rounds += 1
        if not progress:
            break  # 모든 서브카테고리 소진

    # 5단계: 청크 포맷으로 변환
    chunks = []
    for i, cand in enumerate(selected, 1):
        keywords = extract_keywords(cand["title"], cand["text"])
        chunk = {
            "id": f"{prefix}-{i:03d}",
            "category": cat,
            "subcategory": cand["subcategory"],
            "title": cand["title"],
            "content": cand["text"],
            "source": f"ko.wikipedia.org/wiki/{cand['title'].replace(' ', '_')}",
            "source_section": cand["section"],
            "keywords": keywords,
            "tier": "common",
            "updated": today,
            "confidence": "verified"
        }
        chunks.append(chunk)

    # 통계 출력
    subcat_counts = {}
    for c in chunks:
        sc = c["subcategory"]
        subcat_counts[sc] = subcat_counts.get(sc, 0) + 1
    unique_titles = len(set(c["title"] for c in chunks))

    print(f"  → {len(chunks)} 청크 생성 ({unique_titles} 서로 다른 문서)")
    print(f"  서브카테고리 분포: {dict(sorted(subcat_counts.items()))}")

    return chunks


def save_chunks(cat: str, chunks: list[dict], config: dict):
    """청크를 JSON 파일로 저장."""
    output_path = BASE_DIR / config["file"]
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"  저장: {output_path} ({len(chunks)} 청크)")


def main():
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 90

    print(f"위키 청크화 v2 시작 (목표: {target} 청크/카테고리, 1문서=1청크)")
    print(f"입력: {RAW_DIR}")
    print()

    total = 0
    results = {}

    for cat, config in CATEGORY_CONFIG.items():
        print(f"처리: {cat}")
        chunks = process_category(cat, config, target_chunks=target)

        unique = len(set(c["title"] for c in chunks)) if chunks else 0
        if len(chunks) < 80:
            print(f"  ⚠ {len(chunks)} < 80 (부족)")
        elif unique < 50:
            print(f"  ⚠ 고유 문서 {unique} < 50 (다양성 부족)")
        else:
            print(f"  ✓ 충분 ({len(chunks)} 청크, {unique} 문서)")

        save_chunks(cat, chunks, config)
        results[cat] = {"chunks": len(chunks), "unique_titles": unique}
        total += len(chunks)
        print()

    print("=" * 50)
    print(f"총 {total} 청크 생성")
    for cat, info in sorted(results.items()):
        status = "✓" if info["chunks"] >= 80 and info["unique_titles"] >= 50 else "✗"
        print(f"  {status} {cat}: {info['chunks']} 청크 / {info['unique_titles']} 문서")

    return results


if __name__ == "__main__":
    main()
