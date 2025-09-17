/**
 * 메시지 생성 품질 검증 테스트
 * Enhanced API의 메시지 생성 로직을 Node.js 환경에서 시뮬레이션
 */

const fs = require('fs');
const path = require('path');

// JSON 파일 읽기
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

// Enhanced API 메시지 생성 로직 재현
class MessageQualityTester {
    constructor() {
        this.historicalFigures = loadJSON('historical-figures-enhanced.json');
        this.fortuneData = loadJSON('api/fortune-data.json');
        
        // 메시지 템플릿 (Enhanced API와 동일)
        this.messageTemplates = {
            work: [
                "{figure}의 {trait}처럼 {specific}하는 하루를 보내세요",
                "{specific}로 {figure}가 {achievement}를 이룬 것처럼 성공하세요",
                "오늘은 {figure}의 '{quote}' 정신으로 업무에 임하세요"
            ],
            love: [
                "{figure}의 {trait}로 사랑을 표현하는 날입니다",
                "{specific}한 마음으로 {figure}처럼 진실한 사랑을 나누세요",
                "오늘의 사랑은 {figure}가 보여준 {trait}와 같은 깊이를 가질 것입니다"
            ],
            money: [
                "{figure}의 {trait}로 {specific}한 재정 관리를 하세요",
                "{achievement}를 이룬 {figure}처럼 현명한 투자를 고려해보세요",
                "오늘은 {figure}의 경제 철학을 참고해 {specific}하게 행동하세요"
            ],
            health: [
                "{figure}의 {trait}로 {specific}한 건강 관리를 하세요",
                "{achievement}를 위해 건강을 중시한 {figure}처럼 자신을 돌보세요",
                "오늘은 {figure}의 '{quote}' 마음가짐으로 건강한 하루를 보내세요"
            ]
        };
        
        this.zodiacKeys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                          'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    }
    
    // 인물 선택 로직 (Enhanced API 재현)
    selectHistoricalFigure(zodiacId, testDate = new Date()) {
        const zodiacKey = this.zodiacKeys[zodiacId - 1];
        const zodiacData = this.historicalFigures?.zodiacFigures?.[zodiacKey];
        
        if (!zodiacData || !zodiacData.figures || zodiacData.figures.length === 0) {
            return null;
        }
        
        // 날짜 기반 로테이션
        const dayOfYear = Math.floor((testDate - new Date(testDate.getFullYear(), 0, 0)) / 86400000);
        const figureIndex = dayOfYear % zodiacData.figures.length;
        
        return zodiacData.figures[figureIndex];
    }
    
    // 메시지 생성 로직 (Enhanced API 재현)
    generateEnhancedMessage(category, figure, zodiacId) {
        if (!figure || !this.messageTemplates[category]) {
            return null;
        }
        
        // 템플릿 선택
        const templates = this.messageTemplates[category];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // 치환 변수 준비
        const trait = figure.coreTraits?.[Math.floor(Math.random() * figure.coreTraits.length)] || '특성';
        const achievement = figure.achievements?.[0]?.split(' - ')[0] || '업적';
        const quote = figure.famousQuote || '명언';
        const categoryTrait = figure.categoryTraits?.[category] || `${category} 특성`;
        
        // 구체적 행동 지침 생성
        const specificActions = {
            work: ['창의적으로 사고', '적극적으로 도전', '혁신적으로 접근', '체계적으로 계획'],
            love: ['진심으로 소통', '따뜻하게 배려', '깊이 있게 이해', '정성스럽게 표현'],
            money: ['현명하게 판단', '계획적으로 관리', '신중하게 투자', '합리적으로 소비'],
            health: ['균형잡힌 생활', '꾸준한 운동', '건강한 식습관', '충분한 휴식']
        };
        
        const specific = specificActions[category]?.[Math.floor(Math.random() * specificActions[category].length)] || '적극적으로 행동';
        
        // 템플릿에 변수 치환
        let message = template
            .replace(/\{figure\}/g, figure.name)
            .replace(/\{trait\}/g, trait)
            .replace(/\{achievement\}/g, achievement)
            .replace(/\{quote\}/g, quote)
            .replace(/\{specific\}/g, specific);
        
        return message;
    }
    
    // 메시지 품질 분석
    analyzeMessageQuality() {
        console.log('🔍 메시지 생성 품질 검증 시작\n');
        
        const testResults = {
            totalMessages: 0,
            successfulMessages: 0,
            categories: {},
            figuresUsed: new Set(),
            uniqueMessages: new Set(),
            examples: []
        };
        
        // 각 별자리별로 테스트
        for (let zodiacId = 1; zodiacId <= 12; zodiacId++) {
            const figure = this.selectHistoricalFigure(zodiacId);
            
            if (!figure) continue;
            
            testResults.figuresUsed.add(figure.name);
            
            // 각 카테고리별로 메시지 생성
            const categories = ['work', 'love', 'money', 'health'];
            
            categories.forEach(category => {
                if (!testResults.categories[category]) {
                    testResults.categories[category] = {
                        generated: 0,
                        successful: 0,
                        examples: []
                    };
                }
                
                // 3번씩 생성해서 다양성 확인
                for (let i = 0; i < 3; i++) {
                    testResults.totalMessages++;
                    testResults.categories[category].generated++;
                    
                    const message = this.generateEnhancedMessage(category, figure, zodiacId);
                    
                    if (message && message.length > 10) {
                        testResults.successfulMessages++;
                        testResults.categories[category].successful++;
                        testResults.uniqueMessages.add(message);
                        
                        // 예시 저장 (카테고리당 2개씩)
                        if (testResults.categories[category].examples.length < 2) {
                            testResults.categories[category].examples.push({
                                zodiac: this.zodiacKeys[zodiacId - 1],
                                figure: figure.name,
                                message: message
                            });
                        }
                        
                        // 전체 예시 저장 (상위 10개)
                        if (testResults.examples.length < 10) {
                            testResults.examples.push({
                                zodiac: this.zodiacKeys[zodiacId - 1],
                                category: category,
                                figure: figure.name,
                                message: message
                            });
                        }
                    }
                }
            });
        }
        
        // 결과 출력
        console.log('=== 전체 통계 ===');
        console.log(`총 메시지 생성 시도: ${testResults.totalMessages}개`);
        console.log(`성공한 메시지: ${testResults.successfulMessages}개`);
        console.log(`성공률: ${(testResults.successfulMessages / testResults.totalMessages * 100).toFixed(1)}%`);
        console.log(`사용된 인물 수: ${testResults.figuresUsed.size}명`);
        console.log(`고유 메시지 수: ${testResults.uniqueMessages.size}개`);
        console.log(`메시지 다양성: ${(testResults.uniqueMessages.size / testResults.successfulMessages * 100).toFixed(1)}%\n`);
        
        // 카테고리별 통계
        console.log('=== 카테고리별 통계 ===');
        Object.entries(testResults.categories).forEach(([category, stats]) => {
            console.log(`${category.toUpperCase()}:`);
            console.log(`  생성 시도: ${stats.generated}개`);
            console.log(`  성공: ${stats.successful}개`);
            console.log(`  성공률: ${(stats.successful / stats.generated * 100).toFixed(1)}%\n`);
        });
        
        // 메시지 품질 예시
        console.log('=== 생성된 메시지 품질 예시 ===');
        testResults.examples.forEach((example, index) => {
            console.log(`${index + 1}. [${example.zodiac.toUpperCase()}-${example.category.toUpperCase()}] ${example.figure}:`);
            console.log(`   "${example.message}"\n`);
        });
        
        // 개선점 분석
        console.log('=== 품질 개선점 분석 ===');
        
        const issues = [];
        
        if (testResults.successfulMessages < testResults.totalMessages * 0.95) {
            issues.push('❌ 메시지 생성 실패율이 높습니다');
        }
        
        if (testResults.uniqueMessages.size < testResults.successfulMessages * 0.8) {
            issues.push('⚠️ 메시지 다양성이 부족합니다');
        }
        
        if (testResults.figuresUsed.size < 100) {
            issues.push('⚠️ 활용되는 인물 수가 적습니다');
        }
        
        if (issues.length === 0) {
            console.log('✅ 메시지 생성 품질이 우수합니다!');
        } else {
            issues.forEach(issue => console.log(issue));
        }
        
        return testResults;
    }
    
    // 기존 API vs 향상된 API 비교
    compareWithBasicAPI() {
        console.log('\n🆚 기존 API vs 향상된 API 메시지 비교\n');
        
        // 오늘 날짜의 기본 운세 데이터 찾기
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        // 양자리로 비교 테스트
        const zodiacId = 1;
        const basicFortune = this.fortuneData?.daily?.[dateKey]?.[zodiacId];
        const figure = this.selectHistoricalFigure(zodiacId);
        
        console.log('=== 양자리 메시지 비교 ===');
        console.log('📅 날짜:', dateKey);
        console.log('👑 선택된 인물:', figure?.name || '없음');
        console.log();
        
        if (basicFortune) {
            console.log('🔄 기존 API 메시지:');
            console.log(`"${basicFortune.overall}"`);
        } else {
            console.log('🔄 기존 API: 오늘 날짜 데이터 없음');
        }
        
        console.log();
        
        if (figure) {
            const enhancedMessage = this.generateEnhancedMessage('work', figure, zodiacId);
            console.log('✨ 향상된 API 메시지 (업무):');
            console.log(`"${enhancedMessage}"`);
            
            console.log();
            console.log('💡 개선점:');
            console.log('- 구체적 인물명과 업적 포함');
            console.log('- 실행 가능한 행동 지침 제시');
            console.log('- 개인화된 메시지 생성');
            console.log('- 매일 다른 인물로 로테이션');
        }
    }
}

// 테스트 실행
async function runQualityTests() {
    const tester = new MessageQualityTester();
    
    if (!tester.historicalFigures || !tester.fortuneData) {
        console.error('❌ 필요한 데이터 파일을 로드할 수 없습니다');
        return;
    }
    
    // 메시지 품질 분석
    const results = tester.analyzeMessageQuality();
    
    // 기존 API와 비교
    tester.compareWithBasicAPI();
    
    console.log('\n🎯 최종 검증 완료!');
}

// 실행
runQualityTests().catch(console.error);