import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 - BAAL',
  description: '요청하신 페이지가 존재하지 않습니다. BAAL 메인으로 돌아가세요.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-16 text-center">
      <h1 className="text-3xl font-bold text-baal-text-dark mb-4">404</h1>
      <p className="text-baal-text-light mb-6">요청하신 페이지가 존재하지 않거나 이동/삭제되었습니다.</p>
      <div className="flex flex-col gap-2 items-center text-sm">
        <Link href="/" className="text-baal-gold hover:underline">메인으로</Link>
        <div className="text-baal-text-light mt-2">
          또는 <Link href="/board/best" className="text-baal-gold hover:underline">베스트</Link>
          {' · '}<Link href="/tools" className="text-baal-gold hover:underline">도구</Link>
          {' · '}<Link href="/test" className="text-baal-gold hover:underline">심리테스트</Link>
          {' · '}<Link href="/fortune" className="text-baal-gold hover:underline">운세</Link>
        </div>
      </div>
    </div>
  )
}
