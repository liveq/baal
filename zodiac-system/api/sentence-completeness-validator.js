/**
 * 문장 완성도 검증 모듈
 * 잘린 문장, 불완전한 인용구, 문법적 오류 감지 시스템
 */

class SentenceCompletenessValidator {
    constructor() {
        // 문장 시작 조사 패턴
        this.startParticlePatterns = /^(과|와|을|를|이|가|의|에|에서|로|으로|도|만|부터|까지|처럼|같이)/;
        
        // 적절한 한국어 문장 종료 패턴
        this.koreanEndings = ['다', '요', '니다', '습니다', '세요', '죠', '네', '까', '야', '아', '어'];
        this.punctuationEndings = ['.', '!', '?', '~', '…'];
        
        // 의심스러운 시작 패턴들
        this.suspiciousStartPatterns = [
            /^(그러나|하지만|그런데|따라서|그래서|즉|또한|더불어|한편)/,  // 접속사로 시작
            /^(완고함|편협함|고집|아집|독선).*치료/,  // 특정 문제 사례 패턴
            /^라고\s+(했던|말했던|한\s+)/,  // 인용 중간 절단
            /^(을|를|이|가|의|에|로|와|과)\s/,  // 조사만으로 시작
            /^(며|고|서|니|면|자|든|지)\s/,  // 어미로 시작
        ];
        
        // 불완전한 문장 패턴들
        this.incompletePatterns = [
            /\.\.\.\s*$/,  // 생략 부호로 끝남
            /^[a-z]/,      // 소문자로 시작 (영어)
            /[,;]\s*$/,    // 쉼표나 세미콜론으로 끝남
        ];
        
        // 안전한 시작 패턴들 (예외 처리)
        this.safeStartPatterns = [
            /^(오늘|내일|어제|이번|다음|지난)/,  // 시간 표현
            /^[A-Z가-힣][가-힣]*[은는이가]?\s/,  // 일반적인 주어
            /^(만약|혹시|아마|분명|확실히)/,  // 부사
        ];
    }

    /**
     * 메인 문장 완성도 검증 메서드
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

        // 2. 문장 시작 검증
        const startCheck = this.validateStart(trimmedMessage);
        if (!startCheck.passed) return startCheck;

        // 3. 문장 종료 검증
        const endCheck = this.validateEnd(trimmedMessage);
        if (!endCheck.passed) return endCheck;

        // 4. 인용구 완성도 검증
        const quoteCheck = this.validateQuotes(trimmedMessage);
        if (!quoteCheck.passed) return quoteCheck;

        // 5. 문법적 완성도 검증
        const grammarCheck = this.validateGrammar(trimmedMessage);
        if (!grammarCheck.passed) return grammarCheck;

        // 6. 특수 패턴 검증
        const patternCheck = this.validatePatterns(trimmedMessage);
        if (!patternCheck.passed) return patternCheck;

        return { passed: true, message: '문장 완성도 검증 통과' };
    }

    /**
     * 문장 시작 검증
     */
    validateStart(message) {
        const firstChar = message.charAt(0);
        
        // 안전한 시작 패턴인지 먼저 확인
        for (const safePattern of this.safeStartPatterns) {
            if (safePattern.test(message)) {
                return { passed: true };
            }
        }
        
        // 조사로 시작하는 경우
        if (this.startParticlePatterns.test(message)) {
            return {
                passed: false,
                reason: 'incomplete-start-particle',
                message: '조사로 시작하는 잘린 문장이 감지되었습니다.',
                sample: message.substring(0, 50)
            };
        }
        
        // 소문자로 시작하는 영어 (접속사 제외)
        if (/^[a-z]/.test(firstChar) && !/^(and|but|or|so|yet|the|a|an)/.test(message.toLowerCase())) {
            return {
                passed: false,
                reason: 'incomplete-start-lowercase',
                message: '소문자로 시작하는 잘린 문장이 감지되었습니다.',
                sample: message.substring(0, 50)
            };
        }
        
        // 의심스러운 시작 패턴 검사
        for (const pattern of this.suspiciousStartPatterns) {
            if (pattern.test(message)) {
                return {
                    passed: false,
                    reason: 'suspicious-start-pattern',
                    message: '문장 중간에서 시작하는 패턴이 감지되었습니다.',
                    pattern: pattern.toString(),
                    sample: message.substring(0, 50)
                };
            }
        }
        
        return { passed: true };
    }

    /**
     * 문장 종료 검증
     */
    validateEnd(message) {
        const lastChar = message.charAt(message.length - 1);
        
        // 문장 부호로 끝나는 경우
        if (this.punctuationEndings.includes(lastChar)) {
            return { passed: true };
        }
        
        // 한국어 어미로 끝나는 경우
        for (const ending of this.koreanEndings) {
            if (message.endsWith(ending)) {
                return { passed: true };
            }
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
     * 인용구 완성도 검증
     */
    validateQuotes(message) {
        // 따옴표 개수 검사
        const doubleQuotes = (message.match(/"/g) || []).length;
        const singleQuotes = (message.match(/'/g) || []).length;
        
        if (doubleQuotes % 2 !== 0) {
            return {
                passed: false,
                reason: 'incomplete-double-quotes',
                message: '쌍따옴표가 짝을 이루지 않습니다.',
                quoteCount: doubleQuotes
            };
        }
        
        if (singleQuotes % 2 !== 0 && singleQuotes > 2) { // 작은따옴표는 2개 이상일 때만 검사
            return {
                passed: false,
                reason: 'incomplete-single-quotes',
                message: '작은따옴표가 짝을 이루지 않습니다.',
                quoteCount: singleQuotes
            };
        }
        
        return { passed: true };
    }

    /**
     * 문법적 완성도 검증
     */
    validateGrammar(message) {
        // 한국어 문장 구조 검증 (서술어 존재)
        const hasKoreanPredicate = /[가-힣]+(다|요|니다|습니다|세요|죠|네|까|야)(\.|!|\?|~|$)/.test(message);
        
        // 영어 문장 구조 검증
        const hasEnglishStructure = /[A-Z][^.!?]*[.!?]/.test(message);
        
        // 명사구나 단순 표현도 허용 (짧은 경우)
        const isShortExpression = message.length <= 30;
        
        // 비유적 표현 허용 ("처럼", "같이" 등)
        const hasMetaphor = /처럼|같이|같은|듯한|의\s*[가-힣]+/.test(message);
        
        if (!hasKoreanPredicate && !hasEnglishStructure && !isShortExpression && !hasMetaphor) {
            return {
                passed: false,
                reason: 'grammatically-incomplete',
                message: '문법적으로 불완전한 문장입니다.',
                sample: message.substring(0, 50)
            };
        }
        
        return { passed: true };
    }

    /**
     * 특수 패턴 검증
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
     * 잘린 문장 복구 제안
     */
    suggestRepair(message, validationResult) {
        if (!validationResult || validationResult.passed) {
            return message;
        }

        switch (validationResult.reason) {
            case 'incomplete-start-particle':
                return `오늘은 ${message}`;
            
            case 'incomplete-start-lowercase':
                return message.charAt(0).toUpperCase() + message.slice(1);
            
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
     * 안전한 대체 메시지 생성
     */
    generateSafeMessage(category = 'general') {
        const safeMessages = {
            general: "긍정적인 에너지가 함께합니다.",
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
    module.exports = SentenceCompletenessValidator;
}

// 브라우저 환경용 전역 변수
if (typeof window !== 'undefined') {
    window.SentenceCompletenessValidator = SentenceCompletenessValidator;
}