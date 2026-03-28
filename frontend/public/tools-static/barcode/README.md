# #15 바코드 생성기

**URL:** barcode.baal.co.kr

## 서비스 내용

1D/2D 바코드 생성 (EAN-13, Code128, UPC-A 등). 인쇄용 고해상도. QR 코드는 별도(#5)

## 기능 요구사항

- [ ] 바코드 타입 선택:
  - [ ] Code 128 (물류, 제조)
  - [ ] EAN-13 (소매, 상품)
  - [ ] UPC-A (북미 상품)
  - [ ] Code 39 (산업용)
  - [ ] ITF-14 (박스 포장)
  - [ ] Code 93 (캐나다 우편)
- [ ] 숫자/텍스트 입력
- [ ] 유효성 검증 (체크섬 자동 계산)
- [ ] 크기 조절 (폭, 높이)
- [ ] 색상 커스터마이징 (바코드/배경)
- [ ] 텍스트 표시 옵션 (숫자 표시/숨김)
- [ ] 여백 설정
- [ ] 바코드 미리보기
- [ ] PNG/SVG 다운로드
- [ ] 일괄 생성 (CSV 업로드)

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **Barcode Generator (TEC-IT)** - 가장 강력한 바코드 생성기
   - 강점: 100+ 바코드 타입, 고품질, API 제공
   - 약점: 무료는 워터마크, 광고 많음

2. **Free Barcode Generator** - 간단한 UI
   - 강점: 완전 무료, 워터마크 없음, 다양한 타입
   - 약점: UI 구식, 모바일 최적화 부족

3. **Barcode-Generator.org** - 웹 기반
   - 강점: 빠름, 간단, SVG 지원
   - 약점: 기능 제한적, 커스터마이징 부족

4. **Online Barcode Generator (Shopify)** - 전자상거래용
   - 강점: Shopify 통합, 상품용 최적화
   - 약점: 일부 타입만 지원, Shopify 중심

5. **Labeljoy** - 라벨 통합
   - 강점: 라벨 디자인 통합, 인쇄 기능
   - 약점: 소프트웨어 설치 필요, 복잡

### 우리의 차별화 전략

- ✅ **완전 무료** - 워터마크 없음, 제한 없음
- ✅ **브라우저 기반** - 설치 불필요, 프라이버시
- ✅ **고해상도** - 인쇄용 품질 (SVG)
- ✅ **간단한 UI** - 3단계로 완성
- ✅ **일괄 생성** - CSV 업로드로 대량 생성
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **유효성 자동 검증** - 체크섬 자동 계산

## 주요 라이브러리

### JsBarcode (추천!)

가장 인기 있는 JavaScript 바코드 라이브러리

```html
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
```

### 기본 사용법

```javascript
// 1. Canvas에 바코드 생성
JsBarcode("#barcode-canvas", "123456789012", {
  format: "EAN13",
  width: 2,
  height: 100,
  displayValue: true,
  fontSize: 20,
  margin: 10
});

// 2. SVG에 바코드 생성 (인쇄용 권장)
JsBarcode("#barcode-svg", "CODE128ABC", {
  format: "CODE128",
  width: 2,
  height: 80,
  displayValue: true,
  fontOptions: "bold",
  textMargin: 5,
  background: "#ffffff",
  lineColor: "#000000"
});
```

### 포맷별 상세 설정

```javascript
// EAN-13 (13자리 숫자, 체크섬 자동)
JsBarcode("#ean13", "590123412345", {
  format: "EAN13",
  width: 2,
  height: 100,
  displayValue: true,
  font: "monospace",
  textAlign: "center",
  textPosition: "bottom",
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10
});

// Code 128 (영숫자, 가장 범용)
JsBarcode("#code128", "ABC-123", {
  format: "CODE128",
  width: 2,
  height: 80,
  displayValue: true,
  fontOptions: "bold",
  font: "monospace",
  textAlign: "center",
  textPosition: "bottom",
  fontSize: 16
});

// UPC-A (12자리 숫자, 북미)
JsBarcode("#upca", "012345678905", {
  format: "UPC",
  width: 2,
  height: 100,
  displayValue: true,
  flat: true // 가드 바 높이 일정
});

// Code 39 (영숫자, 산업용)
JsBarcode("#code39", "*CODE39*", {
  format: "CODE39",
  width: 2,
  height: 80,
  displayValue: true
});

// ITF-14 (14자리 숫자, 박스 포장)
JsBarcode("#itf14", "12345678901231", {
  format: "ITF14",
  width: 2,
  height: 80,
  displayValue: true
});
```

### 에러 핸들링

```javascript
try {
  JsBarcode("#barcode", userInput, {
    format: selectedFormat,
    valid: function(valid) {
      if (valid) {
        console.log("바코드 생성 성공");
      } else {
        throw new Error("유효하지 않은 입력");
      }
    }
  });
} catch (error) {
  showToast(`바코드 생성 실패: ${error.message}`, 'error');
}
```

### PNG/SVG 다운로드

```javascript
// SVG 다운로드 (권장: 벡터, 확대 가능)
function downloadSVG() {
  const svg = document.getElementById('barcode-svg');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'barcode.svg';
  link.click();

  URL.revokeObjectURL(url);
}

// PNG 다운로드 (Canvas 변환)
function downloadPNG() {
  const canvas = document.getElementById('barcode-canvas');
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'barcode.png';
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
```

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  바코드 생성기                    │
│  물류/제조/소매용 바코드           │
├─────────────────────────────────┤
│  1️⃣ 바코드 타입 선택              │
│  [Code 128] [EAN-13] [UPC-A]    │
│  [Code 39] [ITF-14] [Code 93]   │
├─────────────────────────────────┤
│  2️⃣ 데이터 입력                   │
│  입력: [123456789012        ]    │
│  ℹ️ EAN-13: 13자리 숫자 필요      │
│  ☑ 체크섬 자동 계산               │
├─────────────────────────────────┤
│  3️⃣ 커스터마이징 (선택사항)        │
│  크기: 폭 [━━●───] 높이 [━━━●──] │
│  색상: [⚫ 바코드] [⚪ 배경]       │
│  ☑ 텍스트 표시                   │
│  여백: [━●────] 10px             │
├─────────────────────────────────┤
│  4️⃣ 미리보기                      │
│      ┌───────────┐               │
│      ║║ ║║║║║ ║║ ║║               │
│      123456789012                │
│      └───────────┘               │
├─────────────────────────────────┤
│  [PNG 다운로드] [SVG 다운로드]    │
└─────────────────────────────────┘
```

### 바코드 타입별 안내

**Code 128:**
- 용도: 물류, 제조, 재고 관리
- 입력: 영숫자 (대소문자, 특수문자)
- 예시: ABC-123, PROD001

**EAN-13:**
- 용도: 소매 상품 (국제 표준)
- 입력: 13자리 숫자 (마지막은 체크섬)
- 예시: 5901234123457

**UPC-A:**
- 용도: 북미 상품
- 입력: 12자리 숫자
- 예시: 012345678905

**Code 39:**
- 용도: 산업용, 자동차, 국방
- 입력: 영숫자 (대문자만), *, $, /, +, %
- 예시: *CODE39*

**ITF-14:**
- 용도: 박스/팔레트 포장
- 입력: 14자리 숫자
- 예시: 12345678901231

**Code 93:**
- 용도: 캐나다 우편
- 입력: 영숫자
- 예시: CODE93

### 주요 기능 순서

1. 바코드 타입 선택 (Code 128, EAN-13 등)
2. 데이터 입력 (숫자/텍스트)
3. 유효성 자동 검증
4. 커스터마이징 (크기, 색상, 여백)
5. 실시간 미리보기
6. 다운로드 (PNG/SVG)

## 난이도 & 예상 기간

- **난이도:** 쉬움 (JsBarcode 라이브러리 사용)
- **예상 기간:** 1.5일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1 오전: UI 구성, 타입 선택, 데이터 입력
- [ ] Day 1 오후: JsBarcode 통합, 기본 바코드 생성 (Code 128, EAN-13, UPC-A)
- [ ] Day 2 오전: 커스터마이징 (크기, 색상, 여백), 유효성 검증
- [ ] Day 2 오후: PNG/SVG 다운로드, 일괄 생성 (CSV), 테스트

## 트래픽 예상

⭐⭐ 중간 - "바코드 생성" 검색량 보통 (쇼핑몰, 물류 관련)

## SEO 키워드

- 바코드 생성
- EAN-13 생성
- Code128 생성
- 바코드 만들기
- 무료 바코드 생성기
- 인쇄용 바코드
- UPC-A 생성
- 바코드 이미지

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & JsBarcode 기반)

1. **잘못된 입력으로 바코드 생성 실패**
   - 원인: 포맷별 규칙 미준수 (EAN-13은 13자리 숫자만)
   - 해결: 입력 전 유효성 검증
   - 해결: 포맷별 안내 메시지 표시
   - 코드:
     ```javascript
     function validateInput(format, input) {
       const rules = {
         'EAN13': /^\d{12,13}$/,  // 12 또는 13자리 숫자
         'CODE128': /^[\x20-\x7E]+$/,  // ASCII 출력 가능 문자
         'UPC': /^\d{11,12}$/,  // 11 또는 12자리 숫자
         'CODE39': /^[0-9A-Z\-\.\ \$\/\+\%\*]+$/,  // 대문자, 숫자, 특수문자
         'ITF14': /^\d{13,14}$/,  // 13 또는 14자리 숫자
         'CODE93': /^[0-9A-Z\-\.\ \$\/\+\%]+$/
       };

       if (!rules[format]) {
         return { valid: true }; // 규칙 없으면 통과
       }

       if (!rules[format].test(input)) {
         return {
           valid: false,
           message: getFormatHint(format)
         };
       }

       return { valid: true };
     }

     function getFormatHint(format) {
       const hints = {
         'EAN13': 'EAN-13은 12 또는 13자리 숫자가 필요합니다.',
         'CODE128': 'CODE128은 영숫자와 특수문자를 지원합니다.',
         'UPC': 'UPC-A는 11 또는 12자리 숫자가 필요합니다.',
         'CODE39': 'CODE39는 대문자, 숫자, 일부 특수문자만 지원합니다.',
         'ITF14': 'ITF-14는 13 또는 14자리 숫자가 필요합니다.',
         'CODE93': 'CODE93은 대문자와 숫자를 지원합니다.'
       };
       return hints[format] || '입력 형식을 확인하세요.';
     }

     // 사용 예
     const validation = validateInput('EAN13', userInput);
     if (!validation.valid) {
       showToast(validation.message, 'error');
       return;
     }
     ```

2. **체크섬 계산 오류 (EAN-13, UPC-A)**
   - 원인: 사용자가 잘못된 체크섬 입력
   - 해결: JsBarcode가 자동 계산 (12자리 입력 시)
   - 해결: 체크섬 자동 추가 옵션 제공
   - 코드:
     ```javascript
     function generateEAN13(input) {
       // 12자리면 체크섬 자동 계산
       if (input.length === 12) {
         const checksum = calculateEAN13Checksum(input);
         const fullCode = input + checksum;
         JsBarcode("#barcode", fullCode, { format: "EAN13" });
         showToast(`체크섬 ${checksum}이(가) 자동으로 추가되었습니다.`, 'info');
       } else if (input.length === 13) {
         // 13자리면 체크섬 검증
         const expectedChecksum = calculateEAN13Checksum(input.substring(0, 12));
         const actualChecksum = input[12];
         if (expectedChecksum !== actualChecksum) {
           showToast(`체크섬 오류: ${actualChecksum} → ${expectedChecksum}로 수정됩니다.`, 'warning');
           const correctedCode = input.substring(0, 12) + expectedChecksum;
           JsBarcode("#barcode", correctedCode, { format: "EAN13" });
         } else {
           JsBarcode("#barcode", input, { format: "EAN13" });
         }
       }
     }

     function calculateEAN13Checksum(code) {
       let sum = 0;
       for (let i = 0; i < 12; i++) {
         const digit = parseInt(code[i]);
         sum += (i % 2 === 0) ? digit : digit * 3;
       }
       const checksum = (10 - (sum % 10)) % 10;
       return checksum.toString();
     }
     ```

3. **인쇄 시 바코드 흐림 (PNG 사용 시)**
   - 원인: PNG는 래스터 이미지, 확대 시 품질 저하
   - 해결: SVG 사용 권장 (벡터)
   - 해결: PNG는 고해상도로 생성 (DPI 300)
   - 코드:
     ```javascript
     // 고해상도 PNG 생성
     function generateHighResPNG(scale = 3) {
       const canvas = document.createElement('canvas');
       canvas.width = 400 * scale;
       canvas.height = 200 * scale;

       const ctx = canvas.getContext('2d');
       ctx.scale(scale, scale);

       JsBarcode(canvas, userInput, {
         format: selectedFormat,
         width: 2,
         height: 100,
         displayValue: true
       });

       return canvas;
     }

     // SVG 권장 메시지
     showToast('인쇄용은 SVG를 권장합니다. (확대 가능)', 'info');
     ```

4. **바코드 스캐너 인식 실패**
   - 원인: 너무 작은 크기, 낮은 대비
   - 해결: 최소 크기 권장 (폭 2px, 높이 50px 이상)
   - 해결: 흰 배경 + 검은 바코드 (대비 최대화)
   - 코드:
     ```javascript
     const MIN_WIDTH = 2;
     const MIN_HEIGHT = 50;

     function validateBarcodeSize(width, height) {
       if (width < MIN_WIDTH || height < MIN_HEIGHT) {
         showToast(`바코드 크기가 너무 작습니다. (최소 폭 ${MIN_WIDTH}px, 높이 ${MIN_HEIGHT}px)`, 'warning');
         return false;
       }
       return true;
     }

     // 대비 검증
     function validateContrast(bgColor, lineColor) {
       // 흰 배경 + 검은 바코드 권장
       if (bgColor !== '#ffffff' || lineColor !== '#000000') {
         showToast('스캐너 인식률을 높이려면 흰 배경 + 검은 바코드를 권장합니다.', 'info');
       }
     }
     ```

5. **Code 39에서 * 기호 누락**
   - 원인: Code 39는 시작/종료 마커로 * 필요
   - 해결: 자동으로 * 추가
   - 코드:
     ```javascript
     function generateCode39(input) {
       // * 없으면 자동 추가
       if (!input.startsWith('*')) {
         input = '*' + input;
       }
       if (!input.endsWith('*')) {
         input = input + '*';
       }

       JsBarcode("#barcode", input, {
         format: "CODE39",
         width: 2,
         height: 80,
         displayValue: true
       });
     }
     ```

6. **SVG 다운로드 시 폰트 누락**
   - 원인: 외부 폰트가 SVG에 포함 안됨
   - 해결: 시스템 폰트 사용 (monospace)
   - 해결: 폰트 임베드 (선택사항)
   - 코드:
     ```javascript
     JsBarcode("#barcode", input, {
       format: "EAN13",
       font: "monospace", // 시스템 폰트 사용
       fontOptions: "bold"
     });
     ```

7. **일괄 생성 시 메모리 부족**
   - 원인: 수백 개 바코드 동시 생성
   - 해결: 순차 처리 (한 번에 10개씩)
   - 해결: 생성 후 메모리 정리
   - 코드:
     ```javascript
     async function batchGenerate(dataList, format) {
       const BATCH_SIZE = 10;
       const results = [];

       for (let i = 0; i < dataList.length; i += BATCH_SIZE) {
         const batch = dataList.slice(i, i + BATCH_SIZE);

         for (const data of batch) {
           const canvas = document.createElement('canvas');
           JsBarcode(canvas, data, { format });

           const blob = await new Promise((resolve) => {
             canvas.toBlob(resolve, 'image/png');
           });

           results.push({ data, blob });
         }

         // 진행률 업데이트
         updateProgress((i + batch.length) / dataList.length * 100);

         // 메모리 정리
         await new Promise(resolve => setTimeout(resolve, 100));
       }

       return results;
     }
     ```

8. **CSV 업로드 시 인코딩 문제**
   - 원인: CSV 파일 인코딩 (UTF-8 vs EUC-KR)
   - 해결: FileReader로 UTF-8 강제
   - 코드:
     ```javascript
     function readCSV(file) {
       return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = (e) => {
           const text = e.target.result;
           const lines = text.split('\n').filter(line => line.trim());
           const data = lines.map(line => line.split(',')[0].trim());
           resolve(data);
         };
         reader.onerror = reject;
         reader.readAsText(file, 'UTF-8'); // UTF-8 강제
       });
     }

     // 사용 예
     const fileInput = document.getElementById('csv-input');
     fileInput.addEventListener('change', async (e) => {
       const file = e.target.files[0];
       if (file) {
         try {
           const data = await readCSV(file);
           showToast(`${data.length}개 데이터를 로드했습니다.`, 'success');
           await batchGenerate(data, selectedFormat);
         } catch (error) {
           showToast('CSV 파일 읽기 실패', 'error');
         }
       }
     });
     ```

## 통합 전략 (QR 코드와 연계)

### qr.baal.co.kr (QR 코드 생성기)

**메뉴에서 바코드 링크:**
```html
<div class="tool-menu">
  <a href="https://qr.baal.co.kr">QR 코드</a>
  <a href="https://barcode.baal.co.kr">바코드</a>
</div>
```

**안내 메시지:**
- "1D 바코드는 barcode.baal.co.kr에서 생성하세요."
- "QR 코드(2D)는 qr.baal.co.kr에서 생성하세요."

## 추가 기능 (선택사항)

### 1. 일괄 생성 (CSV 업로드)

```javascript
// CSV 형식: 각 줄에 바코드 데이터
// 예시:
// 123456789012
// 234567890123
// 345678901234

async function bulkGenerateFromCSV(file) {
  const data = await readCSV(file);
  const zip = new JSZip();

  for (let i = 0; i < data.length; i++) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data[i], { format: selectedFormat });

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    zip.file(`barcode_${i + 1}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadFile(zipBlob, 'barcodes.zip');
}
```

### 2. 바코드 히스토리

최근 생성한 바코드 저장

```javascript
const history = JSON.parse(localStorage.getItem('barcode-history') || '[]');
history.unshift({
  date: new Date().toISOString(),
  format: selectedFormat,
  data: userInput
});
localStorage.setItem('barcode-history', JSON.stringify(history.slice(0, 10)));
```

### 3. 템플릿 저장

자주 사용하는 설정 저장

```javascript
const template = {
  format: 'EAN13',
  width: 2,
  height: 100,
  displayValue: true,
  fontSize: 20,
  margin: 10,
  background: '#ffffff',
  lineColor: '#000000'
};
localStorage.setItem('barcode-template', JSON.stringify(template));
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- README.md 작성
- **경쟁사 분석 완료:**
  - Barcode Generator (TEC-IT), Free Barcode Generator, Barcode-Generator.org 조사
  - 대부분 워터마크 또는 광고, 모바일 최적화 부족
  - 차별화: 완전 무료, 브라우저 기반, 고해상도, 일괄 생성
- **라이브러리 조사 완료:**
  - JsBarcode (추천) - 가장 인기, 다양한 포맷
  - 6가지 주요 포맷: Code 128, EAN-13, UPC-A, Code 39, ITF-14, Code 93
  - Best practices: 유효성 검증, 체크섬 자동 계산, SVG 권장
- **실제 이슈 파악:**
  - 잘못된 입력, 체크섬 오류, 인쇄 품질
  - 바코드 스캐너 인식 실패, 일괄 생성 메모리 부족
- **UI/UX 패턴:**
  - 4단계 워크플로우 (타입 → 입력 → 커스터마이징 → 다운로드)
  - 포맷별 안내 메시지, 실시간 미리보기
  - PNG/SVG 다운로드, CSV 일괄 생성

## 참고 자료

- [JsBarcode GitHub](https://github.com/lindell/JsBarcode)
- [JsBarcode 공식 문서](https://lindell.me/JsBarcode/)
- [EAN-13 Checksum Calculator](https://www.gs1.org/services/check-digit-calculator)
- [Barcode Format Specifications](https://www.barcode.graphics/barcode-formats/)
