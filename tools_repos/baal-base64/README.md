# #9 Base64 인코더/디코더

> ⚠️ **개발 시작 전 필독!**
> 전역 개발 가이드: [`../_template/README.md`](../_template/README.md)
> Phase 1 버그, 체크리스트, 크로스 프로모션 도구 버튼 구현 확인 필수!

**URL:** base64.baal.co.kr

## 서비스 내용

텍스트/이미지 Base64 인코딩/디코딩. 개발자용 도구. UTF-8 지원

## 기능 요구사항

- [ ] 2가지 모드:
  - [ ] 텍스트 모드
  - [ ] 이미지 모드
- [ ] 텍스트 → Base64 인코딩
- [ ] Base64 → 텍스트 디코딩
- [ ] 이미지 → Base64 (Data URL)
- [ ] Base64 → 이미지 미리보기
- [ ] 복사 버튼
- [ ] 다운로드 버튼
- [ ] UTF-8, ASCII 인코딩 선택
- [ ] URL-safe Base64 옵션

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **Base64.guru** - 가장 인기 있는 Base64 도구
   - 강점: 간단한 UI, 빠름, 이미지 지원
   - 약점: 광고 많음, 디자인 구식

2. **Base64 Encode/Decode** - 개발자 전문
   - 강점: 다양한 옵션, URL-safe 지원
   - 약점: UI 복잡

3. **Code Beautify** - 통합 도구
   - 강점: 다양한 도구 제공
   - 약점: 광고 많음

4. **Online Base64** - 심플한 UI
   - 강점: 빠르고 간단
   - 약점: 고급 기능 부족

5. **Base64 Image Encoder** - 이미지 전문
   - 강점: 이미지 최적화
   - 약점: 텍스트 기능 약함

### 우리의 차별화 전략

- ✅ **2가지 모드** - 텍스트/이미지 분리
- ✅ **UTF-8 완벽 지원** - 한글, 이모지 등
- ✅ **URL-safe 옵션** - +/= → -_~ 변환
- ✅ **미리보기** - 실시간 결과 확인
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **완전 무료** - 제한 없음

## 주요 라이브러리

### 옵션 1: 순수 JavaScript (기본 권장)

브라우저 내장 API 사용

```javascript
// 텍스트 → Base64 (UTF-8 지원)
function encodeBase64(text) {
  // UTF-8 인코딩 필수 (한글 등)
  const utf8Bytes = new TextEncoder().encode(text);
  const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
}

// Base64 → 텍스트 (UTF-8 지원)
function decodeBase64(base64) {
  const binaryString = atob(base64);
  const utf8Bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
  return new TextDecoder().decode(utf8Bytes);
}

// 이미지 → Base64 (Data URL)
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:image/png;base64,iVBORw0K...
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Base64 → 이미지 다운로드
function base64ToImage(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

// URL-safe Base64
function toUrlSafe(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~');
}

function fromUrlSafe(urlSafeBase64) {
  return urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/').replace(/~/g, '=');
}
```

**특징:**
- ✅ 빠름 (즉시)
- ✅ 라이브러리 불필요
- ✅ UTF-8 완벽 지원
- ✅ 모든 브라우저 지원

**주의사항:**
- `btoa()`는 ASCII만 지원 → TextEncoder로 UTF-8 변환 필수!
- `atob()` 결과도 TextDecoder로 UTF-8 디코딩 필수!

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────────────┐
│  Base64 인코더/디코더                    │
│  텍스트와 이미지를 Base64로 변환         │
├─────────────────────────────────────────┤
│  모드: [텍스트] [이미지]                 │
├─────────────────────────────────────────┤
│  ┌─ 텍스트 모드 ──────────────────┐    │
│  │                                 │    │
│  │  원본 텍스트:                    │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │ Hello World! 안녕하세요!│   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  [인코딩] [디코딩]               │    │
│  │  □ URL-safe (옵션)              │    │
│  │                                 │    │
│  │  Base64 결과:                   │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │ SGVsbG8gV29ybGQhIOyViO │   │    │
│  │  │ 뀅ZeQEICFESEBcDSEBZI...  │   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  [복사] [다운로드 TXT]           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─ 이미지 모드 ──────────────────┐    │
│  │  [📤 이미지 업로드]              │    │
│  │                                 │    │
│  │  미리보기:                       │    │
│  │  ┌─────────┐                   │    │
│  │  │  🖼️     │                   │    │
│  │  └─────────┘                   │    │
│  │  (300KB, image/png)            │    │
│  │                                 │    │
│  │  Base64 Data URL:              │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │ data:image/png;base64, │   │    │
│  │  │ iVBORw0KGgoAAAANSUhEUg...│   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  [복사] [다운로드 이미지]        │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 주요 기능 순서

**텍스트 모드:**
1. 텍스트 입력
2. 인코딩/디코딩 선택
3. URL-safe 옵션 선택 (선택사항)
4. 결과 확인
5. 복사 또는 다운로드

**이미지 모드:**
1. 이미지 업로드
2. 미리보기 확인
3. Base64 자동 생성
4. 복사 또는 다운로드

## 난이도 & 예상 기간

- **난이도:** 쉬움 (브라우저 API)
- **예상 기간:** 1일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] 오전: UI 구성, 텍스트 모드
- [ ] 오후 1: 텍스트 인코딩/디코딩, UTF-8 처리
- [ ] 오후 2: 이미지 모드, FileReader API
- [ ] 오후 3: URL-safe 옵션, 복사/다운로드

## 트래픽 예상

⭐⭐ 중간 - 개발자 타겟 (필수 도구)

## SEO 키워드

- Base64 인코딩
- Base64 디코딩
- Base64 변환
- 이미지 Base64
- Data URL 생성
- Base64 인코더
- Base64 디코더

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & 실무 이슈 기반)

1. **한글/이모지 인코딩 시 에러 (btoa 한계)**
   - 원인: `btoa()`는 ASCII만 지원
   - 해결: TextEncoder로 UTF-8 → 바이너리 변환
   - 코드:
     ```javascript
     // ❌ 잘못된 방법 (한글 에러!)
     const wrong = btoa('안녕하세요'); // DOMException!

     // ✅ 올바른 방법
     function encodeBase64Utf8(text) {
       const utf8Bytes = new TextEncoder().encode(text);
       const binaryString = Array.from(utf8Bytes, byte =>
         String.fromCharCode(byte)
       ).join('');
       return btoa(binaryString);
     }

     const correct = encodeBase64Utf8('안녕하세요'); // 7JWI64WV7ZWY7IS47JqU
     ```

2. **Base64 디코딩 시 한글 깨짐**
   - 원인: `atob()` 결과를 UTF-8로 디코딩 안 함
   - 해결: TextDecoder 사용
   - 코드:
     ```javascript
     function decodeBase64Utf8(base64) {
       const binaryString = atob(base64);
       const utf8Bytes = Uint8Array.from(binaryString, char =>
         char.charCodeAt(0)
       );
       return new TextDecoder().decode(utf8Bytes);
     }
     ```

3. **대용량 이미지 Base64 변환 시 브라우저 느려짐**
   - 원인: 5MB+ 이미지를 메모리에 로드
   - 해결: 파일 크기 제한 (2MB)
   - 해결: 경고 메시지
   - 코드:
     ```javascript
     const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

     function validateImageSize(file) {
       if (file.size > MAX_IMAGE_SIZE) {
         showToast(`이미지가 너무 큽니다. (최대 2MB, 현재 ${(file.size / 1024 / 1024).toFixed(2)}MB)`, 'error');
         return false;
       }
       return true;
     }
     ```

4. **Base64 문자열 검증 부족 (잘못된 입력 시 에러)**
   - 원인: Base64가 아닌 문자열 입력
   - 해결: 정규식 검증
   - 코드:
     ```javascript
     function isValidBase64(str) {
       // Base64 정규식: A-Z, a-z, 0-9, +, /, =
       const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

       if (!base64Regex.test(str)) {
         return false;
       }

       // 길이 체크 (4의 배수)
       if (str.length % 4 !== 0) {
         return false;
       }

       // 실제 디코딩 시도
       try {
         atob(str);
         return true;
       } catch {
         return false;
       }
     }
     ```

5. **URL에서 Base64 사용 시 에러 (+, /, = 문자)**
   - 원인: URL에서 특수문자 인식
   - 해결: URL-safe Base64 변환
   - 코드:
     ```javascript
     // 표준 Base64 → URL-safe
     function toUrlSafeBase64(base64) {
       return base64
         .replace(/\+/g, '-')  // + → -
         .replace(/\//g, '_')  // / → _
         .replace(/=/g, '~');  // = → ~ (또는 제거)
     }

     // URL-safe → 표준 Base64
     function fromUrlSafeBase64(urlSafe) {
       return urlSafe
         .replace(/-/g, '+')
         .replace(/_/g, '/')
         .replace(/~/g, '=');
     }
     ```

6. **Data URL 크기 제한 (브라우저별 차이)**
   - 원인: 브라우저마다 Data URL 최대 길이 다름
   - 해결: 2MB 이하 권장
   - 코드:
     ```javascript
     // Data URL 크기 계산
     function getDataUrlSize(dataUrl) {
       const sizeInBytes = new Blob([dataUrl]).size;
       const sizeInMB = sizeInBytes / 1024 / 1024;
       return sizeInMB;
     }

     // 경고
     if (getDataUrlSize(dataUrl) > 2) {
       showToast('Data URL이 너무 큽니다. 일부 브라우저에서 작동하지 않을 수 있습니다.', 'warning');
     }
     ```

7. **복사 시 줄바꿈 포함 (코드 삽입 시 에러)**
   - 원인: Base64 결과를 80자마다 줄바꿈
   - 해결: 줄바꿈 제거 옵션
   - 코드:
     ```javascript
     // 줄바꿈 없이 복사
     function copyWithoutLineBreaks(base64) {
       const cleaned = base64.replace(/\s/g, '');
       navigator.clipboard.writeText(cleaned);
     }
     ```

## 추가 기능 (선택사항)

### Base64 → 이미지 미리보기 (역방향)

```javascript
function previewBase64Image(base64OrDataUrl) {
  const img = document.createElement('img');

  // Data URL 형식 확인
  if (base64OrDataUrl.startsWith('data:image')) {
    img.src = base64OrDataUrl;
  } else {
    // 순수 Base64 → Data URL로 변환
    img.src = `data:image/png;base64,${base64OrDataUrl}`;
  }

  document.getElementById('preview').appendChild(img);
}
```

### 파일 다운로드 (Base64 → 파일)

```javascript
function downloadBase64AsFile(base64, filename, mimeType = 'text/plain') {
  // Base64 → Blob
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: mimeType });

  // 다운로드
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - Base64.guru, Base64 Encode/Decode, Code Beautify 조사
  - 대부분 UTF-8 처리 미흡
  - 차별화: UTF-8 완벽 지원, URL-safe 옵션
- **라이브러리 조사 완료:**
  - 순수 JS (btoa/atob + TextEncoder/TextDecoder)
  - FileReader API (이미지)
  - Best practices: UTF-8 처리, 크기 제한, 검증
- **실제 이슈 파악:**
  - 한글 인코딩 에러, 대용량 이미지
  - Base64 검증, URL-safe 변환
- **UI/UX 패턴:**
  - 2가지 모드 (텍스트/이미지)
  - 미리보기, 복사/다운로드

## 참고 자료

- [btoa() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/btoa)
- [atob() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/atob)
- [TextEncoder - MDN](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [FileReader - MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Data URLs - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
