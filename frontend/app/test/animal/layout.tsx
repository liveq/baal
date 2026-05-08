import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '나와 닮은 동물 테스트',
  description: '5문항으로 알아보는 나와 닮은 동물 7종. 동물 성격 심리테스트.',
  openGraph: {
    title: '나와 닮은 동물 테스트 | BAAL',
    description: '5문항으로 알아보는 나와 닮은 동물 7종. 동물 성격 심리테스트.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
