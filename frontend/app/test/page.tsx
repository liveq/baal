import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '심리테스트 - BAAL',
  description: 'MBTI, 혈액형, 별자리, 타로 등 다양한 심리테스트',
}

const tests = [
  { id: 'zodiac', name: '별자리', desc: '12별자리로 보는 성격과 운세', color: 'bg-indigo-500' },
  { id: 'blood', name: '혈액형', desc: '혈액형별 성격 분석', color: 'bg-red-500' },
  { id: 'hormone', name: '호르몬', desc: '나의 호르몬 유형 분석', color: 'bg-emerald-500' },
  { id: 'tarot', name: '타로', desc: '타로 카드로 보는 오늘의 운세', color: 'bg-purple-500' },
  { id: 'mbti', name: 'MBTI', desc: '16가지 성격 유형 테스트', color: 'bg-pink-500' },
  { id: 'chinese-zodiac', name: '띠 운세', desc: '12간지로 보는 운세', color: 'bg-amber-600' },
  { id: 'saju', name: '사주', desc: '사주팔자로 보는 운명', color: 'bg-orange-600' },
  { id: 'fortune-cookie', name: '포춘쿠키', desc: '오늘의 포춘 메시지', color: 'bg-yellow-500' },
  { id: 'enneagram', name: '에니어그램', desc: '9가지 성격 유형', color: 'bg-teal-500' },
  { id: 'palm', name: '손금', desc: '손금으로 보는 운명', color: 'bg-stone-500' },
  { id: 'numerology', name: '수비학', desc: '숫자로 보는 성격과 운명', color: 'bg-blue-600' },
  { id: 'animal', name: '애니멀', desc: '나와 닮은 동물 찾기', color: 'bg-green-600' },
]

export default function TestPortal() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-2">심리테스트</h1>
        <p className="text-sm text-baal-text-light">다양한 심리테스트와 성격 분석</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {tests.map(test => (
          <Link
            key={test.id}
            href={`/test/${test.id}`}
            className="bg-white rounded-xl shadow-baal p-4 hover:shadow-baal-md transition-shadow group"
          >
            <div className={`w-10 h-10 ${test.color} rounded-lg mb-3 flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 transition-transform`}>
              {test.name[0]}
            </div>
            <h3 className="text-sm font-semibold text-baal-text-dark mb-1">{test.name}</h3>
            <p className="text-xs text-baal-text-light leading-relaxed">{test.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
