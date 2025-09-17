/**
 * 별자리 운세 메인 JavaScript
 */

// 전역 변수
// zodiacAPI는 zodiac-api-real.js에서 이미 선언됨
let currentZodiacId = null;

// zodiacDescriptions를 window에 먼저 등록 (함수들이 사용하기 전에)
// null 대신 빈 객체로 초기화하여 typeof 체크 문제 방지
window.zodiacDescriptions = {}; // 나중에 실제 데이터로 채워짐

// 한국어 조사 보호 전역 함수 - 명사와 조사를 붙여서 줄바꿈 방지
window.protectKoreanParticles = function(text) {
    if (!text) return text;

    // 주요 조사들과 명사를 non-breaking space로 연결
    const particles = [
        '을', '를', '이', '가', '은', '는', '과', '와', '의', '로', '으로',
        '에', '에서', '에게', '에게서', '부터', '까지', '만', '도', '까지도',
        '라고', '이라고', '하고', '와', '과', '로써', '로서', '로부터'
    ];

    // 정규식: 한글 단어 + 조사
    const pattern = new RegExp(
        `([가-힣]+)(${particles.join('|')})(?=\\s|$)`,
        'g'
    );

    // 명사와 조사 사이에 HTML non-breaking space 삽입
    return text.replace(pattern, '$1&nbsp;$2');
}

// 별자리 선택 함수를 즉시 window에 등록
window.selectZodiac = function(zodiacId) {
    console.log('selectZodiac called with zodiacId:', zodiacId);
    currentZodiacId = zodiacId;
    
    // 초기 화면 숨기기
    const introSection = document.getElementById('zodiacIntro');
    if (introSection) {
        introSection.style.display = 'none';
    }
    
    // 네비게이션 아이템 활성화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.zodiac) === zodiacId) {
            item.classList.add('active');
        }
    });
    
    // 운세 디스플레이 표시
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    if (fortuneDisplay) {
        fortuneDisplay.style.display = 'block';
        
        // 별자리 정보 업데이트
        const zodiacInfo = zodiacAPI.zodiacSigns[zodiacId - 1];
        if (zodiacInfo) {
            const zodiacIcon = document.getElementById('zodiacIcon');
            const zodiacTitle = document.getElementById('zodiacTitle');
            const zodiacPeriod = document.getElementById('zodiacPeriod');
            
            if (zodiacIcon) zodiacIcon.textContent = zodiacInfo.symbol;
            if (zodiacTitle) zodiacTitle.textContent = zodiacInfo.name;
            if (zodiacPeriod) zodiacPeriod.textContent = `${zodiacInfo.start} ~ ${zodiacInfo.end}`;
        }
        
        // 오늘 탭 표시
        showTab('today');
        
        // 궁합 상태 초기화
        const partnerZodiacSelect = document.getElementById('partnerZodiac');
        const compatibilityResult = document.getElementById('compatibilityResult');
        
        if (partnerZodiacSelect) {
            partnerZodiacSelect.value = ''; // 상대방 별자리 선택 리셋
        }
        if (compatibilityResult) {
            compatibilityResult.style.display = 'none'; // 궁합 결과 숨김
        }
        
        // 운세 데이터 로드
        loadDailyFortune(zodiacId);
        
        // 운세 섹션으로 스크롤
        fortuneDisplay.scrollIntoView({ behavior: 'smooth' });
    }
};

// 별자리 설명 모달 표시 함수를 즉시 window에 등록
window.showZodiacModal = function(zodiacId, retryCount = 0) {
    console.log('🔍 showZodiacModal 호출됨 - zodiacId:', zodiacId, 'retryCount:', retryCount);
    
    // DOM 요소 존재 확인
    const modal = document.getElementById('zodiacModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    console.log('📍 모달 DOM 요소 확인:', {
        modal: !!modal,
        modalTitle: !!modalTitle,
        modalBody: !!modalBody
    });
    
    if (!modal || !modalTitle || !modalBody) {
        console.error('❌ 모달 DOM 요소를 찾을 수 없습니다:', {
            modal: !!modal,
            modalTitle: !!modalTitle,
            modalBody: !!modalBody
        });
        return false;
    }
    
    // zodiacDescriptions 상태 확인
    console.log('📊 zodiacDescriptions 상태:', {
        exists: !!window.zodiacDescriptions,
        type: typeof window.zodiacDescriptions,
        hasKeys: window.zodiacDescriptions ? Object.keys(window.zodiacDescriptions).length : 0
    });
    
    // zodiacDescriptions가 준비되지 않았으면 재시도
    // 빈 객체인지 확인 (Object.keys로 실제 데이터 존재 여부 체크)
    if (!window.zodiacDescriptions || Object.keys(window.zodiacDescriptions).length === 0) {
        if (retryCount < 10) { // 최대 10번 재시도 (1초)
            console.log('⏳ zodiacDescriptions 로딩 대기 중... 재시도:', retryCount + 1);
            setTimeout(() => {
                window.showZodiacModal(zodiacId, retryCount + 1);
            }, 100);
            return false;
        } else {
            console.error('❌ zodiacDescriptions 로딩 실패 - 최대 재시도 횟수 초과');
            return false;
        }
    }
    
    // 해당 별자리 정보 확인
    const info = window.zodiacDescriptions[zodiacId];
    console.log('🌟 별자리 정보 확인:', {
        zodiacId,
        hasInfo: !!info,
        infoKeys: info ? Object.keys(info) : []
    });
    
    if (!info) {
        console.error('❌ 별자리 정보를 찾을 수 없습니다:', zodiacId);
        return false;
    }
    
    try {
        // 모달 내용 설정
        console.log('✏️ 모달 내용 설정 중...');
        modalTitle.innerHTML = `${info.name}`;
        modalBody.innerHTML = `
            <p><strong>기간:</strong> ${info.period}</p>
            <p><strong>원소:</strong> ${info.element}</p>
            <p><strong>지배 행성:</strong> ${info.ruler}</p>
            
            <h3>📖 별자리 설명</h3>
            <div>${info.description}</div>
            
            <h3>✨ 주요 특징</h3>
            <ul>
                ${info.traits.map(trait => `<li>${trait}</li>`).join('')}
            </ul>
            
            <h3>💕 궁합</h3>
            ${info.compatibility}
        `;
        
        // 모달 표시
        modal.style.display = 'block';
        // 스크롤 위치를 맨 위로 초기화 (modal-content가 실제 스크롤 컨테이너)
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        console.log('✅ 모달 표시 완료');
        return true;
        
    } catch (error) {
        console.error('❌ 모달 설정 중 오류 발생:', error);
        return false;
    }
};

// 모달 닫기 함수
window.closeZodiacModal = function() {
    const modal = document.getElementById('zodiacModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// 돋보기 표시/숨김 함수 (CSS로 처리되지만 명시적 등록)
window.showMagnifier = function(card, zodiacId) {
    // CSS hover로 자동 처리됨
};

window.hideMagnifier = function(card) {
    // CSS hover로 자동 처리됨
};

// 별자리 이야기 페이지로 돌아가기
window.showIntroPage = function() {
    console.log('showIntroPage called - 초기 화면으로 돌아가기');

    // 현재 선택된 별자리 초기화
    currentZodiacId = null;

    // 운세 디스플레이 숨기기
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    if (fortuneDisplay) {
        fortuneDisplay.style.display = 'none';
    }

    // 별자리 소개 페이지 표시
    const introSection = document.getElementById('zodiacIntro');
    if (introSection) {
        introSection.style.display = 'block';
    }

    // 네비게이션 아이템 비활성화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // 페이지 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 현재 별자리 ID 초기화
    currentZodiacId = null;
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // API는 zodiac-api-real.js에서 이미 전역으로 생성됨
    // zodiacAPI = new ZodiacAPI(); // 제거
    
    // 오늘 날짜 표시
    displayCurrentDate();
    
    // 엔터키 이벤트 리스너
    setupEnterKeyListeners();
    
    // 초기 화면 설정 - 별자리 소개 페이지를 보이고 운세 페이지는 숨김
    const introSection = document.getElementById('zodiacIntro');
    const fortuneSection = document.getElementById('fortuneDisplay');
    
    if (introSection) {
        introSection.style.display = 'block';
    }
    if (fortuneSection) {
        fortuneSection.style.display = 'none';
    }
    
    // 네비게이션 아이템 활성화 초기화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
});

// 현재 날짜 표시
function displayCurrentDate() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    document.getElementById('headerDate').textContent = dateStr;
}

// 엔터키 이벤트 설정
function setupEnterKeyListeners() {
    const inputs = ['birthYear', 'birthMonth', 'birthDay'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                findZodiac();
            }
        });
    });
}

// 생년월일로 별자리 찾기
window.findZodiac = function() {
    const year = document.getElementById('birthYear').value;
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    
    if (!month || !day) {
        showToastMessage('생년월일을 모두 입력해 주세요 😊');
        return;
    }
    
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        showToastMessage('올바른 날짜를 입력해 주세요 📅');
        return;
    }
    
    const zodiac = zodiacAPI.getZodiacByDate(month, day);
    
    if (zodiac) {
        window.selectZodiac(zodiac.id);
    }
}

// (이미 파일 상단에 정의됨)

// 탭 전환
window.showTab = function(tabName) {
    // 탭 버튼 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(getTabLabel(tabName))) {
            btn.classList.add('active');
        }
    });
    
    // 탭 패널 표시
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // 탭별 데이터 로드
    if (currentZodiacId) {
        switch(tabName) {
            case 'today':
                loadDailyFortune(currentZodiacId);
                break;
            case 'week':
                loadWeeklyFortune(currentZodiacId);
                break;
            case 'month':
                loadMonthlyFortune(currentZodiacId);
                break;
            case 'year':
                loadYearlyFortune(currentZodiacId);
                break;
        }
    }
}

// 탭 라벨 가져오기
function getTabLabel(tabName) {
    const labels = {
        'today': '오늘',
        'week': '주간',
        'month': '월간',
        'year': '연간',
        'compatibility': '궁합'
    };
    return labels[tabName] || '';
}

// 일일 운세 로드
window.loadDailyFortune = async function(zodiacId) {
    const fortune = await zodiacAPI.getDailyFortune(zodiacId);
    
    // 전체 운세
    document.getElementById('todayOverall').textContent = fortune.overall;
    
    // 운세 점수 및 진행바
    const categories = ['love', 'money', 'work', 'health'];
    const categoryNames = {
        'love': '애정',
        'money': '금전',
        'work': '직장',
        'health': '건강'
    };
    
    categories.forEach(category => {
        const score = fortune.scores[category];
        const capitalCategory = category.charAt(0).toUpperCase() + category.slice(1);
        
        // 점수 표시
        document.getElementById(`${category}Score`).textContent = `${score}점`;
        
        // 진행바 업데이트
        const progressBar = document.getElementById(`${category}Progress`);
        progressBar.style.width = `${score}%`;
        
        // 색상 설정
        if (score >= 80) {
            progressBar.style.background = 'linear-gradient(90deg, #4ade80, #22c55e)';
        } else if (score >= 60) {
            progressBar.style.background = 'linear-gradient(90deg, #60a5fa, #3b82f6)';
        } else if (score >= 40) {
            progressBar.style.background = 'linear-gradient(90deg, #fbbf24, #f59e0b)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
        }
        
        // 상세 운세
        const fortuneElement = document.getElementById(`${category}Fortune`);
        if (fortuneElement && fortune.fortunes && fortune.fortunes[category]) {
            fortuneElement.textContent = fortune.fortunes[category];
        } else {
            console.error(`Missing fortune data for ${category}:`, fortune);
        }
    });
    
    // 행운 아이템
    displayLuckyItems(fortune.lucky);
    
    // 오늘의 조언
    document.getElementById('todayAdvice').textContent = fortune.advice;
}

// 주간 운세 로드
window.loadWeeklyFortune = async function(zodiacId) {
    const fortune = await zodiacAPI.getWeeklyFortune(zodiacId);
    
    // 기간 표시
    const weekStart = fortune.weekStart || '2025-01-06';
    const weekEnd = fortune.weekEnd || '2025-01-12';
    document.getElementById('weekPeriod').textContent = `${weekStart} ~ ${weekEnd}`;
    document.getElementById('weekTheme').textContent = fortune.theme || '새해의 시작';
    
    // 전체 운세
    document.getElementById('weekOverall').textContent = fortune.overall;
    
    // 각 분야별 운세
    document.getElementById('weekLove').textContent = fortune.fortunes.love;
    document.getElementById('weekMoney').textContent = fortune.fortunes.money;
    document.getElementById('weekWork').textContent = fortune.fortunes.work;
    document.getElementById('weekHealth').textContent = fortune.fortunes.health;
    
    // 주요 날짜 (컴팩트 표시)
    const keyDaysElement = document.getElementById('weekKeyDays');
    // keyDays가 문자열이므로 그대로 표시
    keyDaysElement.textContent = fortune.keyDays || '월요일, 금요일';
}

// 월간 운세 로드
window.loadMonthlyFortune = async function(zodiacId) {
    const fortune = await zodiacAPI.getMonthlyFortune(zodiacId);
    
    // 기간 표시
    const currentMonth = new Date().getMonth() + 1;
    const monthDisplay = fortune.month || currentMonth;
    document.getElementById('monthPeriod').textContent = `2025년 ${monthDisplay}월`;
    document.getElementById('monthTheme').textContent = fortune.theme || `${monthDisplay}월의 테마`;
    
    // 전체 운세
    document.getElementById('monthOverall').textContent = fortune.overall;
    
    // 각 분야별 운세
    document.getElementById('monthLove').textContent = fortune.fortunes.love;
    document.getElementById('monthMoney').textContent = fortune.fortunes.money;
    document.getElementById('monthWork').textContent = fortune.fortunes.work;
    document.getElementById('monthHealth').textContent = fortune.fortunes.health;
    
    // 주요 날짜
    // keyDates가 문자열이므로 그대로 표시
    document.getElementById('monthKeyDates').textContent = fortune.keyDates || '10일, 20일, 30일';
}

// 연간 운세 로드
window.loadYearlyFortune = async function(zodiacId) {
    const fortune = await zodiacAPI.getYearlyFortune(zodiacId);
    
    // 기간 표시
    document.getElementById('yearPeriod').textContent = `${fortune.year}년`;
    document.getElementById('yearTheme').textContent = fortune.theme;
    
    // 전체 운세
    document.getElementById('yearOverall').textContent = fortune.overall;
    
    // 각 분야별 운세
    document.getElementById('yearLove').textContent = fortune.fortunes.love;
    document.getElementById('yearMoney').textContent = fortune.fortunes.money;
    document.getElementById('yearWork').textContent = fortune.fortunes.work;
    document.getElementById('yearHealth').textContent = fortune.fortunes.health;
    
    // 최고의 달과 주의할 달 (keyPeriods 사용)
    document.getElementById('yearBestMonths').textContent = fortune.keyPeriods ? fortune.keyPeriods.firstHalf : '상반기';
    document.getElementById('yearChallengingMonths').textContent = fortune.keyPeriods ? fortune.keyPeriods.secondHalf : '하반기';
}

// 행운 아이템 표시
function displayLuckyItems(lucky) {
    // 행운의 색상
    const colorMap = {
        '빨강': '#ef4444',
        '파랑': '#3b82f6',
        '노랑': '#eab308',
        '초록': '#22c55e',
        '보라': '#a855f7',
        '주황': '#f97316',
        '분홍': '#ec4899',
        '하늘색': '#06b6d4',
        '연두색': '#84cc16'
    };
    
    const luckyColorDiv = document.getElementById('luckyColor');
    luckyColorDiv.style.background = colorMap[lucky.color] || '#667eea';
    luckyColorDiv.title = lucky.color;
    
    // 행운의 숫자
    document.getElementById('luckyNumber').textContent = lucky.number;
    
    // 행운의 시간
    document.getElementById('luckyTime').textContent = lucky.time;
}

// 궁합 확인
window.checkCompatibility = async function() {
    if (!currentZodiacId) {
        showToastMessage('먼저 자신의 별자리를 선택해 주세요 ⭐');
        return;
    }
    
    const partnerZodiacId = parseInt(document.getElementById('partnerZodiac').value);
    
    if (!partnerZodiacId) {
        showToastMessage('상대방의 별자리를 선택해 주세요 💕');
        return;
    }
    
    try {
        const compatibility = await zodiacAPI.getCompatibility(currentZodiacId, partnerZodiacId);
        
        // 결과 표시
        document.getElementById('compatibilityResult').style.display = 'block';
        
        // 총 점수
        document.getElementById('compatScore').textContent = `${compatibility.totalScore}점`;
        
        // 개별 점수 표시 (실제 데이터 사용)
        const loveScore = compatibility.scores?.love || 75;
        const friendScore = compatibility.scores?.friendship || 75;
        const workScore = compatibility.scores?.work || 75;
        
        document.getElementById('compatLoveScore').textContent = `${loveScore}점`;
        document.getElementById('compatFriendScore').textContent = `${friendScore}점`;
        document.getElementById('compatWorkScore').textContent = `${workScore}점`;
        
        // 궁합 설명 표시 (창의적인 텍스트 우선) - innerHTML로 HTML 마크업 지원
        const descriptionElement = document.getElementById('compatDescription');
        if (descriptionElement) {
            if (compatibility.description) {
                // 조사 보호 처리 후 HTML 렌더링 (전역 함수 사용)
                const protectedText = window.protectKoreanParticles(compatibility.description);
                descriptionElement.innerHTML = protectedText;
                descriptionElement.style.display = 'block';
                console.log('🎨 궁합 설명 표시 (조사 보호 적용):', compatibility.source || 'JSON data');
            } else {
                descriptionElement.textContent = '궁합 정보를 준비 중입니다.';
                descriptionElement.style.display = 'block';
                console.log('⚠️ 궁합 설명 데이터 없음');
            }
        }
        
        // 조언 (조사 보호 적용)
        const adviceElement = document.getElementById('compatAdvice');
        if (adviceElement && compatibility.advice) {
            adviceElement.innerHTML = window.protectKoreanParticles(compatibility.advice);
        }
        
        // 결과로 스크롤
        document.getElementById('compatibilityResult').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('❌ 궁합 확인 중 오류 발생:', error);
        showToastMessage('궁합 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
}

// ===== 날짜 선택기 새로운 함수들 (추가) =====

// 오버레이 생성
function createOverlay() {
    if (!document.getElementById('datePickerOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'datePickerOverlay';
        overlay.className = 'date-picker-overlay';
        overlay.onclick = closeAllPickers;
        document.body.appendChild(overlay);
    }
}

// 모든 선택기 닫기
function closeAllPickers() {
    document.querySelectorAll('.date-picker-popup').forEach(popup => {
        popup.style.display = 'none';
    });
    const overlay = document.getElementById('datePickerOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// 특정 선택기 닫기
window.closePicker = function(type) {
    document.getElementById(`${type}PickerPopup`).style.display = 'none';
    const overlay = document.getElementById('datePickerOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// 년도 선택기 표시
window.showYearPicker = function() {
    createOverlay();
    const popup = document.getElementById('yearPickerPopup');
    const content = popup.querySelector('.year-picker-content');
    
    // 년도 리스트 생성 (1900년부터 현재년도까지)
    const currentYear = new Date().getFullYear();
    const selectedYear = document.getElementById('birthYear').value || currentYear;
    
    content.innerHTML = '';
    for (let year = currentYear; year >= 1900; year--) {
        const yearItem = document.createElement('div');
        yearItem.className = 'year-item';
        if (year == selectedYear) {
            yearItem.classList.add('selected');
        }
        yearItem.textContent = year + '년';
        yearItem.onclick = function() {
            selectYear(year);
        };
        content.appendChild(yearItem);
    }
    
    // 팝업 표시
    popup.style.display = 'block';
    document.getElementById('datePickerOverlay').classList.add('active');
    
    // 선택된 년도로 스크롤
    const selectedElement = content.querySelector('.selected');
    if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center' });
    }
}

// 년도 선택
window.selectYear = function(year) {
    document.getElementById('birthYear').value = year;
    closePicker('year');
}

// 월 선택기 표시
window.showMonthPicker = function() {
    createOverlay();
    const popup = document.getElementById('monthPickerPopup');
    const grid = popup.querySelector('.month-grid');
    
    const selectedMonth = document.getElementById('birthMonth').value;
    
    // 월 그리드 생성
    grid.innerHTML = '';
    for (let month = 1; month <= 12; month++) {
        const monthItem = document.createElement('div');
        monthItem.className = 'month-item';
        if (month == selectedMonth) {
            monthItem.classList.add('selected');
        }
        monthItem.textContent = month + '월';
        monthItem.onclick = function() {
            selectMonth(month);
        };
        grid.appendChild(monthItem);
    }
    
    // 팝업 표시
    popup.style.display = 'block';
    document.getElementById('datePickerOverlay').classList.add('active');
}

// 월 선택
window.selectMonth = function(month) {
    document.getElementById('birthMonth').value = month;
    closePicker('month');
    
    // 일 입력값 확인 및 조정
    const day = document.getElementById('birthDay').value;
    if (day) {
        const maxDay = getMaxDayOfMonth(month);
        if (day > maxDay) {
            document.getElementById('birthDay').value = maxDay;
        }
    }
}

// 일 선택기 표시
window.showDayPicker = function() {
    createOverlay();
    const popup = document.getElementById('dayPickerPopup');
    const grid = popup.querySelector('.day-grid');
    
    const selectedDay = document.getElementById('birthDay').value;
    const month = document.getElementById('birthMonth').value || new Date().getMonth() + 1;
    const maxDay = getMaxDayOfMonth(month);
    
    // 요일 헤더 생성
    grid.innerHTML = '';
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    weekDays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    // 첫째 날의 요일 구하기
    const firstDay = new Date(2024, month - 1, 1).getDay();
    
    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day-item disabled';
        grid.appendChild(emptyDiv);
    }
    
    // 일 생성
    for (let day = 1; day <= maxDay; day++) {
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';
        if (day == selectedDay) {
            dayItem.classList.add('selected');
        }
        dayItem.textContent = day;
        dayItem.onclick = function() {
            selectDay(day);
        };
        grid.appendChild(dayItem);
    }
    
    // 팝업 표시
    popup.style.display = 'block';
    document.getElementById('datePickerOverlay').classList.add('active');
}

// 일 선택
window.selectDay = function(day) {
    document.getElementById('birthDay').value = day;
    closePicker('day');
}

// 월의 최대 일수 구하기
function getMaxDayOfMonth(month) {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthDays[month - 1];
}

// ESC 키로 팝업 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllPickers();
    }
});

// ===== 토스트 메시지 함수 (새로 추가) =====
window.showToastMessage = function(message) {
    // 기존 토스트가 있으면 제거
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // body에 추가
    document.body.appendChild(toast);
    
    // 애니메이션을 위해 잠시 후 show 클래스 추가
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 3초 후 자동으로 사라지기
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ===== 햄버거 메뉴 토글 함수 (수정) =====
window.toggleNav = function() {
    const nav = document.querySelector('.zodiac-nav');
    const toggleBtn = document.querySelector('.nav-toggle');
    const container = document.querySelector('.zodiac-container');
    
    if (nav.classList.contains('collapsed')) {
        // 네비게이션 열기
        nav.classList.remove('collapsed');
        toggleBtn.classList.remove('collapsed');
        toggleBtn.innerHTML = '☰';
        if (container) container.style.marginLeft = '210px';
    } else {
        // 네비게이션 닫기
        nav.classList.add('collapsed');
        toggleBtn.classList.add('collapsed');
        toggleBtn.innerHTML = '☰';
        if (container) container.style.marginLeft = '50px';
    }
}

// ===== 공유 기능 (새로 추가) =====
window.shareResult = function() {
    const title = document.getElementById('zodiacTitle').textContent;
    const url = window.location.href;
    const text = `🌟 ${title} 운세를 확인해보세요!\n나도 내 운세 보러가기 👉`;
    
    // Web Share API 지원 확인
    if (navigator.share) {
        navigator.share({
            title: '별자리 운세',
            text: text,
            url: url
        }).catch(err => {
            // 공유 취소 시 무시
        });
    } else {
        // Web Share API 미지원 시 클립보드에 복사
        const shareText = `${text}\n${url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showToastMessage('링크가 복사되었습니다! 📋');
        }).catch(() => {
            // 복사 실패 시 대체 방법
            const tempInput = document.createElement('input');
            tempInput.value = shareText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToastMessage('링크가 복사되었습니다! 📋');
        });
    }
}

// ===== 궁합 관련 함수들 (새로 추가) =====
// 궁합 입력 토글
window.toggleCompatibilityInput = function() {
    const partnerSection = document.getElementById('partnerSection');
    if (partnerSection.style.display === 'none' || partnerSection.style.display === '') {
        partnerSection.style.display = 'flex';
    } else {
        partnerSection.style.display = 'none';
    }
}

// 생년월일로 궁합 확인
window.checkBirthdateCompatibility = async function() {
    // 내 생년월일
    const myMonth = parseInt(document.getElementById('birthMonth').value);
    const myDay = parseInt(document.getElementById('birthDay').value);
    
    // 상대방 생년월일
    const partnerMonth = parseInt(document.getElementById('partnerMonth').value);
    const partnerDay = parseInt(document.getElementById('partnerDay').value);
    
    if (!myMonth || !myDay) {
        showToastMessage('내 생년월일을 먼저 입력해 주세요 😊');
        return;
    }
    
    if (!partnerMonth || !partnerDay) {
        showToastMessage('상대방 생년월일을 입력해 주세요 💕');
        return;
    }
    
    // 별자리 찾기
    const myZodiac = zodiacAPI.getZodiacByDate(myMonth, myDay);
    const partnerZodiac = zodiacAPI.getZodiacByDate(partnerMonth, partnerDay);
    
    if (myZodiac && partnerZodiac) {
        // 궁합 탭으로 이동하고 결과 표시
        currentZodiacId = myZodiac.id;
        
        // 네비게이션 아이템 활성화
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.zodiac) === myZodiac.id) {
                item.classList.add('active');
            }
        });
        
        // 운세 디스플레이 표시
        document.getElementById('fortuneDisplay').style.display = 'block';
        
        // 별자리 정보 업데이트
        document.getElementById('zodiacIcon').textContent = myZodiac.symbol;
        document.getElementById('zodiacTitle').textContent = `${myZodiac.name} & ${partnerZodiac.name} 궁합`;
        document.getElementById('zodiacPeriod').textContent = '';
        
        // 궁합 탭 표시
        showTab('compatibility');
        
        // 파트너 선택 드롭다운 설정
        document.getElementById('partnerZodiac').value = partnerZodiac.id;
        
        // 궁합 확인
        await checkCompatibility();
    }
}

// 상대방 날짜 선택기 함수들
window.showPartnerYearPicker = function() {
    // 기존 년도 선택기 재사용, 단 타겟을 partnerYear로 변경
    createOverlay();
    const popup = document.getElementById('yearPickerPopup');
    const content = popup.querySelector('.year-picker-content');
    
    const currentYear = new Date().getFullYear();
    const selectedYear = document.getElementById('partnerYear').value || currentYear;
    
    content.innerHTML = '';
    for (let year = currentYear; year >= 1900; year--) {
        const yearItem = document.createElement('div');
        yearItem.className = 'year-item';
        if (year == selectedYear) {
            yearItem.classList.add('selected');
        }
        yearItem.textContent = year + '년';
        yearItem.onclick = function() {
            document.getElementById('partnerYear').value = year;
            closePicker('year');
        };
        content.appendChild(yearItem);
    }
    
    popup.style.display = 'block';
    document.getElementById('datePickerOverlay').classList.add('active');
    
    const selectedElement = content.querySelector('.selected');
    if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center' });
    }
}

window.showPartnerMonthPicker = function() {
    createOverlay();
    const popup = document.getElementById('monthPickerPopup');
    const grid = popup.querySelector('.month-grid');
    
    const selectedMonth = document.getElementById('partnerMonth').value;
    
    grid.innerHTML = '';
    for (let month = 1; month <= 12; month++) {
        const monthItem = document.createElement('div');
        monthItem.className = 'month-item';
        if (month == selectedMonth) {
            monthItem.classList.add('selected');
        }
        monthItem.textContent = month + '월';
        monthItem.onclick = function() {
            document.getElementById('partnerMonth').value = month;
            closePicker('month');
        };
        grid.appendChild(monthItem);
    }
    
    popup.style.display = 'block';
    document.getElementById('datePickerOverlay').classList.add('active');
}

window.showPartnerDayPicker = function() {
    createOverlay();
    const popup = document.getElementById('dayPickerPopup');
    const grid = popup.querySelector('.day-grid');
    
    const selectedDay = document.getElementById('partnerDay').value;
    const month = document.getElementById('partnerMonth').value || new Date().getMonth() + 1;
    const maxDay = getMaxDayOfMonth(month);
    
    grid.innerHTML = '';
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    weekDays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    const firstDay = new Date(2024, month - 1, 1).getDay();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day-item disabled';
        grid.appendChild(emptyDiv);
    }
    
    for (let day = 1; day <= maxDay; day++) {
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';
        if (day == selectedDay) {
            dayItem.classList.add('selected');
        }
        dayItem.textContent = day;
        dayItem.onclick = function() {
            document.getElementById('partnerDay').value = day;
            closePicker('day');
        };
        grid.appendChild(dayItem);
    }
    
    popup.style.display = 'block';
    document.getElementById('datePickerOverlay').classList.add('active');
}

// 별자리 설명 데이터
window.zodiacDescriptions = {
    1: {
        name: "양자리 (Aries)",
        period: "3월 21일 ~ 4월 19일",
        element: "불의 별자리",
        ruler: "화성",
        description: `<div class="intro-section">
황금양털을 찾아 떠난 아르고호의 모험처럼, 양자리는 끝없는 개척정신으로 새로운 세상을 열어갑니다.
</div>

<div class="personality-section">
전쟁의 신 마르스(화성)의 뜨거운 에너지를 받아 태어난 불의 전사들. 이들에게 '불가능'이라는 단어는 존재하지 않습니다.
</div>

<div class="lifestyle-section">
<h4>🔥 양자리 라이프 스타일</h4>
<ul>
<li>엘리베이터 닫기 버튼을 광속으로 누르는 성격</li>
<li>신호등 바뀌면 가장 먼저 출발하는 스피드왕</li>
<li>카페에서 메뉴 고민 시간은 최대 3초</li>
<li>"에이, 해보면 되지!"가 입에 붙은 개척자</li>
</ul>
</div>

<div class="character-section">
친구가 "이거 어려울 것 같은데..."라고 말하는 순간.<br><br>
벌써 "에이, 해보면 되지!"라며 앞장서고 있는 타고난 리더. 연애할 때는 "우리 사귀자!" 한 번에 끝내버리는 직진 로맨티스트입니다.
</div>`,
        traits: [
            "열정적이고 활동적인 성격",
            "리더십이 강하고 도전을 즐김",
            "직관적이고 즉흥적인 행동",
            "독립심이 강하고 자신감 넘침"
        ],
        compatibility: `
        <div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🦁 사자자리:</strong>
            <p>불의 형제들! 양자리와 사자자리는 마치 액션 영화의 주인공 듀오 같습니다. 둘 다 "일단 저질러!"를 외치며 모험을 떠나고, 서로의 열정에 더욱 불타오릅니다. 데이트할 때도 "오늘 뭐 할까?"라는 질문에 동시에 "새로운 곳!"이라고 답하는 찰떡궁합입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏹 사수자리:</strong>
            <p>모험 파트너! 양자리의 즉흥성과 사수자리의 자유로운 영혼이 만나 "세상은 넓고 할 일은 많다"를 실천합니다. 금요일 저녁 갑작스런 "내일 부산 가자!" 제안에도 "좋아!"하고 따라나서는 환상 콤비입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>에너지 폭발 듀오! 양자리의 추진력과 쌍둥이자리의 아이디어가 만나면 "이런 건 어때?"가 "바로 해보자!"로 이어지는 실행력 만점 커플입니다. 함께 있으면 지루할 틈이 없는 활기찬 관계입니다.</p>
          </div>
        </div>
        
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>⚖️ 천칭자리:</strong>
            <p>정반대의 매력! 양자리가 "이거야!"라고 하면 천칭자리가 "잠깐, 다른 건 어때?"하며 서로 다른 매력으로 끌리는 복잡한 인연입니다. 양자리는 신중함을, 천칭자리는 결단력을 배우게 되는 성장 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 조심할 궁합</h4>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>물과 불의 만남은 증기만 만들어냅니다. 양자리가 "빨리 결정하자!"라고 하면 게자리는 "좀 더 생각해볼까?"하며 속도 차이로 서로 답답해합니다. 하지만 양자리가 조금만 기다려주고 게자리가 조금만 빨라지면 의외로 좋은 조합이 될 수 있어요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>양자리의 "대충대충"과 처녀자리의 "완벽하게"가 충돌해 "왜 이렇게 급해?" vs "왜 이렇게 꼼꼼해?"를 주고받는 관계입니다. 서로의 방식을 이해하려는 노력이 필요해요.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🤝 우정으로는 최고</h4>
          
          <div class="compat-item">
            <strong>🐐 염소자리:</strong>
            <p>연애로는 속도 차이가 있지만, 친구로는 환상적입니다. 양자리의 아이디어를 염소자리가 현실적으로 다듬어주는 든든한 친구 관계예요.</p>
          </div>
        </div>
        `
    },
    2: {
        name: "황소자리 (Taurus)",
        period: "4월 20일 ~ 5월 20일",
        element: "흙의 별자리",
        ruler: "금성",
        description: `<div class="intro-section">
미의 여신 비너스(금성)의 축복을 받아 태어난 황소자리. 세상의 모든 아름답고 달콤한 것들을 사랑하는 감각의 예술가입니다.
</div>

<div class="personality-section">
그리스 신화에서 제우스가 변신했던 하얀 황소처럼 겉보기엔 무뚝뚝하지만 속은 부드러운 로맨티스트.
</div>

<div class="lifestyle-section">
<h4>🌱 황소자리 라이프 스타일</h4>
<ul>
<li>맛집 투어는 그들의 특기</li>
<li>가성비 분석은 취미생활</li>
<li>좋은 것에 대한 뛰어난 안목 보유</li>
<li>"급하게 가면 뭐 좋아?" 철학의 소유자</li>
</ul>
</div>

<div class="character-section">
친구들이 "빨리 가자!"고 재촉해도 마이페이스를 유지.<br><br>
자신만의 여유로운 템포로 살아가는 사람들. 연애할 때는 "맛있는 거 해줄게"라는 한마디로 상대방의 마음을 사로잡는 현실적인 로맨티스트입니다.
</div>`,
        traits: [
            "신중하고 실용적인 성격",
            "인내심이 강하고 끈기 있음",
            "감각적이고 예술적 감성",
            "소유욕이 강하고 안정 추구"
        ],
        compatibility: `
        <div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>흙의 신뢰할 수 있는 파트너! 황소자리가 "이 집 괜찮지 않아?"라고 하면 처녀자리가 "구조와 채광, 교통편까지 완벽해"라며 체계적으로 분석해주는 든든한 관계입니다. 함께 집꾸미기를 하면 인테리어 잡지에 나올 법한 완벽한 공간을 만들어내는 실속형 커플입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐐 염소자리:</strong>
            <p>현실적인 파워 커플! 황소자리의 안정 추구와 염소자리의 계획성이 만나 "우리 10년 후엔 어떻게 살까?"를 진짜로 실현시키는 조합입니다. 데이트 코스도 "맛있고 분위기 좋고 가격도 합리적인" 완벽한 장소를 찾아내는 모범생 커플입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>안정과 따뜻함의 만남! 황소자리의 현실감각과 게자리의 감성이 만나 "집이 이렇게 편할 수가 있구나"를 느끼게 해주는 홈 스위트 홈 커플입니다. 함께 요리하고 영화보며 집에서 보내는 시간이 최고의 데이트인 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🦂 전갈자리:</strong>
            <p>조용하지만 강렬한 끌림! 황소자리의 현실감각과 전갈자리의 직감이 만나 서로에게 없던 새로운 면을 발견하게 해주는 신비로운 관계입니다. "너 생각보다 깊은 사람이구나"를 자주 느끼게 되는 매력적인 조합입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 조심할 궁합</h4>
          
          <div class="compat-item">
            <strong>🦁 사자자리:</strong>
            <p>황소자리가 "집에서 쉬자"라고 하면 사자자리가 "밖에 나가서 사람들 만나자"하며 생활 패턴이 완전히 달라 피곤한 관계가 될 수 있습니다. 하지만 서로 타협하면 집순이와 파티 러버의 균형 잡힌 커플이 될 수도 있어요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏺 물병자리:</strong>
            <p>황소자리가 "변화는 천천히"라고 하면 물병자리가 "새로운 건 바로바로"하며 변화에 대한 태도 차이로 답답함을 느낄 수 있는 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🤝 우정으로는 최고</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>연애로는 속도 차이가 있지만, 친구로는 완벽합니다. 쌍둥이자리의 재미있는 이야기를 황소자리가 편안하게 들어주는 힐링 친구 관계예요.</p>
          </div>
        </div>
        `
    },
    3: {
        name: "쌍둥이자리 (Gemini)",
        period: "5월 21일 ~ 6월 20일",
        element: "공기의 별자리",
        ruler: "수성",
        description: `<div class="intro-section">
소통의 신 헤르메스(수성)가 지배하는 쌍둥이자리. 그리스 신화의 쌍둥이 형제처럼 두 개의 다른 면을 가진 매력적인 별자리입니다.
</div>

<div class="personality-section">
바람의 속성을 지녀 어디로 날아갈지 예측 불가능한 자유로운 영혼들.
</div>

<div class="lifestyle-section">
<h4>👥 쌍둥이자리의 이중생활</h4>
<ul>
<li>엘리베이터에 타면 어느새 옆 사람과 친구</li>
<li>카톡방에서는 항상 대화의 중심</li>
<li>"그런데 말이야~"로 시작하는 흥미진진한 이야기꾼</li>
<li>모순 덩어리지만 그게 또 매력적</li>
</ul>
</div>

<div class="character-section">
아침: "오늘부터 미니멀 라이프!"를 선언.<br><br>
점심: 온라인 쇼핑몰에서 장바구니 채우는 중. 연애할 때는 매일 새로운 모습으로 상대방을 놀라게 하는 서프라이즈 마스터입니다.
</div>`,
        traits: [
            "호기심이 많고 지적인 성격",
            "의사소통 능력이 뛰어남",
            "변화를 즐기고 적응력 높음",
            "다재다능하고 재치 있음"
        ],
        compatibility: `⭐ <b>최고의 궁합</b> ⭐
        
        ⚖️ <strong>천칭자리</strong>: 공기의 수다쟁이 듀오! 쌍둥이자리와 천칭자리가 만나면 카페에서 3시간을 앉아있어도 할 말이 끝나지 않습니다. "그런데 말이야..."로 시작해서 온갖 주제로 날아다니는 대화의 달인들이에요. 함께 여행가면 관광지보다 현지 카페에서 수다 떠는 시간이 더 많은 커플입니다.
        
        🏺 <strong>물병자리</strong>: 독특함의 만남! 쌍둥이자리의 호기심과 물병자리의 창의성이 만나 "이런 건 어때?"라며 세상에 없던 아이디어를 만들어내는 혁신 커플입니다. "우리 너무 특이한 거 아니야?"라면서도 서로의 독특함을 이해하고 존중하는 특별한 관계입니다.
        
        ♈ <strong>양자리</strong>: 에너지 폭발 듀오! 쌍둥이자리가 "이런 거 재미있을 것 같아!"라고 하면 양자리가 "바로 해보자!"라며 아이디어를 즉석에서 실현시키는 실행력 만점 커플입니다. 둘 다 새로운 것을 좋아해서 지루할 틈이 없는 관계예요.
        
        🌟 <b>특별한 인연</b>
        
        🏹 <strong>사수자리</strong>: 모험과 지식의 조합! 쌍둥이자리가 "이거 신기하지 않아?"라고 하면 사수자리가 "직접 가서 보자!"하며 책으로만 알던 걸 몸소 체험하게 해주는 역동적인 관계입니다. 서로의 호기심을 자극하며 끊임없이 성장하는 자극적인 커플이에요.
        
        💔 <b>조심할 궁합</b>
        
        🌾 <strong>처녀자리</strong>: 쌍둥이자리의 산만함과 처녀자리의 꼼꼼함이 충돌해 "집중 좀 해!"와 "너무 빡빡해!"를 주고받는 관계입니다. 하지만 쌍둥이자리가 조금만 차분해지고 처녀자리가 조금만 여유를 가지면 완벽한 조합이 될 수 있어요.
        
        🐟 <strong>물고기자리</strong>: 쌍둥이자리가 "논리적으로 생각해봐"라고 하면 물고기자리가 "그냥 느낌적인 느낌이야"라며 서로 다른 언어를 쓰는 듯한 관계입니다. 소통 방식의 차이로 답답함을 느낄 수 있어요.
        
        🤝 <b>우정으로는 최고</b>
        
        🦀 <strong>게자리</strong>: 연애로는 속도 차이가 있지만, 친구로는 환상적입니다. 쌍둥이자리의 재미있는 소식들을 게자리가 따뜻하게 들어주는 편안한 친구 관계예요.`
    },
    4: {
        name: "게자리 (Cancer)",
        period: "6월 21일 ~ 7월 22일",
        element: "물의 별자리",
        ruler: "달",
        description: `<div class="intro-section">
달의 신비로운 힘을 받는 게자리. 그리스 신화에서 헤라클레스와 싸우다 별이 된 용감한 게의 후예입니다.
</div>

<div class="personality-section">
밤하늘의 달처럼 변화무쌍하지만 언제나 따뜻한 빛으로 사람들을 위로하는 감성의 달인들.
</div>

<div class="lifestyle-section">
<h4>🦀 게자리의 츤데레 매뉴얼</h4>
<ul>
<li>"밥은 먹고 다녀?"라는 말로 하루를 시작</li>
<li>"추우니까 옷 따뜻하게 입고 다녀"로 마무리</li>
<li>케어봇 같은 존재지만 표현은 서툴러요</li>
<li>"나 별로 안 챙겨!"라면서 이미 챙길 리스트 작성 중</li>
</ul>
</div>

<div class="character-section">
딱딱한 껍데기 안에 부드러운 마음을 숨긴 진정한 츤데레.<br><br>
연애할 때는 "작년 이맘때 너가 그랬잖아"를 꺼내들어 상대방을 감동시키는 기억력의 마법사입니다.
</div>`,
        traits: [
            "감성적이고 직관력 뛰어남",
            "가족과 친구를 소중히 여김",
            "동정심이 많고 배려심 깊음",
            "방어적이고 조심스러움"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🦂 전갈자리:</strong>
            <p>물의 깊은 교감! 게자리와 전갈자리는 말하지 않아도 서로의 마음을 아는 텔레파시 커플입니다. 게자리가 "요즘 힘들어"라고 하면 전갈자리가 벌써 치킨을 주문해놓은 찰떡궁합입니다. 둘 다 진짜 마음을 잘 안 보여주지만 서로에게만큼은 완전히 열어버리는 운명적인 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐟 물고기자리:</strong>
            <p>감성 충만 듀오! 게자리의 보살핌과 물고기자리의 순수함이 만나 "세상에 이렇게 따뜻한 사랑이 있을까?"를 보여주는 힐링 커플입니다. 함께 영화보며 울고, 비 오는 날 우산 하나 쓰고 걸어도 행복한 로맨틱 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>집순이들의 천국! 게자리와 황소자리는 "우리 집이 세상에서 제일 좋아"를 외치며 완벽한 홈 스위트 홈을 만드는 안정감 MAX 커플입니다. 함께 소파에 앉아 드라마 보는 것이 최고의 데이트인 평화로운 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🐐 염소자리:</strong>
            <p>감성과 이성의 완벽한 조화! 게자리의 따뜻한 감정과 염소자리의 냉철한 이성이 만나 "네가 없으면 안 될 것 같아"를 느끼게 하는 보완 관계입니다. 서로 없던 부분을 채워주며 함께 성장하는 관계예요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>케어의 달인들! 게자리의 감정적 케어와 처녀자리의 실용적 케어가 만나 "우리 서로 완벽하게 챙겨주네"를 실감하는 세심한 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 조심할 궁합</h4>
          
          <div class="compat-item">
            <strong>♈ 양자리:</strong>
            <p>게자리가 "천천히 생각해보자"라고 하면 양자리가 "왜 이렇게 답답해?"하며 속도 차이로 지치는 관계입니다. 하지만 양자리가 조금만 기다려주고 게자리가 조금만 빨라지면 의외로 좋은 조합이 될 수 있습니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>⚖️ 천칭자리:</strong>
            <p>게자리의 직설적 감정 표현과 천칭자리의 외교적 화법이 "진심이 뭐야?"로 이어지는 답답한 관계가 될 수 있습니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏺 물병자리:</strong>
            <p>게자리의 감정 중시와 물병자리의 이성 중시가 "너무 감정적이야" vs "너무 차가워"로 충돌하는 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🤝 우정으로는 최고</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>연애로는 속도 차이가 있지만, 친구로는 완벽합니다! 쌍둥이자리의 재미있는 소식들을 게자리가 따뜻하게 들어주는 힐링 친구 관계예요.</p>
          </div>
        </div>`
    },
    5: {
        name: "사자자리 (Leo)",
        period: "7월 23일 ~ 8월 22일",
        element: "불의 별자리",
        ruler: "태양",
        description: `<div class="intro-section">
태양의 찬란한 빛을 받아 태어난 사자자리. 그리스 신화의 네메아 사자처럼 강인하고 당당한 왕의 별자리입니다.
</div>

<div class="personality-section">
헤라클레스도 감탄한 그 위엄과 카리스마로 어디서든 자연스럽게 중심이 되는 타고난 리더들.
</div>

<div class="lifestyle-section">
<h4>🦁 사자자리의 메인 캐릭터 라이프</h4>
<ul>
<li>셀카 실력은 프로급 수준</li>
<li>SNS 피드는 언제나 완벽</li>
<li>"오늘 옷 예쁘네!" 한마디에 온종일 기분 좋아지는 칭찬 중독자</li>
<li>시선 집중은 기본, 따뜻한 칭찬도 아끼지 않아요</li>
</ul>
</div>

<div class="character-section">
방에 들어서는 순간 모든 시선이 자동 집중.<br><br>
하지만 다른 사람도 아낌없이 칭찬해주는 따뜻한 마음의 소유자. 연애할 때는 상대방을 왕족처럼 모시지만, 자신도 똑같은 대우를 원하는 상호존중주의자입니다.
</div>`,
        traits: [
            "자신감 넘치고 당당한 성격",
            "관대하고 따뜻한 마음",
            "창의적이고 표현력 풍부",
            "주목받기를 좋아함"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>♈ 양자리:</strong>
            <p>불의 왕과 개척자! 사자자리와 양자리는 마치 액션 영화의 주인공들처럼 "우리가 최고야!"를 외치며 세상을 정복하러 다니는 파워 커플입니다. 서로의 자신감을 북돋아주고, "당신 정말 멋있어!"를 아끼지 않는 칭찬 부자들입니다. 데이트할 때도 "오늘 뭐 할까?"라는 질문에 동시에 "신나는 거!"라고 답하는 찰떡궁합이에요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏹 사수자리:</strong>
            <p>모험의 로열 커플! 사자자리의 리더십과 사수자리의 모험심이 만나 "인생은 축제야!"를 실천하는 활기찬 관계입니다. 함께 있으면 매일이 파티이고, 여행 가면 현지인들과도 금방 친해지는 인기 만점 듀오입니다. 사자자리가 "우리 사진 찍자!"라고 하면 사수자리가 "저기 배경 예쁜 데서!"라며 완벽한 여행 콘텐츠를 만들어내는 SNS 스타 커플이기도 해요.</p>
          </div>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>에너지와 재치의 조합! 사자자리의 당당함과 쌍둥이자리의 위트가 만나 어디서든 주목받는 엔터테이너 커플이 됩니다. 사자자리가 "내가 주인공!"이면 쌍둥이자리가 "내가 해설자!"가 되어 완벽한 콤비를 이루는 재미있는 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🏺 물병자리:</strong>
            <p>정반대의 매력! 사자자리의 화려함과 물병자리의 독특함이 만나 "너는 정말 특별해"를 느끼게 하는 신선한 관계입니다. 사자자리가 스포트라이트를 받으면 물병자리가 뒤에서 "잘했어!"하며 조용히 응원해주는 조화로운 커플입니다. 서로 다른 매력으로 끌리면서도 존중하는 성숙한 관계예요.</p>
          </div>
          
          <div class="compat-item">
            <strong>⚖️ 천칭자리:</strong>
            <p>화려함과 우아함의 만남! 사자자리의 당당한 카리스마와 천칭자리의 세련된 매력이 만나 "우리 정말 잘 어울리지 않아?"를 보여주는 비주얼 커플입니다. 함께 있으면 주변 사람들이 "와, 멋있다"를 연발하는 스타일리시한 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 조심할 궁합</h4>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>사자자리가 "나가서 놀자!"라고 하면 황소자리가 "집이 편해"하며 생활 패턴 차이로 지치는 관계입니다. 사자자리의 활동적인 성향과 황소자리의 안정 추구가 "너무 바빠" vs "너무 집에만 있어"로 충돌할 수 있어요. 하지만 서로 타협하면 집순이와 파티 러버의 균형 잡힌 커플이 될 수도 있습니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🦂 전갈자리:</strong>
            <p>둘 다 강한 개성을 가져 "내가 주인공이야!" vs "나도 만만치 않아!"로 권력 다툼이 벌어질 수 있는 관계입니다. 사자자리의 오픈된 카리스마와 전갈자리의 은밀한 강함이 충돌해 서로를 이해하기 어려울 수 있어요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>사자자리가 "대충 해도 돼"라고 하면 처녀자리가 "완벽하게 하자"라며 접근 방식의 차이로 답답해하는 관계입니다. 사자자리의 즉흥성과 처녀자리의 신중함이 속도 차이를 만들 수 있어요.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🤝 우정으로는 최고</h4>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>연애로는 속도와 성향 차이가 있지만, 친구로는 환상적입니다! 사자자리의 밝은 에너지가 게자리에게 활력을 주고, 게자리의 따뜻한 케어가 사자자리에게 안정감을 주는 서로를 보완하는 좋은 친구 관계예요.</p>
          </div>
        </div>`
    },
    6: {
        name: "처녀자리 (Virgo)",
        period: "8월 23일 ~ 9월 22일",
        element: "흙의 별자리",
        ruler: "수성",
        description: `<div class="intro-section">
수확의 여신 데메테르가 지키는 처녀자리. 그리스 신화 아스트라이아 여신의 후예로 순수함과 지혜를 상징합니다.
</div>

<div class="personality-section">
완벽함을 추구하되 따뜻한 마음으로 세상을 더 나은 곳으로 만들어가는 실용적인 완벽주의자들.
</div>

<div class="lifestyle-section">
<h4>🌾 처녀자리의 디테일 장인 정신</h4>
<ul>
<li>"어 너 오늘 뭔가 달라 보여" - 정확히 포인트 찾는 관찰력</li>
<li>99점 받고도 "1점이 어디서?" 고민하는 완벽주의</li>
<li>건강 관리 전문가지만 스트레스 받으면 치킨 주문하는 반전</li>
<li>"이렇게 하면 더 편할 텐데" 진심 조언하는 케어 전문가</li>
</ul>
</div>

<div class="character-section">
연애할 때는 상대방을 위한 세심한 배려가 특기.<br><br>
그 꼼꼼함 덕분에 사랑받는 소중한 존재들입니다.
</div>`,
        traits: [
            "분석적이고 논리적인 사고",
            "완벽주의적 성향",
            "봉사정신이 강함",
            "세심하고 꼼꼼한 성격"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>현실적인 완벽 듀오! 처녀자리와 황소자리는 "우리 집 정말 완벽하지 않아?"를 실현시키는 실용성의 달인들입니다. 처녀자리가 계획을 세우면 황소자리가 착실히 실행하여 꿈의 라이프스타일을 만들어가는 안정감 MAX 커플입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐐 염소자리:</strong>
            <p>성공의 파트너십! 처녀자리의 완벽함과 염소자리의 야망이 만나 "우리가 하면 무조건 성공해"를 보여주는 워킹 커플입니다. 함께 목표를 세우고 달성하는 것이 취미이며, 주변에서 부러워하는 모범적인 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🐟 물고기자리:</strong>
            <p>이성과 감성의 완벽한 조화! 처녀자리가 "현실적으로 생각해봐"라고 하면 물고기자리가 "마음은 어떻게 할 거야?"라며 서로 없던 부분을 채워주는 보완 관계입니다. 처녀자리는 더 따뜻해지고 물고기자리는 더 현실적이 되는 성장하는 커플입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 주의할 궁합</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>처녀자리가 "체계적으로 하자"라고 하면 쌍둥이자리가 "그때그때 달라요"하며 접근 방식의 차이로 답답해하는 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏹 사수자리:</strong>
            <p>처녀자리의 디테일 챙기기와 사수자리의 대충대충이 만나 "너무 꼼꼼해" vs "너무 대충이야"를 주고받는 피곤한 관계가 될 수 있습니다.</p>
          </div>
        </div>`
    },
    7: {
        name: "천칭자리 (Libra)",
        period: "9월 23일 ~ 10월 22일",
        element: "공기의 별자리",
        ruler: "금성",
        description: `<div class="intro-section">
아름다움과 조화의 여신 비너스(금성)의 축복을 받은 천칭자리. 그리스 신화의 정의의 여신 디케처럼 공정하고 아름다운 것들을 사랑합니다.
</div>

<div class="personality-section">
신중하게 저울 양편의 무게를 재듯 모든 것에 진정한 균형을 찾으려 노력하는 예술가들.
</div>

<div class="lifestyle-section">
<h4>⚖️ 천칭자리의 선택 장애 실화</h4>
<ul>
<li>레스토랑에서 메뉴판 30분 동안 들여다보는 선택의 마에스트로</li>
<li>"둘 다 맞아, 둘 다 이해해"로 모든 갈등 중재하는 타고난 외교관</li>
<li>인스타그램은 예술 갤러리 수준의 미적 감각 소유자</li>
<li>'인테리어 예쁘지? 음식 맛있지?'가 카페 고르는 기준</li>
</ul>
</div>

<div class="character-section">
완벽한 미학주의자의 일상.<br><br>
연애할 때는 "우리 항상 공평하게 하자"를 모토로 살지만, 속으로는 상대방의 진심을 계산하고 있는 로맨틱 회계사들입니다.
</div>`,
        traits: [
            "공정하고 균형 잡힌 시각",
            "사교적이고 매력적임",
            "예술적 감각이 뛰어남",
            "우유부단한 면이 있음"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>지적인 소울메이트! 천칭자리와 쌍둥이자리는 "우리 진짜 통한다"를 매일 실감하는 커뮤니케이션의 달인들입니다. 카페에서 만나면 3시간이 3분처럼 느껴지고, 서로의 농담에 배꼽 잡고 웃는 유쾌한 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏺 물병자리:</strong>
            <p>자유로운 예술가 듀오! 천칭자리의 미적 감각과 물병자리의 창의성이 만나 "우리 독특하면서도 멋있지 않아?"를 보여주는 스타일리시한 커플입니다. 서로의 개성을 존중하며 "같이 있지만 따로" 철학을 실천하는 쿨한 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>♈ 양자리:</strong>
            <p>정반대의 매력! 천칭자리가 "생각해보자"라고 하면 양자리가 "일단 해보자"라며 서로 없던 용기와 신중함을 배우게 해주는 성장 관계입니다. 천칭자리는 더 결단력 있게, 양자리는 더 신중하게 되는 WIN-WIN 커플입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 주의할 궁합</h4>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>천칭자리의 사교성과 게자리의 집돌이 성향이 "나가자" vs "집에 있자"로 충돌하는 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐐 염소자리:</strong>
            <p>천칭자리가 "예쁘면 되지"하면 염소자리가 "실용성은?"하며 가치관 차이로 답답해하는 관계가 될 수 있습니다.</p>
          </div>
        </div>`
    },
    8: {
        name: "전갈자리 (Scorpio)",
        period: "10월 23일 ~ 11월 21일",
        element: "물의 별자리",
        ruler: "명왕성, 화성",
        description: `<div class="intro-section">
지하세계의 왕 하데스(명왕성)와 전쟁의 신 아레스(화성)의 이중 지배를 받는 전갈자리. 그리스 신화의 불사조 피닉스처럼 죽음과 재생을 동시에 품은 신비로운 별자리입니다.
</div>

<div class="personality-section">
강렬한 에너지로 모든 것을 변화시키는 변화의 마법사들.
</div>

<div class="lifestyle-section">
<h4>🦂 전갈자리의 비밀 운영체제</h4>
<ul>
<li>SNS 프로필은 비공개, 카톡 상태메시지도 '의미심장'</li>
<li>남의 비밀은 귀신같이 알아내는 FBI 수준의 직관력</li>
<li>차가운 얼음 바깥, 뜨거운 용암 내면을 가진 인간 버전 빙산</li>
<li>첫만남: '왜 이렇게 차가울까?' → '내 사람' 인증 후: 의리의 끝판왕</li>
</ul>
</div>

<div class="character-section">
한번 마음을 열면 자신의 전부를 바칠 준비 완료.<br><br>
연애할 때는 소유욕이 강하지만 사랑에 빠지면 정말 진심으로 바치는 대박 로맨티스트입니다.
</div>`,
        traits: [
            "열정적이고 집중력 강함",
            "직관력과 통찰력 뛰어남",
            "비밀스럽고 신비로움",
            "극단적이고 집착적임"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>물의 깊은 유대감! 전갈자리와 게자리는 말하지 않아도 서로의 마음을 읽는 텔레파시 커플입니다. "요즘 어때?"라는 말 한마디에 담긴 진심을 알아차리고, 힘들 때 곁에서 묵묵히 지켜주는 평생의 동반자 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐟 물고기자리:</strong>
            <p>감정의 오케스트라! 전갈자리의 강렬함과 물고기자리의 순수함이 만나 "이런 사랑이 존재할 줄 몰랐어"를 느끼게 하는 로맨틱한 관계입니다. 서로의 감정을 100% 이해하고 공감하는 영혼의 짝꿍입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>강함과 안정의 만남! 전갈자리의 깊이와 황소자리의 현실감각이 만나 "너와 함께라면 무엇도 두렵지 않아"를 실감하는 든든한 관계입니다. 전갈자리가 열정을 쏟으면 황소자리가 현실적으로 받쳐주는 완벽한 팀워크를 보여줍니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 주의할 궁합</h4>
          
          <div class="compat-item">
            <strong>🦁 사자자리:</strong>
            <p>둘 다 강한 개성으로 "내가 주도권을 잡을 거야"를 두고 은근한 신경전이 벌어질 수 있는 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏺 물병자리:</strong>
            <p>전갈자리의 집착과 물병자리의 자유로움이 "너무 매달려" vs "너무 차가워"로 충돌하는 관계입니다.</p>
          </div>
        </div>`
    },
    9: {
        name: "사수자리 (Sagittarius)",
        period: "11월 22일 ~ 12월 21일",
        element: "불의 별자리",
        ruler: "목성",
        description: `<div class="intro-section">
더 높은 차원을 추구하는 목성의 축복을 받은 사수자리. 그리스 신화의 현명한 켄타우로스처럼 끝없이 새로운 지평선을 향해 달려가는 자유로운 탐험가들입니다.
</div>

<div class="personality-section">
미지의 것을 두려워하지 않고 오히려 반기는 철학자이자 모험가들.
</div>

<div class="lifestyle-section">
<h4>🏹 사수자리의 즉흥 모험신</h4>
<ul>
<li>금요일 오후 "내일 아침 비행기 있어, 가니?" → "그래, 가자!"</li>
<li>여행지에서 현지 사람들과 5분 만에 친구 되는 사교력</li>
<li>"이거 대박 신기하지 않아?" 연속 감탄하는 호기심 폭발</li>
<li>계획 틀어져도 "또 다른 재미있는 길이 열린 거네!" 긍정왕</li>
</ul>
</div>

<div class="character-section">
실패도 새로운 모험의 시작으로 받아들이는 인생 여행 라이브 스트리머.<br><br>
연애할 때는 "우리는 각자 자유롭게 살면서 함께 하는 거야"라는 바람처럼 자유로운 연인입니다.
</div>`,
        traits: [
            "낙천적이고 자유로운 영혼",
            "모험심과 탐구욕 강함",
            "철학적이고 이상주의적",
            "직설적이고 솔직함"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>♈ 양자리:</strong>
            <p>자유로운 모험가들! 사수자리와 양자리는 "인생은 한 번뿐이야!"를 외치며 세상을 탐험하는 활력 넘치는 커플입니다. 서로의 도전 정신을 응원하고, "너라면 뭐든 할 수 있어!"를 진심으로 믿어주는 든든한 동반자입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🦁 사자자리:</strong>
            <p>인생의 축제 메이커들! 사수자리의 낙천적 에너지와 사자자리의 화려함이 만나 "매일이 파티야!"를 실현시키는 핫한 커플입니다. 함께 여행 가면 현지에서 벌써 친구가 생기고, 어디서든 주목받는 인기 만점 듀오입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>지식과 모험의 만남! 사수자리가 "직접 가서 보자!"하면 쌍둥이자리가 "그거 알고 가자!"하며 완벽한 여행 계획을 세워주는 콤비입니다. 서로의 호기심을 자극하며 끊임없이 성장하는 자극적인 관계입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 주의할 궁합</h4>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>사수자리가 "즉흥적으로 가자"하면 처녀자리가 "계획부터 세우자"하며 접근 방식의 차이로 답답해하는 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐟 물고기자리:</strong>
            <p>사수자리의 직설적 화법과 물고기자리의 감수성이 "너무 무심해" vs "너무 예민해"로 상처 주고받는 관계가 될 수 있습니다.</p>
          </div>
        </div>`
    },
    10: {
        name: "염소자리 (Capricorn)",
        period: "12월 22일 ~ 1월 19일",
        element: "흙의 별자리",
        ruler: "토성",
        description: `<div class="intro-section">
시간과 인내의 신 크로노스(토성)의 엄격한 가르침을 받은 염소자리. 그리스 신화의 염소처럼 한 걸음씩 착실하게 높은 곳을 향해 오르는 야심찬 성취의 달인들입니다.
</div>

<div class="personality-section">
느리지만 확실하게, 전통을 소중히 여기면서도 현실적인 변화를 만들어가는 지혜로운 리더들.
</div>

<div class="lifestyle-section">
<h4>🐐 염소자리의 성공 공식</h4>
<ul>
<li>휴가 중에도 노트북 챙기는 '잠깐만, 이것만 할게' 일 중독자</li>
<li>20대부터 차근차근 인생 계획을 세우는 현실주의자</li>
<li>술 한잔 들어가면 '사실 나도 그러고 싶다' 고백하는 귀여운 면</li>
<li>명절에는 '내가 어릴 때는 말이야...' 스토리 필수 코스</li>
</ul>
</div>

<div class="character-section">
전통을 지키는 든든한 기둥 같은 존재.<br><br>
연애할 때는 '은퇴 후 어디서 살지'까지 계획하지만, 정작 중요한 건 말보다 행동으로 보여주는 진정한 로맨티스트입니다.
</div>`,
        traits: [
            "책임감 강하고 신뢰할 수 있음",
            "야심차고 목표 지향적",
            "현실적이고 실용적",
            "인내심과 자제력 뛰어남"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>안정감의 대명사! 염소자리와 황소자리는 "우리 진짜 잘살 것 같아"를 현실로 만드는 실속형 커플입니다. 염소자리가 야심차게 계획하면 황소자리가 차근차근 실현해나가며, 주변에서 부러워하는 모범적인 가정을 꾸려갑니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>완벽한 성공 공식! 염소자리의 목표 지향성과 처녀자리의 완벽주의가 만나 "우리가 하면 반드시 성공한다"를 증명하는 파워 커플입니다. 함께 사업을 해도, 가정을 꾸려도 모든 것이 체계적이고 완벽한 황금 조합입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>이성과 감성의 완벽한 밸런스! 염소자리가 "현실적으로 생각해"하면 게자리가 "마음은 어때?"라며 서로 없던 따뜻함과 계획성을 배우게 해주는 성장 관계입니다. 염소자리는 더 감성적으로, 게자리는 더 현실적으로 되는 WIN-WIN 커플입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 주의할 궁합</h4>
          
          <div class="compat-item">
            <strong>⚖️ 천칭자리:</strong>
            <p>염소자리가 "실용적이야"하면 천칭자리가 "아름다워야지"하며 가치관 차이로 충돌하는 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>♈ 양자리:</strong>
            <p>염소자리의 신중함과 양자리의 성급함이 "천천히 하자" vs "빨리 하자"로 속도 차이에 지치는 관계가 될 수 있습니다.</p>
          </div>
        </div>`
    },
    11: {
        name: "물병자리 (Aquarius)",
        period: "1월 20일 ~ 2월 18일",
        element: "공기의 별자리",
        ruler: "천왕성, 토성",
        description: `<div class="intro-section">
미래와 혁신의 신 우라노스(천왕성)의 영향을 받는 물병자리. 그리스 신화의 물병을 든 소년처럼 전 인류에게 새로운 시대의 지혜를 전하는 미래지향적인 인도주의자들입니다.
</div>

<div class="personality-section">
예측 불가능한 독창성으로 세상을 더 나은 곳으로 변화시키는 꿈의 설계자들.
</div>

<div class="lifestyle-section">
<h4>🏺 물병자리의 반전 문화</h4>
<ul>
<li>'남들이 오른쪽으로 가면 왼쪽으로' 당연하게 생각하는 반골 기질</li>
<li>10년 후를 예측하는 미래학자이자 신기술 얼리 어답터</li>
<li>친구는 많지만 '내 진짜 친구'는 한둘인 까다로운 사교성</li>
<li>'나도 내가 누군지 모르겠어' → 남들은 정확히 분석해주는 신기함</li>
</ul>
</div>

<div class="character-section">
자신은 모르겠다면서 남들은 척척 분석하는 신기한 능력 보유.<br><br>
연애할 때는 '사랑해'보다 '너 진짜 특별하다'가 더 진심 어린 표현인 독특한 로맨티스트입니다.
</div>`,
        traits: [
            "독립적이고 창의적",
            "진보적이고 혁신적 사고",
            "인도주의적 성향",
            "예측 불가능하고 독특함"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>아이디어 파트너들! 물병자리와 쌍둥이자리는 "이런 건 어때?"로 시작해서 세상에 없던 창의적인 프로젝트를 만들어내는 혁신 듀오입니다. 서로의 독특함을 이해하고 존중하며, "너는 정말 특별해"를 자주 느끼는 자극적인 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>⚖️ 천칭자리:</strong>
            <p>쿨하고 세련된 커플! 물병자리의 독창성과 천칭자리의 균형감이 만나 "우리 진짜 멋있지 않아?"를 보여주는 스타일리시한 관계입니다. 서로의 공간을 존중하며 "같이 있지만 따로"의 이상적인 관계를 실현합니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🦁 사자자리:</strong>
            <p>정반대의 끌림! 물병자리의 쿨함과 사자자리의 따뜻함이 만나 서로에게 없던 새로운 면을 발견하게 해주는 신선한 관계입니다. 사자자리는 더 개성 있게, 물병자리는 더 따뜻하게 변화하는 성장하는 커플입니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 주의할 궁합</h4>
          
          <div class="compat-item">
            <strong>🦂 전갈자리:</strong>
            <p>물병자리의 자유로움과 전갈자리의 집착이 "너무 차가워" vs "너무 매달려"로 충돌하는 관계입니다.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>물병자리가 "변화가 필요해"하면 황소자리가 "지금도 좋은데"하며 변화에 대한 태도 차이로 답답해하는 관계가 될 수 있습니다.</p>
          </div>
        </div>`
    },
    12: {
        name: "물고기자리 (Pisces)",
        period: "2월 19일 ~ 3월 20일",
        element: "물의 별자리",
        ruler: "해왕성, 목성",
        description: `<div class="intro-section">
마지막 별자리로서 12신의 지혜를 모두 가지고 태어난 물고기자리. 바다의 신 포세이돈(해왕성)의 축복을 받았습니다.
</div>

<div class="personality-section">
그리스 신화의 아프로디테처럼 사랑과 미의 아름다움을 아는 예술가들이며, 동시에 모든 상처를 치유하는 휴머니스트들.
</div>

<div class="lifestyle-section">
<h4>🐟 물고기자리의 감성 블로그</h4>
<ul>
<li>지하철에서 '오늘 날씨가 첫사랑 떠올리던 날 같네' 감성 스토리 제작</li>
<li>드라마 주인공이 울면 같이 울고, 친구 연애에 더 아파하는 공감 능력</li>
<li>"돈은 쓸 수 있을 때!" 충동구매 후 월말 라면 먹는 반전 매력</li>
<li>비 오는 날엔 '뜨거운 차와 감성적인 음악' 자동 연상</li>
</ul>
</div>

<div class="character-section">
모든 순간을 로맨틱하게 만드는 타고난 감성.<br><br>
연애할 때는 '이럴 때 이런 노래 들으면 어떨까?'라며 상대방의 일상을 영화로 만드는 로맨스 전문가입니다.
</div>`,
        traits: [
            "상상력과 창의력 풍부",
            "감수성이 예민하고 공감능력 높음",
            "예술적 재능과 직관력",
            "현실도피 경향과 우유부단함"
        ],
        compatibility: `<div class="compat-section">
          <h4>⭐ 최고의 궁합 ⭐</h4>
          
          <div class="compat-item">
            <strong>🦀 게자리:</strong>
            <p>감성의 소울메이트! 물고기자리와 게자리는 "우리 진짜 통한다"를 매순간 느끼는 힐링 커플입니다. 말하지 않아도 서로의 기분을 알아채고, 힘들 때는 묵묵히 안아주고, 기쁠 때는 함께 울어주는 감정 공유의 달인들입니다. 게자리가 현실적인 케어를 해주면 물고기자리가 감성적인 위로를 해주는 완벽한 역할분담을 보여주는 따뜻한 관계예요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🦂 전갈자리:</strong>
            <p>깊은 영혼의 만남! 물고기자리의 순수함과 전갈자리의 깊이가 만나 "이런 사랑이 존재했구나"를 깨닫게 해주는 운명적인 관계입니다. 서로의 감정을 100% 이해하고 받아들이며, 세상 그 누구보다 특별한 존재가 되어주는 영혼의 짝꿍입니다. 전갈자리의 보호 본능과 물고기자리의 순수함이 만나 서로에게 없어서는 안 될 존재가 되는 깊은 사랑을 나누는 커플이에요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐂 황소자리:</strong>
            <p>꿈과 현실의 아름다운 조화! 물고기자리의 상상력과 황소자리의 현실감각이 만나 "꿈을 현실로 만드는" 마법 같은 관계입니다. 물고기자리가 "이런 게 있으면 좋겠어"하면 황소자리가 "그럼 이렇게 해보자"라며 실제로 만들어주는 든든한 파트너십을 보여줍니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🌟 특별한 인연</h4>
          
          <div class="compat-item">
            <strong>🌾 처녀자리:</strong>
            <p>꿈과 현실의 완벽한 조화! 물고기자리가 "이런 꿈이 있어"하면 처녀자리가 "이렇게 하면 될 것 같아"라며 현실적인 방법을 제시해주는 보완 관계입니다. 물고기자리는 더 실용적으로, 처녀자리는 더 감성적으로 변화하는 성장하는 커플입니다. 서로 정반대 같지만 실제로는 완벽하게 맞아떨어지는 퍼즐 조각 같은 관계예요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🐐 염소자리:</strong>
            <p>감성과 현실의 만남! 물고기자리의 로맨틱함과 염소자리의 안정감이 만나 "사랑도 있고 미래도 있고"를 실현시키는 균형 잡힌 관계입니다. 염소자리가 현실적인 계획을 세우면 물고기자리가 그 안에 따뜻한 감성을 불어넣어주는 아름다운 팀워크를 보여줍니다.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>💔 조심할 궁합</h4>
          
          <div class="compat-item">
            <strong>👥 쌍둥이자리:</strong>
            <p>물고기자리가 "느낌적으로"하면 쌍둥이자리가 "논리적으로 생각해봐"하며 소통 방식의 차이로 답답해하는 관계입니다. 물고기자리의 직관적 사고와 쌍둥이자리의 논리적 사고가 "왜 이해 못 해?" vs "왜 설명 못 해?"로 충돌할 수 있어요. 하지만 서로 다른 방식을 인정하면 오히려 새로운 관점을 배울 수 있는 관계이기도 해요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏹 사수자리:</strong>
            <p>물고기자리의 섬세함과 사수자리의 직설적 화법이 "너무 상처받아" vs "그렇게 예민하게"로 상처 주고받는 관계가 될 수 있습니다. 사수자리의 솔직함이 물고기자리에게는 너무 날카롭게 느껴질 수 있어요.</p>
          </div>
          
          <div class="compat-item">
            <strong>🏺 물병자리:</strong>
            <p>물고기자리가 "감정적으로 생각해"하면 물병자리가 "객관적으로 봐야지"하며 접근 방식의 차이로 서로를 이해하기 어려운 관계입니다. 물고기자리의 감정 중심적 사고와 물병자리의 합리적 사고가 다른 언어를 쓰는 것처럼 느껴질 수 있어요.</p>
          </div>
        </div>
        
        <div class="compat-section">
          <h4>🤝 우정으로는 최고</h4>
          
          <div class="compat-item">
            <strong>⚖️ 천칭자리:</strong>
            <p>연애로는 결정력과 우유부단함의 차이가 있지만, 친구로는 완벽합니다! 물고기자리의 순수한 감성을 천칭자리가 아름답게 승화시켜주고, 천칭자리가 고민할 때 물고기자리가 따뜻하게 공감해주는 서로를 힐링시켜주는 좋은 친구 관계예요.</p>
          </div>
        </div>`
    }
};

// (이미 파일 상단에 정의됨)

// 모달 밖 클릭 시 닫기
window.closeModalOnOutside = function(event) {
    const modal = document.getElementById('zodiacModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// (이미 파일 상단에 정의됨)

// (이미 파일 상단에 정의됨)
