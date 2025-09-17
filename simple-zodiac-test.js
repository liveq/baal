const { chromium } = require('playwright');

async function testZodiacPage() {
    const browser = await chromium.launch({
        headless: false,  // 브라우저 화면 보기
        slowMo: 1000     // 천천히 실행
    });

    const page = await browser.newPage();

    try {
        console.log('페이지 로드 중...');
        // 직접 별자리 페이지로 이동
        await page.goto('http://localhost:8088/zodiac-system/web/zodiac.html');

        // 페이지 로딩 완료 대기
        await page.waitForLoadState('networkidle');

        console.log('페이지 제목:', await page.title());

        // 양자리 버튼 찾기
        const ariesButton = await page.$('[data-zodiac="1"]');
        if (ariesButton) {
            console.log('양자리 버튼 발견!');

            // 양자리 클릭
            await page.click('[data-zodiac="1"]');
            console.log('양자리 클릭됨');

            await page.waitForTimeout(3000);

            // 궁합 탭 찾기
            const compatibilityTab = await page.$('button[onclick*="compatibility"]');
            if (compatibilityTab) {
                console.log('궁합 탭 발견!');
                await page.click('button[onclick*="compatibility"]');
                console.log('궁합 탭 클릭됨');

                await page.waitForTimeout(2000);

                // 파트너 선택 드롭다운 찾기
                const partnerSelect = await page.$('#partnerZodiac');
                if (partnerSelect) {
                    console.log('파트너 선택 드롭다운 발견!');

                    // 게자리 선택 (index 4)
                    await page.selectOption('#partnerZodiac', '4');
                    console.log('게자리 선택됨');

                    await page.waitForTimeout(1000);

                    // 궁합 보기 버튼 클릭
                    const checkButton = await page.$('button[onclick="checkCompatibility()"]');
                    if (checkButton) {
                        console.log('궁합 보기 버튼 발견!');
                        await page.click('button[onclick="checkCompatibility()"]');
                        console.log('궁합 보기 버튼 클릭됨');

                        await page.waitForTimeout(3000);

                        // 다양한 결과 요소 선택자 시도
                        let resultElement = await page.$('#compatibilityResult .desc-content');
                        if (!resultElement) {
                            resultElement = await page.$('#compatibilityResult .description');
                        }
                        if (!resultElement) {
                            resultElement = await page.$('#compatibilityResult');
                        }

                        if (resultElement) {
                            const resultText = await resultElement.textContent();
                            console.log('결과 텍스트 길이:', resultText.length);
                            console.log('결과 텍스트 앞부분:', resultText.substring(0, 200) + '...');

                            // HTML 태그 체크
                            const hasHtmlTags = /<[^>]+>/.test(resultText);
                            console.log('HTML 태그 포함:', hasHtmlTags);

                        } else {
                            console.log('결과 텍스트를 찾을 수 없음');

                            // 모든 가능한 결과 요소 찾기와 내용 출력
                            const allElements = await page.$$('#compatibilityResult *');
                            console.log('결과 영역의 요소 개수:', allElements.length);

                            // 텍스트가 있는 요소들 찾기
                            for (let i = 0; i < Math.min(allElements.length, 10); i++) {
                                const text = await allElements[i].textContent();
                                const tagName = await allElements[i].evaluate(el => el.tagName);
                                const className = await allElements[i].getAttribute('class');
                                if (text && text.trim().length > 10) {
                                    console.log(`Element ${i}: ${tagName}.${className} - "${text.substring(0, 100)}..."`);
                                }
                            }

                            // 전체 compatibilityResult 내용
                            const fullResult = await page.$('#compatibilityResult');
                            if (fullResult) {
                                const fullText = await fullResult.textContent();
                                console.log('전체 결과 영역 텍스트 길이:', fullText.length);
                                console.log('전체 결과 영역 앞부분:', fullText.substring(0, 300) + '...');
                            }
                        }
                    } else {
                        console.log('궁합 보기 버튼을 찾을 수 없음');
                    }
                } else {
                    console.log('파트너 선택 드롭다운을 찾을 수 없음');

                    // 모든 select 요소 찾기
                    const selects = await page.$$('select');
                    console.log('페이지의 select 요소 개수:', selects.length);

                    for (let i = 0; i < selects.length; i++) {
                        const id = await selects[i].getAttribute('id');
                        console.log(`Select ${i}: id=${id}`);
                    }
                }
            } else {
                console.log('궁합 탭을 찾을 수 없음');

                // 모든 버튼 찾기
                const buttons = await page.$$('button');
                console.log('페이지의 버튼 개수:', buttons.length);

                for (let i = 0; i < Math.min(buttons.length, 20); i++) {
                    const onclick = await buttons[i].getAttribute('onclick');
                    const text = await buttons[i].textContent();
                    if (onclick || text.includes('궁합')) {
                        console.log(`Button ${i}: onclick="${onclick}", text="${text}"`);
                    }
                }
            }
        } else {
            console.log('양자리 버튼을 찾을 수 없음');

            // 모든 data-zodiac 요소 찾기
            const zodiacElements = await page.$$('[data-zodiac]');
            console.log('data-zodiac 요소 개수:', zodiacElements.length);

            for (let i = 0; i < zodiacElements.length; i++) {
                const zodiacValue = await zodiacElements[i].getAttribute('data-zodiac');
                const text = await zodiacElements[i].textContent();
                console.log(`Zodiac ${i}: data-zodiac="${zodiacValue}", text="${text.trim()}"`);
            }
        }

    } catch (error) {
        console.error('테스트 중 오류:', error);
    }

    console.log('5초 후 브라우저를 닫습니다...');
    await page.waitForTimeout(5000);
    await browser.close();
}

testZodiacPage().catch(console.error);