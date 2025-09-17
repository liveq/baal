const fs = require('fs');

// JSON 파일 읽기
const tarotData = JSON.parse(fs.readFileSync('tarot_data.json', 'utf8'));
const spreadsData = JSON.parse(fs.readFileSync('spreads_data.json', 'utf8'));

// 인라인 JS 파일 생성
const output = `// 타로카드 데이터 인라인 버전 - 경로 독립적
// 이 파일을 사용하면 JSON 파일 경로 문제가 완전히 해결됩니다.

const TAROT_DATA_INLINE = ${JSON.stringify(tarotData, null, 2)};

const SPREADS_DATA_INLINE = ${JSON.stringify(spreadsData, null, 2)};

// 전역 변수로 등록
if (typeof window !== 'undefined') {
    window.TAROT_DATA_INLINE = TAROT_DATA_INLINE;
    window.SPREADS_DATA_INLINE = SPREADS_DATA_INLINE;
}
`;

fs.writeFileSync('tarot-data-inline.js', output);
console.log('타로 데이터 인라인 JS 파일 생성 완료: tarot-data-inline.js');