// 인증 헬퍼 함수들 (클라이언트 전용)

import { createClient } from '@/lib/supabase/client'

/**
 * 구글 OAuth 로그인
 * TODO: Supabase Dashboard에서 구글 OAuth 설정 후 연동
 */
export async function signInWithGoogle() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google 로그인 오류:', error)
    throw error
  }

  return data
}

/**
 * 카카오 OAuth 로그인
 * TODO: Supabase Dashboard에서 카카오 OAuth 설정 후 연동
 */
export async function signInWithKakao() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('카카오 로그인 오류:', error)
    throw error
  }

  return data
}

/**
 * 네이버 OAuth 로그인 (커스텀 구현)
 * Supabase 미지원이므로 자체 API 라우트를 통해 처리
 */
export async function signInWithNaver() {
  window.location.href = '/api/auth/naver'
}

/**
 * 로그아웃
 */
export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('로그아웃 오류:', error)
    throw error
  }

  // 페이지 새로고침
  window.location.href = '/'
}

/**
 * 현재 로그인한 사용자 정보 가져오기 (클라이언트)
 */
export async function getCurrentUser() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('사용자 정보 가져오기 오류:', error)
    return null
  }

  return user
}

/**
 * 로그인 상태 확인
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * 세션 새로고침
 */
export async function refreshSession() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.refreshSession()

  if (error) {
    console.error('세션 새로고침 오류:', error)
    throw error
  }

  return data
}
