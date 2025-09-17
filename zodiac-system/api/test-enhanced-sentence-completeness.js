/**
 * 개선된 문장 완성도 검증 시스템 테스트 스크립트
 */

const EnhancedSentenceCompletenessValidator = require('./sentence-completeness-validator-enhanced.js');

class EnhancedSentenceCompletenessTest {
    constructor() {
        this.validator = new EnhancedSentenceCompletenessValidator();
        this.testResults = [];
    }

    /**
     * 테스트 케이스 실행 (개선됨)
     */
    runTest(testName, message, expectedResult, description = '') {
        console.log(`\n🧪 테스트: ${testName}`);
        if (description) console.log(`📖 설명: ${description}`);
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
        
        if (result.warning) {
            console.log(`⚠️ 경고: ${result.warning}`);
        }
        
        console.log(`🎯 테스트 ${passed ? '성공' : '실패'}`);
        
        this.testResults.push({
            testName,
            message,
            expectedResult,
            actualResult: result.passed,
            passed,
            details: result,
            description
        });
        
        return passed;
    }

    /**
     * 모든 테스트 실행 (개선된 케이스들)
     */
    runAllTests() {
        console.log('🚀 개선된 문장 완성도 검증 시스템 테스트 시작\n');
        
        // 1. 정상적인 문장들 (통과해야 함)
        console.log('📋 카테고리 1: 정상적인 문장들');
        this.runTest('정상적인 한국어 문장', '오늘은 좋은 하루입니다.', true);
        this.runTest('정상적인 영어 문장', 'Today is a good day.', true);
        this.runTest('감탄문', '정말 놀라운 일이네요!', true);
        this.runTest('의문문', '오늘 날씨가 어떤가요?', true);
        this.runTest('비유 표현', '나폴레옹처럼 용감하게 행동하세요.', true);
        this.runTest('짧은 표현', '행운이 함께합니다.', true);
        this.runTest('날짜 표현', '01월 01일, 나폴레옹의 도전으로 하루를 시작하세요.', true);
        
        // 2. 허용해야 하는 짧은 명사구들
        console.log('\n📋 카테고리 2: 허용되는 짧은 명사구들');
        this.runTest('행운의 별자리', '행운의 별자리', true, '짧은 소유격 표현');
        this.runTest('건강한 생활', '건강한 생활', true, '짧은 수식 표현');
        this.runTest('좋은 하루', '좋은 하루', true, '일반적인 인사 표현');
        
        // 3. 의심스럽지만 허용해야 하는 경우들
        console.log('\n📋 카테고리 3: 의심스럽지만 허용되는 문장들');
        this.runTest('접속사 시작 완전 문장', '그러나 이것은 완전한 문장입니다.', true, 
            '접속사로 시작하지만 완전한 문장');
        this.runTest('조사 시작 완전 문장', '과 완고함을 치료하는 약입니다.', true, 
            '조사로 시작하지만 완전한 문장 (실제로는 의심스러움)');
        this.runTest('정상적인 인용구', '"이것은 완전한 인용구입니다."', true, 
            '완전한 인용구');
        
        // 4. 확실히 실패해야 하는 잘린 문장들
        console.log('\n📋 카테고리 4: 확실히 잘린 문장들');
        this.runTest('치명적 조사 시작', '과 함께 걸어가세요', false, 
            '조사로 시작하고 불완전한 종료');
        this.runTest('인용 중간 절단', '라고 했던 마르코 폴로처럼', false, 
            '인용구 중간에서 시작');
        this.runTest('소문자 영어 시작', 'and this is incomplete sentence.', false, 
            '소문자로 시작하는 영어 (문법적으로도 불완전)');
        this.runTest('접속사 불완전', '그러나 이것은 불완전', false, 
            '접속사로 시작하지만 불완전한 종료');
        
        // 5. 종료 문제들
        console.log('\n📋 카테고리 5: 종료 문제들');
        this.runTest('부적절한 종료', '오늘은 정말 좋은 하루', false);
        this.runTest('쉼표로 끝남', '이것은 불완전한 문장,', false);
        this.runTest('생략부호로 끝남', '이것은 미완성...', false);
        
        // 6. 인용구 문제들
        console.log('\n📋 카테고리 6: 인용구 문제들');
        this.runTest('짝 맞지 않는 따옴표', '"이것은 불완전한 인용구입니다', false);
        
        // 7. 특수 케이스들
        console.log('\n📋 카테고리 7: 특수 케이스들');
        this.runTest('빈 문자열', '', false);
        this.runTest('공백만', '   ', false);
        
        this.printSummary();
    }

    /**
     * 실제 운세 데이터 테스트 (확장됨)
     */
    testRealFortuneData() {
        console.log('\n🌟 실제 운세 데이터 샘플 테스트 (확장)');
        console.log('-'.repeat(50));
        
        const fortuneSamples = [
            "01월 01일, 나폴레옹의 도전으로 하루를 시작하세요.",
            "양자리의 매력이 빛나는 날입니다.",
            "반 고흐처럼 도전을 실천하세요.",
            "경제적 안정의 시기입니다.",
            "건강한 리듬을 유지하세요.",
            "셰익스피어처럼 안정을 실천하세요.",
            "케네디의 소통으로 하루를 시작하세요.",
            "석가모니의 인내으로 하루를 시작하세요."
        ];
        
        fortuneSamples.forEach((sample, index) => {
            this.runTest(`운세 샘플 ${index + 1}`, sample, true, '실제 시스템에서 사용되는 운세 메시지');
        });
    }

    /**
     * 문제 사례 시뮬레이션 테스트
     */
    testProblemCases() {
        console.log('\n🚨 문제 사례 시뮬레이션 테스트');
        console.log('-'.repeat(50));
        
        const problemCases = [
            {
                message: "과 완고함, 편협함을 치료하는 약이다.",
                description: "원래 문제 사례 - 문장 앞부분 누락"
            },
            {
                message: "라고 했던 마르코 폴로처럼 모험을",
                description: "인용구 중간 절단 + 불완전한 종료"
            },
            {
                message: "그러나 이것만으로는 부족하며",
                description: "접속사 시작 + 불완전한 종료"
            },
            {
                message: "을 통해 새로운 기회를 발견할 수 있습니다.",
                description: "목적격 조사로 시작하는 전형적인 잘린 문장"
            }
        ];
        
        problemCases.forEach((testCase, index) => {
            this.runTest(`문제 사례 ${index + 1}`, testCase.message, false, testCase.description);
        });
    }

    /**
     * 테스트 결과 요약 출력 (개선됨)
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 개선된 테스트 결과 요약');
        console.log('='.repeat(60));
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`📋 총 테스트: ${totalTests}개`);
        console.log(`✅ 성공: ${passedTests}개`);
        console.log(`❌ 실패: ${failedTests}개`);
        console.log(`🎯 성공률: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        // 카테고리별 분석
        const categoryAnalysis = {};
        this.testResults.forEach(test => {
            if (test.expectedResult === true && test.actualResult === true) {
                categoryAnalysis['정상 문장 정확 인식'] = (categoryAnalysis['정상 문장 정확 인식'] || 0) + 1;
            } else if (test.expectedResult === false && test.actualResult === false) {
                categoryAnalysis['잘린 문장 정확 감지'] = (categoryAnalysis['잘린 문장 정확 감지'] || 0) + 1;
            } else if (test.expectedResult === true && test.actualResult === false) {
                categoryAnalysis['오탐 (정상→잘림)'] = (categoryAnalysis['오탐 (정상→잘림)'] || 0) + 1;
            } else if (test.expectedResult === false && test.actualResult === true) {
                categoryAnalysis['놓침 (잘림→정상)'] = (categoryAnalysis['놓침 (잘림→정상)'] || 0) + 1;
            }
        });
        
        console.log('\n📈 성능 분석:');
        Object.entries(categoryAnalysis).forEach(([category, count]) => {
            console.log(`  - ${category}: ${count}개`);
        });
        
        if (failedTests > 0) {
            console.log('\n❌ 실패한 테스트들:');
            this.testResults
                .filter(test => !test.passed)
                .forEach(test => {
                    const errorType = test.expectedResult === true ? '오탐' : '놓침';
                    console.log(`  - [${errorType}] ${test.testName}`);
                    console.log(`    메시지: "${test.message}"`);
                    console.log(`    예상: ${test.expectedResult ? '통과' : '실패'}, 실제: ${test.actualResult ? '통과' : '실패'}`);
                    if (test.description) console.log(`    설명: ${test.description}`);
                });
        }
        
        console.log('\n🏁 테스트 완료');
        
        // 성능 평가
        const accuracy = (passedTests / totalTests) * 100;
        if (accuracy >= 95) {
            console.log('🌟 탁월한 성능! (95% 이상)');
        } else if (accuracy >= 90) {
            console.log('✨ 우수한 성능! (90% 이상)');
        } else if (accuracy >= 80) {
            console.log('👍 양호한 성능 (80% 이상)');
        } else {
            console.log('⚠️ 개선이 필요함 (80% 미만)');
        }
    }
}

// 테스트 실행
if (require.main === module) {
    const tester = new EnhancedSentenceCompletenessTest();
    tester.runAllTests();
    tester.testRealFortuneData();
    tester.testProblemCases();
}

module.exports = EnhancedSentenceCompletenessTest;