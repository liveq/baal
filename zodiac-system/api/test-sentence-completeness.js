/**
 * 문장 완성도 검증 시스템 테스트 스크립트
 * Node.js 환경에서 실행
 */

const SentenceCompletenessValidator = require('./sentence-completeness-validator.js');

class SentenceCompletenessTest {
    constructor() {
        this.validator = new SentenceCompletenessValidator();
        this.testResults = [];
    }

    /**
     * 테스트 케이스 실행
     */
    runTest(testName, message, expectedResult) {
        console.log(`\n🧪 테스트: ${testName}`);
        console.log(`📝 입력 메시지: "${message}"`);
        
        const result = this.validator.validateCompleteness(message);
        const passed = result.passed === expectedResult;
        
        console.log(`✅ 예상 결과: ${expectedResult ? '통과' : '실패'}`);
        console.log(`📊 실제 결과: ${result.passed ? '통과' : '실패'}`);
        
        if (!result.passed) {
            console.log(`🚫 실패 이유: ${result.reason}`);
            console.log(`💡 메시지: ${result.message}`);
            if (result.sample) {
                console.log(`📄 샘플: "${result.sample}"`);
            }
            
            // 복구 제안 테스트
            const suggestion = this.validator.suggestRepair(message, result);
            console.log(`🔧 복구 제안: "${suggestion}"`);
        }
        
        console.log(`🎯 테스트 ${passed ? '성공' : '실패'}`);
        
        this.testResults.push({
            testName,
            message,
            expectedResult,
            actualResult: result.passed,
            passed,
            details: result
        });
        
        return passed;
    }

    /**
     * 모든 테스트 실행
     */
    runAllTests() {
        console.log('🚀 문장 완성도 검증 시스템 테스트 시작\n');
        
        // 1. 정상적인 문장들 (통과해야 함)
        this.runTest('정상적인 한국어 문장', '오늘은 좋은 하루입니다.', true);
        this.runTest('정상적인 영어 문장', 'Today is a good day.', true);
        this.runTest('감탄문', '정말 놀라운 일이네요!', true);
        this.runTest('의문문', '오늘 날씨가 어떤가요?', true);
        this.runTest('비유 표현', '나폴레옹처럼 용감하게 행동하세요.', true);
        this.runTest('짧은 표현', '행운이 함께합니다.', true);
        
        // 2. 잘린 문장들 (실패해야 함)
        this.runTest('조사로 시작하는 잘린 문장', '과 완고함을 치료하는 약입니다.', false);
        this.runTest('소문자로 시작하는 영어', 'and this is incomplete sentence.', false);
        this.runTest('인용 중간 절단', '라고 했던 마르코 폴로처럼', false);
        this.runTest('접속사로 시작', '그러나 이것은 중간에서 시작된 문장입니다.', false);
        
        // 3. 종료 문제 (실패해야 함)
        this.runTest('부적절한 종료', '오늘은 좋은 하루', false);
        this.runTest('쉼표로 끝남', '이것은 불완전한 문장,', false);
        
        // 4. 인용구 문제 (실패해야 함)
        this.runTest('짝 맞지 않는 따옴표', '"이것은 불완전한 인용구입니다', false);
        this.runTest('정상적인 인용구', '"이것은 완전한 인용구입니다."', true);
        
        // 5. 문법적 불완전 (실패해야 함)
        this.runTest('명사만 나열', '사과 바나나 오렌지 포도', false);
        this.runTest('정상적인 명사구 (짧음)', '행운의 별자리', true);
        
        // 6. 특수 케이스
        this.runTest('빈 문자열', '', false);
        this.runTest('공백만', '   ', false);
        this.runTest('생략부호로 끝남', '이것은 미완성...', false);
        
        this.printSummary();
    }

    /**
     * 테스트 결과 요약 출력
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 테스트 결과 요약');
        console.log('='.repeat(60));
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`📋 총 테스트: ${totalTests}개`);
        console.log(`✅ 성공: ${passedTests}개`);
        console.log(`❌ 실패: ${failedTests}개`);
        console.log(`🎯 성공률: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (failedTests > 0) {
            console.log('\n❌ 실패한 테스트들:');
            this.testResults
                .filter(test => !test.passed)
                .forEach(test => {
                    console.log(`  - ${test.testName}: "${test.message}"`);
                    console.log(`    예상: ${test.expectedResult ? '통과' : '실패'}, 실제: ${test.actualResult ? '통과' : '실패'}`);
                });
        }
        
        console.log('\n🏁 테스트 완료');
    }

    /**
     * 실제 운세 데이터 샘플 테스트
     */
    testRealFortuneData() {
        console.log('\n🌟 실제 운세 데이터 샘플 테스트');
        console.log('-'.repeat(40));
        
        const fortuneSamples = [
            "01월 01일, 나폴레옹의 도전으로 하루를 시작하세요.",
            "양자리의 매력이 빛나는 날입니다.",
            "반 고흐처럼 도전을 실천하세요.",
            "경제적 안정의 시기입니다.",
            "건강한 리듬을 유지하세요."
        ];
        
        fortuneSamples.forEach((sample, index) => {
            this.runTest(`운세 샘플 ${index + 1}`, sample, true);
        });
    }
}

// 테스트 실행
if (require.main === module) {
    const tester = new SentenceCompletenessTest();
    tester.runAllTests();
    tester.testRealFortuneData();
}

module.exports = SentenceCompletenessTest;