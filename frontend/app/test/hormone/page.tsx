'use client'

import { useState } from 'react'
import Link from 'next/link'

const questions = [
  { text: "친구가 실연당해서 울고 있을 때 나는?", a: "같이 울면서 토닥여준다", b: "새로운 사람 소개시켜줄게!", aType: "egen", bType: "teto" },
  { text: "주말에 뭐할지 계획 세울 때", a: "기분 따라 즉흥적으로", b: "시간대별로 계획을 짜놓는다", aType: "egen", bType: "teto" },
  { text: "선호하는 영화 장르는?", a: "로맨스, 드라마, 감동적인 영화", b: "액션, 스릴러, SF 영화", aType: "egen", bType: "teto" },
  { text: "선물 받았을 때 나는?", a: "감동해서 눈물이 날 것 같다", b: "고맙다고 쿨하게 인사한다", aType: "egen", bType: "teto" },
  { text: "운동할 때 선호하는 스타일은?", a: "요가, 필라테스 같은 정적인 운동", b: "웨이트, 크로스핏 같은 강한 운동", aType: "egen", bType: "teto" },
  { text: "카페에서 주로 주문하는 메뉴는?", a: "달달한 라떼나 프라푸치노", b: "아메리카노나 에스프레소", aType: "egen", bType: "teto" },
  { text: "싸웠을 때 화해하는 방법은?", a: "편지 쓰거나 긴 대화로 풀어낸다", b: "시간이 지나면 자연스럽게 풀린다", aType: "egen", bType: "teto" },
  { text: "스트레스 해소법은?", a: "친구와 수다 떨기", b: "혼자 운동하거나 게임하기", aType: "egen", bType: "teto" },
  { text: "새로운 일을 시작할 때", a: "감으로 일단 시작한다", b: "분석하고 계획 세운 뒤 시작", aType: "egen", bType: "teto" },
  { text: "잠들기 전 주로 하는 것은?", a: "오늘 하루를 돌아보며 감상에 젖는다", b: "내일 할 일 정리하고 바로 잔다", aType: "egen", bType: "teto" },
]

const results: Record<string, { name: string; hormone: string; desc: string; traits: string[] }> = {
  egen: {
    name: "에스트로겐형",
    hormone: "에스트로겐",
    desc: "감성적이고 공감 능력이 뛰어난 유형. 따뜻한 마음으로 주변을 돌보며, 직감과 감정으로 세상을 이해합니다.",
    traits: ["공감 능력 탁월", "감성적이고 직관적", "관계 중시", "배려심 깊음", "예술적 감각"],
  },
  teto: {
    name: "테스토스테론형",
    hormone: "테스토스테론",
    desc: "논리적이고 목표 지향적인 유형. 도전을 즐기며 결단력 있게 행동합니다. 효율과 성과를 중시합니다.",
    traits: ["논리적 사고", "목표 지향적", "결단력 있음", "경쟁심 강함", "독립적"],
  },
}

export default function HormoneTest() {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState({ egen: 0, teto: 0 })

  const answer = (type: string) => {
    const newScores = { ...scores, [type]: scores[type as keyof typeof scores] + 1 }
    setScores(newScores)
    if (current + 1 < questions.length) setCurrent(current + 1)
    else setStep('result')
  }

  const getResult = () => scores.egen >= scores.teto ? 'egen' : 'teto'

  if (step === 'intro') {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-3">호르몬 유형 테스트</h1>
          <p className="text-sm text-baal-text-light mb-6">10개 질문으로 알아보는 나의 호르몬 유형</p>
          <button onClick={() => setStep('test')} className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors">
            시작하기
          </button>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    const type = getResult()
    const info = results[type]
    const pct = Math.round((scores[type as keyof typeof scores] / questions.length) * 100)
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <p className="text-sm text-baal-text-light mb-2">당신의 호르몬 유형</p>
          <h1 className="text-3xl font-bold text-baal-gold mb-1">{info.name}</h1>
          <p className="text-sm text-baal-text-light mb-4">{info.hormone} 우세 ({pct}%)</p>
          <p className="text-sm text-baal-text mb-6 leading-relaxed">{info.desc}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {info.traits.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-baal-bg-light rounded-full text-xs text-baal-text-dark">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('intro'); setCurrent(0); setScores({ egen: 0, teto: 0 }) }}
              className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시 하기</button>
            <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current]
  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-baal-text-light">{current + 1} / {questions.length}</span>
          <div className="flex-1 mx-3 h-1.5 bg-baal-bg-light rounded-full">
            <div className="h-full bg-baal-gold rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-baal-text-dark mb-6 text-center">{q.text}</h2>
        <div className="space-y-3">
          <button onClick={() => answer(q.aType)} className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">{q.a}</button>
          <button onClick={() => answer(q.bType)} className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">{q.b}</button>
        </div>
      </div>
    </div>
  )
}
