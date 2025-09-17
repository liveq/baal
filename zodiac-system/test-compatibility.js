// Node.js 환경에서 궁합 데이터 연동 테스트
const fs = require('fs');
const path = require('path');

// compatibility-data.json 파일 읽기
function loadCompatibilityData() {
    try {
        const dataPath = path.join(__dirname, 'api', 'compatibility-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('❌ compatibility-data.json 로드 실패:', error.message);
        return null;
    }
}

// getCompatibilityFromDatabase 함수 시뮬레이션
function getCompatibilityFromDatabase(zodiac1Id, zodiac2Id) {
    const data = loadCompatibilityData();
    if (!data) return null;

    const minId = Math.min(zodiac1Id, zodiac2Id);
    const maxId = Math.max(zodiac1Id, zodiac2Id);
    const key = `${minId}-${maxId}`;

    console.log(`🗄️ 데이터베이스 쿼리: ${key}`);

    if (data[key]) {
        console.log(`✅ 데이터베이스 데이터 발견: ${key}`);
        return data[key];
    } else {
        console.log(`❌ 데이터베이스 데이터 없음: ${key}`);
        return null;
    }
}

// 메시지 품질 검증 (간단 버전)
function ensureMessageQuality(message) {
    if (!message || typeof message !== 'string') {
        return "좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다.";
    }
    return message;
}

// getCompatibility 메서드 시뮬레이션
function getCompatibility(zodiac1Id, zodiac2Id) {
    console.log('🔍 getCompatibility 호출:', {zodiac1Id, zodiac2Id});

    // 1순위: 데이터베이스에서 새로운 compat_message 가져오기
    const dbCompatData = getCompatibilityFromDatabase(zodiac1Id, zodiac2Id);
    if (dbCompatData && dbCompatData.compat_message) {
        console.log('✅ 데이터베이스 compat_message 사용');
        return {
            zodiac1Id: zodiac1Id,
            zodiac2Id: zodiac2Id,
            totalScore: dbCompatData.overall_score,
            scores: {
                love: dbCompatData.love_score,
                friendship: dbCompatData.friendship_score,
                work: dbCompatData.work_score
            },
            description: ensureMessageQuality(dbCompatData.compat_message),
            advice: ensureMessageQuality(dbCompatData.advice || "서로를 이해하고 배려하는 마음이 중요합니다."),
            source: 'database-compat-message'
        };
    }

    console.log('❌ 데이터베이스 데이터 없음, 폴백 사용');
    return {
        zodiac1Id: zodiac1Id,
        zodiac2Id: zodiac2Id,
        totalScore: 75,
        scores: { love: 75, friendship: 75, work: 75 },
        description: ensureMessageQuality("좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다."),
        advice: ensureMessageQuality("서로를 이해하고 배려하는 마음이 중요합니다."),
        source: 'fallback'
    };
}

// 테스트 실행
console.log('🧪 별자리 궁합 데이터 연동 검증 시작\n');

const testCases = [
    { z1: 1, z2: 4, name: '양자리-게자리 (문제 조합)' },
    { z1: 11, z2: 5, name: '물병자리-사자자리 (정상 조합)' },
    { z1: 5, z2: 12, name: '사자자리-물고기자리 (긴 텍스트)' },
    { z1: 1, z2: 1, name: '양자리-양자리 (같은 별자리)' }
];

testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.name}`);
    console.log('='.repeat(50));

    const result = getCompatibility(testCase.z1, testCase.z2);

    console.log(`📊 결과 분석:`);
    console.log(`   - 총점: ${result.totalScore}`);
    console.log(`   - 애정운: ${result.scores.love}`);
    console.log(`   - 우정운: ${result.scores.friendship}`);
    console.log(`   - 업무운: ${result.scores.work}`);
    console.log(`   - 데이터 소스: ${result.source}`);
    console.log(`   - 설명 길이: ${result.description.length}자`);
    console.log(`   - 설명 내용: ${result.description.substring(0, 100)}...`);

    // 검증
    if (result.source === 'database-compat-message') {
        console.log('✅ compatibility-data.json의 compat_message 올바르게 사용됨');
    } else {
        console.log('⚠️ 폴백 데이터 사용됨');
    }
});

console.log('\n🏁 검증 완료');