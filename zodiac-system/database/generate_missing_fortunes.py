import sqlite3
import random
from datetime import datetime, timedelta

# Connect to database
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Zodiac traits with historical figures
zodiac_traits = {
    1: {"name": "양자리", "figures": ["다빈치", "나폴레옹", "반 고흐"], "traits": ["개척정신", "열정", "도전"]},
    2: {"name": "황소자리", "figures": ["셰익스피어", "클레오파트라", "석가모니"], "traits": ["인내", "예술성", "안정"]},
    3: {"name": "쌍둥이자리", "figures": ["케네디", "마릴린 먼로", "알렉산더"], "traits": ["소통", "다재다능", "호기심"]},
    4: {"name": "게자리", "figures": ["넬슨 만델라", "헬렌 켈러", "다이애나"], "traits": ["감성", "보호본능", "가족애"]},
    5: {"name": "사자자리", "figures": ["나폴레옹", "코코 샤넬", "마돈나"], "traits": ["자신감", "리더십", "창조성"]},
    6: {"name": "처녀자리", "figures": ["아우구스투스", "마더 테레사", "워런 버핏"], "traits": ["완벽주의", "분석력", "봉사정신"]},
    7: {"name": "천칭자리", "figures": ["간디", "엘리너 루스벨트", "존 레논"], "traits": ["균형", "조화", "정의"]},
    8: {"name": "전갈자리", "figures": ["마리 퀴리", "피카소", "빌 게이츠"], "traits": ["열정", "신비", "변혁"]},
    9: {"name": "사수자리", "figures": ["처칠", "월트 디즈니", "베토벤"], "traits": ["자유", "철학", "모험"]},
    10: {"name": "염소자리", "figures": ["마틴 루터 킹", "스티브 잡스", "뉴턴"], "traits": ["야망", "인내", "책임감"]},
    11: {"name": "물병자리", "figures": ["링컨", "에디슨", "갈릴레이"], "traits": ["독창성", "진보", "인도주의"]},
    12: {"name": "물고기자리", "figures": ["미켈란젤로", "아인슈타인", "쇼팽"], "traits": ["상상력", "감수성", "예술성"]}
}

print("=== Generating Missing Fortune Data ===")

# 1. Generate Weekly Fortunes (52 weeks × 12 zodiac = 624)
print("\nGenerating 624 weekly fortunes...")
weekly_data = []
start_date = datetime(2025, 1, 1)

# Find first Monday of 2025
while start_date.weekday() != 0:  # 0 = Monday
    start_date += timedelta(days=1)

for week in range(52):
    week_start = start_date + timedelta(weeks=week)
    week_end = week_start + timedelta(days=6)
    week_num = week + 1
    
    for zodiac_id in range(1, 13):
        traits = zodiac_traits[zodiac_id]
        
        theme = f"제{week_num}주: {random.choice(traits['figures'])}의 {random.choice(traits['traits'])}"
        overall = f"이번 주는 {random.choice(traits['figures'])}처럼 {random.choice(traits['traits'])}을 발휘할 시기입니다."
        
        love = f"{traits['name']}의 매력이 주간 내내 빛납니다."
        money = f"경제적 {random.choice(['안정', '성장', '기회'])}의 한 주가 될 것입니다."
        work = f"{random.choice(traits['traits'])}으로 업무 성과를 만들어가세요."
        health = f"건강한 {random.choice(['리듬', '에너지', '균형'])}을 유지하는 한 주가 되세요."
        
        key_days = f"{random.choice(['월', '수', '금'])}요일"
        
        weekly_data.append((
            zodiac_id,
            week_num,
            week_start.strftime("%Y-%m-%d"),
            week_end.strftime("%Y-%m-%d"),
            theme,
            overall,
            love, money, work, health,
            key_days
        ))

# Insert weekly fortunes (with year field added)
weekly_data_with_year = []
for data in weekly_data:
    # Add year field (2025) after week_number
    new_data = list(data[:2]) + [2025] + list(data[2:])
    weekly_data_with_year.append(new_data)

cursor.executemany('''
    INSERT OR REPLACE INTO weekly_fortunes_data 
    (zodiac_id, week_number, year, week_start, week_end, theme, overall,
     love_fortune, money_fortune, work_fortune, health_fortune, key_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', weekly_data_with_year)
print(f"Inserted {len(weekly_data)} weekly fortunes")

# 2. Generate Monthly Fortunes (12 months × 12 zodiac = 144)
print("\nGenerating 144 monthly fortunes...")
monthly_data = []
months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

for month_num in range(1, 13):
    for zodiac_id in range(1, 13):
        traits = zodiac_traits[zodiac_id]
        
        theme = f"{months[month_num-1]}: {random.choice(traits['figures'])}의 달"
        overall = f"{months[month_num-1]}은 {random.choice(traits['figures'])}의 {random.choice(traits['traits'])}이 빛나는 달입니다."
        
        love = f"{traits['name']}의 사랑이 {months[month_num-1]}을 가득 채웁니다."
        money = f"{months[month_num-1]} 재정운은 {random.choice(['상승', '안정', '도약'])} 국면입니다."
        work = f"{random.choice(traits['traits'])}으로 {months[month_num-1]} 성과를 이루세요."
        health = f"{months[month_num-1]}은 건강 {random.choice(['관리', '증진', '회복'])}의 시기입니다."
        
        key_dates = f"{random.randint(5, 10)}일, {random.randint(15, 20)}일, {random.randint(25, 28)}일"
        
        monthly_data.append((
            zodiac_id,
            2025,
            month_num,
            months[month_num-1],
            theme,
            overall,
            love, money, work, health,
            key_dates
        ))

# Insert monthly fortunes (remove month_name, use theme and overall instead)
monthly_data_fixed = []
for data in monthly_data:
    # Remove month_name (index 3), keep rest
    fixed_data = data[:3] + data[4:]  # Skip month_name
    monthly_data_fixed.append(fixed_data)

cursor.executemany('''
    INSERT OR REPLACE INTO monthly_fortunes_data 
    (zodiac_id, year, month, theme, overall,
     love_fortune, money_fortune, work_fortune, health_fortune, key_dates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', monthly_data_fixed)
print(f"Inserted {len(monthly_data)} monthly fortunes")

# 3. Generate Compatibility Fortunes (66 unique pairs)
print("\nGenerating 66 compatibility fortunes...")
compat_data = []

for zodiac1 in range(1, 13):
    for zodiac2 in range(zodiac1, 13):  # Avoid duplicates
        traits1 = zodiac_traits[zodiac1]
        traits2 = zodiac_traits[zodiac2]
        
        # Calculate compatibility scores
        if zodiac1 == zodiac2:
            total_score = random.randint(85, 95)  # Same zodiac = high compatibility
        else:
            total_score = random.randint(60, 90)
        
        love_score = random.randint(max(50, total_score-15), min(100, total_score+10))
        friend_score = random.randint(max(50, total_score-10), min(100, total_score+15))
        work_score = random.randint(max(50, total_score-20), min(100, total_score+5))
        
        advice = f"{traits1['name']}과 {traits2['name']}는 {random.choice(['서로를 보완하는', '함께 성장하는', '시너지를 내는'])} 관계입니다."
        
        compat_data.append((
            zodiac1,
            zodiac2,
            total_score,
            love_score,
            friend_score,
            work_score,
            advice
        ))

# Insert compatibility fortunes (use overall_score instead of total_score)
cursor.executemany('''
    INSERT OR REPLACE INTO compatibility_fortunes_data 
    (zodiac1_id, zodiac2_id, overall_score, love_score, friendship_score, work_score, advice)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', compat_data)
print(f"Inserted {len(compat_data)} compatibility fortunes")

# Commit all changes
conn.commit()

# Final statistics
print("\n=== Updated Database Statistics ===")
cursor.execute("SELECT COUNT(*) FROM daily_fortunes_data")
print(f"Daily fortunes: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM weekly_fortunes_data")
print(f"Weekly fortunes: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM monthly_fortunes_data")
print(f"Monthly fortunes: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM yearly_fortunes_data")
print(f"Yearly fortunes: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM compatibility_fortunes_data")
print(f"Compatibility fortunes: {cursor.fetchone()[0]}")

total = cursor.execute("""
    SELECT 
        (SELECT COUNT(*) FROM daily_fortunes_data) +
        (SELECT COUNT(*) FROM weekly_fortunes_data) +
        (SELECT COUNT(*) FROM monthly_fortunes_data) +
        (SELECT COUNT(*) FROM yearly_fortunes_data) +
        (SELECT COUNT(*) FROM compatibility_fortunes_data)
""").fetchone()[0]

print(f"\nTOTAL FORTUNE RECORDS: {total}")
print(f"Target: 5,226 records")
print(f"Achievement: {(total/5226)*100:.1f}%")

conn.close()
print("\n[COMPLETE] All missing fortune data generated!")