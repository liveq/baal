'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils/time'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const REACTIONS = [
  { type: 'popcorn', label: '🍿' },
  { type: 'laugh', label: '😂' },
  { type: 'shock', label: '😱' },
  { type: 'angry', label: '😡' },
  { type: 'clap', label: '👏' },
]

const MSG_STYLES: Record<string, { bg: string; label: string; border: string }> = {
  argument: { bg: 'bg-blue-50', label: '주장', border: 'border-l-blue-400' },
  evidence: { bg: 'bg-amber-50', label: '증거', border: 'border-l-amber-400' },
  chat:     { bg: 'bg-gray-50', label: '', border: 'border-l-gray-200' },
  verdict:  { bg: 'bg-baal-bg-light', label: '판결', border: 'border-l-baal-gold' },
}

const VERDICT_LABELS: Record<string, string> = {
  plaintiff_win: '원고 승',
  defendant_win: '피고 승',
  draw: '무승부',
}

/* ── 배심원 투표 ── */
function JuryVoting({ caseId, completed = false }: { caseId: string; completed?: boolean }) {
  const [pVotes, setPVotes] = useState(0)
  const [dVotes, setDVotes] = useState(0)
  const [voted, setVoted] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/court/cases/${caseId}/votes`)
      .then(r => r.json())
      .then(d => { setPVotes(d.plaintiff_votes || 0); setDVotes(d.defendant_votes || 0) })
      .catch(() => {})
  }, [caseId])

  async function vote(verdict: string) {
    const res = await fetch(`${API}/api/court/cases/${caseId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verdict }),
    })
    if (res.ok) {
      const d = await res.json()
      setPVotes(d.plaintiff_votes); setDVotes(d.defendant_votes)
      setVoted(true)
    } else {
      const d = await res.json().catch(() => ({}))
      if (d.error?.includes('이미')) setVoted(true)
    }
  }

  const total = pVotes + dVotes
  const pPct = total > 0 ? Math.round(pVotes / total * 100) : 50

  return (
    <div className="bg-white rounded-lg shadow-baal p-5">
      <h2 className="text-base font-bold text-baal-text-dark mb-4">배심원 투표</h2>
      <div className="flex h-8 rounded-lg overflow-hidden mb-3">
        <div className="bg-green-500 transition-all flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${pPct}%`, minWidth: total > 0 ? '30px' : undefined }}>
          {total > 0 && `${pPct}%`}
        </div>
        <div className="bg-red-500 transition-all flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${100 - pPct}%`, minWidth: total > 0 ? '30px' : undefined }}>
          {total > 0 && `${100 - pPct}%`}
        </div>
      </div>
      <div className="flex justify-between text-sm text-baal-text-light mb-4">
        <span>원고 승: {pVotes}표</span>
        <span>총 {total}표</span>
        <span>피고 승: {dVotes}표</span>
      </div>
      {completed ? (
        <p className="text-center text-sm text-baal-text-light">투표 마감</p>
      ) : !voted ? (
        <div className="flex gap-3 justify-center">
          <button onClick={() => vote('plaintiff_win')} className="px-5 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">원고 승</button>
          <button onClick={() => vote('defendant_win')} className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">피고 승</button>
        </div>
      ) : (
        <p className="text-center text-sm text-baal-text-light">투표 완료</p>
      )}
    </div>
  )
}

/* ── 재심 요청 버튼 ── */
function AppealButton({ caseId }: { caseId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [judgeType, setJudgeType] = useState<'ai' | 'jury'>('ai')
  const [submitting, setSubmitting] = useState(false)

  async function handleAppeal() {
    if (!reason.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/court/cases/${caseId}/appeal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim(), judge_type: judgeType }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.id) router.push(`/court/${data.id}`)
        else router.push('/court')
      }
    } catch {}
    setSubmitting(false)
  }

  if (!open) {
    return (
      <div className="flex justify-center">
        <button onClick={() => setOpen(true)}
          className="px-5 py-2.5 border border-baal-border rounded-lg text-sm text-baal-text-dark hover:bg-baal-bg-hover transition-colors">
          재심 요청
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-baal p-5">
      <h3 className="text-base font-bold text-baal-text-dark mb-3">재심 요청</h3>
      <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
        placeholder="재심 사유를 작성하세요"
        className="w-full border border-baal-border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-baal-gold resize-none" />
      <div className="flex gap-2 mb-3">
        <button onClick={() => setJudgeType('ai')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
            judgeType === 'ai' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'border-baal-border text-baal-text-light'
          }`}>AI 판사</button>
        <button onClick={() => setJudgeType('jury')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
            judgeType === 'jury' ? 'bg-purple-50 border-purple-400 text-purple-700' : 'border-baal-border text-baal-text-light'
          }`}>배심원</button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="px-4 py-2 border border-baal-border rounded-lg text-sm text-baal-text-light">취소</button>
        <button onClick={handleAppeal} disabled={submitting || !reason.trim()}
          className="flex-1 py-2 bg-baal-gold text-white rounded-lg text-sm font-medium hover:bg-baal-gold-hover disabled:opacity-50 transition-colors">
          {submitting ? '요청 중...' : '재심 요청'}
        </button>
      </div>
    </div>
  )
}

/* ── 메인 페이지 ── */
export default function CourtDetailPage() {
  const { id } = useParams()
  const [courtCase, setCourtCase] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [msgType, setMsgType] = useState<'chat' | 'argument' | 'evidence'>('chat')
  const [nickname, setNickname] = useState('')
  const [judging, setJudging] = useState(false)
  const [verdict, setVerdict] = useState<any>(null)
  const [reactions, setReactions] = useState<Record<string, number>>({})

  const loadCase = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/court/cases/${id}`)
      if (res.ok) {
        const data = await res.json()
        setCourtCase(data.case)
        setMessages(data.messages || [])
      }
    } catch {}
  }, [id])

  const loadReactions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/court/cases/${id}/reactions`)
      if (res.ok) setReactions(await res.json())
    } catch {}
  }, [id])

  useEffect(() => {
    loadCase()
    loadReactions()
    const interval = setInterval(() => { loadCase(); loadReactions() }, 15000)
    return () => clearInterval(interval)
  }, [loadCase, loadReactions])

  async function sendMessage() {
    if (!newMessage.trim()) return
    await fetch(`${API}/api/court/cases/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: newMessage.trim(),
        message_type: msgType,
        nickname: nickname.trim() || '익명',
      }),
    })
    setNewMessage('')
    loadCase()
  }

  async function addReaction(type: string) {
    try {
      const res = await fetch(`${API}/api/court/cases/${id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      if (res.ok) setReactions(await res.json())
    } catch {}
  }

  async function requestJudge() {
    setJudging(true)
    try {
      const res = await fetch(`${API}/api/court/cases/${id}/judge`, { method: 'POST' })
      if (res.ok) {
        setVerdict(await res.json())
        loadCase()
      }
    } catch {}
    setJudging(false)
  }

  if (!courtCase) return <div className="p-8 text-center text-baal-text-light">불러오는 중...</div>

  const isCompleted = courtCase.status === 'completed'

  return (
    <div className="max-w-[800px] mx-auto px-5 py-5 flex flex-col gap-4">

      {/* 사건 정보 */}
      <div className="bg-white rounded-lg shadow-baal p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-0.5 rounded text-xs ${
            isCompleted ? 'bg-gray-100 text-gray-600' :
            courtCase.status === 'in_progress' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {isCompleted ? '완료' : courtCase.status === 'in_progress' ? '진행 중' : '대기 중'}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs ${
            courtCase.judge_type === 'ai' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {courtCase.judge_type === 'ai' ? 'AI 판사' : '배심원'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-baal-text-dark mb-3">{courtCase.title}</h1>
        <p className="text-sm text-baal-text mb-4 whitespace-pre-wrap">{courtCase.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-700 font-medium">원고: {courtCase.plaintiff || '익명'}</span>
          <span className="text-baal-gold font-bold text-lg">VS</span>
          <span className="text-red-700 font-medium">피고: {courtCase.defendant || '미정'}</span>
          <span className="ml-auto text-xs text-baal-text-light">{formatTimeAgo(courtCase.created_at)}</span>
        </div>
      </div>

      {/* 판결 결과 */}
      {(courtCase.verdict || verdict) && (() => {
        const v = verdict || {}
        const caseVerdict = courtCase.verdict || v.verdict
        const reasoning = v.reasoning || courtCase.ai_reasoning
        const penalty = v.penalty || courtCase.penalty_reputation || 0
        return (
          <div className="bg-white rounded-lg shadow-baal p-6 border-l-4 border-baal-gold">
            <h2 className="text-lg font-bold text-baal-text-dark mb-3">판결</h2>
            <div className="text-center mb-4">
              <span className={`text-2xl font-bold ${
                caseVerdict === 'plaintiff_win' ? 'text-green-600' :
                caseVerdict === 'defendant_win' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {VERDICT_LABELS[caseVerdict] || '판결 중'}
              </span>
              <p className="text-xs text-baal-text-light mt-1">
                {courtCase.judge_type === 'ai' ? 'AI 판사 판결' : '배심원 다수결'}
              </p>
            </div>
            {reasoning && (
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="text-sm text-baal-text leading-relaxed">{reasoning}</p>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-baal-text-light">
              {penalty > 0 && <span className="text-red-500 font-medium">평판 감점: -{penalty}</span>}
              {courtCase.completed_at && (
                <span className="ml-auto">{formatTimeAgo(courtCase.completed_at)} 판결</span>
              )}
            </div>
          </div>
        )
      })()}

      {/* 변론 및 증거 */}
      <div className="bg-white rounded-lg shadow-baal p-5">
        <h2 className="text-base font-bold text-baal-text-dark mb-3">
          변론 및 증거 <span className="text-baal-text-light font-normal text-sm">({messages.length})</span>
        </h2>

        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((m: any, i: number) => {
              const style = MSG_STYLES[m.message_type] || MSG_STYLES.chat
              return (
                <div key={i} className={`p-3 rounded-lg text-sm border-l-4 ${style.bg} ${style.border}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-baal-text-dark">{m.nickname || '익명'}</span>
                    {style.label && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        m.message_type === 'argument' ? 'bg-blue-100 text-blue-700' :
                        m.message_type === 'evidence' ? 'bg-amber-100 text-amber-700' :
                        m.message_type === 'verdict' ? 'bg-baal-gold/20 text-baal-gold' : ''
                      }`}>{style.label}</span>
                    )}
                    <span className="text-xs text-baal-text-light ml-auto">{formatTimeAgo(m.created_at)}</span>
                  </div>
                  <p className="text-baal-text whitespace-pre-wrap">{m.message}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-baal-text-light py-4 text-center">아직 변론이 없습니다. 첫 발언을 해보세요.</p>
        )}

        {/* 메시지 입력 */}
        {!isCompleted && (
          <div className="mt-4 pt-4 border-t border-baal-border-light space-y-3">
            <div className="flex gap-2 flex-wrap">
              <input value={nickname} onChange={e => setNickname(e.target.value)}
                placeholder="닉네임"
                className="w-28 border border-baal-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baal-gold" />
              <div className="flex gap-1">
                {([['chat', '발언'], ['argument', '주장'], ['evidence', '증거']] as const).map(([t, l]) => (
                  <button key={t} onClick={() => setMsgType(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      msgType === t
                        ? t === 'argument' ? 'bg-blue-100 text-blue-700' :
                          t === 'evidence' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-200 text-gray-700'
                        : 'bg-gray-50 text-baal-text-light hover:bg-gray-100'
                    }`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                placeholder="변론 또는 증거를 제출하세요"
                onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) sendMessage() }}
                className="flex-1 border border-baal-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baal-gold" />
              <button onClick={sendMessage}
                className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm font-medium hover:bg-baal-gold-hover transition-colors">
                전송
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 배심원 투표 */}
      {courtCase.judge_type === 'jury' && (
        <JuryVoting caseId={id as string} completed={isCompleted} />
      )}

      {/* AI 판결 요청 */}
      {!isCompleted && courtCase.judge_type === 'ai' && (
        <div className="flex justify-center">
          <button onClick={requestJudge} disabled={judging}
            className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover disabled:opacity-50 transition-colors">
            {judging ? 'AI 판사 심리 중...' : 'AI 판사에게 판결 요청'}
          </button>
        </div>
      )}

      {/* 재심 요청 (완료된 사건) */}
      {isCompleted && (
        <AppealButton caseId={id as string} />
      )}

      {/* 원본 사건 / 관련 게시글 링크 */}
      {(courtCase.parent_case_id || courtCase.post_id) && (
        <div className="bg-white rounded-lg shadow-baal p-4 flex flex-wrap gap-3 text-sm">
          {courtCase.parent_case_id && (
            <Link href={`/court/${courtCase.parent_case_id}`}
              className="text-blue-600 hover:underline">원본 재판 보기</Link>
          )}
          {courtCase.post_id && (
            <Link href={`/post/${courtCase.post_id}`}
              className="text-blue-600 hover:underline">관련 게시글 보기</Link>
          )}
        </div>
      )}

      {/* 팝콘 모드 - 관전 반응 */}
      <div className="bg-white rounded-lg shadow-baal p-4">
        <p className="text-xs text-baal-text-light text-center mb-3">관전 반응</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {REACTIONS.map(r => (
            <button key={r.type} onClick={() => addReaction(r.type)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 hover:scale-110 active:scale-95">
              <span className="text-xl">{r.label}</span>
              <span className="text-xs font-medium text-baal-text-light">{reactions[r.type] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pb-4">
        <Link href="/court" className="text-sm text-baal-text-light hover:text-baal-gold transition-colors">
          법정 목록으로
        </Link>
      </div>
    </div>
  )
}
