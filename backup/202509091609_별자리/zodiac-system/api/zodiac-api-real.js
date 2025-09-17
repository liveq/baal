/**
 * 별자리 운세 API - 실제 데이터 버전
 * JSON 파일에서 실제 운세 데이터를 로드하여 제공
 */

class ZodiacAPIReal {
    constructor() {
        this.fortuneData = null;
        this.loadFortuneData();
        
        // 별자리 정보 배열
        this.zodiacSigns = [
            { id: 1, name: '양자리', symbol: '♈', start: '3.21', end: '4.19' },
            { id: 2, name: '황소자리', symbol: '♉', start: '4.20', end: '5.20' },
            { id: 3, name: '쌍둥이자리', symbol: '♊', start: '5.21', end: '6.20' },
            { id: 4, name: '게자리', symbol: '♋', start: '6.21', end: '7.22' },
            { id: 5, name: '사자자리', symbol: '♌', start: '7.23', end: '8.22' },
            { id: 6, name: '처녀자리', symbol: '♍', start: '8.23', end: '9.22' },
            { id: 7, name: '천칭자리', symbol: '♎', start: '9.23', end: '10.22' },
            { id: 8, name: '전갈자리', symbol: '♏', start: '10.23', end: '11.21' },
            { id: 9, name: '사수자리', symbol: '♐', start: '11.22', end: '12.21' },
            { id: 10, name: '염소자리', symbol: '♑', start: '12.22', end: '1.19' },
            { id: 11, name: '물병자리', symbol: '♒', start: '1.20', end: '2.18' },
            { id: 12, name: '물고기자리', symbol: '♓', start: '2.19', end: '3.20' }
        ];
    }

    /**
     * 운세 데이터 로드 (상세 로그 포함)
     */
    async loadFortuneData() {
        console.log('🔄 loadFortuneData() 시작');
        console.log('📁 시도할 경로: ../api/fortune-data.json');
        
        try {
            console.log('🌐 fetch 요청 시작...');
            const response = await fetch('../api/fortune-data.json');
            
            console.log('📊 Response 상태:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                url: response.url
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            console.log('📄 JSON 파싱 시작...');
            this.fortuneData = await response.json();
            
            // 로드된 데이터 구조 분석
            console.log('✅ Fortune data loaded successfully!');
            console.log('📋 데이터 구조 분석:');
            console.log('- daily 키 개수:', Object.keys(this.fortuneData.daily || {}).length);
            console.log('- yearly 키 존재:', !!this.fortuneData.yearly);
            console.log('- weekly 키 존재:', !!this.fortuneData.weekly);
            console.log('- monthly 키 존재:', !!this.fortuneData.monthly);
            console.log('- compatibility 키 존재:', !!this.fortuneData.compatibility);
            
            // 첫 번째 daily 데이터 샘플 출력
            const firstDailyKey = Object.keys(this.fortuneData.daily || {})[0];
            if (firstDailyKey) {
                console.log('📅 첫 번째 daily 데이터:', firstDailyKey);
                const firstDayData = this.fortuneData.daily[firstDailyKey];
                console.log('🔢 해당 날짜의 별자리 개수:', Object.keys(firstDayData || {}).length);
                console.log('🎯 샘플 데이터 (별자리 1):', firstDayData['1'] || 'N/A');
            } else {
                console.warn('⚠️ daily 데이터가 비어있습니다!');
            }
            
        } catch (error) {
            console.error('❌ Fortune data 로드 실패:');
            console.error('- Error message:', error.message);
            console.error('- Error type:', error.constructor.name);
            console.error('- Stack trace:', error.stack);
            
            // 폴백: 로컬 스토리지 사용
            console.log('🔄 폴백 데이터로 초기화...');
            this.fortuneData = {
                daily: {},
                yearly: {},
                weekly: {},
                monthly: {},
                compatibility: {}
            };
            console.log('📦 폴백 데이터 구조 설정 완료');
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
        
        return 1;
    }

    /**
     * 날짜로 별자리 가져오기 (zodiac.js에서 사용)
     */
    getZodiacByDate(month, day) {
        const zodiacId = this.getZodiacId(month, day);
        return this.zodiacSigns[zodiacId - 1];
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
     * 일일 운세 가져오기 (상세 로그 포함)
     */
    async getDailyFortune(zodiacId) {
        console.log('🌟 getDailyFortune() 호출됨');
        console.log('📝 요청 파라미터:', { zodiacId, zodiacIdType: typeof zodiacId });
        
        // 데이터가 아직 로드되지 않았으면 기다림
        if (!this.fortuneData) {
            console.log('⏳ fortuneData가 없음, loadFortuneData() 호출...');
            await this.loadFortuneData();
        }

        const today = new Date().toISOString().split('T')[0];
        console.log('📅 오늘 날짜:', today);
        
        // 실제 데이터에서 찾기
        console.log('🔍 오늘 날짜 데이터 확인...');
        console.log('- today 키 존재:', !!this.fortuneData.daily[today]);
        
        if (this.fortuneData.daily[today]) {
            console.log('- 오늘 날짜 데이터 별자리 키들:', Object.keys(this.fortuneData.daily[today]));
            console.log('- 요청된 zodiacId 존재:', !!this.fortuneData.daily[today][zodiacId]);
        }
        
        if (this.fortuneData.daily[today] && this.fortuneData.daily[today][zodiacId]) {
            const fortune = this.fortuneData.daily[today][zodiacId];
            console.log('✅ 오늘 날짜 데이터 발견!');
            console.log('🎯 반환할 운세 데이터:', fortune);
            
            const result = {
                zodiacId: zodiacId,
                date: today,
                ...fortune
            };
            console.log('📤 최종 반환 데이터:', result);
            return result;
        }

        console.log('⚠️ 오늘 날짜 데이터 없음, 폴백 로직 시작...');
        
        // 데이터가 없으면 가장 최근 데이터 사용 (예: 2025-01-01)
        const fallbackDate = '2025-01-01';
        const availableDates = Object.keys(this.fortuneData.daily).sort();
        console.log('📋 사용 가능한 날짜들:', availableDates.slice(0, 10), '... (총', availableDates.length, '개)');
        
        // 현재 날짜에 가장 가까운 날짜 찾기
        let useDate = fallbackDate;
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();
        console.log('🎯 찾는 월/일:', currentMonth + '/' + currentDay);
        
        // 같은 월일을 찾기 (연도 무시)
        console.log('🔍 같은 월일 데이터 검색 중...');
        for (const date of availableDates) {
            const [year, month, day] = date.split('-').map(Number);
            if (month === currentMonth && day === currentDay) {
                useDate = date;
                console.log('🎉 같은 월일 발견:', useDate);
                break;
            }
        }
        
        // 못 찾으면 같은 일자 사용 (월 무시)
        if (useDate === fallbackDate) {
            console.log('🔍 같은 일자 데이터 검색 중...');
            for (const date of availableDates) {
                const day = parseInt(date.split('-')[2]);
                if (day === currentDay) {
                    useDate = date;
                    console.log('📅 같은 일자 발견:', useDate);
                    break;
                }
            }
        }

        console.log('📌 사용할 날짜:', useDate);
        console.log('- 해당 날짜 데이터 존재:', !!this.fortuneData.daily[useDate]);
        
        if (this.fortuneData.daily[useDate]) {
            console.log('- 해당 날짜의 별자리 키들:', Object.keys(this.fortuneData.daily[useDate]));
            console.log('- 요청된 zodiacId 존재:', !!this.fortuneData.daily[useDate][zodiacId]);
        }
        
        if (this.fortuneData.daily[useDate] && this.fortuneData.daily[useDate][zodiacId]) {
            const fortune = this.fortuneData.daily[useDate][zodiacId];
            console.log('✅ 폴백 데이터 발견!');
            console.log('🎯 사용할 운세 데이터:', fortune);
            
            const result = {
                zodiacId: zodiacId,
                date: today,  // 실제 오늘 날짜로 표시
                ...fortune
            };
            console.log('📤 최종 반환 데이터 (폴백):', result);
            return result;
        }

        // 폴백: 기본 데이터 생성
        console.log('❌ 모든 데이터 검색 실패, 기본 데이터 생성...');
        const generatedFortune = this.generateDailyFortune(zodiacId);
        console.log('🔧 생성된 기본 데이터:', generatedFortune);
        return generatedFortune;
    }

    /**
     * 연간 운세 가져오기
     */
    async getYearlyFortune(zodiacId) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }

        if (this.fortuneData.yearly[zodiacId]) {
            return {
                zodiacId: zodiacId,
                ...this.fortuneData.yearly[zodiacId]
            };
        }

        // 폴백: 기본 데이터 생성
        return this.generateYearlyFortune(zodiacId);
    }

    /**
     * 주간 운세 가져오기
     */
    async getWeeklyFortune(zodiacId) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        const weekNum = this.getCurrentWeekNumber();
        const weekKey = `2025-W${weekNum.toString().padStart(2, '0')}`;
        
        if (this.fortuneData.weekly && this.fortuneData.weekly[weekKey] && 
            this.fortuneData.weekly[weekKey][zodiacId]) {
            return this.fortuneData.weekly[weekKey][zodiacId];
        }
        
        // Fallback
        return this.generateWeeklyFortune(zodiacId);
    }

    /**
     * 월간 운세 가져오기
     */
    async getMonthlyFortune(zodiacId) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        const currentMonth = new Date().getMonth() + 1;
        const monthKey = `2025-${currentMonth.toString().padStart(2, '0')}`;
        
        if (this.fortuneData.monthly && this.fortuneData.monthly[monthKey] && 
            this.fortuneData.monthly[monthKey][zodiacId]) {
            return this.fortuneData.monthly[monthKey][zodiacId];
        }
        
        // Fallback
        return this.generateMonthlyFortune(zodiacId);
    }

    /**
     * 별자리 궁합 확인
     */
    async getCompatibility(zodiac1Id, zodiac2Id) {
        if (!this.fortuneData) {
            await this.loadFortuneData();
        }
        
        // Try both combinations (1-2 and 2-1)
        let compatKey = `${zodiac1Id}-${zodiac2Id}`;
        if (this.fortuneData.compatibility && this.fortuneData.compatibility[compatKey]) {
            return this.fortuneData.compatibility[compatKey];
        }
        
        // Try reverse order
        compatKey = `${zodiac2Id}-${zodiac1Id}`;
        if (this.fortuneData.compatibility && this.fortuneData.compatibility[compatKey]) {
            return this.fortuneData.compatibility[compatKey];
        }
        
        // Fallback
        return this.generateCompatibility(zodiac1Id, zodiac2Id);
    }

    // 폴백 생성 함수들
    generateDailyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            date: new Date().toISOString().split('T')[0],
            overall: "오늘은 특별한 하루가 될 것입니다.",
            scores: {
                love: 75,
                money: 70,
                work: 80,
                health: 75
            },
            fortunes: {
                love: "사랑이 깊어지는 날입니다.",
                money: "재정이 안정적입니다.",
                work: "업무 성과가 좋습니다.",
                health: "건강에 유의하세요."
            },
            lucky: {
                color: "파랑",
                number: 7,
                time: "오후 2-4시"
            },
            advice: "긍정적인 마음으로 하루를 시작하세요!"
        };
    }

    generateWeeklyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            weekStart: this.getWeekStart(),
            weekEnd: this.getWeekEnd(),
            theme: "성장의 한 주",
            overall: "이번 주는 성장과 발전의 기회가 많을 것입니다.",
            fortunes: {
                love: "애정운이 상승합니다.",
                money: "투자 기회를 포착하세요.",
                work: "중요한 프로젝트가 시작됩니다.",
                health: "규칙적인 운동이 필요합니다."
            },
            keyDays: ["월요일 - 새로운 시작", "수요일 - 중요한 만남", "금요일 - 성과 달성"],
            advice: "매일 작은 목표를 세우고 달성해나가세요."
        };
    }

    generateMonthlyFortune(zodiacId) {
        const month = new Date().getMonth() + 1;
        return {
            zodiacId: zodiacId,
            year: new Date().getFullYear(),
            month: month,
            theme: "변화와 성장",
            overall: "이번 달은 많은 변화와 함께 성장의 기회가 있을 것입니다.",
            fortunes: {
                love: "새로운 만남이나 관계 발전이 있을 것입니다.",
                money: "재정 상황이 개선될 것입니다.",
                work: "커리어 발전의 기회가 있습니다.",
                health: "건강 관리에 더 신경 쓰세요."
            },
            keyDates: ["5일", "15일", "25일"],
            advice: "변화를 두려워하지 말고 받아들이세요."
        };
    }

    generateYearlyFortune(zodiacId) {
        return {
            zodiacId: zodiacId,
            year: new Date().getFullYear(),
            theme: "도약의 해",
            overall: "올해는 큰 도약을 이룰 수 있는 해가 될 것입니다.",
            fortunes: {
                love: "진정한 사랑을 찾거나 관계가 깊어질 것입니다.",
                money: "경제적 안정과 성장이 있을 것입니다.",
                work: "커리어의 전환점이 될 것입니다.",
                health: "건강한 생활 습관을 만들어가세요."
            },
            bestMonths: ["3월", "7월", "11월"],
            challengingMonths: ["2월", "9월"],
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
    
    /**
     * 현재 년도의 주차 번호 계산
     */
    getCurrentWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start + ((start.getDay() + 6) % 7) * 86400000;
        return Math.ceil(diff / 604800000);
    }
}

// 전역 인스턴스 생성
const zodiacAPI = new ZodiacAPIReal();