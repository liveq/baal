/**
 * 초기화 스크립트
 * 모든 전역 함수를 window 객체에 명시적으로 등록
 */

// 페이지 로드 완료 후 실행
window.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing zodiac system...');
    
    // API가 로드되었는지 확인
    if (typeof zodiacAPI === 'undefined') {
        console.error('zodiacAPI is not loaded!');
        return;
    }
    
    console.log('zodiacAPI loaded successfully');
    
    // 주요 함수들이 window에 등록되었는지 확인
    const requiredFunctions = [
        'selectZodiac',
        'findZodiac',
        'showTab',
        'checkCompatibility',
        'toggleNav',
        'shareResult',
        'showZodiacModal',
        'closeZodiacModal',
        'showMagnifier',
        'hideMagnifier',
        'showIntroPage'
    ];
    
    let allFunctionsLoaded = true;
    requiredFunctions.forEach(func => {
        if (typeof window[func] === 'function') {
            console.log('✓', func, 'is loaded');
        } else {
            console.error('✗', func, 'is NOT loaded');
            allFunctionsLoaded = false;
        }
    });
    
    if (allFunctionsLoaded) {
        console.log('All functions loaded successfully!');
    } else {
        console.error('Some functions failed to load');
    }
});

// 디버그용 테스트 함수
window.testZodiacSystem = function() {
    console.log('Testing zodiac system...');
    console.log('Current zodiac ID:', window.currentZodiacId || 'none');
    console.log('Available zodiac signs:', zodiacAPI.zodiacSigns);
    
    // 양자리 선택 테스트
    if (window.selectZodiac) {
        console.log('Testing selectZodiac(1)...');
        window.selectZodiac(1);
    }
};