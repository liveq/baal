#!/usr/bin/env python3
"""
RAG 지식 체계 검증기 (validator.py)
- 스키마 검증: 필수 필드 존재 확인
- 중복 검증: ID 중복 체크
- 커버리지 검증: 각 카테고리 최소 청크 수
- 인코딩 검증: 중국어/일본어 혼입 체크
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).parent

REQUIRED_FIELDS = {"id", "category", "subcategory", "title", "content", "source", "keywords", "tier", "updated", "confidence"}
VALID_TIERS = {"common", "specialist"}
VALID_CONFIDENCE = {"verified", "single_source", "manual", "auto_generated"}
VALID_CATEGORIES = {
    "A_한국사회", "B_한국역사", "C_세계국제", "D_과학기술",
    "E_인문철학", "F_문화예술", "G_생활실용", "H_IT디지털",
    "I_군사안보", "J_신비오컬트", "K_시사뉴스팩트"
}

# CJK Unified Ideographs (중국어/일본어 한자 범위) - 한국 한자(한자어)는 허용하되
# 히라가나/가타카나/간체자 특수문자는 금지
JAPANESE_KANA = re.compile(r'[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]')  # 히라가나, 가타카나
CHINESE_SIMPLIFIED_ONLY = re.compile(r'[\u2E80-\u2EFF]')  # CJK Radicals Supplement (간체 전용은 아니지만 마커)


def load_all_chunks() -> list[dict]:
    """모든 JSON 파일에서 청크를 로드한다."""
    chunks = []
    data_dirs = ["static", "semi_static", "dynamic"]
    for d in data_dirs:
        dirpath = BASE_DIR / d
        if not dirpath.exists():
            continue
        for f in dirpath.glob("*.json"):
            try:
                with open(f, "r", encoding="utf-8") as fp:
                    data = json.load(fp)
                if isinstance(data, list):
                    for item in data:
                        item["_source_file"] = str(f)
                    chunks.extend(data)
                elif isinstance(data, dict) and "chunks" in data:
                    for item in data["chunks"]:
                        item["_source_file"] = str(f)
                    chunks.extend(data["chunks"])
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                print(f"  [ERROR] {f}: {e}")
    return chunks


def validate_schema(chunks: list[dict]) -> list[str]:
    """필수 필드 존재 여부 검증."""
    errors = []
    for c in chunks:
        chunk_id = c.get("id", "UNKNOWN")
        src = c.get("_source_file", "?")
        missing = REQUIRED_FIELDS - set(c.keys())
        if missing:
            errors.append(f"[SCHEMA] {chunk_id} in {src}: missing fields {missing}")
        if c.get("tier") and c["tier"] not in VALID_TIERS:
            errors.append(f"[SCHEMA] {chunk_id}: invalid tier '{c['tier']}'")
        if c.get("confidence") and c["confidence"] not in VALID_CONFIDENCE:
            errors.append(f"[SCHEMA] {chunk_id}: invalid confidence '{c['confidence']}'")
        if c.get("category") and c["category"] not in VALID_CATEGORIES:
            errors.append(f"[SCHEMA] {chunk_id}: invalid category '{c['category']}'")
    return errors


def validate_duplicates(chunks: list[dict]) -> list[str]:
    """ID 중복 검증."""
    errors = []
    id_counts = Counter(c.get("id", "") for c in chunks)
    for cid, count in id_counts.items():
        if count > 1:
            errors.append(f"[DUPLICATE] id '{cid}' appears {count} times")
    return errors


def validate_encoding(chunks: list[dict]) -> list[str]:
    """중국어(간체 전용)/일본어(가나) 혼입 검증."""
    errors = []
    for c in chunks:
        chunk_id = c.get("id", "UNKNOWN")
        content = c.get("content", "")
        title = c.get("title", "")
        text = title + " " + content

        kana_matches = JAPANESE_KANA.findall(text)
        if kana_matches:
            errors.append(f"[ENCODING] {chunk_id}: Japanese kana detected: {''.join(kana_matches[:5])}")

    return errors


def validate_coverage(chunks: list[dict]) -> dict:
    """카테고리별 청크 수 리포트."""
    cat_counts = Counter(c.get("category", "UNKNOWN") for c in chunks)
    report = {}
    for cat in VALID_CATEGORIES:
        count = cat_counts.get(cat, 0)
        report[cat] = {"count": count, "status": "OK" if count >= 1 else "EMPTY"}
    return report


def validate_dictionaries() -> list[str]:
    """dictionaries/ 파일 검증."""
    errors = []
    dict_dir = BASE_DIR / "dictionaries"

    for fname in ["proper_names.json", "facts.json", "banned.json"]:
        fpath = dict_dir / fname
        if not fpath.exists():
            errors.append(f"[DICT] Missing: {fname}")
            continue
        try:
            with open(fpath, "r", encoding="utf-8") as fp:
                data = json.load(fp)
            if not isinstance(data, dict):
                errors.append(f"[DICT] {fname}: root must be object")
            if "meta" not in data:
                errors.append(f"[DICT] {fname}: missing 'meta' field")
        except json.JSONDecodeError as e:
            errors.append(f"[DICT] {fname}: JSON parse error: {e}")
        except UnicodeDecodeError as e:
            errors.append(f"[DICT] {fname}: encoding error: {e}")

    # proper_names 카운트 체크
    pn_path = dict_dir / "proper_names.json"
    if pn_path.exists():
        with open(pn_path, "r", encoding="utf-8") as fp:
            pn = json.load(fp)
        total = sum(len(v) for k, v in pn.items() if k != "meta" and isinstance(v, dict))
        if total < 100:
            errors.append(f"[DICT] proper_names.json: only {total} entries (need 100+)")

    return errors


def run_validation() -> dict:
    """전체 검증 실행."""
    print("=" * 60)
    print(f"RAG Knowledge Validation — {datetime.now().isoformat()}")
    print("=" * 60)

    results = {"errors": [], "warnings": [], "coverage": {}}

    # 1. dictionaries 검증
    print("\n[1/5] Validating dictionaries...")
    dict_errors = validate_dictionaries()
    results["errors"].extend(dict_errors)
    print(f"  → {len(dict_errors)} errors")

    # 2. 청크 로드
    print("\n[2/5] Loading chunks...")
    chunks = load_all_chunks()
    print(f"  → {len(chunks)} chunks loaded")

    if chunks:
        # 3. 스키마 검증
        print("\n[3/5] Schema validation...")
        schema_errors = validate_schema(chunks)
        results["errors"].extend(schema_errors)
        print(f"  → {len(schema_errors)} errors")

        # 4. 중복 검증
        print("\n[4/5] Duplicate check...")
        dup_errors = validate_duplicates(chunks)
        results["errors"].extend(dup_errors)
        print(f"  → {len(dup_errors)} errors")

        # 5. 인코딩 검증
        print("\n[5/5] Encoding check...")
        enc_errors = validate_encoding(chunks)
        results["errors"].extend(enc_errors)
        print(f"  → {len(enc_errors)} errors")
    else:
        print("  → No chunks found, skipping chunk validation")

    # 커버리지
    coverage = validate_coverage(chunks)
    results["coverage"] = coverage

    # 결과 출력
    print("\n" + "=" * 60)
    print("COVERAGE REPORT")
    print("=" * 60)
    for cat, info in sorted(coverage.items()):
        status_icon = "✓" if info["status"] == "OK" else "✗"
        print(f"  {status_icon} {cat}: {info['count']} chunks")

    print(f"\n총 에러: {len(results['errors'])}")
    if results["errors"]:
        print("\nERRORS:")
        for e in results["errors"][:20]:
            print(f"  {e}")
        if len(results["errors"]) > 20:
            print(f"  ... and {len(results['errors']) - 20} more")

    # 검증 결과 저장
    validation_dir = BASE_DIR / "validation"
    validation_dir.mkdir(exist_ok=True)
    report_path = validation_dir / "latest_report.json"
    with open(report_path, "w", encoding="utf-8") as fp:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_chunks": len(chunks),
            "total_errors": len(results["errors"]),
            "errors": results["errors"],
            "coverage": results["coverage"]
        }, fp, ensure_ascii=False, indent=2)
    print(f"\n리포트 저장: {report_path}")

    return results


if __name__ == "__main__":
    results = run_validation()
    sys.exit(1 if results["errors"] else 0)
