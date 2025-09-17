"""
Aztro API 데이터 수집 스크립트
무료 운세 API를 활용한 데이터 수집 및 번역
"""

import requests
import json
import sqlite3
import time
from datetime import datetime, timedelta
from googletrans import Translator
import os

class AztroFetcher:
    def __init__(self):
        self.base_url = "https://aztro.sameerkumar.website/"
        self.translator = Translator()
        self.db_path = "../database/zodiac.db"
        self.zodiac_signs = [
            'aries', 'taurus', 'gemini', 'cancer',
            'leo', 'virgo', 'libra', 'scorpio',
            'sagittarius', 'capricorn', 'aquarius', 'pisces'
        ]
        self.zodiac_kr = {
            'aries': '양자리', 'taurus': '황소자리', 'gemini': '쌍둥이자리',
            'cancer': '게자리', 'leo': '사자자리', 'virgo': '처녀자리',
            'libra': '천칭자리', 'scorpio': '전갈자리', 'sagittarius': '사수자리',
            'capricorn': '염소자리', 'aquarius': '물병자리', 'pisces': '물고기자리'
        }
        
    def setup_database(self):
        """데이터베이스 초기화"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        
        # schema.sql 파일 실행
        with open('../database/schema.sql', 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
        
        conn.commit()
        conn.close()
        print("데이터베이스 초기화 완료")
        
    def fetch_aztro_data(self, sign, day='today'):
        """Aztro API에서 데이터 가져오기"""
        params = {'sign': sign, 'day': day}
        try:
            response = requests.post(self.base_url, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"API 오류: {response.status_code}")
                return None
        except Exception as e:
            print(f"요청 실패: {e}")
            return None
            
    def translate_text(self, text, max_retries=3):
        """영어 텍스트를 한국어로 번역"""
        if not text:
            return ""
            
        for attempt in range(max_retries):
            try:
                result = self.translator.translate(text, src='en', dest='ko')
                return result.text
            except Exception as e:
                print(f"번역 실패 (시도 {attempt + 1}/{max_retries}): {e}")
                time.sleep(2)  # 재시도 전 대기
                
        return text  # 번역 실패시 원문 반환
        
    def parse_fortune_scores(self, mood):
        """mood를 기반으로 각 운세 점수 생성"""
        moods = {
            'Excellent': {'base': 90, 'range': 10},
            'Good': {'base': 75, 'range': 15},
            'Average': {'base': 50, 'range': 20},
            'Bad': {'base': 30, 'range': 20},
            'Terrible': {'base': 15, 'range': 15}
        }
        
        base_score = moods.get(mood, {'base': 50, 'range': 20})
        import random
        
        return {
            'love': random.randint(base_score['base'] - base_score['range'], 
                                  base_score['base'] + base_score['range']),
            'money': random.randint(base_score['base'] - base_score['range'], 
                                   base_score['base'] + base_score['range']),
            'work': random.randint(base_score['base'] - base_score['range'], 
                                  base_score['base'] + base_score['range']),
            'health': random.randint(base_score['base'] - base_score['range'], 
                                    base_score['base'] + base_score['range'])
        }
        
    def collect_daily_fortunes(self):
        """일일 운세 수집"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for sign in self.zodiac_signs:
            print(f"\n{self.zodiac_kr[sign]} 데이터 수집 중...")
            
            # 오늘, 어제, 내일 데이터 수집
            for day in ['today', 'yesterday', 'tomorrow']:
                data = self.fetch_aztro_data(sign, day)
                
                if data:
                    # 날짜 계산
                    if day == 'today':
                        fortune_date = datetime.now().date()
                    elif day == 'yesterday':
                        fortune_date = (datetime.now() - timedelta(days=1)).date()
                    else:  # tomorrow
                        fortune_date = (datetime.now() + timedelta(days=1)).date()
                    
                    # 점수 생성
                    scores = self.parse_fortune_scores(data.get('mood', 'Average'))
                    
                    # 텍스트 번역
                    description = self.translate_text(data.get('description', ''))
                    time.sleep(1)  # API 제한 방지
                    
                    # 별자리 ID 가져오기
                    cursor.execute("SELECT id FROM zodiac_signs WHERE name_en = ?", 
                                 (sign.capitalize(),))
                    zodiac_id = cursor.fetchone()[0]
                    
                    # 데이터베이스에 저장
                    try:
                        cursor.execute("""
                            INSERT OR REPLACE INTO daily_fortunes 
                            (zodiac_id, fortune_date, overall_fortune, 
                             love_score, money_score, work_score, health_score,
                             lucky_color, lucky_number, lucky_time)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (
                            zodiac_id,
                            fortune_date,
                            description,
                            scores['love'],
                            scores['money'],
                            scores['work'],
                            scores['health'],
                            data.get('color', ''),
                            data.get('lucky_number', ''),
                            data.get('lucky_time', '')
                        ))
                        
                        conn.commit()
                        print(f"  {day} 데이터 저장 완료")
                        
                    except Exception as e:
                        print(f"  데이터 저장 실패: {e}")
                        
                time.sleep(2)  # API 과부하 방지
                
        cursor.close()
        conn.close()
        print("\n일일 운세 수집 완료!")
        
    def generate_extended_fortunes(self):
        """주간, 월간, 연간 운세 생성 (AI 기반 확장)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 일일 데이터를 기반으로 확장 데이터 생성
        for zodiac_id in range(1, 13):
            cursor.execute("""
                SELECT AVG(love_score), AVG(money_score), AVG(work_score), AVG(health_score)
                FROM daily_fortunes
                WHERE zodiac_id = ?
            """, (zodiac_id,))
            
            avg_scores = cursor.fetchone()
            
            if avg_scores[0]:  # 데이터가 있는 경우
                # 주간 운세 생성
                self._generate_weekly_fortune(cursor, zodiac_id, avg_scores)
                
                # 월간 운세 생성
                self._generate_monthly_fortune(cursor, zodiac_id, avg_scores)
                
                # 연간 운세 생성
                self._generate_yearly_fortune(cursor, zodiac_id, avg_scores)
                
        conn.commit()
        conn.close()
        print("확장 운세 데이터 생성 완료!")
        
    def _generate_weekly_fortune(self, cursor, zodiac_id, avg_scores):
        """주간 운세 생성"""
        week_start = datetime.now().date()
        week_end = week_start + timedelta(days=7)
        
        fortune_templates = {
            'high': "이번 주는 매우 긍정적인 에너지가 가득한 한 주가 될 것입니다.",
            'medium': "이번 주는 균형과 조화를 찾아가는 시기가 될 것입니다.",
            'low': "이번 주는 도전과 성장의 기회가 될 것입니다."
        }
        
        avg = sum(avg_scores) / 4
        if avg > 70:
            template = 'high'
        elif avg > 40:
            template = 'medium'
        else:
            template = 'low'
            
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO weekly_fortunes
                (zodiac_id, week_start, week_end, overall_fortune)
                VALUES (?, ?, ?, ?)
            """, (zodiac_id, week_start, week_end, fortune_templates[template]))
        except Exception as e:
            print(f"주간 운세 저장 실패: {e}")
            
    def _generate_monthly_fortune(self, cursor, zodiac_id, avg_scores):
        """월간 운세 생성"""
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        monthly_themes = [
            "새로운 시작과 도전의 달",
            "관계와 소통의 달",
            "성장과 발전의 달",
            "안정과 균형의 달"
        ]
        
        theme_index = (zodiac_id + current_month) % len(monthly_themes)
        
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO monthly_fortunes
                (zodiac_id, year, month, monthly_theme)
                VALUES (?, ?, ?, ?)
            """, (zodiac_id, current_year, current_month, monthly_themes[theme_index]))
        except Exception as e:
            print(f"월간 운세 저장 실패: {e}")
            
    def _generate_yearly_fortune(self, cursor, zodiac_id, avg_scores):
        """연간 운세 생성"""
        current_year = datetime.now().year
        
        yearly_themes = [
            "변화와 성장의 해",
            "안정과 번영의 해",
            "도전과 기회의 해",
            "조화와 균형의 해"
        ]
        
        theme_index = (zodiac_id + current_year) % len(yearly_themes)
        
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO yearly_fortunes
                (zodiac_id, year, yearly_theme)
                VALUES (?, ?, ?)
            """, (zodiac_id, current_year, yearly_themes[theme_index]))
        except Exception as e:
            print(f"연간 운세 저장 실패: {e}")
            
    def run(self):
        """전체 수집 프로세스 실행"""
        print("별자리 운세 데이터 수집 시작...")
        
        # 1. 데이터베이스 설정
        self.setup_database()
        
        # 2. 일일 운세 수집
        self.collect_daily_fortunes()
        
        # 3. 확장 운세 생성
        self.generate_extended_fortunes()
        
        print("\n모든 데이터 수집 완료!")
        

if __name__ == "__main__":
    fetcher = AztroFetcher()
    fetcher.run()