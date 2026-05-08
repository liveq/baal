import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '에니어그램 성격유형 테스트',
  description: '6문항으로 알아보는 9가지 에니어그램 유형. 무료 성격유형 테스트.',
  openGraph: {
    title: '에니어그램 성격유형 테스트 | BAAL',
    description: '6문항으로 알아보는 9가지 에니어그램 유형. 무료 성격유형 테스트.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
