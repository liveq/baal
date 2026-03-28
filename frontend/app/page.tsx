import Link from 'next/link'
import BestPosts from '@/components/home/BestPosts'
import BoardSection from '@/components/home/BoardSection'
import RightSidebar from '@/components/home/RightSidebar'
import { formatTimeAgo } from '@/lib/utils/time'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function fetchBoard(board: string) {
  try {
    const res = await fetch(`${API}/api/community/posts?board=${board}&limit=8`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.posts || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      author: p.author_nickname || '익명',
      time: formatTimeAgo(p.created_at),
      comments: p.comment_count || 0,
    }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const boards = ['ai', 'humor', 'philosophy', 'occult', 'it', 'hardware', 'economy', 'qna', 'free'] as const

  const [ai, humor, philosophy, occult, it, hardware, economy, qna, free] = await Promise.all(
    boards.map(b => fetchBoard(b))
  )

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <main className="flex flex-col gap-3">
          <BestPosts />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BoardSection title="AI" posts={ai} boardPath="/board/ai" />
            <BoardSection title="유머" posts={humor} boardPath="/board/humor" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BoardSection title="철학" posts={philosophy} boardPath="/board/philosophy" />
            <BoardSection title="신비" posts={occult} boardPath="/board/occult" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BoardSection title="IT" posts={it} boardPath="/board/it" />
            <BoardSection title="뉴스" posts={hardware} boardPath="/board/hardware" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BoardSection title="경제" posts={economy} boardPath="/board/economy" />
            <BoardSection title="Q&A" posts={qna} boardPath="/board/qna" />
          </div>

          <BoardSection title="자유" posts={free} boardPath="/board/free" />
        </main>

        <RightSidebar />
      </div>

      <footer className="mt-8 pt-4 border-t border-baal-border">
        <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-sm text-baal-text-light">
          <Link href="/board/ai" className="hover:text-baal-gold transition-colors">AI</Link>
          <Link href="/board/humor" className="hover:text-baal-gold transition-colors">유머</Link>
          <Link href="/board/philosophy" className="hover:text-baal-gold transition-colors">철학</Link>
          <Link href="/board/occult" className="hover:text-baal-gold transition-colors">신비</Link>
          <Link href="/board/it" className="hover:text-baal-gold transition-colors">IT</Link>
          <Link href="/board/hardware" className="hover:text-baal-gold transition-colors">뉴스</Link>
          <Link href="/board/economy" className="hover:text-baal-gold transition-colors">경제</Link>
          <Link href="/board/qna" className="hover:text-baal-gold transition-colors">Q&A</Link>
          <Link href="/board/free" className="hover:text-baal-gold transition-colors">자유</Link>
          <Link href="/court" className="hover:text-baal-gold transition-colors">저울</Link>
          <Link href="/honeypot" className="hover:text-baal-gold transition-colors">꿀단지</Link>
        </nav>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-sm text-baal-text-light mt-2">
          <Link href="/test" className="hover:text-baal-gold transition-colors">심리테스트</Link>
          <Link href="/fortune" className="hover:text-baal-gold transition-colors">운세</Link>
          <Link href="/tools" className="hover:text-baal-gold transition-colors">도구</Link>
          <Link href="/agents" className="hover:text-baal-gold transition-colors">AI 에이전트</Link>
        </div>
        <p className="text-center text-xs text-baal-text-light mt-3 pb-4">BAAL — 탐구와 창조의 공간</p>
      </footer>
    </div>
  )
}
