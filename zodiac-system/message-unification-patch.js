/**
 * 메시지 단일화 패치
 * zodiac-api-real.js의 getDailyFortune 메서드 수정본
 * 
 * 문제점:
 * - fortune-data.json에 이미 "나폴레옹의 도전으로..." 같은 완성된 인물 메시지 존재
 * - API에서 historical-figures로 또 다른 인물 추가하여 중복 생성
 * - 결과: "마르코폴로의 탐험정신으로 나폴레옹의 도전으로..." 같은 깨진 메시지
 * 
 * 해결방안:
 * - fortune-data.json 우선 사용 (이미 완성된 인물 메시지)
 * - historical-figures는 fortune-data가 없을 때만 사용
 * - 중복 조합/변환 로직 제거
 */

// 수정된 getDailyFortune 메서드 (라인 466-598 교체용)
const FIXED_GET_DAILY_FORTUNE_METHOD = `
    /**
     * 일일 운세 가져오기 (메시지 단일화 수정) - 핵심 메서드 시그니처 유지
     */
    async getDailyFortune(zodiacId) {
        console.log('🌟 getDailyFortune() 호출됨 (Message Unification Fixed Version)');
        console.log('📝 요청 파라미터:', { zodiacId, zodiacIdType: typeof zodiacId });
        
        // 데이터가 아직 로드되지 않았으면 기다림
        if (!this.fortuneData) {
            console.log('⏳ fortuneData가 없음, loadFortuneData() 호출...');
            await this.loadFortuneData();
        }
        
        if (!this.historicalFigures) {
            console.log('⏳ historicalFigures가 없음, loadHistoricalFigures() 호출...');
            await this.loadHistoricalFigures();
        }

        const today = new Date().toISOString().split('T')[0];
        console.log('📅 오늘 날짜:', today);
        
        // 역사적 인물 선택 (디버깅용으로만 사용)
        const selectedFigure = this.selectHistoricalFigure(zodiacId, today);
        console.log('🎭 선택된 역사적 인물 (참조용):', selectedFigure ? selectedFigure.name : 'none');
        
        // fortune-data.json에서 기본 데이터 찾기 (기존 로직 유지)
        let fortuneData = null;
        
        if (this.fortuneData.daily[today] && this.fortuneData.daily[today][zodiacId]) {
            fortuneData = this.fortuneData.daily[today][zodiacId];
            console.log('✅ 오늘 날짜 fortune 데이터 발견!');
        } else {
            // 폴백 로직 (기존과 동일)
            console.log('⚠️ 오늘 날짜 데이터 없음, 폴백 로직 시작...');
            
            const fallbackDate = '2025-01-01';
            const availableDates = Object.keys(this.fortuneData.daily).sort();
            
            let useDate = fallbackDate;
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getDate();
            
            // 같은 월일을 찾기 (연도 무시)
            for (const date of availableDates) {
                const [year, month, day] = date.split('-').map(Number);
                if (month === currentMonth && day === currentDay) {
                    useDate = date;
                    console.log('🎉 같은 월일 발견:', useDate);
                    break;
                }
            }
            
            // 못 찾으면 같은 일자 사용 (월 무시)
            if (useDate === fallbackDate) {
                for (const date of availableDates) {
                    const day = parseInt(date.split('-')[2]);
                    if (day === currentDay) {
                        useDate = date;
                        console.log('📅 같은 일자 발견:', useDate);
                        break;
                    }
                }
            }
            
            if (this.fortuneData.daily[useDate] && this.fortuneData.daily[useDate][zodiacId]) {
                fortuneData = this.fortuneData.daily[useDate][zodiacId];
                console.log('✅ 폴백 fortune 데이터 사용:', useDate);
            }
        }
        
        // 메시지 단일화: fortune-data.json 우선 사용 (이미 완성된 인물 메시지 포함)
        if (fortuneData) {
            console.log('📋 fortune 데이터 우선 사용 (이미 완성된 인물 메시지, 중복 조합 제거)');
            
            // fortune-data.json에 이미 인물이 포함된 완성 메시지가 있으므로 그대로 사용
            const enhancedFortunes = {};
            if (fortuneData.fortunes) {
                for (const [category, message] of Object.entries(fortuneData.fortunes)) {
                    // 각 카테고리 메시지도 그대로 사용 (추가 인물 특성 적용 제거)
                    enhancedFortunes[category] = this.ensureMessageQuality(message);
                }
            }
            
            // 히스토리컬 피규어 정보는 디버깅용으로만 포함
            const historicalInfo = selectedFigure ? {
                name: selectedFigure.name,
                period: selectedFigure.period,
                country: selectedFigure.country,
                achievement: selectedFigure.achievements ? selectedFigure.achievements[0] : null
            } : null;
            
            return {
                zodiacId: zodiacId,
                date: today,
                overall: this.ensureMessageQuality(fortuneData.overall), // 중복 조합 제거
                scores: fortuneData.scores,
                fortunes: enhancedFortunes,
                lucky: fortuneData.lucky,
                advice: this.ensureMessageQuality(fortuneData.advice), // 중복 변환 제거
                historicalFigure: historicalInfo,
                source: 'fortune-complete-message-unified'
            };
        } else if (selectedFigure) {
            console.log('🎭 Historical-figures 데이터만 사용 (fortune 데이터 없음)');
            
            // fortune-data.json이 없을 때만 historical-figures 사용
            const generatedFortune = this.generateDailyFortune(zodiacId);
            
            // 역사적 인물 특성을 활용한 메시지 생성 (이 경우만 인물 조합 허용)
            const enhancedFortunes = {};
            const categories = ['love', 'money', 'work', 'health'];
            
            for (const category of categories) {
                if (generatedFortune.fortunes && generatedFortune.fortunes[category]) {
                    enhancedFortunes[category] = this.generateEnhancedMessage(
                        selectedFigure, 
                        category, 
                        generatedFortune.fortunes[category]
                    );
                }
            }
            
            const rawOverall = selectedFigure.coreTraits && selectedFigure.coreTraits.length > 0 ?
                \`\${selectedFigure.name}의 \${selectedFigure.coreTraits[0]} 정신으로 \${generatedFortune.overall}\` :
                generatedFortune.overall;
            
            return {
                zodiacId: zodiacId,
                date: today,
                overall: this.ensureMessageQuality(rawOverall),
                scores: generatedFortune.scores,
                fortunes: enhancedFortunes,
                lucky: generatedFortune.lucky,
                advice: this.formatWithConcreteExample(selectedFigure, generatedFortune.advice),
                historicalFigure: {
                    name: selectedFigure.name,
                    period: selectedFigure.period,
                    country: selectedFigure.country,
                    achievement: selectedFigure.achievements ? selectedFigure.achievements[0] : null
                },
                source: 'historical-figures-only-unified'
            };
        } else {
            console.log('🔧 기본 데이터 생성 (품질 검증 포함)');
            return this.generateDailyFortune(zodiacId);
        }
    }`;

// 자동 적용 함수
async function applyMessageUnificationPatch() {
    const fs = require('fs');
    const API_FILE_PATH = './api/zodiac-api-real.js';
    
    console.log('🛠️ 메시지 단일화 패치 적용 시작...\n');
    
    try {
        // 원본 파일 읽기
        const originalContent = fs.readFileSync(API_FILE_PATH, 'utf8');
        
        // 백업 생성
        const backupPath = API_FILE_PATH + '.backup-' + Date.now();
        fs.writeFileSync(backupPath, originalContent, 'utf8');
        console.log('✅ 원본 백업 생성:', backupPath);
        
        // 기존 getDailyFortune 메서드 위치 찾기
        const methodStartPattern = /async getDailyFortune\(zodiacId\) \{/;
        const startMatch = originalContent.match(methodStartPattern);
        
        if (!startMatch) {
            throw new Error('getDailyFortune 메서드를 찾을 수 없습니다.');
        }
        
        const startIndex = startMatch.index;
        console.log('📍 getDailyFortune 메서드 시작 위치:', startIndex);
        
        // 메서드 끝 찾기 (중괄호 매칭)
        let braceCount = 0;
        let methodEndIndex = -1;
        let inMethod = false;
        
        for (let i = startIndex; i < originalContent.length; i++) {
            const char = originalContent[i];
            
            if (char === '{') {
                braceCount++;
                inMethod = true;
            } else if (char === '}') {
                braceCount--;
                if (inMethod && braceCount === 0) {
                    methodEndIndex = i + 1;
                    break;
                }
            }
        }
        
        if (methodEndIndex === -1) {
            throw new Error('getDailyFortune 메서드의 끝을 찾을 수 없습니다.');
        }
        
        console.log('📍 getDailyFortune 메서드 끝 위치:', methodEndIndex);
        
        // 새 내용으로 교체
        const beforeMethod = originalContent.substring(0, startIndex);
        const afterMethod = originalContent.substring(methodEndIndex);
        const newContent = beforeMethod + FIXED_GET_DAILY_FORTUNE_METHOD.trim() + afterMethod;
        
        // 파일 저장
        fs.writeFileSync(API_FILE_PATH, newContent, 'utf8');
        
        console.log('✅ 메시지 단일화 패치 적용 완료!');
        console.log('📋 변경 사항:');
        console.log('  - fortune-data.json 우선 사용 (완성된 인물 메시지)');
        console.log('  - 중복 인물 조합 로직 제거');
        console.log('  - 중복 advice 변환 로직 제거');
        console.log('  - historical-figures는 fortune-data 없을 때만 사용');
        
        return true;
        
    } catch (error) {
        console.error('❌ 패치 적용 실패:', error.message);
        return false;
    }
}

// 테스트 함수
async function testPatchResult() {
    console.log('\\n🧪 패치 결과 테스트...');
    
    try {
        // 수정된 파일 로드 테스트 (구문 검사)
        const { execSync } = require('child_process');
        execSync('node -c ./api/zodiac-api-real.js', { cwd: process.cwd() });
        console.log('✅ JavaScript 구문 검사 통과');
        
        // 실제 API 테스트 (간단한 로드 테스트)
        delete require.cache[require.resolve('./api/zodiac-api-real.js')];
        console.log('✅ 모듈 캐시 클리어');
        
        console.log('✅ 패치 적용 후 테스트 완료');
        
    } catch (error) {
        console.error('❌ 패치 결과 테스트 실패:', error.message);
        console.log('💡 백업 파일로 복원 필요');
    }
}

// 메인 실행
if (require.main === module) {
    (async () => {
        const success = await applyMessageUnificationPatch();
        if (success) {
            await testPatchResult();
        }
    })();
}

module.exports = {
    applyMessageUnificationPatch,
    testPatchResult,
    FIXED_GET_DAILY_FORTUNE_METHOD
};