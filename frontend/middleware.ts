import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 간단한 IP 기반 Rate Limiting (메모리 기반, 서버리스 환경에서는 인스턴스별)
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60       // 분당 최대 요청 수
const RATE_WINDOW = 60_000  // 1분

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT
}

export async function middleware(request: NextRequest) {
  // API 라우트에 Rate Limiting 적용
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // 인증이 필요한 경로만 세션 체크 — 나머지는 바로 통과
  const authPaths = ['/auth/', '/write', '/post/', '/api/auth/', '/honeypot']
  const needsAuth = authPaths.some(p => request.nextUrl.pathname.startsWith(p))

  if (needsAuth) {
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|tests/|tools-static/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|css|js)$).*)',
  ],
}
