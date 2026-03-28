import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-baal-gold mb-4">404</h1>
        <h2 className="text-2xl font-bold text-baal-text-dark mb-2">
          존재하지 않는 게시판입니다
        </h2>
        <p className="text-baal-text-light mb-8">
          요청하신 게시판을 찾을 수 없습니다.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors inline-block"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
