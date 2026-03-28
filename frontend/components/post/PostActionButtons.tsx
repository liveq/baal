'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PostActionButtonsProps {
  postId: string
  authorId: string | null
  boardType: string
  commentCount: number
  hasAnonymousPassword: boolean
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function PostActionButtons({
  postId, authorId, boardType, commentCount, hasAnonymousPassword
}: PostActionButtonsProps) {
  const router = useRouter()
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  async function handleReport() {
    if (!reportReason.trim()) return
    try {
      const res = await fetch(`${API}/api/community/posts/${postId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      })
      if (res.ok) {
        alert('신고가 접수되었습니다. 바알의 저울에서 심리됩니다.')
        setShowReport(false)
        setReportReason('')
      }
    } catch {
      alert('신고 접수 실패')
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`${API}/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      })
      if (res.ok) {
        alert('삭제되었습니다.')
        router.push(`/board/${boardType}`)
      } else {
        const data = await res.json()
        alert(data.error || '삭제 실패')
      }
    } catch {
      alert('삭제 실패')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setShowReport(!showReport)}
        className="text-xs text-baal-text-light hover:text-red-500 transition-colors">
        신고
      </button>
      {hasAnonymousPassword && (
        <button onClick={() => setShowDelete(!showDelete)}
          className="text-xs text-baal-text-light hover:text-red-500 transition-colors">
          삭제
        </button>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-xl p-5 w-80 shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-baal-text-dark mb-3">신고</h3>
            <textarea value={reportReason} onChange={e => setReportReason(e.target.value)}
              placeholder="신고 사유를 입력하세요"
              className="w-full border border-baal-border rounded-lg px-3 py-2 text-sm h-20 resize-none mb-3" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowReport(false)} className="px-3 py-1.5 text-sm border border-baal-border rounded-lg">취소</button>
              <button onClick={handleReport} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg">신고</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowDelete(false)}>
          <div className="bg-white rounded-xl p-5 w-80 shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-baal-text-dark mb-3">글 삭제</h3>
            <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full border border-baal-border rounded-lg px-3 py-2 text-sm mb-3" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDelete(false)} className="px-3 py-1.5 text-sm border border-baal-border rounded-lg">취소</button>
              <button onClick={handleDelete} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
