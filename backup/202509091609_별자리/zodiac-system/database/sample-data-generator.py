"""
샘플 데이터 생성기
실제 API 없이 테스트용 데이터 생성
"""

import sqlite3
import json
import random
from datetime import datetime, timedelta
import os

class SampleDataGenerator:
    def __init__(self):
        self.db_path = "zodiac.db"
        
        # 운세 템플릿
        self.fortune_templates = {
            'daily': {
                'excellent': [
                    "오늘은 당신에게 최고의 날이 될 것입니다. 모든 일이 순조롭게 풀릴 것이며, 예상치 못한 행운이 찾아올 수 있습니다.",
                    "놀라운 기회가 당신을 기다리고 있습니다. 자신감을 가지고 도전하세요.",
                    "오늘은 당신의 매력이 빛나는 날입니다. 주변 사람들이 당신에게 호감을 느낄 것입니다."
                ],
                'good': [
                    "전반적으로 좋은 하루가 될 것입니다. 긍정적인 마음을 유지한다면 더 좋은 결과를 얻을 수 있습니다.",
                    "오늘은 새로운 시작을 하기에 좋은 날입니다. 계획했던 일을 실행에 옮기세요.",
                    "대인관계에서 좋은 소식이 있을 것입니다. 열린 마음으로 사람들을 대하세요."
                ],
                'normal': [
                    "평범한 하루가 될 것입니다. 일상에 충실하며 차분하게 보내세요.",
                    "큰 변화는 없지만 안정적인 하루가 될 것입니다. 기본에 충실하세요.",
                    "오늘은 휴식과 재충전이 필요한 날입니다. 무리하지 마세요."
                ],
                'challenging': [
                    "약간의 어려움이 있을 수 있지만, 이를 통해 성장할 수 있습니다.",
                    "예상치 못한 상황이 발생할 수 있습니다. 침착하게 대처하세요.",
                    "오늘은 신중한 판단이 필요한 날입니다. 서두르지 마세요."
                ]
            },
            'love': [
                "연인과의 관계가 더욱 깊어질 것입니다.",
                "새로운 만남의 기회가 있을 수 있습니다.",
                "상대방의 마음을 이해하려고 노력하세요.",
                "솔직한 대화가 관계 개선에 도움이 될 것입니다."
            ],
            'money': [
                "예상치 못한 수입이 생길 수 있습니다.",
                "지출을 절제하는 것이 좋습니다.",
                "투자에 신중을 기하세요.",
                "재정 계획을 세우기에 좋은 시기입니다."
            ],
            'work': [
                "업무 성과가 인정받을 것입니다.",
                "새로운 프로젝트가 시작될 수 있습니다.",
                "동료들과의 협력이 중요합니다.",
                "집중력을 발휘하면 좋은 결과를 얻을 수 있습니다."
            ],
            'health': [
                "건강 상태가 좋습니다. 운동을 시작하기에 좋은 때입니다.",
                "충분한 휴식이 필요합니다.",
                "스트레스 관리에 신경 쓰세요.",
                "규칙적인 생활 습관을 유지하세요."
            ]
        }
        
        self.lucky_colors = [
            "빨강", "파랑", "노랑", "초록", "보라", "주황", 
            "분홍", "하늘색", "연두색", "흰색", "검정", "회색"
        ]
        
        self.lucky_times = [
            "오전 7-9시", "오전 10-12시", "오후 1-3시", 
            "오후 4-6시", "오후 7-9시", "밤 10-12시"
        ]
        
    def setup_database(self):
        """데이터베이스 초기화"""
        os.makedirs(os.path.dirname(self.db_path) if os.path.dirname(self.db_path) else '.', exist_ok=True)
        
        conn = sqlite3.connect(self.db_path)
        
        # schema.sql 파일 실행
        with open('schema.sql', 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
        
        conn.commit()
        conn.close()
        print("데이터베이스 초기화 완료")
        
    def generate_daily_fortunes(self, days=30):
        """일일 운세 생성"""
        print(f"\n{days}일간의 일일 운세 생성 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        start_date = datetime.now().date() - timedelta(days=7)  # 일주일 전부터
        
        for day_offset in range(days):
            current_date = start_date + timedelta(days=day_offset)
            
            for zodiac_id in range(1, 13):
                # 랜덤 운세 레벨 선택
                fortune_level = random.choice(['excellent', 'good', 'normal', 'challenging'])
                overall_fortune = random.choice(self.fortune_templates['daily'][fortune_level])
                
                # 각 항목별 점수 생성
                if fortune_level == 'excellent':
                    base_score = 85
                elif fortune_level == 'good':
                    base_score = 70
                elif fortune_level == 'normal':
                    base_score = 50
                else:
                    base_score = 35
                
                love_score = max(0, min(100, base_score + random.randint(-15, 15)))
                money_score = max(0, min(100, base_score + random.randint(-15, 15)))
                work_score = max(0, min(100, base_score + random.randint(-15, 15)))
                health_score = max(0, min(100, base_score + random.randint(-15, 15)))
                
                # 각 분야별 운세
                love_fortune = random.choice(self.fortune_templates['love'])
                money_fortune = random.choice(self.fortune_templates['money'])
                work_fortune = random.choice(self.fortune_templates['work'])
                health_fortune = random.choice(self.fortune_templates['health'])
                
                # 행운 아이템
                lucky_color = random.choice(self.lucky_colors)
                lucky_number = str(random.randint(1, 9))
                lucky_time = random.choice(self.lucky_times)
                
                try:
                    cursor.execute("""
                        INSERT OR REPLACE INTO daily_fortunes
                        (zodiac_id, fortune_date, overall_fortune,
                         love_score, love_fortune,
                         money_score, money_fortune,
                         work_score, work_fortune,
                         health_score, health_fortune,
                         lucky_color, lucky_number, lucky_time,
                         advice)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        zodiac_id, current_date, overall_fortune,
                        love_score, love_fortune,
                        money_score, money_fortune,
                        work_score, work_fortune,
                        health_score, health_fortune,
                        lucky_color, lucky_number, lucky_time,
                        "오늘 하루도 긍정적인 마음으로 시작하세요!"
                    ))
                except Exception as e:
                    print(f"데이터 저장 오류 (zodiac_id={zodiac_id}, date={current_date}): {e}")
        
        conn.commit()
        conn.close()
        print(f"{days}일 × 12개 별자리 = {days * 12}개 일일 운세 생성 완료!")
        
    def generate_weekly_fortunes(self):
        """주간 운세 생성"""
        print("\n주간 운세 생성 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 현재 주와 다음 3주
        for week_offset in range(4):
            week_start = datetime.now().date() + timedelta(weeks=week_offset)
            week_start = week_start - timedelta(days=week_start.weekday())  # 월요일로 설정
            week_end = week_start + timedelta(days=6)
            
            for zodiac_id in range(1, 13):
                overall = f"이번 주는 {random.choice(['도전', '성장', '안정', '변화'])}의 한 주가 될 것입니다."
                
                cursor.execute("""
                    INSERT OR REPLACE INTO weekly_fortunes
                    (zodiac_id, week_start, week_end, overall_fortune,
                     love_fortune, money_fortune, work_fortune, health_fortune,
                     weekly_advice)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    zodiac_id, week_start, week_end, overall,
                    "이번 주 애정운은 " + random.choice(['상승', '안정', '보통', '주의']) + " 국면입니다.",
                    "이번 주 금전운은 " + random.choice(['매우 좋음', '좋음', '보통', '신중']) + " 상태입니다.",
                    "이번 주 직장운은 " + random.choice(['활발', '순조', '평범', '도전적']) + "할 것입니다.",
                    "이번 주 건강운은 " + random.choice(['최상', '양호', '관리 필요', '주의']) + " 상태입니다.",
                    "한 주를 계획적으로 보내면 좋은 결과를 얻을 수 있습니다."
                ))
        
        conn.commit()
        conn.close()
        print("주간 운세 생성 완료!")
        
    def generate_monthly_fortunes(self):
        """월간 운세 생성"""
        print("\n월간 운세 생성 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        # 현재 월부터 3개월
        for month_offset in range(3):
            month = (current_month + month_offset - 1) % 12 + 1
            year = current_year + ((current_month + month_offset - 1) // 12)
            
            for zodiac_id in range(1, 13):
                monthly_theme = random.choice([
                    "새로운 시작의 달", "관계 발전의 달", "성과 달성의 달",
                    "내면 성찰의 달", "도약 준비의 달", "수확의 달"
                ])
                
                key_dates = f"{random.randint(5, 10)}일, {random.randint(15, 20)}일, {random.randint(25, 28)}일"
                
                cursor.execute("""
                    INSERT OR REPLACE INTO monthly_fortunes
                    (zodiac_id, year, month, overall_fortune,
                     love_fortune, money_fortune, work_fortune, health_fortune,
                     monthly_theme, key_dates)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    zodiac_id, year, month,
                    f"{month}월은 전반적으로 {random.choice(['순조로운', '도전적인', '변화가 많은', '안정적인'])} 달이 될 것입니다.",
                    f"이달의 애정운은 {random.choice(['매우 활발', '점진적 발전', '현상 유지', '신중한 접근 필요'])}합니다.",
                    f"이달의 금전운은 {random.choice(['상승세', '안정세', '변동성', '보수적 운용 필요'])}를 보입니다.",
                    f"이달의 직장운은 {random.choice(['성과 기대', '꾸준한 노력 필요', '협업 중요', '새로운 기회'])} 시기입니다.",
                    f"이달의 건강은 {random.choice(['활력 넘침', '관리 필요', '휴식 중요', '운동 시작 적기'])} 상태입니다.",
                    monthly_theme,
                    key_dates
                ))
        
        conn.commit()
        conn.close()
        print("월간 운세 생성 완료!")
        
    def generate_yearly_fortunes(self):
        """연간 운세 생성"""
        print("\n2025년 연간 운세 생성 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        year = 2025
        
        for zodiac_id in range(1, 13):
            yearly_theme = random.choice([
                "대전환의 해", "성장과 발전의 해", "안정과 번영의 해",
                "도전과 기회의 해", "인연과 만남의 해", "성취와 결실의 해"
            ])
            
            best_months = f"{random.randint(3, 5)}월, {random.randint(7, 9)}월"
            challenging_months = f"{random.randint(1, 2)}월, {random.randint(10, 12)}월"
            
            cursor.execute("""
                INSERT OR REPLACE INTO yearly_fortunes
                (zodiac_id, year, overall_fortune,
                 love_fortune, money_fortune, work_fortune, health_fortune,
                 yearly_theme, best_months, challenging_months, yearly_advice)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                zodiac_id, year,
                f"2025년은 당신에게 {yearly_theme}가 될 것입니다. 많은 변화와 성장의 기회가 있을 것입니다.",
                "올해 애정운은 전반적으로 상승세를 보이며, 진정한 사랑을 찾거나 기존 관계가 더욱 깊어질 것입니다.",
                "재정적으로 안정적인 한 해가 될 것이며, 새로운 수입원이 생길 가능성이 있습니다.",
                "경력 발전의 중요한 전환점이 될 수 있는 해입니다. 적극적으로 기회를 잡으세요.",
                "건강 관리에 신경 쓴다면 활력 넘치는 한 해를 보낼 수 있을 것입니다.",
                yearly_theme,
                best_months,
                challenging_months,
                "2025년은 당신의 잠재력을 최대한 발휘할 수 있는 해입니다. 자신을 믿고 도전하세요!"
            ))
        
        conn.commit()
        conn.close()
        print("2025년 연간 운세 생성 완료!")
        
    def generate_compatibility(self):
        """별자리 궁합 데이터 생성"""
        print("\n별자리 궁합 데이터 생성 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 원소별 별자리 그룹
        elements = {
            '불': [1, 5, 9],
            '흙': [2, 6, 10],
            '공기': [3, 7, 11],
            '물': [4, 8, 12]
        }
        
        for zodiac1_id in range(1, 13):
            for zodiac2_id in range(1, 13):
                # 궁합 점수 계산
                if zodiac1_id == zodiac2_id:
                    score = 75  # 같은 별자리
                else:
                    # 같은 원소인지 확인
                    same_element = False
                    for element_signs in elements.values():
                        if zodiac1_id in element_signs and zodiac2_id in element_signs:
                            same_element = True
                            break
                    
                    if same_element:
                        score = random.randint(80, 95)
                    else:
                        # 상성/상극 관계 고려
                        score = random.randint(40, 75)
                
                # 궁합 텍스트 생성
                if score >= 80:
                    love_text = "천생연분! 서로를 완벽하게 이해하는 관계"
                    friend_text = "최고의 친구가 될 수 있는 관계"
                    work_text = "완벽한 팀워크를 발휘할 수 있는 관계"
                elif score >= 60:
                    love_text = "서로를 보완하는 좋은 관계"
                    friend_text = "즐거운 우정을 나눌 수 있는 관계"
                    work_text = "협력하면 좋은 성과를 낼 수 있는 관계"
                else:
                    love_text = "노력이 필요하지만 가능성 있는 관계"
                    friend_text = "서로 다른 매력을 가진 관계"
                    work_text = "서로의 차이를 인정하면 발전 가능한 관계"
                
                cursor.execute("""
                    INSERT OR REPLACE INTO zodiac_compatibility
                    (zodiac1_id, zodiac2_id, compatibility_score,
                     love_compatibility, friendship_compatibility, work_compatibility,
                     advice)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    zodiac1_id, zodiac2_id, score,
                    love_text, friend_text, work_text,
                    "서로의 장점을 인정하고 단점을 보완해주세요."
                ))
        
        conn.commit()
        conn.close()
        print("별자리 궁합 데이터 생성 완료!")
        
    def verify_data(self):
        """생성된 데이터 검증"""
        print("\n데이터 검증 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 각 테이블의 레코드 수 확인
        tables = [
            'zodiac_signs',
            'daily_fortunes',
            'weekly_fortunes',
            'monthly_fortunes',
            'yearly_fortunes',
            'zodiac_compatibility'
        ]
        
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"  {table}: {count}개 레코드")
        
        conn.close()
        print("\n데이터 검증 완료!")
        
    def run(self):
        """전체 프로세스 실행"""
        print("=" * 50)
        print("별자리 운세 샘플 데이터 생성 시작")
        print("=" * 50)
        
        # 1. 데이터베이스 설정
        self.setup_database()
        
        # 2. 일일 운세 생성 (30일분)
        self.generate_daily_fortunes(30)
        
        # 3. 주간 운세 생성
        self.generate_weekly_fortunes()
        
        # 4. 월간 운세 생성
        self.generate_monthly_fortunes()
        
        # 5. 연간 운세 생성
        self.generate_yearly_fortunes()
        
        # 6. 궁합 데이터 생성
        self.generate_compatibility()
        
        # 7. 데이터 검증
        self.verify_data()
        
        print("\n" + "=" * 50)
        print("모든 샘플 데이터 생성 완료!")
        print("데이터베이스 파일: zodiac.db")
        print("=" * 50)


if __name__ == "__main__":
    generator = SampleDataGenerator()
    generator.run()