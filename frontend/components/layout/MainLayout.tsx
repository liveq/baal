'use client'

import { useState } from 'react'
import Header from './Header'
import LeftSidebar from './LeftSidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-5 left-5 z-[1000] w-10 h-10 bg-baal-gold rounded-lg flex flex-col justify-center items-center gap-[5px] transition-all duration-300 shadow-baal-md hover:bg-baal-gold-hover ${
          isSidebarOpen ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
      >
        <span className="w-5 h-0.5 bg-white" />
        <span className="w-5 h-0.5 bg-white" />
        <span className="w-5 h-0.5 bg-white" />
      </button>

      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Header />

      <main className="min-h-screen pt-[85px]">
        {children}
      </main>

    </>
  )
}
