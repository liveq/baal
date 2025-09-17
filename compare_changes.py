#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

def compare_files():
    """백업 파일과 수정된 파일을 비교하여 변경사항을 표시"""
    
    # 백업 파일과 수정된 파일 비교
    with open(r'C:\code\rheight\zodiac-system\historical-figures-enhanced_backup.json', 'r', encoding='utf-8') as f:
        original = json.load(f)

    with open(r'C:\code\rheight\zodiac-system\historical-figures-enhanced.json', 'r', encoding='utf-8') as f:
        updated = json.load(f)

    changes = 0
    for zodiac_key, zodiac_data in original.get('zodiacFigures', {}).items():
        for i, figure in enumerate(zodiac_data.get('figures', [])):
            if 'naturalTemplates' in figure:
                for category in ['work', 'love', 'money', 'health']:
                    if category in figure['naturalTemplates']:
                        orig_text = figure['naturalTemplates'][category]
                        new_text = updated['zodiacFigures'][zodiac_key]['figures'][i]['naturalTemplates'][category]
                        
                        if orig_text != new_text:
                            changes += 1
                            print(f'{changes}. {figure.get("name", "Unknown")} - {category}:')
                            print(f'   원본: {orig_text}')
                            print(f'   수정: {new_text}')
                            print()

    print(f'총 {changes}개의 문장이 수정되었습니다.')

if __name__ == "__main__":
    compare_files()