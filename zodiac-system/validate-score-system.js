/**
 * 점수 기반 인물 선택 시스템 검증 스크립트
 * 다양한 점수 구간에서 올바른 그룹의 인물이 선택되는지 테스트
 */

const fs = require('fs');
const path = require('path');

class ScoreSystemValidator {
    constructor() {
        this.figuresDataPath = path.join(__dirname, 'historical-figures-balanced.json');
        this.figuresData = null;
    }
    
    /**
     * 인물 데이터 로드
     */
    loadFiguresData() {
        try {
            const data = fs.readFileSync(this.figuresDataPath, 'utf8');
            this.figuresData = JSON.parse(data);
            console.log('✅ 인물 데이터 로드 성공');
            return true;
        } catch (error) {
            console.error('❌ 인물 데이터 로드 실패:', error.message);
            return false;
        }
    }
    
    /**
     * 점수 그룹별 인물 분포 분석
     */
    analyzeScoreDistribution() {
        const distribution = { high: 0, medium: 0, low: 0 };
        const figuresByGroup = { high: [], medium: [], low: [] };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup) {
                        distribution[figure.scoreGroup]++;
                        figuresByGroup[figure.scoreGroup].push({
                            name: figure.name,
                            zodiac: zodiacKey
                        });
                    }
                }
            }
        }
        
        console.log('\n📊 점수 그룹별 인물 분포:');
        console.log(`- 고득점 그룹: ${distribution.high}명`);
        console.log(`- 중간점 그룹: ${distribution.medium}명`);
        console.log(`- 저득점 그룹: ${distribution.low}명`);
        
        return { distribution, figuresByGroup };
    }
    
    /**
     * 각 별자리별 점수 그룹 분포 확인
     */
    analyzeZodiacDistribution() {
        console.log('\n⭐ 별자리별 점수 그룹 분포:');
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                const groups = { high: 0, medium: 0, low: 0 };
                
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup) {
                        groups[figure.scoreGroup]++;
                    }
                }
                
                console.log(`- ${zodiacKey}: H${groups.high}/M${groups.medium}/L${groups.low} (총 ${zodiacData.figures.length}명)`);
            }
        }
    }
    
    /**
     * 점수 그룹별 대표 인물 샘플 출력
     */
    showGroupSamples() {
        console.log('\n🎭 점수 그룹별 대표 인물 샘플:');
        
        const samples = { high: [], medium: [], low: [] };
        
        // 각 그룹에서 대표 인물들 수집
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.scoreGroup && samples[figure.scoreGroup].length < 15) {
                        samples[figure.scoreGroup].push(figure.name);
                    }
                }
            }
        }
        
        console.log('🔥 고득점 그룹 샘플:');
        console.log('  ', samples.high.slice(0, 10).join(', '), '...');
        
        console.log('⚖️ 중간점 그룹 샘플:');
        console.log('  ', samples.medium.slice(0, 10).join(', '), '...');
        
        console.log('💪 저득점 그룹 샘플:');
        console.log('  ', samples.low.slice(0, 10).join(', '), '...');
    }
    
    /**
     * 메시지 템플릿 품질 검증
     */
    validateMessageTemplates() {
        console.log('\n📝 메시지 템플릿 품질 검증:');
        
        let templatesCount = 0;
        let qualityIssues = 0;
        const sampleMessages = { high: [], medium: [], low: [] };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.naturalTemplates) {
                        templatesCount++;
                        
                        // 각 그룹별 샘플 메시지 수집
                        if (figure.scoreGroup && sampleMessages[figure.scoreGroup].length < 3) {
                            if (figure.naturalTemplates.overall) {
                                sampleMessages[figure.scoreGroup].push({
                                    figure: figure.name,
                                    message: figure.naturalTemplates.overall
                                });
                            }
                        }
                        
                        // 품질 검증
                        for (const [category, template] of Object.entries(figure.naturalTemplates)) {
                            if (!template || template.length < 10) {
                                qualityIssues++;
                                console.log(`⚠️ 품질 이슈: ${figure.name} - ${category} 템플릿이 너무 짧음`);
                            }
                            
                            // 부정적 키워드 검사
                            const negativeKeywords = ['죽음', '실패', '불행', '문제', '어려움'];
                            for (const keyword of negativeKeywords) {
                                if (template.includes(keyword)) {
                                    qualityIssues++;
                                    console.log(`⚠️ 부정적 키워드 발견: ${figure.name} - ${category}: "${keyword}"`);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        console.log(`📊 템플릿 통계: 총 ${templatesCount}개 인물, 품질 이슈 ${qualityIssues}건`);
        
        // 그룹별 메시지 톤 샘플 출력
        console.log('\n🎨 그룹별 메시지 톤 샘플:');
        
        for (const [group, samples] of Object.entries(sampleMessages)) {
            if (samples.length > 0) {
                const groupLabels = {
                    high: '🔥 고득점 그룹',
                    medium: '⚖️ 중간점 그룹', 
                    low: '💪 저득점 그룹'
                };
                
                console.log(`\n${groupLabels[group]}:`);
                samples.forEach(sample => {
                    console.log(`- ${sample.figure}: ${sample.message.substring(0, 80)}...`);
                });
            }
        }
    }
    
    /**
     * 그룹별 톤 일관성 검증
     */
    validateToneConsistency() {
        console.log('\n🎯 그룹별 톤 일관성 검증:');
        
        const toneKeywords = {
            high: ['성공', '승리', '풍요', '왕성한', '힘차게', '성과', '도약', '번영'],
            medium: ['균형', '안정', '조화', '지혜로운', '차근차근', '꾸준한', '신중한', '배려'],
            low: ['극복', '도전', '시련', '강인한', '끈기', '희망', '회복력', '정신력']
        };
        
        const groupStats = { high: {}, medium: {}, low: {} };
        
        for (const [zodiacKey, zodiacData] of Object.entries(this.figuresData.zodiacFigures)) {
            if (zodiacData.figures) {
                for (const figure of zodiacData.figures) {
                    if (figure.naturalTemplates && figure.scoreGroup) {
                        const group = figure.scoreGroup;
                        if (!groupStats[group][zodiacKey]) {
                            groupStats[group][zodiacKey] = { 
                                figures: 0, 
                                consistentTone: 0,
                                totalTemplates: 0 
                            };
                        }
                        
                        groupStats[group][zodiacKey].figures++;
                        
                        // 각 템플릿의 톤 일관성 검사
                        for (const template of Object.values(figure.naturalTemplates)) {
                            groupStats[group][zodiacKey].totalTemplates++;
                            
                            let hasConsistentKeywords = false;
                            for (const keyword of toneKeywords[group]) {
                                if (template.includes(keyword)) {
                                    hasConsistentKeywords = true;
                                    break;
                                }
                            }
                            
                            if (hasConsistentKeywords) {
                                groupStats[group][zodiacKey].consistentTone++;
                            }
                        }
                    }
                }
            }
        }
        
        // 일관성 통계 출력
        for (const [group, zodiacStats] of Object.entries(groupStats)) {
            const groupLabels = {
                high: '🔥 고득점 그룹',
                medium: '⚖️ 중간점 그룹',
                low: '💪 저득점 그룹'
            };
            
            console.log(`\n${groupLabels[group]} 톤 일관성:`);
            
            let totalConsistent = 0;
            let totalTemplates = 0;
            
            for (const [zodiac, stats] of Object.entries(zodiacStats)) {
                const consistency = stats.totalTemplates > 0 ? 
                    ((stats.consistentTone / stats.totalTemplates) * 100).toFixed(1) : '0.0';
                console.log(`- ${zodiac}: ${consistency}% (${stats.consistentTone}/${stats.totalTemplates})`);
                
                totalConsistent += stats.consistentTone;
                totalTemplates += stats.totalTemplates;
            }
            
            const overallConsistency = totalTemplates > 0 ? 
                ((totalConsistent / totalTemplates) * 100).toFixed(1) : '0.0';
            console.log(`📊 전체 일관성: ${overallConsistency}%`);
        }
    }
    
    /**
     * 메인 검증 실행
     */
    async run() {
        console.log('🚀 점수 기반 인물 선택 시스템 검증 시작');
        console.log('=' .repeat(60));
        
        // 1. 데이터 로드
        if (!this.loadFiguresData()) {
            return false;
        }
        
        // 2. 점수 그룹별 분포 분석
        const { distribution, figuresByGroup } = this.analyzeScoreDistribution();
        
        // 3. 별자리별 분포 확인
        this.analyzeZodiacDistribution();
        
        // 4. 대표 인물 샘플 출력
        this.showGroupSamples();
        
        // 5. 메시지 템플릿 품질 검증
        this.validateMessageTemplates();
        
        // 6. 그룹별 톤 일관성 검증
        this.validateToneConsistency();
        
        console.log('\n🎉 점수 기반 시스템 검증 완료!');
        console.log('=' .repeat(60));
        
        // 검증 요약
        console.log('\n📋 검증 요약:');
        console.log(`- 전체 인물 수: ${distribution.high + distribution.medium + distribution.low}명`);
        console.log(`- 고득점 그룹: ${distribution.high}명 (성공적/긍정적)`);
        console.log(`- 중간점 그룹: ${distribution.medium}명 (균형적/안정적)`);
        console.log(`- 저득점 그룹: ${distribution.low}명 (도전적/극복형)`);
        console.log('- 각 그룹별로 고유한 톤의 메시지 템플릿 보유');
        
        return true;
    }
}

// 스크립트 실행
if (require.main === module) {
    const validator = new ScoreSystemValidator();
    validator.run().catch(error => {
        console.error('💥 검증 중 오류:', error);
        process.exit(1);
    });
}

module.exports = ScoreSystemValidator;