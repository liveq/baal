/**
 * 간단한 메시지 필터링 테스트
 * 구체적 vs 추상적 메시지 구분 검증
 */

// 인라인 MessageFilter 구현 (독립적 테스트용)
class MessageFilter {
    constructor() {
        this.concreteKeywords = [
            '모나리자', '최후의 만찬', '해바라기', '별이 빛나는 밤', '게르니카',
            '워털루 전투', '트라팔가 해전', '명량대첩', '갈리아 정복',
            '베토벤 9번', '운명 교향곡', '마법피리', '사계',
            '다비드상', '시스티나 성당', '파르테논 신전', '에펠탑'
        ];
        
        this.abstractTraits = [
            '개척정신', '창의력', '도전정신', '리더십', '카리스마', '열정',
            '용기', '지혜', '인내심', '결단력', '의지력', '영감'
        ];
        
        this.concreteActions = [
            '그린', '작곡한', '건축한', '발견한', '발명한', '정복한', '창조한',
            '완성한', '설계한', '지휘한', '연주한', '저술한', '조각한'
        ];
        
        this.stats = {
            totalChecked: 0,
            blocked: 0,
            passed: 0,
            categoryStats: {
                tooAbstract: 0,
                noConcreteAchievement: 0,
                poorGrammar: 0,
                tooShort: 0,
                qualityPassed: 0
            }
        };
    }
    
    validateMessageQuality(message, context = {}) {
        this.stats.totalChecked++;
        
        if (!message || message.length < 10) {
            this.stats.categoryStats.tooShort++;
            this.stats.blocked++;
            return { 
                passed: false, 
                score: 0, 
                reason: '메시지 너무 짧음'
            };
        }
        
        let score = 0;
        let hasConcreteContent = false;
        let abstractCount = 0;
        
        // 구체적 업적/작품 검사
        for (const keyword of this.concreteKeywords) {
            if (message.includes(keyword)) {
                score += 30;
                hasConcreteContent = true;
                console.log(`  ✅ 구체적 키워드 발견: ${keyword}`);
                break;
            }
        }
        
        // 구체적 행동 동사 검사
        for (const action of this.concreteActions) {
            if (message.includes(action)) {
                score += 20;
                hasConcreteContent = true;
                console.log(`  ✅ 구체적 행동 발견: ${action}`);
                break;
            }
        }
        
        // 추상적 표현 개수 확인
        for (const trait of this.abstractTraits) {
            if (message.includes(trait)) {
                abstractCount++;
                console.log(`  ⚠️ 추상적 표현 발견: ${trait}`);
            }
        }
        
        // 추가 점수
        if (/\d+/.test(message)) {
            score += 10;
            console.log('  ✅ 숫자 정보 포함');
        }
        if (/\b(프랑스|이탈리아|독일|영국|미국|한국|중국|일본|그리스|로마)\b/.test(message)) {
            score += 10;
            console.log('  ✅ 지역 정보 포함');
        }
        if (/\b(\d{4}년|\d+세기|고대|중세|르네상스|바로크)\b/.test(message)) {
            score += 15;
            console.log('  ✅ 시대 정보 포함');
        }
        if (message.length > 50) {
            score += 10;
            console.log('  ✅ 적절한 길이');
        }
        
        // 문법 검사
        let grammarScore = 100;
        if (/의의\s/.test(message)) {
            grammarScore -= 15;
            console.log('  ❌ 문법 오류: 의의');
        }
        if (/를를\s/.test(message)) {
            grammarScore -= 15;
            console.log('  ❌ 문법 오류: 를를');
        }
        if (/으로으로\s/.test(message)) {
            grammarScore -= 15;
            console.log('  ❌ 문법 오류: 으로으로');
        }
        if (/하세요하세요/.test(message)) {
            grammarScore -= 10;
            console.log('  ❌ 문법 오류: 하세요하세요');
        }
        
        // 최종 점수 계산
        const finalScore = Math.round(score * 0.7 + grammarScore * 0.3);
        
        // 통과 기준: 60점 이상 + (구체적 내용 있거나 추상적 표현 1개 이하) + 문법 70점 이상
        const passed = finalScore >= 60 && (hasConcreteContent || abstractCount <= 1) && grammarScore >= 70;
        
        let reason = '';
        if (!passed) {
            if (!hasConcreteContent) {
                reason = '구체적 업적 부족';
                this.stats.categoryStats.noConcreteAchievement++;
            } else if (abstractCount > 1) {
                reason = '추상적 표현 과다';
                this.stats.categoryStats.tooAbstract++;
            } else if (grammarScore < 70) {
                reason = '문법 문제';
                this.stats.categoryStats.poorGrammar++;
            } else {
                reason = '전반적 품질 기준 미달';
            }
            this.stats.blocked++;
        } else {
            this.stats.categoryStats.qualityPassed++;
            this.stats.passed++;
        }
        
        return {
            passed: passed,
            score: finalScore,
            reason: reason,
            hasConcreteContent: hasConcreteContent,
            abstractCount: abstractCount,
            grammarScore: grammarScore
        };
    }
    
    getFilterStats() {
        const passRate = this.stats.totalChecked > 0 ? 
            ((this.stats.passed / this.stats.totalChecked) * 100).toFixed(1) : 0;
        
        return {
            ...this.stats,
            passRate: `${passRate}%`
        };
    }
}

// 테스트 데이터
const testCases = {
    // 추상적 메시지들 (차단 대상)
    abstract: [
        "반 고흐의 개척정신으로 하루를 시작하세요",
        "나폴레옹처럼 도전을 실천하세요", 
        "다빈치의 창의력으로 문제를 해결하세요",
        "베토벤의 열정으로 음악을 만드세요",
        "미켈란젤로의 의지력으로 극복하세요"
    ],
    
    // 구체적 메시지들 (통과 대상)
    concrete: [
        "해바라기를 그린 반 고흐처럼 열정적인 하루를 보내세요",
        "워털루 전투를 이끈 나폴레옹처럼 결단력 있게 행동하세요",
        "모나리자를 완성한 다빈치처럼 세심하게 작업하세요",
        "베토벤 9번 교향곡을 작곡한 베토벤처럼 끈기 있게 노력하세요",
        "다비드상을 조각한 미켈란젤로처럼 완벽을 추구하세요"
    ],
    
    // 문법 문제가 있는 메시지들
    grammar: [
        "다빈치의의 모나리자를를 그렸듯이",
        "반 고흐으로으로 해바라기를 완성하세요",
        "베토벤하세요하세요 교향곡을 작곡하세요"
    ]
};

// 테스트 실행
function runTests() {
    const filter = new MessageFilter();
    console.log('🧪 메시지 필터링 시스템 테스트 시작\n');
    
    let totalCorrect = 0;
    let totalTests = 0;
    
    for (const [category, messages] of Object.entries(testCases)) {
        console.log(`\n🔍 ${category.toUpperCase()} 메시지 테스트:`);
        console.log('='.repeat(60));
        
        messages.forEach((message, index) => {
            totalTests++;
            console.log(`\n${index + 1}. "${message}"`);
            
            const result = filter.validateMessageQuality(message, {
                figureName: '테스트인물',
                category: 'test'
            });
            
            // 예상 결과
            let expected = false;
            if (category === 'concrete') expected = true;
            if (category === 'abstract') expected = false;
            if (category === 'grammar') expected = false;
            
            const correct = (result.passed === expected);
            if (correct) totalCorrect++;
            
            console.log(`   결과: ${result.passed ? '✅ PASS' : '❌ BLOCK'} (점수: ${result.score})`);
            console.log(`   예상: ${expected ? 'PASS' : 'BLOCK'} | 정답: ${correct ? '✓' : '✗'}`);
            console.log(`   이유: ${result.reason || 'N/A'}`);
            console.log(`   세부: 구체성 ${result.hasConcreteContent ? 'O' : 'X'}, 추상 ${result.abstractCount}개, 문법 ${result.grammarScore}점`);
        });
    }
    
    // 결과 요약
    console.log('\n\n📈 테스트 결과 요약:');
    console.log('='.repeat(60));
    
    const filterStats = filter.getFilterStats();
    console.log(`총 테스트: ${totalTests}개`);
    console.log(`정답률: ${totalCorrect}/${totalTests} (${((totalCorrect/totalTests)*100).toFixed(1)}%)`);
    console.log(`필터 통과율: ${filterStats.passRate}`);
    
    console.log('\n차단 이유별 통계:');
    Object.entries(filterStats.categoryStats).forEach(([reason, count]) => {
        if (count > 0) {
            console.log(`- ${reason}: ${count}개`);
        }
    });
    
    // 성능 분석
    console.log('\n🎯 필터 성능 분석:');
    const abstractResults = testCases.abstract.map(msg => filter.validateMessageQuality(msg));
    const concreteResults = testCases.concrete.map(msg => filter.validateMessageQuality(msg));
    
    // 새로운 필터 인스턴스를 사용해서 재테스트 (통계 초기화)
    const testFilter = new MessageFilter();
    
    const abstractCorrect = testCases.abstract.filter(msg => {
        const result = testFilter.validateMessageQuality(msg);
        return !result.passed; // 추상적 메시지가 차단되어야 함
    }).length;
    
    const concreteCorrect = testCases.concrete.filter(msg => {
        const result = testFilter.validateMessageQuality(msg);
        return result.passed; // 구체적 메시지가 통과되어야 함
    }).length;
    
    const precision = concreteCorrect / testCases.concrete.length; // 구체적 메시지 인식률
    const recall = abstractCorrect / testCases.abstract.length;    // 추상적 메시지 차단률
    const f1Score = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;
    
    console.log(`정밀도 (구체적 메시지 인식률): ${(precision * 100).toFixed(1)}%`);
    console.log(`재현율 (추상적 메시지 차단률): ${(recall * 100).toFixed(1)}%`);
    console.log(`F1 점수: ${(f1Score * 100).toFixed(1)}%`);
    
    console.log('\n💡 결론:');
    if (precision >= 0.8 && recall >= 0.8) {
        console.log('✅ 필터링 시스템이 예상대로 잘 작동하고 있습니다!');
    } else {
        console.log('⚠️ 필터링 시스템 개선이 필요합니다.');
        if (precision < 0.8) console.log('- 구체적 메시지 인식률 향상 필요');
        if (recall < 0.8) console.log('- 추상적 메시지 차단률 향상 필요');
    }
}

// 테스트 실행
runTests();