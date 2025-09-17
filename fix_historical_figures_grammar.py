#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def fix_grammar_patterns(text):
    """한국어 문법 오류를 수정하는 함수"""
    
    # 원본 텍스트 저장
    original = text
    
    # 1. 지나치게 긴 수식어구 패턴 수정
    # 예: "철의 여인 마거릿 대처처럼, 오늘 중요한 결정 앞에서 흔들리지 않는 신념과 결단력으로 강력한 리더십을 발휘할 것입니다"
    # → "마거릿 대처처럼 흔들리지 않는 강력한 리더십을 발휘할 것입니다"
    
    # 지나치게 긴 문장을 간결하게 만들기
    if len(text) > 100 and '오늘' in text and '것입니다' in text:
        # 과도한 수식어 제거 패턴들
        patterns_to_simplify = [
            (r'오늘\s+중요한\s+결정\s+앞에서\s+', ''),
            (r'오늘\s+하루도?\s*', ''),
            (r'오늘은?\s*', ''),
            (r'와?\s+결단력으로\s+', '으로 '),
            (r'신념과\s+결단력으로\s+강력한\s+', '강력한 '),
            (r'독창적인\s+아이디어로\s+새로운\s+', '독창적인 아이디어로 '),
            (r'기존의\s+틀을\s+깨는\s+혁신적인\s+아이디어로\s+새로운\s+돌파구를\s+', '혁신적인 아이디어로 '),
        ]
        
        for pattern, replacement in patterns_to_simplify:
            text = re.sub(pattern, replacement, text)
    
    # 2. 부자연스러운 비유 표현 수정
    # "처럼, 오늘" → "처럼" (불필요한 '오늘' 제거)
    text = re.sub(r'처럼,\s*오늘\s+', '처럼 ', text)
    
    # 3. 어색한 표현들 수정
    awkward_patterns = [
        # "의 업적처럼" → "처럼" (이미 확인했지만 혹시 모르니까)
        (r'의\s+([가-힣\s]+)\s*-\s*[가-힣\s]+처럼', r'이/가 \1한 것처럼'),
        
        # 중복 표현 제거
        (r'창의적인\s+([가-힣]+)처럼,\s+창의적인', r'\1처럼'),
        (r'혁신적인\s+([가-힣]+)처럼,\s+혁신적인', r'\1처럼'),
        
        # 과도한 수식어 간소화
        (r'놀라운\s+성과를\s+이룰\s+수\s+있을\s+것입니다', r'성과를 이룰 수 있습니다'),
        (r'위대한\s+성취를\s+이룰\s+수\s+있을\s+것입니다', r'성취를 이룰 수 있습니다'),
        
        # 자연스럽지 않은 연결 수정
        (r'처럼,\s+([가-힣\s]+)으로\s+([가-힣\s]+)을?\s+', r'처럼 \2을 '),
    ]
    
    for pattern, replacement in awkward_patterns:
        text = re.sub(pattern, replacement, text)
    
    # 4. 조사 오류 수정 (종성 있는 글자 뒤에 올바른 조사)
    def fix_postposition(match):
        char = match.group(1)
        postposition = match.group(2)
        
        # 종성 확인 (유니코드 한글 완성형: AC00-D7AF)
        if ord(char) >= 0xAC00 and ord(char) <= 0xD7AF:
            # 종성 계산: (글자코드 - 0xAC00) % 28
            jongsung = (ord(char) - 0xAC00) % 28
            has_jongsung = jongsung != 0
            
            if postposition in ['을', '를']:
                return char + ('을' if has_jongsung else '를')
            elif postposition in ['이', '가']:
                return char + ('이' if has_jongsung else '가')
            elif postposition in ['은', '는']:
                return char + ('은' if has_jongsung else '는')
            elif postposition in ['과', '와']:
                return char + ('과' if has_jongsung else '와')
            elif postposition in ['으로', '로']:
                return char + ('으로' if has_jongsung else '로')
        
        return match.group(0)
    
    # 조사 수정 패턴들
    postposition_patterns = [
        r'([가-힣])(을|를)',
        r'([가-힣])(이|가)', 
        r'([가-힣])(은|는)',
        r'([가-힣])(과|와)',
        r'([가-힣])(으로|로)'
    ]
    
    for pattern in postposition_patterns:
        text = re.sub(pattern, fix_postposition, text)
    
    # 5. 중복 어미 수정
    text = re.sub(r'할\s+수\s+있을\s+것입니다', '할 수 있습니다', text)
    text = re.sub(r'될\s+수\s+있을\s+것입니다', '될 수 있습니다', text)
    
    # 6. 어색한 쉼표 사용 수정
    text = re.sub(r'처럼,\s+([가-힣]+이)\s+', r'처럼 \1 ', text)
    
    # 변경사항이 있으면 로그
    if original != text:
        print(f"수정됨: {original[:50]}...")
        print(f"    →  {text[:50]}...")
        print()
    
    return text

def process_json_file(file_path):
    """JSON 파일을 읽고 문법을 수정한 후 저장"""
    
    print(f"파일 읽는 중: {file_path}")
    
    # UTF-8로 파일 읽기
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_fixes = 0
    
    # 각 별자리별로 처리
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        print(f"\n=== {zodiac_data.get('name', zodiac_key)} 처리 중 ===")
        
        # 각 인물별로 처리
        for figure in zodiac_data.get('figures', []):
            figure_name = figure.get('name', 'Unknown')
            print(f"  처리 중: {figure_name}")
            
            # naturalTemplates 수정
            if 'naturalTemplates' in figure:
                for category in ['work', 'love', 'money', 'health']:
                    if category in figure['naturalTemplates']:
                        original = figure['naturalTemplates'][category]
                        fixed = fix_grammar_patterns(original)
                        
                        if original != fixed:
                            figure['naturalTemplates'][category] = fixed
                            total_fixes += 1
                            print(f"    {category}: 수정됨")
    
    print(f"\n총 {total_fixes}개의 문장이 수정되었습니다.")
    
    # 백업 파일 생성
    backup_path = file_path.replace('.json', '_backup.json')
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"백업 파일 생성: {backup_path}")
    
    # 수정된 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"수정된 파일 저장: {file_path}")

if __name__ == "__main__":
    file_path = r"C:\code\rheight\zodiac-system\historical-figures-enhanced.json"
    process_json_file(file_path)