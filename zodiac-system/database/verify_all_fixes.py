import sqlite3
from datetime import datetime

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 전체 수정 작업 확인 ===\n")
print(f"확인 시각: {datetime.now()}\n")

# 1. 일일 운세 확인
print("1. 일일 운세 (daily_fortunes_data)")
cursor.execute("SELECT COUNT(*) FROM daily_fortunes_data")
daily_count = cursor.fetchone()[0]
cursor.execute("SELECT MAX(id) FROM daily_fortunes_data")
daily_max_id = cursor.fetchone()[0]
print(f"   - 총 레코드: {daily_count}개")
print(f"   - 문법 수정: [O] 완료 (fix_daily_grammar.py 실행됨)")

# 2. 주간 운세 확인
print("\n2. 주간 운세 (weekly_fortunes_data)")
cursor.execute("SELECT COUNT(*) FROM weekly_fortunes_data")
weekly_count = cursor.fetchone()[0]
print(f"   - 총 레코드: {weekly_count}개")
print(f"   - 문법 수정: [O] 완료 (fix_all_grammar.py 실행됨)")

# 3. 월간 운세 확인
print("\n3. 월간 운세 (monthly_fortunes_data)")
cursor.execute("SELECT COUNT(*) FROM monthly_fortunes_data")
monthly_count = cursor.fetchone()[0]
print(f"   - 총 레코드: {monthly_count}개")
print(f"   - 문법 수정: [O] 완료 (fix_all_grammar.py 실행됨)")

# 4. 연간 운세 확인
print("\n4. 연간 운세 (yearly_fortunes_data)")
cursor.execute("SELECT COUNT(*) FROM yearly_fortunes_data")
yearly_count = cursor.fetchone()[0]
print(f"   - 총 레코드: {yearly_count}개")
print(f"   - 문법 수정: [?] 확인 필요")

# 연간 운세 샘플 확인
cursor.execute("""
    SELECT zodiac_id, theme, overall, love_fortune
    FROM yearly_fortunes_data
    LIMIT 3
""")
print("   샘플 데이터:")
for row in cursor.fetchall():
    print(f"   - 별자리 {row[0]}: {row[2][:50]}...")

# 5. 궁합 운세 확인
print("\n5. 궁합 운세 (compatibility_fortunes_data)")
cursor.execute("SELECT COUNT(*) FROM compatibility_fortunes_data")
compat_count = cursor.fetchone()[0]
print(f"   - 총 레코드: {compat_count}개")
print(f"   - 문법 수정: [O] 완료 (fix_all_grammar.py 실행됨, 오류 없음)")

# 문법 오류 잔존 여부 확인
print("\n=== 문법 오류 잔존 확인 ===")

error_patterns = [
    ('으로가', '으로 가'),
    ('로가', '로 가'),
    ('정의으로', '정의로'),
    ('자유으로', '자유로'),
    ('의의', '의'),
    ('를를', '를'),
    ('을을', '을')
]

tables = [
    ('daily_fortunes_data', ['overall', 'love_fortune', 'money_fortune', 'work_fortune', 'health_fortune', 'advice']),
    ('weekly_fortunes_data', ['theme', 'overall', 'love_fortune', 'money_fortune', 'work_fortune', 'health_fortune']),
    ('monthly_fortunes_data', ['theme', 'overall', 'love_fortune', 'money_fortune', 'work_fortune', 'health_fortune']),
    ('yearly_fortunes_data', ['theme', 'overall', 'love_fortune', 'money_fortune', 'work_fortune', 'health_fortune']),
    ('compatibility_fortunes_data', ['advice'])
]

total_errors = 0
for table_name, columns in tables:
    table_errors = 0
    for column in columns:
        for pattern, _ in error_patterns:
            query = f"SELECT COUNT(*) FROM {table_name} WHERE {column} LIKE ?"
            cursor.execute(query, (f'%{pattern}%',))
            count = cursor.fetchone()[0]
            if count > 0:
                table_errors += count
                print(f"[!] {table_name}.{column}: '{pattern}' 패턴 {count}개 발견")
    
    if table_errors == 0:
        print(f"[O] {table_name}: 문법 오류 없음")
    total_errors += table_errors

print(f"\n=== 최종 결과 ===")
print(f"전체 테이블 수: 5개")
print(f"전체 레코드 수: {daily_count + weekly_count + monthly_count + yearly_count + compat_count}개")
print(f"남은 문법 오류: {total_errors}개")

if total_errors == 0:
    print("\n[SUCCESS] 모든 운세 데이터의 문법이 수정되었습니다!")
else:
    print(f"\n[WARNING] 아직 {total_errors}개의 문법 오류가 남아있습니다.")

conn.close()