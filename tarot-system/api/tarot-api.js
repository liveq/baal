/**
 * RHEIGHT 타로카드 API 시스템
 * 78장의 타로카드와 다양한 스프레드를 관리하는 API 클래스
 */

class TarotAPI {
    constructor() {
        this.tarotData = null;
        this.spreadsData = null;
        this.isLoaded = false;
        this.loadData();
        
        // 전체 78장 카드 기본 정보
        this.allCards = [
            // Major Arcana (22장)
            ...this.generateMajorArcana(),
            // Minor Arcana (56장)
            ...this.generateMinorArcana()
        ];
    }
    
    // 메이저 아르카나 22장 기본 정보 생성
    generateMajorArcana() {
        const majorCards = [
            { id: 0, name: "바보", name_en: "The Fool" },
            { id: 1, name: "마법사", name_en: "The Magician" },
            { id: 2, name: "여제", name_en: "The High Priestess" },
            { id: 3, name: "황후", name_en: "The Empress" },
            { id: 4, name: "황제", name_en: "The Emperor" },
            { id: 5, name: "교황", name_en: "The Hierophant" },
            { id: 6, name: "연인", name_en: "The Lovers" },
            { id: 7, name: "전차", name_en: "The Chariot" },
            { id: 8, name: "정의", name_en: "Justice" },
            { id: 9, name: "은둔자", name_en: "The Hermit" },
            { id: 10, name: "운명의 수레바퀴", name_en: "Wheel of Fortune" },
            { id: 11, name: "힘", name_en: "Strength" },
            { id: 12, name: "매달린 사람", name_en: "The Hanged Man" },
            { id: 13, name: "죽음", name_en: "Death" },
            { id: 14, name: "절제", name_en: "Temperance" },
            { id: 15, name: "악마", name_en: "The Devil" },
            { id: 16, name: "탑", name_en: "The Tower" },
            { id: 17, name: "별", name_en: "The Star" },
            { id: 18, name: "달", name_en: "The Moon" },
            { id: 19, name: "태양", name_en: "The Sun" },
            { id: 20, name: "심판", name_en: "Judgement" },
            { id: 21, name: "세계", name_en: "The World" }
        ];
        
        return majorCards.map(card => ({
            ...card,
            suit: "major",
            type: "major"
        }));
    }
    
    // 마이너 아르카나 56장 기본 정보 생성
    generateMinorArcana() {
        const suits = [
            { name: "완드", name_en: "Wands", element: "fire" },
            { name: "컵", name_en: "Cups", element: "water" },
            { name: "소드", name_en: "Swords", element: "air" },
            { name: "펜타클", name_en: "Pentacles", element: "earth" }
        ];
        
        const numbers = [
            "에이스", "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "시종", "기사", "여왕", "왕"
        ];
        
        const cards = [];
        let cardId = 22; // Major Arcana 다음부터
        
        suits.forEach((suit, suitIndex) => {
            numbers.forEach((number, numberIndex) => {
                cards.push({
                    id: cardId++,
                    name: `${suit.name} ${number}`,
                    name_en: `${number} of ${suit.name_en}`,
                    suit: suit.name.toLowerCase(),
                    suit_en: suit.name_en.toLowerCase(),
                    number: numberIndex + 1,
                    element: suit.element,
                    type: "minor"
                });
            });
        });
        
        return cards;
    }
    
    // 데이터 파일 로드
    async loadData() {
        try {
            // 인라인 데이터 우선 확인 (경로 독립적)
            if (typeof window !== 'undefined' && window.TAROT_DATA_INLINE && window.SPREADS_DATA_INLINE) {
                this.tarotData = window.TAROT_DATA_INLINE;
                this.spreadsData = window.SPREADS_DATA_INLINE;
                this.isLoaded = true;
                console.log('타로카드 인라인 데이터 로드 완료');
                return;
            }
            
            // 인라인 데이터가 없으면 JSON 파일 로드 시도
            const tarotResponse = await fetch('/tarot-system/database/tarot_data.json');
            this.tarotData = await tarotResponse.json();
            
            const spreadsResponse = await fetch('/tarot-system/database/spreads_data.json');
            this.spreadsData = await spreadsResponse.json();
            
            this.isLoaded = true;
            console.log('타로카드 JSON 데이터 로드 완료');
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.isLoaded = false;
        }
    }
    
    // 랜덤 카드 선택 (중복 없음)
    drawRandomCards(count = 1, exclude = []) {
        const availableCards = this.allCards.filter(card => 
            !exclude.includes(card.id)
        );
        
        if (availableCards.length < count) {
            throw new Error('사용 가능한 카드가 부족합니다.');
        }
        
        const shuffled = [...availableCards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled.slice(0, count).map(card => ({
            ...card,
            isReversed: Math.random() < 0.3, // 30% 확률로 역방향
            position: null // 스프레드에서 설정
        }));
    }
    
    // 특정 카드 정보 가져오기
    getCardDetails(cardId) {
        // 메이저 아르카나에서 찾기
        const majorCard = this.tarotData?.majorArcana?.find(card => card.id === cardId);
        if (majorCard) return majorCard;
        
        // 마이너 아르카나에서 찾기
        for (const suit in this.tarotData?.minorArcana || {}) {
            const card = this.tarotData.minorArcana[suit].find(card => card.id === cardId);
            if (card) return card;
        }
        
        return null;
    }
    
    // 카드 해석 가져오기
    getCardInterpretation(cardId, isReversed = false, context = 'general') {
        const cardDetails = this.getCardDetails(cardId);
        if (!cardDetails) return null;
        
        const direction = isReversed ? 'reversed' : 'upright';
        const keywords = cardDetails.keywords?.[direction] || [];
        const meaning = cardDetails.meanings?.[direction] || '';
        
        let contextMeaning = '';
        if (context === 'love' && cardDetails.love) {
            contextMeaning = cardDetails.love[direction] || '';
        } else if (context === 'career' && cardDetails.career) {
            contextMeaning = cardDetails.career[direction] || '';
        }
        
        return {
            name: cardDetails.name,
            name_en: cardDetails.name_en,
            direction: isReversed ? '역방향' : '정방향',
            keywords,
            meaning,
            contextMeaning,
            isReversed
        };
    }
    
    // 스프레드 정보 가져오기
    getSpreadInfo(spreadType) {
        return this.spreadsData?.spreads?.[spreadType] || null;
    }
    
    // 완전한 스프레드 실행
    performSpread(spreadType) {
        const spreadInfo = this.getSpreadInfo(spreadType);
        if (!spreadInfo) {
            throw new Error('존재하지 않는 스프레드입니다.');
        }
        
        const drawnCards = this.drawRandomCards(spreadInfo.cards);
        const reading = {
            spreadType,
            spreadName: spreadInfo.name,
            description: spreadInfo.description,
            timestamp: new Date().toISOString(),
            cards: drawnCards.map((card, index) => {
                const position = spreadInfo.positions[index];
                const interpretation = this.getCardInterpretation(
                    card.id,
                    card.isReversed,
                    this.getContextFromSpread(spreadType)
                );
                
                return {
                    ...card,
                    position: position.name,
                    positionDescription: position.description,
                    interpretation
                };
            })
        };
        
        return reading;
    }
    
    // 스프레드 타입에 따른 컨텍스트 결정
    getContextFromSpread(spreadType) {
        switch (spreadType) {
            case 'love':
                return 'love';
            case 'career':
                return 'career';
            default:
                return 'general';
        }
    }
    
    // 모든 스프레드 목록 가져오기
    getAllSpreads() {
        return Object.keys(this.spreadsData?.spreads || {}).map(key => ({
            key,
            ...this.spreadsData.spreads[key]
        }));
    }
    
    // 오늘의 카드 (매일 같은 카드가 나오도록)
    getTodayCard() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000);
        
        // 날짜를 시드로 사용하여 일관된 랜덤값 생성
        const seed = dayOfYear % this.allCards.length;
        const todayCard = this.allCards[seed];
        
        // 날짜 기반으로 역방향 여부 결정 (30% 확률 유지)
        const isReversed = (dayOfYear % 10) < 3;
        
        const interpretation = this.getCardInterpretation(todayCard.id, isReversed);
        
        return {
            ...todayCard,
            isReversed,
            position: '오늘의 메시지',
            positionDescription: '오늘 하루를 위한 조언과 에너지',
            interpretation,
            date: today.toLocaleDateString('ko-KR')
        };
    }
    
    // DiceBear API를 사용한 카드 이미지 URL 생성
    getCardImagePath(cardId, isReversed = false) {
        // 카드별 고유 시드 생성 (카드 이름 + ID)
        const card = this.allCards.find(c => c.id === cardId);
        if (!card) return '';
        
        // 메이저 아르카나는 lorelei 스타일 (더 아티스틱)
        // 마이너 아르카나는 notionists 스타일 (추상적)
        const style = card.type === 'major' ? 'lorelei' : 'notionists';
        
        // 카드 수트별 색상 테마
        const colorThemes = {
            major: ['8B5CF6', '6366F1', '3B82F6'], // 보라-파랑 그라데이션
            wands: ['EF4444', 'F97316', 'FBBF24'], // 불 - 빨강/주황
            cups: ['3B82F6', '06B6D4', '10B981'],  // 물 - 파랑/청록
            swords: ['64748B', '94A3B8', 'CBD5E1'], // 공기 - 회색/실버
            pentacles: ['65A30D', '16A34A', '059669'] // 땅 - 초록
        };
        
        const suit = card.suit || 'major';
        const colors = colorThemes[suit] || colorThemes.major;
        const bgColor = colors[cardId % colors.length];
        
        // 역방향은 rotate 파라미터로 180도 회전 효과
        const rotation = isReversed ? '&rotate=180' : '';
        
        // DiceBear API URL 생성
        const seed = encodeURIComponent(card.name + cardId);
        // 역방향은 URL에서 rotate 파라미터 제거 (프론트엔드에서 CSS로 처리)
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bgColor}&size=200`;
    }
    
    // 카드 프레임용 심볼 이미지 URL 생성 
    getCardSymbolImage(cardId) {
        const card = this.allCards.find(c => c.id === cardId);
        if (!card) return '';
        
        // shapes 스타일로 기하학적 심볼 생성
        const seed = `symbol_${card.name}_${cardId}`;
        
        // 수트별 색상
        const suitColors = {
            major: '8B5CF6',
            wands: 'EF4444', 
            cups: '3B82F6',
            swords: '94A3B8',
            pentacles: '16A34A'
        };
        
        const color = suitColors[card.suit] || suitColors.major;
        return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&size=50&primaryColor=${color}`;
    }
    
    // API 준비 상태 확인
    isReady() {
        return this.isLoaded;
    }
    
    // 카드 검색
    searchCards(query) {
        const searchQuery = query.toLowerCase();
        return this.allCards.filter(card => 
            card.name.toLowerCase().includes(searchQuery) ||
            card.name_en.toLowerCase().includes(searchQuery)
        );
    }
}

// ===========================
// 타로 스프레드 정의
// ===========================

// 스프레드와 레이아웃 데이터 정의
const TAROT_SPREADS = {
    single: {
        name: "오늘의 한 장",
        description: "하루를 위한 간단한 안내",
        positions: [
            {
                name: "오늘의 에너지",
                description: "오늘 하루에 영향을 줄 주요 에너지나 테마",
                context: "당신이 오늘 집중해야 할 영역이나 마음가짐을 보여줍니다."
            }
        ]
    },
    
    threeCard: {
        name: "과거-현재-미래",
        description: "시간의 흐름을 통해 상황을 파악하는 기본 스프레드",
        positions: [
            {
                name: "과거",
                description: "현재 상황에 영향을 준 과거의 경험이나 원인",
                context: "지금의 상황이 어떻게 형성되었는지를 보여줍니다."
            },
            {
                name: "현재",
                description: "현재의 상황과 마음 상태",
                context: "지금 당신이 처한 상황과 해야 할 일을 나타냅니다."
            },
            {
                name: "미래",
                description: "현재의 흐름이 이어질 때의 가능한 결과",
                context: "현재의 행동과 선택이 가져올 결과를 보여줍니다."
            }
        ]
    },
    
    celticCross: {
        name: "켈틱 크로스",
        description: "가장 전통적이고 포괄적인 10장 스프레드",
        positions: [
            {
                name: "현재 상황",
                description: "지금 당신이 처한 상황의 핵심",
                context: "현재 상황의 가장 중요한 측면을 나타냅니다."
            },
            {
                name: "도전과 장애",
                description: "극복해야 할 어려움이나 고려해야 할 요소",
                context: "당신이 직면한 주요 도전이나 극복해야 할 부분입니다."
            },
            {
                name: "먼 과거",
                description: "현재에 영향을 주는 과거의 기반",
                context: "오랫동안 지속되어 온 패턴이나 영향력을 보여줍니다."
            },
            {
                name: "가능한 미래",
                description: "현재 경로를 따를 때의 가능성",
                context: "지금의 흐름이 계속될 때 일어날 수 있는 일들입니다."
            },
            {
                name: "최근 과거",
                description: "최근에 일어난 중요한 변화나 사건",
                context: "현재 상황에 직접적으로 영향을 준 최근의 경험입니다."
            },
            {
                name: "가까운 미래",
                description: "곧 다가올 변화나 기회",
                context: "가까운 시일 내에 경험하게 될 변화나 기회를 나타냅니다."
            },
            {
                name: "내적 상태",
                description: "당신의 내면적 접근법과 태도",
                context: "이 상황에 대한 당신의 내적 자세와 준비도를 보여줍니다."
            },
            {
                name: "외적 영향",
                description: "주변 환경과 타인의 영향",
                context: "당신 주변의 사람들과 환경이 미치는 영향을 나타냅니다."
            },
            {
                name: "희망과 두려움",
                description: "당신의 기대와 우려",
                context: "이 상황에 대해 갖고 있는 희망과 걱정을 보여줍니다."
            },
            {
                name: "최종 결과",
                description: "모든 요소를 고려한 최종적인 전망",
                context: "현재의 모든 상황과 선택이 만들어낼 궁극적인 결과입니다."
            }
        ]
    },
    
    relationshipSpread: {
        name: "관계 스프레드",
        description: "두 사람 사이의 관계를 탐구하는 7장 스프레드",
        positions: [
            {
                name: "당신의 현재",
                description: "관계에서 당신의 현재 상태",
                context: "이 관계에서 당신이 느끼는 감정과 상황을 나타냅니다."
            },
            {
                name: "상대방의 현재",
                description: "관계에서 상대방의 현재 상태",
                context: "상대방이 이 관계에서 느끼는 감정과 상황을 보여줍니다."
            },
            {
                name: "관계의 기초",
                description: "두 사람 관계의 토대가 되는 부분",
                context: "이 관계가 어떤 기반 위에 세워져 있는지를 나타냅니다."
            },
            {
                name: "과거의 영향",
                description: "관계에 영향을 주는 과거의 경험",
                context: "현재 관계에 영향을 주는 과거의 패턴이나 경험입니다."
            },
            {
                name: "가능한 미래",
                description: "관계가 발전할 수 있는 방향",
                context: "이 관계가 나아갈 수 있는 가능한 방향을 보여줍니다."
            },
            {
                name: "당신이 줄 수 있는 것",
                description: "관계에 기여할 수 있는 당신의 역할",
                context: "이 관계를 위해 당신이 할 수 있는 기여와 노력입니다."
            },
            {
                name: "관계의 잠재력",
                description: "이 관계가 가진 최고의 가능성",
                context: "두 사람이 함께할 때 만들어낼 수 있는 최고의 결과입니다."
            }
        ]
    },
    
    careerSpread: {
        name: "직업 운세",
        description: "직업과 경력에 관한 5장 스프레드",
        positions: [
            {
                name: "현재 직업 상황",
                description: "지금의 직업적 위치와 상태",
                context: "현재 직장이나 일에서의 당신의 상황을 나타냅니다."
            },
            {
                name: "도전과 기회",
                description: "극복해야 할 도전과 활용할 기회",
                context: "직업적으로 마주한 어려움과 활용할 수 있는 기회들입니다."
            },
            {
                name: "숨겨진 강점",
                description: "아직 발견하지 못한 당신의 재능",
                context: "직업적 성공을 위해 개발할 수 있는 숨겨진 능력입니다."
            },
            {
                name: "취해야 할 행동",
                description: "성공을 위해 필요한 구체적 행동",
                context: "직업적 목표 달성을 위해 실제로 취해야 할 행동입니다."
            },
            {
                name: "최종 결과",
                description: "노력의 결실과 달성 가능한 성과",
                context: "현재의 노력과 선택이 가져올 직업적 성과와 보상입니다."
            }
        ]
    },
    
    yearlySpread: {
        name: "연간 운세",
        description: "1년의 흐름을 보는 12장 스프레드 (월별)",
        positions: [
            { name: "1월", description: "새해의 시작, 계획과 다짐", context: "새로운 시작과 목표 설정에 관한 에너지" },
            { name: "2월", description: "기반 다지기, 인내와 노력", context: "꾸준한 노력과 기반 구축의 시기" },
            { name: "3월", description: "활동과 성장, 변화의 시작", context: "적극적인 행동과 변화가 일어나는 시기" },
            { name: "4월", description: "발전과 확장, 새로운 기회", context: "기회를 포착하고 확장하는 시기" },
            { name: "5월", description: "안정과 조화, 관계 발전", context: "안정감을 찾고 관계가 발전하는 시기" },
            { name: "6월", description: "중간 점검, 균형과 조정", context: "상반기를 돌아보고 방향을 조정하는 시기" },
            { name: "7월", description: "열정과 도전, 적극적 추진", context: "열정을 가지고 목표를 추진하는 시기" },
            { name: "8월", description: "성취와 수확, 결실의 시기", context: "그동안의 노력이 결실을 맺는 시기" },
            { name: "9월", description: "정리와 준비, 차분한 성찰", context: "정리하고 다음을 준비하는 성찰의 시기" },
            { name: "10월", description: "변화와 전환, 새로운 방향", context: "중요한 변화와 방향 전환이 있는 시기" },
            { name: "11월", description: "깊이와 내면, 진실 탐구", context: "내면을 탐구하고 진실을 찾는 시기" },
            { name: "12월", description: "완성과 마무리, 새해 준비", context: "한 해를 마무리하고 새로운 해를 준비하는 시기" }
        ]
    }
};

// 스프레드 레이아웃 정보
const SPREAD_LAYOUTS = {
    single: {
        cardCount: 1,
        difficulty: "초급",
        readingTime: "5분",
        gridClass: "layout-single"
    },
    threeCard: {
        cardCount: 3,
        difficulty: "초급",
        readingTime: "10분",
        gridClass: "layout-three-card"
    },
    celticCross: {
        cardCount: 10,
        difficulty: "고급",
        readingTime: "30분",
        gridClass: "layout-celtic-cross"
    },
    relationshipSpread: {
        cardCount: 7,
        difficulty: "중급",
        readingTime: "20분",
        gridClass: "layout-relationship"
    },
    careerSpread: {
        cardCount: 5,
        difficulty: "중급",
        readingTime: "15분",
        gridClass: "layout-career"
    },
    yearlySpread: {
        cardCount: 12,
        difficulty: "고급",
        readingTime: "45분",
        gridClass: "layout-yearly"
    }
};

// 전역 인스턴스 생성
const tarotAPI = new TarotAPI();

// window 객체에 등록 (HTML에서 접근 가능)
if (typeof window !== 'undefined') {
    window.tarotAPI = tarotAPI;
    window.TAROT_SPREADS = TAROT_SPREADS;
    window.SPREAD_LAYOUTS = SPREAD_LAYOUTS;
}

// 모듈 export (Node.js 환경 지원)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TarotAPI;
}