#!/bin/bash

echo "==============================================="
echo "   별자리 운세 시스템 로컬 서버 실행"
echo "==============================================="
echo

# 현재 디렉토리를 zodiac-system으로 변경
cd "$(dirname "$0")"

echo "[INFO] 현재 위치: $(pwd)"
echo

# Python 버전 확인
echo "[INFO] Python 버전 확인 중..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[ERROR] Python이 설치되지 않았거나 PATH에 설정되지 않았습니다."
    echo "[INFO] Python 3.x를 설치해주세요."
    exit 1
fi

# Python 명령어 결정
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

$PYTHON_CMD --version
echo

# 필요한 파일 존재 여부 확인
echo "[INFO] 필수 파일 확인 중..."
if [ ! -f "api/fortune-data.json" ]; then
    echo "[ERROR] fortune-data.json 파일이 없습니다."
    echo "[INFO] api 폴더에 fortune-data.json 파일이 있는지 확인해주세요."
    exit 1
fi

if [ ! -f "api/zodiac-api-real.js" ]; then
    echo "[ERROR] zodiac-api-real.js 파일이 없습니다."
    exit 1
fi

if [ ! -f "debug-test.html" ]; then
    echo "[ERROR] debug-test.html 파일이 없습니다."
    exit 1
fi

echo "[SUCCESS] 필수 파일들이 모두 존재합니다."
echo

# 포트 설정
PORT=8080
echo "[INFO] 서버 포트: $PORT"
echo

# 서버 실행 전 안내
echo "[INFO] 서버 실행 중..."
echo "[INFO] 브라우저에서 다음 URL로 접속하세요:"
echo
echo "    메인 테스트 페이지:"
echo "    http://localhost:$PORT/debug-test.html"
echo
echo "    기존 운세 페이지:"
echo "    http://localhost:$PORT/web/zodiac.html"
echo
echo "    API 테스트:"
echo "    http://localhost:$PORT/api/fortune-data.json"
echo
echo "[INFO] 서버를 중지하려면 Ctrl+C를 누르세요."
echo
echo "==============================================="

# 브라우저 자동 실행 (macOS/Linux)
echo "[INFO] 5초 후 브라우저가 자동으로 열립니다..."
sleep 5

# 운영체제별 브라우저 실행
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:$PORT/debug-test.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:$PORT/debug-test.html" 2>/dev/null
fi

# Python HTTP 서버 실행
echo "[INFO] Python HTTP 서버 시작..."
echo
$PYTHON_CMD -m http.server $PORT

# 서버 종료 시 메시지
echo
echo "[INFO] 서버가 종료되었습니다."
