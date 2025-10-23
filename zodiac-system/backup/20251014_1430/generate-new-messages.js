/**
 * 78개 궁합 메시지 재생성
 * 100% 긍정적이고 창의적인 메시지
 */

const fs = require('fs');
const { PositiveMessageGenerator } = require('./positive-replacement-system.js');

// 12 별자리 이름
const ZODIAC_NAMES = [
  "양자리", "황소자리", "쌍둥이자리", "게자리",
  "사자자리", "처녀자리", "천칭자리", "전갈자리",
  "사수자리", "염소자리", "물병자리", "물고기자리"
];

function main() {
  console.log('🌟 새로운 긍정 궁합 메시지 생성 시작\n');

  // 기존 데이터 로드
  const dataPath = '/Volumes/X31/code/baal/zodiac-system/api/compatibility-data.json';
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const generator = new PositiveMessageGenerator();
  let updateCount = 0;

  // 모든 궁합 메시지 재생성
  Object.keys(data).forEach(key => {
    const entry = data[key];
    const score = entry.overall_score || 75;

    // 새 메시지 생성
    const newMessage = generator.generate(
      entry.zodiac1_name,
      entry.zodiac2_name,
      score
    );

    // 업데이트
    data[key].compat_message = newMessage;
    updateCount++;

    if (updateCount <= 5) {
      console.log(`✅ ${entry.zodiac1_name} & ${entry.zodiac2_name}`);
      console.log(`   ${newMessage}\n`);
    }
  });

  // 저장
  const outputPath = '/Volumes/X31/code/baal/zodiac-system/backup/20251014_1430/compatibility-data-new.json';
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\n📊 생성 완료`);
  console.log(`총 ${updateCount}개 메시지 업데이트`);
  console.log(`저장 위치: ${outputPath}`);
}

main();
