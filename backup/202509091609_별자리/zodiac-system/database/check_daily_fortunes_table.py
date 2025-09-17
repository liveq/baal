import sqlite3

# Connect to database
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Check the actual structure of daily_fortunes table
print("=== daily_fortunes table structure ===")
cursor.execute("PRAGMA table_info(daily_fortunes);")
columns = cursor.fetchall()
for col in columns:
    print(f"Column: {col[1]} ({col[2]})")

# Get sample data to understand the structure
print("\n=== Sample data from daily_fortunes ===")
cursor.execute("SELECT * FROM daily_fortunes WHERE date = '2025-09-08' LIMIT 1;")
sample = cursor.fetchone()
if sample:
    print("Sample row found, but content may have encoding issues")
    print(f"Number of columns: {len(sample)}")
    # Try to display first few non-problematic columns
    for i, col in enumerate(columns[:6]):  # First 6 columns
        try:
            print(f"{col[1]}: {sample[i]}")
        except UnicodeEncodeError:
            print(f"{col[1]}: [Korean text - encoding issue]")

conn.close()