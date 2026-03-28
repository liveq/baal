'use client'

import { useState } from 'react'
import Link from 'next/link'

const fortunes = [
  "곧 뜻밖의 기회가 찾아올 것입니다.",
  "지금 하고 있는 일이 결국 큰 결실을 맺을 것입니다.",
  "오늘 만나는 사람이 인생의 전환점이 될 수 있습니다.",
  "작은 친절이 큰 행운으로 돌아올 것입니다.",
  "포기하고 싶은 순간이 성공에 가장 가까운 순간입니다.",
  "당신의 직감을 믿으세요. 그것이 정답입니다.",
  "예상치 못한 곳에서 해답을 찾게 될 것입니다.",
  "오래 기다린 소식이 곧 도착할 것입니다.",
  "과거의 실수가 미래의 지혜가 됩니다.",
  "새로운 취미가 인생을 풍요롭게 만들 것입니다.",
  "먼 곳에서 좋은 소식이 올 것입니다.",
  "지금의 고민은 3개월 후면 웃으며 떠올릴 것입니다.",
  "당신이 도운 사람이 언젠가 당신을 도울 것입니다.",
  "오늘의 작은 결정이 내일의 큰 변화를 만듭니다.",
  "숨겨둔 재능이 빛을 볼 때가 다가오고 있습니다.",
  "진심은 반드시 전해집니다. 조금만 더 용기를 내세요.",
  "행운은 준비된 자에게 옵니다. 당신은 이미 준비되어 있습니다.",
  "오래된 인연이 다시 찾아올 것입니다.",
  "지금 읽고 있는 이 문장이 오늘의 행운입니다.",
  "웃으세요. 웃음은 가장 강력한 행운의 부적입니다.",
]

const luckyNumbers = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a, b) => a - b)

export default function FortuneCookiePage() {
  const [fortune, setFortune] = useState<string | null>(null)
  const [numbers, setNumbers] = useState<number[]>([])
  const [cracked, setCracked] = useState(false)

  const crack = () => {
    setCracked(true)
    setTimeout(() => {
      setFortune(fortunes[Math.floor(Math.random() * fortunes.length)])
      setNumbers(luckyNumbers())
    }, 600)
  }

  const reset = () => {
    setFortune(null)
    setNumbers([])
    setCracked(false)
  }

  return (
    <div className="max-w-[500px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6 text-center">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-4">포춘쿠키</h1>

        {!fortune ? (
          <>
            <div className={`text-6xl mb-6 transition-transform duration-500 ${cracked ? 'scale-150 opacity-0' : ''}`}>
              {cracked ? '💥' : '🥠'}
            </div>
            <p className="text-sm text-baal-text-light mb-6">쿠키를 깨서 오늘의 운세를 확인하세요</p>
            <button onClick={crack} disabled={cracked}
              className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors disabled:opacity-50">
              {cracked ? '깨지는 중...' : '쿠키 깨기'}
            </button>
          </>
        ) : (
          <>
            <div className="bg-baal-bg-light rounded-xl p-6 mb-6">
              <p className="text-base text-baal-text-dark leading-relaxed italic">&ldquo;{fortune}&rdquo;</p>
            </div>
            <div className="mb-6">
              <p className="text-xs text-baal-text-light mb-2">행운의 숫자</p>
              <div className="flex gap-2 justify-center">
                {numbers.map((n, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-baal-gold text-white rounded-full text-sm font-bold">{n}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={reset} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시 뽑기</button>
              <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
