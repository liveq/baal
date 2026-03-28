# #5 QR 코드 생성기

**URL:** qr.baal.co.kr

## 서비스 내용

URL, 텍스트, 연락처 QR 코드 생성. 색상/로고 커스터마이징

## 기능 요구사항

- [ ] URL → QR 코드 변환
- [ ] 텍스트 → QR 코드
- [ ] 연락처 정보 → QR 코드 (vCard)
- [ ] WiFi 정보 → QR 코드
- [ ] 색상 커스터마이징 (전경/배경)
- [ ] 로고/이미지 삽입 (중앙)
- [ ] 크기 조절
- [ ] PNG/SVG 다운로드
- [ ] QR 코드 미리보기
- [ ] Error correction level 선택

## 경쟁사 분석 (2025년 기준)

### 인기 사이트 TOP 5

1. **QRCode Monkey** - 가장 인기 있는 QR 코드 생성기
   - 강점: 완전 무료, 로고 지원, 영구 유효
   - 약점: UI가 다소 복잡

2. **Adobe Express** - 디자인 통합형
   - 강점: Adobe 제품 연동, 스타일링 우수
   - 약점: Adobe 계정 필요

3. **Canva** - 디자인 플랫폼 통합
   - 강점: 다양한 디자인과 결합 가능
   - 약점: Canva 생태계에 종속

4. **QRCodeChimp** - 비즈니스용
   - 강점: 분석 기능, 동적 QR 코드
   - 약점: 고급 기능 유료

5. **goQR.me** - 심플한 UI
   - 강점: 빠르고 간단, 상업적 사용 가능
   - 약점: 커스터마이징 제한적

### 우리의 차별화 전략

- ✅ **간단한 UI** - 3단계로 완성 (입력 → 커스터마이징 → 다운로드)
- ✅ **고급 커스터마이징** (색상, 로고, 스타일)
- ✅ **다크모드 지원**
- ✅ **한/영 전환**
- ✅ **WiFi QR 지원** (경쟁사 일부만 지원)
- ✅ **회원가입 불필요**

## 주요 라이브러리

### 옵션 1: qr-code-styling (추천!)

가장 강력한 커스터마이징 라이브러리

```html
<script src="https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>
```

```javascript
const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: "https://baal.co.kr",
    image: "logo.png", // 로고
    dotsOptions: {
        color: "#d4af37",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
});
```

### 옵션 2: qrcode.js (간단 버전)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

```javascript
new QRCode(document.getElementById("qrcode"), {
    text: "https://baal.co.kr",
    width: 256,
    height: 256,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
```

## UI/UX 디자인 패턴

### 화면 구성

```
┌─────────────────────────────────┐
│  QR 코드 생성기                   │
│  무료로 QR 코드 만들기             │
├─────────────────────────────────┤
│ 1️⃣ 콘텐츠 입력                   │
│ 타입: [URL] [텍스트] [WiFi]       │
│ URL: [https://example.com     ] │
├─────────────────────────────────┤
│ 2️⃣ 커스터마이징 (선택사항)         │
│ 색상: [⚫ 전경] [⚪ 배경]          │
│ 스타일: [사각] [둥근] [점]         │
│ 로고: [📤 업로드]                 │
├─────────────────────────────────┤
│ 3️⃣ 미리보기                       │
│      ┌───────┐                  │
│      │ QR    │                  │
│      │ CODE  │                  │
│      └───────┘                  │
│                                 │
│ [PNG 다운로드] [SVG 다운로드]     │
└─────────────────────────────────┘
```

### QR 코드 타입별 입력 필드

**URL:**
- URL 입력 필드

**텍스트:**
- 텍스트 에리어

**WiFi:**
- SSID (네트워크 이름)
- 비밀번호
- 암호화 방식 (WPA/WEP/없음)

**vCard (연락처):**
- 이름
- 전화번호
- 이메일
- 회사

## 난이도 & 예상 기간

- **난이도:** 쉬움
- **예상 기간:** 1일
- **실제 기간:** (작업 후 기록)

## 개발 일정

- [ ] 오전: UI 구성, 입력 필드 (URL, 텍스트, WiFi)
- [ ] 오후: QR 생성, 커스터마이징 (색상, 로고), 다운로드

## 트래픽 예상

⭐⭐⭐ 높음 - "QR 코드 생성" 검색량 매우 높음

## SEO 키워드

- QR 코드 생성
- QR 코드 만들기
- 무료 QR 생성기
- URL QR 코드
- WiFi QR 코드
- QR 코드 로고

## 이슈 & 해결방안

### 실제 문제점 (경쟁사 분석 기반)

1. **로고 삽입 시 QR 코드 인식 실패**
   - 원인: 로고가 너무 큼
   - 해결: 로고 크기 QR 전체의 20-30% 이내 제한
   - 해결: Error correction level을 H(30%)로 설정
   - 코드:
     ```javascript
     imageOptions: {
       margin: 20,  // 로고 주변 여백
       imageSize: 0.3  // 전체의 30%
     }
     ```

2. **커스텀 색상 사용 시 스캔 불가**
   - 원인: 대비(contrast) 부족
   - 해결: 명도 차이 최소 50% 유지
   - 해결: 색상 선택 시 경고 메시지 표시
   - 코드:
     ```javascript
     // 명도 계산
     function getLuminance(hex) {
       // WCAG 기준 명도 계산
     }
     ```

3. **긴 URL 입력 시 QR 코드 복잡도 증가**
   - 원인: 데이터 길이 증가
   - 해결: URL 단축 서비스 제안 (선택사항)
   - 해결: 복잡도 경고 (200자 이상)

4. **SVG 다운로드 시 로고 이미지 누락**
   - 원인: crossOrigin 문제
   - 해결: `crossOrigin: "anonymous"` 설정
   - 해결: base64로 로고 변환

5. **WiFi QR 코드 포맷 오류**
   - 원인: 특수문자 이스케이프 필요
   - 해결: WiFi QR 전용 포맷 사용
   - 코드:
     ```javascript
     const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};;`;
     ```

## 개발 로그

### 2025-10-25
- 프로젝트 폴더 생성
- **경쟁사 분석 완료:**
  - QRCode Monkey, Adobe Express, Canva, QRCodeChimp, goQR.me 조사
  - 차별화: 간단한 UI, 고급 커스터마이징, WiFi QR
- **라이브러리 조사 완료:**
  - qr-code-styling (추천) - 최고의 커스터마이징
  - qrcode.js (간단 버전)
  - Best practices: margin, error correction, contrast
- **UI/UX 패턴 조사:**
  - 3단계 워크플로우 (입력 → 커스터마이징 → 다운로드)
  - 타입별 입력 필드
  - 실시간 미리보기
