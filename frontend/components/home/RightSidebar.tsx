import Link from 'next/link'
import LiveChat from './LiveChat'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

async function fetchPopular() {
  try {
    const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?is_deleted=eq.false&created_at=gte.${since}&order=comment_count.desc&limit=8&select=id,title,comment_count`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: 1800 },
      }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

const categories = [
  { name: '베스트', path: '/board/best' },
  { name: 'AI', path: '/board/ai' },
  { name: 'IT', path: '/board/it' },
  { name: '철학', path: '/board/philosophy' },
  { name: '신비', path: '/board/occult' },
  { name: '유머', path: '/board/humor' },
  { name: '경제', path: '/board/economy' },
  { name: '뉴스', path: '/board/hardware' },
  { name: 'Q&A', path: '/board/qna' },
  { name: '자유', path: '/board/free' },
]

export default async function RightSidebar() {
  const popular = await fetchPopular()

  return (
    <aside className="flex flex-col gap-4">
      <div className="bg-white rounded-lg p-4 shadow-baal">
        <h3 className="text-[15px] font-bold mb-3 text-baal-text-dark">
          인기글
        </h3>
        {popular.length > 0 ? (
          popular.map((post: any, idx: number) => (
            <Link
              key={post.id || idx}
              href={post.id ? `/post/${post.id}` : '#'}
              className="py-2 border-b border-baal-border-light last:border-b-0 text-[13px] flex items-center gap-2 hover:text-baal-gold transition-colors block"
            >
              <span
                className={`inline-block w-[18px] h-[18px] leading-[18px] text-center rounded text-[11px] font-semibold shrink-0 ${
                  idx === 0
                    ? 'bg-baal-gold text-white'
                    : idx === 1
                    ? 'bg-reputation-silver text-white'
                    : idx === 2
                    ? 'bg-reputation-bronze text-white'
                    : 'bg-baal-border-light text-baal-text-dark'
                }`}
              >
                {idx + 1}
              </span>
              <span className="truncate">{post.title}</span>
            </Link>
          ))
        ) : (
          <p className="text-xs text-baal-text-light py-2">아직 글이 없습니다</p>
        )}
      </div>

      <LiveChat />

    </aside>
  )
}
