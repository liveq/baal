#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
템플릿 혼합 문제 수정
- naturalTemplates가 있으면 그것만 사용
- 다른 인물과 섞지 않음
"""

import re

# 파일 읽기
with open(r'C:\code\rheight\zodiac-system\api\zodiac-api-real.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 문제가 되는 부분 찾아서 수정
old_pattern = r'''        // 자연스러운 템플릿 사용 \(naturalTemplates가 있으면 우선 사용\)
        let enhancedMessage;
        
        if \(figure\.naturalTemplates && figure\.naturalTemplates\[category\]\) \{
            // 새로운 자연스러운 템플릿 사용
            const naturalTemplate = figure\.naturalTemplates\[category\];
            enhancedMessage = `\$\{naturalTemplate\}, \$\{finalTrait\}`;
            console\.log\(`♈ 자연스러운 템플릿 사용: \$\{naturalTemplate\}`\);
        \} else \{
            // 폴백: 기존 방식 \(하지만 더 자연스럽게 개선\)
            const achievementVerb = this\.getAchievementVerb\(achievement\);
            enhancedMessage = `\$\{achievementName\}\$\{achievementVerb\} \$\{figure\.name\}처럼, \$\{finalTrait\}`;
            console\.log\(`♈ 폴백 템플릿 사용`\);
        \}'''

new_pattern = '''        // 자연스러운 템플릿 사용 (naturalTemplates가 있으면 우선 사용)
        let enhancedMessage;
        
        if (figure.naturalTemplates && figure.naturalTemplates[category]) {
            // 자연스러운 템플릿만 사용 (다른 인물과 섞지 않음!)
            const naturalTemplate = figure.naturalTemplates[category];
            
            // categoryTraits가 있으면 함께 사용
            if (figure.categoryTraits && figure.categoryTraits[category]) {
                enhancedMessage = `${naturalTemplate}, ${figure.categoryTraits[category]}`;
            } else {
                // naturalTemplate만 사용
                enhancedMessage = naturalTemplate;
            }
            console.log(`♈ 자연스러운 템플릿 사용: ${naturalTemplate}`);
        } else {
            // 폴백: 기존 방식
            const achievementVerb = this.getAchievementVerb(achievement);
            
            if (figure.categoryTraits && figure.categoryTraits[category]) {
                enhancedMessage = `${achievementName}${achievementVerb} ${figure.name}처럼, ${figure.categoryTraits[category]}`;
            } else {
                enhancedMessage = `${achievementName}${achievementVerb} ${figure.name}처럼, ${baseMessage}`;
            }
            console.log(`♈ 폴백 템플릿 사용`);
        }'''

# 정규식으로 교체
content = re.sub(old_pattern, new_pattern, content, flags=re.DOTALL)

# 파일 저장
with open(r'C:\code\rheight\zodiac-system\api\zodiac-api-real.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 템플릿 혼합 문제 수정 완료!")
print("- naturalTemplates가 있으면 그것만 사용")
print("- 다른 인물과 섞지 않도록 수정")