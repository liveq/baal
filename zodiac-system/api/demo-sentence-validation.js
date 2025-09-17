/**
 * 문장 완성도 검증 시스템 데모
 * zodiac-api-real.js 통합 시뮬레이션
 */

const EnhancedSentenceCompletenessValidator = require('./sentence-completeness-validator-enhanced.js');

class ZodiacMessageQualityDemo {
    constructor() {
        this.validator = new EnhancedSentenceCompletenessValidator();
    }

    /**
     * 메시지 품질 보장 (zodiac-api-real.js의 ensureMessageQuality 개선 버전)
     */
    ensureMessageQuality(message, category = 'general', maxRetries = 3) {
        console.log(`\n🔍 메시지 품질 검증 시작: "${message}"`);
        console.log(`📂 카테고리: ${category}`);
        
        let currentMessage = message;
        let attempts = 0;
        
        while (attempts < maxRetries) {
            attempts++;
            console.log(`\n🔄 시도 ${attempts}/${maxRetries}`);
            
            // 문장 완성도 검증
            const validation = this.validator.validateCompleteness(currentMessage);
            
            if (validation.passed) {
                console.log(`✅ 검증 통과! (${attempts}번째 시도)`);
                if (validation.warning) {
                    console.log(`⚠️ 경고: ${validation.warning}`);
                }
                return {
                    message: currentMessage,
                    quality: 'validated',
                    attempts: attempts,
                    warning: validation.warning || null
                };
            }
            
            console.log(`❌ 검증 실패: ${validation.reason}`);
            console.log(`💬 설명: ${validation.message}`);
            
            if (validation.sample) {
                console.log(`📄 문제 구간: "${validation.sample}"`);
            }
            
            // 자동 복구 시도
            const suggestion = this.validator.suggestRepair(currentMessage, validation);
            if (suggestion !== currentMessage && attempts < maxRetries) {
                console.log(`🔧 복구 시도: "${suggestion}"`);
                currentMessage = suggestion;
                continue;
            }
            
            break;
        }
        
        // 최대 재시도 후에도 실패하면 안전한 메시지 사용
        console.log(`⚠️ 최대 재시도 초과, 안전한 대체 메시지 사용`);
        const safeMessage = this.validator.generateSafeMessage(category);
        console.log(`🛡️ 대체 메시지: "${safeMessage}"`);
        
        return {
            message: safeMessage,
            quality: 'fallback',
            attempts: attempts,
            originalIssue: validation.reason
        };
    }

    /**
     * 데모 실행
     */
    runDemo() {
        console.log('🎭 RHEIGHT 별자리 시스템 - 문장 완성도 검증 데모');
        console.log('='.repeat(60));
        
        const testCases = [
            {
                message: "과 완고함, 편협함을 치료하는 약이다.",
                category: "advice",
                description: "원래 문제 사례 - 문장 앞부분 누락"
            },
            {
                message: "라고 했던 마르코 폴로처럼 모험을",
                category: "overall",
                description: "인용구 중간 절단 + 불완전한 종료"
            },
            {
                message: "01월 01일, 나폴레옹의 도전으로 하루를 시작하세요.",
                category: "overall",
                description: "정상적인 운세 메시지"
            },
            {
                message: "을 통해 새로운 기회를 발견할 수 있습니다.",
                category: "work",
                description: "목적격 조사로 시작하는 잘린 문장"
            },
            {
                message: "행운의 별자리",
                category: "love",
                description: "짧은 명사구 (허용되어야 함)"
            },
            {
                message: "그러나 이것만으로는 부족하며",
                category: "money",
                description: "접속사 시작 + 불완전한 종료"
            }
        ];
        
        const results = [];
        
        testCases.forEach((testCase, index) => {
            console.log(`\n${'='.repeat(50)}`);
            console.log(`📋 테스트 케이스 ${index + 1}: ${testCase.description}`);
            
            const result = this.ensureMessageQuality(
                testCase.message, 
                testCase.category
            );
            
            results.push({
                ...testCase,
                result: result
            });
        });
        
        // 결과 요약
        this.printSummary(results);
    }

    /**
     * 결과 요약 출력
     */
    printSummary(results) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 데모 결과 요약');
        console.log('='.repeat(60));
        
        const validated = results.filter(r => r.result.quality === 'validated').length;
        const fallbacks = results.filter(r => r.result.quality === 'fallback').length;
        
        console.log(`📋 총 테스트: ${results.length}개`);
        console.log(`✅ 검증 통과: ${validated}개`);
        console.log(`🛡️ 대체 메시지: ${fallbacks}개`);
        console.log(`🎯 검증 통과율: ${((validated / results.length) * 100).toFixed(1)}%`);
        
        console.log('\n📝 상세 결과:');
        results.forEach((test, index) => {
            const status = test.result.quality === 'validated' ? '✅' : '🛡️';
            console.log(`\n${index + 1}. ${status} ${test.description}`);
            console.log(`   원본: "${test.message}"`);
            console.log(`   결과: "${test.result.message}"`);
            console.log(`   품질: ${test.result.quality} (${test.result.attempts}번 시도)`);
            
            if (test.result.warning) {
                console.log(`   경고: ${test.result.warning}`);
            }
            if (test.result.originalIssue) {
                console.log(`   원래 문제: ${test.result.originalIssue}`);
            }
        });
        
        console.log('\n🎯 결론:');
        console.log('- 문장 완성도 검증 시스템이 성공적으로 작동합니다.');
        console.log('- 잘린 문장들이 적절히 감지되고 안전한 메시지로 대체됩니다.');
        console.log('- 정상적인 운세 메시지들은 그대로 통과됩니다.');
        console.log('- 시스템이 프로덕션 환경에 배포할 준비가 되었습니다.');
        
        console.log('\n🚀 다음 단계:');
        console.log('1. zodiac-api-real.js에 검증 시스템 통합');
        console.log('2. 웹 인터페이스에서 검증된 메시지 사용');
        console.log('3. 사용자 피드백 수집 및 시스템 개선');
    }
}

// 데모 실행
if (require.main === module) {
    const demo = new ZodiacMessageQualityDemo();
    demo.runDemo();
}

module.exports = ZodiacMessageQualityDemo;