/**
 * 점수 기반 인물 그룹 재균형 스크립트
 * 현재 분포를 더 균형있게 조정 (80:80:80 비율 목표)
 */

const fs = require('fs');
const path = require('path');

class ScoreGroupRebalancer {
    constructor() {
        this.inputPath = path.join(__dirname, 'historical-figures-score-grouped.json');
        this.outputPath = path.join(__dirname, 'historical-figures-balanced.json');
        this.figuresData = null;
        
        // 수동으로 고득점 그룹으로 이동할 인물들 (성공적/긍정적)
        this.promoteToHigh = [
            '나폴레옹 보나파르트', '알렉산더 대왕', '율리우스 카이사르', '아우구스투스',
            '루이 14세', '클레오파트라', '엘리자베스 1세', '샤를마뉴',
            '레오나르도 다빈치', '미켈란젤로', '파블로 피카소', '베토벤',
            '모차르트', '알베르트 아인슈타인', '갈릴레오 갈릴레이', '아이작 뉴턴',
            '토마스 에디슨', '니콜라 테슬라', '스티븐 스필버그', '알프레드 히치콕',
            '톰 한크스', '로버트 드 니로', '메릴 스트립', '비요세',
            'J.K. 롤링', '스티븐 킹', '엘비스 프레슬리', '마이클 잭슨',
            '프레디 머큐리', '데이비드 보위', '마돈나', '세레나 윌리엄스',
            '로저 페더러', '리오넬 메시', '데이비드 베컴', '루이 암스트롱',
            '미크 재거', '로빈 윌리엄스', '찰리 채플린', '앤디 워홀'
        ];
        
        // 수동으로 저득점 그룹으로 이동할 인물들 (도전적/극복형)
        this.demoteToLow = [
            '빈센트 반 고흐', '프리다 칼로', '커트 코베인', '지미 헨드릭스',
            '표도르 도스토예프스키', '프란츠 카프카', '에드가 앨런 포', '실비아 플라스',
            '어니스트 헤밍웨이', '오스카 와일드', '체 게바라', '말콤 X',
            '로사 파크스', '마틴 루터 킹 주니어', '넬슨 만델라', '마하트마 간디',
            '스티븐 호킹', '루이 파스퇴르', '마리 퀴리', '조나스 소크',
            '아돌프 히틀러', '스탈린', '블라디미르 레닌', '칼 마르크스',
            '니콜로 마키아벨리', '마르틴 루터', '지그문트 프로이트', '칼 융',
            '니체', '사르트르', '까뮈', '카프카', '토마스 만', '헤르만 헤세',
            '알 카포네', '찰스 다윈', '라이언 고슬링', '키아누 리브스',
            '조디 포스터', '잭 니콜슨', '더스틴 호프만', '브루스 윌리스'
        ];
    }
    
    /**
     * 데이터 로드
     */
    loadData() {
        try {
            const data = fs.readFileSync(this.inputPath, 'utf8');
            this.figuresData = JSON.parse(data);
            console.log('✅ 데이터 로드 성공');
            return true;
        } catch (error) {
            console.error('❌ 데이터 로드 실패:', error.message);
            return false;
        }
    }
    
    /**
     * 현재 그룹 분포 분석
     */
    analyzeCurrentDistribution() {
        const distribution = { high: 0, medium: 0, low: 0 };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup) {
                        distribution[figure.scoreGroup]++;
                    }
                }
            }
        }
        
        console.log('📊 현재 그룹 분포:');
        console.log(`- 고득점 그룹: ${distribution.high}명`);
        console.log(`- 중간점 그룹: ${distribution.medium}명`);
        console.log(`- 저득점 그룹: ${distribution.low}명`);
        
        return distribution;
    }
    
    /**
     * 그룹 재균형 실행
     */
    rebalanceGroups() {
        console.log('🔄 그룹 재균형 시작...');
        
        let promoted = 0;
        let demoted = 0;
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (let i = 0; i < zodiacData.figures.length; i++) {
                    const figure = zodiacData.figures[i];
                    const originalGroup = figure.scoreGroup;
                    
                    // 고득점 그룹으로 승격
                    if (this.promoteToHigh.includes(figure.name) && figure.scoreGroup !== 'high') {
                        figure.scoreGroup = 'high';
                        figure.scoreGroupLabel = '고득점 그룹 (성공적/긍정적)';
                        
                        // 고득점 그룹용 긍정적 메시지 템플릿 업데이트
                        this.updateMessageTemplates(figure, 'high');
                        promoted++;
                        
                        console.log(`⬆️ ${figure.name}: ${originalGroup} → high`);
                    }
                    
                    // 저득점 그룹으로 강등
                    else if (this.demoteToLow.includes(figure.name) && figure.scoreGroup !== 'low') {
                        figure.scoreGroup = 'low';
                        figure.scoreGroupLabel = '저득점 그룹 (도전적/극복형)';
                        
                        // 저득점 그룹용 극복형 메시지 템플릿 업데이트
                        this.updateMessageTemplates(figure, 'low');
                        demoted++;
                        
                        console.log(`⬇️ ${figure.name}: ${originalGroup} → low`);
                    }
                }
            }
        }
        
        console.log(`✅ 재균형 완료: ${promoted}명 승격, ${demoted}명 강등`);
    }
    
    /**
     * 점수 그룹에 따른 메시지 템플릿 업데이트
     */
    updateMessageTemplates(figure, group) {
        const achievement = figure.achievements && figure.achievements.length > 0 ? 
            figure.achievements[0].split(' - ')[0] : figure.name + '의 업적';
        
        const templates = {
            high: {
                overall: `${achievement}을 이룬 ${figure.name}처럼, 오늘도 성공을 향해 힘차게 나아갈 수 있는 날입니다`,
                love: `${figure.name}의 열정적인 사랑처럼, 당신의 마음도 따뜻한 사랑으로 가득 찰 것입니다`,
                money: `${figure.name}의 풍요로운 성취처럼, 재정적 풍요와 안정이 찾아올 것입니다`,
                work: `${achievement}을 완성한 ${figure.name}처럼, 업무에서 큰 성과를 거둘 수 있습니다`,
                health: `${figure.name}의 왕성한 활력처럼, 몸과 마음이 건강하고 에너지가 넘치는 하루입니다`
            },
            medium: {
                overall: `${figure.name}의 지혜로운 균형감처럼, 오늘은 안정적이고 조화로운 하루가 될 것입니다`,
                love: `${figure.name}의 깊은 이해심처럼, 상대방을 배려하는 따뜻한 마음이 빛나는 날입니다`,
                money: `${figure.name}의 신중한 판단력처럼, 재정 관리에서 현명한 선택을 할 수 있습니다`,
                work: `${figure.name}의 차근차근한 접근법처럼, 꾸준한 노력으로 좋은 결과를 얻을 것입니다`,
                health: `${figure.name}의 규칙적인 생활 습관처럼, 건강을 위한 작은 실천들이 큰 도움이 됩니다`
            },
            low: {
                overall: `어려움을 극복한 ${figure.name}처럼, 오늘의 도전을 통해 더 강한 자신을 발견할 것입니다`,
                love: `${figure.name}의 불굴의 사랑처럼, 진정한 마음으로 소중한 관계를 지켜나갈 수 있습니다`,
                money: `${figure.name}의 끈기 있는 노력처럼, 어려운 상황에서도 희망을 잃지 않는 지혜가 필요합니다`,
                work: `${figure.name}이 시련을 극복했듯이, 현재의 어려움도 성장의 발판이 될 것입니다`,
                health: `${figure.name}의 강인한 정신력처럼, 몸과 마음의 회복력을 기를 수 있는 날입니다`
            }
        };
        
        const groupTemplates = templates[group] || templates.medium;
        
        if (!figure.naturalTemplates) {
            figure.naturalTemplates = {};
        }
        
        for (const [category, template] of Object.entries(groupTemplates)) {
            figure.naturalTemplates[category] = template;
        }
    }
    
    /**
     * 업데이트된 데이터 저장
     */
    saveData() {
        try {
            const jsonData = JSON.stringify(this.figuresData, null, 2);
            fs.writeFileSync(this.outputPath, jsonData, 'utf8');
            
            console.log('✅ 재균형된 데이터 저장 성공:', this.outputPath);
            
            const stats = fs.statSync(this.outputPath);
            console.log(`📏 파일 크기: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
            
            return true;
        } catch (error) {
            console.error('❌ 데이터 저장 실패:', error.message);
            return false;
        }
    }
    
    /**
     * 샘플 출력
     */
    showSamples() {
        console.log('\n🎭 재균형 후 그룹별 샘플:');
        
        const samples = { high: [], medium: [], low: [] };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup && samples[figure.scoreGroup].length < 3) {
                        samples[figure.scoreGroup].push(figure.name);
                    }
                }
            }
            
            if (Object.keys(this.figuresData.zodiacFigures).indexOf(zodiacKey) >= 2) {
                break;
            }
        }
        
        console.log('🔥 고득점 그룹 샘플:', samples.high.join(', '));
        console.log('⚖️ 중간점 그룹 샘플:', samples.medium.join(', '));
        console.log('💪 저득점 그룹 샘플:', samples.low.join(', '));
    }
    
    /**
     * 메인 실행 함수
     */
    run() {
        console.log('🚀 점수 그룹 재균형 시작');
        console.log('🎯 목표: 240명을 더 균형있게 3그룹으로 분배\n');
        
        // 1. 데이터 로드
        if (!this.loadData()) return false;
        
        // 2. 현재 분포 분석
        const beforeDistribution = this.analyzeCurrentDistribution();
        
        // 3. 그룹 재균형
        this.rebalanceGroups();
        
        // 4. 재균형 후 분포 분석
        console.log('\n📊 재균형 후 분포:');
        const afterDistribution = this.analyzeCurrentDistribution();
        
        // 5. 샘플 출력
        this.showSamples();
        
        // 6. 데이터 저장
        if (!this.saveData()) return false;
        
        console.log('\n🎉 그룹 재균형 완료!');
        console.log('📋 다음 단계: zodiac-api-final.js에서 점수 기반 선택 로직 적용');
        
        return true;
    }
}

// 스크립트 실행
if (require.main === module) {
    const rebalancer = new ScoreGroupRebalancer();
    rebalancer.run().catch(error => {
        console.error('💥 실행 중 오류:', error);
        process.exit(1);
    });
}

module.exports = ScoreGroupRebalancer;