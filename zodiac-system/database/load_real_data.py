import sqlite3
import json
from datetime import datetime, timedelta
import random

# 데이터베이스 연결
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("=== 실제 운세 데이터 로드 시작 ===\n")

# 별자리별 특성 (역사적 인물 기반)
zodiac_traits = {
    1: {  # 양자리
        "name": "양자리",
        "figures": ["다빈치", "나폴레옹", "반 고흐", "채플린", "무측천"],
        "traits": ["개척정신", "열정", "도전", "창의성", "리더십"],
        "metaphors": [
            "르네상스 천재의 붓끝처럼",
            "만리장성을 쌓은 황제의 대담함으로",
            "무성영화 황제의 유머와 매력으로",
            "철혈재상의 통일 의지로",
            "전쟁의 신이 내린 강인함으로"
        ]
    },
    2: {  # 황소자리
        "name": "황소자리",
        "figures": ["셰익스피어", "클레오파트라", "석가모니", "잔 다르크", "엘리자베스 2세"],
        "traits": ["인내", "예술성", "안정", "감각", "우아함"],
        "metaphors": [
            "불멸의 극작가가 펜을 들듯",
            "마지막 파라오의 우아함으로",
            "깨달음의 부처님처럼",
            "프랑스를 구한 소녀의 신념으로",
            "70년 재위한 여왕의 지속력으로"
        ]
    },
    3: {  # 쌍둥이자리
        "name": "쌍둥이자리",
        "figures": ["케네디", "마릴린 먼로", "알렉산더", "양귀비", "볼테르"],
        "traits": ["소통", "다재다능", "호기심", "변화", "지성"],
        "metaphors": [
            "세계를 정복한 젊은 왕의 호기심으로",
            "절세미인의 매력과 카리스마로",
            "카멜레온 같은 변신의 귀재처럼",
            "전령신의 날개를 단 듯",
            "계몽주의 철학자의 지혜로"
        ]
    },
    4: {  # 게자리
        "name": "게자리",
        "figures": ["넬슨 만델라", "헬렌 켈러", "헤밍웨이", "다이애나", "머더 테레사"],
        "traits": ["감성", "보호본능", "가족애", "직관", "자비"],
        "metaphors": [
            "평화의 상징이 된 지도자처럼",
            "시청각 장애를 극복한 교육자의 의지로",
            "서정적 감성의 작가처럼",
            "국민의 공주처럼 따뜻한 마음으로",
            "캘커타의 성인처럼"
        ]
    },
    5: {  # 사자자리
        "name": "사자자리",
        "figures": ["나폴레옹", "코코 샤넬", "앤디 워홀", "마돈나", "루이 14세"],
        "traits": ["자신감", "리더십", "창조성", "카리스마", "관대함"],
        "metaphors": [
            "유럽을 정복한 황제의 카리스마로",
            "태양왕의 절대적 권위로",
            "팝 아트의 아버지처럼",
            "팝의 여왕처럼 끊임없는 변신으로",
            "패션 혁명가의 혁신으로"
        ]
    },
    6: {  # 처녀자리
        "name": "처녀자리",
        "figures": ["아우구스투스", "마더 테레사", "워런 버핏", "아가사 크리스티", "프레디 머큐리"],
        "traits": ["완벽주의", "분석력", "봉사정신", "실용성", "세밀함"],
        "metaphors": [
            "로마제국 황금기를 연 황제처럼",
            "캘커타 빈민가의 성인처럼",
            "오마하의 현자처럼 분석적으로",
            "추리소설의 여왕처럼 세밀하게",
            "완벽주의 퍼포머의 철저함으로"
        ]
    },
    7: {  # 천칭자리
        "name": "천칭자리",
        "figures": ["간디", "엘리너 루스벨트", "존 레논", "마거릿 대처", "오스카 와일드"],
        "traits": ["균형", "조화", "정의", "외교", "미적감각"],
        "metaphors": [
            "비폭력 무저항의 성자처럼",
            "세계인권선언을 기초한 여성의 정의감으로",
            "평화를 노래한 음악가처럼",
            "철의 여인의 균형감각으로",
            "탐미주의 작가의 예술혼으로"
        ]
    },
    8: {  # 전갈자리
        "name": "전갈자리",
        "figures": ["마리 퀴리", "피카소", "빌 게이츠", "그레이스 켈리", "도스토예프스키"],
        "traits": ["열정", "신비", "변혁", "집중력", "통찰력"],
        "metaphors": [
            "방사능 연구로 노벨상 2회 수상한 과학자처럼",
            "입체파를 창시한 예술 혁명가처럼",
            "기술 혁명의 선구자처럼",
            "모나코 왕비의 신비로움으로",
            "인간 심리를 꿰뚫는 작가처럼"
        ]
    },
    9: {  # 사수자리
        "name": "사수자리",
        "figures": ["처칠", "월트 디즈니", "프랭크 시나트라", "짐 모리슨", "베토벤"],
        "traits": ["자유", "철학", "모험", "낙천성", "탐험"],
        "metaphors": [
            "결코 항복하지 않는다고 선언한 총리처럼",
            "꿈과 모험의 세계를 창조한 창립자처럼",
            "My Way를 부른 가수의 자유로운 영혼으로",
            "운명과 맞서는 음악을 작곡한 거장처럼",
            "도어스의 보컬처럼 자유롭게"
        ]
    },
    10: {  # 염소자리
        "name": "염소자리",
        "figures": ["마틴 루터 킹", "무하마드 알리", "스티브 잡스", "뉴턴", "엘비스"],
        "traits": ["야망", "인내", "책임감", "체계성", "성취"],
        "metaphors": [
            "꿈을 현실로 만든 민권운동가처럼",
            "가장 위대하다고 자신한 복싱 챔피언처럼",
            "기술과 디자인을 혁신한 선구자처럼",
            "만유인력의 법칙을 발견한 물리학자처럼",
            "록앤롤의 왕처럼"
        ]
    },
    11: {  # 물병자리
        "name": "물병자리",
        "figures": ["링컨", "에디슨", "갈릴레이", "모차르트", "프랭클린 루스벨트"],
        "traits": ["독창성", "진보", "인도주의", "혁신", "독립"],
        "metaphors": [
            "노예를 해방시킨 대통령처럼",
            "천 번의 실패를 딛고 일어선 발명왕처럼",
            "그래도 지구는 돈다고 외친 과학자처럼",
            "천재 작곡가의 독창성으로",
            "뉴딜정책으로 경제를 회복시킨 대통령처럼"
        ]
    },
    12: {  # 물고기자리
        "name": "물고기자리",
        "figures": ["미켈란젤로", "아인슈타인", "조지 워싱턴", "쇼팽", "엘리자베스 테일러"],
        "traits": ["상상력", "감수성", "예술성", "이타심", "직관"],
        "metaphors": [
            "시스티나 성당을 그린 천재 화가처럼",
            "상대성이론을 발견한 물리학자의 직관으로",
            "건국의 아버지의 헌신으로",
            "서정적 낭만주의 음악가처럼",
            "은막의 여왕의 감성으로"
        ]
    }
}

# 일일 운세 생성 함수
def generate_daily_fortune(zodiac_id, date):
    traits = zodiac_traits[zodiac_id]
    day_of_week = date.weekday()
    
    # 요일별 에너지
    weekday_energy = {
        0: "새로운 시작의 월요일",  # Monday
        1: "추진력의 화요일",
        2: "균형의 수요일",
        3: "도약의 목요일",
        4: "완성의 금요일",
        5: "휴식의 토요일",
        6: "성찰의 일요일"
    }
    
    # 특별한 날짜 체크
    special_dates = {
        "01-01": "새해 첫날",
        "02-14": "발렌타인데이",
        "03-01": "삼일절",
        "05-05": "어린이날",
        "05-08": "어버이날",
        "08-15": "광복절",
        "12-25": "크리스마스"
    }
    
    date_str = date.strftime("%m-%d")
    is_special = date_str in special_dates
    
    # 고유한 운세 생성
    metaphor = random.choice(traits["metaphors"])
    trait = random.choice(traits["traits"])
    figure_hint = random.choice(traits["figures"])
    
    if is_special:
        overall = f"{special_dates[date_str]}, {metaphor} {trait}이 빛나는 날입니다."
    else:
        overall = f"{weekday_energy[day_of_week]}, {metaphor} {trait}을 발휘하세요."
    
    # 점수 생성 (요일과 별자리 특성 반영)
    base_score = 70
    love_score = base_score + random.randint(-10, 20)
    money_score = base_score + random.randint(-10, 20)
    work_score = base_score + (5 if day_of_week < 5 else -5) + random.randint(-5, 15)
    health_score = base_score + random.randint(-10, 20)
    
    # 행운 아이템
    colors = ["빨강", "주황", "노랑", "초록", "파랑", "남색", "보라", "분홍", "하늘색", "금색"]
    times = ["새벽 5-7시", "오전 7-9시", "오전 10-12시", "오후 2-4시", "오후 5-7시", "저녁 7-9시"]
    
    love_fortune = f"{traits['name']}의 {random.choice(traits['traits'])}이 사랑을 깊게 만듭니다."
    money_fortune = f"경제적 {random.choice(['안정', '성장', '기회', '도약'])}의 시기입니다."
    work_fortune = f"{random.choice(traits['traits'])}을 발휘하여 성과를 만드세요."
    health_fortune = f"몸과 마음의 {random.choice(['균형', '활력', '회복', '정화'])}에 집중하세요."
    
    advice = f"{figure_hint}의 정신을 본받아 {trait}을 실천하세요."
    
    return (
        zodiac_id,
        date.strftime("%Y-%m-%d"),
        overall,
        love_fortune, love_score,
        money_fortune, money_score,
        work_fortune, work_score,
        health_fortune, health_score,
        random.choice(colors),
        random.randint(1, 9),
        random.choice(times),
        advice
    )

# 2025년 1월 데이터 생성 (예시)
print("일일 운세 데이터 생성 중...")
daily_data = []
start_date = datetime(2025, 1, 1)

# 1월 한 달치만 생성 (12 별자리 × 31일 = 372개)
for day in range(31):
    current_date = start_date + timedelta(days=day)
    for zodiac_id in range(1, 13):
        fortune = generate_daily_fortune(zodiac_id, current_date)
        daily_data.append(fortune)

# 데이터베이스에 삽입
cursor.executemany('''
    INSERT OR REPLACE INTO daily_fortunes_data 
    (zodiac_id, date, overall, love_fortune, love_score, money_fortune, money_score,
     work_fortune, work_score, health_fortune, health_score,
     lucky_color, lucky_number, lucky_time, advice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', daily_data)

print(f"[OK] Daily fortunes: {len(daily_data)} records created")

# 연간 운세 12개 생성
print("\n연간 운세 데이터 생성 중...")
yearly_data = []
for zodiac_id in range(1, 13):
    traits = zodiac_traits[zodiac_id]
    
    theme = f"{random.choice(traits['traits'])}과 {random.choice(['성장', '도약', '완성', '변화'])}의 해"
    overall = f"2025년은 {random.choice(traits['metaphors'])} {random.choice(traits['traits'])}이 빛을 발할 해입니다."
    
    love = f"{traits['name']}의 매력이 절정에 달하는 한 해가 될 것입니다."
    money = f"경제적 {random.choice(['독립', '안정', '성장', '번영'])}을 이룰 수 있습니다."
    work = f"{random.choice(traits['traits'])}으로 커리어의 정점을 찍을 것입니다."
    health = f"건강한 {random.choice(['습관', '리듬', '에너지', '균형'])}을 유지하세요."
    
    best_months = random.sample(["1월", "2월", "3월", "4월", "5월", "6월", 
                                 "7월", "8월", "9월", "10월", "11월", "12월"], 3)
    challenging_months = random.sample(["1월", "2월", "3월", "4월", "5월", "6월",
                                        "7월", "8월", "9월", "10월", "11월", "12월"], 2)
    
    advice = f"{random.choice(traits['figures'])}처럼 {random.choice(traits['traits'])}을 발휘하세요."
    
    yearly_data.append((
        zodiac_id, 2025, theme, overall,
        love, money, work, health,
        ", ".join(best_months),
        ", ".join(challenging_months),
        advice
    ))

cursor.executemany('''
    INSERT OR REPLACE INTO yearly_fortunes_data
    (zodiac_id, year, theme, overall, love_fortune, money_fortune, 
     work_fortune, health_fortune, best_months, challenging_months, key_advice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', yearly_data)

print(f"[OK] Yearly fortunes: {len(yearly_data)} records created")

# 커밋
conn.commit()

# 통계 확인
print("\n=== 데이터베이스 최종 통계 ===")
cursor.execute("SELECT COUNT(*) FROM daily_fortunes_data")
daily_count = cursor.fetchone()[0]
print(f"일일 운세: {daily_count}개")

cursor.execute("SELECT COUNT(DISTINCT date) FROM daily_fortunes_data")
date_count = cursor.fetchone()[0]
print(f"포함된 날짜: {date_count}일")

cursor.execute("SELECT COUNT(*) FROM yearly_fortunes_data")
yearly_count = cursor.fetchone()[0]
print(f"연간 운세: {yearly_count}개")

# 샘플 데이터 확인
print("\n=== 샘플 데이터 확인 ===")
cursor.execute("""
    SELECT zodiac_id, date, overall 
    FROM daily_fortunes_data 
    WHERE date = '2025-01-01'
    ORDER BY zodiac_id
    LIMIT 3
""")
samples = cursor.fetchall()
for sample in samples:
    print(f"{zodiac_traits[sample[0]]['name']}: {sample[2][:50]}...")

conn.close()
print("\n[COMPLETE] Unique fortune data loaded successfully!")