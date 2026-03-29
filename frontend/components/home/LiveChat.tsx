'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth-store'

const WS_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'ws://localhost:8080/api/chat/lobby'
  : 'wss://baal-api.fly.dev/api/chat/lobby'

interface ChatMsg {
  type: string
  message: string
  nick: string
  verified?: boolean
}

function randomNick() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `익명${suffix}`
}

export default function LiveChat() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const triedRef = useRef(false)

  // 로그인 유저는 이메일 앞부분, 비로그인은 세션 유지 익명
  const isVerified = !!user
  const [myNick] = useState(() => {
    if (user?.email) return user.email.split('@')[0]
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('baal_chat_nick')
      if (saved) return saved
      const nick = randomNick()
      sessionStorage.setItem('baal_chat_nick', nick)
      return nick
    }
    return randomNick()
  })

  useEffect(() => {
    if (triedRef.current) return
    triedRef.current = true

    const ws = new WebSocket(`${WS_URL}?nick=${encodeURIComponent(myNick)}&verified=${isVerified}`)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as ChatMsg
        setMessages(prev => [...prev.slice(-80), msg])
      } catch {}
    }

    return () => { ws.close() }
  }, [myNick, isVerified])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function send() {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== 1) return
    wsRef.current.send(JSON.stringify({ message: input.trim(), verified: isVerified }))
    setInput('')
  }

  return (
    <div className="bg-white rounded-lg shadow-baal overflow-hidden">
      <div className="px-4 py-2.5 border-b border-baal-border-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-baal-text-dark">실시간 채팅</span>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-red-400'}`} />
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isVerified ? 'border border-baal-gold text-baal-gold' : 'text-baal-text-light'}`}>
          {myNick}
        </span>
      </div>

      <div ref={scrollRef} className="h-52 overflow-y-auto px-3 py-2 space-y-1 text-xs bg-baal-bg-light">
        {messages.length === 0 && (
          <p className="text-baal-text-light text-center py-8 text-[11px]">채팅에 참여해보세요</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.type === 'system' ? 'text-center text-baal-text-light text-[10px] py-0.5' : ''}>
            {m.type === 'system' ? (
              <span>{m.message}</span>
            ) : (
              <div className="flex items-start gap-1">
                <span className={`font-medium shrink-0 ${
                  m.verified
                    ? 'text-baal-gold border border-baal-gold/40 rounded px-1 py-0.5 text-[10px]'
                    : 'text-baal-text-gray'
                }`}>{m.nick}</span>
                <span className="text-baal-text">{m.message}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-baal-border-light px-3 py-2 flex gap-1.5">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) send() }}
          placeholder="메시지 입력..."
          className="flex-1 border border-baal-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-baal-gold bg-white" />
        <button onClick={send}
          className="px-3 py-1.5 bg-baal-gold text-white rounded text-xs font-medium hover:bg-baal-gold-hover shrink-0">
          전송
        </button>
      </div>
    </div>
  )
}
