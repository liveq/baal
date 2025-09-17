const fs = require('fs');

// 240명 인물 데이터 로드
const figuresData = JSON.parse(fs.readFileSync('historical-figures-with-natural-templates.json', 'utf8'));

// 인물별 주간/월간/연간 템플릿 생성
function generatePeriodTemplates() {
    const updatedData = JSON.parse(JSON.stringify(figuresData));
    
    // 각 별자리를 순회
    Object.keys(updatedData.zodiacFigures).forEach(zodiacKey => {
        const zodiac = updatedData.zodiacFigures[zodiacKey];
        
        zodiac.figures.forEach(figure => {
            // 기존 naturalTemplates를 기반으로 주간/월간/연간 템플릿 생성
            const baseTemplates = figure.naturalTemplates;
            const coreTraits = figure.coreTraits;
            const achievements = figure.achievements;
            
            // 주간 템플릿 (구체적 실행 계획)
            figure.weeklyTemplates = {
                work: generateWeeklyTemplate(figure, 'work', baseTemplates, coreTraits, achievements),
                love: generateWeeklyTemplate(figure, 'love', baseTemplates, coreTraits, achievements),
                money: generateWeeklyTemplate(figure, 'money', baseTemplates, coreTraits, achievements),
                health: generateWeeklyTemplate(figure, 'health', baseTemplates, coreTraits, achievements)
            };
            
            // 월간 템플릿 (중기 목표)
            figure.monthlyTemplates = {
                work: generateMonthlyTemplate(figure, 'work', baseTemplates, coreTraits, achievements),
                love: generateMonthlyTemplate(figure, 'love', baseTemplates, coreTraits, achievements),
                money: generateMonthlyTemplate(figure, 'money', baseTemplates, coreTraits, achievements),
                health: generateMonthlyTemplate(figure, 'health', baseTemplates, coreTraits, achievements)
            };
            
            // 연간 템플릿 (큰 그림과 비전)
            figure.yearlyTemplates = {
                work: generateYearlyTemplate(figure, 'work', baseTemplates, coreTraits, achievements),
                love: generateYearlyTemplate(figure, 'love', baseTemplates, coreTraits, achievements),
                money: generateYearlyTemplate(figure, 'money', baseTemplates, coreTraits, achievements),
                health: generateYearlyTemplate(figure, 'health', baseTemplates, coreTraits, achievements)
            };
        });
    });
    
    return updatedData;
}

// 주간 템플릿 생성 함수
function generateWeeklyTemplate(figure, category, baseTemplates, coreTraits, achievements) {
    const name = figure.name;
    const templates = [];
    
    switch(category) {
        case 'work':
            templates.push(`이번 주 ${name}처럼 ${coreTraits[0]}을 발휘하여 구체적인 프로젝트를 완성해보세요`);
            templates.push(`${name}의 ${achievements[0]}처럼 이번 주 작은 성과를 차근차근 쌓아가세요`);
            templates.push(`이번 주는 ${name}의 실행력을 본받아 계획을 행동으로 옮기는 시간으로 만드세요`);
            break;
        case 'love':
            templates.push(`이번 주 ${name}처럼 진정성 있는 소통으로 관계를 깊게 발전시켜보세요`);
            templates.push(`${name}의 ${coreTraits[1]}처럼 이번 주 사랑하는 사람에게 특별한 관심을 보여주세요`);
            templates.push(`이번 주는 ${name}의 따뜻함을 닮아 주변 사람들과의 유대를 강화하세요`);
            break;
        case 'money':
            templates.push(`이번 주 ${name}처럼 새로운 수익 기회를 적극적으로 탐색해보세요`);
            templates.push(`${name}의 경제적 통찰력을 본받아 이번 주 투자 계획을 세워보세요`);
            templates.push(`이번 주는 ${name}의 신중함으로 재정 관리를 점검하고 개선하세요`);
            break;
        case 'health':
            templates.push(`이번 주 ${name}처럼 규칙적인 생활 리듬을 만들어 건강의 기초를 다지세요`);
            templates.push(`${name}의 ${coreTraits[2]}을 닮아 이번 주 자신만의 건강 루틴을 확립하세요`);
            templates.push(`이번 주는 ${name}의 활력을 본받아 몸과 마음의 균형을 맞춰보세요`);
            break;
    }
    
    return templates;
}

// 월간 템플릿 생성 함수
function generateMonthlyTemplate(figure, category, baseTemplates, coreTraits, achievements) {
    const name = figure.name;
    const templates = [];
    
    switch(category) {
        case 'work':
            templates.push(`이번 달 ${name}처럼 장기적 비전을 가지고 단계별 목표를 달성해나가세요`);
            templates.push(`${name}의 ${achievements[0]}처럼 이번 달은 큰 그림을 그리며 체계적으로 추진하세요`);
            templates.push(`이번 달은 ${name}의 전략적 사고로 업무의 새로운 돌파구를 만들어보세요`);
            break;
        case 'love':
            templates.push(`이번 달 ${name}처럼 깊이 있는 관계를 구축하며 진정한 유대를 형성하세요`);
            templates.push(`${name}의 ${coreTraits[1]}을 닮아 이번 달 사랑의 새로운 차원을 경험해보세요`);
            templates.push(`이번 달은 ${name}의 포용력으로 관계의 질적 향상을 이루어내세요`);
            break;
        case 'money':
            templates.push(`이번 달 ${name}처럼 장기적 관점에서 재정 계획을 수립하고 실행하세요`);
            templates.push(`${name}의 경제적 혜안을 본받아 이번 달 투자 포트폴리오를 다각화하세요`);
            templates.push(`이번 달은 ${name}의 신중한 판단력으로 재정 안정성을 더욱 강화하세요`);
            break;
        case 'health':
            templates.push(`이번 달 ${name}처럼 전인적 건강관리로 몸과 마음의 조화를 이루세요`);
            templates.push(`${name}의 ${coreTraits[2]}을 실천하여 이번 달 건강한 생활습관을 정착시키세요`);
            templates.push(`이번 달은 ${name}의 지혜로 건강 관리의 새로운 방법을 시도해보세요`);
            break;
    }
    
    return templates;
}

// 연간 템플릿 생성 함수
function generateYearlyTemplate(figure, category, baseTemplates, coreTraits, achievements) {
    const name = figure.name;
    const templates = [];
    
    switch(category) {
        case 'work':
            templates.push(`올해 ${name}처럼 역사에 남을 업적을 향한 여정을 시작하는 해로 만드세요`);
            templates.push(`${name}의 ${achievements[0]}처럼 올해는 자신만의 걸작을 완성하는 원년이 될 것입니다`);
            templates.push(`올해는 ${name}의 불굴의 의지로 커리어의 새로운 전환점을 맞이하세요`);
            break;
        case 'love':
            templates.push(`올해 ${name}처럼 사랑의 진정한 의미를 깨달으며 인생의 동반자를 만나는 해가 될 것입니다`);
            templates.push(`${name}의 ${coreTraits[1]}을 품고 올해는 사랑을 통해 인간적 성장을 이루세요`);
            templates.push(`올해는 ${name}의 깊은 애정으로 주변 모든 관계가 더욱 풍요로워질 것입니다`);
            break;
        case 'money':
            templates.push(`올해 ${name}처럼 새로운 부의 창조 방식을 개척하며 경제적 독립을 이루세요`);
            templates.push(`${name}의 혁신적 사고를 본받아 올해는 재정적 자유를 향한 기반을 다지세요`);
            templates.push(`올해는 ${name}의 장기적 안목으로 지속 가능한 부를 축적하는 해가 될 것입니다`);
            break;
        case 'health':
            templates.push(`올해 ${name}처럼 평생 건강의 철학을 확립하며 최상의 컨디션을 유지하세요`);
            templates.push(`${name}의 ${coreTraits[2]}을 실천하여 올해는 건강한 삶의 새로운 패러다임을 만드세요`);
            templates.push(`올해는 ${name}의 생명력을 닮아 모든 면에서 활기찬 한 해로 만들어가세요`);
            break;
    }
    
    return templates;
}

// 실행
const updatedFiguresData = generatePeriodTemplates();

// 파일 저장
fs.writeFileSync('historical-figures-with-period-templates.json', JSON.stringify(updatedFiguresData, null, 2), 'utf8');

console.log('✅ 240명 인물의 주간/월간/연간 템플릿이 생성되었습니다.');
console.log('📁 저장 위치: historical-figures-with-period-templates.json');
console.log('📊 생성된 템플릿 수: 240명 × 4카테고리 × 3기간 × 3가지 = 8,640개 템플릿');