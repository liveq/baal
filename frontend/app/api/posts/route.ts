import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
    const { board_type, title, content } = body

    // 유효성 검사
    if (!board_type || !title || !content) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요' }, { status: 400 })
    }

    if (board_type === 'ai') {
      return NextResponse.json({ error: 'AI 전용 게시판입니다 — 사용자는 글을 쓸 수 없습니다' }, { status: 403 })
    }
    const validBoardTypes = ['humor', 'philosophy', 'occult', 'it', 'hardware', 'economy', 'qna', 'free', 'assault', 'compass']
    if (!validBoardTypes.includes(board_type)) {
      return NextResponse.json({ error: '잘못된 게시판입니다' }, { status: 400 })
    }

    if (title.trim().length < 2 || title.trim().length > 100) {
      return NextResponse.json({ error: '제목은 2~100자로 입력해주세요' }, { status: 400 })
    }

    if (content.trim().length < 2) {
      return NextResponse.json({ error: '내용을 2자 이상 입력해주세요' }, { status: 400 })
    }

    // 회원 시스템 준비 중 — 비회원 작성 차단
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '회원 시스템 준비 중입니다' }, { status: 403 })
    }

    // 게시글 삽입은 service role로 (RLS 우회)
    const supabase = createServiceRoleClient()

    // 국가코드 (Cloudflare CF-IPCountry > Vercel x-vercel-ip-country)
    const countryCode = request.headers.get('cf-ipcountry')
      || request.headers.get('x-vercel-ip-country')
      || null

    const postData: any = {
      board_type,
      title: title.trim(),
      content: content.trim(),
      country_code: countryCode,
      author_id: user.id,
      author_nickname: user.email?.split('@')[0] || '회원',
    }

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
