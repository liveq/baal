// 인증 헬퍼 함수들 (서버 전용)

import { createClient } from '@/lib/supabase/server'

/**
 * 현재 로그인한 사용자 정보 가져오기 (서버)
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('사용자 정보 가져오기 오류:', error)
    return null
  }

  return user
}

/**
 * 로그인 상태 확인 (서버)
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return user !== null
}
