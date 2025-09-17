#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
완전한 템플릿 분리 - naturalTemplates만 사용
- naturalTemplates가 있으면 그것만 사용
- categoryTraits와 절대 섞지 않음
- fallback도 단일 문장만 생성
"""

import re

# 파일 읽기
with open(r'C:\code\rheight\zodiac-system\api\zodiac-api-real.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 문제가 되는 부분 찾아서 수정
old_pattern = r'''        // 자연스러운 템플릿 사용 \(naturalTemplates가 있으면 우선 사용\)
        let enhancedMessage;
        
        if \(figure\.naturalTemplates && figure\.naturalTemplates\[category\]\) \{
            // 자연스러운 템플릿만 사용 \(다른 인물과 섞지 않음!\)
            const naturalTemplate = figure\.naturalTemplates\[category\];
            
            // categoryTraits가 있으면 함께 사용
            if \(figure\.categoryTraits && figure\.categoryTraits\[category\]\) \{
                enhancedMessage = `\$\{naturalTemplate\}, \$\{figure\.categoryTraits\[category\]\}`;
            \} else \{
                // naturalTemplate만 사용
                enhancedMessage = naturalTemplate;
            \}
            console\.log\(`♈ 자연스러운 템플릿 사용: \$\{naturalTemplate\}`\);
        \} else \{
            // 폴백: 기존 방식
            const achievementVerb = this\.getAchievementVerb\(achievement\);
            
            if \(figure\.categoryTraits && figure\.categoryTraits\[category\]\) \{
                enhancedMessage = `\$\{achievementName\}\$\{achievementVerb\} \$\{figure\.name\}처럼, \$\{figure\.categoryTraits\[category\]\}`;
            \} else \{
                enhancedMessage = `\$\{achievementName\}\$\{achievementVerb\} \$\{figure\.name\}처럼, \$\{baseMessage\}`;
            \}
            console\.log\(`♈ 폴백 템플릿 사용`\);
        \}'''

new_pattern = '''        // naturalTemplates만 사용 - 절대 다른 것과 섞지 않음!
        let enhancedMessage;
        
        if (figure.naturalTemplates && figure.naturalTemplates[category]) {
            // naturalTemplates가 있으면 그것만 사용 (완전한 단일 문장)
            enhancedMessage = figure.naturalTemplates[category];
            console.log(`♈ naturalTemplate 단독 사용: ${enhancedMessage}`);
        } else if (figure.categoryTraits && figure.categoryTraits[category]) {
            // naturalTemplates가 없으면 categoryTraits만 사용
            enhancedMessage = figure.categoryTraits[category];
            console.log(`♈ categoryTraits 사용: ${enhancedMessage}`);
        } else {
            // 둘 다 없으면 기본 메시지만 사용
            enhancedMessage = baseMessage;
            console.log(`♈ 기본 메시지 사용: ${enhancedMessage}`);
        }'''

# 정규식으로 교체
content = re.sub(old_pattern, new_pattern, content, flags=re.DOTALL)

# 파일 저장
with open(r'C:\code\rheight\zodiac-system\api\zodiac-api-real.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("[DONE] Complete template separation finished!")
print("- Using only naturalTemplates when available")
print("- No mixing with other templates")
print("- Each figure has completely independent single sentence")