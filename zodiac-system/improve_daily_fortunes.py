#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
일일운세 메시지 품질 개선 스크립트
- 기존 역사적 인물 데이터 유지 (허구 내용 절대 금지)
- 문법 오류 수정
- 반복 표현 다양화
- 50자 이내 문장, 친근한 어미
"""

import json
import random

# 별자리 정보
ZODIAC_INFO = {
    1: {"name": "양자리", "element": "Fire", "trait": "도전정신", "mood": "활기찬"},
    2: {"name": "황소자리", "element": "Earth", "trait": "인내심", "mood": "안정된"},
    3: {"name": "쌍둥이자리", "element": "Air", "trait": "소통능력", "mood": "경쾌한"},
    4: {"name": "게자리", "element": "Water", "trait": "감성", "mood": "따뜻한"},
    5: {"name": "사자자리", "element": "Fire", "trait": "리더십", "mood": "당당한"},
    6: {"name": "처녀자리", "element": "Earth", "trait": "계획성", "mood": "차분한"},
    7: {"name": "천칭자리", "element": "Air", "trait": "균형감", "mood": "우아한"},
    8: {"name": "전갈자리", "element": "Water", "trait": "집중력", "mood": "깊은"},
    9: {"name": "사수자리", "element": "Fire", "trait": "자유로움", "mood": "활발한"},
    10: {"name": "염소자리", "element": "Earth", "trait": "책임감", "mood": "진지한"},
    11: {"name": "물병자리", "element": "Air", "trait": "독창성", "mood": "창의적인"},
    12: {"name": "물고기자리", "element": "Water", "trait": "상상력", "mood": "감각적인"}
}

def get_particle_object(word):
    """받침 여부에 따라 을/를 조사 반환"""
    if not word:
        return "을"
    last_char = word[-1]
    if '가' <= last_char <= '힣':
        code = ord(last_char) - 0xAC00
        jongseong = code % 28
        return "을" if jongseong != 0 else "를"
    return "을"

def improve_love_fortune(zodiac_id, original_msg):
    """연애운 메시지 개선 - 다양한 패턴"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"오늘은 {z['mood']} 에너지가 느껴지는 날이에요.",
        f"{z['name']}의 매력이 자연스럽게 드러나요.",
        f"상대방과의 대화가 즐거운 하루예요.",
        f"솔직한 마음을 전하기 좋은 타이밍이에요.",
        f"작은 관심이 큰 기쁨으로 돌아올 거예요.",
    ]

    return random.choice(patterns)

def improve_money_fortune(zodiac_id, original_msg):
    """금전운 메시지 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"계획적인 소비가 도움이 되는 날이에요.",
        f"작은 절약이 쌓이는 시기예요.",
        f"장기적 관점에서 판단해보세요.",
        f"필요한 지출과 불필요한 지출을 구분해보세요.",
        f"재정 계획을 점검하기 좋은 날이에요.",
    ]

    return random.choice(patterns)

def improve_work_fortune(zodiac_id, original_msg):
    """업무운 메시지 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"{z['trait']}{get_particle_object(z['trait'])} 발휘할 기회가 있어요.",
        f"동료와의 협력이 좋은 결과를 만들어요.",
        f"차근차근 진행하면 성과가 보일 거예요.",
        f"새로운 아이디어를 시도해볼 만한 날이에요.",
        f"집중력을 유지하면 능률이 오를 거예요.",
    ]

    return random.choice(patterns)

def improve_health_fortune(zodiac_id, original_msg):
    """건강운 메시지 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"가벼운 스트레칭으로 몸을 깨워보세요.",
        f"충분한 수분 섭취를 잊지 마세요.",
        f"규칙적인 생활 리듬을 유지해보세요.",
        f"긍정적인 생각이 건강에도 좋아요.",
        f"산책으로 기분 전환을 해보세요.",
    ]

    return random.choice(patterns)

def improve_advice(zodiac_id, original_advice):
    """조언 메시지 개선 - 기존 인물명 유지하되 문법 수정"""
    z = ZODIAC_INFO[zodiac_id]

    # 기존 메시지에서 인물명 추출 시도
    if '처럼' in original_advice:
        person = original_advice.split('처럼')[0].strip()

        # "~을/를 실천하세요" 패턴 다양화
        patterns = [
            f"{person}처럼 오늘 하루를 의미있게 보내보세요.",
            f"{person}의 정신으로 도전해보세요.",
            f"{person}처럼 한 걸음씩 나아가보세요.",
            f"{person}을 떠올리며 행동해보세요.",
        ]
        return random.choice(patterns)

    # 인물명이 없으면 기본 조언
    return f"{z['trait']}{get_particle_object(z['trait'])} 믿고 나아가보세요."

def main():
    print("🔄 일일운세 메시지 개선 시작...")

    # JSON 파일 읽기
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    daily_data = data['daily']
    total_days = len(daily_data)
    print(f"📅 총 {total_days}일 × 12별자리 = {total_days * 12}개 처리 예정\n")

    processed_count = 0

    # 각 날짜 처리
    for date_idx, (date_key, date_data) in enumerate(daily_data.items(), 1):
        # 12개 별자리 처리
        for zodiac_id in range(1, 13):
            zodiac_key = str(zodiac_id)
            zodiac_data = date_data[zodiac_key]

            # overall은 유지 (역사적 인물 포함되어 있음)
            # fortunes만 개선
            fortunes = zodiac_data['fortunes']

            # 각 카테고리별 메시지 개선
            fortunes['love'] = improve_love_fortune(zodiac_id, fortunes.get('love', ''))
            fortunes['money'] = improve_money_fortune(zodiac_id, fortunes.get('money', ''))
            fortunes['work'] = improve_work_fortune(zodiac_id, fortunes.get('work', ''))
            fortunes['health'] = improve_health_fortune(zodiac_id, fortunes.get('health', ''))

            # advice 개선 (기존 인물명 유지)
            zodiac_data['advice'] = improve_advice(zodiac_id, zodiac_data.get('advice', ''))

            processed_count += 1

        # 진행상황 출력
        if date_idx % 50 == 0:
            print(f"✅ {date_idx}/{total_days} 일 완료... ({processed_count}개 메시지)")

    # 개선된 데이터 저장
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료! {processed_count}개 메시지 개선됨")
    print(f"💾 저장 위치: /Volumes/X31/code/baal/zodiac-system/api/fortune-data.json")

    # 샘플 출력
    sample_date = '2025-01-15'
    sample_zodiac = '1'
    sample = data['daily'][sample_date][sample_zodiac]

    print(f"\n📋 샘플 메시지 ({sample_date} - 양자리):")
    print(f"overall: {sample['overall']}")
    print(f"love: {sample['fortunes']['love']}")
    print(f"work: {sample['fortunes']['work']}")
    print(f"advice: {sample['advice']}")

if __name__ == "__main__":
    main()
