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
        
        // 강화된 시드 기반 랜덤 (날짜 + 카테고리 + 시간)
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        
        // 카테고리별 시드값 생성 (더 큰 간격으로 분리)
        const categorySeeds = {
            'overall': 1000, 'love': 2500, 'money': 4000, 'work': 5500, 'health': 7000,
            'advice': 8500, '애정운': 2500, '금전운': 4000, '직장운': 5500, '건강운': 7000
        };
        
        const categorySeed = categorySeeds[category] || 1000;
        
        // 시간 기반 추가 랜덤성 (시/분 추가)
        const timeSeed = (currentHour * 60) + currentMinute;
        const seed = dayOfYear + categorySeed + (zodiacId * 100) + timeSeed;
        
        // 더 강력한 시드 기반 랜덤 인덱스 생성 (소수 사용)
        const figureIndex = (seed * 31337) % zodiacData.figures.length;
        
        const selectedFigure = zodiacData.figures[figureIndex];
        
        // 양자리 선택 특별 로깅
        if (zodiacId === 1) {
            console.log(`♈ 양자리 인물 선택: ${selectedFigure.name} [${figureIndex}/${zodiacData.figures.length}]`);
            console.log(`♈ 대표 업적: ${selectedFigure.achievements ? selectedFigure.achievements[0] : 'N/A'}`);
        } else {
            console.log(`🎭 선택된 인물 (${zodiacKey}): ${selectedFigure.name} [${figureIndex}/${zodiacData.figures.length}]`);
        }
        
        return selectedFigure;
    }

    /**
     * 업적에 맞는 자연스러운 동사 선택
     */
    getAchievementVerb(achievement) {
        if (!achievement) return "을 이룬";
        
        const lower = achievement.toLowerCase();
        if (lower.includes("그림") || lower.includes("초상화")) return "을 그린";
        if (lower.includes("조각") || lower.includes("동상")) return "을 조각한";
        if (lower.includes("작곡") || lower.includes("교향곡")) return "을 작곡한";
        if (lower.includes("발명") || lower.includes("발견")) return "을 발견한";
        if (lower.includes("설계") || lower.includes("건축")) return "을 설계한";
        if (lower.includes("저술") || lower.includes("책")) return "을 쓴";
        if (lower.includes("통일") || lower.includes("건국")) return "을 이룬";
        
        return "을 만든"; // 기본값
    }

    /**
     * 양자리 전용 구체적 메시지 생성 함수
     * "게르니카를 그린 피카소처럼..." 형태의 구체적 업적/작품명 포함
     */
    generateAriesSpecificMessage(figure, category, baseMessage) {
        if (!figure || !figure.achievements || figure.achievements.length === 0) {
            console.log('♈ 양자리 구체적 조언: 인물 데이터 부족, 기본 메시지 사용');
            return this.ensureMessageQuality(baseMessage);
        }
        
        console.log(`♈ 양자리 구체적 조언 생성: ${figure.name} - ${category}`);
        
        // 구체적 업적/작품명 추출
        const achievement = figure.achievements[0];
        const achievementName = achievement.split(' - ')[0]; // "모나리자 - 설명" → "모나리자"
        
        // 카테고리별 특성 활용 (있으면 우선 사용)
        let finalTrait;
        if (figure.categoryTraits && figure.categoryTraits[category]) {
            finalTrait = figure.categoryTraits[category];
            console.log(`♈ 카테고리 특성 사용: ${category} -> ${finalTrait.substring(0, 30)}...`);
        } else {
            finalTrait = baseMessage;
            console.log(`♈ 기본 메시지 사용: ${finalTrait.substring(0, 30)}...`);
        }
        
        // naturalTemplates만 사용 - 절대 다른 것과 섞지 않음!
        let enhancedMessage;
        
        if (figure.naturalTemplates && figure.naturalTemplates[category]) {
            // naturalTemplates가 있으면 그것만 사용 (완전한 단일 문장)
            enhancedMessage = figure.naturalTemplates[category];
            console.log(`♈ naturalTemplate 단독 사용: ${enhancedMessage}`);
        } else if (figure.categoryTraits && figure.categoryTraits[category]) {
            // naturalTemplates가 없으면 categoryTraits만 사용
            enhancedMessage = figure.categoryTraits[category];
            console.log(`♈ categoryTraits 사용: ${enhancedMessage}`);
        } else {
            // 둘 다 없으면 기본 메시지만 사용
            enhancedMessage = baseMessage;
            console.log(`♈ 기본 메시지 사용: ${enhancedMessage}`);
        }
        
        console.log(`♈ 생성된 구체적 메시지: ${enhancedMessage.substring(0, 80)}...`);
        
        // 품질 검증 후 반환
        return this.ensureMessageQuality(enhancedMessage);
    }

    /**
     * 역사적 인물 특성을 활용한 메시지 생성 (품질 검증 포함)
     */
    generateEnhancedMessage(figure, category, baseMessage) {
        if (!figure || !figure.categoryTraits || !figure.categoryTraits[category]) {
            // 기본 메시지도 품질 검증 후 반환
            return this.ensureMessageQuality(baseMessage);
        }
        
        const trait = figure.categoryTraits[category];
        const achievement = figure.achievements && figure.achievements.length > 0 ? 
            figure.achievements[0] : null;
        
        let enhancedMessage;
        
        // 구체적인 업적과 함께 메시지 생성
        if (achievement) {
            const achievementName = achievement.split(' - ')[0]; // "모나리자 - 설명" → "모나리자"
            enhancedMessage = `${figure.name}가 ${achievementName}를 만들어낸 것처럼, ${trait}`;
        } else {
            enhancedMessage = `${figure.name}의 ${trait}`;
        }
        
        // 품질 검증 후 반환
        return this.ensureMessageQuality(enhancedMessage);
    }

    /**
     * 구체적 예시로 메시지 포맷팅 (품질 검증 포함)
     */
    formatWithConcreteExample(figure, trait) {
        if (!figure) {
            return this.ensureMessageQuality(trait);
        }
        
        let formattedMessage;
        
        // 유명한 명언이 있으면 활용
        if (figure.famousQuote && figure.famousQuote.length < 100) {
            formattedMessage = `${trait}. "${figure.famousQuote}"라고 했던 ${figure.name}처럼 행동하세요.`;
        }
        // 대표 업적 활용
        else if (figure.achievements && figure.achievements.length > 0) {
            const achievement = figure.achievements[0].split(' - ')[0];
            formattedMessage = `${figure.name}가 ${achievement}를 창조했듯이, ${trait}`;
        }
        else {
            formattedMessage = `${figure.name}처럼 ${trait}`;
        }
        
        // 품질 검증 후 반환
        return this.ensureMessageQuality(formattedMessage);
    }

    /**
     * 별자리 ID 가져오기 - 기존과 동일
     */
    getZodiacId(month, day) {
        const date = month * 100 + day;
        
        if (date >= 321 && date <= 419) return 1;  // 양자리
        if (date >= 420 && date <= 520) return 2;  // 황소자리
        if (date >= 521 && date <= 620) return 3;  // 쌍둥이자리
        if (date >= 621 && date <= 722) return 4;  // 게자리
        if (date >= 723 && date <= 822) return 5;  // 사자자리
        if (date >= 823 && date <= 922) return 6;  // 처녀자리
        if (date >= 923 && date <= 1022) return 7; // 천칭자리
        if (date >= 1023 && date <= 1121) return 8; // 전갈자리
        if (date >= 1122 && date <= 1221) return 9; // 사수자리
        if (date >= 1222 || date <= 119) return 10; // 염소자리
        if (date >= 120 && date <= 218) return 11;  // 물병자리
        if (date >= 219 && date <= 320) return 12;  // 물고기자리
        
        return 1;
    }

    /**
     * 날짜로 별자리 가져오기 (zodiac.js에서 사용) - 기존과 동일
     */
    getZodiacByDate(month, day) {
        const zodiacId = this.getZodiacId(month, day);
        return this.zodiacSigns[zodiacId - 1];
    }

    /**
     * 별자리 정보 가져오기 - 기존과 동일
     */
    async getZodiacInfo(zodiacId) {
        const zodiacInfo = {
            1: { name: '양자리', element: 'Fire', symbol: '♈', dates: '3.21~4.19',
                description: '열정적이고 모험을 좋아하는 개척자의 별자리' },
            2: { name: '황소자리', element: 'Earth', symbol: '♉', dates: '4.20~5.20',
                description: '인내심이 강하고 실용적인 예술가의 별자리' },
            3: { name: '쌍둥이자리', element: 'Air', symbol: '♊', dates: '5.21~6.20',
                description: '호기심이 많고 소통을 중시하는 지식인의 별자리' },
            4: { name: '게자리', element: 'Water', symbol: '♋', dates: '6.21~7.22',
                description: '감성적이고 가족을 소중히 여기는 보호자의 별자리' },
            5: { name: '사자자리', element: 'Fire', symbol: '♌', dates: '7.23~8.22',
                description: '자신감 넘치고 리더십이 강한 왕의 별자리' },
            6: { name: '처녀자리', element: 'Earth', symbol: '♍', dates: '8.23~9.22',
                description: '완벽주의적이고 분석적인 봉사자의 별자리' },
            7: { name: '천칭자리', element: 'Air', symbol: '♎', dates: '9.23~10.22',
                description: '균형과 조화를 추구하는 외교관의 별자리' },
            8: { name: '전갈자리', element: 'Water', symbol: '♏', dates: '10.23~11.21',
                description: '열정적이고 신비로운 변혁가의 별자리' },
            9: { name: '사수자리', element: 'Fire', symbol: '♐', dates: '11.22~12.21',
                description: '자유롭고 철학적인 탐험가의 별자리' },
            10: { name: '염소자리', element: 'Earth', symbol: '♑', dates: '12.22~1.19',
                description: '야심차고 인내심 강한 성취자의 별자리' },
            11: { name: '물병자리', element: 'Air', symbol: '♒', dates: '1.20~2.18',
                description: '독창적이고 인도주의적인 혁신가의 별자리' },
            12: { name: '물고기자리', element: 'Water', symbol: '♓', dates: '2.19~3.20',
                description: '상상력이 풍부하고 감수성이 깊은 예술가의 별자리' }
        };
        
        return zodiacInfo[zodiacId] || zodiacInfo[1];
    }

    /**
     * 일일 운세 가져오기 (양자리 구체적 조언 적용) - 핵심 메서드 시그니처 유지
     */
    async getDailyFortune(zodiacId) {
        console.log('🌟 getDailyFortune() 호출됨 (Aries Enhanced Version)');
        console.log('📝 요청 파라미터:', { zodiacId, zodiacIdType: typeof zodiacId });
        
        // 양자리 전용 로깅
        if (zodiacId === 1) {
            console.log('♈ 양자리 구체적 조언 모드 활성화');
        }
        
        // 데이터가 아직 로드되지 않았으면 기다림
        if (!this.fortuneData) {
            console.log('⏳ fortuneData가 없음, loadFortuneData() 호출...');
            await this.loadFortuneData();
        }
        
        if (!this.historicalFigures) {
            console.log('⏳ historicalFigures가 없음, loadHistoricalFigures() 호출...');
            await this.loadHistoricalFigures();
        }

        const today = new Date().toISOString().split('T')[0];
        console.log('📅 오늘 날짜:', today);
        
        // 역사적 인물 선택 (기본 overall용)
        const selectedFigure = this.selectHistoricalFigure(zodiacId, today, 'overall');
        if (zodiacId === 1) {
            console.log('♈ 양자리 overall 인물:', selectedFigure ? selectedFigure.name : 'none');
        } else {
            console.log('🎭 선택된 역사적 인물 (overall용):', selectedFigure ? selectedFigure.name : 'none');
        }
        
        // fortune-data.json에서 기본 데이터 찾기 (기존 로직 유지)
        let fortuneData = null;
        
        if (this.fortuneData.daily[today] && this.fortuneData.daily[today][zodiacId]) {
            fortuneData = this.fortuneData.daily[today][zodiacId];
            console.log('✅ 오늘 날짜 fortune 데이터 발견!');
        } else {
            // 폴백 로직 (기존과 동일)
            console.log('⚠️ 오늘 날짜 데이터 없음, 폴백 로직 시작...');
            
            const fallbackDate = '2025-01-01';
            const availableDates = Object.keys(this.fortuneData.daily).sort();
            
            let useDate = fallbackDate;
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getDate();
            
            // 같은 월일을 찾기 (연도 무시)
            for (const date of availableDates) {
                const [year, month, day] = date.split('-').map(Number);
                if (month === currentMonth && day === currentDay) {
                    useDate = date;
                    console.log('🎉 같은 월일 발견:', useDate);
                    break;
                }
            }
            
            // 못 찾으면 같은 일자 사용 (월 무시)
            if (useDate === fallbackDate) {
                for (const date of availableDates) {
                    const day = parseInt(date.split('-')[2]);
                    if (day === currentDay) {
                        useDate = date;
                        console.log('📅 같은 일자 발견:', useDate);
                        break;
                    }
                }
            }
            
            if (this.fortuneData.daily[useDate] && this.fortuneData.daily[useDate][zodiacId]) {
                fortuneData = this.fortuneData.daily[useDate][zodiacId];
                console.log('✅ 폴백 fortune 데이터 사용:', useDate);
            }
        }
        
        // 양자리 구체적 조언 vs 기존 시스템 분기
        if (fortuneData) {
            console.log('📋 fortune 데이터 발견');
            
            // 모든 별자리에 naturalTemplates 적용 - 카테고리별 다른 인물 사용
            const enhancedFortunes = {};
            if (fortuneData.fortunes) {
                for (const [category, message] of Object.entries(fortuneData.fortunes)) {
                    // 모든 별자리: 카테고리별 다른 인물 선택하여 naturalTemplates 사용
                    const categoryFigure = this.selectHistoricalFigure(zodiacId, today, category);
                    if (categoryFigure) {
                        const zodiacName = this.zodiacSigns[zodiacId - 1].name;
                        console.log(`🌟 ${zodiacName} ${category} 카테고리 → ${categoryFigure.name}`);
                        
                        // naturalTemplates가 있으면 그것만 사용 (이제 완전한 문장!)
                        if (categoryFigure.naturalTemplates && categoryFigure.naturalTemplates[category]) {
                            enhancedFortunes[category] = categoryFigure.naturalTemplates[category];
                            console.log(`✅ 완전한 문장 사용: ${enhancedFortunes[category]}`);
                        } else {
                            // naturalTemplates가 없으면 기본 메시지 사용
                            enhancedFortunes[category] = this.ensureMessageQuality(message);
                            console.log(`📝 기본 메시지 사용`);
                        }
                    } else {
                        console.log(`⚠️ ${category} 카테고리: 인물 없음, 기본 메시지 사용`);
                        enhancedFortunes[category] = this.ensureMessageQuality(message);
                    }
                }
            }
            
            // 히스토리컬 피규어 정보는 디버깅용으로만 포함
            const historicalInfo = selectedFigure ? {
                name: selectedFigure.name,
                period: selectedFigure.period,
                country: selectedFigure.country,
                achievement: selectedFigure.achievements ? selectedFigure.achievements[0] : null
            } : null;
            
            // overall과 advice - 레거시 문장 제거하고 새 완전한 문장만 사용
            const overallFigure = this.selectHistoricalFigure(zodiacId, today, 'overall');
            let safeOverall;
            if (overallFigure && overallFigure.naturalTemplates) {
                if (overallFigure.naturalTemplates.overall) {
                    safeOverall = overallFigure.naturalTemplates.overall;
                } else if (overallFigure.naturalTemplates.love) {
                    safeOverall = overallFigure.naturalTemplates.love;
                } else {
                    const availableCategories = Object.keys(overallFigure.naturalTemplates);
                    safeOverall = availableCategories.length > 0 ? 
                        overallFigure.naturalTemplates[availableCategories[0]] :
                        this.ensureMessageQuality(fortuneData.overall);
                }
                console.log(`Overall 메시지: ${overallFigure.name}의 템플릿 사용`);
            } else {
                safeOverall = this.ensureMessageQuality(fortuneData.overall);
            }
                
            const adviceFigure = this.selectHistoricalFigure(zodiacId, today, 'advice');
            let safeAdvice;
            if (adviceFigure && adviceFigure.naturalTemplates) {
                if (adviceFigure.naturalTemplates.health) {
                    safeAdvice = adviceFigure.naturalTemplates.health;
                } else if (adviceFigure.naturalTemplates.advice) {
                    safeAdvice = adviceFigure.naturalTemplates.advice;
                } else {
                    const availableCategories = Object.keys(adviceFigure.naturalTemplates);
                    safeAdvice = availableCategories.length > 0 ? 
                        adviceFigure.naturalTemplates[availableCategories[availableCategories.length - 1]] :
                        this.ensureMessageQuality(fortuneData.advice);
                }
                console.log(`Advice 메시지: ${adviceFigure.name}의 템플릿 사용`);
            } else {
                safeAdvice = this.ensureMessageQuality(fortuneData.advice);
            }
            
            return {
                zodiacId: zodiacId,
                date: today,
                overall: safeOverall,
                scores: fortuneData.scores,
                fortunes: enhancedFortunes,
                lucky: fortuneData.lucky,
                advice: safeAdvice,
                historicalFigure: historicalInfo,
                source: zodiacId === 1 && selectedFigure ? 'aries-enhanced-fortune' : 'fortune-complete-message-unified'
            };
        } else if (selectedFigure) {
            console.log('🎭 Historical-figures 데이터만 사용 (fortune 데이터 없음)');
            
            // fortune-data.json이 없을 때만 historical-figures 사용
            const generatedFortune = this.generateDailyFortune(zodiacId);
            
            // 역사적 인물 특성을 활용한 메시지 생성 (이 경우만 인물 조합 허용)
            const enhancedFortunes = {};
            const categories = ['love', 'money', 'work', 'health'];
            
            for (const category of categories) {
                if (generatedFortune.fortunes && generatedFortune.fortunes[category]) {
                    if (zodiacId === 1) {
                        // 양자리: 구체적 메시지 생성
                        enhancedFortunes[category] = this.generateAriesSpecificMessage(
                            selectedFigure, 
                            category, 
                            generatedFortune.fortunes[category]
                        );
                    } else {
                        // 다른 별자리: 기존 로직
                        enhancedFortunes[category] = this.generateEnhancedMessage(
                            selectedFigure, 
                            category, 
                            generatedFortune.fortunes[category]
                        );
                    }
                }
            }
            
            const rawOverall = selectedFigure.coreTraits && selectedFigure.coreTraits.length > 0 ?
                `${selectedFigure.name}의 ${selectedFigure.coreTraits[0]} 정신으로 ${generatedFortune.overall}` :
                generatedFortune.overall;
            
            return {
                zodiacId: zodiacId,
                date: today,
                overall: zodiacId === 1 ? 
                    this.generateAriesSpecificMessage(selectedFigure, 'overall', rawOverall) :
                    this.ensureMessageQuality(rawOverall),
                scores: generatedFortune.scores,
                fortunes: enhancedFortunes,
                lucky: generatedFortune.lucky,
                advice: zodiacId === 1 ?
                    this.generateAriesSpecificMessage(selectedFigure, 'advice', generatedFortune.advice) :
                    this.formatWithConcreteExample(selectedFigure, generatedFortune.advice),
                historicalFigure: {
                    name: selectedFigure.name,
                    period: selectedFigure.period,
                    country: selectedFigure.country,
                    achievement: selectedFigure.achievements ? selectedFigure.achievements[0] : null
                },
                source: zodiacId === 1 ? 'aries-enhanced-figures' : 'historical-figures-only-unified'
            };
        } else {
            console.log('🔧 기본 데이터 생성 (품질 검증 포함)');
            
            // 양자리도 인물 데이터가 없으면 기본 생성 함수 사용
            if (zodiacId === 1) {
                console.log('♈ 양자리이지만 인물 데이터 없음, 안전 폴백 사용');
            }
            
            return this.generateDailyFortune(zodiacId);
        }
    }

    /**
     * 연간 운세 가져오기 - 기존과 동일
     */
    async getYearlyFortune(zodiacId) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }

        if (this.fortuneData.yearly[zodiacId]) {
            return {
                zodiacId: zodiacId,
                ...this.fortuneData.yearly[zodiacId]
            };
        }

        // 폴백: 기본 데이터 생성
        return this.generateYearlyFortune(zodiacId);
    }

    /**
     * 주간 운세 가져오기 - 기존과 동일
     */
    async getWeeklyFortune(zodiacId) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        const weekNum = this.getCurrentWeekNumber();
        const weekKey = `2025-W${weekNum.toString().padStart(2, '0')}`;
        
        if (this.fortuneData.weekly && this.fortuneData.weekly[weekKey] && 
            this.fortuneData.weekly[weekKey][zodiacId]) {
            return this.fortuneData.weekly[weekKey][zodiacId];
        }
        
        // Fallback
        return this.generateWeeklyFortune(zodiacId);
    }

    /**
     * 월간 운세 가져오기 - 기존과 동일
     */
    async getMonthlyFortune(zodiacId) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        const currentMonth = new Date().getMonth() + 1;
        const monthKey = `2025-${currentMonth.toString().padStart(2, '0')}`;
        
        if (this.fortuneData.monthly && this.fortuneData.monthly[monthKey] && 
            this.fortuneData.monthly[monthKey][zodiacId]) {
            return this.fortuneData.monthly[monthKey][zodiacId];
        }
        
        // Fallback
        return this.generateMonthlyFortune(zodiacId);
    }

    /**
     * 별자리 궁합 확인 (창의적인 텍스트 연동) - 기존과 동일
     */
    async getCompatibility(zodiac1Id, zodiac2Id) {
        console.log('🔍 getCompatibility 호출됨:', {zodiac1Id, zodiac2Id});
        
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        let jsonData = null;
        let compatKey = '';
        
        // 항상 작은 ID가 먼저 오도록 정규화 (우리 데이터는 z1 <= z2 형태로 저장됨)
        const minId = Math.min(zodiac1Id, zodiac2Id);
        const maxId = Math.max(zodiac1Id, zodiac2Id);
        compatKey = `${minId}-${maxId}`;
        
        // JSON에서 정규화된 키로 데이터 찾기
        if (this.fortuneData.compatibility && this.fortuneData.compatibility[compatKey]) {
            jsonData = this.fortuneData.compatibility[compatKey];
            console.log('✅ JSON 데이터 발견:', compatKey, `(원래 요청: ${zodiac1Id}-${zodiac2Id})`);
        } else {
            console.log('❌ JSON 데이터 없음:', compatKey);
        }
        
        // 궁합 설명 결정 - 창의적 텍스트 우선, JSON advice는 별도 사용
        let displayText = null;
        let creativeText = null;
        
        // 1순위: zodiacDescriptions의 창의적 텍스트 (메인)
        console.log('🎨 창의적 텍스트 검색 시작...');
        try {
            if (typeof window !== 'undefined' && window.zodiacDescriptions) {
                const zodiac1Data = window.zodiacDescriptions[zodiac1Id];
                const zodiac2Data = window.zodiacDescriptions[zodiac2Id];
                
                // 첫 번째 별자리의 궁합 텍스트 확인
                if (zodiac1Data?.compatibility) {
                    const zodiac2Name = this.zodiacSigns[zodiac2Id - 1]?.name;
                    if (zodiac2Name && zodiac1Data.compatibility.includes(zodiac2Name)) {
                        creativeText = zodiac1Data.compatibility;
                        console.log('✅ 창의적 텍스트 발견 (zodiac1 기준)');
                    }
                }
                
                // 두 번째 별자리의 궁합 텍스트 확인 (첫 번째에서 못 찾은 경우)
                if (!creativeText && zodiac2Data?.compatibility) {
                    const zodiac1Name = this.zodiacSigns[zodiac1Id - 1]?.name;
                    if (zodiac1Name && zodiac2Data.compatibility.includes(zodiac1Name)) {
                        creativeText = zodiac2Data.compatibility;
                        console.log('✅ 창의적 텍스트 발견 (zodiac2 기준)');
                    }
                }
            }
            
            // 창의적 텍스트가 있으면 우선 사용 (품질 검증 포함)
            if (creativeText) {
                displayText = this.ensureMessageQuality(creativeText);
                console.log('🎨 창의적 텍스트 사용 (메인, 품질 검증 완료)');
            } else {
                // 2순위: JSON 데이터의 description (현재 없음)
                if (jsonData?.description) {
                    displayText = this.ensureMessageQuality(jsonData.description);
                    console.log('✅ JSON 설명 사용 (폴백, 품질 검증 완료):', compatKey);
                } else {
                    // 3순위: 기본 메시지
                    displayText = this.ensureMessageQuality("좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다.");
                    console.log('📋 기본 메시지로 폴백 (품질 검증 완료)');
                }
            }
        } catch (error) {
            console.error('❌ 궁합 텍스트 처리 중 오류:', error);
            displayText = this.ensureMessageQuality("좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다.");
        }
        
        // JSON 데이터가 있으면 점수 사용, 없으면 생성
        if (jsonData) {
            console.log('📊 JSON 점수 데이터 사용');
            return {
                zodiac1Id: zodiac1Id,
                zodiac2Id: zodiac2Id,
                totalScore: jsonData.totalScore || jsonData.score,
                scores: jsonData.scores || {
                    love: jsonData.love || 75,
                    friendship: jsonData.friendship || 75,
                    work: jsonData.work || 75
                },
                description: displayText,
                creativeDescription: creativeText,
                advice: this.ensureMessageQuality(jsonData.advice || "서로를 이해하고 배려하는 마음이 중요합니다."),
                source: creativeText ? 'hybrid-filtered' : 'json-filtered'
            };
        } else {
            console.log('🔧 폴백 데이터 생성');
            // 폴백: 기본 데이터 생성 + 창의적 텍스트 적용
            const fallbackData = this.generateCompatibility(zodiac1Id, zodiac2Id);
            return {
                ...fallbackData,
                description: displayText,
                creativeDescription: creativeText,
                advice: this.ensureMessageQuality(fallbackData.advice),
                source: creativeText ? 'hybrid-generated-filtered' : 'generated-filtered'
            };
        }
    }

    // 폴백 생성 함수들 - 품질 검증 포함
    generateDailyFortune(zodiacId) {
        // 품질이 보장된 폴백 메시지들
        const safeMessages = {
            overall: "오늘은 특별한 하루가 될 것입니다.",
            love: "사랑이 깊어지는 날입니다.",
            money: "재정이 안정적입니다.",
            work: "업무 성과가 좋습니다.",
            health: "건강에 유의하세요.",
            advice: "긍정적인 마음으로 하루를 시작하세요!"
        };
        
        return {
            zodiacId: zodiacId,
            date: new Date().toISOString().split('T')[0],
            overall: this.ensureMessageQuality(safeMessages.overall),
            scores: {
                love: 75,
                money: 70,
                work: 80,
                health: 75
            },
            fortunes: {
                love: this.ensureMessageQuality(safeMessages.love),
                money: this.ensureMessageQuality(safeMessages.money),
                work: this.ensureMessageQuality(safeMessages.work),
                health: this.ensureMessageQuality(safeMessages.health)
            },
            lucky: {
                color: "파랑",
                number: 7,
                time: "오후 2-4시"
            },
            advice: this.ensureMessageQuality(safeMessages.advice),
            source: 'generated-fallback-filtered'
        };
    }

    generateWeeklyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            weekStart: this.getWeekStart(),
            weekEnd: this.getWeekEnd(),
            theme: "성장의 한 주",
            overall: "이번 주는 성장과 발전의 기회가 많을 것입니다.",
            fortunes: {
                love: "애정운이 상승합니다.",
                money: "투자 기회를 포착하세요.",
                work: "중요한 프로젝트가 시작됩니다.",
                health: "규칙적인 운동이 필요합니다."
            },
            keyDays: ["월요일 - 새로운 시작", "수요일 - 중요한 만남", "금요일 - 성과 달성"],
            advice: "매일 작은 목표를 세우고 달성해나가세요."
        };
    }

    generateMonthlyFortune(zodiacId) {
        const month = new Date().getMonth() + 1;
        return {
            zodiacId: zodiacId,
            year: new Date().getFullYear(),
            month: month,
            theme: "변화와 성장",
            overall: "이번 달은 많은 변화와 함께 성장의 기회가 있을 것입니다.",
            fortunes: {
                love: "새로운 만남이나 관계 발전이 있을 것입니다.",
                money: "재정 상황이 개선될 것입니다.",
                work: "커리어 발전의 기회가 있습니다.",
                health: "건강 관리에 더 신경 쓰세요."
            },
            keyDates: ["5일", "15일", "25일"],
            advice: "변화를 두려워하지 말고 받아들이세요."
        };
    }

    generateYearlyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            year: new Date().getFullYear(),
            theme: "도약의 해",
            overall: "올해는 큰 도약을 이룰 수 있는 해가 될 것입니다.",
            fortunes: {
                love: "진정한 사랑을 찾거나 관계가 깊어질 것입니다.",
                money: "경제적 안정과 성장이 있을 것입니다.",
                work: "커리어의 전환점이 될 것입니다.",
                health: "건강한 생활 습관을 만들어가세요."
            },
            bestMonths: ["3월", "7월", "11월"],
            challengingMonths: ["2월", "9월"],
            keyAdvice: "자신을 믿고 도전하세요!"
        };
    }

    generateCompatibility(zodiac1Id, zodiac2Id) {
        const elements = {
            fire: [1, 5, 9],
            earth: [2, 6, 10],
            air: [3, 7, 11],
            water: [4, 8, 12]
        };

        let sameElement = false;
        for (const group of Object.values(elements)) {
            if (group.includes(zodiac1Id) && group.includes(zodiac2Id)) {
                sameElement = true;
                break;
            }
        }

        const baseScore = sameElement ? 85 : 70;
        const score = baseScore + Math.floor(Math.random() * 15);

        return {
            zodiac1Id: zodiac1Id,
            zodiac2Id: zodiac2Id,
            score: Math.min(100, score),
            description: score >= 80 ? 
                "천생연분! 서로를 완벽하게 이해하고 사랑할 수 있는 관계입니다." :
                "좋은 인연입니다. 서로의 차이를 인정하면 행복한 관계가 될 수 있습니다.",
            details: {
                love: `애정 궁합: ${score}점`,
                friendship: `우정 궁합: ${score + Math.floor(Math.random() * 10) - 5}점`,
                work: `업무 궁합: ${score + Math.floor(Math.random() * 10) - 5}점`
            },
            advice: "정기적으로 깊은 대화를 나누는 시간을 가지세요."
        };
    }

    // 유틸리티 함수들 - 기존과 동일
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff)).toISOString().split('T')[0];
    }

    getWeekEnd() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + 7;
        return new Date(now.setDate(diff)).toISOString().split('T')[0];
    }
    
    /**
     * 현재 년도의 주차 번호 계산
     */
    getCurrentWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start + ((start.getDay() + 6) % 7) * 86400000;
        return Math.ceil(diff / 604800000);
    }
}

// 전역 인스턴스 생성 - 기존과 동일
const zodiacAPI = new ZodiacAPIReal();