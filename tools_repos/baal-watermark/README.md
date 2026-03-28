# #16 워터마크 추가

**URL:** watermark.baal.co.kr

## 서비스 내용

이미지에 텍스트/로고 워터마크 추가. 위치/투명도/회전 조절. 타일링/일괄 처리 지원

## 기능 요구사항

- [ ] 이미지 업로드 (드래그 앤 드롭, 다중 파일)
- [ ] 워터마크 타입:
  - [ ] 텍스트 워터마크
  - [ ] 이미지(로고) 워터마크
- [ ] 위치 선택 (9개 영역: 좌상/중상/우상/좌중/중앙/우중/좌하/중하/우하)
- [ ] 크기 조절 (텍스트: 폰트 크기, 이미지: 배율)
- [ ] 투명도 조절 (0-100%)
- [ ] 색상 선택 (텍스트)
- [ ] 폰트 선택 (텍스트: 고딕/명조/손글씨)
- [ ] 회전 각도 (-180° ~ 180°)
- [ ] 타일링 옵션 (반복 워터마크)
- [ ] 그림자 효과
- [ ] 일괄 처리 (최대 20개)
- [ ] 미리보기 (실시간)
- [ ] 다운로드 (개별/ZIP)

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **Watermarkly** - 가장 인기 있는 워터마크 도구
   - 강점: 강력한 기능, 일괄 처리, 모바일 앱
   - 약점: 무료는 10개 제한, 워터마크 추가

2. **uMark** - 데스크톱 소프트웨어
   - 강점: 고급 기능, 타일링, 배치 처리
   - 약점: 소프트웨어 설치 필요, 유료

3. **Watermark.ws** - 웹 기반
   - 강점: 간단한 UI, 빠름
   - 약점: 기능 제한적, 광고 많음

4. **Visual Watermark** - 전문가용
   - 강점: 고품질, 다양한 옵션
   - 약점: 완전 유료, 복잡한 UI

5. **PicMarkr** - 온라인 도구
   - 강점: 무료, 간단
   - 약점: 기능 제한적, 속도 느림

### 우리의 차별화 전략

- ✅ **완전 무료** - 횟수 제한 없음, 워터마크 없음
- ✅ **브라우저 기반** - 설치 불필요, 프라이버시
- ✅ **고급 기능** - 타일링, 회전, 그림자
- ✅ **실시간 미리보기** - 즉시 확인
- ✅ **일괄 처리** - 최대 20개 동시 처리
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **간단한 UI** - 4단계로 완성

## 주요 라이브러리

### Canvas API (추천!)

브라우저 기본 API로 충분히 구현 가능

```javascript
// 1. 이미지 로드
const img = new Image();
img.src = URL.createObjectURL(file);
await img.decode();

// 2. Canvas 생성
const canvas = document.createElement('canvas');
canvas.width = img.width;
canvas.height = img.height;
const ctx = canvas.getContext('2d');

// 3. 원본 이미지 그리기
ctx.drawImage(img, 0, 0);

// 4. 텍스트 워터마크 추가
ctx.save();
ctx.globalAlpha = opacity; // 투명도 (0-1)
ctx.font = `${fontSize}px Arial`;
ctx.fillStyle = color;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// 회전 (중심 기준)
ctx.translate(x, y);
ctx.rotate(angle * Math.PI / 180);
ctx.fillText(text, 0, 0);
ctx.restore();

// 5. 다운로드
canvas.toBlob((blob) => {
  downloadFile(blob, 'watermarked.png');
}, 'image/png');
```

### 텍스트 워터마크 상세 구현

```javascript
function addTextWatermark(canvas, options) {
  const {
    text,
    position, // 'top-left', 'center', 'bottom-right' 등
    fontSize = 48,
    fontFamily = 'Arial',
    fontWeight = 'bold',
    color = '#ffffff',
    opacity = 0.5,
    rotation = 0,
    offsetX = 20,
    offsetY = 20,
    shadow = false
  } = options;

  const ctx = canvas.getContext('2d');

  // 폰트 설정
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  // 위치 계산
  const coords = calculatePosition(
    canvas.width,
    canvas.height,
    textWidth,
    textHeight,
    position,
    offsetX,
    offsetY
  );

  ctx.save();

  // 투명도
  ctx.globalAlpha = opacity;

  // 그림자 (선택사항)
  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }

  // 회전
  ctx.translate(coords.x, coords.y);
  ctx.rotate(rotation * Math.PI / 180);

  // 텍스트 그리기
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

function calculatePosition(canvasWidth, canvasHeight, textWidth, textHeight, position, offsetX, offsetY) {
  const positions = {
    'top-left': { x: offsetX + textWidth / 2, y: offsetY + textHeight / 2 },
    'top-center': { x: canvasWidth / 2, y: offsetY + textHeight / 2 },
    'top-right': { x: canvasWidth - offsetX - textWidth / 2, y: offsetY + textHeight / 2 },
    'center-left': { x: offsetX + textWidth / 2, y: canvasHeight / 2 },
    'center': { x: canvasWidth / 2, y: canvasHeight / 2 },
    'center-right': { x: canvasWidth - offsetX - textWidth / 2, y: canvasHeight / 2 },
    'bottom-left': { x: offsetX + textWidth / 2, y: canvasHeight - offsetY - textHeight / 2 },
    'bottom-center': { x: canvasWidth / 2, y: canvasHeight - offsetY - textHeight / 2 },
    'bottom-right': { x: canvasWidth - offsetX - textWidth / 2, y: canvasHeight - offsetY - textHeight / 2 }
  };

  return positions[position] || positions['center'];
}
```

### 이미지 워터마크 (로고) 구현

```javascript
async function addImageWatermark(canvas, logoFile, options) {
  const {
    position = 'bottom-right',
    scale = 0.2, // 원본 이미지의 20% 크기
    opacity = 0.7,
    rotation = 0,
    offsetX = 20,
    offsetY = 20
  } = options;

  // 로고 이미지 로드
  const logo = new Image();
  logo.src = URL.createObjectURL(logoFile);
  await logo.decode();

  const ctx = canvas.getContext('2d');

  // 로고 크기 계산
  const logoWidth = logo.width * scale;
  const logoHeight = logo.height * scale;

  // 위치 계산
  const coords = calculatePosition(
    canvas.width,
    canvas.height,
    logoWidth,
    logoHeight,
    position,
    offsetX,
    offsetY
  );

  ctx.save();

  // 투명도
  ctx.globalAlpha = opacity;

  // 회전
  ctx.translate(coords.x, coords.y);
  ctx.rotate(rotation * Math.PI / 180);

  // 로고 그리기
  ctx.drawImage(
    logo,
    -logoWidth / 2,
    -logoHeight / 2,
    logoWidth,
    logoHeight
  );

  ctx.restore();

  // 메모리 정리
  URL.revokeObjectURL(logo.src);
}
```

### 타일링 워터마크 (반복)

```javascript
function addTiledWatermark(canvas, text, options) {
  const {
    fontSize = 48,
    fontFamily = 'Arial',
    color = '#ffffff',
    opacity = 0.1,
    rotation = -45,
    spacing = 200
  } = options;

  const ctx = canvas.getContext('2d');
  ctx.save();

  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 타일링 (격자 패턴)
  for (let y = 0; y < canvas.height + spacing; y += spacing) {
    for (let x = 0; x < canvas.width + spacing; x += spacing) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }

  ctx.restore();
}
```

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  워터마크 추가                    │
│  이미지에 텍스트/로고 워터마크     │
├─────────────────────────────────┤
│  1️⃣ 워터마크 타입 선택            │
│  ● [텍스트] ○ [이미지/로고]      │
├─────────────────────────────────┤
│  2️⃣ 워터마크 설정                 │
│  텍스트: [Copyright 2025    ]    │
│  폰트: [Arial ▼] 크기: [48px]   │
│  색상: [⚪] 투명도: [━━●───] 50% │
│  위치: [┌─┬─┬─┐]                 │
│         [├─┼─┼─┤] (중앙 선택)    │
│         [└─┴─┴─┘]                 │
│  회전: [━━━●──] -45°             │
│  ☑ 타일링 (반복)                 │
│  ☑ 그림자 효과                   │
├─────────────────────────────────┤
│  3️⃣ 이미지 업로드                 │
│  🖼️ 드래그 앤 드롭 (최대 20개)    │
├─────────────────────────────────┤
│  4️⃣ 미리보기                      │
│  [원본] [워터마크 적용됨]         │
│  photo.jpg                       │
│  Copyright 2025 (우하단)         │
├─────────────────────────────────┤
│  [다운로드] [전체 ZIP 다운로드]   │
└─────────────────────────────────┘
```

### 위치 선택 (9개 영역)

```
┌─────┬─────┬─────┐
│ TL  │ TC  │ TR  │  TL: Top-Left (좌상)
├─────┼─────┼─────┤  TC: Top-Center (중상)
│ CL  │  C  │ CR  │  TR: Top-Right (우상)
├─────┼─────┼─────┤  CL: Center-Left (좌중)
│ BL  │ BC  │ BR  │  C: Center (중앙)
└─────┴─────┴─────┘  CR: Center-Right (우중)
                     BL: Bottom-Left (좌하)
                     BC: Bottom-Center (중하)
                     BR: Bottom-Right (우하)
```

### 주요 기능 순서

1. 워터마크 타입 선택 (텍스트/이미지)
2. 워터마크 설정 (텍스트/폰트/색상/투명도/위치/회전)
3. 이미지 업로드 (드래그 또는 클릭, 최대 20개)
4. 실시간 미리보기
5. 다운로드 (개별 또는 ZIP)

## 난이도 & 예상 기간

- **난이도:** 보통 (Canvas API, 위치 계산)
- **예상 기간:** 2.5일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1 오전: UI 구성, 타입 선택, 텍스트 워터마크 기본
- [ ] Day 1 오후: 위치 계산 (9개 영역), 미리보기
- [ ] Day 2 오전: 이미지 워터마크, 투명도/회전 조절
- [ ] Day 2 오후: 타일링, 그림자 효과, 폰트 선택
- [ ] Day 3 오전: 일괄 처리, ZIP 다운로드, 최적화
- [ ] Day 3 오후: 테스트, 버그 수정

## 트래픽 예상

⭐⭐ 중간 - "워터마크 추가" 검색량 보통 (사진작가, 디자이너)

## SEO 키워드

- 워터마크 추가
- 이미지 워터마크
- 로고 삽입
- 저작권 보호
- 사진 워터마크
- 무료 워터마크
- 워터마크 만들기
- 이미지 저작권

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & Canvas API 기반)

1. **고해상도 이미지 처리 시 브라우저 느림**
   - 원인: Canvas에서 대용량 이미지 처리
   - 해결: 파일 크기 제한 (10MB)
   - 해결: Web Worker 사용 (선택사항)
   - 코드:
     ```javascript
     const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

     async function validateImage(file) {
       if (file.size > MAX_FILE_SIZE) {
         showToast('파일이 너무 큽니다. (최대 10MB)', 'error');
         return false;
       }
       return true;
     }

     // 이미지 크기 제한
     const MAX_DIMENSION = 5000;
     if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
       showToast('이미지 크기가 너무 큽니다. (최대 5000x5000)', 'warning');
     }
     ```

2. **텍스트 렌더링 품질 낮음 (픽셀화)**
   - 원인: Canvas 기본 렌더링 품질
   - 해결: imageSmoothingEnabled = true
   - 해결: 고해상도 Canvas 사용 (2x 스케일)
   - 코드:
     ```javascript
     const scale = 2; // 2배 해상도
     canvas.width = img.width * scale;
     canvas.height = img.height * scale;
     ctx.scale(scale, scale);

     ctx.imageSmoothingEnabled = true;
     ctx.imageSmoothingQuality = 'high';

     // 원본 이미지 그리기
     ctx.drawImage(img, 0, 0, img.width, img.height);

     // 텍스트 워터마크
     ctx.font = `bold ${fontSize}px Arial`;
     ctx.fillText(text, x, y);

     // 다운로드 시 원래 크기로
     const finalCanvas = document.createElement('canvas');
     finalCanvas.width = img.width;
     finalCanvas.height = img.height;
     const finalCtx = finalCanvas.getContext('2d');
     finalCtx.drawImage(canvas, 0, 0, img.width, img.height);
     ```

3. **한글 폰트 렌더링 문제**
   - 원인: 웹 폰트 로딩 타이밍
   - 해결: 폰트 로딩 대기 (FontFace API)
   - 코드:
     ```javascript
     // 웹 폰트 미리 로드
     async function loadFont(fontFamily, fontUrl) {
       const font = new FontFace(fontFamily, `url(${fontUrl})`);
       await font.load();
       document.fonts.add(font);
     }

     // 사용 예
     await loadFont('NanumGothic', 'https://fonts.gstatic.com/...');
     ctx.font = `bold ${fontSize}px NanumGothic`;
     ctx.fillText('한글 워터마크', x, y);

     // 또는 시스템 폰트 사용
     ctx.font = `bold ${fontSize}px 'Malgun Gothic', '맑은 고딕', sans-serif`;
     ```

4. **투명도 설정 후 다른 요소에도 영향**
   - 원인: globalAlpha가 전역 설정
   - 해결: save()/restore() 사용
   - 코드:
     ```javascript
     ctx.save(); // 현재 상태 저장

     ctx.globalAlpha = 0.5; // 투명도 설정
     ctx.fillText(text, x, y);

     ctx.restore(); // 이전 상태 복원

     // 이후 그리기는 투명도 영향 없음
     ctx.fillRect(0, 0, 100, 100); // 불투명
     ```

5. **회전 시 텍스트 잘림**
   - 원인: 회전 중심이 Canvas 원점
   - 해결: translate로 중심 이동 후 회전
   - 코드:
     ```javascript
     ctx.save();

     // 회전 중심으로 이동
     ctx.translate(x, y);

     // 회전
     ctx.rotate(angle * Math.PI / 180);

     // 텍스트 그리기 (0, 0이 회전 중심)
     ctx.textAlign = 'center';
     ctx.textBaseline = 'middle';
     ctx.fillText(text, 0, 0);

     ctx.restore();
     ```

6. **타일링 시 성능 저하**
   - 원인: 수백 개 텍스트 그리기
   - 해결: 타일링 간격 조정 (200px 이상)
   - 해결: 미리 계산된 패턴 사용
   - 코드:
     ```javascript
     // 최적화: 패턴 생성 후 반복
     function createWatermarkPattern(ctx, text, spacing) {
       const patternCanvas = document.createElement('canvas');
       patternCanvas.width = spacing;
       patternCanvas.height = spacing;
       const patternCtx = patternCanvas.getContext('2d');

       patternCtx.font = `bold 48px Arial`;
       patternCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
       patternCtx.rotate(-45 * Math.PI / 180);
       patternCtx.fillText(text, 0, spacing / 2);

       return ctx.createPattern(patternCanvas, 'repeat');
     }

     // 사용
     const pattern = createWatermarkPattern(ctx, text, 200);
     ctx.fillStyle = pattern;
     ctx.fillRect(0, 0, canvas.width, canvas.height);
     ```

7. **로고 이미지 로딩 실패**
   - 원인: CORS 문제, 파일 손상
   - 해결: try-catch로 에러 핸들링
   - 코드:
     ```javascript
     async function loadLogo(file) {
       return new Promise((resolve, reject) => {
         const logo = new Image();

         logo.onload = () => resolve(logo);
         logo.onerror = () => reject(new Error('로고 이미지 로딩 실패'));

         logo.src = URL.createObjectURL(file);

         // 타임아웃 (5초)
         setTimeout(() => {
           reject(new Error('로고 이미지 로딩 시간 초과'));
         }, 5000);
       });
     }

     try {
       const logo = await loadLogo(logoFile);
       addImageWatermark(canvas, logo, options);
     } catch (error) {
       showToast(error.message, 'error');
     }
     ```

8. **일괄 처리 시 메모리 부족**
   - 원인: 대용량 이미지 여러 개 동시 처리
   - 해결: 순차 처리
   - 해결: 메모리 정리
   - 코드:
     ```javascript
     async function batchProcess(files, watermarkOptions) {
       const results = [];

       for (const file of files) {
         try {
           const canvas = await processImage(file, watermarkOptions);
           const blob = await new Promise((resolve) => {
             canvas.toBlob(resolve, 'image/png');
           });

           results.push({ name: file.name, blob });

           // 메모리 정리
           URL.revokeObjectURL(file);

         } catch (error) {
           showToast(`${file.name} 처리 실패: ${error.message}`, 'error');
         }

         // 진행률 업데이트
         updateProgress(results.length / files.length * 100);
       }

       return results;
     }
     ```

9. **워터마크 위치가 이미지마다 다름 (일괄 처리 시)**
   - 원인: 이미지 크기가 다름
   - 해결: 비율 기반 위치 계산
   - 코드:
     ```javascript
     function calculateRelativePosition(canvasWidth, canvasHeight, position) {
       // 비율 기반 (0-1)
       const relativePositions = {
         'top-left': { x: 0.05, y: 0.05 },
         'center': { x: 0.5, y: 0.5 },
         'bottom-right': { x: 0.95, y: 0.95 }
       };

       const rel = relativePositions[position];
       return {
         x: canvasWidth * rel.x,
         y: canvasHeight * rel.y
       };
     }
     ```

10. **그림자 효과가 너무 진함**
    - 원인: 기본 shadowBlur 값이 큼
    - 해결: shadowBlur, shadowColor 조정
    - 코드:
      ```javascript
      // 은은한 그림자
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // 진한 그림자
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ```

## 통합 전략 (이미지 도구와 연계)

### compress.baal.co.kr, resize.baal.co.kr

**워크플로우:**
1. 리사이즈 → 워터마크 추가
2. 워터마크 추가 → 압축

```javascript
// 리사이즈 후 워터마크
const resized = await resizeImage(file, 1920, 1080);
const watermarked = await addWatermark(resized, watermarkOptions);
downloadFile(watermarked, 'final.png');
```

## 추가 기능 (선택사항)

### 1. 워터마크 템플릿 저장

자주 사용하는 설정 저장

```javascript
const template = {
  type: 'text',
  text: 'Copyright 2025',
  fontSize: 48,
  color: '#ffffff',
  opacity: 0.5,
  position: 'bottom-right',
  rotation: 0
};
localStorage.setItem('watermark-template', JSON.stringify(template));
```

### 2. 미리 설정된 프리셋

```javascript
const presets = {
  'copyright': {
    text: '© Your Name',
    position: 'bottom-right',
    opacity: 0.5
  },
  'confidential': {
    text: 'CONFIDENTIAL',
    position: 'center',
    opacity: 0.2,
    rotation: -45,
    tiling: true
  },
  'draft': {
    text: 'DRAFT',
    position: 'center',
    opacity: 0.3,
    fontSize: 72,
    color: '#ff0000'
  }
};
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- README.md 작성
- **경쟁사 분석 완료:**
  - Watermarkly, uMark, Watermark.ws, Visual Watermark, PicMarkr 조사
  - 대부분 제한적 또는 유료, 복잡한 UI
  - 차별화: 완전 무료, 브라우저 기반, 타일링, 일괄 처리
- **라이브러리 조사 완료:**
  - Canvas API (기본) - 충분한 기능
  - Best practices: save/restore, 위치 계산, 폰트 로딩
- **실제 이슈 파악:**
  - 고해상도 처리, 텍스트 품질, 한글 폰트
  - 회전 잘림, 타일링 성능, 메모리 부족
- **UI/UX 패턴:**
  - 4단계 워크플로우 (타입 → 설정 → 업로드 → 다운로드)
  - 9개 위치 선택, 실시간 미리보기
  - 타일링, 그림자 효과

## 참고 자료

- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Canvas Text Rendering - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText)
- [FontFace API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/FontFace)
- [Canvas Transformations - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations)
