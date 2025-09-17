import sqlite3
import json

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 데이터 타입 확인 ===\n")

# 1. 주간 운세 keyDays 확인
print("1. 주간 운세 key_days 샘플:")
cursor.execute("""
    SELECT zodiac_id, week_number, key_days
    FROM weekly_fortunes_data
    LIMIT 3
""")
for row in cursor.fetchall():
    print(f"  별자리 {row[0]}, 주차 {row[1]}: {row[2]} (타입: {type(row[2]).__name__})")

# 2. 월간 운세 keyDates 확인
print("\n2. 월간 운세 key_dates 샘플:")
cursor.execute("""
    SELECT zodiac_id, month, key_dates
    FROM monthly_fortunes_data
    LIMIT 3
""")
for row in cursor.fetchall():
    print(f"  별자리 {row[0]}, {row[1]}월: {row[2]} (타입: {type(row[2]).__name__})")

# 3. JSON 파일 확인
print("\n3. JSON 파일 확인:")
with open('../api/fortune-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    
    # 주간 데이터 확인
    if 'weekly' in data and data['weekly']:
        first_week = list(data['weekly'].keys())[0]
        first_zodiac = list(data['weekly'][first_week].keys())[0]
        keyDays = data['weekly'][first_week][first_zodiac].get('keyDays', 'N/A')
        print(f"  주간 keyDays: {keyDays} (타입: {type(keyDays).__name__})")
    
    # 월간 데이터 확인
    if 'monthly' in data and data['monthly']:
        first_month = list(data['monthly'].keys())[0]
        first_zodiac = list(data['monthly'][first_month].keys())[0]
        keyDates = data['monthly'][first_month][first_zodiac].get('keyDates', 'N/A')
        print(f"  월간 keyDates: {keyDates} (타입: {type(keyDates).__name__})")

conn.close()