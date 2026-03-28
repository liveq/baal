// 초성 추출 및 검색 유틸리티 (v5-4.html 완전 복제)

/**
 * 한글 텍스트에서 초성 추출
 * @param text - 초성을 추출할 텍스트
 * @returns 초성 문자열
 */
export function getChosung(text: string): string {
  const chosungList = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ]

  let chosung = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = char.charCodeAt(0)

    // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const chosungIndex = Math.floor((code - 0xAC00) / 588)
      chosung += chosungList[chosungIndex]
    } else {
      chosung += char
    }
  }

  return chosung
}

/**
 * 검색 매칭 (초성 + 일반 검색)
 * @param item - 검색 대상 텍스트
 * @param query - 검색어
 * @returns 매칭 여부
 */
export function matchSearch(item: string, query: string): boolean {
  if (!query) return true

  const lowerQuery = query.toLowerCase()
  const lowerItem = item.toLowerCase()

  // 일반 텍스트 검색
  if (lowerItem.includes(lowerQuery)) return true

  // 초성 검색
  const itemChosung = getChosung(item).toLowerCase()
  if (itemChosung.includes(lowerQuery)) return true

  return false
}
