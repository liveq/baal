const { chromium } = require('playwright');

async function testPalgwaeSimple() {
    console.log('🔍 팔괘 호버 문제 진단...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();

    // 콘솔 및 에러 모니터링
    page.on('console', msg => console.log(`📊 [${msg.type()}] ${msg.text()}`));
    page.on('pageerror', error => console.log(`❌ Error: ${error}`));

    try {
        await page.goto('http://localhost:8080/palgwae.html');
        await page.waitForLoadState('networkidle');

        console.log('✅ 페이지 로드 완료\n');

        // z-index와 레이어링 문제 확인
        console.log('🔍 CSS 레이어링 분석...');

        const svgZIndex = await page.evaluate(() => {
            const svg = document.querySelector('.bagua-svg');
            return window.getComputedStyle(svg).zIndex;
        });

        const buttonWrapperZIndex = await page.evaluate(() => {
            const wrapper = document.querySelector('.bagua-button-wrapper');
            return window.getComputedStyle(wrapper).zIndex;
        });

        const symbolZIndex = await page.evaluate(() => {
            const symbol = document.querySelector('text[onmouseover]');
            return symbol ? window.getComputedStyle(symbol).zIndex : 'SVG 내부 요소';
        });

        console.log(`SVG z-index: ${svgZIndex}`);
        console.log(`Button wrapper z-index: ${buttonWrapperZIndex}`);
        console.log(`Symbol z-index: ${symbolZIndex}`);

        // 요소 위치 확인
        console.log('\n🎯 요소 위치 분석...');

        const symbolPosition = await page.evaluate(() => {
            const symbol = document.querySelector('text[onmouseover*="건"]');
            if (symbol) {
                const rect = symbol.getBoundingClientRect();
                return {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                };
            }
            return null;
        });

        const buttonPosition = await page.evaluate(() => {
            const button = document.querySelector('.bagua-pos.pos-1');
            if (button) {
                const rect = button.getBoundingClientRect();
                return {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                };
            }
            return null;
        });

        console.log('☰ (건) 심볼 위치:', symbolPosition);
        console.log('별자리 버튼 위치:', buttonPosition);

        // 겹침 확인
        if (symbolPosition && buttonPosition) {
            const overlap = !(symbolPosition.x + symbolPosition.width < buttonPosition.x ||
                            buttonPosition.x + buttonPosition.width < symbolPosition.x ||
                            symbolPosition.y + symbolPosition.height < buttonPosition.y ||
                            buttonPosition.y + buttonPosition.height < symbolPosition.y);
            console.log(`요소 겹침 여부: ${overlap ? '❌ 겹침' : '✅ 안겹침'}`);
        }

        // pointer-events 확인
        console.log('\n🖱️ 포인터 이벤트 설정 확인...');

        const symbolPointerEvents = await page.evaluate(() => {
            const symbol = document.querySelector('text[onmouseover*="건"]');
            return symbol ? window.getComputedStyle(symbol).pointerEvents : 'none';
        });

        const buttonWrapperPointerEvents = await page.evaluate(() => {
            const wrapper = document.querySelector('.bagua-button-wrapper');
            return wrapper ? window.getComputedStyle(wrapper).pointerEvents : 'none';
        });

        console.log(`심볼 pointer-events: ${symbolPointerEvents}`);
        console.log(`버튼 래퍼 pointer-events: ${buttonWrapperPointerEvents}`);

        // 직접 JavaScript 함수 호출 테스트
        console.log('\n🧪 JavaScript 함수 직접 테스트...');

        const directTest = await page.evaluate(() => {
            // showTrigramName 함수 직접 호출
            try {
                const mockEvent = { target: null };
                window.showTrigramName(mockEvent, '건', 300, 150);

                const text = document.getElementById('trigramNameText');
                return {
                    exists: !!text,
                    display: text ? text.style.display : 'none',
                    content: text ? text.textContent : '',
                    x: text ? text.getAttribute('x') : '',
                    y: text ? text.getAttribute('y') : ''
                };
            } catch (error) {
                return { error: error.message };
            }
        });

        console.log('직접 함수 호출 결과:', directTest);

        // hideTrigramName 함수 테스트
        const hideTest = await page.evaluate(() => {
            try {
                window.hideTrigramName();
                const text = document.getElementById('trigramNameText');
                return {
                    display: text ? text.style.display : 'none'
                };
            } catch (error) {
                return { error: error.message };
            }
        });

        console.log('함수 숨기기 결과:', hideTest);

        // 수동 호버 시뮬레이션 (CSS만 사용)
        console.log('\n🎭 CSS 기반 수동 호버 시뮬레이션...');

        await page.evaluate(() => {
            const text = document.getElementById('trigramNameText');
            if (text) {
                text.textContent = '건';
                text.setAttribute('x', '300');
                text.setAttribute('y', '150');
                text.style.display = 'block';
            }
        });

        await page.waitForTimeout(2000);
        console.log('✅ 수동으로 라벨 표시함 (2초간)');

        await page.evaluate(() => {
            const text = document.getElementById('trigramNameText');
            if (text) {
                text.style.display = 'none';
            }
        });

        console.log('✅ 수동으로 라벨 숨김');

        // 스크린샷 저장
        await page.screenshot({ path: 'D:\\code\\baal\\palgwae-diagnosis.png' });
        console.log('\n📸 진단 스크린샷 저장됨');

        console.log('\n⏳ 브라우저를 5초간 열어둡니다...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.log(`❌ 테스트 오류: ${error.message}`);
    } finally {
        await browser.close();
    }
}

testPalgwaeSimple().catch(console.error);