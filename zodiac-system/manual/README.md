# 별자리 운세 시스템 - 메뉴얼 문서 모음

## 📚 문서 목록

### 1. [운세데이터_작성완료_보고서.md](./운세데이터_작성완료_보고서.md)
**2025년 데이터 작성 완료 현황 및 통계**

- 일간/주간/월간/연간 운세 작성 완료 현황
- 총 5,238개 데이터 생성 통계
- 데이터 구조 상세 설명
- 품질 특징 및 검증 사항
- 다음 연도 준비 가이드

**대상**: 프로젝트 관리자, 데이터 검증 담당자

---

### 2. [운세데이터_작성_메뉴얼.md](./운세데이터_작성_메뉴얼.md)
**신규 연도 운세 데이터 생성 실무 가이드**

#### 주요 내용:
- **사전 준비**: 작업 환경 설정, 백업 절차
- **일간 운세 생성**: 365일 데이터 생성 방법
- **주간/월간/연간 운세 생성**: 기간별 데이터 생성
- **데이터 검증**: 완전성, 유효성 체크
- **문장 작성 가이드**: 스타일, 금지어, 표현법
- **트러블슈팅**: 일반적인 문제 해결

#### 사용 예시:
```bash
# 2026년 일간 운세 생성
python3 generate_ai_fortunes.py 2026-01-01 365

# 2026년 주간/월간/연간 운세 생성
python3 generate_period_fortunes.py 2026
```

**대상**: 데이터 생성 담당자, 신규 연도 준비 작업자

---

### 3. [궁합데이터_작성_가이드.md](./궁합데이터_작성_가이드.md)
**별자리 간 궁합 데이터 작성 및 관리 가이드**

#### 주요 내용:
- **궁합 시스템 개요**: 78쌍 조합 규칙
- **데이터 구조**: 점수 체계, 필드 설명
- **점수 산정 기준**: 원소 상성, 관계별 점수
- **메시지 작성**: advice 필드 작성 규칙
- **검증 방법**: 완전성, 점수 범위 검증
- **자동 생성 스크립트**: Python 예제 코드

#### 핵심 규칙:
- 총 78쌍 (12개 별자리 × 13 / 2)
- 점수 범위: 60~95
- 원소 기반 상성 평가
- 애정/우정/업무 3가지 영역

**대상**: 궁합 데이터 담당자, 콘텐츠 작성자

---

## 🎯 빠른 시작 가이드

### 신규 연도 데이터 생성 (2026년 예시)

#### Step 1: 작업 디렉토리 이동
```bash
cd /Volumes/X31/code/baal/zodiac-system
```

#### Step 2: 기존 데이터 백업
```bash
cp api/fortune-data.json api/fortune-data-backup-$(date +%Y%m%d).json
```

#### Step 3: 일간 운세 생성 (365일)
```bash
python3 generate_ai_fortunes.py 2026-01-01 365
```

#### Step 4: 주간/월간/연간 운세 생성
```bash
python3 generate_period_fortunes.py 2026
```

#### Step 5: 데이터 검증
```bash
python3 -c "
import json
with open('api/fortune-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

year = '2026'
print(f'일간: {len([k for k in data.get(\"daily\", {}).keys() if k.startswith(year)])}일')
print(f'주간: {len([k for k in data.get(\"weekly\", {}).keys() if k.startswith(year)])}주')
print(f'월간: {len([k for k in data.get(\"monthly\", {}).keys() if k.startswith(year)])}개월')
print(f'연간: {len([k for k in data.get(\"yearly\", {}).keys() if k == year])}년')
"
```

예상 결과:
```
일간: 365일
주간: 52주
월간: 12개월
연간: 1년
```

---

## 📊 데이터 구조 요약

### 일간 운세 (Daily)
```json
{
  "overall": "전체운 (1-2문장)",
  "fortunes": {
    "love": "애정운 (2-3문장)",
    "money": "금전운 (2-3문장)",
    "work": "직장운 (2-3문장)",
    "health": "건강운 (2-3문장)"
  },
  "scores": { "overall": 80, "love": 75, "money": 70, "work": 85, "health": 78 },
  "lucky": { "color": "파랑", "number": 7, "time": "오전 10-12시" },
  "advice": "한줄 조언",
  "source": "ai_creative"
}
```

### 주간 운세 (Weekly)
```json
{
  "weekStart": "2026-01-05",
  "weekEnd": "2026-01-11",
  "theme": "도전의 주간",
  "overall": "주간 전체운 (2-3문장)",
  "fortunes": { "love": "...", "money": "...", "work": "...", "health": "..." },
  "keyDays": "화요일"
}
```

### 월간 운세 (Monthly)
```json
{
  "theme": "리더십의 달",
  "overall": "월간 전체운 (2-3문장)",
  "fortunes": { "love": "...", "money": "...", "work": "...", "health": "..." },
  "keyDates": "1일, 11일, 21일"
}
```

### 연간 운세 (Yearly)
```json
{
  "year": 2026,
  "theme": "시작과 성장의 해",
  "overall": "연간 전체운 (3-4문장)",
  "fortunes": { "love": "...", "money": "...", "work": "...", "health": "..." },
  "bestMonths": ["3월", "7월", "11월"],
  "challengingMonths": ["2월", "8월"],
  "keyAdvice": "핵심 조언"
}
```

### 궁합 (Compatibility)
```json
{
  "totalScore": 83,
  "scores": { "love": 82, "friendship": 86, "work": 70 },
  "advice": "양자리와 황소자리는 함께 성장하는 관계입니다.",
  "message": ""
}
```

---

## 🔧 주요 스크립트

| 스크립트 | 기능 | 사용법 |
|----------|------|--------|
| `generate_ai_fortunes.py` | 일간 운세 생성 | `python3 generate_ai_fortunes.py [시작날짜] [일수]` |
| `generate_period_fortunes.py` | 주간/월간/연간 생성 | `python3 generate_period_fortunes.py [연도]` |
| `zodiac-api-final.js` | 운세 API 서버 | `node api/zodiac-api-final.js` |

---

## 📈 데이터 통계 (2025년 기준)

| 유형 | 개수 | 총 데이터량 |
|------|------|-------------|
| 일간 운세 | 365일 × 12 | 4,380개 |
| 주간 운세 | 52주 × 12 | 624개 |
| 월간 운세 | 12개월 × 12 | 144개 |
| 연간 운세 | 1년 × 12 | 12개 |
| 궁합 | 78쌍 | 78개 |
| **합계** | - | **5,238개** |

---

## ✅ 작업 체크리스트

### 신규 연도 데이터 생성 시

- [ ] 작업 디렉토리 이동
- [ ] 기존 데이터 백업 완료
- [ ] 일간 운세 365일 생성 완료
- [ ] 주간 운세 52주 생성 완료
- [ ] 월간 운세 12개월 생성 완료
- [ ] 연간 운세 1년 생성 완료
- [ ] 데이터 개수 검증 완료
- [ ] JSON 유효성 검증 완료
- [ ] 샘플 데이터 확인 완료
- [ ] API 테스트 완료
- [ ] 프론트엔드 동작 확인 완료

---

## 🚨 주의사항

### 금지 표현
- **명령형**: "~하세요", "~하십시오"
- **격식체**: "~합니다", "~입니다"
- **극단적 표현**: "절대", "반드시", "100%"
- **부정적 표현**: "실패할 거예요", "안 좋아요"

### 권장 표현
- **종결어미**: "~예요", "~어요", "~죠"
- **긍정적 표현**: "좋아져요", "도움이 돼요", "발전해요"
- **구체적 조언**: 실천 가능한 현실적인 내용

---

## 📞 문의 및 지원

### 문서 관련 문의
- 작성일: 2025년 10월 16일
- 버전: 1.0
- 관리자: 프로젝트 담당자

### 관련 파일
- 데이터 파일: `api/fortune-data.json`
- API 서버: `api/zodiac-api-final.js`
- 프론트엔드: `zodiac.html`, `zodiac.js`, `zodiac.css`

### 백업 정책
- 신규 연도 생성 전 필수 백업
- 주기적 백업 권장 (매월 초)
- Git을 통한 버전 관리

---

## 📁 디렉토리 구조

```
zodiac-system/
├── api/
│   ├── fortune-data.json          # 메인 데이터 파일
│   ├── zodiac-api-final.js        # API 서버
│   └── ...
├── manual/                         # 📚 이 디렉토리
│   ├── README.md                   # 메뉴얼 인덱스 (현재 문서)
│   ├── 운세데이터_작성완료_보고서.md
│   ├── 운세데이터_작성_메뉴얼.md
│   └── 궁합데이터_작성_가이드.md
├── generate_ai_fortunes.py        # 일간 운세 생성
├── generate_period_fortunes.py    # 주간/월간/연간 생성
├── zodiac.html                     # 프론트엔드 HTML
├── zodiac.js                       # 프론트엔드 JS
└── zodiac.css                      # 프론트엔드 CSS
```

---

## 🔄 업데이트 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2025-10-16 | 1.0 | 초기 메뉴얼 작성 완료 |
|  |  | - 2025년 데이터 작성 완료 보고서 |
|  |  | - 운세 데이터 작성 메뉴얼 |
|  |  | - 궁합 데이터 작성 가이드 |

---

**이 문서는 별자리 운세 시스템의 데이터 생성 및 관리를 위한 종합 가이드입니다.**
