#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
혈액형 바이오리듬 운세 데이터베이스 스키마 생성 스크립트

바이오리듬 주기:
- 신체(Physical): 23일 주기
- 감정(Emotional): 28일 주기  
- 지성(Intellectual): 33일 주기

4개 혈액형 × 365일 = 1,460개 레코드 생성
"""

import sqlite3
import os
from datetime import datetime

def create_biorhythm_database():
    db_path = os.path.join(os.path.dirname(__file__), 'biorhythm_fortunes.db')
    
    if os.path.exists(db_path):
        print(f"기존 데이터베이스 삭제: {db_path}")
        os.remove(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. 일일 바이오리듬 운세 메인 테이블
    cursor.execute('''
    CREATE TABLE daily_biorhythm (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blood_type TEXT NOT NULL,
        day_of_year INTEGER NOT NULL,
        date_md TEXT NOT NULL,
        physical_score REAL NOT NULL,
        emotional_score REAL NOT NULL,
        intellectual_score REAL NOT NULL,
        overall_message TEXT NOT NULL,
        health_message TEXT NOT NULL,
        emotion_message TEXT NOT NULL,
        wisdom_message TEXT NOT NULL,
        lucky_item TEXT NOT NULL,
        lucky_color TEXT NOT NULL,
        advice TEXT NOT NULL,
        famous_figure TEXT NOT NULL,
        figure_quote TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(blood_type, day_of_year)
    )
    ''')
    
    # 2. 혈액형별 유명인물 확장 테이블
    cursor.execute('''
    CREATE TABLE famous_people_biorhythm (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blood_type TEXT NOT NULL,
        name_ko TEXT NOT NULL,
        name_en TEXT,
        era TEXT NOT NULL,
        field TEXT NOT NULL,
        primary_trait TEXT NOT NULL,
        biorhythm_trait TEXT NOT NULL,
        story TEXT NOT NULL,
        quote TEXT,
        achievement TEXT NOT NULL,
        philosophy_connection TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # 3. 바이오리듬 패턴 해석 테이블
    cursor.execute('''
    CREATE TABLE biorhythm_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pattern_name TEXT NOT NULL UNIQUE,
        physical_range TEXT NOT NULL,
        emotional_range TEXT NOT NULL,
        intellectual_range TEXT NOT NULL,
        pattern_description TEXT NOT NULL,
        oriental_philosophy TEXT NOT NULL,
        western_philosophy TEXT NOT NULL,
        advice_template TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # 4. 동서양 철학 연결 테이블
    cursor.execute('''
    CREATE TABLE philosophy_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blood_type TEXT NOT NULL,
        oriental_element TEXT NOT NULL,
        oriental_description TEXT NOT NULL,
        western_temperament TEXT NOT NULL,
        western_description TEXT NOT NULL,
        biorhythm_influence TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # 5. 바이오리듬 기본 설정 테이블
    cursor.execute('''
    CREATE TABLE biorhythm_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cycle_type TEXT NOT NULL UNIQUE,
        cycle_days INTEGER NOT NULL,
        description_ko TEXT NOT NULL,
        medical_basis TEXT,
        psychological_basis TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # 바이오리듬 기본 설정 데이터 삽입
    biorhythm_cycles = [
        ('physical', 23, '신체 바이오리듬', 
         '인간의 신체적 에너지, 체력, 면역력의 주기적 변화', 
         '신체적 활동성과 건강 상태에 영향을 미치는 생체 리듬'),
        ('emotional', 28, '감정 바이오리듬', 
         '감정의 기복, 창의성, 직감력의 주기적 변화', 
         '감정 상태와 대인관계, 예술적 감각에 영향을 미치는 심리적 주기'),
        ('intellectual', 33, '지성 바이오리듬', 
         '논리적 사고, 기억력, 판단력의 주기적 변화', 
         '학습능력과 문제해결 능력, 의사결정에 영향을 미치는 인지적 주기')
    ]
    
    cursor.executemany('''
    INSERT INTO biorhythm_config (cycle_type, cycle_days, description_ko, medical_basis, psychological_basis)
    VALUES (?, ?, ?, ?, ?)
    ''', biorhythm_cycles)
    
    # 철학 연결 데이터 삽입
    philosophy_data = [
        ('A', '목(木)', '성장과 창조의 에너지, 계획적이고 질서정연함', 
         '담즙질(Choleric)', '완벽주의적 성향과 체계적 사고', 
         '지성 바이오리듬에 가장 민감하게 반응하며, 계획 수립 시기에 높은 성과를 보임'),
        ('B', '화(火)', '열정과 변화의 에너지, 자유롭고 창의적', 
         '다혈질(Sanguine)', '낙관적이고 사교적인 성격', 
         '감정 바이오리듬의 영향을 크게 받으며, 감정 상승기에 창의력이 폭발'),
        ('O', '토(土)', '안정과 중심의 에너지, 현실적이고 리더십 발휘', 
         '점액질(Phlegmatic)', '실용적이고 목표 지향적인 성격', 
         '신체 바이오리듬과 강한 연관성을 보이며, 체력 상승기에 최고의 리더십 발휘'),
        ('AB', '금(金)', '조화와 균형의 에너지, 합리적이고 분석적', 
         '우울질(Melancholic)', '신중하고 완벽주의적 성향', 
         '세 가지 바이오리듬의 균형 상태에 따라 성과가 크게 좌우됨')
    ]
    
    cursor.executemany('''
    INSERT INTO philosophy_connections (blood_type, oriental_element, oriental_description, 
                                      western_temperament, western_description, biorhythm_influence)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', philosophy_data)
    
    # 인덱스 생성
    cursor.execute('CREATE INDEX idx_daily_bloodtype_day ON daily_biorhythm(blood_type, day_of_year)')
    cursor.execute('CREATE INDEX idx_famous_bloodtype ON famous_people_biorhythm(blood_type)')
    cursor.execute('CREATE INDEX idx_philosophy_bloodtype ON philosophy_connections(blood_type)')
    
    conn.commit()
    conn.close()
    
    print(f"바이오리듬 데이터베이스 생성 완료: {db_path}")
    print("테이블 목록:")
    print("1. daily_biorhythm - 일일 바이오리듬 운세 (1,460개 레코드 예정)")
    print("2. famous_people_biorhythm - 혈액형별 유명인물")
    print("3. biorhythm_patterns - 바이오리듬 패턴 해석")
    print("4. philosophy_connections - 동서양 철학 연결")
    print("5. biorhythm_config - 바이오리듬 기본 설정")

if __name__ == "__main__":
    create_biorhythm_database()