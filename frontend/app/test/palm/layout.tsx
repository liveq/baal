import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '손금 보기 테스트',
  description: '3가지 질문으로 알아보는 나의 손금 유형과 운세. 간단 손금 분석.',
  openGraph: {
    title: '손금 보기 테스트 | BAAL',
    description: '3가지 질문으로 알아보는 나의 손금 유형과 운세. 간단 손금 분석.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
