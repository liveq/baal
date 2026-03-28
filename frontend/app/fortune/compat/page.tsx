'use client'

import { useState } from 'react'
import Link from 'next/link'

const zodiacSigns = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리']

const elements: Record<string, string> = {
  '양자리': '불', '사자자리': '불', '사수자리': '불',
  '황소자리': '흙', '처녀자리': '흙', '염소자리': '흙',
  '쌍둥이자리': '공기', '천칭자리': '공기', '물병자리': '공기',
  '게자리': '물', '전갈자리': '물', '물고기자리': '물',
}

function calcCompat(a: string, b: string): { score: number; desc: string } {
  const eA = elements[a], eB = elements[b]
  if (a === b) return { score: 75, desc: '같은 별자리! 서로를 잘 이해하지만 너무 비슷해서 부딪힐 수도 있습니다.' }
  if (eA === eB) return { score: 90, desc: '같은 원소의 별자리로 자연스러운 조화를 이룹니다. 서로의 에너지가 잘 맞습니다.' }
  if ((eA === '불' && eB === '공기') || (eA === '공기' && eB === '불')) return { score: 85, desc: '불과 공기의 만남! 서로를 자극하고 영감을 주는 활기찬 관계입니다.' }
  if ((eA === '흙' && eB === '물') || (eA === '물' && eB === '흙')) return { score: 85, desc: '흙과 물의 조합! 안정적이고 깊은 정서적 유대를 형성합니다.' }
  if ((eA === '불' && eB === '물') || (eA === '물' && eB === '불')) return { score: 45, desc: '불과 물의 대립. 감정적 충돌이 있을 수 있지만, 극복하면 강한 유대가 됩니다.' }
  if ((eA === '흙' && eB === '공기') || (eA === '공기' && eB === '흙')) return { score: 55, desc: '현실과 이상의 만남. 서로 다른 시각이 때로는 보완, 때로는 갈등이 됩니다.' }
  return { score: 65, desc: '서로 다른 매력으로 끌리는 관계입니다.' }
}

export default function CompatPage() {
  const [signA, setSignA] = useState('')
  const [signB, setSignB] = useState('')
  const [result, setResult] = useState<{ score: number; desc: string } | null>(null)

  const check = () => {
    if (!signA || !signB) return
    setResult(calcCompat(signA, signB))
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-4 text-center">별자리 궁합</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-baal-text-gray mb-1 block">나</label>
            <select value={signA} onChange={e => setSignA(e.target.value)}
              className="w-full border border-baal-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baal-gold">
              <option value="">선택</option>
              {zodiacSigns.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-baal-text-gray mb-1 block">상대</label>
            <select value={signB} onChange={e => setSignB(e.target.value)}
              className="w-full border border-baal-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-baal-gold">
              <option value="">선택</option>
              {zodiacSigns.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button onClick={check} disabled={!signA || !signB}
          className="w-full py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors disabled:opacity-50 mb-6">
          궁합 보기
        </button>

        {result && (
          <div className="text-center">
            <div className="text-5xl font-bold text-baal-gold mb-2">{result.score}%</div>
            <p className="text-sm text-baal-text-light mb-1">{signA} + {signB}</p>
            <p className="text-sm text-baal-text leading-relaxed mt-4">{result.desc}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <Link href="/fortune" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">운세 목록</Link>
        </div>
      </div>
    </div>
  )
}
