/**
 * 수동 API 테스트 스크립트
 * Node.js 환경에서 실행하여 zodiac-api-real.js 기능 확인
 */

// Node.js 환경에서 fetch 사용을 위한 모듈
global.fetch = require('node-fetch');

// zodiac-api-real.js 모듈 로드 (간소화된 테스트)
class TestZodiacAPI {
    async getCompatibilityFromDatabase(zodiac1Id, zodiac2Id) {
        try {
            const minId = Math.min(zodiac1Id, zodiac2Id);
            const maxId = Math.max(zodiac1Id, zodiac2Id);

            console.log(`🗄️ 데이터베이스 쿼리 시도: ${minId} - ${maxId}`);

            const response = await fetch('http://localhost:8080/zodiac-system/api/compatibility-data.json');
            if (response.ok) {
                const data = await response.json();
                const key = `${minId}-${maxId}`;

                if (data[key]) {
                    console.log(`✅ 데이터베이스 데이터 발견: ${key}`);
                    console.log(`📝 compat_message 길이: ${data[key].compat_message?.length || 0}자`);
                    console.log(`📝 compat_message 내용: ${data[key].compat_message?.substring(0, 100)}...`);
                    return data[key];
                }
            }

            console.log('❌ 데이터베이스 데이터 없음');
            return null;
        } catch (error) {
            console.error('❌ 데이터베이스 조회 실패:', error.message);
            return null;
        }
    }

    ensureMessageQuality(message) {
        // 간단한 품질 보장 - 실제로는 더 복잡한 로직
        if (!message || typeof message !== 'string') {
            return "긍정적인 변화와 성장의 기회가 있을 것입니다.";
        }
        return message;
    }

    async getCompatibility(zodiac1Id, zodiac2Id) {
        console.log('🔍 getCompatibility 호출됨:', {zodiac1Id, zodiac2Id});

        // 1순위: 데이터베이스에서 새로운 compat_message 가져오기
        const dbCompatData = await this.getCompatibilityFromDatabase(zodiac1Id, zodiac2Id);
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
                description: this.ensureMessageQuality(dbCompatData.compat_message),
                advice: this.ensureMessageQuality(dbCompatData.advice || "서로를 이해하고 배려하는 마음이 중요합니다."),
                source: 'database-compat-message'
            };
        }

        // 폴백: 기본 메시지
        return {
            zodiac1Id: zodiac1Id,
            zodiac2Id: zodiac2Id,
            totalScore: 75,
            scores: { love: 75, friendship: 75, work: 75 },
            description: "좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다.",
            advice: "서로를 이해하고 배려하는 마음이 중요합니다.",
            source: 'fallback-message'
        };
    }
}

// 테스트 실행
async function runTests() {
    console.log('🌟 별자리 궁합 API 수동 테스트 시작\n');

    const api = new TestZodiacAPI();

    const testCases = [
        {name: '양자리 - 게자리', z1: 1, z2: 4},
        {name: '사자자리 - 사자자리', z1: 5, z2: 5},
        {name: '양자리 - 황소자리', z1: 1, z2: 2},
        {name: '물고기자리 - 양자리', z1: 12, z2: 1}
    ];

    for (const testCase of testCases) {
        console.log(`\n🎯 테스트: ${testCase.name} (${testCase.z1}-${testCase.z2})`);
        console.log('=' .repeat(50));

        try {
            const result = await api.getCompatibility(testCase.z1, testCase.z2);

            console.log(`📊 전체 점수: ${result.totalScore}`);
            console.log(`📏 텍스트 길이: ${result.description.length}자`);
            console.log(`🔧 소스: ${result.source}`);
            console.log(`📝 메시지: ${result.description.substring(0, 150)}...`);

            if (result.description.length < 150) {
                console.log('⚠️  텍스트가 너무 짧습니다!');
            } else if (result.description.length > 500) {
                console.log('⚠️  텍스트가 너무 깁니다!');
            } else {
                console.log('✅ 텍스트 길이 적절');
            }

        } catch (error) {
            console.error(`❌ 테스트 실패: ${error.message}`);
        }
    }

    console.log('\n🏁 테스트 완료');
}

// 실행
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { TestZodiacAPI };