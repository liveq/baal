#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
서양 인물들의 실제 업적으로 정확하게 수정
"""

import json

def fix_western_achievements(data):
    """서양 인물들의 업적을 실제 업적으로 수정"""
    
    fixed_count = 0
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        figures = zodiac_data.get('figures', [])
        
        for figure in figures:
            name = figure.get('name', '')
            
            # 율리우스 카이사르
            if name == "율리우스 카이사르":
                figure['achievements'] = [
                    "갈리아 전쟁 - 8년간의 정복으로 로마 영토 2배 확장",
                    "루비콘 강 도하 - '주사위는 던져졌다' 역사적 결단",
                    "율리우스력 제정 - 365일 태양력 도입으로 현대 달력의 기초"
                ]
                figure['naturalTemplates'] = {
                    "work": "갈리아를 정복한 카이사르처럼",
                    "love": "클레오파트라를 사랑한 카이사르처럼",
                    "money": "로마를 부강하게 만든 카이사르처럼",
                    "health": "강인한 의지를 가진 카이사르처럼"
                }
                fixed_count += 1
                print(f"[수정] 율리우스 카이사르 - 실제 업적으로 교체")
                
            # 엘리자베스 1세
            elif name == "엘리자베스 1세":
                figure['achievements'] = [
                    "스페인 무적함대 격파 - 1588년 영국 해군의 역사적 승리",
                    "영국 황금시대 개막 - 45년 통치로 대영제국 기초 확립",
                    "셰익스피어 시대 - 문화 예술의 전성기 후원"
                ]
                figure['naturalTemplates'] = {
                    "work": "무적함대를 격파한 엘리자베스 1세처럼",
                    "love": "영국과 결혼한 엘리자베스 1세처럼",
                    "money": "영국을 부강하게 만든 엘리자베스 1세처럼",
                    "health": "70세까지 통치한 엘리자베스 1세처럼"
                }
                fixed_count += 1
                print(f"[수정] 엘리자베스 1세 - 실제 업적으로 교체")
                
            # 소크라테스
            elif name == "소크라테스":
                figure['achievements'] = [
                    "소크라테스식 문답법 - 질문을 통한 진리 탐구 방법 확립",
                    "너 자신을 알라 - 델포이 신전의 격언을 철학의 핵심으로",
                    "플라톤과 크세노폰 - 위대한 제자들을 통한 사상 전파"
                ]
                figure['naturalTemplates'] = {
                    "work": "문답법을 창시한 소크라테스처럼",
                    "love": "지혜를 사랑한 소크라테스처럼",
                    "money": "검소하게 살았던 소크라테스처럼",
                    "health": "독배를 마신 소크라테스처럼"
                }
                fixed_count += 1
                print(f"[수정] 소크라테스 - 실제 업적으로 교체")
                
            # 아놀드 슈워제네거
            elif name == "아놀드 슈워제네거":
                figure['achievements'] = [
                    "미스터 올림피아 7회 우승 - 보디빌딩 역사상 최고 기록",
                    "터미네이터 시리즈 - 'I'll be back' 명대사와 함께 영화 역사에 기록",
                    "캘리포니아 주지사 - 2003-2011년 제38대 주지사로 활동"
                ]
                figure['naturalTemplates'] = {
                    "work": "터미네이터를 연기한 슈워제네거처럼",
                    "love": "가족을 사랑하는 슈워제네거처럼",
                    "money": "다양한 사업에 성공한 슈워제네거처럼",
                    "health": "75세에도 운동하는 슈워제네거처럼"
                }
                fixed_count += 1
                print(f"[수정] 아놀드 슈워제네거 - 실제 업적으로 교체")
                
            # 실베스터 스탤론
            elif name == "실베스터 스탤론":
                figure['achievements'] = [
                    "록키 시리즈 - 3일만에 쓴 각본으로 아카데미 각본상 후보",
                    "람보 시리즈 - 베트남전 참전 용사를 그린 액션 영화의 전설",
                    "익스펜더블 시리즈 - 70대에도 액션 영화 제작 및 주연"
                ]
                figure['naturalTemplates'] = {
                    "work": "록키를 창조한 스탤론처럼",
                    "love": "가족을 위해 싸운 스탤론처럼",
                    "money": "자신의 각본을 믿은 스탤론처럼",
                    "health": "77세에도 운동하는 스탤론처럼"
                }
                fixed_count += 1
                print(f"[수정] 실베스터 스탤론 - 실제 업적으로 교체")
                
            # 토마스 제퍼슨 문법 수정
            elif name == "토마스 제퍼슨":
                # achievements는 유지하되 naturalTemplates만 수정
                if 'naturalTemplates' in figure:
                    figure['naturalTemplates']['work'] = "독립선언서를 작성한 제퍼슨처럼"
                    print(f"[문법] 토마스 제퍼슨 - '작성을 만든' → '작성한'")
                    fixed_count += 1
    
    print(f"\n[완료] 총 {fixed_count}개 인물 수정")
    return data

def main():
    """메인 실행 함수"""
    input_file = r"C:\code\rheight\zodiac-system\historical-figures-enhanced.json"
    
    print("[시작] 서양 인물 실제 업적 수정 작업")
    print("=" * 60)
    
    try:
        # 데이터 로드
        print("[로드] 데이터 읽기...")
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 업적 수정
        print("[처리] 실제 업적으로 수정...")
        updated_data = fix_western_achievements(data)
        
        # 결과 저장
        print("[저장] 업데이트된 데이터 저장...")
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)
        
        print("=" * 60)
        print("[성공] 서양 인물 실제 업적 수정 완료!")
        print("[품질] 역사적으로 정확한 업적 반영")
        
    except Exception as e:
        print(f"[오류] 처리 중 오류: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()