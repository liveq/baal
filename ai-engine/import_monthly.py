import re
import json
import requests

SQL_FILE = r"L:\code\baal\complete_144_monthly_fortunes_2025.sql"
SUPABASE_URL = "https://pfgfxvgbnkrbvyzdaeel.supabase.co/rest/v1/monthly_fortunes_data"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZ2Z4dmdibmtyYnZ5emRhZWVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTEzMywiZXhwIjoyMDg5Njk1MTMzfQ.XrWoQs07kFxXdDEKODu0fzipIIRFfMX7hAwfx9dKnVc"

HEADERS = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

COLUMNS = [
    "zodiac_id", "year", "month", "month_name", "overall_fortune", "overall_score",
    "love_fortune", "love_score", "money_fortune", "money_score",
    "work_fortune", "work_score", "health_fortune", "health_score",
    "monthly_theme", "key_dates", "lucky_colors", "lucky_numbers", "lucky_times",
    "lucky_stones", "lucky_directions", "monthly_mantra",
    "personal_growth_focus", "relationship_outlook", "financial_forecast",
    "health_recommendations", "spiritual_guidance",
]

def parse_sql_value(token):
    """Parse a single SQL value token into a Python value."""
    token = token.strip()
    if token.startswith("'") and token.endswith("'"):
        # String value - unescape single quotes
        return token[1:-1].replace("''", "'")
    elif token.startswith("'[") or token.startswith("'\""):
        return token[1:-1]
    else:
        # Numeric
        try:
            if '.' in token:
                return float(token)
            return int(token)
        except ValueError:
            return token

def extract_records(sql_text):
    """Extract tuples from SQL INSERT VALUES, handling quoted strings with commas."""
    # Find all top-level parenthesized value tuples in the first INSERT statement
    # Remove comments
    lines = sql_text.split('\n')
    cleaned_lines = []
    for line in lines:
        # Remove single-line comments but preserve strings
        # Simple approach: strip -- comments only if not inside a string
        stripped = line.strip()
        if stripped.startswith('--'):
            continue
        cleaned_lines.append(line)
    cleaned = '\n'.join(cleaned_lines)

    # Find the VALUES keyword from the monthly_fortunes_data INSERT
    values_match = re.search(r'VALUES\s*\n', cleaned, re.IGNORECASE)
    if not values_match:
        print("Could not find VALUES keyword")
        return []

    after_values = cleaned[values_match.end():]

    # Now find each record tuple: starts with '(' and ends with '),'  or ');'
    records = []
    i = 0
    while i < len(after_values):
        if after_values[i] == '(':
            # Find matching closing paren, respecting string literals
            depth = 0
            in_string = False
            j = i
            while j < len(after_values):
                ch = after_values[j]
                if in_string:
                    if ch == "'" and j + 1 < len(after_values) and after_values[j+1] == "'":
                        j += 2  # escaped quote
                        continue
                    elif ch == "'":
                        in_string = False
                else:
                    if ch == "'":
                        in_string = True
                    elif ch == '(':
                        depth += 1
                    elif ch == ')':
                        depth -= 1
                        if depth == 0:
                            record_str = after_values[i+1:j]  # content inside parens
                            records.append(record_str)
                            break
                j += 1
            i = j + 1
        else:
            # Check if we hit another INSERT statement (stop)
            if after_values[i:i+6].upper() == 'INSERT':
                break
            i += 1

    return records

def tokenize_record(record_str):
    """Split a record string into individual value tokens, respecting quoted strings and JSON arrays."""
    tokens = []
    i = 0
    current = ''

    while i < len(record_str):
        ch = record_str[i]
        if ch == "'":
            # Start of string literal
            j = i + 1
            s = "'"
            while j < len(record_str):
                if record_str[j] == "'" and j + 1 < len(record_str) and record_str[j+1] == "'":
                    s += "''"
                    j += 2
                elif record_str[j] == "'":
                    s += "'"
                    j += 1
                    break
                else:
                    s += record_str[j]
                    j += 1
            current += s
            i = j
        elif ch == ',':
            tokens.append(current.strip())
            current = ''
            i += 1
        else:
            current += ch
            i += 1

    if current.strip():
        tokens.append(current.strip())

    return tokens

def parse_json_field(val):
    """Parse a string that looks like a JSON array."""
    if isinstance(val, str) and val.startswith('['):
        try:
            return json.loads(val)
        except json.JSONDecodeError:
            return val
    return val

def main():
    with open(SQL_FILE, 'r', encoding='utf-8') as f:
        sql_text = f.read()

    record_strings = extract_records(sql_text)
    print(f"Found {len(record_strings)} records in SQL file")

    if not record_strings:
        print("No records found. Exiting.")
        return

    all_records = []
    for idx, rec_str in enumerate(record_strings):
        tokens = tokenize_record(rec_str)
        if len(tokens) != len(COLUMNS):
            print(f"Record {idx+1}: Expected {len(COLUMNS)} columns, got {len(tokens)}. Skipping.")
            print(f"  Tokens: {tokens[:5]}...")
            continue

        row = {}
        for col, token in zip(COLUMNS, tokens):
            val = parse_sql_value(token)
            # JSON array fields
            if col in ("key_dates", "lucky_colors", "lucky_numbers", "lucky_times",
                        "lucky_stones", "lucky_directions"):
                val = parse_json_field(val)
            row[col] = val

        all_records.append(row)
        print(f"Record {idx+1}: zodiac_id={row['zodiac_id']}, month={row['month']}, theme={row.get('monthly_theme','')[:40]}")

    if not all_records:
        print("No valid records to insert.")
        return

    # Insert all records in a single batch POST
    print(f"\nInserting {len(all_records)} records to Supabase...")
    resp = requests.post(SUPABASE_URL, headers=HEADERS, json=all_records)
    print(f"Status: {resp.status_code}")
    if resp.status_code in (200, 201):
        print("SUCCESS: All records inserted.")
    else:
        print(f"Response: {resp.text}")
        # Try one by one if batch fails
        if resp.status_code == 409:
            print("\nConflict detected. Trying upsert with Prefer: resolution=merge-duplicates...")
            upsert_headers = {**HEADERS, "Prefer": "return=minimal,resolution=merge-duplicates"}
            resp2 = requests.post(SUPABASE_URL, headers=upsert_headers, json=all_records)
            print(f"Upsert Status: {resp2.status_code}")
            if resp2.status_code in (200, 201):
                print("SUCCESS: All records upserted.")
            else:
                print(f"Upsert Response: {resp2.text}")

if __name__ == "__main__":
    main()
