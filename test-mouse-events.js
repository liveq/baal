const { chromium } = require('playwright');

async function testMouseEvents() {
    console.log('🖱️ 마우스 이벤트 심층 분석...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080/palgwae.html');
        await page.waitForLoadState('networkidle');

        console.log('✅ 페이지 로드 완료\n');

        // 이벤트 리스너 확인
        console.log('🔍 이벤트 리스너 확인...');

        const eventListeners = await page.evaluate(() => {
            const symbol = document.querySelector('text[onmouseover*="건"]');
            if (symbol) {
                return {
                    onmouseover: symbol.getAttribute('onmouseover'),
                    onmouseout: symbol.getAttribute('onmouseout'),
                    hasMouseoverAttribute: symbol.hasAttribute('onmouseover'),
                    hasMouseoutAttribute: symbol.hasAttribute('onmouseout')
                };
            }
            return null;
        });

        console.log('☰ (건) 심볼 이벤트:', eventListeners);

        // 실제 마우스 좌표로 이벤트 발생시키기
        console.log('\n🎯 정확한 좌표로 마우스 이벤트 테스트...');

        const symbolBounds = await page.evaluate(() => {
            const symbol = document.querySelector('text[onmouseover*="건"]');
            if (symbol) {
                const rect = symbol.getBoundingClientRect();
                return {
                    centerX: rect.x + rect.width / 2,
                    centerY: rect.y + rect.height / 2,
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom
                };
            }
            return null;
        });

        console.log('심볼 중심 좌표:', symbolBounds);

        if (symbolBounds) {
            // 정확한 좌표로 마우스 이동
            console.log('🖱️ 심볼 중심으로 마우스 이동...');
            await page.mouse.move(symbolBounds.centerX, symbolBounds.centerY);
            await page.waitForTimeout(1000);

            // 라벨 상태 확인
            const labelAfterMove = await page.evaluate(() => {
                const text = document.getElementById('trigramNameText');
                return {
                    display: text ? text.style.display : 'none',
                    content: text ? text.textContent : '',
                    visible: text ? text.style.display !== 'none' : false
                };
            });

            console.log('마우스 이동 후 라벨 상태:', labelAfterMove);

            // 직접 DOM 이벤트 발생시키기
            console.log('\n⚡ 직접 DOM 이벤트 발생...');

            const domEventResult = await page.evaluate(() => {
                const symbol = document.querySelector('text[onmouseover*="건"]');
                if (symbol) {
                    // mouseover 이벤트 생성 및 발생
                    const event = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    symbol.dispatchEvent(event);

                    // 결과 확인
                    const text = document.getElementById('trigramNameText');
                    return {
                        eventDispatched: true,
                        display: text ? text.style.display : 'none',
                        content: text ? text.textContent : '',
                        visible: text ? text.style.display !== 'none' : false
                    };
                }
                return { eventDispatched: false };
            });

            console.log('DOM 이벤트 발생 결과:', domEventResult);

            // 잠시 대기
            await page.waitForTimeout(2000);

            // mouseout 이벤트 발생
            const mouseoutResult = await page.evaluate(() => {
                const symbol = document.querySelector('text[onmouseover*="건"]');
                if (symbol) {
                    const event = new MouseEvent('mouseout', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    symbol.dispatchEvent(event);

                    const text = document.getElementById('trigramNameText');
                    return {
                        display: text ? text.style.display : 'none',
                        visible: text ? text.style.display !== 'none' : false
                    };
                }
                return null;
            });

            console.log('mouseout 후 상태:', mouseoutResult);
        }

        // 모든 팔괘 심볼에 대해 이벤트 테스트
        console.log('\n🔄 모든 팔괘 심볼 이벤트 테스트...');

        const allSymbols = await page.evaluate(() => {
            const symbols = document.querySelectorAll('text[onmouseover]');
            return Array.from(symbols).map(symbol => ({
                symbol: symbol.textContent,
                onmouseover: symbol.getAttribute('onmouseover'),
                x: symbol.getAttribute('x'),
                y: symbol.getAttribute('y')
            }));
        });

        console.log('발견된 모든 심볼:', allSymbols);

        // 각 심볼에 대해 이벤트 테스트
        for (const symbolData of allSymbols.slice(0, 3)) { // 처음 3개만 테스트
            console.log(`\n🧪 ${symbolData.symbol} 심볼 테스트...`);

            const testResult = await page.evaluate((data) => {
                const symbols = document.querySelectorAll('text[onmouseover]');
                const symbol = Array.from(symbols).find(s => s.textContent === data.symbol);

                if (symbol) {
                    // mouseover 이벤트 발생
                    const event = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    symbol.dispatchEvent(event);

                    const text = document.getElementById('trigramNameText');
                    const result = {
                        symbol: data.symbol,
                        content: text ? text.textContent : '',
                        visible: text ? text.style.display !== 'none' : false,
                        x: text ? text.getAttribute('x') : '',
                        y: text ? text.getAttribute('y') : ''
                    };

                    // mouseout으로 정리
                    const outEvent = new MouseEvent('mouseout', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    symbol.dispatchEvent(outEvent);

                    return result;
                }
                return null;
            }, symbolData);

            console.log(`  결과:`, testResult);
        }

        // 최종 스크린샷
        await page.screenshot({ path: 'D:\\code\\baal\\mouse-events-test.png' });
        console.log('\n📸 마우스 이벤트 테스트 스크린샷 저장됨');

        console.log('\n⏳ 브라우저를 3초간 열어둡니다...');
        await page.waitForTimeout(3000);

    } catch (error) {
        console.log(`❌ 테스트 오류: ${error.message}`);
    } finally {
        await browser.close();
    }
}

testMouseEvents().catch(console.error);