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

def fix_comprehensive_grammar(text):
    """포괄적인 문법 오류 수정"""
    original = text
    
    # 1. 특정 오타 수정
    typo_fixes = [
        ('카가사르', '카이사르'),
        ('불이능해', '불가능해'),
        ('수 있은', '수 있는'),
        ('끝없은', '끝없는'),
        ('가져다줄', '가져다줄'),
        ('이루어낼', '이루어낼'),
        ('같아질', '같아질'),
    ]
    
    for typo, correct in typo_fixes:
        text = text.replace(typo, correct)
    
    # 2. 조사 오류 수정 (더 정교한 버전)
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
    
    # 조사 패턴들
    postposition_patterns = [
        r'([가-힣])(을|를)(?=\s)',
        r'([가-힣])(이|가)(?=\s)',
        r'([가-힣])(은|는)(?=\s)',
        r'([가-힣])(과|와)(?=\s)',
        r'([가-힣])(으로|로)(?=\s)'
    ]
    
    for pattern in postposition_patterns:
        text = re.sub(pattern, fix_postposition, text)
    
    # 3. 어색한 표현들 수정
    awkward_patterns = [
        # "처럼," 다음의 불필요한 "오늘" 제거
        (r'처럼,\s*오늘\s*', '처럼 '),
        
        # 중복 표현 수정
        (r'할\s+수\s+있을\s+것입니다', '할 수 있습니다'),
        (r'될\s+수\s+있을\s+것입니다', '될 수 있습니다'),
        (r'이룰\s+수\s+있을\s+것입니다', '이룰 수 있습니다'),
        
        # 어색한 연결 수정
        (r'처럼,\s+', '처럼 '),
        
        # 과도한 수식어 간소화
        (r'놀라운\s+성과를\s+이룰\s+수\s+있을\s+것입니다', '놀라운 성과를 이룰 수 있습니다'),
        (r'위대한\s+성취를\s+이룰\s+수\s+있을\s+것입니다', '위대한 성취를 이룰 수 있습니다'),
        
        # 길고 어색한 표현들 간소화
        (r'중요한\s+결정\s+앞에서\s+흔들리지\s*않는\s+신념과\s+결단력으로\s+강력한\s+', '강력한 '),
        (r'기존의\s+틀을\s+깨는\s+혁신적인\s+아이디어로\s+새로운\s+돌파구를\s+', '혁신적인 아이디어로 '),
        (r'독창적인\s+아이디어로\s+새로운\s+성공의\s+길을\s+열어갈\s+것입니다', '독창적인 아이디어로 성공할 수 있습니다'),
        
        # 시제 일치 문제
        (r'기다립니다', '기다리고 있습니다'),
        (r'찾아옵니다', '찾아올 것입니다'),
    ]
    
    for pattern, replacement in awkward_patterns:
        text = re.sub(pattern, replacement, text)
    
    # 4. 문장 끝 정리
    text = re.sub(r'\s+', ' ', text)  # 중복 공백 제거
    text = text.strip()  # 앞뒤 공백 제거
    
    return text

def apply_final_fixes():
    """최종 문법 수정 적용"""
    
    file_path = r'C:\code\rheight\zodiac-system\historical-figures-enhanced.json'
    
    print(f"파일 읽는 중: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_fixes = 0
    detailed_fixes = []
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        zodiac_name = zodiac_data.get('name', zodiac_key)
        
        for figure in zodiac_data.get('figures', []):
            figure_name = figure.get('name', 'Unknown')
            
            if 'naturalTemplates' in figure:
                for category in ['work', 'love', 'money', 'health']:
                    if category in figure['naturalTemplates']:
                        original = figure['naturalTemplates'][category]
                        fixed = fix_comprehensive_grammar(original)
                        
                        if original != fixed:
                            figure['naturalTemplates'][category] = fixed
                            total_fixes += 1
                            
                            detailed_fixes.append({
                                'zodiac': zodiac_name,
                                'figure': figure_name,
                                'category': category,
                                'original': original,
                                'fixed': fixed
                            })
    
    print(f"\n=== 최종 수정 결과 ===")
    print(f"총 {total_fixes}개의 추가 수정이 완료되었습니다.")
    
    if detailed_fixes:
        print(f"\n처음 10개 수정 사항:")
        for i, fix in enumerate(detailed_fixes[:10], 1):
            print(f"\n{i}. {fix['zodiac']} - {fix['figure']} ({fix['category']})")
            print(f"   원본: {fix['original'][:80]}{'...' if len(fix['original']) > 80 else ''}")
            print(f"   수정: {fix['fixed'][:80]}{'...' if len(fix['fixed']) > 80 else ''}")
        
        if len(detailed_fixes) > 10:
            print(f"   ... 및 {len(detailed_fixes) - 10}개 추가 수정")
    
    if total_fixes > 0:
        # 최종 백업 생성
        final_backup_path = file_path.replace('.json', '_final_backup.json')
        with open(final_backup_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n최종 백업 파일: {final_backup_path}")
        
        # 수정된 파일 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"최종 수정 파일: {file_path}")
    else:
        print("\n추가 수정이 필요한 문법 오류가 발견되지 않았습니다.")

if __name__ == "__main__":
    apply_final_fixes()