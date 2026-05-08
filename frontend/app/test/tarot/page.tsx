import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '무료 타로카드 3카드 리딩',
  description: '22장 메이저 아르카나로 오늘의 타로 리딩. 과거-현재-미래 3카드 스프레드.',
  openGraph: {
    title: '무료 타로카드 3카드 리딩 | BAAL',
    description: '22장 메이저 아르카나로 오늘의 타로 리딩. 과거-현재-미래 3카드 스프레드.',
  },
}

export default function TestPage() {
  return <ComingSoon title="타로카드 리딩" description="메이저 아르카나 타로 리딩을 준비 중입니다." backLink="/test" backText="심리테스트 목록" />
}
