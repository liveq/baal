#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from collections import Counter

def find_and_display_duplicates():
    """중복 인물을 찾고 상세 정보를 표시하는 함수"""
    
    with open('historical-figures-enhanced.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    all_names = []
    figure_details = {}
    
    # 모든 인물의 이름과 상세 정보 수집
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        for figure in zodiac_data['figures']:
            name = figure['name']
            all_names.append(name)
            
            if name not in figure_details:
                figure_details[name] = []
            
            figure_details[name].append({
                'zodiac': zodiac_id,
                'nameEn': figure.get('nameEn', ''),
                'period': figure.get('period', ''),
                'country': figure.get('country', ''),
                'index': len(zodiac_data['figures']) - 1
            })
    
    # 중복 찾기
    name_counts = Counter(all_names)
    duplicates = [name for name, count in name_counts.items() if count > 1]
    
    print("=== 중복 인물 상세 분석 ===")
    print(f"총 인물 수: {len(all_names)}")
    print(f"고유 인물 수: {len(set(all_names))}")
    print(f"중복 인물 수: {len(duplicates)}")
    print()
    
    for name in duplicates:
        print(f"★ 중복 인물: {name}")
        for detail in figure_details[name]:
            print(f"  - {detail['zodiac']}: {detail['nameEn']} ({detail['period']}) from {detail['country']}")
        print()
    
    return duplicates, figure_details

if __name__ == "__main__":
    find_and_display_duplicates()