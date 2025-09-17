@echo off
echo ===============================================
echo    별자리 운세 시스템 로컬 서버 실행
echo ===============================================
echo.

rem 현재 디렉토리를 zodiac-system으로 변경
cd /d "%~dp0"

echo [INFO] 현재 위치: %CD%
echo.

rem Python 버전 확인
echo [INFO] Python 버전 확인 중...
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python이 설치되지 않았거나 PATH에 설정되지 않았습니다.
    echo [INFO] Python 3.x를 설치하고 PATH에 추가해주세요.
    pause
    exit /b 1
)

python --version
echo.

rem 필요한 파일 존재 여부 확인
echo [INFO] 필수 파일 확인 중...
if not exist "api\fortune-data.json" (
    echo [ERROR] fortune-data.json 파일이 없습니다.
    echo [INFO] api 폴더에 fortune-data.json 파일이 있는지 확인해주세요.
    pause
    exit /b 1
)

if not exist "api\zodiac-api-real.js" (
    echo [ERROR] zodiac-api-real.js 파일이 없습니다.
    pause
    exit /b 1
)

if not exist "debug-test.html" (
    echo [ERROR] debug-test.html 파일이 없습니다.
    pause
    exit /b 1
)

echo [SUCCESS] 필수 파일들이 모두 존재합니다.
echo.

rem 포트 설정
set PORT=8080
echo [INFO] 서버 포트: %PORT%
echo.

rem 서버 실행 전 안내
echo [INFO] 서버 실행 중...
echo [INFO] 브라우저에서 다음 URL로 접속하세요:
echo.
echo     메인 테스트 페이지:
echo     http://localhost:8080/debug-test.html
echo.
echo     기존 운세 페이지:
echo     http://localhost:8080/web/zodiac.html
echo.
echo     API 테스트:
echo     http://localhost:8080/api/fortune-data.json
echo.
echo [INFO] 서버를 중지하려면 Ctrl+C를 누르세요.
echo.
echo ===============================================

rem 브라우저 자동 실행 (5초 후)
echo [INFO] 5초 후 브라우저가 자동으로 열립니다...
timeout /t 5 /nobreak >nul

rem 브라우저 실행
start http://localhost:8080/debug-test.html

rem Python HTTP 서버 실행
echo [INFO] Python HTTP 서버 시작...
echo.
python -m http.server 8080

rem 서버 종료 시 메시지
echo.
echo [INFO] 서버가 종료되었습니다.
pause
