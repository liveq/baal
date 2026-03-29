/**
 * RHEIGHT 타로카드 시스템 JavaScript - 수정된 버전
 * 중복 제거 및 핵심 기능 정리
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
    64: { name: '펜타클 에이스', suit: 'pentacles', number: 1, element: 'earth', symbol: '🪙' },
    65: { name: '펜타클 2', suit: 'pentacles', number: 2, element: 'earth', symbol: '🪙' },
    66: { name: '펜타클 3', suit: 'pentacles', number: 3, element: 'earth', symbol: '🪙' },
    67: { name: '펜타클 4', suit: 'pentacles', number: 4, element: 'earth', symbol: '🪙' },
    68: { name: '펜타클 5', suit: 'pentacles', number: 5, element: 'earth', symbol: '🪙' },
    69: { name: '펜타클 6', suit: 'pentacles', number: 6, element: 'earth', symbol: '🪙' },
    70: { name: '펜타클 7', suit: 'pentacles', number: 7, element: 'earth', symbol: '🪙' },
    71: { name: '펜타클 8', suit: 'pentacles', number: 8, element: 'earth', symbol: '🪙' },
    72: { name: '펜타클 9', suit: 'pentacles', number: 9, element: 'earth', symbol: '🪙' },
    73: { name: '펜타클 10', suit: 'pentacles', number: 10, element: 'earth', symbol: '🪙' },
    74: { name: '펜타클 시종', suit: 'pentacles', number: 11, element: 'earth', symbol: '🪙' },
    75: { name: '펜타클 기사', suit: 'pentacles', number: 12, element: 'earth', symbol: '🪙' },
    76: { name: '펜타클 여왕', suit: 'pentacles', number: 13, element: 'earth', symbol: '🪙' },
    77: { name: '펜타클 왕', suit: 'pentacles', number: 14, element: 'earth', symbol: '🪙' }
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
// 핵심 네비게이션 함수들
// ===========================

function toggleNav() {
    const nav = document.querySelector('.tarot-nav');
    const container = document.querySelector('.tarot-container');
    const toggleBtn = document.querySelector('.nav-toggle');
    
    if (nav) {
        nav.classList.toggle('active');
        if (container) {
            container.classList.toggle('nav-active');
        }
        if (toggleBtn) {
            toggleBtn.classList.toggle('active');
        }
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

// ===========================
// 유틸리티 함수들
// ===========================

function getRandomCards(count) {
    const cardIds = Object.keys(TAROT_CARDS).map(id => parseInt(id));
    const shuffled = shuffleArray(cardIds);
    
    return shuffled.slice(0, count).map(cardId => ({
        id: cardId,
        card: TAROT_CARDS[cardId],
        reversed: Math.random() < 0.3 // 30% 확률로 역방향
    }));
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    
    if (toast && toastText) {
        toastText.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }
}

function showLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.style.display = 'none';
}

// ===========================
// 기본 함수들 (간소화된 버전)
// ===========================

function updateNavigationUI(spreadName) {
    // 네비게이션 활성화 상태 업데이트
    document.querySelectorAll('.nav-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    const selectedItem = document.querySelector(`[onclick="selectSpread('${spreadName}')"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
}

function changeReadingState(newState) {
    const elements = {
        stateWelcome: document.getElementById('stateWelcome'),
        stateReady: document.getElementById('stateReady'),
        stateCardReading: document.getElementById('stateCardReading'),
        stateFinalReading: document.getElementById('stateFinalReading'),
        welcomeMessage: document.getElementById('welcomeMessage'),
        spreadContainer: document.getElementById('spreadContainer')
    };
    
    // 모든 상태 숨기기
    Object.values(elements).forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    readingState = newState;
    
    // 새 상태 표시
    switch (newState) {
        case ReadingState.WELCOME:
            if (elements.stateWelcome) elements.stateWelcome.style.display = 'block';
            if (elements.welcomeMessage) elements.welcomeMessage.style.display = 'block';
            if (elements.spreadContainer) elements.spreadContainer.style.display = 'none';
            break;
            
        case ReadingState.READY:
            if (elements.stateReady) elements.stateReady.style.display = 'block';
            if (elements.welcomeMessage) elements.welcomeMessage.style.display = 'none';
            if (elements.spreadContainer) elements.spreadContainer.style.display = 'block';
            break;
            
        case ReadingState.READING:
            if (elements.stateCardReading) elements.stateCardReading.style.display = 'block';
            if (elements.welcomeMessage) elements.welcomeMessage.style.display = 'none';
            if (elements.spreadContainer) elements.spreadContainer.style.display = 'block';
            break;
            
        case ReadingState.COMPLETE:
            if (elements.stateFinalReading) elements.stateFinalReading.style.display = 'block';
            break;
    }
}

function updateSpreadInfo() {
    const spreadInfo = window.TAROT_SPREADS?.[currentSpread];
    const layoutInfo = window.SPREAD_LAYOUTS?.[currentSpread];
    
    if (spreadInfo) {
        const spreadName = document.getElementById('spreadName');
        const spreadDesc = document.getElementById('spreadDesc');
        const spreadTitle = document.getElementById('spreadTitle');
        
        if (spreadName) spreadName.textContent = spreadInfo.name;
        if (spreadDesc) spreadDesc.textContent = spreadInfo.description;
        if (spreadTitle) spreadTitle.textContent = spreadInfo.name;
    }
    
    if (layoutInfo) {
        const cardCount = document.getElementById('cardCount');
        const difficulty = document.getElementById('difficulty');
        
        if (cardCount) cardCount.textContent = `카드 ${layoutInfo.cardCount}장`;
        if (difficulty) difficulty.textContent = layoutInfo.difficulty;
    }
}

function createSpreadLayout(spreadType, cards) {
    const cardsGrid = document.getElementById('cardsGrid');
    const spreadContainer = document.getElementById('spreadContainer');
    
    if (!cardsGrid) {
        console.error('cardsGrid 요소를 찾을 수 없습니다');
        return;
    }
    
    // spreadContainer 표시
    if (spreadContainer) {
        spreadContainer.style.display = 'block';
    }
    
    // 그리드 레이아웃 클래스 설정
    cardsGrid.className = 'cards-grid';
    
    const layoutInfo = window.SPREAD_LAYOUTS?.[spreadType];
    if (layoutInfo) {
        cardsGrid.classList.add(layoutInfo.gridClass);
    }
    
    // 카드들 생성
    cardsGrid.innerHTML = '';
    
    console.log(`Creating ${cards.length} cards for spread: ${spreadType}`);
    
    cards.forEach((cardData, index) => {
        const miniCard = createMiniCard(cardData, index);
        cardsGrid.appendChild(miniCard);
        console.log(`Card ${index + 1} created:`, cardData.card.name);
    });
    
    console.log('Spread layout created successfully');
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
    
    return card;
}

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
    
    // 모든 카드가 뒤집혔는지 확인하고 결과보기 버튼 표시
    const allRevealed = selectedCards.every(card => card.revealed);
    if (allRevealed) {
        showResultButton();
    }
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
    
    // DiceBear API 이미지 추가
    if (window.tarotAPI && window.tarotAPI.getCardImagePath) {
        const cardImage = document.createElement('img');
        cardImage.className = 'card-image';
        cardImage.src = window.tarotAPI.getCardImagePath(cardData.id, cardData.reversed);
        cardImage.alt = cardData.card.name;
        cardImage.onerror = function() {
            // 이미지 로드 실패 시 심볼 표시
            this.style.display = 'none';
            const cardSymbol = document.createElement('div');
            cardSymbol.className = 'card-symbol';
            cardSymbol.textContent = cardData.card.symbol || '🔮';
            cardContent.appendChild(cardSymbol);
        };
        cardContent.appendChild(cardImage);
    } else {
        // API 없을 때 심볼 표시
        const cardSymbol = document.createElement('div');
        cardSymbol.className = 'card-symbol';
        cardSymbol.textContent = cardData.card.symbol || '🔮';
        cardContent.appendChild(cardSymbol);
    }
    
    // 카드 이름 추가
    const cardName = document.createElement('div');
    cardName.className = 'card-mini-name';
    cardName.textContent = cardData.card.name;
    cardContent.appendChild(cardName);
    
    cardElement.appendChild(cardContent);
}

function showCardInterpretation(cardData, cardIndex) {
    const elements = {
        positionName: document.getElementById('positionName'),
        positionDescription: document.getElementById('positionDescription'),
        selectedCardName: document.getElementById('selectedCardName'),
        selectedCardOrientation: document.getElementById('selectedCardOrientation'),
        cardSymbol: document.getElementById('cardSymbol'),
        cardInterpretationText: document.getElementById('cardInterpretationText')
    };
    
    // 포지션 정보 표시
    const spreadPositions = window.TAROT_SPREADS?.[currentSpread]?.positions;
    const position = spreadPositions?.[cardIndex];
    
    if (position) {
        if (elements.positionName) elements.positionName.textContent = position.name;
        if (elements.positionDescription) elements.positionDescription.textContent = position.description;
    }
    
    // 카드 정보 표시
    if (elements.selectedCardName) elements.selectedCardName.textContent = cardData.card.name;
    if (elements.selectedCardOrientation) {
        elements.selectedCardOrientation.textContent = cardData.reversed ? '역방향' : '정방향';
        elements.selectedCardOrientation.className = `card-orientation ${cardData.reversed ? 'reversed' : 'upright'}`;
    }
    
    // 카드 이미지 또는 심볼 표시
    if (elements.cardSymbol) {
        elements.cardSymbol.innerHTML = ''; // 기존 내용 제거
        
        if (window.tarotAPI && window.tarotAPI.getCardImagePath) {
            const cardImage = document.createElement('img');
            cardImage.src = window.tarotAPI.getCardImagePath(cardData.id, cardData.reversed);
            cardImage.alt = cardData.card.name;
            cardImage.style.width = '100%';
            cardImage.style.height = '100%';
            cardImage.style.objectFit = 'contain';
            cardImage.onerror = function() {
                // 이미지 로드 실패 시 심볼 텍스트 표시
                elements.cardSymbol.textContent = cardData.card.symbol || '🔮';
            };
            elements.cardSymbol.appendChild(cardImage);
        } else {
            elements.cardSymbol.textContent = cardData.card.symbol || '🔮';
        }
    }
    
    // 해석 텍스트 생성
    const interpretation = getCardInterpretation(cardData.id, cardData.reversed);
    if (elements.cardInterpretationText) {
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
}

function getCardInterpretation(cardId, isReversed, context = 'general') {
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

function updateProgress() {
    const totalCards = selectedCards.length;
    const revealedCards = selectedCards.filter(card => card.revealed).length;
    const progress = totalCards > 0 ? (revealedCards / totalCards) * 100 : 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        if (revealedCards === 0) {
            progressText.textContent = '카드를 클릭하여 시작하세요';
        } else if (revealedCards === totalCards) {
            progressText.textContent = '모든 카드가 공개되었습니다';
        } else {
            progressText.textContent = `${revealedCards}/${totalCards} 카드 공개됨`;
        }
    }
}

// 간소화된 기타 함수들
function resetToWelcome() {
    changeReadingState(ReadingState.WELCOME);
    selectedCards = [];
    currentCardIndex = -1;
    spreadLayoutData = null;
    currentSpread = 'single';
    showToast('초기 화면으로 돌아갔습니다.');
}

function resetReading() {
    performReading();
}

function saveReading() {
    showToast('리딩 저장 기능은 준비 중입니다.');
}

function shareReading() {
    showToast('리딩 공유 기능은 준비 중입니다.');
}

function showHistory() {
    const historyModal = document.getElementById('historyModal');
    if (historyModal) {
        historyModal.style.display = 'none'; // 우선 숨김 처리
    }
    showToast('히스토리 기능은 준비 중입니다.');
}

function showTodayCard() {
    showToast('오늘의 카드 기능은 준비 중입니다.');
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) modal.style.display = 'none';
}

function closeModal() {
    const modal = document.getElementById('cardModal');
    if (modal) modal.style.display = 'none';
}

function navigateCard(direction) {
    showToast('카드 네비게이션 기능은 준비 중입니다.');
}

function showResultButton() {
    // 결과보기 버튼이 이미 있는지 확인
    if (document.getElementById('showResultBtn')) {
        return;
    }
    
    // 결과보기 버튼 생성
    const resultButton = document.createElement('div');
    resultButton.className = 'result-button-container';
    resultButton.innerHTML = `
        <div class="result-button-wrapper">
            <button id="showResultBtn" class="show-result-btn" onclick="showFinalResult()">
                <span class="btn-icon">✨</span>
                <span class="btn-text">최종 결과 보기</span>
                <span class="btn-subtitle">모든 카드의 종합적인 해석을 확인하세요</span>
            </button>
        </div>
    `;
    
    // 카드 해석 영역 아래에 삽입
    const interpretationArea = document.querySelector('.interpretation-content-area');
    if (interpretationArea && interpretationArea.parentNode) {
        interpretationArea.parentNode.insertBefore(resultButton, interpretationArea.nextSibling);
    }
    
    // 버튼 애니메이션
    setTimeout(() => {
        const btn = document.getElementById('showResultBtn');
        if (btn) {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }
    }, 100);
}

function showFinalResult() {
    changeReadingState(ReadingState.COMPLETE);
    
    // 결과보기 버튼 제거
    const resultButton = document.querySelector('.result-button-container');
    if (resultButton) {
        resultButton.remove();
    }
    
    showToast('모든 카드의 최종 해석을 확인해보세요!');
}

// ===========================
// window 객체에 함수 등록
// ===========================

window.toggleNav = toggleNav;
window.toggleCategory = toggleCategory;
window.selectSpread = selectSpread;
window.performReading = performReading;
window.resetToWelcome = resetToWelcome;
window.resetReading = resetReading;
window.saveReading = saveReading;
window.shareReading = shareReading;
window.showHistory = showHistory;
window.showTodayCard = showTodayCard;
window.closeHistoryModal = closeHistoryModal;
window.closeModal = closeModal;
window.navigateCard = navigateCard;
window.showFinalResult = showFinalResult;

// ===========================
// 초기화
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 RHEIGHT Tarot System v2.0 - Fixed Version');
    
    // 모든 모달 숨기기 (초기화 시)
    const modalsToHide = ['historyModal', 'cardModal'];
    modalsToHide.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
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
    
    // 시스템 준비 완료
    console.log('🌟 Tarot system ready');
});