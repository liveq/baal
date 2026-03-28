'use client'

import { useState } from 'react'
import Link from 'next/link'

const heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
const earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
const elements = ['목', '화', '토', '금', '수']

function calcSaju(year: number, month: number, day: number) {
  const yearStem = heavenlyStems[(year - 4) % 10]
  const yearBranch = earthlyBranches[(year - 4) % 12]
  const monthStem = heavenlyStems[(year * 12 + month + 3) % 10]
  const monthBranch = earthlyBranches[(month + 1) % 12]
  const dayStem = heavenlyStems[(Math.floor((year - 1900) * 365.25 + (month - 1) * 30.44 + day)) % 10]
  const dayBranch = earthlyBranches[(Math.floor((year - 1900) * 365.25 + (month - 1) * 30.44 + day)) % 12]
  const mainElement = elements[heavenlyStems.indexOf(dayStem) % 5]

  return {
    year: yearStem + yearBranch,
    month: monthStem + monthBranch,
    day: dayStem + dayBranch,
    mainElement,
    desc: `일간 ${dayStem}(${mainElement})을 중심으로, ${yearStem}${yearBranch}년 ${monthStem}${monthBranch}월 ${dayStem}${dayBranch}일에 태어났습니다. ${mainElement}의 기운이 강한 사주입니다.`,
  }
}

export default function SajuPage() {
  const [birth, setBirth] = useState({ year: '', month: '', day: '' })
  const [result, setResult] = useState<any>(null)

  function analyze() {
    const y = parseInt(birth.year), m = parseInt(birth.month), d = parseInt(birth.day)
    if (isNaN(y) || isNaN(m) || isNaN(d)) return
    setResult(calcSaju(y, m, d))
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-4 text-center">사주팔자</h1>

        <div className="flex gap-2 mb-4 justify-center">
          <input type="number" value={birth.year} onChange={e => setBirth({...birth, year: e.target.value})}
            placeholder="년" className="w-24 border border-baal-border rounded-lg px-3 py-2 text-sm text-center" />
          <input type="number" value={birth.month} onChange={e => setBirth({...birth, month: e.target.value})}
            placeholder="월" className="w-20 border border-baal-border rounded-lg px-3 py-2 text-sm text-center" />
          <input type="number" value={birth.day} onChange={e => setBirth({...birth, day: e.target.value})}
            placeholder="일" className="w-20 border border-baal-border rounded-lg px-3 py-2 text-sm text-center" />
          <button onClick={analyze} className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">분석</button>
        </div>

        {result && (
          <div className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-baal-bg-light rounded-xl p-3">
                <p className="text-xs text-baal-text-light">년주</p>
                <p className="text-2xl font-bold text-baal-gold">{result.year}</p>
              </div>
              <div className="bg-baal-bg-light rounded-xl p-3">
                <p className="text-xs text-baal-text-light">월주</p>
                <p className="text-2xl font-bold text-baal-gold">{result.month}</p>
              </div>
              <div className="bg-baal-bg-light rounded-xl p-3">
                <p className="text-xs text-baal-text-light">일주</p>
                <p className="text-2xl font-bold text-baal-gold">{result.day}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-baal-gold text-white rounded-full text-sm font-bold">{result.mainElement}</span>
            </div>
            <p className="text-sm text-baal-text leading-relaxed">{result.desc}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          {result && <button onClick={() => setResult(null)} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시</button>}
          <Link href="/fortune" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">운세 목록</Link>
        </div>
      </div>
    </div>
  )
}
