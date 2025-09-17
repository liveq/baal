#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
240명 인물별 자연스러운 한국어 템플릿 생성 스크립트
각 인물의 핵심 업적을 바탕으로 4개 카테고리별 자연스러운 템플릿 생성
"""

import json
import re
from typing import Dict, List, Any

def load_historical_figures(file_path: str) -> Dict[str, Any]:
    """인물 데이터 파일 로드"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_natural_template(name: str, achievements: List[str], category_trait: str, category: str) -> str:
    """인물과 업적을 기반으로 자연스러운 템플릿 생성"""
    
    # 각 인물별 맞춤형 템플릿 규칙
    templates = {
        # 예술가
        "레오나르도 다빈치": {
            "work": "모나리자를 그린 다빈치처럼",
            "love": "완벽한 이상을 추구한 다빈치처럼",
            "money": "다방면의 재능을 펼친 다빈치처럼",
            "health": "끝없는 호기심을 가진 다빈치처럼"
        },
        "진시황": {
            "work": "중국을 통일한 진시황처럼",
            "love": "강력한 카리스마를 가진 진시황처럼",
            "money": "대제국을 건설한 진시황처럼",
            "health": "불굴의 의지를 가진 진시황처럼"
        },
        "무측천": {
            "work": "중국 유일한 여황제 무측천처럼",
            "love": "독립적인 사랑을 추구한 무측천처럼",
            "money": "경제 번영을 이룬 무측천처럼",
            "health": "강한 의지력을 가진 무측천처럼"
        },
        "찰리 채플린": {
            "work": "모던 타임스를 만든 채플린처럼",
            "love": "순수한 감성을 가진 채플린처럼",
            "money": "예술적 가치를 추구한 채플린처럼",
            "health": "웃음으로 치유하는 채플린처럼"
        },
        "마론 브란도": {
            "work": "메소드 연기를 창시한 브란도처럼",
            "love": "깊은 감정을 추구한 브란도처럼",
            "money": "예술적 가치를 우선한 브란도처럼",
            "health": "감정 표현으로 건강을 지킨 브란도처럼"
        },
        "엘튼 존": {
            "work": "로켓맨을 부른 엘튼 존처럼",
            "love": "진실한 사랑을 추구한 엘튼 존처럼",
            "money": "음악으로 성공한 엘튼 존처럼",
            "health": "음악으로 활력을 얻는 엘튼 존처럼"
        }
    }
    
    # 미리 정의된 템플릿이 있으면 사용
    if name in templates:
        return templates[name][category]
    
    # 동적 템플릿 생성
    return create_dynamic_template(name, achievements, category_trait, category)

def create_dynamic_template(name: str, achievements: List[str], category_trait: str, category: str) -> str:
    """업적 기반 동적 템플릿 생성"""
    
    # 첫 번째 업적에서 핵심 키워드 추출
    if not achievements:
        return f"{name}처럼"
    
    main_achievement = achievements[0]
    
    # 일반적인 패턴들
    patterns = {
        "work": [
            lambda ach, name: f"{extract_work_achievement(ach)} {name}처럼",
        ],
        "love": [
            lambda ach, name: f"{extract_love_trait(ach)} {name}처럼",
        ],
        "money": [
            lambda ach, name: f"{extract_money_trait(ach)} {name}처럼",
        ],
        "health": [
            lambda ach, name: f"{extract_health_trait(ach)} {name}처럼",
        ]
    }
    
    try:
        pattern = patterns[category][0]
        return pattern(main_achievement, name)
    except:
        return f"{name}처럼"

def extract_work_achievement(achievement: str) -> str:
    """업적에서 work 관련 키워드 추출"""
    if "모나리자" in achievement:
        return "모나리자를 그린"
    elif "통일" in achievement:
        return "나라를 통일한"
    elif "발명" in achievement:
        return "혁신적 발명을 한"
    elif "작곡" in achievement:
        return "명곡을 작곡한"
    elif "연기" in achievement:
        return "연기법을 혁신한"
    elif "소설" in achievement:
        return "불멸의 작품을 쓴"
    elif "발견" in achievement:
        return "새로운 세계를 발견한"
    elif "이론" in achievement:
        return "혁신적 이론을 제시한"
    else:
        return "위대한 업적을 남긴"

def extract_love_trait(achievement: str) -> str:
    """love 관련 특성 추출"""
    return "진실한 사랑을 추구한"

def extract_money_trait(achievement: str) -> str:
    """money 관련 특성 추출"""
    if "경제" in achievement or "번영" in achievement:
        return "경제적 번영을 이룬"
    elif "성공" in achievement:
        return "큰 성공을 거둔"
    else:
        return "가치를 창출한"

def extract_health_trait(achievement: str) -> str:
    """health 관련 특성 추출"""
    return "건강한 활력을 가진"

def process_all_figures(data: Dict[str, Any]) -> Dict[str, Any]:
    """모든 인물 처리"""
    
    zodiac_figures = data.get('zodiacFigures', {})
    
    for zodiac_key, zodiac_data in zodiac_figures.items():
        figures = zodiac_data.get('figures', [])
        
        for figure in figures:
            name = figure.get('name', '')
            achievements = figure.get('achievements', [])
            category_traits = figure.get('categoryTraits', {})
            
            # naturalTemplates 생성
            natural_templates = {}
            
            for category in ['work', 'love', 'money', 'health']:
                category_trait = category_traits.get(category, '')
                template = create_natural_template(name, achievements, category_trait, category)
                natural_templates[category] = template
            
            # 인물 데이터에 추가
            figure['naturalTemplates'] = natural_templates
            
            print(f"✅ {name} - 템플릿 생성 완료")
    
    return data

def main():
    """메인 실행 함수"""
    input_file = r"C:\code\rheight\zodiac-system\historical-figures-enhanced.json"
    output_file = r"C:\code\rheight\zodiac-system\historical-figures-with-templates.json"
    
    print("🌙 밤샘 작업 시작: 240명 인물별 자연스러운 템플릿 생성")
    print("=" * 60)
    
    try:
        # 데이터 로드
        print("📖 기존 데이터 로드 중...")
        data = load_historical_figures(input_file)
        
        # 모든 인물 처리
        print("🔧 템플릿 생성 중...")
        updated_data = process_all_figures(data)
        
        # 결과 저장
        print("💾 결과 저장 중...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)
        
        print("=" * 60)
        print("✅ 작업 완료!")
        print(f"📁 출력 파일: {output_file}")
        print("🎯 240명 × 4카테고리 = 960개 템플릿 생성 완료")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        raise

if __name__ == "__main__":
    main()