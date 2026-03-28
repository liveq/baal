import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import requests, os, re
from dotenv import load_dotenv
load_dotenv()

URL = os.getenv("SUPABASE_MGMT_URL", "")
TOKEN = os.getenv("SUPABASE_MGMT_TOKEN", "")
H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

sql_dir = "C:/aicode/agent_workspace/024_ai_baal/reference/sql"

files = [
    "weekly_fortunes_2025_q1.sql",
    "weekly_fortunes_2025_q2.sql",
    "weekly_fortunes_2025_q3.sql",
    "weekly_fortunes_2025_q4.sql",
    "monthly_fortunes_2025_full.sql",
    "complete_144_monthly_fortunes_2025.sql",
    "compatibility_fortunes_insert_final.sql",
    "daily_fortunes_2025_january_complete.sql",
    "daily_fortunes_2025_february_complete.sql",
    "daily_fortunes_2025_march_complete.sql",
    "daily_fortunes_q3_2025.sql",
]

for fname in files:
    fpath = os.path.join(sql_dir, fname)
    if not os.path.exists(fpath):
        print(f"SKIP: {fname}")
        continue

    sql = open(fpath, 'r', encoding='utf-8').read()

    # Extract only INSERT statements (including multi-line VALUES)
    # Find INSERT INTO ... VALUES (...); patterns
    inserts = re.findall(r'(INSERT\s+INTO\s+\w+\s*\([^)]+\)\s*VALUES\s*(?:\([^;]*?\)\s*[,;]?\s*)+)', sql, re.DOTALL | re.IGNORECASE)

    if not inserts:
        # Try sending entire file as one query (skip comments)
        lines = [l for l in sql.split('\n') if not l.strip().startswith('--')]
        clean = '\n'.join(lines).strip()
        if clean:
            r = requests.post(URL, json={"query": clean}, headers=H, timeout=60)
            if r.status_code == 200:
                print(f"{fname}: OK (full)")
            else:
                msg = r.json().get('message', '')[:100]
                print(f"{fname}: FAIL - {msg}")
        continue

    ok = 0
    err = 0
    for stmt in inserts:
        stmt = stmt.strip().rstrip(',').rstrip(';') + ';'
        try:
            r = requests.post(URL, json={"query": stmt}, headers=H, timeout=60)
            if r.status_code == 200:
                ok += 1
            else:
                err += 1
        except:
            err += 1

    print(f"{fname}: {ok} OK, {err} errors ({len(inserts)} inserts found)")

print("\nDone!")
