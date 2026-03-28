import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 게시글 조회
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(id, nickname, avatar_url, reputation)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 삭제된 게시글은 작성자만 볼 수 있음
    if (post.is_deleted) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== post.author_id) {
        return NextResponse.json({ error: 'Post deleted' }, { status: 404 })
      }
    }

    // 조회수 증가
    await supabase
      .from('posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', id)

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 게시글 수정
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content } = body

    const supabase = await createClient()

    // 게시글 조회 (댓글 수와 작성자 확인)
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id, comment_count, anonymous_password')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 댓글이 있으면 수정 불가 (국룰)
    if (post.comment_count > 0) {
      return NextResponse.json(
        { error: 'Cannot edit post with comments' },
        { status: 403 }
      )
    }

    // 익명 게시글인 경우
    if (!post.author_id) {
      // 익명 게시글은 수정 페이지에서 비밀번호 검증을 거쳤으므로 여기서는 허용
      // (수정 페이지 접근 자체가 비밀번호 검증 필요)
      if (!post.anonymous_password) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      // 로그인 사용자인 경우 작성자 확인
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (post.author_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // 수정
    const { data, error } = await supabase
      .from('posts')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 게시글 삭제 (소프트 삭제)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 게시글 조회 (작성자 확인)
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id, anonymous_password')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 익명 게시글인 경우
    if (!post.author_id) {
      // 익명 게시글은 PostActionButtons에서 비밀번호 검증을 거쳤으므로 여기서는 허용
      if (!post.anonymous_password) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      // 로그인 사용자인 경우 작성자 확인
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (post.author_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // 소프트 삭제
    const { error } = await supabase
      .from('posts')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
