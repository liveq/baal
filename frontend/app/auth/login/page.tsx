'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LoginButton from '@/components/auth/LoginButton'
import { signInWithGoogle, signInWithKakao, signInWithNaver } from '@/lib/auth/auth-helpers'
import { useAuthStore } from '@/store/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-baal-text-dark">로딩 중...</div>
      </div>
    )
  }

  if (user) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-baal-bg-light to-baal-bg-gray">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold text-baal-text-dark mb-2">BAAL</h1>
          </Link>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-baal-text-dark mb-6 text-center">
            로그인
          </h2>

          <div className="space-y-3">
            {/* 구글 로그인 */}
            <LoginButton
              provider="google"
              onClick={signInWithGoogle}
            />

            {/* 카카오 로그인 */}
            <LoginButton
              provider="kakao"
              onClick={signInWithKakao}
            />

            {/* 네이버 로그인 */}
            <LoginButton
              provider="naver"
              onClick={signInWithNaver}
            />
          </div>

          {/* 안내 문구 */}
          <div className="mt-6 pt-6 border-t border-baal-border-light">
            <p className="text-sm text-baal-text-light text-center">
              소셜 로그인을 통해 간편하게 시작하세요
            </p>
            <p className="text-xs text-baal-bg-light0 text-center mt-2">
              로그인 시 <Link href="/terms" className="underline">이용약관</Link> 및{' '}
              <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의하게 됩니다
            </p>
          </div>

        </div>

        {/* 메인으로 돌아가기 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-baal-text-dark hover:text-baal-text-light transition-colors font-medium"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
