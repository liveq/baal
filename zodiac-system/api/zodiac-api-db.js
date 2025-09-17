/**
 * 별자리 운세 API - 데이터베이스 버전
 * SQLite 데이터베이스를 사용하는 실제 운세 API
 */

class ZodiacAPIDB {
    constructor() {
        this.dbPath = '../database/zodiac_fortunes.db';
        this.db = null;
        this.initDatabase();
    }

    /**
     * 데이터베이스 초기화
     */
    async initDatabase() {
        // 브라우저에서는 sql.js 또는 WebSQL 사용
        // Node.js 환경에서는 better-sqlite3 사용
        // 여기서는 브라우저 환경을 위한 IndexedDB 폴백 구현
        
        if (!this.db) {
            // IndexedDB를 사용한 로컬 캐싱 구현
            this.useLocalStorage = true;
        }
    }

    /**
     * 별자리 ID 가져오기
     */
    getZodiacId(month, day) {
        const date = month * 100 + day;
        
        if (date >= 321 && date <= 419) return 1;  // 양자리
        if (date >= 420 && date <= 520) return 2;  // 황소자리
        if (date >= 521 && date <= 620) return 3;  // 쌍둥이자리
        if (date >= 621 && date <= 722) return 4;  // 게자리
        if (date >= 723 && date <= 822) return 5;  // 사자자리
        if (date >= 823 && date <= 922) return 6;  // 처녀자리
        if (date >= 923 && date <= 1022) return 7; // 천칭자리
        if (date >= 1023 && date <= 1121) return 8; // 전갈자리
        if (date >= 1122 && date <= 1221) return 9; // 사수자리
        if (date >= 1222 || date <= 119) return 10; // 염소자리
        if (date >= 120 && date <= 218) return 11;  // 물병자리
        if (date >= 219 && date <= 320) return 12;  // 물고기자리
        
        return 1; // 기본값
    }

    /**
     * 별자리 정보 가져오기
     */
    async getZodiacInfo(zodiacId) {
        const zodiacInfo = {
            1: { name: '양자리', element: 'Fire', symbol: '♈', dates: '3.21~4.19',
                description: '열정적이고 모험을 좋아하는 개척자의 별자리' },
            2: { name: '황소자리', element: 'Earth', symbol: '♉', dates: '4.20~5.20',
                description: '인내심이 강하고 실용적인 예술가의 별자리' },
            3: { name: '쌍둥이자리', element: 'Air', symbol: '♊', dates: '5.21~6.20',
                description: '호기심이 많고 소통을 중시하는 지식인의 별자리' },
            4: { name: '게자리', element: 'Water', symbol: '♋', dates: '6.21~7.22',
                description: '감성적이고 가족을 소중히 여기는 보호자의 별자리' },
            5: { name: '사자자리', element: 'Fire', symbol: '♌', dates: '7.23~8.22',
                description: '자신감 넘치고 리더십이 강한 왕의 별자리' },
            6: { name: '처녀자리', element: 'Earth', symbol: '♍', dates: '8.23~9.22',
                description: '완벽주의적이고 분석적인 봉사자의 별자리' },
            7: { name: '천칭자리', element: 'Air', symbol: '♎', dates: '9.23~10.22',
                description: '균형과 조화를 추구하는 외교관의 별자리' },
            8: { name: '전갈자리', element: 'Water', symbol: '♏', dates: '10.23~11.21',
                description: '열정적이고 신비로운 변혁가의 별자리' },
            9: { name: '사수자리', element: 'Fire', symbol: '♐', dates: '11.22~12.21',
                description: '자유롭고 철학적인 탐험가의 별자리' },
            10: { name: '염소자리', element: 'Earth', symbol: '♑', dates: '12.22~1.19',
                description: '야심차고 인내심 강한 성취자의 별자리' },
            11: { name: '물병자리', element: 'Air', symbol: '♒', dates: '1.20~2.18',
                description: '독창적이고 인도주의적인 혁신가의 별자리' },
            12: { name: '물고기자리', element: 'Water', symbol: '♓', dates: '2.19~3.20',
                description: '상상력이 풍부하고 감수성이 깊은 예술가의 별자리' }
        };
        
        return zodiacInfo[zodiacId] || zodiacInfo[1];
    }

    /**
     * 일일 운세 가져오기
     */
    async getDailyFortune(zodiacId) {
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `fortune_daily_${zodiacId}_${today}`;
        
        // 먼저 로컬 스토리지 확인
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            return JSON.parse(cached);
        }

        // 데이터베이스에서 가져올 수 없는 경우 생성
        const fortune = this.generateDailyFortune(zodiacId);
        localStorage.setItem(storageKey, JSON.stringify(fortune));
        
        return fortune;
    }

    /**
     * 주간 운세 가져오기
     */
    async getWeeklyFortune(zodiacId) {
        const weekNumber = this.getWeekNumber(new Date());
        const year = new Date().getFullYear();
        const storageKey = `fortune_weekly_${zodiacId}_${year}_${weekNumber}`;
        
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

        // 실제 데이터베이스 데이터 시뮬레이션
        const yearlyData = {
            1: {
                zodiacId: 1,
                year: 2025,
                theme: "창조와 도전의 해",
                overall: "르네상스 천재의 붓끝처럼, 당신의 창의성이 빛을 발할 해입니다. 만리장성을 쌓은 황제의 대담함으로 새로운 영토를 개척하며, 후기 인상파 화가의 열정으로 세상에 색깔을 입힐 것입니다.",
                fortunes: {
                    love: "무성영화 황제의 유머와 매력으로 사랑의 무대를 장식합니다. 코미디 속 진실한 감정처럼, 웃음 뒤에 숨은 진심이 상대방의 마음을 사로잡을 것입니다.",
                    money: "독립선언서를 쓴 건국의 아버지처럼 경제적 자립의 기틀을 마련합니다. 알프스를 넘은 장군의 전략으로 투자의 새 길을 개척할 것입니다.",
                    work: "철혈재상의 통일 의지로 업무 영역을 확장합니다. 트로이 전쟁 영웅의 용맹함으로 경쟁자들을 물리치며, 동방견문록의 저자처럼 새로운 시장을 발견하게 될 것입니다.",
                    health: "전쟁의 신이 내린 강인한 체력이 당신을 지킵니다. 근대 터키의 아버지처럼 개혁적인 생활습관으로 몸과 마음을 새롭게 단련할 것입니다."
                },
                bestMonths: ["3월", "7월", "11월"],
                challengingMonths: ["6월", "9월"],
                keyAdvice: "매일 새로운 시도를 하나씩 도전하고, 실패를 두려워하지 말고 다빈치처럼 모든 것에 호기심을 가지세요."
            },
            2: {
                zodiacId: 2,
                year: 2025,
                theme: "예술과 안정의 해",
                overall: "불멸의 극작가가 펜을 들듯, 당신의 인내가 작품이 되는 해입니다. 마지막 파라오의 우아함과 깨달음의 부처님처럼 내면의 평화를 찾으며, 프랑스를 구한 소녀의 순수한 신념으로 목표를 향해 나아갑니다.",
                fortunes: {
                    love: "영화계 아이콘의 우아함으로 사랑을 키워갑니다. 70년 재위한 여왕의 지속적인 사랑처럼, 깊고 변치 않는 감정이 관계를 더욱 견고하게 만들 것입니다.",
                    money: "자본론 저자의 체계적 사고로 재정을 관리합니다. 바로크 음악 거장의 완벽주의로 저축 계획을 세우며, 진화론 창시자처럼 장기적 관점에서 투자가 진화해 나갈 것입니다.",
                    work: "패션 혁명가의 혁신으로 업무 스타일을 바꿉니다. 생각하는 사람을 조각한 예술가처럼 깊이 있는 작업으로 동료들의 인정을 받을 것입니다.",
                    health: "사랑과 미의 여신이 주는 아름다움이 건강의 기초가 됩니다. 감각적 예술혼처럼 오감을 통한 힐링으로 몸과 마음의 균형을 찾을 것입니다."
                },
                bestMonths: ["4월", "8월", "12월"],
                challengingMonths: ["7월", "10월"],
                keyAdvice: "성급함보다 꾸준함을 택하고, 셰익스피어처럼 인내로 불멸의 작품을 만들어가세요."
            }
        };

        const fortune = yearlyData[zodiacId] || this.generateYearlyFortune(zodiacId);
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

    // 기존 생성 함수들은 폴백으로 유지
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
            ]
        };

        const randomScore = () => Math.floor(Math.random() * 30) + 65;
        const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
                money: "재정 상태가 안정적입니다.",
                work: "업무에서 좋은 성과를 낼 수 있습니다.",
                health: "건강 관리에 신경 쓰세요."
            },
            lucky: {
                color: "파랑",
                number: Math.floor(Math.random() * 9) + 1,
                time: "오후 2-4시"
            },
            advice: "오늘 하루도 긍정적인 마음으로 시작하세요!"
        };
    }

    generateWeeklyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            weekStart: this.getWeekStart(),
            weekEnd: this.getWeekEnd(),
            theme: "성장의 한 주",
            overall: "이번 주는 성장의 한 주가 될 것입니다.",
            fortunes: {
                love: "애정운이 상승합니다.",
                money: "재정이 안정적입니다.",
                work: "업무 성과가 좋습니다.",
                health: "건강에 유의하세요."
            },
            keyDays: ["월요일 - 중요한 결정", "수요일 - 좋은 소식", "금요일 - 새로운 기회"],
            advice: "한 주를 긍정적으로 시작하세요."
        };
    }

    generateMonthlyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            theme: "새로운 시작",
            overall: "이번 달은 새로운 시작의 달입니다.",
            fortunes: {
                love: "사랑이 깊어집니다.",
                money: "투자 기회가 있습니다.",
                work: "승진 가능성이 있습니다.",
                health: "활력이 넘칩니다."
            },
            keyDates: ["3일", "15일", "27일"],
            advice: "계획적으로 한 달을 보내세요."
        };
    }

    generateYearlyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            year: new Date().getFullYear(),
            theme: "도전과 기회의 해",
            overall: "올해는 도전과 기회의 해가 될 것입니다.",
            fortunes: {
                love: "진정한 사랑을 찾을 수 있습니다.",
                money: "경제적 안정을 찾을 수 있습니다.",
                work: "경력 발전의 기회가 있습니다.",
                health: "건강한 한 해가 될 것입니다."
            },
            bestMonths: ["3월", "7월", "11월"],
            challengingMonths: ["2월", "5월"],
            keyAdvice: "자신을 믿고 도전하세요!"
        };
    }

    generateCompatibility(zodiac1Id, zodiac2Id) {
        const elements = {
            fire: [1, 5, 9],
            earth: [2, 6, 10],
            air: [3, 7, 11],
            water: [4, 8, 12]
        };

        let sameElement = false;
        for (const group of Object.values(elements)) {
            if (group.includes(zodiac1Id) && group.includes(zodiac2Id)) {
                sameElement = true;
                break;
            }
        }

        const baseScore = sameElement ? 85 : 70;
        const score = baseScore + Math.floor(Math.random() * 15);

        return {
            zodiac1Id: zodiac1Id,
            zodiac2Id: zodiac2Id,
            score: Math.min(100, score),
            description: score >= 80 ? 
                "천생연분! 서로를 완벽하게 이해하고 사랑할 수 있는 관계입니다." :
                "좋은 인연입니다. 서로의 차이를 인정하면 행복한 관계가 될 수 있습니다.",
            details: {
                love: `애정 궁합: ${score}점`,
                friendship: `우정 궁합: ${score + Math.floor(Math.random() * 10) - 5}점`,
                work: `업무 궁합: ${score + Math.floor(Math.random() * 10) - 5}점`
            },
            advice: "정기적으로 깊은 대화를 나누는 시간을 가지세요."
        };
    }

    // 유틸리티 함수들
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

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

// 전역 인스턴스 생성
const zodiacAPIDB = new ZodiacAPIDB();