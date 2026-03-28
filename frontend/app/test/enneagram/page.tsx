'use client'

import { useState } from 'react'
import Link from 'next/link'

const questions = [
  { text: "가장 두려운 것은?", options: [
    { text: "불완전하거나 결함이 있는 것", type: 1 },
    { text: "사랑받지 못하는 것", type: 2 },
    { text: "가치 없는 사람이 되는 것", type: 3 },
  ]},
  { text: "사람들이 나를 어떻게 봐줬으면?", options: [
    { text: "독창적이고 특별한 사람", type: 4 },
    { text: "유능하고 지식이 풍부한 사람", type: 5 },
    { text: "믿을 수 있고 충성스러운 사람", type: 6 },
  ]},
  { text: "스트레스 받을 때 나는", options: [
    { text: "새로운 재미를 찾아 돌아다닌다", type: 7 },
    { text: "강하게 맞서 싸운다", type: 8 },
    { text: "갈등을 피하고 평화를 유지한다", type: 9 },
  ]},
  { text: "일할 때 가장 중요한 것은?", options: [
    { text: "완벽하게 해내는 것", type: 1 },
    { text: "인정받는 것", type: 3 },
    { text: "깊이 이해하는 것", type: 5 },
  ]},
  { text: "관계에서 나는", options: [
    { text: "상대를 돌보고 도와주고 싶다", type: 2 },
    { text: "진정한 나를 이해해주길 바란다", type: 4 },
    { text: "안정적이고 예측 가능하길 바란다", type: 6 },
  ]},
  { text: "여가시간에 주로", options: [
    { text: "다양한 활동을 계획한다", type: 7 },
    { text: "내 영역을 넓히고 도전한다", type: 8 },
    { text: "편안하게 쉬며 평화를 즐긴다", type: 9 },
  ]},
]

const types: Record<number, { name: string; desc: string; wing: string }> = {
  1: { name: "개혁가", desc: "원칙적이고 이상주의적. 완벽을 추구하며 옳은 일을 하고자 함.", wing: "9w1 또는 2w1" },
  2: { name: "조력자", desc: "따뜻하고 배려심 깊음. 타인을 돕는 것에서 보람을 느낌.", wing: "1w2 또는 3w2" },
  3: { name: "성취자", desc: "야심차고 적응력 뛰어남. 성공과 인정을 추구.", wing: "2w3 또는 4w3" },
  4: { name: "예술가", desc: "감수성 풍부하고 독창적. 진정한 자아를 찾고자 함.", wing: "3w4 또는 5w4" },
  5: { name: "탐구자", desc: "지적이고 통찰력 있음. 지식과 이해를 갈망.", wing: "4w5 또는 6w5" },
  6: { name: "충성가", desc: "책임감 있고 신뢰할 수 있음. 안전과 소속을 중시.", wing: "5w6 또는 7w6" },
  7: { name: "열정가", desc: "활동적이고 낙천적. 다양한 경험과 자유를 추구.", wing: "6w7 또는 8w7" },
  8: { name: "도전자", desc: "자신감 넘치고 결단력 있음. 힘과 정의를 추구.", wing: "7w8 또는 9w8" },
  9: { name: "평화주의자", desc: "수용적이고 온화함. 내적 평화와 조화를 추구.", wing: "8w9 또는 1w9" },
}

export default function EnneagramTest() {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState<Record<number, number>>({})

  const answer = (type: number) => {
    setScores({ ...scores, [type]: (scores[type] || 0) + 1 })
    if (current + 1 < questions.length) setCurrent(current + 1)
    else setStep('result')
  }

  const getResult = () => {
    let max = 0, result = 1
    Object.entries(scores).forEach(([type, score]) => {
      if (score > max) { max = score; result = +type }
    })
    return result
  }

  if (step === 'intro') return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6 text-center">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-3">에니어그램</h1>
        <p className="text-sm text-baal-text-light mb-6">9가지 성격 유형 중 나는 어디에?</p>
        <button onClick={() => setStep('test')} className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors">시작하기</button>
      </div>
    </div>
  )

  if (step === 'result') {
    const type = getResult()
    const info = types[type]
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <p className="text-sm text-baal-text-light mb-2">당신의 에니어그램</p>
          <h1 className="text-4xl font-bold text-baal-gold mb-1">유형 {type}</h1>
          <h2 className="text-xl font-semibold text-baal-text-dark mb-4">{info.name}</h2>
          <p className="text-sm text-baal-text mb-4">{info.desc}</p>
          <p className="text-xs text-baal-text-light mb-6">관련 날개: {info.wing}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('intro'); setCurrent(0); setScores({}) }} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시 하기</button>
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
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => answer(opt.type)} className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">{opt.text}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
