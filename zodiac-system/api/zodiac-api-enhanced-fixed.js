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
        
        // 카테고리별 메시지 템플릿 (한국어 조사 문제 수정)
        this.messageTemplates = {
            work: [
                "{figure}의 {trait}처럼 {specific} 업무에 임하세요",
                "{figure}가 {achievement}를 이룬 것처럼 {specific} 성과를 만들어보세요",
                "오늘은 {figure}의 '{quote}' 정신으로 업무에 집중하세요"
            ],
            love: [
                "{figure}의 {trait}처럼 {specific} 사랑을 나누세요",
                "{specific} 마음으로 {figure}처럼 진실한 관계를 만들어가세요",
                "오늘의 사랑은 {figure}가 보여준 {trait}와 같은 깊이를 가질 것입니다"
            ],
            money: [
                "{figure}의 {trait}처럼 {specific} 재정 관리를 하세요",
                "{achievement}를 이룬 {figure}처럼 현명한 투자를 고려해보세요",
                "오늘은 {figure}의 지혜를 참고해 {specific} 경제 활동을 하세요"
            ],
            health: [
                "{figure}의 {trait}처럼 {specific} 건강 관리를 하세요",
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
}

// 전역 인스턴스 생성 (기존과 동일한 변수명 유지)
const zodiacAPIEnhanced = new ZodiacAPIEnhanced();

// 하위 호환성을 위해 기존 변수명도 지원
const zodiacAPI = zodiacAPIEnhanced;