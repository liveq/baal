import json

print("=== 궁합 데이터 구조 확인 ===\n")

# JSON 파일 확인
with open('../api/fortune-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    
    if 'compatibility' in data:
        # 첫 번째 궁합 데이터 확인
        first_key = list(data['compatibility'].keys())[0]
        first_compat = data['compatibility'][first_key]
        
        print(f"첫 번째 궁합 키: {first_key}")
        print(f"데이터 구조:")
        for key, value in first_compat.items():
            print(f"  {key}: {value} (타입: {type(value).__name__})")
        
        # 점수 구조 확인
        if 'scores' in first_compat:
            print(f"\n점수 세부사항:")
            for key, value in first_compat['scores'].items():
                print(f"  scores.{key}: {value}")
    else:
        print("궁합 데이터가 없습니다!")