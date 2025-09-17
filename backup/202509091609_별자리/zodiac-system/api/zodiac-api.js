/**
 * 별자리 운세 API
 * SQLite 데이터베이스와 연동하여 운세 데이터 제공
 */

class ZodiacAPI {
    constructor() {
        this.dbPath = '../database/zodiac.db';
        this.zodiacSigns = [
            { id: 1, name: '양자리', symbol: '♈', start: '03-21', end: '04-19' },
            { id: 2, name: '황소자리', symbol: '♉', start: '04-20', end: '05-20' },
            { id: 3, name: '쌍둥이자리', symbol: '♊', start: '05-21', end: '06-20' },
            { id: 4, name: '게자리', symbol: '♋', start: '06-21', end: '07-22' },
            { id: 5, name: '사자자리', symbol: '♌', start: '07-23', end: '08-22' },
            { id: 6, name: '처녀자리', symbol: '♍', start: '08-23', end: '09-22' },
            { id: 7, name: '천칭자리', symbol: '♎', start: '09-23', end: '10-22' },
            { id: 8, name: '전갈자리', symbol: '♏', start: '10-23', end: '11-21' },
            { id: 9, name: '사수자리', symbol: '♐', start: '11-22', end: '12-21' },
            { id: 10, name: '염소자리', symbol: '♑', start: '12-22', end: '01-19' },
            { id: 11, name: '물병자리', symbol: '♒', start: '01-20', end: '02-18' },
            { id: 12, name: '물고기자리', symbol: '♓', start: '02-19', end: '03-20' }
        ];
    }

    /**
     * 생년월일로 별자리 찾기
     */
    getZodiacByDate(month, day) {
        const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        for (const sign of this.zodiacSigns) {
            const start = sign.start;
            const end = sign.end;
            
            // 연도 경계를 넘는 경우 (염소자리)
            if (sign.id === 10) {
                if (dateStr >= '12-22' || dateStr <= '01-19') {
                    return sign;
                }
            } else {
                if (dateStr >= start && dateStr <= end) {
                    return sign;
                }
            }
        }
        
        return null;
    }

    /**
     * 오늘의 운세 가져오기 (로컬 스토리지 활용)
     */
    async getDailyFortune(zodiacId) {
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `fortune_daily_${zodiacId}_${today}`;
        
        // 로컬 스토리지 확인
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached);
        }

        // 샘플 데이터 생성
        const fortune = this.generateDailyFortune(zodiacId);
        
        // 로컬 스토리지에 저장
        localStorage.setItem(storageKey, JSON.stringify(fortune));
        
        return fortune;
    }

    /**
     * 주간 운세 가져오기
     */
    async getWeeklyFortune(zodiacId) {
        const weekStart = this.getWeekStart();
        const storageKey = `fortune_weekly_${zodiacId}_${weekStart}`;
        
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const fortune = this.generateWeeklyFortune(zodiacId);
        localStorage.setItem(storageKey, JSON.stringify(fortune));
        
        return fortune;
    }

    /**
     * 월간 운세 가져오기
     */
    async getMonthlyFortune(zodiacId) {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const storageKey = `fortune_monthly_${zodiacId}_${year}_${month}`;
        
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const fortune = this.generateMonthlyFortune(zodiacId);
        localStorage.setItem(storageKey, JSON.stringify(fortune));
        
        return fortune;
    }

    /**
     * 연간 운세 가져오기
     */
    async getYearlyFortune(zodiacId) {
        const year = new Date().getFullYear();
        const storageKey = `fortune_yearly_${zodiacId}_${year}`;
        
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const fortune = this.generateYearlyFortune(zodiacId);
        localStorage.setItem(storageKey, JSON.stringify(fortune));
        
        return fortune;
    }

    /**
     * 별자리 궁합 확인
     */
    async getCompatibility(zodiac1Id, zodiac2Id) {
        const storageKey = `compatibility_${zodiac1Id}_${zodiac2Id}`;
        
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const compatibility = this.generateCompatibility(zodiac1Id, zodiac2Id);
        localStorage.setItem(storageKey, JSON.stringify(compatibility));
        
        return compatibility;
    }

    /**
     * 일일 운세 샘플 데이터 생성
     */
    generateDailyFortune(zodiacId) {
        const templates = {
            overall: [
                "오늘은 새로운 기회가 찾아올 것입니다. 열린 마음으로 하루를 시작하세요.",
                "평온한 하루가 될 것입니다. 일상에 충실하며 차분하게 보내세요.",
                "도전적인 상황이 발생할 수 있지만, 이를 통해 성장할 수 있습니다.",
                "행운이 따르는 날입니다. 자신감을 가지고 원하는 것을 추구하세요."
            ],
            love: [
                "연인과의 관계가 더욱 돈독해질 것입니다.",
                "새로운 만남의 기회가 있을 수 있습니다.",
                "상대방의 마음을 이해하려고 노력하세요.",
                "솔직한 대화가 관계 개선에 도움이 될 것입니다."
            ],
            money: [
                "예상치 못한 수입이 생길 수 있습니다.",
                "지출을 절제하는 것이 좋습니다.",
                "투자에 신중을 기하세요.",
                "재정 계획을 세우기에 좋은 시기입니다."
            ],
            work: [
                "업무 성과가 인정받을 것입니다.",
                "새로운 프로젝트가 시작될 수 있습니다.",
                "동료들과의 협력이 중요합니다.",
                "집중력을 발휘하면 좋은 결과를 얻을 수 있습니다."
            ],
            health: [
                "건강 상태가 좋습니다. 운동을 시작하기에 좋은 때입니다.",
                "충분한 휴식이 필요합니다.",
                "스트레스 관리에 신경 쓰세요.",
                "규칙적인 생활 습관을 유지하세요."
            ]
        };

        const randomScore = () => Math.floor(Math.random() * 40) + 60;
        const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const colors = ["빨강", "파랑", "노랑", "초록", "보라", "주황"];
        const times = ["오전 7-9시", "오전 10-12시", "오후 2-4시", "오후 7-9시"];

        return {
            zodiacId: zodiacId,
            date: new Date().toISOString().split('T')[0],
            overall: randomPick(templates.overall),
            scores: {
                love: randomScore(),
                money: randomScore(),
                work: randomScore(),
                health: randomScore()
            },
            fortunes: {
                love: randomPick(templates.love),
                money: randomPick(templates.money),
                work: randomPick(templates.work),
                health: randomPick(templates.health)
            },
            lucky: {
                color: randomPick(colors),
                number: Math.floor(Math.random() * 9) + 1,
                time: randomPick(times)
            },
            advice: "오늘 하루도 긍정적인 마음으로 시작하세요!"
        };
    }

    /**
     * 주간 운세 샘플 데이터 생성
     */
    generateWeeklyFortune(zodiacId) {
        const themes = ["도전", "성장", "안정", "변화", "기회"];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        
        return {
            zodiacId: zodiacId,
            weekStart: this.getWeekStart(),
            weekEnd: this.getWeekEnd(),
            theme: `${theme}의 한 주`,
            overall: `이번 주는 ${theme}의 한 주가 될 것입니다. 계획적으로 일정을 관리하면 좋은 결과를 얻을 수 있습니다.`,
            fortunes: {
                love: "이번 주 애정운은 상승 국면입니다. 적극적인 표현이 좋은 결과를 가져올 것입니다.",
                money: "재정 상태가 안정적입니다. 장기적인 투자 계획을 세워보세요.",
                work: "업무에서 좋은 성과를 낼 수 있는 주입니다. 집중력을 발휘하세요.",
                health: "건강 관리에 신경 쓰면서 규칙적인 생활을 유지하세요."
            },
            keyDays: ["월요일 - 중요한 결정", "수요일 - 좋은 소식", "금요일 - 새로운 기회"],
            advice: "한 주를 긍정적으로 시작하고, 매일 작은 목표를 달성해 나가세요."
        };
    }

    /**
     * 월간 운세 샘플 데이터 생성
     */
    generateMonthlyFortune(zodiacId) {
        const month = new Date().getMonth() + 1;
        const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        const themes = ["새로운 시작", "관계 발전", "성과 달성", "내면 성찰", "도약 준비"];
        
        return {
            zodiacId: zodiacId,
            month: monthNames[month - 1],
            year: new Date().getFullYear(),
            theme: themes[Math.floor(Math.random() * themes.length)] + "의 달",
            overall: `${monthNames[month - 1]}은 전반적으로 순조로운 달이 될 것입니다. 목표를 명확히 하고 꾸준히 노력하세요.`,
            fortunes: {
                love: "이달의 애정운은 매우 활발합니다. 관계 발전의 기회가 많을 것입니다.",
                money: "재정 상태가 개선될 것입니다. 새로운 수입원이 생길 가능성이 있습니다.",
                work: "경력 발전의 기회가 있습니다. 적극적으로 도전하세요.",
                health: "건강에 주의가 필요한 시기입니다. 충분한 휴식을 취하세요."
            },
            keyDates: [`${Math.floor(Math.random() * 8) + 5}일`, `${Math.floor(Math.random() * 8) + 15}일`, `${Math.floor(Math.random() * 5) + 25}일`],
            advice: "이달은 계획을 세우고 실행에 옮기기에 좋은 시기입니다."
        };
    }

    /**
     * 연간 운세 샘플 데이터 생성
     */
    generateYearlyFortune(zodiacId) {
        const year = new Date().getFullYear();
        const themes = ["대전환", "성장과 발전", "안정과 번영", "도전과 기회", "인연과 만남"];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        
        return {
            zodiacId: zodiacId,
            year: year,
            theme: `${theme}의 해`,
            overall: `${year}년은 당신에게 ${theme}의 해가 될 것입니다. 많은 변화와 성장의 기회가 있을 것입니다.`,
            fortunes: {
                love: "올해 애정운은 전반적으로 상승세를 보이며, 진정한 사랑을 찾거나 기존 관계가 더욱 깊어질 것입니다.",
                money: "재정적으로 안정적인 한 해가 될 것이며, 새로운 수입원이 생길 가능성이 있습니다.",
                work: "경력 발전의 중요한 전환점이 될 수 있는 해입니다. 적극적으로 기회를 잡으세요.",
                health: "건강 관리에 신경 쓴다면 활력 넘치는 한 해를 보낼 수 있을 것입니다."
            },
            bestMonths: ["3월", "7월", "10월"],
            challengingMonths: ["2월", "5월", "11월"],
            keyAdvice: `${year}년은 당신의 잠재력을 최대한 발휘할 수 있는 해입니다. 자신을 믿고 도전하세요!`
        };
    }

    /**
     * 별자리 궁합 샘플 데이터 생성
     */
    generateCompatibility(zodiac1Id, zodiac2Id) {
        // 원소별 그룹
        const elements = {
            fire: [1, 5, 9],
            earth: [2, 6, 10],
            air: [3, 7, 11],
            water: [4, 8, 12]
        };

        // 같은 원소 찾기
        let sameElement = false;
        for (const group of Object.values(elements)) {
            if (group.includes(zodiac1Id) && group.includes(zodiac2Id)) {
                sameElement = true;
                break;
            }
        }

        // 기본 점수 계산
        let baseScore;
        if (zodiac1Id === zodiac2Id) {
            baseScore = 75;
        } else if (sameElement) {
            baseScore = 85;
        } else {
            baseScore = 60;
        }

        // 약간의 변동 추가
        const score = baseScore + Math.floor(Math.random() * 20) - 10;
        const finalScore = Math.max(40, Math.min(100, score));

        // 궁합 텍스트 생성
        let description, advice;
        if (finalScore >= 80) {
            description = "천생연분! 서로를 완벽하게 이해하고 사랑할 수 있는 관계입니다.";
            advice = "함께 새로운 도전을 시작해보세요. 서로의 믿음이 큰 성과를 만들어낼 것입니다.";
        } else if (finalScore >= 60) {
            description = "좋은 인연입니다. 서로의 차이를 인정하면 행복한 관계가 될 수 있습니다.";
            advice = "정기적으로 깊은 대화를 나누는 시간을 가지세요. 취미를 함께 공유하면 더 가까워질 수 있습니다.";
        } else {
            description = "도전적인 관계입니다. 많은 인내와 이해가 필요합니다.";
            advice = "급하게 서두르지 말고 천천히 서로를 알아가세요. 작은 공통점부터 찾아나가면 좋습니다.";
        }

        return {
            zodiac1Id: zodiac1Id,
            zodiac2Id: zodiac2Id,
            score: finalScore,
            description: description,
            details: {
                love: `애정 궁합: ${finalScore}점`,
                friendship: `우정 궁합: ${finalScore + Math.floor(Math.random() * 10) - 5}점`,
                work: `업무 궁합: ${finalScore + Math.floor(Math.random() * 10) - 5}점`
            },
            advice: advice
        };
    }

    /**
     * 유틸리티 함수들
     */
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff)).toISOString().split('T')[0];
    }

    getWeekEnd() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + 7;
        return new Date(now.setDate(diff)).toISOString().split('T')[0];
    }
}

// 전역 객체로 내보내기
window.ZodiacAPI = ZodiacAPI;