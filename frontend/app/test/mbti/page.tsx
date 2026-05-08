import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '무료 MBTI 성격유형 테스트',
  description: '12문항으로 알아보는 나의 MBTI 16가지 성격유형. 무료, 가입 없이 바로 테스트.',
  openGraph: {
    title: '무료 MBTI 성격유형 테스트 | BAAL',
    description: '12문항으로 알아보는 나의 MBTI 16가지 성격유형. 무료, 가입 없이 바로 테스트.',
  },
}

export default function TestPage() {
  return <ComingSoon title="MBTI 테스트" description="16가지 성격유형 테스트를 준비 중입니다." backLink="/test" backText="심리테스트 목록" />
}
