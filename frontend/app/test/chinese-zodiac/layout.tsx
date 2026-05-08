import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '띠 성격 분석 & 오행 운세',
  description: '12지지 띠별 성격과 오행 분석. 나의 띠와 궁합 확인.',
  openGraph: {
    title: '띠 성격 분석 & 오행 운세 | BAAL',
    description: '12지지 띠별 성격과 오행 분석. 나의 띠와 궁합 확인.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
