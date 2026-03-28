'use client'

import { useState } from 'react'
import Link from 'next/link'

const zodiacSigns = [
  { name: '양자리', date: '3/21~4/19', element: '불', traits: '열정적, 리더십, 도전적, 솔직함', love: '직진형, 밀당 못함' },
  { name: '황소자리', date: '4/20~5/20', element: '흙', traits: '안정적, 인내심, 감각적, 고집', love: '느리지만 깊은 사랑' },
  { name: '쌍둥이자리', date: '5/21~6/20', element: '공기', traits: '재치, 다재다능, 호기심, 변덕', love: '지적 대화가 중요' },
  { name: '게자리', date: '6/21~7/22', element: '물', traits: '감성적, 보호본능, 가정적, 눈치', love: '헌신적, 모성애적' },
  { name: '사자자리', date: '7/23~8/22', element: '불', traits: '자신감, 카리스마, 관대함, 자존심', love: '왕자/공주 대우 필요' },
  { name: '처녀자리', date: '8/23~9/22', element: '흙', traits: '분석적, 완벽주의, 실용적, 겸손', love: '섬세하고 봉사적' },
  { name: '천칭자리', date: '9/23~10/22', element: '공기', traits: '조화, 외교적, 우유부단, 미적 감각', love: '파트너십 중시' },
  { name: '전갈자리', date: '10/23~11/21', element: '물', traits: '강렬함, 직관적, 비밀주의, 집중력', love: '올인 아니면 올아웃' },
  { name: '사수자리', date: '11/22~12/21', element: '불', traits: '자유, 낙천적, 철학적, 솔직', love: '자유로운 연애 선호' },
  { name: '염소자리', date: '12/22~1/19', element: '흙', traits: '야망, 인내, 책임감, 현실적', love: '느리지만 확실한 사랑' },
  { name: '물병자리', date: '1/20~2/18', element: '공기', traits: '독창적, 인도주의, 독립적, 반항', love: '친구 같은 연인' },
  { name: '물고기자리', date: '2/19~3/20', element: '물', traits: '상상력, 공감능력, 직관적, 예술적', love: '로맨틱, 헌신적' },
]

export default function ZodiacTest() {
  const [selected, setSelected] = useState<number | null>(null)

  if (selected === null) {
    return (
      <div className="max-w-[700px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-2 text-center">별자리 성격 분석</h1>
          <p className="text-sm text-baal-text-light mb-6 text-center">당신의 별자리를 선택하세요</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {zodiacSigns.map((z, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className="py-4 bg-baal-bg-light rounded-xl text-center hover:bg-baal-gold hover:text-white transition-all">
                <div className="text-sm font-semibold">{z.name}</div>
                <div className="text-xs mt-1 opacity-70">{z.date}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const z = zodiacSigns[selected]
  const elementColors: Record<string, string> = { '불': 'bg-red-100 text-red-700', '흙': 'bg-amber-100 text-amber-700', '공기': 'bg-sky-100 text-sky-700', '물': 'bg-blue-100 text-blue-700' }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-baal-gold">{z.name}</h1>
          <p className="text-sm text-baal-text-light mt-1">{z.date}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${elementColors[z.element]}`}>{z.element} 원소</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-baal-text-dark mb-1">성격</h3>
            <p className="text-sm text-baal-text">{z.traits}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-baal-text-dark mb-1">연애</h3>
            <p className="text-sm text-baal-text">{z.love}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => setSelected(null)} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다른 별자리</button>
          <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
        </div>
      </div>
    </div>
  )
}
