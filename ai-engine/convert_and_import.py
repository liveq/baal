"""
스키마 변환 + DB 임포트 통합 스크립트
Q2/Q3 daily fortune SQL을 현재 DB 스키마로 변환해서 Supabase REST API로 직접 INSERT
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import re, os, requests, json
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
H = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

ZODIAC_MAP = {
    'aries': (1, 'Aries'), 'taurus': (2, 'Taurus'), 'gemini': (3, 'Gemini'),
    'cancer': (4, 'Cancer'), 'leo': (5, 'Leo'), 'virgo': (6, 'Virgo'),
    'libra': (7, 'Libra'), 'scorpio': (8, 'Scorpio'), 'sagittarius': (9, 'Sagittarius'),
    'capricorn': (10, 'Capricorn'), 'aquarius': (11, 'Aquarius'), 'pisces': (12, 'Pisces'),
}

SQL_DIR = "C:/aicode/agent_workspace/024_ai_baal/reference/sql"


def parse_q2_daily(filepath):
    """Q2: 각 행이 별도 INSERT 문. overall_score 포함."""
    sql = open(filepath, 'r', encoding='utf-8').read()
    rows = []

    # Find all VALUES (...); blocks
    pattern = r"VALUES\s*\(\s*'(\d{4}-\d{2}-\d{2})'\s*,\s*'(\w+)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*?)'\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*\)"

    matches = re.findall(pattern, sql, re.DOTALL)
    for m in matches:
        date, sign, overall, love, money, work, health, overall_score, love_score, money_score, work_score, health_score, color, number, item, advice = m
        zid, zname = ZODIAC_MAP.get(sign.lower(), (0, sign))
        rows.append({
            "date": date, "zodiac_id": zid, "zodiac_name": zname,
            "overall_fortune": overall.replace("''", "'"),
            "love_fortune": love.replace("''", "'"),
            "money_fortune": money.replace("''", "'"),
            "work_fortune": work.replace("''", "'"),
            "health_fortune": health.replace("''", "'"),
            "love_score": int(love_score), "money_score": int(money_score),
            "work_score": int(work_score), "health_score": int(health_score),
            "lucky_color": color.replace("''", "'"),
            "lucky_number": int(number),
            "lucky_time": item.replace("''", "'"),  # lucky_item -> lucky_time
            "daily_advice": advice.replace("''", "'"),
        })
    return rows


def parse_q3_daily(filepath):
    """Q3: multi-row VALUES. No overall_score."""
    sql = open(filepath, 'r', encoding='utf-8').read()
    rows = []

    # Remove comments and CREATE TABLE
    lines = []
    skip = False
    for line in sql.split('\n'):
        stripped = line.strip()
        if stripped.startswith('--'):
            continue
        if 'CREATE TABLE' in stripped:
            skip = True
            continue
        if skip and stripped == ');':
            skip = False
            continue
        if not skip:
            lines.append(line)

    clean = '\n'.join(lines)

    # Find individual value tuples
    pattern = r"\(\s*'(\d{4}-\d{2}-\d{2})'\s*,\s*'(\w+)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*?)'\s*,\s*(\d+)\s*,\s*'((?:[^']|'')*?)'\s*,\s*'((?:[^']|'')*?)'\s*\)"

    matches = re.findall(pattern, clean, re.DOTALL)
    for m in matches:
        date, sign, overall, love, money, work, health, love_score, money_score, work_score, health_score, color, number, item, advice = m
        zid, zname = ZODIAC_MAP.get(sign.lower(), (0, sign))
        rows.append({
            "date": date, "zodiac_id": zid, "zodiac_name": zname,
            "overall_fortune": overall.replace("''", "'"),
            "love_fortune": love.replace("''", "'"),
            "money_fortune": money.replace("''", "'"),
            "work_fortune": work.replace("''", "'"),
            "health_fortune": health.replace("''", "'"),
            "love_score": int(love_score), "money_score": int(money_score),
            "work_score": int(work_score), "health_score": int(health_score),
            "lucky_color": color.replace("''", "'"),
            "lucky_number": int(number),
            "lucky_time": item.replace("''", "'"),
            "daily_advice": advice.replace("''", "'"),
        })
    return rows


def insert_batch(table, rows, batch_size=50):
    """REST API로 배치 INSERT"""
    ok = 0
    fail = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        r = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", json=batch, headers=H, timeout=60)
        if r.status_code in (200, 201):
            ok += len(batch)
        else:
            # Try one by one
            for row in batch:
                r2 = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", json=row, headers=H, timeout=30)
                if r2.status_code in (200, 201):
                    ok += 1
                else:
                    fail += 1
    return ok, fail


if __name__ == "__main__":
    print("=== Q2 Daily Fortune 변환 + 임포트 ===")
    q2_rows = parse_q2_daily(os.path.join(SQL_DIR, "Q2_2025_Fortune_Records.sql"))
    print(f"파싱: {len(q2_rows)}행")
    if q2_rows:
        ok, fail = insert_batch("daily_fortunes", q2_rows)
        print(f"결과: {ok} OK, {fail} fail")

    print("\n=== Q3 Daily Fortune 변환 + 임포트 ===")
    q3_rows = parse_q3_daily(os.path.join(SQL_DIR, "daily_fortunes_q3_2025.sql"))
    print(f"파싱: {len(q3_rows)}행")
    if q3_rows:
        ok, fail = insert_batch("daily_fortunes", q3_rows)
        print(f"결과: {ok} OK, {fail} fail")

    # Final count
    print("\n=== 최종 확인 ===")
    r = requests.get(f"{SUPABASE_URL}/rest/v1/daily_fortunes?select=date&order=date.asc&limit=1", headers=H)
    first = r.json()[0]['date'] if r.json() else '?'
    r = requests.get(f"{SUPABASE_URL}/rest/v1/daily_fortunes?select=date&order=date.desc&limit=1", headers=H)
    last = r.json()[0]['date'] if r.json() else '?'
    r = requests.get(f"{SUPABASE_URL}/rest/v1/daily_fortunes?select=id", headers=H)
    total = len(r.json())
    print(f"Daily fortunes: {total}행 ({first} ~ {last})")
