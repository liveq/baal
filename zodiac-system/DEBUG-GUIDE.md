# 별자리 운세 시스템 디버그 가이드

## 📋 개요

별자리 운세 시스템의 문제를 해결하기 위해 다음과 같은 디버그 도구들이 추가되었습니다:

1. **상세한 로그 시스템** - 콘솔에서 데이터 로드 과정을 실시간으로 확인
2. **디버그 테스트 페이지** - 브라우저에서 시각적으로 시스템 상태 확인
3. **로컬 서버 실행 스크립트** - 원클릭으로 테스트 환경 구축

## 🚀 빠른 시작

### Windows 사용자
```bash
# zodiac-system 폴더에서
start-server.bat
```

### Linux/Mac 사용자
```bash
# zodiac-system 폴더에서
./start-server.sh
```

## 📁 파일 구조

```
zodiac-system/
├── api/
│   ├── zodiac-api-real.js     # 로그가 추가된 API (수정됨)
│   └── fortune-data.json      # 운세 데이터
├── web/
│   ├── zodiac.html           # 기존 운세 페이지
│   ├── zodiac.js
│   └── zodiac.css
├── debug-test.html           # 디버그 테스트 페이지 (신규)
├── start-server.bat          # Windows 서버 실행 스크립트 (신규)
├── start-server.sh           # Linux/Mac 서버 실행 스크립트 (신규)
└── DEBUG-GUIDE.md           # 이 파일 (신규)
```

## 🔧 추가된 기능

### 1. zodiac-api-real.js 로그 개선

#### loadFortuneData() 함수
- ✅ fetch 요청 시작/완료 로그
- ✅ Response 상태 코드, URL 정보
- ✅ JSON 파싱 과정 로그
- ✅ 로드된 데이터 구조 분석 (키 개수, 존재 여부)
- ✅ 첫 번째 샘플 데이터 출력
- ✅ 오류 발생 시 상세한 에러 정보

#### getDailyFortune() 함수
- ✅ 함수 호출 파라미터 로그
- ✅ 오늘 날짜 데이터 존재 여부 확인
- ✅ 폴백 로직 실행 과정 상세 로그
- ✅ 최종 반환 데이터 출력
- ✅ 각 단계별 성공/실패 상태 표시

### 2. debug-test.html 디버그 페이지

#### 주요 기능
- 🖥️ **실시간 콘솔 출력** - 브라우저에서 콘솔 로그 확인
- 📊 **시스템 상태 확인** - API 인스턴스 및 데이터 상태
- 📁 **JSON 직접 로드 테스트** - fetch API로 fortune-data.json 직접 접근
- 🌟 **운세 기능 테스트** - 개별/전체 별자리 운세 테스트
- 🛤️ **경로 테스트** - 다양한 경로로 JSON 파일 접근 테스트

#### 테스트 항목
1. **시스템 상태 확인**
   - zodiacAPI 인스턴스 존재 여부
   - fortuneData 로드 상태
   - 데이터 구조 분석

2. **데이터 로드 테스트**
   - 직접 JSON 로드 (fetch API)
   - API를 통한 데이터 로드
   - 로드된 데이터 구조 시각화

3. **운세 기능 테스트**
   - 선택한 별자리의 일일 운세
   - 모든 별자리(1~12) 운세 일괄 테스트
   - 결과 데이터 상세 표시

4. **경로 테스트**
   - `api/fortune-data.json`
   - `./api/fortune-data.json`
   - `../api/fortune-data.json`
   - `/api/fortune-data.json`

### 3. 서버 실행 스크립트

#### start-server.bat (Windows)
- Python 설치 여부 자동 확인
- 필수 파일 존재 여부 검증
- 포트 8080으로 HTTP 서버 실행
- 5초 후 브라우저 자동 실행
- 종료 시 안내 메시지

#### start-server.sh (Linux/Mac)
- Python3/Python 자동 감지
- 필수 파일 존재 여부 검증
- 크로스 플랫폼 브라우저 실행 지원
- 실행 권한 자동 설정

## 🐛 문제 해결 가이드

### 1. JSON 로드 실패 시

#### 증상
- 콘솔에서 "fetch 실패" 메시지
- 디버그 페이지에서 "JSON 로드 실패" 표시

#### 해결책
1. **파일 경로 확인**
   ```
   zodiac-system/api/fortune-data.json 파일이 존재하는지 확인
   ```

2. **서버 실행 여부 확인**
   ```
   http://localhost:8080/api/fortune-data.json 직접 접속하여 JSON 데이터 확인
   ```

3. **CORS 오류인 경우**
   ```
   파일:// 프로토콜이 아닌 http:// 프로토콜로 접속하여 테스트
   ```

### 2. 운세 데이터가 표시되지 않을 때

#### 증상
- 운세 정보가 "N/A"로 표시
- 기본 생성 데이터만 반환

#### 확인 사항
1. **콘솔 로그 확인**
   ```javascript
   // 브라우저 개발자 도구(F12) -> Console 탭에서 확인
   - "Fortune data loaded successfully" 메시지 여부
   - 데이터 구조 분석 결과
   - getDailyFortune 실행 과정
   ```

2. **데이터 구조 확인**
   ```javascript
   // 콘솔에서 직접 확인
   console.log(zodiacAPI.fortuneData.daily);
   ```

### 3. 브라우저 호환성 문제

#### 지원 브라우저
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

#### 오래된 브라우저 사용 시
- ES6 fetch API 미지원 가능성
- Promise 문법 미지원 가능성

## 📊 로그 해석 가이드

### loadFortuneData() 로그
```
🔄 loadFortuneData() 시작
📁 시도할 경로: ../api/fortune-data.json
🌐 fetch 요청 시작...
📊 Response 상태: {status: 200, statusText: "OK", ok: true, url: "..."}
📄 JSON 파싱 시작...
✅ Fortune data loaded successfully!
📋 데이터 구조 분석:
- daily 키 개수: 90
- yearly 키 존재: false
- weekly 키 존재: false
- monthly 키 존재: false
- compatibility 키 존재: false
```

### getDailyFortune() 로그
```
🌟 getDailyFortune() 호출됨
📝 요청 파라미터: {zodiacId: 1, zodiacIdType: "number"}
📅 오늘 날짜: 2025-09-08
🔍 오늘 날짜 데이터 확인...
- today 키 존재: false
⚠️ 오늘 날짜 데이터 없음, 폴백 로직 시작...
📋 사용 가능한 날짜들: ['2025-01-01', '2025-01-02', ...] ... (총 90개)
🎯 찾는 월/일: 9/8
🔍 같은 월일 데이터 검색 중...
📅 같은 일자 발견: 2025-01-08
✅ 폴백 데이터 발견!
📤 최종 반환 데이터 (폴백): {...}
```

## 🔗 유용한 링크

### 테스트 페이지
- **메인 디버그 페이지**: http://localhost:8080/debug-test.html
- **기존 운세 페이지**: http://localhost:8080/web/zodiac.html
- **API 데이터**: http://localhost:8080/api/fortune-data.json

### 브라우저 개발자 도구
- **Chrome**: F12 또는 Ctrl+Shift+I
- **Firefox**: F12 또는 Ctrl+Shift+I
- **Safari**: Cmd+Option+I (개발자 메뉴 활성화 필요)

## 📞 추가 지원

문제가 지속될 경우 다음 정보를 함께 제공해주세요:

1. **브라우저 콘솔 로그** (전체 복사)
2. **사용 중인 브라우저** 및 버전
3. **운영체제** 정보
4. **오류 발생 시점** 및 재현 단계
5. **디버그 페이지 스크린샷**

---

*마지막 업데이트: 2025-09-08*