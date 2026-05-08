import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '수비학 생명수 분석',
  description: '생년월일로 알아보는 나의 생명수와 운명의 숫자. 피타고라스 수비학.',
  openGraph: {
    title: '수비학 생명수 분석 | BAAL',
    description: '생년월일로 알아보는 나의 생명수와 운명의 숫자. 피타고라스 수비학.',
  },
}

export default function TestPage() {
  return <ComingSoon title="수비학 분석" description="생명수 분석을 준비 중입니다." backLink="/test" backText="심리테스트 목록" />
}
