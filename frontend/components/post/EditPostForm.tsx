'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  board_type: string
  title: string
  content: string
}

interface EditPostFormProps {
  post: Post
  isAnonymous: boolean
}

// 게시판 정보
const boardOptions = [
  { value: 'ai', label: 'AI' },
  { value: 'humor', label: '유머' },
  { value: 'philosophy', label: '철학' },
  { value: 'occult', label: '신비' },
  { value: 'it', label: 'IT' },
  { value: 'hardware', label: '뉴스' },
  { value: 'economy', label: '경제' },
  { value: 'qna', label: 'Q&A' },
  { value: 'free', label: '자유' }
]

export default function EditPostForm({ post, isAnonymous }: EditPostFormProps) {
  const router = useRouter()

  const [boardType, setBoardType] = useState(post.board_type)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
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

    setSubmitting(true)

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      })

      const data = await res.json()

      if (res.ok) {
        // 성공 시 게시글 상세 페이지로 이동
        router.push(`/post/${post.id}`)
      } else {
        setError(data.error || '게시글 수정에 실패했습니다')
        setSubmitting(false)
      }
    } catch (error) {
      console.error('Failed to update post:', error)
      setError('게시글 수정 중 오류가 발생했습니다')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <div className="bg-white rounded-lg shadow-baal p-8">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-6">
          게시글 수정
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 게시판 선택 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-2">
              게시판
            </label>
            <select
              value={boardType}
              disabled
              className="w-full px-4 py-3 border border-baal-border rounded-lg bg-baal-bg-light text-baal-text-gray cursor-not-allowed"
            >
              {boardOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-baal-text-light">
              게시판은 수정할 수 없습니다
            </p>
          </div>

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
              {submitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>

      {/* 수정 안내 */}
      <div className="mt-6 p-5 bg-white rounded-lg shadow-baal">
        <h3 className="text-sm font-bold text-baal-text-dark mb-3">
          수정 안내
        </h3>
        <ul className="space-y-2 text-sm text-baal-text-light">
          <li>• 게시판은 수정할 수 없습니다</li>
          <li>• 제목과 내용만 수정 가능합니다</li>
          <li>• 수정 후에는 수정 시간이 표시됩니다</li>
          {isAnonymous && <li>• 익명 게시글은 비밀번호로 수정할 수 있습니다</li>}
          <li>• 댓글이 달린 게시글은 수정할 수 없습니다 (삭제는 가능)</li>
        </ul>
      </div>
    </div>
  )
}
