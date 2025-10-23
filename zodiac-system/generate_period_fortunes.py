#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
주간/월간/연간 운세 AI 창작 생성
일일운세 품질로 생성 (생동감 있고 구체적)
"""

import json
import hashlib
from datetime import datetime, timedelta

# 기존 ZODIAC_PROFILES 재사용
from generate_ai_fortunes import ZODIAC_PROFILES, FORBIDDEN_WORDS, validate

# ============================================================================
# 주간 운세 생성
# ============================================================================

def create_weekly_overall(zodiac, week_num, seed):
    """주간 전체운 - 일주일의 흐름 해석"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"week-overall-{zodiac}-{week_num}-{seed}".encode()).hexdigest(), 16)

    trait_idx = hash_val % len(z['traits'])
    keyword_idx = (hash_val + 1) % len(z['keywords'])

    patterns = [
        f"이번 주는 {z['name']}의 {z['traits'][trait_idx]} 에너지가 빛을 발하는 한 주예요. {z['keywords'][keyword_idx]}에 집중하면 주중에 좋은 흐름을 만들 수 있어요. 주말엔 뿌듯한 성취감을 느낄 거예요.",

        f"{z['name']}답게 {z['decision']} 방식으로 일주일을 계획해보세요. {z['strength']}을 활용하면 예상보다 많은 것을 이룰 수 있어요. 주중반부터 에너지가 상승해요.",

        f"일주일 내내 {z['name']}의 장점이 주목받는 시기예요. {z['traits'][trait_idx]} 면모를 자연스럽게 드러내면 좋은 기회가 찾아와요. 주말까지 꾸준히 노력하면 보람을 느낄 거예요.",

        f"{z['keywords'][keyword_idx]}을 테마로 한 주를 보내보세요. {z['name']}의 {z['strength']}이 발휘되면서 주변 사람들과의 관계도 좋아져요. 작은 성공들이 모여 큰 변화를 만들어요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_weekly_love(zodiac, week_num, seed):
    """주간 애정운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"week-love-{zodiac}-{week_num}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"주중에는 {z['relationship']} 당신의 매력이 더욱 돋보여요. 솔직한 대화로 마음을 전하면 상대방이 긍정적으로 반응할 거예요. 주말엔 특별한 시간을 함께 만들어보세요.",

        f"이번 주는 관계에 새로운 활력을 불어넣기 좋은 시기예요. {z['name']}다운 따뜻함으로 상대방을 배려하면 두 사람의 유대감이 깊어져요. 작은 이벤트가 큰 감동을 만들어요.",

        f"{z['strength']}을 바탕으로 상대방을 이해하려는 노력이 빛을 발해요. 진심 어린 표현과 세심한 관심이 관계를 한 단계 발전시켜요. 주말 데이트가 특히 즐거울 거예요.",

        f"일주일 동안 사랑을 표현하는 다양한 방법을 시도해보세요. {z['name']}의 {z['relationship']} 면모가 상대방의 마음을 움직여요. 중요한 대화는 주중반이 좋아요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_weekly_money(zodiac, week_num, seed):
    """주간 금전운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"week-money-{zodiac}-{week_num}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['decision']} 판단으로 재정 계획을 세우기 좋은 한 주예요. 충동적인 지출을 피하고 신중하게 접근하면 안정감을 느낄 수 있어요. 주말엔 여유로운 마음으로 보상을 즐겨보세요.",

        f"이번 주는 수입과 지출의 균형을 맞추는 데 집중해보세요. {z['strength']}을 활용한 계획적인 관리가 장기적으로 도움이 돼요. 작은 절약이 큰 성과로 이어져요.",

        f"재정 상황을 점검하고 미래를 준비하기 좋은 시기예요. {z['name']}다운 실용적인 접근으로 현명한 선택을 할 수 있어요. 투자 정보는 꼼꼼히 검토하세요.",

        f"일주일 동안 소비 패턴을 관찰하고 개선점을 찾아보세요. {z['decision']} 방식의 재정 관리가 안정성을 높여줘요. 주중에 중요한 금전 결정을 하면 좋아요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_weekly_work(zodiac, week_num, seed):
    """주간 직장운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"week-work-{zodiac}-{week_num}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['strength']}을 발휘하면 업무 성과가 눈에 띄게 좋아지는 한 주예요. 팀원들과의 협력도 원활하고, 상사의 인정을 받을 기회가 있어요. 주중반까지 집중하면 주말엔 여유로워요.",

        f"이번 주는 {z['name']}의 장점이 업무에서 빛을 발해요. 새로운 아이디어를 제안하거나 주도적으로 일을 진행하면 좋은 결과를 얻을 수 있어요. 꾸준함이 성공의 열쇠예요.",

        f"일주일 동안 {z['decision']} 판단력이 중요한 업무를 잘 처리할 수 있어요. 차근차근 진행하면 완성도 높은 결과물이 나와요. 동료들과의 소통도 활발해져요.",

        f"업무에서 {z['name']}다운 접근 방식이 주목받는 시기예요. 적극적인 태도와 꼼꼼한 실행력이 조화를 이루면서 좋은 평가를 받을 거예요. 새로운 기회도 찾아올 수 있어요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_weekly_health(zodiac, week_num, seed):
    """주간 건강운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"week-health-{zodiac}-{week_num}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"일주일 동안 규칙적인 생활 리듬을 유지하면 컨디션이 좋아져요. 충분한 수면과 영양 섭취를 챙기고, 가벼운 운동으로 에너지를 순환시켜보세요. 주말엔 휴식에 집중하세요.",

        f"이번 주는 몸의 신호에 귀 기울이는 시간을 가져보세요. {z['name']}에게 필요한 {z['growth']}을 기르는 활동이 도움이 돼요. 스트레스 관리도 중요해요.",

        f"건강 관리에 {z['strength']}을 활용해보세요. 꾸준한 실천이 장기적으로 좋은 결과를 만들어요. 주중에는 바쁘더라도 식사 시간을 잘 챙기는 게 중요해요.",

        f"일주일 내내 몸과 마음의 균형을 맞추는 데 신경 써보세요. 명상이나 요가 같은 이완 활동이 특히 효과적이에요. 주말엔 자연 속에서 재충전하면 좋아요.",
    ]

    return patterns[hash_val % len(patterns)]

def generate_weekly_fortune(zodiac, week_num, year=2025):
    """주간 운세 생성"""
    seed = week_num * zodiac * year

    # 해당 주의 시작일/종료일 계산
    first_day = datetime(year, 1, 1)
    days_to_monday = (7 - first_day.weekday()) % 7
    first_monday = first_day + timedelta(days=days_to_monday)
    week_start = first_monday + timedelta(weeks=week_num - 1)
    week_end = week_start + timedelta(days=6)

    overall = create_weekly_overall(zodiac, week_num, seed)
    love = create_weekly_love(zodiac, week_num, seed + 100)
    money = create_weekly_money(zodiac, week_num, seed + 200)
    work = create_weekly_work(zodiac, week_num, seed + 300)
    health = create_weekly_health(zodiac, week_num, seed + 400)

    # 검증
    all_text = f"{overall} {love} {money} {work} {health}"
    valid, msg = validate(all_text)

    if not valid:
        print(f"⚠️  {ZODIAC_PROFILES[zodiac]['name']} W{week_num:02d} 검증 실패: {msg}")
        return None

    # 주요 날짜 (주중 하이라이트)
    hash_val = int(hashlib.md5(f"keydays-{zodiac}-{week_num}".encode()).hexdigest(), 16)
    days = ['월요일', '화요일', '수요일', '목요일', '금요일']
    key_day = days[hash_val % len(days)]

    return {
        'weekStart': week_start.strftime('%Y-%m-%d'),
        'weekEnd': week_end.strftime('%Y-%m-%d'),
        'theme': f"{ZODIAC_PROFILES[zodiac]['keywords'][hash_val % len(ZODIAC_PROFILES[zodiac]['keywords'])]}의 주간",
        'overall': overall,
        'fortunes': {
            'love': love,
            'money': money,
            'work': work,
            'health': health
        },
        'keyDays': key_day
    }

# ============================================================================
# 월간 운세 생성
# ============================================================================

def create_monthly_overall(zodiac, month, seed):
    """월간 전체운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"month-overall-{zodiac}-{month}-{seed}".encode()).hexdigest(), 16)

    trait_idx = hash_val % len(z['traits'])
    keyword_idx = (hash_val + 1) % len(z['keywords'])

    patterns = [
        f"이번 달은 {z['name']}의 {z['traits'][trait_idx]} 에너지가 한 달 내내 빛을 발해요. {z['keywords'][keyword_idx]}을 중심으로 계획을 세우면 많은 것을 이룰 수 있어요. 월말엔 큰 성취감을 느낄 거예요.",

        f"{z['name']}답게 {z['decision']} 방식으로 한 달을 보내보세요. {z['strength']}을 활용하면 예상보다 훨씬 많은 발전을 경험할 수 있어요. 중순부터 좋은 기회들이 찾아와요.",

        f"한 달 동안 {z['name']}의 장점이 다양한 영역에서 주목받는 시기예요. {z['traits'][trait_idx]} 면모를 적극적으로 드러내면 새로운 가능성이 열려요. 꾸준한 노력이 결실을 맺어요.",

        f"{z['keywords'][keyword_idx]}을 테마로 삼아 한 달을 설계해보세요. {z['name']}의 {z['strength']}이 발휘되면서 주변 환경도 긍정적으로 변화해요. 매일의 작은 실천이 큰 변화를 만들어요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_monthly_love(zodiac, month, seed):
    """월간 애정운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"month-love-{zodiac}-{month}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"이번 달은 {z['relationship']} 당신의 매력이 최고조에 달해요. 진심 어린 표현과 세심한 배려로 관계가 깊어지는 한 달이 될 거예요. 중순에 특별한 이벤트를 계획해보세요.",

        f"한 달 동안 사랑을 키우는 다양한 방법을 시도해볼 수 있어요. {z['name']}다운 따뜻함과 진정성이 상대방의 마음을 움직여요. 솔직한 대화가 관계를 한 단계 발전시켜요.",

        f"{z['strength']}을 바탕으로 상대방을 이해하고 배려하는 시간을 가져보세요. 작은 관심과 세심한 행동들이 모여 큰 감동을 만들어요. 월말엔 두 사람의 유대감이 더욱 깊어져요.",

        f"이번 달은 관계에 새로운 활력을 불어넣기 최적의 시기예요. {z['name']}의 {z['relationship']} 면모가 빛을 발하면서 행복한 순간들이 많아져요. 함께하는 시간을 소중히 여기세요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_monthly_money(zodiac, month, seed):
    """월간 금전운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"month-money-{zodiac}-{month}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['decision']} 판단력으로 재정 계획을 수립하기 좋은 한 달이에요. 장기적인 관점에서 투자와 저축을 균형있게 관리하면 안정감을 느낄 수 있어요. 중순에 좋은 기회가 있을 수 있어요.",

        f"이번 달은 수입을 늘리고 지출을 최적화할 방법을 찾아보세요. {z['strength']}을 활용한 전략적인 접근이 재정 상황을 개선해줘요. 꼼꼼한 관리가 성과로 이어져요.",

        f"재정 목표를 재점검하고 실행 계획을 구체화하기 좋은 시기예요. {z['name']}다운 실용적인 방식으로 현명한 선택을 이어가면 월말에 성과를 확인할 수 있어요. 신중함이 중요해요.",

        f"한 달 동안 재정 습관을 개선하는 데 집중해보세요. {z['decision']} 접근으로 불필요한 지출을 줄이고 효율적인 관리를 실천하면 좋은 결과를 얻을 수 있어요. 작은 변화가 큰 차이를 만들어요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_monthly_work(zodiac, month, seed):
    """월간 직장운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"month-work-{zodiac}-{month}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['strength']}을 발휘하면 업무에서 뛰어난 성과를 낼 수 있는 한 달이에요. 새로운 프로젝트나 책임있는 역할을 맡게 될 수 있어요. 꾸준한 노력이 인정받는 시기예요.",

        f"이번 달은 {z['name']}의 장점이 업무 현장에서 빛을 발해요. 적극적인 태도로 기회를 잡고 주도적으로 일을 진행하면 좋은 평가를 받을 거예요. 팀워크도 중요해요.",

        f"한 달 동안 {z['decision']} 판단력이 복잡한 업무를 해결하는 데 큰 도움이 돼요. 차근차근 계획을 실행하면 완성도 높은 결과물을 만들 수 있어요. 동료들과의 협력도 원활해요.",

        f"업무에서 {z['name']}다운 접근이 주목받고 새로운 기회로 이어지는 시기예요. 창의적인 아이디어와 꼼꼼한 실행력이 조화를 이루면서 커리어 발전의 기회가 찾아와요. 적극적으로 도전하세요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_monthly_health(zodiac, month, seed):
    """월간 건강운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"month-health-{zodiac}-{month}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"한 달 동안 규칙적인 생활 패턴을 만들어가면 건강이 크게 개선돼요. 균형잡힌 식사와 충분한 수면, 꾸준한 운동이 조화를 이루면 컨디션이 최상으로 올라가요. 스트레스 관리도 잘 되는 시기예요.",

        f"이번 달은 몸과 마음의 건강에 투자하기 좋은 시기예요. {z['name']}에게 맞는 {z['growth']}을 기르는 활동을 찾아보세요. 새로운 건강 습관을 시작하면 오래 유지될 거예요.",

        f"건강 관리에 {z['strength']}을 활용해보는 한 달로 만들어보세요. 작은 목표를 세우고 꾸준히 실천하면 월말에 확실한 변화를 느낄 수 있어요. 몸의 신호에 귀 기울이는 것도 중요해요.",

        f"한 달 내내 몸과 마음의 균형을 맞추는 데 집중하면 전반적인 컨디션이 좋아져요. 명상, 요가, 산책 같은 이완 활동이 특히 효과적이에요. 자신을 돌보는 시간을 충분히 가지세요.",
    ]

    return patterns[hash_val % len(patterns)]

def generate_monthly_fortune(zodiac, month, year=2025):
    """월간 운세 생성"""
    seed = month * zodiac * year

    overall = create_monthly_overall(zodiac, month, seed)
    love = create_monthly_love(zodiac, month, seed + 100)
    money = create_monthly_money(zodiac, month, seed + 200)
    work = create_monthly_work(zodiac, month, seed + 300)
    health = create_monthly_health(zodiac, month, seed + 400)

    # 검증
    all_text = f"{overall} {love} {money} {work} {health}"
    valid, msg = validate(all_text)

    if not valid:
        print(f"⚠️  {ZODIAC_PROFILES[zodiac]['name']} {month}월 검증 실패: {msg}")
        return None

    # 주요 날짜 (상순/중순/하순)
    hash_val = int(hashlib.md5(f"keydate-{zodiac}-{month}".encode()).hexdigest(), 16)
    dates = [
        f"{month}일, {month+10}일, {month+20}일",
        f"{month+5}일, {month+15}일, {month+25}일",
        f"{month+3}일, {month+13}일, {month+23}일"
    ]

    return {
        'theme': f"{ZODIAC_PROFILES[zodiac]['keywords'][hash_val % len(ZODIAC_PROFILES[zodiac]['keywords'])]}의 달",
        'overall': overall,
        'fortunes': {
            'love': love,
            'money': money,
            'work': work,
            'health': health
        },
        'keyDates': dates[hash_val % len(dates)]
    }

# ============================================================================
# 연간 운세 생성
# ============================================================================

def create_yearly_overall(zodiac, year, seed):
    """연간 전체운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"year-overall-{zodiac}-{year}-{seed}".encode()).hexdigest(), 16)

    trait_idx = hash_val % len(z['traits'])
    keyword_idx = (hash_val + 1) % len(z['keywords'])

    patterns = [
        f"{year}년은 {z['name']}의 {z['traits'][trait_idx]} 에너지가 일 년 내내 빛을 발하는 해예요. {z['keywords'][keyword_idx]}을 핵심 테마로 삼아 큰 그림을 그려보세요. 한 해 동안 많은 성장과 변화를 경험할 거예요.",

        f"올해는 {z['name']}답게 {z['decision']} 방식으로 인생을 설계하기 좋은 시기예요. {z['strength']}을 최대한 활용하면 예상보다 훨씬 많은 것을 이룰 수 있어요. 상반기부터 좋은 흐름이 시작돼요.",

        f"일 년 동안 {z['name']}의 모든 장점이 다양한 영역에서 주목받는 해예요. {z['traits'][trait_idx]} 면모를 적극적으로 발휘하면 새로운 기회들이 연이어 찾아와요. 꾸준한 노력이 큰 결실을 맺어요.",

        f"{z['keywords'][keyword_idx]}을 한 해의 목표로 설정하고 매일 실천해보세요. {z['name']}의 {z['strength']}이 발휘되면서 주변 환경과 관계가 긍정적으로 변화해요. 매달의 작은 성공이 모여 큰 성취를 만들어요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_yearly_love(zodiac, year, seed):
    """연간 애정운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"year-love-{zodiac}-{year}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"올해는 {z['relationship']} 당신의 매력이 최고로 빛나는 한 해예요. 진심과 따뜻함으로 관계를 키워가면 사랑이 깊어지는 경험을 하게 돼요. 봄과 가을에 특별한 순간들이 많아요.",

        f"일 년 동안 사랑을 표현하고 키우는 다양한 방법을 배울 수 있어요. {z['name']}다운 진정성과 배려가 관계에 안정감을 더해줘요. 솔직한 대화로 새로운 단계로 나아갈 수 있어요.",

        f"{z['strength']}을 바탕으로 상대방을 이해하고 존중하는 한 해를 보내보세요. 작은 관심과 꾸준한 노력이 모여 깊은 사랑으로 성장해요. 하반기에 중요한 결정을 할 수 있어요.",

        f"올해는 관계에 새로운 활력과 의미를 부여하는 시기예요. {z['name']}의 {z['relationship']} 면모가 빛을 발하면서 함께하는 시간이 더욱 행복해져요. 서로의 성장을 응원하는 관계로 발전해요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_yearly_money(zodiac, year, seed):
    """연간 금전운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"year-money-{zodiac}-{year}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['decision']} 판단력으로 장기적인 재정 계획을 세우기 완벽한 한 해예요. 꾸준한 저축과 현명한 투자의 균형을 맞추면 경제적 안정과 성장을 동시에 이룰 수 있어요. 하반기에 좋은 기회가 있어요.",

        f"올해는 재정 관리 능력을 크게 향상시킬 수 있는 시기예요. {z['strength']}을 활용한 체계적인 접근으로 수입을 늘리고 자산을 축적해나갈 수 있어요. 인내심 있는 실천이 성과를 만들어요.",

        f"일 년 동안 재정 목표를 구체화하고 단계별로 실행해보세요. {z['name']}다운 실용적인 방식으로 현명한 선택들을 이어가면 연말에 큰 성취감을 느낄 수 있어요. 계획적인 관리가 핵심이에요.",

        f"올해는 경제적 독립성과 안정성을 강화하는 한 해로 만들어보세요. {z['decision']} 접근으로 리스크를 관리하고 기회를 포착하면 재정 상황이 크게 개선돼요. 꾸준함과 신중함이 성공의 열쇠예요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_yearly_work(zodiac, year, seed):
    """연간 직장운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"year-work-{zodiac}-{year}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"{z['strength']}을 마음껏 발휘하면 커리어에서 큰 도약을 이룰 수 있는 한 해예요. 새로운 프로젝트, 승진, 이직 등 다양한 기회가 찾아와요. 적극적으로 도전하면 예상 이상의 성과를 거둘 수 있어요.",

        f"올해는 {z['name']}의 전문성과 역량이 인정받는 시기예요. 주도적으로 업무를 이끌고 창의적인 해결책을 제시하면 중요한 기회로 이어져요. 팀워크와 리더십이 함께 성장해요.",

        f"일 년 동안 {z['decision']} 판단력이 복잡한 업무 상황을 헤쳐나가는 데 큰 힘이 돼요. 차근차근 실력을 쌓고 성과를 만들어가면 커리어의 전환점을 맞이할 수 있어요. 상반기에 중요한 결정이 있을 수 있어요.",

        f"올해는 {z['name']}다운 일하는 방식이 주목받고 새로운 역할로 이어지는 해예요. 꾸준한 노력과 창의적인 접근이 조화를 이루면서 직장에서의 위상이 높아져요. 배움을 멈추지 않는 자세가 중요해요.",
    ]

    return patterns[hash_val % len(patterns)]

def create_yearly_health(zodiac, year, seed):
    """연간 건강운"""
    z = ZODIAC_PROFILES[zodiac]
    hash_val = int(hashlib.md5(f"year-health-{zodiac}-{year}-{seed}".encode()).hexdigest(), 16)

    patterns = [
        f"일 년 동안 건강한 생활 습관을 정착시키기 최적의 시기예요. 규칙적인 운동, 균형잡힌 식사, 충분한 수면의 삼박자가 맞아떨어지면 컨디션이 크게 좋아져요. 봄부터 시작하면 연말까지 지속할 수 있어요.",

        f"올해는 몸과 마음의 건강에 깊이 있게 투자하는 한 해로 만들어보세요. {z['name']}에게 맞는 {z['growth']}을 기르는 활동을 꾸준히 실천하면 전반적인 삶의 질이 향상돼요. 스트레스 관리 방법도 찾아보세요.",

        f"일 년 내내 {z['strength']}을 건강 관리에 활용해보세요. 작은 목표들을 설정하고 단계적으로 실천하면 연말에 놀라운 변화를 경험할 수 있어요. 몸의 신호에 귀 기울이고 필요할 때 전문가의 도움을 받으세요.",

        f"올해는 건강을 최우선 순위에 두고 일상을 재설계해보세요. 명상, 요가, 자연과의 교감 같은 전인적 접근이 효과적이에요. 예방적 건강 관리로 일 년 내내 활력 넘치는 생활을 유지할 수 있어요.",
    ]

    return patterns[hash_val % len(patterns)]

def generate_yearly_fortune(zodiac, year=2025):
    """연간 운세 생성"""
    seed = zodiac * year

    overall = create_yearly_overall(zodiac, year, seed)
    love = create_yearly_love(zodiac, year, seed + 100)
    money = create_yearly_money(zodiac, year, seed + 200)
    work = create_yearly_work(zodiac, year, seed + 300)
    health = create_yearly_health(zodiac, year, seed + 400)

    # 검증
    all_text = f"{overall} {love} {money} {work} {health}"
    valid, msg = validate(all_text)

    if not valid:
        print(f"⚠️  {ZODIAC_PROFILES[zodiac]['name']} {year}년 검증 실패: {msg}")
        return None

    # 최고/주의 월
    hash_val = int(hashlib.md5(f"months-{zodiac}-{year}".encode()).hexdigest(), 16)
    months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

    best_months = [
        months[(hash_val + i) % 12] for i in range(3)
    ]
    challenging_months = [
        months[(hash_val + 6 + i) % 12] for i in range(2)
    ]

    return {
        'year': year,
        'theme': f"{ZODIAC_PROFILES[zodiac]['keywords'][hash_val % len(ZODIAC_PROFILES[zodiac]['keywords'])]}과 성장의 해",
        'overall': overall,
        'fortunes': {
            'love': love,
            'money': money,
            'work': work,
            'health': health
        },
        'bestMonths': best_months,
        'challengingMonths': challenging_months,
        'keyAdvice': f"{ZODIAC_PROFILES[zodiac]['strength']}을 믿고 한 걸음씩 나아가세요!"
    }

# ============================================================================
# 배치 생성
# ============================================================================

def generate_all(year=2025):
    """주간/월간/연간 전체 생성"""
    print("="*70)
    print(f"🌟 {year}년 주간/월간/연간 운세 AI 창작 생성")
    print("="*70)

    with open('api/fortune-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 주간 생성 (52주 × 12별자리 = 624개)
    print("\n📅 주간 운세 생성 중...")
    for week in range(1, 53):
        week_key = f"{year}-W{week:02d}"
        data['weekly'][week_key] = {}

        print(f"  W{week:02d}: ", end='', flush=True)
        for zodiac in range(1, 13):
            fortune = generate_weekly_fortune(zodiac, week, year)
            if fortune:
                data['weekly'][week_key][str(zodiac)] = fortune
                print('.', end='', flush=True)
        print(f" ✅ {len(data['weekly'][week_key])}/12")

    print(f"\n✅ 주간 생성 완료: 52주")

    # 월간 생성 (12개월 × 12별자리 = 144개)
    print("\n📅 월간 운세 생성 중...")
    for month in range(1, 13):
        month_key = f"{year}-{month:02d}"
        data['monthly'][month_key] = {}

        print(f"  {month:02d}월: ", end='', flush=True)
        for zodiac in range(1, 13):
            fortune = generate_monthly_fortune(zodiac, month, year)
            if fortune:
                data['monthly'][month_key][str(zodiac)] = fortune
                print('.', end='', flush=True)
        print(f" ✅ {len(data['monthly'][month_key])}/12")

    print(f"\n✅ 월간 생성 완료: 12개월")

    # 연간 생성 (12별자리) - 년도별 키 구조로 변경
    print("\n📅 연간 운세 생성 중...")
    year_key = str(year)
    if year_key not in data['yearly']:
        data['yearly'][year_key] = {}

    for zodiac in range(1, 13):
        print(f"  {ZODIAC_PROFILES[zodiac]['name']:8s}: ", end='', flush=True)
        fortune = generate_yearly_fortune(zodiac, year)
        if fortune:
            data['yearly'][year_key][str(zodiac)] = fortune
            print("✅")

    print(f"\n✅ 연간 생성 완료: 12별자리")

    # 저장
    print("\n💾 저장 중...")
    with open('api/fortune-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n" + "="*70)
    print("✅ 전체 생성 완료")
    print(f"  - 주간: 52주 × 12별자리 = {52*12}개")
    print(f"  - 월간: 12개월 × 12별자리 = {12*12}개")
    print(f"  - 연간: 12별자리 = 12개")
    print(f"  - 총: {52*12 + 12*12 + 12}개")
    print("="*70)

if __name__ == '__main__':
    import sys
    year = int(sys.argv[1]) if len(sys.argv) > 1 else 2025
    generate_all(year)
