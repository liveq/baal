const { chromium } = require('playwright');

async function testPalgwaeHover() {
    console.log('🚀 Starting Palgwae hover test...');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    try {
        // 콘솔 로그 및 에러 수집
        const consoleMessages = [];
        const errors = [];

        page.on('console', msg => {
            consoleMessages.push(msg.text());
            console.log('🖥️  Console:', msg.text());
        });

        page.on('pageerror', error => {
            errors.push(error.message);
            console.log('❌ Page Error:', error.message);
        });

        // 1. 페이지 로드
        console.log('📄 Loading palgwae.html...');
        await page.goto('http://localhost:8080/palgwae.html');
        await page.waitForLoadState('domcontentloaded');

        // 2. 페이지 제목 확인
        const title = await page.title();
        console.log('📋 Page title:', title);

        // 3. 팔괘 심볼들이 표시되는지 확인
        console.log('🔍 Checking palgwae symbols...');
        const palgwaeSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

        for (const symbol of palgwaeSymbols) {
            const element = await page.locator('text=' + symbol).first();
            const isVisible = await element.isVisible();
            console.log(symbol + ' visible: ' + isVisible);
        }

        // 4. trigram-group 요소들 찾기
        console.log('🔍 Looking for trigram-group elements...');
        const trigramGroups = await page.locator('.trigram-group').all();
        console.log('Found ' + trigramGroups.length + ' .trigram-group elements');

        // 5. 각 팔괘 요소에 호버 테스트
        if (trigramGroups.length > 0) {
            for (let i = 0; i < trigramGroups.length; i++) {
                const group = trigramGroups[i];
                const dataName = await group.getAttribute('data-name');
                console.log('\n🎯 Testing hover on trigram group ' + (i + 1) + ' (' + dataName + ')...');

                // 호버 전 툴팁 상태 확인
                const tooltipBefore = await page.locator('#trigramTooltip').isVisible();
                console.log('   Tooltip before hover: ' + tooltipBefore);

                // 호버 실행
                await group.hover();
                await page.waitForTimeout(500); // 애니메이션 대기

                // 호버 후 툴팁 상태 확인
                const tooltipAfter = await page.locator('#trigramTooltip').isVisible();
                const tooltipText = await page.locator('#trigramTooltip').textContent();
                console.log('   Tooltip after hover: ' + tooltipAfter);
                console.log('   Tooltip text: "' + tooltipText + '"');

                await page.waitForTimeout(300);

                // 마우스를 다른 곳으로 이동해서 툴팁 사라지는지 확인
                await page.mouse.move(50, 50);
                await page.waitForTimeout(200);
                const tooltipAfterLeave = await page.locator('#trigramTooltip').isVisible();
                console.log('   Tooltip after mouse leave: ' + tooltipAfterLeave);
            }
        } else {
            console.log('❌ No .trigram-group elements found');
        }

        // 6. JavaScript 이벤트 리스너 확인
        console.log('\n🎭 Checking event listeners...');
        const eventListeners = await page.evaluate(() => {
            const trigramGroups = document.querySelectorAll('.trigram-group');
            return Array.from(trigramGroups).map((el, index) => {
                const dataName = el.getAttribute('data-name');
                return {
                    index,
                    dataName,
                    hasMouseEnterListener: el.onmouseenter !== null,
                    hasMouseLeaveListener: el.onmouseleave !== null
                };
            });
        });
        console.log('Event listeners:', eventListeners);

        // 7. HTML 구조 분석
        console.log('\n🏗️  HTML Structure Analysis...');
        const htmlStructure = await page.evaluate(() => {
            const baguaContainer = document.querySelector('.bagua-container');
            const svg = document.querySelector('.bagua-svg');
            const trigramGroups = document.querySelectorAll('.trigram-group');

            return {
                baguaContainer: !!baguaContainer,
                svg: !!svg,
                trigramGroupsCount: trigramGroups.length,
                trigramNames: Array.from(trigramGroups).map(g => g.getAttribute('data-name'))
            };
        });
        console.log('HTML Structure:', htmlStructure);

        // 8. bagua-pos 요소들도 테스트
        console.log('\n🎯 Testing bagua-pos hover effects...');
        const baguaButtons = await page.locator('.bagua-pos').all();
        console.log('Found ' + baguaButtons.length + ' .bagua-pos elements');

        if (baguaButtons.length > 0) {
            const firstButton = baguaButtons[0];

            // 호버 전 스타일
            const beforeHover = await firstButton.evaluate(el => {
                const style = window.getComputedStyle(el);
                return {
                    transform: style.transform,
                    boxShadow: style.boxShadow
                };
            });
            console.log('   bagua-pos before hover:', beforeHover);

            // 호버 실행
            await firstButton.hover();
            await page.waitForTimeout(500);

            // 호버 후 스타일
            const afterHover = await firstButton.evaluate(el => {
                const style = window.getComputedStyle(el);
                return {
                    transform: style.transform,
                    boxShadow: style.boxShadow
                };
            });
            console.log('   bagua-pos after hover:', afterHover);

            const hasTransformChange = beforeHover.transform !== afterHover.transform;
            const hasShadowChange = beforeHover.boxShadow !== afterHover.boxShadow;
            console.log('   ✨ Transform changed: ' + hasTransformChange);
            console.log('   ✨ Shadow changed: ' + hasShadowChange);
        }

        // 9. 최종 결과 요약
        console.log('\n📋 TEST SUMMARY:');
        console.log('   Console messages: ' + consoleMessages.length);
        console.log('   Errors: ' + errors.length);
        console.log('   Trigram groups found: ' + trigramGroups.length);
        console.log('   Bagua buttons found: ' + baguaButtons.length);

        if (errors.length > 0) {
            console.log('\n❌ ERRORS FOUND:');
            errors.forEach(error => console.log('   - ' + error));
        }

        // 스크린샷 촬영
        await page.screenshot({ path: 'palgwae-test-screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved as palgwae-test-screenshot.png');

        // 5초 대기 (사용자가 직접 확인할 수 있도록)
        console.log('\n⏰ Waiting 5 seconds for manual inspection...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
        console.log('✅ Test completed');
    }
}

testPalgwaeHover().catch(console.error);
