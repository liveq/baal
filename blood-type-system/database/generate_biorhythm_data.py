#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
혈액형 바이오리듬 운세 데이터 생성 스크립트

바이오리듬 계산식:
- 신체(Physical): sin(2π × days / 23)
- 감정(Emotional): sin(2π × days / 28)  
- 지성(Intellectual): sin(2π × days / 33)

4개 혈액형 × 365일 = 1,460개 레코드 생성
"""

import sqlite3
import os
import math
import random
from datetime import datetime, timedelta

class BiorhythmGenerator:
    def __init__(self):
        self.db_path = os.path.join(os.path.dirname(__file__), 'biorhythm_fortunes.db')
        
        # 바이오리듬 주기 설정
        self.physical_cycle = 23
        self.emotional_cycle = 28
        self.intellectual_cycle = 33
        
        # 혈액형별 바이오리듬 가중치
        self.blood_type_weights = {
            'A': {'physical': 0.8, 'emotional': 0.9, 'intellectual': 1.2},
            'B': {'physical': 0.9, 'emotional': 1.3, 'intellectual': 1.0}, 
            'O': {'physical': 1.3, 'emotional': 1.0, 'intellectual': 0.9},
            'AB': {'physical': 1.0, 'emotional': 1.0, 'intellectual': 1.1}
        }
        
        # 행운의 아이템 (혈액형별)
        self.lucky_items = {
            'A': ['다이어리', '만년필', '책갈피', '화분', '차 세트', '향초', '수첩', '클래식 음반'],
            'B': ['스케치북', '색연필', '카메라', '여행용품', '악기', '운동화', '모자', '배낭'],
            'O': ['시계', '가죽지갑', '운동용품', '선글라스', '키체인', '명함케이스', '벨트', '향수'],
            'AB': ['태블릿', 'USB', '이어폰', '디자인 문구', '아트북', '커피용품', '와인잔', '보석']
        }
        
        # 행운의 색상
        self.lucky_colors = {
            'A': ['파스텔 블루', '연한 초록', '아이보리', '라벤더', '베이지', '연분홍'],
            'B': ['오렌지', '노란색', '빨간색', '자주색', '터키석', '라임그린'],
            'O': ['진한 파랑', '검은색', '금색', '은색', '진한 빨강', '브라운'],
            'AB': ['회색', '네이비', '와인색', '에메랄드', '로즈골드', '진주색']
        }

    def calculate_biorhythm(self, day_of_year, blood_type):
        """특정 날짜와 혈액형의 바이오리듬 점수 계산"""
        weights = self.blood_type_weights[blood_type]
        
        # 기본 바이오리듬 계산 (사인 함수 사용)
        physical = math.sin(2 * math.pi * day_of_year / self.physical_cycle) * weights['physical']
        emotional = math.sin(2 * math.pi * day_of_year / self.emotional_cycle) * weights['emotional']
        intellectual = math.sin(2 * math.pi * day_of_year / self.intellectual_cycle) * weights['intellectual']
        
        # -1~1 범위를 0~100 점수로 변환
        physical_score = round((physical + 1) * 50, 1)
        emotional_score = round((emotional + 1) * 50, 1)  
        intellectual_score = round((intellectual + 1) * 50, 1)
        
        return physical_score, emotional_score, intellectual_score

    def get_biorhythm_pattern(self, physical, emotional, intellectual):
        """바이오리듬 패턴 분석"""
        avg_score = (physical + emotional + intellectual) / 3
        
        if avg_score >= 80:
            return "최상승기"
        elif avg_score >= 60:
            return "상승기"
        elif avg_score >= 40:
            return "안정기"
        elif avg_score >= 20:
            return "하강기"
        else:
            return "최하강기"

    def get_famous_figure(self, blood_type):
        """해당 혈액형의 유명인물 무작위 선택"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT name_ko, quote FROM famous_people_biorhythm 
        WHERE blood_type = ? ORDER BY RANDOM() LIMIT 1
        ''', (blood_type,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return result[0], result[1]
        else:
            return "알려지지 않은 인물", "자신의 길을 걸어가세요"

    def generate_fortune_message(self, blood_type, day_of_year, physical, emotional, intellectual, pattern):
        """바이오리듬에 기반한 운세 메시지 생성"""
        
        # 월과 일 계산
        date_obj = datetime(2025, 1, 1) + timedelta(days=day_of_year - 1)
        month = date_obj.month
        day = date_obj.day
        
        # 유명인물 선택
        famous_name, famous_quote = self.get_famous_figure(blood_type)
        
        # 혈액형별 기본 특성
        base_traits = {
            'A': '완벽주의적인 당신',
            'B': '창의적인 당신',
            'O': '리더십이 강한 당신',
            'AB': '균형감각이 뛰어난 당신'
        }
        
        # 패턴별 전체 메시지 템플릿
        overall_templates = {
            '최상승기': [
                f"{base_traits[blood_type]}에게 {famous_name}의 지혜가 빛을 발하는 시기입니다. 모든 바이오리듬이 상승하며 새로운 도전을 위한 최적의 타이밍입니다.",
                f"오늘은 {famous_name}처럼 당당하게 자신의 길을 걸어가세요. 세 가지 에너지가 모두 정점에 달해 무엇이든 해낼 수 있습니다.",
                f"{base_traits[blood_type]}의 잠재력이 {famous_name}의 성취처럼 빛나는 날입니다. 바이오리듬의 황금비율이 행운을 가져다줍니다."
            ],
            '상승기': [
                f"{base_traits[blood_type]}에게 {famous_name}의 정신력이 함께하는 날입니다. 전반적으로 상승하는 에너지를 활용해 중요한 일에 집중하세요.",
                f"오늘은 {famous_name}의 도전정신을 본받아 새로운 시도를 해보는 것이 좋겠습니다. 상승하는 기운이 성공을 도울 것입니다.",
                f"{base_traits[blood_type]}의 장점이 돋보이는 시기입니다. {famous_name}처럼 차분하면서도 적극적으로 목표를 추진하세요."
            ],
            '안정기': [
                f"{base_traits[blood_type]}에게 {famous_name}의 지혜로운 균형감이 필요한 시기입니다. 안정된 에너지로 기반을 다지는 데 집중하세요.",
                f"오늘은 {famous_name}의 사려깊음을 배워 신중하게 판단하며 나아가세요. 안정된 바이오리듬이 현명한 선택을 돕습니다.",
                f"{base_traits[blood_type]}에게 적합한 균형잡힌 하루입니다. {famous_name}처럼 내실을 다지며 차근차근 준비하는 시간으로 활용하세요."
            ],
            '하강기': [
                f"{base_traits[blood_type]}에게 {famous_name}의 인내심이 빛나는 시기입니다. 잠시 에너지가 낮더라도 내면을 돌아보는 소중한 시간으로 만드세요.",
                f"오늘은 {famous_name}의 성찰하는 자세를 본받아 재충전의 시간으로 활용하세요. 하강기는 다음 상승을 위한 준비 과정입니다.",
                f"{base_traits[blood_type]}의 차분함이 필요한 날입니다. {famous_name}처럼 어려움 속에서도 희망을 잃지 않는 마음가짐을 유지하세요."
            ],
            '최하강기': [
                f"{base_traits[blood_type]}에게 {famous_name}의 불굴의 의지가 필요한 시기입니다. 가장 낮은 곳에서 다시 시작하는 용기를 가지세요.",
                f"오늘은 {famous_name}의 역경을 이겨낸 정신력을 되새기며 휴식과 재정비에 집중하세요. 모든 하강 뒤에는 반드시 상승이 옵니다.",
                f"{base_traits[blood_type]}의 끈기가 시험받는 시기입니다. {famous_name}처럼 포기하지 않는 마음으로 한 걸음씩 전진하세요."
            ]
        }
        
        # 신체 건강 메시지
        health_messages = {
            (80, 100): ["체력이 넘치는 시기입니다. 평소보다 강도 높은 운동이나 활동에 도전해보세요.", 
                       "신체 에너지가 최고조입니다. 새로운 운동을 시작하거나 몸을 많이 쓰는 일에 적극적으로 나서세요."],
            (60, 79): ["적당한 신체 활동으로 건강을 유지하세요. 규칙적인 운동과 충분한 영양 섭취가 중요합니다.",
                      "신체 리듬이 안정적입니다. 꾸준한 건강관리로 좋은 컨디션을 계속 유지하세요."],
            (40, 59): ["무리하지 말고 적당한 휴식을 취하세요. 몸의 신호를 귀담아듣고 컨디션 조절에 신경쓰세요.",
                      "평소보다 체력이 약간 떨어질 수 있습니다. 충분한 수면과 균형잡힌 식사로 에너지를 보충하세요."],
            (20, 39): ["몸이 피곤할 수 있으니 강도 높은 활동은 피하세요. 가벼운 스트레칭이나 산책 정도가 적당합니다.",
                      "신체 에너지가 낮은 시기입니다. 무리한 일정보다는 휴식과 회복에 우선순위를 두세요."],
            (0, 19): ["충분한 휴식과 수면이 필요한 시기입니다. 몸의 회복을 위해 가급적 무리한 활동은 자제하세요.",
                     "신체 바이오리듬이 최저점입니다. 건강 관리에 특별히 신경쓰고 컨디션 회복에 집중하세요."]
        }
        
        # 감정 메시지
        emotion_messages = {
            (80, 100): ["감정이 풍부하고 긍정적인 시기입니다. 사랑하는 사람들과 시간을 보내거나 예술 활동을 즐겨보세요.",
                       "감성이 풍부해지는 때입니다. 창작 활동이나 새로운 인간관계 형성에 좋은 기회입니다."],
            (60, 79): ["마음이 평온하고 안정된 상태입니다. 중요한 결정을 내리거나 깊은 대화를 나누기에 좋은 시기입니다.",
                      "감정의 균형이 잘 잡힌 하루입니다. 타인과의 소통에서 공감과 이해의 능력이 높아집니다."],
            (40, 59): ["마음가짐을 차분히 하고 내면을 돌아보는 시간을 가져보세요. 명상이나 독서가 도움이 될 것입니다.",
                      "감정 기복이 있을 수 있습니다. 급한 결정보다는 시간을 두고 신중히 생각해보세요."],
            (20, 39): ["감정이 다소 가라앉을 수 있습니다. 자신을 너무 몰아세우지 말고 마음의 여유를 찾으세요.",
                      "우울하거나 민감할 수 있는 시기입니다. 좋아하는 음악을 듣거나 취미활동으로 기분전환하세요."],
            (0, 19): ["감정적으로 힘든 시기일 수 있습니다. 신뢰하는 사람과 대화하거나 전문가의 도움을 받는 것도 좋겠습니다.",
                     "마음이 많이 가라앉을 수 있습니다. 무리하지 말고 자신을 돌보는 시간을 충분히 가지세요."]
        }
        
        # 지성 메시지  
        wisdom_messages = {
            (80, 100): ["두뇌 회전이 빠르고 집중력이 뛰어난 시기입니다. 복잡한 문제 해결이나 새로운 학습에 도전해보세요.",
                       "사고력과 판단력이 정점에 달했습니다. 중요한 계획을 세우거나 전략적 결정을 내리기에 최적의 때입니다."],
            (60, 79): ["논리적 사고와 분석력이 좋은 상태입니다. 공부나 업무에서 좋은 성과를 기대할 수 있습니다.",
                      "지적 활동에 적극적으로 참여해보세요. 새로운 지식 습득이나 창의적 아이디어 발상에 유리합니다."],
            (40, 59): ["평상시 수준의 사고력을 유지하고 있습니다. 꾸준히 학습하고 지식을 쌓아가는 시간으로 활용하세요.",
                      "급하지 않은 일들을 차근차근 정리하고 체계화하는데 집중해보세요."],
            (20, 39): ["집중력이 다소 떨어질 수 있습니다. 복잡한 일보다는 단순하고 명확한 업무에 집중하세요.",
                      "머리가 복잡할 수 있는 시기입니다. 중요한 결정은 미루고 충분히 생각할 시간을 가지세요."],
            (0, 19): ["사고력이 둔해질 수 있는 시기입니다. 중요한 판단은 피하고 휴식을 통해 정신력을 회복하세요.",
                     "지적 활동보다는 단순한 작업이나 휴식에 집중하는 것이 좋겠습니다."]
        }
        
        # 조언 메시지
        advice_templates = {
            'A': [
                "완벽을 추구하되 너무 자신을 몰아세우지는 마세요.",
                "계획적으로 접근하되 예상치 못한 변화에도 유연하게 대응하세요.",
                "세심한 배려심을 발휘하되 자신도 소중히 여기는 마음을 잊지 마세요.",
                "체계적인 사고를 활용해 단계적으로 목표에 다가가세요."
            ],
            'B': [
                "창의적 아이디어를 자유롭게 발산하되 실행 계획도 함께 세워보세요.",
                "다양한 경험을 추구하되 하나씩은 완성해나가는 끈기도 기르세요.",
                "자신만의 개성을 살리되 타인과의 조화도 고려해보세요.",
                "순간의 영감을 소중히 여기되 지속가능한 노력도 병행하세요."
            ],
            'O': [
                "리더십을 발휘하되 팀원들의 의견도 경청하는 자세를 유지하세요.",
                "목표 달성에 집중하되 과정에서의 인간관계도 소중히 여기세요.",
                "추진력을 활용하되 신중한 판단도 함께 고려해보세요.",
                "경쟁에서 이기려 하되 상대방에 대한 존중을 잊지 마세요."
            ],
            'AB': [
                "균형감각을 활용해 다양한 관점에서 문제를 바라보세요.",
                "합리적 판단과 직감적 통찰을 조화롭게 활용해보세요.",
                "다재다능함을 발휘하되 한 가지 분야에서의 전문성도 기르세요.",
                "객관적 분석과 따뜻한 공감을 적절히 조화시켜 나가세요."
            ]
        }
        
        # 점수대별 메시지 선택
        def get_message_by_score(score, message_dict):
            for score_range, messages in message_dict.items():
                if score_range[0] <= score <= score_range[1]:
                    return random.choice(messages)
            return random.choice(list(message_dict.values())[2])  # 기본값
        
        # 각 메시지 생성
        overall = random.choice(overall_templates[pattern])
        health = get_message_by_score(physical, health_messages)
        emotion = get_message_by_score(emotional, emotion_messages)  
        wisdom = get_message_by_score(intellectual, wisdom_messages)
        advice = random.choice(advice_templates[blood_type])
        
        # 행운 아이템과 색상
        lucky_item = random.choice(self.lucky_items[blood_type])
        lucky_color = random.choice(self.lucky_colors[blood_type])
        
        return {
            'overall': overall,
            'health': health,
            'emotion': emotion,
            'wisdom': wisdom,
            'lucky_item': lucky_item,
            'lucky_color': lucky_color,
            'advice': advice,
            'famous_figure': famous_name,
            'figure_quote': famous_quote
        }

    def generate_all_data(self):
        """365일 × 4혈액형 = 1,460개 레코드 생성"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # 기존 데이터 삭제
        cursor.execute('DELETE FROM daily_biorhythm')
        
        blood_types = ['A', 'B', 'O', 'AB']
        total_records = 0
        
        print("바이오리듬 운세 데이터 생성 시작...")
        
        for blood_type in blood_types:
            print(f"{blood_type}형 데이터 생성 중...")
            
            for day_of_year in range(1, 366):  # 1월 1일부터 12월 31일까지
                # 날짜 계산
                date_obj = datetime(2025, 1, 1) + timedelta(days=day_of_year - 1)
                date_md = date_obj.strftime('%m-%d')
                
                # 바이오리듬 계산
                physical, emotional, intellectual = self.calculate_biorhythm(day_of_year, blood_type)
                pattern = self.get_biorhythm_pattern(physical, emotional, intellectual)
                
                # 운세 메시지 생성
                fortune = self.generate_fortune_message(blood_type, day_of_year, physical, emotional, intellectual, pattern)
                
                # 데이터 삽입
                cursor.execute('''
                INSERT INTO daily_biorhythm 
                (blood_type, day_of_year, date_md, physical_score, emotional_score, intellectual_score,
                 overall_message, health_message, emotion_message, wisdom_message,
                 lucky_item, lucky_color, advice, famous_figure, figure_quote)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    blood_type, day_of_year, date_md, physical, emotional, intellectual,
                    fortune['overall'], fortune['health'], fortune['emotion'], fortune['wisdom'],
                    fortune['lucky_item'], fortune['lucky_color'], fortune['advice'],
                    fortune['famous_figure'], fortune['figure_quote']
                ))
                
                total_records += 1
                
                # 진행상황 표시
                if day_of_year % 50 == 0:
                    print(f"  {day_of_year}/365일 완료")
        
        conn.commit()
        conn.close()
        
        print(f"\n바이오리듬 운세 데이터 생성 완료!")
        print(f"총 {total_records}개 레코드 생성")
        print(f"혈액형별: {len(blood_types)}개 × 365일 = {total_records}개")

if __name__ == "__main__":
    generator = BiorhythmGenerator()
    generator.generate_all_data()