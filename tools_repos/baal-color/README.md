# #8 색상 변환기

> ⚠️ **개발 시작 전 필독!**
> 전역 개발 가이드: [`../_template/README.md`](../_template/README.md)
> Phase 1 버그, 체크리스트, 크로스 프로모션 도구 버튼 구현 확인 필수!

**URL:** color.baal.co.kr

## 서비스 내용

HEX↔RGB↔HSL 변환. 팔레트 생성 (유사색, 보색). 색상 피커. 디자이너/개발자용

## 기능 요구사항

- [ ] 6가지 변환:
  - [ ] HEX → RGB, HSL
  - [ ] RGB → HEX, HSL
  - [ ] HSL → RGB, HEX
- [ ] 색상 피커 (input type="color")
- [ ] 팔레트 자동 생성:
  - [ ] 유사색 (Analogous)
  - [ ] 보색 (Complementary)
  - [ ] 삼각색 (Triadic)
  - [ ] 사각색 (Tetradic)
  - [ ] 단색 (Monochromatic)
- [ ] 미리보기 (큰 색상 박스)
- [ ] 복사 버튼 (HEX, RGB, HSL 각각)
- [ ] 색상 히스토리 (최근 10개)
- [ ] 색상 명 표시 (e.g., "Red", "Blue")
- [ ] WCAG 접근성 대비 검사

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **ColorHexa** - 가장 상세한 색상 정보
   - 강점: 색상 정보 매우 상세, 팔레트 다양, 색상 이름
   - 약점: UI가 복잡, 너무 많은 정보

2. **Coolors** - 팔레트 생성기
   - 강점: 아름다운 UI, 팔레트 생성 우수, 공유 기능
   - 약점: 단순 변환보다 팔레트에 집중

3. **Adobe Color** - 디자이너 전문
   - 강점: Adobe 품질, 다양한 색 조화 규칙, 커뮤니티
   - 약점: Adobe 계정 필요, 느림

4. **HTML Color Codes** - 간단한 변환기
   - 강점: 빠르고 간단, 색상 차트 제공
   - 약점: 고급 기능 부족, 광고 많음

5. **Canva Color Palette Generator** - 이미지 기반
   - 강점: 이미지에서 팔레트 추출
   - 약점: 단순 변환에는 과함, Canva 생태계 종속

### 우리의 차별화 전략

- ✅ **3가지 포맷 동시 변환** - HEX, RGB, HSL 한 번에
- ✅ **5가지 팔레트 규칙** - 유사색, 보색, 삼각색, 사각색, 단색
- ✅ **WCAG 접근성 검사** - 텍스트 대비 자동 체크
- ✅ **색상 이름 표시** - "Red", "Blue" 등 친숙한 이름
- ✅ **히스토리 기능** - 최근 사용 색상 저장
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **완전 무료** - 제한 없음

## 주요 라이브러리

### 옵션 1: 순수 JavaScript (기본 권장)

수학 공식으로 변환

```javascript
// HEX → RGB
function hexToRgb(hex) {
  // #RRGGBB 형식
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// RGB → HEX
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// RGB → HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic (gray)
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// HSL → RGB
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
```

**특징:**
- ✅ 빠름 (즉시)
- ✅ 라이브러리 불필요
- ✅ 가벼움
- ✅ 정확한 변환
- ⚠️ 팔레트 생성은 별도 로직 필요

### 옵션 2: color.js (고급 기능용)

```html
<script src="https://cdn.jsdelivr.net/npm/color@4.2.3/dist/color.min.js"></script>
```

```javascript
import Color from 'color';

// 간단한 변환
const color = Color('#FF5733');
console.log(color.rgb().string());  // rgb(255, 87, 51)
console.log(color.hsl().string());  // hsl(14, 100%, 60%)

// 팔레트 생성
const complementary = color.rotate(180); // 보색
const analogous1 = color.rotate(30);      // 유사색 1
const analogous2 = color.rotate(-30);     // 유사색 2

// 명도 조절
const lighter = color.lighten(0.2);
const darker = color.darken(0.2);

// 채도 조절
const saturate = color.saturate(0.2);
const desaturate = color.desaturate(0.2);
```

**특징:**
- ✅ 편리한 API
- ✅ 팔레트 생성 쉬움
- ✅ 색상 조작 기능 많음
- ⚠️ 라이브러리 필요 (30KB)

**권장 조합:**
- 기본 변환: 순수 JS (빠름)
- 팔레트 생성: color.js 또는 순수 JS로 직접 구현

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────────────┐
│  색상 변환기                             │
│  HEX, RGB, HSL 변환 및 팔레트 생성       │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │  색상 미리보기 (큰 박스)         │   │
│  │  #FF5733                        │   │
│  │  Flame (색상 이름)               │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  HEX:  [#FF5733      ] [복사]          │
│  RGB:  [255, 87, 51  ] [복사]          │
│  HSL:  [14°, 100%, 60%] [복사]         │
│  피커: [🎨] ← 클릭하여 색상 선택        │
├─────────────────────────────────────────┤
│  팔레트 생성:                            │
│  [유사색] [보색] [삼각색] [사각색] [단색]│
│                                         │
│  ┌─────┬─────┬─────┬─────┬─────┐      │
│  │     │     │     │     │     │      │
│  │ #1  │ #2  │ #3  │ #4  │ #5  │      │
│  └─────┴─────┴─────┴─────┴─────┘      │
├─────────────────────────────────────────┤
│  WCAG 접근성:                            │
│  ✅ 흰색 텍스트: AA (4.5:1)             │
│  ✅ 검은색 텍스트: AAA (7.1:1)          │
├─────────────────────────────────────────┤
│  최근 사용 색상:                         │
│  [□][□][□][□][□][□][□][□][□][□]       │
└─────────────────────────────────────────┘
```

### 팔레트 규칙 (Color Harmony)

**유사색 (Analogous):**
- 기준색 ± 30° (색상환)
- 예: 0°, 30°, 60°

**보색 (Complementary):**
- 기준색 + 180°
- 예: 0°, 180°

**삼각색 (Triadic):**
- 기준색 + 120° + 240°
- 예: 0°, 120°, 240°

**사각색 (Tetradic):**
- 기준색 + 90° + 180° + 270°
- 예: 0°, 90°, 180°, 270°

**단색 (Monochromatic):**
- 같은 색상, 명도만 변경
- 예: 명도 80%, 60%, 40%, 20%

### 주요 기능 순서

1. 색상 입력 (HEX, RGB, HSL 중 하나)
2. 자동 변환 (나머지 포맷으로)
3. 미리보기 업데이트
4. 팔레트 규칙 선택 (선택사항)
5. 팔레트 생성 및 표시
6. 복사 또는 히스토리 저장

## 난이도 & 예상 기간

- **난이도:** 쉬움 (수학 공식 구현)
- **예상 기간:** 1일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] 오전: UI 구성, 색상 피커, 미리보기
- [ ] 오후 1: HEX↔RGB↔HSL 변환 로직 (순수 JS)
- [ ] 오후 2: 팔레트 생성 5가지 규칙
- [ ] 오후 3: 접근성 검사, 히스토리, 색상 이름

## 트래픽 예상

⭐⭐ 중간 - 디자이너, 개발자 타겟 (특정 니즈)

## SEO 키워드

- HEX RGB 변환
- 색상 코드 변환
- 색상 변환기
- Color Converter
- 컬러 피커
- RGB to HEX
- HEX to RGB
- 색상 팔레트 생성

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & 실무 이슈 기반)

1. **HEX 입력 검증 부족 (잘못된 형식 입력 시 에러)**
   - 원인: #RRGGBB 형식 외 입력
   - 해결: 정규식 검증 + 자동 수정
   - 코드:
     ```javascript
     function validateHex(hex) {
       // # 자동 추가
       if (!hex.startsWith('#')) {
         hex = '#' + hex;
       }

       // 3자리 → 6자리 변환 (#F00 → #FF0000)
       if (/^#[0-9A-F]{3}$/i.test(hex)) {
         hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
       }

       // 검증
       if (!/^#[0-9A-F]{6}$/i.test(hex)) {
         throw new Error('올바른 HEX 형식이 아닙니다 (예: #FF5733)');
       }

       return hex.toUpperCase();
     }
     ```

2. **RGB 값 범위 초과 (255 초과, 음수)**
   - 원인: 사용자 입력 검증 없음
   - 해결: 범위 제한 (0-255)
   - 코드:
     ```javascript
     function validateRgb(r, g, b) {
       const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
       return {
         r: clamp(r),
         g: clamp(g),
         b: clamp(b)
       };
     }
     ```

3. **HSL 변환 시 반올림 오류 (재변환 시 값 달라짐)**
   - 원인: 소수점 처리
   - 해결: 일관된 반올림 규칙
   - 코드:
     ```javascript
     // HSL 값 항상 정수로 반올림
     function normalizeHsl(h, s, l) {
       return {
         h: Math.round(h) % 360, // 0-359
         s: Math.max(0, Math.min(100, Math.round(s))), // 0-100
         l: Math.max(0, Math.min(100, Math.round(l)))  // 0-100
       };
     }
     ```

4. **팔레트 색상이 눈에 잘 안 보임 (대비 부족)**
   - 원인: 자동 생성된 색상이 너무 비슷
   - 해결: 명도 조절 추가
   - 코드:
     ```javascript
     function generateAnalogousPalette(baseHue) {
       return [
         hslToRgb(baseHue, 80, 60),        // 기준
         hslToRgb((baseHue + 30) % 360, 80, 50),  // 조금 어둡게
         hslToRgb((baseHue - 30 + 360) % 360, 80, 70) // 조금 밝게
       ];
     }
     ```

5. **색상 이름 표시 안 됨 (HEX만 보면 알기 어려움)**
   - 원인: 색상 이름 데이터베이스 없음
   - 해결: 기본 색상 이름 맵 사용
   - 코드:
     ```javascript
     const COLOR_NAMES = {
       '#FF0000': 'Red (빨강)',
       '#00FF00': 'Green (초록)',
       '#0000FF': 'Blue (파랑)',
       '#FFFF00': 'Yellow (노랑)',
       '#FF00FF': 'Magenta (마젠타)',
       '#00FFFF': 'Cyan (시안)',
       '#000000': 'Black (검정)',
       '#FFFFFF': 'White (하양)',
       // ... 140개 기본 색상 이름
     };

     function getColorName(hex) {
       // 정확히 일치
       if (COLOR_NAMES[hex]) {
         return COLOR_NAMES[hex];
       }

       // 가장 가까운 색상 찾기
       let minDistance = Infinity;
       let closestName = '';

       for (const [colorHex, name] of Object.entries(COLOR_NAMES)) {
         const distance = colorDistance(hex, colorHex);
         if (distance < minDistance) {
           minDistance = distance;
           closestName = name;
         }
       }

       return `~${closestName}`;
     }

     function colorDistance(hex1, hex2) {
       const rgb1 = hexToRgb(hex1);
       const rgb2 = hexToRgb(hex2);
       return Math.sqrt(
         Math.pow(rgb1.r - rgb2.r, 2) +
         Math.pow(rgb1.g - rgb2.g, 2) +
         Math.pow(rgb1.b - rgb2.b, 2)
       );
     }
     ```

6. **WCAG 접근성 대비 계산 오류**
   - 원인: 상대 휘도 계산 잘못됨
   - 해결: WCAG 2.1 공식 정확히 구현
   - 코드:
     ```javascript
     // WCAG 2.1 상대 휘도 계산
     function getLuminance(r, g, b) {
       const [rs, gs, bs] = [r, g, b].map(val => {
         val /= 255;
         return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
       });
       return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
     }

     // 대비 비율 계산
     function getContrastRatio(hex1, hex2) {
       const rgb1 = hexToRgb(hex1);
       const rgb2 = hexToRgb(hex2);
       const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
       const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

       const lighter = Math.max(lum1, lum2);
       const darker = Math.min(lum1, lum2);

       return (lighter + 0.05) / (darker + 0.05);
     }

     // 접근성 등급
     function getAccessibilityRating(ratio) {
       if (ratio >= 7) return 'AAA';
       if (ratio >= 4.5) return 'AA';
       if (ratio >= 3) return 'AA Large';
       return 'Fail';
     }
     ```

7. **복사 버튼 누를 때마다 형식 다름 (일관성 부족)**
   - 원인: HEX, RGB, HSL 형식 통일 안 됨
   - 해결: 표준 형식 정의
   - 코드:
     ```javascript
     function formatColor(type, color) {
       switch (type) {
         case 'hex':
           return color.toUpperCase(); // #FF5733
         case 'rgb':
           return `rgb(${color.r}, ${color.g}, ${color.b})`;
         case 'hsl':
           return `hsl(${color.h}°, ${color.s}%, ${color.l}%)`;
         default:
           return '';
       }
     }
     ```

## 추가 기능 (선택사항)

### 이미지에서 색상 추출

```javascript
function extractColorsFromImage(imageFile) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // 색상 카운트
    const colorMap = {};
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const hex = rgbToHex(r, g, b);
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    // 상위 5개 색상
    const topColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hex]) => hex);

    return topColors;
  };

  img.src = URL.createObjectURL(imageFile);
}
```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - ColorHexa, Coolors, Adobe Color, HTML Color Codes 조사
  - 대부분 기본 변환만 제공 또는 복잡함
  - 차별화: 3가지 포맷 동시, 5가지 팔레트, 접근성 검사
- **라이브러리 조사 완료:**
  - 순수 JS (기본) - 빠름, 정확
  - color.js (선택) - 편리, 팔레트 쉬움
  - Best practices: 입력 검증, 반올림, 색상 이름, WCAG
- **실제 이슈 파악:**
  - HEX 검증, RGB 범위, HSL 반올림
  - 팔레트 대비, 색상 이름, 접근성 계산
- **UI/UX 패턴:**
  - 미리보기, 3가지 포맷 동시 표시
  - 5가지 팔레트 규칙, 히스토리

## 참고 자료

- [RGB to HSL - CSS Tricks](https://css-tricks.com/converting-color-spaces-in-javascript/)
- [WCAG 2.1 Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Theory](https://www.colormatters.com/color-and-design/basic-color-theory)
- [color.js GitHub](https://github.com/Qix-/color)
- [HTML Color Names](https://htmlcolorcodes.com/color-names/)
