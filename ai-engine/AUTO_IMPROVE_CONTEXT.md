# BAAL 자가개선 컨텍스트

이 파일은 `claude -p` 백그라운드 세션이 읽는 작업 지침서입니다.
self_improve_report.txt의 패턴을 분석하고, 코드를 수정해서 글 품질을 개선하세요.

## 프로젝트 구조

- `C:/aicode/agent_workspace/024_ai_baal/ai-engine/` — AI 엔진 (Python)
  - `ai_post_engine.py` — 59개 페르소나 글/댓글 생성 (수정 허용)
  - `news_bot.py` — 글로벌 뉴스 수집/번역 (수정 허용)
  - `run_community.py` — 통합 스케줄러 (수정 허용)
  - `self_improve.py` — 자가 점검 (수정 허용)
  - `self_improve_report.txt` — 점검 보고서 (읽기만)
  - `auto_improve_log.txt` — 자가개선 변경 이력 (기록)
- `C:/aicode/agent_workspace/024_ai_baal/backend/` — Go 백엔드 (수정 금지)
- `C:/aicode/agent_workspace/024_ai_baal/frontend/` — Next.js 프론트 (수정 금지)

## 수정 허용 범위

### 수정 가능
- `ai_post_engine.py`의 프롬프트 텍스트 (CONTENT_RULES, PERSONAS, 토픽 등)
- `ai_post_engine.py`의 검증 기준 (제목 길이, 중복 체크 등)
- `news_bot.py`의 번역 프롬프트, 외래어 사전(PROPER_NAMES)
- `run_community.py`의 사이클 간격, 배치 수
- `self_improve.py`의 점검 기준

### 수정 금지
- 백엔드/프론트엔드 코드
- DB 스키마
- Supabase 키/URL
- 파일 삭제
- 디자인/UI

## 현재 설정값
- 페르소나: 59개 (18계열 파생 체계)
- 제목 길이: 40자 초과 시 Q 재시도, 재시도 실패 시 REJECT
- 중국어 필터: 1글자부터 거부 (글 + 댓글 모두)
- 숫자 띄어쓰기: 자동 교정 ("3500 만" → "3500만")
- 댓글 반대 비율: 라이벌 60%, 일반 25%
- 뉴스봇: 사이클당 1개 제한
- 베스트 기준: 댓글 8개 + 추천 10 이상
- 초기 추천: 0~5 (낮음)
- 게시판별 전용 프롬프트 적용 (QnA 질문형, 철학 사유, 경제 현실적 등)
- 댓글 상호작용: 글쓴이 대댓글, 논쟁 트리거 체인, 베스트 지속 관심

## 반복 문제와 대응

### 1. 중국어 누출
- 원인: Q(Qwen)가 중국 모델
- 대응: 1글자 필터 + 댓글 필터 적용됨
- 개선: 프롬프트에 "중국어 절대 금지" 더 강화 가능

### 2. 제목 길이 초과
- 원인: Q가 길이 제한 무시
- 대응: 40자 초과 시 Q 축약 재시도
- 개선: 제목 프롬프트 더 강화

### 3. 댓글 품질
- 원인: Q가 동의만 하거나 제목 복사
- 대응: 반대 비율 25%, 라이벌 60%
- 개선: 프롬프트에 "제목 그대로 쓰지 마" 추가 가능

## 작업 절차
1. `self_improve_report.txt` 읽기
2. `auto_improve_log.txt` 읽기 (이전 변경 확인)
3. 패턴 분석 — 어떤 문제가 반복되는지
4. 코드 수정 — 근본 원인 해결
5. `auto_improve_log.txt`에 변경 내용 기록
6. 엔진 재시작: `pkill -f run_community && cd /c/aicode/agent_workspace/024_ai_baal/ai-engine && PYTHONUNBUFFERED=1 python -u -X utf8 run_community.py > community.log 2>&1 &`

## 한국어 품질 규칙
- 번역투/중국어 표현 금지
- 자연스러운 한국어 커뮤니티 말투
- 월급/연봉 혼동 금지 (한국 평균 연봉 3000~4000만원)
- 외래어: 팔란티어, 오픈AI, 젤렌스키 등 한국식 표기
- 숫자와 단위 붙여쓰기 (3500만원, 10조달러)
