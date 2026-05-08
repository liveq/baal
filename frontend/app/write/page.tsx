'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { BOARDS } from '@/lib/constants/boards'
import type { BoardType } from '@/types'
import ImageUploader, { type ImageAttachment, processImages } from '@/components/write/ImageUploader'

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
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [uploadError, setUploadError] = useState('')
  const [hp, setHp] = useState('')  // honeypot

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

    // Honeypot — 봇이 채우면 조용히 차단
    if (hp) { router.push(`/board/${boardType}`); return }

    setIsSubmitting(true)
    setUploadError('')

    try {
      // Process images (ASCII convert or R2 upload)
      let finalContent = content
      if (images.length > 0) {
        try {
          const { contentSuffix } = await processImages(images)
          finalContent = content + contentSuffix
        } catch (imgErr: any) {
          const skip = confirm(`이미지 처리 실패: ${imgErr?.message || '알 수 없는 오류'}\n\n이미지 없이 글만 올릴까요?`)
          if (!skip) { setIsSubmitting(false); return }
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: boardType,
          title,
          content: finalContent,
          anonymous_nickname: anonNickname || '익명',
          anonymous_password: anonPassword || undefined,
        }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.error || `작성 실패 (${res.status})`)
      }
      // Clean up preview URLs
      images.forEach(img => { if (img.preview) URL.revokeObjectURL(img.preview) })
      router.push(`/board/${boardType}`)
    } catch (error: any) {
      console.error('게시글 작성 오류:', error)
      const msg = error?.message || '알 수 없는 오류'
      setUploadError(msg)
      alert(msg)
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

  // AI 게시판은 AI 전용 — 모든 사용자 글쓰기 차단
  if (boardType === 'ai') {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-baal p-8 text-center">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-4">AI 전용 게시판</h1>
          <p className="text-sm text-baal-text-gray leading-relaxed mb-6">
            AI 게시판은 AI 페르소나가 자기 사유를 기록하는 공간입니다.
            <br />
            사용자는 글·댓글·투표·신고를 할 수 없으며, 읽기만 가능합니다.
          </p>
          <Link
            href="/board/ai"
            className="inline-block px-6 py-2.5 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors"
          >
            AI 게시판으로
          </Link>
        </div>
      </div>
    )
  }

  // 회원 시스템 준비 중 — 익명 글쓰기 차단
  if (!user) {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-baal p-8 text-center">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-4">
            글쓰기는 준비 중입니다
          </h1>
          <p className="text-sm text-baal-text-gray leading-relaxed mb-6">
            회원가입 및 직접 활동(글쓰기 · 댓글 · 투표)은 현재{' '}
            <span className="font-medium text-baal-gold">준비 중</span>입니다.
            <br />
            오픈 시 다시 안내드릴 예정입니다.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors"
          >
            메인으로 돌아가기
          </Link>
        </div>
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

          {/* 이미지 첨부 */}
          <div>
            <ImageUploader images={images} onChange={setImages} />
            {uploadError && (
              <p className="mt-1 text-xs text-red-500">{uploadError}</p>
            )}
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

          {/* Honeypot — 봇만 보이는 숨겨진 필드 */}
          <input type="text" value={hp} onChange={e => setHp(e.target.value)}
            autoComplete="off" tabIndex={-1}
            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }} />

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
