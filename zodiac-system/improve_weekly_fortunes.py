#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
주간운세 메시지 품질 개선 스크립트
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

def get_particle_object(word):
    if not word:
        return "을"
    last_char = word[-1]
    if '가' <= last_char <= '힣':
        code = ord(last_char) - 0xAC00
        jongseong = code % 28
        return "을" if jongseong != 0 else "를"
    return "을"

def improve_weekly_overall(zodiac_id, original):
    """주간 전체운 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"이번 주는 {z['mood']} 에너지가 흐르는 한 주예요.",
        f"{z['trait']}{get_particle_object(z['trait'])} 발휘할 기회가 많아요.",
        f"차근차근 계획을 실행하기 좋은 주간이에요.",
        f"새로운 시작을 준비하기 좋은 타이밍이에요.",
        f"주변 사람들과의 관계가 돈독해지는 시기예요.",
    ]

    return random.choice(patterns)

def improve_weekly_love(zodiac_id, original):
    """주간 연애운 개선"""
    patterns = [
        f"솔직한 대화로 관계가 깊어지는 한 주예요.",
        f"주말에 특별한 시간을 만들어보세요.",
        f"작은 배려가 큰 감동을 줄 거예요.",
        f"새로운 만남의 기회가 있을 수 있어요.",
        f"함께하는 시간이 즐거운 한 주가 될 거예요.",
    ]

    return random.choice(patterns)

def improve_weekly_money(zodiac_id, original):
    """주간 금전운 개선"""
    patterns = [
        f"계획적인 지출이 중요한 한 주예요.",
        f"장기적인 재정 계획을 세워보기 좋아요.",
        f"불필요한 지출은 줄이고 저축에 집중해보세요.",
        f"투자보다는 안정적인 관리가 좋아요.",
        f"작은 절약이 모이는 시기예요.",
    ]

    return random.choice(patterns)

def improve_weekly_work(zodiac_id, original):
    """주간 업무운 개선"""
    z = ZODIAC_INFO[zodiac_id]

    patterns = [
        f"{z['trait']}{get_particle_object(z['trait'])} 살려 일하면 좋아요.",
        f"동료들과의 협력이 좋은 결과를 만들어요.",
        f"차분히 집중하면 성과가 보이는 주예요.",
        f"새로운 프로젝트 시작에 적합한 시기예요.",
        f"꾸준히 진행하면 주말엔 만족할 거예요.",
    ]

    return random.choice(patterns)

def improve_weekly_health(zodiac_id, original):
    """주간 건강운 개선"""
    patterns = [
        f"규칙적인 생활 리듬을 유지해보세요.",
        f"충분한 휴식이 중요한 한 주예요.",
        f"가벼운 운동으로 활력을 되찾아보세요.",
        f"균형잡힌 식사와 수분 섭취를 챙기세요.",
        f"스트레스 관리에 신경써보세요.",
    ]

    return random.choice(patterns)

def main():
    print("🔄 주간운세 메시지 개선 시작...")

    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    weekly_data = data['weekly']
    total_weeks = len(weekly_data)
    print(f"📅 총 {total_weeks}주 × 12별자리 = {total_weeks * 12}개 처리 예정\n")

    processed = 0

    for week_idx, (week_key, week_data) in enumerate(weekly_data.items(), 1):
        for zodiac_id in range(1, 13):
            zodiac_key = str(zodiac_id)
            if zodiac_key not in week_data:
                continue

            zdata = week_data[zodiac_key]

            # overall 개선
            zdata['overall'] = improve_weekly_overall(zodiac_id, zdata.get('overall', ''))

            # fortunes 개선
            if 'fortunes' in zdata:
                fortunes = zdata['fortunes']
                fortunes['love'] = improve_weekly_love(zodiac_id, fortunes.get('love', ''))
                fortunes['money'] = improve_weekly_money(zodiac_id, fortunes.get('money', ''))
                fortunes['work'] = improve_weekly_work(zodiac_id, fortunes.get('work', ''))
                fortunes['health'] = improve_weekly_health(zodiac_id, fortunes.get('health', ''))

            processed += 1

        if week_idx % 10 == 0:
            print(f"✅ {week_idx}/{total_weeks} 주 완료... ({processed}개)")

    # 저장
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료! {processed}개 메시지 개선됨")

    # 샘플 출력
    sample = data['weekly']['2025-W10']['1']
    print(f"\n📋 샘플 (2025-W10 - 양자리):")
    print(f"overall: {sample['overall']}")
    print(f"love: {sample['fortunes']['love']}")
    print(f"work: {sample['fortunes']['work']}")

if __name__ == "__main__":
    main()
