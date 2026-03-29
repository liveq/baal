import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
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
