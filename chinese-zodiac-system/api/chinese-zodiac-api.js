/**
 * 중국 12간지 띠별운세 API
 * 데이터 로딩 및 운세 계산을 담당
 */

class ChineseZodiacAPI {
    constructor() {
        this.chineseZodiacs = [
            { id: 1, name: '쥐띠', symbol: '🐭', hanja: '자(子)', element: '물', direction: '북', color: ['검정', '파랑'], numbers: [2, 3] },
            { id: 2, name: '소띠', symbol: '🐂', hanja: '축(丑)', element: '토', direction: '동북', color: ['황토색', '갈색'], numbers: [1, 9] },
            { id: 3, name: '범띠', symbol: '🐅', hanja: '인(寅)', element: '목', direction: '동북', color: ['초록', '파랑'], numbers: [1, 3, 4] },
            { id: 4, name: '토끼띠', symbol: '🐰', hanja: '묘(卯)', element: '목', direction: '동', color: ['초록', '분홍'], numbers: [3, 4, 9] },
            { id: 5, name: '용띠', symbol: '🐲', hanja: '진(辰)', element: '토', direction: '동남', color: ['금색', '황색'], numbers: [1, 6, 7] },
            { id: 6, name: '뱀띠', symbol: '🐍', hanja: '사(巳)', element: '화', direction: '남동', color: ['빨강', '금색'], numbers: [2, 8, 9] },
            { id: 7, name: '말띠', symbol: '🐎', hanja: '오(午)', element: '화', direction: '남', color: ['빨강', '주황'], numbers: [2, 3, 7] },
            { id: 8, name: '양띠', symbol: '🐑', hanja: '미(未)', element: '토', direction: '남서', color: ['녹색', '빨강'], numbers: [3, 4, 5] },
            { id: 9, name: '원숭이띠', symbol: '🐵', hanja: '신(申)', element: '금', direction: '서남', color: ['흰색', '금색'], numbers: [1, 7, 8] },
            { id: 10, name: '닭띠', symbol: '🐓', hanja: '유(酉)', element: '금', direction: '서', color: ['금색', '갈색'], numbers: [5, 7, 8] },
            { id: 11, name: '개띠', symbol: '🐕', hanja: '술(戌)', element: '토', direction: '서북', color: ['빨강', '녹색'], numbers: [3, 4, 9] },
            { id: 12, name: '돼지띠', symbol: '🐷', hanja: '해(亥)', element: '물', direction: '북서', color: ['황색', '갈색'], numbers: [2, 5, 8] }
        ];

        this.fortuneData = null;
        this.compatibilityData = null;
        this.loadFortuneData();
    }

    /**
     * 출생년도로 12간지 계산
     * @param {number} year - 출생년도
     * @returns {number} - 12간지 ID (1-12)
     */
    getChineseZodiacByYear(year) {
        // 1900년이 쥐띠(1)
        const baseYear = 1900;
        let zodiacId = ((year - baseYear) % 12) + 1;
        return zodiacId <= 0 ? zodiacId + 12 : zodiacId;
    }

    /**
     * 12간지 정보 조회
     * @param {number} zodiacId - 12간지 ID (1-12)
     * @returns {object|null} - 12간지 정보
     */
    getChineseZodiacInfo(zodiacId) {
        return this.chineseZodiacs.find(zodiac => zodiac.id === zodiacId) || null;
    }

    /**
     * 운세 데이터 로드
     */
    async loadFortuneData() {
        try {
            // 실제 환경에서는 JSON 파일이나 API에서 데이터를 로드
            // 현재는 임시 데이터 생성
            this.generateTempFortuneData();
            this.generateCompatibilityData();
            console.log('중국 12간지 운세 데이터가 로드되었습니다.');
        } catch (error) {
            console.error('운세 데이터 로드 실패:', error);
            this.generateTempFortuneData(); // 실패 시 임시 데이터 사용
        }
    }

    /**
     * 임시 운세 데이터 생성
     */
    generateTempFortuneData() {
        this.fortuneData = {};
        const categories = ['love', 'money', 'work', 'health'];
        const themes = ['성장', '도전', '안정', '변화', '발전', '조화'];
        const colors = ['#dc2626', '#b91c1c', '#fbbf24', '#f59e0b', '#22c55e', '#3b82f6'];
        const directions = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '서남쪽', '동북쪽', '서북쪽'];
        const times = ['새벽 5-7시', '오전 9-11시', '정오 12-2시', '오후 2-4시', '오후 4-6시', '저녁 6-8시', '밤 8-10시'];

        // 각 12간지별로 365일치 데이터 생성 (간소화)
        for (let zodiacId = 1; zodiacId <= 12; zodiacId++) {
            this.fortuneData[zodiacId] = {
                daily: this.generateDailyFortunes(zodiacId, categories, colors, directions, times),
                weekly: this.generateWeeklyFortunes(zodiacId, themes),
                monthly: this.generateMonthlyFortunes(zodiacId, themes),
                yearly: this.generateYearlyFortunes(zodiacId, themes)
            };
        }
    }

    /**
     * 일간 운세 데이터 생성
     */
    generateDailyFortunes(zodiacId, categories, colors, directions, times) {
        const zodiacInfo = this.getChineseZodiacInfo(zodiacId);
        const daily = {};
        const today = new Date();
        const todayKey = this.formatDateKey(today);

        // 오늘 날짜의 운세만 생성 (실제로는 365일)
        daily[todayKey] = {
            overall: `${zodiacInfo.name}인 당신은 오늘 ${zodiacInfo.element}의 기운으로 인해 안정적이면서도 활기찬 하루를 보내게 될 것입니다.
                     ${zodiacInfo.hanja}의 특성인 ${this.getZodiacTrait(zodiacId)}이 특히 빛을 발하는 날입니다.`,
            scores: {
                love: this.randomScore(70, 95),
                money: this.randomScore(65, 90),
                work: this.randomScore(75, 95),
                health: this.randomScore(70, 90)
            },
            details: categories.reduce((acc, category) => {
                acc[category] = this.generateFortuneText(zodiacInfo, category, 'daily');
                return acc;
            }, {}),
            lucky: {
                color: colors[Math.floor(Math.random() * colors.length)],
                number: zodiacInfo.numbers[Math.floor(Math.random() * zodiacInfo.numbers.length)],
                direction: directions[Math.floor(Math.random() * directions.length)],
                time: times[Math.floor(Math.random() * times.length)]
            },
            advice: this.generateAdvice(zodiacInfo, 'daily')
        };

        return daily;
    }

    /**
     * 주간 운세 데이터 생성
     */
    generateWeeklyFortunes(zodiacId, themes) {
        const zodiacInfo = this.getChineseZodiacInfo(zodiacId);
        const today = new Date();
        const weekKey = this.getWeekKey(today);

        return {
            [weekKey]: {
                period: this.getWeekPeriod(today),
                theme: themes[Math.floor(Math.random() * themes.length)] + '의 주간',
                keyDays: '수요일, 금요일',
                overall: `이번 주는 ${zodiacInfo.name}에게 ${zodiacInfo.element}의 기운이 강하게 작용하는 시기입니다.
                         특히 중반 이후부터 상황이 호전될 것으로 보입니다.`,
                details: {
                    love: `애정 관계에서 ${zodiacInfo.element} 원소의 영향으로 따뜻한 감정이 교류될 것입니다.`,
                    money: `금전적으로는 신중한 판단이 필요한 시기입니다. ${zodiacInfo.hanja}의 신중함을 발휘하세요.`,
                    work: `업무에서는 ${this.getZodiacTrait(zodiacId)}이 빛을 발할 것입니다.`,
                    health: `${zodiacInfo.direction} 방향으로의 산책이나 운동이 도움이 될 것입니다.`
                }
            }
        };
    }

    /**
     * 월간 운세 데이터 생성
     */
    generateMonthlyFortunes(zodiacId, themes) {
        const zodiacInfo = this.getChineseZodiacInfo(zodiacId);
        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        return {
            [monthKey]: {
                period: `${today.getFullYear()}년 ${today.getMonth() + 1}월`,
                theme: themes[Math.floor(Math.random() * themes.length)] + '의 달',
                keyDates: '15일, 23일',
                overall: `이번 달은 ${zodiacInfo.name}에게 중요한 전환점이 될 수 있는 시기입니다.
                         ${zodiacInfo.element}의 기운이 한 달 내내 강하게 작용할 것입니다.`,
                details: {
                    love: `사랑에서는 ${zodiacInfo.hanja}의 특성이 긍정적으로 작용할 것입니다.`,
                    money: `재정 관리에서는 ${zodiacInfo.element} 원소의 안정성이 도움이 될 것입니다.`,
                    work: `직업적으로는 새로운 기회가 ${zodiacInfo.direction} 방향에서 올 수 있습니다.`,
                    health: `건강 관리는 꾸준히 하되, 특히 ${zodiacInfo.element} 관련 음식이 도움이 됩니다.`
                }
            }
        };
    }

    /**
     * 연간 운세 데이터 생성
     */
    generateYearlyFortunes(zodiacId, themes) {
        const zodiacInfo = this.getChineseZodiacInfo(zodiacId);
        const currentYear = new Date().getFullYear();

        return {
            [currentYear]: {
                period: `${currentYear}년`,
                theme: '대도약의 해',
                bestMonths: '5월, 9월',
                challengingMonths: '3월, 7월',
                overall: `${currentYear}년은 ${zodiacInfo.name}에게 ${zodiacInfo.element}의 기운이 최고조에 달하는 해입니다.
                         ${zodiacInfo.hanja}의 본래 특성이 가장 잘 발휘될 수 있는 시기입니다.`,
                details: {
                    love: `사랑에서는 안정과 성장을 동시에 경험할 수 있는 의미 있는 해가 될 것입니다.`,
                    money: `경제적으로는 ${zodiacInfo.element} 원소의 특성상 꾸준한 성장이 예상됩니다.`,
                    work: `커리어에서는 ${zodiacInfo.direction} 방향으로의 발전이 특히 유리할 것입니다.`,
                    health: `전반적으로 건강한 해이지만, ${zodiacInfo.element} 관련 건강법이 특히 효과적일 것입니다.`
                }
            }
        };
    }

    /**
     * 궁합 데이터 생성
     */
    generateCompatibilityData() {
        this.compatibilityData = {};

        // 오행 상생상극 관계 정의
        const elementRelation = {
            '물': { good: ['목'], neutral: ['물', '토'], bad: ['화', '금'] },
            '목': { good: ['화'], neutral: ['목', '금'], bad: ['토', '물'] },
            '화': { good: ['토'], neutral: ['화', '물'], bad: ['금', '목'] },
            '토': { good: ['금'], neutral: ['토', '목'], bad: ['물', '화'] },
            '금': { good: ['물'], neutral: ['금', '화'], bad: ['목', '토'] }
        };

        for (let i = 1; i <= 12; i++) {
            for (let j = 1; j <= 12; j++) {
                const key = `${i}-${j}`;
                const myInfo = this.getChineseZodiacInfo(i);
                const partnerInfo = this.getChineseZodiacInfo(j);

                // 오행 관계 기반 기본 점수 계산
                let baseScore = 75;
                if (elementRelation[myInfo.element].good.includes(partnerInfo.element)) {
                    baseScore += 15;
                } else if (elementRelation[myInfo.element].bad.includes(partnerInfo.element)) {
                    baseScore -= 15;
                }

                // 같은 띠일 경우 보너스
                if (i === j) baseScore += 10;

                this.compatibilityData[key] = {
                    overall: Math.min(95, Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5)),
                    love: Math.min(95, Math.max(60, baseScore + Math.floor(Math.random() * 15) - 7)),
                    friendship: Math.min(95, Math.max(60, baseScore + Math.floor(Math.random() * 15) - 7)),
                    work: Math.min(95, Math.max(60, baseScore + Math.floor(Math.random() * 15) - 7)),
                    description: this.generateCompatibilityDescription(myInfo, partnerInfo, baseScore),
                    advice: this.generateCompatibilityAdvice(myInfo, partnerInfo)
                };
            }
        }
    }

    /**
     * 운세 조회
     */
    getDailyFortune(zodiacId, date = new Date()) {
        const dateKey = this.formatDateKey(date);
        return this.fortuneData?.[zodiacId]?.daily?.[dateKey] || null;
    }

    getWeeklyFortune(zodiacId, date = new Date()) {
        const weekKey = this.getWeekKey(date);
        return this.fortuneData?.[zodiacId]?.weekly?.[weekKey] || null;
    }

    getMonthlyFortune(zodiacId, date = new Date()) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return this.fortuneData?.[zodiacId]?.monthly?.[monthKey] || null;
    }

    getYearlyFortune(zodiacId, year = new Date().getFullYear()) {
        return this.fortuneData?.[zodiacId]?.yearly?.[year] || null;
    }

    getCompatibility(zodiacId1, zodiacId2) {
        const key = `${zodiacId1}-${zodiacId2}`;
        return this.compatibilityData?.[key] || null;
    }

    /**
     * 유틸리티 함수들
     */
    formatDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    getWeekKey(date) {
        const week = this.getWeekNumber(date);
        return `${date.getFullYear()}-W${week}`;
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    getWeekPeriod(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()} ~ ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;
    }

    randomScore(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getZodiacTrait(zodiacId) {
        const traits = {
            1: '지혜롭고 영리한 성격',
            2: '성실하고 인내심 강한 성격',
            3: '용기 있고 도전적인 성격',
            4: '온화하고 평화로운 성격',
            5: '권위 있고 성공 지향적인 성격',
            6: '지혜롭고 신비로운 성격',
            7: '자유롭고 활력 넘치는 성격',
            8: '온순하고 예술적인 성격',
            9: '재치 있고 유머러스한 성격',
            10: '성실하고 정직한 성격',
            11: '충성스럽고 신뢰할 만한 성격',
            12: '관대하고 풍요로운 성격'
        };
        return traits[zodiacId] || '특별한 성격';
    }

    generateFortuneText(zodiacInfo, category, period) {
        const templates = {
            love: {
                daily: [
                    `${zodiacInfo.element}의 기운으로 인해 애정 관계에서 따뜻한 에너지가 흐를 것입니다.`,
                    `${zodiacInfo.hanja}의 특성이 사랑에서 긍정적으로 작용할 것입니다.`,
                    `오늘은 진실한 마음을 표현하기 좋은 날입니다.`
                ]
            },
            money: {
                daily: [
                    `${zodiacInfo.element} 원소의 안정성이 재정 관리에 도움이 될 것입니다.`,
                    `신중한 판단으로 경제적 안정을 꾀할 수 있습니다.`,
                    `${zodiacInfo.direction} 방향의 투자나 거래가 유리할 수 있습니다.`
                ]
            },
            work: {
                daily: [
                    `업무에서 ${zodiacInfo.hanja}의 장점이 돋보일 것입니다.`,
                    `${zodiacInfo.element}의 기운으로 인해 집중력이 높아질 것입니다.`,
                    `동료들과의 협력이 좋은 성과를 가져다 줄 것입니다.`
                ]
            },
            health: {
                daily: [
                    `${zodiacInfo.element} 관련 건강법이 특히 효과적일 것입니다.`,
                    `${zodiacInfo.direction} 방향으로의 운동이나 산책이 좋습니다.`,
                    `전반적으로 컨디션이 좋은 상태를 유지할 수 있습니다.`
                ]
            }
        };

        const categoryTemplates = templates[category]?.[period] || [`${category} 운이 좋습니다.`];
        return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
    }

    generateAdvice(zodiacInfo, period) {
        const advices = [
            `${zodiacInfo.element}의 기운을 잘 활용하여 하루를 보내세요.`,
            `${zodiacInfo.hanja}의 특성을 믿고 자신감을 가지세요.`,
            `${zodiacInfo.direction} 방향을 의식하며 행동하면 도움이 될 것입니다.`,
            `오늘은 당신의 장점이 빛나는 날입니다.`,
            `균형 잡힌 마음가짐으로 모든 일에 임하세요.`
        ];
        return advices[Math.floor(Math.random() * advices.length)];
    }

    generateCompatibilityDescription(myInfo, partnerInfo, score) {
        if (score >= 85) {
            return `${myInfo.name}과 ${partnerInfo.name}은 ${myInfo.element}과 ${partnerInfo.element}의 조화로 매우 궁합이 좋습니다.
                   서로의 장점을 살려주고 단점을 보완해주는 이상적인 관계입니다.`;
        } else if (score >= 75) {
            return `${myInfo.name}과 ${partnerInfo.name}은 전반적으로 좋은 궁합을 보입니다.
                   ${myInfo.hanja}와 ${partnerInfo.hanja}의 특성이 조화롭게 어우러집니다.`;
        } else {
            return `${myInfo.name}과 ${partnerInfo.name}은 서로 다른 특성을 가지고 있지만,
                   이해와 배려를 통해 좋은 관계를 만들어갈 수 있습니다.`;
        }
    }

    generateCompatibilityAdvice(myInfo, partnerInfo) {
        const advices = [
            '서로의 다른 점을 인정하고 존중하는 것이 중요합니다.',
            '소통과 이해를 통해 더 깊은 관계로 발전시킬 수 있습니다.',
            '각자의 장점을 살려 함께 성장하는 관계를 만들어보세요.',
            '인내심을 가지고 서로를 이해하려 노력하면 좋은 결과가 있을 것입니다.',
            '공통된 관심사나 목표를 찾아 함께 추구하면 도움이 됩니다.'
        ];
        return advices[Math.floor(Math.random() * advices.length)];
    }
}

// 전역 API 인스턴스 생성
const chineseZodiacAPI = new ChineseZodiacAPI();

// window 객체에 API 등록 (다른 스크립트에서 접근 가능)
if (typeof window !== 'undefined') {
    window.chineseZodiacAPI = chineseZodiacAPI;
}

console.log('Chinese Zodiac API 초기화 완료');