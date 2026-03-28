# #7 JSON 포맷터

**URL:** json.baal.co.kr

## 서비스 내용

JSON 포맷팅, 검증, 압축, 트리뷰. 에러 위치 표시 및 자동 수정

## 기능 요구사항

- [ ] JSON 포맷팅 (들여쓰기 2칸, 4칸 선택)
- [ ] JSON 압축 (minify)
- [ ] JSON 검증 (validation)
- [ ] 에러 메시지 표시 (한글)
- [ ] 에러 위치 하이라이트
- [ ] 트리뷰 (접기/펼치기)
- [ ] 복사 버튼
- [ ] 다운로드 (.json 파일)
- [ ] URL 인코딩/디코딩
- [ ] Base64 인코딩/디코딩
- [ ] JSON → CSV 변환 (선택사항)

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **JSONLint** - 가장 오래되고 인기 있는 JSON 검증 도구
   - 강점: 간단한 UI, 빠른 검증, 무료
   - 약점: UI가 구식, 트리뷰 없음, 광고 많음

2. **JSON Editor Online** - 온라인 JSON 에디터
   - 강점: 트리뷰 우수, 검색 기능, 편집 기능
   - 약점: 무료 버전은 기능 제한

3. **JSONFormatter.org** - JSON 포맷팅 전문
   - 강점: 깔끔한 UI, 색상 하이라이트, 빠름
   - 약점: 트리뷰 없음, 고급 기능 부족

4. **JSON Formatter & Validator (Chrome Extension)** - 브라우저 확장
   - 강점: 브라우저 통합, 자동 포맷팅
   - 약점: 확장 프로그램 설치 필요

5. **Code Beautify** - 통합 도구
   - 강점: 다양한 도구 제공 (JSON, XML, SQL 등)
   - 약점: 광고 많음, UI 복잡

### 우리의 차별화 전략

- ✅ **3가지 모드** - 포맷팅/압축/트리뷰
- ✅ **에러 자동 수정** - 쉼표 누락, 따옴표 오류 자동 감지
- ✅ **한글 에러 메시지** - 친절한 설명
- ✅ **실시간 검증** - 입력 시 즉시 검증
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **완전 무료** - 제한 없음

## 주요 라이브러리

### 옵션 1: 순수 JavaScript (기본 권장)

브라우저 내장 JSON API 사용

```javascript
// 포맷팅
function formatJSON(input, indent = 2) {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch (e) {
    throw new Error(`JSON 파싱 오류: ${e.message}`);
  }
}

// 압축 (minify)
function minifyJSON(input) {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (e) {
    throw new Error(`JSON 파싱 오류: ${e.message}`);
  }
}

// 검증
function validateJSON(input) {
  try {
    JSON.parse(input);
    return { valid: true, message: '유효한 JSON입니다' };
  } catch (e) {
    return {
      valid: false,
      message: translateError(e.message),
      position: extractErrorPosition(e.message)
    };
  }
}

// 에러 메시지 한글 번역
function translateError(errorMsg) {
  const translations = {
    'Unexpected token': '예상치 못한 문자',
    'Unexpected end of JSON input': 'JSON이 완전하지 않습니다',
    'Expected property name': '속성 이름이 필요합니다',
    'Duplicate key': '중복된 키',
    // ... 더 많은 번역
  };

  for (const [eng, kor] of Object.entries(translations)) {
    if (errorMsg.includes(eng)) {
      return errorMsg.replace(eng, kor);
    }
  }
  return errorMsg;
}

// 에러 위치 추출
function extractErrorPosition(errorMsg) {
  // "position 42" 형식에서 숫자 추출
  const match = errorMsg.match(/position (\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}
```

**특징:**
- ✅ 빠름 (즉시)
- ✅ 라이브러리 불필요
- ✅ 가벼움
- ✅ 모든 브라우저 지원
- ⚠️ 트리뷰는 별도 구현 필요

### 옵션 2: json-formatter-js (트리뷰용)

```html
<script src="https://cdn.jsdelivr.net/npm/json-formatter-js@2.3.4/dist/json-formatter.umd.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/json-formatter-js@2.3.4/dist/json-formatter.css">
```

```javascript
import JSONFormatter from 'json-formatter-js';

const data = JSON.parse(input);
const formatter = new JSONFormatter(data,
  2, // open 2 levels by default
  {
    hoverPreviewEnabled: true,
    hoverPreviewArrayCount: 10,
    hoverPreviewFieldCount: 5,
    theme: 'dark' // 'dark' or 'light'
  }
);

document.getElementById('tree-view').appendChild(formatter.render());
```

**특징:**
- ✅ 트리뷰 우수
- ✅ 접기/펼치기
- ✅ 검색 기능
- ✅ 다크모드 지원
- ⚠️ 라이브러리 필요 (30KB)

### 옵션 3: jsoneditor (고급 에디터)

```html
<script src="https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsoneditor@9.10.0/dist/jsoneditor.min.css">
```

```javascript
import JSONEditor from 'jsoneditor';

const editor = new JSONEditor(container, {
  mode: 'tree', // 'tree', 'view', 'form', 'code', 'text'
  modes: ['tree', 'code'],
  onError: function (err) {
    showToast(err.toString(), 'error');
  }
});

editor.set(JSON.parse(input));
```

**특징:**
- ✅ 최고 기능
- ✅ 편집 가능
- ✅ 검색, 정렬, 필터
- ⚠️ 무거움 (200KB+)
- ⚠️ 단순 포맷팅엔 과함

**권장 조합:**
- 기본 모드: 순수 JS (포맷팅, 검증, 압축)
- 트리뷰 모드: json-formatter-js (선택적)

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────────────┐
│  JSON 포맷터 & 검증기                    │
│  JSON 포맷팅, 검증, 압축, 트리뷰         │
├─────────────────────────────────────────┤
│  [포맷팅] [압축] [트리뷰] [검증]         │
│  들여쓰기: [2칸] [4칸]                   │
├─────────────────────────────────────────┤
│  ┌─ 입력 ──────────┬─ 출력 ──────────┐  │
│  │ {               │ {               │  │
│  │   "name":"John",│   "name": "John",│  │
│  │   "age":30      │   "age": 30     │  │
│  │ }               │ }               │  │
│  │                 │                 │  │
│  │ 1 line          │ 4 lines         │  │
│  │ 31 chars        │ 49 chars        │  │
│  └─────────────────┴─────────────────┘  │
│  [복사] [다운로드 JSON] [지우기]         │
├─────────────────────────────────────────┤
│  ✅ 유효한 JSON입니다                    │
│  (또는 에러 메시지)                      │
└─────────────────────────────────────────┘
```

### 에러 표시 예시

```
입력:
{
  "name": "John",
  "age": 30
  "city": "Seoul"  ← 쉼표 누락!
}

에러 메시지:
❌ JSON 파싱 오류 (4번째 줄)
예상치 못한 문자 '"'
이전 줄 끝에 쉼표(,)가 필요합니다.

수정 제안:
"age": 30,
```

### 주요 기능 순서

1. JSON 입력 (붙여넣기 또는 타이핑)
2. 실시간 검증 (입력 시 즉시)
3. 모드 선택 (포맷팅/압축/트리뷰)
4. 들여쓰기 선택 (2칸/4칸)
5. 결과 확인 (에러 또는 성공)
6. 복사 또는 다운로드

## 난이도 & 예상 기간

- **난이도:** 쉬움 (JSON.parse/stringify 기본)
- **예상 기간:** 1일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] 오전: UI 구성, 입력/출력 영역, 4가지 모드 버튼
- [ ] 오후 1: 포맷팅, 압축, 검증 기능 (순수 JS)
- [ ] 오후 2: 에러 메시지 한글 번역, 위치 표시
- [ ] 오후 3: 트리뷰 추가 (json-formatter-js), 복사/다운로드

## 트래픽 예상

⭐⭐⭐ 높음 - "JSON 포맷터, JSON 검증" 검색량 매우 높음 (개발자 필수 도구)

## SEO 키워드

- JSON 포맷터
- JSON 검증기
- JSON validator
- JSON 압축
- JSON minify
- JSON beautify
- 무료 JSON 도구

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & 실무 이슈 기반)

1. **대용량 JSON 처리 시 브라우저 느려짐**
   - 원인: 5MB 이상 JSON을 한 번에 포맷팅
   - 해결: 파일 크기 제한 (5MB)
   - 해결: 대용량 경고 메시지
   - 코드:
     ```javascript
     const MAX_SIZE = 5 * 1024 * 1024; // 5MB

     function validateSize(input) {
       const size = new Blob([input]).size;
       if (size > MAX_SIZE) {
         showToast(`JSON이 너무 큽니다. (최대 5MB, 현재 ${(size / 1024 / 1024).toFixed(2)}MB)`, 'error');
         return false;
       }
       return true;
     }
     ```

2. **에러 메시지가 영어로만 표시됨 (비개발자 이해 어려움)**
   - 원인: JSON.parse() 에러 메시지가 영어
   - 해결: 에러 메시지 한글 번역 맵
   - 코드:
     ```javascript
     const ERROR_TRANSLATIONS = {
       'Unexpected token': '예상치 못한 문자',
       'Unexpected end of JSON input': 'JSON이 완전하지 않습니다 (중괄호나 대괄호가 닫히지 않았을 수 있습니다)',
       'Expected property name or': '속성 이름이 필요합니다',
       'Unexpected string': '문자열 위치 오류',
       'Duplicate key': '중복된 키가 있습니다',
       'Unterminated string': '문자열이 닫히지 않았습니다 (따옴표 누락)',
       'Bad control character in string': '문자열에 잘못된 제어 문자가 있습니다'
     };

     function translateError(errorMsg) {
       for (const [eng, kor] of Object.entries(ERROR_TRANSLATIONS)) {
         if (errorMsg.includes(eng)) {
           return errorMsg.replace(eng, kor);
         }
       }
       return errorMsg;
     }
     ```

3. **에러 위치를 알려주지 않아서 찾기 어려움**
   - 원인: 에러 메시지만 표시
   - 해결: 에러 위치 하이라이트
   - 코드:
     ```javascript
     function highlightError(textarea, errorPosition) {
       if (!errorPosition) return;

       // 에러 위치로 커서 이동
       textarea.focus();
       textarea.setSelectionRange(errorPosition, errorPosition + 1);

       // 스크롤 이동
       textarea.scrollTop = textarea.scrollHeight * (errorPosition / textarea.value.length);

       // 에러 줄 번호 계산
       const textBefore = textarea.value.substring(0, errorPosition);
       const lineNumber = textBefore.split('\n').length;

       showToast(`${lineNumber}번째 줄에 에러가 있습니다`, 'error');
     }
     ```

4. **쉼표 누락 같은 흔한 에러 자동 수정 안 됨**
   - 원인: JSON.parse()는 엄격함
   - 해결: 자동 수정 제안 (선택사항)
   - 코드:
     ```javascript
     function autoFixCommonErrors(input) {
       let fixed = input;

       // 후행 쉼표 제거 (trailing comma)
       fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

       // 작은따옴표 → 큰따옴표
       fixed = fixed.replace(/'/g, '"');

       // 키 따옴표 추가 (속성 이름)
       fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

       return fixed;
     }

     // 사용
     try {
       JSON.parse(input);
     } catch (e) {
       const fixed = autoFixCommonErrors(input);
       try {
         JSON.parse(fixed);
         showToast('자동 수정이 가능합니다. [수정하기] 버튼을 클릭하세요.', 'warning');
         return fixed;
       } catch {
         // 자동 수정 실패
       }
     }
     ```

5. **트리뷰에서 대용량 JSON 렌더링 시 브라우저 멈춤**
   - 원인: DOM 요소 수천 개 생성
   - 해결: 가상 스크롤링 (선택사항)
   - 해결: 기본 열림 레벨 제한 (1-2 레벨)
   - 코드:
     ```javascript
     const formatter = new JSONFormatter(data,
       1, // open only 1 level by default (0 = all closed, Infinity = all open)
       {
         hoverPreviewEnabled: true
       }
     );
     ```

6. **JSON 복사 시 포맷팅 깨짐**
   - 원인: 클립보드에 HTML 복사
   - 해결: 텍스트로만 복사
   - 코드:
     ```javascript
     async function copyJSON(jsonString) {
       try {
         await navigator.clipboard.writeText(jsonString);
         showToast('복사되었습니다', 'success');
       } catch (err) {
         // 폴백: execCommand 사용
         const textarea = document.createElement('textarea');
         textarea.value = jsonString;
         document.body.appendChild(textarea);
         textarea.select();
         document.execCommand('copy');
         document.body.removeChild(textarea);
         showToast('복사되었습니다', 'success');
       }
     }
     ```

7. **URL에서 JSON 로드 기능 (CORS 에러)**
   - 원인: 외부 URL에서 JSON 가져올 때 CORS
   - 해결: 경고 메시지 표시
   - 해결: CORS proxy 사용 (선택사항)
   - 코드:
     ```javascript
     async function loadJSONFromURL(url) {
       try {
         const response = await fetch(url);
         if (!response.ok) {
           throw new Error(`HTTP ${response.status}`);
         }
         const json = await response.json();
         return JSON.stringify(json, null, 2);
       } catch (err) {
         if (err.name === 'TypeError' && err.message.includes('CORS')) {
           showToast('CORS 오류: 이 URL은 외부 접근을 허용하지 않습니다', 'error');
         } else {
           showToast(`URL 로드 실패: ${err.message}`, 'error');
         }
       }
     }
     ```

## 추가 기능 (선택사항)

### JSON → CSV 변환

```javascript
function jsonToCSV(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    throw new Error('배열 형태의 JSON만 CSV로 변환 가능합니다');
  }

  // 헤더 추출
  const headers = Object.keys(jsonArray[0]);

  // CSV 생성
  const csvRows = [
    headers.join(','), // 헤더
    ...jsonArray.map(row =>
      headers.map(header => {
        const value = row[header];
        // 쉼표나 따옴표 포함 시 이스케이프
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}
```

### JSON Schema 검증

```javascript
// 선택사항: ajv 라이브러리 사용
import Ajv from 'ajv';

const ajv = new Ajv();
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number', minimum: 0 }
  },
  required: ['name', 'age']
};

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.log(validate.errors);
}
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - JSONLint, JSON Editor Online, JSONFormatter.org 조사
  - 대부분 기본 기능만 제공
  - 차별화: 한글 에러, 자동 수정, 트리뷰
- **라이브러리 조사 완료:**
  - 순수 JS (기본) - 빠름, 충분
  - json-formatter-js (트리뷰) - 선택적
  - Best practices: 에러 번역, 위치 표시, 자동 수정
- **실제 이슈 파악:**
  - 대용량 JSON 느림, 영어 에러 메시지
  - 에러 위치 찾기 어려움, 자동 수정 필요
- **UI/UX 패턴:**
  - 4가지 모드 (포맷팅/압축/트리뷰/검증)
  - 실시간 검증, 에러 하이라이트
  - 복사/다운로드

## 참고 자료

- [JSON.parse() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [JSON.stringify() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [json-formatter-js GitHub](https://github.com/mohsen1/json-formatter-js)
- [JSONLint](https://jsonlint.com/)
