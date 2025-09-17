/**
 * 메시지 단일화 테스트 코드
 * 중복 인물 메시지 문제 검증 및 해결 확인
 */

const fs = require('fs');
const path = require('path');

// 테스트 설정
const TEST_CONFIG = {
    FORTUNE_DATA_PATH: './api/fortune-data.json',
    API_FILE_PATH: './api/zodiac-api-real.js',
    SAMPLE_ZODIAC_ID: 1, // 양자리
    SAMPLE_DATE: '2025-01-01'
};

console.log('🔍 메시지 단일화 테스트 시작...\n');

/**
 * 1. fortune-data.json 데이터 분석
 */
function analyzeFortuneData() {
    console.log('📊 1. fortune-data.json 분석');
    console.log('=' .repeat(50));
    
    if (!fs.existsSync(TEST_CONFIG.FORTUNE_DATA_PATH)) {
        console.error('❌ fortune-data.json 파일이 없습니다:', TEST_CONFIG.FORTUNE_DATA_PATH);
        return null;
    }
    
    const fortuneData = JSON.parse(fs.readFileSync(TEST_CONFIG.FORTUNE_DATA_PATH, 'utf8'));
    
    // 샘플 데이터 확인
    const sampleData = fortuneData.daily[TEST_CONFIG.SAMPLE_DATE]?.[TEST_CONFIG.SAMPLE_ZODIAC_ID];
    
    if (!sampleData) {
        console.error('❌ 샘플 데이터가 없습니다.');
        return null;
    }
    
    console.log('✅ 샘플 데이터 발견:');
    console.log('  - Overall:', sampleData.overall);
    console.log('  - Advice:', sampleData.advice);
    
    // 인물 이름 패턴 검사
    const historicalFigurePatterns = [
        /나폴레옹/g, /석가모니/g, /케네디/g, /반\s?고흐/g, /셰익스피어/g,
        /마르코\s?폴로/g, /링컨/g, /간디/g, /다빈치/g, /아인슈타인/g
    ];
    
    let foundFigures = [];
    historicalFigurePatterns.forEach(pattern => {
        if (pattern.test(sampleData.overall)) {
            foundFigures.push(pattern.source.replace(/\\s\?|\\|g|\/g/g, ''));
        }
        if (pattern.test(sampleData.advice)) {
            foundFigures.push(pattern.source.replace(/\\s\?|\\|g|\/g/g, ''));
        }
    });
    
    console.log('🎭 발견된 역사적 인물:', foundFigures);
    console.log('📝 이미 완성된 인물 메시지 확인:', foundFigures.length > 0 ? 'YES' : 'NO');
    console.log('');
    
    return { sampleData, hasHistoricalFigures: foundFigures.length > 0 };
}

/**
 * 2. API 파일 중복 로직 검사
 */
function analyzeAPILogic() {
    console.log('🔧 2. API 로직 분석');
    console.log('=' .repeat(50));
    
    if (!fs.existsSync(TEST_CONFIG.API_FILE_PATH)) {
        console.error('❌ API 파일이 없습니다:', TEST_CONFIG.API_FILE_PATH);
        return null;
    }
    
    const apiContent = fs.readFileSync(TEST_CONFIG.API_FILE_PATH, 'utf8');
    
    // 문제가 되는 패턴들 검사
    const problemPatterns = [
        {
            name: '중복 인물 조합 패턴',
            pattern: /selectedFigure\.name.*정신으로.*fortuneData\.overall/g,
            description: 'fortune-data에 이미 인물이 있는데 또 다른 인물을 앞에 붙이는 문제'
        },
        {
            name: 'formatWithConcreteExample 중복 사용',
            pattern: /formatWithConcreteExample.*selectedFigure.*fortuneData\.advice/g,
            description: 'advice에 이미 인물이 있는데 또 변환하는 문제'
        },
        {
            name: 'generateEnhancedMessage 호출',
            pattern: /generateEnhancedMessage\(/g,
            description: '이미 완성된 메시지에 추가 인물 특성 적용'
        }
    ];
    
    let issues = [];
    problemPatterns.forEach(({ name, pattern, description }) => {
        const matches = apiContent.match(pattern);
        if (matches) {
            console.log(`⚠️  발견된 문제: ${name}`);
            console.log(`   설명: ${description}`);
            console.log(`   발견 횟수: ${matches.length}`);
            issues.push({ name, matches: matches.length, description });
        }
    });
    
    if (issues.length === 0) {
        console.log('✅ 중복 로직 문제 없음');
    } else {
        console.log(`❌ 총 ${issues.length}개 문제 발견`);
    }
    
    console.log('');
    return { issues };
}

/**
 * 3. 예상 결과 시뮬레이션
 */
function simulateResult(fortuneAnalysis, apiAnalysis) {
    console.log('🎯 3. 메시지 중복 시뮬레이션');
    console.log('=' .repeat(50));
    
    if (!fortuneAnalysis || !apiAnalysis) {
        console.error('❌ 분석 데이터가 없어 시뮬레이션 불가');
        return;
    }
    
    const { sampleData, hasHistoricalFigures } = fortuneAnalysis;
    const { issues } = apiAnalysis;
    
    if (hasHistoricalFigures && issues.length > 0) {
        console.log('⚠️  예상되는 결과:');
        console.log('   원본 메시지:', sampleData.overall);
        console.log('   문제 결과 예시:', '"마르코폴로의 탐험 정신으로 01월 01일, 나폴레옹의 도전으로..."');
        console.log('   ❌ 깨진 문장: "과 완고함, 편협함을 치료하는 약이다."라고 했던 마르코 폴로처럼');
    } else {
        console.log('✅ 메시지 중복 문제 없음');
    }
    
    console.log('');
}

/**
 * 4. 해결 방안 제시
 */
function provideSolution(fortuneAnalysis, apiAnalysis) {
    console.log('💡 4. 해결 방안');
    console.log('=' .repeat(50));
    
    if (!fortuneAnalysis || !apiAnalysis) {
        return;
    }
    
    const { hasHistoricalFigures } = fortuneAnalysis;
    const { issues } = apiAnalysis;
    
    if (hasHistoricalFigures && issues.length > 0) {
        console.log('🛠️  수정 필요 사항:');
        console.log('1. 메시지 소스 단일화:');
        console.log('   - fortune-data.json 우선 사용 (이미 완성된 인물 메시지)');
        console.log('   - historical-figures는 fortune-data가 없을 때만 사용');
        console.log('');
        console.log('2. 중복 조합 제거:');
        console.log('   - rawOverall 생성 로직에서 중복 인물명 조합 제거');
        console.log('   - formatWithConcreteExample() 조건부 실행');
        console.log('   - generateEnhancedMessage() 호출 제한');
        console.log('');
        console.log('3. 우선순위 로직:');
        console.log('   if (fortuneData) {');
        console.log('     // fortune-data.json 그대로 사용 (완성된 인물 메시지)');
        console.log('   } else if (selectedFigure) {');
        console.log('     // historical-figures로 메시지 생성');
        console.log('   } else {');
        console.log('     // 기본 생성');
        console.log('   }');
    } else {
        console.log('✅ 현재 구조에서는 메시지 중복 문제가 없습니다.');
    }
    
    console.log('');
}

/**
 * 5. 테스트 실행
 */
function runTests() {
    console.log('🧪 5. 실제 테스트');
    console.log('=' .repeat(50));
    
    try {
        // API 모듈 임포트 시도
        const ZodiacAPI = require(TEST_CONFIG.API_FILE_PATH.replace('./', ''));
        console.log('✅ API 모듈 로드 성공');
        
        // 인스턴스 생성 및 테스트 (간단한 구조 확인)
        console.log('📝 API 구조 확인...');
        console.log('- ZodiacAPI 타입:', typeof ZodiacAPI);
        
    } catch (error) {
        console.error('❌ API 모듈 로드 실패:', error.message);
        console.log('💡 require 경로나 모듈 구조 확인 필요');
    }
}

// 메인 실행
async function main() {
    try {
        const fortuneAnalysis = analyzeFortuneData();
        const apiAnalysis = analyzeAPILogic();
        
        simulateResult(fortuneAnalysis, apiAnalysis);
        provideSolution(fortuneAnalysis, apiAnalysis);
        runTests();
        
        console.log('✅ 메시지 단일화 테스트 완료');
        
    } catch (error) {
        console.error('❌ 테스트 실행 중 오류:', error);
    }
}

// 프로세스 실행
if (require.main === module) {
    main();
}

module.exports = {
    analyzeFortuneData,
    analyzeAPILogic,
    simulateResult,
    provideSolution
};