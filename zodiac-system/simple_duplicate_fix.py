#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

def simple_duplicate_fix():
    """간단한 방법으로 중복을 제거하는 함수"""
    
    with open('historical-figures-enhanced-final.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("=== 간단 중복 제거 ===")
    
    seen_names = set()
    total_removed = 0
    
    # 각 별자리를 순회하면서 중복 제거
    for zodiac_id in data['zodiacFigures'].keys():
        figures = data['zodiacFigures'][zodiac_id]['figures']
        unique_figures = []
        
        for figure in figures:
            name = figure['name']
            if name not in seen_names:
                seen_names.add(name)
                unique_figures.append(figure)
            else:
                print(f"중복 제거: {zodiac_id}에서 {name}")
                total_removed += 1
        
        data['zodiacFigures'][zodiac_id]['figures'] = unique_figures
    
    # 새로운 통계
    new_total = sum([len(zodiac['figures']) for zodiac in data['zodiacFigures'].values()])
    
    zodiac_names = {
        'aries': '양자리', 'taurus': '황소자리', 'gemini': '쌍둥이자리',
        'cancer': '게자리', 'leo': '사자자리', 'virgo': '처녀자리',
        'libra': '천칭자리', 'scorpio': '전갈자리', 'sagittarius': '궁수자리',
        'capricorn': '염소자리', 'aquarius': '물병자리', 'pisces': '물고기자리'
    }
    
    print(f"\n=== 중복 제거 후 분포 ===")
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        count = len(zodiac_data['figures'])
        print(f'{zodiac_names[zodiac_id]:8} | {count:2d}명')
    
    print(f"\n제거된 중복: {total_removed}명")
    print(f"최종 총 인물: {new_total}명")
    
    # 메타데이터 업데이트
    data['metadata']['totalFigures'] = new_total
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        data['metadata']['figuresByZodiac'][zodiac_id] = len(zodiac_data['figures'])
    
    # 저장
    with open('historical-figures-enhanced-final.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("중복 제거 완료!")
    return data

if __name__ == "__main__":
    simple_duplicate_fix()