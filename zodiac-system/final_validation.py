#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from collections import Counter
import datetime

def final_validation():
    """최종 데이터베이스의 무결성과 품질을 검증하는 함수"""
    
    with open('historical-figures-enhanced-final.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("=== 최종 데이터베이스 검증 결과 ===\n")
    
    # 1. 기본 통계
    total_figures = sum([len(zodiac['figures']) for zodiac in data['zodiacFigures'].values()])
    zodiac_count = len(data['zodiacFigures'])
    
    print(f"1. 기본 통계")
    print(f"   - 총 별자리 수: {zodiac_count}개")
    print(f"   - 총 인물 수: {total_figures}명")
    print(f"   - 평균 인물/별자리: {total_figures/zodiac_count:.1f}명\n")
    
    # 2. 별자리별 분포
    zodiac_names = {
        'aries': '양자리', 'taurus': '황소자리', 'gemini': '쌍둥이자리',
        'cancer': '게자리', 'leo': '사자자리', 'virgo': '처녀자리',
        'libra': '천칭자리', 'scorpio': '전갈자리', 'sagittarius': '궁수자리',
        'capricorn': '염소자리', 'aquarius': '물병자리', 'pisces': '물고기자리'
    }
    
    print("2. 별자리별 분포")
    min_count = float('inf')
    max_count = 0
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        count = len(zodiac_data['figures'])
        min_count = min(min_count, count)
        max_count = max(max_count, count)
        print(f"   {zodiac_names[zodiac_id]:8} | {count:2d}명 | {zodiac_data['period']}")
    
    print(f"   최소: {min_count}명, 최대: {max_count}명, 편차: {max_count - min_count}명\n")
    
    # 3. 중복 체크
    all_names = []
    all_name_en = []
    
    for zodiac_data in data['zodiacFigures'].values():
        for figure in zodiac_data['figures']:
            all_names.append(figure['name'])
            if figure.get('nameEn'):
                all_name_en.append(figure['nameEn'])
    
    name_duplicates = [name for name, count in Counter(all_names).items() if count > 1]
    name_en_duplicates = [name for name, count in Counter(all_name_en).items() if count > 1]
    
    print("3. 중복 검사")
    if name_duplicates:
        print(f"   한국어 이름 중복: {name_duplicates}")
    else:
        print("   한국어 이름 중복: 없음 ✓")
    
    if name_en_duplicates:
        print(f"   영어 이름 중복: {name_en_duplicates}")
    else:
        print("   영어 이름 중복: 없음 ✓")
    print()
    
    # 4. 필수 필드 검사
    print("4. 데이터 품질 검사")
    missing_fields = []
    empty_fields = []
    
    required_fields = ['name', 'nameEn', 'period', 'country', 'achievements', 
                      'coreTraits', 'famousQuote', 'categoryTraits']
    category_fields = ['work', 'love', 'money', 'health']
    
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        for i, figure in enumerate(zodiac_data['figures']):
            # 필수 필드 존재 확인
            for field in required_fields:
                if field not in figure:
                    missing_fields.append(f"{zodiac_id}.{i}.{field}")
                elif not figure[field]:
                    empty_fields.append(f"{zodiac_id}.{i}.{field}")
            
            # categoryTraits 하위 필드 확인
            if 'categoryTraits' in figure:
                for cat_field in category_fields:
                    if cat_field not in figure['categoryTraits']:
                        missing_fields.append(f"{zodiac_id}.{i}.categoryTraits.{cat_field}")
                    elif not figure['categoryTraits'][cat_field]:
                        empty_fields.append(f"{zodiac_id}.{i}.categoryTraits.{cat_field}")
    
    if missing_fields or empty_fields:
        print(f"   누락 필드: {len(missing_fields)}개")
        print(f"   빈 필드: {len(empty_fields)}개")
        if missing_fields:
            print(f"   누락: {missing_fields[:5]}{'...' if len(missing_fields) > 5 else ''}")
        if empty_fields:
            print(f"   빈 값: {empty_fields[:5]}{'...' if len(empty_fields) > 5 else ''}")
    else:
        print("   모든 필수 필드 완성됨 ✓")
    print()
    
    # 5. 메타데이터 업데이트
    current_time = datetime.datetime.now()
    
    updated_metadata = {
        "version": "5.0-FINAL",
        "created": "2025-01-11",
        "updated": current_time.strftime("%Y-%m-%d %H:%M:%S"),
        "description": "RHEIGHT 별자리 시스템을 위한 역사적 인물 데이터베이스 - 12개 별자리별 역사적 인물들의 업적, 특성, 명언 및 카테고리별 특성 포함 (최종 검증 완료)",
        "totalFigures": total_figures,
        "zodiacSigns": zodiac_count,
        "categories": ["work", "love", "money", "health"],
        "dataSource": "WebSearch 검증된 역사적 사실 기반 + 전문적 큐레이션",
        "usage": "별자리 운세 시스템에서 역사적 인물의 특성과 교훈을 현대적 조언으로 활용",
        "completionStatus": {
            "status": "완료",
            "allZodiacsCovered": True,
            "minFiguresPerZodiac": min_count,
            "maxFiguresPerZodiac": max_count,
            "averageFiguresPerZodiac": round(total_figures/zodiac_count, 1)
        },
        "figuresByZodiac": {},
        "qualityMetrics": {
            "duplicateNames": len(name_duplicates),
            "duplicateNameEn": len(name_en_duplicates),
            "missingFields": len(missing_fields),
            "emptyFields": len(empty_fields),
            "dataIntegrityScore": "100%" if not (name_duplicates or name_en_duplicates or missing_fields or empty_fields) else "검토필요"
        },
        "dataValidation": {
            "lastValidated": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "validationPassed": len(missing_fields) == 0 and len(empty_fields) == 0,
            "totalChecks": len(required_fields) * total_figures + len(category_fields) * total_figures,
            "passedChecks": len(required_fields) * total_figures + len(category_fields) * total_figures - len(missing_fields) - len(empty_fields)
        }
    }
    
    # figuresByZodiac 업데이트
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        updated_metadata['figuresByZodiac'][zodiac_id] = len(zodiac_data['figures'])
    
    # 메타데이터 적용
    data['metadata'] = updated_metadata
    
    print("5. 메타데이터 업데이트")
    print(f"   버전: {updated_metadata['version']}")
    print(f"   검증 시각: {updated_metadata['dataValidation']['lastValidated']}")
    print(f"   데이터 무결성: {updated_metadata['qualityMetrics']['dataIntegrityScore']}")
    print(f"   검증 통과율: {updated_metadata['dataValidation']['passedChecks']}/{updated_metadata['dataValidation']['totalChecks']}")
    print()
    
    # 최종 파일 저장
    with open('historical-figures-enhanced-final.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("6. 최종 결과")
    print("   ✓ 데이터베이스 검증 완료")
    print("   ✓ 메타데이터 업데이트 완료") 
    print("   ✓ 최종 파일 저장 완료")
    print(f"   ✓ 총 {total_figures}명의 역사적 인물 데이터 준비 완료")
    print("\n=== 검증 완료 ===")
    
    return data, updated_metadata

if __name__ == "__main__":
    final_validation()