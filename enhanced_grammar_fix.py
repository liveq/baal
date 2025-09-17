#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def has_jongsung(char):
    """한글 글자의 종성 여부를 확인"""
    if ord(char) >= 0xAC00 and ord(char) <= 0xD7AF:
        jongsung = (ord(char) - 0xAC00) % 28
        return jongsung != 0
    return False

def fix_postposition_errors(text):
    """조사 오류를 수정"""
    original = text
    
    def fix_postposition(match):
        char = match.group(1)
        postposition = match.group(2)
        
        if postposition in ['을', '를']:
            return char + ('을' if has_jongsung(char) else '를')
        elif postposition in ['이', '가']:
            return char + ('이' if has_jongsung(char) else '가')
        elif postposition in ['은', '는']:
            return char + ('은' if has_jongsung(char) else '는')
        elif postposition in ['과', '와']:
            return char + ('과' if has_jongsung(char) else '와')
        elif postposition in ['으로', '로']:
            return char + ('으로' if has_jongsung(char) else '로')
        
        return match.group(0)
    
    # 조사 패턴 적용
    patterns = [
        r'([가-힣])(을|를)',
        r'([가-힣])(이|가)',
        r'([가-힣])(은|는)', 
        r'([가-힣])(과|와)',
        r'([가-힣])(으로|로)'
    ]
    
    for pattern in patterns:
        text = re.sub(pattern, fix_postposition, text)
    
    return text

def fix_grammar_patterns(text):
    """다양한 문법 오류 패턴을 수정"""
    original = text
    
    # 1. 지나치게 긴 수식어 간소화
    if '오늘' in text and len(text) > 80:
        # "오늘 하루도", "오늘은" 등 불필요한 시간 표현 제거
        text = re.sub(r'오늘\s*하루도?\s*', '', text)
        text = re.sub(r'오늘은?\s*', '', text)
        
        # "중요한 결정 앞에서 흔들리지 않는 신념과 결단력으로" 간소화
        text = re.sub(r'중요한\s+결정\s+앞에서\s+흔들리지\s*않는\s+신념과\s+결단력으로\s+강력한\s+', '강력한 ', text)
        
        # "기존의 틀을 깨는 혁신적인 아이디어로 새로운 돌파구를" 간소화
        text = re.sub(r'기존의\s+틀을\s+깨는\s+혁신적인\s+아이디어로\s+새로운\s+돌파구를\s+', '혁신적인 아이디어로 ', text)
    
    # 2. 어색한 연결어 수정
    text = re.sub(r'처럼,\s+오늘\s+', '처럼 ', text)
    text = re.sub(r'처럼,\s+([^오][^늘])', r'처럼 \1', text)
    
    # 3. 중복 표현 제거
    text = re.sub(r'위대한\s+성취를\s+이룰\s+수\s+있을\s+것입니다', '성취를 이룰 수 있습니다', text)
    text = re.sub(r'놀라운\s+성과를\s+이룰\s+수\s+있을\s+것입니다', '성과를 이룰 수 있습니다', text)
    text = re.sub(r'할\s+수\s+있을\s+것입니다', '할 수 있습니다', text)
    text = re.sub(r'될\s+수\s+있을\s+것입니다', '될 수 있습니다', text)
    
    # 4. 특정 어색한 표현 수정
    text = re.sub(r'창의적인\s+아이디어로\s+새로운\s+성공의\s+길을\s+열어갈\s+것입니다', '창의적인 아이디어로 성공의 길을 열어갈 것입니다', text)
    text = re.sub(r'독창적인\s+아이디어로\s+새로운\s+성공의\s+길을\s+열어갈\s+것입니다', '독창적인 아이디어로 성공의 길을 열어갈 것입니다', text)
    
    # 5. 조사 오류 수정
    text = fix_postposition_errors(text)
    
    return text

def process_historical_figures():
    """역사적 인물 JSON 파일의 문법을 교정"""
    
    file_path = r'C:\code\rheight\zodiac-system\historical-figures-enhanced.json'
    
    print(f"파일 읽는 중: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_fixes = 0
    specific_fixes = []
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        zodiac_name = zodiac_data.get('name', zodiac_key)
        print(f"\n=== {zodiac_name} 처리 중 ===")
        
        for figure in zodiac_data.get('figures', []):
            figure_name = figure.get('name', 'Unknown')
            
            if 'naturalTemplates' in figure:
                for category in ['work', 'love', 'money', 'health']:
                    if category in figure['naturalTemplates']:
                        original = figure['naturalTemplates'][category]
                        fixed = fix_grammar_patterns(original)
                        
                        if original != fixed:
                            figure['naturalTemplates'][category] = fixed
                            total_fixes += 1
                            
                            specific_fixes.append({
                                'zodiac': zodiac_name,
                                'figure': figure_name,
                                'category': category,
                                'original': original,
                                'fixed': fixed
                            })
                            
                            print(f"  {figure_name} - {category}: 수정됨")
    
    print(f"\n=== 수정 결과 ===")
    print(f"총 {total_fixes}개의 문장이 수정되었습니다.")
    
    if specific_fixes:
        print("\n수정된 문장들:")
        for i, fix in enumerate(specific_fixes, 1):
            print(f"\n{i}. {fix['zodiac']} - {fix['figure']} ({fix['category']})")
            print(f"   원본: {fix['original'][:100]}{'...' if len(fix['original']) > 100 else ''}")
            print(f"   수정: {fix['fixed'][:100]}{'...' if len(fix['fixed']) > 100 else ''}")
    
    if total_fixes > 0:
        # 백업 생성
        backup_path = file_path.replace('.json', '_grammar_backup.json')
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n백업 파일: {backup_path}")
        
        # 수정된 파일 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"수정된 파일: {file_path}")
    else:
        print("\n수정할 문법 오류가 발견되지 않았습니다.")

if __name__ == "__main__":
    process_historical_figures()