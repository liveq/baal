'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { signOut } from '@/lib/auth/auth-helpers'

const boards = [
  { name: '베스트', path: '/board/best' },
  { name: '나침반', path: '/board/compass' },
  { name: 'AI', path: '/board/ai' },
  { name: '유머', path: '/board/humor' },
  { name: '철학', path: '/board/philosophy' },
  { name: '신비', path: '/board/occult' },
  { name: 'IT', path: '/board/it' },
  { name: '뉴스', path: '/board/hardware' },
  { name: '경제', path: '/board/economy' },
  { name: 'Q&A', path: '/board/qna' },
  { name: '자유', path: '/board/free' },
  { name: '어썰트', path: '/board/assault' },
]

export default function Header() {
  const { user } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-baal-border fixed top-0 left-0 right-0 z-[100]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="text-2xl font-bold text-baal-gold">
            BAAL
          </Link>

          {/* mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
          >
            <span className={`w-5 h-0.5 bg-baal-text-dark transition-all ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`w-5 h-0.5 bg-baal-text-dark transition-all ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </button>

          {/* desktop search + login */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/search" className="px-2.5 py-1.5 text-baal-text-light hover:text-baal-gold transition-colors text-sm">
              검색
            </Link>
          </div>
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-baal-text-gray">{user.email}</span>
              <button onClick={signOut} className="px-3 py-1.5 bg-baal-gold text-white rounded text-xs font-medium hover:bg-baal-gold-hover transition-colors">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:block px-3 py-1.5 bg-baal-gold text-white rounded text-xs font-medium hover:bg-baal-gold-hover transition-colors">
              로그인
            </Link>
          )}
        </div>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1 pb-2 text-[13px] flex-wrap">
          {boards.map(b => (
            <Link key={b.path} href={b.path} className="px-2.5 py-1 rounded text-baal-text-dark hover:bg-baal-bg-gray hover:text-baal-gold transition-all">
              {b.name}
            </Link>
          ))}
          <span className="text-baal-border mx-1">|</span>
          <Link href="/court" className="px-2.5 py-1 rounded text-baal-text-dark hover:bg-baal-bg-gray hover:text-baal-gold transition-all">저울</Link>
          <Link href="/honeypot" className="px-2.5 py-1 rounded text-baal-text-dark hover:bg-baal-bg-gray hover:text-baal-gold transition-all">꿀단지</Link>
        </nav>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-baal-border bg-white px-5 py-3 animate-slide-down">
          <div className="flex flex-wrap gap-2 mb-3">
            {boards.map(b => (
              <Link
                key={b.path}
                href={b.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded bg-baal-bg-light text-sm text-baal-text-dark hover:bg-baal-gold hover:text-white transition-all"
              >
                {b.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-baal-border-light">
            <Link href="/court" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 rounded text-sm text-baal-text-dark hover:text-baal-gold">저울</Link>
            <Link href="/honeypot" onClick={() => setMobileOpen(false)} className="px-3 py-1.5 rounded text-sm text-baal-text-dark hover:text-baal-gold">꿀단지</Link>
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false) }} className="ml-auto px-3 py-1.5 bg-baal-gold text-white rounded text-sm">로그아웃</button>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="ml-auto px-3 py-1.5 bg-baal-gold text-white rounded text-sm">로그인</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
