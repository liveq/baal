'use client'

import Link from 'next/link'

interface Post {
  id?: string
  title: string
  author: string
  time: string
  comments: number
}

interface BoardSectionProps {
  title: string
  posts: Post[]
  boardPath?: string
}

export default function BoardSection({
  title,
  posts,
  boardPath = '/board'
}: BoardSectionProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-baal">
      <div className="flex justify-between items-center px-4 py-2.5 border-b-2 border-baal-gold bg-gradient-to-r from-baal-bg-light to-white">
        <Link href={boardPath} className="text-[15px] font-bold text-baal-text-dark hover:text-baal-gold transition-colors">
          {title}
        </Link>
        <Link href={boardPath} className="text-xs text-baal-text-light hover:text-baal-gold transition-colors">
          더보기
        </Link>
      </div>

      <div>
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <Link
              key={post.id || idx}
              href={post.id ? `/post/${post.id}` : '#'}
              className="px-4 py-[7px] border-b border-baal-border-light last:border-b-0 hover:bg-baal-bg-hover flex items-center gap-2 block text-[13px]"
            >
              <span className="truncate min-w-0 text-baal-text">{post.title}</span>
              {post.comments > 0 && (
                <span className="text-[11px] text-baal-gold font-medium shrink-0">[{post.comments}]</span>
              )}
            </Link>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-xs text-baal-text-light">
            아직 글이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
