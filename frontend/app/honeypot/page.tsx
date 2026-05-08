'use client'

import { useState, useEffect, useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.baal.co.kr'

// ── 오퍼월 설정 (네트워크 가입 후 값 교체) ──
const OFFERWALLS = [
  {
    id: 'cpalead',
    name: 'CPAlead',
    // CPAlead 가입 후 YOUR_APP_ID 교체
    getUrl: (uid: string) =>
      `https://fastsvr.com/list/${'{YOUR_APP_ID}'}?subid=${uid}`,
    description: '앱 설치, 회원가입, 설문 완료 등',
    rewardRange: '10 ~ 5,000원',
    color: 'bg-emerald-500',
  },
  {
    id: 'adgate',
    name: 'AdGate Media',
    getUrl: (uid: string) =>
      `https://wall.adgaterewards.com/${'{YOUR_WALL_ID}'}?s1=${uid}`,
    description: '영상 시청, 설문, 앱 설치',
    rewardRange: '5 ~ 3,000원',
    color: 'bg-blue-500',
  },
  {
    id: 'pollfish',
    name: '설문조사',
    getUrl: (uid: string) =>
      `https://www.pollfish.com/publisher/${'{YOUR_API_KEY}'}?uid=${uid}`,
    description: '짧은 설문 완료 시 높은 보상',
    rewardRange: '50 ~ 500원',
    color: 'bg-purple-500',
  },
]

interface Stats {
  total_points: number
  today_points: number
  today_count: number
  daily_limit: number
}

interface HistoryItem {
  id: string
  points_earned: number
  completed_at: string
  honey_ads?: { title: string; ad_type: string }
  source?: string
}

interface LeaderEntry {
  rank: number
  ip: string
  points: number
}

// ── 유저 ID (IP 기반, 로컬 저장) ──
function getUserId(): string {
  if (typeof window === 'undefined') return 'anon'
  let uid = localStorage.getItem('baal_honey_uid')
  if (!uid) {
    uid = 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    localStorage.setItem('baal_honey_uid', uid)
  }
  return uid
}

// ── API 호출 헬퍼 ──
async function api<T>(path: string, opts?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...opts?.headers },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ══════════════════════════════════════════
// 메인 페이지
// ══════════════════════════════════════════
export default function HoneypotPage() {
  const [stats, setStats] = useState<Stats>({ total_points: 0, today_points: 0, today_count: 0, daily_limit: 50 })
  const [activeWall, setActiveWall] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])
  const [toast, setToast] = useState('')
  const uid = typeof window !== 'undefined' ? getUserId() : 'anon'

  const loadStats = useCallback(async () => {
    const data = await api<Stats>('/api/honey/stats')
    if (data) setStats(data)
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  // 오퍼월 열기
  function openOfferwall(wallId: string) {
    setActiveWall(wallId)
  }

  // 이력 로드
  async function loadHistory() {
    const data = await api<{ history: HistoryItem[] }>('/api/honey/history')
    if (data?.history) setHistory(data.history)
  }

  // 리더보드 로드
  async function loadLeaderboard() {
    const data = await api<{ leaderboard: LeaderEntry[] }>('/api/honey/leaderboard')
    if (data?.leaderboard) setLeaderboard(data.leaderboard)
  }

  // 포인트 갱신 (오퍼월에서 돌아왔을 때)
  useEffect(() => {
    function onFocus() { loadStats() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadStats])

  return (
    <div className="max-w-[860px] mx-auto px-4 py-5 flex flex-col gap-4">

      {/* ── 헤더 ── */}
      <div className="bg-white rounded-xl shadow-baal px-6 py-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🍯</span>
          <div>
            <h1 className="text-2xl font-bold text-baal-text-dark">꿀단지</h1>
            <p className="text-sm text-baal-text-light">광고 참여하고 현금으로 바꿀 수 있는 포인트를 모으세요</p>
          </div>
        </div>
      </div>

      {/* ── 포인트 현황 ── */}
      <div className="bg-white rounded-xl shadow-baal p-5 border-l-4 border-baal-gold">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-baal-text-light">내 포인트</p>
            <p className="text-3xl font-extrabold text-baal-gold">{stats.total_points.toLocaleString()}<span className="text-base ml-1">P</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-baal-text-light">오늘 적립</p>
            <p className="text-lg font-bold text-baal-text-dark">{stats.today_points.toLocaleString()}P</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-baal-text-light mb-1">
            <span>일일 진행</span>
            <span>{stats.today_count}/{stats.daily_limit}회</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-baal-gold rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.today_count / stats.daily_limit) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* ── 토스트 ── */}
      {toast && (
        <div className="text-center py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 animate-pulse">
          {toast}
        </div>
      )}

      {/* ── 오퍼월 카드 ── */}
      <div>
        <h2 className="text-base font-bold text-baal-text-dark mb-3">광고 참여하기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OFFERWALLS.map(wall => (
            <div key={wall.id}
              className={`bg-white rounded-xl shadow-baal p-5 transition-all hover:shadow-baal-md ${
                activeWall === wall.id ? 'ring-2 ring-baal-gold' : ''
              }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-10 h-10 ${wall.color} rounded-lg flex items-center justify-center text-white text-lg font-bold`}>
                  {wall.name[0]}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-baal-text-dark">{wall.name}</h3>
                  <span className="text-xs text-baal-gold font-medium">{wall.rewardRange}</span>
                </div>
              </div>
              <p className="text-xs text-baal-text-light mb-4">{wall.description}</p>
              <button
                onClick={() => openOfferwall(wall.id)}
                className="w-full py-2 bg-baal-gold text-white rounded-lg text-sm font-medium hover:bg-baal-gold-hover transition-colors">
                참여하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── 오퍼월 iframe ── */}
      {activeWall && (
        <div className="bg-white rounded-xl shadow-baal overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-baal-border-light">
            <span className="text-sm font-medium text-baal-text-dark">
              {OFFERWALLS.find(w => w.id === activeWall)?.name} 오퍼월
            </span>
            <button onClick={() => { setActiveWall(null); loadStats() }}
              className="text-xs text-baal-text-light hover:text-baal-text-dark transition-colors">
              닫기 ✕
            </button>
          </div>
          <div className="relative" style={{ minHeight: 500 }}>
            <iframe
              src={OFFERWALLS.find(w => w.id === activeWall)?.getUrl(uid)}
              className="w-full border-0"
              style={{ height: 500 }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title="offerwall"
            />
            {/* 네트워크 미연동 시 안내 */}
            <div className="absolute inset-0 flex items-center justify-center bg-baal-bg-light/90 backdrop-blur-sm">
              <div className="text-center px-8">
                <p className="text-4xl mb-4">🔧</p>
                <p className="text-base font-semibold text-baal-text-dark mb-2">광고 네트워크 연동 준비 중</p>
                <p className="text-sm text-baal-text-light mb-1">CPAlead / AdGate 가입 후 APP_ID를 설정하면</p>
                <p className="text-sm text-baal-text-light">이 영역에 실제 광고 오퍼가 표시됩니다.</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <code className="text-xs text-baal-text-light break-all">
                    frontend/app/honeypot/page.tsx → OFFERWALLS 배열에서 YOUR_APP_ID 교체
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 간단 적립 (기존 광고 시스템) ── */}
      <SimpleAdSection onEarned={(msg) => { setToast(msg); loadStats(); setTimeout(() => setToast(''), 3000) }} />

      {/* ── 적립 이력 ── */}
      <div className="bg-white rounded-xl shadow-baal overflow-hidden">
        <button onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadHistory() }}
          className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-baal-text-dark hover:bg-baal-bg-hover transition-colors">
          <span>적립 이력</span>
          <span className="text-xs text-baal-text-light">{showHistory ? '접기 ▲' : '펼치기 ▼'}</span>
        </button>
        {showHistory && (
          <div className="border-t border-baal-border-light">
            {history.length > 0 ? (
              <div className="divide-y divide-baal-border-light">
                {history.map(h => (
                  <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-baal-text-dark">{h.honey_ads?.title || h.source || '광고'}</span>
                      <span className="text-xs text-baal-text-light ml-2">
                        {new Date(h.completed_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-baal-gold">+{h.points_earned}P</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-baal-text-light">아직 적립 이력이 없습니다</div>
            )}
          </div>
        )}
      </div>

      {/* ── 리더보드 ── */}
      <div className="bg-white rounded-xl shadow-baal overflow-hidden">
        <button onClick={() => { setShowLeaderboard(!showLeaderboard); if (!showLeaderboard) loadLeaderboard() }}
          className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-baal-text-dark hover:bg-baal-bg-hover transition-colors">
          <span>포인트 랭킹</span>
          <span className="text-xs text-baal-text-light">{showLeaderboard ? '접기 ▲' : '펼치기 ▼'}</span>
        </button>
        {showLeaderboard && (
          <div className="border-t border-baal-border-light">
            {leaderboard.length > 0 ? (
              <div className="divide-y divide-baal-border-light">
                {leaderboard.map(e => (
                  <div key={e.rank} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        e.rank <= 3 ? 'bg-baal-gold text-white' : 'bg-gray-100 text-baal-text-light'
                      }`}>{e.rank}</span>
                      <span className="text-sm text-baal-text-dark">{e.ip}</span>
                    </div>
                    <span className="text-sm font-medium text-baal-gold">{e.points.toLocaleString()}P</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-baal-text-light">아직 랭킹 데이터가 없습니다</div>
            )}
          </div>
        )}
      </div>

      {/* ── 안내 ── */}
      <div className="bg-white rounded-xl shadow-baal p-5">
        <h2 className="text-base font-bold text-baal-text-dark mb-3">안내</h2>
        <div className="space-y-2 text-sm text-baal-text">
          <p>• 오퍼월에서 미션(앱설치, 설문 등)을 완료하면 포인트가 자동 적립됩니다</p>
          <p>• 적립 반영에 최대 수분이 소요될 수 있습니다</p>
          <p>• 일일 최대 {stats.daily_limit}회 참여 가능</p>
          <p>• 출금: 5,000P 이상 시 신청 가능 (추후 오픈)</p>
          <p>• 부정 행위 감지 시 포인트가 차감됩니다</p>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
// 간단 적립 섹션 (기존 광고 카드)
// ══════════════════════════════════════════
function SimpleAdSection({ onEarned }: { onEarned: (msg: string) => void }) {
  const [ads, setAds] = useState<any[]>([])
  const [activeAd, setActiveAd] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    api<{ ads: any[] }>('/api/honey/ads').then(d => {
      if (d?.ads) setAds(d.ads)
    })
  }, [])

  function startAd(ad: any) {
    if (activeAd) return
    setActiveAd(ad.id)
    const dur = ad.duration || 3
    setCountdown(dur)

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          claimReward(ad.id, ad.reward_points)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function claimReward(adId: string, pts: number) {
    const data = await api<{ ok: boolean; earned: number }>('/api/honey/claim', {
      method: 'POST',
      body: JSON.stringify({ ad_id: adId }),
    })
    setActiveAd(null)
    setCountdown(0)
    if (data?.ok) {
      onEarned(`+${data.earned}P 획득!`)
    }
  }

  if (ads.length === 0) return null

  const AD_COLORS: Record<string, string> = { click: 'bg-green-500', video: 'bg-blue-500', survey: 'bg-purple-500', gps: 'bg-amber-500' }

  return (
    <div>
      <h2 className="text-base font-bold text-baal-text-dark mb-3">간단 적립</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ads.map(ad => {
          const isActive = activeAd === ad.id
          const isBusy = activeAd !== null && !isActive
          return (
            <div key={ad.id} className={`bg-white rounded-xl shadow-baal p-4 transition-all ${isActive ? 'ring-2 ring-baal-gold' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-7 h-7 ${AD_COLORS[ad.ad_type] || 'bg-gray-500'} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                  {ad.reward_points}
                </span>
                <div>
                  <h3 className="text-xs font-semibold text-baal-text-dark leading-tight">{ad.title}</h3>
                </div>
              </div>
              <p className="text-[11px] text-baal-text-light mb-3 line-clamp-2">{ad.description}</p>
              {isActive ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-baal-gold flex items-center justify-center">
                    <span className="text-sm font-bold text-baal-gold">{countdown}</span>
                  </div>
                </div>
              ) : (
                <button onClick={() => startAd(ad)} disabled={isBusy}
                  className="w-full py-1.5 bg-baal-gold text-white rounded-lg text-xs font-medium hover:bg-baal-gold-hover disabled:opacity-40 transition-colors">
                  {ad.duration ? `${ad.duration}초` : '참여'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
