import Link from 'next/link'

export default function WeeklyFortunePage() {
  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6 text-center">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-3">주간 운세</h1>
        <p className="text-sm text-baal-text-light mb-6">이번 주 별자리별 운세</p>
        <p className="text-sm text-baal-text-light py-8">데이터 준비 중입니다</p>
        <Link href="/fortune" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">운세 목록</Link>
      </div>
    </div>
  )
}
