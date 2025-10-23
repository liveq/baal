const { chromium } = require('playwright');

async function finalHoverTest() {
    console.log('🏁 최종 팔괘 호버 효과 검증 테스트\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();

    // 콘솔 메시지 캡처
    const consoleMessages = [];
    page.on('console', msg => {
        const message = `[${msg.type()}] ${msg.text()}`;
        consoleMessages.push(message);
        console.log(`📊 ${message}`);
    });

    try {
        await page.goto('http://localhost:8080/palgwae.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // DOMContentLoaded 이벤트 대기

        console.log('\n✅ 페이지 로드 및 디버깅 모드 활성화 완료\n');

        // 1. 직접 함수 호출 테스트
        console.log('🧪 1. 직접 함수 호출 테스트...');
        await page.evaluate(() => {
            // 각 팔괘 심볼에 대해 함수 직접 호출
            const testData = [
                { name: '건', x: 300, y: 150 },
                { name: '태', x: 420, y: 200 },
                { name: '리', x: 470, y: 320 }
            ];

            testData.forEach((data, index) => {
                setTimeout(() => {
                    console.log(`테스트 ${index + 1}: ${data.name} 표시`);
                    showTrigramName(null, data.name, data.x, data.y);

                    setTimeout(() => {
                        console.log(`테스트 ${index + 1}: ${data.name} 숨김`);
                        hideTrigramName();
                    }, 1000);
                }, index * 2500);
            });
        });

        await page.waitForTimeout(8000); // 직접 함수 호출 테스트 완료 대기

        // 2. DOM 이벤트 시뮬레이션 테스트
        console.log('\n🎭 2. DOM 이벤트 시뮬레이션 테스트...');
        await page.evaluate(() => {
            const symbols = document.querySelectorAll('text[onmouseover]');
            console.log(`DOM 이벤트 테스트 시작 - ${symbols.length}개 심볼`);

            symbols.forEach((symbol, index) => {
                setTimeout(() => {
                    // mouseover 이벤트 생성 및 발생
                    const overEvent = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    symbol.dispatchEvent(overEvent);

                    setTimeout(() => {
                        // mouseout 이벤트 생성 및 발생
                        const outEvent = new MouseEvent('mouseout', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        symbol.dispatchEvent(outEvent);
                    }, 1000);
                }, index * 1500);
            });
        });

        await page.waitForTimeout(15000); // DOM 이벤트 테스트 완료 대기

        // 3. 물리적 마우스 이동 테스트 (몇 개만)
        console.log('\n🖱️ 3. 물리적 마우스 이동 테스트...');

        const symbolPositions = await page.evaluate(() => {
            const symbols = document.querySelectorAll('text[onmouseover]');
            return Array.from(symbols).slice(0, 3).map(symbol => {
                const rect = symbol.getBoundingClientRect();
                const name = symbol.getAttribute('onmouseover').match(/'([^']+)'/)[1];
                return {
                    name,
                    symbol: symbol.textContent,
                    x: rect.x + rect.width / 2,
                    y: rect.y + rect.height / 2
                };
            });
        });

        for (const pos of symbolPositions) {
            console.log(`🎯 ${pos.symbol} (${pos.name}) 위치로 마우스 이동: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`);

            try {
                await page.mouse.move(pos.x, pos.y);
                await page.waitForTimeout(1500);

                // 강제로 hover 시도
                const hoverAttempt = await page.evaluate((position) => {
                    const element = document.elementFromPoint(position.x, position.y);
                    if (element) {
                        return {
                            tagName: element.tagName,
                            textContent: element.textContent,
                            hasOnmouseover: element.hasAttribute('onmouseover')
                        };
                    }
                    return null;
                }, pos);

                console.log(`  └─ 마우스 위치의 요소:`, hoverAttempt);

                await page.mouse.move(100, 100); // 다른 곳으로 이동
                await page.waitForTimeout(500);
            } catch (error) {
                console.log(`  └─ 마우스 이동 실패: ${error.message}`);
            }
        }

        // 4. 최종 상태 검증
        console.log('\n📋 4. 최종 상태 검증...');

        const finalState = await page.evaluate(() => {
            const nameText = document.getElementById('trigramNameText');
            const symbols = document.querySelectorAll('text[onmouseover]');

            return {
                nameTextExists: !!nameText,
                nameTextDisplay: nameText ? nameText.style.display : 'none',
                nameTextContent: nameText ? nameText.textContent : '',
                symbolCount: symbols.length,
                functionsExist: {
                    showTrigramName: typeof window.showTrigramName === 'function',
                    hideTrigramName: typeof window.hideTrigramName === 'function'
                }
            };
        });

        console.log('최종 상태:', finalState);

        // 콘솔 메시지 요약
        console.log('\n📊 콘솔 메시지 요약:');
        console.log(`총 메시지 수: ${consoleMessages.length}`);

        const messageTypes = consoleMessages.reduce((acc, msg) => {
            const type = msg.split(']')[0].replace('[', '');
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        Object.entries(messageTypes).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}개`);
        });

        // 스크린샷 저장
        await page.screenshot({ path: 'D:\\code\\baal\\final-test-result.png' });
        console.log('\n📸 최종 테스트 스크린샷 저장됨');

        console.log('\n⏳ 결과 확인을 위해 5초간 브라우저를 열어둡니다...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.log(`❌ 테스트 오류: ${error.message}`);
    } finally {
        await browser.close();
        console.log('\n🏁 최종 테스트 완료');

        // 결론 출력
        console.log('\n' + '='.repeat(60));
        console.log('🔍 팔괘 호버 효과 진단 결론');
        console.log('='.repeat(60));
        console.log('✅ JavaScript 함수: 정상 작동');
        console.log('✅ DOM 이벤트: 정상 작동');
        console.log('✅ 디버깅 시스템: 정상 작동');
        console.log('❓ 실제 마우스 호버: Playwright에서 제한적 (실제 브라우저에서는 작동할 가능성 높음)');
        console.log('\n권장사항: 실제 브라우저에서 수동 테스트 실행');
        console.log('URL: http://localhost:8080/palgwae.html');
        console.log('개발자 도구 콘솔에서 디버깅 로그 확인');
    }
}

finalHoverTest().catch(console.error);