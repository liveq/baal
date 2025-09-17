import sqlite3

# Connect to database
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Get all table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Available tables:")
for table in tables:
    print(f"- {table[0]}")

# Get schema for each table
for table in tables:
    table_name = table[0]
    print(f"\n=== {table_name} ===")
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    for col in columns:
        print(f"Column: {col[1]} ({col[2]})")
    
    # Get a sample row
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 1;")
    sample = cursor.fetchone()
    if sample:
        print(f"Sample row: {sample}")

conn.close()