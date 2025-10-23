#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
월간운세 메시지 품질 개선 스크립트
"""

import json
import random

ZODIAC_INFO = {
    1: {"name": "양자리", "trait": "도전정신", "mood": "활기찬"},
    2: {"name": "황소자리", "trait": "인내심", "mood": "안정된"},
    3: {"name": "쌍둥이자리", "trait": "소통능력", "mood": "경쾌한"},
    4: {"name": "게자리", "trait": "감성", "mood": "따뜻한"},
    5: {"name": "사자자리", "trait": "리더십", "mood": "당당한"},
    6: {"name": "처녀자리", "trait": "계획성", "mood": "차분한"},
    7: {"name": "천칭자리", "trait": "균형감", "mood": "우아한"},
    8: {"name": "전갈자리", "trait": "집중력", "mood": "깊은"},
    9: {"name": "사수자리", "trait": "자유로움", "mood": "활발한"},
    10: {"name": "염소자리", "trait": "책임감", "mood": "진지한"},
    11: {"name": "물병자리", "trait": "독창성", "mood": "창의적인"},
    12: {"name": "물고기자리", "trait": "상상력", "mood": "감각적인"}
}

MONTH_NAMES = {
    '01': '1월', '02': '2월', '03': '3월', '04': '4월',
    '05': '5월', '06': '6월', '07': '7월', '08': '8월',
    '09': '9월', '10': '10월', '11': '11월', '12': '12월'
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

def improve_monthly_overall(zodiac_id, month_key, original):
    """월간 전체운 개선"""
    z = ZODIAC_INFO[zodiac_id]
    month_name = MONTH_NAMES.get(month_key.split('-')[1], '')

    patterns = [
        f"{month_name}은 {z['mood']} 에너지로 시작되는 달이에요.",
        f"이번 달은 {z['trait']}{get_particle_object(z['trait'])} 발휘할 기회가 많아요.",
        f"{month_name}은 차근차근 계획을 실행하기 좋아요.",
        f"새로운 시작과 변화가 기다리는 한 달이에요.",
        f"주변 사람들과의 관계가 돈독해지는 시기예요.",
    ]

    return random.choice(patterns)

def improve_monthly_love(zodiac_id, original):
    """월간 연애운 개선"""
    patterns = [
        f"솔직한 대화로 관계가 한층 깊어지는 달이에요.",
        f"특별한 이벤트를 계획해보면 좋아요.",
        f"서로에 대한 이해가 깊어지는 시기예요.",
        f"새로운 인연을 만날 기회가 있을 수 있어요.",
        f"함께하는 시간이 더욱 소중해지는 달이에요.",
        f"작은 배려가 큰 감동을 주는 한 달이에요.",
    ]

    return random.choice(patterns)

def improve_monthly_money(zodiac_id, original):
    """월간 금전운 개선"""
    patterns = [
        f"계획적인 지출과 저축이 중요한 달이에요.",
        f"장기적인 재정 목표를 세워보기 좋아요.",
        f"불필요한 지출은 줄이고 필요한 곳에 집중하세요.",
        f"안정적인 재정 관리가 도움이 되는 시기예요.",
        f"작은 절약이 모여 큰 결실을 맺을 거예요.",
        f"투자보다는 현상 유지가 좋은 달이에요.",
    ]

    return random.choice(patterns)

def improve_monthly_work(zodiac_id, original):
    """월간 업무운 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"{z['trait']}{get_particle_object(z['trait'])} 살려 일하면 성과가 보여요.",
        f"동료들과의 협력이 좋은 결과로 이어지는 달이에요.",
        f"꾸준히 집중하면 월말에 만족할 거예요.",
        f"새로운 프로젝트를 시작하기 좋은 타이밍이에요.",
        f"차분히 준비하면 기회가 찾아올 거예요.",
        f"능률적으로 일하면 여유도 생기는 달이에요.",
    ]

    return random.choice(patterns)

def improve_monthly_health(zodiac_id, original):
    """월간 건강운 개선"""
    patterns = [
        f"규칙적인 생활 리듬을 유지하는 게 중요해요.",
        f"충분한 휴식과 수면을 챙기세요.",
        f"운동 습관을 만들기 좋은 달이에요.",
        f"균형잡힌 식사와 스트레스 관리가 필요해요.",
        f"건강 검진을 받아보기 좋은 시기예요.",
        f"몸의 신호에 귀 기울이며 관리하세요.",
    ]

    return random.choice(patterns)

def main():
    print("🔄 월간운세 메시지 개선 시작...")

    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    monthly_data = data['monthly']
    total_months = len(monthly_data)
    print(f"📅 총 {total_months}개월 × 12별자리 = {total_months * 12}개 처리 예정\n")

    processed = 0

    for month_key, month_data in monthly_data.items():
        for zodiac_id in range(1, 13):
            zodiac_key = str(zodiac_id)
            if zodiac_key not in month_data:
                continue

            zdata = month_data[zodiac_key]

            # overall 개선
            zdata['overall'] = improve_monthly_overall(zodiac_id, month_key, zdata.get('overall', ''))

            # fortunes 개선
            if 'fortunes' in zdata:
                fortunes = zdata['fortunes']
                fortunes['love'] = improve_monthly_love(zodiac_id, fortunes.get('love', ''))
                fortunes['money'] = improve_monthly_money(zodiac_id, fortunes.get('money', ''))
                fortunes['work'] = improve_monthly_work(zodiac_id, fortunes.get('work', ''))
                fortunes['health'] = improve_monthly_health(zodiac_id, fortunes.get('health', ''))

            processed += 1

    # 저장
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료! {processed}개 메시지 개선됨")

    # 샘플
    sample = data['monthly']['2025-06']['1']
    print(f"\n📋 샘플 (2025-06 - 양자리):")
    print(f"overall: {sample['overall']}")
    print(f"love: {sample['fortunes']['love']}")
    print(f"work: {sample['fortunes']['work']}")

if __name__ == "__main__":
    main()
