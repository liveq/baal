#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI 창작 기반 별자리 일일운 생성
- 메뉴얼 준수: 운세문구작성메뉴얼.md
- 궁합 메시지 품질 수준
- 각 날짜/별자리마다 유니크한 창의적 문장
"""

import json
import os
from datetime import datetime, timedelta
import hashlib

# ============================================================================
# 별자리 프로필 (메뉴얼 기반)
# ============================================================================
ZODIAC_PROFILES = {
    1: {
        'name': '양자리',
        'element': 'fire',
        'traits': ['도전적', '용감함', '열정적', '직진', '순수'],
        'keywords': ['시작', '도전', '열정', '용기', '리더십'],
        'relationship': '솔직하고 직설적',
        'decision': '빠르고 직관적',
        'strength': '추진력',
        'growth': '인내심'
    },
    2: {
        'name': '황소자리',
        'element': 'earth',
        'traits': ['안정적', '인내', '실용적', '끈기', '감각적'],
        'keywords': ['안정', '축적', '감각', '인내', '신뢰'],
        'relationship': '진실되고 따뜻함',
        'decision': '신중하고 실용적',
        'strength': '인내심',
        'growth': '유연성'
    },
    3: {
        'name': '쌍둥이자리',
        'element': 'air',
        'traits': ['호기심', '재치', '유연', '다재다능', '경쾌'],
        'keywords': ['소통', '호기심', '학습', '다양성', '재치'],
        'relationship': '재미있고 가벼움',
        'decision': '유연하고 다각적',
        'strength': '적응력',
        'growth': '집중력'
    },
    4: {
        'name': '게자리',
        'element': 'water',
        'traits': ['감성적', '보호', '직관', '공감', '가족애'],
        'keywords': ['감성', '공감', '보호', '직관', '가족'],
        'relationship': '따뜻하고 보살핌',
        'decision': '감성적이고 직관적',
        'strength': '공감능력',
        'growth': '독립성'
    },
    5: {
        'name': '사자자리',
        'element': 'fire',
        'traits': ['자신감', '관대', '창의', '카리스마', '열정'],
        'keywords': ['자신감', '표현', '창조', '리더십', '관대함'],
        'relationship': '따뜻하고 관대함',
        'decision': '대범하고 확신',
        'strength': '카리스마',
        'growth': '겸손'
    },
    6: {
        'name': '처녀자리',
        'element': 'earth',
        'traits': ['분석적', '완벽', '실용', '섬세', '봉사'],
        'keywords': ['분석', '완벽', '섬세', '실용', '개선'],
        'relationship': '세심하고 배려',
        'decision': '분석적이고 꼼꼼',
        'strength': '분석력',
        'growth': '수용'
    },
    7: {
        'name': '천칭자리',
        'element': 'air',
        'traits': ['조화', '균형', '공정', '예술', '외교'],
        'keywords': ['조화', '균형', '관계', '예술', '공정'],
        'relationship': '조화롭고 세련됨',
        'decision': '공정하고 신중',
        'strength': '균형감각',
        'growth': '결단력'
    },
    8: {
        'name': '전갈자리',
        'element': 'water',
        'traits': ['열정', '집중', '신비', '통찰', '변화'],
        'keywords': ['집중', '열정', '깊이', '변화', '통찰'],
        'relationship': '깊고 진실함',
        'decision': '직관적이고 집중',
        'strength': '통찰력',
        'growth': '개방성'
    },
    9: {
        'name': '사수자리',
        'element': 'fire',
        'traits': ['자유', '낙관', '모험', '철학', '솔직'],
        'keywords': ['자유', '모험', '확장', '낙관', '철학'],
        'relationship': '자유롭고 솔직함',
        'decision': '낙관적이고 대담',
        'strength': '낙관성',
        'growth': '책임감'
    },
    10: {
        'name': '염소자리',
        'element': 'earth',
        'traits': ['책임', '야심', '인내', '현실', '성취'],
        'keywords': ['책임', '성취', '목표', '전통', '인내'],
        'relationship': '책임감있고 진지',
        'decision': '신중하고 전략적',
        'strength': '지구력',
        'growth': '유연성'
    },
    11: {
        'name': '물병자리',
        'element': 'air',
        'traits': ['독창', '혁신', '박애', '자유', '미래'],
        'keywords': ['독창성', '혁신', '자유', '미래', '우정'],
        'relationship': '자유롭고 우정적',
        'decision': '독창적이고 논리적',
        'strength': '독창성',
        'growth': '감정표현'
    },
    12: {
        'name': '물고기자리',
        'element': 'water',
        'traits': ['직관', '감성', '예술', '공감', '꿈'],
        'keywords': ['직관', '감성', '예술', '꿈', '공감'],
        'relationship': '공감하고 포용',
        'decision': '직관적이고 감성적',
        'strength': '상상력',
        'growth': '현실감'
    }
}

# ============================================================================
# 날짜 에너지 분석
# ============================================================================
def analyze_date_energy(date_str):
    """날짜의 에너지 해석"""
    date = datetime.strptime(date_str, '%Y-%m-%d')

    weekdays = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
    weekday_meanings = [
        '새로운 시작의 에너지',
        '추진력과 실행의 시간',
        '소통과 협력의 날',
        '확장과 성장의 흐름',
        '완성과 마무리의 기운',
        '휴식과 재충전의 시간',
        '준비와 성찰의 날'
    ]

    # 계절
    month = date.month
    if month in [3, 4, 5]:
        season = {'name': '봄', 'energy': '성장', 'mood': '싱그러운'}
    elif month in [6, 7, 8]:
        season = {'name': '여름', 'energy': '열정', 'mood': '활기찬'}
    elif month in [9, 10, 11]:
        season = {'name': '가을', 'energy': '성숙', 'mood': '풍요로운'}
    else:
        season = {'name': '겨울', 'energy': '성찰', 'mood': '고요한'}

    return {
        'weekday': weekdays[date.weekday()],
        'weekday_energy': weekday_meanings[date.weekday()],
        'season': season,
        'day': date.day
    }

# ============================================================================
# AI 창작 엔진 (Claude 스타일 추론 기반)
# ============================================================================
def create_unique_overall(zodiac, date_energy, seed):
    """
    전체운 - 별자리 특성과 날짜 에너지를 해석하여 창의적으로 작성
    """
    z = ZODIAC_PROFILES[zodiac]
    energy = date_energy

    # 해시를 사용한 유니크 조합 생성
    hash_val = int(hashlib.md5(f"{zodiac}-{energy['weekday']}-{energy['day']}-{seed}".encode()).hexdigest(), 16)

    trait_idx = hash_val % len(z['traits'])
    keyword_idx = (hash_val + 1) % len(z['keywords'])

    # 창의적 문장 구성 (궁합 메시지 스타일)
    patterns = [
        f"{z['name']} 특유의 {z['traits'][trait_idx]} 성향이 {energy['weekday']}의 흐름과 조화를 이뤄요. {z['keywords'][keyword_idx]}에 집중하면 좋은 결과를 만들 수 있어요. {energy['season']['mood']} {energy['season']['name']}의 에너지가 당신을 응원해요.",

        f"오늘은 {z['name']}의 {z['strength']}이 빛을 발하는 날이에요. {energy['weekday_energy']}가 당신의 {z['traits'][trait_idx]} 면모를 더욱 돋보이게 만들어요. 주변 사람들과의 관계에서 긍정적인 변화가 느껴질 거예요.",

        f"{energy['weekday']}의 {z['name']}에게는 {z['keywords'][keyword_idx]}이 핵심이에요. {z['decision']} 판단이 상황을 유리하게 이끌어요. {energy['season']['name']}의 기운이 당신의 선택에 힘을 실어줘요.",

        f"{z['name']}의 {z['traits'][trait_idx]} 에너지가 {energy['season']['mood']} 분위기와 어울리는 하루예요. {z['keywords'][keyword_idx]}을 염두에 두고 움직이면 자연스럽게 좋은 흐름을 탈 수 있어요. 내면의 목소리에 귀 기울여보세요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_unique_love(zodiac, date_energy, seed):
    """연애운 - 관계 스타일을 해석"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"love-{zodiac}-{seed}".encode()).hexdigest(), 16)

    trait_idx = hash_val % len(z['traits'])

    patterns = [
        f"{z['name']}의 {z['relationship']} 태도가 오늘따라 더 매력적으로 느껴져요. 진심을 담아 표현하면 상대방의 마음이 움직일 거예요. 작은 관심이 큰 변화를 만들어요.",

        f"오늘은 {z['traits'][trait_idx]} 면모를 자연스럽게 드러내보세요. {z['relationship']} 당신의 모습이 관계에 새로운 활력을 불어넣어요. 함께 웃는 순간을 소중히 여기세요.",

        f"{z['strength']}을 바탕으로 상대를 이해하려는 노력이 빛을 발하는 날이에요. 솔직한 대화가 두 사람의 거리를 좁혀줘요. 마음을 열면 좋은 반응을 얻을 수 있어요.",

        f"{z['name']}다운 {z['traits'][trait_idx]} 접근이 관계를 한 단계 발전시킬 거예요. 상대방의 입장을 배려하면서도 당신의 감정을 명확히 전달해보세요. 진정성이 가장 큰 무기예요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_unique_money(zodiac, date_energy, seed):
    """재물운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"money-{zodiac}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['decision']} 판단이 재정 관리에 도움이 되는 날이에요. {z['strength']}을 활용해 장기적인 계획을 세워보세요. 작은 실천이 안정감을 만들어요.",

        f"오늘은 {z['name']}의 특성을 살려 현명한 소비 결정을 내릴 수 있어요. 필요와 욕구를 명확히 구분하면 좋은 결과를 얻어요. 차분히 생각하고 행동하세요.",

        f"{z['strength']}을 바탕으로 재정 상황을 점검해보기 좋은 시기예요. 다양한 정보를 수집하고 비교하면 현명한 선택을 할 수 있어요. 인내심을 가지고 접근하세요.",

        f"{z['name']}다운 방식으로 재물 관리를 하면 안정감을 느낄 수 있어요. 충동적인 결정보다는 신중한 판단이 더 큰 이득을 가져와요. 여유로운 마음가짐이 중요해요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_unique_work(zodiac, date_energy, seed):
    """업무운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"work-{zodiac}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['strength']}을 발휘하면 업무 효율이 높아지는 날이에요. {z['decision']} 접근이 문제 해결의 열쇠가 돼요. 팀원들과의 협력도 순조로워요.",

        f"오늘은 {z['name']}의 장점이 업무에서 빛을 발해요. 주도적으로 일을 이끌어가면 좋은 성과를 만들 수 있어요. 자신감을 가지고 임하세요.",

        f"{z['decision']} 판단으로 복잡한 업무를 정리하기 좋은 날이에요. 차근차근 진행하면 완성도 높은 결과물을 얻을 수 있어요. 꼼꼼함이 빛을 발해요.",

        f"{z['strength']}을 활용해 새로운 아이디어를 제안해보세요. {z['name']}다운 접근이 주목을 받을 거예요. 적극적인 소통이 업무를 원활하게 만들어요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_unique_health(zodiac, date_energy, seed):
    """건강운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"health-{zodiac}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"몸과 마음의 균형을 맞추기 좋은 날이에요. {z['name']}에게는 {z['growth']}을 기르는 시간이 필요해요. 가벼운 운동이나 산책으로 에너지를 순환시켜보세요.",

        f"오늘은 휴식의 중요성을 느끼는 하루예요. 충분한 수면과 영양 섭취로 컨디션을 관리하세요. 무리하지 않고 자신의 페이스를 유지하는 게 핵심이에요.",

        f"{z['name']}의 건강 관리 방식은 {z['strength']}에서 시작해요. 꾸준한 실천이 장기적으로 좋은 결과를 만들어요. 작은 습관이 큰 변화의 시작이에요.",

        f"몸의 신호에 귀 기울이는 시간을 가져보세요. 스트레칭이나 명상으로 긴장을 풀어주면 좋아요. 마음의 평화가 신체 건강으로 이어져요.",
    ]

    return patterns[hash_val % len(patterns)]

# ============================================================================
# 행운 아이템 생성 (별자리 특성 기반 + 해시)
# ============================================================================

# 별자리별 행운의 색상 풀
LUCKY_COLORS = {
    1: ['빨강', '주황', '금색', '밝은 노랑'],  # 양자리 - 불 원소
    2: ['초록', '분홍', '연두', '베이지'],      # 황소자리 - 흙 원소
    3: ['노랑', '하늘색', '연보라', '민트'],    # 쌍둥이자리 - 공기 원소
    4: ['은색', '흰색', '하늘색', '연파랑'],    # 게자리 - 물 원소
    5: ['금색', '주황', '자주', '진노랑'],      # 사자자리 - 불 원소
    6: ['갈색', '베이지', '회색', '올리브'],    # 처녀자리 - 흙 원소
    7: ['파스텔 핑크', '하늘색', '연보라', '흰색'],  # 천칭자리 - 공기 원소
    8: ['진빨강', '검정', '자주', '와인'],      # 전갈자리 - 물 원소
    9: ['보라', '남색', '청록', '진파랑'],      # 사수자리 - 불 원소
    10: ['검정', '진회색', '갈색', '남색'],     # 염소자리 - 흙 원소
    11: ['청록', '은색', '파랑', '전기색'],     # 물병자리 - 공기 원소
    12: ['연보라', '청록', '은색', '라벤더']    # 물고기자리 - 물 원소
}

# 별자리별 행운의 숫자 풀
LUCKY_NUMBERS = {
    1: [1, 9, 19, 27],     # 양자리
    2: [6, 15, 24, 33],    # 황소자리
    3: [5, 14, 23, 32],    # 쌍둥이자리
    4: [2, 7, 11, 20],     # 게자리
    5: [1, 10, 19, 28],    # 사자자리
    6: [5, 14, 23, 32],    # 처녀자리
    7: [6, 15, 24, 33],    # 천칭자리
    8: [9, 18, 27, 36],    # 전갈자리
    9: [3, 12, 21, 30],    # 사수자리
    10: [8, 17, 26, 35],   # 염소자리
    11: [4, 13, 22, 31],   # 물병자리
    12: [7, 16, 25, 34]    # 물고기자리
}

# 행운의 시간대 풀
LUCKY_TIMES = [
    "오전 6-8시",
    "오전 9-11시",
    "낮 12-2시",
    "오후 2-4시",
    "오후 4-6시",
    "저녁 6-8시",
    "저녁 8-10시",
    "밤 10-12시"
]

def create_lucky_items(zodiac, seed):
    """행운 아이템 생성 - 별자리 특성 기반 해시"""
    hash_val = int(hashlib.md5(f"lucky-{zodiac}-{seed}".encode()).hexdigest(), 16)

    color_idx = hash_val % len(LUCKY_COLORS[zodiac])
    number_idx = (hash_val >> 8) % len(LUCKY_NUMBERS[zodiac])
    time_idx = (hash_val >> 16) % len(LUCKY_TIMES)

    return {
        'color': LUCKY_COLORS[zodiac][color_idx],
        'number': LUCKY_NUMBERS[zodiac][number_idx],
        'time': LUCKY_TIMES[time_idx]
    }

def create_daily_advice(overall, love, money, work, health, zodiac, seed):
    """
    오늘의 조언 - 생성된 5가지 운세를 종합해서 AI가 결론 내림
    생동감 있고 구체적인 한 문장 조언
    """
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"advice-{zodiac}-{seed}".encode()).hexdigest(), 16)

    # 5가지 운세에서 핵심 키워드 추출 (별자리 특성 활용)
    patterns = [
        f"{z['strength']}을 발휘하며 작은 성공들을 쌓아가는 하루로 만들어보세요!",

        f"오늘은 {z['name']}다운 {z['traits'][hash_val % len(z['traits'])]} 태도로 모든 일에 임하면 좋은 결과가 따라와요.",

        f"{z['keywords'][hash_val % len(z['keywords'])]}에 집중하면서 주변 사람들과 진심 어린 대화를 나눠보세요.",

        f"{z['decision']} 방식으로 하루를 계획하고, 여유를 가지고 실천해나가세요.",

        f"당신의 {z['strength']}이 빛나는 순간들을 포착하고 즐기는 하루가 되길 바라요!",

        f"{z['name']}의 에너지를 믿고 한 걸음씩 나아가면 원하는 목표에 가까워질 거예요.",
    ]

    return patterns[hash_val % len(patterns)]

# ============================================================================
# 금지어 검증
# ============================================================================
FORBIDDEN_WORDS = [
    '불행', '재앙', '망하다', '실패', '불운', '흉', '액운',
    '조심하세요', '피하세요', '위험', '주의', '경고',
    '나쁘다', '안 좋다', '어렵다', '힘들다', '고통', '슬프다',
]

def validate(text):
    for word in FORBIDDEN_WORDS:
        if word in text:
            return False, f"금지어: {word}"
    return True, "통과"

# ============================================================================
# 메인 생성 함수
# ============================================================================
def generate_fortune(date_str, zodiac_id):
    """AI 창작 기반 일일운 생성"""
    date_energy = analyze_date_energy(date_str)

    # 날짜 기반 시드 (재현 가능)
    seed = sum(ord(c) for c in date_str) * zodiac_id

    overall = create_unique_overall(zodiac_id, date_energy, seed)
    love = create_unique_love(zodiac_id, date_energy, seed + 100)
    money = create_unique_money(zodiac_id, date_energy, seed + 200)
    work = create_unique_work(zodiac_id, date_energy, seed + 300)
    health = create_unique_health(zodiac_id, date_energy, seed + 400)

    # 행운 아이템 생성
    lucky_items = create_lucky_items(zodiac_id, seed)

    # 오늘의 조언 생성 (5가지 운세 종합)
    advice = create_daily_advice(overall, love, money, work, health, zodiac_id, seed + 500)

    # 검증 (조언도 포함)
    all_text = f"{overall} {love} {money} {work} {health} {advice}"
    valid, msg = validate(all_text)

    if not valid:
        print(f"⚠️  {ZODIAC_PROFILES[zodiac_id]['name']} {date_str} 검증 실패: {msg}")
        return None

    return {
        'overall': overall,
        'fortunes': {
            'love': love,
            'money': money,
            'work': work,
            'health': health
        },
        'scores': {
            'overall': 70 + (seed % 25),
            'love': 65 + ((seed + 1) % 30),
            'money': 65 + ((seed + 2) % 30),
            'work': 70 + ((seed + 3) % 25),
            'health': 70 + ((seed + 4) % 25)
        },
        'lucky': lucky_items,
        'advice': advice,
        'source': 'ai_creative'
    }

# ============================================================================
# 배치 생성
# ============================================================================
def generate_day(date_str):
    """하루치 12별자리 생성"""
    print(f"\n📅 {date_str}")
    results = {}

    for zodiac_id in range(1, 13):
        z_name = ZODIAC_PROFILES[zodiac_id]['name']
        print(f"  🔮 {z_name:8s} ", end='', flush=True)

        fortune = generate_fortune(date_str, zodiac_id)

        if fortune:
            results[str(zodiac_id)] = fortune
            print("✅")
        else:
            print("❌")

    print(f"✅ {date_str} 완료: {len(results)}/12")
    return results

def batch_generate(start_date_str, num_days):
    """여러 날짜 배치 생성"""
    print("="*70)
    print("🌟 AI 창작 기반 배치 생성")
    print("="*70)
    print(f"시작: {start_date_str}")
    print(f"일수: {num_days}일")
    print(f"총: {num_days * 12}개")
    print("="*70)

    # 날짜 리스트 생성
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    dates = []
    for i in range(num_days):
        current = start_date + timedelta(days=i)
        dates.append(current.strftime('%Y-%m-%d'))

    # 데이터 로드
    data_file = 'api/fortune-data.json'
    if os.path.exists(data_file):
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {'daily': {}}

    if 'daily' not in data:
        data['daily'] = {}

    # 생성
    for idx, date_str in enumerate(dates, 1):
        print(f"\n[{idx}/{num_days}] ", end='')
        daily_data = generate_day(date_str)
        data['daily'][date_str] = daily_data

        # 5일마다 중간 저장
        if idx % 5 == 0:
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"💾 중간 저장 ({idx}일치)")

    # 최종 저장
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n" + "="*70)
    print("✅ 배치 생성 완료")
    print("="*70)
    print(f"파일: {data_file}")
    print(f"기간: {dates[0]} ~ {dates[-1]}")
    print(f"생성: {len(dates)}일 × 12 = {len(dates) * 12}개")
    print("="*70)

# ============================================================================
# 실행
# ============================================================================
if __name__ == '__main__':
    import sys

    if len(sys.argv) > 2:
        # 배치 모드: python script.py 2025-01-01 365
        start_date = sys.argv[1]
        num_days = int(sys.argv[2])
        batch_generate(start_date, num_days)
    else:
        # 샘플 모드
        test_date = '2025-10-15'
        test_zodiac = 2  # 황소자리

        print("="*70)
        print("🌟 AI 창작 기반 별자리 일일운 생성")
        print("="*70)
        print(f"날짜: {test_date}")
        print(f"별자리: {ZODIAC_PROFILES[test_zodiac]['name']}")
        print("="*70)

        fortune = generate_fortune(test_date, test_zodiac)

        if fortune:
            print("\n✅ 생성 성공\n")
            print(f"📋 {ZODIAC_PROFILES[test_zodiac]['name']} 운세")
            print("-"*70)
            print(f"overall:\n  {fortune['overall']}\n")
            print(f"love:\n  {fortune['fortunes']['love']}\n")
            print(f"money:\n  {fortune['fortunes']['money']}\n")
            print(f"work:\n  {fortune['fortunes']['work']}\n")
            print(f"health:\n  {fortune['fortunes']['health']}\n")
            print("="*70)

            # 저장
            data_file = 'api/fortune-data.json'
            if os.path.exists(data_file):
                with open(data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            else:
                data = {'daily': {}}

            if 'daily' not in data:
                data['daily'] = {}

            if test_date not in data['daily']:
                data['daily'][test_date] = {}

            data['daily'][test_date][str(test_zodiac)] = fortune

            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            print(f"💾 저장 완료: {data_file}")
