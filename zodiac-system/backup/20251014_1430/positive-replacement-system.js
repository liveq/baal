/**
 * 긍정 표현 대체 시스템
 * 금지된 부정 표현을 창의적이고 긍정적인 표현으로 변환
 */

// 문맥별 대체 표현 맵
const POSITIVE_REPLACEMENTS = {
  // 핵심 금지어 대체
  core: {
    "주의하세요": [
      "신중한 선택이 빛을 발합니다",
      "차분한 접근이 도움이 됩니다",
      "여유로운 태도가 좋습니다",
      "한 템포 쉬어가는 지혜를 발휘하세요"
    ],
    "충돌": [
      "다른 관점",
      "차이",
      "개성",
      "각자의 색깔",
      "서로 다른 매력"
    ],
    "걱정": [
      "관심",
      "배려",
      "생각",
      "고민"
    ]
  },

  // 성향 설명을 긍정으로 변환
  traits: {
    "독선적": ["강한 추진력", "확고한 신념", "뚜렷한 주관"],
    "완고함": ["일관된 원칙", "든든한 안정감", "변하지 않는 믿음"],
    "경쟁적": ["열정적인", "도전적인", "활동적인"],
    "불안정": ["유연한", "변화에 열린", "다재다능한"],
    "충동적": ["즉흥적인", "순발력 있는", "행동력 있는"],
    "지배욕": ["리더십", "추진력", "카리스마"],
    "성급함": ["빠른 실행력", "민첩함", "결단력"],
    "까다로움": ["세심함", "완벽 추구", "높은 기준"],
    "피상적": ["사교적", "다양한 관심", "넓은 시야"],
    "질투": ["열정", "집중력", "깊은 관심"],
    "과장": ["풍부한 상상력", "넉넉한 표현력", "풍성한 감각"],
    "권위적": ["강한 책임감", "결단력", "리더십"],
    "예측불가": ["창의적", "독창적", "자유로운"],
    "의존성": ["친밀함", "배려심", "따뜻함"],
    "폐쇄적": ["신중함", "깊이", "내면의 풍부함"],
    "우유부단": ["신중함", "다각도 고려", "균형 감각"]
  },

  // 조화로운 관계 표현
  harmony: {
    pattern1: [
      "{trait1}의 {sign1}과 {trait2}의 {sign2}가 만나 서로를 성장시키는 관계입니다",
      "{trait1}의 {sign1}이 {trait2}의 {sign2}의 매력을 더욱 빛나게 합니다",
      "{sign1}의 {trait1}와 {sign2}의 {trait2}가 서로 조화를 이룹니다",
      "{trait1}을 지닌 {sign1}과 {trait2}를 지닌 {sign2}가 아름다운 균형을 만듭니다"
    ],
    pattern2: [
      "각자의 개성이 관계를 더욱 풍성하게 만들어줍니다",
      "서로 다른 매력이 관계에 깊이를 더합니다",
      "다양한 관점이 삶을 더 풍부하게 만들어줍니다",
      "차이점이 오히려 관계의 특별함이 됩니다"
    ]
  },

  // 조언 문구
  advice: {
    positive: [
      "서로의 장점을 발견하고 응원하며 함께 성장하세요",
      "각자의 색깔을 존중하며 조화로운 관계를 만들어가세요",
      "서로에게 배우며 더 나은 내일을 함께 만들어가세요",
      "차이를 즐기며 새로운 가능성을 함께 열어가세요",
      "소통을 통해 서로를 더 깊이 이해하며 성장하세요",
      "서로의 매력을 인정하며 특별한 관계를 키워가세요",
      "함께 웃고 함께 배우며 행복한 시간을 만들어가세요",
      "서로를 응원하며 꿈을 향해 함께 나아가세요"
    ]
  }
};

// 궁합 평가 표현
const COMPATIBILITY_RATINGS = {
  excellent: {  // 85점 이상
    openings: [
      "환상적인 조합입니다",
      "최고의 궁합으로 빛납니다",
      "서로를 완성시키는 특별한 관계입니다",
      "운명적인 만남이 될 수 있습니다"
    ],
    descriptions: [
      "두 별자리가 만나 마법 같은 시너지를 만들어냅니다",
      "서로의 존재만으로도 힘이 되는 관계입니다",
      "함께하는 모든 순간이 특별해지는 조합입니다"
    ]
  },
  great: {  // 70-84점
    openings: [
      "훌륭한 궁합입니다",
      "서로에게 긍정적인 영향을 주는 관계입니다",
      "함께 성장할 수 있는 좋은 조합입니다",
      "서로를 빛나게 하는 관계입니다"
    ],
    descriptions: [
      "두 별자리가 만나 조화로운 에너지를 만듭니다",
      "서로의 장점을 더욱 돋보이게 하는 관계입니다",
      "함께하면서 새로운 가능성을 발견하는 조합입니다"
    ]
  },
  good: {  // 60-69점
    openings: [
      "좋은 궁합입니다",
      "서로를 이해하며 성장하는 관계입니다",
      "균형잡힌 관계를 만들 수 있습니다",
      "서로에게 배울 점이 많은 조합입니다"
    ],
    descriptions: [
      "각자의 개성이 관계에 풍미를 더합니다",
      "다양한 경험을 함께 나누며 성장합니다",
      "서로 다른 매력이 조화를 이룹니다"
    ]
  },
  moderate: {  // 50-59점
    openings: [
      "흥미로운 조합입니다",
      "서로에게서 새로운 것을 발견하는 관계입니다",
      "다채로운 관계를 만들어갈 수 있습니다",
      "배움이 많은 관계입니다"
    ],
    descriptions: [
      "차이점이 관계를 더욱 특별하게 만듭니다",
      "서로에게서 새로운 관점을 배웁니다",
      "다양성이 관계에 깊이를 더합니다"
    ]
  }
};

// 별자리별 핵심 특성 (긍정 표현)
const ZODIAC_POSITIVE_TRAITS = {
  "양자리": ["열정", "용기", "추진력", "순수함", "도전정신"],
  "황소자리": ["안정감", "따뜻함", "현실감각", "인내심", "신뢰감"],
  "쌍둥이자리": ["유연성", "창의성", "소통능력", "호기심", "재치"],
  "게자리": ["감성", "배려심", "충성심", "포근함", "직관력"],
  "사자자리": ["카리스마", "열정", "관대함", "자신감", "리더십"],
  "처녀자리": ["세심함", "완벽함", "지성", "실용성", "정직함"],
  "천칭자리": ["균형감각", "우아함", "사교성", "조화", "공정함"],
  "전갈자리": ["깊이", "집중력", "통찰력", "열정", "변화력"],
  "사수자리": ["자유로움", "낙천적", "철학적사고", "모험심", "정직함"],
  "염소자리": ["책임감", "목표지향", "성실함", "지혜", "리더십"],
  "물병자리": ["독창성", "자유로움", "인도주의", "창의력", "지성"],
  "물고기자리": ["상상력", "공감능력", "예술성", "부드러움", "직관력"]
};

// 메시지 생성기
class PositiveMessageGenerator {
  constructor() {
    this.replacements = POSITIVE_REPLACEMENTS;
    this.ratings = COMPATIBILITY_RATINGS;
    this.traits = ZODIAC_POSITIVE_TRAITS;
  }

  // 점수에 따른 등급 결정
  getRating(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'great';
    if (score >= 60) return 'good';
    return 'moderate';
  }

  // 랜덤 선택 헬퍼
  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // 새로운 긍정 메시지 생성
  generate(zodiac1, zodiac2, score) {
    const rating = this.getRating(score);
    const ratingData = this.ratings[rating];

    // 오프닝
    const opening = this.random(ratingData.openings);

    // 특성 선택
    const trait1 = this.random(this.traits[zodiac1]);
    const trait2 = this.random(this.traits[zodiac2]);

    // 관계 설명
    const description = this.random(ratingData.descriptions);

    // 조화 표현
    const harmony = `${zodiac1}의 ${trait1}과 ${zodiac2}의 ${trait2}가 아름다운 조화를 이룹니다.`;

    // 차이점을 긍정으로
    const difference = this.random(this.replacements.harmony.pattern2);

    // 조언
    const advice = this.random(this.replacements.advice.positive);

    // 조합
    return `${opening}. ${description} ${harmony} ${difference} ${advice}`;
  }

  // 기존 메시지 변환
  transform(originalMessage, zodiac1, zodiac2, score) {
    let transformed = originalMessage;

    // 금지어 대체
    Object.keys(this.replacements.core).forEach(forbidden => {
      if (transformed.includes(forbidden)) {
        const replacement = this.random(this.replacements.core[forbidden]);
        transformed = transformed.replace(forbidden, replacement);
      }
    });

    // 부정 성향 표현 대체
    Object.keys(this.replacements.traits).forEach(negative => {
      const regex = new RegExp(negative, 'g');
      if (transformed.match(regex)) {
        const positive = this.random(this.replacements.traits[negative]);
        transformed = transformed.replace(regex, positive);
      }
    });

    return transformed;
  }
}

module.exports = { PositiveMessageGenerator, POSITIVE_REPLACEMENTS, COMPATIBILITY_RATINGS, ZODIAC_POSITIVE_TRAITS };
