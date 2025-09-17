const fs = require('fs');

// 필요한 데이터 로드
const figuresWithTemplates = JSON.parse(fs.readFileSync('historical-figures-with-period-templates.json', 'utf8'));
const existingFortunes = JSON.parse(fs.readFileSync('api/fortune-data.json', 'utf8'));

// 별자리 ID 매핑
const zodiacMapping = {
    'aries': 1, 'taurus': 2, 'gemini': 3, 'cancer': 4,
    'leo': 5, 'virgo': 6, 'libra': 7, 'scorpio': 8,
    'sagittarius': 9, 'capricorn': 10, 'aquarius': 11, 'pisces': 12
};

// 카테고리별 행운 요소
const luckyElements = {
    colors: ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '분홍', '하늘색', '금색', '은색', '검정', '하양'],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    times: ['새벽 시간', '오전 시간', '점심 시간', '오후 시간', '저녁 시간', '밤 시간']
};

// 랜덤 선택 함수
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 별자리별 인물 리스트 생성
function createZodiacFiguresMap() {
    const figuresMap = {};
    Object.keys(figuresWithTemplates.zodiacFigures).forEach(zodiacKey => {
        const zodiacId = zodiacMapping[zodiacKey];
        figuresMap[zodiacId] = figuresWithTemplates.zodiacFigures[zodiacKey].figures;
    });
    return figuresMap;
}

// 점수 생성 (기존 일일 데이터 기반 유사한 분포)
function generateScores() {
    return {
        love: Math.floor(Math.random() * 40) + 60,    // 60-99
        money: Math.floor(Math.random() * 40) + 60,   // 60-99
        work: Math.floor(Math.random() * 40) + 60,    // 60-99
        health: Math.floor(Math.random() * 40) + 60   // 60-99
    };
}

// 주간 운세 생성
function generateWeeklyFortunes() {
    console.log('🔄 주간 운세 생성 중...');
    const weeklyFortunes = {};
    const figuresMap = createZodiacFiguresMap();
    
    // 2025년 52주 생성
    for (let week = 1; week <= 52; week++) {
        const weekKey = `2025-W${week.toString().padStart(2, '0')}`;
        weeklyFortunes[weekKey] = {};
        
        // 각 주의 시작일과 종료일 계산 (간략화)
        const startDate = new Date(2025, 0, 1 + (week - 1) * 7);
        const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        
        // 12개 별자리 생성
        for (let zodiacId = 1; zodiacId <= 12; zodiacId++) {
            const figures = figuresMap[zodiacId];
            const selectedFigure = getRandomElement(figures);
            const scores = generateScores();
            
            // 각 카테고리별 템플릿에서 랜덤 선택
            const workTemplate = getRandomElement(selectedFigure.weeklyTemplates.work);
            const loveTemplate = getRandomElement(selectedFigure.weeklyTemplates.love);
            const moneyTemplate = getRandomElement(selectedFigure.weeklyTemplates.money);
            const healthTemplate = getRandomElement(selectedFigure.weeklyTemplates.health);
            
            weeklyFortunes[weekKey][zodiacId] = {
                weekStart: startDate.toISOString().split('T')[0],
                weekEnd: endDate.toISOString().split('T')[0],
                theme: `제${week}주: ${selectedFigure.name}의 지혜`,
                overall: workTemplate, // 메인 메시지
                fortunes: {
                    love: loveTemplate,
                    money: moneyTemplate,
                    work: workTemplate,
                    health: healthTemplate
                },
                scores: scores,
                lucky: {
                    color: getRandomElement(luckyElements.colors),
                    number: getRandomElement(luckyElements.numbers),
                    time: getRandomElement(luckyElements.times)
                },
                keyDays: getRandomElement(['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']),
                advice: `${selectedFigure.name}처럼 이번 주를 의미있게 보내세요.`
            };
        }
    }
    
    return weeklyFortunes;
}

// 월간 운세 생성
function generateMonthlyFortunes() {
    console.log('🔄 월간 운세 생성 중...');
    const monthlyFortunes = {};
    const figuresMap = createZodiacFiguresMap();
    
    // 2025년 12개월 생성
    for (let month = 1; month <= 12; month++) {
        const monthKey = `2025-${month.toString().padStart(2, '0')}`;
        monthlyFortunes[monthKey] = {};
        
        // 12개 별자리 생성
        for (let zodiacId = 1; zodiacId <= 12; zodiacId++) {
            const figures = figuresMap[zodiacId];
            const selectedFigure = getRandomElement(figures);
            const scores = generateScores();
            
            // 각 카테고리별 템플릿에서 랜덤 선택
            const workTemplate = getRandomElement(selectedFigure.monthlyTemplates.work);
            const loveTemplate = getRandomElement(selectedFigure.monthlyTemplates.love);
            const moneyTemplate = getRandomElement(selectedFigure.monthlyTemplates.money);
            const healthTemplate = getRandomElement(selectedFigure.monthlyTemplates.health);
            
            monthlyFortunes[monthKey][zodiacId] = {
                theme: `${month}월: ${selectedFigure.name}의 달`,
                overall: workTemplate, // 메인 메시지
                fortunes: {
                    love: loveTemplate,
                    money: moneyTemplate,
                    work: workTemplate,
                    health: healthTemplate
                },
                scores: scores,
                lucky: {
                    color: getRandomElement(luckyElements.colors),
                    number: getRandomElement(luckyElements.numbers),
                    time: getRandomElement(luckyElements.times),
                    stone: getRandomElement(['다이아몬드', '루비', '사파이어', '에메랄드', '진주', '오팔', '토파즈', '가넷'])
                },
                advice: `${selectedFigure.name}처럼 이번 달을 풍요롭게 만드세요.`,
                keyWeeks: getRandomElement(['첫째주', '둘째주', '셋째주', '넷째주'])
            };
        }
    }
    
    return monthlyFortunes;
}

// 연간 운세 생성
function generateYearlyFortunes() {
    console.log('🔄 연간 운세 생성 중...');
    const yearlyFortunes = {};
    const figuresMap = createZodiacFiguresMap();
    
    // 12개 별자리 생성
    for (let zodiacId = 1; zodiacId <= 12; zodiacId++) {
        const figures = figuresMap[zodiacId];
        const selectedFigure = getRandomElement(figures);
        const scores = generateScores();
        
        // 각 카테고리별 템플릿에서 랜덤 선택
        const workTemplate = getRandomElement(selectedFigure.yearlyTemplates.work);
        const loveTemplate = getRandomElement(selectedFigure.yearlyTemplates.love);
        const moneyTemplate = getRandomElement(selectedFigure.yearlyTemplates.money);
        const healthTemplate = getRandomElement(selectedFigure.yearlyTemplates.health);
        
        yearlyFortunes[zodiacId] = {
            year: 2025,
            theme: `${selectedFigure.name}의 해: 새로운 도약`,
            overall: workTemplate, // 메인 메시지
            fortunes: {
                love: loveTemplate,
                money: moneyTemplate,
                work: workTemplate,
                health: healthTemplate
            },
            scores: scores,
            lucky: {
                color: getRandomElement(luckyElements.colors),
                number: getRandomElement(luckyElements.numbers),
                season: getRandomElement(['봄', '여름', '가을', '겨울']),
                month: getRandomElement(['1월', '3월', '5월', '7월', '9월', '11월'])
            },
            advice: `${selectedFigure.name}의 위대함을 본받아 올해를 특별하게 만드세요.`,
            keyPeriods: {
                firstHalf: `상반기에는 ${selectedFigure.name}의 도전정신으로 새로운 시작을 하세요.`,
                secondHalf: `하반기에는 ${selectedFigure.name}의 완성능력으로 결실을 맺으세요.`
            }
        };
    }
    
    return yearlyFortunes;
}

// 메인 실행 함수
function generateAllPeriodFortunes() {
    console.log('🚀 240명 인물 기반 주간/월간/연간 운세 생성 시작...\n');
    
    // 기존 데이터 보존하고 새로운 데이터 추가
    const newFortuneData = {
        ...existingFortunes,
        weekly: generateWeeklyFortunes(),
        monthly: generateMonthlyFortunes(),
        yearly: generateYearlyFortunes()
    };
    
    // 백업 생성
    fs.writeFileSync('api/fortune-data.json.backup-period', JSON.stringify(existingFortunes, null, 2), 'utf8');
    console.log('📦 기존 데이터 백업 완료: fortune-data.json.backup-period');
    
    // 새로운 데이터 저장
    fs.writeFileSync('api/fortune-data.json', JSON.stringify(newFortuneData, null, 2), 'utf8');
    
    console.log('\n✅ 모든 기간별 운세 생성 완료!');
    console.log('📊 생성 완료된 데이터:');
    console.log(`   • 주간 운세: ${Object.keys(newFortuneData.weekly).length}주 × 12별자리 = ${Object.keys(newFortuneData.weekly).length * 12}개`);
    console.log(`   • 월간 운세: ${Object.keys(newFortuneData.monthly).length}개월 × 12별자리 = ${Object.keys(newFortuneData.monthly).length * 12}개`);
    console.log(`   • 연간 운세: ${Object.keys(newFortuneData.yearly).length}개 (12별자리)`);
    console.log(`   📁 저장 위치: api/fortune-data.json`);
    console.log('🎯 240명 역사적 인물의 진짜 메시지로 완전 대체 완료!');
}

// 실행
generateAllPeriodFortunes();