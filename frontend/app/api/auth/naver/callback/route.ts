import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const savedState = request.cookies.get('naver_oauth_state')?.value
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000'

  // CSRF 검증
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/auth/login?error=invalid_state', baseUrl))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', baseUrl))
  }

  try {
    // 1. 네이버에서 액세스 토큰 받기
    const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID!,
        client_secret: process.env.NAVER_CLIENT_SECRET!,
        code,
        state,
      }),
    })

    const tokenData = await tokenRes.json()
    if (tokenData.error) {
      return NextResponse.redirect(new URL('/auth/login?error=token_failed', baseUrl))
    }

    // 2. 네이버 사용자 정보 조회
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const profileData = await profileRes.json()
    if (profileData.resultcode !== '00') {
      return NextResponse.redirect(new URL('/auth/login?error=profile_failed', baseUrl))
    }

    const naverUser = profileData.response
    const email = naverUser.email || `naver_${naverUser.id}@naver.placeholder`
    const nickname = naverUser.nickname || naverUser.name || `네이버유저_${naverUser.id.slice(0, 6)}`
    const avatarUrl = naverUser.profile_image || null

    // 3. Supabase에 사용자 생성/로그인 (Service Role로)
    const supabase = createServiceRoleClient()

    // 기존 사용자 확인 (네이버 ID로)
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('naver_id', naverUser.id)
      .limit(1)

    let userId: string

    if (existingUsers && existingUsers.length > 0) {
      // 기존 사용자 — Supabase Auth 세션 생성
      userId = existingUsers[0].id

      // 프로필 업데이트
      await supabase.from('users').update({
        nickname,
        avatar_url: avatarUrl,
        last_login_at: new Date().toISOString(),
      }).eq('id', userId)
    } else {
      // 신규 사용자 — Supabase Auth에 생성
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          provider: 'naver',
          naver_id: naverUser.id,
          nickname,
          avatar_url: avatarUrl,
        },
      })

      if (authError || !authData.user) {
        // 이메일 중복인 경우 기존 유저 찾기
        const { data: existingAuth } = await supabase.auth.admin.listUsers()
        const found = existingAuth?.users?.find(u => u.email === email)
        if (found) {
          userId = found.id
        } else {
          return NextResponse.redirect(new URL('/auth/login?error=create_failed', baseUrl))
        }
      } else {
        userId = authData.user.id
      }

      // public.users 테이블에 프로필 생성
      await supabase.from('users').upsert({
        id: userId,
        email,
        nickname,
        avatar_url: avatarUrl,
        naver_id: naverUser.id,
        last_login_at: new Date().toISOString(),
      })
    }

    // 4. 매직 링크로 세션 생성 (사용자에게 이메일 안 감)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    if (linkError || !linkData) {
      return NextResponse.redirect(new URL('/auth/login?error=session_failed', baseUrl))
    }

    // Supabase 콜백 URL로 리다이렉트 (세션 자동 설정)
    const token_hash = linkData.properties?.hashed_token
    if (!token_hash) {
      return NextResponse.redirect(new URL('/auth/login?error=token_hash_missing', baseUrl))
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?type=magiclink&token=${token_hash}&redirect_to=${encodeURIComponent(baseUrl)}`

    const response = NextResponse.redirect(verifyUrl)
    // state 쿠키 정리
    response.cookies.delete('naver_oauth_state')
    return response

  } catch (error) {
    console.error('네이버 로그인 오류:', error)
    return NextResponse.redirect(new URL('/auth/login?error=server_error', baseUrl))
  }
}
