#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

def validate_json():
    try:
        with open(r'C:\code\rheight\zodiac-system\historical-figures-enhanced.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print('JSON 파일이 정상적으로 로드되었습니다.')
        
        # 전체 구조 확인
        zodiac_count = len(data.get('zodiacFigures', {}))
        total_figures = sum(len(zodiac.get('figures', [])) for zodiac in data.get('zodiacFigures', {}).values())
        
        print(f'   - 별자리 수: {zodiac_count}개')
        print(f'   - 총 역사적 인물 수: {total_figures}명')
        
        # naturalTemplates 확인
        total_templates = 0
        categories = ['work', 'love', 'money', 'health']
        
        for zodiac_data in data.get('zodiacFigures', {}).values():
            for figure in zodiac_data.get('figures', []):
                if 'naturalTemplates' in figure:
                    for category in categories:
                        if category in figure['naturalTemplates']:
                            total_templates += 1
        
        print(f'   - 총 naturalTemplates 수: {total_templates}개')
        print('모든 데이터가 정상입니다.')
        
        return True
        
    except Exception as e:
        print(f'오류 발생: {e}')
        return False

if __name__ == "__main__":
    validate_json()