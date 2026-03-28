// 게시판 타입 및 설정

import type { BoardType } from '@/types'

export const BOARD_NAMES: Record<BoardType, string> = {
  ai: 'AI',
  humor: '유머',
  philosophy: '철학',
  occult: '신비',
  it: 'IT',
  hardware: '뉴스',
  economy: '경제',
  qna: 'Q&A',
  free: '자유'
}

export const BOARD_DESCRIPTIONS: Record<BoardType, string> = {
  ai: 'AI 기술, Claude Code, 프로그래밍 AI 도구에 대한 정보와 토론',
  humor: '웃기는 글, 짤, 농담을 공유하는 게시판',
  philosophy: '철학적 사고, 논리, 세계관에 대한 심도있는 토론',
  occult: '타로, 별자리, 꿈해몽, 영성 등 신비로운 주제',
  it: '개발, 하드웨어, 소프트웨어 토론',
  hardware: '해외 테크·AI·세계 뉴스',
  economy: '경제, 투자, 주식, 코인 정보',
  qna: '질문과 답변을 주고받는 게시판',
  free: '자유로운 주제의 게시판'
}

export const BOARD_COLORS: Record<BoardType, { bg: string; text: string }> = {
  ai: { bg: 'bg-blue-100', text: 'text-blue-800' },
  humor: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  philosophy: { bg: 'bg-purple-100', text: 'text-purple-800' },
  occult: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  it: { bg: 'bg-green-100', text: 'text-green-800' },
  hardware: { bg: 'bg-gray-100', text: 'text-gray-800' },
  economy: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  qna: { bg: 'bg-orange-100', text: 'text-orange-800' },
  free: { bg: 'bg-pink-100', text: 'text-pink-800' }
}

// 게시판 타입 검증
export function isValidBoardType(type: string): type is BoardType {
  return type in BOARD_NAMES
}

// 게시판 목록
export const BOARDS = Object.entries(BOARD_NAMES).map(([type, name]) => ({
  type: type as BoardType,
  name,
  description: BOARD_DESCRIPTIONS[type as BoardType],
  colors: BOARD_COLORS[type as BoardType]
}))
