#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sqlite3
import json
import os

def fix_compatibility_json():
    """Fix the corrupted compatibility data in JSON"""
    
    # Load the database
    conn = sqlite3.connect('zodiac_fortunes.db')
    cursor = conn.cursor()
    
    # Get all compatibility data with proper encoding
    cursor.execute('''
        SELECT zodiac1_id, zodiac2_id, overall_score, 
               love_score, friendship_score, work_score
        FROM compatibility_fortunes_data 
        ORDER BY zodiac1_id, zodiac2_id
    ''')
    
    rows = cursor.fetchall()
    conn.close()
    
    # Zodiac names for advice generation
    zodiac_names = {
        1: "양자리", 2: "황소자리", 3: "쌍둥이자리", 4: "게자리",
        5: "사자자리", 6: "처녀자리", 7: "천칭자리", 8: "전갈자리",
        9: "사수자리", 10: "염소자리", 11: "물병자리", 12: "물고기자리"
    }
    
    # Build new compatibility data
    compatibility_data = {}
    
    for row in rows:
        zodiac1_id, zodiac2_id, overall_score, love_score, friendship_score, work_score = row
        
        key = f"{zodiac1_id}-{zodiac2_id}"
        name1 = zodiac_names[zodiac1_id]
        name2 = zodiac_names[zodiac2_id]
        
        # Generate proper advice text
        if overall_score >= 85:
            advice = f"{name1}과 {name2}는 천생연분의 궁합입니다. 서로를 깊이 이해하고 성장시켜주는 관계입니다."
        elif overall_score >= 75:
            advice = f"{name1}과 {name2}는 좋은 궁합입니다. 서로의 차이를 인정하며 조화로운 관계를 만들어갈 수 있습니다."
        elif overall_score >= 65:
            advice = f"{name1}과 {name2}는 노력이 필요한 관계입니다. 서로의 장점에 집중하면 좋은 관계로 발전할 수 있습니다."
        else:
            advice = f"{name1}과 {name2}는 신중한 접근이 필요합니다. 서로를 이해하려는 마음과 배려가 중요합니다."
        
        compatibility_data[key] = {
            "totalScore": overall_score,
            "scores": {
                "love": love_score,
                "friendship": friendship_score, 
                "work": work_score
            },
            "advice": advice
        }
    
    print(f"Generated {len(compatibility_data)} compatibility combinations")
    
    # Load existing JSON file
    json_path = '../api/fortune-data.json'
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return
    
    # Update compatibility section
    data['compatibility'] = compatibility_data
    
    # Save back to JSON with proper encoding
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {json_path} with fixed compatibility data")
    print(f"Total combinations: {len(compatibility_data)}")
    
    # Verify the fix
    with open(json_path, 'r', encoding='utf-8') as f:
        verify_data = json.load(f)
    
    sample_key = "1-2"
    if sample_key in verify_data['compatibility']:
        sample = verify_data['compatibility'][sample_key]
        print(f"\nVerification - Sample {sample_key}:")
        print(f"   Total Score: {sample['totalScore']}")
        print(f"   Advice: {sample['advice']}")
    else:
        print(f"Verification failed - {sample_key} not found")

if __name__ == "__main__":
    fix_compatibility_json()