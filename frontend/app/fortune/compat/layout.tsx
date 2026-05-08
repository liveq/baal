import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '궁합 테스트 — 144조합',
  description: '별자리 원소 기반 144가지 궁합 분석. 무료 궁합 테스트.',
  openGraph: {
    title: '궁합 테스트 — 144조합 | BAAL',
    description: '별자리 원소 기반 144가지 궁합 분석. 무료 궁합 테스트.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
