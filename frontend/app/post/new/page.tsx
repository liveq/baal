'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

// 게시판 정보
const boardOptions = [
  { value: 'humor', label: '유머' },
  { value: 'philosophy', label: '철학' },
  { value: 'occult', label: '신비' },
  { value: 'it', label: 'IT' },
  { value: 'economy', label: '경제' },
  { value: 'qna', label: 'Q&A' },
  { value: 'free', label: '자유' }
]

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">로딩 중...</div>}>
      <NewPostContent />
    </Suspense>
  )
}

function NewPostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()

  const [boardType, setBoardType] = useState(searchParams.get('board') || 'free')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [anonymousNickname, setAnonymousNickname] = useState('')
  const [anonymousPassword, setAnonymousPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }

    if (title.trim().length < 2) {
      setError('제목은 최소 2자 이상 입력해주세요')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요')
      return
    }

    if (content.trim().length < 10) {
      setError('내용은 최소 10자 이상 입력해주세요')
      return
    }

    // 익명 사용자는 닉네임과 비밀번호 필수
    if (!user) {
      if (!anonymousNickname.trim()) {
        setError('익명 닉네임을 입력해주세요')
        return
      }
      if (!anonymousPassword.trim()) {
        setError('비밀번호를 입력해주세요 (수정/삭제 시 사용)')
        return
      }
      if (anonymousPassword.length < 4) {
        setError('비밀번호는 최소 4자 이상 입력해주세요')
        return
      }
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: boardType,
          title: title.trim(),
          content: content.trim(),
          anonymous_nickname: !user ? anonymousNickname.trim() : undefined,
          anonymous_password: !user ? anonymousPassword.trim() : undefined
        })
      })

      const data = await res.json()

      if (res.ok) {
        // 성공 시 게시글 상세 페이지로 이동
        router.push(`/post/${data.post.id}`)
      } else {
        setError(data.error || '게시글 작성에 실패했습니다')
        setSubmitting(false)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      setError('게시글 작성 중 오류가 발생했습니다')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <div className="bg-white rounded-lg shadow-baal p-8">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-6">
          글쓰기
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 게시판 선택 */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              게시판 <span className="text-red-500">*</span>
            </label>
            <select
              value={boardType}
              onChange={(e) => setBoardType(e.target.value)}
              className="w-full px-4 py-3 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold"
            >
              {boardOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 익명 닉네임 + 비밀번호 (로그인하지 않은 경우) */}
          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium text-baal-text-dark mb-2">
                  익명 닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={anonymousNickname}
                  onChange={(e) => setAnonymousNickname(e.target.value)}
                  placeholder="예: 익명123"
                  maxLength={20}
                  className="w-full px-4 py-3 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold"
                />
                <p className="mt-1 text-xs text-baal-text-light">
                  익명으로 게시글을 작성합니다. 닉네임은 최대 20자까지 입력 가능합니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-baal-text-dark mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={anonymousPassword}
                  onChange={(e) => setAnonymousPassword(e.target.value)}
                  placeholder="최소 4자 이상 입력하세요"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold"
                />
                <p className="mt-1 text-xs text-baal-text-light">
                  게시글 수정/삭제 시 사용됩니다. 비밀번호를 꼭 기억해주세요!
                </p>
              </div>
            </>
          )}

          {/* 로그인 상태 표시 */}
          {user && (
            <div className="p-3 bg-baal-bg-light rounded-lg">
              <p className="text-sm text-baal-text">
                <span className="font-medium">{user.email}</span> 계정으로 작성합니다.
              </p>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요 (최소 2자)"
              maxLength={100}
              className="w-full px-4 py-3 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold"
            />
            <p className="mt-1 text-xs text-baal-text-light text-right">
              {title.length} / 100
            </p>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요 (최소 10자)"
              rows={15}
              className="w-full px-4 py-3 border border-baal-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-baal-gold"
            />
            <p className="mt-1 text-xs text-baal-text-light text-right">
              {content.length}자
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-baal-border rounded-lg hover:bg-baal-bg-hover transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-baal-gold text-white rounded-lg hover:bg-baal-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>

      {/* 작성 가이드 */}
      <div className="mt-6 p-5 bg-white rounded-lg shadow-baal">
        <h3 className="text-sm font-bold text-baal-text-dark mb-3">
          게시글 작성 가이드
        </h3>
        <ul className="space-y-2 text-sm text-baal-text-light">
          <li>• 제목은 내용을 잘 나타낼 수 있도록 명확하게 작성해주세요</li>
          <li>• 욕설, 비방, 음란물 등 부적절한 내용은 삭제될 수 있습니다</li>
          <li>• 로그인 없이도 익명으로 게시글을 작성할 수 있습니다</li>
          <li>• 익명 게시글은 비밀번호로 수정/삭제할 수 있습니다</li>
          <li>• 작성한 게시글은 해당 게시판에서 확인할 수 있습니다</li>
        </ul>
      </div>
    </div>
  )
}
