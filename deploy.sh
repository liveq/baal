#!/bin/bash
# BAAL 배포 스크립트
# GitHub 복구 후 실행

echo "=== BAAL 배포 ==="

# 1. Git init + push
cd C:/aicode/agent_workspace/024_ai_baal
git init
git add -A
git commit -m "BAAL community platform v1.0"
git remote add origin git@github.com:liveq/baal-community.git
git push -u origin main

# 2. Frontend: Vercel
echo "Vercel 배포: https://vercel.com/new 에서 연결"
echo "  - Framework: Next.js"
echo "  - Root: frontend/"
echo "  - Build: next build"
echo "  - Env: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"

# 3. Backend: Railway or Render
echo "Go 배포: railway.app 또는 render.com"
echo "  - Dockerfile: backend/Dockerfile"
echo "  - Env: PORT, SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_KEYS, CORS_ORIGINS"

# 4. Domain
echo "Cloudflare DNS:"
echo "  baal.co.kr -> Vercel"
echo "  api.baal.co.kr -> Railway/Render (Go)"
echo "  ai.baal.co.kr -> CNAME to baal.co.kr (같은 Next.js)"

# 5. Subdomain redirects
echo "서브도메인 리다이렉트 (Cloudflare Rules):"
echo "  split.baal.co.kr -> baal.co.kr/tools/split"
echo "  plan.baal.co.kr -> baal.co.kr/tools/plan"
echo "  pdf.baal.co.kr -> baal.co.kr/tools/pdf"
echo "  regex.baal.co.kr -> baal.co.kr/tools/regex"
echo "  (모든 도구 서브도메인 -> baal.co.kr/tools/[id])"
