/**
 * Node.js에서 직접 API 테스트
 * 브라우저 환경을 시뮬레이션하여 궁합 API 테스트
 */

const fs = require('fs');
const path = require('path');

// 파일 시스템에서 JSON 파일을 직접 읽는 fetch 함수 시뮬레이션
global.fetch = async function(url) {
    console.log(`📁 Fetch 요청: ${url}`);

    // 상대 경로를 절대 경로로 변환
    let filePath;
    if (url.startsWith('../api/')) {
        // zodiac-system/web에서 호출되는 경우를 가정 - compatibility-data.json의 경우
        filePath = path.join(__dirname, 'zodiac-system', 'api', url.substring(7));
    } else if (url.startsWith('../historical-figures-enhanced.json')) {
        // historical-figures 파일의 경우
        filePath = path.join(__dirname, 'zodiac-system', 'historical-figures-enhanced.json');
    } else if (url.startsWith('./')) {
        filePath = path.join(__dirname, url.substring(2));
    } else {
        filePath = path.join(__dirname, url);
    }

    console.log(`📁 파일 경로: ${filePath}`);

    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            console.log(`✅ 파일 읽기 성공: ${filePath} (${data.length} bytes)`);

            return {
                ok: true,
                status: 200,
                json: async () => JSON.parse(data)
            };
        } else {
            console.log(`❌ 파일 없음: ${filePath}`);
            return {
                ok: false,
                status: 404
            };
        }
    } catch (error) {
        console.error(`❌ 파일 읽기 오류: ${error.message}`);
        return {
            ok: false,
            status: 500
        };
    }
};

// zodiacDescriptions 모의 객체 (브라우저 환경 시뮬레이션)
global.window = {
    zodiacDescriptions: {
        1: {
            compatibility: "양자리와 사자자리는 천생연분입니다..."
        },
        2: {
            compatibility: "황소자리와 처녀자리는 완벽한 조합입니다..."
        }
    }
};

// API 파일 로드
const apiPath = path.join(__dirname, 'zodiac-system', 'api', 'zodiac-api-real.js');
console.log(`📦 API 로드 시도: ${apiPath}`);

// API 파일을 직접 실행하여 클래스 로드
const apiCode = fs.readFileSync(apiPath, 'utf8');

// 클래스 정의 부분만 추출하여 실행
eval(apiCode);

async function testCompatibility() {
    console.log('\n🔍 별자리 궁합 API 테스트 시작\n');

    try {
        // API 인스턴스 생성
        console.log('📦 ZodiacAPIReal 인스턴스 생성...');
        const api = new ZodiacAPIReal();

        // 잠시 기다려서 초기화 완료
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('\n🧪 테스트 1: 양자리 + 황소자리');
        const result1 = await api.getCompatibility(1, 2);
        console.log('📊 결과 1:', JSON.stringify(result1, null, 2));

        console.log('\n🧪 테스트 2: 양자리 + 사자자리');
        const result2 = await api.getCompatibility(1, 5);
        console.log('📊 결과 2:', JSON.stringify(result2, null, 2));

        console.log('\n🧪 테스트 3: 쌍둥이자리 + 천칭자리');
        const result3 = await api.getCompatibility(3, 7);
        console.log('📊 결과 3:', JSON.stringify(result3, null, 2));

        console.log('\n✅ 모든 테스트 완료!');

    } catch (error) {
        console.error('\n❌ 테스트 중 오류 발생:', error);
        console.error('스택 트레이스:', error.stack);
    }
}

// 테스트 실행
testCompatibility();