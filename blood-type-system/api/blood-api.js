class BloodTypeAPI {
    constructor() {
        this.bloodTypeData = null;
        this.loadBloodTypeData();
        
        this.bloodTypes = [
            { id: 'A', name: 'A형', color: '#3b82f6' },
            { id: 'B', name: 'B형', color: '#f59e0b' },
            { id: 'O', name: 'O형', color: '#ef4444' },
            { id: 'AB', name: 'AB형', color: '#8b5cf6' }
        ];
    }
    
    async loadBloodTypeData() {
        try {
            const response = await fetch('../data/historical-figures-verified.json');
            this.bloodTypeData = await response.json();
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            this.bloodTypeData = this.getDefaultData();
        }
    }
    
    async getBasicTraits(bloodType, gender) {
        if (!this.bloodTypeData) {
            await this.loadBloodTypeData();
        }
        
        const traits = this.bloodTypeData.basicTraits.find(
            t => t.bloodType === bloodType && t.gender === gender
        );
        
        return traits || this.getDefaultBasicTraits(bloodType, gender);
    }
    
    async getCategoryAnalysis(bloodType, category) {
        if (!this.bloodTypeData) {
            await this.loadBloodTypeData();
        }
        
        const analysis = this.bloodTypeData.categoryAnalysis.find(
            a => a.bloodType === bloodType && a.category === category
        );
        
        return analysis || this.getDefaultCategoryAnalysis(bloodType, category);
    }
    
    getCompatibility(type1, type2) {
        const compatibilityMap = {
            'A-A': { score: 85, description: 'A형끼리는 차태현과 김혜수처럼 서로를 깊이 이해하며 안정적인 관계를 만듭니다.', tips: '서로의 완벽주의 성향을 인정하고 여유를 가지세요.' },
            'A-B': { score: 65, description: 'A형의 신중함과 B형의 자유로움이 균형을 이룹니다.', tips: 'B형의 자유로운 성향을 존중해주세요.' },
            'A-O': { score: 75, description: 'A형의 섬세함과 O형의 리더십이 좋은 조화를 이룹니다.', tips: 'O형의 결단력을 신뢰하세요.' },
            'A-AB': { score: 80, description: 'A형과 AB형은 지적인 대화를 즐기며 서로를 존중합니다.', tips: 'AB형의 독특한 관점을 받아들이세요.' },
            'B-A': { score: 65, description: 'B형의 창의성과 A형의 체계성이 보완적입니다.', tips: 'A형의 계획적인 성향을 이해해주세요.' },
            'B-B': { score: 70, description: 'B형끼리는 강동원과 전지현처럼 자유롭고 재미있는 관계를 만듭니다.', tips: '서로의 독립성을 존중하되 약속은 지키세요.' },
            'B-O': { score: 85, description: 'B형과 O형은 활발하고 열정적인 관계를 형성합니다.', tips: '함께 새로운 경험을 즐기세요.' },
            'B-AB': { score: 75, description: 'B형과 AB형은 창의적이고 독특한 관계를 만듭니다.', tips: '서로의 개성을 인정하고 존중하세요.' },
            'O-A': { score: 75, description: 'O형의 추진력과 A형의 세심함이 시너지를 냅니다.', tips: 'A형의 신중한 접근을 기다려주세요.' },
            'O-B': { score: 85, description: 'O형과 B형은 활기차고 모험적인 관계를 즐깁니다.', tips: '함께 도전하고 성장하세요.' },
            'O-O': { score: 80, description: 'O형끼리는 장동건과 김태희처럼 열정적이고 경쟁적인 관계를 형성합니다.', tips: '서로의 리더십을 번갈아 발휘하세요.' },
            'O-AB': { score: 70, description: 'O형의 직설성과 AB형의 복잡함이 흥미로운 관계를 만듭니다.', tips: 'AB형의 내면을 이해하려 노력하세요.' },
            'AB-A': { score: 80, description: 'AB형과 A형은 지적이고 세련된 관계를 형성합니다.', tips: 'A형의 감정적 요구를 충족시켜주세요.' },
            'AB-B': { score: 75, description: 'AB형과 B형은 창의적이고 자유로운 관계를 만듭니다.', tips: 'B형의 즉흥성을 즐기세요.' },
            'AB-O': { score: 70, description: 'AB형의 이성과 O형의 감성이 균형을 이룹니다.', tips: 'O형의 직관을 신뢰하세요.' },
            'AB-AB': { score: 90, description: 'AB형끼리는 김희철과 한가인처럼 서로를 완벽하게 이해하는 특별한 관계입니다.', tips: '깊은 대화와 지적 교류를 즐기세요.' }
        };
        
        const key = `${type1}-${type2}`;
        return compatibilityMap[key] || { score: 50, description: '서로를 알아가는 중입니다.', tips: '서로의 차이를 인정하고 존중하세요.' };
    }
    
    async getDailyFortune(bloodType, date) {
        const fortunes = {
            'A': {
                message: '오늘은 당신의 세심함이 빛을 발하는 날입니다. 차태현의 진정성 있는 세심함처럼, 디테일에 집중하면 큰 성과를 얻을 수 있습니다.',
                loveScore: 85,
                healthScore: 75,
                wealthScore: 80,
                luckyColor: '파란색',
                luckyNumber: 7,
                advice: '오늘은 계획을 세우고 체계적으로 일을 진행하세요. 작은 성공들이 모여 큰 결과를 만들 것입니다.'
            },
            'B': {
                message: '자유로운 영혼인 당신에게 새로운 기회가 찾아옵니다. 강동원의 독특한 매력처럼, 틀에 얽매이지 마세요.',
                loveScore: 78,
                healthScore: 82,
                wealthScore: 75,
                luckyColor: '주황색',
                luckyNumber: 3,
                advice: '직관을 따르고 새로운 시도를 두려워하지 마세요. 예상치 못한 곳에서 행운이 찾아올 것입니다.'
            },
            'O': {
                message: '리더의 기운이 충만한 날입니다. 장동건의 채움되지 않는 매력처럼, 당신의 열정이 주변을 움직일 것입니다.',
                loveScore: 88,
                healthScore: 85,
                wealthScore: 90,
                luckyColor: '빨간색',
                luckyNumber: 1,
                advice: '주도적으로 나서되, 팀워크도 잊지 마세요. 함께할 때 더 큰 성공을 이룰 수 있습니다.'
            },
            'AB': {
                message: '당신의 독특한 관점이 빛나는 날입니다. 김희철의 4차원 매력처럼, 남다른 시각으로 문제를 해결하세요.',
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
                overall: 'A형은 신중하고 섬세하며 완벽주의적 성향을 가지고 있습니다.',
                strengths: ['책임감이 강함', '계획적임', '신중함', '배려심이 깊음'],
                weaknesses: ['소심함', '우유부단함', '스트레스에 약함'],
                famousPeople: ['차태현', '주지훈', '장근석']
            },
            'B': {
                overall: 'B형은 자유롭고 창의적이며 독립적인 성향을 가지고 있습니다.',
                strengths: ['창의적임', '독립적임', '유연함', '낙천적임'],
                weaknesses: ['변덕스러움', '규칙을 싫어함', '자기중심적임'],
                famousPeople: ['강동원', '조인성', '이준기']
            },
            'O': {
                overall: 'O형은 열정적이고 리더십이 있으며 목표 지향적입니다.',
                strengths: ['리더십', '추진력', '사교성', '낙관적임'],
                weaknesses: ['고집이 셈', '경쟁심이 강함', '인내심 부족'],
                famousPeople: ['장동건', '원빈', '정우성']
            },
            'AB': {
                overall: 'AB형은 이성적이고 독특하며 천재적 기질을 가지고 있습니다.',
                strengths: ['분석적임', '독창적임', '공정함', '적응력이 좋음'],
                weaknesses: ['이중적임', '비판적임', '감정 표현이 서툼'],
                famousPeople: ['김희철', '이홍기', '박진영']
            }
        };
        
        return defaults[bloodType] || defaults['A'];
    }
    
    getDefaultCategoryAnalysis(bloodType, category) {
        const defaults = {
            'love': {
                score: 75,
                description: '당신은 사랑에 있어서 진실하고 헌신적입니다.',
                advice: '상대방의 마음을 이해하고 소통하는 것이 중요합니다.',
                luckyItems: ['장미', '편지', '향수']
            },
            'health': {
                score: 80,
                description: '전반적으로 건강한 체질이지만 스트레스 관리가 필요합니다.',
                advice: '규칙적인 운동과 충분한 휴식을 취하세요.',
                luckyItems: ['요가 매트', '허브차', '명상 앱']
            },
            'wealth': {
                score: 70,
                description: '안정적인 재물운을 가지고 있으며 저축에 유리합니다.',
                advice: '장기적인 투자 계획을 세우고 꾸준히 실천하세요.',
                luckyItems: ['저축통', '가계부', '투자 서적']
            }
        };
        
        return defaults[category] || defaults['love'];
    }
    
    getDefaultData() {
        return {
            basicTraits: [],
            categoryAnalysis: [],
            compatibility: [],
            dailyFortunes: []
        };
    }
}

const bloodTypeAPI = new BloodTypeAPI();