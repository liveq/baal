'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface PostVoteButtonsProps {
  postId: string
  initialUpvotes: number
  initialDownvotes: number
}

export default function PostVoteButtons({
  postId,
  initialUpvotes,
  initialDownvotes
}: PostVoteButtonsProps) {
  const { user } = useAuthStore()
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null)
  const [loading, setLoading] = useState(false)

  // 사용자의 기존 투표 확인
  useEffect(() => {
    if (user) {
      checkUserVote()
    }
  }, [user, postId])

  const checkUserVote = async () => {
    if (!user) return

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(`${API}/api/votes/check?post_id=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setUserVote(data.vote_type)
      }
    } catch (error) {
      console.error('Failed to check user vote:', error)
    }
  }

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      alert('로그인이 필요합니다')
      return
    }

    if (loading) return

    setLoading(true)
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(`${API}/api/community/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          vote_type: voteType
        })
      })

      if (res.ok) {
        const data = await res.json()
        setUpvotes(data.upvotes)
        setDownvotes(data.downvotes)
        setUserVote(data.userVote)
      } else {
        const data = await res.json()
        alert(data.error || '투표에 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to vote:', error)
      alert('투표 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4 text-sm">
      <button
        onClick={() => handleVote('upvote')}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 'upvote'
            ? 'bg-baal-gold text-white'
            : 'hover:bg-white'
        } disabled:opacity-50`}
      >
        <span>👍</span>
        <span>{upvotes}</span>
      </button>
      <button
        onClick={() => handleVote('downvote')}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 'downvote'
            ? 'bg-gray-600 text-white'
            : 'hover:bg-white'
        } disabled:opacity-50`}
      >
        <span>👎</span>
        <span>{downvotes}</span>
      </button>
    </div>
  )
}
