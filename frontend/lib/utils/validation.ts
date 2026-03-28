// 유효성 검사 유틸리티 함수들

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 닉네임 검증 (2-20자, 한글/영문/숫자)
 */
export function isValidNickname(nickname: string): boolean {
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,20}$/
  return nicknameRegex.test(nickname)
}

/**
 * 비밀번호 강도 검증 (최소 8자, 영문+숫자 포함)
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return hasLetter && hasNumber
}

/**
 * URL 형식 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 전화번호 형식 검증 (한국)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/-/g, ''))
}

/**
 * 계좌번호 형식 검증 (숫자만)
 */
export function isValidAccountNumber(account: string): boolean {
  const accountRegex = /^[0-9]{10,20}$/
  return accountRegex.test(account)
}

/**
 * 게시글 제목 검증 (1-100자)
 */
export function isValidPostTitle(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length >= 1 && trimmed.length <= 100
}

/**
 * 게시글 내용 검증 (1-10000자)
 */
export function isValidPostContent(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.length >= 1 && trimmed.length <= 10000
}

/**
 * 댓글 내용 검증 (1-1000자)
 */
export function isValidCommentContent(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.length >= 1 && trimmed.length <= 1000
}

/**
 * 포인트 인출 금액 검증 (최소 5000원)
 */
export function isValidWithdrawalAmount(amount: number, userPoints: number): {
  valid: boolean
  error?: string
} {
  if (amount < 5000) {
    return { valid: false, error: '최소 인출 금액은 5,000원입니다.' }
  }
  if (amount > userPoints) {
    return { valid: false, error: '보유 포인트가 부족합니다.' }
  }
  if (amount % 1000 !== 0) {
    return { valid: false, error: '1,000원 단위로만 인출 가능합니다.' }
  }
  return { valid: true }
}

/**
 * 사용자 태그(꼬리표) 검증 (1-20자)
 */
export function isValidUserTag(tag: string): boolean {
  const trimmed = tag.trim()
  return trimmed.length >= 1 && trimmed.length <= 20
}

/**
 * 법정 사건 제목 검증 (5-100자)
 */
export function isValidCourtCaseTitle(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length >= 5 && trimmed.length <= 100
}

/**
 * 법정 사건 설명 검증 (10-1000자)
 */
export function isValidCourtCaseDescription(description: string): boolean {
  const trimmed = description.trim()
  return trimmed.length >= 10 && trimmed.length <= 1000
}

/**
 * 유저 평판 체크 (특정 기능 사용 가능 여부)
 */
export function canUseFeature(reputation: number, minReputation: number): {
  allowed: boolean
  message?: string
} {
  if (reputation < minReputation) {
    return {
      allowed: false,
      message: `이 기능을 사용하려면 평판 ${minReputation} 이상이 필요합니다.`
    }
  }
  return { allowed: true }
}

/**
 * 파일 형식 검증 (이미지만)
 */
export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.' }
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 5MB 이하여야 합니다.' }
  }

  return { valid: true }
}
