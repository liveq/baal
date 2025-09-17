#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
중국 인물들을 서양 인물로 대체
+ "작성을" → "작성한" 문법 수정
"""

import json
import re

# 대체할 서양 인물들 (중국 인물 대체용)
WESTERN_REPLACEMENTS = {
    "진시황": {
        "name": "율리우스 카이사르",
        "nameEn": "Julius Caesar",
        "period": "기원전 100-44",
        "country": "로마",
        "achievements": [
            "로마 제국 건설 - 갈리아 정복으로 로마 영토 확장",
            "달력 개혁 - 율리우스력 제정으로 현대 달력의 기초",
            "루비콘 강 도하 - 운명적 결단으로 역사 전환"
        ],
        "coreTraits": [
            "야망",
            "전략적 사고",
            "카리스마"
        ],
        "famousQuote": "왔노라, 보았노라, 이겼노라 (Veni, vidi, vici)",
        "categoryTraits": {
            "work": "전략적 사고와 결단력으로 불가능해 보이는 목표 달성",
            "love": "열정적이고 충성스러운 사랑으로 파트너와 깊은 유대감 형성",
            "money": "대담한 투자와 전략으로 큰 부를 축적하는 능력",
            "health": "강인한 정신력으로 신체적 한계를 극복하는 힘"
        },
        "naturalTemplates": {
            "work": "로마를 정복한 카이사르처럼",
            "love": "열정적인 사랑을 한 카이사르처럼",
            "money": "전략적인 부를 쌓은 카이사르처럼",
            "health": "강인한 의지를 가진 카이사르처럼"
        }
    },
    "무측천": {
        "name": "엘리자베스 1세",
        "nameEn": "Elizabeth I",
        "period": "1533-1603",
        "country": "영국",
        "achievements": [
            "영국 황금시대 - 45년 통치로 대영제국 기초 확립",
            "스페인 무적함대 격파 - 해상 강국으로 도약",
            "문화 부흥 - 셰익스피어 시대 개막"
        ],
        "coreTraits": [
            "독립성",
            "지혜",
            "강인함"
        ],
        "famousQuote": "나는 왕의 심장과 위장을 가지고 있다",
        "categoryTraits": {
            "work": "독립적이고 현명한 리더십으로 조직을 성공으로 이끌기",
            "love": "독립성을 유지하면서도 깊은 신뢰관계 구축",
            "money": "신중하고 전략적인 투자로 안정적 부를 축적",
            "health": "정신적 강인함이 육체적 건강의 기반"
        },
        "naturalTemplates": {
            "work": "대영제국을 건설한 엘리자베스 1세처럼",
            "love": "독립적인 사랑을 추구한 엘리자베스 1세처럼",
            "money": "현명하게 부를 관리한 엘리자베스 1세처럼",
            "health": "강인한 정신력을 가진 엘리자베스 1세처럼"
        }
    },
    "공자": {
        "name": "소크라테스",
        "nameEn": "Socrates",
        "period": "기원전 470-399",
        "country": "그리스",
        "achievements": [
            "서양 철학의 아버지 - 문답법으로 진리 탐구",
            "윤리학 창시 - 도덕과 선에 대한 철학적 탐구",
            "플라톤의 스승 - 위대한 제자들 양성"
        ],
        "coreTraits": [
            "지혜",
            "겸손",
            "진리 추구"
        ],
        "famousQuote": "너 자신을 알라",
        "categoryTraits": {
            "work": "끊임없는 질문과 탐구로 진리에 도달하려는 노력",
            "love": "정신적 교감과 지적 대화를 통한 깊은 관계",
            "money": "물질보다 정신적 가치를 중시하는 삶",
            "health": "정신의 건강이 육체 건강의 기초"
        },
        "naturalTemplates": {
            "work": "진리를 탐구한 소크라테스처럼",
            "love": "지혜로운 사랑을 추구한 소크라테스처럼",
            "money": "검소한 삶을 산 소크라테스처럼",
            "health": "건강한 정신을 가진 소크라테스처럼"
        }
    },
    "이소룡": {
        "name": "아놀드 슈워제네거",
        "nameEn": "Arnold Schwarzenegger",
        "period": "1947-",
        "country": "오스트리아/미국",
        "achievements": [
            "보디빌딩 챔피언 - 미스터 올림피아 7회 우승",
            "할리우드 액션 스타 - 터미네이터 시리즈로 전설",
            "캘리포니아 주지사 - 정치인으로 성공적 변신"
        ],
        "coreTraits": [
            "규율",
            "목표 지향성",
            "변화 추구"
        ],
        "famousQuote": "I'll be back",
        "categoryTraits": {
            "work": "철저한 자기관리와 규율로 목표를 달성하는 추진력",
            "love": "강인함 속의 부드러움으로 가족을 보호",
            "money": "다양한 분야 도전으로 수익원 다각화",
            "health": "규칙적인 운동과 영양관리로 건강 유지"
        },
        "naturalTemplates": {
            "work": "터미네이터를 연기한 슈워제네거처럼",
            "love": "가족을 사랑한 슈워제네거처럼",
            "money": "다양한 성공을 거둔 슈워제네거처럼",
            "health": "철저한 운동을 한 슈워제네거처럼"
        }
    },
    "성룡": {
        "name": "실베스터 스탤론",
        "nameEn": "Sylvester Stallone",
        "period": "1946-",
        "country": "미국",
        "achievements": [
            "록키 시리즈 - 언더독 스토리의 대명사",
            "람보 시리즈 - 액션 영화의 아이콘",
            "각본가 겸 감독 - 록키 각본으로 아카데미 후보"
        ],
        "coreTraits": [
            "끈기",
            "투지",
            "창의성"
        ],
        "famousQuote": "Going in one more round when you don't think you can",
        "categoryTraits": {
            "work": "포기하지 않는 끈기로 역경을 극복하고 성공",
            "love": "진실하고 헌신적인 사랑으로 가족 우선",
            "money": "자신의 재능을 믿고 투자하여 큰 성공",
            "health": "나이를 잊은 꾸준한 운동과 건강관리"
        },
        "naturalTemplates": {
            "work": "록키를 창조한 스탤론처럼",
            "love": "헌신적인 사랑을 한 스탤론처럼",
            "money": "자신을 믿고 투자한 스탤론처럼",
            "health": "꾸준히 운동한 스탤론처럼"
        }
    }
}

def fix_grammar(text):
    """문법 오류 수정"""
    # "작성을 만든" → "작성한"
    text = re.sub(r'작성을?\s*만들(어낸|은)', '작성한', text)
    text = re.sub(r'선언서\s*작성을?\s*만들(어낸|은)', '선언서를 작성한', text)
    
    # "통일을 만들어낸" → "통일한"
    text = re.sub(r'통일을?\s*만들(어낸|은)', '통일한', text)
    
    # 기타 문법 수정
    text = re.sub(r'창조를?\s*만들(어낸|은)', '창조한', text)
    text = re.sub(r'발명을?\s*만들(어낸|은)', '발명한', text)
    
    return text

def replace_chinese_figures(data):
    """중국 인물을 서양 인물로 대체"""
    
    replaced_count = 0
    grammar_fixed_count = 0
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        figures = zodiac_data.get('figures', [])
        
        for i, figure in enumerate(figures):
            # 중국 인물 체크 및 대체
            if figure['name'] in WESTERN_REPLACEMENTS:
                old_name = figure['name']
                replacement = WESTERN_REPLACEMENTS[old_name]
                
                # 기존 인물 대체
                figures[i] = replacement.copy()
                replaced_count += 1
                print(f"[대체] {old_name} → {replacement['name']}")
            
            # 모든 인물의 문법 수정
            figure_name = figures[i]['name']
            
            # categoryTraits 문법 수정
            if 'categoryTraits' in figures[i]:
                for cat_key, cat_value in figures[i]['categoryTraits'].items():
                    original = cat_value
                    fixed = fix_grammar(cat_value)
                    if original != fixed:
                        figures[i]['categoryTraits'][cat_key] = fixed
                        grammar_fixed_count += 1
                        print(f"[문법] {figure_name} - {cat_key}: 수정됨")
            
            # naturalTemplates 문법 수정
            if 'naturalTemplates' in figures[i]:
                for temp_key, temp_value in figures[i]['naturalTemplates'].items():
                    original = temp_value
                    fixed = fix_grammar(temp_value)
                    if original != fixed:
                        figures[i]['naturalTemplates'][temp_key] = fixed
                        grammar_fixed_count += 1
                        print(f"[문법] {figure_name} - naturalTemplate {temp_key}: 수정됨")
    
    print(f"\n[완료] 중국 인물 {replaced_count}명 대체")
    print(f"[완료] 문법 오류 {grammar_fixed_count}개 수정")
    
    return data

def main():
    """메인 실행 함수"""
    input_file = r"C:\code\rheight\zodiac-system\historical-figures-enhanced.json"
    output_file = r"C:\code\rheight\zodiac-system\historical-figures-western.json"
    
    print("[시작] 중국 인물 서양 인물 대체 작업")
    print("=" * 60)
    
    try:
        # 데이터 로드
        print("[로드] 기존 데이터 읽기...")
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 중국 인물 대체 및 문법 수정
        print("[처리] 중국 인물 대체 및 문법 수정...")
        updated_data = replace_chinese_figures(data)
        
        # 결과 저장
        print("[저장] 업데이트된 데이터 저장...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)
        
        # enhanced.json도 업데이트
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)
        
        print("=" * 60)
        print("[성공] 중국 인물 대체 완료!")
        print(f"[출력] {output_file}")
        print("[품질] 서양 인물로 대체 + 문법 오류 수정")
        
    except Exception as e:
        print(f"[오류] 처리 중 오류: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()