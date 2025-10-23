#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
연간운세 메시지 품질 개선 스크립트
"""

import json
import random

ZODIAC_INFO = {
    1: {"name": "양자리", "trait": "도전정신", "mood": "활기찬", "strength": "추진력"},
    2: {"name": "황소자리", "trait": "인내심", "mood": "안정된", "strength": "끈기"},
    3: {"name": "쌍둥이자리", "trait": "소통능력", "mood": "경쾌한", "strength": "유연성"},
    4: {"name": "게자리", "trait": "감성", "mood": "따뜻한", "strength": "배려심"},
    5: {"name": "사자자리", "trait": "리더십", "mood": "당당한", "strength": "카리스마"},
    6: {"name": "처녀자리", "trait": "계획성", "mood": "차분한", "strength": "분석력"},
    7: {"name": "천칭자리", "trait": "균형감", "mood": "우아한", "strength": "조율능력"},
    8: {"name": "전갈자리", "trait": "집중력", "mood": "깊은", "strength": "통찰력"},
    9: {"name": "사수자리", "trait": "자유로움", "mood": "활발한", "strength": "정직함"},
    10: {"name": "염소자리", "trait": "책임감", "mood": "진지한", "strength": "성실함"},
    11: {"name": "물병자리", "trait": "독창성", "mood": "창의적인", "strength": "혁신성"},
    12: {"name": "물고기자리", "trait": "상상력", "mood": "감각적인", "strength": "공감능력"}
}

def get_particle_object(word):
    if not word:
        return "을"
    last_char = word[-1]
    if '가' <= last_char <= '힣':
        code = ord(last_char) - 0xAC00
        jongseong = code % 28
        return "을" if jongseong != 0 else "를"
    return "을"

def improve_yearly_overall(zodiac_id, year, original):
    """연간 전체운 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"{year}년은 {z['mood']} 에너지가 한 해를 이끄는 해예요.",
        f"올해는 {z['trait']}{get_particle_object(z['trait'])} 발휘할 기회가 많은 해예요.",
        f"{year}년은 새로운 시작과 성장의 한 해가 될 거예요.",
        f"차근차근 계획을 실행하면 만족스러운 결과를 얻을 거예요.",
        f"{z['strength']}를 믿고 나아가는 한 해가 되세요.",
    ]

    return random.choice(patterns)

def improve_yearly_love(zodiac_id, original):
    """연간 연애운 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"솔직한 대화로 관계가 한층 깊어지는 한 해예요.",
        f"새로운 인연을 만날 기회가 있는 해예요.",
        f"서로에 대한 이해와 신뢰가 쌓이는 시기예요.",
        f"함께 성장하는 관계를 만들어갈 수 있어요.",
        f"특별한 추억을 많이 만들 수 있는 한 해예요.",
        f"{z['trait']}{get_particle_object(z['trait'])} 살려 사랑을 표현해보세요.",
    ]

    return random.choice(patterns)

def improve_yearly_money(zodiac_id, original):
    """연간 금전운 개선"""
    patterns = [
        f"계획적인 재정 관리가 중요한 한 해예요.",
        f"장기적인 투자 목표를 세워보기 좋은 시기예요.",
        f"꾸준한 저축이 안정을 가져다주는 해예요.",
        f"불필요한 지출을 줄이고 필요한 곳에 집중하세요.",
        f"재정 계획을 점검하고 정리하기 좋은 한 해예요.",
        f"작은 절약이 모여 큰 자산이 되는 시기예요.",
    ]

    return random.choice(patterns)

def improve_yearly_work(zodiac_id, original):
    """연간 업무운 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"{z['trait']}{get_particle_object(z['trait'])} 발휘하면 좋은 성과를 낼 거예요.",
        f"동료들과의 협력이 중요한 한 해예요.",
        f"새로운 도전을 시작하기 좋은 타이밍이에요.",
        f"꾸준히 노력하면 인정받을 기회가 올 거예요.",
        f"전문성을 키우는 데 집중하면 도움이 돼요.",
        f"{z['strength']}{get_particle_object(z['strength'])} 살려 일하면 능률이 오를 거예요.",
    ]

    return random.choice(patterns)

def improve_yearly_health(zodiac_id, original):
    """연간 건강운 개선"""
    patterns = [
        f"규칙적인 생활 습관을 만들기 좋은 한 해예요.",
        f"운동 루틴을 시작하고 꾸준히 유지해보세요.",
        f"균형잡힌 식사와 충분한 휴식이 중요해요.",
        f"정기 건강검진으로 몸 상태를 체크하세요.",
        f"스트레스 관리에 신경쓰는 한 해가 되세요.",
        f"마음 건강도 함께 챙기는 시기예요.",
    ]

    return random.choice(patterns)

def improve_key_advice(zodiac_id, original):
    """핵심 조언 개선 - 기존 인물명 유지"""
    z = ZODIAC_INFO[zodiac_id]

    # 기존 메시지에서 인물명 추출
    if '처럼' in original:
        person = original.split('처럼')[0].strip()

        patterns = [
            f"{person}처럼 올해를 의미있게 보내보세요.",
            f"{person}의 정신으로 한 해를 시작하세요.",
            f"{person}처럼 한 걸음씩 나아가보세요.",
            f"{person}을 떠올리며 도전해보세요.",
        ]
        return random.choice(patterns)

    # 인물명 없으면 기본 조언
    return f"{z['trait']}{get_particle_object(z['trait'])} 믿고 한 해를 시작하세요."

def main():
    print("🔄 연간운세 메시지 개선 시작...")

    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    yearly_data = data['yearly']
    total = len(yearly_data)
    print(f"📅 총 {total}개 별자리 처리 예정\n")

    processed = 0

    for zodiac_id in range(1, 13):
        zodiac_key = str(zodiac_id)
        if zodiac_key not in yearly_data:
            continue

        ydata = yearly_data[zodiac_key]
        year = ydata.get('year', 2025)

        # overall 개선
        ydata['overall'] = improve_yearly_overall(zodiac_id, year, ydata.get('overall', ''))

        # fortunes 개선
        if 'fortunes' in ydata:
            fortunes = ydata['fortunes']
            fortunes['love'] = improve_yearly_love(zodiac_id, fortunes.get('love', ''))
            fortunes['money'] = improve_yearly_money(zodiac_id, fortunes.get('money', ''))
            fortunes['work'] = improve_yearly_work(zodiac_id, fortunes.get('work', ''))
            fortunes['health'] = improve_yearly_health(zodiac_id, fortunes.get('health', ''))

        # keyAdvice 개선
        if 'keyAdvice' in ydata:
            ydata['keyAdvice'] = improve_key_advice(zodiac_id, ydata['keyAdvice'])

        processed += 1

    # 저장
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료! {processed}개 메시지 개선됨")

    # 샘플
    sample = data['yearly']['1']
    print(f"\n📋 샘플 (양자리 2025년):")
    print(f"overall: {sample['overall']}")
    print(f"love: {sample['fortunes']['love']}")
    print(f"work: {sample['fortunes']['work']}")
    print(f"keyAdvice: {sample['keyAdvice']}")

if __name__ == "__main__":
    main()
