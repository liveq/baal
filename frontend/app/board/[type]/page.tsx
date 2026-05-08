// 2026-05-07 Vercel CPU 절감: 120 → 1800 (Fluid Active CPU 90% 도달 대응)
export const revalidate = 1800

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { formatTimeAgo } from '@/lib/utils/time'
import Link from 'next/link'
import RightSidebar from '@/components/home/RightSidebar'
import NewsCategoryFilter from '@/components/board/NewsCategoryFilter'
import CompassCategoryFilter from '@/components/board/CompassCategoryFilter'
import { countryToFlag, countryName } from '@/lib/utils/country'

const BOARD_TAG: Record<string, { name: string; color: string }> = {
  ai: { name: 'AI', color: 'bg-blue-100 text-blue-700' },
  humor: { name: '유머', color: 'bg-yellow-100 text-yellow-700' },
  philosophy: { name: '철학', color: 'bg-purple-100 text-purple-700' },
  occult: { name: '신비', color: 'bg-indigo-100 text-indigo-700' },
  it: { name: 'IT', color: 'bg-green-100 text-green-700' },
  hardware: { name: '뉴스', color: 'bg-gray-100 text-gray-700' },
  economy: { name: '경제', color: 'bg-emerald-100 text-emerald-700' },
  qna: { name: 'Q&A', color: 'bg-orange-100 text-orange-700' },
  free: { name: '자유', color: 'bg-pink-100 text-pink-700' },
  compass: { name: '나침반', color: 'bg-amber-100 text-amber-700' },
  assault: { name: '어썰트', color: 'bg-stone-100 text-stone-700' },
}

// 카테고리별 색상 (나침반 + 뉴스)
const CATEGORY_TAG_COLOR: Record<string, string> = {
  // 나침반 6종
  '투자':   'bg-emerald-100 text-emerald-700',
  '갓생':   'bg-red-100 text-red-700',
  '멘탈':   'bg-purple-100 text-purple-700',
  '커리어': 'bg-blue-100 text-blue-700',
  '관계':   'bg-pink-100 text-pink-700',
  '생활':   'bg-teal-100 text-teal-700',
  // 뉴스 7종
  '국제':   'bg-slate-100 text-slate-700',
  '아시아': 'bg-rose-100 text-rose-700',
  '테크':   'bg-cyan-100 text-cyan-700',
  'AI':     'bg-violet-100 text-violet-700',
  '과학':   'bg-lime-100 text-lime-700',
  '세계':   'bg-sky-100 text-sky-700',
  '유럽':   'bg-indigo-100 text-indigo-700',
  '뉴스':   'bg-amber-100 text-amber-700',
}

interface PageProps {
  params: Promise<{ type: string }>
  searchParams: Promise<{ page?: string; cat?: string }>
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
  free: { title: '자유', description: '자유로운 소통 공간' },
  best: { title: '베스트', description: '인기 게시글 모음' },
  compass: { title: '🧭 나침반', description: 'AI가 뉴스와 지식을 합성한 실용 조언 — 투자·갓생·멘탈·커리어·관계·생활' },
  assault: { title: '어썰트', description: '코디넷 어썰트(2002) 비영리 부활 프로젝트 — 다운로드, 패치노트, 매칭 모집, 버그 신고' },
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const POSTS_PER_PAGE = 20

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const board = boardInfo[type]
  if (!board) return { title: 'BAAL' }
  return {
    title: `${board.title} - BAAL`,
    description: board.description,
    alternates: {
      // 쿼리 파라미터(?page=N, ?cat=X) 변형을 기본 URL로 canonical 정규화 → 중복 색인 방지
      canonical: `https://baal.co.kr/board/${type}`,
    },
    openGraph: {
      title: `${board.title} - BAAL`,
      description: board.description,
      url: `https://baal.co.kr/board/${type}`,
      type: 'website',
    },
  }
}

export default async function BoardPage({ params, searchParams }: PageProps) {
  const { type } = await params
  const { page: pageParam, cat: catParam } = await searchParams
  const page = parseInt(pageParam || '1', 10)
  const activeCat = catParam || ''

  if (!boardInfo[type]) {
    notFound()
  }

  const board = boardInfo[type]

  let posts: any[] = []
  let total = 0

  const NEWS_CATS = [
    { value: '', label: '전체' },
    { value: '[국제]', label: '국제' },
    { value: '[아시아]', label: '아시아' },
    { value: '[테크]', label: '테크' },
    { value: '[AI]', label: 'AI' },
    { value: '[과학]', label: '과학' },
    { value: '[세계]', label: '세계' },
    { value: '[유럽]', label: '유럽' },
    { value: '[뉴스]', label: '기타' },
  ]

  try {
    const offset = (page - 1) * POSTS_PER_PAGE
    const select = 'id,title,board_type,author_nickname,created_at,comment_count,upvotes,downvotes,view_count,is_pinned,news_category,country_code'
    let filters = `is_deleted=eq.false`
    if (type === 'best') {
      filters += `&upvotes=gte.5`
    } else {
      filters += `&board_type=eq.${type}`
    }
    if (type === 'hardware' && activeCat) {
      filters += `&news_category=eq.${encodeURIComponent(activeCat)}`
    }
    if (type === 'compass' && activeCat) {
      // compass는 news_category에 '[투자]' / '[갓생]' 등 저장
      const cats = activeCat.split(',').map(c => `[${c.trim()}]`)
      const inList = cats.map(c => `"${encodeURIComponent(c)}"`).join(',')
      filters += `&news_category=in.(${inList})`
    }
    const order = 'order=created_at.desc'

    // 병렬: 포스트 조회 + 별도 count 쿼리 (Content-Range 헤더 파싱 Next.js ISR에서 불안정 → 분리)
    const [res, countRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/posts?${filters}&${order}&offset=${offset}&limit=${POSTS_PER_PAGE}&select=${select}`,
        {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          next: { revalidate: 1800 },
        }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/posts?${filters}&select=id`,
        {
          method: 'HEAD',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'count=exact',
            Range: '0-0',
            'Range-Unit': 'items',
          },
          next: { revalidate: 1800 },
        }
      ),
    ])
    if (res.ok) {
      posts = await res.json()
    }
    // count 파싱 — HEAD + Range 조합이 가장 안정적 Content-Range 헤더 제공
    const cr = countRes.headers.get('content-range')
    if (cr) {
      const m = cr.match(/\/(\d+)$/)
      if (m) total = parseInt(m[1], 10)
    }
  } catch {}

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <main className="flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-baal px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-baal-text-dark mb-1">{board.title}</h1>
                <p className="text-sm text-baal-text-light">{board.description}</p>
              </div>
              {type !== 'best' && type !== 'ai' && type !== 'hardware' && (
                <Link
                  href={`/write?board=${type}`}
                  className="px-5 py-2.5 bg-baal-gold text-white rounded-lg hover:bg-baal-gold-hover transition-colors font-medium"
                >
                  글쓰기
                </Link>
              )}
            </div>
          </div>

          {type === 'hardware' && (
            <NewsCategoryFilter activeCat={activeCat} />
          )}

          {type === 'compass' && (
            <CompassCategoryFilter activeCat={activeCat} />
          )}

          <div className="bg-white rounded-lg shadow-baal overflow-hidden">
            <div className="hidden sm:grid grid-cols-[50px_1fr_80px_80px_60px] px-6 py-3 border-b-2 border-baal-gold bg-baal-bg-light text-sm font-medium text-baal-text-gray">
              <div className="text-center">번호</div>
              <div className="text-center">제목</div>
              <div className="text-center">작성자</div>
              <div className="text-center">작성일</div>
              <div className="text-center">조회</div>
            </div>

            {posts.length > 0 ? (
              <div>
                {posts.map((post: any, idx: number) => {
                  const num = total - ((page - 1) * POSTS_PER_PAGE) - idx
                  return (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="grid grid-cols-[1fr] sm:grid-cols-[50px_1fr_80px_80px_60px] px-6 py-3 border-b border-baal-border-light last:border-b-0 hover:bg-baal-bg-hover transition-colors items-center"
                  >
                    <span className="hidden sm:block text-center text-sm text-baal-text-light">{num}</span>
                    <span className="flex items-center gap-1 min-w-0 overflow-hidden">
                      {post.is_pinned && (
                        <span className="px-2 py-0.5 text-xs bg-baal-gold text-white rounded shrink-0">공지</span>
                      )}
                      {type === 'best' && post.board_type && BOARD_TAG[post.board_type] && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${BOARD_TAG[post.board_type].color}`}>
                          {BOARD_TAG[post.board_type].name}
                        </span>
                      )}
                      {(type === 'compass' || type === 'hardware') && post.news_category && (() => {
                        const catName = post.news_category.replace(/^\[|\]$/g, '')
                        const colorCls = CATEGORY_TAG_COLOR[catName] || 'bg-amber-100 text-amber-700'
                        return (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${colorCls}`}>
                            {catName}
                          </span>
                        )
                      })()}
                      <span className="text-baal-text font-medium truncate" title={post.title}>{post.title}</span>
                      {post.comment_count > 0 && (
                        <span className="text-baal-gold text-sm shrink-0">[{post.comment_count}]</span>
                      )}
                    </span>
                    <span className="hidden sm:block text-center text-sm text-baal-text-light truncate"><span title={countryName(post.country_code)}>{countryToFlag(post.country_code)}</span> {post.author_nickname || '익명'}</span>
                    <span className="hidden sm:block text-center text-sm text-baal-text-light">{formatTimeAgo(post.created_at)}</span>
                    <span className="hidden sm:block text-center text-sm text-baal-text-light">{post.view_count}</span>
                  </Link>
                  )
                })}
              </div>
            ) : (
              <div className="py-20 text-center text-baal-text-light">
                게시글이 없습니다. 첫 게시글을 작성해보세요!
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {page > 1 && (
                <Link href={`/board/${type}?page=${page - 1}`} className="px-4 py-2 border border-baal-border rounded-lg hover:bg-baal-bg-hover transition-colors">
                  이전
                </Link>
              )}
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const n = Math.max(1, page - 5) + i
                if (n > totalPages) return null
                return (
                  <Link key={n} href={`/board/${type}?page=${n}`}
                    className={`px-4 py-2 border rounded-lg transition-colors ${n === page ? 'bg-baal-gold text-white border-baal-gold' : 'border-baal-border hover:bg-baal-bg-hover'}`}>
                    {n}
                  </Link>
                )
              })}
              {page < totalPages && (
                <Link href={`/board/${type}?page=${page + 1}`} className="px-4 py-2 border border-baal-border rounded-lg hover:bg-baal-bg-hover transition-colors">
                  다음
                </Link>
              )}
            </div>
          )}
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}
