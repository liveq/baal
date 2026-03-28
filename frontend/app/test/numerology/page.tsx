'use client'

import { useState } from 'react'
import Link from 'next/link'

const lifePathMeanings: Record<number, { name: string; desc: string; traits: string[] }> = {
  1: { name: '리더', desc: '독립적이고 창의적인 개척자. 새로운 길을 여는 사람.', traits: ['독립심', '창의력', '결단력', '야망'] },
  2: { name: '협력자', desc: '조화와 균형을 추구하는 중재자. 파트너십의 달인.', traits: ['외교력', '감수성', '협력', '인내'] },
  3: { name: '표현자', desc: '창의적이고 사교적인 예술가. 소통의 달인.', traits: ['창의성', '낙천', '소통력', '영감'] },
  4: { name: '건설자', desc: '실용적이고 체계적인 건설자. 안정의 기반을 만듦.', traits: ['실용성', '인내', '책임감', '조직력'] },
  5: { name: '탐험가', desc: '자유롭고 모험적인 탐구자. 변화와 다양성을 추구.', traits: ['자유', '모험', '적응력', '호기심'] },
  6: { name: '양육자', desc: '사랑과 책임감의 화신. 가정과 공동체의 수호자.', traits: ['책임감', '배려', '조화', '봉사'] },
  7: { name: '탐구자', desc: '분석적이고 영적인 사색가. 진리를 추구.', traits: ['분석력', '직관', '지혜', '내면 탐구'] },
  8: { name: '성취자', desc: '야심차고 능력 있는 실현자. 물질적 풍요를 만듦.', traits: ['리더십', '야망', '실행력', '권위'] },
  9: { name: '인도주의자', desc: '이상주의적이고 관대한 박애주의자. 큰 그림을 봄.', traits: ['관대함', '이상', '지혜', '포용력'] },
  11: { name: '영감가', desc: '직관적이고 영적인 마스터 넘버. 높은 이상을 가짐.', traits: ['직관', '영감', '이상주의', '카리스마'] },
  22: { name: '마스터 건설자', desc: '비전을 현실로 만드는 마스터 넘버. 거대한 성취.', traits: ['비전', '실현력', '리더십', '인내'] },
}

function calcLifePath(birth: string): number {
  const digits = birth.replace(/\D/g, '')
  let sum = 0
  for (const d of digits) sum += parseInt(d)
  while (sum > 9 && sum !== 11 && sum !== 22) {
    let newSum = 0
    for (const d of sum.toString()) newSum += parseInt(d)
    sum = newSum
  }
  return sum
}

export default function NumerologyPage() {
  const [birth, setBirth] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    if (birth.length < 8) return
    setResult(calcLifePath(birth))
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-4 text-center">수비학</h1>
        <p className="text-sm text-baal-text-light mb-6 text-center">생년월일로 알아보는 인생 경로 숫자</p>

        <div className="flex gap-3 mb-6 justify-center">
          <input type="text" value={birth} onChange={e => setBirth(e.target.value)}
            placeholder="생년월일 (예: 19950315)"
            className="border border-baal-border rounded-lg px-4 py-2 text-sm w-52 focus:outline-none focus:border-baal-gold" />
          <button onClick={calculate} className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">분석</button>
        </div>

        {result && lifePathMeanings[result] && (
          <div className="text-center">
            <div className="text-5xl font-bold text-baal-gold mb-2">{result}</div>
            <h2 className="text-xl font-semibold text-baal-text-dark mb-3">{lifePathMeanings[result].name}</h2>
            <p className="text-sm text-baal-text mb-4">{lifePathMeanings[result].desc}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {lifePathMeanings[result].traits.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-baal-bg-light rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center mt-4">
          {result && <button onClick={() => setResult(null)} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시</button>}
          <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
        </div>
      </div>
    </div>
  )
}
