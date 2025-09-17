/**
 * zodiac-api-final.js의 ensureMessageQuality 함수 테스트
 */

// hasJongsung 함수 (zodiac-api-final.js에서 복사)
function hasJongsung(char) {
    if (!char || char.length === 0) return false;
    const code = char.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7AF) {
        const jongsung = (code - 0xAC00) % 28;
        return jongsung !== 0;
    }
    return false;
}

// fixKoreanPostpositions 함수 (zodiac-api-final.js에서 복사)
function fixKoreanPostpositions(text) {
    if (!text) return text;
    
    let correctedText = text;
    
    // 실제 오류 패턴들 (수정해야 할 것들)
    const errorPatterns = [
        { pattern: /양자리과/g, correct: '양자리와' },
        { pattern: /황소자리과/g, correct: '황소자리와' },
        { pattern: /쌍둥이자리과/g, correct: '쌍둥이자리와' },
        { pattern: /게자리과/g, correct: '게자리와' },
        { pattern: /사자자리과/g, correct: '사자자리와' },
        { pattern: /처녀자리과/g, correct: '처녀자리와' },
        { pattern: /천칭자리과/g, correct: '천칭자리와' },
        { pattern: /전갈자리과/g, correct: '전갈자리와' },
        { pattern: /사수자리과/g, correct: '사수자리와' },
        { pattern: /염소자리과/g, correct: '염소자리와' },
        { pattern: /물병자리과/g, correct: '물병자리와' },
        { pattern: /물고기자리과/g, correct: '물고기자리와' }
    ];
    
    // 실제 오류만 수정
    for (const errorFix of errorPatterns) {
        if (correctedText.match(errorFix.pattern)) {
            console.log(`🔧 조사 오류 수정: ${errorFix.pattern.source} → ${errorFix.correct}`);
            correctedText = correctedText.replace(errorFix.pattern, errorFix.correct);
        }
    }
    
    // 기타 일반적인 조사 오류 수정 (더 신중하게)
    const generalErrorPatterns = [
        { pattern: /([가-힣])을(\s)/g, handler: (match, char, space) => {
            return hasJongsung(char) ? char + '을' + space : char + '를' + space;
        }},
        { pattern: /([가-힣])이(\s)/g, handler: (match, char, space) => {
            return hasJongsung(char) ? char + '이' + space : char + '가' + space;
        }},
        { pattern: /([가-힣])은(\s)/g, handler: (match, char, space) => {
            return hasJongsung(char) ? char + '은' + space : char + '는' + space;
        }}
    ];
    
    for (const generalFix of generalErrorPatterns) {
        correctedText = correctedText.replace(generalFix.pattern, generalFix.handler);
    }
    
    return correctedText;
}

// 테스트 케이스들
const testCases = [
    // 잘못된 조사들 (수정되어야 함)
    "양자리과 황소자리의 궁합은 좋습니다.",
    "사자자리과 처녀자리를 비교해보세요.",
    "게자리과 전갈자리는 물의 원소입니다.",
    
    // 올바른 조사들 (수정되지 않아야 함)
    "양자리와 황소자리의 궁합은 좋습니다.",
    "사자자리와 처녀자리를 비교해보세요.", 
    "게자리와 전갈자리는 물의 원소입니다.",
    
    // 기타 조사 오류들
    "사람을 도와주세요.",  // 올바름
    "사랑을 찾을 수 있습니다.",  // 올바름  
    "희망이 보입니다.",  // 올바름
    "꿈는 이루어집니다."   // 오류: 꿈→꿈이
];

console.log("=== 한국어 조사 교정 테스트 ===\n");

testCases.forEach((testCase, index) => {
    console.log(`테스트 ${index + 1}: "${testCase}"`);
    const result = fixKoreanPostpositions(testCase);
    if (testCase !== result) {
        console.log(`✅ 수정됨: "${result}"`);
    } else {
        console.log(`⚪ 변경 없음 (올바른 상태)`);
    }
    console.log('');
});

console.log("=== 종성 확인 테스트 ===");
const characters = ['리', '람', '서', '은', '을', '과', '와'];
characters.forEach(char => {
    console.log(`'${char}': 종성=${hasJongsung(char)}`);
});