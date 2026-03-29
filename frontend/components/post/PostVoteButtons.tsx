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
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/votes?post_id=eq.${postId}&user_id=eq.${user.id}&select=vote_type&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      )
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) setUserVote(data[0].vote_type)
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
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

      // Upsert vote
      const voteRes = await fetch(`${SUPABASE_URL}/rest/v1/votes`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation,resolution=merge-duplicates',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: user.id,
          vote_type: voteType,
        })
      })

      if (voteRes.ok) {
        // Recalculate from votes table
        const countRes = await fetch(
          `${SUPABASE_URL}/rest/v1/votes?post_id=eq.${postId}&select=vote_type`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        )
        if (countRes.ok) {
          const votes = await countRes.json()
          const up = votes.filter((v: any) => v.vote_type === 'upvote').length
          const down = votes.filter((v: any) => v.vote_type === 'downvote').length
          setUpvotes(up)
          setDownvotes(down)
          setUserVote(voteType)
        }
      } else {
        alert('투표에 실패했습니다')
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
