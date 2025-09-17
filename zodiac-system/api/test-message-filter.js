/**
 * 메시지 필터링 시스템 테스트 파일
 * 구체적 vs 추상적 메시지 구분 테스트 및 품질 검증
 */

// Node.js 환경에서 실행하기 위한 MessageFilter 클래스 로드
const fs = require('fs');
const path = require('path');

// message-filter.js 파일을 동적으로 로드
const messageFilterPath = path.join(__dirname, 'message-filter.js');
const messageFilterCode = fs.readFileSync(messageFilterPath, 'utf8');

// MessageFilter 클래스를 전역 스코프에서 사용할 수 있도록 eval 실행
eval(messageFilterCode.replace('const messageFilter = new MessageFilter();', '').replace('if (typeof module !== \'undefined\' && module.exports) {\n    module.exports = MessageFilter;\n}', ''));

// 테스트용 MessageFilter 인스턴스 생성
const testFilter = new MessageFilter();

console.log('🧪 메시지 필터링 시스템 테스트 시작\n');

// 테스트 케이스 정의
const testCases = {
    // 추상적 메시지들 (차단 대상)
    abstract: [
        "반 고흐의 개척정신으로 하루를 시작하세요",
        "나폴레옹처럼 도전을 실천하세요", 
        "다빈치의 창의력으로 문제를 해결하세요",
        "베토벤의 열정으로 음악을 만드세요",
        "미켈란젤로의 의지력으로 극복하세요",
        "셰익스피어의 영감으로 글을 써보세요",
        "괴테의 지혜로 인생을 바라보세요",
        "카이사르의 리더십으로 팀을 이끄세요"
    ],
    
    // 구체적 메시지들 (통과 대상)
    concrete: [
        "해바라기를 그린 반 고흐처럼 열정적인 하루를 보내세요",
        "워털루 전투를 이끈 나폴레옹처럼 결단력 있게 행동하세요",
        "모나리자를 완성한 다빈치처럼 세심하게 작업하세요",
        "베토벤 9번 교향곡을 작곡한 베토벤처럼 끈기 있게 노력하세요",
        "다비드상을 조각한 미켈란젤로처럼 완벽을 추구하세요",
        "햄릿을 저술한 셰익스피어처럼 깊이 있는 사고를 하세요",
        "파우스트를 집필한 괴테처럼 철학적으로 접근하세요",
        "갈리아를 정복한 카이사르처럼 체계적으로 계획하세요"
    ],
    
    // 경계선 케이스 (품질에 따라 결정)
    borderline: [
        "다빈치가 그린 모나리자처럼 신중하게",  // 짧음
        "반 고흐의 해바라기 그림과 같은 열정으로 오늘 하루를 보내보세요", // 적당함
        "나폴레옹이 워털루에서 보여준 전략적 사고력과 탁월한 리더십으로", // 길음
        "베토벤 교향곡 9번 합창을 완성했던 그 불굴의 의지와 음악적 영감으로 오늘의 모든 일들을 성공적으로 마무리하세요" // 너무 길음
    ],
    
    // 문법 문제가 있는 메시지들
    grammar: [
        "다빈치의의 모나리자를를 그렸듯이",
        "반 고흐으로으로 해바라기를 완성하세요",
        "나폴레옹에에 워털루 전투를 지휘했듯이",
        "베토벤하세요하세요 교향곡을 작곡하세요"
    ]
};

// 테스트 실행 함수
function runTests() {
    console.log('📊 테스트 결과 분석:\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let results = {};
    
    for (const [category, messages] of Object.entries(testCases)) {
        console.log(`\n🔍 ${category.toUpperCase()} 메시지 테스트:`);
        console.log('='.repeat(50));
        
        results[category] = [];
        
        messages.forEach((message, index) => {
            totalTests++;
            
            const result = testFilter.validateMessageQuality(message, {
                figureName: '테스트 인물',
                category: 'test'
            });
            
            // 예상 결과와 실제 결과 비교
            let expected = false;
            if (category === 'concrete') expected = true;
            if (category === 'abstract') expected = false;
            // borderline과 grammar는 점수에 따라 결정
            
            const testPassed = (category === 'concrete' && result.passed) ||
                             (category === 'abstract' && !result.passed) ||
                             (category === 'borderline') || // borderline은 별도 분석
                             (category === 'grammar' && !result.passed); // 문법 문제는 차단되어야 함
            
            if (testPassed || category === 'borderline') passedTests++;
            
            console.log(`${index + 1}. "${message}"`);
            console.log(`   결과: ${result.passed ? '✅ PASS' : '❌ BLOCK'} (점수: ${result.score})`);
            console.log(`   이유: ${result.reason || 'N/A'}`);
            
            if (result.improvedMessage) {
                console.log(`   개선: "${result.improvedMessage}"`);
            }
            
            if (result.details) {
                console.log(`   세부: 구체성 ${result.details.concreteScore || 'N/A'}, 추상 ${result.details.abstractCheck?.abstractCount || 0}개, 문법 ${result.details.grammarScore || 'N/A'}`);
            }
            
            console.log('');
            
            results[category].push({
                message: message,
                result: result,
                expected: expected,
                testPassed: testPassed
            });
        });
    }
    
    // 통계 요약
    console.log('\n📈 테스트 통계 요약:');
    console.log('='.repeat(50));
    
    for (const [category, categoryResults] of Object.entries(results)) {
        const categoryTotal = categoryResults.length;
        const categoryPassed = categoryResults.filter(r => r.result.passed).length;
        const categoryBlocked = categoryTotal - categoryPassed;
        
        console.log(`${category.toUpperCase()}:`);
        console.log(`  - 총 ${categoryTotal}개 메시지`);
        console.log(`  - 통과: ${categoryPassed}개 (${((categoryPassed/categoryTotal) * 100).toFixed(1)}%)`);
        console.log(`  - 차단: ${categoryBlocked}개 (${((categoryBlocked/categoryTotal) * 100).toFixed(1)}%)`);
        
        // 평균 점수 계산
        const avgScore = categoryResults.reduce((sum, r) => sum + r.result.score, 0) / categoryTotal;
        console.log(`  - 평균 점수: ${avgScore.toFixed(1)}/100`);
        console.log('');
    }
    
    // 필터 성능 분석
    console.log('🎯 필터 성능 분석:');
    console.log('='.repeat(50));
    
    const abstractResults = results.abstract;
    const concreteResults = results.concrete;
    
    const abstractCorrect = abstractResults.filter(r => !r.result.passed).length; // 추상적 메시지가 올바르게 차단됨
    const concreteCorrect = concreteResults.filter(r => r.result.passed).length;   // 구체적 메시지가 올바르게 통과됨
    
    const precision = concreteCorrect / concreteResults.length; // 구체적 메시지 인식률
    const recall = abstractCorrect / abstractResults.length;    // 추상적 메시지 차단률
    
    console.log(`정밀도 (구체적 메시지 인식률): ${(precision * 100).toFixed(1)}%`);
    console.log(`재현율 (추상적 메시지 차단률): ${(recall * 100).toFixed(1)}%`);
    console.log(`F1 점수: ${(2 * precision * recall / (precision + recall) * 100).toFixed(1)}%`);
    
    // 필터 통계 정보
    console.log('\n🔧 필터 시스템 통계:');
    console.log('='.repeat(50));
    const filterStats = testFilter.getFilterStats();
    console.log('총 검증 메시지:', filterStats.totalChecked);
    console.log('통과 메시지:', filterStats.passed);
    console.log('차단 메시지:', filterStats.blocked);
    console.log('통과율:', filterStats.passRate);
    
    console.log('\n차단 이유별 통계:');
    Object.entries(filterStats.categoryStats).forEach(([reason, count]) => {
        console.log(`- ${reason}: ${count}개`);
    });
    
    return {
        totalTests,
        passedTests,
        results,
        performance: {
            precision: precision * 100,
            recall: recall * 100,
            f1Score: 2 * precision * recall / (precision + recall) * 100
        }
    };
}

// 개선 제안 생성
function generateImprovementSuggestions(testResults) {
    console.log('\n💡 개선 제안사항:');
    console.log('='.repeat(50));
    
    const suggestions = [];
    
    // 구체적 메시지가 차단된 경우
    const incorrectlyBlocked = testResults.results.concrete.filter(r => !r.result.passed);
    if (incorrectlyBlocked.length > 0) {
        suggestions.push(`- 구체적 업적 키워드 확장 필요 (${incorrectlyBlocked.length}개 메시지 오탐지)`);
    }
    
    // 추상적 메시지가 통과된 경우
    const incorrectlyPassed = testResults.results.abstract.filter(r => r.result.passed);
    if (incorrectlyPassed.length > 0) {
        suggestions.push(`- 추상적 표현 감지 로직 강화 필요 (${incorrectlyPassed.length}개 메시지 미탐지)`);
    }
    
    // 성능 기준 제안
    if (testResults.performance.precision < 80) {
        suggestions.push('- 정밀도 향상을 위한 구체적 키워드 데이터베이스 확장');
    }
    
    if (testResults.performance.recall < 80) {
        suggestions.push('- 재현율 향상을 위한 추상적 표현 패턴 추가');
    }
    
    // 점수 임계값 조정 제안
    const borderlineAnalysis = testResults.results.borderline;
    const borderlineScores = borderlineAnalysis.map(r => r.result.score);
    const avgBorderlineScore = borderlineScores.reduce((a, b) => a + b, 0) / borderlineScores.length;
    
    if (avgBorderlineScore < 60) {
        suggestions.push('- 통과 기준 점수를 60점에서 50점으로 하향 조정 고려');
    } else if (avgBorderlineScore > 80) {
        suggestions.push('- 통과 기준 점수를 70점에서 80점으로 상향 조정 고려');
    }
    
    if (suggestions.length === 0) {
        console.log('✅ 현재 필터링 시스템이 예상대로 잘 작동하고 있습니다!');
    } else {
        suggestions.forEach(suggestion => console.log(suggestion));
    }
}

// 메인 테스트 실행
if (require.main === module) {
    const testResults = runTests();
    generateImprovementSuggestions(testResults);
    
    console.log('\n🏁 테스트 완료!');
    console.log(`총 ${testResults.totalTests}개 테스트 중 성공적 동작: ${testResults.passedTests}개`);
    console.log(`전체 성공률: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
}

// 모듈 export (다른 파일에서 사용 가능)
module.exports = {
    testFilter,
    runTests,
    generateImprovementSuggestions
};