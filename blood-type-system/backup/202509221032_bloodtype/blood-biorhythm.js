/**
 * 혈액형 바이오리듬 운세 웹 인터페이스 스크립트
 * 
 * CLAUDE.md 규칙 준수:
 * - 모든 함수는 window 객체에 등록
 * - 이모지 사용 금지
 * - 한국어 자연스럽게 처리
 */

let currentBloodType = null;
let currentGender = null;
let currentDate = new Date();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 오늘 날짜로 초기 설정
    const today = new Date();
    document.getElementById('selectedDate').value = today.toISOString().split('T')[0];
    currentDate = today;
    
    // 키보드 네비게이션 설정
    setupKeyboardNavigation();
    
    // API 로딩 대기
    setTimeout(() => {
        if (window.bloodBiorhythmAPI) {
            console.log('바이오리듬 API 로딩 완료');
        } else {
            showError('API 로딩에 실패했습니다.');
        }
    }, 1000);
});

/**
 * 혈액형과 성별 선택 처리 (새로운 통합 함수)
 * @param {string} bloodType - 선택된 혈액형
 * @param {string} gender - 선택된 성별 (male/female)
 */
window.selectBloodGender = function(bloodType, gender) {
    // 기존 active 클래스 제거
    document.querySelectorAll('.blood-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 버튼에 active 클래스 추가
    const selectedBtn = document.querySelector(`.blood-type-btn.type-${bloodType}.${gender}`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        selectedBtn.focus();
    }
    
    currentBloodType = bloodType;
    currentGender = gender;
    
    // 선택 완료 토스트 메시지
    const genderText = gender === 'male' ? '남성' : '여성';
    showToastMessage(`${bloodType}형 ${genderText}을 선택했습니다.`);
    
    updateFortune();
};

/**
 * 혈액형 선택 처리 (하위 호환성을 위한 레거시 함수)
 * @param {string} bloodType - 선택된 혈액형
 */
window.selectBloodType = function(bloodType) {
    // 기본적으로 남성으로 설정하여 하위 호환성 유지
    selectBloodGender(bloodType, 'male');
};

/**
 * 운세 업데이트
 */
window.updateFortune = function() {
    if (!currentBloodType || !currentGender) {
        alert('혈액형과 성별을 먼저 선택해 주세요.');
        return;
    }
    
    const dateInput = document.getElementById('selectedDate');
    if (dateInput.value) {
        currentDate = new Date(dateInput.value);
    }
    
    showLoading(true);
    
    // 현재 활성 탭에 따라 데이터 업데이트
    const activeTab = document.querySelector('.tab-btn.active').textContent;
    
    if (activeTab.includes('오늘의 운세')) {
        updateDailyFortune();
    } else if (activeTab.includes('주간 트렌드')) {
        updateWeeklyTrend();
    } else if (activeTab.includes('월간 개요')) {
        updateMonthlyOverview();
    }
};

/**
 * 일일 운세 업데이트
 */
async function updateDailyFortune() {
    try {
        if (!window.bloodBiorhythmAPI) {
            throw new Error('API가 로딩되지 않았습니다');
        }
        
        const fortune = await window.bloodBiorhythmAPI.getBiorhythmFortune(currentBloodType, currentDate, currentGender);
        
        // 바이오리듬 점수 업데이트
        updateBiorhythmScores(fortune.biorhythm);
        
        // 운세 메시지 업데이트
        updateFortuneMessages(fortune);
        
        // 행운 정보 업데이트
        updateLuckyInfo(fortune.lucky);
        
        // 유명인물 명언 업데이트
        updateFamousQuote(fortune.famous_figure);
        
        showLoading(false);
        
    } catch (error) {
        console.error('운세 데이터 로딩 실패:', error);
        showError('운세 데이터를 불러오는데 실패했습니다.');
        showLoading(false);
    }
}

/**
 * 바이오리듬 점수 원형 차트 업데이트
 * @param {Object} biorhythm - 바이오리듬 데이터
 */
function updateBiorhythmScores(biorhythm) {
    const scoreTypes = ['physical', 'emotional', 'intellectual'];
    const labels = { physical: '신체', emotional: '감정', intellectual: '지성' };
    
    scoreTypes.forEach(type => {
        const score = biorhythm[type];
        const scoreElement = document.getElementById(`${type}-score`);
        const progressElement = document.getElementById(`${type}-progress`);
        const statusElement = document.getElementById(`${type}-status`);
        
        // 점수 표시
        scoreElement.textContent = Math.round(score);
        
        // 원형 프로그레스바 업데이트 (원의 둘레는 약 220)
        const circumference = 220;
        const progress = (score / 100) * circumference;
        progressElement.style.strokeDasharray = `${progress} ${circumference}`;
        
        // 상태 메시지
        let status = '보통';
        if (score >= 80) status = '매우 좋음';
        else if (score >= 60) status = '좋음';
        else if (score >= 40) status = '보통';
        else if (score >= 20) status = '주의';
        else status = '휴식 필요';
        
        statusElement.textContent = status;
    });
}

/**
 * 운세 메시지 업데이트
 * @param {Object} fortune - 운세 데이터
 */
function updateFortuneMessages(fortune) {
    document.getElementById('overall-fortune').textContent = fortune.fortune.overall || '운세 정보를 불러오는 중입니다.';
    document.getElementById('health-fortune').textContent = fortune.fortune.health || '-';
    document.getElementById('emotion-fortune').textContent = fortune.fortune.emotion || '-';
    document.getElementById('wisdom-fortune').textContent = fortune.fortune.wisdom || '-';
}

/**
 * 행운 정보 업데이트
 * @param {Object} lucky - 행운 정보
 */
function updateLuckyInfo(lucky) {
    document.getElementById('lucky-item').textContent = `행운 아이템: ${lucky.item || '-'}`;
    document.getElementById('lucky-color').textContent = `행운 색상: ${lucky.color || '-'}`;
}

/**
 * 유명인물 명언 업데이트
 * @param {Object} famousFigure - 유명인물 정보
 */
function updateFamousQuote(famousFigure) {
    document.getElementById('famous-name').textContent = famousFigure.name || '유명인물';
    document.getElementById('famous-quote').textContent = famousFigure.quote || '지혜로운 한마디';
}

/**
 * 주간 트렌드 업데이트
 */
async function updateWeeklyTrend() {
    try {
        if (!window.bloodBiorhythmAPI) {
            throw new Error('API가 로딩되지 않았습니다');
        }
        
        const weeklyData = window.bloodBiorhythmAPI.getWeeklyBiorhythm(currentBloodType, currentDate, currentGender);
        const weeklyChart = document.getElementById('weekly-chart');
        
        weeklyChart.innerHTML = '';
        
        weeklyData.forEach((dayData, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = 'weekly-item';
            
            // 오늘 날짜 하이라이트
            const today = new Date().toISOString().split('T')[0];
            if (dayData.date === today) {
                dayElement.classList.add('today');
            }
            
            const avg = dayData.biorhythm.average;
            let trendIcon = '';
            if (avg >= 70) trendIcon = '↗';
            else if (avg >= 50) trendIcon = '→';
            else trendIcon = '↘';
            
            dayElement.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 5px;">${dayData.dayName}</div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">${dayData.date.split('-').slice(1).join('/')}</div>
                <div style="font-size: 1.5rem; margin-bottom: 5px;">${trendIcon}</div>
                <div style="font-size: 0.9rem;">${Math.round(avg)}점</div>
                <div style="font-size: 0.8rem; margin-top: 3px; opacity: 0.8;">${dayData.biorhythm.pattern}</div>
            `;
            
            weeklyChart.appendChild(dayElement);
        });
        
        showLoading(false);
        
    } catch (error) {
        console.error('주간 데이터 로딩 실패:', error);
        showError('주간 트렌드 데이터를 불러오는데 실패했습니다.');
        showLoading(false);
    }
}

/**
 * 월간 개요 업데이트
 */
async function updateMonthlyOverview() {
    try {
        if (!window.bloodBiorhythmAPI) {
            throw new Error('API가 로딩되지 않았습니다');
        }
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const monthlyData = window.bloodBiorhythmAPI.getMonthlyBiorhythm(currentBloodType, year, month, currentGender);
        
        const monthlyContent = document.getElementById('monthly-content');
        
        monthlyContent.innerHTML = `
            <div style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                <div class="fortune-section">
                    <h4>${month}월 평균 바이오리듬</h4>
                    <p>신체: ${monthlyData.averages.physical}점</p>
                    <p>감정: ${monthlyData.averages.emotional}점</p>
                    <p>지성: ${monthlyData.averages.intellectual}점</p>
                </div>
                
                <div class="fortune-section">
                    <h4>이달의 베스트 데이</h4>
                    <p><strong>${month}월 ${monthlyData.bestDay.day}일</strong></p>
                    <p>종합 점수: ${Math.round(monthlyData.bestDay.score)}점</p>
                    <p style="color: #059669; font-weight: 600;">최상의 컨디션을 기대할 수 있는 날입니다!</p>
                </div>
                
                <div class="fortune-section">
                    <h4>주의가 필요한 날</h4>
                    <p><strong>${month}월 ${monthlyData.worstDay.day}일</strong></p>
                    <p>종합 점수: ${Math.round(monthlyData.worstDay.score)}점</p>
                    <p style="color: #dc2626; font-weight: 600;">충분한 휴식과 자기관리가 필요합니다.</p>
                </div>
                
                <div class="fortune-section">
                    <h4>월간 조언</h4>
                    <p>${getMonthlyAdvice(monthlyData, currentBloodType)}</p>
                </div>
            </div>
        `;
        
        showLoading(false);
        
    } catch (error) {
        console.error('월간 데이터 로딩 실패:', error);
        showError('월간 개요 데이터를 불러오는데 실패했습니다.');
        showLoading(false);
    }
}

/**
 * 월간 조언 생성
 * @param {Object} monthlyData - 월간 데이터
 * @param {string} bloodType - 혈액형
 * @returns {string} 조언 메시지
 */
function getMonthlyAdvice(monthlyData, bloodType) {
    const avgTotal = (monthlyData.averages.physical + monthlyData.averages.emotional + monthlyData.averages.intellectual) / 3;
    
    const bloodTypeAdvice = {
        'A': {
            high: '완벽주의적 성향을 활용해 체계적으로 목표를 달성해보세요.',
            mid: '계획적으로 접근하되 융통성도 발휘하는 것이 중요합니다.',
            low: '너무 자신을 몰아세우지 말고 적당한 휴식을 취하세요.'
        },
        'B': {
            high: '창의적 아이디어가 샘솟는 시기입니다. 새로운 도전을 시작해보세요.',
            mid: '다양한 활동을 시도하되 하나씩 완성해나가는 끈기를 발휘하세요.',
            low: '에너지를 분산시키지 말고 중요한 일에 집중하는 시간을 가지세요.'
        },
        'O': {
            high: '리더십을 발휘할 절호의 기회입니다. 적극적으로 나서보세요.',
            mid: '목표 달성을 위해 꾸준히 노력하되 주변과의 조화도 고려하세요.',
            low: '무리한 추진보다는 재충전과 계획 수립에 시간을 투자하세요.'
        },
        'AB': {
            high: '균형잡힌 판단력으로 복잡한 문제들을 해결할 수 있는 시기입니다.',
            mid: '다양한 관점을 활용해 신중하게 결정을 내리는 것이 좋겠습니다.',
            low: '너무 많은 것을 고민하지 말고 단순하게 접근해보세요.'
        }
    };
    
    const advice = bloodTypeAdvice[bloodType] || bloodTypeAdvice['O'];
    
    if (avgTotal >= 70) return advice.high;
    if (avgTotal >= 50) return advice.mid;
    return advice.low;
}

/**
 * 탭 전환
 * @param {string} tabName - 탭 이름
 */
window.showTab = function(tabName, sourceEvent) {
    // 모든 탭 버튼과 컨텐츠 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화 (매개변수 이벤트 우선, 없으면 텍스트 검색)
    let selectedBtn = null;
    
    if (sourceEvent && sourceEvent.target) {
        selectedBtn = sourceEvent.target;
    } else if (typeof event !== 'undefined' && event && event.target) {
        selectedBtn = event.target;
    } else {
        // 대체 방법: 탭명으로 버튼 찾기
        selectedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
            btn.textContent.includes(tabName === 'daily' ? '오늘의 운세' : 
                                    tabName === 'weekly' ? '주간 트렌드' : '월간 개요')
        );
    }
    
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // 데이터 업데이트
    if (currentBloodType && currentGender) {
        updateFortune();
    }
};

/**
 * 로딩 상태 표시/숨김
 * @param {boolean} show - 표시 여부
 */
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    if (show) {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
    } else {
        loadingElement.style.display = 'none';
    }
}

/**
 * 에러 메시지 표시
 * @param {string} message - 에러 메시지
 */
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';
}

/**
 * 토스트 메시지 표시
 * @param {string} message - 메시지 내용
 */
window.showToastMessage = function(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1f2937;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // 애니메이션 CSS 추가
    if (!document.querySelector('#toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// 유틸리티 함수들
window.formatDate = function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

window.getDayName = function(date) {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[date.getDay()];
};

/**
 * 키보드 네비게이션 설정
 */
function setupKeyboardNavigation() {
    const buttons = document.querySelectorAll('.blood-type-btn');
    let currentIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (document.activeElement && document.activeElement.classList.contains('blood-type-btn')) {
            const currentButton = document.activeElement;
            const allButtons = Array.from(buttons);
            currentIndex = allButtons.indexOf(currentButton);
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % allButtons.length;
                    allButtons[currentIndex].focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + allButtons.length) % allButtons.length;
                    allButtons[currentIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    currentButton.click();
                    break;
                case 'Escape':
                    currentButton.blur();
                    break;
            }
        }
    });
    
    // 첫 번째 버튼에 초기 포커스 가능하도록 설정
    if (buttons.length > 0) {
        buttons[0].tabIndex = 0;
    }
}

// 초기화 함수
window.initBiorhythmSystem = function() {
    console.log('바이오리듬 시스템 초기화 완료');
    showToastMessage('바이오리듬 운세 시스템에 오신 것을 환영합니다!');
};