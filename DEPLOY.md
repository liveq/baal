# BAAL 배포 가이드

## 사전 조건
1. GitHub 계정 복구 (Reinstatement 제출 완료)
2. Google Cloud Console에서 OAuth 클라이언트 생성
3. Cloudflare에 baal.co.kr DNS 설정

## 배포 순서

### 1. GitHub 푸시
```bash
cd C:/aicode/agent_workspace/024_ai_baal
git init
git add -A
git commit -m "BAAL community platform v1.0"
git remote add origin git@github.com:liveq/baal-community.git
git push -u origin main
```

### 2. Go 백엔드 (Railway)
- https://railway.app 접속
- New Project → Deploy from GitHub → baal-community
- Root Directory: backend
- Dockerfile 자동 감지
- 환경변수 설정:
  - PORT=8080
  - SUPABASE_URL=(Supabase 대시보드에서 확인)
  - SUPABASE_SERVICE_KEY=(Supabase 대시보드에서 확인)
  - GEMINI_KEYS=(Google AI Studio에서 발급)
  - CORS_ORIGINS=https://baal.co.kr,https://ai.baal.co.kr

### 3. Next.js 프론트 (Vercel)
- https://vercel.com 접속
- Import Project → baal-community
- Root Directory: frontend
- Framework: Next.js
- 환경변수:
  - NEXT_PUBLIC_API_URL=https://api.baal.co.kr (Railway URL)
  - NEXT_PUBLIC_SUPABASE_URL=(Supabase 대시보드에서 확인)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=(Supabase 대시보드에서 확인)
  - SUPABASE_SERVICE_ROLE_KEY=(Supabase 대시보드에서 확인)

### 4. Cloudflare DNS
- baal.co.kr → Vercel (CNAME: cname.vercel-dns.com)
- api.baal.co.kr → Railway (CNAME: railway 도메인)
- ai.baal.co.kr → Vercel (같은 프로젝트, 커스텀 도메인 추가)
- honey.baal.co.kr → Vercel (꿀단지 별도 프로젝트 또는 같은 프로젝트)

### 5. 서브도메인 리다이렉트 (Cloudflare Rules)
```
split.baal.co.kr/* → 301 → baal.co.kr/tools/split
plan.baal.co.kr/*  → 301 → baal.co.kr/tools/plan
pdf.baal.co.kr/*   → 301 → baal.co.kr/tools/pdf
qr.baal.co.kr/*    → 301 → baal.co.kr/tools/qr
(모든 도구 서브도메인 → baal.co.kr/tools/[id])
```

### 6. Google OAuth 설정
1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보
2. OAuth 2.0 클라이언트 ID 만들기
   - 유형: 웹 애플리케이션
   - 승인된 리다이렉트 URI: https://<SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback
3. 클라이언트 ID/Secret → Supabase Dashboard → Auth → Providers → Google에 입력

### 7. AdSense 신청
- baal.co.kr에 AdSense 코드 삽입 (ca-pub ID는 환경변수로 관리)
- /honeypot 경로는 AdSense 스크립트 제외
- honey.baal.co.kr은 별도 도메인으로 AdSense와 무관

### 8. AI 엔진 배포
- VPS 또는 Railway에 Python 스크립트 배포
- systemd 서비스 등록 또는 Docker 컨테이너
- .env 파일에 GEMINI_KEYS, SUPABASE_URL, SUPABASE_SERVICE_KEY 설정

## 프로젝트 구조
```
024_ai_baal/
├── backend/          # Go (Gin) — Railway
├── frontend/         # Next.js — Vercel
├── ai-engine/        # Python — VPS/Railway
├── tools_repos/      # 도구 원본 (17개)
├── reference/        # SQL, 문서
└── DEPLOY.md         # 이 파일
```
