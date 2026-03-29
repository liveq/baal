'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { BOARDS } from '@/lib/constants/boards'
import type { BoardType } from '@/types'

export default function WritePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">로딩 중...</div>}>
      <WriteContent />
    </Suspense>
  )
}

function WriteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuthStore()

  const [boardType, setBoardType] = useState<BoardType>('free')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // URL 파라미터에서 게시판 타입 가져오기
    const board = searchParams.get('board') as BoardType
    if (board && BOARDS.find(b => b.type === board)) {
      setBoardType(board)
    }
  }, [searchParams])

  const [anonNickname, setAnonNickname] = useState('')
  const [anonPassword, setAnonPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          board_type: boardType,
          title,
          content,
          author_nickname: user?.email?.split('@')[0] || anonNickname || '익명',
          anonymous_password: !user ? anonPassword : undefined,
          author_id: user?.id || null,
        }),
      })
      if (!res.ok) throw new Error('작성 실패')
      router.push(`/board/${boardType}`)
    } catch (error) {
      console.error('게시글 작성 오류:', error)
      alert('게시글 작성 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-baal-text-dark">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-6">
          글쓰기
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 익명 정보 (로그인 안 했을 때) */}
          {!user && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-baal-text-dark mb-1">닉네임</label>
                <input type="text" value={anonNickname} onChange={e => setAnonNickname(e.target.value)}
                  placeholder="익명 닉네임" maxLength={20}
                  className="w-full px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold" />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-baal-text-dark mb-1">비밀번호</label>
                <input type="password" value={anonPassword} onChange={e => setAnonPassword(e.target.value)}
                  placeholder="삭제용 비번" maxLength={20}
                  className="w-full px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold" />
              </div>
            </div>
          )}

          {/* 게시판 선택 */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              게시판 선택
            </label>
            <select
              value={boardType}
              onChange={(e) => setBoardType(e.target.value as BoardType)}
              className="w-full px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold"
            >
              {BOARDS.filter(b => !['ai', 'best', 'hardware'].includes(b.type)).map((board) => (
                <option key={board.type} value={board.type}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요 (최대 100자)"
              maxLength={100}
              className="w-full px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              내용 (마크다운 지원)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요 (마크다운 문법 사용 가능)&#10;&#10;# 제목&#10;## 부제목&#10;**굵게** *기울임*&#10;- 목록&#10;[링크](url)"
              rows={15}
              className="w-full px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold resize-none font-mono text-sm"
            />
            <p className="mt-1 text-xs text-baal-gold">
              {content.length} / 10,000자
            </p>
          </div>

          {/* 마크다운 도움말 */}
          <div className="p-4 bg-baal-bg-light rounded-lg">
            <p className="text-sm font-medium text-baal-text-dark mb-2">
              마크다운 문법 가이드
            </p>
            <div className="text-xs text-baal-text-light space-y-1">
              <p>• # 제목 / ## 부제목 / ### 소제목</p>
              <p>• **굵게** / *기울임* / ~~취소선~~</p>
              <p>• [링크 텍스트](URL)</p>
              <p>• - 목록 / 1. 번호 목록</p>
              <p>• `코드` / ```코드 블록```</p>
              <p>• &gt; 인용문</p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-baal-border text-baal-text-dark rounded-lg font-medium hover:bg-baal-bg-light"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-baal-text-dark text-white rounded-lg font-medium hover:bg-baal-text-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
