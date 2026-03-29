#!/usr/bin/env python3
"""
RAG 지식 자동 업데이터 (updater.py)
Wikidata SPARQL을 이용하여 세계 지도자 정보를 갱신하고,
경제 지표 및 고유명사 사전을 업데이트한다.

사용법:
    python updater.py --weekly          # 전체 업데이트 실행
    python updater.py --weekly --dry-run  # 변경 사항만 미리보기
"""

import argparse
import copy
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    import requests
except ImportError:
    print("[오류] requests 패키지가 필요합니다: pip install requests")
    sys.exit(1)

# ── 경로 설정 ──
BASE_DIR = Path(__file__).parent
SEMI_STATIC_DIR = BASE_DIR / "semi_static"
DICTIONARIES_DIR = BASE_DIR / "dictionaries"
BACKUP_DIR = BASE_DIR / "backups"

WORLD_JSON = SEMI_STATIC_DIR / "world.json"
FACTS_JSON = DICTIONARIES_DIR / "facts.json"
PROPER_NAMES_JSON = DICTIONARIES_DIR / "proper_names.json"

# ── Wikidata SPARQL 엔드포인트 ──
WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

# ── 추적 대상 국가 (Wikidata Q-ID → 내부 키) ──
# 국가원수(P35) 또는 정부수반(P6)을 조회한다.
TRACKED_COUNTRIES = {
    "Q30":  {"key": "usa",         "name_ko": "미국",           "title_ko": "대통령"},
    "Q148": {"key": "china",       "name_ko": "중국",           "title_ko": "국가주석"},
    "Q159": {"key": "russia",      "name_ko": "러시아",         "title_ko": "대통령"},
    "Q17":  {"key": "japan",       "name_ko": "일본",           "title_ko": "총리"},
    "Q145": {"key": "uk",          "name_ko": "영국",           "title_ko": "총리"},
    "Q142": {"key": "france",      "name_ko": "프랑스",         "title_ko": "대통령"},
    "Q183": {"key": "germany",     "name_ko": "독일",           "title_ko": "총리"},
    "Q668": {"key": "india",       "name_ko": "인도",           "title_ko": "총리"},
    "Q16":  {"key": "canada",      "name_ko": "캐나다",         "title_ko": "총리"},
    "Q155": {"key": "brazil",      "name_ko": "브라질",         "title_ko": "대통령"},
    "Q38":  {"key": "italy",       "name_ko": "이탈리아",       "title_ko": "총리"},
    "Q29":  {"key": "spain",       "name_ko": "스페인",         "title_ko": "총리"},
    "Q408": {"key": "australia",   "name_ko": "호주",           "title_ko": "총리"},
    "Q884": {"key": "south_korea", "name_ko": "대한민국",       "title_ko": "대통령"},
    "Q423": {"key": "north_korea", "name_ko": "북한",           "title_ko": "국무위원장"},
    "Q865": {"key": "taiwan",      "name_ko": "대만",           "title_ko": "총통"},
    "Q212": {"key": "ukraine",     "name_ko": "우크라이나",     "title_ko": "대통령"},
    "Q801": {"key": "israel",      "name_ko": "이스라엘",       "title_ko": "총리"},
    "Q43":  {"key": "turkey",      "name_ko": "튀르키예",       "title_ko": "대통령"},
    "Q252": {"key": "indonesia",   "name_ko": "인도네시아",     "title_ko": "대통령"},
    "Q96":  {"key": "mexico",      "name_ko": "멕시코",         "title_ko": "대통령"},
    "Q258": {"key": "south_africa","name_ko": "남아공",         "title_ko": "대통령"},
    "Q851": {"key": "saudi_arabia","name_ko": "사우디아라비아", "title_ko": "총리"},
}

# ── SPARQL 쿼리: 각국 국가원수/정부수반 현직자 조회 ──
# P35 = 국가원수, P6 = 정부수반
# 현직자만 필터 (종료일이 없는 항목)
SPARQL_QUERY_TEMPLATE = """
SELECT ?country ?countryLabel ?leader ?leaderLabel ?leaderLabelKo ?startDate ?position WHERE {{
  VALUES ?country {{ {country_values} }}
  {{
    ?country p:P35 ?stmt .
    ?stmt ps:P35 ?leader .
    BIND("head_of_state" AS ?position)
  }} UNION {{
    ?country p:P6 ?stmt .
    ?stmt ps:P6 ?leader .
    BIND("head_of_government" AS ?position)
  }}
  FILTER NOT EXISTS {{ ?stmt pq:P582 ?endDate . }}
  OPTIONAL {{ ?stmt pq:P580 ?startDate . }}
  OPTIONAL {{ ?leader rdfs:label ?leaderLabelKo . FILTER(LANG(?leaderLabelKo) = "ko") }}
  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "ko,en" . }}
}}
ORDER BY ?country
"""


def log(msg: str) -> None:
    """타임스탬프와 함께 로그를 출력한다."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}")


def load_json(path: Path) -> dict:
    """JSON 파일을 로드한다."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    """JSON 파일을 저장한다 (들여쓰기 2칸, 한글 유지)."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    log(f"  저장 완료: {path}")


def create_backup(path: Path) -> Optional[Path]:
    """파일의 백업을 생성한다. 백업 경로를 반환."""
    if not path.exists():
        return None

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"{path.stem}_{ts}{path.suffix}"
    backup_path = BACKUP_DIR / backup_name
    shutil.copy2(path, backup_path)
    log(f"  백업 생성: {backup_path}")
    return backup_path


# ── Wikidata SPARQL 조회 ──

def build_sparql_query() -> str:
    """추적 대상 국가의 Q-ID를 SPARQL 쿼리에 삽입한다."""
    values = " ".join(f"wd:{qid}" for qid in TRACKED_COUNTRIES.keys())
    return SPARQL_QUERY_TEMPLATE.format(country_values=values)


def query_wikidata() -> list[dict]:
    """
    Wikidata SPARQL 엔드포인트에서 현직 지도자 정보를 조회한다.
    반환: [{"country_qid": "Q30", "leader_en": "...", "leader_ko": "...",
            "start_date": "2025-01-20", "position": "head_of_state"}, ...]
    """
    sparql = build_sparql_query()
    headers = {
        "Accept": "application/sparql-results+json",
        "User-Agent": "BAAL-RAG-Updater/1.0 (knowledge updater bot)"
    }

    try:
        log("Wikidata SPARQL 쿼리 실행 중...")
        resp = requests.get(
            WIKIDATA_SPARQL_URL,
            params={"query": sparql},
            headers=headers,
            timeout=30
        )
        resp.raise_for_status()
    except requests.ConnectionError:
        log("[오류] Wikidata 서버에 연결할 수 없습니다. 네트워크를 확인하세요.")
        return []
    except requests.Timeout:
        log("[오류] Wikidata 쿼리 시간 초과 (30초)")
        return []
    except requests.HTTPError as e:
        log(f"[오류] Wikidata HTTP 오류: {e}")
        return []

    try:
        data = resp.json()
    except ValueError:
        log("[오류] Wikidata 응답을 JSON으로 파싱할 수 없습니다.")
        return []

    results = []
    for binding in data.get("results", {}).get("bindings", []):
        # 국가 Q-ID 추출 (URI에서 마지막 부분)
        country_uri = binding.get("country", {}).get("value", "")
        country_qid = country_uri.split("/")[-1] if country_uri else ""

        # 지도자 이름: 한국어 우선, 없으면 영어 label
        leader_ko = binding.get("leaderLabelKo", {}).get("value", "")
        leader_label = binding.get("leaderLabel", {}).get("value", "")
        # leaderLabel은 SERVICE wikibase:label에서 ko 우선으로 들어옴
        leader_en = leader_label if not leader_ko else leader_label

        # 취임일
        start_raw = binding.get("startDate", {}).get("value", "")
        start_date = start_raw[:10] if start_raw else ""  # "2025-01-20T00:00:00Z" → "2025-01-20"

        position = binding.get("position", {}).get("value", "")

        results.append({
            "country_qid": country_qid,
            "leader_en": leader_en,
            "leader_ko": leader_ko if leader_ko else leader_label,
            "start_date": start_date,
            "position": position,
        })

    log(f"  Wikidata에서 {len(results)}건의 결과를 받았습니다.")
    return results


def pick_best_leader(results: list[dict], qid: str, country_info: dict) -> Optional[dict]:
    """
    한 국가에 대해 가장 적합한 지도자를 선택한다.
    정부수반(head_of_government) 국가는 총리를, 국가원수(head_of_state) 국가는 대통령을 우선한다.
    """
    # 해당 국가 결과만 필터
    country_results = [r for r in results if r["country_qid"] == qid]
    if not country_results:
        return None

    title = country_info["title_ko"]
    # 총리/총통이면 정부수반 우선, 대통령/국가주석/국무위원장이면 국가원수 우선
    prefer_hog = title in ("총리", "총통")

    # 우선순위로 정렬
    def sort_key(r):
        if prefer_hog:
            return (0 if r["position"] == "head_of_government" else 1, r["start_date"] or "0000")
        else:
            return (0 if r["position"] == "head_of_state" else 1, r["start_date"] or "0000")

    country_results.sort(key=sort_key)
    return country_results[0]


# ── 1. 세계 지도자 업데이트 (world.json) ──

def update_world_leaders(wikidata_results: list[dict], dry_run: bool = False) -> list[str]:
    """
    world.json의 각국 지도자 청크를 Wikidata 결과와 비교하여 갱신한다.
    변경 내역 리스트를 반환한다.
    """
    changes = []

    if not WORLD_JSON.exists():
        log(f"[경고] {WORLD_JSON} 파일이 존재하지 않습니다. 건너뜁니다.")
        return changes

    world_data = load_json(WORLD_JSON)
    original_data = copy.deepcopy(world_data)
    chunks = world_data.get("chunks", [])

    # 청크에서 국가별 지도자 정보를 찾기 위한 인덱스 구축
    # subcategory가 "각국지도자"인 청크를 국가 키워드로 매핑
    for qid, info in TRACKED_COUNTRIES.items():
        best = pick_best_leader(wikidata_results, qid, info)
        if not best:
            continue

        new_name = best["leader_ko"]
        new_start = best["start_date"]
        country_name = info["name_ko"]

        # world.json 청크에서 해당 국가 지도자 청크 찾기
        for chunk in chunks:
            if chunk.get("subcategory") != "각국지도자":
                continue
            # 청크 제목이나 키워드에 국가명이 포함되어 있는지 확인
            title = chunk.get("title", "")
            keywords = chunk.get("keywords", [])
            if country_name not in title and country_name not in keywords:
                continue

            # 기존 이름 추출 (제목에서 "— 이름" 패턴)
            current_name = ""
            if "—" in title:
                current_name = title.split("—")[-1].strip().split("(")[0].strip()

            if current_name and current_name != new_name and new_name:
                msg = (
                    f"[지도자 변경 감지] {country_name}: "
                    f"{current_name} → {new_name} (취임: {new_start})"
                )
                changes.append(msg)
                log(msg)

                if not dry_run:
                    # 제목 업데이트
                    new_title = title.replace(current_name, new_name)
                    chunk["title"] = new_title
                    # 업데이트 날짜 갱신
                    chunk["updated"] = datetime.now().strftime("%Y-%m-%d")
                    chunk["confidence"] = "wikidata_auto"
            break

    if changes and not dry_run:
        create_backup(WORLD_JSON)
        world_data["meta"]["updated"] = datetime.now().strftime("%Y-%m-%d")
        world_data["meta"]["source"] = "Wikidata SPARQL + auto updater"
        save_json(WORLD_JSON, world_data)

    if not changes:
        log("  world.json: 지도자 변경 사항 없음")

    return changes


# ── 2. 팩트 사전 업데이트 (facts.json) ──

def update_facts_leaders(wikidata_results: list[dict], dry_run: bool = False) -> list[str]:
    """
    facts.json의 world_leaders 섹션을 Wikidata 결과와 비교하여 갱신한다.
    """
    changes = []

    if not FACTS_JSON.exists():
        log(f"[경고] {FACTS_JSON} 파일이 존재하지 않습니다. 건너뜁니다.")
        return changes

    facts = load_json(FACTS_JSON)
    leaders = facts.get("world_leaders", {})

    for qid, info in TRACKED_COUNTRIES.items():
        best = pick_best_leader(wikidata_results, qid, info)
        if not best:
            continue

        key = info["key"]
        new_name = best["leader_ko"]
        new_start = best["start_date"][:7] if best["start_date"] else ""  # "2025-01" 형식

        existing = leaders.get(key, {})
        current_name = existing.get("name", "")

        if current_name and current_name != new_name and new_name:
            msg = (
                f"[facts 지도자 갱신] {info['name_ko']} ({key}): "
                f"{current_name} → {new_name}"
            )
            changes.append(msg)
            log(msg)

            if not dry_run:
                leaders[key] = {
                    "name": new_name,
                    "title": info["title_ko"],
                    "since": new_start,
                }
        elif not current_name and new_name:
            # 기존에 없던 국가 추가
            msg = f"[facts 지도자 추가] {info['name_ko']} ({key}): {new_name}"
            changes.append(msg)
            log(msg)

            if not dry_run:
                leaders[key] = {
                    "name": new_name,
                    "title": info["title_ko"],
                    "since": new_start,
                }

    if changes and not dry_run:
        create_backup(FACTS_JSON)
        facts["meta"]["updated"] = datetime.now().strftime("%Y-%m-%d")
        save_json(FACTS_JSON, facts)

    if not changes:
        log("  facts.json 지도자: 변경 사항 없음")

    return changes


def update_facts_economics(dry_run: bool = False) -> list[str]:
    """
    facts.json의 경제 지표를 업데이트한다.
    현재는 구조만 확인하고, 실제 API 연동은 플레이스홀더로 남겨둔다.
    향후 연동 가능한 API:
      - 환율: exchangerate-api.com, 한국은행 ECOS API
      - 금리: FRED API (미국), 한국은행 기준금리
      - 비트코인: CoinGecko API
    """
    changes = []

    if not FACTS_JSON.exists():
        return changes

    facts = load_json(FACTS_JSON)
    econ = facts.get("key_economic_facts", {})

    # ── 플레이스홀더: 환율 업데이트 ──
    # 실제 운영 시 아래 주석을 해제하고 API 키를 설정하세요.
    #
    # try:
    #     resp = requests.get(
    #         "https://api.exchangerate-api.com/v4/latest/USD",
    #         timeout=10
    #     )
    #     resp.raise_for_status()
    #     rates = resp.json().get("rates", {})
    #     krw = rates.get("KRW")
    #     if krw:
    #         new_val = f"약 {int(krw):,}원 (실시간)"
    #         old_val = econ.get("usd_krw_range", "")
    #         if old_val != new_val:
    #             changes.append(f"[경제지표] USD/KRW: {old_val} → {new_val}")
    #             econ["usd_krw_range"] = new_val
    # except Exception as e:
    #     log(f"[경고] 환율 API 오류: {e}")

    # ── 플레이스홀더: 한국은행 기준금리 ──
    # ECOS API 연동 시:
    # https://ecos.bok.or.kr/api/StatisticSearch/{API_KEY}/json/kr/1/1/722Y001/MM/...

    # ── 플레이스홀더: 미국 연방기금금리 ──
    # FRED API 연동 시:
    # https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=...

    log("  경제 지표: API 연동 플레이스홀더 (현재 수동 업데이트 필요)")

    if changes and not dry_run:
        create_backup(FACTS_JSON)
        facts["meta"]["updated"] = datetime.now().strftime("%Y-%m-%d")
        save_json(FACTS_JSON, facts)

    return changes


# ── 3. 고유명사 사전 업데이트 (proper_names.json) ──

def update_proper_names(wikidata_results: list[dict], dry_run: bool = False) -> list[str]:
    """
    Wikidata에서 조회한 지도자 이름을 proper_names.json의 leaders 섹션에 추가한다.
    영어명 → 한국어명 매핑이 없는 경우에만 추가.
    """
    changes = []

    if not PROPER_NAMES_JSON.exists():
        log(f"[경고] {PROPER_NAMES_JSON} 파일이 존재하지 않습니다. 건너뜁니다.")
        return changes

    names_data = load_json(PROPER_NAMES_JSON)
    leaders_dict = names_data.get("leaders", {})

    # 이미 등록된 이름의 한국어 값 집합 (중복 방지)
    existing_ko_names = set(leaders_dict.values())

    seen_en_names = set()  # 같은 실행에서 중복 추가 방지

    for result in wikidata_results:
        en_name = result.get("leader_en", "").strip()
        ko_name = result.get("leader_ko", "").strip()

        if not en_name or not ko_name:
            continue

        # 영어 이름이 이미 사전에 있으면 건너뛰기
        if en_name in leaders_dict:
            continue

        # 이번 실행에서 이미 처리한 이름 건너뛰기
        if en_name in seen_en_names:
            continue
        seen_en_names.add(en_name)

        msg = f"[고유명사 추가] {en_name} → {ko_name}"
        changes.append(msg)
        log(msg)

        if not dry_run:
            leaders_dict[en_name] = ko_name

    if changes and not dry_run:
        create_backup(PROPER_NAMES_JSON)
        # 카운트 업데이트
        total = sum(
            len(v) for k, v in names_data.items()
            if isinstance(v, dict) and k != "meta"
        )
        names_data["meta"]["count"] = total
        names_data["meta"]["updated"] = datetime.now().strftime("%Y-%m-%d")
        save_json(PROPER_NAMES_JSON, names_data)

    if not changes:
        log("  proper_names.json: 새로운 이름 없음")

    return changes


# ── 메인 실행 ──

def run_weekly_update(dry_run: bool = False) -> None:
    """주간 전체 업데이트를 실행한다."""
    log("=" * 60)
    log("RAG 지식 자동 업데이트 시작")
    if dry_run:
        log("*** DRY-RUN 모드: 실제 파일을 수정하지 않습니다 ***")
    log("=" * 60)

    all_changes = []

    # 1단계: Wikidata에서 현직 지도자 조회
    log("")
    log("[1단계] Wikidata SPARQL 지도자 조회")
    wikidata_results = query_wikidata()

    if not wikidata_results:
        log("[경고] Wikidata 결과가 비어 있습니다. 네트워크 문제이거나 쿼리 오류일 수 있습니다.")
        log("  → 지도자 관련 업데이트를 건너뜁니다.")
    else:
        # 결과 요약 출력
        log(f"  조회된 국가 수: {len(set(r['country_qid'] for r in wikidata_results))}")
        for r in wikidata_results:
            qid = r["country_qid"]
            info = TRACKED_COUNTRIES.get(qid, {})
            country_name = info.get("name_ko", qid)
            log(f"    {country_name}: {r['leader_ko']} ({r['position']}, {r['start_date']})")

    # 2단계: world.json 지도자 청크 업데이트
    if wikidata_results:
        log("")
        log("[2단계] world.json 지도자 청크 업데이트")
        changes = update_world_leaders(wikidata_results, dry_run=dry_run)
        all_changes.extend(changes)

    # 3단계: facts.json 지도자 섹션 업데이트
    if wikidata_results:
        log("")
        log("[3단계] facts.json 지도자 업데이트")
        changes = update_facts_leaders(wikidata_results, dry_run=dry_run)
        all_changes.extend(changes)

    # 4단계: facts.json 경제 지표 업데이트
    log("")
    log("[4단계] facts.json 경제 지표 업데이트")
    changes = update_facts_economics(dry_run=dry_run)
    all_changes.extend(changes)

    # 5단계: proper_names.json 고유명사 추가
    if wikidata_results:
        log("")
        log("[5단계] proper_names.json 고유명사 업데이트")
        changes = update_proper_names(wikidata_results, dry_run=dry_run)
        all_changes.extend(changes)

    # 최종 요약
    log("")
    log("=" * 60)
    log(f"업데이트 완료. 총 변경 사항: {len(all_changes)}건")
    if all_changes:
        log("")
        log("[변경 요약]")
        for c in all_changes:
            log(f"  {c}")
    else:
        log("  모든 데이터가 최신 상태입니다.")
    if dry_run:
        log("")
        log("*** DRY-RUN 모드였으므로 파일은 수정되지 않았습니다 ***")
    log("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="RAG 지식 자동 업데이터 — Wikidata 기반 세계 지도자 및 팩트 갱신"
    )
    parser.add_argument(
        "--weekly",
        action="store_true",
        help="주간 전체 업데이트를 실행한다",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="변경 사항만 확인하고 실제 파일은 수정하지 않는다",
    )

    args = parser.parse_args()

    if not args.weekly:
        parser.print_help()
        print("\n사용 예: python updater.py --weekly")
        print("         python updater.py --weekly --dry-run")
        sys.exit(0)

    run_weekly_update(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
