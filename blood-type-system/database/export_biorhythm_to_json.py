#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
바이오리듬 데이터베이스에서 JSON 파일로 내보내기 스크립트

웹에서 사용할 수 있는 형태로 JSON 데이터를 생성합니다.
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta

def export_biorhythm_to_json():
    """바이오리듬 데이터를 JSON 형태로 내보내기"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'biorhythm_fortunes.db')
    json_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'blood-biorhythm-data.json')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 전체 구조 초기화
    biorhythm_data = {
        "metadata": {
            "version": "1.0",
            "created": datetime.now().isoformat(),
            "description": "혈액형 바이오리듬 운세 시스템 데이터",
            "total_records": 1460,
            "blood_types": ["A", "B", "O", "AB"],
            "biorhythm_cycles": {
                "physical": {"days": 23, "description": "신체 바이오리듬"},
                "emotional": {"days": 28, "description": "감정 바이오리듬"}, 
                "intellectual": {"days": 33, "description": "지성 바이오리듬"}
            }
        },
        "philosophy": {},
        "famous_people": {},
        "daily_fortune": {}
    }
    
    # 1. 철학적 연결 정보 추가
    cursor.execute('SELECT * FROM philosophy_connections')
    philosophy_rows = cursor.fetchall()
    
    for row in philosophy_rows:
        blood_type = row[1]
        biorhythm_data["philosophy"][blood_type] = {
            "oriental": {
                "element": row[2],
                "description": row[3]
            },
            "western": {
                "temperament": row[4],
                "description": row[5]
            },
            "biorhythm_influence": row[6]
        }
    
    # 2. 유명인물 정보 추가
    cursor.execute('SELECT * FROM famous_people_biorhythm ORDER BY blood_type, name_ko')
    people_rows = cursor.fetchall()
    
    for blood_type in ['A', 'B', 'O', 'AB']:
        biorhythm_data["famous_people"][blood_type] = []
    
    for row in people_rows:
        blood_type = row[1]
        person_data = {
            "name_ko": row[2],
            "name_en": row[3],
            "era": row[4],
            "field": row[5],
            "primary_trait": row[6],
            "biorhythm_trait": row[7],
            "story": row[8],
            "quote": row[9],
            "achievement": row[10],
            "philosophy_connection": row[11]
        }
        biorhythm_data["famous_people"][blood_type].append(person_data)
    
    # 3. 일일 운세 데이터 추가
    cursor.execute('''
        SELECT * FROM daily_biorhythm 
        ORDER BY blood_type, day_of_year
    ''')
    fortune_rows = cursor.fetchall()
    
    # 혈액형별로 분류
    for blood_type in ['A', 'B', 'O', 'AB']:
        biorhythm_data["daily_fortune"][blood_type] = {}
    
    for row in fortune_rows:
        blood_type = row[1]
        day_of_year = row[2]
        date_md = row[3]
        
        # 날짜 객체 생성 (월-일 형태)
        date_obj = datetime(2025, 1, 1) + timedelta(days=day_of_year - 1)
        
        fortune_data = {
            "day_of_year": day_of_year,
            "date": date_md,
            "month": date_obj.month,
            "day": date_obj.day,
            "biorhythm": {
                "physical": row[4],
                "emotional": row[5], 
                "intellectual": row[6],
                "pattern": get_pattern_name(row[4], row[5], row[6])
            },
            "fortune": {
                "overall": row[7],
                "health": row[8],
                "emotion": row[9],
                "wisdom": row[10]
            },
            "lucky": {
                "item": row[11],
                "color": row[12]
            },
            "advice": row[13],
            "famous_figure": {
                "name": row[14],
                "quote": row[15]
            }
        }
        
        biorhythm_data["daily_fortune"][blood_type][date_md] = fortune_data
    
    conn.close()
    
    # JSON 파일로 저장 (한글 유지, 들여쓰기 적용)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(biorhythm_data, f, ensure_ascii=False, indent=2)
    
    print(f"바이오리듬 JSON 데이터 내보내기 완료: {json_path}")
    
    # 파일 크기 확인
    file_size = os.path.getsize(json_path) / (1024 * 1024)  # MB
    print(f"파일 크기: {file_size:.2f}MB")
    
    # 데이터 통계
    print("\n데이터 통계:")
    print(f"- 철학 연결: {len(biorhythm_data['philosophy'])}개 혈액형")
    print(f"- 유명인물: {sum(len(people) for people in biorhythm_data['famous_people'].values())}명")
    print(f"- 일일 운세: {sum(len(fortunes) for fortunes in biorhythm_data['daily_fortune'].values())}개")
    
    return json_path

def get_pattern_name(physical, emotional, intellectual):
    """바이오리듬 패턴 이름 반환"""
    avg_score = (physical + emotional + intellectual) / 3
    
    if avg_score >= 80:
        return "최상승기"
    elif avg_score >= 60:
        return "상승기"
    elif avg_score >= 40:
        return "안정기"
    elif avg_score >= 20:
        return "하강기"
    else:
        return "최하강기"

def create_sample_json():
    """샘플 JSON 구조 생성 (테스트용)"""
    sample_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'biorhythm-sample.json')
    
    sample_data = {
        "date": "2025-01-09",
        "bloodType": "A",
        "biorhythm": {
            "physical": 78.5,
            "emotional": 45.2,
            "intellectual": 89.1,
            "pattern": "상승기"
        },
        "fortune": {
            "overall": "완벽주의적인 당신에게 세종대왕의 지혜가 빛을 발하는 시기입니다. 지성 바이오리듬이 최고조에 달해 새로운 학습이나 계획 수립에 최적의 타이밍입니다.",
            "health": "체력이 안정적인 상태입니다. 규칙적인 운동과 충분한 영양 섭취로 컨디션을 유지하세요.",
            "emotion": "마음가짐을 차분히 하고 내면을 돌아보는 시간을 가져보세요. 명상이나 독서가 도움이 될 것입니다.",
            "wisdom": "두뇌 회전이 빠르고 집중력이 뛰어난 시기입니다. 복잡한 문제 해결이나 새로운 학습에 도전해보세요."
        },
        "lucky": {
            "item": "만년필",
            "color": "파스텔 블루"
        },
        "advice": "완벽을 추구하되 너무 자신을 몰아세우지는 마세요.",
        "famous_figure": {
            "name": "세종대왕",
            "quote": "가장 어려운 일을 가장 쉽게 하는 것이 진정한 지혜다"
        },
        "philosophy": {
            "oriental": "목(木)의 성장과 창조 에너지",
            "western": "담즙질의 완벽주의적 성향"
        }
    }
    
    with open(sample_path, 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2)
    
    print(f"샘플 JSON 파일 생성: {sample_path}")

if __name__ == "__main__":
    # 전체 데이터 내보내기
    json_file = export_biorhythm_to_json()
    
    # 샘플 파일 생성
    create_sample_json()
    
    print("\nJSON 내보내기 작업 완료!")
    print("사용법:")
    print("1. blood-biorhythm-data.json: 전체 데이터 (API에서 사용)")
    print("2. biorhythm-sample.json: 샘플 구조 (개발 참고용)")