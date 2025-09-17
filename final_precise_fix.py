#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def fix_remaining_errors(text):
    """남은 문법 오류들을 정확하게 수정"""
    
    # 1. 명확한 오타 수정
    exact_fixes = [
        ('처럼 은', '처럼'),
        ('수 있은', '수 있는'),  
        ('끝없은', '끝없는'),
        ('보가는', '보이는'),
        ('갔은', '간'),
        ('받은', '받는'),
        ('들은', '드는'),
        ('있은', '있는'),
        ('갖은', '가진'),
        ('담은', '담는'),
        ('맞은', '맞는'),
        ('찾은', '찾는'),
        ('않은', '않는'),
        ('같은', '같은'),  # 이건 맞음
        ('높은', '높은'),  # 이건 맞음
        ('많은', '많은'),  # 이건 맞음
        
        # 특정 동사 수정
        ('기다립니다', '기다리고 있습니다'),
        ('찾아옵니다', '찾아올 것입니다'),
        ('생깁니다', '생길 것입니다'),
        ('됩니다', '될 것입니다'),
    ]
    
    original = text
    
    for wrong, correct in exact_fixes:
        # 단어 경계를 고려한 정확한 치환
        pattern = r'\b' + re.escape(wrong) + r'\b'
        text = re.sub(pattern, correct, text)
    
    # 2. 특수한 패턴들
    # "수 있은 + 명사" 패턴 수정
    text = re.sub(r'수\s+있은\s+([가-힣]+)', r'수 있는 \1', text)
    
    # "끝없은" 패턴
    text = re.sub(r'끝없은\s+', '끝없는 ', text)
    
    # 3. 중복 공백 정리
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text

def apply_precise_fixes():
    """정밀한 최종 수정 적용"""
    
    file_path = r'C:\code\rheight\zodiac-system\historical-figures-enhanced.json'
    
    print(f"정밀 수정 시작: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_fixes = 0
    sample_fixes = []
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        zodiac_name = zodiac_data.get('name', zodiac_key)
        
        for figure in zodiac_data.get('figures', []):
            figure_name = figure.get('name', 'Unknown')
            
            if 'naturalTemplates' in figure:
                for category in ['work', 'love', 'money', 'health']:
                    if category in figure['naturalTemplates']:
                        original = figure['naturalTemplates'][category]
                        fixed = fix_remaining_errors(original)
                        
                        if original != fixed:
                            figure['naturalTemplates'][category] = fixed
                            total_fixes += 1
                            
                            if len(sample_fixes) < 20:  # 처음 20개만 기록
                                sample_fixes.append({
                                    'zodiac': zodiac_name,
                                    'figure': figure_name,
                                    'category': category,
                                    'original': original,
                                    'fixed': fixed
                                })
    
    print(f"\n=== 정밀 수정 완료 ===")
    print(f"총 {total_fixes}개의 정밀 수정이 완료되었습니다.")
    
    if sample_fixes:
        print(f"\n주요 수정 사항들:")
        for i, fix in enumerate(sample_fixes, 1):
            print(f"\n{i}. {fix['zodiac']} - {fix['figure']} ({fix['category']})")
            print(f"   원본: {fix['original']}")
            print(f"   수정: {fix['fixed']}")
            
            # 차이점 표시
            if fix['original'] != fix['fixed']:
                import difflib
                diff = list(difflib.unified_diff(
                    fix['original'].split(), 
                    fix['fixed'].split(),
                    lineterm='', n=0
                ))
                if len(diff) > 2:
                    changes = [line for line in diff[2:] if line.startswith('+') or line.startswith('-')]
                    if changes:
                        print(f"   변경점: {' -> '.join([c[1:] for c in changes[:2]])}")
    
    # 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n정밀 수정 완료. 파일 저장됨: {file_path}")
    
    return total_fixes

if __name__ == "__main__":
    apply_precise_fixes()