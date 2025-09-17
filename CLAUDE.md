# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔴 중요: 서브에이전트 팀 구성 규칙

**🚨 급발진 금지: 사용자가 명시적으로 요청하지 않은 새로운 시스템/기능을 구현하지 말 것**

**모든 코드 수정 작업 시 반드시 다음 규칙을 따를 것:**

1. **코딩 규칙 준수 관리감독 서브에이전트** - 항상 최상단 필수 포함
   - 기존 코드 영향도 분석
   - JavaScript 함수 무결성 보장
   - DOM 구조 및 이벤트 핸들러 보존
   - 다른 서브에이전트 작업 감독

2. 나머지 필요 서브에이전트는 작업에 따라 선택적 구성

## 현재 활성 시스템 상태

### 🟢 완전 구현된 시스템
- **별자리 시스템**: `zodiac-system/` - 12개 별자리 완전 데이터, 5개 운세 카테고리
- **혈액형 시스템**: `blood-type-system/` - 4개 혈액형, sidebar UI 사용 (`blood-type-sidebar.html`)
- **호르몬 밸런스 테스트**: `hormone-test/` - 에겐/테토 성향 4개 유형, 12개 질문 시스템

### 🔴 현재 사용하지 않는 파일들
- `blood-type-system/web/blood-type.html` - 폐기된 구버전 (삭제 가능)
- `blood-type-system/web/blood-type.css` - 폐기된 구버전 (삭제 가능)
- `blood-type-system/web/blood-type.js` - 폐기된 구버전 (삭제 가능)

### 🟡 개발 중인 시스템
- **타로 시스템**: `tarot-system/` - 기본 구조만 존재
- **MBTI/사주/포춘쿠키/에니어그램/손금**: 미구현 상태

## 프로젝트 개요

BAAL은 한국형 심리테스트 포털로, 현재 별자리 운세, 혈액형 테스트, 호르몬 밸런스 테스트 시스템을 포함합니다.
- **별자리 운세 시스템**: 12개 별자리에 대한 일일/주간/월간/연간/궁합 운세 (총 5,238개 데이터)
- **혈액형 시스템**: 4개 혈액형 기반 성격 분석 및 궁합 테스트
- **호르몬 밸런스 테스트**: 에겐/테토 성향 측정으로 4개 유형 분류 (12개 질문)
- 240명 이상의 역사적 인물을 활용한 은유적 표현 사용

## 시스템 아키텍처

### BAAL 팔괘 포털 (메인 허브)
- **메인 인터페이스**: `index.html` - BAAL 브랜드의 팔괘 기반 테스트 포털
- **각 테스트**: 새 탭에서 독립적으로 실행되는 SPA 구조
- **네비게이션**: 팔괘 원형 배치 + 좌측 그리드 배치 이중 구조

### 별자리 시스템 3계층 구조
1. **데이터베이스** (`/zodiac-system/database/`)
   - SQLite DB: `zodiac_fortunes.db`
   - 5개 메인 테이블 (일일 4,380개, 주간 624개, 월간 144개, 연간 12개, 궁합 78개)

2. **API** (`/zodiac-system/api/`)
   - `zodiac-api-real.js`: JSON 데이터 읽기 (메인 사용)
   - 전역 `zodiacAPI` 인스턴스 자동 생성

3. **웹 인터페이스** (`/zodiac-system/web/`)
   - `zodiac.html`: 12개 별자리 네비게이션 UI
   - `zodiac.js`: window 객체에 이벤트 핸들러 등록
   - `zodiac.css`: 다크 테마 반응형 디자인

### 혈액형 시스템 3계층 구조
1. **데이터** (`/blood-type-system/data/`)
   - JSON 파일 기반 데이터 저장
   - 역사적 인물 메타포 데이터 포함

2. **API** (`/blood-type-system/api/`)
   - `blood-api-enhanced.js`: 메인 API (sidebar 시스템용)
   - 전역 `bloodTypeAPI` 인스턴스 생성

3. **웹 인터페이스** (`/blood-type-system/web/`)
   - `blood-type-sidebar.html`: 사이드바 네비게이션 UI (현재 활성)
   - `blood-type-sidebar.js`: SPA 라우팅 및 History API 지원
   - `blood-type-sidebar.css`: Grid 레이아웃 기반 반응형 디자인

### 호르몬 밸런스 테스트 단일 파일 구조
- **올인원 설계**: `hormone-test/` - HTML/CSS/JS 통합 파일 3개만 사용
- **메인 파일**: `index.html` - 모든 UI와 모달 구조 포함
- **스타일링**: `style.css` - 카드형 레이아웃과 그리드 기반 디자인
- **로직**: `script.js` - 12개 질문 시스템, 점수 계산, 결과 생성
- **유형 분류**: 에겐남/테토남/에겐녀/테토녀 (감성vs이성 × 성별)
- **특징**: 모달 기반 UI, 진행률 표시, 결과 공유 기능

## 필수 명령어

### 개발 서버 실행

#### 🚨 중요: 올바른 파일 접근
혈액형 시스템은 **반드시 sidebar 버전을 사용**:
- ✅ 올바른 URL: `http://localhost:8080/blood-type-system/web/blood-type-sidebar.html`
- ❌ 잘못된 URL: `http://localhost:8080/blood-type-system/web/blood-type.html` (폐기됨)

#### 개별 시스템 테스트 (별자리/혈액형만)
```bash
# 별자리 시스템만 테스트
cd C:/code/baal/zodiac-system
python -m http.server 8080
# 접속: http://localhost:8080/web/zodiac.html
# 주의: 사이드바 홈 버튼이 메인 팔괘 페이지로 이동 불가

# 혈액형 시스템만 테스트 (sidebar 버전 사용)
cd C:/code/baal/blood-type-system
python -m http.server 8081
# 접속: http://localhost:8081/web/blood-type-sidebar.html
```

#### 전체 통합 시스템 테스트 (메인 BAAL 포털) - 권장
```bash
cd C:/code/baal
python -m http.server 8080
# 메인 페이지: http://localhost:8080/ (BAAL 팔괘 포털)
# 별자리 페이지: http://localhost:8080/zodiac-system/web/zodiac.html
# 혈액형 페이지: http://localhost:8080/blood-type-system/web/blood-type-sidebar.html
# 호르몬 테스트: http://localhost:8080/hormone-test/
# 참고: 팔괘 포털에서 각 테스트 클릭 시 새 탭에서 열림
```

### JavaScript 구문 검사
```bash
# 별자리 시스템 구문 확인 (Node.js 필요)
node -c "C:\code\baal\zodiac-system\web\zodiac.js"

# 혈액형 시스템 구문 확인 (sidebar 버전)
node -c "C:\code\baal\blood-type-system\web\blood-type-sidebar.js"

# 호르몬 밸런스 테스트 구문 확인
node -c "C:\code\baal\hormone-test\script.js"
```

### 데이터베이스 작업
```bash
cd C:/code/baal/zodiac-system/database

# 운세 데이터 생성
python generate_missing_fortunes.py

# 문법 검사 및 수정
python check_grammar.py
python fix_daily_grammar.py
python fix_all_grammar.py

# JSON 내보내기
python export_to_json.py
```

## 다른 심리 테스트 개발 가이드

### 1. 데이터 설계 패턴
```python
# 역사적 인물/캐릭터 기반 메타포 활용
traits = {
    1: {"name": "타입명", "figures": ["인물1", "인물2"], "traits": ["특징1", "특징2"]},
    # ...
}

# 고유한 메시지 생성
message = f"{random.choice(traits['figures'])}의 {random.choice(traits['traits'])}으로..."
```

### 2. 데이터베이스 구조
```sql
-- 메인 데이터 테이블
CREATE TABLE test_results_data (
    id INTEGER PRIMARY KEY,
    type_id INTEGER,
    date DATE,
    overall TEXT,           -- 전체 메시지
    category1_text TEXT,    -- 카테고리별 텍스트
    category1_score INTEGER,-- 카테고리별 점수
    lucky_item TEXT,        -- 행운 아이템
    advice TEXT,            -- 조언
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 타입 정의 테이블  
CREATE TABLE test_types (
    id INTEGER PRIMARY KEY,
    name_ko TEXT,
    description TEXT,
    traits TEXT
);
```

### 3. 대량 데이터 생성 전략
```python
# 서브에이전트 활용한 병렬 생성
# 1. 카테고리별로 작업 분할
# 2. 각 에이전트가 고유한 데이터 생성
# 3. 중복 검사 및 품질 관리
# 4. 데이터베이스 일괄 삽입

total_records = days × types × variations
# 예: 365일 × 12타입 = 4,380개
```

### 4. 한국어 문법 처리
```python
# 조사 자동 수정 패턴
grammar_fixes = [
    (r'([가-힣])으로\s', lambda m: m.group(1) + ('으로' if has_jongsung(m.group(1)) else '로') + ' '),
    (r'의의\s', '의 '),
    (r'를를\s', '를 '),
    # ...
]

# 올바른 표현 유지
preserve = ['하세요', '되세요', '사랑으로']
```

### 5. API 설계 패턴
```javascript
class TestAPI {
    constructor() {
        this.testData = null;
        this.loadTestData();
        
        // 타입 정의
        this.testTypes = [
            { id: 1, name: '타입1', symbol: '🔥' },
            // ...
        ];
    }
    
    async getTestResult(typeId, date) {
        // 데이터 조회 로직
        // 폴백 처리
        // 날짜 매칭
    }
}

// 전역 인스턴스 생성
const testAPI = new TestAPI();
```

### 6. UI 컴포넌트 재사용
```javascript
// window 객체에 함수 등록 (HTML onclick 접근용)
window.selectType = async function(typeId) {
    // 타입 선택 처리
}

// 탭 전환 시스템
window.showTab = function(tabName) {
    // 일간/주간/월간 등 탭 전환
}

// 토스트 메시지
window.showToastMessage = function(message) {
    // 사용자 피드백
}
```

## 중요 구현 세부사항

### JavaScript 함수 등록 (필수)
- 모든 이벤트 핸들러는 `window` 객체에 등록 필수
- `window.functionName = function() {}` 형식 사용
- HTML onclick 이벤트가 전역 스코프에서 함수를 찾기 때문

### SPA 라우팅 (혈액형 시스템)
- **History API 사용**: `#/blood-type/A/female` 형태의 해시 라우팅
- **브라우저 뒤로가기 지원**: `window.onhashchange` 이벤트 처리
- **URL 동기화**: `pushState` vs `replaceState` 적절한 사용
- **상태 관리**: `currentBloodType`, `currentGender` 전역 변수

### 스크립트 로딩 순서
```html
<!-- 별자리 시스템 -->
<script src="../api/zodiac-api-real.js"></script>  <!-- API 먼저 -->
<script src="zodiac.js"></script>                   <!-- 메인 로직 -->
<script src="functions-fix.js"></script>            <!-- 패치/백업 -->
<script src="init.js"></script>                      <!-- 초기화 검증 -->

<!-- 혈액형 시스템 (sidebar) -->
<script src="../api/blood-api-enhanced.js"></script> <!-- API 먼저 -->
<script src="blood-type-sidebar.js"></script>        <!-- 메인 로직 -->
```

### JavaScript 백틱 문자열 주의사항
- description 필드 등 긴 텍스트는 백틱(`) 올바르게 닫기
- 템플릿 리터럴 내부 특수문자 이스케이프 처리
- 구문 오류 시 `zodiacDescriptions` 데이터가 로드되지 않음

### 한국어 처리
- UTF-8 인코딩 필수
- cp949 에러 시: `encoding='utf-8'` 파라미터 추가
- 이모지 대신 텍스트 기호 사용: [O], [X], [!]

### 혈액형 시스템 특수 기능
- **성별별 데이터**: 동일 혈액형도 남성/여성 버전 분리
- **컬러 매핑**: 한국어 색상명을 CSS 색상 코드로 자동 변환
- **행운의 색상 표시**: 바이오리듬 탭에서 실제 색상 원형 표시 (흰색 테두리, 검정 텍스트)
- **Grid 레이아웃**: 스크롤 최소화를 위한 공간 효율적 배치
- **복잡한 혈액형/성별 선택 로직**:
  - 최초 혈액형 선택 → 남성 + 기본성향 탭
  - 같은 혈액형 내 성별 변경 → 해당 성별 + 기본성향 탭
  - 다른 혈액형 선택 → 남성 리셋 + 기본성향 탭
  - 성별 버튼 직접 클릭 → 해당 성별 + 기본성향 탭

### 호르몬 밸런스 테스트 특수 기능
- **모달 기반 UI**: 성별 선택 → 테스트 진행 → 결과 표시의 3단계 모달
- **진행률 표시**: 12개 질문에 대한 실시간 진행률 바
- **점수 계산 시스템**: 각 답변마다 에겐/테토 점수 부여, 성별과 조합하여 4개 유형 분류
- **카드형 결과 레이아웃**: 좌측 상단 제목 + 특징→궁합→일화 순서의 카드 배치
- **반응형 그리드**: 특징은 2열, 궁합과 일화는 좌우 배치로 공간 효율성 극대화
- **Vanilla JavaScript**: 외부 의존성 없는 순수 JavaScript 구현
- **아바타 시스템**: Dicebear API를 활용한 유형별 고유 아바타

### 데이터 구조
```javascript
{
    overall: "전체 메시지 (역사적 인물 메타포 포함)",
    scores: { category1: 85, category2: 75 },
    details: { category1: "상세 텍스트" },
    lucky: { item: "행운 아이템", color: "색상" },
    advice: "조언 메시지"
}
```

### CORS 회피
- 로컬 HTTP 서버 필수 (file:// 프로토콜 사용 불가)
- `python -m http.server 8080` 사용

## 품질 관리 체크리스트

- [ ] 모든 데이터 고유성 확인
- [ ] 한국어 문법 전수 검사
- [ ] 5가지 이상 카테고리 테스트
- [ ] 브라우저 콘솔 에러 확인
- [ ] 모바일 반응형 테스트
- [ ] JSON 내보내기 검증
- [ ] 로드 시간 최적화 (5MB 이하)

## 디버깅 및 문제 해결

### 별자리 시스템 디버깅
- **모달창이 표시되지 않을 때**:
  1. 브라우저 콘솔에서 에러 확인
  2. `window.zodiacDescriptions` 데이터 로드 여부 확인
  3. JavaScript 구문 오류 체크: `node -c zodiac.js`
  4. functions-fix.js의 백업 함수 실행 여부 확인

### 혈액형 시스템 디버깅
- **페이지가 로드되지 않을 때**: sidebar 파일 사용 확인 (`blood-type-sidebar.html`)
- **성별 버튼이 작동하지 않을 때**: `selectBloodTypeAndGender` 함수 event 객체 처리 확인
- **브라우저 뒤로가기가 작동하지 않을 때**: History API `pushState` vs `replaceState` 사용 확인
- **탭 전환 에러**: `showTab` 함수의 `event.target` 안전성 처리 확인

### 호르몬 밸런스 테스트 디버깅
- **모달이 표시되지 않을 때**: CSS 클래스 `active` 추가/제거 상태 확인
- **테스트 진행이 안될 때**: `current_question` 변수와 `test_questions` 배열 상태 확인
- **결과 계산 오류**: `calculateResult()` 함수의 점수 합계 로직 검증
- **카드 레이아웃 깨짐**: CSS Grid 속성과 `detail-content-grid-enhanced` 클래스 확인
- **아바타 로드 실패**: Dicebear API 연결 상태와 유형별 시드값 확인

### 공통 디버깅
- **함수를 찾을 수 없다는 오류**:
  1. window 객체에 함수 등록 확인
  2. DOMContentLoaded 이벤트 전에 함수 정의
  3. API 스크립트 로딩 완료 후 메인 스크립트 실행 확인

## 확장 가능한 구조

이 시스템은 다음과 같은 심리 테스트로 확장 가능:
- **호르몬 밸런스 테스트**: 완료됨 ✅ (에겐/테토 4개 유형)
- MBTI 기반 일일 가이드 (16타입 × 365일)
- 탄생화 운세 (365개 꽃 × 카테고리)
- 혈액형 조합 궁합 (4타입 × 4타입 × 상황별)
- 색채 심리 테스트 (색상별 × 일일 메시지)
- 동물 캐릭터 테스트 (12간지 or 정신동물)

### 새로운 테스트 시스템 개발 시 참고할 패턴
1. **단순형** (호르몬 테스트 방식): 단일 HTML/CSS/JS 파일, 모달 기반 UI
2. **복합형** (별자리/혈액형 방식): 3계층 구조 (데이터-API-웹), SPA 라우팅
3. **데이터 중심**: SQLite DB + 대량 데이터 생성 + JSON 내보내기
4. **인터랙션 중심**: 질문 기반 테스트 + 점수 계산 + 결과 분류

## 백업 정책
- 위치: `C:/code/backup/`
- 명명 형식: `YYMMDDHHMM_baal_backup` (예: `2509160419_baal_backup`)
- 제외 항목: `node_modules`, `.git`
- 용도: 다중 장치 개발을 위한 버전 관리 및 복구 지점

## 포터블 개발 환경 설정

**중요: 이 프로젝트는 외장 하드 드라이브를 사용하여 여러 장치(Windows 노트북, Windows 데스크탑, MacBook)에서 개발됩니다. 장치 전환 시 다음 단계를 따르세요.**

### 초기 설정 체크리스트 (새 장치에서 실행)

1. **드라이브 문자 확인** (Windows만 해당)
   - 외장 드라이브가 D:\, F:\ 등으로 마운트될 수 있음
   - 모든 코드에서 상대 경로 사용

2. **필수 프로그램 설치**
   ```bash
   # 버전 확인
   node --version  # 14+ 필요
   npm --version   # 6+ 필요
   git --version   # 2.0+ 필요
   python --version # 3.6+ 필요 (로컬 서버용)
   ```

3. **의존성 설정**
   ```bash
   cd baal
   # Node.js 프로젝트인 경우 (현재는 아니지만 향후 필요시)
   # npm install
   ```

4. **환경 변수** (필요 시)
   ```bash
   # .env 파일이 필요한 경우
   # cp .env.example .env
   # .env 파일 편집
   ```

5. **Git 구성** (필요 시)
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### 크로스 플랫폼 고려사항
- **줄 끝**: 프로젝트는 LF (Unix 스타일) 사용. Git이 자동 변환
- **경로 구분자**: 코드에서 슬래시(/) 사용, 모든 플랫폼에서 작동
- **스크립트**: .bat (Windows) 및 .sh (Mac/Linux) 버전 제공
- **대소문자 구분**: Mac은 대소문자 구분 안함, Windows는 구분함. 파일명 일관성 유지
- **Python 서버**: 모든 플랫폼에서 `python -m http.server 8080` 사용

### 장치 전환 후 빠른 시작
```bash
# Windows
cd /d [DRIVE_LETTER]:\code\baal
python -m http.server 8080
# 접속: http://localhost:8080/

# Mac
cd /Volumes/[DRIVE_NAME]/code/baal
python3 -m http.server 8080
# 접속: http://localhost:8080/
```

### 장치 전환 문제 해결
- **포트 이미 사용 중**: 다른 포트 사용 `python -m http.server 8081`
- **Mac에서 권한 오류**: `sudo` 사용 (필요 시)
- **파일을 찾을 수 없음**: 드라이브 경로 및 마운트 상태 확인
- **다른 Python 버전**: Windows는 `python`, Mac은 `python3` 사용

### 삭제하면 안 되는 중요 파일
- `CLAUDE.md` - 이 가이드 파일
- `backup/` 폴더 - 타임스탬프 백업 포함
- 모든 `*-system/` 폴더 - 핵심 기능 시스템
- `index.html` - 메인 BAAL 포털 페이지