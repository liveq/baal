import { notFound } from 'next/navigation'
import { formatTimeAgo } from '@/lib/utils/time'
import Link from 'next/link'
import RightSidebar from '@/components/home/RightSidebar'
import BoardSection from '@/components/home/BoardSection'
import CommentSection from '@/components/post/CommentSection'
import PostVoteButtons from '@/components/post/PostVoteButtons'
import PostActionButtons from '@/components/post/PostActionButtons'

interface PageProps {
  params: Promise<{ id: string }>
}

const boardInfo: Record<string, { title: string; description: string }> = {
  ai: { title: 'AI', description: 'AI와 기술에 관한 이야기' },
  humor: { title: '유머', description: '재미있는 이야기와 유머' },
  philosophy: { title: '철학', description: '철학적 사고와 토론' },
  occult: { title: '신비', description: '타로, 별자리, 꿈해몽, 영성 탐구' },
  it: { title: 'IT', description: '개발, 하드웨어, 소프트웨어 토론' },
  hardware: { title: '뉴스', description: '해외 테크·AI·세계 뉴스' },
  economy: { title: '경제', description: '경제와 재테크' },
  qna: { title: 'Q&A', description: '궁금한 것을 물어보세요' },
  free: { title: '자유', description: '자유로운 소통 공간' }
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params

  let post: any = null
  let comments: any[] = []

  try {
    const res = await fetch(`${API}/api/community/posts/${id}`, { cache: 'no-store' })
    if (!res.ok) return notFound()
    const data = await res.json()
    post = data.post
    comments = data.comments || []
  } catch {
    return notFound()
  }

  if (!post) return notFound()

  const authorName = post.author_nickname || '익명'
  const board = boardInfo[post.board_type] || { title: '게시판', description: '' }

  // 같은 게시판 다른 글
  let relatedPosts: any[] = []
  try {
    const res = await fetch(`${API}/api/community/posts?board=${post.board_type}&limit=10`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      relatedPosts = (data.posts || [])
        .filter((p: any) => p.id !== id)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          author: p.author_nickname || '익명',
          time: formatTimeAgo(p.created_at),
          comments: p.comment_count || 0,
        }))
    }
  } catch {}

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <main className="flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-baal px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-baal-text-dark mb-1">{board.title}</h1>
                <p className="text-sm text-baal-text-light">{board.description}</p>
              </div>
              <Link href={`/board/${post.board_type}`} className="px-4 py-2 text-sm text-baal-text-light hover:text-baal-gold transition-colors">
                게시판으로
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-baal overflow-hidden">
            <div className="px-6 py-4 border-b border-baal-border-light">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-baal-text-dark flex-1">{post.title}</h2>
                <PostActionButtons
                  postId={id}
                  authorId={post.author_id}
                  boardType={post.board_type}
                  commentCount={post.comment_count}
                  hasAnonymousPassword={!!post.anonymous_password}
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-baal-text-light">
                <span className="font-medium text-baal-text">🇰🇷 {authorName}</span>
                <span>{formatTimeAgo(post.created_at)}</span>
                <span>조회 {post.view_count}</span>
                <span>댓글 {post.comment_count}</span>
              </div>
            </div>

            <div className="px-6 py-6 min-h-[200px]">
              <div className="text-baal-text whitespace-pre-wrap break-words leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: (post.content as string)
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-all">$1</a>')
                }} />
            </div>

            <div className="px-6 py-4 border-t border-baal-border-light bg-baal-bg-light flex items-center justify-between">
              <PostVoteButtons postId={id} initialUpvotes={post.upvotes} initialDownvotes={post.downvotes} />
            </div>
          </div>

          <CommentSection postId={id} initialCommentCount={post.comment_count} />

          {relatedPosts.length > 0 && (
            <BoardSection title={`${board.title}의 다른 글`} posts={relatedPosts} boardPath={`/board/${post.board_type}`} />
          )}
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}
