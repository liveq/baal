// 액션 버튼들을 그리드 중앙에 정확히 배치하는 함수
function centerActionButtons() {
    const zodiacGrid = document.querySelector('.zodiac-grid');
    const actionButtonsRow = document.querySelector('.action-buttons-row');
    
    if (!zodiacGrid || !actionButtonsRow) return;
    
    // 그리드 정보 가져오기
    const gridStyle = window.getComputedStyle(zodiacGrid);
    const gridWidth = zodiacGrid.offsetWidth;
    const gap = parseFloat(gridStyle.gap) || 19.2; // 1.2rem = 19.2px (기본값)
    
    // 4열 그리드에서 각 열의 너비 계산
    // 총 너비 = (카드 너비 × 4) + (gap × 3)
    const cardWidth = (gridWidth - (gap * 3)) / 4;
    
    // 버튼들의 총 너비 계산
    const buttons = actionButtonsRow.querySelectorAll('button');
    let totalButtonWidth = 0;
    let buttonGap = 10; // 버튼 간 간격
    
    buttons.forEach(button => {
        totalButtonWidth += button.offsetWidth;
    });
    totalButtonWidth += buttonGap * (buttons.length - 1);
    
    // 그리드 중앙 기준으로 버튼들의 시작 위치 계산
    const gridCenter = gridWidth / 2;
    const buttonStartPosition = gridCenter - (totalButtonWidth / 2);
    
    // 버튼 컨테이너 스타일 적용
    actionButtonsRow.style.position = 'relative';
    actionButtonsRow.style.left = `${buttonStartPosition}px`;
    actionButtonsRow.style.width = `${totalButtonWidth}px`;
    actionButtonsRow.style.justifyContent = 'flex-start';
    
    console.log(`그리드 너비: ${gridWidth}px, 카드 너비: ${cardWidth.toFixed(1)}px, 버튼 총 너비: ${totalButtonWidth}px, 시작 위치: ${buttonStartPosition.toFixed(1)}px`);
}

// 헤더 제목 업데이트 함수
function updateYearTitle() {
    const currentYear = new Date().getFullYear();
    const yearInfo = year_data[currentYear] || year_data[2025]; // 기본값은 2025년
    
    // 헤더 제목 업데이트 (색깔+동물 형태 사용)
    const headerTitle = document.getElementById('header-year-title');
    const headerTooltip = document.getElementById('header-tooltip');
    
    if (headerTitle) {
        // 메인 텍스트만 업데이트 (툴팁은 그대로 유지)
        const titleText = headerTitle.firstChild;
        if (titleText && titleText.nodeType === Node.TEXT_NODE) {
            titleText.textContent = `${currentYear}년 ${yearInfo.color_animal} 띠별 운세`;
        } else {
            headerTitle.innerHTML = `${currentYear}년 ${yearInfo.color_animal} 띠별 운세<span class="header-title-tooltip" id="header-tooltip">${yearInfo.stem_branch}</span>`;
        }
    }
    
    // 툴팁 내용 업데이트
    if (headerTooltip) {
        headerTooltip.textContent = yearInfo.stem_branch;
    }
}

// 30년치 년도별 간지 데이터 (2025-2054)
const year_data = {
    2025: { stem_branch: '을사년', color_animal: '파란뱀의 해', zodiac_animal: '뱀', icon: '🐍' },
    2026: { stem_branch: '병오년', color_animal: '빨간말의 해', zodiac_animal: '말', icon: '🐴' },
    2027: { stem_branch: '정미년', color_animal: '빨간양의 해', zodiac_animal: '양', icon: '🐑' },
    2028: { stem_branch: '무신년', color_animal: '노란원숭이의 해', zodiac_animal: '원숭이', icon: '🐵' },
    2029: { stem_branch: '기유년', color_animal: '노란닭의 해', zodiac_animal: '닭', icon: '🐔' },
    2030: { stem_branch: '경술년', color_animal: '하얀개의 해', zodiac_animal: '개', icon: '🐶' },
    2031: { stem_branch: '신해년', color_animal: '하얀돼지의 해', zodiac_animal: '돼지', icon: '🐷' },
    2032: { stem_branch: '임자년', color_animal: '검은쥐의 해', zodiac_animal: '쥐', icon: '🐭' },
    2033: { stem_branch: '계축년', color_animal: '검은소의 해', zodiac_animal: '소', icon: '🐮' },
    2034: { stem_branch: '갑인년', color_animal: '파란호랑이의 해', zodiac_animal: '호랑이', icon: '🐯' },
    2035: { stem_branch: '을묘년', color_animal: '파란토끼의 해', zodiac_animal: '토끼', icon: '🐰' },
    2036: { stem_branch: '병진년', color_animal: '빨간용의 해', zodiac_animal: '용', icon: '🐲' },
    2037: { stem_branch: '정사년', color_animal: '빨간뱀의 해', zodiac_animal: '뱀', icon: '🐍' },
    2038: { stem_branch: '무오년', color_animal: '노란말의 해', zodiac_animal: '말', icon: '🐴' },
    2039: { stem_branch: '기미년', color_animal: '노란양의 해', zodiac_animal: '양', icon: '🐑' },
    2040: { stem_branch: '경신년', color_animal: '하얀원숭이의 해', zodiac_animal: '원숭이', icon: '🐵' },
    2041: { stem_branch: '신유년', color_animal: '하얀닭의 해', zodiac_animal: '닭', icon: '🐔' },
    2042: { stem_branch: '임술년', color_animal: '검은개의 해', zodiac_animal: '개', icon: '🐶' },
    2043: { stem_branch: '계해년', color_animal: '검은돼지의 해', zodiac_animal: '돼지', icon: '🐷' },
    2044: { stem_branch: '갑자년', color_animal: '파란쥐의 해', zodiac_animal: '쥐', icon: '🐭' },
    2045: { stem_branch: '을축년', color_animal: '파란소의 해', zodiac_animal: '소', icon: '🐮' },
    2046: { stem_branch: '병인년', color_animal: '빨간호랑이의 해', zodiac_animal: '호랑이', icon: '🐯' },
    2047: { stem_branch: '정묘년', color_animal: '빨간토끼의 해', zodiac_animal: '토끼', icon: '🐰' },
    2048: { stem_branch: '무진년', color_animal: '노란용의 해', zodiac_animal: '용', icon: '🐲' },
    2049: { stem_branch: '기사년', color_animal: '노란뱀의 해', zodiac_animal: '뱀', icon: '🐍' },
    2050: { stem_branch: '경오년', color_animal: '하얀말의 해', zodiac_animal: '말', icon: '🐴' },
    2051: { stem_branch: '신미년', color_animal: '하얀양의 해', zodiac_animal: '양', icon: '🐑' },
    2052: { stem_branch: '임신년', color_animal: '검은원숭이의 해', zodiac_animal: '원숭이', icon: '🐵' },
    2053: { stem_branch: '계유년', color_animal: '검은닭의 해', zodiac_animal: '닭', icon: '🐔' },
    2054: { stem_branch: '갑술년', color_animal: '파란개의 해', zodiac_animal: '개', icon: '🐶' }
};

// 띠 정보 데이터
const zodiac_data = {
    rat: { 
        name: '쥐띠', 
        icon: '🐭', 
        years: [1996, 1984, 1972, 1960, 1948],
        traits: ['지혜롭고', '민첩하며', '경제적 관념이 뛰어난']
    },
    ox: { 
        name: '소띠', 
        icon: '🐮', 
        years: [1997, 1985, 1973, 1961, 1949],
        traits: ['성실하고', '인내심이 강하며', '책임감이 있는']
    },
    tiger: { 
        name: '호랑이띠', 
        icon: '🐯', 
        years: [1998, 1986, 1974, 1962, 1950],
        traits: ['용감하고', '리더십이 있으며', '정의로운']
    },
    rabbit: { 
        name: '토끼띠', 
        icon: '🐰', 
        years: [1999, 1987, 1975, 1963, 1951],
        traits: ['온순하고', '예술적 감각이 있으며', '사교적인']
    },
    dragon: { 
        name: '용띠', 
        icon: '🐲', 
        years: [2000, 1988, 1976, 1964, 1952],
        traits: ['카리스마 있고', '야망이 크며', '행운이 따르는']
    },
    snake: { 
        name: '뱀띠', 
        icon: '🐍', 
        years: [2001, 1989, 1977, 1965, 1953],
        traits: ['지적이고', '직관력이 뛰어나며', '신중한']
    },
    horse: { 
        name: '말띠', 
        icon: '🐴', 
        years: [2002, 1990, 1978, 1966, 1954],
        traits: ['자유분방하고', '열정적이며', '독립적인']
    },
    sheep: { 
        name: '양띠', 
        icon: '🐑', 
        years: [2003, 1991, 1979, 1967, 1955],
        traits: ['예술적이고', '평화를 사랑하며', '창의적인']
    },
    monkey: { 
        name: '원숭이띠', 
        icon: '🐵', 
        years: [2004, 1992, 1980, 1968, 1956],
        traits: ['재치있고', '호기심이 많으며', '다재다능한']
    },
    rooster: { 
        name: '닭띠', 
        icon: '🐔', 
        years: [2005, 1993, 1981, 1969, 1957],
        traits: ['정확하고', '완벽주의적이며', '자신감 있는']
    },
    dog: { 
        name: '개띠', 
        icon: '🐶', 
        years: [2006, 1994, 1982, 1970, 1958],
        traits: ['충직하고', '정직하며', '의리가 있는']
    },
    pig: { 
        name: '돼지띠', 
        icon: '🐷', 
        years: [2007, 1995, 1983, 1971, 1959],
        traits: ['관대하고', '정이 많으며', '복이 많은']
    }
};

// 운세 템플릿
const fortune_templates = {
    daily: {
        intro: "오늘 {zodiac} {gender}분께는 {keyword}의 기운이 강하게 나타납니다.",
        detail: "{area}에서 {positive}한 변화가 예상되며, {advice}하시는 것이 좋겠습니다.",
        lucky: "행운의 숫자: {number}, 행운의 색: {color}"
    },
    weekly: {
        intro: "이번 주 {zodiac} {gender}분의 전체적인 운세는 {level} 수준입니다.",
        detail: "주 초반에는 {early}하지만, 주 후반으로 갈수록 {late}해질 것입니다.",
        advice: "특히 {day}요일에는 {caution}하시기 바랍니다."
    },
    monthly: {
        intro: "이번 달 {zodiac} {gender}분께는 {theme}가 중요한 시기입니다.",
        career: "직장/사업운: {career_fortune}",
        love: "애정운: {love_fortune}",
        health: "건강운: {health_fortune}",
        money: "재물운: {money_fortune}"
    },
    yearly: {
        intro: "2025년 을사년, {zodiac} {gender}분께는 {yearly_theme}의 해가 될 것입니다.",
        overall: "{season}에는 {seasonal_fortune}하며, 전반적으로 {overall_trend} 경향을 보입니다.",
        important: "올해 가장 중요한 것은 {key_point}입니다."
    },
    lifetime: {
        intro: "{zodiac}는 천성적으로 {traits}한 성격을 지니고 있습니다.",
        youth: "젊은 시절: {youth_fortune}",
        middle: "중년기: {middle_fortune}",
        senior: "노년기: {senior_fortune}",
        overall: "평생 운세: {lifetime_summary}"
    }
};

// 현재 상태 관리
let current_zodiac = null;
let current_period = 'daily';
let current_gender = 'male';
let current_year = null;
let selected_cards = {}; // 각 카드의 선택된 년도와 성별 저장

// 터치 제스처 지원 (모달용 - 선언 통합)
let touchStartX = null;
let touchStartY = null;

document.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = Math.abs(touchEndY - touchStartY);
    
    // 오른쪽 스와이프 (뒤로가기)
    if (diffX > 100 && diffY < 50) {
        // 결과 모달이 열려있으면 뒤로가기
        const resultModal = document.getElementById('result-modal');
        if (resultModal && resultModal.classList.contains('active')) {
            backToCompatibilityModal();
        }
    }
    
    touchStartX = null;
    touchStartY = null;
}, { passive: true });

// 마우스 물리 버튼 지원 (뒤로가기/앞으로가기 버튼)
document.addEventListener('mouseup', function(e) {
    // 버튼 3 = 뒤로가기 버튼 (일부 마우스)
    // 버튼 4 = 앞으로가기 버튼 (일부 마우스)
    if (e.button === 3) {
        const resultModal = document.getElementById('result-modal');
        if (resultModal && resultModal.classList.contains('active')) {
            e.preventDefault();
            backToCompatibilityModal();
        }
    }
});

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 년도별 제목 초기화
    updateYearTitle();
    
    // 액션 버튼 중앙 배치 초기화
    setTimeout(centerActionButtons, 100);
    
    // 모든 입력 필드 초기화 (브라우저 자동완성 방지)
    setTimeout(() => {
        ['modal-year', 'compat-my-year', 'compat-partner-year'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
            }
        });
    }, 100);
    
    // 사이드바 띠 버튼 이벤트
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const zodiac = this.dataset.zodiac;
            showZodiacDetail(zodiac);
        });
    });
    
    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            current_period = this.dataset.period;
            updateFortuneContent();
        });
    });
    
    // 성별 버튼 이벤트
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            current_gender = this.dataset.gender;
            updateFortuneContent();
        });
    });
    
    // Tab 키 네비게이션
    setupTabNavigation();
    
    // 생년월일 입력 자동 포커스 이동
    setupAutoFocus();
    
    // 궁합 폼 성별 선택
    setupCompatibilityGender();
    
    // 내띠 모달 설정
    setupMyZodiacModal();
});

// Tab 키 네비게이션 설정
function setupTabNavigation() {
    const inputs = ['year', 'month', 'day'];
    inputs.forEach((id, index) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Tab' && !e.shiftKey && index < inputs.length - 1) {
                    e.preventDefault();
                    document.getElementById(inputs[index + 1]).focus();
                }
            });
            
            // 자동 이동 (년도 4자리, 월/일 2자리 입력시)
            input.addEventListener('input', function() {
                const maxLength = id === 'year' ? 4 : 2;
                if (this.value.length === maxLength && index < inputs.length - 1) {
                    document.getElementById(inputs[index + 1]).focus();
                }
            });
        }
    });
}

// 자동 포커스 설정
function setupAutoFocus() {
    // 메인 생년월일 입력
    ['my-year', 'my-month', 'my-day', 'partner-year', 'partner-month', 'partner-day'].forEach((id, index, arr) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const maxLength = id.includes('year') ? 4 : 2;
                if (this.value.length === maxLength && index < arr.length - 1) {
                    document.getElementById(arr[index + 1]).focus();
                }
                
                // 띠 자동 계산 및 표시
                if (id.includes('year') && this.value.length === 4) {
                    const zodiac = getZodiacByYear(parseInt(this.value));
                    const displayId = id.includes('my') ? 'my-zodiac-display' : 'partner-zodiac-display';
                    const display = document.getElementById(displayId);
                    if (display && zodiac) {
                        display.textContent = zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name;
                    }
                }
            });
        }
    });
}

// 궁합 성별 선택 설정
function setupCompatibilityGender() {
    document.querySelectorAll('.gender-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.gender-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 년도로 띠 계산
function getZodiacByYear(year) {
    const zodiac_order = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep'];
    return zodiac_order[year % 12];
}

// 메인 페이지 표시
function showMainPage() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('main-page').classList.add('active');
    
    // 사이드바 버튼 활성화 해제
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 카드 정보 초기화
    selected_cards = {};
    
    // 모든 년도 버튼과 성별 버튼 선택 상태 초기화
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('.card-gender-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 년도별 제목 업데이트
    updateYearTitle();
    
    // 액션 버튼 중앙 배치 (DOM 렌더링 후 실행)
    setTimeout(centerActionButtons, 50);
    
    // History API로 메인 페이지 상태 추가
    history.pushState({ page: 'main' }, '', '#');
    
    // 스크롤 최상단
    window.scrollTo(0, 0);
}

// 띠별 상세 페이지 표시
function showZodiacDetail(zodiac) {
    current_zodiac = zodiac;
    
    // 페이지 전환
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('detail-page').classList.add('active');
    
    // 사이드바 활성화
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.zodiac-btn[data-zodiac="${zodiac}"]`).classList.add('active');
    
    // 제목 업데이트
    document.getElementById('zodiac-title').textContent = 
        zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name + ' 운세';
    
    // 성별 버튼 활성화 상태 동기화
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.gender === current_gender) {
            btn.classList.add('active');
        }
    });
    
    // 년도 버튼 추가 및 동기화
    updateDetailYearButtons(zodiac);
    
    // 운세 내용 업데이트
    updateFortuneContent();
    
    // History API로 URL 상태 추가 (뒤로가기 지원)
    history.pushState({ page: 'detail', zodiac: zodiac }, '', `#${zodiac}`);
    
    // 스크롤 최상단
    window.scrollTo(0, 0);
}

// 특정 년도로 띠 페이지 표시
function showZodiacWithYear(zodiac, year) {
    // 선택 정보 저장 구조 초기화
    if (!selected_cards[zodiac]) {
        selected_cards[zodiac] = {};
    }
    
    // 년도 정보 저장
    selected_cards[zodiac].year = year;
    current_year = year;
    
    // 해당 카드의 년도 버튼 선택 표시
    document.querySelectorAll(`.zodiac-card[data-zodiac="${zodiac}"] .year-btn`).forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent == year.toString()) {
            btn.classList.add('selected');
        }
    });
    
    // 년도와 성별 모두 선택되었으면 상세 페이지로 이동
    if (selected_cards[zodiac].year && selected_cards[zodiac].gender) {
        current_year = selected_cards[zodiac].year;
        current_gender = selected_cards[zodiac].gender;
        showZodiacDetail(zodiac);
    }
}

// 성별 선택
function selectGender(btn) {
    const zodiac = btn.dataset.zodiac;
    const gender = btn.dataset.gender;
    
    // 같은 띠의 성별 버튼만 업데이트
    document.querySelectorAll(`.card-gender-btn[data-zodiac="${zodiac}"]`).forEach(b => {
        b.classList.remove('selected');
    });
    btn.classList.add('selected');
    
    // 선택 정보 저장
    if (!selected_cards[zodiac]) {
        selected_cards[zodiac] = {};
    }
    selected_cards[zodiac].gender = gender;
    
    // 년도와 성별 모두 선택되었으면 상세 페이지로 이동
    if (selected_cards[zodiac].year && selected_cards[zodiac].gender) {
        current_year = selected_cards[zodiac].year;
        current_gender = selected_cards[zodiac].gender;
        showZodiacDetail(zodiac);
    }
}

// 상세 페이지 년도 버튼 업데이트
function updateDetailYearButtons(zodiac) {
    const container = document.getElementById('detail-year-buttons');
    const years = zodiac_data[zodiac].years;
    
    container.innerHTML = years.slice(0, 4).map(year => 
        `<button class="detail-year-btn ${year === current_year ? 'active' : ''}" 
                 onclick="changeDetailYear(${year})">${year}</button>`
    ).join('');
}

// 상세 페이지에서 년도 변경
function changeDetailYear(year) {
    current_year = year;
    
    // 버튼 활성화 상태 업데이트
    document.querySelectorAll('.detail-year-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == year.toString()) {
            btn.classList.add('active');
        }
    });
    
    // 운세 내용 업데이트 (필요시)
    updateFortuneContent();
}

// 운세 내용 업데이트
function updateFortuneContent() {
    if (!current_zodiac) return;
    
    const content = generateFortuneContent(current_zodiac, current_period, current_gender);
    document.getElementById('fortune-content').innerHTML = content;
}

// 운세 내용 생성
function generateFortuneContent(zodiac, period, gender) {
    const zodiac_info = zodiac_data[zodiac];
    const gender_text = gender === 'male' ? '남성' : '여성';
    
    let content = '<div class="fortune-text">';
    
    switch(period) {
        case 'daily':
            content += `
                <h3>📅 ${new Date().toLocaleDateString('ko-KR')} 오늘의 운세</h3>
                <p class="intro">오늘 ${zodiac_info.name} ${gender_text}분께는 새로운 기회의 문이 열리는 날입니다.</p>
                
                <div class="fortune-detail">
                    <h4>종합운</h4>
                    <p>오전에는 다소 피곤함을 느낄 수 있으나, 오후부터는 활력이 넘치게 됩니다. 
                    ${gender === 'male' ? '직장에서의 성과' : '대인관계에서의 조화'}가 기대되는 날입니다.</p>
                    
                    <h4>재물운</h4>
                    <p>예상치 못한 수입이 있을 수 있습니다. 그러나 충동적인 소비는 자제하시기 바랍니다.</p>
                    
                    <h4>애정운</h4>
                    <p>${gender === 'male' ? '적극적인 표현이 좋은 결과를 가져올' : '상대방의 마음을 이해하려는 노력이 필요한'} 시기입니다.</p>
                    
                    <h4>건강운</h4>
                    <p>무리하지 않는 선에서 가벼운 운동을 하시면 좋겠습니다.</p>
                </div>
                
                <div class="lucky-items">
                    <p>🔢 행운의 숫자: ${Math.floor(Math.random() * 45) + 1}</p>
                    <p>🎨 행운의 색: ${['빨강', '파랑', '노랑', '초록', '보라'][Math.floor(Math.random() * 5)]}</p>
                    <p>🧭 행운의 방향: ${['동', '서', '남', '북'][Math.floor(Math.random() * 4)]}</p>
                </div>
            `;
            break;
            
        case 'weekly':
            content += `
                <h3>📅 이번 주 운세 (${getWeekPeriod()})</h3>
                <p class="intro">${zodiac_info.name} ${gender_text}분의 이번 주는 도전과 기회가 공존하는 시기입니다.</p>
                
                <div class="fortune-detail">
                    <h4>주간 흐름</h4>
                    <p>월요일과 화요일은 준비의 시간으로, 수요일부터 본격적인 활동이 시작됩니다.
                    주말에는 ${gender === 'male' ? '가족과의 시간' : '자기 계발'}에 집중하시면 좋겠습니다.</p>
                    
                    <h4>주의할 날</h4>
                    <p>목요일에는 중요한 결정을 미루는 것이 좋습니다. 감정적인 판단보다는 이성적인 접근이 필요합니다.</p>
                    
                    <h4>행운의 날</h4>
                    <p>금요일이 가장 운이 좋은 날입니다. 새로운 시도를 해보시기 바랍니다.</p>
                </div>
            `;
            break;
            
        case 'monthly':
            content += `
                <h3>📅 ${new Date().getMonth() + 1}월 운세</h3>
                <p class="intro">이번 달 ${zodiac_info.name} ${gender_text}분께는 성장과 발전의 기회가 찾아옵니다.</p>
                
                <div class="fortune-detail">
                    <h4>전체운</h4>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${70 + Math.random() * 20}%"></div>
                    </div>
                    
                    <h4>직장/사업운</h4>
                    <p>${gender === 'male' ? '승진이나 연봉 인상' : '새로운 프로젝트 참여'}의 기회가 있을 수 있습니다.
                    상사나 동료와의 관계를 원만하게 유지하시기 바랍니다.</p>
                    
                    <h4>금전운</h4>
                    <p>수입은 안정적이나, 예상치 못한 지출이 있을 수 있으니 미리 대비하시기 바랍니다.</p>
                    
                    <h4>애정운</h4>
                    <p>${gender === 'male' ? '솔직한 대화가 관계 개선의 열쇠' : '상대방을 배려하는 마음이 중요한'} 시기입니다.</p>
                    
                    <h4>건강운</h4>
                    <p>규칙적인 생활 습관을 유지하시고, 충분한 수면을 취하시기 바랍니다.</p>
                </div>
            `;
            break;
            
        case 'yearly':
            const currentYear = new Date().getFullYear();
            const yearInfo = year_data[currentYear] || year_data[2025]; // 기본값은 2025년
            content += `
                <h3>${yearInfo.icon} ${currentYear}년 ${yearInfo.stem_branch} 운세</h3>
                <p class="intro">${zodiac_info.name} ${gender_text}분께 ${currentYear}년은 '${['도약', '안정', '변화', '성취'][Math.floor(Math.random() * 4)]}'의 해가 될 것입니다.</p>
                
                <div class="fortune-detail">
                    <h4>연간 총운</h4>
                    <p>올해는 ${zodiac_info.traits[0]} 본연의 성격이 빛을 발하는 한 해가 될 것입니다.
                    ${gender === 'male' ? '사업과 직장에서 큰 성과' : '가정과 대인관계에서의 조화'}가 기대됩니다.</p>
                    
                    <h4>상반기 (1월~6월)</h4>
                    <p>준비와 계획의 시기입니다. 서두르지 말고 차근차근 기초를 다지시기 바랍니다.</p>
                    
                    <h4>하반기 (7월~12월)</h4>
                    <p>상반기에 준비한 것들이 결실을 맺는 시기입니다. 적극적으로 행동하시기 바랍니다.</p>
                    
                    <h4>올해의 조언</h4>
                    <p>"겸손은 최고의 미덕이다" - 자만하지 말고 늘 배우는 자세를 유지하시기 바랍니다.</p>
                </div>
            `;
            break;
            
        case 'lifetime':
            content += `
                <h3>🌟 평생 운세</h3>
                <p class="intro">${zodiac_info.name}는 ${zodiac_info.traits.join(', ')} 특성을 지닌 운명입니다.</p>
                
                <div class="fortune-detail">
                    <h4>성격과 기질</h4>
                    <p>${zodiac_info.name} ${gender_text}분은 타고난 ${zodiac_info.traits[0]} 성격으로 
                    주변 사람들에게 ${['신뢰', '존경', '사랑'][Math.floor(Math.random() * 3)]}를 받습니다.</p>
                    
                    <h4>청년기 (20~35세)</h4>
                    <p>열정과 도전의 시기입니다. 많은 시행착오를 겪겠지만, 그것이 모두 소중한 경험이 될 것입니다.</p>
                    
                    <h4>중년기 (36~55세)</h4>
                    <p>안정과 성취의 시기입니다. ${gender === 'male' ? '사회적 지위' : '가정의 행복'}가 절정에 달합니다.</p>
                    
                    <h4>노년기 (56세 이후)</h4>
                    <p>지혜와 여유의 시기입니다. 후대에게 좋은 본보기가 되며, 존경받는 어른이 됩니다.</p>
                    
                    <h4>인생의 전환점</h4>
                    <p>${[32, 38, 45, 51][Math.floor(Math.random() * 4)]}세 경에 인생의 큰 전환점이 찾아올 것입니다.</p>
                </div>
            `;
            break;
    }
    
    content += '</div>';
    return content;
}

// 주간 기간 텍스트 생성
function getWeekPeriod() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return `${monday.getMonth() + 1}/${monday.getDate()} ~ ${sunday.getMonth() + 1}/${sunday.getDate()}`;
}

// 다른 띠로 변경
function changeZodiac(zodiac) {
    if (zodiac) {
        showZodiacDetail(zodiac);
        document.getElementById('zodiac-selector').value = '';
    }
}

// 생년월일로 검색
function searchByBirth() {
    const year = document.getElementById('year').value;
    if (year && year.length === 4) {
        const zodiac = getZodiacByYear(parseInt(year));
        showZodiacDetail(zodiac);
    } else {
        alert('올바른 년도를 입력해주세요.');
    }
}

// 평생운세 모달 표시
function showLifetimeFortune(zodiac) {
    const modal = document.getElementById('lifetime-modal');
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('lifetime-title');
    const content = document.getElementById('lifetime-content');
    
    title.textContent = zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name + ' 평생 운세';
    content.innerHTML = generateFortuneContent(zodiac, 'lifetime', 'male');
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

// 궁합 모달 표시
function showCompatibilityModal() {
    const modal = document.getElementById('compatibility-modal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
}


// 궁합 확인
function checkCompatibility() {
    const myYear = document.getElementById('my-year').value;
    const partnerYear = document.getElementById('partner-year').value;
    
    if (!myYear || !partnerYear) {
        alert('생년월일을 모두 입력해주세요.');
        return;
    }
    
    const myZodiac = getZodiacByYear(parseInt(myYear));
    const partnerZodiac = getZodiacByYear(parseInt(partnerYear));
    
    const myGender = document.querySelector('.person-input:first-child .gender-option.active').dataset.gender;
    const partnerGender = document.querySelector('.person-input:last-child .gender-option.active').dataset.gender;
    const relationshipType = document.getElementById('relationship-type').value;
    
    // 궁합 결과 생성
    const result = generateCompatibilityResult(
        myZodiac, partnerZodiac, 
        myGender, partnerGender, 
        relationshipType
    );
    
    // 결과 모달 표시
    document.getElementById('compatibility-result').innerHTML = result;
    document.getElementById('result-modal').classList.add('active');
    
    // 입력 모달 닫기
    closeModal('compatibility-modal');
    
}

// 궁합 결과 생성
function generateCompatibilityResult(zodiac1, zodiac2, gender1, gender2, relationship) {
    const info1 = zodiac_data[zodiac1];
    const info2 = zodiac_data[zodiac2];
    const gender1_text = gender1 === 'male' ? '남성' : '여성';
    const gender2_text = gender2 === 'male' ? '남성' : '여성';
    
    // 궁합 점수 계산 (간단한 로직)
    const score = calculateCompatibilityScore(zodiac1, zodiac2);
    const level = score >= 80 ? '최상' : score >= 60 ? '좋음' : score >= 40 ? '보통' : '노력 필요';
    
    let result = `
        <div class="compatibility-result">
            <div class="result-header">
                <div class="person">${info1.icon} ${info1.name} ${gender1_text}</div>
                <div class="vs">💕</div>
                <div class="person">${info2.icon} ${info2.name} ${gender2_text}</div>
            </div>
            
            <div class="score-section">
                <h3>궁합 점수</h3>
                <div class="score-circle">
                    <span class="score">${score}</span>
                    <span class="max">/100</span>
                </div>
                <p class="level">${level}</p>
            </div>
            
            <div class="analysis">
                <h3>${relationship === 'lover' ? '연인' : 
                     relationship === 'spouse' ? '부부' : 
                     relationship === 'friend' ? '친구' : 
                     relationship === 'business' ? '사업 파트너' : '부모-자녀'} 궁합 분석</h3>
                
                <div class="compatibility-detail">
                    <h4>👍 장점</h4>
                    <p>${info1.name}의 ${info1.traits[0]} 성격과 ${info2.name}의 ${info2.traits[0]} 성격이 
                    서로 ${score >= 60 ? '조화를 이루어' : '보완하여'} 좋은 관계를 만들 수 있습니다.</p>
                    
                    <h4>⚠️ 주의점</h4>
                    <p>${info1.name}는 때로 ${['고집스러울', '감정적일', '충동적일'][Math.floor(Math.random() * 3)]} 수 있고,
                    ${info2.name}는 ${['예민할', '소극적일', '완고할'][Math.floor(Math.random() * 3)]} 수 있으니 
                    서로를 이해하려는 노력이 필요합니다.</p>
                    
                    <h4>💡 조언</h4>
                    <p>${relationship === 'lover' || relationship === 'spouse' ? 
                        '서로의 다름을 인정하고 존중하는 것이 행복한 관계의 비결입니다.' :
                        '상호 신뢰를 바탕으로 서로의 장점을 살려나가시기 바랍니다.'}</p>
                </div>
            </div>
        </div>
    `;
    
    return result;
}

// 궁합 점수 계산
function calculateCompatibilityScore(zodiac1, zodiac2) {
    // 간단한 궁합 매트릭스 (실제로는 더 복잡한 로직 필요)
    const compatibility_matrix = {
        'rat': { rat: 85, ox: 90, tiger: 60, rabbit: 70, dragon: 95, snake: 80, horse: 40, sheep: 60, monkey: 90, rooster: 70, dog: 75, pig: 85 },
        'ox': { rat: 90, ox: 80, tiger: 50, rabbit: 75, dragon: 70, snake: 90, horse: 45, sheep: 55, monkey: 65, rooster: 90, dog: 70, pig: 80 },
        'tiger': { rat: 60, ox: 50, tiger: 75, rabbit: 65, dragon: 85, snake: 55, horse: 90, sheep: 70, monkey: 45, rooster: 60, dog: 95, pig: 75 },
        // ... 나머지 띠들도 추가 필요
    };
    
    // 매트릭스에 없으면 랜덤 점수
    if (compatibility_matrix[zodiac1] && compatibility_matrix[zodiac1][zodiac2]) {
        return compatibility_matrix[zodiac1][zodiac2];
    }
    
    // 기본 점수 계산
    return 50 + Math.floor(Math.random() * 40);
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    
    // 결과 모달 이벤트 리스너 정리
    if (modalId === 'result-modal' && window.resultKeyHandler) {
        document.removeEventListener('keydown', window.resultKeyHandler);
        window.resultKeyHandler = null;
    }
}

// 오버레이 클릭시 모달 닫기
document.getElementById('overlay').addEventListener('click', function() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    this.classList.remove('active');
});

// 궁합 모달로 돌아가기 (값 초기화)
function backToCompatibilityModal() {
    // 결과 모달 닫기
    closeModal('result-modal');
    
    // 궁합 입력 모달 열기 (값 초기화)
    setTimeout(() => {
        showCompatibilityModalSimple(true);
    }, 50);
}

// 브라우저 뒤로가기/앞으로가기 지원
window.addEventListener('popstate', function(event) {
    const resultModal = document.getElementById('result-modal');
    const compatModal = document.getElementById('simple-compatibility-modal');
    const myZodiacModal = document.getElementById('my-zodiac-modal');
    
    // 결과 모달이 열려있는 경우 - 입력 모달로 돌아가기 (값 초기화)
    if (resultModal?.classList.contains('active')) {
        closeModal('result-modal');
        showCompatibilityModalSimple(true);
        return;
    }
    
    // 궁합 모달이 열려있고 결과로 가는 경우가 아니면 닫기
    if (compatModal?.classList.contains('active') && event.state?.modal !== 'compatibility-result') {
        closeModal('simple-compatibility-modal');
        // 초기 페이지로 돌아가는 경우 입력값 초기화
        document.getElementById('compat-my-year').value = '';
        document.getElementById('compat-partner-year').value = '';
        document.getElementById('my-zodiac-compat').innerHTML = '';
        document.getElementById('partner-zodiac-compat').innerHTML = '';
        // 관계 버튼도 초기화
        document.querySelectorAll('.relation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        const firstBtn = document.querySelector('.relation-btn[data-type="lover"]');
        if (firstBtn) {
            firstBtn.classList.add('selected');
        }
    }
    
    // 내띠보기 모달 닫기
    if (myZodiacModal?.classList.contains('active')) {
        closeModal('my-zodiac-modal');
    }
    
    if (event.state) {
        if (event.state.page === 'main') {
            // 메인 페이지로 이동
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('main-page').classList.add('active');
            
            // 사이드바 버튼 활성화 해제
            document.querySelectorAll('.zodiac-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 선택된 카드 정보 초기화
            selected_cards = {};
            
            // 모든 년도 버튼과 성별 버튼 선택 상태 초기화
            document.querySelectorAll('.year-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            document.querySelectorAll('.card-gender-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // 년도별 제목 업데이트
            updateYearTitle();
            
            // 액션 버튼 중앙 배치
            setTimeout(centerActionButtons, 50);
            
            console.log('브라우저 뒤로가기로 메인페이지 초기화 완료');
        } else if (event.state.page === 'detail' && event.state.zodiac) {
            // 상세 페이지로 이동
            current_zodiac = event.state.zodiac;
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('detail-page').classList.add('active');
            
            // 사이드바 활성화
            document.querySelectorAll('.zodiac-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`.zodiac-btn[data-zodiac="${event.state.zodiac}"]`).classList.add('active');
            
            // 제목 업데이트
            document.getElementById('zodiac-title').textContent = 
                zodiac_data[event.state.zodiac].icon + ' ' + zodiac_data[event.state.zodiac].name + ' 운세';
            
            // 운세 내용 업데이트
            updateFortuneContent();
        }
    } else {
        // 초기 상태로 돌아가기 (메인 페이지)
        showMainPage();
    }
});

// 모바일 스와이프 제스처 지원 (통합)
// touchStartX, touchStartY는 상단에서 이미 선언됨

// 내띠 찾기 모달 표시
function showMyZodiacModal() {
    const modal = document.getElementById('my-zodiac-modal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    
    // 입력 필드 초기화
    document.getElementById('modal-year').value = '';
    document.getElementById('zodiac-preview').innerHTML = '<p style="color: var(--text-light);">출생년도를 입력하면 띠가 표시됩니다</p>';
    
    // 첫번째 입력 필드에 포커스 및 영문 입력으로 전환
    setTimeout(() => {
        const yearInput = document.getElementById('modal-year');
        yearInput.focus();
        
        // 강제로 영문 입력 모드 설정 (여러 방법 시도)
        yearInput.setAttribute('lang', 'en');
        yearInput.setAttribute('type', 'tel');
        yearInput.style.imeMode = 'disabled';
        
        
        // 빈 값 입력 후 지우기 (IME 리셋)
        yearInput.value = ' ';
        yearInput.value = '';
    }, 100);
}

// 내띠 모달 설정
function setupMyZodiacModal() {
    // 숫자만 입력 가능하도록 설정
    ['modal-year', 'modal-month', 'modal-day'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            // 숫자 아닌 문자 입력 방지
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            
            // 키 입력시 숫자 외 차단
            input.addEventListener('keypress', function(e) {
                // 엔터키는 허용
                if (e.key === 'Enter') return;
                
                // 숫자가 아닌 키 차단
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
            
            // 포커스시 영문 모드 강제
            input.addEventListener('focus', function() {
                this.setAttribute('type', 'tel');  // 모바일 숫자 키패드
                this.style.imeMode = 'disabled';   // IME 비활성화
            });
        }
    });
    
    // 성별 선택 버튼
    document.querySelectorAll('.gender-select-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gender-select-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ESC 및 백스페이스 키보드 지원
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모달 닫기
        if (e.key === 'Escape') {
            const resultModal = document.getElementById('result-modal');
            const compatModal = document.getElementById('simple-compatibility-modal');
            const myZodiacModal = document.getElementById('my-zodiac-modal');
            const lifetimeModal = document.getElementById('lifetime-modal');
            
            // 결과 모달이 열려있으면 닫기
            if (resultModal && resultModal.classList.contains('active')) {
                e.preventDefault();
                closeModal('result-modal');
                return;
            }
            
            // 궁합보기 모달이 열려있으면 닫기
            if (compatModal && compatModal.classList.contains('active')) {
                e.preventDefault();
                closeModal('simple-compatibility-modal');
                return;
            }
            
            // 내띠보기 모달이 열려있으면 닫기
            if (myZodiacModal && myZodiacModal.classList.contains('active')) {
                e.preventDefault();
                closeModal('my-zodiac-modal');
                return;
            }
            
            // 평생운세 모달이 열려있으면 닫기
            if (lifetimeModal && lifetimeModal.classList.contains('active')) {
                e.preventDefault();
                closeModal('lifetime-modal');
                return;
            }
        }
        
        // 궁합 결과 모달에서 백스페이스 처리
        const resultModal = document.getElementById('result-modal');
        if (resultModal && resultModal.classList.contains('active')) {
            if (e.key === 'Backspace') {
                e.preventDefault();
                backToCompatibilityModal();
                return;
            }
        }
        
        // 성별 선택 단축키 (M/B/F/G)
        const myZodiacModal = document.getElementById('my-zodiac-modal');
        if (myZodiacModal && myZodiacModal.classList.contains('active')) {
            // M, B, ㅡ, ㅠ 키로 남성 선택
            if (e.key === 'm' || e.key === 'M' || e.key === 'b' || e.key === 'B' || 
                e.key === 'ㅡ' || e.key === 'ㅠ') {
                e.preventDefault();
                const maleBtn = document.querySelector('.gender-select-btn[data-gender="male"]');
                if (maleBtn) {
                    maleBtn.click();
                }
                return;
            }
            
            // F, G, ㄹ, ㅎ 키로 여성 선택
            if (e.key === 'f' || e.key === 'F' || e.key === 'g' || e.key === 'G' || 
                e.key === 'ㄹ' || e.key === 'ㅎ') {
                e.preventDefault();
                const femaleBtn = document.querySelector('.gender-select-btn[data-gender="female"]');
                if (femaleBtn) {
                    femaleBtn.click();
                }
                return;
            }
        }
    });
    
    // 년도 입력시 띠 자동 표시
    const yearInput = document.getElementById('modal-year');
    if (yearInput) {
        yearInput.addEventListener('input', function() {
            if (this.value.length === 4) {
                const year = parseInt(this.value);
                const zodiac = getZodiacByYear(year);
                const preview = document.getElementById('zodiac-preview');
                if (zodiac && zodiac_data[zodiac]) {
                    preview.innerHTML = `
                        <div class="zodiac-preview-icon">${zodiac_data[zodiac].icon}</div>
                        <div class="zodiac-preview-text">${zodiac_data[zodiac].name}</div>
                    `;
                }
            }
        });
        
        // 년도 입력 필드에서 엔터키 처리
        yearInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmMyZodiac();
            }
        });
    }
    
    // 월 입력시 자동 이동 (제거됨)
    const monthInput = document.getElementById('modal-month');
    if (monthInput) {
        monthInput.addEventListener('input', function() {
            if (this.value.length === 2) {
                document.getElementById('modal-day').focus();
            }
        });
        
        // 월 입력 필드에서 엔터키 처리
        monthInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const dayInput = document.getElementById('modal-day');
                if (dayInput.value) {
                    confirmMyZodiac();
                } else {
                    dayInput.focus();
                }
            }
        });
    }
    
    // 일 입력 필드에서 엔터키 처리
    const dayInput = document.getElementById('modal-day');
    if (dayInput) {
        dayInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmMyZodiac();
            }
        });
    }
}

// 내띠 확인 후 상세 페이지로 이동
function confirmMyZodiac() {
    const year = document.getElementById('modal-year').value;
    
    if (!year || year.length !== 4) {
        // 인라인 에러 메시지 표시
        const preview = document.getElementById('zodiac-preview');
        preview.innerHTML = '<p class="error-message" style="color: #ff6b6b; font-size: 0.9rem;">출생년도를 4자리로 정확히 입력해주세요</p>';
        
        // 3초 후 기본 메시지로 복원
        setTimeout(() => {
            preview.innerHTML = '<p style="color: var(--text-light);">출생년도를 입력하면 띠가 표시됩니다</p>';
        }, 3000);
        return;
    }
    
    const zodiac = getZodiacByYear(parseInt(year));
    const selectedGender = document.querySelector('.gender-select-btn.active').dataset.gender;
    
    // 현재 성별 설정
    current_gender = selectedGender;
    
    // 모달 닫기
    closeModal('my-zodiac-modal');
    
    // 해당 띠의 상세 페이지로 이동
    showZodiacDetail(zodiac);
}

// 개별 선택기 표시
function showIndividualPicker(type) {
    const dropdown = document.getElementById('individual-picker-dropdown');
    const content = document.getElementById('picker-content');
    
    content.innerHTML = '';
    content.className = '';
    
    if (type === 'year') {
        content.className = 'year-picker';
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1940; year--) {
            const option = document.createElement('button');
            option.className = 'picker-option';
            option.textContent = year;
            option.onclick = function() {
                document.getElementById('modal-year').value = year;
                // 띠 미리보기 업데이트
                const zodiac = getZodiacByYear(year);
                const preview = document.getElementById('zodiac-preview');
                if (zodiac && zodiac_data[zodiac]) {
                    preview.innerHTML = `
                        <div class="zodiac-preview-icon">${zodiac_data[zodiac].icon}</div>
                        <div class="zodiac-preview-text">${zodiac_data[zodiac].name}</div>
                    `;
                }
                closeIndividualPicker();
            };
            content.appendChild(option);
        }
    }
    
    dropdown.classList.add('active');
}

// 개별 선택기 닫기
function closeIndividualPicker() {
    document.getElementById('individual-picker-dropdown').classList.remove('active');
}

// 날짜 선택기 표시 (기존 함수는 더 이상 사용하지 않음)
function showDatePicker() {
    const dropdown = document.getElementById('date-picker-dropdown');
    const yearSelect = document.getElementById('picker-year');
    const monthSelect = document.getElementById('picker-month');
    const daySelect = document.getElementById('picker-day');
    
    // 년도 옵션 생성 (1940년부터 현재년도까지)
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for (let year = currentYear; year >= 1940; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '년';
        if (year === 1990) option.selected = true; // 기본값
        yearSelect.appendChild(option);
    }
    
    // 월 옵션 생성
    monthSelect.innerHTML = '';
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;  // 0 패딩 제거
        option.textContent = month + '월';
        monthSelect.appendChild(option);
    }
    
    // 일 옵션 생성
    daySelect.innerHTML = '';
    for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day;  // 0 패딩 제거
        option.textContent = day + '일';
        daySelect.appendChild(option);
    }
    
    // 드롭다운 토글
    dropdown.classList.toggle('active');
    
    // 년도 변경시 띠 미리보기
    yearSelect.addEventListener('change', function() {
        const year = parseInt(this.value);
        const zodiac = getZodiacByYear(year);
        const preview = document.getElementById('zodiac-preview');
        if (zodiac && zodiac_data[zodiac]) {
            preview.innerHTML = `
                <div class="zodiac-preview-icon">${zodiac_data[zodiac].icon}</div>
                <div class="zodiac-preview-text">${zodiac_data[zodiac].name}</div>
            `;
        }
    });
    
    // 월 변경시 일수 업데이트
    monthSelect.addEventListener('change', function() {
        updateDayOptions();
    });
    
    yearSelect.addEventListener('change', function() {
        updateDayOptions();
    });
}

// 월에 따른 일수 업데이트
function updateDayOptions() {
    const yearSelect = document.getElementById('picker-year');
    const monthSelect = document.getElementById('picker-month');
    const daySelect = document.getElementById('picker-day');
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const currentDay = parseInt(daySelect.value);
    
    let maxDay = 31;
    if (month === 2) {
        // 윤년 체크
        maxDay = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
        maxDay = 30;
    }
    
    daySelect.innerHTML = '';
    for (let day = 1; day <= maxDay; day++) {
        const option = document.createElement('option');
        option.value = day;  // 0 패딩 제거
        option.textContent = day + '일';
        if (day === currentDay && currentDay <= maxDay) {
            option.selected = true;
        }
        daySelect.appendChild(option);
    }
}

// 날짜 선택 적용
function applyDatePicker() {
    const year = document.getElementById('picker-year').value;
    const month = document.getElementById('picker-month').value;
    const day = document.getElementById('picker-day').value;
    
    document.getElementById('modal-year').value = year;
    document.getElementById('modal-month').value = month;
    document.getElementById('modal-day').value = day;
    
    // 드롭다운 닫기
    document.getElementById('date-picker-dropdown').classList.remove('active');
    
    // 띠 미리보기 업데이트
    const zodiac = getZodiacByYear(parseInt(year));
    const preview = document.getElementById('zodiac-preview');
    if (zodiac && zodiac_data[zodiac]) {
        preview.innerHTML = `
            <div class="zodiac-preview-icon">${zodiac_data[zodiac].icon}</div>
            <div class="zodiac-preview-text">${zodiac_data[zodiac].name}</div>
        `;
    }
}

// 모달 외부 클릭시 개별 선택기 닫기
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('individual-picker-dropdown');
    const btns = document.querySelectorAll('.individual-picker-btn');
    
    if (dropdown && dropdown.classList.contains('active')) {
        let isButton = false;
        btns.forEach(btn => {
            if (e.target === btn) isButton = true;
        });
        
        if (!dropdown.contains(e.target) && !isButton) {
            dropdown.classList.remove('active');
        }
    }
});

// 간편 궁합보기 모달 표시
function showCompatibilityModalSimple(shouldInitialize = true) {
    const modal = document.getElementById('simple-compatibility-modal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // 히스토리에 추가 (처음 열 때만)
    if (shouldInitialize) {
        history.pushState({ modal: 'compatibility' }, '', '#compatibility');
    }
    
    // 초기화가 필요한 경우에만 초기화
    if (shouldInitialize) {
        // 입력 필드 초기화
        document.getElementById('compat-my-year').value = '';
        document.getElementById('compat-partner-year').value = '';
        document.getElementById('my-zodiac-compat').innerHTML = '';
        document.getElementById('partner-zodiac-compat').innerHTML = '';
        
        // 관계 버튼 초기화
        document.querySelectorAll('.relation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 첫번째 관계 버튼 선택
        const firstBtn = document.querySelector('.relation-btn[data-type="lover"]');
        if (firstBtn) {
            firstBtn.classList.add('selected');
        }
        
        // 성별 버튼 초기화 (선택 없음)
        document.querySelectorAll('.compat-gender-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // 첫번째 입력 필드에 포커스
    setTimeout(() => {
        document.getElementById('compat-my-year').focus();
    }, 100);
    
    // 년도 입력시 띠 자동 표시
    setupCompatibilityInputs();
    
    // 관계 버튼 이벤트 설정
    initRelationButtons();
    
    // 년도 입력 자동 포커스 이동
    initYearInputAutoFocus();
    
    // 성별 버튼 이벤트 설정
    initGenderButtons();
}

// 궁합 입력 필드 설정
function setupCompatibilityInputs() {
    // 나의 년도 입력시
    const myYearInput = document.getElementById('compat-my-year');
    if (myYearInput) {
        // 기존 이벤트 리스너 제거
        const newMyYearInput = myYearInput.cloneNode(true);
        myYearInput.parentNode.replaceChild(newMyYearInput, myYearInput);
        
        newMyYearInput.addEventListener('input', function() {
            // 숫자만 허용
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length === 4) {
                const zodiac = getZodiacByYear(parseInt(this.value));
                const display = document.getElementById('my-zodiac-compat');
                if (zodiac && zodiac_data[zodiac]) {
                    display.innerHTML = `
                        <div style="font-size: 2rem;">${zodiac_data[zodiac].icon}</div>
                        <div style="font-size: 0.9rem; margin-top: 0.5rem;">${zodiac_data[zodiac].name}</div>
                    `;
                } else {
                    display.innerHTML = '';
                }
                // 자동 포커스는 initYearInputAutoFocus에서 처리
            } else {
                document.getElementById('my-zodiac-compat').innerHTML = '';
            }
        });
        
        // 엔터키 처리는 initYearInputAutoFocus에서 처리
    }
    
    // 상대방 년도 입력시
    const partnerYearInput = document.getElementById('compat-partner-year');
    if (partnerYearInput) {
        // 기존 이벤트 리스너 제거
        const newPartnerYearInput = partnerYearInput.cloneNode(true);
        partnerYearInput.parentNode.replaceChild(newPartnerYearInput, partnerYearInput);
        
        newPartnerYearInput.addEventListener('input', function() {
            // 숫자만 허용
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length === 4) {
                const zodiac = getZodiacByYear(parseInt(this.value));
                const display = document.getElementById('partner-zodiac-compat');
                if (zodiac && zodiac_data[zodiac]) {
                    display.innerHTML = `
                        <div style="font-size: 2rem;">${zodiac_data[zodiac].icon}</div>
                        <div style="font-size: 0.9rem; margin-top: 0.5rem;">${zodiac_data[zodiac].name}</div>
                    `;
                } else {
                    display.innerHTML = '';
                }
            } else {
                document.getElementById('partner-zodiac-compat').innerHTML = '';
            }
        });
        
        // 엔터키 처리는 initYearInputAutoFocus에서 처리
    }
}

// 궁합 결과 보기 (검증 포함)
function showCompatibilityResultWithValidation() {
    const myYear = document.getElementById('compat-my-year').value;
    const partnerYear = document.getElementById('compat-partner-year').value;
    
    // 에러 메시지 표시
    if (!myYear || myYear.length !== 4 || !partnerYear || partnerYear.length !== 4) {
        if (!myYear || myYear.length !== 4) {
            const myDisplay = document.getElementById('my-zodiac-compat');
            myDisplay.innerHTML = `<p class="error-message" style="color: #ff6b6b; font-size: 0.9rem;">나의 출생년도를<br>4자리로 입력해주세요</p>`;
            setTimeout(() => {
                myDisplay.innerHTML = '';
            }, 3000);
        }
        
        if (!partnerYear || partnerYear.length !== 4) {
            const partnerDisplay = document.getElementById('partner-zodiac-compat');
            partnerDisplay.innerHTML = `<p class="error-message" style="color: #ff6b6b; font-size: 0.9rem;">상대방 출생년도를<br>4자리로 입력해주세요</p>`;
            setTimeout(() => {
                partnerDisplay.innerHTML = '';
            }, 3000);
        }
        return;
    }
    
    // 검증 통과시 기존 함수 호출
    showCompatibilityResult();
}

// 궁합 결과 보기
function showCompatibilityResult() {
    const myYear = document.getElementById('compat-my-year').value;
    const partnerYear = document.getElementById('compat-partner-year').value;
    
    // 값이 없으면 종료
    if (!myYear || !partnerYear) {
        return;
    }
    
    // 선택된 성별 가져오기
    const myGenderBtn = document.querySelector('.compat-gender-btn[data-person="my"].active');
    const partnerGenderBtn = document.querySelector('.compat-gender-btn[data-person="partner"].active');
    const myGender = myGenderBtn ? myGenderBtn.dataset.gender : 'male';
    const partnerGender = partnerGenderBtn ? partnerGenderBtn.dataset.gender : 'female';
    
    // 간편 모달 닫기
    closeModal('simple-compatibility-modal');
    
    // 선택된 관계 유형 가져오기
    const selectedBtn = document.querySelector('.relation-btn.selected');
    const relationshipType = selectedBtn ? selectedBtn.dataset.type : 'lover';
    
    // 띠 가져오기
    const myZodiac = getZodiacByYear(parseInt(myYear));
    const partnerZodiac = getZodiacByYear(parseInt(partnerYear));
    
    // 궁합 결과 생성
    const result = generateCompatibilityResult(
        myZodiac, partnerZodiac, 
        myGender, partnerGender, 
        relationshipType
    );
    
    // 결과 모달 표시
    document.getElementById('compatibility-result').innerHTML = result;
    document.getElementById('result-modal').classList.add('active');
    
    // 히스토리에 궁합 결과 상태 추가
    setTimeout(() => {
        history.pushState({ modal: 'compatibility-result' }, '', '#compatibility-result');
    }, 100);
}

// 관계 버튼 초기화
function initRelationButtons() {
    const buttons = document.querySelectorAll('.relation-btn');
    
    buttons.forEach(btn => {
        // 클릭 이벤트
        btn.onclick = function() {
            buttons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        };
        
        // 키보드 이벤트
        btn.onkeydown = function(e) {
            if (e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                // 엔터키를 눌렀을 때 선택된 상태라면 결과 보기
                if (this.classList.contains('selected')) {
                    showCompatibilityResultWithValidation();
                } else {
                    // 선택되지 않았으면 선택하고 결과 보기
                    this.click();
                    showCompatibilityResultWithValidation();
                }
            } else if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                // 앞으로 이동
                const index = Array.from(buttons).indexOf(this);
                if (index < buttons.length - 1) {
                    buttons[index + 1].focus();
                }
                // 마지막 버튼에서는 멈춤
            } else if ((e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                // 뒤로 이동
                const index = Array.from(buttons).indexOf(this);
                if (index > 0) {
                    buttons[index - 1].focus();
                } else {
                    // 첫번째 관계 버튼에서 뒤로 가면 상대 여자 성별로
                    const partnerGenderBtns = document.querySelectorAll('.compat-gender-btn[data-person="partner"]');
                    partnerGenderBtns[1].focus();
                }
            }
        };
    });
}

// 년도 입력 자동 포커스 이동
function initYearInputAutoFocus() {
    const myYear = document.getElementById('compat-my-year');
    const partnerYear = document.getElementById('compat-partner-year');
    
    // 전체 네비게이션 순서
    const navOrder = [
        myYear,
        document.querySelector('.compat-gender-btn[data-person="my"][data-gender="male"]'),
        document.querySelector('.compat-gender-btn[data-person="my"][data-gender="female"]'),
        partnerYear,
        document.querySelector('.compat-gender-btn[data-person="partner"][data-gender="male"]'),
        document.querySelector('.compat-gender-btn[data-person="partner"][data-gender="female"]'),
        ...document.querySelectorAll('.relation-btn')
    ];
    
    // 첫번째 입력에서 4자리 입력시 다음으로 이동
    const originalMyInput = myYear.oninput;
    myYear.oninput = function() {
        if (originalMyInput) originalMyInput.call(this);
        if (this.value.length === 4) {
            const currentIndex = navOrder.indexOf(this);
            if (currentIndex < navOrder.length - 1) {
                navOrder[currentIndex + 1].focus();
            }
        }
    };
    
    // 두번째 입력에서 4자리 입력시 다음으로 이동
    const originalPartnerInput = partnerYear.oninput;
    partnerYear.oninput = function() {
        if (originalPartnerInput) originalPartnerInput.call(this);
        if (this.value.length === 4) {
            const currentIndex = navOrder.indexOf(this);
            if (currentIndex < navOrder.length - 1) {
                navOrder[currentIndex + 1].focus();
            }
        }
    };
    
    // 엔터키, 탭키, 방향키로 다음으로 이동
    myYear.onkeydown = function(e) {
        if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            const currentIndex = navOrder.indexOf(this);
            if (currentIndex < navOrder.length - 1) {
                navOrder[currentIndex + 1].focus();
            }
        } else if ((e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            // 첫번째 요소에서는 멈춤
        }
    };
    
    partnerYear.onkeydown = function(e) {
        if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            const currentIndex = navOrder.indexOf(this);
            if (currentIndex < navOrder.length - 1) {
                navOrder[currentIndex + 1].focus();
            }
        } else if ((e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentIndex = navOrder.indexOf(this);
            if (currentIndex > 0) {
                navOrder[currentIndex - 1].focus();
            }
        }
    };
}

// 성별 버튼 초기화
function initGenderButtons() {
    const genderBtns = document.querySelectorAll('.compat-gender-btn');
    
    // 모든 네비게이션 가능한 요소 순서대로
    const navOrder = [
        document.getElementById('compat-my-year'),
        document.querySelector('.compat-gender-btn[data-person="my"][data-gender="male"]'),
        document.querySelector('.compat-gender-btn[data-person="my"][data-gender="female"]'),
        document.getElementById('compat-partner-year'),
        document.querySelector('.compat-gender-btn[data-person="partner"][data-gender="male"]'),
        document.querySelector('.compat-gender-btn[data-person="partner"][data-gender="female"]'),
        ...document.querySelectorAll('.relation-btn')
    ];
    
    genderBtns.forEach(btn => {
        // 클릭 이벤트
        btn.onclick = function() {
            const person = this.dataset.person;
            const samePerson = document.querySelectorAll(`.compat-gender-btn[data-person="${person}"]`);
            samePerson.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        };
        
        // 키보드 이벤트
        btn.onkeydown = function(e) {
            if (e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const currentIndex = navOrder.indexOf(this);
                if (currentIndex < navOrder.length - 1) {
                    navOrder[currentIndex + 1].focus();
                }
            } else if ((e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = navOrder.indexOf(this);
                if (currentIndex > 0) {
                    navOrder[currentIndex - 1].focus();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                // 년도가 모두 입력되어 있으면 바로 결과 보기
                const myYear = document.getElementById('compat-my-year').value;
                const partnerYear = document.getElementById('compat-partner-year').value;
                
                if (myYear && myYear.length === 4 && partnerYear && partnerYear.length === 4) {
                    // 연인 관계가 이미 선택되어 있으면 바로 결과 보기
                    const loverBtn = document.querySelector('.relation-btn[data-type="lover"]');
                    if (loverBtn && loverBtn.classList.contains('selected')) {
                        showCompatibilityResultWithValidation();
                    } else {
                        // 연인 관계 선택 후 결과 보기
                        document.querySelectorAll('.relation-btn').forEach(b => b.classList.remove('selected'));
                        loverBtn.classList.add('selected');
                        showCompatibilityResultWithValidation();
                    }
                } else {
                    // 년도가 입력되지 않았으면 다음으로 이동
                    const currentIndex = navOrder.indexOf(this);
                    if (currentIndex < navOrder.length - 1) {
                        navOrder[currentIndex + 1].focus();
                    }
                }
            }
        };
    });
}

// 궁합용 개별 선택기 표시
function showIndividualPickerCompat(type) {
    const dropdown = document.getElementById('compat-picker-dropdown');
    const content = document.getElementById('compat-picker-content');
    
    let inputId = '';
    let options = [];
    
    if (type === 'my-year') {
        inputId = 'compat-my-year';
        // 1940년부터 현재년도까지
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1940; i--) {
            options.push(i);
        }
    } else if (type === 'partner-year') {
        inputId = 'compat-partner-year';
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1940; i--) {
            options.push(i);
        }
    }
    
    // 드롭다운 내용 생성
    content.innerHTML = options.map(value => 
        `<div class="picker-option" onclick="selectCompatValue('${inputId}', '${value}')">${value}</div>`
    ).join('');
    
    // 드롭다운 위치 조정
    const input = document.getElementById(inputId);
    const inputRect = input.getBoundingClientRect();
    const modalContent = input.closest('.modal-content');
    const modalRect = modalContent.getBoundingClientRect();
    
    dropdown.style.display = 'block';
    dropdown.style.left = (inputRect.left - modalRect.left) + 'px';
    dropdown.style.top = (inputRect.bottom - modalRect.top + 5) + 'px';
    dropdown.style.width = inputRect.width + 'px';
}

// 궁합용 값 선택
function selectCompatValue(inputId, value) {
    const input = document.getElementById(inputId);
    input.value = value;
    
    // 년도 입력시 띠 자동 표시
    if (inputId === 'compat-my-year' && value.toString().length === 4) {
        const zodiac = getZodiacByYear(parseInt(value));
        const display = document.getElementById('my-zodiac-compat');
        if (zodiac && zodiac_data[zodiac]) {
            display.innerHTML = `
                <div style="font-size: 2rem;">${zodiac_data[zodiac].icon}</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${zodiac_data[zodiac].name}</div>
            `;
        }
    } else if (inputId === 'compat-partner-year' && value.toString().length === 4) {
        const zodiac = getZodiacByYear(parseInt(value));
        const display = document.getElementById('partner-zodiac-compat');
        if (zodiac && zodiac_data[zodiac]) {
            display.innerHTML = `
                <div style="font-size: 2rem;">${zodiac_data[zodiac].icon}</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${zodiac_data[zodiac].name}</div>
            `;
        }
    }
    
    // 다음 입력 필드로 자동 이동
    if (inputId === 'compat-my-year') {
        document.getElementById('compat-partner-year').focus();
    }
    
    closeCompatPicker();
}

// 궁합용 선택기 닫기
function closeCompatPicker() {
    const dropdown = document.getElementById('compat-picker-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

// 궁합 년도 선택기 표시
function showCompatYearPicker(person) {
    const picker = document.getElementById('compat-year-picker');
    const content = picker.querySelector('.year-picker-content');
    const inputId = person === 'my' ? 'compat-my-year' : 'compat-partner-year';
    const input = document.getElementById(inputId);
    const wrapper = input.closest('.compat-input-wrapper');
    
    // 년도 목록 생성 (현재년도부터 1940년까지)
    const currentYear = new Date().getFullYear();
    content.innerHTML = '';
    
    for (let year = currentYear; year >= 1940; year--) {
        const button = document.createElement('button');
        button.textContent = year;
        button.onclick = function() {
            input.value = year;
            // 띠 표시 업데이트
            const zodiac = getZodiacByYear(year);
            const displayId = person === 'my' ? 'my-zodiac-compat' : 'partner-zodiac-compat';
            const display = document.getElementById(displayId);
            if (zodiac && zodiac_data[zodiac]) {
                display.innerHTML = `
                    <div style="font-size: 2rem;">${zodiac_data[zodiac].icon}</div>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem;">${zodiac_data[zodiac].name}</div>
                `;
            }
            // 다음 입력으로 포커스 이동
            if (person === 'my') {
                document.querySelector('.compat-gender-btn[data-person="my"][data-gender="male"]').focus();
            } else {
                document.querySelector('.compat-gender-btn[data-person="partner"][data-gender="male"]').focus();
            }
            hideCompatYearPicker();
        };
        content.appendChild(button);
    }
    
    // 드롭다운 위치 설정 - 입력칸 래퍼 기준
    const wrapperRect = wrapper.getBoundingClientRect();
    const modalContent = wrapper.closest('.modal-content');
    const modalRect = modalContent.getBoundingClientRect();
    
    picker.style.display = 'block';
    picker.style.left = (wrapperRect.left - modalRect.left) + 'px';
    picker.style.top = (wrapperRect.top - modalRect.top - 5) + 'px';  // 입력칸 위쪽에 표시
}

// 궁합 년도 선택기 닫기
function hideCompatYearPicker() {
    const picker = document.getElementById('compat-year-picker');
    if (picker) {
        picker.style.display = 'none';
    }
}

// 모달 외부 클릭시 년도 선택기 닫기
document.addEventListener('click', function(e) {
    const picker = document.getElementById('compat-year-picker');
    const buttons = document.querySelectorAll('.year-picker-btn');
    
    let isButton = false;
    buttons.forEach(btn => {
        if (btn === e.target || btn.contains(e.target)) {
            isButton = true;
        }
    });
    
    if (picker && picker.style.display !== 'none') {
        if (!picker.contains(e.target) && !isButton) {
            hideCompatYearPicker();
        }
    }
});