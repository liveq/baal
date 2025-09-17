import sqlite3

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Get table schema
cursor.execute("PRAGMA table_info(daily_fortunes)")
columns = cursor.fetchall()

print("Daily fortunes table columns:")
for col in columns:
    print(f"  {col[1]} ({col[2]})")

# Get one sample record
cursor.execute("SELECT * FROM daily_fortunes WHERE date = '2025-09-08' AND zodiac_id = 1 LIMIT 1")
record = cursor.fetchone()

if record:
    print(f"\nSample record has {len(record)} fields")
    print("Record:", record[:5], "...")  # First 5 fields
    
conn.close()