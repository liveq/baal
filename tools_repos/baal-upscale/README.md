# #20 AI 이미지 업스케일러

**URL:** upscale.baal.co.kr

## 서비스 내용

AI로 이미지 해상도 향상. 스피드 모드(pica) + AI 모드(UpscalerJS). 디테일 복원

## 기능 요구사항

- [ ] 이미지 업로드 (드래그 앤 드롭)
- [ ] 2가지 모드 선택:
  - [ ] 🚀 스피드 모드 (pica) - 빠름, 모바일 OK
  - [ ] 🤖 AI 모드 (UpscalerJS) - 고품질, 데스크톱 권장
- [ ] 배율 선택 (2x, 3x, 4x)
- [ ] 이미지 크기 제한 (AI 모드: 512x512 이하)
- [ ] 전/후 비교 (미리보기)
- [ ] 진행률 표시 (AI 모드)
- [ ] 다운로드 (개별/일괄)
- [ ] 모바일 감지 (AI 모드 비활성화)

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **Waifu2x** - 무료 AI 업스케일러 (애니메이션 특화)
   - 강점: 완전 무료, 제한 없음, 서버 처리
   - 약점: 일반 사진 품질 보통, 대기 시간

2. **Bigjpg** - AI 업스케일러
   - 강점: 품질 최고, 일반 사진 우수
   - 약점: 무료는 월 5장 (1200x1200 이하)

3. **Upscale.media** - 프리미엄 AI 업스케일
   - 강점: 품질 최고
   - 약점: 완전 유료

4. **Let's Enhance** - AI 이미지 향상
   - 강점: 다양한 AI 모델
   - 약점: 무료 제한 심함

5. **ImageResizer.com** - 통합 도구
   - 강점: 압축/리사이즈/업스케일 통합
   - 약점: AI 아님 (단순 확대)

### 우리의 차별화 전략

- ✅ **2가지 모드** - 스피드(빠름) vs AI(고품질)
- ✅ **완전 무료** - 제한 없음
- ✅ **브라우저 AI** - 서버 불필요, 프라이버시
- ✅ **다크모드** 지원
- ✅ **한/영 전환**
- ✅ **통합 탭** - 압축/리사이즈/변환과 연결

## 주요 라이브러리

### 옵션 1: pica (스피드 모드) - 기본 권장

고품질 리사이징 (AI 아님)

```html
<script src="https://cdn.jsdelivr.net/npm/pica@9.0.1/dist/pica.min.js"></script>
```

```javascript
import pica from 'pica';

const picaInstance = pica();
const canvas = document.createElement('canvas');
canvas.width = img.width * scale;
canvas.height = img.height * scale;

await picaInstance.resize(img, canvas, {
  quality: 3,  // 최고 품질
  alpha: true, // 투명 배경 유지
  unsharpAmount: 80,   // 선명도 강화
  unsharpRadius: 0.6,
  unsharpThreshold: 2
});
```

**특징:**
- ✅ 빠름 (1-2초)
- ✅ 메모리 적게 씀 (100-200MB)
- ✅ 모바일 OK
- ✅ 품질: ⭐⭐⭐ (AI보다 낮지만 실용적)
- ✅ 안정적

### 옵션 2: UpscalerJS (AI 모드) - 고급 사용자용

AI 기반 초해상도

```html
<script src="https://cdn.jsdelivr.net/npm/upscaler@1.0.0-beta.19/dist/upscaler.min.js"></script>
```

```javascript
import Upscaler from 'upscaler';

const upscaler = new Upscaler({
  model: 'esrgan-legacy',  // 또는 'esrgan-thick', 'esrgan-thin'
  patchSize: 64,  // 필수! 메모리 폭발 방지
  padding: 10
});

// 진행률 콜백
const result = await upscaler.upscale(image, {
  progress: (percent) => {
    updateProgressBar(percent);
  }
});
```

**특징:**
- ✅ 품질: ⭐⭐⭐⭐ (AI 디테일 복원)
- ❌ 느림 (10-40초)
- ❌ 메모리 많이 씀 (500MB-1GB)
- ❌ **이미지 크기 제한: 512x512 이하**
- ⚠️ 모바일 비추천 (크래시 위험)

**사용 조건:**
```javascript
// 크기 제한 체크
if (img.width > 512 || img.height > 512) {
  showToast('AI 모드는 512x512 이하 이미지만 지원합니다.', 'error');
  return;
}

// 모바일 감지
if (isMobile()) {
  showToast('모바일에서는 스피드 모드를 사용하세요.', 'warning');
  disableAIMode();
}
```

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  AI 이미지 업스케일러              │
│  해상도를 높이고 디테일 복원        │
├─────────────────────────────────┤
│  모드 선택:                       │
│  🚀 [스피드 모드] (권장)           │
│     빠른 처리, 모든 기기 지원      │
│                                 │
│  🤖 [AI 모드] (고급)              │
│     고품질, 512x512 이하만        │
├─────────────────────────────────┤
│  배율: [2x] [3x] [4x]            │
├─────────────────────────────────┤
│  🖼️ 드래그 앤 드롭 영역            │
│  또는 클릭하여 파일 선택           │
├─────────────────────────────────┤
│  미리보기:                        │
│  [원본] [결과]                   │
│  500x500 → 2000x2000           │
├─────────────────────────────────┤
│  [다운로드]                       │
└─────────────────────────────────┘
```

### 주요 기능 순서

1. 모드 선택 (스피드/AI)
2. 파일 업로드 (드래그 또는 클릭)
3. 크기 검증 (AI 모드: 512x512 제한)
4. 배율 선택 (2x, 3x, 4x)
5. 업스케일 처리 (진행률 표시)
6. 전/후 비교 (슬라이더)
7. 다운로드

## 난이도 & 예상 기간

- **난이도:** 어려움 (AI 통합, 메모리 관리)
- **예상 기간:** 7일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1: UI 구성, 모드 선택, 파일 업로드
- [ ] Day 2: pica 통합 (스피드 모드)
- [ ] Day 3-4: UpscalerJS 통합 (AI 모드)
- [ ] Day 5: 크기 제한, 모바일 감지, 경고
- [ ] Day 6: 진행률 표시, 전/후 비교
- [ ] Day 7: 최적화, 테스트, 버그 수정

## 트래픽 예상

⭐⭐⭐ 높음 - "AI 업스케일, 이미지 화질 개선" 검색량 매우 높음

## SEO 키워드

- AI 이미지 업스케일
- 이미지 화질 개선
- 사진 해상도 향상
- 이미지 고화질 변환
- 무료 AI 업스케일러
- 이미지 선명하게

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 & 라이브러리 이슈 기반)

1. **UpscalerJS 메모리 폭발 (1GB+)**
   - 원인: 고해상도 이미지를 한 번에 처리
   - 해결: `patchSize: 64` 필수 (이미지를 작은 조각으로)
   - 해결: 이미지 크기 제한 (512x512 이하)
   - 코드:
     ```javascript
     if (img.width > 512 || img.height > 512) {
       showToast('AI 모드는 512x512 이하 이미지만 지원합니다.', 'error');
       return;
     }

     const upscaler = new Upscaler({
       patchSize: 64,  // 필수!
       padding: 10
     });
     ```

2. **AI 모드 처리 시간 길어서 사용자 이탈**
   - 원인: 10-40초 소요
   - 해결: 진행률 표시 (%)
   - 해결: "처리 중..." 메시지
   - 해결: 취소 버튼 제공
   - 코드:
     ```javascript
     const result = await upscaler.upscale(image, {
       progress: (percent) => {
         document.getElementById('progress').textContent = `${Math.round(percent * 100)}%`;
       }
     });
     ```

3. **모바일에서 브라우저 크래시**
   - 원인: 메모리 부족
   - 해결: 모바일 감지 후 AI 모드 비활성화
   - 해결: 경고 메시지 표시
   - 코드:
     ```javascript
     function isMobile() {
       return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
     }

     if (isMobile()) {
       document.getElementById('ai-mode').disabled = true;
       showToast('모바일에서는 스피드 모드만 사용 가능합니다.', 'warning');
     }
     ```

4. **WebGL context lost 에러**
   - 원인: GPU 메모리 부족
   - 해결: 이전 작업 메모리 정리
   - 코드:
     ```javascript
     // 이전 텐서 메모리 해제
     if (previousResult) {
       previousResult.dispose();
     }
     ```

5. **pica 결과가 AI만큼 선명하지 않음**
   - 원인: 알고리즘 한계
   - 해결: unsharpAmount 조절 (선명도 강화)
   - 코드:
     ```javascript
     await picaInstance.resize(from, to, {
       quality: 3,
       unsharpAmount: 80,    // 선명도 강화
       unsharpRadius: 0.6,
       unsharpThreshold: 2
     });
     ```

6. **UpscalerJS 모델 로딩 시간 (20-30초)**
   - 원인: 모델 파일 크기 (20-100MB)
   - 해결: 로딩 시 스피너 표시
   - 해결: 모델 캐싱 (localStorage)
   - 코드:
     ```javascript
     showLoading('AI 모델 로딩 중... (최초 1회, 20-30초)');
     const upscaler = new Upscaler();
     await upscaler.warmup(); // 미리 로딩
     hideLoading();
     ```

## 통합 전략 (다른 이미지 도구와 연결)

### compress.baal.co.kr, resize.baal.co.kr, convert.baal.co.kr

**탭 추가:**
```html
<div class="mode-tabs">
  <button class="tab" data-mode="compress">압축</button>
  <button class="tab" data-mode="resize">리사이즈</button>
  <button class="tab" data-mode="convert">변환</button>
  <button class="tab" data-mode="upscale">업스케일 ⭐ NEW</button>
</div>
```

**업스케일 탭 클릭 시:**
```javascript
if (mode === 'upscale') {
  document.getElementById('tool-container').innerHTML = renderUpscaleUI();
  // 모드 선택 표시 (스피드/AI)
}
```

### upscale.baal.co.kr

**메인 모드: 업스케일**
**탭: [업스케일] [압축] [리사이즈] [변환]**

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - Waifu2x, Bigjpg, Upscale.media, Let's Enhance 조사
  - 대부분 유료 또는 제한적
  - 차별화: 완전 무료, 브라우저 AI, 2가지 모드
- **라이브러리 조사 완료:**
  - pica (스피드 모드) - 안정적, 빠름, 추천
  - UpscalerJS (AI 모드) - 고품질, 제한적, 고급 사용자용
  - Best practices: patchSize, 크기 제한, 모바일 감지
- **실제 이슈 파악:**
  - GitHub Issue #174: 대용량 이미지 크래시
  - 메모리 사용량: 1GB+
  - WebGL context loss
  - 처리 시간: 10-40초
- **UI/UX 패턴:**
  - 2가지 모드 선택 (스피드 권장, AI 고급)
  - 진행률 표시, 취소 버튼
  - 전/후 비교 슬라이더
  - 모바일 경고

## 참고 자료

- [pica GitHub](https://github.com/nodeca/pica)
- [UpscalerJS 공식 문서](https://upscalerjs.com/)
- [UpscalerJS GitHub](https://github.com/thekevinscott/UpscalerJS)
- [UpscalerJS Issue #174 - Memory](https://github.com/thekevinscott/UpscalerJS/issues/174)
