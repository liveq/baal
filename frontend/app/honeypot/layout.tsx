import type { Metadata } from 'next'

// 꿀단지 전용 레이아웃 — AdSense 스크립트 제외
// 배포 시 honey.baal.co.kr로 분리 예정

export const metadata: Metadata = {
  title: '꿀단지 — 리워드 광고',
  description: '광고 보고 포인트 적립. 바알 꿀단지 리워드 시스템.',
  openGraph: {
    title: '꿀단지 — 리워드 광고 | BAAL',
    description: '광고 보고 포인트 적립. 바알 꿀단지 리워드 시스템.',
  },
}

export default function HoneypotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
