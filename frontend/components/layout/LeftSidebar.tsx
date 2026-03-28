'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { matchSearch } from '@/lib/utils/chosung'
import { showToast } from '@/lib/utils/toast'

type TabType = 'psychology' | 'tools' | 'government' | 'favorites'
type FavoritesFilterType = 'all' | 'psychology' | 'tools' | 'government'

interface LeftSidebarProps {
  isOpen: boolean
  onClose: () => void
}

// 정부서비스 카테고리 타입
type GovServicesData = {
  [category: string]: string[]
}

export default function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('psychology')
  const [searchQuery, setSearchQuery] = useState('')
  const [topFiveCollapsed, setTopFiveCollapsed] = useState(false)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [favorites, setFavorites] = useState<Record<TabType, string[]>>({
    psychology: [],
    tools: [],
    government: [],
    favorites: []
  })
  const [favoritesFilter, setFavoritesFilter] = useState<FavoritesFilterType>('all')

  // 사이드바가 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }

    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [isOpen])

  // 심리테스트 항목
  const psychologyItems = [
    { name: '별자리', url: '/test/zodiac' },
    { name: '혈액형', url: '/test/blood' },
    { name: '호르몬', url: '/test/hormone' },
    { name: '타로', url: '/test/tarot' },
    { name: 'MBTI', url: '/test/mbti' },
    { name: '띠운세', url: '/test/chinese-zodiac' },
    { name: '포춘쿠키', url: '/test/fortune-cookie' },
    { name: '에니어그램', url: '/test/enneagram' },
    { name: '손금', url: '/test/palm' },
    { name: '수비학', url: '/test/numerology' },
    { name: '애니멀', url: '/test/animal' },
    { name: '오늘의 운세', url: '/fortune/daily' },
    { name: '궁합', url: '/fortune/compat' },
  ]

  // 유용한도구 항목 (내부 임베드)
  const toolItems = [
    { name: '도면 배치', url: '/tools/plan', external: false },
    { name: '텍스트 분할기', url: '/tools/split', external: false },
    { name: 'PDF 변환', url: '/tools/pdf', external: false },
    { name: 'QR 코드', url: '/tools/qr', external: false },
    { name: 'OCR', url: '/tools/ocr', external: false },
    { name: '이미지 리사이즈', url: '/tools/resize', external: false },
    { name: '이미지 압축', url: '/tools/compress', external: false },
    { name: '배경 제거', url: '/tools/bg', external: false },
    { name: '업스케일', url: '/tools/upscale', external: false },
    { name: '바코드', url: '/tools/barcode', external: false },
    { name: '워터마크', url: '/tools/watermark', external: false },
    { name: '차트 생성', url: '/tools/chart', external: false },
    { name: 'CSV 에디터', url: '/tools/csv', external: false },
    { name: 'JSON 포맷터', url: '/tools/json', external: false },
    { name: '마크다운', url: '/tools/md', external: false },
    { name: '해시 생성기', url: '/tools/hash', external: false },
    { name: 'Base64', url: '/tools/base64', external: false },
    { name: '컬러 피커', url: '/tools/color', external: false },
    { name: '정규식 테스터', url: '/tools/regex', external: false },
    { name: '파일 변환', url: '/tools/convert', external: false },
  ]

  // TOP 5 정부서비스
  const topFiveServices = [
    '아파트 실거래가',
    '실시간 미세먼지',
    '버스 도착 정보',
    '응급실 가용 병상',
    '공공분양 일정'
  ]

  // 정부서비스 카테고리별 데이터
  const govServices: GovServicesData = {
    '부동산/주거': [
      '아파트 실거래가 조회',
      '전월세 시세 비교',
      '재개발/재건축 구역 지도',
      '공공분양 일정',
      '토지이용계획 열람'
    ],
    '날씨/환경': [
      '실시간 미세먼지',
      '초단기 날씨 예보',
      '자외선/오존 지수',
      '황사/꽃가루 농도',
      '수질 정보'
    ],
    '교통/인프라': [
      '실시간 버스 도착 정보',
      '지하철 혼잡도',
      '주차장 실시간 만차 여부',
      '고속도로 실시간 교통상황',
      '공영주차장 위치/요금'
    ],
    '생활/복지': [
      '병원/약국 위치 및 휴일 진료',
      '응급실 실시간 가용 병상',
      '전국 공중화장실 위치',
      'AED(자동심장충격기) 위치',
      '어린이집/유치원 정보'
    ],
    '문화/여가': [
      '공공도서관 장서 검색',
      '박물관/미술관 전시 일정',
      '공공체육시설 예약 현황',
      '영화관 상영시간표',
      '지역 축제 일정'
    ],
    '경제/금융': [
      '환율 실시간 조회',
      '유가 정보',
      '물가 지수',
      '중소기업 지원사업 공고',
      '채용 정보'
    ],
    '생활편의': [
      '우체국 택배 조회',
      '민원24 연계 (간편 증명서)',
      '전기/가스 사용량 조회',
      '생활폐기물 배출 정보',
      '음식점 위생등급'
    ],
    '🚨 안전/재난': [
      '지진 속보',
      '재난문자 알림',
      '산불 위험 지수',
      '태풍 경로',
      '한파/폭염 특보'
    ],
    '📊 데이터 시각화': [
      '인구 통계 (지역별/연령별)',
      '사업자 등록 통계',
      '범죄 발생 통계',
      '교통사고 통계'
    ]
  }

  // 아코디언 토글
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // 별표 클릭 핸들러
  const handleStarClick = (item: string, category: TabType) => {
    // 로그인 여부 체크 (향후 Supabase 연동)
    const isLoggedIn = false // TODO: 실제 로그인 상태 체크

    if (!isLoggedIn) {
      showToast('즐겨찾기 기능은 로그인 후 이용 가능합니다.')
      return
    }

    // 즐겨찾기 토글
    setFavorites(prev => {
      const categoryFavorites = prev[category] || []
      const isFavorited = categoryFavorites.includes(item)

      return {
        ...prev,
        [category]: isFavorited
          ? categoryFavorites.filter(fav => fav !== item)
          : [...categoryFavorites, item]
      }
    })
  }

  // 정부서비스 검색 필터링
  const getFilteredGovServices = (): GovServicesData => {
    if (!searchQuery) return govServices

    const filtered: GovServicesData = {}
    Object.keys(govServices).forEach(category => {
      const matchedItems = govServices[category].filter(item =>
        matchSearch(item, searchQuery) || matchSearch(category, searchQuery)
      )
      if (matchedItems.length > 0) {
        filtered[category] = matchedItems
      }
    })
    return filtered
  }

  // 현재 활성 탭의 아이템 필터링
  let filteredPsychItems: typeof psychologyItems = []
  let filteredToolItems: typeof toolItems = []
  let filteredGovServices: GovServicesData = {}

  if (activeTab === 'psychology') {
    filteredPsychItems = psychologyItems.filter(item => matchSearch(item.name, searchQuery))
  } else if (activeTab === 'tools') {
    filteredToolItems = toolItems.filter(item => matchSearch(item.name, searchQuery))
  } else if (activeTab === 'government') {
    filteredGovServices = getFilteredGovServices()
  }

  // 탭 변경 시 검색어 초기화
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchQuery('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] h-screen bg-white shadow-baal-md z-[999] transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-baal-gold to-baal-gold-light text-white text-2xl font-bold border-b-2 border-baal-gold-hover flex justify-between items-center">
        <span>BAAL</span>
        <button
          onClick={onClose}
          className="w-6 h-6 bg-white/20 hover:bg-white/35 transition-all duration-200 rounded flex items-center justify-center text-sm transform hover:scale-105"
        >
          ◀
        </button>
      </div>

      {/* Sidebar Tabs - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-px bg-baal-border border-b border-baal-border">
        <button
          className={`px-4 py-3 text-[13px] font-medium transition-all duration-300 text-center ${
            activeTab === 'psychology'
              ? 'bg-white text-baal-gold font-semibold'
              : 'bg-baal-bg-gray text-baal-text-gray hover:text-baal-gold hover:bg-white'
          }`}
          onClick={() => handleTabChange('psychology')}
        >
          심리테스트
        </button>
        <button
          className={`px-4 py-3 text-[13px] font-medium transition-all duration-300 text-center ${
            activeTab === 'tools'
              ? 'bg-white text-baal-gold font-semibold'
              : 'bg-baal-bg-gray text-baal-text-gray hover:text-baal-gold hover:bg-white'
          }`}
          onClick={() => handleTabChange('tools')}
        >
          유용한도구
        </button>
        <button
          className={`px-4 py-3 text-[13px] font-medium transition-all duration-300 text-center ${
            activeTab === 'government'
              ? 'bg-white text-baal-gold font-semibold'
              : 'bg-baal-bg-gray text-baal-text-gray hover:text-baal-gold hover:bg-white'
          }`}
          onClick={() => handleTabChange('government')}
        >
          정부서비스
        </button>
        <button
          className={`px-4 py-3 text-[13px] font-medium transition-all duration-300 text-center ${
            activeTab === 'favorites'
              ? 'bg-white text-baal-gold font-semibold'
              : 'bg-baal-bg-gray text-baal-text-gray hover:text-baal-gold hover:bg-white'
          }`}
          onClick={() => handleTabChange('favorites')}
        >
          즐겨찾기
        </button>
      </div>

      {/* TOP 5 Section (정부서비스 탭에서만 표시) */}
      {activeTab === 'government' && (
        <div className="border-b border-baal-border bg-white">
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer bg-baal-bg-light hover:bg-baal-bg-section transition-colors duration-200 border-b border-baal-border"
            onClick={() => setTopFiveCollapsed(!topFiveCollapsed)}
          >
            <span className="text-sm font-semibold text-baal-text-dark">⭐ TOP 5</span>
            <span
              className={`text-xs text-baal-text-light transition-transform duration-300 ${
                !topFiveCollapsed ? 'rotate-90' : ''
              }`}
            >
              ▶
            </span>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              topFiveCollapsed ? 'max-h-0' : 'max-h-300'
            }`}
          >
            {topFiveServices.map((service, idx) => (
              <div
                key={idx}
                className="px-5 py-3 cursor-pointer transition-all duration-200 text-sm text-baal-text-dark border-l-[3px] border-transparent hover:bg-baal-bg-gray hover:border-l-baal-gold hover:text-baal-gold flex justify-between items-center"
              >
                <span>{service}</span>
                <span
                  className={`text-base transition-opacity duration-200 cursor-pointer ${
                    favorites.government.includes(service)
                      ? 'opacity-100 text-baal-star'
                      : 'opacity-0 text-gray-300 group-hover:opacity-100'
                  } hover:opacity-100`}
                  onClick={() => handleStarClick(service, 'government')}
                >
                  ★
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Search */}
      <div className="px-4 py-3 border-b border-baal-border bg-white">
        <input
          type="text"
          placeholder={
            activeTab === 'psychology' ? '심리테스트 검색... (예: ㅂㅈㄹ, 별자리)' :
            activeTab === 'tools' ? '도구 검색... (예: ㅍㄷㅍ, PDF)' :
            activeTab === 'government' ? '정부서비스 검색... (예: ㅁㅅㅁㄴㅈ, 미세먼지)' :
            '즐겨찾기 검색...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-baal-input-border rounded-md text-[13px] outline-none transition-all duration-200 focus:border-baal-gold focus:shadow-[0_0_0_2px_rgba(212,175,55,0.1)] placeholder:text-baal-text-placeholder"
        />
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-2">
        {activeTab === 'government' ? (
          // 정부서비스 아코디언 렌더링
          Object.keys(filteredGovServices).length > 0 ? (
            Object.keys(filteredGovServices).map((category, idx) => (
              <div key={idx} className="border-b border-baal-border-gray">
                <div
                  className="px-5 py-3 cursor-pointer flex justify-between items-center bg-white hover:bg-baal-bg-gray transition-all duration-200 text-sm font-medium text-baal-text-dark"
                  onClick={() => toggleCategory(category)}
                >
                  <span>{category}</span>
                  <span
                    className={`text-xs text-baal-text-light transition-transform duration-300 ${
                      openCategories[category] ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </span>
                </div>
                <div
                  className={`bg-baal-bg-light overflow-hidden transition-all duration-300 ease-in-out ${
                    openCategories[category] ? 'max-h-1000' : 'max-h-0'
                  }`}
                >
                  {filteredGovServices[category].map((item, subIdx) => (
                    <div
                      key={subIdx}
                      className="py-2.5 px-5 pl-10 cursor-pointer transition-all duration-200 text-[13px] text-baal-text-gray border-l-[3px] border-transparent hover:bg-baal-bg-section hover:border-l-baal-gold hover:text-baal-gold flex justify-between items-center group"
                    >
                      <span>{item}</span>
                      <span
                        className={`text-base transition-opacity duration-200 cursor-pointer ${
                          favorites.government.includes(item)
                            ? 'opacity-100 text-baal-star'
                            : 'opacity-0 text-gray-300'
                        } group-hover:opacity-100`}
                        onClick={() => handleStarClick(item, 'government')}
                      >
                        ★
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-5 text-center text-baal-text-light text-[13px]">
              검색 결과가 없습니다
            </div>
          )
        ) : activeTab === 'favorites' ? (
          // 즐겨찾기 탭 렌더링
          (() => {
            // 필터에 따라 즐겨찾기 아이템 수집
            let allFavorites: Array<{ item: string; category: string; categoryName: string }> = []

            if (favoritesFilter === 'all' || favoritesFilter === 'psychology') {
              allFavorites = [...allFavorites, ...favorites.psychology.map(item => ({ item, category: 'psychology', categoryName: '심리테스트' }))]
            }
            if (favoritesFilter === 'all' || favoritesFilter === 'tools') {
              allFavorites = [...allFavorites, ...favorites.tools.map(item => ({ item, category: 'tools', categoryName: '유용한도구' }))]
            }
            if (favoritesFilter === 'all' || favoritesFilter === 'government') {
              allFavorites = [...allFavorites, ...favorites.government.map(item => ({ item, category: 'government', categoryName: '정부서비스' }))]
            }

            // 검색 필터링
            const filteredFavorites = allFavorites.filter(({ item }) => matchSearch(item, searchQuery))

            return (
              <>
                <div className="px-4 py-3 flex gap-2 flex-wrap border-b border-baal-border bg-baal-bg-gray">
                  <button
                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-200 border ${
                      favoritesFilter === 'all'
                        ? 'bg-baal-gold border-baal-gold text-white'
                        : 'bg-white border-baal-input-border text-baal-text-gray hover:border-baal-gold hover:text-baal-gold'
                    }`}
                    onClick={() => setFavoritesFilter('all')}
                  >
                    전체
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-200 border ${
                      favoritesFilter === 'psychology'
                        ? 'bg-baal-gold border-baal-gold text-white'
                        : 'bg-white border-baal-input-border text-baal-text-gray hover:border-baal-gold hover:text-baal-gold'
                    }`}
                    onClick={() => setFavoritesFilter('psychology')}
                  >
                    심리테스트
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-200 border ${
                      favoritesFilter === 'tools'
                        ? 'bg-baal-gold border-baal-gold text-white'
                        : 'bg-white border-baal-input-border text-baal-text-gray hover:border-baal-gold hover:text-baal-gold'
                    }`}
                    onClick={() => setFavoritesFilter('tools')}
                  >
                    유용한도구
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-200 border ${
                      favoritesFilter === 'government'
                        ? 'bg-baal-gold border-baal-gold text-white'
                        : 'bg-white border-baal-input-border text-baal-text-gray hover:border-baal-gold hover:text-baal-gold'
                    }`}
                    onClick={() => setFavoritesFilter('government')}
                  >
                    정부서비스
                  </button>
                </div>
                <div className="p-4">
                  {filteredFavorites.length > 0 ? (
                    filteredFavorites.map(({ item, category, categoryName }, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span>{item}</span>
                          <span
                            className="text-base opacity-100 text-baal-star cursor-pointer"
                            onClick={() => handleStarClick(item, category as TabType)}
                          >
                            ★
                          </span>
                        </div>
                        <span className="text-[11px] text-baal-text-light">{categoryName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-baal-text-light text-[13px]">
                      즐겨찾기한 항목이 없습니다
                    </div>
                  )}
                </div>
              </>
            )
          })()
        ) : (
          // 유용한도구 — 링크 포함 렌더링
          activeTab === 'tools' ? (
            filteredToolItems.length > 0 ? (
              filteredToolItems.map((item, idx) => (
                item.external ? (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 cursor-pointer transition-all duration-200 text-sm text-baal-text-dark border-l-[3px] border-transparent hover:bg-baal-bg-gray hover:border-l-baal-gold hover:text-baal-gold flex justify-between items-center group block"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-baal-text-light">↗</span>
                  </a>
                ) : (
                  <Link
                    key={idx}
                    href={item.url}
                    className="px-5 py-3 cursor-pointer transition-all duration-200 text-sm text-baal-text-dark border-l-[3px] border-transparent hover:bg-baal-bg-gray hover:border-l-baal-gold hover:text-baal-gold flex justify-between items-center group block"
                  >
                    <span>{item.name}</span>
                  </Link>
                )
              ))
            ) : (
              <div className="px-5 py-5 text-center text-baal-text-light text-[13px]">
                검색 결과가 없습니다
              </div>
            )
          ) : (
          // 심리테스트 평면 리스트 렌더링
          filteredPsychItems.length > 0 ? (
            filteredPsychItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.url}
                className="px-5 py-3 cursor-pointer transition-all duration-200 text-sm text-baal-text-dark border-l-[3px] border-transparent hover:bg-baal-bg-gray hover:border-l-baal-gold hover:text-baal-gold flex justify-between items-center group block"
              >
                <span>{item.name}</span>
              </Link>
            ))
          ) : (
            <div className="px-5 py-5 text-center text-baal-text-light text-[13px]">
              검색 결과가 없습니다
            </div>
          ))
        )}
      </div>
    </div>
  )
}
