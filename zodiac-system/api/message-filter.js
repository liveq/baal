/**
 * 메시지 품질 필터링 시스템
 * 추상적 메시지를 차단하고 구체적인 메시지만 통과시킴
 * 역사적 인물과 업적의 구체성을 검증하는 고급 필터링 시스템
 */

class MessageFilter {
    constructor() {
        // 구체적인 업적/작품/사건 키워드 데이터베이스
        this.concreteAchievements = {
            // 예술 작품
            art: [
                '모나리자', '최후의 만찬', '비너스의 탄생', '생각하는 사람', '별이 빛나는 밤',
                '해바라기', '절규', '게르니카', '진주 귀걸이를 한 소녀', '자유의 여신상',
                '다비드상', '키스', '민족을 이끄는 자유의 여신', '아비뇽의 처녀들'
            ],
            
            // 문학 작품
            literature: [
                '로미오와 줄리엣', '햄릿', '파우스트', '돈키호테', '레미제라블', '전쟁과 평화',
                '백년의 고독', '1984', '어린 왕자', '변신', '죄와 벌', '오만과 편견'
            ],
            
            // 음악 작품
            music: [
                '베토벤 9번', '운명 교향곡', '마법피리', '라 트라비아타', '백조의 호수',
                '사계', '뉴월드 교향곡', '볼레로', '카르멘', '나비 부인'
            ],
            
            // 역사적 사건/전투
            history: [
                '워털루 전투', '트라팔가 해전', '관도대전', '적벽대전', '살라미스 해전',
                '이순신의 명량대첩', '나폴레옹의 이집트 원정', '카이사르의 갈리아 정복',
                '알렉산드로스의 동방원정', '크리스토퍼 콜럼버스의 신대륙 발견'
            ],
            
            // 과학 발견/발명
            science: [
                '만유인력의 법칙', '상대성이론', '진화론', '페니실린', '전구', '전화기',
                '라듐 발견', 'DNA 구조 발견', '현미경 발명', '망원경 발명'
            ],
            
            // 건축물
            architecture: [
                '에펠탑', '콜로세움', '타지마할', '피라미드', '파르테논 신전',
                '사그라다 파밀리아', '노트르담 대성당', '만리장성'
            ]
        };
        
        // 추상적 특성 키워드 (차단 대상)
        this.abstractTraits = [
            '개척정신', '창의력', '도전정신', '리더십', '카리스마', '열정',
            '용기', '지혜', '인내심', '결단력', '의지력', '영감',
            '비전', '통찰력', '직관', '상상력', '혁신성'
        ];
        
        // 구체적 행동 동사 (선호 키워드)
        this.concreteActions = [
            '그린', '작곡한', '건축한', '발견한', '발명한', '정복한', '창조한',
            '완성한', '설계한', '지휘한', '연주한', '저술한', '조각한',
            '촬영한', '연출한', '제작한', '개발한'
        ];
        
        // 필터링 통계
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
        
        // 필터링 로그 (최근 100개)
        this.filterLogs = [];
        this.maxLogSize = 100;
    }
    
    /**
     * 메시지 품질 검증 (메인 함수)
     * @param {string} message - 검증할 메시지
     * @param {Object} context - 컨텍스트 정보 (인물명, 카테고리 등)
     * @returns {Object} { passed: boolean, score: number, reason: string, improvedMessage?: string }
     */
    validateMessageQuality(message, context = {}) {
        this.stats.totalChecked++;
        
        console.log(`🔍 메시지 품질 검증 시작: "${message}"`);
        
        // 1단계: 기본 검증 (길이, 형식)
        const basicCheck = this.checkBasicQuality(message);
        if (!basicCheck.passed) {
            return this.recordResult(message, basicCheck, context);
        }
        
        // 2단계: 구체성 점수 계산
        const concreteScore = this.calculateConcreteScore(message);
        console.log(`📊 구체성 점수: ${concreteScore}/100`);
        
        // 3단계: 추상적 표현 감지
        const abstractCheck = this.detectAbstractExpressions(message);
        
        // 4단계: 역사적 사실 검증
        const factCheck = this.verifyHistoricalFacts(message, context.figureName);
        
        // 5단계: 한국어 문법 자연스러움 검증
        const grammarScore = this.checkGrammarNaturalness(message);
        
        // 최종 점수 계산 (가중평균)
        const finalScore = Math.round(
            concreteScore * 0.4 +
            (abstractCheck.passed ? 25 : 0) * 0.3 +
            factCheck.score * 0.2 +
            grammarScore * 0.1
        );
        
        console.log(`📈 최종 품질 점수: ${finalScore}/100`);
        
        // 통과 기준: 70점 이상
        const passed = finalScore >= 70;
        
        let reason = '';
        let improvedMessage = null;
        
        if (!passed) {
            // 구체적인 실패 이유 결정
            if (concreteScore < 50) {
                reason = '구체적 업적이 부족함';
                this.stats.categoryStats.noConcreteAchievement++;
            } else if (!abstractCheck.passed) {
                reason = '추상적 표현 과다 사용';
                this.stats.categoryStats.tooAbstract++;
            } else if (grammarScore < 60) {
                reason = '한국어 문법 부자연스러움';
                this.stats.categoryStats.poorGrammar++;
            } else {
                reason = '전반적 품질 기준 미달';
            }
            
            // 개선된 메시지 생성 시도
            improvedMessage = this.generateImprovedMessage(message, context);
        } else {
            this.stats.categoryStats.qualityPassed++;
        }
        
        const result = {
            passed: passed,
            score: finalScore,
            reason: reason,
            details: {
                concreteScore: concreteScore,
                abstractCheck: abstractCheck,
                factCheck: factCheck,
                grammarScore: grammarScore
            },
            improvedMessage: improvedMessage
        };
        
        return this.recordResult(message, result, context);
    }
    
    /**
     * 기본 품질 검증 (길이, 형식 등)
     */
    checkBasicQuality(message) {
        if (!message || typeof message !== 'string') {
            return { passed: false, reason: '유효하지 않은 메시지' };
        }
        
        if (message.trim().length < 10) {
            this.stats.categoryStats.tooShort++;
            return { passed: false, reason: '메시지가 너무 짧음' };
        }
        
        if (message.length > 500) {
            return { passed: false, reason: '메시지가 너무 김' };
        }
        
        return { passed: true };
    }
    
    /**
     * 구체성 점수 계산 알고리즘
     * 구체적인 업적/작품명이 포함된 정도를 평가
     */
    calculateConcreteScore(message) {
        let score = 0;
        
        // 구체적 업적/작품명 검사
        let achievementFound = false;
        for (const category of Object.values(this.concreteAchievements)) {
            for (const achievement of category) {
                if (message.includes(achievement)) {
                    score += 30;
                    achievementFound = true;
                    console.log(`✅ 구체적 업적 발견: ${achievement}`);
                    break;
                }
            }
            if (achievementFound) break;
        }
        
        // 구체적 행동 동사 검사
        let actionFound = false;
        for (const action of this.concreteActions) {
            if (message.includes(action)) {
                score += 20;
                actionFound = true;
                console.log(`✅ 구체적 행동 발견: ${action}`);
                break;
            }
        }
        
        // 숫자/날짜 포함 (구체성 증가)
        if (/\d+/.test(message)) {
            score += 15;
            console.log(`✅ 숫자 정보 포함`);
        }
        
        // 장소/국가명 포함
        if (/\b(프랑스|이탈리아|독일|영국|미국|한국|중국|일본|그리스|로마)\b/.test(message)) {
            score += 10;
            console.log(`✅ 구체적 장소 정보 포함`);
        }
        
        // 시대/연도 포함
        if (/\b(\d{4}년|\d+세기|고대|중세|근세|현대|르네상스|바로크)\b/.test(message)) {
            score += 15;
            console.log(`✅ 시대 정보 포함`);
        }
        
        // 보정: 메시지 길이에 따른 추가 점수
        if (message.length > 50) {
            score += 10;
        }
        
        return Math.min(100, score);
    }
    
    /**
     * 추상적 표현 감지
     * 추상적인 키워드만 있고 구체적 내용이 없는 메시지를 탐지
     */
    detectAbstractExpressions(message) {
        let abstractCount = 0;
        const foundAbstractTerms = [];
        
        for (const trait of this.abstractTraits) {
            if (message.includes(trait)) {
                abstractCount++;
                foundAbstractTerms.push(trait);
            }
        }
        
        // 추상적 용어가 2개 이상이고, 구체적 업적이 없으면 차단
        const hasConcreteContent = this.hasConcreteContent(message);
        
        if (abstractCount >= 2 && !hasConcreteContent) {
            console.log(`❌ 과도한 추상적 표현: ${foundAbstractTerms.join(', ')}`);
            return {
                passed: false,
                abstractCount: abstractCount,
                foundTerms: foundAbstractTerms,
                hasConcreteContent: hasConcreteContent
            };
        }
        
        return {
            passed: true,
            abstractCount: abstractCount,
            foundTerms: foundAbstractTerms,
            hasConcreteContent: hasConcreteContent
        };
    }
    
    /**
     * 구체적 내용 존재 여부 체크
     */
    hasConcreteContent(message) {
        // 구체적 업적/작품명이 하나라도 있으면 통과
        for (const category of Object.values(this.concreteAchievements)) {
            for (const achievement of category) {
                if (message.includes(achievement)) {
                    return true;
                }
            }
        }
        
        // 구체적 행동 동사가 있으면 통과
        for (const action of this.concreteActions) {
            if (message.includes(action)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 역사적 사실 검증
     * 인물명과 언급된 업적이 실제로 연관이 있는지 검증
     */
    verifyHistoricalFacts(message, figureName) {
        if (!figureName) {
            return { score: 70, verified: false, reason: '인물명 정보 없음' };
        }
        
        // 간단한 사실 검증 (확장 가능)
        const knownFacts = {
            '다빈치': ['모나리자', '최후의 만찬', '비트루비우스 인간'],
            '미켈란젤로': ['다비드상', '시스티나 성당', '피에타'],
            '피카소': ['게르니카', '아비뇽의 처녀들'],
            '반 고흐': ['해바라기', '별이 빛나는 밤', '감자 먹는 사람들'],
            '베토벤': ['운명 교향곡', '합창 교향곡', '9번 교향곡'],
            '모차르트': ['마법피리', '레퀴엠', '돈 지오반니'],
            '나폴레옹': ['워털루 전투', '이집트 원정', '아우스터리츠 전투'],
            '카이사르': ['갈리아 전쟁', '루비콘 강', '브루투스'],
            '셰익스피어': ['햄릿', '로미오와 줄리엣', '맥베스'],
            '괴테': ['파우스트', '젊은 베르테르의 슬픔']
        };
        
        const facts = knownFacts[figureName] || [];
        let factMatch = false;
        
        for (const fact of facts) {
            if (message.includes(fact)) {
                factMatch = true;
                console.log(`✅ 역사적 사실 일치: ${figureName} - ${fact}`);
                break;
            }
        }
        
        return {
            score: factMatch ? 90 : 70,
            verified: factMatch,
            knownFacts: facts.length,
            reason: factMatch ? '역사적 사실 일치' : '사실 검증 불가'
        };
    }
    
    /**
     * 한국어 문법 자연스러움 검증
     */
    checkGrammarNaturalness(message) {
        let score = 100;
        const issues = [];
        
        // 반복되는 조사 감지
        const particles = ['이', '가', '을', '를', '에', '에서', '로', '으로', '의', '와', '과'];
        for (const particle of particles) {
            const doublePattern = new RegExp(`${particle}\\s*${particle}`, 'g');
            if (doublePattern.test(message)) {
                score -= 20;
                issues.push(`반복 조사: ${particle}`);
            }
        }
        
        // 어색한 문장 구조 감지
        const awkwardPatterns = [
            { pattern: /의의\s/, desc: '의의 반복', penalty: 15 },
            { pattern: /를를\s/, desc: '를를 반복', penalty: 15 },
            { pattern: /에에\s/, desc: '에에 반복', penalty: 15 },
            { pattern: /으로으로\s/, desc: '으로으로 반복', penalty: 15 },
            { pattern: /하세요하세요/, desc: '하세요 반복', penalty: 10 }
        ];
        
        for (const pattern of awkwardPatterns) {
            if (pattern.pattern.test(message)) {
                score -= pattern.penalty;
                issues.push(pattern.desc);
            }
        }
        
        // 문장 길이 적절성 (너무 길면 감점)
        if (message.length > 200) {
            score -= 10;
            issues.push('문장이 너무 김');
        }
        
        // 문장 부호 사용 적절성
        if (message.includes('..') || message.includes('!!')) {
            score -= 5;
            issues.push('부호 사용 부적절');
        }
        
        console.log(`📝 문법 점수: ${Math.max(0, score)}/100 ${issues.length > 0 ? `(이슈: ${issues.join(', ')})` : ''}`);
        
        return Math.max(0, score);
    }
    
    /**
     * 개선된 메시지 생성 (폴백 메커니즘)
     */
    generateImprovedMessage(originalMessage, context) {
        try {
            const figureName = context.figureName || '위인';
            const category = context.category || '일반';
            
            // 구체적인 업적을 포함한 개선된 메시지 생성
            const achievements = this.concreteAchievements.art.concat(
                this.concreteAchievements.literature,
                this.concreteAchievements.music
            );
            
            const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
            
            const improvedTemplates = [
                `${figureName}이 ${randomAchievement}를 완성했듯이, 오늘도 꾸준한 노력으로 목표를 달성해보세요.`,
                `${randomAchievement}로 유명한 ${figureName}처럼, 세심한 준비와 집중력으로 성과를 이뤄내세요.`,
                `${figureName}의 ${randomAchievement} 창작 과정처럼, 인내심을 갖고 차근차근 진행하세요.`
            ];
            
            return improvedTemplates[Math.floor(Math.random() * improvedTemplates.length)];
            
        } catch (error) {
            console.error('❌ 개선 메시지 생성 실패:', error);
            return '오늘은 새로운 도전과 성취의 하루가 될 것입니다.';
        }
    }
    
    /**
     * 결과 기록 및 통계 업데이트
     */
    recordResult(message, result, context) {
        // 통과/차단 통계 업데이트
        if (result.passed) {
            this.stats.passed++;
        } else {
            this.stats.blocked++;
        }
        
        // 필터링 로그 추가
        const logEntry = {
            timestamp: new Date().toISOString(),
            message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
            passed: result.passed,
            score: result.score || 0,
            reason: result.reason || '',
            context: context
        };
        
        this.filterLogs.unshift(logEntry);
        
        // 로그 크기 제한
        if (this.filterLogs.length > this.maxLogSize) {
            this.filterLogs = this.filterLogs.slice(0, this.maxLogSize);
        }
        
        console.log(`${result.passed ? '✅' : '❌'} 필터링 결과: ${result.passed ? 'PASS' : 'BLOCK'} (점수: ${result.score || 0}) - ${result.reason || ''}`);
        
        return result;
    }
    
    /**
     * 필터링 통계 조회
     */
    getFilterStats() {
        const passRate = this.stats.totalChecked > 0 ? 
            ((this.stats.passed / this.stats.totalChecked) * 100).toFixed(1) : 0;
        
        return {
            ...this.stats,
            passRate: `${passRate}%`,
            recentLogs: this.filterLogs.slice(0, 10) // 최근 10개만 반환
        };
    }
    
    /**
     * 필터 설정 조정 (동적 튜닝용)
     */
    adjustFilterSettings(settings) {
        if (settings.minScore !== undefined) {
            this.minPassingScore = settings.minScore;
        }
        
        if (settings.maxAbstractCount !== undefined) {
            this.maxAbstractCount = settings.maxAbstractCount;
        }
        
        console.log('🔧 필터 설정 조정됨:', settings);
    }
    
    /**
     * 사전 정의된 안전한 메시지들 (최후 폴백용)
     */
    getSafetyFallbackMessage(category = 'general') {
        const safeMessages = {
            love: '진정한 사랑은 서로를 이해하고 존중하는 마음에서 시작됩니다.',
            money: '꾸준한 계획과 성실한 실행이 안정적인 재정을 만듭니다.',
            work: '목표를 세우고 단계별로 실행해나가면 좋은 결과를 얻을 수 있습니다.',
            health: '규칙적인 생활과 적당한 운동이 건강의 기본입니다.',
            general: '오늘도 긍정적인 마음으로 좋은 하루 보내시기 바랍니다.'
        };
        
        return safeMessages[category] || safeMessages.general;
    }
}

// 전역 인스턴스 생성
const messageFilter = new MessageFilter();

// Export (Node.js 환경 지원)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageFilter;
}