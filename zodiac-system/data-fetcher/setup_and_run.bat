@echo off
echo 별자리 운세 데이터 수집 시스템 설정 중...

REM Python 가상환경 생성
if not exist venv (
    echo 가상환경 생성 중...
    python -m venv venv
)

REM 가상환경 활성화
call venv\Scripts\activate

REM 필요한 패키지 설치
echo 필요한 패키지 설치 중...
pip install requests
pip install googletrans==4.0.0rc1
pip install beautifulsoup4
pip install selenium
pip install pandas

REM 데이터 수집 실행
echo.
echo 1. Aztro API 데이터 수집 시작...
python aztro-fetcher.py

echo.
echo 2. 한국 사이트 데이터 수집 시작...
python web-scraper.py

echo.
echo 데이터 수집 완료!
echo 데이터베이스 위치: ..\database\zodiac.db
pause