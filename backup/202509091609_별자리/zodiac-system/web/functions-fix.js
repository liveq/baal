/**
 * 함수 전역 등록 수정 스크립트
 * HTML onclick 이벤트에서 함수를 찾을 수 없는 문제 해결
 */

// DOMContentLoaded 대신 즉시 실행
(function() {
    console.log('Functions fix script loaded');
    
    
    // selectZodiac 함수를 전역으로 등록
    if (typeof window.selectZodiac !== 'function') {
        window.selectZodiac = function(zodiacId) {
            console.log('selectZodiac called with zodiacId:', zodiacId);
            
            // 현재 별자리 ID 저장
            window.currentZodiacId = zodiacId;
            
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
                if (typeof zodiacAPI !== 'undefined' && zodiacAPI.zodiacSigns) {
                    const zodiacInfo = zodiacAPI.zodiacSigns[zodiacId - 1];
                    if (zodiacInfo) {
                        const zodiacIcon = document.getElementById('zodiacIcon');
                        const zodiacTitle = document.getElementById('zodiacTitle');
                        const zodiacPeriod = document.getElementById('zodiacPeriod');
                        
                        if (zodiacIcon) zodiacIcon.textContent = zodiacInfo.symbol;
                        if (zodiacTitle) zodiacTitle.textContent = zodiacInfo.name;
                        if (zodiacPeriod) zodiacPeriod.textContent = `${zodiacInfo.start} ~ ${zodiacInfo.end}`;
                    }
                }
                
                // 오늘 탭 표시
                if (typeof window.showTab === 'function') {
                    window.showTab('today');
                }
                
                // 운세 데이터 로드
                if (typeof window.loadDailyFortune === 'function') {
                    window.loadDailyFortune(zodiacId);
                }
                
                // 운세 섹션으로 스크롤
                fortuneDisplay.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }
    
    // showZodiacModal 함수 백업/패치 (zodiac.js에서 이미 정의된 경우 스킵)
    if (typeof window.showZodiacModal !== 'function') {
        console.log('🔧 showZodiacModal 함수가 없어서 functions-fix.js에서 생성');
        window.showZodiacModal = function(zodiacId, retryCount = 0) {
            console.log('🔧 [BACKUP] showZodiacModal 호출됨 - zodiacId:', zodiacId, 'retryCount:', retryCount);
            
            // DOM 요소 존재 확인
            const modal = document.getElementById('zodiacModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            console.log('🔧 [BACKUP] 모달 DOM 요소 확인:', {
                modal: !!modal,
                modalTitle: !!modalTitle,
                modalBody: !!modalBody
            });
            
            if (!modal || !modalTitle || !modalBody) {
                console.error('🔧 [BACKUP] 모달 DOM 요소를 찾을 수 없습니다');
                return false;
            }
            
            // zodiacDescriptions가 준비되지 않았으면 재시도
            // 빈 객체인지 확인 (Object.keys로 실제 데이터 존재 여부 체크)
            if (!window.zodiacDescriptions || Object.keys(window.zodiacDescriptions).length === 0) {
                if (retryCount < 10) { // 최대 10번 재시도
                    console.log('🔧 [BACKUP] zodiacDescriptions 로딩 대기 중... 재시도:', retryCount + 1);
                    setTimeout(() => {
                        window.showZodiacModal(zodiacId, retryCount + 1);
                    }, 100);
                    return false;
                } else {
                    console.error('🔧 [BACKUP] zodiacDescriptions 로딩 실패 - 최대 재시도 횟수 초과');
                    return false;
                }
            }
            
            const info = window.zodiacDescriptions[zodiacId];
            if (!info) {
                console.error('🔧 [BACKUP] 별자리 정보를 찾을 수 없습니다:', zodiacId);
                return false;
            }
            
            try {
                modalTitle.innerHTML = `${info.name}`;
                modalBody.innerHTML = `
                    <p><strong>기간:</strong> ${info.period}</p>
                    <p><strong>원소:</strong> ${info.element}</p>
                    <p><strong>지배 행성:</strong> ${info.ruler}</p>
                    
                    <h3>📖 별자리 설명</h3>
                    <p>${info.description}</p>
                    
                    <h3>✨ 주요 특징</h3>
                    <ul>
                        ${info.traits.map(trait => `<li>${trait}</li>`).join('')}
                    </ul>
                    
                    <h3>💕 궁합</h3>
                    <div>${info.compatibility}</div>
                `;
                
                modal.style.display = 'block';
                console.log('🔧 [BACKUP] 모달 표시 완료');
                return true;
                
            } catch (error) {
                console.error('🔧 [BACKUP] 모달 설정 중 오류 발생:', error);
                return false;
            }
        };
    } else {
        console.log('✅ showZodiacModal 함수가 이미 정의되어 있음 (zodiac.js)');
    }
    
    // closeZodiacModal 함수
    if (typeof window.closeZodiacModal !== 'function') {
        window.closeZodiacModal = function() {
            console.log('🔧 [BACKUP] closeZodiacModal 호출됨');
            const modal = document.getElementById('zodiacModal');
            if (modal) {
                modal.style.display = 'none';
                console.log('🔧 [BACKUP] 모달 닫기 완료');
            }
        };
    }
    
    // closeModalOnOutside 함수 백업
    if (typeof window.closeModalOnOutside !== 'function') {
        window.closeModalOnOutside = function(event) {
            console.log('🔧 [BACKUP] closeModalOnOutside 호출됨');
            const modal = document.getElementById('zodiacModal');
            if (event.target === modal) {
                modal.style.display = 'none';
                console.log('🔧 [BACKUP] 모달 외부 클릭으로 닫기 완료');
            }
        };
    }
    
    // showMagnifier 함수 (CSS로 처리되지만 명시적 등록)
    if (typeof window.showMagnifier !== 'function') {
        window.showMagnifier = function(card, zodiacId) {
            // CSS hover로 자동 처리됨
        };
    }
    
    // hideMagnifier 함수 (CSS로 처리되지만 명시적 등록)
    if (typeof window.hideMagnifier !== 'function') {
        window.hideMagnifier = function(card) {
            // CSS hover로 자동 처리됨
        };
    }
    
    // showIntroPage 함수 추가
    if (typeof window.showIntroPage !== 'function') {
        window.showIntroPage = function() {
            console.log('showIntroPage called from functions-fix.js');
            
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
            
            // 현재 별자리 ID 초기화
            window.currentZodiacId = null;
            
            console.log('Successfully returned to intro page');
        };
    }
    
    // 함수 로딩 상태 검증
    const functionsToCheck = [
        'selectZodiac',
        'showZodiacModal',
        'closeZodiacModal',
        'closeModalOnOutside',
        'showMagnifier',
        'hideMagnifier',
        'showIntroPage'
    ];
    
    console.log('📋 함수 로딩 상태 검증:');
    let allLoaded = true;
    functionsToCheck.forEach(funcName => {
        const isLoaded = typeof window[funcName] === 'function';
        console.log(`${isLoaded ? '✅' : '❌'} ${funcName}: ${isLoaded ? 'OK' : 'MISSING'}`);
        if (!isLoaded) allLoaded = false;
    });
    
    if (allLoaded) {
        console.log('🎉 모든 필수 함수가 성공적으로 로드되었습니다!');
    } else {
        console.error('⚠️ 일부 함수가 로드되지 않았습니다');
    }
    
    // zodiacDescriptions 상태도 확인
    setTimeout(() => {
        console.log('📊 zodiacDescriptions 상태 최종 확인:', {
            exists: !!window.zodiacDescriptions,
            type: typeof window.zodiacDescriptions,
            hasKeys: window.zodiacDescriptions ? Object.keys(window.zodiacDescriptions).length : 0
        });
    }, 500);
    
    console.log('🔧 functions-fix.js 로딩 완료');
})();