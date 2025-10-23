// ========================================
// JSON 데이터 로딩 및 초기화
// ========================================

// 전역 변수: JSON 데이터 저장소
let elementsData = null;
let sexagenaryData = null;
let zodiacData = null;
let elementRelationsData = null;
let compatibilityMatrixData = null;

// JSON 데이터 로드 함수
async function loadJSONData() {
    try {
        console.log('📦 JSON 데이터 로딩 시작...');

        const [elements, sexagenary, zodiac, relations, compatibility] = await Promise.all([
            fetch('data/base/elements.json').then(res => res.json()),
            fetch('data/base/sexagenary.json').then(res => res.json()),
            fetch('data/base/zodiac.json').then(res => res.json()),
            fetch('data/relations/element_relations.json').then(res => res.json()),
            fetch('data/relations/compatibility_matrix.json').then(res => res.json())
        ]);

        elementsData = elements;
        sexagenaryData = sexagenary;
        zodiacData = zodiac;
        elementRelationsData = relations;
        compatibilityMatrixData = compatibility;

        console.log('✅ JSON 데이터 로딩 완료!');
        console.log('- 오행:', elementsData.elements.length, '개');
        console.log('- 60갑자:', sexagenaryData.sexagenary_cycle.length, '개');
        console.log('- 12띠:', zodiacData.zodiac_animals.length, '개');
        console.log('- 궁합 매트릭스:', Object.keys(compatibilityMatrixData.matrix).length, '×', Object.keys(compatibilityMatrixData.matrix).length);

        return true;
    } catch (error) {
        console.error('❌ JSON 데이터 로딩 실패:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        return false;
    }
}

// 년도 → 60갑자 정보 변환 함수
function getSexagenaryByYear(year) {
    if (!sexagenaryData) {
        console.error('❌ sexagenaryData가 로드되지 않았습니다!');
        return null;
    }

    const sexagenaryId = sexagenaryData.year_mapping[year.toString()];
    if (!sexagenaryId) {
        console.warn('⚠️ 년도', year, '에 해당하는 60갑자를 찾을 수 없습니다.');
        return null;
    }

    const sexagenaryInfo = sexagenaryData.sexagenary_cycle.find(item => item.id === sexagenaryId);
    if (!sexagenaryInfo) {
        console.warn('⚠️ ID', sexagenaryId, '에 해당하는 60갑자 정보를 찾을 수 없습니다.');
        return null;
    }

    console.log(`📅 ${year}년 = ${sexagenaryInfo.name} (${sexagenaryInfo.heavenly_stem} + ${sexagenaryInfo.earthly_branch})`);
    return sexagenaryInfo;
}

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
        years: [2008, 1996, 1984, 1972, 1960, 1948],
        traits: ['지혜롭고', '민첩하며', '경제적 관념이 뛰어난']
    },
    ox: {
        name: '소띠',
        icon: '🐮',
        years: [2009, 1997, 1985, 1973, 1961, 1949],
        traits: ['성실하고', '인내심이 강하며', '책임감이 있는']
    },
    tiger: {
        name: '호랑이띠',
        icon: '🐯',
        years: [2010, 1998, 1986, 1974, 1962, 1950],
        traits: ['용감하고', '리더십이 있으며', '정의로운']
    },
    rabbit: {
        name: '토끼띠',
        icon: '🐰',
        years: [2011, 1999, 1987, 1975, 1963, 1951],
        traits: ['온순하고', '예술적 감각이 있으며', '사교적인']
    },
    dragon: {
        name: '용띠',
        icon: '🐲',
        years: [2012, 2000, 1988, 1976, 1964, 1952],
        traits: ['카리스마 있고', '야망이 크며', '행운이 따르는']
    },
    snake: {
        name: '뱀띠',
        icon: '🐍',
        years: [2013, 2001, 1989, 1977, 1965, 1953],
        traits: ['지적이고', '직관력이 뛰어나며', '신중한']
    },
    horse: {
        name: '말띠',
        icon: '🐴',
        years: [2014, 2002, 1990, 1978, 1966, 1954],
        traits: ['자유분방하고', '열정적이며', '독립적인']
    },
    sheep: {
        name: '양띠',
        icon: '🐑',
        years: [2015, 2003, 1991, 1979, 1967, 1955],
        traits: ['예술적이고', '평화를 사랑하며', '창의적인']
    },
    monkey: {
        name: '원숭이띠',
        icon: '🐵',
        years: [2016, 2004, 1992, 1980, 1968, 1956],
        traits: ['재치있고', '호기심이 많으며', '다재다능한']
    },
    rooster: {
        name: '닭띠',
        icon: '🐔',
        years: [2017, 2005, 1993, 1981, 1969, 1957],
        traits: ['정확하고', '완벽주의적이며', '자신감 있는']
    },
    dog: {
        name: '개띠',
        icon: '🐶',
        years: [2018, 2006, 1994, 1982, 1970, 1958],
        traits: ['충직하고', '정직하며', '의리가 있는']
    },
    pig: {
        name: '돼지띠',
        icon: '🐷',
        years: [2019, 2007, 1995, 1983, 1971, 1959],
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

// 메인 카드 년도 버튼 동적 생성
function initializeZodiacCards() {
    Object.keys(zodiac_data).forEach(zodiac => {
        const container = document.querySelector(
            `.zodiac-card[data-zodiac="${zodiac}"] .year-buttons`
        );

        if (!container) return;

        const years = zodiac_data[zodiac].years;

        container.innerHTML = years.map(year =>
            `<button class="year-btn" onclick="event.stopPropagation(); showZodiacWithYear('${zodiac}', ${year})">${year}</button>`
        ).join('');
    });

    console.log('✅ 띠별 카드 년도 버튼 생성 완료');
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', async function() {
    // 🔥 JSON 데이터 먼저 로드 (최우선)
    await loadJSONData();

    // 🎯 띠별 카드 년도 버튼 동적 생성
    initializeZodiacCards();

    // 년도별 제목 초기화
    updateYearTitle();

    // 액션 버튼 중앙 배치 초기화
    setTimeout(centerActionButtons, 100);

    // 반응형 레이아웃 초기화
    setTimeout(initResponsiveLayout, 100);
    
    // 모든 입력 필드 초기화 (브라우저 자동완성 방지)
    setTimeout(() => {
        ['modal-year', 'compat-my-year', 'compat-partner-year'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
            }
        });
    }, 100);

    // 궁합 모달 새 버전 초기화
    console.log('🎯 궁합 모달 초기화 시작...');
    setTimeout(() => {
        initZodiacGridButtons();
        initCompatGenderIconButtons();
        initYearInputs();
        console.log('✅ 궁합 모달 초기화 완료!');
    }, 200);
    
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

            // 궁합 탭일 경우 상대방 정보 섹션 표시
            const partnerSection = document.getElementById('partner-info-section');
            if (current_period === 'compatibility') {
                if (partnerSection) {
                    partnerSection.style.display = 'flex';
                    showPartnerInfoSection();

                    // 띠 아이콘 애니메이션 시작
                    startZodiacAnimation();
                }
                // 운세 내용 공란으로 비우기
                const fortuneContent = document.getElementById('fortune-content');
                if (fortuneContent) {
                    fortuneContent.innerHTML = `
                        <div style="text-align: center; padding: 60px 20px; color: #999;">
                            <p style="font-size: 16px;">상대 정보를 선택한 후 <strong>💕 버튼</strong>을 클릭하세요</p>
                        </div>
                    `;
                }
            } else {
                // 다른 탭으로 이동 시 애니메이션 중지
                stopZodiacAnimation();

                if (partnerSection) {
                    partnerSection.style.display = 'none';
                }
                updateFortuneContent();
            }
        });
    });
    
    // 성별 버튼 이벤트 (본인 성별만, 상대 성별 제외)
    document.querySelectorAll('.gender-tabs > .gender-btn[data-gender]').forEach(btn => {
        btn.addEventListener('click', function() {
            // 본인 성별 버튼만 선택
            document.querySelectorAll('.gender-tabs > .gender-btn[data-gender]').forEach(b => b.classList.remove('active'));
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

    // 모바일: 사이드바 표시, 메인 콘텐츠/헤더 숨김
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').style.display = 'block';
        document.querySelector('.main-content').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
    }

    // 전역 상태 초기화
    current_zodiac = null;
    current_year = null;
    current_gender = 'male';
    current_period = 'daily';

    // 궁합 선택 정보 초기화
    partnerSelection = {
        zodiac: null,
        zodiacName: null,
        year: null,
        gender: 'female'
    };

    // 띠 아이콘 애니메이션 중지
    stopZodiacAnimation();

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

    // 상세 페이지 탭 버튼 초기화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 상세 페이지 성별 버튼 초기화
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 궁합 상대방 정보 섹션 숨기기
    const partnerSection = document.getElementById('partner-info-section');
    if (partnerSection) {
        partnerSection.style.display = 'none';
    }

    // 상대방 정보 버튼 초기화
    document.querySelectorAll('.partner-gender-btn').forEach(btn => {
        btn.classList.remove('active', 'selected');
    });

    const partnerZodiacBtn = document.getElementById('partner-zodiac-btn');
    const partnerYearBtn = document.getElementById('partner-year-btn');
    const partnerZodiacIcon = document.getElementById('partner-zodiac-icon');
    const partnerYearDisplay = document.getElementById('partner-year-display');

    if (partnerZodiacBtn) partnerZodiacBtn.classList.remove('selected');
    if (partnerYearBtn) partnerYearBtn.classList.remove('selected');
    if (partnerZodiacIcon) partnerZodiacIcon.textContent = '🐾';
    if (partnerYearDisplay) partnerYearDisplay.textContent = '📅';

    console.log('✅ 메인 페이지로 이동 - 모든 상태 초기화 완료');

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
function showZodiacDetail(zodiac, year = null) {
    current_zodiac = zodiac;

    // 년도 정보가 전달되면 저장, 없으면 해당 띠의 첫 번째 년도로 초기화
    if (year) {
        current_year = year;
        console.log(`🎯 년도 설정: ${year}년`);
    } else {
        // year가 전달되지 않으면 해당 띠의 첫 번째 년도로 설정
        current_year = zodiac_data[zodiac].years[0];
        console.log(`🎯 년도 초기화: ${current_year}년 (${zodiac_data[zodiac].name} 기본값)`);
    }

    // 페이지 전환
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('detail-page').classList.add('active');

    // 모바일: 사이드바 숨김, 메인 콘텐츠/헤더 표시
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').style.display = 'none';
        document.querySelector('.main-content').style.display = 'block';
        document.querySelector('.header').style.display = 'flex';
    }

    // 사이드바 활성화
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.zodiac-btn[data-zodiac="${zodiac}"]`).classList.add('active');
    
    // 제목 업데이트
    document.getElementById('zodiac-title').textContent = 
        zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name + ' 운세';
    
    // 탭 버튼 활성화 (기본: 오늘의 운세)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === current_period) {
            btn.classList.add('active');
        }
    });

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
        showZodiacDetail(zodiac, current_year);
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
        showZodiacDetail(zodiac, current_year);
    }
}

// 상세 페이지 년도 버튼 업데이트
function updateDetailYearButtons(zodiac) {
    const container = document.getElementById('detail-year-buttons');
    const years = zodiac_data[zodiac].years;

    container.innerHTML = years.map(year =>
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
async function updateFortuneContent() {
    if (!current_zodiac) return;

    console.log('📍 updateFortuneContent 호출:', {
        zodiac: current_zodiac,
        period: current_period,
        gender: current_gender,
        year: current_year
    });

    const fortuneContent = document.getElementById('fortune-content');

    // 평생 운세 - JSON 파일에서 로드
    if (current_period === 'lifetime') {
        const filePath = `data/fortune/lifetime/${current_zodiac}_${current_year}_${current_gender}_lifetime.json`;
        console.log('🔍 평생운세 파일 로드 시도:', filePath);

        try {
            const response = await fetch(filePath);
            console.log('📡 Response status:', response.status, response.ok);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log('✅ 평생운세 데이터 로드 성공:', data.title);
            fortuneContent.innerHTML = renderLifetimeContent(data);
        } catch (error) {
            console.error('❌ 평생운세 로드 실패:', error);
            fortuneContent.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #666;"><p>데이터를 불러올 수 없습니다.</p></div>';
        }
    }

    // 일년 운세 - JSON 파일에서 로드
    else if (current_period === 'yearly') {
        const filePath = `data/fortune/yearly/${current_zodiac}_${current_year}_${current_gender}_2025.json`;
        console.log('🔍 일년운세 파일 로드 시도:', filePath);

        try {
            const response = await fetch(filePath);
            console.log('📡 Response status:', response.status, response.ok);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log('✅ 일년운세 데이터 로드 성공:', data.title);
            fortuneContent.innerHTML = renderYearlyContent(data);
        } catch (error) {
            console.error('❌ 일년운세 로드 실패:', error);
            fortuneContent.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #666;"><p>데이터를 불러올 수 없습니다.</p></div>';
        }
    }

    // 월간 운세 - JSON 파일에서 로드 (현재 월 감지)
    else if (current_period === 'monthly') {
        // 현재 월 감지 (1-12)
        const currentMonth = new Date().getMonth() + 1;
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthName = monthNames[currentMonth - 1];

        const filePath = `data/fortune/monthly/${current_zodiac}_${current_year}_${current_gender}_${monthName}.json`;
        console.log('🔍 월간운세 파일 로드 시도:', filePath, '(현재 월:', currentMonth + '월)');

        try {
            const response = await fetch(filePath);
            console.log('📡 Response status:', response.status, response.ok);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log('✅ 월간운세 데이터 로드 성공:', data.title);
            fortuneContent.innerHTML = renderMonthlyContent(data);
        } catch (error) {
            console.error('❌ 월간운세 로드 실패:', error);
            fortuneContent.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #666;"><p>데이터를 불러올 수 없습니다.</p></div>';
        }
    }

    // 주간 운세 - JSON 파일에서 로드 (daily_weekly 파일 사용)
    else if (current_period === 'weekly') {
        const filePath = `data/fortune/daily_weekly/${current_zodiac}_${current_year}_${current_gender}_daily_weekly.json`;
        console.log('🔍 주간운세 파일 로드 시도:', filePath);

        try {
            const response = await fetch(filePath);
            console.log('📡 Response status:', response.status, response.ok);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log('✅ 주간운세 데이터 로드 성공:', data.title);
            fortuneContent.innerHTML = renderWeeklyContent(data);
        } catch (error) {
            console.error('❌ 주간운세 로드 실패:', error);
            fortuneContent.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #666;"><p>데이터를 불러올 수 없습니다.</p></div>';
        }
    }

    // 다른 운세 (daily 등) - 데이터 없음
    else {
        console.log('📝 해당 운세 데이터 없음:', current_period);
        fortuneContent.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #666;"><p>데이터를 불러올 수 없습니다.</p></div>';
    }
}

// 템플릿 데이터 생성 함수 - 삭제됨 (품질 미달)

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

// 평생운세 모달 표시 (실제 JSON 데이터 로드)
async function showLifetimeFortune(zodiac) {
    const modal = document.getElementById('lifetime-modal');
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('lifetime-title');
    const content = document.getElementById('lifetime-content');

    title.textContent = zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name + ' 평생 운세';

    // 기본 년도와 성별 설정
    const year = 1996;
    const gender = 'male';

    try {
        // JSON 파일 로드
        const response = await fetch(`data/fortune/lifetime/${zodiac}_${year}_${gender}_lifetime.json`);
        if (!response.ok) throw new Error('데이터 로드 실패');

        const data = await response.json();
        console.log('✅ 평생운세 데이터 로드 성공:', data.title);

        // JSON 데이터로 콘텐츠 생성
        content.innerHTML = renderLifetimeContent(data);

    } catch (error) {
        console.error('❌ 평생운세 로드 실패:', error);
        content.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #666;"><p>데이터를 불러올 수 없습니다.</p></div>';
    }

    modal.classList.add('active');
    overlay.classList.add('active');
}

// 평생운세 JSON 데이터를 HTML로 렌더링
function renderLifetimeContent(data) {
    const c = data.content;

    let html = `
        <div class="fortune-section">
            <p style="font-size: 16px; line-height: 1.8; white-space: pre-line;">${c.opening}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.core_nature.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line;">${c.core_nature.content}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.life_stages.title}</h3>
            <div style="margin-top: 15px;">
                <h4 style="color: var(--primary-color); margin-bottom: 8px;">${c.life_stages.youth.age}</h4>
                <p style="line-height: 1.8;">${c.life_stages.youth.content}</p>
            </div>
            <div style="margin-top: 15px;">
                <h4 style="color: var(--primary-color); margin-bottom: 8px;">${c.life_stages.prime.age}</h4>
                <p style="line-height: 1.8;">${c.life_stages.prime.content}</p>
            </div>
            <div style="margin-top: 15px;">
                <h4 style="color: var(--primary-color); margin-bottom: 8px;">${c.life_stages.mature.age}</h4>
                <p style="line-height: 1.8;">${c.life_stages.mature.content}</p>
            </div>
            <div style="margin-top: 15px;">
                <h4 style="color: var(--primary-color); margin-bottom: 8px;">${c.life_stages.elder.age}</h4>
                <p style="line-height: 1.8;">${c.life_stages.elder.content}</p>
            </div>
        </div>

        <div class="fortune-section">
            <h3>${c.career_path.title}</h3>
            <h4 style="color: var(--primary-color); margin: 15px 0 10px 0;">${c.career_path.suitable_fields.title}</h4>
            <ul style="list-style-position: inside; line-height: 2;">
                ${c.career_path.suitable_fields.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p style="margin-top: 15px; padding: 15px; background: #f0f8ff; border-left: 4px solid var(--primary-color); line-height: 1.8;">${c.career_path.advice}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.wealth_fortune.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line;">${c.wealth_fortune.content}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.love_family.title}</h3>
            <h4 style="color: var(--primary-color); margin: 15px 0 10px 0;">${c.love_family.marriage.title}</h4>
            <p style="line-height: 1.8; white-space: pre-line;">${c.love_family.marriage.content}</p>
            <h4 style="color: var(--primary-color); margin: 15px 0 10px 0;">${c.love_family.children.title}</h4>
            <p style="line-height: 1.8;">${c.love_family.children.content}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.health.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line;">${c.health.content}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.life_lessons.title}</h3>
            <ul style="list-style-position: inside; line-height: 2;">
                ${(c.life_lessons.challenges || c.life_lessons.reflections).map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="fortune-section">
            <h3>${c.lucky_elements.title}</h3>
            <p><strong>🎨 행운의 색:</strong> ${c.lucky_elements.colors.join(', ')}</p>
            <p><strong>🔢 행운의 숫자:</strong> ${c.lucky_elements.numbers.join(', ')}</p>
            <p><strong>🧭 행운의 방향:</strong> ${c.lucky_elements.directions.join(', ')}</p>
            <p><strong>💑 잘 맞는 띠:</strong> ${c.lucky_elements.compatible_zodiacs.join(', ')}</p>
            <p><strong>🌸 행운의 계절:</strong> ${c.lucky_elements.seasons}</p>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #fff5f5, #ffffff); padding: 20px; border-radius: 10px; border: 2px solid #ffebee;">
            <h3>${c.final_advice.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line; font-size: 15px;">${c.final_advice.content}</p>
        </div>
    `;

    return html;
}

// 일년 운세 렌더링
function renderYearlyContent(data) {
    const c = data.content;

    let html = `
        <div class="fortune-section">
            <h2 style="text-align: center; color: #1976d2; margin-bottom: 20px;">${data.title}</h2>
            <p style="font-size: 16px; line-height: 1.8; white-space: pre-line;">${c.opening}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.yearly_flow.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line;">${c.yearly_flow.content}</p>
        </div>

        <div class="fortune-section">
            <h3>${c.seasonal_fortune.title}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin-top: 15px;">
                <div style="background: linear-gradient(135deg, #e8f5e9, #ffffff); padding: 15px; border-radius: 8px;">
                    <h4 style="color: #2e7d32; margin-bottom: 10px;">${c.seasonal_fortune.spring.season}</h4>
                    <p style="line-height: 1.6; font-size: 14px; white-space: pre-line;">${c.seasonal_fortune.spring.content}</p>
                </div>
                <div style="background: linear-gradient(135deg, #fff3e0, #ffffff); padding: 15px; border-radius: 8px;">
                    <h4 style="color: #e65100; margin-bottom: 10px;">${c.seasonal_fortune.summer.season}</h4>
                    <p style="line-height: 1.6; font-size: 14px; white-space: pre-line;">${c.seasonal_fortune.summer.content}</p>
                </div>
                <div style="background: linear-gradient(135deg, #fff8e1, #ffffff); padding: 15px; border-radius: 8px;">
                    <h4 style="color: #f57f17; margin-bottom: 10px;">${c.seasonal_fortune.autumn.season}</h4>
                    <p style="line-height: 1.6; font-size: 14px; white-space: pre-line;">${c.seasonal_fortune.autumn.content}</p>
                </div>
                <div style="background: linear-gradient(135deg, #e3f2fd, #ffffff); padding: 15px; border-radius: 8px;">
                    <h4 style="color: #01579b; margin-bottom: 10px;">${c.seasonal_fortune.winter.season}</h4>
                    <p style="line-height: 1.6; font-size: 14px; white-space: pre-line;">${c.seasonal_fortune.winter.content}</p>
                </div>
            </div>
        </div>

        <div class="fortune-section">
            <h3>${c.life_areas.title}</h3>
            <div style="display: grid; gap: 12px; margin-top: 15px;">
    `;

    // life_areas의 각 영역을 동적으로 렌더링
    for (const [key, area] of Object.entries(c.life_areas)) {
        if (key === 'title') continue;

        html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                    <h4 style="margin-bottom: 8px;">${area.icon} ${area.title}</h4>
                    <p style="line-height: 1.6; font-size: 14px; white-space: pre-line;">${area.content}</p>
                </div>
        `;
    }

    html += `
            </div>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #fff9c4, #ffffff); padding: 20px; border-radius: 10px;">
            <h3>${c.lucky_items.title}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
    `;

    // lucky_items의 각 항목을 동적으로 렌더링
    for (const [key, item] of Object.entries(c.lucky_items)) {
        if (key === 'title') continue;

        html += `
                <div>
                    <strong style="color: #f57c00;">${item.icon} ${item.title}:</strong>
                    <p style="margin-top: 5px;">${item.items.join(', ')}</p>
                    <p style="font-size: 12px; color: #666; margin-top: 5px;">${item.description}</p>
                </div>
        `;
    }

    html += `
            </div>
        </div>

        <div class="fortune-section">
            <h3>${c.advice.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line; font-size: 15px;">${c.advice.content}</p>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #fff5f5, #ffffff); padding: 20px; border-radius: 10px; border: 2px solid #ffebee;">
            <h3 style="color: #c62828;">💝 2025년 마무리 덕담</h3>
            <p style="line-height: 1.8; white-space: pre-line; font-size: 15px;">${c.closing.content}</p>
        </div>
    `;

    return html;
}

// 월간 운세 렌더링
function renderMonthlyContent(data) {
    const c = data.content;

    let html = `
        <div class="fortune-section">
            <h2 style="text-align: center; color: #1976d2; margin-bottom: 20px;">${data.title}</h2>
            ${c.overview.title ? `<h3>${c.overview.title}</h3>` : ''}
            <p style="font-size: 16px; line-height: 1.8; white-space: pre-line;">${c.overview.content}</p>
        </div>

        <div class="fortune-section">
            <h3>이번 달 운세 영역별 점수</h3>
            <div style="display: grid; gap: 12px; margin-top: 15px;">
    `;

    // fortune_areas의 각 영역을 동적으로 렌더링
    for (const [key, area] of Object.entries(c.fortune_areas)) {
        const score = area.score || 0;
        const scoreColor = score >= 85 ? '#4CAF50' : score >= 70 ? '#FFC107' : '#FF9800';

        html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${scoreColor};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="margin: 0;">${area.icon} ${area.title}</h4>
                        <span style="background: ${scoreColor}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px;">${score}점</span>
                    </div>
                    <p style="line-height: 1.6; font-size: 14px; white-space: pre-line;">${area.content}</p>
                </div>
        `;
    }

    html += `
            </div>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #e8f5e9, #ffffff); padding: 20px; border-radius: 10px;">
            <h3>${c.lucky_days.title}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
    `;

    c.lucky_days.dates.forEach(date => {
        html += `<span style="background: #4CAF50; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">${date}</span>`;
    });

    html += `
            </div>
            <p style="margin-top: 15px; line-height: 1.6; font-size: 14px;">${c.lucky_days.description}</p>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #ffebee, #ffffff); padding: 20px; border-radius: 10px;">
            <h3>${c.caution.title}</h3>
            <ul style="margin-top: 15px; padding-left: 20px;">
    `;

    c.caution.items.forEach(item => {
        html += `<li style="line-height: 1.8; margin-bottom: 8px;">${item}</li>`;
    });

    html += `
            </ul>
        </div>

        <div class="fortune-section">
            <h3>${c.advice.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line; font-size: 15px;">${c.advice.content}</p>
        </div>
    `;

    return html;
}

// 주간 운세 렌더링
function renderWeeklyContent(data) {
    const c = data.content;

    // 현재 요일 감지 (0=일요일, 1=월요일, ..., 6=토요일)
    const today = new Date();
    const dayOfWeek = today.getDay();

    // 요일별 매핑
    const dayMapping = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        0: 'weekend',  // 일요일
        6: 'weekend'   // 토요일
    };

    const dayNameMapping = {
        1: '월요일',
        2: '화요일',
        3: '수요일',
        4: '목요일',
        5: '금요일',
        0: '주말',
        6: '주말'
    };

    const currentDayKey = dayMapping[dayOfWeek];
    const currentDayName = dayNameMapping[dayOfWeek];
    const todayPattern = c.daily_patterns[currentDayKey];

    let html = `
        <div class="fortune-section">
            <h2 style="text-align: center; color: #1976d2; margin-bottom: 20px;">${data.title}</h2>
            ${c.overview.title ? `<h3>${c.overview.title}</h3>` : ''}
            <p style="font-size: 16px; line-height: 1.8; white-space: pre-line;">${c.overview.content}</p>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #e3f2fd, #ffffff); padding: 20px; border-radius: 10px; border: 3px solid #1976d2;">
            <h3 style="color: #1565c0;">✨ 오늘의 운세 (${currentDayName})</h3>
            <h4 style="margin-top: 15px; color: #424242;">${todayPattern.day} - ${todayPattern.energy}</h4>
            <p style="line-height: 1.8; white-space: pre-line; font-size: 15px; margin-top: 10px;">${todayPattern.content}</p>
            <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 5px;">
                <strong>⏰ 행운의 시간:</strong> ${todayPattern.lucky_time}<br>
                <strong>💡 조언:</strong> ${todayPattern.advice}
            </div>
        </div>

        <div class="fortune-section">
            <h3>${c.daily_patterns.title}</h3>
            <div style="display: grid; gap: 12px; margin-top: 15px;">
    `;

    // 모든 요일 패턴 표시
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekend'];
    const daysKorean = ['월요일', '화요일', '수요일', '목요일', '금요일', '주말'];

    daysOrder.forEach((day, index) => {
        const pattern = c.daily_patterns[day];
        const isToday = day === currentDayKey;
        const borderColor = isToday ? '#1976d2' : '#e0e0e0';
        const bgColor = isToday ? '#f5f5f5' : '#ffffff';

        html += `
                <div style="background: ${bgColor}; padding: 15px; border-radius: 8px; border-left: 4px solid ${borderColor};">
                    <h4 style="margin-bottom: 8px;">${pattern.day} - ${pattern.energy}${isToday ? ' 👈 오늘' : ''}</h4>
                    <p style="line-height: 1.6; font-size: 14px; color: #666;">${pattern.content}</p>
                    <p style="font-size: 13px; color: #999; margin-top: 8px;">⏰ ${pattern.lucky_time} | 💡 ${pattern.advice}</p>
                </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="fortune-section">
            <h3>${c.fortune_areas.title}</h3>
            <div style="display: grid; gap: 12px; margin-top: 15px;">
    `;

    // fortune_areas의 각 영역을 동적으로 렌더링
    for (const [key, area] of Object.entries(c.fortune_areas)) {
        if (key === 'title') continue;

        html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                    <h4 style="margin-bottom: 8px;">${area.icon} ${area.title}</h4>
                    <p style="line-height: 1.6; font-size: 14px; color: #666;"><strong>좋은 날:</strong> ${area.good_days.join(', ')}</p>
                    <p style="line-height: 1.6; font-size: 14px; margin-top: 8px;">${area.content}</p>
                    <p style="font-size: 13px; color: #999; margin-top: 8px;">💡 ${area.advice}</p>
                </div>
        `;
    }

    html += `
            </div>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #fff9c4, #ffffff); padding: 20px; border-radius: 10px;">
            <h3>${c.lucky_elements.title}</h3>
            <div style="margin-top: 15px;">
                <h4 style="margin-bottom: 10px;">🎨 요일별 행운의 색상</h4>
    `;

    for (const [day, color] of Object.entries(c.lucky_elements.colors)) {
        html += `<p style="line-height: 1.8;"><strong>${day}:</strong> ${color}</p>`;
    }

    html += `
                <h4 style="margin-top: 20px; margin-bottom: 10px;">✨ 활동 추천</h4>
    `;

    // 성별/연령대별로 다른 구조 처리
    if (c.lucky_elements.activities) {
        if (c.lucky_elements.activities.weekday) {
            // 남성 학생 (weekday/weekend)
            html += `
                <p><strong>평일:</strong> ${c.lucky_elements.activities.weekday.join(', ')}</p>
                <p><strong>주말:</strong> ${c.lucky_elements.activities.weekend.join(', ')}</p>
            `;
        } else if (c.lucky_elements.activities.intense) {
            // 남성 직장인/성인 (intense/moderate/calm)
            html += `
                <p><strong>강도 높음:</strong> ${c.lucky_elements.activities.intense.join(', ')}</p>
                <p><strong>적당함:</strong> ${c.lucky_elements.activities.moderate.join(', ')}</p>
                <p><strong>차분함:</strong> ${c.lucky_elements.activities.calm.join(', ')}</p>
            `;
        }
    } else if (c.lucky_elements.self_care) {
        // 여성
        if (c.lucky_elements.self_care.daily) {
            // 학생/주부 (daily/weekly)
            html += `
                <p><strong>매일:</strong> ${c.lucky_elements.self_care.daily.join(', ')}</p>
                <p><strong>일주일:</strong> ${c.lucky_elements.self_care.weekly.join(', ')}</p>
            `;
        } else if (c.lucky_elements.self_care.beauty) {
            // 직장인 (beauty/wellness)
            html += `
                <p><strong>뷰티:</strong> ${c.lucky_elements.self_care.beauty.join(', ')}</p>
                <p><strong>웰니스:</strong> ${c.lucky_elements.self_care.wellness.join(', ')}</p>
            `;
        }
    }

    html += `
            </div>
        </div>

        <div class="fortune-section">
            <h3>${c.weekly_tips.title}</h3>
            <ul style="margin-top: 15px; padding-left: 20px;">
    `;

    c.weekly_tips.tips.forEach(tip => {
        html += `<li style="line-height: 1.8; margin-bottom: 8px;">${tip}</li>`;
    });

    html += `
            </ul>
        </div>

        <div class="fortune-section" style="background: linear-gradient(135deg, #fff5f5, #ffffff); padding: 20px; border-radius: 10px; border: 2px solid #ffebee;">
            <h3>${c.daily_affirmation.title}</h3>
            <p style="line-height: 1.8; white-space: pre-line; font-size: 16px; font-weight: 500; color: #c62828; text-align: center;">${c.daily_affirmation.content}</p>
        </div>
    `;

    return html;
}

// 궁합 모달 표시
function showCompatibilityModal() {
    const modal = document.getElementById('compatibility-modal');
    const overlay = document.getElementById('overlay');

    modal.classList.add('active');
    overlay.classList.add('active');
}

// 띠 아이콘 애니메이션
let zodiacAnimationInterval = null;

function startZodiacAnimation() {
    const iconElement = document.getElementById('partner-zodiac-icon');
    if (!iconElement) return;

    const zodiacs = getZodiacList();
    let currentIndex = 0;

    // 기존 애니메이션 정리
    stopZodiacAnimation();

    // 1초마다 띠 아이콘 변경
    zodiacAnimationInterval = setInterval(() => {
        iconElement.textContent = zodiacs[currentIndex].icon;
        currentIndex = (currentIndex + 1) % zodiacs.length;
    }, 1000);
}

function stopZodiacAnimation() {
    if (zodiacAnimationInterval) {
        clearInterval(zodiacAnimationInterval);
        zodiacAnimationInterval = null;
    }
}

// 상세 페이지에서 궁합 보기 (현재 띠 기준)
function showDetailCompatibility() {
    // 모달 대신 상대방 정보 섹션 표시
    const partnerSection = document.getElementById('partner-info-section');
    if (partnerSection) {
        partnerSection.style.display = 'flex';
        showPartnerInfoSection();

        // 띠 아이콘 애니메이션 시작
        startZodiacAnimation();
    }

    // 궁합 탭 활성화
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const compatTab = document.querySelector('.tab-btn[data-period="compatibility"]');
    if (compatTab) {
        compatTab.classList.add('active');
    }
    current_period = 'compatibility';

    // 운세 내용 공란으로 비우기 (상대 선택 전)
    const fortuneContent = document.getElementById('fortune-content');
    if (fortuneContent) {
        fortuneContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <p style="font-size: 16px;">상대 정보를 선택한 후 <strong>💕 버튼</strong>을 클릭하세요</p>
            </div>
        `;
    }
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

            // 성별 변경 시 current_gender 업데이트 및 운세 내용 갱신
            const newGender = this.dataset.gender;
            if (current_gender !== newGender) {
                current_gender = newGender;
                console.log('🔄 성별 변경:', current_gender);
                updateFortuneContent();
            }
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
        const myYearInput = document.getElementById('my-year-input');
        const partnerYearInput = document.getElementById('partner-year-input');
        if (myYearInput) myYearInput.value = '';
        if (partnerYearInput) partnerYearInput.value = '';
        
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
                        <div class="zodiac-display-icon">${zodiac_data[zodiac].icon}</div>
                        <div class="zodiac-display-name">${zodiac_data[zodiac].name}</div>
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
                        <div class="zodiac-display-icon">${zodiac_data[zodiac].icon}</div>
                        <div class="zodiac-display-name">${zodiac_data[zodiac].name}</div>
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
            myDisplay.innerHTML = `<p class="error-message">나의 출생년도를<br>4자리로 입력해주세요</p>`;
            setTimeout(() => {
                myDisplay.innerHTML = '';
            }, 3000);
        }
        
        if (!partnerYear || partnerYear.length !== 4) {
            const partnerDisplay = document.getElementById('partner-zodiac-compat');
            partnerDisplay.innerHTML = `<p class="error-message">상대방 출생년도를<br>4자리로 입력해주세요</p>`;
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
                <div class="zodiac-display-icon">${zodiac_data[zodiac].icon}</div>
                <div class="zodiac-display-name">${zodiac_data[zodiac].name}</div>
            `;
        }
    } else if (inputId === 'compat-partner-year' && value.toString().length === 4) {
        const zodiac = getZodiacByYear(parseInt(value));
        const display = document.getElementById('partner-zodiac-compat');
        if (zodiac && zodiac_data[zodiac]) {
            display.innerHTML = `
                <div class="zodiac-display-icon">${zodiac_data[zodiac].icon}</div>
                <div class="zodiac-display-name">${zodiac_data[zodiac].name}</div>
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
                    <div class="zodiac-display-icon">${zodiac_data[zodiac].icon}</div>
                    <div class="zodiac-display-name">${zodiac_data[zodiac].name}</div>
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

/**
 * 반응형 레이아웃 실시간 감지 및 조정
 */
function initResponsiveLayout() {
    console.log('🚀 initResponsiveLayout 함수 시작!');
    const zodiacGrid = document.querySelector('.zodiac-grid');
    if (!zodiacGrid) {
        console.error('❌ .zodiac-grid 요소를 찾을 수 없습니다!');
        return;
    }
    console.log('✅ .zodiac-grid 요소 찾음:', zodiacGrid);

    function adjustLayout() {
        const width = window.innerWidth;
        const cards = zodiacGrid.querySelectorAll('.zodiac-card');

        if (cards.length === 0) return;

        // 첫 번째 카드의 실제 크기 측정
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const h3 = card.querySelector('h3');

        if (h3) {
            const fontSize = parseFloat(window.getComputedStyle(h3).fontSize);

            // 폰트가 14px 이하로 떨어지면 레이아웃 강제 변경
            if (width > 768 && fontSize < 14 && cardWidth < 220) {
                console.log(`⚠️ 가독성 임계점 도달! 폰트: ${fontSize.toFixed(1)}px, 카드 너비: ${cardWidth}px`);

                // CSS 미디어 쿼리가 처리하지 못한 경우 JS로 강제 조정
                if (width > 1200) {
                    zodiacGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    zodiacGrid.style.gridTemplateRows = 'repeat(4, 1fr)';
                } else if (width > 900) {
                    zodiacGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    zodiacGrid.style.gridTemplateRows = 'repeat(6, 1fr)';
                }
            } else if (width > 1200) {
                // 큰 화면에서는 원래 레이아웃 복원
                zodiacGrid.style.gridTemplateColumns = '';
                zodiacGrid.style.gridTemplateRows = '';
            }

            console.log(`📊 현재: ${width}px | 카드: ${cardWidth}px | 폰트: ${fontSize.toFixed(1)}px`);
        }
    }

    // 초기 실행
    adjustLayout();

    // 리사이즈 이벤트 (디바운스)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustLayout, 250);
    });
}

// 궁합 모달 새 버전 - 띠 아이콘 선택 핸들러
let compatSelection = {
    my: { zodiac: null, gender: null, year: null },
    partner: { zodiac: null, gender: null, year: null }
};

// 띠 아이콘 클릭 이벤트는 기존 DOMContentLoaded에서 초기화됨

function initZodiacGridButtons() {
    const iconButtons = document.querySelectorAll('.zodiac-grid-btn');

    iconButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const person = this.getAttribute('data-person'); // 'my' or 'partner'
            const zodiac = this.getAttribute('data-zodiac');

            // 같은 person의 다른 버튼들 비활성화
            document.querySelectorAll(`.zodiac-grid-btn[data-person="${person}"]`).forEach(b => {
                b.classList.remove('active');
            });

            // 현재 버튼 활성화
            this.classList.add('active');

            // 선택 저장
            compatSelection[person].zodiac = zodiac;

            // 중앙 하트 영역에 선택된 띠 표시
            updateCenterDisplay(person, zodiac);
        });
    });
}

function initCompatGenderIconButtons() {
    const genderButtons = document.querySelectorAll('.compat-gender-icon-btn');

    genderButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const person = this.getAttribute('data-person');
            const gender = this.getAttribute('data-gender');

            // 같은 person의 다른 버튼들 비활성화
            document.querySelectorAll(`.compat-gender-icon-btn[data-person="${person}"]`).forEach(b => {
                b.classList.remove('active');
            });

            // 현재 버튼 활성화
            this.classList.add('active');

            // 선택 저장
            compatSelection[person].gender = gender;
        });
    });
}

function initYearInputs() {
    const myYearInput = document.getElementById('my-year-input');
    const partnerYearInput = document.getElementById('partner-year-input');

    if (myYearInput) {
        myYearInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value.length === 4) {
                const year = parseInt(this.value);
                const zodiac = getZodiacByYear(year);
                if (zodiac) {
                    compatSelection.my.zodiac = zodiac;
                    compatSelection.my.year = year;
                    // 해당 띠 버튼 자동 선택
                    document.querySelectorAll('.zodiac-grid-btn[data-person="my"]').forEach(b => {
                        b.classList.remove('active');
                        if (b.getAttribute('data-zodiac') === zodiac) {
                            b.classList.add('active');
                        }
                    });
                    updateCenterDisplay('my', zodiac);
                }
            }
        });
    }

    if (partnerYearInput) {
        partnerYearInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value.length === 4) {
                const year = parseInt(this.value);
                const zodiac = getZodiacByYear(year);
                if (zodiac) {
                    compatSelection.partner.zodiac = zodiac;
                    compatSelection.partner.year = year;
                    // 해당 띠 버튼 자동 선택
                    document.querySelectorAll('.zodiac-grid-btn[data-person="partner"]').forEach(b => {
                        b.classList.remove('active');
                        if (b.getAttribute('data-zodiac') === zodiac) {
                            b.classList.add('active');
                        }
                    });
                    updateCenterDisplay('partner', zodiac);
                }
            }
        });
    }
}

function updateCenterDisplay(person, zodiac) {
    const iconId = person === 'my' ? 'my-selected-icon' : 'partner-selected-icon';
    const iconElement = document.getElementById(iconId);

    if (zodiac && zodiac_data[zodiac]) {
        iconElement.textContent = zodiac_data[zodiac].icon;
        iconElement.classList.add('filled');
    } else {
        iconElement.textContent = '?';
        iconElement.classList.remove('filled');
    }
}

// 새로운 궁합 결과 표시 함수
function showCompatibilityResultNew() {
    const my = compatSelection.my;
    const partner = compatSelection.partner;

    // 유효성 검사
    if (!my.zodiac || !my.gender) {
        alert('나의 띠와 성별을 선택해주세요.');
        return;
    }

    if (!partner.zodiac || !partner.gender) {
        alert('상대방의 띠와 성별을 선택해주세요.');
        return;
    }

    // 모달 닫기
    closeCompatibilityModalSimple();

    // 궁합 전용 페이지로 이동
    showCompatibilityPage(my.zodiac, partner.zodiac, my.gender, partner.gender, my.year, partner.year);
}

// 궁합 전용 페이지 표시
function showCompatibilityPage(myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // 궁합 페이지 표시
    const compatibilityPage = document.getElementById('compatibility-page');
    compatibilityPage.style.display = 'block';

    // 궁합 데이터 로드 및 표시
    loadCompatibilityDataForPage(myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear);
}

// 궁합 페이지용 데이터 로드
async function loadCompatibilityDataForPage(myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear) {
    try {
        const fileName = `compatibility_${myZodiac}_${partnerZodiac}.json`;
        const response = await fetch(`data/fortune/compatibility/${fileName}`);

        if (!response.ok) {
            throw new Error('궁합 데이터를 불러올 수 없습니다.');
        }

        const data = await response.json();

        // 궁합 페이지에 내용 표시
        displayCompatibilityOnPage(data, myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear);

    } catch (error) {
        console.error('궁합 데이터 로드 실패:', error);
        alert('궁합 데이터를 불러오는데 실패했습니다.');
    }
}

// 궁합 페이지에 내용 표시
function displayCompatibilityOnPage(data, myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear) {
    const pageContent = document.getElementById('compatibility-page-content');

    if (!pageContent) {
        console.error('궁합 페이지 영역을 찾을 수 없습니다.');
        return;
    }

    const content = data.content;
    const myZodiacData = zodiac_data[myZodiac];
    const partnerZodiacData = zodiac_data[partnerZodiac];

    // 60갑자 정보 가져오기
    const mySexagenary = myYear ? getSexagenaryByYear(myYear) : null;
    const partnerSexagenary = partnerYear ? getSexagenaryByYear(partnerYear) : null;

    // 년도 정보 표시 텍스트 생성
    const myYearText = myYear ? `${myYear}년생 ${mySexagenary?.name || ''} ` : '';
    const partnerYearText = partnerYear ? `${partnerYear}년생 ${partnerSexagenary?.name || ''} ` : '';

    pageContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #fff5f5, #fff); border-radius: 15px; border: 2px solid #ffebee;">
            <h2 style="font-size: 28px; color: #d32f2f; margin-bottom: 15px;">
                ${myZodiacData.icon} × ${partnerZodiacData.icon} 궁합
            </h2>
            <div style="font-size: 18px; color: #666; margin-bottom: 20px;">
                ${myYearText}${myZodiacData.name} ${myGender === 'male' ? '남성' : '여성'} × ${partnerYearText}${partnerZodiacData.name} ${partnerGender === 'male' ? '남성' : '여성'}
            </div>
            <div style="font-size: 48px; font-weight: bold; color: var(--primary-color); margin: 20px 0;">
                ${content.overview.score}점
            </div>
            <div style="font-size: 16px; color: #555;">
                ${content.overview.summary}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="compat-card">
                <h3 style="color: #e91e63; margin-bottom: 10px;">💕 연인 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #e91e63;">${content.love_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.love_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #9c27b0; margin-bottom: 10px;">💑 부부 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #9c27b0;">${content.marriage_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.marriage_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #ff9800; margin-bottom: 10px;">👥 친구 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #ff9800;">${content.friendship_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.friendship_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #2196f3; margin-bottom: 10px;">💼 사업 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #2196f3;">${content.business_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.business_compatibility.content}</p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <h3 style="color: #4caf50; margin-bottom: 15px;">✨ 강점</h3>
                <ul style="list-style: none; padding: 0;">
                    ${content.strengths.items.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">✓ ${item}</li>`).join('')}
                </ul>
            </div>

            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <h3 style="color: #ff9800; margin-bottom: 15px;">⚠️ 주의할 점</h3>
                <ul style="list-style: none; padding: 0;">
                    ${content.challenges.items.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">⚡ ${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #e3f2fd, #fff); padding: 30px; border-radius: 10px; margin-top: 30px; border: 2px solid #90caf9;">
            <h3 style="color: #1976d2; margin-bottom: 15px;">💝 좋은 관계를 위한 조언</h3>
            <p style="line-height: 1.8; font-size: 15px; white-space: pre-line;">${content.advice.content}</p>
        </div>
    `;
}

// 궁합 모달 닫기
function closeCompatibilityModalSimple() {
    const modal = document.getElementById('simple-compatibility-modal');
    const overlay = document.getElementById('overlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');

    // 선택 초기화
    compatSelection = {
        my: { zodiac: null, gender: null, year: null },
        partner: { zodiac: null, gender: null, year: null }
    };

    // 버튼 초기화
    document.querySelectorAll('.zodiac-grid-btn, .compat-gender-icon-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 중앙 아이콘 초기화
    document.getElementById('my-selected-icon').textContent = '?';
    document.getElementById('partner-selected-icon').textContent = '?';
    document.getElementById('my-selected-icon').classList.remove('filled');
    document.getElementById('partner-selected-icon').classList.remove('filled');

    // 년도 입력칸 초기화
    const myYearInput = document.getElementById('my-year-input');
    const partnerYearInput = document.getElementById('partner-year-input');
    if (myYearInput) myYearInput.value = '';
    if (partnerYearInput) partnerYearInput.value = '';
}

// 년도 선택 모달 열기
let currentYearPickerTarget = null;

function openYearPickerModal(person) {
    currentYearPickerTarget = person;
    const modal = document.getElementById('year-picker-modal');
    const grid = document.getElementById('year-picker-grid');

    // 선택된 띠가 있는지 확인
    const selectedZodiac = compatSelection[person].zodiac;

    // 년도 범위: 1924 ~ 2024 (100년)
    const currentYear = new Date().getFullYear();
    const startYear = 1924;
    const endYear = currentYear;

    // 그리드 생성
    grid.innerHTML = '';

    if (selectedZodiac) {
        // 띠가 선택된 경우: 해당 띠의 년도만 표시
        const modalTitle = modal.querySelector('h3');
        modalTitle.textContent = `${zodiac_data[selectedZodiac].name} 출생년도 선택`;

        for (let year = endYear; year >= startYear; year--) {
            const zodiac = getZodiacByYear(year);
            if (zodiac === selectedZodiac) {
                const yearBtn = document.createElement('button');
                yearBtn.className = 'year-option';
                yearBtn.textContent = year;
                yearBtn.onclick = () => selectYear(year);
                grid.appendChild(yearBtn);
            }
        }
    } else {
        // 띠가 선택 안 된 경우: 전체 년도 표시
        const modalTitle = modal.querySelector('h3');
        modalTitle.textContent = '출생년도 선택';

        for (let year = endYear; year >= startYear; year--) {
            const yearBtn = document.createElement('button');
            yearBtn.className = 'year-option';
            yearBtn.textContent = year;
            yearBtn.onclick = () => selectYear(year);
            grid.appendChild(yearBtn);
        }
    }

    modal.style.display = 'flex';
}

function selectYear(year) {
    const inputId = currentYearPickerTarget === 'my' ? 'my-year-input' : 'partner-year-input';
    const input = document.getElementById(inputId);

    if (input) {
        input.value = year;
        // input 이벤트 트리거
        input.dispatchEvent(new Event('input'));
    }

    closeYearPickerModal();
}

function closeYearPickerModal() {
    const modal = document.getElementById('year-picker-modal');
    modal.style.display = 'none';
    currentYearPickerTarget = null;
}

// 궁합 데이터 로드 및 표시
async function loadCompatibilityData(myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear) {
    try {
        // compatibility_rat_ox.json 형식으로 파일명 생성
        const fileName = `compatibility_${myZodiac}_${partnerZodiac}.json`;
        const response = await fetch(`data/fortune/compatibility/${fileName}`);

        if (!response.ok) {
            throw new Error('궁합 데이터를 불러올 수 없습니다.');
        }

        const data = await response.json();

        // 상세 페이지에 궁합 섹션 표시
        displayCompatibilitySection(data, myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear);

    } catch (error) {
        console.error('궁합 데이터 로드 실패:', error);
        alert('궁합 데이터를 불러오는데 실패했습니다.');
    }
}

// 상세 페이지에 궁합 섹션 표시
function displayCompatibilitySection(data, myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear) {
    // fortune-content 영역 찾기
    const detailContent = document.getElementById('fortune-content');

    if (!detailContent) {
        console.error('상세 페이지 영역을 찾을 수 없습니다.');
        return;
    }

    // 기존 궁합 섹션 제거
    const existingSection = document.getElementById('compatibility-section');
    if (existingSection) {
        existingSection.remove();
    }

    // 궁합 섹션 HTML 생성
    const compatSection = document.createElement('div');
    compatSection.id = 'compatibility-section';
    compatSection.className = 'fortune-content-section';
    compatSection.style.marginTop = '30px';
    compatSection.style.padding = '30px';
    compatSection.style.background = 'linear-gradient(135deg, #fff5f5, #fff)';
    compatSection.style.borderRadius = '15px';
    compatSection.style.border = '2px solid #ffebee';

    const content = data.content;
    const myZodiacData = zodiac_data[myZodiac];
    const partnerZodiacData = zodiac_data[partnerZodiac];

    // 60갑자 정보 가져오기
    const mySexagenary = myYear ? getSexagenaryByYear(myYear) : null;
    const partnerSexagenary = partnerYear ? getSexagenaryByYear(partnerYear) : null;

    // 년도 정보 표시 텍스트 생성
    const myYearText = myYear ? `${myYear}년생 ${mySexagenary?.name || ''} ` : '';
    const partnerYearText = partnerYear ? `${partnerYear}년생 ${partnerSexagenary?.name || ''} ` : '';

    compatSection.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 28px; color: #d32f2f; margin-bottom: 15px;">
                ${myZodiacData.icon} × ${partnerZodiacData.icon} 궁합
            </h2>
            <div style="font-size: 18px; color: #666; margin-bottom: 20px;">
                ${myYearText}${myZodiacData.name} ${myGender === 'male' ? '남성' : '여성'} × ${partnerYearText}${partnerZodiacData.name} ${partnerGender === 'male' ? '남성' : '여성'}
            </div>
            <div style="font-size: 48px; font-weight: bold; color: var(--primary-color); margin: 20px 0;">
                ${content.overview.score}점
            </div>
            <div style="font-size: 16px; color: #555;">
                ${content.overview.summary}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="compat-card">
                <h3 style="color: #e91e63; margin-bottom: 10px;">💕 연인 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #e91e63;">${content.love_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.love_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #9c27b0; margin-bottom: 10px;">💑 부부 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #9c27b0;">${content.marriage_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.marriage_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #ff9800; margin-bottom: 10px;">👥 친구 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #ff9800;">${content.friendship_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.friendship_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #2196f3; margin-bottom: 10px;">💼 사업 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #2196f3;">${content.business_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.business_compatibility.content}</p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <h3 style="color: #4caf50; margin-bottom: 15px;">✨ 강점</h3>
                <ul style="list-style: none; padding: 0;">
                    ${content.strengths.items.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">✓ ${item}</li>`).join('')}
                </ul>
            </div>

            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <h3 style="color: #ff9800; margin-bottom: 15px;">⚠️ 주의사항</h3>
                <ul style="list-style: none; padding: 0;">
                    ${content.challenges.items.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">⚡ ${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #e3f2fd, #fff); padding: 25px; border-radius: 10px; margin-top: 30px; border-left: 4px solid var(--primary-color);">
            <h3 style="color: var(--primary-color); margin-bottom: 15px;">💡 조언</h3>
            <p style="line-height: 1.8; font-size: 16px; white-space: pre-line;">${content.advice.content}</p>
        </div>
    `;

    // 상세 페이지 콘텐츠 영역에 추가
    detailContent.appendChild(compatSection);

    // 궁합 섹션으로 스크롤
    setTimeout(() => {
        compatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// CSS for compat-card
const style = document.createElement('style');
style.textContent = `
    .compat-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
        text-align: center;
        transition: all 0.3s ease;
    }

    .compat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// 반응형 레이아웃은 DOMContentLoaded 이벤트(262번 줄)에서 초기화됨

// ============================================
// 상대방 궁합 선택 기능 (Partner Compatibility)
// ============================================

// 상대방 정보 저장
let partnerSelection = {
    zodiac: null,
    zodiacName: null,
    year: null,
    gender: 'female'
};

// 띠 목록 가져오기 헬퍼 함수
function getZodiacList() {
    if (zodiacData && zodiacData.zodiac_animals) {
        return zodiacData.zodiac_animals;
    }
    // 폴백: 기본 띠 목록 (getZodiacByYear와 ID 일치시킴)
    return [
        { id: 'rat', icon: '🐭', name: '쥐띠' },
        { id: 'ox', icon: '🐮', name: '소띠' },
        { id: 'tiger', icon: '🐯', name: '호랑이띠' },
        { id: 'rabbit', icon: '🐰', name: '토끼띠' },
        { id: 'dragon', icon: '🐲', name: '용띠' },
        { id: 'snake', icon: '🐍', name: '뱀띠' },
        { id: 'horse', icon: '🐴', name: '말띠' },
        { id: 'sheep', icon: '🐑', name: '양띠' },  // goat → sheep로 수정
        { id: 'monkey', icon: '🐵', name: '원숭이띠' },
        { id: 'rooster', icon: '🐔', name: '닭띠' },
        { id: 'dog', icon: '🐶', name: '개띠' },
        { id: 'pig', icon: '🐷', name: '돼지띠' }
    ];
}

// 궁합보기 탭 클릭 시 상대방 정보 섹션 표시
function showPartnerInfoSection() {
    const partnerSection = document.getElementById('partner-info-section');
    if (partnerSection) {
        partnerSection.style.display = 'flex';
    }
}

// 띠 선택 모달 표시
function showPartnerZodiacModal() {
    const zodiacs = getZodiacList();
    const overlay = document.createElement('div');
    overlay.className = 'partner-zodiac-modal-overlay';
    overlay.innerHTML = `
        <div class="partner-zodiac-modal" onclick="event.stopPropagation()">
            <h3>상대 띠 선택</h3>
            <div class="partner-zodiac-grid">
                ${zodiacs.map(z => `
                    <div class="partner-zodiac-option" data-zodiac="${z.id}">
                        <span class="zodiac-icon">${z.icon}</span>
                        <span class="zodiac-name">${z.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // 오버레이 클릭 시 닫기
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePartnerZodiacModal();
        }
    });

    document.body.appendChild(overlay);

    // 띠 선택 옵션에 이벤트 리스너 추가
    const options = overlay.querySelectorAll('.partner-zodiac-option');
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const zodiacId = option.dataset.zodiac;
            const zodiacInfo = zodiacs.find(z => z.id === zodiacId);
            if (zodiacInfo) {
                selectPartnerZodiac(zodiacId, zodiacInfo.name);
            }
        });
    });
}

// 띠 선택
function selectPartnerZodiac(zodiacId, zodiacName) {
    partnerSelection.zodiac = zodiacId;
    partnerSelection.zodiacName = zodiacName;

    // 애니메이션 중지
    stopZodiacAnimation();

    // 띠에 맞는 아이콘 찾기
    const zodiacs = getZodiacList();
    const zodiacInfo = zodiacs.find(z => z.id === zodiacId);
    const iconElement = document.getElementById('partner-zodiac-icon');
    const zodiacBtn = document.getElementById('partner-zodiac-btn');

    if (iconElement && zodiacInfo) {
        iconElement.textContent = zodiacInfo.icon;
    }

    // 선택 완료 표시
    if (zodiacBtn) {
        zodiacBtn.classList.add('selected');
    }

    console.log('✅ 상대 띠 선택:', zodiacName);
    closePartnerZodiacModal();
}

// 띠 선택 모달 닫기
function closePartnerZodiacModal() {
    const overlay = document.querySelector('.partner-zodiac-modal-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 년도 선택기 모달 표시 (스크롤 리스트 방식 - 별자리 시스템 참고)
let availableYears = [];

function showPartnerYearPicker() {
    // 가능한 년도 범위 생성
    availableYears = [];
    const currentYear = new Date().getFullYear();

    if (partnerSelection.zodiac) {
        // 띠가 선택된 경우: 해당 띠의 년도만 표시 (12년 주기)
        // baseYear는 이미 데이터의 최신 년도 (2008년생이 최신)
        const baseYear = getBaseYearForZodiac(partnerSelection.zodiac);
        const minYear = 1948; // 데이터 최소 년도

        // baseYear부터 12년씩 빼면서 1948년까지만 (총 6개)
        for (let year = baseYear; year >= minYear; year -= 12) {
            availableYears.push(year);
        }

        availableYears.sort((a, b) => b - a); // 최신 년도부터
    } else {
        // 띠 미선택: 데이터 범위 내 모든 년도 표시 (2008~1948)
        const maxYear = 2008; // 데이터 최대 년도
        const minYear = 1948; // 데이터 최소 년도
        for (let year = maxYear; year >= minYear; year--) {
            availableYears.push(year);
        }
    }

    console.log('📅 생성된 년도 목록:', availableYears.length + '개', availableYears);

    // 슬롯 인덱스 초기화 (첫 번째 년도 = 가장 최신)
    slotYearIndex = 0;

    // 모달 생성 (슬롯머신 방식)
    const overlay = document.createElement('div');
    overlay.className = 'year-slot-modal-overlay';
    overlay.innerHTML = `
        <div class="year-slot-modal" onclick="event.stopPropagation()">
            <h3>📅 출생 년도 선택</h3>
            <div class="slot-window">
                <div class="slot-reel" id="year-slot-reel">
                    <!-- 년도들이 여기에 동적으로 추가됨 -->
                </div>
            </div>
            <div class="slot-controls">
                <button type="button" class="slot-control-btn" onclick="moveYearSlotUp()">▲</button>
                <button type="button" class="slot-control-btn" onclick="moveYearSlotDown()">▼</button>
            </div>
            <button type="button" class="slot-confirm-btn" onclick="confirmPartnerYear()">선택 완료</button>
        </div>
    `;

    // 오버레이 클릭 시 닫기
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeYearSlotModal();
        }
    });

    document.body.appendChild(overlay);

    // 슬롯 렌더링
    renderYearSlot();

    // 마우스 휠 이벤트 추가
    const slotModal = overlay.querySelector('.year-slot-modal');
    if (slotModal) {
        slotModal.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 휠 위로 = deltaY < 0 = 슬롯 위로 이동 (년도 감소)
            // 휠 아래로 = deltaY > 0 = 슬롯 아래로 이동 (년도 증가)
            if (e.deltaY < 0) {
                moveYearSlotUp();
            } else if (e.deltaY > 0) {
                moveYearSlotDown();
            }
        });
    }
}

// 슬롯 인덱스
let slotYearIndex = 0;

// 슬롯 렌더링
function renderYearSlot() {
    const reel = document.getElementById('year-slot-reel');
    if (!reel) return;

    reel.innerHTML = '';

    // 5개 아이템 표시 (위 2개, 중간 1개, 아래 2개)
    for (let i = -2; i <= 2; i++) {
        const index = slotYearIndex + i;
        const item = document.createElement('div');
        item.className = 'slot-year-item';

        if (index >= 0 && index < availableYears.length) {
            item.textContent = availableYears[index] + '년';
            if (i === 0) {
                item.classList.add('center');
            }
        } else {
            item.textContent = '';
            item.style.visibility = 'hidden';
        }

        reel.appendChild(item);
    }

    // 중앙 아이템을 슬롯 윈도우 중앙에 위치
    // 슬롯 윈도우 높이: 180px, 중앙: 90px
    // 아이템 높이: 60px, 중앙 아이템은 인덱스 2
    // 중앙 아이템 중심(150px)을 윈도우 중앙(90px)에 맞추기: 90 - 150 = -60px
    reel.style.transform = 'translateY(-60px)';
}

// 슬롯 위로 이동 (순환)
window.moveYearSlotUp = function() {
    slotYearIndex--;
    if (slotYearIndex < 0) {
        slotYearIndex = availableYears.length - 1; // 마지막으로 순환
    }
    renderYearSlot();
}

// 슬롯 아래로 이동 (순환)
window.moveYearSlotDown = function() {
    slotYearIndex++;
    if (slotYearIndex >= availableYears.length) {
        slotYearIndex = 0; // 첫 번째로 순환
    }
    renderYearSlot();
}

// 년도 확인
window.confirmPartnerYear = function() {
    const selectedYear = availableYears[slotYearIndex];
    selectPartnerYear(selectedYear);
}

// 년도 선택
function selectPartnerYear(selectedYear) {
    partnerSelection.year = selectedYear;

    // 년도 표시 업데이트
    const yearDisplay = document.getElementById('partner-year-display');
    const yearBtn = document.getElementById('partner-year-btn');

    if (yearDisplay) {
        yearDisplay.textContent = selectedYear + '년';
    }

    // 선택 완료 표시
    if (yearBtn) {
        yearBtn.classList.add('selected');
    }

    // 년도를 먼저 선택한 경우: 띠 자동 선택
    if (!partnerSelection.zodiac) {
        const zodiacId = getZodiacByYear(selectedYear);
        const zodiacs = getZodiacList();
        const zodiacInfo = zodiacs.find(z => z.id === zodiacId);

        if (zodiacInfo) {
            // 애니메이션 먼저 중지
            stopZodiacAnimation();

            partnerSelection.zodiac = zodiacId;
            partnerSelection.zodiacName = zodiacInfo.name;

            const iconElement = document.getElementById('partner-zodiac-icon');
            const zodiacBtn = document.getElementById('partner-zodiac-btn');

            if (iconElement) {
                iconElement.textContent = zodiacInfo.icon;
            }

            // 띠 선택 완료 표시
            if (zodiacBtn) {
                zodiacBtn.classList.add('selected');
            }

            console.log('✅ 년도 기반 자동 띠 선택:', zodiacInfo.name, '(년도:', selectedYear + ')');
        } else {
            console.error('❌ 띠 정보를 찾을 수 없음:', zodiacId);
        }
    } else {
        console.log('ℹ️ 띠가 이미 선택되어 있음:', partnerSelection.zodiacName);
    }

    console.log('✅ 상대 년도 선택:', selectedYear);
    closeYearSlotModal();
}


// 년도 선택 모달 닫기
function closeYearSlotModal() {
    const overlay = document.querySelector('.year-slot-modal-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 성별 선택
function selectPartnerGender(gender) {
    partnerSelection.gender = gender;

    // 상대방 정보 섹션 내의 성별 버튼만 선택
    const partnerSection = document.getElementById('partner-info-section');
    if (!partnerSection) return;

    const genderButtons = partnerSection.querySelectorAll('.gender-btn[data-gender]');
    genderButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = partnerSection.querySelector(`.gender-btn[data-gender="${gender}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    console.log('✅ 상대방 성별 선택:', gender);
}

// 띠별 기준 년도 가져오기 (데이터 기준: 2008~1948, 6개 년도)
function getBaseYearForZodiac(zodiacId) {
    // 각 띠의 가장 최신 년도 (데이터에 있는 년도 기준)
    const baseYears = {
        'rat': 2008,      // 쥐: 2008, 1996, 1984, 1972, 1960, 1948
        'ox': 2009,       // 소
        'tiger': 2010,    // 호랑이
        'rabbit': 2011,   // 토끼
        'dragon': 2012,   // 용
        'snake': 2013,    // 뱀
        'horse': 2014,    // 말
        'sheep': 2015,    // 양
        'monkey': 2016,   // 원숭이
        'rooster': 2017,  // 닭
        'dog': 2018,      // 개
        'pig': 2019       // 돼지
    };

    return baseYears[zodiacId];
}

// 토스트 메시지 표시
function showToast(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 3초 후 자동 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// 페이지 내 궁합 보기
async function showCompatibilityInPage() {
    // 본인 정보 (좌측)
    const myZodiac = current_zodiac;
    const myGender = current_gender;
    const myYear = current_year;

    // 상대 정보 (우측)
    const partnerZodiac = partnerSelection.zodiac;
    const partnerGender = partnerSelection.gender;
    const partnerYear = partnerSelection.year;

    // 유효성 검사
    if (!myZodiac || !myGender || !myYear) {
        showToast('본인 정보를 먼저 입력해주세요');
        return;
    }

    if (!partnerZodiac) {
        showToast('상대 정보를 입력해주세요');
        return;
    }

    console.log('🔄 궁합 로딩 중...');
    console.log('나:', myZodiac, myGender, myYear);
    console.log('상대방:', partnerZodiac, partnerGender, partnerYear);

    try {
        // 궁합 데이터 로드
        const compatFilePath = `data/fortune/compatibility/compatibility_${myZodiac}_${partnerZodiac}.json`;
        const response = await fetch(compatFilePath);

        if (!response.ok) {
            throw new Error(`궁합 데이터를 찾을 수 없습니다: ${compatFilePath}`);
        }

        const data = await response.json();

        // 궁합 데이터는 성별 무관 (content에 직접 궁합 정보가 있음)
        const compatContent = data.content;

        if (!compatContent) {
            throw new Error('궁합 데이터 형식이 올바르지 않습니다.');
        }

        // 궁합 결과 표시
        displayCompatibilityInPage(data, compatContent, myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear);

    } catch (error) {
        console.error('❌ 궁합 로드 오류:', error);
        showToast('궁합 정보를 불러오는데 실패했습니다');
    }
}

// 페이지 내 궁합 표시
function displayCompatibilityInPage(data, content, myZodiac, partnerZodiac, myGender, partnerGender, myYear, partnerYear) {
    const fortuneContent = document.getElementById('fortune-content');
    if (!fortuneContent) {
        showToast('운세 표시 영역을 찾을 수 없습니다');
        return;
    }

    // 기존 궁합 섹션 제거
    const existingCompat = fortuneContent.querySelector('.compatibility-section');
    if (existingCompat) {
        existingCompat.remove();
    }

    // 띠 정보
    const zodiacs = getZodiacList();
    const myZodiacInfo = zodiacs.find(z => z.id === myZodiac);
    const partnerZodiacInfo = zodiacs.find(z => z.id === partnerZodiac);

    // 년도 및 60갑자 정보
    const mySexagenary = myYear ? getSexagenaryByYear(myYear) : null;
    const partnerSexagenary = partnerYear ? getSexagenaryByYear(partnerYear) : null;

    const myYearText = myYear ? `${myYear}년생 ${mySexagenary?.name || ''} ` : '';
    const partnerYearText = partnerYear ? `${partnerYear}년생 ${partnerSexagenary?.name || ''} ` : '';

    const myGenderText = myGender === 'male' ? '남성' : '여성';
    const partnerGenderText = partnerGender === 'male' ? '남성' : '여성';

    // 궁합 HTML 생성
    const compatSection = document.createElement('div');
    compatSection.className = 'compatibility-section';
    compatSection.style.cssText = 'margin-top: 30px; padding: 30px; background: linear-gradient(135deg, #fff5f5, #fff); border-radius: 15px; border: 2px solid #ffcdd2;';

    compatSection.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #d32f2f; margin-bottom: 15px;">궁합 결과</h2>
            <div style="font-size: 18px; color: #555;">
                <div style="margin-bottom: 10px;">
                    ${myZodiacInfo.icon} <strong>${myYearText}${myZodiacInfo.name} ${myGenderText}</strong>
                </div>
                <div style="font-size: 24px; margin: 10px 0;">×</div>
                <div>
                    ${partnerZodiacInfo.icon} <strong>${partnerYearText}${partnerZodiacInfo.name} ${partnerGenderText}</strong>
                </div>
            </div>
        </div>

        <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #e91e63;">
            <h3 style="color: #e91e63; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between;">
                <span>💬 전체 평가</span>
                <span style="font-size: 28px; font-weight: bold; color: #e91e63;">${content.overview.score}점</span>
            </h3>
            <p style="line-height: 1.8; font-size: 16px; white-space: pre-line;">${content.overview.summary}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
            <div class="compat-card">
                <h3 style="color: #e91e63; margin-bottom: 10px;">💕 연애 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #e91e63;">${content.love_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.love_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #9c27b0; margin-bottom: 10px;">💍 결혼 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #9c27b0;">${content.marriage_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.marriage_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #ff9800; margin-bottom: 10px;">🤝 우정 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #ff9800;">${content.friendship_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.friendship_compatibility.content}</p>
            </div>

            <div class="compat-card">
                <h3 style="color: #2196f3; margin-bottom: 10px;">💼 사업 궁합</h3>
                <div style="font-size: 32px; font-weight: bold; color: #2196f3;">${content.business_compatibility.score}점</div>
                <p style="margin-top: 10px; line-height: 1.6;">${content.business_compatibility.content}</p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <h3 style="color: #4caf50; margin-bottom: 15px;">✨ 강점</h3>
                <ul style="list-style: none; padding: 0;">
                    ${content.strengths.items.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">✓ ${item}</li>`).join('')}
                </ul>
            </div>

            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                <h3 style="color: #ff9800; margin-bottom: 15px;">⚠️ 주의사항</h3>
                <ul style="list-style: none; padding: 0;">
                    ${content.challenges.items.map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">⚡ ${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #e3f2fd, #fff); padding: 25px; border-radius: 10px; margin-top: 30px; border-left: 4px solid var(--primary-color);">
            <h3 style="color: var(--primary-color); margin-bottom: 15px;">💡 조언</h3>
            <p style="line-height: 1.8; font-size: 16px; white-space: pre-line;">${content.advice.content}</p>
        </div>
    `;

    fortuneContent.appendChild(compatSection);

    // 궁합 섹션으로 스크롤
    setTimeout(() => {
        compatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    console.log('✅ 궁합 표시 완료');
}