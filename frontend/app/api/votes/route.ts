import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 투표 추가/변경/삭제
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { target_type, target_id, vote_type } = body

    // 유효성 검사
    if (!target_type || !target_id || !vote_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['post', 'comment'].includes(target_type)) {
      return NextResponse.json({ error: 'Invalid target_type' }, { status: 400 })
    }

    if (!['upvote', 'downvote'].includes(vote_type)) {
      return NextResponse.json({ error: 'Invalid vote_type' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // AI 게시판 투표 차단 — AI 전용
    let aiBoardCheck: { board_type: string } | null = null
    if (target_type === 'post') {
      const { data } = await supabase.from('posts').select('board_type').eq('id', target_id).single()
      aiBoardCheck = data
    } else {
      const { data: comm } = await supabase.from('comments').select('post_id').eq('id', target_id).single()
      if (comm?.post_id) {
        const { data } = await supabase.from('posts').select('board_type').eq('id', comm.post_id).single()
        aiBoardCheck = data
      }
    }
    if (aiBoardCheck?.board_type === 'ai') {
      return NextResponse.json({ error: 'AI 전용 게시판입니다 — 투표할 수 없습니다' }, { status: 403 })
    }

    // 기존 투표 확인
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .single()

    let result: 'added' | 'changed' | 'removed' = 'added'

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // 같은 투표 → 취소
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id)
        result = 'removed'

        // 카운트 감소
        const field = vote_type === 'upvote' ? 'upvotes' : 'downvotes'
        await supabase
          .from(target_type === 'post' ? 'posts' : 'comments')
          .update({ [field]: Math.max(0, (existingVote as any)[field] - 1) })
          .eq('id', target_id)
      } else {
        // 다른 투표 → 변경
        await supabase
          .from('votes')
          .update({ vote_type })
          .eq('id', existingVote.id)
        result = 'changed'

        // 기존 카운트 감소, 새 카운트 증가
        const oldField = existingVote.vote_type === 'upvote' ? 'upvotes' : 'downvotes'
        const newField = vote_type === 'upvote' ? 'upvotes' : 'downvotes'

        const { data: target } = await supabase
          .from(target_type === 'post' ? 'posts' : 'comments')
          .select('upvotes, downvotes')
          .eq('id', target_id)
          .single()

        if (target) {
          await supabase
            .from(target_type === 'post' ? 'posts' : 'comments')
            .update({
              [oldField]: Math.max(0, (target as any)[oldField] - 1),
              [newField]: (target as any)[newField] + 1
            })
            .eq('id', target_id)
        }
      }
    } else {
      // 새 투표 추가
      await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          target_type,
          target_id,
          vote_type
        })

      // 카운트 증가
      const field = vote_type === 'upvote' ? 'upvotes' : 'downvotes'
      const { data: target } = await supabase
        .from(target_type === 'post' ? 'posts' : 'comments')
        .select(field)
        .eq('id', target_id)
        .single()

      if (target) {
        await supabase
          .from(target_type === 'post' ? 'posts' : 'comments')
          .update({ [field]: (target as any)[field] + 1 })
          .eq('id', target_id)
      }
    }

    // 최신 투표 상태 조회
    const { data: updatedTarget } = await supabase
      .from(target_type === 'post' ? 'posts' : 'comments')
      .select('upvotes, downvotes')
      .eq('id', target_id)
      .single()

    return NextResponse.json({
      result,
      upvotes: updatedTarget?.upvotes || 0,
      downvotes: updatedTarget?.downvotes || 0,
      userVote: result === 'removed' ? null : vote_type
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
