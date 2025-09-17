class BloodTypeAPI {
    constructor() {
        this.bloodTypeData = null;
        this.historicalFigures = null;
        this.loadAllData();
        
        this.bloodTypes = [
            { id: 'A', name: 'A형', color: '#3b82f6' },
            { id: 'B', name: 'B형', color: '#f59e0b' },
            { id: 'O', name: 'O형', color: '#ef4444' },
            { id: 'AB', name: 'AB형', color: '#8b5cf6' }
        ];
    }
    
    async loadAllData() {
        try {
            const [dataResponse, figuresResponse] = await Promise.all([
                fetch('../data/blood-type-data.json'),
                fetch('../data/historical-figures.json')
            ]);
            
            this.bloodTypeData = await dataResponse.json();
            this.historicalFigures = await figuresResponse.json();
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            this.bloodTypeData = this.getDefaultData();
            this.historicalFigures = this.getDefaultFigures();
        }
    }
    
    async getBasicTraits(bloodType, gender) {
        if (!this.bloodTypeData) {
            await this.loadAllData();
        }
        
        const traits = this.bloodTypeData.basicTraits.find(
            t => t.bloodType === bloodType && t.gender === gender
        );
        
        return traits || this.getDefaultBasicTraits(bloodType, gender);
    }
    
    async getCategoryAnalysis(bloodType, category, gender = 'male') {
        if (!this.bloodTypeData) {
            await this.loadAllData();
        }
        
        // 먼저 성별 구분된 데이터를 찾음
        let analysis = this.bloodTypeData.categoryAnalysis.find(
            a => a.bloodType === bloodType && a.category === category && a.gender === gender
        );
        
        // 성별 구분된 데이터가 없으면 통합 데이터를 찾음 (하위 호환성)
        if (!analysis) {
            analysis = this.bloodTypeData.categoryAnalysis.find(
                a => a.bloodType === bloodType && a.category === category && !a.gender
            );
        }
        
        return analysis || this.getDefaultCategoryAnalysis(bloodType, category, gender);
    }
    
    getHistoricalFigures(bloodType, gender) {
        if (!this.historicalFigures) {
            return [];
        }
        
        const figures = this.historicalFigures[bloodType];
        if (!figures) return [];
        
        return gender === 'male' ? figures.male : figures.female;
    }
    
    getMetaphor(bloodType) {
        if (!this.historicalFigures) {
            return { season: '', element: '', nature: '', time: '', color: '' };
        }
        
        return this.historicalFigures.metaphors[bloodType] || {};
    }
    
    getCompatibility(type1, type2) {
        const compatibilityMap = {
            'A-A': { score: 85, description: 'A형끼리는 서로를 깊이 이해하며 안정적인 관계를 만듭니다. 스티브 잡스와 빌 게이츠처럼 완벽을 추구하는 동반자가 될 수 있습니다.', tips: '서로의 완벽주의 성향을 인정하고 여유를 가지세요.' },
            'A-B': { score: 65, description: 'A형의 신중함과 B형의 자유로움이 균형을 이룹니다. 세종대왕과 다빈치처럼 서로를 보완할 수 있습니다.', tips: 'B형의 자유로운 성향을 존중해주세요.' },
            'A-O': { score: 75, description: 'A형의 섬세함과 O형의 리더십이 좋은 조화를 이룹니다. 간디와 나폴레옹처럼 다른 방식으로 세상을 바꿉니다.', tips: 'O형의 결단력을 신뢰하세요.' },
            'A-AB': { score: 80, description: 'A형과 AB형은 지적인 대화를 즐기며 서로를 존중합니다. 워렌 버핏과 아인슈타인처럼 깊은 통찰을 나눕니다.', tips: 'AB형의 독특한 관점을 받아들이세요.' },
            'B-A': { score: 65, description: 'B형의 창의성과 A형의 체계성이 보완적입니다. 피카소와 세종대왕처럼 예술과 질서가 만납니다.', tips: 'A형의 계획적인 성향을 이해해주세요.' },
            'B-B': { score: 70, description: 'B형끼리는 자유롭고 재미있는 관계를 만듭니다. 다빈치와 피카소처럼 창의적 시너지가 폭발합니다.', tips: '서로의 독립성을 존중하되 약속은 지키세요.' },
            'B-O': { score: 85, description: 'B형과 O형은 활발하고 열정적인 관계를 형성합니다. 잭 마와 엘론 머스크처럼 혁신을 만들어냅니다.', tips: '함께 새로운 경험을 즐기세요.' },
            'B-AB': { score: 75, description: 'B형과 AB형은 창의적이고 독특한 관계를 만듭니다. 짐 캐리와 오바마처럼 재미와 지혜가 공존합니다.', tips: '서로의 개성을 인정하고 존중하세요.' },
            'O-A': { score: 75, description: 'O형의 추진력과 A형의 세심함이 시너지를 냅니다. 정주영과 워렌 버핏처럼 실행과 계획이 조화를 이룹니다.', tips: 'A형의 신중한 접근을 기다려주세요.' },
            'O-B': { score: 85, description: 'O형과 B형은 활기차고 모험적인 관계를 즐깁니다. 이순신과 다빈치처럼 용기와 창의가 만납니다.', tips: '함께 도전하고 성장하세요.' },
            'O-O': { score: 80, description: 'O형끼리는 열정적이고 경쟁적인 관계를 형성합니다. 나폴레옹과 알렉산더처럼 세계를 정복합니다.', tips: '서로의 리더십을 번갈아 발휘하세요.' },
            'O-AB': { score: 70, description: 'O형의 직설성과 AB형의 복잡함이 흥미로운 관계를 만듭니다. 엘론 머스크와 아인슈타인처럼 현실과 이상이 만납니다.', tips: 'AB형의 내면을 이해하려 노력하세요.' },
            'AB-A': { score: 80, description: 'AB형과 A형은 지적이고 세련된 관계를 형성합니다. 오바마와 빌 게이츠처럼 지혜로운 파트너십을 만듭니다.', tips: 'A형의 감정적 요구를 충족시켜주세요.' },
            'AB-B': { score: 75, description: 'AB형과 B형은 창의적이고 자유로운 관계를 만듭니다. 반 고흐와 피카소처럼 예술적 교감을 나눕니다.', tips: 'B형의 즉흥성을 즐기세요.' },
            'AB-O': { score: 70, description: 'AB형의 이성과 O형의 감성이 균형을 이룹니다. 아인슈타인과 처칠처럼 지성과 카리스마가 만납니다.', tips: 'O형의 직관을 신뢰하세요.' },
            'AB-AB': { score: 90, description: 'AB형끼리는 서로를 완벽하게 이해하는 특별한 관계입니다. 아인슈타인과 오바마처럼 천재적 시너지를 만듭니다.', tips: '깊은 대화와 지적 교류를 즐기세요.' }
        };
        
        const key = `${type1}-${type2}`;
        return compatibilityMap[key] || { score: 50, description: '서로를 알아가는 중입니다.', tips: '서로의 차이를 인정하고 존중하세요.' };
    }
    
    async getDailyFortune(bloodType, date) {
        const figures = this.getHistoricalFigures(bloodType, 'male').concat(
            this.getHistoricalFigures(bloodType, 'female')
        );
        const randomFigure = figures[Math.floor(Math.random() * figures.length)];
        
        const fortunes = {
            'A': {
                message: `오늘은 당신의 세심함이 빛을 발하는 날입니다. ${randomFigure ? randomFigure.name + '의 ' + randomFigure.trait + '처럼' : '스티브 잡스의 완벽주의처럼'}, 디테일에 집중하면 큰 성과를 얻을 수 있습니다.`,
                loveScore: 85,
                healthScore: 75,
                wealthScore: 80,
                luckyColor: '하늘색',
                luckyNumber: 7,
                advice: '오늘은 계획을 세우고 체계적으로 일을 진행하세요. 작은 성공들이 모여 큰 결과를 만들 것입니다.'
            },
            'B': {
                message: `자유로운 영혼인 당신에게 새로운 기회가 찾아옵니다. ${randomFigure ? randomFigure.name + '의 ' + randomFigure.trait + '처럼' : '레오나르도 다빈치의 창의성처럼'}, 틀에 얽매이지 마세요.`,
                loveScore: 78,
                healthScore: 82,
                wealthScore: 75,
                luckyColor: '주황색',
                luckyNumber: 3,
                advice: '직관을 따르고 새로운 시도를 두려워하지 마세요. 예상치 못한 곳에서 행운이 찾아올 것입니다.'
            },
            'O': {
                message: `리더의 기운이 충만한 날입니다. ${randomFigure ? randomFigure.name + '의 ' + randomFigure.trait + '처럼' : '나폴레옹의 추진력처럼'}, 당신의 열정이 주변을 움직일 것입니다.`,
                loveScore: 88,
                healthScore: 85,
                wealthScore: 90,
                luckyColor: '붉은색',
                luckyNumber: 1,
                advice: '주도적으로 나서되, 팀워크도 잊지 마세요. 함께할 때 더 큰 성공을 이룰 수 있습니다.'
            },
            'AB': {
                message: `당신의 독특한 관점이 빛나는 날입니다. ${randomFigure ? randomFigure.name + '의 ' + randomFigure.trait + '처럼' : '아인슈타인의 천재성처럼'}, 남다른 시각으로 문제를 해결하세요.`,
                loveScore: 82,
                healthScore: 78,
                wealthScore: 85,
                luckyColor: '보라색',
                luckyNumber: 9,
                advice: '복잡한 상황을 단순하게 정리하는 능력을 발휘하세요. 당신의 통찰력이 해답을 찾을 것입니다.'
            }
        };
        
        return fortunes[bloodType] || fortunes['A'];
    }
    
    getDefaultBasicTraits(bloodType, gender) {
        const defaults = {
            'A': {
                overall: 'A형은 신중하고 섬세하며 완벽주의적 성향을 가지고 있습니다. 역사 속 위대한 혁신가들처럼 디테일에서 완벽을 추구합니다.',
                strengths: ['책임감이 강함', '계획적임', '신중함', '배려심이 깊음', '완벽 추구'],
                weaknesses: ['소심함', '우유부단함', '스트레스에 약함'],
                famousPeople: ['스티브 잡스', '빌 게이츠', '워렌 버핏', '세종대왕']
            },
            'B': {
                overall: 'B형은 자유롭고 창의적이며 독립적인 성향을 가지고 있습니다. 예술가의 영혼으로 세상을 바라봅니다.',
                strengths: ['창의적임', '독립적임', '유연함', '낙천적임', '혁신적임'],
                weaknesses: ['변덕스러움', '규칙을 싫어함', '자기중심적임'],
                famousPeople: ['레오나르도 다빈치', '폴 매카트니', '잭 마', '피카소']
            },
            'O': {
                overall: 'O형은 열정적이고 리더십이 있으며 목표 지향적입니다. 타고난 정복자의 기질을 가지고 있습니다.',
                strengths: ['리더십', '추진력', '사교성', '낙관적임', '결단력'],
                weaknesses: ['고집이 셈', '경쟁심이 강함', '인내심 부족'],
                famousPeople: ['나폴레옹', '엘론 머스크', '이순신', '정주영']
            },
            'AB': {
                overall: 'AB형은 이성적이고 독특하며 천재적 기질을 가지고 있습니다. 복잡한 내면 세계를 가진 신비로운 존재입니다.',
                strengths: ['분석적임', '독창적임', '공정함', '적응력이 좋음', '통찰력'],
                weaknesses: ['이중적임', '비판적임', '감정 표현이 서툼'],
                famousPeople: ['아인슈타인', '오바마', '반 고흐', '존 레논']
            }
        };
        
        return defaults[bloodType] || defaults['A'];
    }
    
    getDefaultCategoryAnalysis(bloodType, category, gender = 'male') {
        const defaults = {
            'love': {
                'male': {
                    score: 75,
                    description: '당신은 사랑에 있어서 진실하고 헌신적입니다. 리더십과 결단력으로 관계를 이끌어갑니다.',
                    advice: '상대방의 감정을 더 세심하게 배려하고 표현해보세요.',
                    luckyItems: ['장미', '편지', '향수', '음악']
                },
                'female': {
                    score: 78,
                    description: '당신은 사랑에 있어서 섬세하고 감성적입니다. 깊은 공감과 이해로 관계를 풍요롭게 만듭니다.',
                    advice: '자신의 욕구도 명확히 표현하는 것이 중요합니다.',
                    luckyItems: ['꽃다발', '일기장', '캔들', '보석']
                }
            },
            'health': {
                'male': {
                    score: 80,
                    description: '체력적으로 강건하지만 과로에 주의해야 합니다. 근력 운동과 유산소 운동의 균형이 중요합니다.',
                    advice: '정기적인 건강검진과 충분한 수분 섭취를 잊지 마세요.',
                    luckyItems: ['운동화', '프로틴', '헬스장', '산악자전거']
                },
                'female': {
                    score: 82,
                    description: '호르몬 균형과 정신 건강 관리가 중요합니다. 요가나 필라테스로 유연성을 기르세요.',
                    advice: '철분과 칼슘 섭취에 신경쓰고, 스트레스 관리에 집중하세요.',
                    luckyItems: ['요가매트', '허브차', '아로마오일', '명상앱']
                }
            },
            'wealth': {
                'male': {
                    score: 70,
                    description: '투자와 사업에 적극적인 성향이 있습니다. 리스크 관리를 통해 큰 수익을 얻을 수 있습니다.',
                    advice: '포트폴리오 다각화로 안정성을 높이세요.',
                    luckyItems: ['투자서적', '계산기', '명함', '노트북']
                },
                'female': {
                    score: 73,
                    description: '계획적인 소비와 저축에 능숙합니다. 부업이나 재테크로 추가 수입을 만들 수 있습니다.',
                    advice: '장기적인 재무 목표를 세우고 꾸준히 실천하세요.',
                    luckyItems: ['가계부', '저금통', '재테크앱', '할인쿠폰']
                }
            }
        };
        
        const genderDefaults = defaults[category]?.[gender];
        if (genderDefaults) {
            return genderDefaults;
        }
        
        // 폴백: 성별 구분이 없으면 남성 기본값 반환
        return defaults[category]?.['male'] || defaults['love']['male'];
    }
    
    getDefaultData() {
        return {
            basicTraits: [],
            categoryAnalysis: [],
            compatibility: [],
            dailyFortunes: []
        };
    }
    
    getDefaultFigures() {
        return {
            A: { male: [], female: [] },
            B: { male: [], female: [] },
            O: { male: [], female: [] },
            AB: { male: [], female: [] },
            metaphors: {}
        };
    }
}

const bloodTypeAPI = new BloodTypeAPI();