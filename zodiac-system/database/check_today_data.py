import sqlite3
import sys
import io

# Set UTF-8 output encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Connect to database
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Check if today's data (2025-09-08) exists
today_date = '2025-09-08'

print(f"=== Checking data for {today_date} ===")

# Check daily_fortunes table
cursor.execute("SELECT COUNT(*) FROM daily_fortunes WHERE date = ?", (today_date,))
daily_count = cursor.fetchone()[0]
print(f"Daily fortunes for {today_date}: {daily_count} records")

if daily_count > 0:
    cursor.execute("""
        SELECT zodiac_id, overall_fortune, love_fortune, work_fortune, health_fortune, advice 
        FROM daily_fortunes 
        WHERE date = ? AND zodiac_id = 1 
        LIMIT 1
    """, (today_date,))
    
    sample = cursor.fetchone()
    if sample:
        print(f"Sample daily fortune for zodiac_id=1:")
        print(f"- Overall: {sample[1]}")
        print(f"- Love: {sample[2]}")
        print(f"- Work: {sample[3]}")
        print(f"- Health: {sample[4]}")
        print(f"- Advice: {sample[5]}")

# Check if daily_fortunes_data table exists (alternative)
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='daily_fortunes_data';")
alt_table = cursor.fetchone()
if alt_table:
    cursor.execute("SELECT COUNT(*) FROM daily_fortunes_data WHERE date = ?", (today_date,))
    alt_count = cursor.fetchone()[0]
    print(f"Daily fortunes_data for {today_date}: {alt_count} records")

# List all tables for reference
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f"\nAll tables: {[t[0] for t in tables]}")

conn.close()