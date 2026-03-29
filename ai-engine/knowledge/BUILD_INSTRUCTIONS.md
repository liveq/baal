# RAG 지식 체계 구축 지침

## 설계 문서
C:\Users\user\.claude\projects\C--aicode-agent-workspace-024-ai-baal-ai-engine\memory\project_rag_design.md

## 작업 디렉토리
C:\aicode\agent_workspace\024_ai_baal\ai-engine\knowledge\

## 디렉토리 구조 (생성 완료)
```
knowledge/
  static/          ← 정적 (역사, 과학, 철학 등)
  semi_static/     ← 분기 갱신 (사회, 경제, IT)
  dynamic/         ← 주간 갱신 (시사, 환율)
  dictionaries/    ← 고유명사, 팩트, 금지패턴 사전
  validation/      ← 검증 로그, 커버리지
  backup/          ← 버전 백업
```

## 청크 JSON 포맷
```json
{
  "id": "B-042",
  "category": "B_한국역사",
  "subcategory": "현대사",
  "title": "제주 4·3 사건",
  "content": "내용...",
  "source": "ko.wikipedia.org/wiki/...",
  "source_section": "개요",
  "keywords": ["제주", "4·3"],
  "tier": "common",
  "updated": "2026-03-29",
  "confidence": "verified"
}
```

## 11개 대분류
- A: 한국사회 → semi_static/korea_society.json
- B: 한국역사 → static/history.json
- C: 세계/국제 → semi_static/world.json
- D: 과학/기술 → static/science.json
- E: 인문/철학 → static/philosophy.json
- F: 문화/예술 → static/culture.json
- G: 생활/실용 → semi_static/living.json
- H: IT/디지털 → semi_static/tech.json
- I: 군사/안보 → static/military.json
- J: 신비/오컬트 → static/occult.json
- K: 시사/뉴스팩트 → dynamic/weekly_facts.json

## 소스별 수집 방법
1. Wikidata SPARQL (인증 불필요): https://query.wikidata.org/sparql
2. ConceptNet (인증 불필요): https://api.conceptnet.io
3. 위키피디아 덤프 (인증 불필요): dumps.wikimedia.org/kowiki/
4. 공공데이터포털 (API 키 필요 — 아직 없음, 나중에)

## 가공 원칙
- 원문 왜곡 금지 (요약/축약 하지 않음)
- 섹션 단위 분할 (문장 중간 자르기 금지)
- 출처(source, source_section) 반드시 보존
- 중국어/일본어 혼입 금지
- confidence 필드 필수

## 구축 순서
1. dictionaries/ 먼저 (proper_names.json, facts.json, banned.json)
2. Wikidata SPARQL로 A, C 카테고리 팩트 수집
3. ConceptNet으로 공통 상식 수집
4. 위키 덤프 다운로드 (백그라운드, 2~3GB)
5. 위키 덤프 파싱 → 카테고리별 필터 → 청크화
6. validator.py로 전체 검증
7. loader.py로 엔진 연동

## 검증 체크리스트
- [ ] 모든 청크에 필수 필드 있음
- [ ] 중복 id 없음
- [ ] 각 카테고리 필수 토픽 포함
- [ ] 동일 주제 청크 간 수치 모순 없음
- [ ] 중국어/일본어 혼입 없음
