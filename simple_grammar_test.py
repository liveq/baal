#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def has_jongsung(char):
    """한글 글자의 종성 여부를 확인"""
    if ord(char) >= 0xAC00 and ord(char) <= 0xD7AF:
        jongsung = (ord(char) - 0xAC00) % 28
        return jongsung != 0
    return False

# 별자리 이름들의 마지막 글자 '리' 테스트
zodiac_names = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리']

print("별자리 이름의 마지막 글자 '리' 종성 분석:")
for name in zodiac_names:
    last_char = name[-1]  # '리'
    has_jong = has_jongsung(last_char)
    print(f"{name}: 마지막 글자 '{last_char}' 종성={has_jong}")

# '리' 글자 자체 확인
ri_char = '리'
print(f"\n'리' 글자 자체: 종성={has_jongsung(ri_char)}")

# 조사 규칙 확인
print(f"\n조사 규칙:")
print(f"'리' + '와': 양자리와 (올바름)")
print(f"'리' + '과': 양자리과 (잘못됨 - '리'는 종성이 없음)")