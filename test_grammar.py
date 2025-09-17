#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def has_jongsung(char):
    """한글 글자의 종성 여부를 확인"""
    if ord(char) >= 0xAC00 and ord(char) <= 0xD7AF:
        jongsung = (ord(char) - 0xAC00) % 28
        return jongsung != 0
    return False

def test_postposition_logic():
    """조사 수정 로직 테스트"""
    
    # 테스트 케이스들
    test_cases = [
        ("양자리와", "올바른 표현"),
        ("양자리과", "잘못된 표현"),
        ("사자리와", "올바른 표현"),
        ("게자리와", "올바른 표현"), 
        ("처녀자리와", "올바른 표현"),
        ("염소자리와", "올바른 표현")
    ]
    
    print("=== 조사 수정 로직 분석 ===")
    
    for text, description in test_cases:
        print(f"\n테스트: '{text}' - {description}")
        
        # '리' 글자의 종성 확인
        if len(text) >= 3:
            char_before_postposition = text[-2]  # 조사 앞의 글자 (리)
            postposition = text[-1]  # 조사 (와/과)
            
            print(f"  조사 앞 글자: '{char_before_postposition}'")
            print(f"  조사: '{postposition}'")
            print(f"  종성 있음: {has_jongsung(char_before_postposition)}")
            
            # 현재 로직에 따른 수정 결과 예측
            if postposition in ['와', '과']:
                if has_jongsung(char_before_postposition):
                    expected = char_before_postposition + '과'
                    print(f"  수정될 결과: '{text[:-2]}{expected}'")
                else:
                    expected = char_before_postposition + '와'
                    print(f"  수정될 결과: '{text[:-2]}{expected}'")
                    
                # 문제점 확인
                if text.endswith('와') and not has_jongsung(char_before_postposition):
                    print(f"  ✅ 올바른 조사 사용")
                elif text.endswith('과') and has_jongsung(char_before_postposition):
                    print(f"  ✅ 올바른 조사 사용")
                else:
                    print(f"  ❌ 잘못된 조사 또는 수정 필요")

def analyze_current_fix_postposition():
    """현재 fix_postposition 함수의 문제점 분석"""
    
    print("\n=== 현재 조사 수정 로직의 문제점 ===")
    
    # 문제가 되는 정규식 패턴
    problematic_patterns = [
        r'([가-힣])(과|와)(?=\s)',  # 이 패턴이 "양자리와 "를 잡아낼 것
    ]
    
    test_sentences = [
        "양자리와 황소자리는 좋은 궁합입니다.",
        "사자리와 처녀자리의 만남은 흥미롭습니다.",
        "게자리과 전갈자리는 물의 원소입니다."  # 실제 오류
    ]
    
    for sentence in test_sentences:
        print(f"\n문장: '{sentence}'")
        
        for pattern in problematic_patterns:
            matches = re.finditer(pattern, sentence)
            for match in matches:
                char = match.group(1)
                postposition = match.group(2)
                print(f"  매치됨: '{char}{postposition}' (글자='{char}', 조사='{postposition}')")
                print(f"  '{char}' 종성 있음: {has_jongsung(char)}")
                
                # 수정 결과 예측
                if has_jongsung(char):
                    correct_postposition = '과'
                else:
                    correct_postposition = '와'
                
                if postposition != correct_postposition:
                    print(f"  🔧 수정 필요: '{char}{postposition}' → '{char}{correct_postposition}'")
                else:
                    print(f"  ❌ 문제: 올바른 조사인데 수정될 위험!")

if __name__ == "__main__":
    test_postposition_logic()
    analyze_current_fix_postposition()