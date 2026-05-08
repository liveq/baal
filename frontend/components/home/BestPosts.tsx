import Link from 'next/link'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const BOARD_LABELS: Record<string, { name: string; color: string }> = {
  ai: { name: 'AI', color: 'bg-blue-100 text-blue-700' },
  humor: { name: '유머', color: 'bg-yellow-100 text-yellow-700' },
  philosophy: { name: '철학', color: 'bg-purple-100 text-purple-700' },
  occult: { name: '신비', color: 'bg-indigo-100 text-indigo-700' },
  it: { name: 'IT', color: 'bg-green-100 text-green-700' },
  hardware: { name: '뉴스', color: 'bg-gray-100 text-gray-700' },
  economy: { name: '경제', color: 'bg-emerald-100 text-emerald-700' },
  qna: { name: 'Q&A', color: 'bg-orange-100 text-orange-700' },
  free: { name: '자유', color: 'bg-pink-100 text-pink-700' },
}

async function fetchBest() {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?is_deleted=eq.false&created_at=gte.${since}&upvotes=gte.5&comment_count=gte.3&order=created_at.desc&limit=8&select=id,title,author_nickname,created_at,comment_count,upvotes,board_type`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 1800 },
      }
    )
    if (!res.ok) return []
    return await res.json() || []
  } catch {
    return []
  }
}

export default async function BestPosts() {
  const posts = await fetchBest()

  if (posts.length === 0) return null

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-baal">
      <div className="flex justify-between items-center px-4 py-2.5 border-b-2 border-baal-gold bg-gradient-to-r from-baal-bg-light to-white">
        <Link href="/board/best" className="text-[15px] font-bold text-baal-text-dark hover:text-baal-gold transition-colors">
          베스트
        </Link>
        <Link href="/board/best" className="text-xs text-baal-text-light hover:text-baal-gold transition-colors">
          더보기
        </Link>
      </div>

      <div>
        {posts.map((post: any, idx: number) => {
          const board = BOARD_LABELS[post.board_type] || { name: post.board_type, color: 'bg-gray-100 text-gray-600' }
          return (
            <div key={post.id || idx}
              className="px-4 py-[7px] border-b border-baal-border-light last:border-b-0 hover:bg-baal-bg-hover flex items-center gap-1.5 text-[13px]">
              <Link href={`/board/${post.board_type}`}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${board.color} hover:opacity-80 transition-opacity`}>
                {board.name}
              </Link>
              <Link href={`/post/${post.id}`} className="truncate min-w-0 text-baal-text hover:text-baal-gold transition-colors">
                {post.title}
              </Link>
              {post.comment_count > 0 && (
                <span className="text-[11px] text-baal-gold font-medium shrink-0">[{post.comment_count}]</span>
              )}
              {post.upvotes >= 10 && (
                <span className="text-[10px] text-red-500 font-bold shrink-0">HOT</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
