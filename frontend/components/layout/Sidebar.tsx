'use client'

import { useState } from 'react'
import Link from 'next/link'

type TabType = 'boards' | 'keywords' | 'recent' | 'favorites'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('boards')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Record<TabType, string[]>>({
    boards: [],
    keywords: [],
    recent: [],
    favorites: []
  })
  const [isTop5Collapsed, setIsTop5Collapsed] = useState(false)

  // 게시판 목록
  const boards = [
    { name: '자유', path: '/board/free' },
    { name: '철학', path: '/board/philosophy' },
    { name: '신비', path: '/board/occult' },
    { name: 'AI', path: '/board/ai' },
    { name: 'IT', path: '/board/it' },
    { name: '뉴스', path: '/board/hardware' },
    { name: '경제', path: '/board/economy' },
    { name: 'Q&A', path: '/board/qna' },
    { name: '바알의 저울', path: '/court' }
  ]

  // 핫 키워드
  const hotKeywords = [
    'Claude Code', 'AI 코딩', '철학 토론', '타로 카드',
    '비트코인', 'GPU 시세', '혈액형 테스트', 'MBTI'
  ]

  // 최근 게시글
  const recentPosts = [
    'Claude Code로 프로젝트 만들기',
    '칸트 철학 입문 가이드',
    '타로 풀이 배우고 싶어요',
    '3060ti 중고 시세 질문'
  ]

  // 즐겨찾기 항목
  const favoriteItems = favorites[activeTab] || []

  const handleStarClick = (item: string) => {
    setFavorites(prev => {
      const current = prev[activeTab] || []
      const isFavorited = current.includes(item)

      return {
        ...prev,
        [activeTab]: isFavorited
          ? current.filter(i => i !== item)
          : [...current, item]
      }
    })
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'boards':
        return boards.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
      case 'keywords':
        return hotKeywords.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      case 'recent':
        return recentPosts.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      case 'favorites':
        return favoriteItems.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      default:
        return []
    }
  }

  const tabContent = getTabContent()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[300px] h-screen bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-baal-gold to-baal-gold text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">BAAL</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/20 rounded hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-baal-bg-light border-b-2 border-baal-gold">
          <button
            onClick={() => setActiveTab('boards')}
            className={`py-2 px-3 rounded font-medium transition-colors ${
              activeTab === 'boards'
                ? 'bg-baal-gold text-white'
                : 'bg-white text-baal-gold hover:bg-baal-bg-gray'
            }`}
          >
            게시판
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`py-2 px-3 rounded font-medium transition-colors ${
              activeTab === 'keywords'
                ? 'bg-baal-gold text-white'
                : 'bg-white text-baal-gold hover:bg-baal-bg-gray'
            }`}
          >
            🔥 핫키워드
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`py-2 px-3 rounded font-medium transition-colors ${
              activeTab === 'recent'
                ? 'bg-baal-gold text-white'
                : 'bg-white text-baal-gold hover:bg-baal-bg-gray'
            }`}
          >
            🕐 최근 게시글
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2 px-3 rounded font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-baal-gold text-white'
                : 'bg-white text-baal-gold hover:bg-baal-bg-gray'
            }`}
          >
            ⭐ 즐겨찾기
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-baal-border-light">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-baal-border rounded-lg focus:outline-none focus:border-baal-gold"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* TOP5 즐겨찾기 */}
          {favoriteItems.length > 0 && (
            <div className="mb-3">
              <button
                onClick={() => setIsTop5Collapsed(!isTop5Collapsed)}
                className="w-full px-3 py-2 bg-baal-gold text-white font-bold flex justify-between items-center hover:bg-baal-text-light transition-colors"
              >
                <span>⭐ TOP5 즐겨찾기</span>
                <span className="text-xs">{isTop5Collapsed ? '▶' : '▼'}</span>
              </button>
              {!isTop5Collapsed && (
                <div className="bg-baal-bg-light">
                  {favoriteItems.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 border-b border-baal-border-light flex justify-between items-center hover:bg-baal-bg-gray transition-colors"
                    >
                      {activeTab === 'boards' ? (
                        <Link href={boards.find(b => b.name === item)?.path || '#'} className="flex-1">
                          {item}
                        </Link>
                      ) : (
                        <span className="flex-1">{item}</span>
                      )}
                      <button
                        onClick={() => handleStarClick(item)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 전체 목록 */}
          <div className="p-3">
            {tabContent.length > 0 ? (
              tabContent.map((item, idx) => {
                const itemName = typeof item === 'string' ? item : item.name
                const itemPath = typeof item === 'object' ? item.path : '#'
                const isFavorited = favoriteItems.includes(itemName)

                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 px-3 mb-2 bg-white rounded hover:bg-baal-bg-light transition-colors border border-baal-border-light"
                  >
                    {activeTab === 'boards' && typeof item === 'object' ? (
                      <Link href={itemPath} className="flex-1 text-baal-text-dark">
                        {itemName}
                      </Link>
                    ) : (
                      <span className="flex-1 text-baal-text-dark">{itemName}</span>
                    )}
                    <button
                      onClick={() => handleStarClick(itemName)}
                      className={`ml-2 text-xl ${isFavorited ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
                    >
                      ★
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-baal-text-light">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
