/**
 * 혈액형 바이오리듬 운세 API
 * 
 * 기존 혈액형 API에 바이오리듬 기능을 추가한 확장 버전
 * 날짜별 바이오리듬 계산과 운세 정보를 제공합니다.
 */

class BloodBiorhythmAPI {
    constructor() {
        this.biorhythmData = null;
        this.bloodTypeData = null;
        this.historicalFigures = null;
        this.loadAllData();
        
        // 혈액형 기본 정보
        this.bloodTypes = [
            { id: 'A', name: 'A형', color: '#3b82f6', symbol: '📘' },
            { id: 'B', name: 'B형', color: '#f59e0b', symbol: '📙' },
            { id: 'O', name: 'O형', color: '#ef4444', symbol: '📕' },
            { id: 'AB', name: 'AB형', color: '#8b5cf6', symbol: '📗' }
        ];
        
        // 바이오리듬 주기
        this.cycles = {
            physical: 23,
            emotional: 28,
            intellectual: 33
        };
    }
    
    async loadAllData() {
        try {
            const [biorhythmResponse, bloodResponse, figuresResponse] = await Promise.all([
                fetch('../data/blood-biorhythm-data.json'),
                fetch('../data/blood-type-data.json'),
                fetch('../data/historical-figures.json')
            ]);
            
            this.biorhythmData = await biorhythmResponse.json();
            this.bloodTypeData = await bloodResponse.json();
            this.historicalFigures = await figuresResponse.json();
            
            console.log('바이오리듬 데이터 로딩 완료');
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            this.initializeDefaultData();
        }
    }
    
    /**
     * 특정 날짜의 바이오리듬 계산
     * @param {Date} date - 계산할 날짜
     * @param {string} bloodType - 혈액형 (A, B, O, AB)
     * @param {string} gender - 성별 (male/female, 기본값: male)
     * @returns {Object} 바이오리듬 점수와 패턴
     */
    calculateBiorhythm(date, bloodType, gender = 'male') {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
        
        // 혈액형별 기본 가중치
        const bloodTypeWeights = {
            'A': { physical: 0.8, emotional: 0.9, intellectual: 1.2 },
            'B': { physical: 0.9, emotional: 1.3, intellectual: 1.0 },
            'O': { physical: 1.3, emotional: 1.0, intellectual: 0.9 },
            'AB': { physical: 1.0, emotional: 1.0, intellectual: 1.1 }
        };
        
        // 성별별 보정 가중치
        const genderAdjustments = {
            'male': { physical: 1.1, emotional: 0.9, intellectual: 1.0 },
            'female': { physical: 0.9, emotional: 1.1, intellectual: 1.05 }
        };
        
        const baseWeight = bloodTypeWeights[bloodType] || bloodTypeWeights['O'];
        const genderAdjustment = genderAdjustments[gender] || genderAdjustments['male'];
        
        // 최종 가중치 = 혈액형 가중치 × 성별 보정
        const weight = {
            physical: baseWeight.physical * genderAdjustment.physical,
            emotional: baseWeight.emotional * genderAdjustment.emotional,
            intellectual: baseWeight.intellectual * genderAdjustment.intellectual
        };
        
        // 바이오리듬 계산 (사인 함수 사용)
        const physical = Math.sin(2 * Math.PI * dayOfYear / this.cycles.physical) * weight.physical;
        const emotional = Math.sin(2 * Math.PI * dayOfYear / this.cycles.emotional) * weight.emotional;
        const intellectual = Math.sin(2 * Math.PI * dayOfYear / this.cycles.intellectual) * weight.intellectual;
        
        // -1~1 범위를 0~100 점수로 변환
        const scores = {
            physical: Math.round((physical + 1) * 50 * 10) / 10,
            emotional: Math.round((emotional + 1) * 50 * 10) / 10,
            intellectual: Math.round((intellectual + 1) * 50 * 10) / 10
        };
        
        // 평균 점수로 패턴 결정
        const avgScore = (scores.physical + scores.emotional + scores.intellectual) / 3;
        let pattern = '안정기';
        
        if (avgScore >= 80) pattern = '최상승기';
        else if (avgScore >= 60) pattern = '상승기';
        else if (avgScore >= 40) pattern = '안정기';
        else if (avgScore >= 20) pattern = '하강기';
        else pattern = '최하강기';
        
        return {
            ...scores,
            pattern,
            average: Math.round(avgScore * 10) / 10,
            dayOfYear,
            bloodType,
            gender
        };
    }
    
    /**
     * 특정 날짜의 바이오리듬 운세 조회
     * @param {string} bloodType - 혈액형
     * @param {Date} date - 날짜 (기본값: 오늘)
     * @param {string} gender - 성별 (male/female, 기본값: male)
     * @returns {Object} 운세 정보
     */
    async getBiorhythmFortune(bloodType, date = new Date(), gender = 'male') {
        if (!this.biorhythmData) {
            await this.loadAllData();
        }
        
        const dateKey = this.formatDateKey(date);
        const biorhythm = this.calculateBiorhythm(date, bloodType, gender);
        
        // 저장된 데이터에서 해당 날짜 정보 조회
        let fortuneData = null;
        if (this.biorhythmData && this.biorhythmData.daily_fortune && 
            this.biorhythmData.daily_fortune[bloodType] && 
            this.biorhythmData.daily_fortune[bloodType][dateKey]) {
            fortuneData = this.biorhythmData.daily_fortune[bloodType][dateKey];
        }
        
        // 데이터가 없으면 기본 메시지 생성
        if (!fortuneData) {
            fortuneData = this.generateDefaultFortune(bloodType, biorhythm, date, gender);
        }
        
        return {
            date: date.toISOString().split('T')[0],
            bloodType,
            gender,
            biorhythm,
            fortune: fortuneData.fortune || this.generateDefaultFortune(bloodType, biorhythm, date, gender).fortune,
            lucky: fortuneData.lucky || this.getDefaultLucky(bloodType, gender),
            advice: fortuneData.advice || this.getDefaultAdvice(bloodType, gender),
            famous_figure: fortuneData.famous_figure || this.getRandomFamousFigure(bloodType, gender),
            philosophy: this.getPhilosophy(bloodType, gender)
        };
    }
    
    /**
     * 주간 바이오리듬 트렌드 조회 (7일)
     * @param {string} bloodType - 혈액형
     * @param {Date} startDate - 시작 날짜
     * @param {string} gender - 성별 (male/female, 기본값: male)
     * @returns {Array} 7일간의 바이오리듬 데이터
     */
    getWeeklyBiorhythm(bloodType, startDate = new Date(), gender = 'male') {
        const weekData = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const biorhythm = this.calculateBiorhythm(date, bloodType, gender);
            
            weekData.push({
                date: date.toISOString().split('T')[0],
                dayName: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
                biorhythm
            });
        }
        
        return weekData;
    }
    
    /**
     * 월간 바이오리듬 개요 조회
     * @param {string} bloodType - 혈액형
     * @param {number} year - 년도
     * @param {number} month - 월 (1-12)
     * @param {string} gender - 성별 (male/female, 기본값: male)
     * @returns {Object} 월간 바이오리듬 통계
     */
    getMonthlyBiorhythm(bloodType, year = new Date().getFullYear(), month = new Date().getMonth() + 1, gender = 'male') {
        const monthData = [];
        const daysInMonth = new Date(year, month, 0).getDate();
        
        let totalPhysical = 0, totalEmotional = 0, totalIntellectual = 0;
        let bestDay = null, worstDay = null;
        let bestScore = 0, worstScore = 100;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const biorhythm = this.calculateBiorhythm(date, bloodType, gender);
            
            totalPhysical += biorhythm.physical;
            totalEmotional += biorhythm.emotional;
            totalIntellectual += biorhythm.intellectual;
            
            if (biorhythm.average > bestScore) {
                bestScore = biorhythm.average;
                bestDay = day;
            }
            
            if (biorhythm.average < worstScore) {
                worstScore = biorhythm.average;
                worstDay = day;
            }
            
            monthData.push({
                day,
                biorhythm
            });
        }
        
        return {
            year,
            month,
            averages: {
                physical: Math.round((totalPhysical / daysInMonth) * 10) / 10,
                emotional: Math.round((totalEmotional / daysInMonth) * 10) / 10,
                intellectual: Math.round((totalIntellectual / daysInMonth) * 10) / 10
            },
            bestDay: { day: bestDay, score: bestScore },
            worstDay: { day: worstDay, score: worstScore },
            dailyData: monthData
        };
    }
    
    /**
     * 혈액형별 철학적 배경 조회
     * @param {string} bloodType - 혈액형
     * @param {string} gender - 성별 (male/female, 기본값: male)
     * @returns {Object} 동서양 철학 연결
     */
    getPhilosophy(bloodType, gender = 'male') {
        if (this.biorhythmData && this.biorhythmData.philosophy && this.biorhythmData.philosophy[bloodType]) {
            return this.biorhythmData.philosophy[bloodType];
        }
        
        // 기본 철학 정보
        const defaultPhilosophy = {
            'A': {
                oriental: { element: '목(木)', description: '성장과 창조의 에너지' },
                western: { temperament: '담즙질', description: '완벽주의적 성향' }
            },
            'B': {
                oriental: { element: '화(火)', description: '열정과 변화의 에너지' },
                western: { temperament: '다혈질', description: '낙관적이고 사교적' }
            },
            'O': {
                oriental: { element: '토(土)', description: '안정과 중심의 에너지' },
                western: { temperament: '점액질', description: '실용적이고 목표지향적' }
            },
            'AB': {
                oriental: { element: '금(金)', description: '조화와 균형의 에너지' },
                western: { temperament: '우울질', description: '신중하고 분석적' }
            }
        };
        
        return defaultPhilosophy[bloodType] || defaultPhilosophy['O'];
    }
    
    /**
     * 혈액형별 유명인물 무작위 선택
     * @param {string} bloodType - 혈액형
     * @param {string} gender - 성별 (male/female, 기본값: male)
     * @returns {Object} 유명인물 정보
     */
    getRandomFamousFigure(bloodType, gender = 'male') {
        if (this.biorhythmData && this.biorhythmData.famous_people && this.biorhythmData.famous_people[bloodType]) {
            const figures = this.biorhythmData.famous_people[bloodType];
            const randomFigure = figures[Math.floor(Math.random() * figures.length)];
            return {
                name: randomFigure.name_ko,
                quote: randomFigure.quote
            };
        }
        
        // 성별과 혈액형별 기본 인물 정보
        const defaultFigures = {
            'A': {
                'male': { name: '세종대왕', quote: '가장 어려운 일을 가장 쉽게 하는 것이 진정한 지혜다' },
                'female': { name: '신사임당', quote: '배움에는 끝이 없고, 가르침에는 때가 있다' }
            },
            'B': {
                'male': { name: '레오나르도 다 빈치', quote: '학습에 있어 스승보다 더 좋은 것은 경험이다' },
                'female': { name: '마리 퀴리', quote: '과학에는 국경이 없다. 지식은 모든 인류의 것이다' }
            },
            'O': {
                'male': { name: '나폴레옹', quote: '불가능이라는 단어는 프랑스어가 아니다' },
                'female': { name: '잔 다르크', quote: '나는 두려움을 모른다. 신께서 나와 함께 하시기 때문이다' }
            },
            'AB': {
                'male': { name: '존 F. 케네디', quote: '국가가 당신을 위해 무엇을 할 수 있는지 묻지 말라' },
                'female': { name: '마더 테레사', quote: '사랑은 행동으로 나타낼 때 더욱 의미가 있다' }
            }
        };
        
        const bloodTypeFigures = defaultFigures[bloodType] || defaultFigures['O'];
        return bloodTypeFigures[gender] || bloodTypeFigures['male'];
    }
    
    // 유틸리티 메서드들
    formatDateKey(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    }
    
    generateDefaultFortune(bloodType, biorhythm, date, gender = 'male') {
        const patterns = {
            '최상승기': '모든 에너지가 상승하는 최고의 시기입니다',
            '상승기': '긍정적인 에너지가 흐르는 좋은 시기입니다',
            '안정기': '균형잡힌 에너지로 안정된 하루를 보내세요',
            '하강기': '에너지를 아끼며 재충전의 시간으로 활용하세요',
            '최하강기': '휴식을 취하며 다음 상승을 준비하는 시기입니다'
        };
        
        return {
            fortune: {
                overall: patterns[biorhythm.pattern] || patterns['안정기'],
                health: this.getHealthMessage(biorhythm.physical),
                emotion: this.getEmotionMessage(biorhythm.emotional),
                wisdom: this.getWisdomMessage(biorhythm.intellectual)
            }
        };
    }
    
    getHealthMessage(score) {
        if (score >= 80) return '체력이 넘치는 시기입니다. 적극적인 활동을 해보세요';
        if (score >= 60) return '건강 상태가 양호합니다. 꾸준한 관리를 계속하세요';
        if (score >= 40) return '적당한 휴식과 운동으로 균형을 맞추세요';
        if (score >= 20) return '무리하지 말고 충분한 휴식을 취하세요';
        return '몸의 회복에 집중하며 컨디션 관리에 신경쓰세요';
    }
    
    getEmotionMessage(score) {
        if (score >= 80) return '감정이 풍부하고 긍정적인 시기입니다';
        if (score >= 60) return '마음이 평온하고 안정된 상태입니다';
        if (score >= 40) return '마음가짐을 차분히 하고 내면을 돌아보세요';
        if (score >= 20) return '감정 기복이 있을 수 있으니 여유를 가지세요';
        return '감정적으로 힘든 시기이니 자신을 돌보는 시간을 가지세요';
    }
    
    getWisdomMessage(score) {
        if (score >= 80) return '두뇌 회전이 빠르고 집중력이 뛰어난 시기입니다';
        if (score >= 60) return '논리적 사고와 분석력이 좋은 상태입니다';
        if (score >= 40) return '꾸준히 학습하고 지식을 쌓아가는 시간으로 활용하세요';
        if (score >= 20) return '집중력이 다소 떨어질 수 있으니 단순한 업무에 집중하세요';
        return '사고력이 둔해질 수 있으니 중요한 판단은 피하고 휴식하세요';
    }
    
    getDefaultLucky(bloodType, gender = 'male') {
        const luckyItems = {
            'A': {
                'male': ['다이어리', '만년필', '책갈피', '향초'],
                'female': ['향수', '실크스카프', '진주목걸이', '핸드크림']
            },
            'B': {
                'male': ['스케치북', '색연필', '카메라', '배낭'],
                'female': ['아로마캔들', '컬러펜', '토트백', '플래너']
            },
            'O': {
                'male': ['시계', '가죽지갑', '운동용품', '선글라스'],
                'female': ['브로치', '가죽가방', '피트니스밴드', '립밤']
            },
            'AB': {
                'male': ['태블릿', 'USB', '이어폰', '아트북'],
                'female': ['북마크', '문구세트', '블루투스이어폰', '아트포스터']
            }
        };
        
        const luckyColors = {
            'A': {
                'male': ['파스텔 블루', '연한 초록', '아이보리'],
                'female': ['라벤더', '민트그린', '로즈핑크']
            },
            'B': {
                'male': ['오렌지', '노란색', '빨간색'],
                'female': ['코랄핑크', '옐로우', '체리레드']
            },
            'O': {
                'male': ['진한 파랑', '검은색', '금색'],
                'female': ['딥블루', '블랙', '골드']
            },
            'AB': {
                'male': ['회색', '네이비', '와인색'],
                'female': ['실버그레이', '네이비블루', '버건디']
            }
        };
        
        const bloodTypeItems = luckyItems[bloodType] || luckyItems['O'];
        const bloodTypeColors = luckyColors[bloodType] || luckyColors['O'];
        
        const items = bloodTypeItems[gender] || bloodTypeItems['male'];
        const colors = bloodTypeColors[gender] || bloodTypeColors['male'];
        
        return {
            item: items[Math.floor(Math.random() * items.length)],
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }
    
    getDefaultAdvice(bloodType, gender = 'male') {
        const advices = {
            'A': {
                'male': '완벽을 추구하되 너무 자신을 몰아세우지는 마세요',
                'female': '세심함을 발휘하되 때로는 큰 그림도 보는 여유를 가지세요'
            },
            'B': {
                'male': '창의적 아이디어를 자유롭게 발산하되 실행 계획도 함께 세워보세요',
                'female': '직감적 판단력을 믿되 논리적 검증도 병행하는 것이 좋겠습니다'
            },
            'O': {
                'male': '리더십을 발휘하되 팀원들의 의견도 경청하는 자세를 유지하세요',
                'female': '목표 달성 의지를 유지하되 인간관계의 조화도 함께 고려하세요'
            },
            'AB': {
                'male': '균형감각을 활용해 다양한 관점에서 문제를 바라보세요',
                'female': '분석적 사고와 감성적 직관을 조화롭게 활용해보세요'
            }
        };
        
        const bloodTypeAdvices = advices[bloodType] || advices['O'];
        return bloodTypeAdvices[gender] || bloodTypeAdvices['male'];
    }
    
    initializeDefaultData() {
        console.log('기본 데이터로 초기화');
        this.biorhythmData = {
            metadata: { description: '기본 바이오리듬 데이터' },
            philosophy: {},
            famous_people: {},
            daily_fortune: {}
        };
    }
}

// 전역 인스턴스 생성 (기존 패턴 유지)
const bloodBiorhythmAPI = new BloodBiorhythmAPI();

// window 객체에 등록하여 HTML에서 접근 가능하게 함
if (typeof window !== 'undefined') {
    window.bloodBiorhythmAPI = bloodBiorhythmAPI;
}