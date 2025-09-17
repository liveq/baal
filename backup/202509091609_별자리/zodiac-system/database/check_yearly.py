import sqlite3
import json

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 연간 운세 데이터 타입 확인 ===\n")

# DB에서 확인
cursor.execute("""
    SELECT zodiac_id, best_months, challenging_months
    FROM yearly_fortunes_data
    LIMIT 3
""")
for row in cursor.fetchall():
    print(f"별자리 {row[0]}:")
    print(f"  best_months: {row[1]} (타입: {type(row[1]).__name__})")
    print(f"  challenging_months: {row[2]} (타입: {type(row[2]).__name__})")

# JSON에서 확인
print("\nJSON 파일 확인:")
with open('../api/fortune-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    
    if 'yearly' in data and data['yearly']:
        for zodiac_id in ['1', '2']:
            if zodiac_id in data['yearly']:
                yearly = data['yearly'][zodiac_id]
                print(f"\n별자리 {zodiac_id}:")
                print(f"  bestMonths: {yearly.get('bestMonths')} (타입: {type(yearly.get('bestMonths')).__name__})")
                print(f"  challengingMonths: {yearly.get('challengingMonths')} (타입: {type(yearly.get('challengingMonths')).__name__})")

conn.close()