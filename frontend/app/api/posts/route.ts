import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const boardType = searchParams.get('board_type')
    const limit = parseInt(searchParams.get('limit') || '10')

    const supabase = await createClient()

    let query = supabase
      .from('posts')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    // 보드 타입 필터링
    if (boardType) {
      query = query.eq('board_type', boardType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 게시글 생성
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { board_type, title, content, anonymous_nickname, anonymous_password } = body

    // 유효성 검사
    if (!board_type || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validBoardTypes = ['ai', 'humor', 'philosophy', 'occult', 'it', 'hardware', 'economy', 'qna', 'free']
    if (!validBoardTypes.includes(board_type)) {
      return NextResponse.json({ error: 'Invalid board type' }, { status: 400 })
    }

    if (title.trim().length < 2 || title.trim().length > 100) {
      return NextResponse.json({ error: 'Title must be 2-100 characters' }, { status: 400 })
    }

    if (content.trim().length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 익명 또는 로그인 사용자
    const postData: any = {
      board_type,
      title: title.trim(),
      content: content.trim()
    }

    if (user) {
      // 로그인 사용자
      postData.author_id = user.id
    } else {
      // 익명 사용자
      if (!anonymous_nickname || anonymous_nickname.trim().length === 0) {
        return NextResponse.json({ error: 'Anonymous nickname required' }, { status: 400 })
      }
      if (!anonymous_password || anonymous_password.trim().length < 4) {
        return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 })
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(anonymous_password.trim(), 10)

      postData.author_nickname = anonymous_nickname.trim()
      postData.anonymous_password = hashedPassword
    }

    // 게시글 삽입
    const { data: post, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
