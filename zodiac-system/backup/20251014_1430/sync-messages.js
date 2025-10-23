/**
 * compat_message를 description 필드로 복사
 */

const fs = require('fs');

const dataPath = '/Volumes/X31/code/baal/zodiac-system/api/compatibility-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updateCount = 0;

Object.keys(data).forEach(key => {
  if (data[key].compat_message) {
    // compat_message를 description으로 복사
    data[key].description = data[key].compat_message;
    updateCount++;
  }
});

// 저장
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ ${updateCount}개 메시지 연동 완료`);
console.log(`📄 파일: ${dataPath}`);
