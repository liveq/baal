# -*- coding: utf-8 -*-
import json

# Load JSON data
json_path = '../api/fortune-data.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

compatibility = data.get('compatibility', {})

print(f"Total combinations: {len(compatibility)}")

# Score distribution
scores = [c['totalScore'] for c in compatibility.values()]
print(f"Average score: {sum(scores)/len(scores):.1f}")
print(f"Highest score: {max(scores)}")
print(f"Lowest score: {min(scores)}")

# Count by score ranges
excellent = sum(1 for s in scores if s >= 85)
good = sum(1 for s in scores if 75 <= s < 85)
fair = sum(1 for s in scores if 65 <= s < 75)
challenging = sum(1 for s in scores if s < 65)

print(f"\nScore distribution:")
print(f"Excellent (85+): {excellent} ({excellent/len(scores)*100:.1f}%)")
print(f"Good (75-84): {good} ({good/len(scores)*100:.1f}%)")
print(f"Fair (65-74): {fair} ({fair/len(scores)*100:.1f}%)")
print(f"Challenging (<65): {challenging} ({challenging/len(scores)*100:.1f}%)")

# Test data integrity
issues = 0
for key, data in compatibility.items():
    if not all(field in data for field in ['totalScore', 'scores', 'description', 'advice']):
        issues += 1

print(f"\nData integrity: {len(compatibility) - issues}/{len(compatibility)} records OK")

print("\nAll validation complete!")