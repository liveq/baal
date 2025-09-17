/**
 * 별자리 운세 시스템 - 점수 기반 인물 그룹 분류 및 메시지 일관성 구현
 * 240명의 역사적 인물을 점수 기반으로 3그룹으로 분류하여 메시지 톤 일관성 확보
 * 
 * 그룹 분류:
 * - 고득점 그룹(85점 이상): 성공적/긍정적 인물
 * - 중간점 그룹(70-84점): 균형적/안정적 인물
 * - 저득점 그룹(69점 이하): 도전적/극복형 인물
 */

const fs = require('fs');
const path = require('path');

class ScoreBasedFigureGrouping {
    constructor() {
        this.historicalFiguresPath = path.join(__dirname, 'historical-figures-enhanced.json');
        this.outputPath = path.join(__dirname, 'historical-figures-score-grouped.json');
        this.figuresData = null;
        
        // 점수 기반 그룹 정의
        this.scoreGroups = {
            high: { min: 85, max: 100, label: '고득점 그룹 (성공적/긍정적)' },
            medium: { min: 70, max: 84, label: '중간점 그룹 (균형적/안정적)' },
            low: { min: 0, max: 69, label: '저득점 그룹 (도전적/극복형)' }
        };
        
        // 성공적/긍정적 인물들 (고득점 그룹용)
        this.highScoreFigures = [
            '나폴레옹', '스티브 잡스', '레오나르도 다빈치', '미켈란젤로', '윌리엄 셰익스피어',
            '베토벤', '아인슈타인', '피카소', '코코 샤넬', '월트 디즈니',
            '빌 게이츠', '스테판 스필버그', '오프라 윈프리', '마이클 조던', '모차르트',
            '갈릴레이', '율리우스 카이사르', '알렉산더 대왕', '클레오파트라', '잔 다르크',
            '워런 버핏', '엘론 머스크', '마돈나', '프랭크 시나트라', '마릴린 먼로',
            '오드리 헵번', '엘리자베스 2세', '다이애나 공주', '존 F. 케네디', '로널드 레이건',
            '톰 크루즈', '브래드 피트', '안젤리나 졸리', '레오나르도 디카프리오', '윌 스미스',
            '로버트 다우니 주니어', '조지 클루니', '톰 행크스', '모건 프리먼', '데니얼 크레이그',
            '마이클 잭슨', '프레디 머큐리', '엘튼 존', '폴 매카트니', '존 레논',
            '밥 딜런', '프린스', '비욘세', '테일러 스위프트', '에드 시런'
        ];
        
        // 균형적/안정적 인물들 (중간점 그룹용)
        this.mediumScoreFigures = [
            '간디', '안네 프랑크', '헬렌 켈러', '마더 테레사', '달라이 라마',
            '넬슨 만델라', '마틴 루터 킹', '아브라함 링컨', '윈스턴 처칠', '테오도르 루스벨트',
            '벤자민 프랭클린', '토마스 에디슨', '니콜라 테슬라', '마리 퀴리', '찰스 다윈',
            '스테판 호킹', '칼 융', '지그문트 프로이드', '소크라테스', '플라톤',
            '아리스토텔레스', '공자', '노자', '부처', '예수',
            '무하마드', '모세', '카를 마르크스', '프리드리히 니체', '임마누엘 칸트',
            '르네 데카르트', '존 로크', '볼테르', '루소', '몽테스키외',
            '괴테', '단테', '세르반테스', '톨스토이', '도스토예프스키',
            '카프카', '헤밍웨이', '마크 트웨인', '찰스 디킨스', '제인 오스틴',
            '버지니아 울프', '심슨', '아가사 크리스티', '조지 오웰', '알베르 까뮈'
        ];
        
        // 도전적/극복형 인물들 (저득점 그룹용)  
        this.lowScoreFigures = [
            '빈센트 반 고흐', '프리다 칼로', '에밀리 디킨슨', '에드가 앨런 포', '니체',
            '바이런', '셸리', '키츠', '예이츠', '실비아 플라스',
            '버지니아 울프', '헤밍웨이', '스콧 피츠제럴드', '잭 런던', '오스카 와일드',
            '테네시 윌리엄스', '아서 밀러', '유진 오닐', '사무엘 베케트', '장 폴 사르트르',
            '체 게바라', '말콤 X', '로자 파크스', '해리엇 터브먼', '수잔 B. 안토니',
            '에밀리 디킨슨', '메리 울스턴크래프트', '시몬 드 보부아르', '베티 프리댄', '글로리아 스타이넘',
            '루스 베이더 긴스버그', '산드라 데이 오코너', '테다 루즈벨트', '엘리너 루스벨트', '재클린 케네디',
            '이반 데니소비치', '알렉산드르 솔제니친', '바츨라프 하벨', '레흐 바웬사', '바이올렛 에번스',
            '쿠르트 코베인', '지미 헨드릭스', '재니스 조플린', '짐 모리슨', '에이미 와인하우스',
            '휘트니 휴스턴', '마이클 조던', '타이거 우즈', '세리나 윌리엄스', '무하마드 알리'
        ];
    }
    
    /**
     * 인물 데이터 로드
     */
    async loadHistoricalFigures() {
        try {
            console.log('📁 인물 데이터 로드 중...');
            const data = fs.readFileSync(this.historicalFiguresPath, 'utf8');
            this.figuresData = JSON.parse(data);
            
            console.log('✅ 인물 데이터 로드 성공');
            console.log('📊 데이터 구조 분석:');
            
            if (this.figuresData && this.figuresData.zodiacFigures) {
                const zodiacKeys = Object.keys(this.figuresData.zodiacFigures);
                console.log(`- 별자리 수: ${zodiacKeys.length}`);
                
                let totalFigures = 0;
                for (const zodiac of zodiacKeys) {
                    const figures = this.figuresData.zodiacFigures[zodiac].figures || [];
                    totalFigures += figures.length;
                    console.log(`- ${zodiac}: ${figures.length}명`);
                }
                console.log(`- 전체 인물 수: ${totalFigures}명`);
            }
            
            return true;
        } catch (error) {
            console.error('❌ 인물 데이터 로드 실패:', error.message);
            return false;
        }
    }
    
    /**
     * 인물이 어느 점수 그룹에 속하는지 판단
     */
    getFigureScoreGroup(figureName) {
        if (this.highScoreFigures.includes(figureName)) {
            return 'high';
        } else if (this.mediumScoreFigures.includes(figureName)) {
            return 'medium';
        } else if (this.lowScoreFigures.includes(figureName)) {
            return 'low';
        } else {
            // 새로운 인물이면 이름 기반으로 추정
            return this.estimateScoreGroup(figureName);
        }
    }
    
    /**
     * 이름 기반으로 점수 그룹 추정 (패턴 기반)
     */
    estimateScoreGroup(figureName) {
        // 성공/승리 관련 키워드
        const successKeywords = ['왕', '황제', '대제', '대왕', '성공', '승리', '장군', '지휘관'];
        // 예술/창작 관련 키워드  
        const artistKeywords = ['화가', '작곡가', '작가', '시인', '예술가', '음악가'];
        // 도전/극복 관련 키워드
        const challengeKeywords = ['혁명가', '투사', '활동가', '개혁가'];
        
        const lowerName = figureName.toLowerCase();
        
        for (const keyword of successKeywords) {
            if (lowerName.includes(keyword.toLowerCase())) {
                console.log(`🔍 "${figureName}" → 고득점 그룹 (키워드: ${keyword})`);
                return 'high';
            }
        }
        
        for (const keyword of challengeKeywords) {
            if (lowerName.includes(keyword.toLowerCase())) {
                console.log(`🔍 "${figureName}" → 저득점 그룹 (키워드: ${keyword})`);
                return 'low';
            }
        }
        
        for (const keyword of artistKeywords) {
            if (lowerName.includes(keyword.toLowerCase())) {
                console.log(`🔍 "${figureName}" → 중간점 그룹 (키워드: ${keyword})`);
                return 'medium';
            }
        }
        
        // 기본값은 중간점 그룹
        console.log(`🔍 "${figureName}" → 중간점 그룹 (기본값)`);
        return 'medium';
    }
    
    /**
     * 점수 그룹에 따른 메시지 톤 템플릿 생성
     */
    generateMessageTemplates(group, figureName, achievement) {
        const templates = {
            high: {
                overall: `${achievement}을 이룬 ${figureName}처럼, 오늘도 성공을 향해 힘차게 나아갈 수 있는 날입니다`,
                love: `${figureName}의 열정적인 사랑처럼, 당신의 마음도 따뜻한 사랑으로 가득 찰 것입니다`,
                money: `${figureName}의 풍요로운 성취처럼, 재정적 풍요와 안정이 찾아올 것입니다`,
                work: `${achievement}을 완성한 ${figureName}처럼, 업무에서 큰 성과를 거둘 수 있습니다`,
                health: `${figureName}의 왕성한 활력처럼, 몸과 마음이 건강하고 에너지가 넘치는 하루입니다`
            },
            medium: {
                overall: `${figureName}의 지혜로운 균형감처럼, 오늘은 안정적이고 조화로운 하루가 될 것입니다`,
                love: `${figureName}의 깊은 이해심처럼, 상대방을 배려하는 따뜻한 마음이 빛나는 날입니다`,
                money: `${figureName}의 신중한 판단력처럼, 재정 관리에서 현명한 선택을 할 수 있습니다`,
                work: `${figureName}의 차근차근한 접근법처럼, 꾸준한 노력으로 좋은 결과를 얻을 것입니다`,
                health: `${figureName}의 규칙적인 생활 습관처럼, 건강을 위한 작은 실천들이 큰 도움이 됩니다`
            },
            low: {
                overall: `어려움을 극복한 ${figureName}처럼, 오늘의 도전을 통해 더 강한 자신을 발견할 것입니다`,
                love: `${figureName}의 불굴의 사랑처럼, 진정한 마음으로 소중한 관계를 지켜나갈 수 있습니다`,
                money: `${figureName}의 끈기 있는 노력처럼, 어려운 상황에서도 희망을 잃지 않는 지혜가 필요합니다`,
                work: `${figureName}이 시련을 극복했듯이, 현재의 어려움도 성장의 발판이 될 것입니다`,
                health: `${figureName}의 강인한 정신력처럼, 몸과 마음의 회복력을 기를 수 있는 날입니다`
            }
        };
        
        return templates[group] || templates.medium;
    }
    
    /**
     * 모든 인물에 점수 그룹 정보 추가
     */
    addScoreGroupsToFigures() {
        if (!this.figuresData || !this.figuresData.zodiacFigures) {
            console.error('❌ 인물 데이터가 없습니다');
            return false;
        }
        
        console.log('🔄 점수 그룹 분류 시작...');
        
        let totalProcessed = 0;
        const groupCounts = { high: 0, medium: 0, low: 0 };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (!zodiacData.figures) continue;
            
            console.log(`\n📋 ${zodiacKey} 별자리 처리 중... (${zodiacData.figures.length}명)`);
            
            for (let i = 0; i < zodiacData.figures.length; i++) {
                const figure = zodiacData.figures[i];
                
                // 점수 그룹 결정
                const scoreGroup = this.getFigureScoreGroup(figure.name);
                
                // 점수 그룹 정보 추가
                figure.scoreGroup = scoreGroup;
                figure.scoreGroupLabel = this.scoreGroups[scoreGroup].label;
                
                // 업적 정보 추출
                const achievement = figure.achievements && figure.achievements.length > 0 ? 
                    figure.achievements[0].split(' - ')[0] : figure.name + '의 업적';
                
                // 점수 그룹별 메시지 템플릿 추가
                const messageTemplates = this.generateMessageTemplates(scoreGroup, figure.name, achievement);
                
                // 기존 naturalTemplates 보완
                if (!figure.naturalTemplates) {
                    figure.naturalTemplates = {};
                }
                
                // 점수 그룹별 톤에 맞게 템플릿 업데이트
                for (const [category, template] of Object.entries(messageTemplates)) {
                    figure.naturalTemplates[category] = template;
                }
                
                totalProcessed++;
                groupCounts[scoreGroup]++;
                
                if (totalProcessed % 20 === 0) {
                    console.log(`✅ ${totalProcessed}명 처리 완료...`);
                }
            }
        }
        
        console.log('\n🎉 점수 그룹 분류 완료!');
        console.log('📊 그룹별 분포:');
        console.log(`- 고득점 그룹 (85점 이상): ${groupCounts.high}명`);
        console.log(`- 중간점 그룹 (70-84점): ${groupCounts.medium}명`);
        console.log(`- 저득점 그룹 (69점 이하): ${groupCounts.low}명`);
        console.log(`- 전체 처리된 인물: ${totalProcessed}명`);
        
        return true;
    }
    
    /**
     * 업데이트된 데이터 저장
     */
    saveUpdatedData() {
        try {
            console.log('💾 업데이트된 데이터 저장 중...');
            
            const jsonData = JSON.stringify(this.figuresData, null, 2);
            fs.writeFileSync(this.outputPath, jsonData, 'utf8');
            
            console.log('✅ 데이터 저장 성공:', this.outputPath);
            
            // 파일 크기 확인
            const stats = fs.statSync(this.outputPath);
            console.log(`📏 저장된 파일 크기: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
            
            return true;
        } catch (error) {
            console.error('❌ 데이터 저장 실패:', error.message);
            return false;
        }
    }
    
    /**
     * 점수 그룹별 샘플 인물 출력
     */
    showGroupSamples() {
        console.log('\n🎭 점수 그룹별 샘플 인물들:');
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            const samples = { high: [], medium: [], low: [] };
            
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup && samples[figure.scoreGroup].length < 2) {
                        samples[figure.scoreGroup].push({
                            name: figure.name,
                            template: figure.naturalTemplates?.overall?.substring(0, 80) + '...'
                        });
                    }
                }
            }
            
            if (Object.values(samples).some(group => group.length > 0)) {
                console.log(`\n⭐ ${zodiacKey} 별자리:`);
                if (samples.high.length > 0) {
                    console.log('  🔥 고득점:', samples.high.map(s => s.name).join(', '));
                }
                if (samples.medium.length > 0) {
                    console.log('  ⚖️ 중간점:', samples.medium.map(s => s.name).join(', '));
                }
                if (samples.low.length > 0) {
                    console.log('  💪 저득점:', samples.low.map(s => s.name).join(', '));
                }
            }
            
            // 첫 3개 별자리만 샘플 출력
            if (Object.keys(this.figuresData.zodiacFigures).indexOf(zodiacKey) >= 2) {
                break;
            }
        }
    }
    
    /**
     * 메인 실행 함수
     */
    async run() {
        console.log('🚀 점수 기반 인물 그룹 분류 시작');
        console.log('🎯 목표: 240명 인물을 3그룹으로 분류하여 메시지 일관성 확보\n');
        
        // 1. 데이터 로드
        const loaded = await this.loadHistoricalFigures();
        if (!loaded) return false;
        
        // 2. 점수 그룹 분류 및 템플릿 생성
        const processed = this.addScoreGroupsToFigures();
        if (!processed) return false;
        
        // 3. 샘플 출력
        this.showGroupSamples();
        
        // 4. 데이터 저장
        const saved = this.saveUpdatedData();
        if (!saved) return false;
        
        console.log('\n🎉 점수 기반 인물 그룹 분류 완료!');
        console.log('📋 다음 단계: zodiac-api-final.js에서 점수 기반 인물 선택 로직 구현');
        
        return true;
    }
}

// 스크립트 실행
if (require.main === module) {
    const grouping = new ScoreBasedFigureGrouping();
    grouping.run().catch(error => {
        console.error('💥 실행 중 오류:', error);
        process.exit(1);
    });
}

module.exports = ScoreBasedFigureGrouping;