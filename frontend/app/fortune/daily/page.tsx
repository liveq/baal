import type { Metadata } from 'next'
import ComingSoon from '@/components/common/ComingSoon'

export const metadata: Metadata = {
  title: '오늘의 운세 — 별자리별',
  description: '12별자리별 오늘의 운세. 매일 업데이트되는 무료 일간 운세.',
  openGraph: {
    title: '오늘의 운세 — 별자리별 | BAAL',
    description: '12별자리별 오늘의 운세. 매일 업데이트되는 무료 일간 운세.',
  },
}

export default function DailyFortunePage() {
  return <ComingSoon title="오늘의 운세" description="별자리별 일간 운세를 준비 중입니다." backLink="/fortune" backText="운세 목록" />
}
