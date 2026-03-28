import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditPostForm from '@/components/post/EditPostForm'
import bcrypt from 'bcryptjs'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ password?: string }>
}

export default async function EditPostPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { password } = await searchParams
  const supabase = await createClient()

  // 게시글 조회
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  // 댓글이 있으면 수정 불가 (국룰)
  if (post.comment_count > 0) {
    redirect(`/post/${id}`)
  }

  // 익명 게시글인 경우
  if (!post.author_id) {
    // 비밀번호가 없으면 게시글 상세로 리다이렉트
    if (!password) {
      redirect(`/post/${id}`)
    }

    // 비밀번호 검증
    if (!post.anonymous_password) {
      redirect(`/post/${id}`)
    }

    const isValid = await bcrypt.compare(password, post.anonymous_password)
    if (!isValid) {
      redirect(`/post/${id}`)
    }

    // 비밀번호가 맞으면 수정 폼 표시
    return <EditPostForm post={post} isAnonymous={true} />
  }

  // 로그인 사용자인 경우
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // 작성자 확인
  if (post.author_id !== user.id) {
    redirect(`/post/${id}`)
  }

  return <EditPostForm post={post} isAnonymous={false} />
}
