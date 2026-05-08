import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '별자리 성격 분석 & 운세',
  description: '12궁 별자리 성격, 원소 분석, 오늘의 별자리 운세. 무료.',
  openGraph: {
    title: '별자리 성격 분석 & 운세 | BAAL',
    description: '12궁 별자리 성격, 원소 분석, 오늘의 별자리 운세. 무료.',
  },
}

export default function TestPage() {
  return <ComingSoon title="별자리 운세" description="12궁 별자리 분석을 준비 중입니다." backLink="/test" backText="심리테스트 목록" />
}
