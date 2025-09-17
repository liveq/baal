import sqlite3
import re

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 운세 데이터 문법 검사 ===\n")

# 문법 오류 패턴 정의
error_patterns = [
    (r'으로가\s', '으로 가'),
    (r'로가\s', '로 가'),
    (r'에가\s', '에 가'),
    (r'를를\s', '를 '),
    (r'을을\s', '을 '),
    (r'이이\s', '이 '),
    (r'의의\s', '의 '),
    (r'와와\s', '와 '),
    (r'과과\s', '과 '),
    (r'하시시', '하시'),
    (r'습니니다', '습니다'),
    (r'세요요', '세요'),
    (r'처럼럼', '처럼'),
    (r'되세요', '되세요'),  # 이건 맞는 표현
    (r'하세요', '하세요'),  # 이것도 맞는 표현
]

# 어색한 표현 패턴
awkward_patterns = [
    (r'의\s+의', '의'),  # "~의 의~" -> "~의~"
    (r'을\s+를', '를'),  # 중복 목적격
    (r'이\s+가', '가'),  # 중복 주격
    (r'에서\s+에', '에'),  # 중복 처소격
    (r'으로서\s+으로', '으로'),  # 중복
]

# 1. 일일 운세 검사
print("1. 일일 운세 검사 (4,380개)")
cursor.execute("""
    SELECT id, overall, love_fortune, money_fortune, work_fortune, health_fortune, advice
    FROM daily_fortunes_data
""")

daily_errors = []
for row in cursor.fetchall():
    id_ = row[0]
    texts = row[1:]
    
    for text_idx, text in enumerate(texts):
        if text:
            for pattern, replacement in error_patterns + awkward_patterns:
                if re.search(pattern, text):
                    daily_errors.append((id_, text_idx, text, pattern, replacement))

print(f"발견된 오류: {len(daily_errors)}개")
if daily_errors[:5]:
    print("샘플:")
    for err in daily_errors[:5]:
        print(f"  ID {err[0]}: {err[2][:50]}...")
        print(f"    패턴: {err[3]} -> {err[4]}")

# 2. 주간 운세 검사
print("\n2. 주간 운세 검사 (624개)")
cursor.execute("""
    SELECT id, theme, overall, love_fortune, money_fortune, work_fortune, health_fortune
    FROM weekly_fortunes_data
""")

weekly_errors = []
for row in cursor.fetchall():
    id_ = row[0]
    texts = row[1:]
    
    for text_idx, text in enumerate(texts):
        if text:
            for pattern, replacement in error_patterns + awkward_patterns:
                if re.search(pattern, text):
                    weekly_errors.append((id_, text_idx, text, pattern, replacement))

print(f"발견된 오류: {len(weekly_errors)}개")

# 3. 월간 운세 검사
print("\n3. 월간 운세 검사 (144개)")
cursor.execute("""
    SELECT id, theme, overall, love_fortune, money_fortune, work_fortune, health_fortune
    FROM monthly_fortunes_data
""")

monthly_errors = []
for row in cursor.fetchall():
    id_ = row[0]
    texts = row[1:]
    
    for text_idx, text in enumerate(texts):
        if text:
            for pattern, replacement in error_patterns + awkward_patterns:
                if re.search(pattern, text):
                    monthly_errors.append((id_, text_idx, text, pattern, replacement))

print(f"발견된 오류: {len(monthly_errors)}개")

# 4. 궁합 운세 검사
print("\n4. 궁합 운세 검사 (78개)")
cursor.execute("""
    SELECT id, advice
    FROM compatibility_fortunes_data
""")

compat_errors = []
for row in cursor.fetchall():
    id_ = row[0]
    text = row[1]
    
    if text:
        for pattern, replacement in error_patterns + awkward_patterns:
            if re.search(pattern, text):
                compat_errors.append((id_, text, pattern, replacement))

print(f"발견된 오류: {len(compat_errors)}개")

# 총 오류 수
total_errors = len(daily_errors) + len(weekly_errors) + len(monthly_errors) + len(compat_errors)
print(f"\n=== 총 발견된 문법 오류: {total_errors}개 ===")

conn.close()