# 신비주의적 타로카드 시스템 기술 설계서

## 시스템 개요

RHEIGHT 프로젝트의 3계층 아키텍처를 기반으로, 타로카드 전문가, 신비학자, 철학자, 작가, 심리학자의 관점을 통합한 디테일하고 신비주의적인 타로카드 시스템을 구현합니다.

## 1. 메이저 아르카나 (22장) 시스템 설계

### 데이터 구조
```javascript
const majorArcana = {
    0: {
        name: "바보(The Fool)",
        korean_name: "순수한 동자승",
        archetype: "순수한 잠재력",
        jungian_archetype: "아니마/아니무스의 통합",
        hero_journey_stage: "여정의 시작",
        element: "공기",
        planet: "천왕성",
        chakra: "크라운 차크라",
        korean_folklore: "동자승이 산을 내려와 속세 경험을 시작하는 이야기",
        symbolism: {
            primary: "무한한 가능성",
            secondary: "용감한 첫걸음",
            shadows: "경솔함, 무모함"
        },
        meditation_guide: "순수한 마음으로 새로운 여정을 시작할 준비를 하세요",
        affirmation: "나는 용기를 가지고 새로운 시작을 받아들입니다"
    },
    // ... 21개 카드 전체 데이터
    21: {
        name: "세계(The World)",
        korean_name: "대순환의 완성",
        archetype: "성취와 완성",
        jungian_archetype: "개성화의 완성",
        hero_journey_stage: "고향으로의 귀환",
        element: "토",
        planet: "토성",
        chakra: "루트 차크라",
        korean_folklore: "도인이 모든 깨달음을 얻어 우주와 하나 되는 경지",
        symbolism: {
            primary: "완성과 성취",
            secondary: "우주적 의식",
            shadows: "정체, 새로운 도전 회피"
        }
    }
};
```

### 칼 융의 집단무의식 연계 시스템
```javascript
class JungianArchetypeSystem {
    constructor() {
        this.archetypes = {
            "persona": [0, 1, 11], // 바보, 마법사, 정의
            "shadow": [15, 16, 18], // 악마, 탑, 달
            "anima_animus": [2, 3, 6, 14], // 여사제, 황후, 연인, 절제
            "self": [10, 19, 20, 21] // 운명의 바퀴, 태양, 심판, 세계
        };
    }

    getArchetypeCards(userProfile) {
        // 사용자의 심리 상태에 따른 원형 카드 추천
        const dominantArchetype = this.analyzePsychologicalState(userProfile);
        return this.archetypes[dominantArchetype];
    }

    analyzePsychologicalState(profile) {
        // 생년월일, 최근 리딩 패턴, 반복되는 카드를 분석
        // 융의 개성화 과정에서 현재 위치 파악
    }
}
```

## 2. 마이너 아르카나 (56장) 원소 시스템

### 4원소 에너지 매트릭스
```javascript
const minorArcana = {
    wands: {
        element: "fire",
        korean_element: "화(火)",
        energy_type: "양적 창조력",
        personality_traits: ["열정적", "창의적", "리더십", "충동적"],
        life_areas: ["사업", "창작", "영감", "성장"],
        chakra_association: ["태양신경총", "성골"],
        seasonal_power: "여름",
        numbers: {
            1: { meaning: "새로운 시작의 불꽃", korean_wisdom: "일념으로 이루어라" },
            2: { meaning: "선택의 갈래", korean_wisdom: "두 마음은 화를 부른다" },
            // ... 10까지
        },
        court_cards: {
            page: { archetype: "불의 학도", korean_type: "열정적 후배" },
            knight: { archetype: "불의 전사", korean_type: "의협심 강한 기사" },
            queen: { archetype: "불의 여왕", korean_type: "카리스마 있는 여성 지도자" },
            king: { archetype: "불의 왕", korean_type: "현명한 지도자" }
        }
    },
    cups: {
        element: "water", 
        korean_element: "수(水)",
        energy_type: "음적 수용력",
        personality_traits: ["감성적", "직관적", "공감적", "예술적"],
        life_areas: ["사랑", "관계", "감정", "영성"],
        chakra_association: ["하트", "목"],
        seasonal_power: "가을"
    },
    swords: {
        element: "air",
        korean_element: "풍(風)",
        energy_type: "중성적 분석력",
        personality_traits: ["논리적", "분석적", "소통형", "갈등 해결형"],
        life_areas: ["사고", "소통", "갈등", "진실"],
        chakra_association: ["목", "제3의눈"],
        seasonal_power: "봄"
    },
    pentacles: {
        element: "earth",
        korean_element: "토(土)",
        energy_type: "물질적 실현력",
        personality_traits: ["실용적", "안정적", "현실적", "인내심"],
        life_areas: ["돈", "건강", "물질", "실현"],
        chakra_association: ["루트", "천골"],
        seasonal_power: "겨울"
    }
};
```

## 3. 신비주의적 스프레드 시스템

### 스프레드 데이터베이스 설계
```sql
-- 스프레드 정의 테이블
CREATE TABLE tarot_spreads (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    korean_name TEXT,
    card_count INTEGER,
    difficulty_level INTEGER, -- 1-5
    mystical_purpose TEXT,
    ritual_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 스프레드 포지션 정의
CREATE TABLE spread_positions (
    id INTEGER PRIMARY KEY,
    spread_id INTEGER,
    position_number INTEGER,
    position_name TEXT,
    korean_meaning TEXT,
    mystical_significance TEXT,
    chakra_association TEXT,
    element_association TEXT,
    FOREIGN KEY (spread_id) REFERENCES tarot_spreads(id)
);

-- 사용자 리딩 기록
CREATE TABLE user_readings (
    id INTEGER PRIMARY KEY,
    user_id TEXT,
    spread_id INTEGER,
    reading_date DATE,
    moon_phase TEXT,
    user_question TEXT,
    cards_drawn TEXT, -- JSON 배열
    interpretation TEXT,
    synchronicity_notes TEXT,
    manifestation_status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 켈트 십자 스프레드 구현
```javascript
class CelticCrossSpread {
    constructor() {
        this.positions = {
            1: {
                name: "현재 상황",
                korean_name: "지금 이 순간",
                mystical_meaning: "영혼의 현재 진동",
                chakra: "heart",
                interpretation_guide: "현재 에너지 상태와 의식 수준"
            },
            2: {
                name: "도전/십자가",
                korean_name: "극복할 과제",
                mystical_meaning: "카르마의 시험",
                chakra: "solar_plexus",
                interpretation_guide: "영혼 성장을 위해 마주해야 할 도전"
            },
            // ... 10개 포지션 전체
            10: {
                name: "최종 결과",
                korean_name: "우주의 응답",
                mystical_meaning: "신성한 계획의 현현",
                chakra: "crown",
                interpretation_guide: "현재 경로가 이끄는 궁극적 결과"
            }
        };
    }

    async performReading(userQuestion, userProfile) {
        const cards = await this.drawCards(10);
        const moonPhase = this.getCurrentMoonPhase();
        const numerologyInfluence = this.calculateNumerology(userProfile);
        
        return {
            spread_type: "celtic_cross",
            question: userQuestion,
            cards: cards,
            positions: this.positions,
            cosmic_influences: {
                moon_phase: moonPhase,
                numerology: numerologyInfluence,
                user_birth_card: this.calculateBirthCard(userProfile)
            },
            interpretation: await this.generateMysticalInterpretation(cards, userProfile)
        };
    }
}
```

## 4. 신비학적 융합 시스템

### 수비학 연계
```javascript
class NumerologyTarotSystem {
    calculateBirthCard(birthDate) {
        // 생년월일을 더해서 메이저 아르카나 카드 도출
        const digits = birthDate.replace(/\D/g, '').split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);
        
        while (sum > 22) {
            sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }
        
        return sum === 0 ? 22 : sum; // 0이면 바보(0)가 아닌 세계(22)로 순환
    }

    calculateSoulCard(birthCard) {
        // 영혼 카드는 생명 카드와 연관된 더 깊은 층위
        return birthCard > 9 ? 
            parseInt(birthCard.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b))) :
            birthCard;
    }

    getPersonalityCard(birthCard) {
        // 외적 페르소나를 나타내는 성격 카드
        const pairs = {
            1: 10, 2: 11, 3: 12, 4: 13, 5: 14, 
            6: 15, 7: 16, 8: 17, 9: 18, 10: 19
        };
        return pairs[birthCard] || birthCard;
    }
}
```

### 점성술 융합
```javascript
class AstrologyTarotSystem {
    constructor() {
        this.zodiacTarotMapping = {
            "aries": { card: 4, name: "황제", element: "fire" },
            "taurus": { card: 5, name: "교황", element: "earth" },
            "gemini": { card: 6, name: "연인", element: "air" },
            "cancer": { card: 7, name: "전차", element: "water" },
            "leo": { card: 8, name: "힘", element: "fire" },
            "virgo": { card: 9, name: "은둔자", element: "earth" },
            "libra": { card: 11, name: "정의", element: "air" },
            "scorpio": { card: 13, name: "죽음", element: "water" },
            "sagittarius": { card: 14, name: "절제", element: "fire" },
            "capricorn": { card: 15, name: "악마", element: "earth" },
            "aquarius": { card: 17, name: "별", element: "air" },
            "pisces": { card: 18, name: "달", element: "water" }
        };
        
        this.planetaryHours = {
            "sun": [8, 19], // 힘, 태양
            "moon": [2, 18], // 여사제, 달
            "mercury": [1, 10], // 마법사, 운명의 바퀴
            "venus": [3, 17], // 황후, 별
            "mars": [16], // 탑
            "jupiter": [10], // 운명의 바퀴
            "saturn": [21] // 세계
        };
    }

    getCurrentPlanetaryInfluence() {
        const now = new Date();
        const hour = now.getHours();
        // 행성시간 계산 로직
        return this.calculatePlanetaryHour(hour);
    }
}
```

### 차크라 시스템 연계
```javascript
class ChakraTarotSystem {
    constructor() {
        this.chakraCardMapping = {
            "root": {
                cards: [21, "pentacles_court", "pentacles_aces"],
                element: "earth",
                korean_name: "뿌리 차크라",
                mantra: "나는 안전하고 보호받고 있다"
            },
            "sacral": {
                cards: [14, "cups_2_to_4"],
                element: "water", 
                korean_name: "천골 차크라",
                mantra: "나는 창조적 에너지가 흐르도록 허용한다"
            },
            "solar_plexus": {
                cards: [8, 19, "wands_court"],
                element: "fire",
                korean_name: "태양신경총 차크라", 
                mantra: "나는 내 개인적 힘을 인정한다"
            },
            "heart": {
                cards: [6, 10, "cups_court"],
                element: "air",
                korean_name: "하트 차크라",
                mantra: "나는 무조건적 사랑을 주고받는다"
            },
            "throat": {
                cards: [5, "swords_court"],
                element: "ether",
                korean_name: "목 차크라",
                mantra: "나는 진실을 말하고 내 목소리를 낸다"
            },
            "third_eye": {
                cards: [2, 9, 18],
                element: "light",
                korean_name: "제3의눈 차크라",
                mantra: "나는 직관과 내면의 지혜를 신뢰한다"
            },
            "crown": {
                cards: [0, 20, 21],
                element: "thought",
                korean_name: "크라운 차크라",
                mantra: "나는 우주 의식과 하나다"
            }
        };
    }

    performChakraReading(targetChakra) {
        const chakraData = this.chakraCardMapping[targetChakra];
        const cards = this.drawFromChakraPool(chakraData.cards);
        
        return {
            chakra: targetChakra,
            korean_name: chakraData.korean_name,
            element: chakraData.element,
            healing_mantra: chakraData.mantra,
            cards: cards,
            balancing_advice: this.generateChakraHealing(cards),
            meditation_guide: this.getChakraMeditation(targetChakra)
        };
    }
}
```

## 5. 심리학적 접근 시스템

### 융의 분석심리학 구현
```javascript
class JungianTarotTherapy {
    constructor() {
        this.shadowWork = {
            cards: [15, 16, 18], // 악마, 탑, 달
            questions: [
                "이 카드가 보여주는 그림자는 무엇입니까?",
                "이 어둠을 어떻게 통합할 수 있을까요?",
                "이 에너지의 긍정적 측면은 무엇입니까?"
            ],
            integration_process: [
                "인식하기", "받아들이기", "통합하기", "변환하기"
            ]
        };
        
        this.individuationProcess = {
            stages: {
                "ego_development": [1, 4, 8], // 마법사, 황제, 힘
                "shadow_confrontation": [15, 16, 18],
                "anima_animus_integration": [2, 3, 6, 14],
                "self_realization": [10, 19, 20, 21]
            }
        };
    }

    performShadowWork(userCards) {
        const shadowCards = userCards.filter(card => 
            this.shadowWork.cards.includes(card.number)
        );
        
        return {
            shadow_aspects: shadowCards,
            integration_tasks: this.generateShadowTasks(shadowCards),
            therapeutic_questions: this.shadowWork.questions,
            healing_rituals: this.createShadowRituals(shadowCards)
        };
    }
}
```

### 게슈탈트 접근 구현
```javascript
class GestaltTarotTherapy {
    async performEmptyChairDialogue(selectedCard) {
        return {
            setup: "선택한 카드를 빈 의자에 앉힌다고 상상해보세요",
            dialogue_prompts: [
                `${selectedCard.name}에게: "당신이 내 삶에 나타난 이유는 무엇인가요?"`,
                `${selectedCard.name}의 입장에서: "나는 당신에게 이것을 알려주고 싶습니다..."`,
                `자신에게: "이 카드로부터 무엇을 배웠나요?"`
            ],
            integration_questions: [
                "이 대화에서 가장 놀라운 통찰은 무엇이었나요?",
                "이 카드의 에너지를 일상에 어떻게 적용할 수 있나요?",
                "이 대화 후 어떤 변화를 느끼시나요?"
            ]
        };
    }

    createPersonificationExercise(cards) {
        return cards.map(card => ({
            card: card,
            personification_guide: `${card.name}이 당신 앞에 살아있는 존재로 나타났다면...`,
            questions: [
                "이 존재의 외모는 어떨까요?",
                "어떤 목소리로 말할까요?",
                "당신에게 전하고 싶은 메시지는 무엇일까요?",
                "이 존재와 어떤 관계를 맺고 싶나요?"
            ]
        }));
    }
}
```

## 6. 한국적 신비주의 융합

### 무속 전통 시스템
```javascript
class KoreanShamanismTarot {
    constructor() {
        this.mudangCards = {
            // 신내림과 연결된 카드들
            spiritual_calling: [0, 2, 9, 20], // 바보, 여사제, 은둔자, 심판
            ancestor_spirits: [4, 5, 14], // 황제, 교황, 절제
            nature_spirits: [17, 18, 21], // 별, 달, 세계
            protection_spirits: [7, 8, 11] // 전차, 힘, 정의
        };

        this.koreanDeities = {
            "삼신할머니": { cards: [3, 17], blessings: "출산, 양육, 보호" },
            "산신령": { cards: [9, 14], blessings: "지혜, 수행, 깨달음" },
            "용왕": { cards: [7, 10], blessings: "풍요, 기회, 변화" },
            "성주신": { cards: [4, 5], blessings: "가정, 안정, 번영" }
        };

        this.shamanRituals = {
            card_purification: {
                items: ["백미", "정화수", "향"],
                process: "동서남북으로 절하며 카드에 정화 에너지 전달",
                mantra: "정화하고 축복하며 보호하소서"
            },
            spirit_invitation: {
                items: ["제물", "촛불", "꽃"],
                process: "조상신과 수호신을 초청하여 안내 요청",
                mantra: "밝은 영혼들이시여 길을 밝혀 주소서"
            }
        };
    }

    performShamanReading(question, ancestralInfo) {
        const spiritualGuides = this.identifyGuides(ancestralInfo);
        const protectionCards = this.drawProtectionCards();
        const guidanceCards = this.drawGuidanceCards();
        
        return {
            spiritual_guides: spiritualGuides,
            protection_energy: protectionCards,
            ancestral_wisdom: guidanceCards,
            ritual_recommendations: this.recommendRituals(protectionCards),
            protective_mantras: this.generateMantras(),
            offering_suggestions: this.suggestOfferings()
        };
    }
}
```

### 사주명리학 융합
```javascript
class SajuTarotSystem {
    constructor() {
        this.fiveElements = {
            "목(木)": { 
                cards: ["wands"], 
                characteristics: "성장, 창조, 유연성",
                season: "봄",
                direction: "동"
            },
            "화(火)": { 
                cards: ["wands_court", 8, 19], 
                characteristics: "열정, 확산, 밝음",
                season: "여름", 
                direction: "남"
            },
            "토(土)": { 
                cards: ["pentacles"], 
                characteristics: "안정, 중심, 수용",
                season: "늦여름",
                direction: "중앙"
            },
            "금(金)": { 
                cards: ["swords"], 
                characteristics: "정리, 수확, 예리함",
                season: "가을",
                direction: "서"
            },
            "수(水)": { 
                cards: ["cups"], 
                characteristics: "유동, 지혜, 깊이",
                season: "겨울",
                direction: "북"
            }
        };

        this.tenStems = {
            "갑": { element: "양목", tarot_influence: "창조적 리더십" },
            "을": { element: "음목", tarot_influence: "유연한 적응" },
            // ... 10간 전체
        };

        this.twelveBranches = {
            "자": { animal: "쥐", element: "양수", cards: [18] },
            "축": { animal: "소", element: "음토", cards: ["pentacles_court"] },
            // ... 12지 전체
        };
    }

    calculateSajuTarotProfile(birthInfo) {
        const { year, month, day, hour } = birthInfo;
        const sajuChart = this.calculateSaju(year, month, day, hour);
        const dominantElement = this.findDominantElement(sajuChart);
        const tarotInfluence = this.fiveElements[dominantElement];

        return {
            saju_chart: sajuChart,
            dominant_element: dominantElement,
            tarot_cards_affinity: tarotInfluence.cards,
            personality_traits: tarotInfluence.characteristics,
            lucky_season: tarotInfluence.season,
            power_direction: tarotInfluence.direction,
            recommended_spreads: this.recommendSpreads(dominantElement),
            timing_guidance: this.calculateFavorableTiming(sajuChart)
        };
    }
}
```

## 7. 인터랙티브 의식 시스템

### 달의 주기별 의식
```javascript
class LunarTarotRituals {
    constructor() {
        this.moonPhases = {
            "new_moon": {
                korean_name: "신월",
                energy: "새로운 시작",
                recommended_spreads: ["intention_setting", "new_beginnings"],
                ritual_elements: ["씨앗", "새 촛불", "맑은 물"],
                cards_focus: [0, 1, "aces"],
                intention: "새로운 사이클을 위한 의도 설정"
            },
            "waxing_moon": {
                korean_name: "상현달",
                energy: "성장과 확장",
                recommended_spreads: ["growth_obstacles", "building_momentum"],
                ritual_elements: ["성장하는 식물", "녹색 촛불"],
                cards_focus: ["2s_to_5s", 11],
                intention: "목표를 향한 에너지 증폭"
            },
            "full_moon": {
                korean_name: "보름달",
                energy: "절정과 성취",
                recommended_spreads: ["manifestation_check", "gratitude_spread"],
                ritual_elements: ["만개한 꽃", "은색 촛불", "문스톤"],
                cards_focus: [10, 19, 21, "court_cards"],
                intention: "성취 감사와 에너지 정화"
            },
            "waning_moon": {
                korean_name: "하현달",
                energy: "정리와 해제",
                recommended_spreads: ["release_spread", "shadow_work"],
                ritual_elements: ["시든 꽃", "검은 촛불", "소금"],
                cards_focus: [13, 16, 18, "reversed_cards"],
                intention: "불필요한 것을 놓아보내기"
            }
        };
    }

    getCurrentMoonGuidance() {
        const currentPhase = this.calculateMoonPhase(new Date());
        const phaseData = this.moonPhases[currentPhase];
        
        return {
            current_phase: currentPhase,
            korean_name: phaseData.korean_name,
            energy_quality: phaseData.energy,
            ritual_setup: phaseData.ritual_elements,
            recommended_cards: phaseData.cards_focus,
            manifestation_focus: phaseData.intention,
            meditation_guide: this.getMoonMeditation(currentPhase)
        };
    }
}
```

### 계절별 특별 스프레드
```javascript
class SeasonalTarotSpreads {
    constructor() {
        this.seasons = {
            spring: {
                korean_name: "봄의 각성",
                element: "wood",
                spread_name: "새싹 스프레드",
                positions: {
                    1: "뿌리 - 당신의 기반",
                    2: "새싹 - 새로운 가능성", 
                    3: "햇살 - 성장 에너지",
                    4: "비 - 필요한 도전",
                    5: "꽃 - 예상되는 결과"
                },
                ritual: "새 씨앗을 화분에 심으며 의도 설정"
            },
            summer: {
                korean_name: "여름의 활력",
                element: "fire", 
                spread_name: "태양 스프레드",
                positions: {
                    1: "중심 - 당신의 핵심 에너지",
                    2: "동쪽 - 새로운 기회",
                    3: "남쪽 - 최고의 잠재력",
                    4: "서쪽 - 배움의 과제",
                    5: "북쪽 - 안정의 기반",
                    6: "정점 - 궁극적 성취"
                },
                ritual: "일출 또는 일몰 시간에 태양을 바라보며 감사"
            },
            autumn: {
                korean_name: "가을의 수확",
                element: "metal",
                spread_name: "추수 스프레드",
                positions: {
                    1: "씨앗 - 처음 의도",
                    2: "성장 - 그동안의 노력",
                    3: "수확 - 현재의 결실",
                    4: "감사 - 배운 교훈",
                    5: "저장 - 미래를 위한 지혜"
                },
                ritual: "수확한 과일이나 곡물을 제물로 감사 표현"
            },
            winter: {
                korean_name: "겨울의 성찰",
                element: "water",
                spread_name: "설경 스프레드", 
                positions: {
                    1: "고요 - 내면의 평화",
                    2: "성찰 - 지난 해의 의미",
                    3: "정화 - 놓아야 할 것",
                    4: "지혜 - 얻은 깨달음",
                    5: "준비 - 새 봄을 위한 준비"
                },
                ritual: "하얀 촛불을 켜고 명상하며 내면 정화"
            }
        };
    }
}
```

## 8. 데이터베이스 설계 (확장)

### 핵심 테이블 구조
```sql
-- 메이저 아르카나 상세 정보
CREATE TABLE major_arcana (
    id INTEGER PRIMARY KEY (0-21),
    name_en TEXT NOT NULL,
    name_ko TEXT NOT NULL,
    korean_folklore TEXT,
    jungian_archetype TEXT,
    hero_journey_stage TEXT,
    element TEXT,
    planet TEXT,
    chakra TEXT,
    upright_meaning TEXT,
    reversed_meaning TEXT,
    meditation_guide TEXT,
    affirmation TEXT,
    symbolism_primary TEXT,
    symbolism_secondary TEXT,
    shadow_aspects TEXT
);

-- 마이너 아르카나 상세 정보  
CREATE TABLE minor_arcana (
    id INTEGER PRIMARY KEY,
    suit TEXT NOT NULL, -- wands, cups, swords, pentacles
    number INTEGER, -- 1-10, 11=page, 12=knight, 13=queen, 14=king
    name_en TEXT,
    name_ko TEXT,
    element TEXT,
    korean_element TEXT,
    numerology_meaning TEXT,
    upright_keywords TEXT,
    reversed_keywords TEXT,
    life_areas TEXT,
    chakra_association TEXT
);

-- 사용자 영적 프로필
CREATE TABLE user_spiritual_profiles (
    user_id TEXT PRIMARY KEY,
    birth_date DATE,
    birth_time TIME,
    birth_location TEXT,
    birth_card INTEGER,
    soul_card INTEGER, 
    personality_card INTEGER,
    dominant_element TEXT,
    zodiac_sign TEXT,
    saju_profile TEXT, -- JSON
    chakra_profile TEXT, -- JSON
    spiritual_practices TEXT, -- JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 리딩 세션 기록
CREATE TABLE reading_sessions (
    id INTEGER PRIMARY KEY,
    user_id TEXT,
    spread_type TEXT,
    question TEXT,
    cards_drawn TEXT, -- JSON array
    positions_data TEXT, -- JSON
    interpretation TEXT,
    reader_notes TEXT,
    cosmic_influences TEXT, -- JSON: moon_phase, planetary_hours, etc.
    synchronicity_notes TEXT,
    manifestation_timeline TEXT,
    follow_up_date DATE,
    reading_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_spiritual_profiles(user_id)
);

-- 동기성 패턴 추적
CREATE TABLE synchronicity_patterns (
    id INTEGER PRIMARY KEY,
    user_id TEXT,
    recurring_cards TEXT, -- JSON array of frequently drawn cards
    pattern_type TEXT, -- 'recurring', 'sequential', 'mirror', etc.
    pattern_description TEXT,
    first_occurrence DATE,
    last_occurrence DATE,
    frequency INTEGER,
    significance_level INTEGER, -- 1-5
    interpretation_notes TEXT,
    manifestation_results TEXT,
    FOREIGN KEY (user_id) REFERENCES user_spiritual_profiles(user_id)
);

-- 개인 카드 관계 매트릭스
CREATE TABLE user_card_relationships (
    id INTEGER PRIMARY KEY,
    user_id TEXT,
    card_id INTEGER, -- references major_arcana.id or minor_arcana.id
    card_type TEXT, -- 'major' or 'minor'
    relationship_type TEXT, -- 'birth', 'soul', 'shadow', 'guide', 'challenge'
    affinity_score INTEGER, -- -5 to +5
    first_encounter DATE,
    total_appearances INTEGER,
    significant_readings TEXT, -- JSON array of reading_session IDs
    personal_interpretation TEXT,
    integration_status TEXT, -- 'resisting', 'learning', 'integrating', 'mastered'
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES user_spiritual_profiles(user_id)
);

-- 의식 및 실천 기록
CREATE TABLE spiritual_practices (
    id INTEGER PRIMARY KEY,
    user_id TEXT,
    practice_type TEXT, -- 'moon_ritual', 'chakra_work', 'shadow_work', etc.
    practice_date DATE,
    cards_used TEXT, -- JSON array
    ritual_setup TEXT,
    intention TEXT,
    experience_notes TEXT,
    insights TEXT,
    energy_level_before INTEGER, -- 1-10
    energy_level_after INTEGER, -- 1-10
    effectiveness_rating INTEGER, -- 1-5
    FOREIGN KEY (user_id) REFERENCES user_spiritual_profiles(user_id)
);

-- 집단 의식 및 공유 체험
CREATE TABLE collective_sessions (
    id INTEGER PRIMARY KEY,
    session_name TEXT,
    session_type TEXT, -- 'group_reading', 'moon_circle', 'meditation'
    facilitator_id TEXT,
    participants TEXT, -- JSON array of user_ids
    collective_intention TEXT,
    group_cards TEXT, -- JSON array
    individual_cards TEXT, -- JSON object with user_id keys
    collective_insights TEXT,
    energy_report TEXT,
    next_session_date DATE,
    session_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 9. UI/UX 신비주의적 디자인

### CSS 변수 시스템
```css
:root {
    /* 신비주의적 컬러 팔레트 */
    --cosmic-deep-purple: #1a0b2e;
    --mystical-indigo: #16213e;  
    --ethereal-blue: #0f3460;
    --celestial-teal: #16537e;
    --lunar-silver: #c7d2e7;
    --starlight-gold: #f4d03f;
    --aurora-green: #00ff88;
    --phoenix-orange: #ff6b35;
    --chakra-violet: #8b5cf6;
    --sacred-white: #f8fafc;

    /* 그라데이션 */
    --cosmic-gradient: linear-gradient(135deg, var(--cosmic-deep-purple) 0%, var(--mystical-indigo) 50%, var(--ethereal-blue) 100%);
    --aurora-gradient: linear-gradient(90deg, var(--aurora-green), var(--celestial-teal), var(--chakra-violet), var(--phoenix-orange));
    --starfield-gradient: radial-gradient(circle at 20% 50%, var(--cosmic-deep-purple) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--mystical-indigo) 0%, transparent 50%);

    /* 애니메이션 */
    --pulse-duration: 2s;
    --float-duration: 3s;
    --shimmer-duration: 1.5s;
}

/* 신성기하학 패턴 배경 */
.sacred-geometry-bg {
    background-image: 
        conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--lunar-silver) 90deg, transparent 180deg),
        repeating-conic-gradient(from 15deg at 60% 70%, transparent 0deg, var(--celestial-teal) 30deg, transparent 60deg);
    animation: rotate 20s linear infinite;
}

/* 오로라 효과 */
.aurora-effect {
    position: relative;
    overflow: hidden;
}

.aurora-effect::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: var(--aurora-gradient);
    opacity: 0.1;
    animation: aurora-flow 8s ease-in-out infinite alternate;
    filter: blur(3px);
}

@keyframes aurora-flow {
    0% { transform: translateX(-20%) translateY(-10%) rotate(0deg); }
    100% { transform: translateX(20%) translateY(10%) rotate(10deg); }
}

/* 카드 홀로그래픽 효과 */
.tarot-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 15px;
    box-shadow: 
        0 8px 32px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tarot-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 
        0 20px 40px rgba(0,0,0,0.4),
        0 0 20px var(--starlight-gold);
}

/* 에너지 흐름 애니메이션 */
.energy-flow {
    position: relative;
}

.energy-flow::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: energy-sweep 3s ease-in-out infinite;
}

@keyframes energy-sweep {
    0% { left: -100%; }
    100% { left: 100%; }
}
```

### JavaScript 애니메이션 시스템
```javascript
class MysticalAnimations {
    constructor() {
        this.particleSystem = new ParticleSystem();
        this.energyField = new EnergyField();
    }

    // 카드 셔플 애니메이션
    async shuffleAnimation(cardElements) {
        const shuffleStages = [
            { transform: 'rotateY(90deg)', opacity: 0.5 },
            { transform: 'rotateY(180deg) scale(0.8)', opacity: 0.3 },
            { transform: 'rotateY(270deg)', opacity: 0.5 },
            { transform: 'rotateY(360deg) scale(1)', opacity: 1 }
        ];

        for (let card of cardElements) {
            card.animate(shuffleStages, {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                delay: Math.random() * 200
            });
        }

        // 에너지 소용돌이 효과
        this.createEnergyVortex();
    }

    // 카드 선택 시 빛의 입자 효과
    cardSelectionEffect(cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 빛의 입자 방출
        for (let i = 0; i < 20; i++) {
            this.createLightParticle(centerX, centerY);
        }

        // 카드 글로우 효과
        cardElement.style.filter = `
            drop-shadow(0 0 20px var(--starlight-gold))
            brightness(1.2)
        `;
    }

    // 차원 포털 열림 애니메이션
    dimensionalPortal(targetElement) {
        const portal = document.createElement('div');
        portal.className = 'dimensional-portal';
        portal.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            background: radial-gradient(circle, var(--chakra-violet) 0%, transparent 70%);
            border-radius: 50%;
            animation: portal-expand 2s ease-out forwards;
        `;

        targetElement.appendChild(portal);

        // 포털을 통한 카드 등장
        setTimeout(() => {
            this.revealThroughPortal(targetElement);
        }, 1000);
    }

    createLightParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'light-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--starlight-gold);
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            animation: particle-float 2s ease-out forwards;
        `;

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 2000);
    }
}

// CSS 애니메이션 정의 추가
const mysticalKeyframes = `
@keyframes portal-expand {
    0% {
        width: 0;
        height: 0;
        opacity: 0;
    }
    50% {
        width: 300px;
        height: 300px;
        opacity: 0.8;
    }
    100% {
        width: 400px;
        height: 400px;
        opacity: 0;
    }
}

@keyframes particle-float {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0);
    }
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;

// 동적 스타일 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = mysticalKeyframes;
document.head.appendChild(styleSheet);
```

## 10. 개인화된 신비 체험 시스템

### AI 기반 동기성 패턴 인식
```javascript
class SynchronicityAI {
    constructor() {
        this.patternRecognition = new PatternRecognition();
        this.consciousnessMapping = new ConsciousnessMapping();
    }

    async analyzeSynchronicities(userReadings) {
        const patterns = {
            recurring_cards: this.findRecurringCards(userReadings),
            numerical_patterns: this.analyzeNumericalPatterns(userReadings),
            elemental_cycles: this.trackElementalCycles(userReadings),
            lunar_correlations: this.findLunarCorrelations(userReadings),
            life_event_synchronicities: this.correlatePsychologicalStates(userReadings)
        };

        return {
            dominant_patterns: patterns,
            consciousness_evolution: this.mapConsciousnessGrowth(patterns),
            future_probabilities: this.calculateProbabilityFields(patterns),
            spiritual_guidance: this.generateSpiritualGuidance(patterns),
            next_phase_preparation: this.recommendNextPhase(patterns)
        };
    }

    findRecurringCards(readings) {
        const cardFrequency = {};
        const cardContexts = {};

        readings.forEach(reading => {
            reading.cards_drawn.forEach(card => {
                cardFrequency[card.id] = (cardFrequency[card.id] || 0) + 1;
                
                if (!cardContexts[card.id]) cardContexts[card.id] = [];
                cardContexts[card.id].push({
                    question: reading.question,
                    date: reading.reading_date,
                    position: card.position,
                    moon_phase: reading.cosmic_influences.moon_phase
                });
            });
        });

        // 통계적으로 유의미한 재발 패턴 식별
        const significantCards = Object.entries(cardFrequency)
            .filter(([cardId, frequency]) => this.isStatisticallySignificant(frequency, readings.length))
            .map(([cardId, frequency]) => ({
                card_id: parseInt(cardId),
                frequency: frequency,
                contexts: cardContexts[cardId],
                synchronicity_score: this.calculateSynchronicityScore(cardContexts[cardId])
            }));

        return significantCards;
    }

    calculateConsciousnessEvolution(userProfile, patterns) {
        const jungianStages = {
            ego_development: { cards: [1, 4, 8], phase: "자아 발달" },
            shadow_integration: { cards: [15, 16, 18], phase: "그림자 통합" },
            anima_animus_work: { cards: [2, 3, 6, 14], phase: "아니마/아니무스 작업" },
            self_realization: { cards: [10, 19, 20, 21], phase: "자기실현" }
        };

        const currentStage = this.identifyCurrentStage(patterns, jungianStages);
        const evolutionTrajectory = this.mapEvolutionPath(userProfile, currentStage);

        return {
            current_stage: currentStage,
            progress_indicators: evolutionTrajectory.indicators,
            next_challenges: evolutionTrajectory.challenges,
            integration_tasks: evolutionTrajectory.tasks,
            timeline_estimation: evolutionTrajectory.timeline
        };
    }
}
```

### 커뮤니티 집단 의식 시스템
```javascript
class CollectiveTarotExperience {
    constructor() {
        this.groupFields = new MorphicFieldResonance();
        this.collectiveUnconscious = new CollectiveUnconsciousInterface();
    }

    async createGroupReading(participants, collectiveIntention) {
        // 각 참여자의 에너지 필드 분석
        const energyMatrix = await this.analyzeGroupEnergyMatrix(participants);
        
        // 집단 의도에 따른 카드 풀 조정
        const sacredCardPool = this.createSacredCardPool(collectiveIntention, energyMatrix);
        
        // 동시 카드 선택 (양자 얽힘 원리 적용)
        const simultaneousSelection = await this.quantumCardSelection(participants, sacredCardPool);
        
        // 집단 해석 생성
        const collectiveInsight = await this.generateCollectiveInterpretation(
            simultaneousSelection, 
            energyMatrix, 
            collectiveIntention
        );

        return {
            group_energy_signature: energyMatrix,
            individual_selections: simultaneousSelection,
            collective_message: collectiveInsight,
            morphic_resonance_level: this.calculateMorphicResonance(participants),
            group_synchronicities: this.identifyGroupSynchronicities(simultaneousSelection),
            healing_recommendations: this.generateGroupHealing(collectiveInsight),
            next_gathering_guidance: this.suggestNextGathering(energyMatrix)
        };
    }

    async facilitateMoonCircle(moonPhase, participants) {
        const lunarEnergy = this.getCurrentLunarInfluence(moonPhase);
        const circleSetup = this.createSacredCircle(participants, lunarEnergy);
        
        // 달 주기에 맞는 집단 스프레드
        const lunarSpread = this.selectLunarSpread(moonPhase);
        
        // 참여자들의 동기화된 명상
        const groupMeditation = await this.facilitateGroupMeditation(lunarEnergy);
        
        // 집단 카드 선택과 공유
        const sharedExperience = await this.createSharedCardExperience(
            participants, 
            lunarSpread, 
            groupMeditation
        );

        return {
            lunar_blessing: lunarEnergy,
            circle_energy: circleSetup,
            shared_vision: sharedExperience,
            individual_revelations: this.extractIndividualInsights(sharedExperience),
            group_healing: this.performGroupHealing(sharedExperience),
            lunar_homework: this.assignLunarTasks(moonPhase, sharedExperience)
        };
    }
}
```

## 11. 실제 구현을 위한 파일 구조

```
tarot-system/
├── database/
│   ├── tarot_mystical.db
│   ├── create_tables.sql
│   ├── insert_major_arcana.py
│   ├── insert_minor_arcana.py
│   └── generate_mystical_data.py
├── api/
│   ├── tarot-api-mystical.js
│   ├── synchronicity-engine.js
│   ├── consciousness-mapper.js
│   └── collective-session-manager.js
├── web/
│   ├── mystical-tarot.html
│   ├── mystical-tarot.css
│   ├── mystical-tarot.js
│   ├── animations/
│   │   ├── particle-system.js
│   │   ├── energy-field.js
│   │   └── mystical-effects.js
│   ├── spreads/
│   │   ├── celtic-cross.js
│   │   ├── lunar-spreads.js
│   │   ├── chakra-spreads.js
│   │   └── seasonal-spreads.js
│   ├── rituals/
│   │   ├── moon-rituals.js
│   │   ├── shamanic-rituals.js
│   │   └── meditation-guides.js
│   └── assets/
│       ├── sounds/
│       ├── images/
│       └── card-designs/
├── integration/
│   ├── numerology-system.js
│   ├── astrology-integration.js
│   ├── saju-integration.js
│   ├── chakra-system.js
│   └── jungian-psychology.js
└── community/
    ├── group-session-manager.js
    ├── morphic-field-resonance.js
    └── collective-consciousness.js
```

이 신비주의적 타로카드 시스템은 기존 RHEIGHT 프로젝트의 견고한 아키텍처를 기반으로, 깊이 있는 영적 체험과 심리학적 통찰을 제공하는 종합적인 플랫폼으로 설계되었습니다. 

단순한 점술 도구를 넘어서, 개인의 영적 성장과 의식 확장을 위한 신성한 포털로서 기능하며, 집단 의식과의 연결을 통해 더 큰 우주적 지혜에 접근할 수 있는 통로를 제공합니다.