import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사주팔자 운세 분석',
  description: '생년월일시로 보는 사주팔자 무료 분석. 만세력 기반 AI 사주.',
  openGraph: {
    title: '사주팔자 운세 분석 | BAAL',
    description: '생년월일시로 보는 사주팔자 무료 분석. 만세력 기반 AI 사주.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
