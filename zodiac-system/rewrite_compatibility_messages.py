#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
궁합 메시지 품질 개선 스크립트
- 문법 오류 수정 (이/가 조사)
- "아름다운 조화를 이룹니다" 반복 제거
- 별자리 특성 기반 구체적 메시지 작성
- 점수별 톤 차별화
- 50자 이내 문장 구성
"""

import json
import re

# 별자리 정보 (ID, 이름, 원소, 특성)
ZODIAC_INFO = {
    1: {"name": "양자리", "element": "Fire", "trait1": "도전정신", "trait2": "추진력", "desc": "불타오르는"},
    2: {"name": "황소자리", "element": "Earth", "trait1": "인내심", "trait2": "꾸준함", "desc": "묵묵한"},
    3: {"name": "쌍둥이자리", "element": "Air", "trait1": "재치", "trait2": "소통능력", "desc": "영리한"},
    4: {"name": "게자리", "element": "Water", "trait1": "감성", "trait2": "배려심", "desc": "따뜻한"},
    5: {"name": "사자자리", "element": "Fire", "trait1": "카리스마", "trait2": "리더십", "desc": "당당한"},
    6: {"name": "처녀자리", "element": "Earth", "trait1": "실용성", "trait2": "계획성", "desc": "꼼꼼한"},
    7: {"name": "천칭자리", "element": "Air", "trait1": "조화", "trait2": "균형감", "desc": "우아한"},
    8: {"name": "전갈자리", "element": "Water", "trait1": "집중력", "trait2": "통찰력", "desc": "깊이있는"},
    9: {"name": "사수자리", "element": "Fire", "trait1": "자유로움", "trait2": "정직함", "desc": "솔직한"},
    10: {"name": "염소자리", "element": "Earth", "trait1": "책임감", "trait2": "목표지향", "desc": "신중한"},
    11: {"name": "물병자리", "element": "Air", "trait1": "독창성", "trait2": "인도주의", "desc": "창의적인"},
    12: {"name": "물고기자리", "element": "Water", "trait1": "상상력", "trait2": "공감능력", "desc": "감수성 풍부한"}
}

ELEMENT_NAMES = {
    "Fire": "불",
    "Earth": "땅",
    "Air": "바람",
    "Water": "물"
}

def get_particle_subject(word):
    """받침 여부에 따라 이/가 조사 반환"""
    if not word:
        return "이"

    last_char = word[-1]
    # 유니코드 한글 범위: AC00-D7A3
    if '가' <= last_char <= '힣':
        # 종성 = (유니코드 - 0xAC00) % 28
        code = ord(last_char) - 0xAC00
        jongseong = code % 28
        return "가" if jongseong == 0 else "이"
    return "이"

def get_particle_and(word):
    """받침 여부에 따라 와/과 조사 반환"""
    if not word:
        return "과"

    last_char = word[-1]
    # 유니코드 한글 범위: AC00-D7A3
    if '가' <= last_char <= '힣':
        # 종성 = (유니코드 - 0xAC00) % 28
        code = ord(last_char) - 0xAC00
        jongseong = code % 28
        return "와" if jongseong == 0 else "과"
    return "과"

def generate_improved_message(z1_id, z2_id, score):
    """개선된 궁합 메시지 생성"""
    z1 = ZODIAC_INFO[z1_id]
    z2 = ZODIAC_INFO[z2_id]

    same_sign = z1_id == z2_id
    same_element = z1["element"] == z2["element"]

    messages = []

    # 1. 오프닝 - 원소/특성 기반
    if same_sign:
        messages.append(f"두 분 모두 {z1['desc']} {z1['name']}시네요.")
        messages.append(f"서로를 가장 잘 이해할 수 있는 조합이에요.")
    elif same_element:
        element_kr = ELEMENT_NAMES[z1["element"]]
        messages.append(f"{element_kr}의 원소를 공유하는 조합이에요.")
        messages.append(f"{z1['name']}의 {z1['trait1']}{get_particle_and(z1['trait1'])} {z2['name']}의 {z2['trait1']}{get_particle_subject(z2['trait1'])} 잘 어울려요.")
    else:
        element1_kr = ELEMENT_NAMES[z1["element"]]
        element2_kr = ELEMENT_NAMES[z2["element"]]
        messages.append(f"{element1_kr}{get_particle_and(element1_kr)} {element2_kr}의 만남이에요.")
        messages.append(f"{z1['trait1']}{get_particle_and(z1['trait1'])} {z2['trait1']}{get_particle_subject(z2['trait1'])} 조화를 이뤄요.")

    # 2. 점수별 장점 설명
    if score >= 85:
        if same_element:
            messages.append(f"같은 방향을 보며 함께 성장할 수 있어요.")
            messages.append(f"장기적인 목표를 세우면 반드시 이룰 수 있답니다.")
        else:
            messages.append(f"서로 다른 강점이 완벽하게 보완돼요.")
            messages.append(f"함께하면 혼자일 때보다 훨씬 강해져요.")
    elif score >= 75:
        messages.append(f"서로에게서 배울 점이 많은 관계예요.")
        messages.append(f"차이를 인정하면 더욱 단단해질 수 있어요.")
    elif score >= 65:
        messages.append(f"대화를 통해 서로를 이해하는 시간이 필요해요.")
        messages.append(f"조금씩 맞춰가면 좋은 관계를 만들 수 있어요.")
    else:
        messages.append(f"성향이 많이 다르지만 나쁜 건 아니에요.")
        messages.append(f"차이를 존중하며 적당한 거리를 유지해보세요.")

    # 3. 구체적 조언
    if same_sign:
        messages.append(f"비슷한 만큼 경쟁보다는 협력에 집중해보세요.")
    elif score >= 85:
        messages.append(f"함께 웃는 시간을 자주 만들어보세요.")
    elif score >= 75:
        messages.append(f"서로의 속도를 존중해주는 게 중요해요.")
    elif score >= 65:
        messages.append(f"솔직한 대화가 관계를 더 깊게 만들어요.")
    else:
        messages.append(f"각자의 시간도 소중히 여기세요.")

    return " ".join(messages)

def main():
    # JSON 파일 읽기
    with open('/Volumes/X31/code/baal/zodiac-system/api/compatibility-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("🔄 궁합 메시지 재작성 시작...")
    print(f"📊 전체 조합 수: {len(data)}")

    improved_count = 0

    # 각 궁합 데이터 처리
    for key, item in data.items():
        z1_id = item["zodiac1_id"]
        z2_id = item["zodiac2_id"]
        score = item["overall_score"]

        # 새로운 메시지 생성
        new_message = generate_improved_message(z1_id, z2_id, score)

        # compat_message 업데이트
        item["compat_message"] = new_message

        improved_count += 1

        if improved_count % 10 == 0:
            print(f"✅ {improved_count}/{len(data)} 완료...")

    # 개선된 데이터 저장
    with open('/Volumes/X31/code/baal/zodiac-system/api/compatibility-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료! {improved_count}개 메시지 재작성됨")
    print(f"💾 저장 위치: /Volumes/X31/code/baal/zodiac-system/api/compatibility-data.json")

    # 샘플 출력
    print("\n📋 샘플 메시지 (양자리-양자리):")
    print(data["1-1"]["compat_message"])
    print("\n📋 샘플 메시지 (양자리-사자자리):")
    print(data["1-5"]["compat_message"])

if __name__ == "__main__":
    main()
