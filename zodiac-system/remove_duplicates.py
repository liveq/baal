#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from collections import Counter

def remove_duplicates():
    """중복 인물을 제거하고 정리된 데이터를 저장하는 함수"""
    
    with open('historical-figures-enhanced.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 중복 제거 전 통계
    original_count = sum([len(zodiac['figures']) for zodiac in data['zodiacFigures'].values()])
    print(f"원본 총 인물 수: {original_count}")
    
    # 중복 제거 대상
    duplicates_to_remove = [
        ('virgo', 'Paul McCartney'),  # virgo에서 폴 맥카트니 제거 (gemini에 유지)
        ('libra', 'Confucius')       # libra에서 공자 제거 (gemini에 유지)
    ]
    
    removed_count = 0
    
    for zodiac_id, name_to_remove in duplicates_to_remove:
        zodiac_figures = data['zodiacFigures'][zodiac_id]['figures']
        
        # 제거할 인물 찾기
        for i, figure in enumerate(zodiac_figures):
            if figure['name'] == name_to_remove or figure.get('nameEn', '') == name_to_remove:
                print(f"제거: {zodiac_id}에서 {figure['name']} ({figure.get('nameEn', '')})")
                zodiac_figures.pop(i)
                removed_count += 1
                break
    
    # 새로운 통계 계산
    new_count = sum([len(zodiac['figures']) for zodiac in data['zodiacFigures'].values()])
    print(f"제거 후 총 인물 수: {new_count}")
    print(f"제거된 인물 수: {removed_count}")
    
    # 별자리별 분포 업데이트
    zodiac_names = {
        'aries': '양자리', 'taurus': '황소자리', 'gemini': '쌍둥이자리',
        'cancer': '게자리', 'leo': '사자자리', 'virgo': '처녀자리',
        'libra': '천칭자리', 'scorpio': '전갈자리', 'sagittarius': '궁수자리',
        'capricorn': '염소자리', 'aquarius': '물병자리', 'pisces': '물고기자리'
    }
    
    print("\n=== 중복 제거 후 별자리별 분포 ===")
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        count = len(zodiac_data['figures'])
        print(f'{zodiac_names[zodiac_id]:8} | {count:2d}명')
    
    # 메타데이터 업데이트
    data['metadata']['totalFigures'] = new_count
    data['metadata']['updated'] = '2025-01-11'
    
    # figuresByZodiac 업데이트
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        data['metadata']['figuresByZodiac'][zodiac_id] = len(zodiac_data['figures'])
    
    # 정리된 데이터 저장
    with open('historical-figures-enhanced-cleaned.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n정리된 데이터가 'historical-figures-enhanced-cleaned.json'에 저장되었습니다.")
    return data

if __name__ == "__main__":
    remove_duplicates()