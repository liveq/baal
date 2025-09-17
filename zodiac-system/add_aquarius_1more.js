const fs = require('fs');

// 물병자리에 추가할 1명의 인물 데이터
const aquariusFigure = {
  "name": "앨런 튜링",
  "nameEn": "Alan Turing",
  "period": "1912-1954",
  "country": "영국",
  "achievements": [
    "튜링 기계 - 현대 컴퓨터 과학의 이론적 기초 마련",
    "에니그마 해독 - 2차 대전 연합군 승리에 결정적 기여",
    "인공지능 개념 정립 - '튜링 테스트'로 AI의 기준 제시"
  ],
  "coreTraits": [
    "수학적 천재성",
    "혁신적 사고",
    "미래 비전"
  ],
  "famousQuote": "기계가 생각할 수 있는가는 '잠수함이 헤엄칠 수 있는가'와 같은 질문이다.",
  "categoryTraits": {
    "work": "수학적 논리와 혁신적 사고로 불가능해 보이는 문제를 해결하는 천재적 능력",
    "love": "지적 호기심을 공유하고 서로의 독특함을 이해하는 깊이 있는 관계",
    "money": "혁신적 기술과 아이디어가 미래에 엄청난 가치를 창출할 수 있는 가능성",
    "health": "수학적 사고와 논리적 추론이 정신적 명료함과 건강을 유지하는 원동력"
  },
  "naturalTemplates": {
    "work": "에니그마를 해독한 앨런 튜링처럼, 복잡하고 어려운 문제를 논리적 사고로 명쾌하게 해결할 수 있습니다",
    "love": "독특한 천재성을 가진 앨런 튜링처럼, 서로의 개성과 지적 능력을 인정하고 존중하는 특별한 관계를 경험할 수 있습니다",
    "money": "미래를 내다본 앨런 튜링처럼, 혁신적 기술이나 아이디어에 대한 투자가 장기적으로 큰 가치를 창출할 것입니다",
    "health": "논리적 사고를 한 앨런 튜링처럼, 규칙적이고 체계적인 생활 방식이 정신적 명료함과 건강을 증진시켜줄 것입니다"
  }
};

// JSON 파일 읽기
const data = JSON.parse(fs.readFileSync('C:/code/rheight/zodiac-system/historical-figures-enhanced.json', 'utf-8'));

// 물병자리에 새 인물 추가
data.zodiacFigures.aquarius.figures.push(aquariusFigure);

// 파일에 쓰기
fs.writeFileSync('C:/code/rheight/zodiac-system/historical-figures-enhanced.json', JSON.stringify(data, null, 2), 'utf-8');

console.log('물병자리에 앨런 튜링을 추가했습니다.');
console.log('현재 물병자리 인물 수:', data.zodiacFigures.aquarius.figures.length);