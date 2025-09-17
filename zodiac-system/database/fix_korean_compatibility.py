#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os

def fix_korean_compatibility():
    """Fix Korean text in compatibility data"""
    
    # Zodiac names in Korean
    zodiac_names = {
        1: "양자리", 2: "황소자리", 3: "쌍둥이자리", 4: "게자리",
        5: "사자자리", 6: "처녀자리", 7: "천칭자리", 8: "전갈자리",
        9: "사수자리", 10: "염소자리", 11: "물병자리", 12: "물고기자리"
    }
    
    # Load existing JSON
    json_path = '../api/fortune-data.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Fix compatibility data
    if 'compatibility' in data:
        for key, compat_data in data['compatibility'].items():
            # Extract zodiac IDs from key (e.g., "1-2" -> 1, 2)
            ids = key.split('-')
            zodiac1_id = int(ids[0])
            zodiac2_id = int(ids[1])
            
            name1 = zodiac_names[zodiac1_id]
            name2 = zodiac_names[zodiac2_id]
            
            total_score = compat_data.get('totalScore', 75)
            
            # Generate clean Korean advice
            if total_score >= 85:
                advice = f"{name1}과 {name2}는 천생연분의 궁합입니다. 서로를 깊이 이해하고 성장시켜주는 관계입니다."
            elif total_score >= 75:
                advice = f"{name1}과 {name2}는 좋은 궁합입니다. 서로의 차이를 인정하며 조화로운 관계를 만들어갈 수 있습니다."
            elif total_score >= 65:
                advice = f"{name1}과 {name2}는 노력이 필요한 관계입니다. 서로의 장점에 집중하면 좋은 관계로 발전할 수 있습니다."
            else:
                advice = f"{name1}과 {name2}는 신중한 접근이 필요합니다. 서로를 이해하려는 마음과 배려가 중요합니다."
            
            # Update advice with clean Korean text
            compat_data['advice'] = advice
    
    # Save with proper encoding
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Fixed Korean text in {len(data['compatibility'])} compatibility entries")
    
    # Test verification
    sample = data['compatibility']['1-2']
    print(f"\nSample 1-2 after fix:")
    print(f"Score: {sample['totalScore']}")  
    print(f"Advice: {sample['advice']}")

if __name__ == "__main__":
    fix_korean_compatibility()