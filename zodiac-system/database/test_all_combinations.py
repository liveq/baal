# -*- coding: utf-8 -*-
import json

def test_all_combinations():
    """Test all 78 zodiac compatibility combinations"""
    
    # Load JSON data
    json_path = '../api/fortune-data.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    compatibility = data.get('compatibility', {})
    
    zodiac_names = {
        1: "양자리", 2: "황소자리", 3: "쌍둥이자리", 4: "게자리",
        5: "사자자리", 6: "처녀자리", 7: "천칭자리", 8: "전갈자리", 
        9: "사수자리", 10: "염소자리", 11: "물병자리", 12: "물고기자리"
    }
    
    print("=== 별자리 궁합 시스템 검증 ===\n")
    
    # Test coverage
    expected_combinations = []
    for i in range(1, 13):
        for j in range(i, 13):  # i <= j to match our data structure
            expected_combinations.append(f"{i}-{j}")
    
    print(f"예상 조합 수: {len(expected_combinations)}")
    print(f"실제 조합 수: {len(compatibility)}")
    print(f"Coverage: {len(compatibility) / len(expected_combinations) * 100:.1f}%\n")
    
    # Check missing combinations
    missing = []
    for expected in expected_combinations:
        if expected not in compatibility:
            missing.append(expected)
    
    if missing:
        print(f"❌ 누락된 조합 ({len(missing)}개):", missing)
    else:
        print("✅ 모든 조합 완료")
    
    # Score distribution analysis
    scores = [c['totalScore'] for c in compatibility.values()]
    print(f"\n점수 분포:")
    print(f"  평균: {sum(scores)/len(scores):.1f}")
    print(f"  최고: {max(scores)}")
    print(f"  최저: {min(scores)}")
    
    # Score ranges
    excellent = sum(1 for s in scores if s >= 85)
    good = sum(1 for s in scores if 75 <= s < 85)
    fair = sum(1 for s in scores if 65 <= s < 75)
    challenging = sum(1 for s in scores if s < 65)
    
    print(f"\n등급별 분포:")
    print(f"  최고 궁합 (85+): {excellent}개 ({excellent/len(scores)*100:.1f}%)")
    print(f"  좋은 궁합 (75-84): {good}개 ({good/len(scores)*100:.1f}%)")
    print(f"  보통 궁합 (65-74): {fair}개 ({fair/len(scores)*100:.1f}%)")
    print(f"  도전 궁합 (<65): {challenging}개 ({challenging/len(scores)*100:.1f}%)")
    
    # Test specific high-scoring combinations
    print(f"\n🏆 최고 점수 조합들:")
    sorted_by_score = sorted(compatibility.items(), key=lambda x: x[1]['totalScore'], reverse=True)
    for i, (key, data) in enumerate(sorted_by_score[:5]):
        ids = key.split('-')
        name1 = zodiac_names[int(ids[0])]
        name2 = zodiac_names[int(ids[1])]
        print(f"  {i+1}. {name1}-{name2}: {data['totalScore']}점")
    
    # Test data integrity
    print(f"\n🔍 데이터 무결성 검사:")
    
    issues = 0
    for key, data in compatibility.items():
        # Check required fields
        if 'totalScore' not in data:
            print(f"❌ {key}: totalScore 누락")
            issues += 1
        if 'scores' not in data:
            print(f"❌ {key}: scores 누락")
            issues += 1
        if 'description' not in data:
            print(f"❌ {key}: description 누락")
            issues += 1
        if 'advice' not in data:
            print(f"❌ {key}: advice 누락")
            issues += 1
            
        # Check score ranges
        if data.get('totalScore', 0) < 20 or data.get('totalScore', 0) > 100:
            print(f"❌ {key}: totalScore 범위 오류 ({data.get('totalScore')})")
            issues += 1
            
        # Check description length
        if len(data.get('description', '')) < 10:
            print(f"❌ {key}: description 너무 짧음")
            issues += 1
    
    if issues == 0:
        print("✅ 모든 데이터 검증 통과")
    else:
        print(f"❌ {issues}개 문제 발견")
    
    print(f"\n=== 검증 완료 ===")

if __name__ == "__main__":
    test_all_combinations()