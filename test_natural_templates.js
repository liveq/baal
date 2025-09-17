// 테스트: naturalTemplates가 제대로 로드되는지 확인
const fs = require('fs');
const path = require('path');

// enhanced.json 파일 읽기
const filePath = path.join(__dirname, 'zodiac-system', 'historical-figures-enhanced.json');
const fileContent = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContent);

// 첫 번째 인물 확인
const firstFigure = data.zodiacFigures.aries.figures[0];
console.log('\n=== 첫 번째 인물 확인 ===');
console.log('이름:', firstFigure.name);
console.log('naturalTemplates 존재:', !!firstFigure.naturalTemplates);

if (firstFigure.naturalTemplates) {
    console.log('\nnaturalTemplates 내용:');
    console.log(JSON.stringify(firstFigure.naturalTemplates, null, 2));
}

// 모든 인물의 naturalTemplates 카운트
let totalFigures = 0;
let figuresWithNaturalTemplates = 0;

for (const zodiacKey in data.zodiacFigures) {
    const figures = data.zodiacFigures[zodiacKey].figures || [];
    for (const figure of figures) {
        totalFigures++;
        if (figure.naturalTemplates) {
            figuresWithNaturalTemplates++;
        }
    }
}

console.log('\n=== 전체 통계 ===');
console.log(`총 인물 수: ${totalFigures}`);
console.log(`naturalTemplates 가진 인물: ${figuresWithNaturalTemplates}`);
console.log(`비율: ${(figuresWithNaturalTemplates/totalFigures*100).toFixed(1)}%`);