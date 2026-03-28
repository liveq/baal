'use client'

import { useState } from 'react'
import Link from 'next/link'

const animals = [
  { name: '쥐', years: '1996, 2008, 2020', trait: '영리하고 재치있음. 적응력과 관찰력이 뛰어남.', element: '수(水)' },
  { name: '소', years: '1997, 2009, 2021', trait: '성실하고 인내심 강함. 신뢰할 수 있는 든든한 존재.', element: '토(土)' },
  { name: '호랑이', years: '1998, 2010, 2022', trait: '용맹하고 자신감 넘침. 리더십과 카리스마.', element: '목(木)' },
  { name: '토끼', years: '1999, 2011, 2023', trait: '온화하고 우아함. 섬세한 감각과 예술적 재능.', element: '목(木)' },
  { name: '용', years: '2000, 2012, 2024', trait: '야망 있고 에너지 넘침. 카리스마와 행운의 상징.', element: '토(土)' },
  { name: '뱀', years: '2001, 2013, 2025', trait: '지혜롭고 직관적. 신비로운 매력과 깊은 사고.', element: '화(火)' },
  { name: '말', years: '2002, 2014, 2026', trait: '활동적이고 자유로움. 열정과 독립심.', element: '화(火)' },
  { name: '양', years: '2003, 2015, 2027', trait: '온순하고 창의적. 예술적 감각과 평화로움.', element: '토(土)' },
  { name: '원숭이', years: '2004, 2016, 2028', trait: '재치있고 호기심 강함. 유머와 영리함.', element: '금(金)' },
  { name: '닭', years: '2005, 2017, 2029', trait: '근면하고 용감함. 정직과 실용적 사고.', element: '금(金)' },
  { name: '개', years: '2006, 2018, 2030', trait: '충성스럽고 정의로움. 의리와 책임감.', element: '토(土)' },
  { name: '돼지', years: '2007, 2019, 2031', trait: '너그럽고 성실함. 풍요와 행복을 추구.', element: '수(水)' },
]

export default function ChineseZodiacPage() {
  const [year, setYear] = useState('')
  const [result, setResult] = useState<typeof animals[0] | null>(null)

  const calculate = () => {
    const y = parseInt(year)
    if (isNaN(y) || y < 1900 || y > 2100) return
    const idx = (y - 4) % 12
    setResult(animals[idx])
  }

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-4 text-center">띠 운세</h1>

        <div className="flex gap-3 mb-6 justify-center">
          <input type="number" value={year} onChange={e => setYear(e.target.value)}
            placeholder="태어난 해 (예: 1995)"
            className="border border-baal-border rounded-lg px-4 py-2 text-sm w-48 focus:outline-none focus:border-baal-gold" />
          <button onClick={calculate} className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">확인</button>
        </div>

        {result ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-baal-gold mb-2">{result.name}띠</h2>
            <span className="inline-block px-3 py-1 bg-baal-bg-light rounded-full text-xs text-baal-text-dark mb-4">{result.element}</span>
            <p className="text-sm text-baal-text mb-4">{result.trait}</p>
            <p className="text-xs text-baal-text-light">해당 연도: {result.years}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {animals.map((a, i) => (
              <div key={i} className="text-center py-3 bg-baal-bg-light rounded-lg text-sm">
                <div className="font-semibold text-baal-text-dark">{a.name}</div>
                <div className="text-xs text-baal-text-light mt-1">{a.element}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          {result && <button onClick={() => setResult(null)} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시</button>}
          <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
        </div>
      </div>
    </div>
  )
}
