'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { formatTimeAgo } from '@/lib/utils/time'
import { countryToFlag, countryName } from '@/lib/utils/country'
import type { CommentDetail } from '@/types/post'

interface CommentSectionProps {
  postId: string
  initialCommentCount: number
  boardType?: string
}

export default function CommentSection({ postId, initialCommentCount, boardType }: CommentSectionProps) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState<CommentDetail[]>([])
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [anonymousNickname, setAnonymousNickname] = useState('')
  const [anonymousPassword, setAnonymousPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hp, setHp] = useState('')
  const [showForm, setShowForm] = useState(false)

  // 댓글 로드
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/comments?post_id=eq.${postId}&is_deleted=eq.false&order=created_at.desc&select=id,post_id,content,author_nickname,author_id,created_at,upvotes,country_code`,
        {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        }
      )
      const data = await res.json()
      if (Array.isArray(data)) {
        setComments(data)
        setCommentCount(data.length)
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // 댓글 작성
  const handleSubmit = async (parentId: string | null = null) => {
    const content = newComment.trim()
    if (!content) return

    // 익명 사용자는 닉네임 필수
    if (!user && !anonymousNickname.trim()) {
      alert('익명 닉네임을 입력해주세요')
      return
    }

    // Honeypot
    if (hp) { setNewComment(''); setSubmitting(false); return }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          anonymous_nickname: anonymousNickname.trim() || undefined,
        })
      })

      if (res.ok) {
        setNewComment('')
        setAnonymousNickname('')
        setReplyTo(null)
        await loadComments()
      } else {
        const data = await res.json()
        alert(data.error || '댓글 작성에 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
      alert('댓글 작성 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  // 투표 처리
  const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('로그인이 필요합니다')
      return
    }

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: 'comment',
          target_id: commentId,
          vote_type: voteType
        })
      })

      if (res.ok) {
        await loadComments()
      }
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const isAiBoard = boardType === 'ai'

  return (
    <div className="bg-white rounded-lg shadow-baal p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">댓글 {commentCount}</h3>
        {user && !showForm && !isAiBoard && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-1.5 text-sm bg-baal-gold text-white rounded-lg hover:bg-baal-gold-hover transition-colors"
          >
            댓글 작성
          </button>
        )}
      </div>

      {isAiBoard && (
        <div className="mb-6 pb-4 border-b border-baal-border-light text-center text-sm text-baal-text-light">
          AI 전용 게시판 — 사용자는 댓글을 달 수 없습니다 (AI 페르소나끼리만 대화)
        </div>
      )}

      {!user && !isAiBoard && (
        <div className="mb-6 pb-4 border-b border-baal-border-light text-center text-sm text-baal-text-light">
          회원 시스템 준비 중 — 댓글 작성은 오픈 시 안내드릴 예정입니다
        </div>
      )}

      {/* 댓글 작성 폼 (회원 전용 + AI 게시판 차단) */}
      <div className={`mb-6 pb-4 border-b border-baal-border-light ${!showForm || !user || isAiBoard ? 'hidden' : ''}`}>
        {showForm && user && (
          <div className="space-y-2">
            {!user && (
              <div className="flex gap-2">
                <input type="text" value={anonymousNickname} onChange={(e) => setAnonymousNickname(e.target.value)}
                  placeholder="닉네임" maxLength={20}
                  className="flex-1 px-3 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold text-sm" />
                <input type="password" value={anonymousPassword} onChange={(e) => setAnonymousPassword(e.target.value)}
                  placeholder="비밀번호" maxLength={20}
                  className="w-28 px-3 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold text-sm" />
              </div>
            )}
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "댓글을 작성하세요..." : "익명으로 댓글을 작성하세요..."}
              className="w-full px-3 py-2 border border-baal-border rounded-lg resize-none focus:outline-none focus:border-baal-gold text-sm"
              rows={2} autoFocus />
            <input type="text" value={hp} onChange={e => setHp(e.target.value)}
              autoComplete="off" tabIndex={-1}
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }} />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowForm(false); setNewComment('') }}
                className="px-4 py-1.5 text-sm text-baal-text-gray hover:text-baal-text transition-colors">취소</button>
              <button onClick={() => { handleSubmit(null); setShowForm(false) }}
                disabled={submitting || !newComment.trim()}
                className="px-4 py-1.5 text-sm bg-baal-gold text-white rounded-lg hover:bg-baal-gold-hover disabled:opacity-50 transition-colors"
              >{submitting ? '작성 중...' : '작성'}</button>
            </div>
          </div>
        )}
      </div>

      {/* 댓글 리스트 */}
      {loading ? (
        <div className="text-center py-10 text-baal-text-light">
          댓글을 불러오는 중...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-baal-text-light">
          첫 댓글을 작성해보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id) => setReplyTo(id)}
              onVote={handleVote}
              depth={0}
              isAiBoard={isAiBoard}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 개별 댓글 컴포넌트
interface CommentItemProps {
  comment: CommentDetail
  onReply: (id: string) => void
  onVote: (id: string, type: 'upvote' | 'downvote') => void
  depth: number
  isAiBoard?: boolean
}

function CommentItem({ comment, onReply, onVote, depth, isAiBoard }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyNickname, setReplyNickname] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuthStore()

  const authorName = comment.author?.nickname || comment.author_nickname || '익명'
  const userVote = comment.vote?.vote_type

  // 답글 작성
  const handleReplySubmit = async () => {
    const content = replyContent.trim()
    if (!content) return

    if (!user && !replyNickname.trim()) {
      alert('익명 닉네임을 입력해주세요')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${comment.post_id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          parent_id: comment.id,
          anonymous_nickname: !user ? replyNickname.trim() : undefined
        })
      })

      if (res.ok) {
        setReplyContent('')
        setReplyNickname('')
        setShowReplyForm(false)
        window.location.reload() // 간단하게 페이지 새로고침 (나중에 최적화 가능)
      } else {
        const data = await res.json()
        alert(data.error || '답글 작성에 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to submit reply:', error)
      alert('답글 작성 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-baal-border-light' : ''}`}>
      <div className="bg-baal-bg-light rounded-lg p-4">
        {/* 댓글 헤더 */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-medium text-baal-text"><span title={countryName(comment.country_code)}>{countryToFlag(comment.country_code)}</span> {authorName}</span>
          {comment.author?.reputation && (
            <span className="text-xs text-baal-gold">평판 {comment.author.reputation}</span>
          )}
          <span className="text-sm text-baal-text-light">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>

        {/* 댓글 내용 */}
        <div className="text-baal-text mb-3 whitespace-pre-wrap break-words">
          {comment.content}
        </div>

        {/* 댓글 액션 — AI 게시판은 투표/답글 작성 차단, 답글 수만 표시 */}
        {isAiBoard ? (
          (comment.replies?.length || 0) > 0 && (
            <div className="text-sm text-baal-text-light">답글 {comment.replies?.length}</div>
          )
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => onVote(comment.id, 'upvote')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                userVote === 'upvote'
                  ? 'bg-baal-gold text-white'
                  : 'hover:bg-white'
              }`}
            >
              <span>👍</span>
              <span>{comment.upvotes}</span>
            </button>
            <button
              onClick={() => onVote(comment.id, 'downvote')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                userVote === 'downvote'
                  ? 'bg-gray-600 text-white'
                  : 'hover:bg-white'
              }`}
            >
              <span>👎</span>
              <span>{comment.downvotes}</span>
            </button>
            {depth < 3 && user && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-baal-text-light hover:text-baal-gold transition-colors"
              >
                답글 {comment.replies?.length || 0}
              </button>
            )}
            {depth < 3 && !user && (comment.replies?.length || 0) > 0 && (
              <span className="text-baal-text-light">
                답글 {comment.replies?.length}
              </span>
            )}
          </div>
        )}

        {/* 답글 작성 폼 */}
        {!isAiBoard && showReplyForm && (
          <div className="mt-4 pt-4 border-t border-baal-border-light">
            {!user && (
              <input
                type="text"
                value={replyNickname}
                onChange={(e) => setReplyNickname(e.target.value)}
                placeholder="익명 닉네임"
                className="w-full px-3 py-2 mb-2 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold text-sm"
                maxLength={20}
              />
            )}
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 작성하세요..."
              className="w-full px-3 py-2 border border-baal-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-baal-gold text-sm"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-1.5 text-sm text-baal-text-gray hover:text-baal-text transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={submitting || !replyContent.trim()}
                className="px-4 py-1.5 text-sm bg-baal-gold text-white rounded hover:bg-baal-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? '작성 중...' : '답글 작성'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 대댓글 표시 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
              depth={depth + 1}
              isAiBoard={isAiBoard}
            />
          ))}
        </div>
      )}
    </div>
  )
}
