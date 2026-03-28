'use client'

import { useState } from 'react'
import Link from 'next/link'

const palmQuestions = [
  { text: "손을 펼쳤을 때 가장 눈에 띄는 선은?", options: [
    { text: "가로로 길게 뻗은 선 (감정선)", result: "감정형" },
    { text: "세로로 깊게 파인 선 (운명선)", result: "운명형" },
    { text: "손바닥 가운데를 가로지르는 선 (두뇌선)", result: "지성형" },
  ]},
  { text: "감정선의 형태는?", options: [
    { text: "길고 곡선으로 휘어짐", result: "감정형" },
    { text: "짧고 직선에 가까움", result: "지성형" },
    { text: "여러 갈래로 갈라짐", result: "운명형" },
  ]},
  { text: "생명선의 길이는?", options: [
    { text: "손목까지 길게 내려옴", result: "감정형" },
    { text: "중간 정도", result: "운명형" },
    { text: "짧지만 굵고 선명함", result: "지성형" },
  ]},
]

const palmResults: Record<string, { desc: string; fortune: string; advice: string }> = {
  '감정형': {
    desc: '감수성이 풍부하고 감정이 깊은 유형. 사람들의 마음을 잘 읽고 공감 능력이 뛰어납니다.',
    fortune: '감정적 교류가 풍부한 한 해가 될 것입니다. 사랑과 우정에서 큰 기쁨을 얻을 수 있습니다.',
    advice: '감정에 휩쓸리지 말고 이성과 균형을 맞추세요.',
  },
  '운명형': {
    desc: '강한 의지와 목표 의식을 가진 유형. 운명적인 만남과 사건이 인생을 이끕니다.',
    fortune: '중요한 전환점이 다가오고 있습니다. 기회를 놓치지 마세요.',
    advice: '흐름에 맡기되 준비는 철저히 하세요.',
  },
  '지성형': {
    desc: '논리적이고 분석적인 유형. 머리가 좋고 판단력이 뛰어납니다.',
    fortune: '지적 성장의 기회가 많습니다. 배움에 투자하세요.',
    advice: '때로는 머리보다 마음의 소리를 들어보세요.',
  },
}

export default function PalmPage() {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})

  const answer = (result: string) => {
    setScores({ ...scores, [result]: (scores[result] || 0) + 1 })
    if (current + 1 < palmQuestions.length) setCurrent(current + 1)
    else setStep('result')
  }

  const getResult = () => {
    let max = 0, r = '감정형'
    Object.entries(scores).forEach(([type, score]) => {
      if (score > max) { max = score; r = type }
    })
    return r
  }

  if (step === 'intro') return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6 text-center">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-3">손금 분석</h1>
        <p className="text-sm text-baal-text-light mb-6">손금의 특징으로 알아보는 운세</p>
        <button onClick={() => setStep('test')} className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors">시작하기</button>
      </div>
    </div>
  )

  if (step === 'result') {
    const type = getResult()
    const info = palmResults[type]
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <p className="text-sm text-baal-text-light mb-2">당신의 손금 유형</p>
          <h1 className="text-3xl font-bold text-baal-gold mb-4">{type}</h1>
          <p className="text-sm text-baal-text mb-4">{info.desc}</p>
          <div className="bg-baal-bg-light rounded-xl p-4 mb-4">
            <p className="text-xs text-baal-gold font-semibold mb-1">운세</p>
            <p className="text-sm text-baal-text">{info.fortune}</p>
          </div>
          <div className="bg-baal-bg-light rounded-xl p-4 mb-6">
            <p className="text-xs text-baal-gold font-semibold mb-1">조언</p>
            <p className="text-sm text-baal-text">{info.advice}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('intro'); setCurrent(0); setScores({}) }} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시 하기</button>
            <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = palmQuestions[current]
  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-baal-text-light">{current + 1} / {palmQuestions.length}</span>
          <div className="flex-1 mx-3 h-1.5 bg-baal-bg-light rounded-full">
            <div className="h-full bg-baal-gold rounded-full transition-all" style={{ width: `${((current + 1) / palmQuestions.length) * 100}%` }} />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-baal-text-dark mb-6 text-center">{q.text}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => answer(opt.result)} className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">{opt.text}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
