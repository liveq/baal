/**
 * 간단한 궁합 API 테스트 - compatibility-data.json 직접 테스트
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Compatibility Data 직접 테스트\n');

// compatibility-data.json 파일 직접 로드
const compatDataPath = path.join(__dirname, 'zodiac-system', 'api', 'compatibility-data.json');

try {
    console.log(`📁 파일 경로: ${compatDataPath}`);

    if (fs.existsSync(compatDataPath)) {
        console.log('✅ compatibility-data.json 파일 존재 확인');

        const data = fs.readFileSync(compatDataPath, 'utf8');
        const compatData = JSON.parse(data);

        console.log('📊 데이터 구조 분석:');
        console.log(`- 총 궁합 데이터 수: ${Object.keys(compatData).length}개`);
        console.log(`- 첫 번째 키: ${Object.keys(compatData)[0]}`);
        console.log(`- 마지막 키: ${Object.keys(compatData)[Object.keys(compatData).length - 1]}`);

        // 샘플 데이터 확인
        console.log('\n🧪 샘플 궁합 데이터:');

        // 1-2 (양자리 + 황소자리)
        const sample12 = compatData['1-2'];
        if (sample12) {
            console.log('\n📋 양자리 + 황소자리 (1-2):');
            console.log(`- 총점: ${sample12.overall_score}점`);
            console.log(`- 애정: ${sample12.love_score}점`);
            console.log(`- 우정: ${sample12.friendship_score}점`);
            console.log(`- 업무: ${sample12.work_score}점`);
            console.log(`- 메시지: ${sample12.compat_message}`);
            console.log(`- 조언: ${sample12.advice}`);
        }

        // 1-5 (양자리 + 사자자리)
        const sample15 = compatData['1-5'];
        if (sample15) {
            console.log('\n📋 양자리 + 사자자리 (1-5):');
            console.log(`- 총점: ${sample15.overall_score}점`);
            console.log(`- 애정: ${sample15.love_score}점`);
            console.log(`- 우정: ${sample15.friendship_score}점`);
            console.log(`- 업무: ${sample15.work_score}점`);
            console.log(`- 메시지: ${sample15.compat_message}`);
            console.log(`- 조언: ${sample15.advice}`);
        }

        // 3-7 (쌍둥이자리 + 천칭자리)
        const sample37 = compatData['3-7'];
        if (sample37) {
            console.log('\n📋 쌍둥이자리 + 천칭자리 (3-7):');
            console.log(`- 총점: ${sample37.overall_score}점`);
            console.log(`- 애정: ${sample37.love_score}점`);
            console.log(`- 우정: ${sample37.friendship_score}점`);
            console.log(`- 업무: ${sample37.work_score}점`);
            console.log(`- 메시지: ${sample37.compat_message}`);
            console.log(`- 조언: ${sample37.advice}`);
        }

        console.log('\n✅ Compatibility data 분석 완료!');

        // 경로 문제 시뮬레이션 테스트
        console.log('\n🔄 경로 문제 시뮬레이션:');
        console.log('zodiac-system/web/zodiac.html에서 ../api/compatibility-data.json 호출 시:');
        console.log('- 예상 경로: zodiac-system/api/compatibility-data.json');
        console.log('- 실제 파일: ✅ 존재함');
        console.log('- 문제: HTTP 서버 접근 문제 (파일 시스템 권한 또는 서버 설정)');

    } else {
        console.log('❌ compatibility-data.json 파일이 존재하지 않습니다');
    }

} catch (error) {
    console.error('❌ 오류 발생:', error.message);
}