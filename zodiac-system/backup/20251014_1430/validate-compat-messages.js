/**
 * 별자리 궁합 메시지 Validator
 * 띠별운세 validator.md 기준 적용
 */

const fs = require('fs');

// 금지 단어 사전 (띠별운세 validator.md 기준)
const FORBIDDEN_WORDS = {
  negative: [
    "불행", "재앙", "망하다", "실패", "불운", "흉", "액운", "재수없다",
    "조심하세요", "피하세요", "위험", "주의", "경고", "걱정", "근심",
    "나쁘다", "안 좋다", "어렵다", "힘들다", "고통", "슬프다",
    "문제", "충돌", "다툼", "갈등", "불화", "싸움", "분란",
    "손해", "손실", "실수", "잘못", "후회", "위기", "곤란"
  ],
  gender: [
    "남자답게", "여자답게", "남성적", "여성적",
    "남편감", "아내감", "신랑감", "신부감",
    "여자는", "남자는", "남성은", "여성은",
    "이성에게 인기", "여자 친구", "남자 친구",
    "남성분", "여성분"
  ],
  political: [
    "보수", "진보", "좌파", "우파", "좌익", "우익",
    "정당", "정치인", "대통령", "국회의원"
  ],
  religious: [
    "신의 가호", "부처님", "예수님", "알라", "하느님",
    "기도", "참회", "업보", "천벌", "신앙",
    "절", "교회", "성당", "모스크", "사찰"
  ],
  discriminatory: [
    "명문대", "일류대", "SKY", "학벌",
    "고졸", "중졸", "대졸", "학력",
    "늙다", "노인", "젊다", "젊은이",
    "예쁘다", "잘생기다", "못생기다", "뚱뚱하다", "마르다",
    "출신", "지역", "토박이"
  ]
};

// 긍정 키워드
const POSITIVE_KEYWORDS = [
  "성장", "배움", "기회", "희망", "위로", "평화", "조화", "균형",
  "용기", "지혜", "따뜻", "친절", "창의", "활력", "열정",
  "신뢰", "감사", "기쁨", "평온", "자유", "행운", "사랑",
  "즐거움", "발전", "이해", "존중", "협력", "안정"
];

class ContentValidator {
  constructor() {
    this.forbiddenWords = FORBIDDEN_WORDS;
    this.positiveKeywords = POSITIVE_KEYWORDS;
  }

  // 금지 단어 검사
  scanForbiddenWords(text) {
    const violations = [];

    Object.keys(this.forbiddenWords).forEach(category => {
      this.forbiddenWords[category].forEach(word => {
        if (text.includes(word)) {
          violations.push({
            category: category,
            word: word,
            position: text.indexOf(word)
          });
        }
      });
    });

    return violations;
  }

  // 긍정 톤 점수 계산
  calculatePositiveTone(text) {
    let score = 50; // 기본 점수

    this.positiveKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 3;
      }
    });

    return Math.min(score, 100);
  }

  // 가독성 점수 계산
  checkReadability(text) {
    let score = 100;

    // 문장 길이 체크
    const sentences = text.split(/[.!?]/).filter(s => s.trim());
    sentences.forEach(sentence => {
      if (sentence.length > 50) {
        score -= 5;
      }
    });

    // 어려운 한자어 체크
    const DIFFICULT_WORDS = ["곤란", "난관", "역경", "시련"];
    DIFFICULT_WORDS.forEach(word => {
      if (text.includes(word)) {
        score -= 3;
      }
    });

    return Math.max(score, 0);
  }

  // 전체 검증
  validate(text, meta = {}) {
    const report = {
      timestamp: new Date().toISOString(),
      meta: meta,
      passed: true,
      violations: [],
      scores: {},
      details: {}
    };

    // 1. 금지 표현 검사
    report.violations = this.scanForbiddenWords(text);
    if (report.violations.length > 0) {
      report.passed = false;
    }

    // 2. 긍정 톤 점수
    report.scores.positive = this.calculatePositiveTone(text);
    if (report.scores.positive < 80) {
      report.passed = false;
      report.details.positiveToneIssue = true;
    }

    // 3. 가독성 점수
    report.scores.readability = this.checkReadability(text);
    if (report.scores.readability < 70) {
      report.passed = false;
      report.details.readabilityIssue = true;
    }

    // 4. 종합 점수
    const baseScore = report.violations.length === 0 ? 100 : 0;
    const violationPenalty = report.violations.length * 10;
    const positiveFactor = report.scores.positive / 100;
    const readabilityFactor = report.scores.readability / 100;

    report.scores.total = Math.max(0,
      baseScore - violationPenalty +
      (positiveFactor * 30) +
      (readabilityFactor * 20)
    );

    return report;
  }
}

// 메인 실행
function main() {
  console.log('🔍 별자리 궁합 메시지 검증 시작\n');

  // compatibility-data.json 로드
  const dataPath = '/Volumes/X31/code/baal/zodiac-system/api/compatibility-data.json';
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const validator = new ContentValidator();
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    violations: {},
    reports: []
  };

  // 모든 궁합 메시지 검증
  Object.keys(data).forEach(key => {
    const entry = data[key];
    const message = entry.compat_message;

    if (!message) return;

    results.total++;

    const report = validator.validate(message, {
      key: key,
      zodiac1: entry.zodiac1_name,
      zodiac2: entry.zodiac2_name
    });

    if (report.passed) {
      results.passed++;
    } else {
      results.failed++;
      results.reports.push(report);

      // 위반 카테고리별 집계
      report.violations.forEach(v => {
        if (!results.violations[v.category]) {
          results.violations[v.category] = {};
        }
        if (!results.violations[v.category][v.word]) {
          results.violations[v.category][v.word] = 0;
        }
        results.violations[v.category][v.word]++;
      });
    }
  });

  // 통계 출력
  console.log('📊 검증 통계\n');
  console.log(`총 검증 건수: ${results.total}건`);
  console.log(`✅ 승인: ${results.passed}건 (${(results.passed / results.total * 100).toFixed(1)}%)`);
  console.log(`❌ 반려: ${results.failed}건 (${(results.failed / results.total * 100).toFixed(1)}%)`);
  console.log('');

  // 위반 사항 분석
  console.log('🚫 금지 표현 위반 Top 10\n');

  const allViolations = [];
  Object.keys(results.violations).forEach(category => {
    Object.keys(results.violations[category]).forEach(word => {
      allViolations.push({
        category: category,
        word: word,
        count: results.violations[category][word]
      });
    });
  });

  allViolations.sort((a, b) => b.count - a.count);
  allViolations.slice(0, 10).forEach((v, i) => {
    console.log(`${i + 1}. "${v.word}" (${v.category}) - ${v.count}회`);
  });

  // 상세 보고서 저장
  const reportPath = '/Volumes/X31/code/baal/zodiac-system/backup/20251014_1430/validation-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      passRate: (results.passed / results.total * 100).toFixed(1) + '%'
    },
    violations: allViolations,
    failedReports: results.reports
  }, null, 2));

  console.log(`\n📄 상세 보고서 저장: ${reportPath}`);
}

main();
