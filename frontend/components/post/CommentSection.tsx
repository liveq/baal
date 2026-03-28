'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { formatTimeAgo } from '@/lib/utils/time'
import type { CommentDetail } from '@/types/post'

interface CommentSectionProps {
  postId: string
  initialCommentCount: number
}

export default function CommentSection({ postId, initialCommentCount }: CommentSectionProps) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState<CommentDetail[]>([])
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [anonymousNickname, setAnonymousNickname] = useState('')
  const [anonymousPassword, setAnonymousPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 댓글 로드
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(`${API}/api/community/posts/${postId}/comments`)
      const data = await res.json()
      if (data.comments) {
        setComments(data.comments)
        setCommentCount(data.comments.length)
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

    setSubmitting(true)
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(`${API}/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          parent_id: parentId,
          anonymous_nickname: !user ? anonymousNickname.trim() : undefined
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

  return (
    <div className="bg-white rounded-lg shadow-baal p-6">
      <h3 className="text-lg font-bold mb-4">댓글 {commentCount}</h3>

      {/* 댓글 작성 폼 */}
      <div className="mb-6 pb-6 border-b border-baal-border-light">
        {!user && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={anonymousNickname}
              onChange={(e) => setAnonymousNickname(e.target.value)}
              placeholder="닉네임"
              className="flex-1 px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold text-sm"
              maxLength={20}
            />
            <input
              type="password"
              value={anonymousPassword}
              onChange={(e) => setAnonymousPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-32 px-4 py-2 border border-baal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-baal-gold text-sm"
              maxLength={20}
            />
          </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "댓글을 작성하세요..." : "익명으로 댓글을 작성하세요..."}
          className="w-full px-4 py-3 border border-baal-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-baal-gold"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleSubmit(null)}
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-baal-gold text-white rounded-lg hover:bg-baal-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
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
}

function CommentItem({ comment, onReply, onVote, depth }: CommentItemProps) {
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
          <span className="font-medium text-baal-text">{authorName}</span>
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

        {/* 댓글 액션 */}
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
          {depth < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-baal-text-light hover:text-baal-gold transition-colors"
            >
              답글 {comment.replies?.length || 0}
            </button>
          )}
        </div>

        {/* 답글 작성 폼 */}
        {showReplyForm && (
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
            />
          ))}
        </div>
      )}
    </div>
  )
}
