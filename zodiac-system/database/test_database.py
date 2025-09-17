import sqlite3
from datetime import datetime
import sys
import io

# UTF-8 인코딩 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 데이터베이스 연결
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 데이터베이스 테스트 ===\n")

# 1. 별자리 목록 조회
print("1. 별자리 목록:")
cursor.execute("SELECT * FROM zodiac_signs")
zodiacs = cursor.fetchall()
for zodiac in zodiacs:
    print(f"   {zodiac[0]}. {zodiac[1]} ({zodiac[2]}) - {zodiac[3]} ~ {zodiac[4]} [{zodiac[5]}] {zodiac[6]}")

# 2. 양자리 2025년 연간 운세 조회
print("\n2. 양자리 2025년 연간 운세:")
cursor.execute("""
    SELECT z.name_ko, y.* 
    FROM yearly_fortunes_data y
    JOIN zodiac_signs z ON y.zodiac_id = z.id
    WHERE y.zodiac_id = 1 AND y.year = 2025
""")
result = cursor.fetchone()
if result:
    print(f"   별자리: {result[0]}")
    print(f"   테마: {result[3]}")
    print(f"   전체운: {result[4][:100]}...")
    print(f"   최고의 달: {result[9]}")
    print(f"   조언: {result[11][:80]}...")

# 3. 2025년 1월 1일 일일 운세 조회
print("\n3. 2025년 1월 1일 일일 운세:")
cursor.execute("""
    SELECT z.name_ko, d.overall, d.love_score, d.money_score, d.work_score, d.health_score,
           d.lucky_color, d.lucky_number, d.lucky_time
    FROM daily_fortunes_data d
    JOIN zodiac_signs z ON d.zodiac_id = z.id
    WHERE d.date = '2025-01-01'
""")
results = cursor.fetchall()
for result in results:
    print(f"\n   [{result[0]}]")
    print(f"   운세: {result[1][:60]}...")
    print(f"   점수: 애정 {result[2]}, 금전 {result[3]}, 직장 {result[4]}, 건강 {result[5]}")
    print(f"   행운: 색상 {result[6]}, 숫자 {result[7]}, 시간 {result[8]}")

# 4. 테이블별 레코드 수 확인
print("\n4. 테이블별 레코드 수:")
tables = ['zodiac_signs', 'yearly_fortunes_data', 'monthly_fortunes_data', 
          'weekly_fortunes_data', 'daily_fortunes_data', 'compatibility_fortunes_data']
for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"   {table}: {count}개")

conn.close()
print("\n테스트 완료!")