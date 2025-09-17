import sqlite3
import json
import os
from datetime import datetime, timedelta

# 데이터베이스 생성
db_path = 'zodiac_fortunes.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 스키마 생성
print("Creating database schema...")

# 별자리 테이블
cursor.execute('''
CREATE TABLE IF NOT EXISTS zodiac_signs (
    id INTEGER PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    element TEXT,
    symbol TEXT
)
''')

# 일일 운세 테이블
cursor.execute('''
CREATE TABLE IF NOT EXISTS daily_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    date DATE NOT NULL,
    overall TEXT NOT NULL,
    love_fortune TEXT,
    money_fortune TEXT,
    work_fortune TEXT,
    health_fortune TEXT,
    love_score INTEGER,
    money_score INTEGER,
    work_score INTEGER,
    health_score INTEGER,
    lucky_color TEXT,
    lucky_number INTEGER,
    lucky_time TEXT,
    advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, date)
)
''')

# 주간 운세 테이블
cursor.execute('''
CREATE TABLE IF NOT EXISTS weekly_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    theme TEXT,
    overall TEXT NOT NULL,
    love_fortune TEXT,
    money_fortune TEXT,
    work_fortune TEXT,
    health_fortune TEXT,
    key_days TEXT,
    lucky_items TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, year, week_number)
)
''')

# 월간 운세 테이블
cursor.execute('''
CREATE TABLE IF NOT EXISTS monthly_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    theme TEXT,
    overall TEXT NOT NULL,
    love_fortune TEXT,
    money_fortune TEXT,
    work_fortune TEXT,
    health_fortune TEXT,
    key_dates TEXT,
    lucky_elements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, year, month)
)
''')

# 연간 운세 테이블
cursor.execute('''
CREATE TABLE IF NOT EXISTS yearly_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    theme TEXT,
    overall TEXT NOT NULL,
    love_fortune TEXT,
    money_fortune TEXT,
    work_fortune TEXT,
    health_fortune TEXT,
    best_months TEXT,
    challenging_months TEXT,
    key_advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, year)
)
''')

# 궁합 운세 테이블
cursor.execute('''
CREATE TABLE IF NOT EXISTS compatibility_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac1_id INTEGER NOT NULL,
    zodiac2_id INTEGER NOT NULL,
    overall_score INTEGER,
    love_score INTEGER,
    friendship_score INTEGER,
    work_score INTEGER,
    description TEXT,
    love_compatibility TEXT,
    friendship_compatibility TEXT,
    work_compatibility TEXT,
    advice TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zodiac1_id) REFERENCES zodiac_signs(id),
    FOREIGN KEY (zodiac2_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac1_id, zodiac2_id)
)
''')

print("Schema created successfully!")

# 별자리 기본 데이터 삽입
zodiac_data = [
    (1, '양자리', 'Aries', '03-21', '04-19', 'Fire', '♈'),
    (2, '황소자리', 'Taurus', '04-20', '05-20', 'Earth', '♉'),
    (3, '쌍둥이자리', 'Gemini', '05-21', '06-20', 'Air', '♊'),
    (4, '게자리', 'Cancer', '06-21', '07-22', 'Water', '♋'),
    (5, '사자자리', 'Leo', '07-23', '08-22', 'Fire', '♌'),
    (6, '처녀자리', 'Virgo', '08-23', '09-22', 'Earth', '♍'),
    (7, '천칭자리', 'Libra', '09-23', '10-22', 'Air', '♎'),
    (8, '전갈자리', 'Scorpio', '10-23', '11-21', 'Water', '♏'),
    (9, '사수자리', 'Sagittarius', '11-22', '12-21', 'Fire', '♐'),
    (10, '염소자리', 'Capricorn', '12-22', '01-19', 'Earth', '♑'),
    (11, '물병자리', 'Aquarius', '01-20', '02-18', 'Air', '♒'),
    (12, '물고기자리', 'Pisces', '02-19', '03-20', 'Water', '♓')
]

cursor.executemany('INSERT OR IGNORE INTO zodiac_signs VALUES (?, ?, ?, ?, ?, ?, ?)', zodiac_data)
print(f"Inserted {cursor.rowcount} zodiac signs")

# 샘플 연간 운세 데이터 삽입 (2025년)
print("\nInserting yearly fortunes for 2025...")

yearly_fortunes = [
    (1, 2025, "창조와 도전의 해", 
     "르네상스 천재의 붓끝처럼, 당신의 창의성이 빛을 발할 해입니다. 만리장성을 쌓은 황제의 대담함으로 새로운 영토를 개척하며, 후기 인상파 화가의 열정으로 세상에 색깔을 입힐 것입니다.",
     "무성영화 황제의 유머와 매력으로 사랑의 무대를 장식합니다.",
     "독립선언서를 쓴 건국의 아버지처럼 경제적 자립의 기틀을 마련합니다.",
     "철혈재상의 통일 의지로 업무 영역을 확장합니다.",
     "전쟁의 신이 내린 강인한 체력이 당신을 지킵니다.",
     "3월, 7월, 11월", "6월, 9월",
     "매일 새로운 시도를 하나씩 도전하고, 실패를 두려워하지 말고 다빈치처럼 모든 것에 호기심을 가지세요."),
    
    (2, 2025, "예술과 안정의 해",
     "불멸의 극작가가 펜을 들듯, 당신의 인내가 작품이 되는 해입니다. 마지막 파라오의 우아함과 깨달음의 부처님처럼 내면의 평화를 찾으며, 프랑스를 구한 소녀의 순수한 신념으로 목표를 향해 나아갑니다.",
     "영화계 아이콘의 우아함으로 사랑을 키워갑니다.",
     "자본론 저자의 체계적 사고로 재정을 관리합니다.",
     "패션 혁명가의 혁신으로 업무 스타일을 바꿉니다.",
     "사랑과 미의 여신이 주는 아름다움이 건강의 기초가 됩니다.",
     "4월, 8월, 12월", "7월, 10월",
     "성급함보다 꾸준함을 택하고, 셰익스피어처럼 인내로 불멸의 작품을 만들어가세요."),
]

for fortune in yearly_fortunes:
    cursor.execute('''
        INSERT OR IGNORE INTO yearly_fortunes_data 
        (zodiac_id, year, theme, overall, love_fortune, money_fortune, work_fortune, health_fortune, best_months, challenging_months, key_advice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', fortune)

print(f"Inserted {len(yearly_fortunes)} yearly fortunes")

# 샘플 일일 운세 데이터 (2025년 1월 1일)
print("\nInserting sample daily fortunes...")

daily_fortunes = [
    (1, '2025-01-01', "새해 첫날, 다빈치의 끝없는 호기심처럼 새로운 시작을 맞이하세요.",
     "사랑하는 사람과 함께 새로운 계획을 세우기 좋은 날입니다.", 85,
     "예상치 못한 수입이 생길 수 있습니다.", 78,
     "새로운 프로젝트를 시작하기에 완벽한 타이밍입니다.", 92,
     "건강한 습관을 시작하기 좋은 날입니다.", 80,
     "빨강", 7, "오전 7-9시",
     "첫 단추를 잘 끼워야 한 해가 순조롭습니다."),
    
    (2, '2025-01-01', "새해의 안정적인 에너지가 당신을 감싸고 있습니다.",
     "진실한 마음을 전하기 좋은 날입니다.", 82,
     "재정 계획을 세우기에 적합한 시기입니다.", 88,
     "체계적인 업무 계획이 성과로 이어집니다.", 85,
     "규칙적인 생활 패턴을 만들어가세요.", 83,
     "초록", 4, "오후 2-4시",
     "천천히 그러나 확실하게 전진하세요."),
]

for fortune in daily_fortunes:
    cursor.execute('''
        INSERT OR IGNORE INTO daily_fortunes_data 
        (zodiac_id, date, overall, love_fortune, love_score, money_fortune, money_score, 
         work_fortune, work_score, health_fortune, health_score, 
         lucky_color, lucky_number, lucky_time, advice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', fortune)

print(f"Inserted {len(daily_fortunes)} daily fortunes")

# 커밋 및 닫기
conn.commit()

# 통계 확인
print("\n=== Database Statistics ===")
cursor.execute("SELECT COUNT(*) FROM zodiac_signs")
print(f"Zodiac signs: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM yearly_fortunes_data")
print(f"Yearly fortunes: {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM daily_fortunes_data")
print(f"Daily fortunes: {cursor.fetchone()[0]}")

print(f"\nDatabase created successfully at: {os.path.abspath(db_path)}")

conn.close()