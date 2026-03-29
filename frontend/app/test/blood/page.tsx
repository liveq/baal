import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="w-full">
      <div className="max-w-[900px] mx-auto px-5 py-4">
        <Link href="/test" className="text-sm text-baal-text-light hover:text-baal-text-dark">← 심리테스트 목록</Link>
      </div>
      <iframe
        src="/tests/blood/blood-type-sidebar.html?embed=1"
        className="w-full border-0"
        style={{ minHeight: 'calc(100vh - 120px)' }}
        title="혈액형 성격 분석"
      />
    </div>
  )
}
