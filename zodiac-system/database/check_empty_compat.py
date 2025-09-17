import sqlite3

# 데이터베이스 연결
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# 빈 궁합 메시지 조회
cursor.execute('SELECT zodiac1_id, zodiac2_id, description FROM compatibility_fortunes_data WHERE description IS NULL OR description = "" ORDER BY zodiac1_id, zodiac2_id')
results = cursor.fetchall()

print(f'빈 메시지 개수: {len(results)}')
print('\n빈 메시지 조합들:')
for r in results:
    print(f'{r[0]}-{r[1]}')

# 물의 원소 별자리 관련 조합 확인 (4=게자리, 8=전갈자리, 12=물고기자리)
water_combinations = [
    (4, 6), (4, 7), (4, 8), (4, 9), (4, 10), (4, 11), (4, 12),
    (8, 9), (8, 10), (8, 11), (8, 12)
]

print(f'\n물의 원소 관련 11개 조합 중 빈 메시지:')
empty_water_combos = []
for combo in water_combinations:
    cursor.execute('SELECT description FROM compatibility_fortunes_data WHERE zodiac1_id = ? AND zodiac2_id = ?', combo)
    result = cursor.fetchone()
    if result and (result[0] is None or result[0] == ""):
        empty_water_combos.append(combo)
        print(f'{combo[0]}-{combo[1]}')

print(f'\n작업 필요한 물의 원소 조합 개수: {len(empty_water_combos)}')

# 별자리 이름 매핑
zodiac_names = {1: "양자리", 2: "황소자리", 3: "쌍둥이자리", 4: "게자리", 
                5: "사자자리", 6: "처녀자리", 7: "천칭자리", 8: "전갈자리",
                9: "사수자리", 10: "염소자리", 11: "물병자리", 12: "물고기자리"}

print(f'\n작업할 조합들 (별자리 이름):')
for combo in empty_water_combos:
    print(f'{zodiac_names[combo[0]]} - {zodiac_names[combo[1]]} ({combo[0]}-{combo[1]})')

conn.close()