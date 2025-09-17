import json

# Load the data
with open('C:/code/rheight/zodiac-system/api/fortune-data.json', encoding='utf-8') as f:
    data = json.load(f)

# Check if Sept 8 exists
has_sept8 = '2025-09-08' in data['daily']
print(f'Has 2025-09-08: {has_sept8}')

if has_sept8:
    # Check zodiac 1 data
    zodiac1 = data['daily']['2025-09-08']['1']
    print(f'Zodiac 1 keys: {list(zodiac1.keys())}')
    print(f'Has advice: {"advice" in zodiac1}')
    if 'advice' in zodiac1:
        print(f'Advice content: {zodiac1["advice"]}')
else:
    # Find Sept 8 in other dates
    for date in data['daily'].keys():
        if '-09-08' in date:
            print(f'Found date with 09-08: {date}')
            zodiac1 = data['daily'][date]['1']
            print(f'Has advice: {"advice" in zodiac1}')
            if 'advice' in zodiac1:
                print(f'Advice: {zodiac1["advice"]}')
            break