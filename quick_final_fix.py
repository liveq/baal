#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

def quick_final_fix():
    """간단한 최종 수정"""
    
    file_path = r'C:\code\rheight\zodiac-system\historical-figures-enhanced.json'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    fixes = 0
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        for figure in zodiac_data.get('figures', []):
            if 'naturalTemplates' in figure:
                for category in ['work', 'love', 'money', 'health']:
                    if category in figure['naturalTemplates']:
                        original = figure['naturalTemplates'][category]
                        
                        # 간단한 패턴 수정들
                        fixed = original.replace('처럼 은 ', '처럼 ')
                        fixed = fixed.replace('처럼은 ', '처럼 ')
                        fixed = fixed.replace(' 은 ', ' ')
                        
                        if original != fixed:
                            figure['naturalTemplates'][category] = fixed
                            fixes += 1
                            print(f"수정: {figure.get('name')} - {category}")
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n총 {fixes}개 항목이 추가 수정되었습니다.")
    else:
        print("추가 수정이 필요한 항목이 없습니다.")

if __name__ == "__main__":
    quick_final_fix()