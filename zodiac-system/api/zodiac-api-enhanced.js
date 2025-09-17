/**
 * 별자리 운세 API - 역사적 인물 데이터베이스 활용 확장 버전
 * historical-figures-enhanced.json을 활용한 풍부한 메시지 생성
 */
class ZodiacAPIEnhanced {
    constructor() {
        this.fortuneData = null;
        this.historicalFigures = null;
        this.loadFortuneData();
        this.loadHistoricalFigures();
        
        // 별자리 정보 배열 (기존 유지)
        this.zodiacSigns = [
            { id: 1, name: '양자리', symbol: '♈', start: '3.21', end: '4.19', key: 'aries' },
            { id: 2, name: '황소자리', symbol: '♉', start: '4.20', end: '5.20', key: 'taurus' },
            { id: 3, name: '쌍둥이자리', symbol: '♊', start: '5.21', end: '6.20', key: 'gemini' },
            { id: 4, name: '게자리', symbol: '♋', start: '6.21', end: '7.22', key: 'cancer' },
            { id: 5, name: '사자자리', symbol: '♌', start: '7.23', end: '8.22', key: 'leo' },
            { id: 6, name: '처녀자리', symbol: '♍', start: '8.23', end: '9.22', key: 'virgo' },
            { id: 7, name: '천칭자리', symbol: '♎', start: '9.23', end: '10.22', key: 'libra' },
            { id: 8, name: '전갈자리', symbol: '♏', start: '10.23', end: '11.21', key: 'scorpio' },
            { id: 9, name: '사수자리', symbol: '♐', start: '11.22', end: '12.21', key: 'sagittarius' },
            { id: 10, name: '염소자리', symbol: '♑', start: '12.22', end: '1.19', key: 'capricorn' },
            { id: 11, name: '물병자리', symbol: '♒', start: '1.20', end: '2.18', key: 'aquarius' },
            { id: 12, name: '물고기자리', symbol: '♓', start: '2.19', end: '3.20', key: 'pisces' }
        ];
        
        // 카테고리별 메시지 템플릿
        this.messageTemplates = {
            work: [
                "{figure}의 {trait}처럼 {specific}하는 하루를 보내세요",
                "{specific}로 {figure}가 {achievement}를 이룬 것처럼 성공하세요",
                "오늘은 {figure}의 '{quote}' 정신으로 업무에 임하세요"
            ],
            love: [
                "{figure}의 {trait}로 사랑을 표현하는 날입니다",
                "{specific}한 마음으로 {figure}처럼 진실한 사랑을 나누세요",
                "오늘의 사랑은 {figure}가 보여준 {trait}와 같은 깊이를 가질 것입니다"
            ],
            money: [
                "{figure}의 {trait}로 {specific}한 재정 관리를 하세요",
                "{achievement}를 이룬 {figure}처럼 현명한 투자를 고려해보세요",
                "오늘은 {figure}의 경제 철학을 참고해 {specific}하게 행동하세요"
            ],
            health: [
                "{figure}의 {trait}로 {specific}한 건강 관리를 하세요",
                "{achievement}를 위해 건강을 중시한 {figure}처럼 자신을 돌보세요",
                "오늘은 {figure}의 '{quote}' 마음가짐으로 건강한 하루를 보내세요"
            ]
        };
    }

    /**
     * 기존 운세 데이터 로드
     */
    async loadFortuneData() {
        console.log('🔄 Enhanced API - Fortune data loading...');
        try {
            const response = await fetch('../api/fortune-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.fortuneData = await response.json();
            console.log('✅ Fortune data loaded successfully');
        } catch (error) {
            console.error('❌ Fortune data loading failed:', error);
            // 폴백 데이터
            this.fortuneData = {
                daily: {},
                yearly: {},
                weekly: {},
                monthly: {},
                compatibility: {}
            };
        }
    }

    /**
     * 역사적 인물 데이터 로드
     */
    async loadHistoricalFigures() {
        console.log('🔄 Enhanced API - Historical figures loading...');
        try {
            const response = await fetch('../historical-figures-enhanced.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.historicalFigures = await response.json();
            console.log('✅ Historical figures data loaded successfully');
            console.log('📊 Loaded figures for', Object.keys(this.historicalFigures.zodiacFigures).length, 'zodiac signs');
        } catch (error) {
            console.error('❌ Historical figures loading failed:', error);
            // 기본 API로 폴백
            this.historicalFigures = null;
        }
    }

    /**
     * 날짜 기반 인물 선택 로직
     * 매일 다른 인물이 선택되도록 로테이션
     */
    selectHistoricalFigure(zodiacId, date = null) {
        if (!this.historicalFigures) {
            return null;
        }

        const zodiacKey = this.zodiacSigns[zodiacId - 1]?.key;
        if (!zodiacKey || !this.historicalFigures.zodiacFigures[zodiacKey]) {
            return null;
        }

        const figures = this.historicalFigures.zodiacFigures[zodiacKey].figures;
        if (!figures || figures.length === 0) {
            return null;
        }

        // 날짜 기반 로테이션 (매일 다른 인물)
        const currentDate = date || new Date();
        const dayOfYear = this.getDayOfYear(currentDate);
        const figureIndex = dayOfYear % figures.length;
        
        return figures[figureIndex];
    }

    /**
     * 년중 일자 계산 (1-365/366)
     */
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * 카테고리별 향상된 메시지 생성
     */
    generateEnhancedMessage(category, figure, zodiacId) {
        if (!figure || !this.messageTemplates[category]) {
            return null;
        }

        const templates = this.messageTemplates[category];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // 인물 정보에서 랜덤 선택
        const trait = figure.coreTraits[Math.floor(Math.random() * figure.coreTraits.length)];
        const achievement = figure.achievements[Math.floor(Math.random() * figure.achievements.length)];
        const categoryTrait = figure.categoryTraits[category];
        const quote = figure.famousQuote;
        
        // 카테고리별 구체적인 행동 지침
        const specificActions = {
            work: ['체계적으로', '창의적으로', '도전적으로', '협력하여', '혁신적으로'],
            love: ['진실한', '따뜻한', '이해하는', '배려하는', '헌신적인'],
            money: ['신중하게', '계획적으로', '현명하게', '장기적으로', '균형 있게'],
            health: ['규칙적인', '활기찬', '균형 잡힌', '긍정적인', '건강한']
        };
        
        const specific = specificActions[category][Math.floor(Math.random() * specificActions[category].length)];

        // 템플릿 변수 치환
        let message = template
            .replace('{figure}', figure.name)
            .replace('{trait}', trait)
            .replace('{achievement}', achievement.split(' - ')[0]) // 업적명만 추출
            .replace('{specific}', specific)
            .replace('{quote}', quote);

        return message;
    }

    /**
     * 향상된 일일 운세 생성
     */
    async getDailyFortuneEnhanced(zodiacId) {
        console.log('🌟 Enhanced getDailyFortune() called for zodiac:', zodiacId);
        
        // 데이터 로딩 확인
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        if (!this.historicalFigures) {
            await this.loadHistoricalFigures();
        }

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // 기존 데이터 확인
        let baseFortune = null;
        if (this.fortuneData.daily[todayString] && this.fortuneData.daily[todayString][zodiacId]) {
            baseFortune = this.fortuneData.daily[todayString][zodiacId];
        } else {
            // 폴백: 날짜별 매칭 로직 (기존 API와 동일)
            baseFortune = await this.findFallbackFortune(zodiacId, today);
        }

        // 역사적 인물 선택
        const selectedFigure = this.selectHistoricalFigure(zodiacId, today);
        
        if (selectedFigure) {
            console.log('👑 Selected historical figure:', selectedFigure.name);
            
            // 향상된 메시지로 교체
            const enhancedFortune = {
                ...baseFortune,
                zodiacId: zodiacId,
                date: todayString,
                historicalFigure: {
                    name: selectedFigure.name,
                    nameEn: selectedFigure.nameEn,
                    period: selectedFigure.period,
                    country: selectedFigure.country,
                    quote: selectedFigure.famousQuote
                }
            };

            // overall 메시지 향상
            enhancedFortune.overall = `${selectedFigure.name}(${selectedFigure.period})의 ${selectedFigure.coreTraits[0]} 정신으로 오늘을 시작하세요. ${selectedFigure.achievements[0]}`;

            // 카테고리별 메시지 향상
            const categories = ['love', 'money', 'work', 'health'];
            for (const category of categories) {
                const enhancedMessage = this.generateEnhancedMessage(category, selectedFigure, zodiacId);
                if (enhancedMessage && enhancedFortune.fortunes) {
                    enhancedFortune.fortunes[category] = enhancedMessage;
                }
            }

            // advice를 인물의 명언으로 교체
            enhancedFortune.advice = `"${selectedFigure.famousQuote}" - ${selectedFigure.name}`;
            enhancedFortune.source = 'enhanced-with-historical-figure';
            
            console.log('✨ Enhanced fortune generated with historical figure');
            return enhancedFortune;
        } else {
            // 역사적 인물 데이터가 없으면 기존 데이터 반환
            console.log('⚠️ No historical figure data, using base fortune');
            return {
                ...baseFortune,
                zodiacId: zodiacId,
                date: todayString,
                source: 'base-fallback'
            };
        }
    }

    /**
     * 폴백 운세 데이터 찾기 (기존 로직)
     */
    async findFallbackFortune(zodiacId, today) {
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        const availableDates = Object.keys(this.fortuneData.daily).sort();
        
        // 같은 월일 찾기
        for (const date of availableDates) {
            const [year, month, day] = date.split('-').map(Number);
            if (month === currentMonth && day === currentDay) {
                if (this.fortuneData.daily[date][zodiacId]) {
                    return this.fortuneData.daily[date][zodiacId];
                }
            }
        }
        
        // 같은 일자 찾기
        for (const date of availableDates) {
            const day = parseInt(date.split('-')[2]);
            if (day === currentDay) {
                if (this.fortuneData.daily[date][zodiacId]) {
                    return this.fortuneData.daily[date][zodiacId];
                }
            }
        }
        
        // 최종 폴백: 기본 데이터 생성
        return this.generateBasicFortune(zodiacId);
    }

    /**
     * 기본 운세 생성 (최종 폴백)
     */
    generateBasicFortune(zodiacId) {
        const zodiacInfo = this.zodiacSigns[zodiacId - 1];
        return {
            overall: `${zodiacInfo.name}에게 특별한 하루가 될 것입니다.`,
            fortunes: {
                love: `${zodiacInfo.name}의 매력이 빛나는 날입니다.`,
                money: "경제적 안정의 시기입니다.",
                work: "성과를 만들어내는 하루가 될 것입니다.",
                health: "건강한 리듬을 유지하세요."
            },
            scores: {
                love: 75,
                money: 70,
                work: 80,
                health: 75
            },
            lucky: {
                color: "파랑",
                number: 7,
                time: "오후 시간"
            },
            advice: "긍정적인 마음으로 하루를 시작하세요!"
        };
    }

    // ========== 기존 API 메서드들 (호환성 유지) ==========

    /**
     * 별자리 ID 가져오기 (기존 동일)
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
     * 날짜로 별자리 가져오기 (기존 동일)
     */
    getZodiacByDate(month, day) {
        const zodiacId = this.getZodiacId(month, day);
        return this.zodiacSigns[zodiacId - 1];
    }

    /**
     * 기존 일일 운세 메서드 (하위 호환성)
     */
    async getDailyFortune(zodiacId) {
        // 향상된 버전을 기본으로 사용
        return await this.getDailyFortuneEnhanced(zodiacId);
    }

    /**
     * 별자리 정보 가져오기 (기존 동일)
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

    // 나머지 기존 메서드들도 동일하게 유지...
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

        return this.generateYearlyFortune(zodiacId);
    }

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
        
        return this.generateWeeklyFortune(zodiacId);
    }

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
        
        return this.generateMonthlyFortune(zodiacId);
    }

    async getCompatibility(zodiac1Id, zodiac2Id) {
        console.log('🔍 Enhanced getCompatibility called:', {zodiac1Id, zodiac2Id});
        
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        let jsonData = null;
        let compatKey = `${zodiac1Id}-${zodiac2Id}`;
        
        if (this.fortuneData.compatibility && this.fortuneData.compatibility[compatKey]) {
            jsonData = this.fortuneData.compatibility[compatKey];
        } else {
            compatKey = `${zodiac2Id}-${zodiac1Id}`;
            if (this.fortuneData.compatibility && this.fortuneData.compatibility[compatKey]) {
                jsonData = this.fortuneData.compatibility[compatKey];
            }
        }
        
        // 창의적 텍스트 처리 로직 (기존 동일)
        let creativeText = null;
        let displayText = null;
        
        try {
            if (typeof window !== 'undefined' && window.zodiacDescriptions && 
                typeof window.zodiacDescriptions === 'object') {
                
                const zodiac1Data = window.zodiacDescriptions[zodiac1Id];
                if (zodiac1Data && zodiac1Data.compatibility) {
                    const zodiac2Info = this.zodiacSigns[zodiac2Id - 1];
                    if (zodiac2Info && zodiac1Data.compatibility.includes(zodiac2Info.name)) {
                        creativeText = zodiac1Data.compatibility;
                    }
                }
                
                if (!creativeText) {
                    const zodiac2Data = window.zodiacDescriptions[zodiac2Id];
                    if (zodiac2Data && zodiac2Data.compatibility) {
                        const zodiac1Info = this.zodiacSigns[zodiac1Id - 1];
                        if (zodiac1Info && zodiac2Data.compatibility.includes(zodiac1Info.name)) {
                            creativeText = zodiac2Data.compatibility;
                        }
                    }
                }
                
                displayText = creativeText || jsonData?.description || "좋은 궁합입니다.";
            } else {
                displayText = jsonData?.description || "좋은 궁합입니다.";
            }
        } catch (error) {
            console.error('❌ Creative text processing error:', error);
            displayText = jsonData?.description || "좋은 궁합입니다.";
        }
        
        if (jsonData) {
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
                advice: jsonData.advice || "서로를 이해하고 배려하는 마음이 중요합니다.",
                source: creativeText ? 'hybrid' : 'json'
            };
        } else {
            const fallbackData = this.generateCompatibility(zodiac1Id, zodiac2Id);
            return {
                ...fallbackData,
                description: displayText,
                creativeDescription: creativeText,
                source: creativeText ? 'hybrid-generated' : 'generated'
            };
        }
    }

    // 기존 생성 메서드들...
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
                "좋은 인연입니다. 서로의 차이를 인정하면 행복한 관계가 될 수 있습니다",
            details: {
                love: `애정 궁합: ${score}점`,
                friendship: `우정 궁합: ${score + Math.floor(Math.random() * 10) - 5}점`,
                work: `업무 궁합: ${score + Math.floor(Math.random() * 10) - 5}점`
            },
            advice: "정기적으로 깊은 대화를 나누는 시간을 가지세요."
        };
    }

    // 유틸리티 메서드들
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
    
    getCurrentWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start + ((start.getDay() + 6) % 7) * 86400000;
        return Math.ceil(diff / 604800000);
    }
}

// 전역 인스턴스 생성 (기존과 동일한 변수명 유지)
const zodiacAPIEnhanced = new ZodiacAPIEnhanced();

// 하위 호환성을 위해 기존 변수명도 지원
const zodiacAPI = zodiacAPIEnhanced;