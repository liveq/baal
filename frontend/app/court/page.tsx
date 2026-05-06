export const revalidate = 1800

import Link from 'next/link'
import RightSidebar from '@/components/home/RightSidebar'
import { formatTimeAgo } from '@/lib/utils/time'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

const STATUS_TABS = [
  { value: '', label: '전체' },
  { value: 'pending', label: '대기 중' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

async function fetchCases(status: string) {
  try {
    let filters = 'order=created_at.desc&limit=50'
    if (status) filters += `&status=eq.${status}`
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/court_cases?${filters}&select=id,title,description,plaintiff,defendant,judge_type,status,verdict,message_count,vote_count,parent_case_id,created_at,completed_at,penalty_reputation`,
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

export default async function CourtPage({ searchParams }: PageProps) {
  const { status: statusParam } = await searchParams
  const status = statusParam || ''
  const cases = await fetchCases(status)

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <main className="flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-baal px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-baal-text-dark mb-1">바알의 저울</h1>
                <p className="text-sm text-baal-text-light">분탕을 벤하지 않는다. 재판한다.</p>
              </div>
              <Link href="/court/new" className="px-5 py-2.5 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors text-sm">
                법정 개설
              </Link>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map(tab => (
              <Link key={tab.value} href={`/court${tab.value ? `?status=${tab.value}` : ''}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === tab.value
                    ? 'bg-baal-gold text-white'
                    : 'bg-white border border-baal-border text-baal-text-light hover:bg-baal-bg-hover'
                }`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-baal overflow-hidden">
            {cases.length > 0 ? (
              <div className="divide-y divide-baal-border-light">
                {cases.map((c: any) => (
                  <Link key={c.id} href={`/court/${c.id}`}
                    className="block px-5 py-4 hover:bg-baal-bg-hover transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-baal-text-dark">
                        {c.parent_case_id && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded mr-2">재심</span>}
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          c.judge_type === 'ai' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {c.judge_type === 'ai' ? 'AI 판사' : '배심원'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          c.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                          c.status === 'in_progress' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {c.status === 'completed' ? '완료' : c.status === 'in_progress' ? '진행 중' : '대기 중'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-baal-text-light mb-2 line-clamp-2">{c.description}</p>
                    <div className="flex items-center justify-between text-xs text-baal-text-light">
                      <div className="flex items-center gap-3">
                        <span>원고: {c.plaintiff || '익명'}</span>
                        <span className="text-baal-gold font-bold">VS</span>
                        <span>피고: {c.defendant || '미정'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {c.message_count > 0 && (
                          <span className="text-baal-text-light">변론 {c.message_count}</span>
                        )}
                        {c.vote_count > 0 && (
                          <span className="text-purple-600">투표 {c.vote_count}</span>
                        )}
                        {c.verdict ? (
                          <span className={`font-medium ${
                            c.verdict === 'plaintiff_win' ? 'text-green-600' :
                            c.verdict === 'defendant_win' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {c.verdict === 'plaintiff_win' ? '원고 승' : c.verdict === 'defendant_win' ? '피고 승' : '무승부'}
                          </span>
                        ) : (
                          <span>{formatTimeAgo(c.created_at)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-baal-text-light">
                {status ? '해당 상태의 재판이 없습니다.' : '아직 재판이 없습니다. 첫 법정을 개설해보세요.'}
              </div>
            )}
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}
