import sqlite3
import json

# Connect to database
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Get one sample advice
cursor.execute("""
    SELECT advice FROM daily_fortunes 
    WHERE date = '2025-09-08' AND zodiac_id = 1
""")

result = cursor.fetchone()
if result:
    advice = result[0]
    print(f"Raw advice from DB: {advice}")
    print(f"Advice type: {type(advice)}")
    
    # Try different encodings
    if isinstance(advice, bytes):
        print("It's bytes, trying to decode:")
        try:
            print(f"UTF-8: {advice.decode('utf-8')}")
        except:
            print("UTF-8 decode failed")
        try:
            print(f"CP949: {advice.decode('cp949')}")
        except:
            print("CP949 decode failed")
    else:
        print(f"It's string: {advice}")
        # Check if properly encoded
        print(f"Encoded to UTF-8: {advice.encode('utf-8')}")

conn.close()