#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Overall 메시지 수정
- 양자리(1)만 역사적 인물 유지
- 다른 별자리(2-12)는 일반적인 메시지로 변경
"""

import json
from datetime import datetime, timedelta

# 별자리별 일반 overall 패턴
ZODIAC_PATTERNS = {
    2: ["안정된 하루가 펼쳐질 거예요.", "차근차근 진행하기 좋은 날이에요.", "편안한 마음으로 시작해보세요."],
    3: ["소통이 활발한 하루예요.", "다양한 만남이 즐거운 날이에요.", "새로운 이야기가 기다리는 하루예요."],
    4: ["따뜻한 감성이 느껴지는 날이에요.", "소중한 사람과의 시간이 의미있는 하루예요.", "마음이 편안해지는 하루예요."],
    5: ["당당하게 표현하기 좋은 날이에요.", "자신감이 빛나는 하루예요.", "리더십을 발휘할 기회가 있어요."],
    6: ["차분하게 계획을 세우기 좋은 날이에요.", "꼼꼼한 준비가 빛을 발하는 하루예요.", "체계적으로 진행하면 좋은 결과가 있을 거예요."],
    7: ["균형잡힌 선택을 할 수 있는 날이에요.", "조화로운 하루가 될 거예요.", "우아한 대처가 빛나는 날이에요."],
    8: ["집중력이 발휘되는 하루예요.", "깊이있는 생각이 도움이 되는 날이에요.", "신중한 판단이 필요한 시기예요."],
    9: ["자유롭게 도전해보기 좋은 날이에요.", "활발한 에너지가 느껴지는 하루예요.", "새로운 경험을 즐길 수 있어요."],
    10: ["책임감있는 행동이 인정받는 날이에요.", "진지하게 임하면 좋은 결과가 있을 거예요.", "차분한 판단이 빛을 발해요."],
    11: ["독창적인 아이디어가 떠오르는 날이에요.", "창의적인 생각을 펼쳐보세요.", "자유로운 발상이 환영받는 하루예요."],
    12: ["감각적인 판단이 도움이 되는 날이에요.", "상상력을 발휘해보기 좋은 하루예요.", "직관을 믿어보세요."]
}

def generate_overall_message(zodiac_id, date_str):
    """별자리별 overall 메시지 생성 (양자리 제외)"""
    if zodiac_id == 1:
        return None  # 양자리는 유지

    # 날짜 기반 시드로 패턴 선택
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    seed = (date_obj.month * 31 + date_obj.day + zodiac_id) % len(ZODIAC_PATTERNS[zodiac_id])

    month = date_obj.month
    day = date_obj.day
    pattern = ZODIAC_PATTERNS[zodiac_id][seed]

    return f"{month}월 {day}일, {pattern}"

def main():
    print("🔄 Overall 메시지 수정 시작...")

    # fortune-data.json 로드
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    daily_data = data['daily']
    modified_count = 0

    # 각 날짜의 2-12번 별자리 overall 수정
    for date_key, date_data in daily_data.items():
        for zodiac_id in range(2, 13):
            zodiac_key = str(zodiac_id)
            new_overall = generate_overall_message(zodiac_id, date_key)

            if new_overall:
                date_data[zodiac_key]['overall'] = new_overall
                modified_count += 1

    # 저장
    with open('/Volumes/X31/code/baal/zodiac-system/api/fortune-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ 완료! {modified_count}개 overall 메시지 수정됨")
    print(f"💾 저장 위치: /Volumes/X31/code/baal/zodiac-system/api/fortune-data.json")

    # 샘플 출력
    print("\n📋 샘플 메시지 (2025-10-15):")
    for zid in [1, 2, 3]:
        overall = data['daily']['2025-10-15'][str(zid)]['overall']
        print(f"{zid}번 별자리: {overall}")

if __name__ == "__main__":
    main()
