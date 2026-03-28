# 🛠️ 개발 환경 설정 가이드

## 1. CORS 정책과 로컬 서버의 필요성

### 문제 상황
```javascript
// ❌ 작동하지 않음 (file:// 프로토콜)
fetch('file:///C:/code/rheight/data/blood-types.json')
  .then(res => res.json()) // CORS 에러 발생!

// ✅ 작동함 (http:// 프로토콜)  
fetch('http://localhost:8080/data/blood-types.json')
  .then(res => res.json()) // 정상 작동
```

**원인**: 브라우저 보안 정책상 `file://` 프로토콜에서는 다른 파일을 fetch/XMLHttpRequest로 읽을 수 없음

## 2. 현재 프로젝트 구조와 서버 설정

### 2.1 디렉토리 구조
```
C:/code/rheight/
├── zodiac-system/          # 별자리 테스트 (포트 8080)
│   ├── web/
│   ├── api/
│   └── database/
├── blood-type-system/      # 혈액형 테스트 (포트 8081)
│   ├── web/
│   ├── api/
│   └── database/
└── index.html             # 메인 페이지 (포트 8000)
```

### 2.2 포트 할당 전략
- **8000번**: 메인 인덱스 페이지
- **8080번**: 별자리 테스트 시스템
- **8081번**: 혈액형 테스트 시스템
- **8082번**: 향후 추가 테스트용 예약

## 3. 서버 실행 방법

### 옵션 1: 개별 서버 실행 (추천)
```bash
# 터미널 1: 메인 서버
cd C:/code/rheight
python -m http.server 8000

# 터미널 2: 별자리 시스템
cd C:/code/rheight/zodiac-system
python -m http.server 8080

# 터미널 3: 혈액형 시스템
cd C:/code/rheight/blood-type-system
python -m http.server 8081
```

### 옵션 2: 통합 서버 실행
```bash
# 루트에서 모든 시스템 제공
cd C:/code/rheight
python -m http.server 8000

# 접속 URL
# http://localhost:8000/index.html
# http://localhost:8000/zodiac-system/web/zodiac.html
# http://localhost:8000/blood-type-system/web/blood-type.html
```

## 4. 개발 시 주의사항

### 4.1 경로 설정
```javascript
// ❌ 절대 경로 사용 금지
const API_PATH = 'C:/code/rheight/blood-type-system/api/';

// ✅ 상대 경로 사용
const API_PATH = '../api/';  // web 폴더 기준

// ✅ 또는 서버 루트 기준
const API_PATH = '/blood-type-system/api/';
```

### 4.2 JSON 파일 접근
```javascript
// blood-api.js 예시
class BloodTypeAPI {
    constructor() {
        // 개발 환경에 따라 경로 조정
        this.BASE_PATH = window.location.hostname === 'localhost' 
            ? '/blood-type-system/data/' 
            : '../data/';
    }
    
    async loadData() {
        const response = await fetch(this.BASE_PATH + 'blood-types.json');
        return await response.json();
    }
}
```

### 4.3 크로스 도메인 이슈
```javascript
// 다른 포트 간 통신 시
// 8000번 포트의 index.html에서 8081번 포트 접근
window.open('http://localhost:8081/web/blood-type.html', '_blank');

// CORS 헤더 필요 시 Python 서버 대신 Node.js 사용
// cors-server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static('.'));
app.listen(8081);
```

## 5. 배치 파일로 자동화

### 5.1 start-servers.bat 생성
```batch
@echo off
echo Starting RHEIGHT Development Servers...

:: 메인 서버
start "Main Server" cmd /k "cd /d C:\code\rheight && python -m http.server 8000"

:: 별자리 서버
start "Zodiac Server" cmd /k "cd /d C:\code\rheight\zodiac-system && python -m http.server 8080"

:: 혈액형 서버
start "Blood Type Server" cmd /k "cd /d C:\code\rheight\blood-type-system && python -m http.server 8081"

echo.
echo Servers started:
echo - Main: http://localhost:8000
echo - Zodiac: http://localhost:8080/web/zodiac.html  
echo - Blood Type: http://localhost:8081/web/blood-type.html
echo.
pause
```

### 5.2 PowerShell 버전 (start-servers.ps1)
```powershell
Write-Host "Starting RHEIGHT Development Servers..." -ForegroundColor Green

# 메인 서버
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\code\rheight; python -m http.server 8000"

# 별자리 서버  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\code\rheight\zodiac-system; python -m http.server 8080"

# 혈액형 서버
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\code\rheight\blood-type-system; python -m http.server 8081"

Write-Host "`nServers started:" -ForegroundColor Yellow
Write-Host "- Main: http://localhost:8000" 
Write-Host "- Zodiac: http://localhost:8080/web/zodiac.html"
Write-Host "- Blood Type: http://localhost:8081/web/blood-type.html"
```

## 6. 브라우저 개발자 도구 활용

### 6.1 CORS 에러 확인
```
개발자 도구 (F12) → Console 탭
"Access to fetch at 'file://...' from origin 'null' has been blocked by CORS policy"
→ 로컬 서버 필요!
```

### 6.2 네트워크 요청 확인
```
개발자 도구 → Network 탭
- JSON 파일 로딩 확인
- 404 에러 시 경로 확인
- Response 탭에서 데이터 확인
```

## 7. 트러블슈팅

### 문제 1: 포트 이미 사용 중
```bash
# Windows에서 포트 사용 프로세스 확인
netstat -ano | findstr :8080

# 프로세스 종료
taskkill /PID [프로세스ID] /F
```

### 문제 2: Python 없음
```bash
# Python 설치 확인
python --version

# 없으면 설치
# https://www.python.org/downloads/
```

### 문제 3: 한글 깨짐
```html
<!-- HTML 파일 상단에 추가 -->
<meta charset="UTF-8">
```

```javascript
// JSON 파일 저장 시
// UTF-8 인코딩으로 저장 필수
```

## 8. VS Code 확장 프로그램 추천

### Live Server (추천)
- 설치: `ritwickdey.LiveServer`
- 사용: 우클릭 → "Open with Live Server"
- 장점: 파일 변경 시 자동 새로고침

### 설정 방법
```json
// .vscode/settings.json
{
    "liveServer.settings.port": 8081,
    "liveServer.settings.root": "/blood-type-system",
    "liveServer.settings.file": "web/blood-type.html"
}
```

## 9. 프로덕션 배포 시

### 9.1 상대 경로로 변경
```javascript
// 개발 환경
const API_URL = 'http://localhost:8081/api/';

// 프로덕션
const API_URL = './api/';  // 같은 도메인 가정
```

### 9.2 정적 호스팅 서비스
- GitHub Pages: JSON 파일 직접 서빙 가능
- Netlify: 자동 HTTPS, 커스텀 도메인
- Vercel: Next.js 통합 시 유리

## 10. 즉시 시작 체크리스트

```bash
# 1. 혈액형 시스템 폴더 생성
mkdir C:\code\rheight\blood-type-system
mkdir C:\code\rheight\blood-type-system\web
mkdir C:\code\rheight\blood-type-system\api  
mkdir C:\code\rheight\blood-type-system\data
mkdir C:\code\rheight\blood-type-system\database

# 2. 서버 실행
cd C:\code\rheight\blood-type-system
python -m http.server 8081

# 3. 브라우저 접속
# http://localhost:8081/web/blood-type.html

# 4. 개발 시작!
```

---

**다음 단계**: 이 가이드를 참고하여 개발 환경을 설정하신 후, 혈액형 테스트 구현을 시작하겠습니다.