#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
주요 인물들의 더 정교하고 자연스러운 맞춤형 템플릿 생성
각 인물의 특성과 업적을 정확히 반영한 품격 있는 한국어 표현
"""

import json
from typing import Dict, List, Any

def load_data(file_path: str) -> Dict[str, Any]:
    """데이터 파일 로드"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 주요 인물들의 정교한 맞춤형 템플릿
REFINED_TEMPLATES = {
    # 예술가/화가
    "레오나르도 다빈치": {
        "work": "모나리자를 그린 다빈치처럼",
        "love": "이상적인 아름다움을 추구한 다빈치처럼",
        "money": "다방면의 재능을 발휘한 다빈치처럼",
        "health": "끝없는 호기심을 가진 다빈치처럼"
    },
    "빈센트 반 고흐": {
        "work": "별이 빛나는 밤을 그린 고흐처럼",
        "love": "순수한 열정을 바친 고흐처럼",
        "money": "예술혼을 지킨 고흐처럼",
        "health": "예술로 마음을 달랜 고흐처럼"
    },
    "파블로 피카소": {
        "work": "게르니카를 그린 피카소처럼",
        "love": "창조적 영감을 준 피카소처럼",
        "money": "예술 혁신으로 성공한 피카소처럼",
        "health": "창조력으로 활력을 얻은 피카소처럼"
    },
    
    # 문학가
    "윌리엄 셰익스피어": {
        "work": "햄릿을 쓴 셰익스피어처럼",
        "love": "로미오와 줄리엣을 쓴 셰익스피어처럼",
        "money": "불멸의 작품으로 성공한 셰익스피어처럼",
        "health": "창작으로 생명력을 얻은 셰익스피어처럼"
    },
    "오노레 드 발자크": {
        "work": "인간희극을 완성한 발자크처럼",
        "love": "열정적인 사랑을 그린 발자크처럼",
        "money": "문학에 모든 것을 투자한 발자크처럼",
        "health": "창작 열정으로 살아간 발자크처럼"
    },
    
    # 음악가
    "요하네스 브람스": {
        "work": "독일 레퀴엠을 작곡한 브람스처럼",
        "love": "서정적인 선율로 사랑을 표현한 브람스처럼",
        "money": "음악적 완성도를 추구한 브람스처럼",
        "health": "음악으로 마음의 평안을 얻은 브람스처럼"
    },
    "엘튼 존": {
        "work": "로켓맨을 부른 엘튼 존처럼",
        "love": "진실한 사랑을 노래한 엘튼 존처럼",
        "money": "음악으로 큰 성공을 거둔 엘튼 존처럼",
        "health": "음악으로 활력을 얻는 엘튼 존처럼"
    },
    
    # 정치인/지도자
    "진시황": {
        "work": "중국을 통일한 진시황처럼",
        "love": "강력한 카리스마를 가진 진시황처럼",
        "money": "대제국을 건설한 진시황처럼",
        "health": "불굴의 의지를 가진 진시황처럼"
    },
    "무측천": {
        "work": "중국 유일한 여황제가 된 무측천처럼",
        "love": "독립적인 사랑을 한 무측천처럼",
        "money": "경제적 번영을 이룬 무측천처럼",
        "health": "강인한 정신력을 가진 무측천처럼"
    },
    "엘리자베스 2세": {
        "work": "70년간 재위한 엘리자베스 2세처럼",
        "love": "헌신적인 사랑을 실천한 엘리자베스 2세처럼",
        "money": "검소한 생활을 한 엘리자베스 2세처럼",
        "health": "규칙적인 생활로 장수한 엘리자베스 2세처럼"
    },
    
    # 배우/연예인
    "찰리 채플린": {
        "work": "모던 타임스를 만든 채플린처럼",
        "love": "순수한 감성을 지닌 채플린처럼",
        "money": "예술적 가치를 우선한 채플린처럼",
        "health": "웃음으로 세상을 치유한 채플린처럼"
    },
    "마론 브란도": {
        "work": "메소드 연기를 창시한 브란도처럼",
        "love": "깊은 감정을 추구한 브란도처럼",
        "money": "예술적 완성도를 중시한 브란도처럼",
        "health": "진실한 감정으로 건강을 지킨 브란도처럼"
    },
    "로버트 다우니 주니어": {
        "work": "아이언맨으로 재기한 다우니 주니어처럼",
        "love": "진정한 사랑으로 변화한 다우니 주니어처럼",
        "money": "성공적인 재기를 이룬 다우니 주니어처럼",
        "health": "역경을 극복한 다우니 주니어처럼"
    },
    
    # 과학자/철학자
    "지그문트 프로이트": {
        "work": "정신분석학을 창시한 프로이트처럼",
        "love": "깊은 내면을 이해한 프로이트처럼",
        "money": "지적 탐구에 투자한 프로이트처럼",
        "health": "정신적 활동으로 활력을 얻은 프로이트처럼"
    },
    "칼 마르크스": {
        "work": "자본론을 쓴 마르크스처럼",
        "love": "평등한 사회를 꿈꾼 마르크스처럼",
        "money": "경제 이론을 정립한 마르크스처럼",
        "health": "신념으로 건강을 지킨 마르크스처럼"
    },
    
    # 기업인/혁신가
    "스티브 잡스": {
        "work": "아이폰을 만든 스티브 잡스처럼",
        "love": "완벽을 추구한 스티브 잡스처럼",
        "money": "혁신으로 성공한 스티브 잡스처럼",
        "health": "창의적 열정을 가진 스티브 잡스처럼"
    }
}

def refine_all_templates(data: Dict[str, Any]) -> Dict[str, Any]:
    """모든 템플릿을 정교하게 개선"""
    
    refined_count = 0
    total_count = 0
    
    zodiac_figures = data.get('zodiacFigures', {})
    
    for zodiac_key, zodiac_data in zodiac_figures.items():
        zodiac_name = zodiac_data.get('name', zodiac_key)
        print(f"\n[정교화] {zodiac_name}")
        
        figures = zodiac_data.get('figures', [])
        
        for figure in figures:
            name = figure.get('name', '')
            total_count += 1
            
            # 기존 템플릿 유지 또는 정교한 템플릿으로 교체
            if name in REFINED_TEMPLATES:
                figure['naturalTemplates'] = REFINED_TEMPLATES[name]
                refined_count += 1
                print(f"  [개선] {name} - 정교한 템플릿 적용")
            else:
                print(f"  [유지] {name} - 기존 템플릿 유지")
    
    print(f"\n[완료] 총 {total_count}명 중 {refined_count}명 정교화 완료")
    return data

def main():
    """메인 실행 함수"""
    input_file = r"C:\code\rheight\zodiac-system\historical-figures-complete-templates.json"
    output_file = r"C:\code\rheight\zodiac-system\historical-figures-refined-templates.json"
    
    print("[정교화] 주요 인물 템플릿 정교화 작업")
    print("=" * 60)
    
    try:
        # 데이터 로드
        print("[로드] 기존 템플릿 데이터 읽기...")
        data = load_data(input_file)
        
        # 템플릿 정교화
        print("[처리] 주요 인물 템플릿 정교화...")
        refined_data = refine_all_templates(data)
        
        # 결과 저장
        print("[저장] 정교화된 템플릿 저장...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(refined_data, f, ensure_ascii=False, indent=2)
        
        print("=" * 60)
        print("[성공] 템플릿 정교화 완료!")
        print(f"[출력] {output_file}")
        print("[품질] 주요 인물의 더욱 자연스럽고 정교한 표현 완성")
        
    except Exception as e:
        print(f"[오류] 처리 중 오류: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()