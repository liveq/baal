# #6 이미지 리사이즈

**URL:** resize.baal.co.kr

## 서비스 내용

이미지 크기 조절 (픽셀/비율 지정). 소셜 미디어 프리셋 제공. 일괄 처리 지원

## 기능 요구사항

- [ ] 이미지 업로드 (드래그 앤 드롭, 다중 파일)
- [ ] 3가지 크기 조절 방식:
  - [ ] 픽셀 지정 (e.g., 1920x1080)
  - [ ] 비율 지정 (e.g., 50%, 200%)
  - [ ] 소셜 미디어 프리셋 (Instagram, Facebook, Twitter, YouTube 등)
- [ ] 종횡비 유지/무시 옵션
- [ ] 미리보기 (전/후 비교)
- [ ] 일괄 처리 (최대 20개 파일)
- [ ] 다운로드 (개별/ZIP)
- [ ] 포맷 유지 (JPEG/PNG/WebP)
- [ ] 품질 설정 (JPEG 압축률)

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **ImageResizer.com** - 가장 인기 있는 리사이즈 도구
   - 강점: 간단한 UI, 빠른 처리, 회원가입 불필요
   - 약점: 고급 기능 부족, 광고 많음

2. **Adobe Express** - 디자인 통합형
   - 강점: Adobe 품질, 다양한 프리셋, 추가 편집 기능
   - 약점: Adobe 계정 필요, 느림

3. **Canva** - 디자인 플랫폼 통합
   - 강점: 소셜 미디어 템플릿 풍부, 디자인과 결합
   - 약점: Canva 생태계에 종속, 단순 리사이즈엔 과함

4. **iLoveIMG** - 이미지 도구 통합
   - 강점: 다양한 이미지 도구 제공, 일괄 처리 우수
   - 약점: 무료는 파일 크기 제한 (15MB)

5. **Kapwing** - 비디오/이미지 통합
   - 강점: 비디오와 이미지 통합 편집
   - 약점: 무료는 워터마크 추가

### 우리의 차별화 전략

- ✅ **3가지 방식** - 픽셀/비율/프리셋 모두 지원
- ✅ **소셜 미디어 프리셋** - Instagram, Facebook, Twitter, YouTube 등 10+ 프리셋
- ✅ **완전 무료** - 제한 없음, 워터마크 없음
- ✅ **고품질 알고리즘** - imageSmoothingQuality + pica 옵션
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **통합 탭** - 압축/변환/업스케일과 연결

## 주요 라이브러리

### 옵션 1: Canvas API (기본 권장)

빠르고 가벼운 리사이징

```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = newWidth;
canvas.height = newHeight;

// 품질 설정 필수!
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high'; // 'low', 'medium', 'high'

ctx.drawImage(image, 0, 0, newWidth, newHeight);

// 포맷 및 품질 지정
const blob = await new Promise(resolve => {
  canvas.toBlob(resolve, 'image/jpeg', 0.9); // 0.9 = 90% 품질
});
```

**특징:**
- ✅ 빠름 (1초 이내)
- ✅ 메모리 효율적
- ✅ 모든 브라우저 지원
- ✅ 품질: ⭐⭐⭐ (일반적으로 충분)
- ⚠️ 큰 확대 시 품질 저하

### 옵션 2: pica (고품질 옵션)

Lanczos 필터 기반 최고 품질 리사이징

```html
<script src="https://cdn.jsdelivr.net/npm/pica@9.0.1/dist/pica.min.js"></script>
```

```javascript
import pica from 'pica';

const picaInstance = pica();
const canvas = document.createElement('canvas');
canvas.width = newWidth;
canvas.height = newHeight;

await picaInstance.resize(sourceCanvas, canvas, {
  quality: 3,        // 0 (fastest) ~ 3 (slowest, best quality)
  alpha: true,       // PNG 투명도 유지
  unsharpAmount: 80, // 선명도 강화 (0-500)
  unsharpRadius: 0.6,
  unsharpThreshold: 2
});
```

**특징:**
- ✅ 품질: ⭐⭐⭐⭐⭐ (최고)
- ✅ 다운스케일 우수 (큰 이미지 → 작게)
- ⚠️ 느림 (2-3초)
- ⚠️ 메모리 더 많이 사용

**사용 권장:**
- 기본: Canvas API (빠름, 충분한 품질)
- 고급 옵션: pica (고품질 모드 토글)

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  이미지 리사이즈                  │
│  이미지 크기 조절, 소셜 미디어 최적화│
├─────────────────────────────────┤
│  크기 조절 방식:                  │
│  ● [픽셀] ○ [비율] ○ [프리셋]     │
│                                 │
│  ┌─ 픽셀 모드 ─┐                │
│  │ 너비: [1920] px              │
│  │ 높이: [1080] px              │
│  │ ☑ 종횡비 유지                 │
│  └─────────────┘                │
│                                 │
│  ┌─ 비율 모드 ─┐                │
│  │ 배율: [50]%                  │
│  └─────────────┘                │
│                                 │
│  ┌─ 프리셋 모드 ─┐              │
│  │ [Instagram 정사각형 (1080x1080)]│
│  │ [Instagram 세로 (1080x1350)] │
│  │ [Facebook 커버 (820x312)]    │
│  │ [YouTube 썸네일 (1280x720)]  │
│  └─────────────┘                │
├─────────────────────────────────┤
│  🖼️ 드래그 앤 드롭 영역            │
│  또는 클릭하여 파일 선택 (최대 20개)│
├─────────────────────────────────┤
│  미리보기:                        │
│  [원본: 3000x2000]               │
│  [결과: 1920x1280]               │
├─────────────────────────────────┤
│  품질: [━━━━●─] 90%              │
│  (JPEG만 해당)                   │
├─────────────────────────────────┤
│  [다운로드] [ZIP 다운로드]        │
└─────────────────────────────────┘
```

### 소셜 미디어 프리셋 (10+ 종류)

**Instagram:**
- 정사각형: 1080x1080
- 세로: 1080x1350
- 스토리: 1080x1920

**Facebook:**
- 프로필 사진: 180x180
- 커버 사진: 820x312
- 게시물: 1200x630

**Twitter (X):**
- 헤더: 1500x500
- 게시물: 1600x900

**YouTube:**
- 썸네일: 1280x720
- 채널 아트: 2560x1440

**LinkedIn:**
- 프로필 사진: 400x400
- 배너: 1584x396

### 주요 기능 순서

1. 파일 업로드 (드래그 또는 클릭, 최대 20개)
2. 크기 조절 방식 선택 (픽셀/비율/프리셋)
3. 종횡비 유지 옵션
4. 품질 설정 (JPEG만)
5. 미리보기 (전/후 비교)
6. 다운로드 (개별 또는 ZIP)

## 난이도 & 예상 기간

- **난이도:** 보통 (Canvas API 기본, 프리셋 관리)
- **예상 기간:** 2일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1 오전: UI 구성, 파일 업로드, 3가지 모드 전환
- [ ] Day 1 오후: Canvas API 리사이징, 종횡비 계산, 미리보기
- [ ] Day 2 오전: 소셜 미디어 프리셋 10종, 품질 설정
- [ ] Day 2 오후: ZIP 다운로드, 최적화, 테스트

## 트래픽 예상

⭐⭐⭐ 높음 - "이미지 리사이즈, 사진 크기 조절" 검색량 매우 높음

## SEO 키워드

- 이미지 리사이즈
- 사진 크기 조절
- 이미지 크기 변경
- 소셜 미디어 이미지 크기
- Instagram 이미지 크기
- 무료 이미지 리사이즈
- 일괄 리사이즈

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & 실무 이슈 기반)

1. **큰 이미지 축소 시 품질 저하 (계단 현상)**
   - 원인: Canvas API의 단순 보간법
   - 해결: imageSmoothingQuality = 'high' 필수
   - 해결: 대용량 축소 시 pica 사용 (선택적)
   - 코드:
     ```javascript
     // 기본 방법
     ctx.imageSmoothingEnabled = true;
     ctx.imageSmoothingQuality = 'high';

     // 고품질 옵션 (토글)
     if (highQualityMode) {
       const picaInstance = pica();
       await picaInstance.resize(from, to, {
         quality: 3,
         unsharpAmount: 80
       });
     }
     ```

2. **종횡비 계산 오류 (비율 깨짐)**
   - 원인: width와 height를 독립적으로 설정
   - 해결: 한 쪽 기준으로 다른 쪽 자동 계산
   - 코드:
     ```javascript
     function calculateAspectRatio(originalWidth, originalHeight, newWidth, newHeight, maintainRatio) {
       if (!maintainRatio) {
         return { width: newWidth, height: newHeight };
       }

       const ratio = originalWidth / originalHeight;

       if (newWidth && !newHeight) {
         return { width: newWidth, height: Math.round(newWidth / ratio) };
       } else if (!newWidth && newHeight) {
         return { width: Math.round(newHeight * ratio), height: newHeight };
       } else {
         // 둘 다 지정된 경우, 더 작은 쪽에 맞춤
         const widthRatio = newWidth / originalWidth;
         const heightRatio = newHeight / originalHeight;
         const finalRatio = Math.min(widthRatio, heightRatio);
         return {
           width: Math.round(originalWidth * finalRatio),
           height: Math.round(originalHeight * finalRatio)
         };
       }
     }
     ```

3. **JPEG 품질 손실 (재압축)**
   - 원인: toBlob 기본 품질 0.92
   - 해결: 품질 슬라이더 제공 (0.7-1.0)
   - 해결: PNG는 무손실 유지
   - 코드:
     ```javascript
     const quality = document.getElementById('quality-slider').value / 100; // 0.9

     canvas.toBlob((blob) => {
       downloadFile(blob, 'resized.jpg');
     }, 'image/jpeg', quality);

     // PNG는 품질 파라미터 무시됨
     canvas.toBlob((blob) => {
       downloadFile(blob, 'resized.png');
     }, 'image/png'); // 품질 파라미터 불필요
     ```

4. **PNG 투명 배경 손실 (검은색으로 변환)**
   - 원인: Canvas 기본 배경이 검은색
   - 해결: alpha 채널 유지, toBlob에 'image/png' 명시
   - 코드:
     ```javascript
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d', { alpha: true }); // alpha 활성화

     canvas.width = newWidth;
     canvas.height = newHeight;

     // 배경 클리어 (투명하게)
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     ctx.drawImage(image, 0, 0, newWidth, newHeight);

     // PNG로 출력
     canvas.toBlob((blob) => {
       downloadFile(blob, 'resized.png');
     }, 'image/png');
     ```

5. **메모리 부족 (다중 파일 처리 시 브라우저 크래시)**
   - 원인: 대용량 이미지 여러 개 동시 처리
   - 해결: 파일 개수 제한 (최대 20개)
   - 해결: 파일 크기 제한 (개당 10MB)
   - 해결: 순차 처리 + 이전 Canvas 정리
   - 코드:
     ```javascript
     const MAX_FILES = 20;
     const MAX_SIZE = 10 * 1024 * 1024; // 10MB

     async function processFiles(files) {
       if (files.length > MAX_FILES) {
         showToast(`최대 ${MAX_FILES}개 파일만 처리 가능합니다.`, 'error');
         return;
       }

       for (const file of files) {
         if (file.size > MAX_SIZE) {
           showToast(`${file.name}이(가) 너무 큽니다. (최대 10MB)`, 'error');
           continue;
         }

         const result = await resizeImage(file);
         results.push(result);

         // 메모리 정리
         URL.revokeObjectURL(file);
       }
     }
     ```

6. **소셜 미디어 프리셋 크기 불일치 (2025년 기준 변경)**
   - 원인: 플랫폼별로 권장 크기 자주 변경
   - 해결: 2025년 최신 크기로 업데이트
   - 해결: 프리셋 데이터 JSON으로 관리
   - 코드:
     ```javascript
     const SOCIAL_PRESETS = {
       instagram: {
         square: { width: 1080, height: 1080, name: 'Instagram 정사각형' },
         portrait: { width: 1080, height: 1350, name: 'Instagram 세로' },
         story: { width: 1080, height: 1920, name: 'Instagram 스토리' }
       },
       facebook: {
         profile: { width: 180, height: 180, name: 'Facebook 프로필' },
         cover: { width: 820, height: 312, name: 'Facebook 커버' },
         post: { width: 1200, height: 630, name: 'Facebook 게시물' }
       },
       youtube: {
         thumbnail: { width: 1280, height: 720, name: 'YouTube 썸네일' },
         channelArt: { width: 2560, height: 1440, name: 'YouTube 채널 아트' }
       }
     };
     ```

7. **비율 입력 시 소수점 처리 (50.5% 등)**
   - 원인: 소수점 계산 오류
   - 해결: Math.round()로 정수 변환
   - 코드:
     ```javascript
     function resizeByPercentage(originalWidth, originalHeight, percentage) {
       const scale = percentage / 100;
       return {
         width: Math.round(originalWidth * scale),
         height: Math.round(originalHeight * scale)
       };
     }
     ```

## 통합 전략 (다른 이미지 도구와 연결)

### compress.baal.co.kr, convert.baal.co.kr, upscale.baal.co.kr

**탭 추가:**
```html
<div class="mode-tabs">
  <button class="tab" data-mode="compress">압축</button>
  <button class="tab active" data-mode="resize">리사이즈</button>
  <button class="tab" data-mode="convert">변환</button>
  <button class="tab" data-mode="upscale">업스케일</button>
</div>
```

**리사이즈 탭 클릭 시:**
```javascript
if (mode === 'resize') {
  document.getElementById('tool-container').innerHTML = renderResizeUI();
  // 3가지 모드 선택 표시 (픽셀/비율/프리셋)
  // 소셜 미디어 프리셋 표시
}
```

### resize.baal.co.kr

**메인 모드: 리사이즈**
**탭: [리사이즈] [압축] [변환] [업스케일]**

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - ImageResizer.com, Adobe Express, Canva, iLoveIMG, Kapwing 조사
  - 대부분 회원가입 필요 또는 제한적
  - 차별화: 완전 무료, 3가지 방식, 소셜 미디어 프리셋
- **라이브러리 조사 완료:**
  - Canvas API (기본) - 빠름, 충분한 품질
  - pica (고급 옵션) - 최고 품질, 느림
  - Best practices: imageSmoothingQuality, 종횡비 유지, 투명도 처리
- **실제 이슈 파악:**
  - 품질 저하, 종횡비 계산 오류, JPEG 재압축
  - PNG 투명도 손실, 메모리 부족, 프리셋 업데이트 필요
- **UI/UX 패턴:**
  - 3가지 모드 (픽셀/비율/프리셋)
  - 소셜 미디어 프리셋 10+ 종류
  - 미리보기, 품질 슬라이더, ZIP 다운로드

## 참고 자료

- [Canvas imageSmoothingQuality - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality)
- [pica GitHub](https://github.com/nodeca/pica)
- [Social Media Image Sizes 2025](https://sproutsocial.com/insights/social-media-image-sizes-guide/)
