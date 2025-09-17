/**
 * 별자리 운세 API - 양자리 구체적 조언 적용 버전
 * JSON 파일에서 실제 운세 데이터와 역사적 인물 데이터를 로드하여 제공
 * 관리감독 에이전트 제약사항 준수: 클래스명/핵심 메서드 시그니처 유지, fortune-data.json 경로 유지
 * 메시지 품질 검증 및 필터링 시스템 포함
 * 양자리(ID: 1)만 구체적 업적 기반 메시지 적용
 */

class ZodiacAPIReal {
    constructor() {
        this.fortuneData = null;
        this.historicalFigures = null;
        this.messageFilter = null;
        this.loadFortuneData();
        this.loadHistoricalFigures();
        this.initMessageFilter();
        
        // 별자리 정보 배열 (기존과 동일)
        this.zodiacSigns = [
            { id: 1, name: '양자리', symbol: '♈', start: '3.21', end: '4.19' },
            { id: 2, name: '황소자리', symbol: '♉', start: '4.20', end: '5.20' },
            { id: 3, name: '쌍둥이자리', symbol: '♊', start: '5.21', end: '6.20' },
            { id: 4, name: '게자리', symbol: '♋', start: '6.21', end: '7.22' },
            { id: 5, name: '사자자리', symbol: '♌', start: '7.23', end: '8.22' },
            { id: 6, name: '처녀자리', symbol: '♍', start: '8.23', end: '9.22' },
            { id: 7, name: '천칭자리', symbol: '♎', start: '9.23', end: '10.22' },
            { id: 8, name: '전갈자리', symbol: '♏', start: '10.23', end: '11.21' },
            { id: 9, name: '사수자리', symbol: '♐', start: '11.22', end: '12.21' },
            { id: 10, name: '염소자리', symbol: '♑', start: '12.22', end: '1.19' },
            { id: 11, name: '물병자리', symbol: '♒', start: '1.20', end: '2.18' },
            { id: 12, name: '물고기자리', symbol: '♓', start: '2.19', end: '3.20' }
        ];
        
        // 별자리별 영어명 매핑 (역사적 인물 데이터 접근용)
        this.zodiacEnglishNames = {
            1: 'aries', 2: 'taurus', 3: 'gemini', 4: 'cancer',
            5: 'leo', 6: 'virgo', 7: 'libra', 8: 'scorpio',
            9: 'sagittarius', 10: 'capricorn', 11: 'aquarius', 12: 'pisces'
        };
    }

    /**
     * 메시지 필터 시스템 초기화
     */
    initMessageFilter() {
        this.messageFilter = {
            // 금지된 표현들 (단어, 구문, 패턴)
            blockedTerms: [
                '죽음', '사망', '자살', '살해', '폭력', '전쟁', '싸움', '갈등', '분쟁',
                '헤어짐', '이별', '파혼', '이혼', '배신', '불륜', '바람', '외도',
                '질병', '아픈', '고통', '상처', '슬픔', '절망', '불행',
                '파산', '빚', '부채', '가난', '실업', '해고', '실패', '좌절',
                '사고', '재해', '재난', '화재', '지진', '홍수', '태풍',
                '범죄', '도둑', '절도', '사기', '협박', '위험', '위협',
                '못생긴', '추한', '밉다', '싫다', '나쁜', '최악', '형편없는'
            ],
            // 부정적인 패턴들
            negativePatterns: [
                /안.*좋/g,
                /나빠/g,
                /힘들/g,
                /어려워/g,
                /문제.*생기/g,
                /곤란.*처하/g,
                /실수.*하/g
            ],
            // 긍정적 대체 표현들
            positiveReplacements: {
                '문제': '상황',
                '실패': '학습 기회',
                '어려움': '도전',
                '힘든': '성장하는',
                '나쁜': '변화가 필요한',
                '걱정': '관심',
                '불안': '신중함',
                '스트레스': '자극',
                '갈등': '조율이 필요한 상황',
                '위기': '전환점'
            }
        };
        
        console.log('🛡️ 메시지 필터 시스템 초기화 완료');
        console.log('- 차단 키워드 수:', this.messageFilter.blockedTerms.length);
        console.log('- 부정 패턴 수:', this.messageFilter.negativePatterns.length);
        console.log('- 긍정 대체어 수:', Object.keys(this.messageFilter.positiveReplacements).length);
    }

    /**
     * 메시지 품질 검증 및 필터링
     */
    validateMessageQuality(message) {
        if (!message || typeof message !== 'string') {
            console.log('⚠️ 메시지 검증: 유효하지 않은 메시지');
            return { passed: false, reason: 'invalid-message' };
        }
        
        const lowerMessage = message.toLowerCase();
        
        // 1. 차단된 키워드 검사
        for (const term of this.messageFilter.blockedTerms) {
            if (lowerMessage.includes(term.toLowerCase())) {
                console.log(`🚫 메시지 차단: 금지 키워드 "${term}" 발견`);
                return { passed: false, reason: 'blocked-term', term: term };
            }
        }
        
        // 2. 부정적 패턴 검사
        for (const pattern of this.messageFilter.negativePatterns) {
            if (pattern.test(message)) {
                console.log(`🚫 메시지 차단: 부정 패턴 발견 ${pattern}`);
                return { passed: false, reason: 'negative-pattern', pattern: pattern };
            }
        }
        
        // 3. 메시지 길이 검증 (너무 짧거나 긴 메시지)
        if (message.length < 10) {
            console.log('⚠️ 메시지 너무 짧음:', message.length);
            return { passed: false, reason: 'too-short' };
        }
        
        if (message.length > 500) {
            console.log('⚠️ 메시지 너무 길음:', message.length);
            return { passed: false, reason: 'too-long' };
        }
        
        console.log('✅ 메시지 검증 통과');
        return { passed: true };
    }

    /**
     * 메시지 품질 개선 (부정적 표현 -> 긍정적 표현)
     */
    enhanceMessagePositivity(message) {
        if (!message) return message;
        
        let enhancedMessage = message;
        
        // 부정적 표현을 긍정적으로 변환
        for (const [negative, positive] of Object.entries(this.messageFilter.positiveReplacements)) {
            const regex = new RegExp(negative, 'gi');
            enhancedMessage = enhancedMessage.replace(regex, positive);
        }
        
        // 변경사항이 있으면 로그
        if (enhancedMessage !== message) {
            console.log('🔄 메시지 긍정화 변환:');
            console.log('- 원본:', message);
            console.log('- 변환:', enhancedMessage);
        }
        
        return enhancedMessage;
    }

    /**
     * 메시지 품질 보장 (검증 + 개선 + 재생성)
     */
    ensureMessageQuality(message, maxRetries = 3) {
        if (!this.messageFilter) {
            return message;
        }
        
        let currentMessage = message;
        let attempts = 0;
        
        while (attempts < maxRetries) {
            // 1. 메시지 품질 검증
            const validation = this.validateMessageQuality(currentMessage);
            
            if (validation.passed) {
                // 2. 긍정적 표현으로 개선
                const enhancedMessage = this.enhanceMessagePositivity(currentMessage);
                console.log(`✅ 메시지 품질 검증 완료 (시도 ${attempts + 1}/${maxRetries})`);
                return enhancedMessage;
            }
            
            console.log(`⚠️ 메시지 품질 검증 실패 (시도 ${attempts + 1}/${maxRetries}):`, validation.reason);
            
            // 3. 실패 시 긍정적 메시지 생성
            currentMessage = this.generatePositiveFallback(validation.reason);
            attempts++;
        }
        
        // 최대 재시도 후에도 실패하면 안전한 기본 메시지 반환
        console.log('⚠️ 최대 재시도 초과, 기본 안전 메시지 사용');
        return "오늘은 긍정적인 변화와 성장의 기회가 있을 것입니다.";
    }

    /**
     * 검증 실패 이유에 따른 긍정적 메시지 생성
     */
    generatePositiveFallback(reason) {
        const positiveMessages = {
            'blocked-term': "밝은 미래와 희망찬 기회가 기다리고 있습니다.",
            'negative-pattern': "긍정적인 에너지와 좋은 소식이 있을 것입니다.",
            'too-short': "오늘은 특별한 하루가 될 것입니다. 좋은 일들이 연이어 일어날 것입니다.",
            'too-long': "간단히 말하면, 행운과 성공이 함께할 것입니다.",
            'invalid-message': "당신에게는 놀라운 가능성과 기회가 기다리고 있습니다."
        };
        
        return positiveMessages[reason] || "긍정적인 변화와 성장의 기회가 있을 것입니다.";
    }

    /**
     * 역사적 인물 데이터 로드
     * 파일 경로: ../historical-figures-enhanced.json (zodiac-system 디렉토리 내)
     */
    async loadHistoricalFigures() {
        console.log('🔄 loadHistoricalFigures() 시작');
        console.log('📁 시도할 경로: ../historical-figures-enhanced.json');
        
        try {
            console.log('🌐 fetch 요청 시작...');
            const response = await fetch('../historical-figures-enhanced.json');
            
            console.log('📊 Response 상태:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                url: response.url
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log('📄 JSON 파싱 시작...');
            this.historicalFigures = await response.json();
            
            // 로드된 데이터 구조 분석
            console.log('✅ Historical figures data loaded successfully!');
            console.log('📋 데이터 구조 분석:');
            if (this.historicalFigures && this.historicalFigures.zodiacFigures) {
                const zodiacKeys = Object.keys(this.historicalFigures.zodiacFigures);
                console.log('- 별자리 키 개수:', zodiacKeys.length);
                console.log('- 별자리 키들:', zodiacKeys);
                
                // 양자리 데이터 특별 로깅
                if (this.historicalFigures.zodiacFigures.aries) {
                    console.log('♈ 양자리 인물 수:', this.historicalFigures.zodiacFigures.aries.figures.length);
                    console.log('♈ 양자리 대표 인물들:', 
                        this.historicalFigures.zodiacFigures.aries.figures.slice(0, 3).map(f => f.name)
                    );
                }
                
                // 각 별자리별 인물 수 출력
                for (const zodiac of zodiacKeys) {
                    const figures = this.historicalFigures.zodiacFigures[zodiac].figures || [];
                    console.log(`- ${zodiac}: ${figures.length}명`);
                }
            }
        } catch (error) {
            console.error('❌ Historical figures data 로드 실패:');
            console.error('- Error message:', error.message);
            console.error('- Error type:', error.constructor.name);
            
            // 폴백: null로 설정하여 기본 시스템 사용
            this.historicalFigures = null;
            console.log('📦 historicalFigures를 null로 설정 (기본 시스템 사용)');
        }
    }

    /**
     * 운세 데이터 로드 (상세 로그 포함) - 기존과 동일
     */
    async loadFortuneData() {
        console.log('🔄 loadFortuneData() 시작');
        console.log('📁 시도할 경로: ../api/fortune-data.json');
        
        try {
            console.log('🌐 fetch 요청 시작...');
            const response = await fetch('../api/fortune-data.json');
            
            console.log('📊 Response 상태:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                url: response.url
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log('📄 JSON 파싱 시작...');
            this.fortuneData = await response.json();
            
            // 로드된 데이터 구조 분석
            console.log('✅ Fortune data loaded successfully!');
            console.log('📋 데이터 구조 분석:');
            console.log('- daily 키 개수:', Object.keys(this.fortuneData.daily || {}).length);
            console.log('- yearly 키 존재:', !!this.fortuneData.yearly);
            console.log('- weekly 키 존재:', !!this.fortuneData.weekly);
            console.log('- monthly 키 존재:', !!this.fortuneData.monthly);
            console.log('- compatibility 키 존재:', !!this.fortuneData.compatibility);
            
            // 첫 번째 daily 데이터 샘플 출력
            const firstDailyKey = Object.keys(this.fortuneData.daily || {})[0];
            if (firstDailyKey) {
                console.log('📅 첫 번째 daily 데이터:', firstDailyKey);
                const firstDayData = this.fortuneData.daily[firstDailyKey];
                console.log('🔢 해당 날짜의 별자리 개수:', Object.keys(firstDayData || {}).length);
                console.log('🎯 샘플 데이터 (별자리 1):', firstDayData['1'] || 'N/A');
            } else {
                console.warn('⚠️ daily 데이터가 비어있습니다!');
            }
            
        } catch (error) {
            console.error('❌ Fortune data 로드 실패:');
            console.error('- Error message:', error.message);
            console.error('- Error type:', error.constructor.name);
            console.error('- Stack trace:', error.stack);
            
            // 폴백: 로컬 스토리지 사용
            console.log('🔄 폴백 데이터로 초기화...');
            this.fortuneData = {
                daily: {},
                yearly: {},
                weekly: {},
                monthly: {},
                compatibility: {}
            };
            console.log('📦 폴백 데이터 구조 설정 완료');
        }
    }

    /**
     * 날짜 및 카테고리 기반 역사적 인물 선택 (카테고리별 랜덤 시드 사용)
     */
    selectHistoricalFigure(zodiacId, date, category = 'overall') {
        if (!this.historicalFigures || !this.historicalFigures.zodiacFigures) {
            console.log('📋 historicalFigures 데이터 없음, null 반환');
            return null;
        }
        
        const zodiacKey = this.zodiacEnglishNames[zodiacId];
        const zodiacData = this.historicalFigures.zodiacFigures[zodiacKey];
        
        if (!zodiacData || !zodiacData.figures || zodiacData.figures.length === 0) {
            console.log('📋 해당 별자리 인물 데이터 없음:', zodiacKey);
            return null;
        }
        
        // 카테고리별 다른 인물 선택을 위한 시드 기반 랜덤
        const dateObj = new Date(date);
        const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 86400000);
        
        // 카테고리별 시드값 생성 (재현 가능한 랜덤성)
        const categorySeeds = {
            'overall': 1, 'love': 2, 'money': 3, 'work': 4, 'health': 5,
            'advice': 6, '애정운': 2, '금전운': 3, '직장운': 4, '건강운': 5
