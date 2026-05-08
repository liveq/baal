import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '이번 달 운세',
  description: '12별자리별 이번 달 운세. 월간 운세 무료 확인.',
  openGraph: {
    title: '이번 달 운세 | BAAL',
    description: '12별자리별 이번 달 운세. 월간 운세 무료 확인.',
  },
}

export default function MonthlyFortunePage() {
  return <ComingSoon title="월간 운세" description="이번 달 운세를 준비 중입니다." backLink="/fortune" backText="운세 목록" />
}
