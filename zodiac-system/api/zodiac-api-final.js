/**
 * 별자리 운세 API - 점수 기반 인물 그룹 선택 시스템
 * 카테고리 점수 평균에 따라 해당 점수 그룹의 인물만 선택하여 메시지 톤 일관성 확보
 * 
 * 점수 구간별 인물 그룹:
 * - 85점 이상: 고득점 그룹 (성공적/긍정적 인물) 88명
 * - 70-84점: 중간점 그룹 (균형적/안정적 인물) 112명  
 * - 69점 이하: 저득점 그룹 (도전적/극복형 인물) 40명
 */

class ZodiacAPIReal {
    constructor() {
        this.fortuneData = null;
        this.historicalFigures = null;
        this.historicalFiguresAdvice = null;
        this.messageFilter = null;
        this.loadFortuneData();
        this.loadHistoricalFigures();
        this.loadHistoricalFiguresAdvice();
        this.initMessageFilter();
        
        // 별자리 정보 배열
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
        
        // 별자리별 영어명 매핑
        this.zodiacEnglishNames = {
            1: 'aries', 2: 'taurus', 3: 'gemini', 4: 'cancer',
            5: 'leo', 6: 'virgo', 7: 'libra', 8: 'scorpio',
            9: 'sagittarius', 10: 'capricorn', 11: 'aquarius', 12: 'pisces'
        };
        
        // 점수 구간 정의
        this.scoreRanges = {
            high: { min: 85, max: 100, label: '고득점 그룹 (성공적/긍정적)' },
            medium: { min: 70, max: 84, label: '중간점 그룹 (균형적/안정적)' },
            low: { min: 0, max: 69, label: '저득점 그룹 (도전적/극복형)' }
        };
    }
    
    /**
     * 메시지 필터 시스템 초기화
     */
    initMessageFilter() {
        this.messageFilter = {
            blockedTerms: [
                '죽음', '사망', '자살', '살해', '폭력', '전쟁', '싸움', '갈등', '분쟁',
                '헤어짐', '이별', '파혼', '이혼', '배신', '불륜', '바람', '외도',
                '질병', '아픈', '고통', '상처', '슬픔', '절망', '불행',
                '파산', '빚', '부채', '가난', '실업', '해고', '실패', '좌절'
            ],
            negativePatterns: [
                /안.*좋/g, /나빠/g, /힘들/g, /어려워/g, /문제.*생기/g, /곤란.*처하/g, /실수.*하/g
            ],
            positiveReplacements: {
                '문제': '상황', '실패': '학습 기회', '어려움': '도전', '힘든': '성장하는',
                '나쁜': '변화가 필요한', '걱정': '관심', '불안': '신중함', '갈등': '조율이 필요한 상황'
            }
        };
        
        console.log('🛡️ 메시지 필터 시스템 초기화 완료');
    }
    
    /**
     * 운세 데이터 로드
     */
    async loadFortuneData() {
        try {
            console.log('🌐 fortune-data.json 로드 시도...');
            const response = await fetch('../api/fortune-data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.fortuneData = await response.json();
            console.log('✅ Fortune data 로드 성공');
            
        } catch (error) {
            console.error('❌ Fortune data 로드 실패:', error.message);
            this.fortuneData = {
                daily: {}, yearly: {}, weekly: {}, monthly: {}, compatibility: {}
            };
        }
    }
    
    /**
     * 점수 기반 역사적 인물 데이터 로드
     */
    async loadHistoricalFigures() {
        try {
            console.log('🎭 historical-figures-balanced.json 로드 시도...');
            const response = await fetch('../historical-figures-balanced.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.historicalFigures = await response.json();
            console.log('✅ 점수 기반 인물 데이터 로드 성공');
            
            if (this.historicalFigures && this.historicalFigures.zodiacFigures) {
                this.analyzeScoreDistribution();
            }
            
        } catch (error) {
            console.error('❌ 점수 기반 인물 데이터 로드 실패:', error.message);
            this.historicalFigures = null;
        }
    }
    
    /**
     * 인물별 행동 조언 데이터 로드
     */
    async loadHistoricalFiguresAdvice() {
        try {
            console.log('💡 historical-figures-advice.json 로드 시도...');
            const response = await fetch('../api/historical-figures-advice.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.historicalFiguresAdvice = await response.json();
            console.log('✅ 인물별 행동 조언 데이터 로드 성공');
            
        } catch (error) {
            console.error('❌ 인물별 행동 조언 데이터 로드 실패:', error.message);
            this.historicalFiguresAdvice = null;
        }
    }
    
    /**
     * 점수 그룹별 인물 분포 분석
     */
    analyzeScoreDistribution() {
        const distribution = { high: 0, medium: 0, low: 0 };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.historicalFigures.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup) {
                        distribution[figure.scoreGroup]++;
                    }
                }
            }
        }
        
        console.log('📊 점수 그룹 분포 분석:');
        console.log(`- 고득점 그룹: ${distribution.high}명`);
        console.log(`- 중간점 그룹: ${distribution.medium}명`);
        console.log(`- 저득점 그룹: ${distribution.low}명`);
        
        return distribution;
    }
    
    /**
     * 카테고리 점수들의 평균 계산
     */
    calculateAverageScore(scores) {
        if (!scores || typeof scores !== 'object') {
            console.log('⚠️ 점수 데이터 없음, 기본값 75 사용');
            return 75;
        }
        
        const scoreValues = Object.values(scores).filter(score => 
            typeof score === 'number' && !isNaN(score)
        );
        
        if (scoreValues.length === 0) {
            console.log('⚠️ 유효한 점수 없음, 기본값 75 사용');
            return 75;
        }
        
        const average = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
        console.log(`📊 카테고리 점수 평균: ${average.toFixed(1)}점`);
        
        return Math.round(average);
    }
    
    /**
     * 평균 점수에 따른 점수 그룹 결정
     */
    determineScoreGroup(averageScore) {
        if (averageScore >= this.scoreRanges.high.min) {
            return 'high';
        } else if (averageScore >= this.scoreRanges.medium.min) {
            return 'medium';
        } else {
            return 'low';
        }
    }
    
    /**
     * 점수 그룹에 해당하는 인물들만 필터링하여 선택
     */
    selectFigureByScoreGroup(zodiacId, date, category, targetScoreGroup) {
        if (!this.historicalFigures || !this.historicalFigures.zodiacFigures) {
            console.log('📋 인물 데이터 없음, null 반환');
            return null;
        }
        
        const zodiacKey = this.zodiacEnglishNames[zodiacId];
        const zodiacData = this.historicalFigures.zodiacFigures[zodiacKey];
        
        if (!zodiacData || !zodiacData.figures || zodiacData.figures.length === 0) {
            console.log(`📋 ${zodiacKey} 별자리 인물 데이터 없음`);
            return null;
        }
        
        // 해당 점수 그룹의 인물들만 필터링
        const targetGroupFigures = zodiacData.figures.filter(figure => 
            figure.scoreGroup === targetScoreGroup
        );
        
        if (targetGroupFigures.length === 0) {
            console.log(`⚠️ ${zodiacKey}에 ${targetScoreGroup} 그룹 인물 없음, 전체에서 선택`);
            // 폴백: 전체 인물에서 선택
            return this.selectFigureFromAll(zodiacData.figures, date, category);
        }
        
        // 시드 기반 랜덤 선택
        const dateObj = new Date(date);
        const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 86400000);
        
        // 카테고리별 시드값
        const categorySeeds = {
            'overall': 1000, 'love': 2500, 'money': 4000, 'work': 5500, 'health': 7000,
            'advice': 8500, '애정운': 2500, '금전운': 4000, '직장운': 5500, '건강운': 7000
        };
        
        const categorySeed = categorySeeds[category] || 1000;
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const timeSeed = (currentHour * 60) + currentMinute;
        
        const seed = dayOfYear + categorySeed + (zodiacId * 100) + timeSeed;
        const figureIndex = (seed * 31337) % targetGroupFigures.length;
        
        const selectedFigure = targetGroupFigures[figureIndex];
        
        console.log(`🎯 ${zodiacKey} ${targetScoreGroup} 그룹에서 선택: ${selectedFigure.name} [${figureIndex + 1}/${targetGroupFigures.length}]`);
        
        return selectedFigure;
    }
    
    /**
     * 폴백용 인물 선택 (점수 그룹 무관)
     */
    selectFigureFromAll(figures, date, category) {
        const dateObj = new Date(date);
        const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 86400000);
        
        const categorySeeds = {
            'overall': 1000, 'love': 2500, 'money': 4000, 'work': 5500, 'health': 7000,
            'advice': 8500
        };
        
        const categorySeed = categorySeeds[category] || 1000;
        const seed = dayOfYear + categorySeed;
        const figureIndex = (seed * 31337) % figures.length;
        
        return figures[figureIndex];
    }
    
    /**
     * 점수 그룹에 맞는 행동 조언 선택
     */
    getActionAdvice(zodiacId, date, targetScoreGroup) {
        if (!this.historicalFiguresAdvice || !this.historicalFiguresAdvice.zodiacAdvice) {
            console.log('📋 조언 데이터 없음, 기본 조언 사용');
            return this.getDefaultActionAdvice(targetScoreGroup);
        }
        
        const zodiacKey = this.zodiacEnglishNames[zodiacId];
        const zodiacAdviceData = this.historicalFiguresAdvice.zodiacAdvice[zodiacKey];
        
        if (!zodiacAdviceData || !zodiacAdviceData.figures || zodiacAdviceData.figures.length === 0) {
            console.log(`📋 ${zodiacKey} 별자리 조언 데이터 없음`);
            return this.getDefaultActionAdvice(targetScoreGroup);
        }
        
        // 해당 점수 그룹의 인물들만 필터링
        const targetGroupFigures = zodiacAdviceData.figures.filter(figure => 
            figure.scoreGroup === targetScoreGroup
        );
        
        if (targetGroupFigures.length === 0) {
            console.log(`⚠️ ${zodiacKey}에 ${targetScoreGroup} 그룹 조언 없음, 전체에서 선택`);
            // 폴백: 전체 인물에서 선택
            return this.selectAdviceFromAll(zodiacAdviceData.figures, date);
        }
        
        // 시드 기반 랜덤 선택 (advice 카테고리용)
        const dateObj = new Date(date);
        const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 86400000);
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const timeSeed = (currentHour * 60) + currentMinute;
        
        const seed = dayOfYear + 8500 + (zodiacId * 100) + timeSeed; // 8500은 advice 카테고리 시드
        const figureIndex = (seed * 31337) % targetGroupFigures.length;
        
        const selectedFigure = targetGroupFigures[figureIndex];
        
        console.log(`🎯 ${zodiacKey} ${targetScoreGroup} 그룹 조언 선택: ${selectedFigure.name} - "${selectedFigure.actionAdvice}"`);
        
        return selectedFigure.actionAdvice;
    }
    
    /**
     * 폴백용 조언 선택 (점수 그룹 무관)
     */
    selectAdviceFromAll(figures, date) {
        const dateObj = new Date(date);
        const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 86400000);
        
        const seed = dayOfYear + 8500; // advice 카테고리 시드
        const figureIndex = (seed * 31337) % figures.length;
        
        return figures[figureIndex].actionAdvice;
    }
    
    /**
     * 점수 그룹별 기본 조언
     */
    getDefaultActionAdvice(scoreGroup) {
        const defaultAdvice = {
            high: [
                "새로운 도전에 용기 있게 나서보세요",
                "리더십을 발휘할 기회를 만들어보세요",
                "더 높은 목표를 설정하고 계획을 세워보세요",
                "창의적인 아이디어를 실행에 옮겨보세요"
            ],
            medium: [
                "가족이나 친구들과 따뜻한 시간을 보내보세요",
                "규칙적인 운동 습관을 만들어보세요",
                "새로운 취미나 관심사를 탐구해보세요",
                "균형잡힌 일상 루틴을 만들어보세요"
            ],
            low: [
                "충분한 휴식을 취하고 마음의 평화를 찾아보세요",
                "기본으로 돌아가 차근차근 정리해보세요",
                "자신에게 친절하게 대해주세요",
                "작은 성취라도 인정하고 격려해보세요"
            ]
        };
        
        const adviceList = defaultAdvice[scoreGroup] || defaultAdvice.medium;
        const randomIndex = Math.floor(Math.random() * adviceList.length);
        
        return adviceList[randomIndex];
    }
    
    /**
     * 한글 글자의 종성 여부 확인
     */
    hasJongsung(char) {
        if (!char || char.length === 0) return false;
        const code = char.charCodeAt(0);
        if (code >= 0xAC00 && code <= 0xD7AF) {
            const jongsung = (code - 0xAC00) % 28;
            return jongsung !== 0;
        }
        return false;
    }
    
    /**
     * 한국어 조사 교정
     */
    fixKoreanPostpositions(text) {
        if (!text) return text;
        
        let correctedText = text;
        
        // 올바른 표현들 (수정하지 않아야 할 패턴들)
        const protectedPatterns = [
            /양자리와/g, /황소자리와/g, /쌍둥이자리와/g, /게자리와/g, 
            /사자자리와/g, /처녀자리와/g, /천칭자리와/g, /전갈자리와/g, 
            /사수자리와/g, /염소자리와/g, /물병자리와/g, /물고기자리와/g
        ];
        
        // 실제 오류 패턴들 (수정해야 할 것들)
        const errorPatterns = [
            { pattern: /양자리과/g, correct: '양자리와' },
            { pattern: /황소자리과/g, correct: '황소자리와' },
            { pattern: /쌍둥이자리과/g, correct: '쌍둥이자리와' },
            { pattern: /게자리과/g, correct: '게자리와' },
            { pattern: /사자자리과/g, correct: '사자자리와' },
            { pattern: /처녀자리과/g, correct: '처녀자리와' },
            { pattern: /천칭자리과/g, correct: '천칭자리와' },
            { pattern: /전갈자리과/g, correct: '전갈자리와' },
            { pattern: /사수자리과/g, correct: '사수자리와' },
            { pattern: /염소자리과/g, correct: '염소자리와' },
            { pattern: /물병자리과/g, correct: '물병자리와' },
            { pattern: /물고기자리과/g, correct: '물고기자리와' }
        ];
        
        // 실제 오류만 수정
        for (const errorFix of errorPatterns) {
            if (correctedText.match(errorFix.pattern)) {
                console.log(`🔧 조사 오류 수정: ${errorFix.pattern.source} → ${errorFix.correct}`);
                correctedText = correctedText.replace(errorFix.pattern, errorFix.correct);
            }
        }
        
        // 기타 일반적인 조사 오류 수정 (더 신중하게)
        const generalErrorPatterns = [
            { pattern: /([가-힣])을(\s)/g, handler: (match, char, space) => {
                return this.hasJongsung(char) ? char + '을' + space : char + '를' + space;
            }},
            { pattern: /([가-힣])이(\s)/g, handler: (match, char, space) => {
                return this.hasJongsung(char) ? char + '이' + space : char + '가' + space;
            }},
            { pattern: /([가-힣])은(\s)/g, handler: (match, char, space) => {
                return this.hasJongsung(char) ? char + '은' + space : char + '는' + space;
            }}
        ];
        
        for (const generalFix of generalErrorPatterns) {
            correctedText = correctedText.replace(generalFix.pattern, generalFix.handler);
        }
        
        return correctedText;
    }
    
    /**
     * 메시지 품질 보장
     */
    ensureMessageQuality(message, maxRetries = 3) {
        if (!this.messageFilter || !message) {
            return message || "긍정적인 변화와 성장의 기회가 있을 것입니다.";
        }
        
        // 1. 한국어 조사 교정
        let enhancedMessage = this.fixKoreanPostpositions(message);
        
        // 2. 간단한 품질 검증
        const lowerMessage = enhancedMessage.toLowerCase();
        
        // 3. 차단된 키워드 검사
        for (const term of this.messageFilter.blockedTerms) {
            if (lowerMessage.includes(term.toLowerCase())) {
                console.log(`🚫 부정적 키워드 "${term}" 발견, 안전 메시지 사용`);
                return "긍정적인 에너지와 좋은 기회가 함께할 것입니다.";
            }
        }
        
        // 4. 긍정적 표현으로 변환
        for (const [negative, positive] of Object.entries(this.messageFilter.positiveReplacements)) {
            const regex = new RegExp(negative, 'gi');
            enhancedMessage = enhancedMessage.replace(regex, positive);
        }
        
        // 5. 추가적인 문법 정리
        enhancedMessage = enhancedMessage
            .replace(/\s+/g, ' ')  // 중복 공백 제거
            .trim();  // 앞뒤 공백 제거
        
        return enhancedMessage;
    }
    
    /**
     * 일일 운세 가져오기 - 점수 기반 인물 선택 적용
     */
    async getDailyFortune(zodiacId) {
        console.log('🌟 getDailyFortune() 호출됨 (점수 기반 버전)');
        console.log('📝 요청 파라미터:', { zodiacId, zodiacIdType: typeof zodiacId });
        
        // 데이터가 아직 로드되지 않았으면 기다림
        if (!this.fortuneData) {
            console.log('⏳ fortuneData 로드 대기...');
            await this.loadFortuneData();
        }
        
        if (!this.historicalFigures) {
            console.log('⏳ historicalFigures 로드 대기...');
            await this.loadHistoricalFigures();
        }
        
        if (!this.historicalFiguresAdvice) {
            console.log('⏳ historicalFiguresAdvice 로드 대기...');
            await this.loadHistoricalFiguresAdvice();
        }
        
        const today = new Date().toISOString().split('T')[0];
        console.log('📅 오늘 날짜:', today);
        
        // fortune-data.json에서 기본 데이터 찾기
        let fortuneData = null;
        
        if (this.fortuneData.daily[today] && this.fortuneData.daily[today][zodiacId]) {
            fortuneData = this.fortuneData.daily[today][zodiacId];
            console.log('✅ 오늘 날짜 fortune 데이터 발견!');
        } else {
            // 폴백 로직
            console.log('⚠️ 오늘 날짜 데이터 없음, 폴백 로직 시작...');
            
            const fallbackDate = '2025-01-01';
            const availableDates = Object.keys(this.fortuneData.daily).sort();
            
            let useDate = fallbackDate;
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getDate();
            
            // 같은 월일 찾기
            for (const date of availableDates) {
                const [year, month, day] = date.split('-').map(Number);
                if (month === currentMonth && day === currentDay) {
                    useDate = date;
                    console.log('🎉 같은 월일 발견:', useDate);
                    break;
                }
            }
            
            if (this.fortuneData.daily[useDate] && this.fortuneData.daily[useDate][zodiacId]) {
                fortuneData = this.fortuneData.daily[useDate][zodiacId];
                console.log('✅ 폴백 fortune 데이터 사용:', useDate);
            }
        }
        
        if (fortuneData && fortuneData.scores) {
            console.log('📊 Fortune 데이터 발견, 점수 기반 인물 선택 시작');
            
            // 1. 카테고리 점수 평균 계산
            const averageScore = this.calculateAverageScore(fortuneData.scores);
            
            // 2. 평균 점수에 따른 그룹 결정  
            const targetScoreGroup = this.determineScoreGroup(averageScore);
            
            console.log(`🎯 평균 점수 ${averageScore}점 → ${targetScoreGroup} 그룹 인물 선택`);
            
            // 3. 해당 그룹에서 인물들 선택 (카테고리별 다른 인물)
            const enhancedFortunes = {};
            const selectedFigures = {};
            
            if (fortuneData.fortunes) {
                for (const [category, message] of Object.entries(fortuneData.fortunes)) {
                    const categoryFigure = this.selectFigureByScoreGroup(zodiacId, today, category, targetScoreGroup);
                    
                    if (categoryFigure && categoryFigure.naturalTemplates && categoryFigure.naturalTemplates[category]) {
                        enhancedFortunes[category] = this.ensureMessageQuality(categoryFigure.naturalTemplates[category]);
                        selectedFigures[category] = categoryFigure.name;
                        console.log(`✅ ${category}: ${categoryFigure.name}의 템플릿 사용`);
                    } else {
                        enhancedFortunes[category] = this.ensureMessageQuality(message);
                        console.log(`📝 ${category}: 기본 메시지 사용`);
                    }
                }
            }
            
            // 4. overall과 advice 선택 (새로운 조언 시스템 적용)
            const overallFigure = this.selectFigureByScoreGroup(zodiacId, today, 'overall', targetScoreGroup);
            let safeOverall;
            if (overallFigure && overallFigure.naturalTemplates) {
                const availableTemplate = overallFigure.naturalTemplates.overall || 
                                        overallFigure.naturalTemplates.love ||
                                        Object.values(overallFigure.naturalTemplates)[0];
                safeOverall = this.ensureMessageQuality(availableTemplate);
                selectedFigures['overall'] = overallFigure.name;
            } else {
                safeOverall = this.ensureMessageQuality(fortuneData.overall);
            }
            
            // 새로운 행동 조언 시스템 적용
            console.log('💡 새로운 행동 조언 시스템 적용 중...');
            const actionAdvice = this.getActionAdvice(zodiacId, today, targetScoreGroup);
            const safeAdvice = this.ensureMessageQuality(actionAdvice);
            selectedFigures['advice'] = '행동 조언 시스템';
            
            // 5. 점수 그룹 정보를 포함한 응답 생성
            return {
                zodiacId: zodiacId,
                date: today,
                overall: safeOverall,
                scores: fortuneData.scores,
                averageScore: averageScore,
                scoreGroup: targetScoreGroup,
                scoreGroupLabel: this.scoreRanges[targetScoreGroup].label,
                fortunes: enhancedFortunes,
                lucky: fortuneData.lucky,
                advice: safeAdvice,
                selectedFigures: selectedFigures,
                source: 'score-based-enhanced'
            };
        } else {
            console.log('🔧 Fortune 데이터 없음, 기본 생성');
            return this.generateDailyFortune(zodiacId);
        }
    }
    
    /**
     * 기본 운세 데이터 생성 (폴백용)
     */
    generateDailyFortune(zodiacId) {
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
            scores: { love: 75, money: 70, work: 80, health: 75 },
            averageScore: 75,
            scoreGroup: 'medium',
            scoreGroupLabel: this.scoreRanges.medium.label,
            fortunes: {
                love: this.ensureMessageQuality(safeMessages.love),
                money: this.ensureMessageQuality(safeMessages.money),
                work: this.ensureMessageQuality(safeMessages.work),
                health: this.ensureMessageQuality(safeMessages.health)
            },
            lucky: { color: "파랑", number: 7, time: "오후 2-4시" },
            advice: this.ensureMessageQuality(this.getDefaultActionAdvice('medium')),
            source: 'generated-fallback-with-score-info'
        };
    }
    
    // 기존 다른 메서드들은 zodiac-api-final.js와 동일하게 유지
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
    
    getZodiacByDate(month, day) {
        const zodiacId = this.getZodiacId(month, day);
        return this.zodiacSigns[zodiacId - 1];
    }
    
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

    // 주간 운세 가져오기
    async getWeeklyFortune(zodiacId, date = null) {
        try {
            const targetDate = date ? new Date(date) : new Date();
            const weekKey = this.getWeekKey(targetDate);
            
            if (this.fortuneData.weekly && this.fortuneData.weekly[weekKey] && this.fortuneData.weekly[weekKey][zodiacId]) {
                return this.fortuneData.weekly[weekKey][zodiacId];
            }
            
            // 폴백 처리
            return this.createFallbackWeeklyFortune(zodiacId, weekKey);
        } catch (error) {
            console.error('주간 운세 조회 오류:', error);
            return this.createFallbackWeeklyFortune(zodiacId, 'current');
        }
    }

    // 월간 운세 가져오기
    async getMonthlyFortune(zodiacId, date = null) {
        try {
            const targetDate = date ? new Date(date) : new Date();
            const monthKey = this.getMonthKey(targetDate);
            
            if (this.fortuneData.monthly && this.fortuneData.monthly[monthKey] && this.fortuneData.monthly[monthKey][zodiacId]) {
                return this.fortuneData.monthly[monthKey][zodiacId];
            }
            
            // 폴백 처리
            return this.createFallbackMonthlyFortune(zodiacId, monthKey);
        } catch (error) {
            console.error('월간 운세 조회 오류:', error);
            return this.createFallbackMonthlyFortune(zodiacId, 'current');
        }
    }

    // 연간 운세 가져오기
    async getYearlyFortune(zodiacId, year = null) {
        try {
            if (this.fortuneData.yearly && this.fortuneData.yearly[zodiacId]) {
                return this.fortuneData.yearly[zodiacId];
            }
            
            // 폴백 처리
            return this.createFallbackYearlyFortune(zodiacId, year || new Date().getFullYear());
        } catch (error) {
            console.error('연간 운세 조회 오류:', error);
            return this.createFallbackYearlyFortune(zodiacId, year || new Date().getFullYear());
        }
    }

    // 주차 키 생성
    getWeekKey(date) {
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    }

    // 월 키 생성
    getMonthKey(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    // 폴백 주간 운세
    createFallbackWeeklyFortune(zodiacId, weekKey) {
        const zodiacName = this.zodiacSigns[zodiacId - 1].name;
        return {
            weekStart: new Date().toISOString().split('T')[0],
            weekEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            theme: `${zodiacName}의 주간 운세`,
            overall: `이번 주 ${zodiacName}에게는 새로운 기회와 도전이 기다리고 있습니다.`,
            fortunes: {
                love: `${zodiacName}의 매력이 빛나는 주간입니다.`,
                money: '경제적 안정을 위한 계획을 세우기 좋은 시기입니다.',
                work: '업무에서 좋은 성과를 기대할 수 있습니다.',
                health: '건강 관리에 신경 쓰시기 바랍니다.'
            },
            scores: { love: 75, money: 70, work: 80, health: 75 },
            lucky: { color: '파란색', number: 7, time: '오후 시간' },
            advice: `${zodiacName}답게 이번 주를 의미있게 보내세요.`
        };
    }

    // 폴백 월간 운세
    createFallbackMonthlyFortune(zodiacId, monthKey) {
        const zodiacName = this.getZodiacSign(zodiacId).name;
        return {
            theme: `${zodiacName}의 월간 운세`,
            overall: `이번 달 ${zodiacName}에게는 성장과 발전의 기회가 많이 있습니다.`,
            fortunes: {
                love: `${zodiacName}의 사랑운이 상승하는 달입니다.`,
                money: '재정 관리에 대한 새로운 관점을 얻을 수 있습니다.',
                work: '직장에서의 성과가 기대되는 시기입니다.',
                health: '전반적인 건강 상태가 좋아집니다.'
            },
            scores: { love: 80, money: 75, work: 85, health: 80 },
            lucky: { color: '초록색', number: 3, time: '저녁 시간' },
            advice: `${zodiacName}다운 지혜로 이번 달을 풍요롭게 만드세요.`
        };
    }

    // 폴백 연간 운세
    createFallbackYearlyFortune(zodiacId, year) {
        const zodiacName = this.getZodiacSign(zodiacId).name;
        return {
            year: year,
            theme: `${zodiacName}의 ${year}년`,
            overall: `${year}년은 ${zodiacName}에게 큰 변화와 성장의 해가 될 것입니다.`,
            fortunes: {
                love: `올해 ${zodiacName}의 사랑은 더욱 깊어질 것입니다.`,
                money: '재정적 안정과 성장을 이룰 수 있는 해입니다.',
                work: '커리어에서 중요한 전환점을 맞을 것입니다.',
                health: '건강한 생활 습관을 통해 활력을 되찾는 해입니다.'
            },
            scores: { love: 85, money: 80, work: 90, health: 85 },
            lucky: { color: '금색', number: 1, season: '봄' },
            advice: `${zodiacName}의 특성을 살려 올해를 특별하게 만드세요.`
        };
    }

    // 궁합 확인 함수
    async getCompatibility(zodiac1Id, zodiac2Id) {
        console.log('🔍 getCompatibility 호출됨:', {zodiac1Id, zodiac2Id});
        
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        // 작은 ID가 먼저 오도록 정규화
        const minId = Math.min(zodiac1Id, zodiac2Id);
        const maxId = Math.max(zodiac1Id, zodiac2Id);
        const compatKey = `${minId}-${maxId}`;
        
        // JSON에서 궁합 데이터 찾기
        let jsonData = null;
        if (this.fortuneData.compatibility && this.fortuneData.compatibility[compatKey]) {
            jsonData = this.fortuneData.compatibility[compatKey];
            console.log('✅ 궁합 데이터 발견:', compatKey);
        } else {
            console.log('❌ 궁합 데이터 없음:', compatKey);
        }
        
        // 궁합 설명 결정
        let displayText = null;
        let creativeText = null;
        
        // zodiacDescriptions에서 창의적 텍스트 찾기
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
                
                // 두 번째 별자리의 궁합 텍스트 확인
                if (!creativeText && zodiac2Data?.compatibility) {
                    const zodiac1Name = this.zodiacSigns[zodiac1Id - 1]?.name;
                    if (zodiac1Name && zodiac2Data.compatibility.includes(zodiac1Name)) {
                        creativeText = zodiac2Data.compatibility;
                        console.log('✅ 창의적 텍스트 발견 (zodiac2 기준)');
                    }
                }
            }
            
            // 창의적 텍스트가 있으면 사용
            if (creativeText) {
                displayText = this.ensureMessageQuality(creativeText);
                console.log('🎨 창의적 텍스트 사용');
            } else if (jsonData?.description) {
                displayText = this.ensureMessageQuality(jsonData.description);
                console.log('✅ JSON 설명 사용');
            } else {
                displayText = this.ensureMessageQuality("좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다.");
                console.log('📋 기본 메시지 사용');
            }
        } catch (error) {
            console.error('❌ 궁합 텍스트 처리 중 오류:', error);
            displayText = this.ensureMessageQuality("좋은 궁합입니다. 서로를 이해하고 배려하는 마음이 중요합니다.");
        }
        
        // 데이터 반환
        if (jsonData) {
            return {
                zodiac1Id: zodiac1Id,
                zodiac2Id: zodiac2Id,
                totalScore: jsonData.totalScore || jsonData.score || 75,
                scores: jsonData.scores || {
                    love: jsonData.love || 75,
                    friendship: jsonData.friendship || 75,
                    work: jsonData.work || 75
                },
                description: displayText,
                creativeDescription: creativeText,
                advice: this.ensureMessageQuality(jsonData.advice || "서로를 이해하고 배려하는 마음이 중요합니다."),
                source: creativeText ? 'hybrid' : 'json'
            };
        } else {
            // 폴백 데이터 생성
            console.log('🔧 폴백 궁합 데이터 생성');
            const zodiac1Name = this.zodiacSigns[zodiac1Id - 1]?.name;
            const zodiac2Name = this.zodiacSigns[zodiac2Id - 1]?.name;
            
            return {
                zodiac1Id: zodiac1Id,
                zodiac2Id: zodiac2Id,
                totalScore: 75,
                scores: {
                    love: 70 + Math.floor(Math.random() * 20),
                    friendship: 70 + Math.floor(Math.random() * 20),
                    work: 70 + Math.floor(Math.random() * 20)
                },
                description: displayText || `${zodiac1Name}와 ${zodiac2Name}는 서로를 보완하는 좋은 관계입니다.`,
                creativeDescription: creativeText,
                advice: this.ensureMessageQuality("서로의 장점을 인정하고 단점을 보완하며 성장하세요."),
                source: 'fallback'
            };
        }
    }
}

// 전역 인스턴스 생성
const zodiacAPI = new ZodiacAPIReal();