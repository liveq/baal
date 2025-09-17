"""
한국 운세 사이트 웹 스크래핑 스크립트
여러 한국 사이트에서 운세 데이터 수집
"""

import requests
from bs4 import BeautifulSoup
import sqlite3
import json
import time
from datetime import datetime, timedelta
import re
import os

class KoreanHoroscopeScraper:
    def __init__(self):
        self.db_path = "../database/zodiac.db"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        # 별자리 매핑
        self.zodiac_mapping = {
            1: {'kr': '양자리', 'en': 'aries', 'period': '3.21~4.19'},
            2: {'kr': '황소자리', 'en': 'taurus', 'period': '4.20~5.20'},
            3: {'kr': '쌍둥이자리', 'en': 'gemini', 'period': '5.21~6.20'},
            4: {'kr': '게자리', 'en': 'cancer', 'period': '6.21~7.22'},
            5: {'kr': '사자자리', 'en': 'leo', 'period': '7.23~8.22'},
            6: {'kr': '처녀자리', 'en': 'virgo', 'period': '8.23~9.22'},
            7: {'kr': '천칭자리', 'en': 'libra', 'period': '9.23~10.22'},
            8: {'kr': '전갈자리', 'en': 'scorpio', 'period': '10.23~11.21'},
            9: {'kr': '사수자리', 'en': 'sagittarius', 'period': '11.22~12.21'},
            10: {'kr': '염소자리', 'en': 'capricorn', 'period': '12.22~1.19'},
            11: {'kr': '물병자리', 'en': 'aquarius', 'period': '1.20~2.18'},
            12: {'kr': '물고기자리', 'en': 'pisces', 'period': '2.19~3.20'}
        }
        
    def scrape_fortune_site(self):
        """포춘에이드 사이트 스크래핑"""
        print("포춘에이드 사이트 스크래핑 시작...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for zodiac_id, info in self.zodiac_mapping.items():
            try:
                # 별자리별 운세 페이지 URL
                url = f"https://m.fortunade.com/unse/free/zodiac/daily.php?zodiac={zodiac_id}"
                
                response = requests.get(url, headers=self.headers)
                response.encoding = 'utf-8'
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # 운세 텍스트 추출 (사이트 구조에 따라 수정 필요)
                    fortune_text = self._extract_fortune_text(soup)
                    
                    if fortune_text:
                        # 데이터베이스에 저장
                        self._save_fortune(cursor, zodiac_id, fortune_text)
                        print(f"  {info['kr']} 데이터 수집 완료")
                    else:
                        print(f"  {info['kr']} 데이터 추출 실패")
                        
                else:
                    print(f"  {info['kr']} 페이지 접근 실패: {response.status_code}")
                    
            except Exception as e:
                print(f"  {info['kr']} 스크래핑 오류: {e}")
                
            time.sleep(2)  # 서버 부하 방지
            
        conn.commit()
        conn.close()
        print("포춘에이드 스크래핑 완료!")
        
    def _extract_fortune_text(self, soup):
        """HTML에서 운세 텍스트 추출"""
        try:
            # 일반적인 운세 텍스트 패턴 찾기
            fortune_divs = soup.find_all(['div', 'p'], class_=re.compile('fortune|horoscope|content'))
            
            if fortune_divs:
                fortune_text = ' '.join([div.get_text(strip=True) for div in fortune_divs])
                return fortune_text[:500]  # 최대 500자로 제한
                
            # 대체 방법: 본문 텍스트 추출
            main_content = soup.find(['main', 'article', 'section'])
            if main_content:
                return main_content.get_text(strip=True)[:500]
                
        except Exception as e:
            print(f"    텍스트 추출 오류: {e}")
            
        return None
        
    def _save_fortune(self, cursor, zodiac_id, fortune_text):
        """운세 데이터 저장"""
        try:
            # 운세 텍스트 파싱 및 점수 생성
            scores = self._generate_scores_from_text(fortune_text)
            
            cursor.execute("""
                INSERT OR REPLACE INTO daily_fortunes
                (zodiac_id, fortune_date, overall_fortune,
                 love_score, money_score, work_score, health_score)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                zodiac_id,
                datetime.now().date(),
                fortune_text,
                scores['love'],
                scores['money'],
                scores['work'],
                scores['health']
            ))
            
        except Exception as e:
            print(f"    데이터 저장 오류: {e}")
            
    def _generate_scores_from_text(self, text):
        """텍스트 감정 분석을 통한 점수 생성"""
        import random
        
        # 긍정/부정 키워드 기반 점수 생성
        positive_keywords = ['행운', '좋은', '상승', '발전', '성공', '행복', '긍정']
        negative_keywords = ['주의', '조심', '하락', '어려움', '문제', '갈등']
        
        positive_count = sum(1 for word in positive_keywords if word in text)
        negative_count = sum(1 for word in negative_keywords if word in text)
        
        base_score = 50 + (positive_count * 10) - (negative_count * 10)
        base_score = max(20, min(90, base_score))  # 20-90 범위로 제한
        
        return {
            'love': random.randint(base_score - 10, base_score + 10),
            'money': random.randint(base_score - 10, base_score + 10),
            'work': random.randint(base_score - 10, base_score + 10),
            'health': random.randint(base_score - 10, base_score + 10)
        }
        
    def generate_compatibility_data(self):
        """별자리 궁합 데이터 생성"""
        print("\n별자리 궁합 데이터 생성 중...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 기본 궁합 규칙 (실제 점성술 기반)
        compatibility_rules = {
            '같은원소': 90,  # 같은 원소끼리 높은 궁합
            '상호보완': 75,  # 서로 보완하는 관계
            '일반': 60,      # 보통 관계
            '도전': 40       # 어려운 관계
        }
        
        elements = {
            '불': [1, 5, 9],      # 양자리, 사자자리, 사수자리
            '흙': [2, 6, 10],     # 황소자리, 처녀자리, 염소자리
            '공기': [3, 7, 11],   # 쌍둥이자리, 천칭자리, 물병자리
            '물': [4, 8, 12]      # 게자리, 전갈자리, 물고기자리
        }
        
        for zodiac1_id in range(1, 13):
            for zodiac2_id in range(1, 13):
                # 같은 원소인지 확인
                same_element = False
                for element_signs in elements.values():
                    if zodiac1_id in element_signs and zodiac2_id in element_signs:
                        same_element = True
                        break
                        
                if same_element:
                    base_score = compatibility_rules['같은원소']
                elif abs(zodiac1_id - zodiac2_id) in [4, 8]:  # 120도 각도
                    base_score = compatibility_rules['상호보완']
                elif abs(zodiac1_id - zodiac2_id) in [3, 9]:  # 90도 각도
                    base_score = compatibility_rules['도전']
                else:
                    base_score = compatibility_rules['일반']
                    
                # 약간의 랜덤성 추가
                import random
                final_score = base_score + random.randint(-5, 5)
                
                try:
                    cursor.execute("""
                        INSERT OR REPLACE INTO zodiac_compatibility
                        (zodiac1_id, zodiac2_id, compatibility_score,
                         love_compatibility, friendship_compatibility, work_compatibility)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        zodiac1_id,
                        zodiac2_id,
                        final_score,
                        self._generate_compatibility_text(final_score, 'love'),
                        self._generate_compatibility_text(final_score, 'friendship'),
                        self._generate_compatibility_text(final_score, 'work')
                    ))
                    
                except Exception as e:
                    print(f"궁합 데이터 저장 오류: {e}")
                    
        conn.commit()
        conn.close()
        print("궁합 데이터 생성 완료!")
        
    def _generate_compatibility_text(self, score, type):
        """궁합 점수에 따른 텍스트 생성"""
        if type == 'love':
            if score >= 80:
                return "천생연분! 서로를 완벽하게 이해하고 사랑할 수 있는 관계입니다."
            elif score >= 60:
                return "좋은 인연입니다. 서로의 차이를 인정하면 행복한 관계가 될 수 있습니다."
            elif score >= 40:
                return "노력이 필요한 관계입니다. 서로를 이해하려는 노력이 중요합니다."
            else:
                return "도전적인 관계입니다. 많은 인내와 이해가 필요합니다."
                
        elif type == 'friendship':
            if score >= 80:
                return "최고의 친구가 될 수 있습니다. 평생 함께할 수 있는 우정입니다."
            elif score >= 60:
                return "좋은 친구 관계입니다. 서로를 존중하며 즐거운 시간을 보낼 수 있습니다."
            elif score >= 40:
                return "일반적인 친구 관계입니다. 적당한 거리를 유지하는 것이 좋습니다."
            else:
                return "친구가 되기 어려운 관계입니다. 서로 다른 가치관을 가지고 있습니다."
                
        else:  # work
            if score >= 80:
                return "완벽한 비즈니스 파트너입니다. 시너지 효과를 낼 수 있습니다."
            elif score >= 60:
                return "좋은 동료 관계입니다. 서로의 강점을 활용할 수 있습니다."
            elif score >= 40:
                return "협업이 가능한 관계입니다. 명확한 역할 분담이 필요합니다."
            else:
                return "업무상 갈등이 생길 수 있습니다. 충분한 소통이 필요합니다."
                
    def run(self):
        """전체 스크래핑 프로세스 실행"""
        print("한국 운세 데이터 수집 시작...")
        
        # 데이터베이스 확인
        if not os.path.exists(self.db_path):
            print("데이터베이스가 없습니다. aztro-fetcher.py를 먼저 실행하세요.")
            return
            
        # 1. 한국 사이트 스크래핑
        self.scrape_fortune_site()
        
        # 2. 궁합 데이터 생성
        self.generate_compatibility_data()
        
        print("\n모든 한국 데이터 수집 완료!")
        

if __name__ == "__main__":
    scraper = KoreanHoroscopeScraper()
    scraper.run()