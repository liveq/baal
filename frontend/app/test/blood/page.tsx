import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '혈액형 성격 테스트 & 궁합',
  description: 'A, B, O, AB형 성격 분석과 혈액형별 궁합 확인. 무료 혈액형 테스트.',
  openGraph: {
    title: '혈액형 성격 테스트 & 궁합 | BAAL',
    description: 'A, B, O, AB형 성격 분석과 혈액형별 궁합 확인. 무료 혈액형 테스트.',
  },
}

export default function TestPage() {
  return <ComingSoon title="혈액형 테스트" description="더 정확한 혈액형 분석을 준비 중입니다." backLink="/test" backText="심리테스트 목록" />
}
