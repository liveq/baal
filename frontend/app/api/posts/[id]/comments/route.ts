import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CommentDetail } from '@/types/post'

// 댓글을 트리 구조로 변환
function buildCommentTree(comments: any[]): CommentDetail[] {
  const commentMap = new Map<string, CommentDetail>()
  const rootComments: CommentDetail[] = []

  // 1단계: 모든 댓글을 맵에 저장
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // 2단계: 부모-자식 관계 설정
  comments.forEach(comment => {
    const commentNode = commentMap.get(comment.id)!
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(commentNode)
      }
    } else {
      rootComments.push(commentNode)
    }
  })

  return rootComments
}

// 댓글 목록 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()

    // 현재 사용자
    const { data: { user } } = await supabase.auth.getUser()

    // 댓글 조회 (작성자 정보 포함)
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(id, nickname, avatar_url, reputation)
      `)
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 사용자가 로그인한 경우, 투표 상태 조회
    let votes: any[] = []
    if (user && comments && comments.length > 0) {
      const commentIds = comments.map(c => c.id)
      const { data: votesData } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('target_type', 'comment')
        .in('target_id', commentIds)

      votes = votesData || []
    }

    // 투표 상태 매핑
    const commentsWithVotes = comments?.map(comment => ({
      ...comment,
      vote: votes.find(v => v.target_id === comment.id) || null
    })) || []

    // 트리 구조로 변환
    const commentTree = buildCommentTree(commentsWithVotes)

    return NextResponse.json({ comments: commentTree })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 댓글 작성
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const body = await request.json()
    const { content, parent_id } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 })
    }

    // AI 게시판 댓글 차단 — AI 전용
    const authClient = await createClient()
    const { data: parentPost } = await authClient
      .from('posts')
      .select('board_type')
      .eq('id', postId)
      .single()
    if (parentPost?.board_type === 'ai') {
      return NextResponse.json({ error: 'AI 전용 게시판입니다 — 댓글을 달 수 없습니다' }, { status: 403 })
    }

    // 회원 시스템 준비 중 — 비회원 작성 차단
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '회원 시스템 준비 중입니다' }, { status: 403 })
    }

    // Insert with service role (bypass RLS)
    const supabase = createServiceRoleClient()

    const countryCode = request.headers.get('cf-ipcountry')
      || request.headers.get('x-vercel-ip-country')
      || null

    const commentData: any = {
      post_id: postId,
      content: content.trim(),
      parent_id: parent_id || null,
      country_code: countryCode,
      author_id: user.id,
      author_nickname: user.email?.split('@')[0] || '회원',
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 게시글의 댓글 수 증가
    await supabase
      .from('posts')
      .update({ comment_count: supabase.rpc('increment', { row_id: postId }) })
      .eq('id', postId)

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
