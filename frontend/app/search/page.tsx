'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils/time'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const BOARD_NAMES: Record<string, string> = {
  ai: 'AI', humor: '유머', philosophy: '철학', occult: '신비',
  it: 'IT', hardware: '뉴스', economy: '경제', qna: 'Q&A', free: '자유',
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-baal-text-light">로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQ)
  const [board, setBoard] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string, b: string) => {
    if (q.length < 2) return
    setLoading(true)
    setSearched(true)
    try {
      let filters = `is_deleted=eq.false&or=(title.ilike.*${encodeURIComponent(q)}*,content.ilike.*${encodeURIComponent(q)}*)`
      if (b) filters += `&board_type=eq.${b}`
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/posts?${filters}&order=created_at.desc&limit=50&select=id,title,board_type,author_nickname,created_at,comment_count,view_count`,
        {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        }
      )
      if (res.ok) {
        setPosts(await res.json())
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    if (initialQ.length >= 2) doSearch(initialQ, '')
  }, [initialQ, doSearch])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doSearch(query, board)
  }

  return (
    <div className="max-w-[900px] mx-auto px-5 py-5 flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-baal p-5">
        <h1 className="text-xl font-bold text-baal-text-dark mb-4">검색</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <select value={board} onChange={e => setBoard(e.target.value)}
            className="border border-baal-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baal-gold">
            <option value="">전체</option>
            {Object.entries(BOARD_NAMES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="검색어 입력 (2자 이상)"
            className="flex-1 border border-baal-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-baal-gold" />
          <button type="submit" disabled={query.length < 2}
            className="px-5 py-2 bg-baal-gold text-white rounded-lg text-sm font-medium hover:bg-baal-gold-hover disabled:opacity-40 transition-colors">
            검색
          </button>
        </form>
      </div>

      {loading && <div className="text-center py-8 text-baal-text-light text-sm">검색 중...</div>}

      {!loading && searched && (
        <div className="bg-white rounded-lg shadow-baal overflow-hidden">
          {posts.length > 0 ? (
            <>
              <div className="px-5 py-3 border-b border-baal-border-light text-sm text-baal-text-light">
                {posts.length}건
              </div>
              <div className="divide-y divide-baal-border-light">
                {posts.map((p: any) => (
                  <Link key={p.id} href={`/post/${p.id}`}
                    className="block px-5 py-4 hover:bg-baal-bg-hover transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-baal-bg-light text-baal-text-light">
                        {BOARD_NAMES[p.board_type] || p.board_type}
                      </span>
                      <span className="text-sm font-medium text-baal-text-dark truncate">{p.title}</span>
                      {p.comment_count > 0 && (
                        <span className="text-baal-gold text-xs shrink-0">[{p.comment_count}]</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-baal-text-light">
                      <span>{p.author_nickname || '익명'}</span>
                      <span>{formatTimeAgo(p.created_at)}</span>
                      <span>조회 {p.view_count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-sm text-baal-text-light">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
