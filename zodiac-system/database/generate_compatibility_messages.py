#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sqlite3
import random
from datetime import datetime

# 별자리별 핵심 특성 및 키워드
ZODIAC_TRAITS = {
    1: {  # 양자리
        'name': '양자리',
        'element': '불',
        'keywords': ['활동적', '도전적', '열정적', '리더십', '모험적', '자발적'],
        'positive': ['추진력', '결단력', '용기', '독립성'],
        'negative': ['성급함', '충동적', '경쟁적', '독선적']
    },
    2: {  # 황소자리
        'name': '황소자리',
        'element': '흙',
        'keywords': ['안정적', '실용적', '끈기있는', '신중한', '물질적', '감각적'],
        'positive': ['인내력', '현실성', '충실함', '안정감'],
        'negative': ['고집', '보수적', '변화거부', '완고함']
    },
    3: {  # 쌍둥이자리
        'name': '쌍둥이자리',
        'element': '바람',
        'keywords': ['다재다능', '호기심', '소통', '변화', '적응력', '지적'],
        'positive': ['유연성', '창의력', '사교성', '학습력'],
        'negative': ['변덕', '집중력부족', '피상적', '불안정']
    },
    4: {  # 게자리
        'name': '게자리',
        'element': '물',
        'keywords': ['감정적', '보호적', '가족적', '직감적', '배려', '민감한'],
        'positive': ['공감능력', '보살핌', '직관력', '충성심'],
        'negative': ['감정기복', '의존성', '과민함', '폐쇄적']
    },
    5: {  # 사자자리
        'name': '사자자리',
        'element': '불',
        'keywords': ['자신감', '창조적', '관대한', '드라마틱', '리더십', '자존감'],
        'positive': ['카리스마', '관용성', '창의력', '낙관적'],
        'negative': ['자만심', '고집', '과시욕', '지배욕']
    },
    6: {  # 처녀자리
        'name': '처녀자리',
        'element': '흙',
        'keywords': ['완벽주의', '분석적', '실용적', '세심한', '봉사', '체계적'],
        'positive': ['정확성', '근면함', '분석력', '책임감'],
        'negative': ['비판적', '걱정', '까다로움', '경직성']
    },
    7: {  # 천칭자리
        'name': '천칭자리',
        'element': '바람',
        'keywords': ['조화', '균형', '사교적', '미적감각', '외교적', '공정함'],
        'positive': ['조율능력', '예술감각', '사교성', '공정성'],
        'negative': ['우유부단', '의존성', '갈등회피', '피상적']
    },
    8: {  # 전갈자리
        'name': '전갈자리',
        'element': '물',
        'keywords': ['강렬함', '신비로운', '변화', '깊이', '집중력', '직관'],
        'positive': ['통찰력', '집중력', '충성심', '변화력'],
        'negative': ['질투', '복수심', '집착', '의심']
    },
    9: {  # 사수자리
        'name': '사수자리',
        'element': '불',
        'keywords': ['자유로운', '철학적', '모험', '낙관적', '학습', '확장'],
        'positive': ['개방성', '철학적사고', '낙관주의', '모험심'],
        'negative': ['무책임', '과장', '경솔함', '약속파기']
    },
    10: {  # 염소자리
        'name': '염소자리',
        'element': '흙',
        'keywords': ['목표지향', '책임감', '전통적', '성취', '인내', '현실적'],
        'positive': ['목표달성력', '책임감', '지구력', '리더십'],
        'negative': ['경직성', '비관적', '냉정함', '권위적']
    },
    11: {  # 물병자리
        'name': '물병자리',
        'element': '바람',
        'keywords': ['독창적', '인도주의', '자유', '혁신', '친구', '미래지향'],
        'positive': ['창의성', '독립성', '인도주의', '혁신성'],
        'negative': ['고집', '감정적거리감', '예측불가', '반항적']
    },
    12: {  # 물고기자리
        'name': '물고기자리',
        'element': '물',
        'keywords': ['감성적', '직관적', '상상력', '동정심', '예술적', '희생'],
        'positive': ['공감능력', '예술성', '직관력', '동정심'],
        'negative': ['현실도피', '우유부단', '의존성', '피해의식']
    }
}

# 원소별 궁합 매트릭스 (불, 흙, 바람, 물)
ELEMENT_COMPATIBILITY = {
    ('불', '불'): '뜨거운 열정과 에너지가 만나 역동적인 관계를 형성합니다.',
    ('불', '흙'): '정열과 안정성이 조화를 이루며 실질적인 성과를 만들어냅니다.',
    ('불', '바람'): '활동력과 창의성이 결합되어 흥미롭고 자극적인 관계가 됩니다.',
    ('불', '물'): '열정과 감성이 만나 깊은 감동을 주는 특별한 관계를 만듭니다.',
    ('흙', '흙'): '서로의 안정성을 이해하며 신뢰할 수 있는 든든한 관계입니다.',
    ('흙', '바람'): '현실성과 창의성이 균형을 이루며 상호 보완적인 관계가 됩니다.',
    ('흙', '물'): '실용성과 감성이 어우러져 따뜻하고 안정적인 유대감을 형성합니다.',
    ('바람', '바람'): '아이디어와 소통이 활발한 지적이고 자유로운 관계를 만듭니다.',
    ('바람', '물'): '지성과 감성이 조화를 이루며 창의적이고 섬세한 관계가 됩니다.',
    ('물', '물'): '깊은 감정 교류와 직관적 이해로 영혼의 교감을 나누는 관계입니다.'
}

def calculate_compatibility_score(sign1_id, sign2_id):
    """별자리 조합별 궁합 점수 계산"""
    # 기존 데이터베이스의 점수를 사용
    return None  # 기존 점수 유지

def get_element_compatibility_message(element1, element2):
    """원소별 기본 궁합 메시지 생성"""
    key1 = (element1, element2)
    key2 = (element2, element1)
    
    if key1 in ELEMENT_COMPATIBILITY:
        return ELEMENT_COMPATIBILITY[key1]
    elif key2 in ELEMENT_COMPATIBILITY:
        return ELEMENT_COMPATIBILITY[key2]
    else:
        return "서로 다른 특성이 만나 독특하고 흥미로운 관계를 형성합니다."

def generate_compatibility_message(sign1_id, sign2_id, overall_score):
    """궁합 메시지 생성"""
    trait1 = ZODIAC_TRAITS[sign1_id]
    trait2 = ZODIAC_TRAITS[sign2_id]
    
    # 원소 궁합 기본 메시지
    base_message = get_element_compatibility_message(trait1['element'], trait2['element'])
    
    # 점수에 따른 평가
    if overall_score >= 90:
        score_msg = "매우 뛰어난 궁합"
        advice = "서로를 깊이 이해하고 존중하며 함께 성장해 나가세요."
    elif overall_score >= 80:
        score_msg = "훌륭한 궁합"
        advice = "서로의 장점을 살리고 차이점을 인정하며 관계를 발전시켜 나가세요."
    elif overall_score >= 70:
        score_msg = "좋은 궁합"
        advice = "소통을 통해 서로를 더 잘 이해하고 배려하는 마음을 가지세요."
    elif overall_score >= 60:
        score_msg = "보통 궁합"
        advice = "차이점을 받아들이고 인내심을 가지며 관계를 키워나가세요."
    else:
        score_msg = "도전적인 궁합"
        advice = "서로 다른 점을 장점으로 받아들이고 노력하면 특별한 관계가 될 수 있습니다."
    
    # 특성 기반 구체적 조언 생성
    if sign1_id == sign2_id:
        # 같은 별자리
        specific_advice = f"같은 {trait1['name']}끼리 만나 서로의 특성을 완벽히 이해할 수 있는 관계입니다. 다만 같은 약점을 공유할 수 있으니 균형을 위해 노력하세요."
    else:
        # 다른 별자리
        positive_combination = f"{trait1['name']}의 {random.choice(trait1['positive'])}과 {trait2['name']}의 {random.choice(trait2['positive'])}이 조화를 이룹니다."
        
        # 주의할 점
        potential_issue = f"다만 {trait1['name']}의 {random.choice(trait1['negative'])} 성향과 {trait2['name']}의 {random.choice(trait2['negative'])} 성향이 충돌할 수 있으니 주의하세요."
        
        specific_advice = f"{positive_combination} {potential_issue}"
    
    # 최종 메시지 조합
    final_message = f"{base_message} {score_msg}으로 평가됩니다. {specific_advice} {advice}"
    
    return final_message

def update_compatibility_messages():
    """데이터베이스의 모든 궁합 조합에 메시지 업데이트"""
    conn = sqlite3.connect('zodiac_fortunes.db')
    cursor = conn.cursor()
    
    # 모든 궁합 데이터 가져오기
    cursor.execute('''
    SELECT id, zodiac1_id, zodiac2_id, overall_score 
    FROM compatibility_fortunes_data
    ORDER BY zodiac1_id, zodiac2_id
    ''')
    
    combinations = cursor.fetchall()
    updated_count = 0
    
    print(f"총 {len(combinations)}개의 궁합 조합 메시지를 생성합니다...")
    
    for combo_id, sign1_id, sign2_id, overall_score in combinations:
        try:
            # 메시지 생성
            message = generate_compatibility_message(sign1_id, sign2_id, overall_score)
            
            # 데이터베이스 업데이트
            cursor.execute('''
            UPDATE compatibility_fortunes_data 
            SET compat_message = ?
            WHERE id = ?
            ''', (message, combo_id))
            
            updated_count += 1
            
            sign1_name = ZODIAC_TRAITS[sign1_id]['name']
            sign2_name = ZODIAC_TRAITS[sign2_id]['name']
            print(f"{updated_count:2d}. {sign1_name} - {sign2_name} (점수: {overall_score}) - 메시지 생성 완료")
            
        except Exception as e:
            print(f"오류 발생 - 조합 ID {combo_id}: {str(e)}")
    
    # 변경사항 저장
    conn.commit()
    conn.close()
    
    print(f"\n완료: {updated_count}개의 궁합 메시지가 성공적으로 생성되었습니다.")
    return updated_count

if __name__ == "__main__":
    print("=== 별자리 궁합 메시지 생성 시작 ===")
    print(f"생성 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    updated = update_compatibility_messages()
    
    print("=== 궁합 메시지 생성 완료 ===")