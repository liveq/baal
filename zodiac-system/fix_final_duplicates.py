#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from collections import Counter

def fix_final_duplicates():
    """최종 파일에서 중복된 인물을 제거하는 함수"""
    
    with open('historical-figures-enhanced-final.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 중복된 인물 찾기
    all_names = []
    figure_locations = {}
    
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        for i, figure in enumerate(zodiac_data['figures']):
            name = figure['name']
            all_names.append(name)
            
            if name not in figure_locations:
                figure_locations[name] = []
            figure_locations[name].append((zodiac_id, i))
    
    name_counts = Counter(all_names)
    duplicates = [name for name, count in name_counts.items() if count > 1]
    
    print("=== 중복 인물 제거 작업 ===")
    
    # 중복 제거 대상 - 나중에 추가된 것들 제거 (scorpio, sagittarius, aquarius, pisces)
    to_remove = []
    
    for name in duplicates:
        locations = figure_locations[name]
        print(f"중복 인물: {name}")
        
        # 나중에 추가된 별자리에서 제거
        keep_zodiac = None
        remove_zodiacs = []
        
        for zodiac_id, idx in locations:
            if zodiac_id in ['scorpio', 'sagittarius', 'aquarius', 'pisces']:
                remove_zodiacs.append((zodiac_id, idx))
                print(f"  제거 대상: {zodiac_id}[{idx}]")
            else:
                keep_zodiac = zodiac_id
                print(f"  유지: {zodiac_id}[{idx}]")
        
        # 만약 원래 별자리에도 없고 새로 추가한 것만 있다면 첫 번째만 유지
        if not keep_zodiac:
            keep_first = True
            for zodiac_id, idx in locations:
                if keep_first:
                    print(f"  유지: {zodiac_id}[{idx}] (첫 번째)")
                    keep_first = False
                else:
                    remove_zodiacs.append((zodiac_id, idx))
                    print(f"  제거: {zodiac_id}[{idx}]")
        
        to_remove.extend(remove_zodiacs)
    
    # 중복 제거 실행
    removed_count = 0
    
    # 인덱스 순서대로 정렬 (뒤에서부터 제거해야 인덱스가 꼬이지 않음)
    to_remove.sort(key=lambda x: x[1], reverse=True)
    
    for zodiac_id, idx in to_remove:
        figure_name = data['zodiacFigures'][zodiac_id]['figures'][idx]['name']
        data['zodiacFigures'][zodiac_id]['figures'].pop(idx)
        print(f"제거 완료: {zodiac_id}에서 {figure_name}")
        removed_count += 1
    
    # 새로운 통계 계산
    new_total = sum([len(zodiac['figures']) for zodiac in data['zodiacFigures'].values()])
    
    zodiac_names = {
        'aries': '양자리', 'taurus': '황소자리', 'gemini': '쌍둥이자리',
        'cancer': '게자리', 'leo': '사자자리', 'virgo': '처녀자리',
        'libra': '천칭자리', 'scorpio': '전갈자리', 'sagittarius': '궁수자리',
        'capricorn': '염소자리', 'aquarius': '물병자리', 'pisces': '물고기자리'
    }
    
    print(f"\n=== 중복 제거 후 별자리별 분포 ===")
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        count = len(zodiac_data['figures'])
        print(f'{zodiac_names[zodiac_id]:8} | {count:2d}명')
    
    print(f"\n제거된 인물 수: {removed_count}명")
    print(f"현재 총 인물 수: {new_total}명")
    
    # 메타데이터 업데이트
    data['metadata']['totalFigures'] = new_total
    data['metadata']['updated'] = '2025-01-11'
    
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        data['metadata']['figuresByZodiac'][zodiac_id] = len(zodiac_data['figures'])
    
    # 수정된 파일 저장
    with open('historical-figures-enhanced-final.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n수정된 데이터가 저장되었습니다.")
    
    # 중복 재확인
    final_names = []
    for zodiac_data in data['zodiacFigures'].values():
        for figure in zodiac_data['figures']:
            final_names.append(figure['name'])
    
    final_duplicates = [name for name, count in Counter(final_names).items() if count > 1]
    if final_duplicates:
        print(f"여전히 남은 중복: {final_duplicates}")
    else:
        print("모든 중복이 제거되었습니다!")
    
    return data

if __name__ == "__main__":
    fix_final_duplicates()