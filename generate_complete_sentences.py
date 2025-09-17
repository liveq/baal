#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
240명 인물에 대한 완전한 문장 생성
각 카테고리별로 독립적이고 완전한 한국어 문장
"""

import json
from typing import Dict, Any

def generate_complete_sentences(data: Dict[str, Any]) -> Dict[str, Any]:
    """모든 인물에 대해 완전한 문장 생성"""
    
    # 카테고리별 문장 템플릿
    sentence_templates = {
        "work": {
            "endings": [
                "오늘은 새로운 도전을 시작하기 좋은 날입니다",
                "당신의 노력이 결실을 맺을 것입니다",
                "큰 성과를 이룰 수 있는 기회가 찾아옵니다",
                "창의적인 아이디어가 샘솟을 것입니다",
                "목표 달성에 한 걸음 더 가까워집니다"
            ]
        },
        "love": {
            "endings": [
                "진정한 사랑을 만날 수 있는 기회가 옵니다",
                "마음이 통하는 사람과의 만남이 기다립니다",
                "사랑하는 사람과 더 깊은 유대감을 형성합니다",
                "새로운 인연이 당신을 찾아올 것입니다",
                "행복한 관계를 만들어갈 수 있습니다"
            ]
        },
        "money": {
            "endings": [
                "재정적 안정을 찾을 수 있는 날입니다",
                "예상치 못한 수입이 들어올 가능성이 있습니다",
                "현명한 투자 기회를 발견하게 됩니다",
                "경제적 여유가 생기는 시기입니다",
                "재물운이 상승하는 좋은 시기입니다"
            ]
        },
        "health": {
            "endings": [
                "활력이 넘치는 하루를 보낼 수 있습니다",
                "건강한 에너지가 충만한 날입니다",
                "몸과 마음의 균형을 찾을 수 있습니다",
                "새로운 활력을 얻게 될 것입니다",
                "건강 관리에 좋은 결과가 있을 것입니다"
            ]
        }
    }
    
    processed_count = 0
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        figures = zodiac_data.get('figures', [])
        
        for i, figure in enumerate(figures):
            name = figure.get('name', '')
            
            # naturalTemplates가 없으면 생성
            if 'naturalTemplates' not in figure:
                figure['naturalTemplates'] = {}
            
            # 완전한 문장으로 변경
            complete_sentences = {}
            
            # work (직장운)
            if 'work' in figure.get('naturalTemplates', {}):
                base = figure['naturalTemplates']['work']
                if base.endswith('처럼'):
                    ending_idx = hash(name + 'work') % len(sentence_templates['work']['endings'])
                    complete_sentences['work'] = f"{base}, {sentence_templates['work']['endings'][ending_idx]}"
                else:
                    complete_sentences['work'] = base
            
            # love (애정운)
            if 'love' in figure.get('naturalTemplates', {}):
                base = figure['naturalTemplates']['love']
                if base.endswith('처럼'):
                    ending_idx = hash(name + 'love') % len(sentence_templates['love']['endings'])
                    complete_sentences['love'] = f"{base}, {sentence_templates['love']['endings'][ending_idx]}"
                else:
                    complete_sentences['love'] = base
            
            # money (금전운)
            if 'money' in figure.get('naturalTemplates', {}):
                base = figure['naturalTemplates']['money']
                if base.endswith('처럼'):
                    ending_idx = hash(name + 'money') % len(sentence_templates['money']['endings'])
                    complete_sentences['money'] = f"{base}, {sentence_templates['money']['endings'][ending_idx]}"
                else:
                    complete_sentences['money'] = base
            
            # health (건강운)
            if 'health' in figure.get('naturalTemplates', {}):
                base = figure['naturalTemplates']['health']
                if base.endswith('처럼'):
                    ending_idx = hash(name + 'health') % len(sentence_templates['health']['endings'])
                    complete_sentences['health'] = f"{base}, {sentence_templates['health']['endings'][ending_idx]}"
                else:
                    complete_sentences['health'] = base
            
            # 완전한 문장으로 교체
            if complete_sentences:
                figure['naturalTemplates'] = complete_sentences
                processed_count += 1
                print(f"[생성] {name}:")
                for category, sentence in complete_sentences.items():
                    print(f"  - {category}: {sentence[:50]}...")
    
    print(f"\n[완료] {processed_count}명의 인물에 대한 완전한 문장 생성")
    return data

def create_specific_complete_sentences():
    """주요 인물들에 대한 구체적이고 완전한 문장 생성"""
    
    specific_sentences = {
        "레오나르도 다빈치": {
            "work": "모나리자를 그린 다빈치처럼, 오늘은 창의적인 걸작을 만들어낼 수 있는 날입니다",
            "love": "이상적인 아름다움을 추구한 다빈치처럼, 완벽한 사랑을 발견할 수 있습니다",
            "money": "다방면의 재능을 발휘한 다빈치처럼, 다양한 수입원이 생길 것입니다",
            "health": "끝없는 호기심을 가진 다빈치처럼, 정신적 활력이 넘치는 하루가 됩니다"
        },
        "율리우스 카이사르": {
            "work": "갈리아를 정복한 카이사르처럼, 불가능해 보이는 목표도 달성할 수 있습니다",
            "love": "클레오파트라를 사랑한 카이사르처럼, 운명적인 만남이 기다리고 있습니다",
            "money": "로마를 부강하게 만든 카이사르처럼, 재정적 성공을 거둘 것입니다",
            "health": "강인한 의지를 가진 카이사르처럼, 어떤 어려움도 극복할 수 있습니다"
        },
        "엘리자베스 1세": {
            "work": "무적함대를 격파한 엘리자베스 1세처럼, 경쟁에서 승리할 것입니다",
            "love": "영국과 결혼한 엘리자베스 1세처럼, 독립적이면서도 충만한 사랑을 경험합니다",
            "money": "영국을 부강하게 만든 엘리자베스 1세처럼, 경제적 번영을 이룹니다",
            "health": "70세까지 통치한 엘리자베스 1세처럼, 건강하고 활력 있는 삶을 살 것입니다"
        },
        "소크라테스": {
            "work": "문답법을 창시한 소크라테스처럼, 깊은 통찰력으로 문제를 해결합니다",
            "love": "지혜를 사랑한 소크라테스처럼, 정신적 교감이 깊은 관계를 만듭니다",
            "money": "검소하게 살았던 소크라테스처럼, 작은 것에서 큰 행복을 찾습니다",
            "health": "철학으로 마음을 다스린 소크라테스처럼, 정신 건강이 향상됩니다"
        },
        "빈센트 반 고흐": {
            "work": "별이 빛나는 밤을 그린 고흐처럼, 독창적인 성과를 만들어냅니다",
            "love": "순수한 열정을 바친 고흐처럼, 진실한 사랑이 찾아옵니다",
            "money": "예술혼을 지킨 고흐처럼, 가치 있는 일에서 보상을 받습니다",
            "health": "예술로 마음을 달랜 고흐처럼, 창작 활동이 치유가 됩니다"
        },
        "마리 퀴리": {
            "work": "노벨상을 두 번 받은 퀴리처럼, 뛰어난 성과를 인정받습니다",
            "love": "피에르와 함께 연구한 퀴리처럼, 함께 성장하는 사랑을 만듭니다",
            "money": "라듐을 발견한 퀴리처럼, 숨겨진 가치를 발견하게 됩니다",
            "health": "평생 연구에 몰두한 퀴리처럼, 열정이 활력을 가져다줍니다"
        },
        "스티브 잡스": {
            "work": "아이폰을 만든 스티브 잡스처럼, 혁신적인 아이디어가 성공으로 이어집니다",
            "love": "완벽을 추구한 스티브 잡스처럼, 이상적인 관계를 만들어갑니다",
            "money": "애플을 창업한 스티브 잡스처럼, 큰 부를 창출할 기회가 옵니다",
            "health": "창의적 열정을 가진 스티브 잡스처럼, 정신적 에너지가 충만합니다"
        },
        "아놀드 슈워제네거": {
            "work": "터미네이터를 연기한 슈워제네거처럼, 강력한 존재감을 발휘합니다",
            "love": "가족을 사랑하는 슈워제네거처럼, 든든한 사랑을 주고받습니다",
            "money": "다양한 사업에 성공한 슈워제네거처럼, 여러 분야에서 수익을 창출합니다",
            "health": "75세에도 운동하는 슈워제네거처럼, 꾸준한 노력이 건강을 가져옵니다"
        },
        "실베스터 스탤론": {
            "work": "록키를 창조한 스탤론처럼, 포기하지 않는 노력이 성공을 만듭니다",
            "love": "가족을 위해 싸운 스탤론처럼, 사랑하는 사람을 지킬 수 있습니다",
            "money": "자신의 각본을 믿은 스탤론처럼, 자신감이 재정적 성공으로 이어집니다",
            "health": "77세에도 운동하는 스탤론처럼, 나이를 잊은 활력을 유지합니다"
        },
        "알베르트 아인슈타인": {
            "work": "상대성이론을 발견한 아인슈타인처럼, 획기적인 돌파구를 찾습니다",
            "love": "우주를 사랑한 아인슈타인처럼, 무한한 사랑의 가능성을 발견합니다",
            "money": "노벨상을 받은 아인슈타인처럼, 노력의 대가를 인정받습니다",
            "health": "상상력을 중시한 아인슈타인처럼, 창의적 활동이 건강을 증진시킵니다"
        },
        "넬슨 만델라": {
            "work": "27년 투옥을 견딘 만델라처럼, 인내가 큰 성과로 이어집니다",
            "love": "화해를 추구한 만델라처럼, 용서와 사랑으로 관계가 깊어집니다",
            "money": "남아공을 이끈 만델라처럼, 리더십이 경제적 보상을 가져옵니다",
            "health": "95세까지 산 만델라처럼, 긍정적 마음이 장수의 비결이 됩니다"
        },
        "토마스 제퍼슨": {
            "work": "독립선언서를 작성한 제퍼슨처럼, 역사에 남을 업적을 만듭니다",
            "love": "자유를 사랑한 제퍼슨처럼, 구속 없는 자유로운 사랑을 합니다",
            "money": "몬티첼로를 건설한 제퍼슨처럼, 큰 자산을 구축할 수 있습니다",
            "health": "83세까지 활동한 제퍼슨처럼, 지적 활동이 건강을 유지시킵니다"
        }
    }
    
    return specific_sentences

def apply_specific_sentences(data: Dict[str, Any], specific_sentences: Dict) -> Dict[str, Any]:
    """특정 인물들에게 구체적인 완전 문장 적용"""
    
    applied_count = 0
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        figures = zodiac_data.get('figures', [])
        
        for figure in figures:
            name = figure.get('name', '')
            
            if name in specific_sentences:
                figure['naturalTemplates'] = specific_sentences[name]
                applied_count += 1
                print(f"[적용] {name} - 구체적 완전 문장 적용")
    
    print(f"\n[완료] {applied_count}명에 대한 구체적 문장 적용")
    return data

def main():
    """메인 실행 함수"""
    input_file = r"C:\code\rheight\zodiac-system\historical-figures-enhanced.json"
    output_file = r"C:\code\rheight\zodiac-system\historical-figures-complete.json"
    
    print("=" * 60)
    print("[시작] 240명 인물 완전한 문장 생성")
    print("=" * 60)
    
    try:
        # 데이터 로드
        print("\n[1단계] 데이터 로드...")
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 기본 완전 문장 생성
        print("\n[2단계] 기본 완전 문장 생성...")
        data = generate_complete_sentences(data)
        
        # 주요 인물 구체적 문장 적용
        print("\n[3단계] 주요 인물 구체적 문장 적용...")
        specific_sentences = create_specific_complete_sentences()
        data = apply_specific_sentences(data, specific_sentences)
        
        # 결과 저장
        print("\n[4단계] 결과 저장...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # enhanced.json도 업데이트
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print("\n" + "=" * 60)
        print("[성공] 완전한 문장 생성 완료!")
        print(f"[출력] {output_file}")
        print("[품질] 각 카테고리별 독립적이고 완전한 한국어 문장")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n[오류] 처리 중 오류: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()