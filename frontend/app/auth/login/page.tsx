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

        {/* 안내 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-baal-text-dark mb-4 text-center">
            회원가입 / 로그인
          </h2>

          <div className="bg-baal-bg-light rounded-xl p-5 mb-5">
            <p className="text-sm text-baal-text-dark font-medium mb-2">
              회원 시스템 준비 중입니다
            </p>
            <p className="text-sm text-baal-text-gray leading-relaxed">
              회원가입 및 직접 활동(글쓰기 · 댓글 · 투표)은 현재 <span className="font-medium text-baal-gold">준비 중</span>입니다.
              오픈 시 다시 안내드릴 예정입니다.
            </p>
            <p className="text-xs text-baal-text-light mt-3">
              소셜 로그인(네이버/구글/카카오) 기능도 추후 오픈 예정입니다.
            </p>
          </div>

          <div className="pt-2 border-t border-baal-border-light">
            <p className="text-xs text-baal-text-light text-center">
              <Link href="/privacy" className="underline">개인정보처리방침</Link>
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
