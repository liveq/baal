// ===================================================================
// RHEIGHT 혈액형 테스트 - 통합 성별 관리 시스템
// 모든 성별 버튼 동기화 및 중앙 집중식 상태 관리
// ===================================================================

let currentBloodType = null;
let currentGender = 'male';

// 성별별 특성 정의 (혈액형 심리학자 서브에이전트 제공)
const bloodTypeTraits = {
    A: { male: "세심함", female: "배려심" },
    B: { male: "창의적", female: "솔직함" },
    O: { male: "추진력", female: "사교적" },
    AB: { male: "논리적", female: "감성적" }
};

// ===================================================================
// 통합 성별 관리 시스템 - 모든 성별 버튼 동기화
// ===================================================================

/**
 * 중앙 집중식 성별 상태 관리
 * 모든 성별 버튼을 동기화하고 일관성 보장
 */
window.setGenderState = function(gender) {
    currentGender = gender;
    
    // localStorage에 저장 (상태 지속성)
    localStorage.setItem('selectedGender', gender);
    
    // 모든 성별 버튼 동기화
    syncAllGenderButtons(gender);
    
    // 성별별 특성 업데이트
    updateGenderTraits(gender);
    
    // 데이터 리로드 (혈액형이 선택된 경우)
    if (currentBloodType) {
        loadBloodTypeData();
        
        // 바이오리듬 탭이 활성화되어 있으면 업데이트
        const biorhythmPanel = document.getElementById('biorhythm-panel');
        if (biorhythmPanel && biorhythmPanel.classList.contains('active')) {
            loadBiorhythmData();
        }
    }
};

/**
 * 모든 성별 버튼을 선택된 성별로 동기화
 * 혈액형별 성별 버튼은 현재 선택된 혈액형에만 활성화
 */
function syncAllGenderButtons(selectedGender) {
    // 1. 모든 성별 버튼의 active 상태 제거
    const allGenderButtonSelectors = [
        '.gender-btn',           // 메인 사이드바 성별 버튼 (전역)
        '.gender-btn-new',       // 개별 혈액형 성별 버튼 (혈액형별)
        '.gender-tab-btn',       // 탭 영역 성별 토글 버튼 (전역)
        '.gender-btn-compact',   // 컴팩트 성별 버튼 (전역)
        '.gender-btn-mini'       // 미니 성별 버튼 (전역)
    ];
    
    allGenderButtonSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
    });
    
    // 2. 전역 성별 버튼들 활성화 (사이드바 및 탭 영역)
    // 메인 사이드바 성별 버튼 활성화
    const mainGenderBtn = document.getElementById(`gender-${selectedGender}`);
    if (mainGenderBtn) {
        mainGenderBtn.classList.add('active');
    }
    
    // 탭 영역 성별 버튼 활성화 (onclick 속성으로 식별)
    document.querySelectorAll('.gender-tab-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${selectedGender}'`)) {
            btn.classList.add('active');
        }
    });
    
    // 기타 전역 성별 버튼 활성화 (혈액형별 버튼 제외)
    document.querySelectorAll(`[data-gender="${selectedGender}"]`).forEach(btn => {
        // .gender-btn-new는 혈액형별 처리에서 따로 처리하므로 제외
        if (btn.classList.contains('gender-btn-compact') || 
            btn.classList.contains('gender-btn-mini')) {
            btn.classList.add('active');
        }
    });
    
    // 3. 혈액형별 성별 버튼 처리 (현재 선택된 혈액형만 활성화)
    if (currentBloodType) {
        // 현재 선택된 혈액형의 해당 성별 버튼만 활성화
        const currentBloodGenderBtn = document.querySelector(
            `.gender-btn-new[data-blood="${currentBloodType}"][data-gender="${selectedGender}"]`
        );
        if (currentBloodGenderBtn) {
            currentBloodGenderBtn.classList.add('active');
        }
    }
    
    // 참고: 다른 혈액형의 .gender-btn-new 버튼들은 의도적으로 비활성화 상태 유지
    // 이를 통해 각 혈액형 페이지에서 해당 혈액형의 성별 버튼만 활성화됨
}

/**
 * 성별별 특성 텍스트 업데이트
 * 모든 혈액형의 특성 설명을 선택된 성별에 맞게 변경
 */
function updateGenderTraits(gender) {
    // 네비게이션의 특성 텍스트 업데이트
    document.querySelectorAll('.nav-trait').forEach(trait => {
        const bloodType = trait.getAttribute('data-blood');
        
        if (bloodTypeTraits[bloodType] && bloodTypeTraits[bloodType][gender]) {
            trait.textContent = bloodTypeTraits[bloodType][gender];
        }
    });
    
    // 모든 혈액형 특성 업데이트 (확장성을 위해)
    ['A', 'B', 'O', 'AB'].forEach(type => {
        const traitElements = document.querySelectorAll(`.nav-trait[data-blood="${type}"]`);
        traitElements.forEach(element => {
            if (bloodTypeTraits[type] && bloodTypeTraits[type][gender]) {
                element.textContent = bloodTypeTraits[type][gender];
            }
        });
    });
}

window.toggleNav = function() {
    const nav = document.querySelector('.blood-nav');
    nav.classList.toggle('collapsed');
};

// ===================================================================
// 공개 API 함수들 - 하위 호환성 유지
// ===================================================================

/**
 * 혈액형과 성별을 동시에 선택하는 통합 함수
 * 같은 혈액형 내에서 성별만 변경할 때 사용
 * 새로운 혈액형 선택 시에는 selectBloodType() 사용 권장
 */
window.selectBloodTypeAndGender = function(type, gender) {
    // 현재 혈액형과 비교 로직 추가
    if (currentBloodType === type) {
        // 같은 혈액형: 성별만 변경
        setGenderState(gender || 'male');
        const currentTab = getCurrentTab();
        updateURL(currentBloodType, gender, currentTab, true);
        loadBloodTypeData();
        return;
    }
    
    // 다른 혈액형 또는 초기 선택: 혈액형 설정 후 요청된 성별로 설정
    currentBloodType = type;
    
    // 페이지 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 혈액형 그룹 활성화
    activateBloodTypeGroup(type);
    
    // 화면 전환
    switchToDetailView();
    
    // 요청된 성별로 설정 (gender 파라미터 존중)
    setGenderState(gender || 'male');
    
    // URL 업데이트 (새 혈액형 선택 시 히스토리 추가)
    updateURL(type, gender || 'male', 'basic');
    
    // 데이터 로드
    loadBloodTypeData();
    
    // 기본성향 탭 활성화
    setTimeout(() => {
        showTab('basic');
    }, 100);
};

/**
 * 기존 혈액형 선택 함수 (하위 호환성)
 * Enhanced with History API support - Issue 2 Fix
 * 혈액형 변경 시 항상 남성 기본값으로 리셋
 */
window.selectBloodType = function(type) {
    currentBloodType = type;
    
    // 페이지 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 혈액형 그룹 활성화
    activateBloodTypeGroup(type);
    
    // 화면 전환
    switchToDetailView();
    
    // 항상 남성으로 리셋 확실히 보장 (통합 성별 관리 시스템 사용)
    setGenderState('male');
    
    // Fix Issue 2: Update URL with History API (새 혈액형 선택 시 히스토리 추가)
    updateURL(type, 'male', 'basic'); // 남성과 기본성향으로 URL 설정
    
    // 데이터 로드
    loadBloodTypeData();
    
    // 기본성향 탭 활성화 확실히 보장
    setTimeout(() => {
        showTab('basic');
    }, 100);
};

/**
 * 메인 성별 선택 함수 - 모든 성별 변경의 진입점
 */
window.selectGender = function(gender) {
    setGenderState(gender);
};

/**
 * 탭바의 성별 토글 버튼 함수 (♂/♀ 기호 버튼)
 */
window.selectGenderTab = function(gender) {
    setGenderState(gender);
    
    // Update URL if we have a blood type selected (성별 변경은 히스토리 교체)
    if (currentBloodType) {
        const currentTab = getCurrentTab();
        updateURL(currentBloodType, gender, currentTab, true);
    }
};

// ===================================================================
// History API Navigation Support - Issue 2 Fix (Sidebar Version)
// Supports browser back/forward buttons and deep linking
// URL format: #/blood-type/A/female or #/blood-type/B/male/compatibility
// ===================================================================

// 중복 함수 제거됨 - Line 862의 개선된 updateURL 함수 사용

function parseURLHash() {
    const hash = window.location.hash.substring(1); // Remove #
    if (!hash || hash === '/') {
        return { view: 'home' };
    }
    
    const parts = hash.split('/').filter(part => part !== '');
    
    if (parts.length >= 2 && parts[0] === 'blood-type') {
        const bloodType = parts[1];
        const gender = parts[2] || 'male';
        const tab = parts[3] || 'basic';
        
        // Validate blood type
        if (['A', 'B', 'O', 'AB'].includes(bloodType)) {
            return {
                view: 'detail',
                bloodType: bloodType,
                gender: gender === 'female' ? 'female' : 'male',
                tab: tab
            };
        }
    }
    
    return { view: 'home' };
}

function restoreStateFromURL() {
    const state = parseURLHash();
    
    if (state.view === 'home') {
        // Reset to home state
        resetToHome();
        return;
    }
    
    if (state.view === 'detail' && state.bloodType) {
        // Restore blood type and gender selection
        currentBloodType = state.bloodType;
        currentGender = state.gender;
        
        // Set gender state using the centralized system
        setGenderState(state.gender);
        
        // Activate blood type group
        activateBloodTypeGroup(state.bloodType);
        
        // Switch to detail view
        switchToDetailView();
        
        // Load data
        loadBloodTypeData();
        
        // Switch to correct tab if specified
        if (state.tab && state.tab !== 'basic') {
            setTimeout(() => {
                const tabBtn = document.querySelector(`.tab-btn[onclick*="${state.tab}"]`);
                if (tabBtn) {
                    tabBtn.click();
                }
            }, 100);
        }
    }
}

function getCurrentTab() {
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (!activeTabBtn) return 'basic';
    
    const onclickAttr = activeTabBtn.getAttribute('onclick');
    if (onclickAttr) {
        const match = onclickAttr.match(/showTab\('([^']+)'\)/);
        if (match) {
            return match[1];
        }
    }
    
    return 'basic';
}

// ===================================================================
// 헬퍼 함수들
// ===================================================================

/**
 * 혈액형 그룹 활성화
 */
function activateBloodTypeGroup(type) {
    // 모든 혈액형 그룹 비활성화
    document.querySelectorAll('.blood-type-group').forEach(group => {
        group.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item-compact').forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택된 혈액형 그룹 활성화
    const activeGroup = document.querySelector(`.blood-type-group[data-blood="${type}"]`);
    if (activeGroup) {
        activeGroup.classList.add('active');
    }
    
    const activeItem = document.querySelector(`.blood-type-item[data-blood="${type}"] .nav-item-compact`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

/**
 * 상세보기 화면으로 전환
 */
function switchToDetailView() {
    document.getElementById('overview-section').style.display = 'none';
    document.getElementById('detail-section').style.display = 'block';
}

/**
 * 홈 화면으로 리셋 (Enhanced with History API)
 */
window.resetToHome = function() {
    currentBloodType = null;
    currentGender = 'male'; // Reset to default
    
    // 모든 활성화 상태 제거
    document.querySelectorAll('.blood-type-group, .nav-item-compact').forEach(element => {
        element.classList.remove('active');
    });
    
    document.querySelectorAll('.gender-btn-compact, .gender-btn-new').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset gender to male and sync all buttons
    setGenderState('male');
    
    // 화면 전환
    const overviewSection = document.getElementById('overview-section');
    const detailSection = document.getElementById('detail-section');
    
    if (overviewSection && detailSection) {
        overviewSection.style.display = 'grid';
        overviewSection.style.gridTemplateColumns = 'repeat(4, 1fr)';
        overviewSection.style.gap = '20px';
        detailSection.style.display = 'none';
    }
    
    // Update URL to home state (홈 리셋은 히스토리 교체)
    updateURL(null, null, null, true);
};

window.showTab = function(tabName, sourceEvent) {
    // 탭 버튼과 패널 초기화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // event 객체 안전하게 처리
    if (sourceEvent && sourceEvent.target) {
        // 매개변수로 전달된 이벤트 우선 사용
        sourceEvent.target.classList.add('active');
    } else if (typeof event !== 'undefined' && event && event.target) {
        // 전역 event 객체 확인 (onclick 이벤트용)
        event.target.classList.add('active');
    } else {
        // setTimeout이나 프로그래매틱 호출 시
        const targetBtn = document.querySelector(`.tab-btn[onclick*="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }
    
    // 탭 패널 활성화
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    // Update URL with new tab (탭 전환은 히스토리 교체)
    if (currentBloodType) {
        updateURL(currentBloodType, currentGender, tabName, true);
    }
    
    if (tabName === 'compatibility' && currentBloodType) {
        document.getElementById('myBloodType').value = currentBloodType;
    } else if (tabName === 'biorhythm') {
        loadBiorhythmData();
    }
};

window.showStoryModal = function(type) {
    const modal = document.getElementById('storyModal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const stories = {
        'A': {
            title: 'A형의 숨겨진 이야기',
            content: `
                <div class="story-section">
                    <h3>스티브 잡스와 A형의 완벽주의</h3>
                    <p>애플의 창업자 스티브 잡스는 극도의 완벽주의자로 유명했습니다. 제품의 나사 하나까지 신경 쓰며, 보이지 않는 내부 부품도 아름답게 만들어야 한다고 주장했죠.</p>
                </div>
                
                <div class="story-section">
                    <h3>세종대왕과 A형의 계획성</h3>
                    <p>한글 창제는 수년간의 치밀한 계획과 연구의 결과였습니다. 세종대왕은 집현전 학자들과 함께 체계적으로 언어를 연구하고, 백성을 위한 문자를 만들었습니다.</p>
                </div>
                
                <div class="story-section">
                    <h3>워렌 버핏과 A형의 신중함</h3>
                    <p>"투자의 현인" 워렌 버핏은 철저한 분석과 장기적 관점으로 투자합니다. "남들이 탐욕스러울 때 두려워하고, 남들이 두려워할 때 탐욕스러워하라"는 그의 명언은 A형의 신중함을 보여줍니다.</p>
                </div>
            `
        },
        'B': {
            title: 'B형의 자유로운 영혼',
            content: `
                <div class="story-section">
                    <h3>레오나르도 다빈치와 B형의 창의성</h3>
                    <p>르네상스의 천재 다빈치는 화가, 과학자, 발명가, 해부학자 등 다양한 분야에서 활동했습니다. 헬리콥터, 낙하산 등 시대를 앞선 발명품을 구상했죠.</p>
                </div>
                
                <div class="story-section">
                    <h3>피카소와 B형의 독창성</h3>
                    <p>"훌륭한 예술가는 모방하고, 위대한 예술가는 훔친다." 피카소는 기존 미술의 틀을 깨고 입체파를 창시했습니다. 한 작품에 여러 시점을 담는 혁신적 기법을 개발했죠.</p>
                </div>
                
                <div class="story-section">
                    <h3>잭 마와 B형의 도전정신</h3>
                    <p>알리바바 창업자 잭 마는 영어 교사에서 중국 최고 부자가 되었습니다. 30번이 넘는 취업 실패에도 포기하지 않고, "실패는 포기할 때 시작된다"며 도전을 계속했습니다.</p>
                </div>
            `
        },
        'O': {
            title: 'O형의 리더십 이야기',
            content: `
                <div class="story-section">
                    <h3>나폴레옹과 O형의 카리스마</h3>
                    <p>"불가능이란 단어는 나의 사전에 없다." 나폴레옹은 뛰어난 전략과 카리스마로 프랑스를 유럽 최강국으로 만들었습니다. 병사들과 함께 행군하며 신뢰를 얻었죠.</p>
                </div>
                
                <div class="story-section">
                    <h3>이순신과 O형의 책임감</h3>
                    <p>"죽고자 하면 살 것이고, 살고자 하면 죽을 것이다." 23전 23승의 불패 신화를 이룬 이순신 장군. 절망적 상황에서도 부하들에게 희망을 주는 진정한 리더였습니다.</p>
                </div>
                
                <div class="story-section">
                    <h3>엘론 머스크와 O형의 추진력</h3>
                    <p>테슬라와 스페이스X의 CEO 엘론 머스크는 "인류를 다행성 종족으로 만들겠다"는 목표로 불가능에 도전합니다. 주 100시간 근무하며 꿈을 현실로 만들고 있죠.</p>
                </div>
            `
        },
        'AB': {
            title: 'AB형의 천재적 직관',
            content: `
                <div class="story-section">
                    <h3>아인슈타인과 AB형의 천재성</h3>
                    <p>"상상력은 지식보다 중요하다." 상대성 이론으로 물리학을 혁명한 아인슈타인. 복잡한 우주의 법칙을 E=mc²라는 간단한 공식으로 표현했습니다.</p>
                </div>
                
                <div class="story-section">
                    <h3>반 고흐와 AB형의 예술혼</h3>
                    <p>생전에는 단 한 점의 그림만 팔렸지만, 사후 최고의 화가가 된 반 고흐. "별이 빛나는 밤"은 그의 독특한 시각과 감성을 보여줍니다.</p>
                </div>
                
                <div class="story-section">
                    <h3>오바마와 AB형의 균형감</h3>
                    <p>미국 최초의 흑인 대통령 버락 오바마는 이성과 감성의 균형을 갖춘 리더였습니다. "Yes, We Can"이라는 희망의 메시지로 변화를 이끌었죠.</p>
                </div>
            `
        }
    };
    
    const story = stories[type];
    modalTitle.textContent = story.title;
    modalBody.innerHTML = story.content;
    modal.style.display = 'block';
};

window.closeModal = function() {
    document.getElementById('storyModal').style.display = 'none';
};

window.calculateCompatibility = function() {
    const myType = document.getElementById('myBloodType').value;
    const partnerType = document.getElementById('partnerBloodType').value;
    
    if (!myType || !partnerType) {
        document.getElementById('compatibilityResult').innerHTML = '';
        return;
    }
    
    const result = bloodTypeAPI.getCompatibility(myType, partnerType);
    displayCompatibilityResult(result);
};

async function loadBloodTypeData() {
    if (!currentBloodType) return;
    
    const basicData = await bloodTypeAPI.getBasicTraits(currentBloodType, currentGender);
    displayBasicTraits(basicData);
    
    // 성별 파라미터를 추가하여 카테고리 분석 가져오기
    const loveData = await bloodTypeAPI.getCategoryAnalysis(currentBloodType, 'love', currentGender);
    displayCategoryData('love', loveData);
    
    const healthData = await bloodTypeAPI.getCategoryAnalysis(currentBloodType, 'health', currentGender);
    displayCategoryData('health', healthData);
    
    const wealthData = await bloodTypeAPI.getCategoryAnalysis(currentBloodType, 'wealth', currentGender);
    displayCategoryData('wealth', wealthData);
}

function displayBasicTraits(data) {
    const panel = document.getElementById('basic-panel');
    
    panel.innerHTML = `
        <div class="trait-content">
            <h3>${currentBloodType}형 ${currentGender === 'male' ? '남성' : '여성'}의 성격</h3>
            <p style="margin: 20px 0; line-height: 1.8;">${data.overall}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div>
                    <h4 style="color: var(--blood-accent); margin-bottom: 10px;">장점</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${data.strengths.map(s => `<li style="padding: 5px 0;">✓ ${s}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--blood-accent); margin-bottom: 10px;">약점</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${data.weaknesses.map(w => `<li style="padding: 5px 0;">• ${w}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: var(--blood-bg-primary); border-radius: 10px;">
                <h4 style="margin-bottom: 15px;">같은 ${currentBloodType}형 유명인</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${data.famousPeople.map(p => `
                        <span style="padding: 8px 15px; background: white; border-radius: 20px; font-size: 0.95rem;">
                            ${p}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function displayCategoryData(category, data) {
    const panel = document.getElementById(`${category}-panel`);
    const categoryNames = {
        love: '애정운',
        health: '건강운',
        wealth: '재물운'
    };
    
    const categoryColors = {
        love: '#e91e63',
        health: '#4caf50',
        wealth: '#ff9800'
    };
    
    panel.innerHTML = `
        <div class="category-content">
            <h3>${currentBloodType}형의 ${categoryNames[category]}</h3>
            
            <div style="text-align: center; margin: 30px 0;">
                <div style="position: relative; display: inline-block;">
                    <svg width="150" height="150">
                        <circle cx="75" cy="75" r="70" fill="none" stroke="#e0e0e0" stroke-width="10"/>
                        <circle cx="75" cy="75" r="70" fill="none" 
                                stroke="${categoryColors[category]}" 
                                stroke-width="10"
                                stroke-dasharray="${data.score * 4.4} 440"
                                stroke-dashoffset="0"
                                transform="rotate(-90 75 75)"
                                style="transition: stroke-dasharray 1s ease;"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.5rem; font-weight: 700; color: ${categoryColors[category]};">
                        ${data.score}
                    </div>
                </div>
            </div>
            
            <p style="margin: 20px 0; line-height: 1.8; color: var(--blood-text-secondary);">
                ${data.description}
            </p>
            
            <div style="padding: 20px; background: var(--blood-bg-primary); border-radius: 10px; margin: 20px 0;">
                <h4 style="color: ${categoryColors[category]}; margin-bottom: 10px;">조언</h4>
                <p>${data.advice}</p>
            </div>
            
            <div style="margin-top: 20px;">
                <span style="font-weight: 600; margin-right: 10px;">행운 아이템:</span>
                ${data.luckyItems.map(item => `
                    <span style="padding: 6px 12px; background: ${categoryColors[category]}; color: white; border-radius: 15px; margin: 0 5px; font-size: 0.9rem;">
                        ${item}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function displayCompatibilityResult(data) {
    const resultDiv = document.getElementById('compatibilityResult');
    resultDiv.innerHTML = `
        <div style="background: var(--blood-bg-primary); border-radius: 10px; padding: 20px; text-align: center;">
            <h4>궁합 점수</h4>
            <div style="font-size: 3rem; font-weight: 800; color: var(--blood-accent); margin: 10px 0;">${data.score}점</div>
            <div style="width: 100%; height: 20px; background: var(--blood-border); border-radius: 10px; overflow: hidden; margin: 20px 0;">
                <div style="height: 100%; background: linear-gradient(90deg, var(--blood-type-a), var(--blood-type-o)); width: ${data.score}%; transition: width 1s ease;"></div>
            </div>
            <p style="margin: 20px 0; line-height: 1.6;">${data.description}</p>
            <div style="padding: 15px; background: white; border-radius: 10px; margin-top: 20px;">
                <h5 style="color: var(--blood-accent); margin-bottom: 10px;">관계 개선 팁</h5>
                <p>${data.tips}</p>
            </div>
        </div>
    `;
}

// ===================================================================
// 초기화 및 이벤트 리스너
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    // 모달 클릭 이벤트 처리
    window.onclick = function(event) {
        const modal = document.getElementById('storyModal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // 모바일 환경에서 네비게이션 자동 축소
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.blood-nav');
        if (nav) {
            nav.classList.add('collapsed');
        }
    }
    
    // localStorage에서 성별 상태 복원
    const savedGender = localStorage.getItem('selectedGender') || 'male';
    
    // 초기 성별 설정 (통합 시스템 사용)
    setGenderState(savedGender);
    
    console.log('통합 성별 관리 시스템 초기화 완료');
});

// ===================================================================
// 디버그 함수들 (개발용)
// ===================================================================

if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    window.debugGenderSystem = function() {
        console.log('=== 성별 시스템 디버그 정보 ===');
        console.log('현재 성별:', currentGender);
        console.log('현재 혈액형:', currentBloodType);
        
        const genderButtons = {
            'gender-btn': document.querySelectorAll('.gender-btn').length,
            'gender-btn-new': document.querySelectorAll('.gender-btn-new').length,
            'gender-tab-btn': document.querySelectorAll('.gender-tab-btn').length,
            'gender-btn-compact': document.querySelectorAll('.gender-btn-compact').length,
            'gender-btn-mini': document.querySelectorAll('.gender-btn-mini').length
        };
        
        console.log('성별 버튼 수:', genderButtons);
        
        const activeButtons = document.querySelectorAll('[class*="gender-btn"].active').length;
        console.log('활성화된 성별 버튼 수:', activeButtons);
    };
}

window.loadBiorhythmData = async function() {
    if (!currentBloodType || !currentGender) return;
    
    try {
        let biorhythmAPI;
        if (typeof BloodBiorhythmAPI !== 'undefined') {
            biorhythmAPI = new BloodBiorhythmAPI();
        } else {
            console.warn('바이오리듬 API를 찾을 수 없습니다. 기본 데이터를 사용합니다.');
            displayDefaultBiorhythm();
            return;
        }
        
        const today = new Date();
        const biorhythmData = await biorhythmAPI.calculateBiorhythm(currentBloodType, currentGender, today);
        
        // 차트 업데이트
        updateBiorhythmCharts(biorhythmData);
        
        // 운세 메시지 업데이트
        const fortuneData = await biorhythmAPI.getDailyFortune(currentBloodType, today);
        updateFortuneMessage(fortuneData);
        
    } catch (error) {
        console.error('바이오리듬 데이터 로드 실패:', error);
        displayDefaultBiorhythm();
    }
};

function updateBiorhythmCharts(data) {
    // 신체 리듬 차트 업데이트
    updateCircleChart('physical', data.physical || 75);
    
    // 감정 리듬 차트 업데이트
    updateCircleChart('emotional', data.emotional || 82);
    
    // 지성 리듬 차트 업데이트
    updateCircleChart('intellectual', data.intellectual || 68);
}

function updateCircleChart(type, score) {
    const progressCircle = document.getElementById(`${type}-progress`);
    const scoreText = document.getElementById(`${type}-score`);
    const description = document.getElementById(`${type}-desc`);
    
    if (progressCircle && scoreText) {
        // 원형 차트 애니메이션 (314.16은 2πr, r=50)
        const dashOffset = 314.16 * (1 - score / 100);
        progressCircle.style.strokeDashoffset = dashOffset;
        
        scoreText.textContent = score;
        
        // 설명 텍스트 업데이트
        const descriptions = {
            physical: score >= 80 ? '활기찬 컨디션' : score >= 60 ? '보통 컨디션' : '휴식이 필요',
            emotional: score >= 80 ? '긍정적 감정' : score >= 60 ? '균형잡힌 상태' : '감정 관리 필요',
            intellectual: score >= 80 ? '최고의 집중력' : score >= 60 ? '적당한 집중력' : '머리를 식힐 시간'
        };
        
        if (description) {
            description.textContent = descriptions[type];
        }
    }
}

// 색상 매핑 테이블 (한국어 색상명 -> hex 코드)
const colorMapping = {
    '빨강': '#dc3545',
    '빨간색': '#dc3545',
    '파랑': '#0066cc',
    '파란색': '#0066cc',
    '노랑': '#ffc107',
    '노란색': '#ffc107',
    '초록': '#28a745',
    '초록색': '#28a745',
    '보라': '#6f42c1',
    '보라색': '#6f42c1',
    '주황': '#fd7e14',
    '주황색': '#fd7e14',
    '분홍': '#e83e8c',
    '분홍색': '#e83e8c',
    '하늘색': '#87CEEB',
    '갈색': '#795548',
    '흰색': '#f8f9fa',
    '검정': '#212529',
    '검정색': '#212529'
};

// 행운의 색상 원형 업데이트 함수
window.updateLuckyColorDisplay = function(colorName) {
    const colorCircle = document.getElementById('lucky-color-circle');
    const colorText = document.getElementById('lucky-color');
    
    if (colorCircle && colorText) {
        const hexColor = colorMapping[colorName] || '#cccccc';
        colorCircle.style.background = hexColor;
        colorText.textContent = colorName;
    }
};

function updateFortuneMessage(data) {
    const fortuneMessage = document.getElementById('fortune-message');
    const adviceMessage = document.getElementById('advice-message');
    const luckyColor = document.getElementById('lucky-color');
    const luckyNumber = document.getElementById('lucky-number');
    
    if (data) {
        if (fortuneMessage) fortuneMessage.textContent = data.message || '오늘도 좋은 하루 되세요!';
        if (adviceMessage) adviceMessage.textContent = data.advice || '당신의 바이오리듬에 맞게 하루를 보내세요.';
        if (luckyColor) {
            const colorName = data.luckyColor || '파란색';
            luckyColor.textContent = colorName;
            // 색상 원형 업데이트
            window.updateLuckyColorDisplay(colorName);
        }
        if (luckyNumber) luckyNumber.textContent = data.luckyNumber || '7';
    }
}

function displayDefaultBiorhythm() {
    // 기본 바이오리듬 데이터 표시
    updateBiorhythmCharts({
        physical: Math.floor(Math.random() * 30) + 60,
        emotional: Math.floor(Math.random() * 30) + 65, 
        intellectual: Math.floor(Math.random() * 30) + 55
    });
    
    const defaultMessages = {
        A: { message: '완벽주의 성향이 강한 A형, 오늘은 계획적으로 일을 진행하세요.', advice: '너무 완벽을 추구하지 말고 여유를 가지세요.', luckyColor: '하늘색', luckyNumber: '7' },
        B: { message: '자유로운 B형, 창의적인 아이디어가 떠오르는 날입니다.', advice: '직감을 믿고 새로운 도전을 해보세요.', luckyColor: '주황색', luckyNumber: '3' },
        O: { message: '리더십이 빛나는 O형, 적극적으로 나서는 것이 좋겠습니다.', advice: '팀워크를 발휘하면 더 큰 성과를 얻을 수 있습니다.', luckyColor: '빨간색', luckyNumber: '1' },
        AB: { message: '독특한 AB형, 남다른 시각으로 문제를 해결하세요.', advice: '복잡한 상황을 차분히 정리해보세요.', luckyColor: '보라색', luckyNumber: '9' }
    };
    
    const message = defaultMessages[currentBloodType] || defaultMessages.A;
    updateFortuneMessage(message);
}

// ===================================================================
// History API Navigation Support (Issue 2 Fix: Browser Back Button)
// ===================================================================

/**
 * URL 업데이트 함수 - History API 사용
 * @param {string|null} bloodType - 혈액형 (A, B, O, AB)
 * @param {string|null} gender - 성별 (male, female)  
 * @param {string|null} tab - 탭명 (basic, love, health, wealth, biorhythm, compatibility)
 * @param {boolean} replace - true: replaceState 사용, false: pushState 사용 (기본값)
 */
function updateURL(bloodType = null, gender = null, tab = null, replace = false) {
    let newHash = '#';
    let newTitle = '혈액형 성격 테스트 - RHEIGHT';
    
    if (bloodType && gender) {
        newHash = `#/blood-type/${bloodType}/${gender}`;
        newTitle = `${bloodType}형 ${gender === 'male' ? '남성' : '여성'} - 혈액형 테스트`;
        
        if (tab && tab !== 'basic') {
            newHash += `/${tab}`;
            const tabNames = {
                'love': '애정운',
                'health': '건강운',
                'wealth': '재물운',
                'biorhythm': '바이오리듬',
                'compatibility': '궁합'
            };
            newTitle = `${bloodType}형 ${gender === 'male' ? '남성' : '여성'} ${tabNames[tab] || tab} - 혈액형 테스트`;
        }
    }
    
    // 상황에 따라 pushState 또는 replaceState 사용
    const stateData = {
        view: bloodType ? 'detail' : 'overview',
        bloodType: bloodType,
        gender: gender,
        tab: tab || 'basic'
    };
    
    if (replace) {
        // 히스토리 교체: 뒤로가기 스택에 쌓이지 않음
        history.replaceState(stateData, newTitle, newHash);
    } else {
        // 히스토리 추가: 뒤로가기 가능
        history.pushState(stateData, newTitle, newHash);
    }
    
    // Update document title
    document.title = newTitle;
}

/**
 * URL 해시 파싱 함수
 */
function parseURLHash() {
    const hash = window.location.hash.slice(1); // Remove '#'
    
    if (!hash || hash === '/') {
        return { view: 'overview' };
    }
    
    // Parse format: /blood-type/A/female/love
    const parts = hash.split('/').filter(p => p);
    
    if (parts[0] === 'blood-type' && parts.length >= 3) {
        return {
            view: 'detail',
            bloodType: parts[1],
            gender: parts[2],
            tab: parts[3] || 'basic'
        };
    }
    
    return { view: 'overview' };
}

/**
 * URL 상태에서 UI 복원
 */
function restoreStateFromURL() {
    const state = parseURLHash();
    
    if (state.view === 'detail' && state.bloodType && state.gender) {
        // Set current values
        currentBloodType = state.bloodType;
        currentGender = state.gender;
        
        // Activate blood type group
        activateBloodTypeGroup(state.bloodType);
        
        // Set gender state
        setGenderState(state.gender);
        
        // Switch to detail view
        switchToDetailView();
        
        // Load data
        loadBloodTypeData();
        
        // Show appropriate tab
        if (state.tab && state.tab !== 'basic') {
            showTab(state.tab);
        }
    } else {
        // Return to overview
        resetToHome();
    }
}

// ===================================================================
// 시스템 초기화 및 검증 함수들
// ===================================================================

/**
 * 성별 시스템 유효성 검사
 */
window.validateGenderSystem = function() {
    const requiredSelectors = [
        { selector: '.gender-btn', name: '사이드바 성별 버튼' },
        { selector: '.gender-btn-new', name: '개별 혈액형 성별 버튼' },
        { selector: '.gender-tab-btn', name: '탭 영역 성별 토글 버튼' }
    ];
    
    const issues = [];
    const results = [];
    
    requiredSelectors.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        if (elements.length === 0) {
            issues.push(`❌ ${item.name} (${item.selector}): 요소 없음`);
        } else {
            results.push(`✅ ${item.name}: ${elements.length}개 요소 발견`);
        }
    });
    
    console.log('=== 성별 시스템 검증 결과 ===');
    results.forEach(result => console.log(result));
    issues.forEach(issue => console.log(issue));
    
    if (issues.length === 0) {
        console.log('🎉 모든 성별 버튼이 정상적으로 로드됨');
        return true;
    } else {
        console.log(`⚠️ ${issues.length}개의 문제 발견`);
        return false;
    }
};

/**
 * 성별 동기화 상태 체크
 */
window.checkGenderSync = function() {
    const currentStoredGender = localStorage.getItem('selectedGender') || 'male';
    
    console.log('=== 성별 동기화 상태 ===');
    console.log('현재 메모리 성별:', currentGender);
    console.log('저장된 성별:', currentStoredGender);
    
    // 모든 성별 버튼의 상태 체크
    const allButtons = {
        sidebar: document.querySelectorAll('.gender-btn'),
        individual: document.querySelectorAll('.gender-btn-new'),
        tab: document.querySelectorAll('.gender-tab-btn')
    };
    
    Object.entries(allButtons).forEach(([type, buttons]) => {
        console.log(`${type} 버튼:`, buttons.length + '개');
        buttons.forEach((btn, idx) => {
            const isActive = btn.classList.contains('active');
            console.log(`  [${idx}] active: ${isActive}, id: ${btn.id || 'N/A'}`);
        });
    });
    
    return currentGender === currentStoredGender;
};

/**
 * 페이지 로드 시 초기화
 */
function initializeGenderSystem() {
    // localStorage에서 이전 성별 설정 복원
    const savedGender = localStorage.getItem('selectedGender');
    if (savedGender && (savedGender === 'male' || savedGender === 'female')) {
        currentGender = savedGender;
        syncAllGenderButtons(savedGender);
        updateGenderTraits(savedGender);
    }
    
    // 개발 모드에서 시스템 검증
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            console.log('🔧 개발 모드 - 성별 시스템 자동 검증');
            validateGenderSystem();
        }, 1000);
    }
}

// 페이지 로드 완료 시 초기화 실행
document.addEventListener('DOMContentLoaded', initializeGenderSystem);

// Browser navigation event handlers for History API
window.addEventListener('popstate', function(event) {
    // Handle browser back/forward buttons
    restoreStateFromURL();
});

// Initialize History API navigation
document.addEventListener('DOMContentLoaded', function() {
    // Restore state from URL hash on page load
    setTimeout(() => {
        restoreStateFromURL();
        
        // If no hash state, ensure we're in clean initial state
        if (!window.location.hash || window.location.hash === '#') {
            updateURL(null, null, null, true); // replaceState 사용으로 초기 로드 상태 설정
        }
    }, 100); // Small delay to ensure DOM is fully loaded
});

// 디버그용 전역 함수
window.debugGenderSystem = function() {
    console.clear();
    console.log('=== 혈액형 시스템 디버그 모드 ===');
    validateGenderSystem();
    checkGenderSync();
    console.log('현재 혈액형:', currentBloodType);
    console.log('사용 가능한 디버그 함수:');
    console.log('- validateGenderSystem(): 시스템 유효성 검사');
    console.log('- checkGenderSync(): 성별 동기화 상태 확인');  
    console.log('- setGenderState("male|female"): 성별 강제 변경');
    console.log('- testBloodTypeGenderLogic(): 혈액형-성별 로직 테스트');
};

/**
 * 혈액형-성별 로직 테스트 함수
 */
window.testBloodTypeGenderLogic = function() {
    console.log('=== 혈액형-성별 로직 테스트 시작 ===');
    
    // 테스트 1: 새 혈액형 선택 시 남성 리셋
    console.log('테스트 1: A형 선택 (남성 리셋 확인)');
    selectBloodType('A');
    console.log('결과 - 혈액형:', currentBloodType, '성별:', currentGender);
    
    // 테스트 2: 같은 혈액형에서 성별만 변경
    console.log('테스트 2: A형에서 여성으로 성별 변경');
    selectBloodTypeAndGender('A', 'female');
    console.log('결과 - 혈액형:', currentBloodType, '성별:', currentGender);
    
    // 테스트 3: 다른 혈액형 선택 시 남성 리셋 확인
    console.log('테스트 3: B형 선택 (남성 리셋 확인)');
    selectBloodTypeAndGender('B', 'female'); // female로 전달했지만 남성으로 리셋되어야 함
    console.log('결과 - 혈액형:', currentBloodType, '성별:', currentGender);
    
    console.log('=== 테스트 완료 ===');
};