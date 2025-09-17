/**
 * 별자리 운세 API - 점수 기반 인물 그룹 선택 시스템
 * 카테고리 점수 평균에 따라 해당 점수 그룹의 인물만 선택하여 메시지 톤 일관성 확보
 * 
 * 점수 구간별 인물 그룹:
 * - 85점 이상: 고득점 그룹 (성공적/긍정적 인물) 88명
 * - 70-84점: 중간점 그룹 (균형적/안정적 인물) 112명  
 * - 69점 이하: 저득점 그룹 (도전적/극복형 인물) 40명
 */

class ZodiacAPIScoreEnhanced {
    constructor() {
        this.fortuneData = null;
        this.historicalFigures = null;
        this.messageFilter = null;
        this.loadFortuneData();
        this.loadHistoricalFigures();
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
     * 메시지 품질 보장
     */
    ensureMessageQuality(message, maxRetries = 3) {
        if (!this.messageFilter || !message) {
            return message || "긍정적인 변화와 성장의 기회가 있을 것입니다.";
        }
        
        // 간단한 품질 검증
        const lowerMessage = message.toLowerCase();
        
        // 차단된 키워드 검사
        for (const term of this.messageFilter.blockedTerms) {
            if (lowerMessage.includes(term.toLowerCase())) {
                console.log(`🚫 부정적 키워드 "${term}" 발견, 안전 메시지 사용`);
                return "긍정적인 에너지와 좋은 기회가 함께할 것입니다.";
            }
        }
        
        // 긍정적 표현으로 변환
        let enhancedMessage = message;
        for (const [negative, positive] of Object.entries(this.messageFilter.positiveReplacements)) {
            const regex = new RegExp(negative, 'gi');
            enhancedMessage = enhancedMessage.replace(regex, positive);
        }
        
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
            
            // 4. overall과 advice도 같은 그룹에서 선택
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
            
            const adviceFigure = this.selectFigureByScoreGroup(zodiacId, today, 'advice', targetScoreGroup);
            let safeAdvice;
            if (adviceFigure && adviceFigure.naturalTemplates) {
                const availableTemplate = adviceFigure.naturalTemplates.health || 
                                        adviceFigure.naturalTemplates.advice ||
                                        Object.values(adviceFigure.naturalTemplates)[0];
                safeAdvice = this.ensureMessageQuality(availableTemplate);
                selectedFigures['advice'] = adviceFigure.name;
            } else {
                safeAdvice = this.ensureMessageQuality(fortuneData.advice);
            }
            
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
            advice: this.ensureMessageQuality(safeMessages.advice),
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
}

// 전역 인스턴스 생성
const zodiacAPI = new ZodiacAPIScoreEnhanced();