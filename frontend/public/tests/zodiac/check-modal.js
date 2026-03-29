// 브라우저 콘솔에서 실행할 수 있는 체크 스크립트
console.log('=== 모달 시스템 상태 체크 ===');

// 1. 함수 존재 확인
console.log('1. showZodiacModal 함수:', typeof window.showZodiacModal);

// 2. zodiacDescriptions 상태
console.log('2. zodiacDescriptions 상태:');
console.log('  - 존재:', !!window.zodiacDescriptions);
console.log('  - 타입:', typeof window.zodiacDescriptions);
console.log('  - null인가?:', window.zodiacDescriptions === null);
console.log('  - 키 개수:', window.zodiacDescriptions ? Object.keys(window.zodiacDescriptions).length : 0);

// 3. DOM 요소 확인
console.log('3. DOM 요소:');
console.log('  - modal:', !!document.getElementById('zodiacModal'));
console.log('  - title:', !!document.getElementById('modalTitle'));
console.log('  - body:', !!document.getElementById('modalBody'));

// 4. 테스트 실행
console.log('4. 모달 열기 테스트 (양자리):');
if (window.showZodiacModal) {
    window.showZodiacModal(1);
    setTimeout(() => {
        const modal = document.getElementById('zodiacModal');
        if (modal && modal.style.display === 'block') {
            console.log('✅ 모달이 열렸습니다!');
        } else {
            console.log('❌ 모달이 열리지 않았습니다.');
        }
    }, 1500);
}

// 5. 데이터 샘플 확인
if (window.zodiacDescriptions && window.zodiacDescriptions[1]) {
    console.log('5. 양자리 데이터 샘플:', window.zodiacDescriptions[1].name);
}