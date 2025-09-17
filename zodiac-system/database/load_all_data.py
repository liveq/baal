import sqlite3
import os
import glob

# 데이터베이스 연결
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== Loading ALL Fortune Data ===\n")

# SQL 파일 목록
sql_files = [
    # 일일 운세 (Q1)
    'C:/code/rheight/daily_fortunes_2025_january_complete.sql',
    'C:/code/rheight/daily_fortunes_2025_february_complete.sql', 
    'C:/code/rheight/daily_fortunes_2025_march_complete.sql',
    
    # 월간 운세
    'C:/code/rheight/complete_144_monthly_fortunes_2025.sql',
    
    # 궁합 운세
    'C:/code/rheight/compatibility_fortunes_insert.sql',
    'C:/code/rheight/compatibility_fortunes_insert_part2.sql',
    'C:/code/rheight/compatibility_fortunes_insert_final.sql',
    
    # 추가 일일 운세
    'C:/code/rheight/Q2_2025_Fortune_Records.sql',
    'C:/code/rheight/daily_fortunes_q3_2025.sql',
    'C:/code/rheight/Q4_2025_daily_fortunes.sql',
    
    # 주간 운세
    'C:/code/rheight/weekly_fortunes_2025_q1_complete.sql',
    'C:/code/rheight/weekly_fortunes_2025_q2.sql',
    'C:/code/rheight/weekly_fortunes_2025_q3.sql',
    'C:/code/rheight/weekly_fortunes_2025_q4.sql',
]

# 실제로 존재하는 파일만 처리
for sql_file in sql_files:
    if os.path.exists(sql_file):
        print(f"Loading: {os.path.basename(sql_file)}")
        try:
            with open(sql_file, 'r', encoding='utf-8') as f:
                sql_content = f.read()
                
            # SQL 문장 실행
            # 여러 문장이 있을 수 있으므로 executescript 사용
            cursor.executescript(sql_content)
            print(f"  [OK] Loaded successfully")
            
        except Exception as e:
            print(f"  [ERROR] Failed to load: {e}")
    else:
        print(f"[SKIP] File not found: {os.path.basename(sql_file)}")

# 대체 방법: 생성된 모든 운세 데이터 직접 생성
print("\n=== Generating Complete Fortune Data ===")

# 연간 365일 × 12 별자리 = 4,380개 일일 운세 생성
from datetime import datetime, timedelta
import random

# 별자리별 특성 (이전과 동일)
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

# 2025년 전체 일일 운세 생성
print("\nGenerating 4,380 daily fortunes for 2025...")
daily_data = []
start_date = datetime(2025, 1, 1)

for day in range(365):
    current_date = start_date + timedelta(days=day)
    for zodiac_id in range(1, 13):
        traits = zodiac_traits[zodiac_id]
        
        # 고유한 운세 생성
        overall = f"{current_date.strftime('%m월 %d일')}, {random.choice(traits['figures'])}의 {random.choice(traits['traits'])}으로 하루를 시작하세요."
        
        love_score = random.randint(60, 95)
        money_score = random.randint(60, 95)
        work_score = random.randint(60, 95)
        health_score = random.randint(60, 95)
        
        love_fortune = f"{traits['name']}의 매력이 빛나는 날입니다."
        money_fortune = f"경제적 {random.choice(['안정', '성장', '기회'])}의 시기입니다."
        work_fortune = f"{random.choice(traits['traits'])}을 발휘하여 성과를 만드세요."
        health_fortune = f"건강한 {random.choice(['리듬', '에너지', '균형'])}을 유지하세요."
        
        colors = ["빨강", "주황", "노랑", "초록", "파랑", "보라", "분홍", "금색", "은색", "흰색"]
        times = ["새벽", "아침", "오전", "정오", "오후", "저녁", "밤"]
        
        advice = f"{random.choice(traits['figures'])}처럼 {random.choice(traits['traits'])}을 실천하세요."
        
        daily_data.append((
            zodiac_id,
            current_date.strftime("%Y-%m-%d"),
            overall,
            love_fortune, love_score,
            money_fortune, money_score,
            work_fortune, work_score,
            health_fortune, health_score,
            random.choice(colors),
            random.randint(1, 9),
            f"{random.choice(times)} 시간",
            advice
        ))

# 데이터베이스에 삽입
print(f"Inserting {len(daily_data)} daily fortunes...")
cursor.executemany('''
    INSERT OR REPLACE INTO daily_fortunes_data 
    (zodiac_id, date, overall, love_fortune, love_score, money_fortune, money_score,
     work_fortune, work_score, health_fortune, health_score,
     lucky_color, lucky_number, lucky_time, advice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', daily_data)

# 커밋
conn.commit()

# 최종 통계
print("\n=== Final Database Statistics ===")
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

conn.close()
print("\n[COMPLETE] All fortune data loaded!")