const { chromium } = require('playwright');
const fs = require('fs');

// 12개 별자리 정보
const zodiacSigns = [
    { id: 'aries', name: '양자리', element: 'fire' },
    { id: 'taurus', name: '황소자리', element: 'earth' },
    { id: 'gemini', name: '쌍둥이자리', element: 'air' },
    { id: 'cancer', name: '게자리', element: 'water' },
    { id: 'leo', name: '사자자리', element: 'fire' },
    { id: 'virgo', name: '처녀자리', element: 'earth' },
    { id: 'libra', name: '천칭자리', element: 'air' },
    { id: 'scorpio', name: '전갈자리', element: 'water' },
    { id: 'sagittarius', name: '사수자리', element: 'fire' },
    { id: 'capricorn', name: '염소자리', element: 'earth' },
    { id: 'aquarius', name: '물병자리', element: 'air' },
    { id: 'pisces', name: '물고기자리', element: 'water' }
];

async function testZodiacCompatibility() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const testResults = [];
    const problemCombinations = [];
    const normalCombinations = [];
    const longTextCombinations = [];
    const htmlTagCombinations = [];
    const duplicateDescriptions = new Map();

    try {
        // 별자리 페이지로 이동
        await page.goto('http://localhost:8088/zodiac-system/web/zodiac.html');

        console.log('별자리 궁합 시스템 테스트 시작...');

        // 페이지 로딩 대기
        await page.waitForTimeout(2000);

        let totalCombinations = 0;
        let processedCombinations = 0;

        // 각 별자리에 대해 테스트 (1부터 12까지 전체)
        for (let primaryIndex = 1; primaryIndex <= 12; primaryIndex++) {
            const primarySign = zodiacSigns[primaryIndex - 1];
            console.log(`\n${primarySign.name} 궁합 테스트 시작...`);

            try {
                // 기본 별자리 선택 (data-zodiac 속성 사용)
                await page.click(`[data-zodiac="${primaryIndex}"]`);
                await page.waitForTimeout(2000);

                // 궁합 탭 클릭
                await page.click('button[onclick="showTab(\'compatibility\')"]');
                await page.waitForTimeout(1500);

                // 각 파트너 별자리 테스트 (1부터 12까지 전체)
                for (let partnerIndex = 1; partnerIndex <= 12; partnerIndex++) {
                    const partnerSign = zodiacSigns[partnerIndex - 1];
                    totalCombinations++;

                    try {
                        console.log(`  ${primarySign.name} - ${partnerSign.name} 테스트 중...`);

                        // 파트너 별자리 선택 (select option)
                        await page.selectOption('#partnerZodiac', partnerIndex.toString());
                        await page.waitForTimeout(500);

                        // 결과 확인 버튼 클릭
                        await page.click('button[onclick="checkCompatibility()"]');
                        await page.waitForTimeout(2000);

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
                            const textLength = resultText.length;

                            processedCombinations++;

                            const combination = {
                                primary: primarySign.name,
                                partner: partnerSign.name,
                                primaryId: primarySign.id,
                                partnerId: partnerSign.id,
                                textLength: textLength,
                                text: resultText.trim(),
                                hasHtmlTags: /<[^>]+>/.test(resultText),
                                timestamp: new Date().toISOString()
                            };

                            testResults.push(combination);

                            // 중복 설명 체크
                            const trimmedText = resultText.trim();
                            if (duplicateDescriptions.has(trimmedText)) {
                                duplicateDescriptions.get(trimmedText).push(combination);
                            } else {
                                duplicateDescriptions.set(trimmedText, [combination]);
                            }

                            // 분류
                            if (textLength > 500) {
                                longTextCombinations.push(combination);
                                console.log(`    [긴 텍스트] ${textLength}자`);
                            }

                            if (combination.hasHtmlTags) {
                                htmlTagCombinations.push(combination);
                                console.log(`    [HTML 태그 발견]`);
                            }

                            if (textLength > 500 || combination.hasHtmlTags) {
                                problemCombinations.push(combination);
                            } else {
                                normalCombinations.push(combination);
                            }

                            console.log(`    결과: ${textLength}자 ${combination.hasHtmlTags ? '[HTML]' : '[정상]'}`);

                        } else {
                            console.log(`    결과 요소를 찾을 수 없음`);
                        }

                    } catch (error) {
                        console.log(`    오류 발생: ${error.message}`);
                    }
                }

            } catch (error) {
                console.log(`${primarySign.name} 테스트 중 오류: ${error.message}`);
            }
        }

        // 중복 설명 찾기
        const duplicates = Array.from(duplicateDescriptions.entries())
            .filter(([text, combinations]) => combinations.length > 1);

        console.log('\n=== 테스트 완료 ===');
        console.log(`총 조합 시도: ${totalCombinations}`);
        console.log(`처리된 조합: ${processedCombinations}`);
        console.log(`정상 조합: ${normalCombinations.length}`);
        console.log(`문제 조합: ${problemCombinations.length}`);
        console.log(`긴 텍스트 조합: ${longTextCombinations.length}`);
        console.log(`HTML 태그 조합: ${htmlTagCombinations.length}`);
        console.log(`중복 설명: ${duplicates.length}개 그룹`);

        // 결과를 JSON 파일로 저장
        const report = {
            summary: {
                totalAttempted: totalCombinations,
                totalProcessed: processedCombinations,
                normalCombinations: normalCombinations.length,
                problemCombinations: problemCombinations.length,
                longTextCombinations: longTextCombinations.length,
                htmlTagCombinations: htmlTagCombinations.length,
                duplicateGroups: duplicates.length
            },
            testResults: testResults,
            normalCombinations: normalCombinations,
            problemCombinations: problemCombinations,
            longTextCombinations: longTextCombinations,
            htmlTagCombinations: htmlTagCombinations,
            duplicates: duplicates.map(([text, combinations]) => ({
                text: text.substring(0, 100) + '...',
                count: combinations.length,
                combinations: combinations.map(c => `${c.primary}-${c.partner}`)
            }))
        };

        fs.writeFileSync('zodiac-compatibility-test-results.json', JSON.stringify(report, null, 2));
        console.log('\n결과가 zodiac-compatibility-test-results.json에 저장되었습니다.');

        // 상세 보고서 출력
        console.log('\n=== 상세 분석 ===');

        if (longTextCombinations.length > 0) {
            console.log('\n[긴 텍스트 조합들]');
            longTextCombinations.forEach(combo => {
                console.log(`${combo.primary} - ${combo.partner}: ${combo.textLength}자`);
            });
        }

        if (htmlTagCombinations.length > 0) {
            console.log('\n[HTML 태그가 포함된 조합들]');
            htmlTagCombinations.forEach(combo => {
                console.log(`${combo.primary} - ${combo.partner}: HTML 태그 발견`);
            });
        }

        if (duplicates.length > 0) {
            console.log('\n[중복 설명이 있는 조합들]');
            duplicates.forEach(([text, combinations]) => {
                console.log(`동일한 설명 (${combinations.length}개 조합):`);
                combinations.forEach(combo => {
                    console.log(`  - ${combo.primary} - ${combo.partner}`);
                });
                console.log(`  내용: ${text.substring(0, 100)}...`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('테스트 중 오류 발생:', error);
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('별자리 궁합 테스트를 시작합니다...');
    console.log('주의: 서버가 http://localhost:8080에서 실행 중인지 확인해주세요.');

    await testZodiacCompatibility();
}

main().catch(console.error);