#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sqlite3
import json
import os
from datetime import datetime

def export_compatibility_data():
    """데이터베이스의 궁합 데이터를 JSON 파일로 내보내기"""
    
    # 데이터베이스 연결
    conn = sqlite3.connect('zodiac_fortunes.db')
    cursor = conn.cursor()
    
    # 별자리 이름 매핑 가져오기
    cursor.execute('SELECT id, name_ko FROM zodiac_signs ORDER BY id')
    zodiac_names = dict(cursor.fetchall())
    print('별자리 매핑 로드됨:', len(zodiac_names))
    
    # 모든 궁합 데이터 가져오기
    cursor.execute('''
    SELECT 
        zodiac1_id, zodiac2_id, overall_score, 
        love_score, friendship_score, work_score,
        description, love_compatibility, friendship_compatibility, work_compatibility,
        advice, compat_message
    FROM compatibility_fortunes_data
    ORDER BY zodiac1_id, zodiac2_id
    ''')
    
    compatibility_data = cursor.fetchall()
    conn.close()
    
    print(f'데이터베이스에서 {len(compatibility_data)}개 궁합 데이터 조회됨')
    
    # JSON 형태로 변환
    json_data = {}
    
    for row in compatibility_data:
        (z1_id, z2_id, overall_score, love_score, friendship_score, work_score,
         description, love_compat, friendship_compat, work_compat,
         advice, compat_message) = row
        
        # 키는 "minId-maxId" 형태로 정규화
        key = f"{z1_id}-{z2_id}"
        
        # 별자리 이름
        z1_name = zodiac_names[z1_id]
        z2_name = zodiac_names[z2_id]
        
        json_data[key] = {
            "zodiac1_id": z1_id,
            "zodiac2_id": z2_id,
            "zodiac1_name": z1_name,
            "zodiac2_name": z2_name,
            "overall_score": overall_score,
            "love_score": love_score,
            "friendship_score": friendship_score,
            "work_score": work_score,
            "description": description,
            "love_compatibility": love_compat,
            "friendship_compatibility": friendship_compat,
            "work_compatibility": work_compat,
            "advice": advice,
            "compat_message": compat_message  # 새로운 메시지
        }
        
        status = 'OK' if compat_message else 'EMPTY'
        print(f"{key}: {z1_name} - {z2_name} (점수: {overall_score}) [{status}]")
    
    # API 디렉토리에 JSON 파일로 저장
    api_dir = '../api'
    os.makedirs(api_dir, exist_ok=True)
    output_file = os.path.join(api_dir, 'compatibility-data.json')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f'\\n=== 궁합 데이터 내보내기 완료 ===')
    print(f'파일 위치: {os.path.abspath(output_file)}')
    print(f'총 {len(json_data)}개 궁합 조합 내보냄')
    print(f'생성 시간: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    
    # 통계 출력
    message_count = sum(1 for data in json_data.values() if data['compat_message'])
    print(f'compat_message 포함: {message_count}/{len(json_data)}개')
    
    return output_file

if __name__ == "__main__":
    export_compatibility_data()