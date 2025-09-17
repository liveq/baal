/**
 * 문장 완성도 검증 모듈 (개선 버전)
 * 테스트 결과를 반영한 더 정교한 잘린 문장 감지 시스템
 */

class EnhancedSentenceCompletenessValidator {
    constructor() {
        // 문장 시작 조사 패턴 (더 엄격한 검증)
        this.criticalStartParticles = /^(과|를|이|가|의|에|로)\s/;
        this.softStartParticles = /^(와|을|에서|으로|도|만|부터|까지|처럼|같이)\s/;
        
        // 적절한 한국어 문장 종료 패턴
        this.koreanEndings = ['다', '요', '니다', '습니다', '세요', '죠', '네', '까', '야', '아', '어'];
        this.punctuationEndings = ['.', '!', '?', '~', '…'];
        
        // 의심스러운 시작 패턴들 (더 정교하게)
        this.suspiciousStartPatterns = [
            /^라고\s+(했던|말했던|한\s+)/,  // 인용 중간 절단 (가장 중요)
            /^(완고함|편협함|고집|아집|독선).*치료/,  // 특정 문제 사례 패턴
        ];
        
        // 접속사 시작 패턴 (별도 처리 - 완전한 문장이면 허용)
        this.conjunctionStartPatterns = /^(그러나|하지만|그런데|따라서|그래서|즉|또한|더불어|한편)/;
        
        // 불완전한 문장 패턴들
        this.incompletePatterns = [
            /\.\.\.\s*$/,  // 생략 부호로 끝남
            /[,;]\s*$/,    // 쉼표나 세미콜론으로 끝남
        ];
        
        // 안전한 시작 패턴들 (예외 처리)
        this.safeStartPatterns = [
            /^(오늘|내일|어제|이번|다음|지난)/,  // 시간 표현
            /^[A-Z가-힣][가-힣]*[은는이가]?\s/,  // 일반적인 주어
            /^(만약|혹시|아마|분명|확실히)/,  // 부사
            /^[0-9]+월\s+[0-9]+일/,  // 날짜 표현
            /^[가-힣]+의\s+[가-힣]+/,  // "나폴레옹의 도전" 같은 소유격 표현
        ];

        // 허용되는 짧은 명사구 패턴
        this.shortPhrasePatterns = [
            /^[가-힣]+의\s+[가-힣]+$/,  // "행운의 별자리"
            /^[가-힣]+\s+[가-힣]+$/,   // "좋은 하루"
            /^[가-힣]+한\s+[가-힣]+$/,   // "건강한 생활"
        ];
    }

    /**
     * 메인 문장 완성도 검증 메서드 (개선됨)
     */
    validateCompleteness(message) {
        if (!message || typeof message !== 'string') {
            return { passed: false, reason: 'invalid-input', message: '입력이 유효하지 않습니다.' };
        }

        const trimmedMessage = message.trim();
        
        // 1. 빈 문자열 검사
        if (trimmedMessage.length === 0) {
            return { passed: false, reason: 'empty-message', message: '빈 메시지입니다.' };
        }

        // 2. 문장 시작 검증 (개선됨)
        const startCheck = this.validateStartEnhanced(trimmedMessage);
        if (!startCheck.passed) return startCheck;

        // 3. 문장 종료 검증 (개선됨)
        const endCheck = this.validateEndEnhanced(trimmedMessage);
        if (!endCheck.passed) return endCheck;

        // 4. 인용구 완성도 검증
        const quoteCheck = this.validateQuotes(trimmedMessage);
        if (!quoteCheck.passed) return quoteCheck;

        // 5. 특수 패턴 검증
        const patternCheck = this.validatePatterns(trimmedMessage);
        if (!patternCheck.passed) return patternCheck;

        // 6. 문법적 완성도 검증 (관대하게 개선)
        const grammarCheck = this.validateGrammarEnhanced(trimmedMessage);
        if (!grammarCheck.passed) return grammarCheck;

        return { passed: true, message: '문장 완성도 검증 통과' };
    }

    /**
     * 개선된 문장 시작 검증
     */
    validateStartEnhanced(message) {
        // 안전한 시작 패턴인지 먼저 확인
        for (const safePattern of this.safeStartPatterns) {
            if (safePattern.test(message)) {
                return { passed: true };
            }
        }
        
        // 치명적인 조사로 시작하는 경우 (거의 확실히 잘린 문장)
        if (this.criticalStartParticles.test(message)) {
            return {
                passed: false,
                reason: 'critical-start-particle',
                message: '조사로 시작하는 확실한 잘린 문장이 감지되었습니다.',
                sample: message.substring(0, 50)
            };
        }
        
        // 부드러운 조사 - 문장이 완성되어 있으면 경고만
        if (this.softStartParticles.test(message)) {
            const hasProperEnd = this.hasProperEnding(message);
            if (!hasProperEnd) {
                return {
                    passed: false,
                    reason: 'soft-start-particle',
                    message: '조사로 시작하는 잠재적 잘린 문장이 감지되었습니다.',
                    sample: message.substring(0, 50)
                };
            }
            // 완성된 문장이지만 의심스러움을 로그로 남김
            console.log('⚠️ 조사로 시작하지만 완성된 문장:', message.substring(0, 30) + '...');
        }
        
        // 가장 의심스러운 패턴들 (인용 중간 절단 등)
        for (const pattern of this.suspiciousStartPatterns) {
            if (pattern.test(message)) {
                return {
                    passed: false,
                    reason: 'highly-suspicious-pattern',
                    message: '인용구 중간 절단 등 매우 의심스러운 패턴이 감지되었습니다.',
                    pattern: pattern.toString(),
                    sample: message.substring(0, 50)
                };
            }
        }
        
        // 접속사로 시작 - 완성된 문장이면 허용하되 의심으로 표시
        if (this.conjunctionStartPatterns.test(message)) {
            const hasProperEnd = this.hasProperEnding(message);
            if (hasProperEnd) {
                console.log('⚠️ 접속사로 시작하는 의심스러운 문장 (허용):', message.substring(0, 30) + '...');
                return { passed: true, warning: 'conjunction-start' };
            } else {
                return {
                    passed: false,
                    reason: 'conjunction-incomplete',
                    message: '접속사로 시작하는 불완전한 문장입니다.',
                    sample: message.substring(0, 50)
                };
            }
        }
        
        return { passed: true };
    }

    /**
     * 개선된 문장 종료 검증
     */
    validateEndEnhanced(message) {
        // 짧은 명사구는 관대하게 처리
        if (message.length <= 20) {
            for (const phrasePattern of this.shortPhrasePatterns) {
                if (phrasePattern.test(message)) {
                    console.log('✅ 허용되는 짧은 명사구:', message);
                    return { passed: true, type: 'short-phrase' };
                }
            }
        }
        
        // 일반적인 종료 검증
        if (this.hasProperEnding(message)) {
            return { passed: true };
        }
        
        // 인용구 안의 내용은 관대하게 처리
        if (message.startsWith('"') && message.endsWith('"')) {
            return { passed: true, type: 'quoted-content' };
        }
        
        // 부적절한 종료
        return {
            passed: false,
            reason: 'incomplete-ending',
            message: '문장이 적절하게 종료되지 않았습니다.',
            sample: message.substring(Math.max(0, message.length - 50))
        };
    }

    /**
     * 적절한 문장 종료 확인 (헬퍼 메서드)
     */
    hasProperEnding(message) {
        const lastChar = message.charAt(message.length - 1);
        
        // 문장 부호로 끝나는 경우
        if (this.punctuationEndings.includes(lastChar)) {
            return true;
        }
        
        // 한국어 어미로 끝나는 경우
        for (const ending of this.koreanEndings) {
            if (message.endsWith(ending)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 인용구 완성도 검증 (기존과 동일)
     */
    validateQuotes(message) {
        // 따옴표 개수 검사
        const doubleQuotes = (message.match(/"/g) || []).length;
        
        if (doubleQuotes % 2 !== 0) {
            return {
                passed: false,
                reason: 'incomplete-double-quotes',
                message: '쌍따옴표가 짝을 이루지 않습니다.',
                quoteCount: doubleQuotes
            };
        }
        
        return { passed: true };
    }

    /**
     * 특수 패턴 검증 (기존과 동일)
     */
    validatePatterns(message) {
        // 불완전한 패턴 검사
        for (const pattern of this.incompletePatterns) {
            if (pattern.test(message)) {
                return {
                    passed: false,
                    reason: 'incomplete-pattern',
                    message: '불완전한 문장 패턴이 감지되었습니다.',
                    pattern: pattern.toString(),
                    sample: message.substring(0, 50)
                };
            }
        }
        
        return { passed: true };
    }

    /**
     * 개선된 문법적 완성도 검증 (더 관대함)
     */
    validateGrammarEnhanced(message) {
        // 한국어 문장 구조 검증 (서술어 존재)
        const hasKoreanPredicate = /[가-힣]+(다|요|니다|습니다|세요|죠|네|까|야)(\.|!|\?|~|$)/.test(message);
        
        // 영어 문장 구조 검증
        const hasEnglishStructure = /^[A-Z][^.!?]*[.!?]/.test(message);
        
        // 명사구나 단순 표현도 허용 (더 관대하게)
        const isShortExpression = message.length <= 40;  // 30 → 40으로 증가
        
        // 비유적 표현 허용 ("처럼", "같이" 등)
        const hasMetaphor = /처럼|같이|같은|듯한|의\s*[가-힣]+/.test(message);
        
        // 날짜/시간 표현
        const isTimeExpression = /^[0-9]+월\s+[0-9]+일/.test(message);
        
        // 소유격 표현 ("나폴레옹의 도전", "반 고흐의 열정" 등)
        const isPossessiveExpression = /^[가-힣\s]+의\s+[가-힣]+/.test(message);
        
        if (!hasKoreanPredicate && !hasEnglishStructure && 
            !isShortExpression && !hasMetaphor && 
            !isTimeExpression && !isPossessiveExpression) {
            // 영어로만 된 문장이 소문자로 시작하는 경우만 체크
            if (/^[a-z]/.test(message) && message.length > 20) {
                return {
                    passed: false,
                    reason: 'grammatically-incomplete',
                    message: '문법적으로 불완전한 문장입니다.',
                    sample: message.substring(0, 50)
                };
            }
        }
        
        return { passed: true };
    }

    /**
     * 잘린 문장 복구 제안 (개선됨)
     */
    suggestRepair(message, validationResult) {
        if (!validationResult || validationResult.passed) {
            return message;
        }

        switch (validationResult.reason) {
            case 'critical-start-particle':
            case 'soft-start-particle':
                return `오늘은 ${message}`;
            
            case 'highly-suspicious-pattern':
                if (validationResult.pattern && validationResult.pattern.includes('라고')) {
                    return `"${message}"라고 했습니다.`;
                }
                return `오늘은 ${message}`;
            
            case 'incomplete-ending':
                return `${message}.`;
            
            case 'incomplete-double-quotes':
                return `${message}"`;
            
            case 'grammatically-incomplete':
                return `${message}입니다.`;
            
            default:
                return message;
        }
    }

    /**
     * 문장 완성도 검증 결과 상세 보고서
     */
    generateReport(message, validationResult) {
        const report = {
            message: message,
            length: message.length,
            passed: validationResult.passed,
            timestamp: new Date().toISOString()
        };

        if (!validationResult.passed) {
            report.issues = {
                reason: validationResult.reason,
                description: validationResult.message,
                sample: validationResult.sample,
                suggestion: this.suggestRepair(message, validationResult)
            };
        }

        if (validationResult.warning) {
            report.warnings = [validationResult.warning];
        }

        return report;
    }

    /**
     * 안전한 대체 메시지 생성 (카테고리별)
     */
    generateSafeMessage(category = 'general') {
        const safeMessages = {
            general: "긍정적인 에너지가 함께합니다.",
            overall: "오늘은 특별한 의미가 있는 하루입니다.",
            love: "사랑과 행복이 가득한 하루입니다.",
            money: "재정적 안정과 성장이 있을 것입니다.",
            work: "업무에서 좋은 성과를 거둘 것입니다.",
            health: "건강하고 활기찬 하루를 보내세요.",
            advice: "긍정적인 마음으로 하루를 시작하세요."
        };
        
        return safeMessages[category] || safeMessages.general;
    }
}

// 모듈 내보내기 (Node.js 환경용)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedSentenceCompletenessValidator;
}

// 브라우저 환경용 전역 변수
if (typeof window !== 'undefined') {
    window.EnhancedSentenceCompletenessValidator = EnhancedSentenceCompletenessValidator;
}