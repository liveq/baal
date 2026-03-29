// 타로 스프레드 포지션 정의
// Tarot Spread Position Definitions for Korean Users

const TAROT_SPREADS = {
    // 1. 오늘의 한 장 (Single Card Draw)
    single: {
        name: "오늘의 한 장",
        description: "하루의 에너지와 메시지를 받는 간단한 리딩",
        positions: [
            {
                id: 1,
                name: "오늘의 메시지",
                description: "오늘 하루 당신에게 필요한 지혜와 안내",
                context: "일상의 흐름, 주의할 점, 기회와 도전"
            }
        ]
    },

    // 2. 삼원 스프레드 (Three-Card Spread)
    threeCard: {
        name: "삼원 스프레드",
        description: "과거-현재-미래의 흐름을 파악하는 기본 스프레드",
        positions: [
            {
                id: 1,
                name: "과거",
                description: "현재 상황에 영향을 미치는 과거의 에너지",
                context: "지나간 경험, 학습한 교훈, 현재에 작용하는 과거의 힘"
            },
            {
                id: 2,
                name: "현재",
                description: "지금 이 순간의 상황과 당신의 상태",
                context: "현재의 도전과 기회, 집중해야 할 영역, 현재 에너지"
            },
            {
                id: 3,
                name: "미래",
                description: "현재의 선택이 이끌어갈 가능한 미래",
                context: "다가올 기회, 잠재적 결과, 준비해야 할 변화"
            }
        ]
    },

    // 3. 켈틱 크로스 (Celtic Cross)
    celticCross: {
        name: "켈틱 크로스",
        description: "가장 포괄적이고 상세한 10장 카드 스프레드",
        positions: [
            {
                id: 1,
                name: "현재 상황",
                description: "지금 당신이 처한 상황의 핵심",
                context: "현재의 중심 이슈, 주요 관심사, 현재 에너지의 본질"
            },
            {
                id: 2,
                name: "도전과 장애",
                description: "현재 상황을 가로막는 요소나 극복해야 할 과제",
                context: "내외적 장애물, 해결해야 할 갈등, 성장의 기회"
            },
            {
                id: 3,
                name: "먼 과거",
                description: "현재 상황의 뿌리가 되는 과거의 영향",
                context: "근본적 원인, 깊은 패턴, 무의식적 동기"
            },
            {
                id: 4,
                name: "가능한 미래",
                description: "현재 경로를 유지할 때 나타날 수 있는 결과",
                context: "자연스러운 전개, 예상되는 변화, 다가오는 기회"
            },
            {
                id: 5,
                name: "가까운 과거",
                description: "최근에 일어난 일들이 현재에 미치는 영향",
                context: "최근 경험, 변화의 시작점, 현재로 이어지는 흐름"
            },
            {
                id: 6,
                name: "가까운 미래",
                description: "앞으로 몇 주 내에 일어날 가능성이 높은 상황",
                context: "임박한 변화, 단기적 전망, 준비해야 할 일들"
            },
            {
                id: 7,
                name: "내적 접근법",
                description: "상황에 대한 당신의 내적 태도와 접근 방식",
                context: "개인적 관점, 내적 자원, 심리적 준비 상태"
            },
            {
                id: 8,
                name: "외적 영향",
                description: "주변 환경과 타인들이 미치는 영향",
                context: "외부 조건, 타인의 기대, 사회적 압력과 지원"
            },
            {
                id: 9,
                name: "희망과 두려움",
                description: "상황에 대한 당신의 깊은 감정과 기대",
                context: "내면의 소망, 숨겨진 불안, 진정한 동기"
            },
            {
                id: 10,
                name: "최종 결과",
                description: "모든 요소가 통합될 때 나타나는 궁극적 결과",
                context: "전체적 전망, 학습할 교훈, 성장의 방향"
            }
        ]
    },

    // 4. 오원소 펜타그램 (Five-Element Pentagram)
    pentagram: {
        name: "오원소 펜타그램",
        description: "다섯 원소의 에너지로 균형과 조화를 탐구하는 스프레드",
        positions: [
            {
                id: 1,
                name: "정신 (Spirit)",
                description: "영적 지혜와 직관, 높은 목적",
                context: "영적 성장, 내적 지혜, 신성한 연결, 생명의 목적"
            },
            {
                id: 2,
                name: "불 (Fire)",
                description: "열정, 창조력, 행동력과 의지",
                context: "동기와 열망, 창조적 에너지, 리더십, 변화의 힘"
            },
            {
                id: 3,
                name: "물 (Water)",
                description: "감정, 직감, 치유와 정화",
                context: "감정적 상태, 관계와 사랑, 치유가 필요한 영역"
            },
            {
                id: 4,
                name: "공기 (Air)",
                description: "지성, 소통, 새로운 아이디어",
                context: "사고와 분석, 의사소통, 학습과 지식, 새로운 관점"
            },
            {
                id: 5,
                name: "땅 (Earth)",
                description: "물질적 기반, 실용성, 안정과 성장",
                context: "물질적 안정, 건강과 웰빙, 실용적 문제, 현실적 기반"
            }
        ]
    },

    // 5. 칠성 스프레드 (Seven-Chakra Spread)
    chakra: {
        name: "칠성 스프레드",
        description: "일곱 차크라의 에너지 흐름을 통한 영적 각성 리딩",
        positions: [
            {
                id: 1,
                name: "뿌리 차크라 (Root)",
                description: "생존, 안정, 기본적 생활 기반",
                context: "물질적 안정성, 생존 본능, 가족과 뿌리, 기본 욕구"
            },
            {
                id: 2,
                name: "성골 차크라 (Sacral)",
                description: "창조성, 성적 에너지, 감정적 표현",
                context: "창조적 표현, 성적 에너지, 감정의 흐름, 즐거움"
            },
            {
                id: 3,
                name: "태양신경총 (Solar Plexus)",
                description: "개인적 힘, 의지, 자존감",
                context: "개인의 힘, 자신감, 의지력, 개성의 표현"
            },
            {
                id: 4,
                name: "심장 차크라 (Heart)",
                description: "사랑, 연민, 관계와 조화",
                context: "사랑과 관계, 연민과 용서, 감정적 치유, 조화"
            },
            {
                id: 5,
                name: "목 차크라 (Throat)",
                description: "소통, 진실, 자기 표현",
                context: "진실한 표현, 의사소통, 창조적 표현, 진실성"
            },
            {
                id: 6,
                name: "이마 차크라 (Third Eye)",
                description: "직관, 통찰, 내적 지혜",
                context: "직관적 지혜, 영적 통찰, 내적 비전, 깊은 이해"
            },
            {
                id: 7,
                name: "정수리 차크라 (Crown)",
                description: "영적 연결, 깨달음, 우주적 의식",
                context: "영적 연결, 신성한 지혜, 우주 의식, 깨달음"
            }
        ]
    },

    // 6. 십이궁 만다라 (Twelve-House Zodiac)
    zodiacMandala: {
        name: "십이궁 만다라",
        description: "점성술의 12궁을 통한 삶의 전 영역 탐구",
        positions: [
            {
                id: 1,
                name: "1궁 - 자아",
                description: "개성, 외모, 첫인상, 자아 정체성",
                context: "자아 표현, 개인적 특성, 생명력, 새로운 시작"
            },
            {
                id: 2,
                name: "2궁 - 물질",
                description: "재물, 소유, 가치관, 물질적 안정",
                context: "경제 상황, 소유욕, 개인 가치, 자원 관리"
            },
            {
                id: 3,
                name: "3궁 - 소통",
                description: "의사소통, 학습, 근거리 이동, 형제자매",
                context: "소통 능력, 학습과 교육, 일상적 관계, 정보 교류"
            },
            {
                id: 4,
                name: "4궁 - 가정",
                description: "가족, 집, 뿌리, 감정적 기반",
                context: "가족 관계, 집과 안식처, 감정적 안정, 과거와 뿌리"
            },
            {
                id: 5,
                name: "5궁 - 창조",
                description: "창조성, 자식, 사랑, 취미와 오락",
                context: "창조적 표현, 로맨스, 자녀와의 관계, 즐거움"
            },
            {
                id: 6,
                name: "6궁 - 일상",
                description: "일과 서비스, 건강, 일상 루틴",
                context: "직장과 업무, 건강 관리, 일상의 질서, 봉사"
            },
            {
                id: 7,
                name: "7궁 - 관계",
                description: "파트너십, 결혼, 공개적 관계",
                context: "파트너와의 관계, 결혼, 사업 파트너, 공개적 적"
            },
            {
                id: 8,
                name: "8궁 - 변화",
                description: "변화, 공유 자원, 깊은 심리, 영적 변환",
                context: "깊은 변화, 타인의 자원, 심리적 변환, 신비한 영역"
            },
            {
                id: 9,
                name: "9궁 - 확장",
                description: "철학, 종교, 고등교육, 먼 여행",
                context: "높은 학습, 철학적 탐구, 영적 여정, 해외 관계"
            },
            {
                id: 10,
                name: "10궁 - 사회적 지위",
                description: "직업, 명성, 사회적 지위, 목표 달성",
                context: "사회적 성공, 커리어 목표, 공적 이미지, 성취"
            },
            {
                id: 11,
                name: "11궁 - 희망",
                description: "우정, 소망, 단체 활동, 미래 비전",
                context: "친구 관계, 미래 희망, 사회적 네트워크, 집단 의식"
            },
            {
                id: 12,
                name: "12궁 - 영성",
                description: "영성, 무의식, 숨겨진 것, 자기희생",
                context: "무의식적 패턴, 영적 성장, 숨겨진 적, 초월적 경험"
            }
        ]
    }
};

// 스프레드별 레이아웃 정보
const SPREAD_LAYOUTS = {
    single: {
        cardCount: 1,
        layout: "single",
        difficulty: "초급",
        readingTime: "5-10분"
    },
    threeCard: {
        cardCount: 3,
        layout: "horizontal",
        difficulty: "초급",
        readingTime: "10-15분"
    },
    celticCross: {
        cardCount: 10,
        layout: "cross",
        difficulty: "고급",
        readingTime: "30-45분"
    },
    pentagram: {
        cardCount: 5,
        layout: "pentagram",
        difficulty: "중급",
        readingTime: "20-30분"
    },
    chakra: {
        cardCount: 7,
        layout: "vertical",
        difficulty: "중급",
        readingTime: "25-35분"
    },
    zodiacMandala: {
        cardCount: 12,
        layout: "circle",
        difficulty: "고급",
        readingTime: "45-60분"
    }
};

// 스프레드 추천 시스템
const SPREAD_RECOMMENDATIONS = {
    relationships: ["threeCard", "celticCross", "pentagram"],
    career: ["threeCard", "celticCross", "zodiacMandala"],
    spiritual: ["single", "pentagram", "chakra"],
    general: ["single", "threeCard", "celticCross"],
    daily: ["single"],
    complex: ["celticCross", "zodiacMandala"]
};

// 한국어 설명 텍스트
const SPREAD_DESCRIPTIONS = {
    single: {
        when: "일상의 간단한 질문이나 오늘의 메시지를 받고 싶을 때",
        good_for: "초보자, 빠른 답변이 필요한 상황, 일일 지침"
    },
    threeCard: {
        when: "상황의 흐름을 파악하고 싶을 때",
        good_for: "관계 문제, 의사결정, 상황 분석"
    },
    celticCross: {
        when: "복잡한 상황을 깊이 있게 분석하고 싶을 때",
        good_for: "인생의 중요한 결정, 복합적 문제, 종합적 상담"
    },
    pentagram: {
        when: "삶의 균형과 조화를 찾고 싶을 때",
        good_for: "영적 성장, 내적 균형, 전인적 발전"
    },
    chakra: {
        when: "에너지 상태와 영적 발전을 점검하고 싶을 때",
        good_for: "영적 각성, 에너지 치유, 개인적 성장"
    },
    zodiacMandala: {
        when: "삶의 모든 영역을 종합적으로 살펴보고 싶을 때",
        good_for: "연간 전망, 인생 설계, 전체적 상황 파악"
    }
};

// 브라우저 환경에서 사용할 수 있도록 전역 객체로 등록
if (typeof window !== 'undefined') {
    window.TAROT_SPREADS = TAROT_SPREADS;
    window.SPREAD_LAYOUTS = SPREAD_LAYOUTS;
    window.SPREAD_RECOMMENDATIONS = SPREAD_RECOMMENDATIONS;
    window.SPREAD_DESCRIPTIONS = SPREAD_DESCRIPTIONS;
}

// Node.js 환경에서 사용할 수 있도록 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TAROT_SPREADS,
        SPREAD_LAYOUTS,
        SPREAD_RECOMMENDATIONS,
        SPREAD_DESCRIPTIONS
    };
}