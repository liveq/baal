/**
 * Node.js 환경에서 별자리 API 테스트
 * 서버 없이 직접 JSON 파일을 읽어서 테스트
 */

const fs = require('fs');
const path = require('path');

// JSON 파일 읽기 함수
function loadJSON(filename) {
    try {
        const fullPath = path.join(__dirname, '..', filename);
        const data = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ ${filename} 로드 실패:`, error.message);
        return null;
    }
}

// 테스트 실행
async function runTests() {
    console.log('🌟 별자리 API 시스템 테스트 시작\n');
    
    // 1. 데이터 로드 테스트
    console.log('=== 1. 데이터 로드 테스트 ===');
    
    const fortuneData = loadJSON('api/fortune-data.json');
    const historicalFigures = loadJSON('historical-figures-enhanced.json');
    
    if (fortuneData) {
        const dailyCount = Object.keys(fortuneData.daily || {}).length;
        console.log(`✅ 운세 데이터: ${dailyCount}일치 데이터 로드 완료`);
    }
    
    if (historicalFigures) {
        const zodiacFigures = historicalFigures.zodiacFigures || {};
        const totalFigures = Object.values(zodiacFigures).reduce((sum, zodiac) => 
            sum + (zodiac.figures?.length || 0), 0);
        console.log(`✅ 역사적 인물: ${totalFigures}명 데이터 로드 완료`);
    }
    
    // 2. 별자리별 인물 분포 확인
    console.log('\n=== 2. 별자리별 인물 분포 ===');
    if (historicalFigures) {
        const zodiacFigures = historicalFigures.zodiacFigures;
        Object.entries(zodiacFigures).forEach(([key, data]) => {
            console.log(`${data.name}: ${data.figures?.length || 0}명`);
        });
    }
    
    // 3. 메시지 생성 로직 테스트
    console.log('\n=== 3. 메시지 생성 로직 테스트 ===');
    
    if (historicalFigures) {
        // 양자리 첫 번째 인물로 테스트
        const ariesFigures = historicalFigures.zodiacFigures.aries.figures;
        if (ariesFigures && ariesFigures.length > 0) {
            const testFigure = ariesFigures[0];
            
            console.log(`🔍 테스트 인물: ${testFigure.name} (${testFigure.period})`);
            console.log(`📝 업적 수: ${testFigure.achievements?.length || 0}개`);
            console.log(`💭 명언: "${testFigure.famousQuote || 'N/A'}"`);
            
            // 카테고리별 특성 확인
            const categoryTraits = testFigure.categoryTraits || {};
            console.log('📊 카테고리별 특성:');
            Object.entries(categoryTraits).forEach(([category, trait]) => {
                console.log(`  - ${category}: ${trait.substring(0, 50)}...`);
            });
        }
    }
    
    // 4. 운세 데이터 샘플 확인
    console.log('\n=== 4. 운세 데이터 샘플 확인 ===');
    if (fortuneData) {
        // 오늘 날짜로 운세 데이터 찾기
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        console.log(`📅 테스트 날짜: ${dateKey}`);
        
        // 양자리 운세 확인
        const ariesFortune = fortuneData.daily?.[dateKey]?.[1];
        if (ariesFortune) {
            console.log('✅ 양자리 오늘의 운세:');
            console.log(`  - Overall: ${ariesFortune.overall?.substring(0, 60)}...`);
            console.log(`  - Work: ${ariesFortune.work?.substring(0, 40)}...`);
            console.log(`  - Love: ${ariesFortune.love?.substring(0, 40)}...`);
        } else {
            console.log('⚠️ 오늘 날짜의 운세 데이터 없음 (기본 메시지 생성 필요)');
        }
    }
    
    // 5. 데이터 무결성 검증
    console.log('\n=== 5. 데이터 무결성 검증 ===');
    
    let issues = [];
    
    if (historicalFigures) {
        const zodiacFigures = historicalFigures.zodiacFigures;
        
        // 12개 별자리 모두 있는지 확인
        const expectedZodiacs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                               'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        
        expectedZodiacs.forEach(zodiac => {
            if (!zodiacFigures[zodiac]) {
                issues.push(`❌ ${zodiac} 별자리 데이터 없음`);
            } else if (!zodiacFigures[zodiac].figures || zodiacFigures[zodiac].figures.length === 0) {
                issues.push(`⚠️ ${zodiac} 별자리 인물 데이터 없음`);
            }
        });
        
        // 각 인물의 필수 필드 확인
        Object.entries(zodiacFigures).forEach(([zodiacKey, zodiacData]) => {
            zodiacData.figures?.forEach((figure, index) => {
                const requiredFields = ['name', 'period', 'achievements', 'coreTraits', 'famousQuote', 'categoryTraits'];
                requiredFields.forEach(field => {
                    if (!figure[field]) {
                        issues.push(`⚠️ ${zodiacData.name} ${index + 1}번째 인물 - ${field} 필드 없음`);
                    }
                });
                
                // categoryTraits의 4개 카테고리 확인
                const categoryTraits = figure.categoryTraits || {};
                const expectedCategories = ['work', 'love', 'money', 'health'];
                expectedCategories.forEach(category => {
                    if (!categoryTraits[category]) {
                        issues.push(`⚠️ ${figure.name} - ${category} 카테고리 특성 없음`);
                    }
                });
            });
        });
    }
    
    if (issues.length === 0) {
        console.log('✅ 모든 데이터 무결성 검증 통과');
    } else {
        console.log(`⚠️ ${issues.length}개 이슈 발견:`);
        issues.slice(0, 10).forEach(issue => console.log(`  ${issue}`));
        if (issues.length > 10) {
            console.log(`  ... 및 ${issues.length - 10}개 추가 이슈`);
        }
    }
    
    // 6. 성능 검증
    console.log('\n=== 6. 성능 검증 ===');
    
    const startTime = Date.now();
    
    // 100번 인물 선택 시뮬레이션
    if (historicalFigures) {
        for (let i = 0; i < 100; i++) {
            const zodiacId = Math.floor(Math.random() * 12) + 1;
            const zodiacKeys = Object.keys(historicalFigures.zodiacFigures);
            const zodiacKey = zodiacKeys[zodiacId - 1];
            const figures = historicalFigures.zodiacFigures[zodiacKey]?.figures || [];
            
            if (figures.length > 0) {
                const dayIndex = i % 7; // 7일 로테이션 시뮬레이션
                const figureIndex = dayIndex % figures.length;
                const selectedFigure = figures[figureIndex];
                // 메시지 생성 시뮬레이션 (실제 생성은 하지 않음)
            }
        }
    }
    
    const endTime = Date.now();
    console.log(`✅ 100회 인물 선택 시뮬레이션 완료: ${endTime - startTime}ms`);
    
    console.log('\n🎉 테스트 완료!');
}

// 테스트 실행
runTests().catch(console.error);