# #4 이미지 압축기

**URL:** compress.baal.co.kr

## 서비스 내용

JPG/PNG/WebP 이미지 용량 줄이기. 품질 조절 가능. SEO 최고

## 기능 요구사항

- [ ] 이미지 업로드 (드래그 앤 드롭)
- [ ] 다중 파일 업로드
- [ ] 포맷 지원: JPG, PNG, WebP
- [ ] 품질 조절 슬라이더 (0-100%)
- [ ] 압축 전후 용량 비교
- [ ] 압축률 표시
- [ ] 일괄 다운로드 (ZIP)
- [ ] 개별 다운로드

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **TinyPNG** - 가장 많이 사용되는 이미지 압축 사이트
   - 강점: 스마트 압축 기술, 품질 유지하면서 용량 대폭 감소
   - 약점: PNG 중심, 품질 조절 불가

2. **iLoveIMG** - 다기능 이미지 편집 툴
   - 강점: 압축 외 다양한 기능 (크기 조정, 변환 등)
   - 약점: 기능 많아서 복잡할 수 있음

3. **CompressJPEG** - 간단한 UI
   - 강점: 한 번에 20개 이미지 압축, JPG/PNG/PDF 지원
   - 약점: 기능 제한적

4. **Compressor.io** - 다양한 포맷 지원
   - 강점: JPG, PNG, GIF, SVG, WebP 5가지 포맷
   - 약점: 속도 느림

5. **이미지프레소 (한국)** - 국내 서비스
   - 강점: 한글 지원, 50-70% 압축률
   - 약점: 국내 전용

### 우리의 차별화 전략

- ✅ **품질 조절 가능** (프리셋 + 슬라이더)
- ✅ **빠른 처리** (Web Worker 사용)
- ✅ **전/후 비교** (미리보기)
- ✅ **압축률 표시** (% 및 용량)
- ✅ **일괄 ZIP 다운로드**
- ✅ **다크모드** (경쟁사 대부분 미지원)

## 주요 라이브러리

- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)

```html
<script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js"></script>
```

### 라이브러리 설정 (Best Practices)

```javascript
const options = {
  maxSizeMB: 1,              // 최대 1MB
  maxWidthOrHeight: 1920,    // 최대 해상도
  useWebWorker: true,        // 논블로킹 압축 (필수!)
  fileType: 'image/jpeg',    // 출력 포맷
  initialQuality: 0.8        // 품질 (0-1)
};

imageCompression(file, options)
  .then(compressedFile => {
    console.log('압축 완료:', compressedFile);
  });
```

### 지원 포맷

- ✅ JPEG
- ✅ PNG
- ✅ WebP
- ✅ BMP

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  이미지 압축기                    │
│  무료로 이미지 용량 줄이기         │
├─────────────────────────────────┤
│                                 │
│   🖼️ 드래그 앤 드롭 영역          │
│   또는 클릭하여 파일 선택          │
│                                 │
├─────────────────────────────────┤
│ 압축 옵션:                        │
│ ⚙️ [최대] [높음] [중간] [낮음]    │
│ 또는 슬라이더로 세부 조절          │
├─────────────────────────────────┤
│ 파일 목록:                        │
│ 📄 image1.jpg (2.5MB → 800KB)   │
│    압축률: 68% ▼                 │
│ 📄 image2.png (1.2MB → 400KB)   │
│    압축률: 67% ▼                 │
├─────────────────────────────────┤
│ [개별 다운로드] [전체 ZIP 다운로드] │
└─────────────────────────────────┘
```

### 주요 기능 순서

1. 파일 업로드 (드래그 또는 클릭)
2. 압축 옵션 선택 (프리셋 또는 슬라이더)
3. 자동 압축 시작 (Web Worker)
4. 진행률 표시 (%)
5. 전/후 비교 (용량, 압축률)
6. 다운로드 (개별 또는 ZIP)

## 난이도 & 예상 기간

- **난이도:** 쉬움
- **예상 기간:** 2일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] Day 1 오전: UI 구성 (드롭존, 옵션 선택)
- [ ] Day 1 오후: 파일 업로드, 미리보기
- [ ] Day 2 오전: 압축 기능 (browser-image-compression)
- [ ] Day 2 오후: 다운로드 (개별/ZIP), 최적화

## 트래픽 예상

⭐⭐⭐ 높음 - "이미지 압축" 검색량 매우 높음

## SEO 키워드

- 이미지 압축
- 사진 용량 줄이기
- JPG 압축
- PNG 압축
- 무료 이미지 압축

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 기반)

1. **대용량 파일 처리 시 브라우저 멈춤**
   - 원인: 메인 스레드에서 압축 처리
   - 해결: `useWebWorker: true` 설정 (필수!)
   - 해결: 진행률 표시로 사용자 안심
   - 코드:
     ```javascript
     const options = { useWebWorker: true };
     ```

2. **메모리 부족으로 브라우저 크래시**
   - 원인: 고해상도 이미지 다중 처리
   - 해결: 파일당 10MB 제한 (dropzone 옵션)
   - 해결: 한 번에 최대 20개 파일
   - 해결: `maxWidthOrHeight: 1920` 설정

3. **OffscreenCanvas 미지원 브라우저 (IE 등)**
   - 원인: 구형 브라우저
   - 해결: 자동으로 메인 스레드로 폴백
   - 해결: core-js polyfill 추가 (선택사항)
   - 참고: browser-image-compression이 자동 처리

4. **PNG 투명 배경이 검은색으로 변환**
   - 원인: JPEG로 변환 시 투명 채널 손실
   - 해결: PNG는 PNG로 유지, JPEG만 JPEG로
   - 코드:
     ```javascript
     const fileType = file.type; // 원본 포맷 유지
     ```

5. **압축 후 오히려 용량 증가 (특정 케이스)**
   - 원인: 이미 고도로 압축된 이미지
   - 해결: 압축 전/후 비교해서 작은 것 선택
   - 코드:
     ```javascript
     if (compressedFile.size < file.size) {
       return compressedFile;
     } else {
       return file; // 원본 사용
     }
     ```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- README.md 작성
- **경쟁사 분석 완료:**
  - TinyPNG, iLoveIMG, CompressJPEG, Compressor.io, 이미지프레소 조사
  - 차별화 전략: 품질 조절, 빠른 처리, 다크모드
- **라이브러리 조사 완료:**
  - browser-image-compression best practices 확인
  - useWebWorker, maxSizeMB, maxWidthOrHeight 필수 옵션
- **UI/UX 패턴 조사:**
  - 드래그 앤 드롭 + 프리셋 + 슬라이더
  - 전/후 비교, 압축률 표시
  - 개별/ZIP 다운로드
