// 포맷팅 유틸리티 함수들

import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 숫자를 천 단위로 콤마 구분하여 포맷팅
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}

/**
 * 큰 숫자를 축약하여 표시 (K, M 단위)
 * @example formatCompactNumber(1234) // "1.2K"
 * @example formatCompactNumber(1234567) // "1.2M"
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  return `${(num / 1000000).toFixed(1)}M`
}

/**
 * 날짜를 상대적인 시간으로 표시 (예: "3시간 전")
 * @param date - Date 객체 또는 ISO 문자열
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ko })
}

/**
 * 날짜를 절대적인 형식으로 표시 (예: "2024년 1월 15일")
 * @param date - Date 객체 또는 ISO 문자열
 * @param formatString - date-fns 포맷 문자열
 */
export function formatDate(date: string | Date, formatString = 'yyyy년 MM월 dd일'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatString, { locale: ko })
}

/**
 * 날짜를 시간 포함하여 표시 (예: "2024.01.15 14:30")
 * @param date - Date 객체 또는 ISO 문자열
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'yyyy.MM.dd HH:mm', { locale: ko })
}

/**
 * 포인트를 원화로 표시 (예: "10,000원")
 * @param points - 포인트 (1포인트 = 1원)
 */
export function formatCurrency(points: number): string {
  return `${formatNumber(points)}원`
}

/**
 * 평판 점수에 따른 등급 표시
 * @param reputation - 평판 점수
 * @returns 등급 아이콘과 이름
 */
export function getReputationTier(reputation: number): {
  icon: string
  name: string
  color: string
} {
  if (reputation < 0) {
    return { icon: '💩', name: '쓰레기통', color: 'text-gray-500' }
  } else if (reputation < 500) {
    return { icon: '🥉', name: '브론즈', color: 'text-orange-600' }
  } else if (reputation < 2000) {
    return { icon: '🥈', name: '실버', color: 'text-gray-400' }
  } else if (reputation < 5000) {
    return { icon: '🥇', name: '골드', color: 'text-yellow-500' }
  } else {
    return { icon: '💎', name: '다이아', color: 'text-blue-400' }
  }
}

/**
 * 승률을 퍼센트로 표시 (예: "75.5%")
 * @param won - 승리 횟수
 * @param total - 전체 횟수
 */
export function formatWinRate(won: number, total: number): string {
  if (total === 0) return '0%'
  const rate = (won / total) * 100
  return `${rate.toFixed(1)}%`
}

/**
 * 텍스트를 특정 길이로 자르고 ... 추가
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 파일 크기를 읽기 좋은 형식으로 표시 (예: "1.5 MB")
 * @param bytes - 바이트 크기
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
