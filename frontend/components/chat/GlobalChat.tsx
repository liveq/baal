'use client'

import { useState } from 'react'
import LiveChat from '@/components/home/LiveChat'

export default function GlobalChat() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-[500]">
      {open ? (
        <div className="w-72 shadow-baal-xl rounded-lg overflow-hidden">
          <button onClick={() => setOpen(false)}
            className="w-full px-3 py-1.5 bg-baal-gold text-white text-xs font-medium flex items-center justify-between">
            <span>실시간 채팅</span>
            <span>접기</span>
          </button>
          <LiveChat />
        </div>
      ) : (
        <button onClick={() => setOpen(true)}
          className="px-4 py-2.5 bg-baal-gold text-white rounded-lg shadow-baal-md text-sm font-medium hover:bg-baal-gold-hover transition-colors">
          채팅
        </button>
      )}
    </div>
  )
}
