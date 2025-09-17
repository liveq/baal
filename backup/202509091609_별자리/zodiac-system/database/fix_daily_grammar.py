#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
일일 운세 데이터의 한국어 문법 오류 수정 스크립트
"""
import sqlite3
import re

def fix_grammar_errors(text):
    """텍스트의 문법 오류를 수정하는 함수"""
    if not text:
        return text
    
    original_text = text
    
    # 1. 조사 "~으로" vs "~로" 수정
    # 받침이 없는 단어 뒤의 "으로" → "로"
    # 모음으로 끝나는 단어들
    text = re.sub(r'([가-힣][ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ])으로', r'\1로', text)
    # 받침 없는 자음으로 끝나는 단어들 (ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅅ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ가 아닌 경우)
    
    # 2. 특정 잘못된 표현 수정
    text = re.sub(r'정의으로', '정의로', text)
    text = re.sub(r'자유으로', '자유로', text)
    # "사랑으로"는 올바른 표현이므로 수정하지 않음
    
    # 3. 이중 조사 제거
    text = re.sub(r'의의([^가-힣])', r'의\1', text)  # "의의" → "의"
    text = re.sub(r'를를([^가-힣])', r'를\1', text)  # "를를" → "를"
    text = re.sub(r'을을([^가-힣])', r'을\1', text)  # "을을" → "을"
    text = re.sub(r'이이([^가-힣])', r'이\1', text)  # "이이" → "이"
    text = re.sub(r'가가([^가-힣])', r'가\1', text)  # "가가" → "가"
    text = re.sub(r'와와([^가-힣])', r'와\1', text)  # "와와" → "와"
    text = re.sub(r'과과([^가-힣])', r'과\1', text)  # "과과" → "과"
    text = re.sub(r'에에([^가-힣])', r'에\1', text)  # "에에" → "에"
    text = re.sub(r'로로([^가-힣])', r'로\1', text)  # "로로" → "로"
    text = re.sub(r'으로로([^가-힣])', r'으로\1', text)  # "으로로" → "으로"
    
    # 4. 어색한 조사 연결 수정
    text = re.sub(r'의\s+의', '의', text)      # "~의 의~" → "~의~"
    text = re.sub(r'을\s+를', '를', text)      # "~을 를~" → "~를~"
    text = re.sub(r'를\s+을', '을', text)      # "~를 을~" → "~을~"
    text = re.sub(r'이\s+가', '가', text)      # "~이 가~" → "~가~"
    text = re.sub(r'가\s+이', '이', text)      # "~가 이~" → "~이~"
    
    # 5. 어미 중복 제거
    text = re.sub(r'하시시', '하시', text)
    text = re.sub(r'습니니다', '습니다', text)
    text = re.sub(r'세요요', '세요', text)
    text = re.sub(r'처럼럼', '처럼', text)
    
    # 6. 공백 정리
    text = re.sub(r'\s+', ' ', text)  # 여러 공백을 하나로
    text = text.strip()               # 앞뒤 공백 제거
    
    return text

def main():
    """메인 함수"""
    print("=== 일일 운세 데이터 문법 오류 수정 ===\n")
    
    # 데이터베이스 연결
    conn = sqlite3.connect('zodiac_fortunes.db')
    cursor = conn.cursor()
    
    # daily_fortunes_data 테이블의 모든 텍스트 필드 조회
    print("1. 현재 데이터 조회 중...")
    cursor.execute("""
        SELECT id, overall, love_fortune, money_fortune, work_fortune, health_fortune, advice
        FROM daily_fortunes_data
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    print(f"총 {len(rows)}개의 레코드 발견")
    
    # 수정 통계
    updated_records = 0
    total_fixes = 0
    
    # 각 레코드 처리
    print("\n2. 문법 오류 수정 중...")
    for row in rows:
        record_id = row[0]
        original_texts = list(row[1:])  # overall, love_fortune, money_fortune, work_fortune, health_fortune, advice
        fixed_texts = []
        record_changed = False
        
        # 각 텍스트 필드에 대해 문법 수정 적용
        for i, text in enumerate(original_texts):
            if text:
                fixed_text = fix_grammar_errors(text)
                fixed_texts.append(fixed_text)
                
                if fixed_text != text:
                    record_changed = True
                    total_fixes += 1
                    print(f"  ID {record_id}, 필드 {i+1}: 수정됨")
                    print(f"    원본: {text[:80]}...")
                    print(f"    수정: {fixed_text[:80]}...")
                    print()
            else:
                fixed_texts.append(text)
        
        # 변경사항이 있으면 데이터베이스 업데이트
        if record_changed:
            cursor.execute("""
                UPDATE daily_fortunes_data 
                SET overall = ?, love_fortune = ?, money_fortune = ?, 
                    work_fortune = ?, health_fortune = ?, advice = ?
                WHERE id = ?
            """, (*fixed_texts, record_id))
            updated_records += 1
    
    # 변경사항 커밋
    conn.commit()
    print(f"\n3. 데이터베이스 업데이트 완료")
    print(f"   - 수정된 레코드 수: {updated_records}")
    print(f"   - 총 수정 사항 수: {total_fixes}")
    
    # 수정 결과 샘플 확인
    print("\n4. 수정 결과 샘플 확인:")
    cursor.execute("""
        SELECT id, overall, love_fortune 
        FROM daily_fortunes_data 
        WHERE id IN (1, 100, 500, 1000, 2000)
        ORDER BY id
    """)
    
    sample_rows = cursor.fetchall()
    for row in sample_rows:
        print(f"ID {row[0]}:")
        print(f"  전체운: {row[1][:60]}...")
        print(f"  애정운: {row[2][:60]}...")
        print()
    
    # 연결 종료
    conn.close()
    print("=== 작업 완료 ===")

if __name__ == "__main__":
    main()