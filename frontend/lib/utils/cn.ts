// Tailwind CSS 클래스 병합 유틸리티
// clsx와 tailwind-merge를 사용하는 대신 간단한 버전으로 구현

/**
 * 여러 클래스명을 하나로 병합
 * @example cn('text-red-500', 'font-bold', condition && 'underline')
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
