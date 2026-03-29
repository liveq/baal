/**
 * RHEIGHT 타로카드 시스템 JavaScript - 완전 재설계
 * 왼쪽-오른쪽 분할 레이아웃의 가이드 기반 리딩 시스템
 */

// ===========================
// 전역 변수 및 상태 관리
// ===========================

let currentSpread = 'single';
let currentReading = null;
let isLoading = false;
let readingState = 'welcome'; // 'welcome', 'ready', 'reading', 'complete'
let selectedCards = [];
let currentCardIndex = -1;
let spreadLayoutData = null;

// 리딩 상태 관리 객체
const ReadingState = {
    WELCOME: 'welcome',
    READY: 'ready', 
    READING: 'reading',
    COMPLETE: 'complete'
};

// ===========================
// 78장 타로카드 정의
// ===========================

const TAROT_CARDS = {
    // 메이저 아르카나 (0-21)
    0: { name: '바보', suit: 'major', number: 0, element: 'air', symbol: '🎭' },
    1: { name: '마법사', suit: 'major', number: 1, element: 'fire', symbol: '🎩' },
    2: { name: '여제', suit: 'major', number: 2, element: 'earth', symbol: '👸' },
    3: { name: '황후', suit: 'major', number: 3, element: 'earth', symbol: '👑' },
    4: { name: '황제', suit: 'major', number: 4, element: 'fire', symbol: '🤴' },
    5: { name: '교황', suit: 'major', number: 5, element: 'earth', symbol: '⛪' },
    6: { name: '연인', suit: 'major', number: 6, element: 'air', symbol: '💕' },
    7: { name: '전차', suit: 'major', number: 7, element: 'water', symbol: '🏇' },
    8: { name: '정의', suit: 'major', number: 8, element: 'air', symbol: '⚖️' },
    9: { name: '은둔자', suit: 'major', number: 9, element: 'earth', symbol: '🕯️' },
    10: { name: '운명의수레바퀴', suit: 'major', number: 10, element: 'fire', symbol: '☸️' },
    11: { name: '힘', suit: 'major', number: 11, element: 'fire', symbol: '🦁' },
    12: { name: '매달린사람', suit: 'major', number: 12, element: 'water', symbol: '🙃' },
    13: { name: '죽음', suit: 'major', number: 13, element: 'water', symbol: '💀' },
    14: { name: '절제', suit: 'major', number: 14, element: 'fire', symbol: '🏺' },
    15: { name: '악마', suit: 'major', number: 15, element: 'earth', symbol: '👹' },
    16: { name: '탑', suit: 'major', number: 16, element: 'fire', symbol: '🗼' },
    17: { name: '별', suit: 'major', number: 17, element: 'air', symbol: '⭐' },
    18: { name: '달', suit: 'major', number: 18, element: 'water', symbol: '🌙' },
    19: { name: '태양', suit: 'major', number: 19, element: 'fire', symbol: '☀️' },
    20: { name: '심판', suit: 'major', number: 20, element: 'fire', symbol: '📯' },
    21: { name: '세계', suit: 'major', number: 21, element: 'earth', symbol: '🌍' },

    // 완드 (22-35) - 불의 원소
    22: { name: '완드 에이스', suit: 'wands', number: 1, element: 'fire', symbol: '🔥' },
    23: { name: '완드 2', suit: 'wands', number: 2, element: 'fire', symbol: '🔥' },
    24: { name: '완드 3', suit: 'wands', number: 3, element: 'fire', symbol: '🔥' },
    25: { name: '완드 4', suit: 'wands', number: 4, element: 'fire', symbol: '🔥' },
    26: { name: '완드 5', suit: 'wands', number: 5, element: 'fire', symbol: '🔥' },
    27: { name: '완드 6', suit: 'wands', number: 6, element: 'fire', symbol: '🔥' },
    28: { name: '완드 7', suit: 'wands', number: 7, element: 'fire', symbol: '🔥' },
    29: { name: '완드 8', suit: 'wands', number: 8, element: 'fire', symbol: '🔥' },
    30: { name: '완드 9', suit: 'wands', number: 9, element: 'fire', symbol: '🔥' },
    31: { name: '완드 10', suit: 'wands', number: 10, element: 'fire', symbol: '🔥' },
    32: { name: '완드 시종', suit: 'wands', number: 11, element: 'fire', symbol: '🔥' },
    33: { name: '완드 기사', suit: 'wands', number: 12, element: 'fire', symbol: '🔥' },
    34: { name: '완드 여왕', suit: 'wands', number: 13, element: 'fire', symbol: '🔥' },
    35: { name: '완드 왕', suit: 'wands', number: 14, element: 'fire', symbol: '🔥' },

    // 컵 (36-49) - 물의 원소
    36: { name: '컵 에이스', suit: 'cups', number: 1, element: 'water', symbol: '🏆' },
    37: { name: '컵 2', suit: 'cups', number: 2, element: 'water', symbol: '🏆' },
    38: { name: '컵 3', suit: 'cups', number: 3, element: 'water', symbol: '🏆' },
    39: { name: '컵 4', suit: 'cups', number: 4, element: 'water', symbol: '🏆' },
    40: { name: '컵 5', suit: 'cups', number: 5, element: 'water', symbol: '🏆' },
    41: { name: '컵 6', suit: 'cups', number: 6, element: 'water', symbol: '🏆' },
    42: { name: '컵 7', suit: 'cups', number: 7, element: 'water', symbol: '🏆' },
    43: { name: '컵 8', suit: 'cups', number: 8, element: 'water', symbol: '🏆' },
    44: { name: '컵 9', suit: 'cups', number: 9, element: 'water', symbol: '🏆' },
    45: { name: '컵 10', suit: 'cups', number: 10, element: 'water', symbol: '🏆' },
    46: { name: '컵 시종', suit: 'cups', number: 11, element: 'water', symbol: '🏆' },
    47: { name: '컵 기사', suit: 'cups', number: 12, element: 'water', symbol: '🏆' },
    48: { name: '컵 여왕', suit: 'cups', number: 13, element: 'water', symbol: '🏆' },
    49: { name: '컵 왕', suit: 'cups', number: 14, element: 'water', symbol: '🏆' },

    // 소드 (50-63) - 공기의 원소
    50: { name: '소드 에이스', suit: 'swords', number: 1, element: 'air', symbol: '⚔️' },
    51: { name: '소드 2', suit: 'swords', number: 2, element: 'air', symbol: '⚔️' },
    52: { name: '소드 3', suit: 'swords', number: 3, element: 'air', symbol: '⚔️' },
    53: { name: '소드 4', suit: 'swords', number: 4, element: 'air', symbol: '⚔️' },
    54: { name: '소드 5', suit: 'swords', number: 5, element: 'air', symbol: '⚔️' },
    55: { name: '소드 6', suit: 'swords', number: 6, element: 'air', symbol: '⚔️' },
    56: { name: '소드 7', suit: 'swords', number: 7, element: 'air', symbol: '⚔️' },
    57: { name: '소드 8', suit: 'swords', number: 8, element: 'air', symbol: '⚔️' },
    58: { name: '소드 9', suit: 'swords', number: 9, element: 'air', symbol: '⚔️' },
    59: { name: '소드 10', suit: 'swords', number: 10, element: 'air', symbol: '⚔️' },
    60: { name: '소드 시종', suit: 'swords', number: 11, element: 'air', symbol: '⚔️' },
    61: { name: '소드 기사', suit: 'swords', number: 12, element: 'air', symbol: '⚔️' },
    62: { name: '소드 여왕', suit: 'swords', number: 13, element: 'air', symbol: '⚔️' },
    63: { name: '소드 왕', suit: 'swords', number: 14, element: 'air', symbol: '⚔️' },

    // 펜타클 (64-77) - 땅의 원소
    64: { name: '펜타클 에이스', suit: 'pentacles', number: 1, element: 'earth', symbol: '⭐' },
    65: { name: '펜타클 2', suit: 'pentacles', number: 2, element: 'earth', symbol: '⭐' },
    66: { name: '펜타클 3', suit: 'pentacles', number: 3, element: 'earth', symbol: '⭐' },
    67: { name: '펜타클 4', suit: 'pentacles', number: 4, element: 'earth', symbol: '⭐' },
    68: { name: '펜타클 5', suit: 'pentacles', number: 5, element: 'earth', symbol: '⭐' },
    69: { name: '펜타클 6', suit: 'pentacles', number: 6, element: 'earth', symbol: '⭐' },
    70: { name: '펜타클 7', suit: 'pentacles', number: 7, element: 'earth', symbol: '⭐' },
    71: { name: '펜타클 8', suit: 'pentacles', number: 8, element: 'earth', symbol: '⭐' },
    72: { name: '펜타클 9', suit: 'pentacles', number: 9, element: 'earth', symbol: '⭐' },
    73: { name: '펜타클 10', suit: 'pentacles', number: 10, element: 'earth', symbol: '⭐' },
    74: { name: '펜타클 시종', suit: 'pentacles', number: 11, element: 'earth', symbol: '⭐' },
    75: { name: '펜타클 기사', suit: 'pentacles', number: 12, element: 'earth', symbol: '⭐' },
    76: { name: '펜타클 여왕', suit: 'pentacles', number: 13, element: 'earth', symbol: '⭐' },
    77: { name: '펜타클 왕', suit: 'pentacles', number: 14, element: 'earth', symbol: '⭐' }
};

// ===========================
// 스프레드 매핑 (네비게이션 → 실제 스프레드)
// ===========================

const SPREAD_MAPPING = {
    // 일반운세
    'daily': 'single',
    'weekly': 'threeCard', 
    'monthly': 'careerSpread',
    'yearly': 'yearlySpread',
    
    // 연애운세  
    'solo_fortune': 'threeCard',
    'couple_fortune': 'relationshipSpread', 
    'crush_reading': 'threeCard',
    'breakup_recovery': 'relationshipSpread',
    
    // 직업운세
    'job_hunting': 'careerSpread',
    'promotion': 'careerSpread',
    'job_change': 'careerSpread', 
    'business_start': 'careerSpread',
    
    // 건강운세
    'health_status': 'threeCard',
    'recovery_path': 'careerSpread',
    'mental_health': 'threeCard',
    
    // 재정운세
    'money_fortune': 'careerSpread',
    'investment_guide': 'careerSpread',
    'debt_solution': 'threeCard',
    
    // 인간관계
    'friendship': 'relationshipSpread',
    'family_harmony': 'relationshipSpread',
    'workplace_relations': 'relationshipSpread',
    
    // 영적성장
    'inner_exploration': 'celticCross',
    'spiritual_awakening': 'celticCross', 
    'meditation_guide': 'single'
};

// ===========================
// 핵심 네비게이션 함수들 (HTML에서 바로 접근 가능하도록)
// ===========================

// 네비게이션 토글
function toggleNav() {
    const nav = document.querySelector('.tarot-nav');
    if (nav) {
        nav.classList.toggle('open');
    }
}

// 카테고리 토글
function toggleCategory(categoryName) {
    const categoryHeader = document.querySelector(`[onclick="toggleCategory('${categoryName}')"]`);
    const categoryItems = document.getElementById(`category-${categoryName}`);
    
    if (!categoryHeader || !categoryItems) return;
    
    const isActive = categoryHeader.classList.contains('active');
    
    if (isActive) {
        categoryHeader.classList.remove('active');
        categoryItems.classList.remove('active');
    } else {
        // 다른 카테고리들을 먼저 닫기
        document.querySelectorAll('.category-header.active').forEach(header => {
            header.classList.remove('active');
        });
        document.querySelectorAll('.category-items.active').forEach(items => {
            items.classList.remove('active');
        });
        
        categoryHeader.classList.add('active');
        categoryItems.classList.add('active');
    }
}

// 스프레드 선택
function selectSpread(spreadName) {
    // 네비게이션에서 실제 스프레드로 매핑
    currentSpread = SPREAD_MAPPING[spreadName] || 'single';
    
    // 네비게이션 UI 업데이트
    updateNavigationUI(spreadName);
    
    // 자동으로 카드 뽑기 실행 (사용자 요청사항)
    setTimeout(() => {
        performReading();
    }, 100);
    
    console.log(`Selected spread: ${spreadName} -> ${currentSpread}`);
}

// window에 즉시 등록
window.toggleNav = toggleNav;
window.toggleCategory = toggleCategory;
window.selectSpread = selectSpread;

// ===========================
// 기본 해석 템플릿 (제거됨 - 아래 더 상세한 버전 사용)
// ===========================

// ===========================
// DOM 요소 참조
// ===========================

function getDOMElements() {
    return {
        // 패널들
        welcomeMessage: document.getElementById('welcomeMessage'),
        spreadContainer: document.getElementById('spreadContainer'),
        loadingIndicator: document.getElementById('loadingIndicator'),
        
        // 스프레드 정보
        spreadName: document.getElementById('spreadName'),
        spreadDesc: document.getElementById('spreadDesc'),
        cardCount: document.getElementById('cardCount'),
        difficulty: document.getElementById('difficulty'),
        cardsGrid: document.getElementById('cardsGrid'),
        
        // 진행 상태
        progressBar: document.getElementById('progressBar'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
        
        // 해석 패널
        stateWelcome: document.getElementById('stateWelcome'),
        stateReady: document.getElementById('stateReady'),
        stateCardReading: document.getElementById('stateCardReading'),
        stateFinalReading: document.getElementById('stateFinalReading'),
        
        // 카드 해석 영역
        positionName: document.getElementById('positionName'),
        positionDescription: document.getElementById('positionDescription'),
        selectedCardName: document.getElementById('selectedCardName'),
        selectedCardOrientation: document.getElementById('selectedCardOrientation'),
        cardSymbol: document.getElementById('cardSymbol'),
        cardInterpretationText: document.getElementById('cardInterpretationText'),
        
        // 네비게이션
        prevCardBtn: document.getElementById('prevCardBtn'),
        nextCardBtn: document.getElementById('nextCardBtn'),
        currentCardNumber: document.getElementById('currentCardNumber'),
        totalCards: document.getElementById('totalCards'),
        
        // 최종 리딩
        readingTheme: document.getElementById('readingTheme'),
        readingThemeDesc: document.getElementById('readingThemeDesc'),
        keyMessage: document.getElementById('keyMessage'),
        summaryCards: document.getElementById('summaryCards'),
        
        // 스프레드 타이틀
        spreadTitle: document.getElementById('spreadTitle')
    };
}

// ===========================
// 유틸리티 함수들
// ===========================

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getRandomCards(count) {
    const cardIds = Object.keys(TAROT_CARDS).map(id => parseInt(id));
    const shuffled = shuffleArray(cardIds);
    
    return shuffled.slice(0, count).map(cardId => ({
        id: cardId,
        card: TAROT_CARDS[cardId],
        reversed: Math.random() < 0.3 // 30% 확률로 역방향
    }));
}

// 간소화된 카드 해석 데이터 (주요 카드들)
const CARD_INTERPRETATIONS = {
    // 메이저 아르카나 해석
    0: {
        upright: {
            general: '새로운 시작과 무한한 가능성이 당신 앞에 펼쳐져 있습니다. 두려움보다는 설렘을 가지고 첫 걸음을 내딛어보세요.',
            love: '새로운 연애의 시작이나 관계의 새로운 단계가 기다리고 있습니다. 순수한 마음으로 다가가세요.',
            career: '새로운 직업이나 프로젝트에 대한 기회가 생길 수 있습니다. 경험부족을 걱정하지 말고 도전해보세요.'
        },
        reversed: {
            general: '성급한 결정을 피하고 좀 더 신중하게 계획을 세워야 할 때입니다. 준비가 부족할 수 있습니다.',
            love: '관계에서 충동적인 행동을 자제하고, 상대방의 입장도 충분히 고려해보세요.',
            career: '새로운 기회에 대해 더 많은 정보를 수집하고 신중하게 결정하는 것이 좋겠습니다.'
        }
    },
    1: {
        upright: {
            general: '당신에게는 목표를 달성할 수 있는 모든 능력과 자원이 있습니다. 자신감을 가지고 행동으로 옮기세요.',
            love: '적극적으로 마음을 표현하거나 관계를 발전시킬 수 있는 좋은 시기입니다.',
            career: '리더십을 발휘하고 새로운 프로젝트를 주도할 수 있는 능력이 있습니다.'
        },
        reversed: {
            general: '능력은 있지만 잘못된 방향으로 사용하고 있을 수 있습니다. 목적을 재점검해보세요.',
            love: '관계에서 너무 지배적이거나 조작적인 태도를 보일 수 있습니다. 균형을 찾으세요.',
            career: '권한 남용이나 부정직한 방법으로 목표를 달성하려 하지 마세요.'
        }
    },
    2: {
        upright: {
            general: '직감과 내면의 목소리에 귀를 기울이는 것이 중요합니다. 숨겨진 지혜가 답을 줄 것입니다.',
            love: '표면적인 것보다 감정의 깊은 부분에서 일어나는 변화에 주목하세요.',
            career: '직감을 믿고 결정을 내리되, 충분한 정보 수집도 병행하세요.'
        },
        reversed: {
            general: '내면의 목소리를 무시하고 외부의 압력에 따르고 있을 수 있습니다. 자신만의 판단이 필요합니다.',
            love: '감정을 억압하거나 진실을 외면하고 있을 수 있습니다. 솔직해지세요.',
            career: '중요한 정보가 숨겨져 있거나, 직감을 무시한 채 논리적 분석에만 의존하고 있을 수 있습니다.'
        }
    }
    // 추가 카드들은 필요에 따라 확장 가능
};

function getCardInterpretation(cardId, isReversed, context = 'general') {
    const interpretation = CARD_INTERPRETATIONS[cardId];
    if (!interpretation) {
        // 기본 해석 생성 (카드 특성에 따라)
        const card = TAROT_CARDS[cardId];
        const baseName = card?.name || '알 수 없는 카드';
        
        if (card?.suit === 'major') {
            return {
                text: `${baseName}는 인생의 중요한 전환점과 깊은 의미를 담고 있습니다. 이 카드가 나타나는 것은 영적 성장과 자아 발견의 기회를 의미합니다.`,
                keywords: isReversed ? ['변화 저항', '내면 갈등', '재고 필요'] : ['영적 성장', '인생 전환', '깊은 의미']
            };
        } else if (card?.element === 'fire') {
            return {
                text: `${baseName}는 열정과 행동의 에너지를 나타냅니다. 적극적이고 창의적인 접근이 필요한 시기입니다.`,
                keywords: isReversed ? ['에너지 부족', '열정 상실', '행동 지연'] : ['열정', '행동력', '창의성']
            };
        } else if (card?.element === 'water') {
            return {
                text: `${baseName}는 감정과 직감의 흐름을 의미합니다. 마음의 소리에 귀를 기울이고 감정을 존중하세요.`,
                keywords: isReversed ? ['감정 혼란', '직감 불신', '관계 문제'] : ['감정', '직감', '사랑']
            };
        } else if (card?.element === 'air') {
            return {
                text: `${baseName}는 지성과 소통의 중요성을 강조합니다. 명확한 사고와 솔직한 대화가 해답이 될 것입니다.`,
                keywords: isReversed ? ['소통 장애', '혼란', '오해'] : ['지성', '소통', '명확성']
            };
        } else if (card?.element === 'earth') {
            return {
                text: `${baseName}는 현실적이고 실용적인 접근을 나타냅니다. 꾸준한 노력과 인내가 결실을 맺을 것입니다.`,
                keywords: isReversed ? ['불안정', '노력 부족', '현실 도피'] : ['안정', '노력', '결실']
            };
        }
        
        return {
            text: `${baseName}의 깊은 의미가 당신의 상황에 특별한 메시지를 전합니다. 직감을 믿고 내면의 목소리에 귀 기울여보세요.`,
            keywords: isReversed ? ['주의 필요', '재고', '신중함'] : ['긍정 에너지', '발전', '성장']
        };
    }
    
    const direction = isReversed ? 'reversed' : 'upright';
    const text = interpretation[direction]?.[context] || interpretation[direction]?.general || interpretation.upright.general;
    
    return {
        text: text,
        keywords: isReversed ? ['역방향', '주의', '재고'] : ['정방향', '긍정', '발전']
    };
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    
    if (toast && toastText) {
        toastText.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// ===========================
// 상태 관리 함수들
// ===========================

function changeReadingState(newState) {
    const elements = getDOMElements();
    
    // 이전 상태 숨기기
    elements.stateWelcome.style.display = 'none';
    elements.stateReady.style.display = 'none';
    elements.stateCardReading.style.display = 'none';
    elements.stateFinalReading.style.display = 'none';
    
    readingState = newState;
    
    // 새 상태 표시
    switch (newState) {
        case ReadingState.WELCOME:
            elements.stateWelcome.style.display = 'block';
            elements.welcomeMessage.style.display = 'block';
            elements.spreadContainer.style.display = 'none';
            break;
            
        case ReadingState.READY:
            elements.stateReady.style.display = 'block';
            elements.welcomeMessage.style.display = 'none';
            elements.spreadContainer.style.display = 'block';
            updateSpreadOverview();
            break;
            
        case ReadingState.READING:
            elements.stateCardReading.style.display = 'block';
            elements.welcomeMessage.style.display = 'none';
            elements.spreadContainer.style.display = 'block';
            break;
            
        case ReadingState.COMPLETE:
            elements.stateFinalReading.style.display = 'block';
            generateFinalReading();
            break;
    }
}

function updateSpreadOverview() {
    const elements = getDOMElements();
    const spreadOverview = document.getElementById('spreadOverview');
    
    if (!spreadOverview || !spreadLayoutData) return;
    
    const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
    const layoutInfo = window.SPREAD_LAYOUTS?.[currentSpread];
    
    if (spreadInfo && layoutInfo) {
        spreadOverview.innerHTML = `
            <h4>${spreadInfo.name}</h4>
            <p>${spreadInfo.description}</p>
            <div style="margin-top: 15px;">
                <strong>이 스프레드의 특징:</strong>
                <ul style="margin-top: 8px; padding-left: 20px;">
                    <li>카드 수: ${layoutInfo.cardCount}장</li>
                    <li>난이도: ${layoutInfo.difficulty}</li>
                    <li>소요 시간: ${layoutInfo.readingTime}</li>
                </ul>
            </div>
        `;
    }
}

function updateProgress() {
    const elements = getDOMElements();
    const totalCards = selectedCards.length;
    const revealedCards = selectedCards.filter(card => card.revealed).length;
    const progress = totalCards > 0 ? (revealedCards / totalCards) * 100 : 0;
    
    if (elements.progressFill) {
        elements.progressFill.style.width = `${progress}%`;
    }
    
    if (elements.progressText) {
        if (revealedCards === 0) {
            elements.progressText.textContent = '카드를 클릭하여 시작하세요';
        } else if (revealedCards < totalCards) {
            elements.progressText.textContent = `${revealedCards}/${totalCards} 카드 해석 완료`;
        } else {
            elements.progressText.textContent = '모든 카드 해석 완료!';
        }
    }
}

// ===========================
// 스프레드 생성 및 카드 배치
// ===========================

function createSpreadLayout(spreadType, cards) {
    const elements = getDOMElements();
    const cardsGrid = elements.cardsGrid;
    
    if (!cardsGrid) return;
    
    // 그리드 레이아웃 클래스 설정
    cardsGrid.className = 'cards-grid';
    
    const layoutInfo = window.SPREAD_LAYOUTS?.[spreadType];
    if (layoutInfo) {
        cardsGrid.classList.add(`layout-${layoutInfo.layout}`);
    }
    
    // 카드들 생성
    cardsGrid.innerHTML = '';
    
    cards.forEach((cardData, index) => {
        const miniCard = createMiniCard(cardData, index);
        cardsGrid.appendChild(miniCard);
    });
    
    // 특별한 레이아웃 처리 (켈틱 크로스, 펜타그램 등)
    if (spreadType === 'celticCross') {
        arrangeCelticCrossCards(cardsGrid, cards);
    } else if (spreadType === 'pentagram') {
        arrangePentagramCards(cardsGrid, cards);
    } else if (spreadType === 'zodiacMandala') {
        arrangeCircleCards(cardsGrid, cards);
    }
}

function createMiniCard(cardData, index) {
    const card = document.createElement('div');
    card.className = 'mini-card face-down';
    card.dataset.cardIndex = index;
    card.dataset.cardId = cardData.id;
    
    // 포지션 라벨 추가
    const positionLabel = document.createElement('div');
    positionLabel.className = 'card-position-label';
    
    const spreadPositions = window.TAROT_SPREADS?.[currentSpread]?.positions;
    if (spreadPositions && spreadPositions[index]) {
        positionLabel.textContent = spreadPositions[index].name;
    } else {
        positionLabel.textContent = `위치 ${index + 1}`;
    }
    
    card.appendChild(positionLabel);
    
    // 카드 클릭 이벤트
    card.addEventListener('click', () => handleCardClick(index));
    
    // 키보드 접근성
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${positionLabel.textContent} 카드`);
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(index);
        }
    });
    
    return card;
}

function arrangeCelticCrossCards(container, cards) {
    // 켈틱 크로스의 특별한 위치 배치
    const positions = [
        { gridArea: '2 / 2 / 3 / 3' }, // 1. 현재 상황 (중앙)
        { gridArea: '2 / 2 / 3 / 3', transform: 'rotate(90deg)' }, // 2. 도전 (가로로 누워서)
        { gridArea: '1 / 2 / 2 / 3' }, // 3. 먼 과거 (위)
        { gridArea: '2 / 3 / 3 / 4' }, // 4. 가능한 미래 (오른쪽)
        { gridArea: '3 / 2 / 4 / 3' }, // 5. 가까운 과거 (아래)
        { gridArea: '2 / 1 / 3 / 2' }, // 6. 가까운 미래 (왼쪽)
        { gridArea: '4 / 4 / 5 / 5' }, // 7. 내적 접근법
        { gridArea: '3 / 4 / 4 / 5' }, // 8. 외적 영향
        { gridArea: '2 / 4 / 3 / 5' }, // 9. 희망과 두려움
        { gridArea: '1 / 4 / 2 / 5' }  // 10. 최종 결과
    ];
    
    const cardElements = container.querySelectorAll('.mini-card');
    cardElements.forEach((cardEl, index) => {
        if (positions[index]) {
            cardEl.style.gridArea = positions[index].gridArea;
            if (positions[index].transform) {
                cardEl.style.transform = positions[index].transform;
            }
        }
    });
}

function arrangePentagramCards(container, cards) {
    // 펜타그램의 5점 위치 계산
    const positions = [
        { top: '10%', left: '50%' }, // 상단
        { top: '35%', left: '82%' }, // 우상단
        { top: '70%', left: '70%' }, // 우하단
        { top: '70%', left: '30%' }, // 좌하단
        { top: '35%', left: '18%' }  // 좌상단
    ];
    
    const cardElements = container.querySelectorAll('.mini-card');
    cardElements.forEach((cardEl, index) => {
        if (positions[index]) {
            cardEl.style.position = 'absolute';
            cardEl.style.top = positions[index].top;
            cardEl.style.left = positions[index].left;
            cardEl.style.transform = 'translate(-50%, -50%)';
        }
    });
}

function arrangeCircleCards(container, cards) {
    // 12장 카드를 원형으로 배치
    const cardElements = container.querySelectorAll('.mini-card');
    const radius = 140;
    const centerX = 175;
    const centerY = 175;
    
    cardElements.forEach((cardEl, index) => {
        const angle = (index * 30) - 90; // 12시부터 시작
        const radian = (angle * Math.PI) / 180;
        
        const x = centerX + radius * Math.cos(radian);
        const y = centerY + radius * Math.sin(radian);
        
        cardEl.style.position = 'absolute';
        cardEl.style.left = `${x}px`;
        cardEl.style.top = `${y}px`;
        cardEl.style.transform = 'translate(-50%, -50%)';
    });
}

// ===========================
// 카드 상호작용 처리
// ===========================

function handleCardClick(cardIndex) {
    if (readingState !== ReadingState.READY && readingState !== ReadingState.READING) {
        return;
    }
    
    const cardData = selectedCards[cardIndex];
    if (!cardData || cardData.revealed) {
        return;
    }
    
    // 카드 뒤집기
    revealCard(cardIndex);
    
    // 상태를 reading으로 변경
    if (readingState === ReadingState.READY) {
        changeReadingState(ReadingState.READING);
    }
    
    // 현재 카드 인덱스 설정
    currentCardIndex = cardIndex;
    
    // 카드 해석 표시
    showCardInterpretation(cardData, cardIndex);
    
    // 진행 상태 업데이트
    updateProgress();
    
    // 모든 카드가 뒤집혔는지 확인
    const allRevealed = selectedCards.every(card => card.revealed);
    if (allRevealed) {
        // 약간의 지연 후 완료 상태로 전환
        setTimeout(() => {
            changeReadingState(ReadingState.COMPLETE);
        }, 2000);
    }
    
    // 네비게이션 버튼 업데이트
    updateNavigationButtons();
}

function revealCard(cardIndex) {
    const cardElement = document.querySelector(`[data-card-index="${cardIndex}"]`);
    const cardData = selectedCards[cardIndex];
    
    if (!cardElement || !cardData) return;
    
    // 카드 데이터 마크
    cardData.revealed = true;
    
    // 시각적 변화
    cardElement.classList.remove('face-down');
    cardElement.classList.add('face-up', 'revealed');
    
    // 카드 내용 표시
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    
    const cardSymbol = document.createElement('div');
    cardSymbol.className = 'card-symbol';
    cardSymbol.textContent = cardData.card.symbol || '🔮';
    
    const cardName = document.createElement('div');
    cardName.className = 'card-name';
    cardName.textContent = cardData.card.name;
    
    cardContent.appendChild(cardSymbol);
    cardContent.appendChild(cardName);
    
    cardElement.innerHTML = '';
    cardElement.appendChild(cardContent);
    
    // 포지션 라벨 다시 추가
    const positionLabel = document.createElement('div');
    positionLabel.className = 'card-position-label';
    const spreadPositions = window.TAROT_SPREADS?.[currentSpread]?.positions;
    if (spreadPositions && spreadPositions[cardIndex]) {
        positionLabel.textContent = spreadPositions[cardIndex].name;
    }
    cardElement.appendChild(positionLabel);
    
    // 사운드 효과 (선택적)
    playCardRevealSound();
}

function showCardInterpretation(cardData, cardIndex) {
    const elements = getDOMElements();
    
    // 포지션 정보 표시
    const spreadPositions = window.TAROT_SPREADS?.[currentSpread]?.positions;
    const position = spreadPositions?.[cardIndex];
    
    if (position) {
        elements.positionName.textContent = position.name;
        elements.positionDescription.textContent = position.description;
    }
    
    // 카드 정보 표시
    elements.selectedCardName.textContent = cardData.card.name;
    elements.selectedCardOrientation.textContent = cardData.reversed ? '역방향' : '정방향';
    elements.selectedCardOrientation.className = `card-orientation ${cardData.reversed ? 'reversed' : 'upright'}`;
    
    // 카드 심볼 표시
    if (elements.cardSymbol) {
        elements.cardSymbol.textContent = cardData.card.symbol || '🔮';
    }
    
    // 해석 텍스트 생성
    const interpretation = getCardInterpretation(cardData.id, cardData.reversed);
    elements.cardInterpretationText.innerHTML = `
        <div class="interpretation-main">
            <p>${interpretation.text}</p>
        </div>
        <div class="interpretation-keywords">
            <strong>키워드:</strong> ${interpretation.keywords.join(', ')}
        </div>
        ${position?.context ? `<div class="position-context"><strong>이 위치에서의 의미:</strong> ${position.context}</div>` : ''}
    `;
}

function updateNavigationButtons() {
    const elements = getDOMElements();
    const revealedCards = selectedCards.filter(card => card.revealed);
    const revealedCount = revealedCards.length;
    
    // 현재 카드 번호 표시
    const currentRevealedIndex = revealedCards.findIndex(card => selectedCards.indexOf(card) === currentCardIndex);
    
    if (elements.currentCardNumber) {
        elements.currentCardNumber.textContent = Math.max(1, currentRevealedIndex + 1);
    }
    if (elements.totalCards) {
        elements.totalCards.textContent = selectedCards.length;
    }
    
    // 버튼 활성화/비활성화
    if (elements.prevCardBtn) {
        elements.prevCardBtn.disabled = currentRevealedIndex <= 0;
    }
    
    if (elements.nextCardBtn) {
        const nextRevealedCard = revealedCards[currentRevealedIndex + 1];
        elements.nextCardBtn.disabled = !nextRevealedCard;
        
        if (!nextRevealedCard) {
            elements.nextCardBtn.innerHTML = `
                <span class="btn-text">다른 카드 선택</span>
                <span class="btn-icon">👆</span>
            `;
        } else {
            elements.nextCardBtn.innerHTML = `
                <span class="btn-text">다음 카드</span>
                <span class="btn-icon">→</span>
            `;
        }
    }
}

// ===========================
// 네비게이션 함수들
// ===========================

function navigateCard(direction) {
    const revealedCards = selectedCards.filter(card => card.revealed);
    const currentRevealedIndex = revealedCards.findIndex(card => selectedCards.indexOf(card) === currentCardIndex);
    
    let newIndex = -1;
    
    if (direction === 'prev' && currentRevealedIndex > 0) {
        const targetCard = revealedCards[currentRevealedIndex - 1];
        newIndex = selectedCards.indexOf(targetCard);
    } else if (direction === 'next' && currentRevealedIndex < revealedCards.length - 1) {
        const targetCard = revealedCards[currentRevealedIndex + 1];
        newIndex = selectedCards.indexOf(targetCard);
    }
    
    if (newIndex >= 0 && newIndex !== currentCardIndex) {
        currentCardIndex = newIndex;
        const cardData = selectedCards[newIndex];
        showCardInterpretation(cardData, newIndex);
        updateNavigationButtons();
        
        // 해당 카드를 시각적으로 강조
        highlightSelectedCard(newIndex);
    }
}

function highlightSelectedCard(cardIndex) {
    // 기존 선택 해제
    document.querySelectorAll('.mini-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 새로운 카드 선택
    const cardElement = document.querySelector(`[data-card-index="${cardIndex}"]`);
    if (cardElement) {
        cardElement.classList.add('selected');
    }
}

// ===========================
// 최종 리딩 생성
// ===========================

function generateFinalReading() {
    const elements = getDOMElements();
    
    // 리딩 주제 설정
    const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
    if (spreadInfo && elements.readingTheme) {
        elements.readingTheme.textContent = spreadInfo.name;
    }
    if (spreadInfo && elements.readingThemeDesc) {
        elements.readingThemeDesc.textContent = spreadInfo.description;
    }
    
    // 핵심 메시지 생성
    if (elements.keyMessage) {
        const keyMessage = generateOverallMessage();
        elements.keyMessage.innerHTML = `<p>${keyMessage}</p>`;
    }
    
    // 카드별 요약 생성
    if (elements.summaryCards) {
        const summaryHTML = selectedCards.map((cardData, index) => {
            const position = window.TAROT_SPREADS?.[currentSpread]?.positions?.[index];
            const interpretation = getCardInterpretation(cardData.id, cardData.reversed);
            
            return `
                <div class="summary-card-item">
                    <div class="summary-card-header">
                        <strong>${position?.name || `위치 ${index + 1}`}</strong>
                        <span class="summary-card-name">${cardData.card.name} ${cardData.reversed ? '(역방향)' : ''}</span>
                    </div>
                    <div class="summary-card-text">
                        ${interpretation.text.substring(0, 100)}...
                    </div>
                </div>
            `;
        }).join('');
        
        elements.summaryCards.innerHTML = summaryHTML;
    }
}

function generateOverallMessage() {
    const cardCount = selectedCards.length;
    const reversedCount = selectedCards.filter(card => card.reversed).length;
    const majorArcanaCount = selectedCards.filter(card => card.card.suit === 'major').length;
    
    let message = '';
    
    // 전체적인 톤 결정
    if (reversedCount > cardCount / 2) {
        message += '현재 당신은 변화와 도전의 시기를 맞이하고 있습니다. ';
    } else {
        message += '긍정적인 에너지가 당신을 둘러싸고 있습니다. ';
    }
    
    // 메이저 아르카나 비율에 따른 메시지
    if (majorArcanaCount > cardCount / 2) {
        message += '중요한 인생의 전환점이나 영적 성장의 기회가 다가오고 있습니다. ';
    } else {
        message += '일상적이지만 의미 있는 변화들이 당신의 삶을 풍요롭게 만들어갈 것입니다. ';
    }
    
    // 스프레드별 특별 메시지
    const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
    if (spreadInfo && spreadInfo.name.includes('사랑') || spreadInfo.name.includes('연애')) {
        message += '사랑과 관계에서 진정한 마음을 표현하는 것이 중요합니다. ';
    } else if (spreadInfo && spreadInfo.name.includes('직업') || spreadInfo.name.includes('사업')) {
        message += '전문성과 창의성을 발휘할 수 있는 기회를 놓치지 마세요. ';
    }
    
    message += '타로가 보여주는 길을 따라 걸으며, 내면의 지혜에 귀 기울이시기 바랍니다.';
    
    return message;
}

// ===========================
// 메인 기능 함수들
// ===========================

function performReading() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    setTimeout(() => {
        // 카드 선택 및 배치
        const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
        const cardCount = spreadInfo?.positions?.length || 1;
        
        selectedCards = getRandomCards(cardCount);
        spreadLayoutData = {
            spread: currentSpread,
            cards: selectedCards,
            timestamp: new Date()
        };
        
        // 스프레드 정보 업데이트
        updateSpreadInfo();
        
        // 스프레드 레이아웃 생성
        createSpreadLayout(currentSpread, selectedCards);
        
        // 상태 변경
        changeReadingState(ReadingState.READY);
        
        // 진행 상태 초기화
        currentCardIndex = -1;
        updateProgress();
        
        hideLoading();
        isLoading = false;
        
        showToast('카드가 준비되었습니다. 클릭하여 해석을 확인하세요!');
    }, 1500);
}

function updateSpreadInfo() {
    const elements = getDOMElements();
    const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
    const layoutInfo = window.SPREAD_LAYOUTS?.[currentSpread];
    
    if (spreadInfo) {
        if (elements.spreadName) elements.spreadName.textContent = spreadInfo.name;
        if (elements.spreadDesc) elements.spreadDesc.textContent = spreadInfo.description;
        if (elements.spreadTitle) elements.spreadTitle.textContent = spreadInfo.name;
    }
    
    if (layoutInfo) {
        if (elements.cardCount) elements.cardCount.textContent = `카드 ${layoutInfo.cardCount}장`;
        if (elements.difficulty) elements.difficulty.textContent = layoutInfo.difficulty;
    }
}

function selectSpread(spreadName) {
    // 네비게이션에서 실제 스프레드로 매핑
    currentSpread = SPREAD_MAPPING[spreadName] || 'single';
    
    // 네비게이션 UI 업데이트
    updateNavigationUI(spreadName);
    
    // 웰컴 상태로 리셋 (아직 카드를 뽑지 않음)
    changeReadingState(ReadingState.WELCOME);
    
    // 기존 데이터 클리어
    selectedCards = [];
    currentCardIndex = -1;
    spreadLayoutData = null;
    
    console.log(`Selected spread: ${spreadName} -> ${currentSpread}`);
}

function updateNavigationUI(selectedSpread) {
    // 모든 nav-item에서 active 클래스 제거
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택된 아이템에 active 클래스 추가
    const selectedItem = document.querySelector(`[onclick="selectSpread('${selectedSpread}')"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
        
        // 해당 카테고리도 열기
        const category = selectedItem.closest('.nav-category');
        if (category) {
            const categoryHeader = category.querySelector('.category-header');
            const categoryItems = category.querySelector('.category-items');
            
            if (categoryHeader && categoryItems) {
                categoryHeader.classList.add('active');
                categoryItems.classList.add('active');
            }
        }
    }
}

function showLoading() {
    const elements = getDOMElements();
    if (elements.loadingIndicator) {
        elements.loadingIndicator.style.display = 'flex';
    }
}

function hideLoading() {
    const elements = getDOMElements();
    if (elements.loadingIndicator) {
        elements.loadingIndicator.style.display = 'none';
    }
}

// ===========================
// 네비게이션 및 UI 함수들
// ===========================

function toggleNav() {
    const nav = document.querySelector('.tarot-nav');
    if (nav) {
        nav.classList.toggle('open');
    }
}

function toggleCategory(categoryName) {
    const categoryHeader = document.querySelector(`[onclick="toggleCategory('${categoryName}')"]`);
    const categoryItems = document.getElementById(`category-${categoryName}`);
    
    if (!categoryHeader || !categoryItems) return;
    
    const isActive = categoryHeader.classList.contains('active');
    
    if (isActive) {
        categoryHeader.classList.remove('active');
        categoryItems.classList.remove('active');
    } else {
        categoryHeader.classList.add('active');
        categoryItems.classList.add('active');
    }
}

function resetToWelcome() {
    changeReadingState(ReadingState.WELCOME);
    selectedCards = [];
    currentCardIndex = -1;
    spreadLayoutData = null;
    
    // 기본 스프레드로 리셋
    currentSpread = 'single';
    
    showToast('초기 화면으로 돌아갔습니다.');
}

function resetReading() {
    // 현재 스프레드 유지하며 새로운 리딩 시작
    changeReadingState(ReadingState.WELCOME);
    selectedCards = [];
    currentCardIndex = -1;
    spreadLayoutData = null;
    
    showToast('새로운 리딩을 시작할 수 있습니다.');
}

// ===========================
// 기타 기능 함수들
// ===========================

function saveReading() {
    if (!spreadLayoutData || selectedCards.length === 0) {
        showToast('저장할 리딩이 없습니다.');
        return;
    }
    
    try {
        const readingData = {
            id: Date.now(),
            spread: currentSpread,
            cards: selectedCards,
            timestamp: new Date().toISOString(),
            spreadInfo: window.TAROT_SPREADS?.[currentSpread]
        };
        
        // 로컬스토리지에 저장
        const savedReadings = JSON.parse(localStorage.getItem('tarot_readings') || '[]');
        savedReadings.unshift(readingData); // 최신 것을 맨 앞에
        
        // 최대 20개까지만 보관
        if (savedReadings.length > 20) {
            savedReadings.splice(20);
        }
        
        localStorage.setItem('tarot_readings', JSON.stringify(savedReadings));
        showToast('리딩이 저장되었습니다.');
        
    } catch (error) {
        console.error('Failed to save reading:', error);
        showToast('저장 중 오류가 발생했습니다.');
    }
}

function shareReading() {
    if (selectedCards.length === 0) {
        showToast('공유할 리딩이 없습니다.');
        return;
    }
    
    const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
    const cardsList = selectedCards.map(card => 
        `${card.card.name}${card.reversed ? ' (역방향)' : ''}`
    ).join(', ');
    
    const shareText = `🔮 타로카드 리딩 결과\n\n` +
        `📋 스프레드: ${spreadInfo?.name || currentSpread}\n` +
        `🃏 카드: ${cardsList}\n` +
        `📅 날짜: ${new Date().toLocaleDateString('ko-KR')}\n\n` +
        `#타로카드 #운세 #RHEIGHT`;
    
    if (navigator.share) {
        navigator.share({
            title: '타로카드 리딩 결과',
            text: shareText
        }).catch(console.error);
    } else {
        // 클립보드에 복사
        navigator.clipboard?.writeText(shareText).then(() => {
            showToast('리딩 결과가 클립보드에 복사되었습니다.');
        }).catch(() => {
            showToast('공유 기능을 사용할 수 없습니다.');
        });
    }
}

function showHistory() {
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    
    if (!historyModal || !historyList) return;
    
    try {
        const savedReadings = JSON.parse(localStorage.getItem('tarot_readings') || '[]');
        
        if (savedReadings.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <span class="empty-icon">🔮</span>
                    <p>아직 저장된 리딩이 없습니다.</p>
                    <small>카드 뽑기를 해보세요!</small>
                </div>
            `;
        } else {
            const historyHTML = savedReadings.map(reading => `
                <div class="history-item" data-reading-id="${reading.id}">
                    <div class="history-header">
                        <strong>${reading.spreadInfo?.name || reading.spread}</strong>
                        <span class="history-date">${new Date(reading.timestamp).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div class="history-cards">
                        ${reading.cards.map(card => card.card.name).join(', ')}
                    </div>
                </div>
            `).join('');
            
            historyList.innerHTML = historyHTML;
        }
        
        historyModal.style.display = 'flex';
        
    } catch (error) {
        console.error('Failed to load history:', error);
        showToast('히스토리를 불러올 수 없습니다.');
    }
}

function closeHistoryModal() {
    const historyModal = document.getElementById('historyModal');
    if (historyModal) {
        historyModal.style.display = 'none';
    }
}

function showTodayCard() {
    // 하루에 한 번만 뽑는 특별한 카드
    const today = new Date().toDateString();
    const todayCardKey = `today_card_${today}`;
    
    let todayCard = localStorage.getItem(todayCardKey);
    
    if (!todayCard) {
        // 새로운 오늘의 카드 생성
        const randomCards = getRandomCards(1);
        todayCard = JSON.stringify(randomCards[0]);
        localStorage.setItem(todayCardKey, todayCard);
    }
    
    const cardData = JSON.parse(todayCard);
    const interpretation = getCardInterpretation(cardData.id, cardData.reversed);
    
    showToast(`오늘의 카드: ${cardData.card.name} ${cardData.reversed ? '(역방향)' : ''}`, 5000);
    
    // 모달 또는 특별한 UI로 표시할 수 있음
    console.log('Today\'s card:', cardData, interpretation);
}

function closeModal() {
    const modal = document.getElementById('cardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function playCardRevealSound() {
    // 웹 오디오 API를 사용한 간단한 사운드 효과
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // 사운드 재생 실패시 무시
        console.log('Sound not available');
    }
}

// ===========================
// window 객체에 함수 등록 (HTML onclick 접근용)
// ===========================

// 네비게이션 함수들
window.toggleNav = toggleNav;
window.toggleCategory = toggleCategory;
window.selectSpread = selectSpread;

// 메인 기능 함수들
window.performReading = performReading;
window.navigateCard = navigateCard;
window.resetToWelcome = resetToWelcome;
window.resetReading = resetReading;

// 부가 기능 함수들
window.saveReading = saveReading;
window.shareReading = shareReading;
window.showHistory = showHistory;
window.showTodayCard = showTodayCard;
window.closeHistoryModal = closeHistoryModal;
window.closeModal = closeModal;

// ===========================
// 초기화 및 이벤트 리스너
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 RHEIGHT Tarot System v2.0 - Split Layout');
    
    // 초기 상태 설정
    changeReadingState(ReadingState.WELCOME);
    
    // 기본 스프레드 선택
    currentSpread = 'single';
    
    // 스프레드 데이터 로드 확인
    if (window.TAROT_SPREADS) {
        console.log('✅ Tarot spreads data loaded');
    } else {
        console.warn('⚠️ Tarot spreads data not found');
    }
    
    // 키보드 단축키 설정
    document.addEventListener('keydown', function(e) {
        if (readingState === ReadingState.READING) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateCard('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();  
                navigateCard('next');
            }
        }
        
        // ESC 키로 모달 닫기
        if (e.key === 'Escape') {
            closeModal();
            closeHistoryModal();
        }
    });
    
    // 모바일에서 햄버거 메뉴 자동 닫기
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('.tarot-nav');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (nav && navToggle && nav.classList.contains('open')) {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('open');
            }
        }
    });
    
    // 시스템 준비 완료
    console.log('🌟 Tarot system ready');
    
    // 개발 모드에서 테스트 함수들을 전역으로 노출
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DEBUG_TAROT = {
            currentSpread,
            selectedCards,
            readingState,
            changeState: changeReadingState,
            getCards: () => selectedCards,
            testReading: () => {
                selectSpread('daily');
                setTimeout(() => performReading(), 100);
            }
        };
        console.log('🔧 Debug tools available in window.DEBUG_TAROT');
    }
});

// ===========================
// 반응형 및 접근성 향상
// ===========================

// 화면 크기 변화 감지
window.addEventListener('resize', function() {
    // 카드 레이아웃 재조정 (필요시)
    if (selectedCards.length > 0 && readingState !== ReadingState.WELCOME) {
        setTimeout(() => {
            createSpreadLayout(currentSpread, selectedCards);
        }, 100);
    }
});

// 스크린 리더 지원
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

console.log('✨ Tarot system loaded successfully');