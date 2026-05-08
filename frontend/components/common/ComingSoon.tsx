'use client'

import Link from 'next/link'

interface ComingSoonProps {
  title?: string
  description?: string
  showBackHome?: boolean
}

export default function ComingSoon({
  title = '준비 중',
  description = '곧 만나볼 수 있습니다',
  showBackHome = true,
}: ComingSoonProps) {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-20 text-center">
      <div className="bg-white rounded-lg shadow-baal p-10">
        <div className="text-5xl mb-4">🛠</div>
        <h1 className="text-2xl md:text-3xl font-bold text-baal-text-dark mb-3">{title}</h1>
        <p className="text-baal-text-light mb-8 leading-relaxed whitespace-pre-line">{description}</p>
        {showBackHome && (
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-baal-gold text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            메인으로
          </Link>
        )}
      </div>
    </div>
  )
}
