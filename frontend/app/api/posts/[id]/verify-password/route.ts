import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// 익명 게시글 비밀번호 검증
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 게시글 조회
    const { data: post, error } = await supabase
      .from('posts')
      .select('id, author_id, anonymous_password')
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 익명 게시글이 아니면 에러
    if (post.author_id !== null) {
      return NextResponse.json(
        { error: 'This is not an anonymous post' },
        { status: 400 }
      )
    }

    // 비밀번호가 설정되지 않았으면 에러
    if (!post.anonymous_password) {
      return NextResponse.json(
        { error: 'No password set for this post' },
        { status: 400 }
      )
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, post.anonymous_password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    // 검증 성공
    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Error verifying password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
