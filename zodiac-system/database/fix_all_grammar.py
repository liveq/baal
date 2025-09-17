#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
주간, 월간, 궁합 운세 데이터의 한국어 문법 오류 수정 스크립트
일일 운세와 동일한 패턴을 적용하여 문법 오류를 수정합니다.
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

def fix_weekly_fortunes(conn):
    """주간 운세 데이터 문법 수정"""
    print("=== 주간 운세 데이터 문법 수정 ===")
    cursor = conn.cursor()
    
    # 텍스트 필드들: theme, overall, love_fortune, money_fortune, work_fortune, health_fortune, key_days, lucky_items
    cursor.execute("""
        SELECT id, theme, overall, love_fortune, money_fortune, work_fortune, 
               health_fortune, key_days, lucky_items
        FROM weekly_fortunes_data
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    print(f"총 {len(rows)}개의 주간 운세 레코드 발견")
    
    updated_records = 0
    total_fixes = 0
    
    for row in rows:
        record_id = row[0]
        original_texts = list(row[1:])  # theme부터 lucky_items까지
        fixed_texts = []
        record_changed = False
        
        for i, text in enumerate(original_texts):
            if text:
                fixed_text = fix_grammar_errors(text)
                fixed_texts.append(fixed_text)
                
                if fixed_text != text:
                    record_changed = True
                    total_fixes += 1
                    field_names = ['theme', 'overall', 'love_fortune', 'money_fortune', 
                                 'work_fortune', 'health_fortune', 'key_days', 'lucky_items']
                    print(f"  ID {record_id}, {field_names[i]}: 수정됨")
                    print(f"    원본: {text[:60]}...")
                    print(f"    수정: {fixed_text[:60]}...")
                    print()
            else:
                fixed_texts.append(text)
        
        if record_changed:
            cursor.execute("""
                UPDATE weekly_fortunes_data 
                SET theme = ?, overall = ?, love_fortune = ?, money_fortune = ?, 
                    work_fortune = ?, health_fortune = ?, key_days = ?, lucky_items = ?
                WHERE id = ?
            """, (*fixed_texts, record_id))
            updated_records += 1
    
    print(f"주간 운세 - 수정된 레코드 수: {updated_records}, 총 수정 사항 수: {total_fixes}\n")
    return updated_records, total_fixes

def fix_monthly_fortunes(conn):
    """월간 운세 데이터 문법 수정"""
    print("=== 월간 운세 데이터 문법 수정 ===")
    cursor = conn.cursor()
    
    # 텍스트 필드들: theme, overall, love_fortune, money_fortune, work_fortune, health_fortune, key_dates, lucky_elements
    cursor.execute("""
        SELECT id, theme, overall, love_fortune, money_fortune, work_fortune, 
               health_fortune, key_dates, lucky_elements
        FROM monthly_fortunes_data
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    print(f"총 {len(rows)}개의 월간 운세 레코드 발견")
    
    updated_records = 0
    total_fixes = 0
    
    for row in rows:
        record_id = row[0]
        original_texts = list(row[1:])  # theme부터 lucky_elements까지
        fixed_texts = []
        record_changed = False
        
        for i, text in enumerate(original_texts):
            if text:
                fixed_text = fix_grammar_errors(text)
                fixed_texts.append(fixed_text)
                
                if fixed_text != text:
                    record_changed = True
                    total_fixes += 1
                    field_names = ['theme', 'overall', 'love_fortune', 'money_fortune', 
                                 'work_fortune', 'health_fortune', 'key_dates', 'lucky_elements']
                    print(f"  ID {record_id}, {field_names[i]}: 수정됨")
                    print(f"    원본: {text[:60]}...")
                    print(f"    수정: {fixed_text[:60]}...")
                    print()
            else:
                fixed_texts.append(text)
        
        if record_changed:
            cursor.execute("""
                UPDATE monthly_fortunes_data 
                SET theme = ?, overall = ?, love_fortune = ?, money_fortune = ?, 
                    work_fortune = ?, health_fortune = ?, key_dates = ?, lucky_elements = ?
                WHERE id = ?
            """, (*fixed_texts, record_id))
            updated_records += 1
    
    print(f"월간 운세 - 수정된 레코드 수: {updated_records}, 총 수정 사항 수: {total_fixes}\n")
    return updated_records, total_fixes

def fix_compatibility_fortunes(conn):
    """궁합 운세 데이터 문법 수정"""
    print("=== 궁합 운세 데이터 문법 수정 ===")
    cursor = conn.cursor()
    
    # 텍스트 필드들: description, love_compatibility, friendship_compatibility, work_compatibility, advice
    cursor.execute("""
        SELECT id, description, love_compatibility, friendship_compatibility, 
               work_compatibility, advice
        FROM compatibility_fortunes_data
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    print(f"총 {len(rows)}개의 궁합 운세 레코드 발견")
    
    updated_records = 0
    total_fixes = 0
    
    for row in rows:
        record_id = row[0]
        original_texts = list(row[1:])  # description부터 advice까지
        fixed_texts = []
        record_changed = False
        
        for i, text in enumerate(original_texts):
            if text:
                fixed_text = fix_grammar_errors(text)
                fixed_texts.append(fixed_text)
                
                if fixed_text != text:
                    record_changed = True
                    total_fixes += 1
                    field_names = ['description', 'love_compatibility', 'friendship_compatibility', 
                                 'work_compatibility', 'advice']
                    print(f"  ID {record_id}, {field_names[i]}: 수정됨")
                    print(f"    원본: {text[:60]}...")
                    print(f"    수정: {fixed_text[:60]}...")
                    print()
            else:
                fixed_texts.append(text)
        
        if record_changed:
            cursor.execute("""
                UPDATE compatibility_fortunes_data 
                SET description = ?, love_compatibility = ?, friendship_compatibility = ?, 
                    work_compatibility = ?, advice = ?
                WHERE id = ?
            """, (*fixed_texts, record_id))
            updated_records += 1
    
    print(f"궁합 운세 - 수정된 레코드 수: {updated_records}, 총 수정 사항 수: {total_fixes}\n")
    return updated_records, total_fixes

def show_samples(conn):
    """수정 결과 샘플 확인"""
    print("=== 수정 결과 샘플 확인 ===")
    cursor = conn.cursor()
    
    # 주간 운세 샘플
    print("1. 주간 운세 샘플:")
    cursor.execute("""
        SELECT id, overall, love_fortune 
        FROM weekly_fortunes_data 
        WHERE id IN (1, 50, 100, 300, 600)
        ORDER BY id
    """)
    
    sample_rows = cursor.fetchall()
    for row in sample_rows:
        print(f"  ID {row[0]}:")
        print(f"    전체운: {row[1][:60] if row[1] else 'None'}...")
        print(f"    애정운: {row[2][:60] if row[2] else 'None'}...")
        print()
    
    # 월간 운세 샘플
    print("2. 월간 운세 샘플:")
    cursor.execute("""
        SELECT id, overall, love_fortune 
        FROM monthly_fortunes_data 
        WHERE id IN (1, 30, 60, 100, 144)
        ORDER BY id
    """)
    
    sample_rows = cursor.fetchall()
    for row in sample_rows:
        print(f"  ID {row[0]}:")
        print(f"    전체운: {row[1][:60] if row[1] else 'None'}...")
        print(f"    애정운: {row[2][:60] if row[2] else 'None'}...")
        print()
    
    # 궁합 운세 샘플
    print("3. 궁합 운세 샘플:")
    cursor.execute("""
        SELECT id, description, advice 
        FROM compatibility_fortunes_data 
        WHERE id IN (1, 20, 40, 60, 78)
        ORDER BY id
    """)
    
    sample_rows = cursor.fetchall()
    for row in sample_rows:
        print(f"  ID {row[0]}:")
        print(f"    설명: {row[1][:60] if row[1] else 'None'}...")
        print(f"    조언: {row[2][:60] if row[2] else 'None'}...")
        print()

def main():
    """메인 함수"""
    print("=== 주간/월간/궁합 운세 데이터 문법 오류 수정 ===\n")
    
    # 데이터베이스 연결
    conn = sqlite3.connect('zodiac_fortunes.db')
    
    try:
        # 각 테이블별 문법 수정
        weekly_updated, weekly_fixes = fix_weekly_fortunes(conn)
        monthly_updated, monthly_fixes = fix_monthly_fortunes(conn)
        compatibility_updated, compatibility_fixes = fix_compatibility_fortunes(conn)
        
        # 변경사항 커밋
        conn.commit()
        
        # 전체 결과 요약
        print("=== 전체 수정 결과 요약 ===")
        print(f"주간 운세:")
        print(f"  - 전체 레코드: 624개")
        print(f"  - 수정된 레코드: {weekly_updated}개")
        print(f"  - 총 수정 사항: {weekly_fixes}개")
        
        print(f"\n월간 운세:")
        print(f"  - 전체 레코드: 144개")
        print(f"  - 수정된 레코드: {monthly_updated}개")
        print(f"  - 총 수정 사항: {monthly_fixes}개")
        
        print(f"\n궁합 운세:")
        print(f"  - 전체 레코드: 78개")
        print(f"  - 수정된 레코드: {compatibility_updated}개")
        print(f"  - 총 수정 사항: {compatibility_fixes}개")
        
        total_updated = weekly_updated + monthly_updated + compatibility_updated
        total_fixes = weekly_fixes + monthly_fixes + compatibility_fixes
        
        print(f"\n전체 합계:")
        print(f"  - 총 수정된 레코드: {total_updated}개")
        print(f"  - 총 수정 사항: {total_fixes}개")
        
        # 수정 결과 샘플 확인
        print("\n")
        show_samples(conn)
        
    except Exception as e:
        print(f"오류 발생: {e}")
        conn.rollback()
        raise
    finally:
        # 연결 종료
        conn.close()
        print("=== 작업 완료 ===")

if __name__ == "__main__":
    main()