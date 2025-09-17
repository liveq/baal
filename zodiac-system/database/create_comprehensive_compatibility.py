# -*- coding: utf-8 -*-
import json
import random

def create_comprehensive_compatibility():
    """Create comprehensive 66-combination compatibility data with historical figures"""
    
    # Zodiac information
    zodiacs = {
        1: {"name": "양자리", "symbol": "♈", "element": "불", "ruling": "화성", "traits": ["열정적", "도전적", "리더십", "직관적"]},
        2: {"name": "황소자리", "symbol": "♉", "element": "땅", "ruling": "금성", "traits": ["신중함", "실용적", "끈기", "감각적"]},
        3: {"name": "쌍둥이자리", "symbol": "♊", "element": "공기", "ruling": "수성", "traits": ["지적", "소통", "호기심", "다재다능"]},
        4: {"name": "게자리", "symbol": "♋", "element": "물", "ruling": "달", "traits": ["감성적", "직관적", "보호본능", "배려심"]},
        5: {"name": "사자자리", "symbol": "♌", "element": "불", "ruling": "태양", "traits": ["자신감", "관대함", "창의적", "카리스마"]},
        6: {"name": "처녀자리", "symbol": "♍", "element": "땅", "ruling": "수성", "traits": ["분석적", "완벽주의", "봉사정신", "세심함"]},
        7: {"name": "천칭자리", "symbol": "♎", "element": "공기", "ruling": "금성", "traits": ["공정함", "사교적", "예술적", "균형감"]},
        8: {"name": "전갈자리", "symbol": "♏", "element": "물", "ruling": "명왕성", "traits": ["열정적", "직관력", "신비로움", "집중력"]},
        9: {"name": "사수자리", "symbol": "♐", "element": "불", "ruling": "목성", "traits": ["낙천적", "자유로움", "모험심", "철학적"]},
        10: {"name": "염소자리", "symbol": "♑", "element": "땅", "ruling": "토성", "traits": ["책임감", "야심적", "현실적", "인내심"]},
        11: {"name": "물병자리", "symbol": "♒", "element": "공기", "ruling": "천왕성", "traits": ["독립적", "창의적", "진보적", "인도주의"]},
        12: {"name": "물고기자리", "symbol": "♓", "element": "물", "ruling": "해왕성", "traits": ["상상력", "감수성", "공감능력", "예술적"]}
    }
    
    # Historical figure metaphors for each zodiac
    historical_figures = {
        1: ["나폴레옹", "줄리어스 시저", "알렉산더 대왕", "처칠"],
        2: ["프로이드", "셰익스피어", "다빈치", "바흐"],  
        3: ["아인슈타인", "소크라테스", "볼테르", "케네디"],
        4: ["마더 테레사", "간디", "넬슨 만델라", "다이애나 공주"],
        5: ["나폴레옹", "루이 14세", "링컨", "처칠"],
        6: ["아가사 크리스티", "마리 큐리", "플라톤", "간디"],
        7: ["케네디", "오스카 와일드", "모차르트", "다이애나 공주"],
        8: ["프로이드", "피카소", "괴테", "니체"],
        9: ["콜럼버스", "사르트르", "윈스턴 처칠", "베토벤"],
        10: ["링컨", "차이코프스키", "톨스토이", "다윈"],
        11: ["에디슨", "아인슈타인", "밥 딜런", "존 레넌"],
        12: ["미켈란젤로", "반 고흐", "입센", "쇼팽"]
    }
    
    # Calculate compatibility score based on element compatibility
    def calculate_compatibility(z1, z2):
        elem1 = zodiacs[z1]["element"]
        elem2 = zodiacs[z2]["element"]
        
        # Perfect matches (same element)
        if elem1 == elem2:
            base_score = random.randint(80, 92)
        # Fire + Air, Earth + Water (complementary)
        elif (elem1 == "불" and elem2 == "공기") or (elem1 == "공기" and elem2 == "불"):
            base_score = random.randint(75, 88)
        elif (elem1 == "땅" and elem2 == "물") or (elem1 == "물" and elem2 == "땅"):
            base_score = random.randint(75, 88)
        # Fire + Water, Earth + Air (challenging)
        elif (elem1 == "불" and elem2 == "물") or (elem1 == "물" and elem2 == "불"):
            base_score = random.randint(55, 72)
        elif (elem1 == "땅" and elem2 == "공기") or (elem1 == "공기" and elem2 == "땅"):
            base_score = random.randint(55, 72)
        # Fire + Earth, Water + Air (neutral)
        else:
            base_score = random.randint(65, 78)
            
        return base_score
    
    # Generate creative description
    def generate_description(z1, z2, score):
        name1 = zodiacs[z1]["name"]
        name2 = zodiacs[z2]["name"]
        figure1 = random.choice(historical_figures[z1])
        figure2 = random.choice(historical_figures[z2])
        elem1 = zodiacs[z1]["element"]
        elem2 = zodiacs[z2]["element"]
        
        if score >= 85:
            return f"""<div class="compat-section">
<h4>⭐ 최고의 궁합 ⭐</h4>
<div class="compat-item">
<strong>{zodiacs[z2]["symbol"]} {name2}:</strong>
<p>{figure1}과 {figure2}의 만남처럼 완벽한 조화를 이루는 관계입니다. {elem1}의 {name1}와 {elem2}의 {name2}가 만나 서로의 장점을 극대화시키는 이상적인 파트너십을 형성합니다. 서로를 깊이 이해하고 성장시켜주는 천생연분의 궁합입니다.</p>
</div>
</div>"""
        elif score >= 75:
            return f"""<div class="compat-section">
<h4>💫 좋은 궁합 💫</h4>
<div class="compat-item">
<strong>{zodiacs[z2]["symbol"]} {name2}:</strong>
<p>{figure1}과 {figure2}처럼 서로 다른 매력을 가진 두 사람이 만나 새로운 시너지를 창조하는 관계입니다. {name1}의 {random.choice(zodiacs[z1]["traits"])}과 {name2}의 {random.choice(zodiacs[z2]["traits"])}이 조화를 이루어 발전적인 관계를 만들어갑니다.</p>
</div>
</div>"""
        elif score >= 65:
            return f"""<div class="compat-section">
<h4>🌱 성장하는 궁합 🌱</h4>
<div class="compat-item">
<strong>{zodiacs[z2]["symbol"]} {name2}:</strong>
<p>{figure1}과 {figure2}의 만남처럼 처음에는 다른 점이 많아 보이지만, 서로를 이해하려는 노력을 통해 성장하는 관계입니다. {name1}의 {random.choice(zodiacs[z1]["traits"])}함과 {name2}의 {random.choice(zodiacs[z2]["traits"])}함이 서로 보완하며 발전할 수 있습니다.</p>
</div>
</div>"""
        else:
            return f"""<div class="compat-section">
<h4>🤝 신중한 궁합 🤝</h4>
<div class="compat-item">
<strong>{zodiacs[z2]["symbol"]} {name2}:</strong>
<p>{figure1}과 {figure2}처럼 각각 고유한 매력을 가진 두 사람의 만남입니다. {name1}와 {name2}는 서로의 차이를 인정하고 이해하려는 마음가짐이 중요합니다. 시간을 들여 서로를 알아가면 의외의 공통점을 발견할 수 있습니다.</p>
</div>
</div>"""
    
    # Generate advice
    def generate_advice(z1, z2, score):
        name1 = zodiacs[z1]["name"]
        name2 = zodiacs[z2]["name"]
        
        if score >= 85:
            return f"{name1}과 {name2}는 천생연분의 궁합입니다. 서로를 깊이 이해하고 성장시켜주는 관계로 발전할 수 있습니다."
        elif score >= 75:
            return f"{name1}과 {name2}는 좋은 궁합입니다. 서로의 차이를 인정하며 조화로운 관계를 만들어갈 수 있습니다."
        elif score >= 65:
            return f"{name1}과 {name2}는 노력이 필요한 관계입니다. 서로의 장점에 집중하면 좋은 관계로 발전할 수 있습니다."
        else:
            return f"{name1}과 {name2}는 신중한 접근이 필요합니다. 서로를 이해하려는 마음과 배려가 중요합니다."
    
    # Create all 66 unique combinations (12*12 - 12 duplicates)
    compatibility_data = {}
    total_combinations = 0
    
    for z1 in range(1, 13):
        for z2 in range(z1, 13):  # Only generate z1 <= z2 to avoid duplicates
            key = f"{z1}-{z2}"
            
            # Calculate scores
            total_score = calculate_compatibility(z1, z2)
            
            # Generate individual scores with some variance
            love_variance = random.randint(-8, 8)
            friendship_variance = random.randint(-5, 5)
            work_variance = random.randint(-10, 10)
            
            love_score = max(20, min(100, total_score + love_variance))
            friendship_score = max(20, min(100, total_score + friendship_variance))
            work_score = max(20, min(100, total_score + work_variance))
            
            # Create compatibility entry
            compatibility_data[key] = {
                "totalScore": total_score,
                "scores": {
                    "love": love_score,
                    "friendship": friendship_score,
                    "work": work_score
                },
                "description": generate_description(z1, z2, total_score),
                "advice": generate_advice(z1, z2, total_score)
            }
            
            total_combinations += 1
    
    print(f"Generated {total_combinations} unique compatibility combinations")
    
    # Load existing JSON and update
    json_path = '../api/fortune-data.json'
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        data = {"daily": {}, "weekly": {}, "monthly": {}, "yearly": {}, "compatibility": {}}
    
    # Update compatibility section
    data['compatibility'] = compatibility_data
    
    # Save with proper UTF-8 encoding
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved comprehensive compatibility data to {json_path}")
    
    # Show sample
    sample = compatibility_data["1-5"]  # 양자리 - 사자자리 (should be high score)
    print(f"\nSample: 양자리-사자자리")
    print(f"Score: {sample['totalScore']}")
    print(f"Description length: {len(sample['description'])} characters")

if __name__ == "__main__":
    create_comprehensive_compatibility()