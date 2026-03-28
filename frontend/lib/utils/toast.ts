// Toast 알림 시스템 (v5-4.html 완전 복제)

const MAX_TOASTS = 3

/**
 * Toast 메시지 표시
 * @param message - 표시할 메시지
 * @param duration - 표시 시간 (ms, 기본 3000ms)
 */
export function showToast(message: string, duration: number = 3000): void {
  // Toast 컨테이너 찾기 또는 생성
  let container = document.getElementById('toast-container')

  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'fixed bottom-5 right-5 z-[10000] flex flex-col gap-2.5 pointer-events-none'
    document.body.appendChild(container)
  }

  // 동일한 메시지가 이미 표시중인지 확인 (중복 방지)
  const existingToasts = Array.from(container.children)
  const isDuplicate = existingToasts.some(
    (t) => t.textContent === message
  )
  if (isDuplicate) return

  // 최대 개수 초과 시 가장 오래된 토스트 제거
  if (existingToasts.length >= MAX_TOASTS) {
    const oldestToast = existingToasts[0] as HTMLElement
    oldestToast.classList.remove('opacity-100', 'translate-x-0')
    oldestToast.classList.add('opacity-0', 'translate-x-full')
    setTimeout(() => oldestToast.remove(), 300)
  }

  // 새 토스트 생성
  const toast = document.createElement('div')
  toast.className = `
    bg-baal-toast text-white px-5 py-3.5 rounded-lg shadow-baal-xl
    text-sm opacity-0 translate-x-full transition-all duration-300
    pointer-events-auto max-w-[350px]
  `
  toast.textContent = message
  container.appendChild(toast)

  // 애니메이션 시작
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-x-full')
    toast.classList.add('opacity-100', 'translate-x-0')
  }, 10)

  // duration 후 제거
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-x-0')
    toast.classList.add('opacity-0', 'translate-x-full')
    setTimeout(() => toast.remove(), 300)
  }, duration)
}
