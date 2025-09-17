import sqlite3
import re

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 최종 문법 검수 ===\n")

# 문법 오류 패턴 (수정 후에도 남아있을 수 있는 것들)
remaining_patterns = [
    r'으로가\s',
    r'로가\s',
    r'에가\s',
    r'를를\s',
    r'을을\s',
    r'이이\s',
    r'의의\s',
    r'와와\s',
    r'과과\s',
    r'정의으로',
    r'자유으로',
    r'평화으로',
    r'희망으로'
]

total_remaining = 0

# 1. 일일 운세 최종 검사
print("1. 일일 운세 최종 검사")
cursor.execute("""
    SELECT COUNT(*) FROM daily_fortunes_data
""")
daily_count = cursor.fetchone()[0]

cursor.execute("""
    SELECT id, overall, love_fortune, money_fortune, work_fortune, health_fortune, advice
    FROM daily_fortunes_data
    LIMIT 100
""")

daily_errors = 0
for row in cursor.fetchall():
    texts = row[1:]
    for text in texts:
        if text:
            for pattern in remaining_patterns:
                if re.search(pattern, text):
                    daily_errors += 1
                    break

print(f"  - 전체 레코드: {daily_count}개")
print(f"  - 샘플 100개 중 오류: {daily_errors}개")

# 2. 주간 운세 최종 검사
print("\n2. 주간 운세 최종 검사")
cursor.execute("""
    SELECT COUNT(*) FROM weekly_fortunes_data
""")
weekly_count = cursor.fetchone()[0]

cursor.execute("""
    SELECT id, theme, overall, love_fortune, money_fortune, work_fortune, health_fortune
    FROM weekly_fortunes_data
""")

weekly_errors = 0
for row in cursor.fetchall():
    texts = row[1:]
    for text in texts:
        if text:
            for pattern in remaining_patterns:
                if re.search(pattern, text):
                    weekly_errors += 1
                    break

print(f"  - 전체 레코드: {weekly_count}개")
print(f"  - 남은 오류: {weekly_errors}개")

# 3. 월간 운세 최종 검사
print("\n3. 월간 운세 최종 검사")
cursor.execute("""
    SELECT COUNT(*) FROM monthly_fortunes_data
""")
monthly_count = cursor.fetchone()[0]

cursor.execute("""
    SELECT id, theme, overall, love_fortune, money_fortune, work_fortune, health_fortune
    FROM monthly_fortunes_data
""")

monthly_errors = 0
for row in cursor.fetchall():
    texts = row[1:]
    for text in texts:
        if text:
            for pattern in remaining_patterns:
                if re.search(pattern, text):
                    monthly_errors += 1
                    break

print(f"  - 전체 레코드: {monthly_count}개")
print(f"  - 남은 오류: {monthly_errors}개")

# 4. 궁합 운세 최종 검사
print("\n4. 궁합 운세 최종 검사")
cursor.execute("""
    SELECT COUNT(*) FROM compatibility_fortunes_data
""")
compat_count = cursor.fetchone()[0]

cursor.execute("""
    SELECT id, advice FROM compatibility_fortunes_data
""")

compat_errors = 0
for row in cursor.fetchall():
    text = row[1]
    if text:
        for pattern in remaining_patterns:
            if re.search(pattern, text):
                compat_errors += 1
                break

print(f"  - 전체 레코드: {compat_count}개")
print(f"  - 남은 오류: {compat_errors}개")

# 5. 샘플 데이터 출력
print("\n=== 수정된 샘플 데이터 ===")
cursor.execute("""
    SELECT zodiac_id, overall, advice
    FROM daily_fortunes_data
    WHERE date = '2025-01-01'
    ORDER BY zodiac_id
    LIMIT 3
""")

for row in cursor.fetchall():
    zodiac_id, overall, advice = row
    print(f"\n별자리 {zodiac_id}:")
    print(f"  전체: {overall[:60]}...")
    print(f"  조언: {advice[:60]}...")

# 총계
total_remaining = daily_errors + weekly_errors + monthly_errors + compat_errors
print(f"\n=== 최종 검수 결과 ===")
print(f"총 {daily_count + weekly_count + monthly_count + compat_count}개 레코드 중")
print(f"남은 문법 오류: {total_remaining}개")

if total_remaining == 0:
    print("\n[SUCCESS] 모든 문법 오류가 성공적으로 수정되었습니다!")
else:
    print(f"\n[WARNING] 아직 {total_remaining}개의 오류가 남아있습니다.")

conn.close()