'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function NewCourtPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [plaintiff, setPlaintiff] = useState('')
  const [defendant, setDefendant] = useState('')
  const [judgeType, setJudgeType] = useState<'ai' | 'jury'>('ai')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/court/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          plaintiff: plaintiff.trim() || '익명',
          defendant: defendant.trim() || '미정',
          judge_type: judgeType,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.id) {
          router.push(`/court/${data.id}`)
        } else {
          router.push('/court')
        }
      }
    } catch {}
    setSubmitting(false)
  }

  return (
    <div className="max-w-[700px] mx-auto px-5 py-5">
      <div className="bg-white rounded-lg shadow-baal p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-1">새 법정 개설</h1>
        <p className="text-sm text-baal-text-light mb-6">분쟁을 법정에서 해결하세요</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-1">사건명 *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100}
              placeholder="ex) 00 유저 도배 건"
              className="w-full border border-baal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-baal-gold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-1">사건 내용 *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
              placeholder="어떤 일이 있었는지 상세히 서술하세요"
              className="w-full border border-baal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-baal-gold resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-baal-text-dark mb-1">원고 (고소인)</label>
              <input value={plaintiff} onChange={e => setPlaintiff(e.target.value)}
                placeholder="닉네임 (미입력시 익명)"
                className="w-full border border-baal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-baal-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-baal-text-dark mb-1">피고 (피고소인)</label>
              <input value={defendant} onChange={e => setDefendant(e.target.value)}
                placeholder="닉네임 (미입력시 미정)"
                className="w-full border border-baal-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-baal-gold" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-baal-text-dark mb-1">재판 방식</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setJudgeType('ai')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  judgeType === 'ai' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'border-baal-border text-baal-text-light hover:bg-baal-bg-hover'
                }`}>
                AI 판사
              </button>
              <button type="button" onClick={() => setJudgeType('jury')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  judgeType === 'jury' ? 'bg-purple-50 border-purple-400 text-purple-700' : 'border-baal-border text-baal-text-light hover:bg-baal-bg-hover'
                }`}>
                배심원 투표
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/court" className="px-5 py-2.5 border border-baal-border rounded-lg text-sm text-baal-text-light hover:bg-baal-bg-hover transition-colors">
              취소
            </Link>
            <button type="submit" disabled={submitting || !title.trim() || !description.trim()}
              className="flex-1 py-2.5 bg-baal-gold text-white rounded-lg text-sm font-medium hover:bg-baal-gold-hover disabled:opacity-50 transition-colors">
              {submitting ? '개설 중...' : '법정 개설'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
