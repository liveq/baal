/**
 * 운세 기준일 선택 기능 (슬롯머신 스타일)
 */

// 전역 변수로 선택된 날짜 저장
window.selectedFortuneDate = {
    year: null,
    month: null,
    day: null
};

// 운세 날짜 초기화 (오늘 날짜로) - 전역 함수로 등록
window.initFortuneDate = function() {
    const today = new Date();
    window.selectedFortuneDate.year = today.getFullYear();
    window.selectedFortuneDate.month = today.getMonth() + 1;
    window.selectedFortuneDate.day = today.getDate();
    updateFortuneDateInput();
}

// 운세 날짜 입력 필드 업데이트
function updateFortuneDateInput() {
    const input = document.getElementById('fortuneDate');
    if (input && window.selectedFortuneDate.year) {
        const dateStr = `${window.selectedFortuneDate.year}-${String(window.selectedFortuneDate.month).padStart(2, '0')}-${String(window.selectedFortuneDate.day).padStart(2, '0')}`;
        input.value = dateStr;
    }
}

// 입력 필드 이벤트 리스너 초기화
function initInputListeners() {
    const input = document.getElementById('fortuneDate');
    if (!input) return;

    let originalValue = ''; // 원래 값 저장
    let isEditing = false; // 편집 상태 추적

    // 포커스 시 원래 값 저장
    input.addEventListener('focus', function() {
        originalValue = this.value;
        isEditing = false;
    });

    // 키 입력 시 기존 값 지우고 새로 시작
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // ESC: 원래 값으로 복원
            this.value = originalValue;
            this.blur();
            isEditing = false;
        } else if (e.key === 'Enter') {
            // Enter: 날짜 적용
            e.preventDefault();
            applyDateFromInput();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            // 백스페이스/삭제는 정상 동작
            isEditing = true;
        } else if (e.key.length === 1 && /[0-9]/.test(e.key)) {
            // 숫자 입력 시: 편집 중이 아니면 기존 값 지우고 시작
            if (!isEditing) {
                e.preventDefault();
                this.value = e.key;
                isEditing = true;
            }
        }
    });

    // 입력 시 자동 포맷팅
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/[^0-9]/g, ''); // 숫자만 추출

        if (value.length > 8) {
            value = value.substring(0, 8);
        }

        if (value.length >= 4) {
            let formatted = value.substring(0, 4);
            if (value.length > 4) formatted += '-' + value.substring(4, 6);
            if (value.length > 6) formatted += '-' + value.substring(6, 8);
            this.value = formatted;
        } else {
            this.value = value;
        }
    });

    // 포커스 해제 시 편집 상태 초기화
    input.addEventListener('blur', function() {
        isEditing = false;
    });
}

// 입력 필드 값으로 날짜 적용
function applyDateFromInput() {
    const input = document.getElementById('fortuneDate');
    if (!input || !input.value) return;

    const numericValue = input.value.replace(/[^0-9]/g, '');

    if (numericValue.length < 8) {
        showToast('날짜를 8자리로 입력해주세요 (예: 20251225)');
        return;
    }

    const year = parseInt(numericValue.substring(0, 4));
    const month = parseInt(numericValue.substring(4, 6));
    const day = parseInt(numericValue.substring(6, 8));

    if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
        showToast('올바른 날짜를 입력해주세요');
        return;
    }

    // 날짜 유효성 검사
    const selectedDate = new Date(year, month - 1, day);
    if (selectedDate.getFullYear() !== year || selectedDate.getMonth() !== month - 1 || selectedDate.getDate() !== day) {
        showToast('존재하지 않는 날짜입니다');
        return;
    }

    // 2025-01-01 이전 체크
    const minDate = new Date(2025, 0, 1);
    if (selectedDate < minDate) {
        showToast('운세 데이터는 2025년 1월 1일부터 제공됩니다.');
        return;
    }

    window.selectedFortuneDate.year = year;
    window.selectedFortuneDate.month = month;
    window.selectedFortuneDate.day = day;

    updateFortuneDateInput();

    // 현재 활성화된 탭의 운세 다시 로드
    if (window.reloadCurrentTabFortune) {
        window.reloadCurrentTabFortune();
    }

    input.blur();
}

// 날짜 선택 팝업 열기
window.openDateSelectorPopup = function() {
    const popup = document.getElementById('fortuneDateSelectorPopup');
    if (!popup) return;

    popup.style.display = 'flex';

    if (!window.selectedFortuneDate.year) {
        window.initFortuneDate();
    }

    generateSlots();

    // 애니메이션 없이 즉시 선택된 위치로 이동
    setTimeout(() => {
        scrollToSelectedInstant('yearSlot', window.selectedFortuneDate.year);
        scrollToSelectedInstant('monthSlot', window.selectedFortuneDate.month);
        scrollToSelectedInstant('daySlot', window.selectedFortuneDate.day);
    }, 10);
};

// 날짜 선택 팝업 닫기
window.closeFortuneDatePopup = function() {
    const popup = document.getElementById('fortuneDateSelectorPopup');
    if (popup) {
        popup.style.display = 'none';
    }
};

// 슬롯 생성
function generateSlots() {
    generateYearSlot();
    generateMonthSlot();
    generateDaySlot();
}

// 년도 슬롯 생성 (무한 스크롤)
function generateYearSlot() {
    const container = document.getElementById('yearSlot');
    if (!container) return;

    container.innerHTML = '';

    // 1950~2050 범위를 3번 반복하여 무한 스크롤 효과
    for (let repeat = 0; repeat < 3; repeat++) {
        for (let year = 1950; year <= 2050; year++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            item.textContent = year;
            item.dataset.value = year;

            if (year === window.selectedFortuneDate.year && repeat === 1) {
                item.classList.add('selected');
            }

            item.onclick = () => selectFortuneYear(year);
            container.appendChild(item);
        }
    }

    // 스크롤 이벤트
    container.addEventListener('scroll', debounce(() => {
        handleInfiniteScroll(container, 'year');
        updateSelectedFromScroll('yearSlot', 'year');
    }, 100));
}

// 월 슬롯 생성 (무한 스크롤)
function generateMonthSlot() {
    const container = document.getElementById('monthSlot');
    if (!container) return;

    container.innerHTML = '';

    // 1~12월을 여러 번 반복
    for (let repeat = 0; repeat < 5; repeat++) {
        for (let month = 1; month <= 12; month++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            item.textContent = month;
            item.dataset.value = month;

            if (month === window.selectedFortuneDate.month && repeat === 2) {
                item.classList.add('selected');
            }

            item.onclick = () => selectFortuneMonth(month);
            container.appendChild(item);
        }
    }

    container.addEventListener('scroll', debounce(() => {
        handleInfiniteScroll(container, 'month');
        updateSelectedFromScroll('monthSlot', 'month');
    }, 100));
}

// 일 슬롯 생성 (무한 스크롤)
function generateDaySlot() {
    const container = document.getElementById('daySlot');
    if (!container) return;

    const daysInMonth = new Date(window.selectedFortuneDate.year, window.selectedFortuneDate.month, 0).getDate();

    container.innerHTML = '';

    // 1~daysInMonth을 여러 번 반복
    for (let repeat = 0; repeat < 5; repeat++) {
        for (let day = 1; day <= daysInMonth; day++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            item.textContent = day;
            item.dataset.value = day;

            if (day === window.selectedFortuneDate.day && repeat === 2) {
                item.classList.add('selected');
            }

            item.onclick = () => selectFortuneDay(day);
            container.appendChild(item);
        }
    }

    // 선택된 일이 해당 월의 일수를 초과하면 조정
    if (window.selectedFortuneDate.day > daysInMonth) {
        selectDay(daysInMonth);
    }

    container.addEventListener('scroll', debounce(() => {
        handleInfiniteScroll(container, 'day');
        updateSelectedFromScroll('daySlot', 'day');
    }, 100));
}

// 무한 스크롤 처리
function handleInfiniteScroll(container, type) {
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    let totalItems, itemsPerCycle;

    if (type === 'year') {
        itemsPerCycle = 101; // 1950~2050
    } else if (type === 'month') {
        itemsPerCycle = 12;
    } else if (type === 'day') {
        const daysInMonth = new Date(window.selectedFortuneDate.year, window.selectedFortuneDate.month, 0).getDate();
        itemsPerCycle = daysInMonth;
    }

    const itemHeight = 40;
    const cycleHeight = itemsPerCycle * itemHeight;

    // 상단 근처에 도달하면 중간으로 이동
    if (scrollTop < cycleHeight) {
        container.scrollTop = scrollTop + cycleHeight;
    }
    // 하단 근처에 도달하면 중간으로 이동
    else if (scrollTop > scrollHeight - clientHeight - cycleHeight) {
        container.scrollTop = scrollTop - cycleHeight;
    }
}

// 년도 선택 (운세 기준일용)
function selectFortuneYear(year) {
    window.selectedFortuneDate.year = year;
    scrollToSelected('yearSlot', year);
    generateDaySlot(); // 윤년 대응
}

// 월 선택 (운세 기준일용)
function selectFortuneMonth(month) {
    window.selectedFortuneDate.month = month;
    scrollToSelected('monthSlot', month);
    generateDaySlot(); // 월별 일수 변경 대응
}

// 일 선택 (운세 기준일용)
function selectFortuneDay(day) {
    window.selectedFortuneDate.day = day;
    scrollToSelected('daySlot', day);
}

// 선택된 항목으로 스크롤 (애니메이션)
function scrollToSelected(containerId, value) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = container.querySelectorAll('.slot-item');
    items.forEach(item => item.classList.remove('selected'));

    const middleItems = Array.from(items).filter(item => parseInt(item.dataset.value) === value);
    const targetItem = middleItems[Math.floor(middleItems.length / 2)];

    if (targetItem) {
        targetItem.classList.add('selected');

        const containerHeight = container.clientHeight;
        const itemOffset = targetItem.offsetTop;
        const itemHeight = targetItem.clientHeight;
        const scrollTo = itemOffset - (containerHeight / 2) + (itemHeight / 2);

        container.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
        });
    }
}

// 선택된 항목으로 즉시 스크롤 (애니메이션 없음)
function scrollToSelectedInstant(containerId, value) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = container.querySelectorAll('.slot-item');
    items.forEach(item => item.classList.remove('selected'));

    const middleItems = Array.from(items).filter(item => parseInt(item.dataset.value) === value);
    const targetItem = middleItems[Math.floor(middleItems.length / 2)];

    if (targetItem) {
        targetItem.classList.add('selected');

        const containerHeight = container.clientHeight;
        const itemOffset = targetItem.offsetTop;
        const itemHeight = targetItem.clientHeight;
        const scrollTo = itemOffset - (containerHeight / 2) + (itemHeight / 2);

        container.scrollTop = scrollTo; // 즉시 이동
    }
}

// 스크롤 위치로부터 선택 업데이트
function updateSelectedFromScroll(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    const items = container.querySelectorAll('.slot-item');
    let closestItem = null;
    let closestDistance = Infinity;

    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - itemCenterY);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestItem = item;
        }
    });

    if (closestItem) {
        const value = parseInt(closestItem.dataset.value);

        items.forEach(item => item.classList.remove('selected'));

        // 같은 값을 가진 모든 항목에 selected 추가
        items.forEach(item => {
            if (parseInt(item.dataset.value) === value) {
                item.classList.add('selected');
            }
        });

        if (type === 'year') {
            window.selectedFortuneDate.year = value;
        } else if (type === 'month') {
            window.selectedFortuneDate.month = value;
        } else if (type === 'day') {
            window.selectedFortuneDate.day = value;
        }
    }
}

// Debounce 헬퍼
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 확인 버튼 클릭
window.applyFortuneDate = function() {
    if (!window.selectedFortuneDate.year || !window.selectedFortuneDate.month || !window.selectedFortuneDate.day) {
        showToast('날짜를 모두 선택해주세요.');
        return;
    }

    const selectedDate = new Date(window.selectedFortuneDate.year, window.selectedFortuneDate.month - 1, window.selectedFortuneDate.day);
    const minDate = new Date(2025, 0, 1);

    if (selectedDate < minDate) {
        showToast('운세 데이터는 2025년 1월 1일부터 제공됩니다.');
        return;
    }

    updateFortuneDateInput();
    window.closeFortuneDatePopup();

    // 현재 활성화된 탭의 운세 다시 로드
    if (window.reloadCurrentTabFortune) {
        window.reloadCurrentTabFortune();
    }
};

// 초기화 버튼 클릭
window.resetFortuneDate = function() {
    window.initFortuneDate();

    // 현재 활성화된 탭의 운세 다시 로드
    if (window.reloadCurrentTabFortune) {
        window.reloadCurrentTabFortune();
    }
};

// 토스트 메시지 표시
function showToast(message) {
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.initFortuneDate();
        initInputListeners();
    });
} else {
    window.initFortuneDate();
    initInputListeners();
}
