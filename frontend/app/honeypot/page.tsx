'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Ad {
  id: string
  ad_type: string
  title: string
  description: string
  reward_points: number
  duration: number
  daily_limit: number
}

interface HistoryItem {
  id: string
  points_earned: number
  completed_at: string
  honey_ads?: { title: string; ad_type: string }
}

function LeaderboardSection() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<any[]>([])

  async function load() {
    try {
      const res = await fetch(`${API}/api/honey/leaderboard`)
      if (res.ok) {
        const d = await res.json()
        setData(d.leaderboard || [])
      }
    } catch {}
  }

  return (
    <div className="bg-white rounded-lg shadow-baal overflow-hidden">
      <button onClick={() => { setShow(!show); if (!show) load() }}
        className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-baal-text-dark hover:bg-baal-bg-hover transition-colors">
        <span>포인트 랭킹</span>
        <span className="text-xs text-baal-text-light">{show ? '접기' : '펼치기'}</span>
      </button>
      {show && (
        <div className="border-t border-baal-border-light">
          {data.length > 0 ? (
            <div className="divide-y divide-baal-border-light">
              {data.map((e: any) => (
                <div key={e.rank} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      e.rank <= 3 ? 'bg-baal-gold text-white' : 'bg-gray-100 text-baal-text-light'
                    }`}>{e.rank}</span>
                    <span className="text-sm text-baal-text-dark">{e.ip}</span>
                  </div>
                  <span className="text-sm font-medium text-baal-gold">{e.points?.toLocaleString()}P</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-baal-text-light">아직 랭킹 데이터가 없습니다</div>
          )}
        </div>
      )}
    </div>
  )
}

const AD_COLORS: Record<string, string> = {
  click: 'bg-green-500',
  video: 'bg-blue-500',
  survey: 'bg-purple-500',
  gps: 'bg-amber-500',
}

const AD_ICONS: Record<string, string> = {
  click: '1',
  video: '2',
  survey: '3',
  gps: '4',
}

export default function HoneypotPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [todayPoints, setTodayPoints] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeAd, setActiveAd] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [claimMsg, setClaimMsg] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/honey/stats`)
      if (res.ok) {
        const d = await res.json()
        setTotalPoints(d.total_points || 0)
        setTodayPoints(d.today_points || 0)
        setTodayCount(d.today_count || 0)
      }
    } catch {}
  }, [])

  const loadAds = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/honey/ads`)
      if (res.ok) {
        const d = await res.json()
        setAds(d.ads || [])
      }
    } catch {}
  }, [])

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/honey/history`)
      if (res.ok) {
        const d = await res.json()
        setHistory(d.history || [])
      }
    } catch {}
  }, [])

  useEffect(() => {
    loadAds()
    loadStats()
  }, [loadAds, loadStats])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  function startAd(ad: Ad) {
    if (activeAd) return
    setActiveAd(ad.id)
    const dur = ad.duration || 3
    setCountdown(dur)
    setClaimMsg('')

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          claimReward(ad.id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function claimReward(adId: string) {
    try {
      const res = await fetch(`${API}/api/honey/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_id: adId }),
      })
      const d = await res.json()
      if (res.ok) {
        setTotalPoints(d.total_points || 0)
        setTodayCount(d.today_count || 0)
        setClaimMsg(`+${d.earned}P 획득!`)
        loadStats()
      } else {
        setClaimMsg(d.error || '실패')
      }
    } catch {
      setClaimMsg('네트워크 오류')
    }
    setActiveAd(null)
    setCountdown(0)
    setTimeout(() => setClaimMsg(''), 3000)
  }

  const dailyMax = 50

  return (
    <div className="max-w-[800px] mx-auto px-5 py-5 flex flex-col gap-4">

      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-baal px-6 py-5">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-1">꿀단지</h1>
        <p className="text-sm text-baal-text-light">광고를 보고 포인트를 모으세요. 자발적 참여.</p>
      </div>

      {/* 포인트 + 일일 진행률 */}
      <div className="bg-white rounded-lg shadow-baal p-5 border-l-4 border-baal-gold">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-baal-text-light">내 포인트</p>
            <p className="text-3xl font-bold text-baal-gold">{totalPoints.toLocaleString()}P</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-baal-text-light">오늘 적립</p>
            <p className="text-lg font-bold text-baal-text-dark">{todayPoints}P</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-baal-text-light mb-1">
            <span>일일 진행</span>
            <span>{todayCount}/{dailyMax}회</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-baal-gold rounded-full transition-all"
              style={{ width: `${Math.min(100, (todayCount / dailyMax) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* 알림 메시지 */}
      {claimMsg && (
        <div className={`text-center py-2 rounded-lg text-sm font-medium ${
          claimMsg.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {claimMsg}
        </div>
      )}

      {/* 광고 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ads.map(ad => {
          const isActive = activeAd === ad.id
          const isBusy = activeAd !== null && !isActive

          return (
            <div key={ad.id} className={`bg-white rounded-lg shadow-baal p-5 transition-all ${
              isActive ? 'ring-2 ring-baal-gold' : ''
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-8 h-8 ${AD_COLORS[ad.ad_type] || 'bg-gray-500'} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                  {AD_ICONS[ad.ad_type] || '?'}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-baal-text-dark">{ad.title}</h3>
                  <span className="text-xs text-baal-gold font-medium">{ad.reward_points}P</span>
                </div>
              </div>
              <p className="text-xs text-baal-text-light mb-3">{ad.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-baal-text-light">
                  {ad.duration ? `${ad.duration}초` : '즉시'}
                  {ad.daily_limit ? ` / 일 ${ad.daily_limit}회` : ''}
                </span>
                {isActive ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-baal-gold flex items-center justify-center">
                      <span className="text-sm font-bold text-baal-gold">{countdown}</span>
                    </div>
                    <span className="text-xs text-baal-text-light">진행 중...</span>
                  </div>
                ) : (
                  <button onClick={() => startAd(ad)} disabled={isBusy || todayCount >= dailyMax}
                    className="px-3 py-1.5 bg-baal-gold text-white rounded text-xs font-medium hover:bg-baal-gold-hover disabled:opacity-40 transition-colors">
                    참여하기
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 이력 토글 */}
      <div className="bg-white rounded-lg shadow-baal overflow-hidden">
        <button onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadHistory() }}
          className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-baal-text-dark hover:bg-baal-bg-hover transition-colors">
          <span>적립 이력</span>
          <span className="text-xs text-baal-text-light">{showHistory ? '접기' : '펼치기'}</span>
        </button>
        {showHistory && (
          <div className="border-t border-baal-border-light">
            {history.length > 0 ? (
              <div className="divide-y divide-baal-border-light">
                {history.map(h => (
                  <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-baal-text-dark">{h.honey_ads?.title || '광고'}</span>
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

      {/* 랭킹 */}
      <LeaderboardSection />

      {/* 안내 */}
      <div className="bg-white rounded-lg shadow-baal p-5">
        <h2 className="text-base font-bold text-baal-text-dark mb-3">안내</h2>
        <div className="space-y-2 text-sm text-baal-text">
          <p>일일 최대 50회까지 참여 가능</p>
          <p>출금: 5,000P 이상 + 로그인 필요 (추후 지원)</p>
          <p>부정 행위 감지 시 포인트 차감</p>
          <p>AdSense와 완전 분리된 별도 시스템</p>
        </div>
      </div>
    </div>
  )
}
