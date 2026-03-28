'use client'

import { useState } from 'react'
import Link from 'next/link'

const questions = [
  { text: "주말에 가장 하고 싶은 것은?", options: [
    { text: "집에서 혼자 편하게 쉬기", animal: "고양이" },
    { text: "친구들과 밖에서 놀기", animal: "강아지" },
    { text: "새로운 곳 탐험하기", animal: "여우" },
  ]},
  { text: "모임에서 나는?", options: [
    { text: "분위기를 이끄는 중심", animal: "사자" },
    { text: "조용히 관찰하는 편", animal: "올빼미" },
    { text: "모두와 잘 어울림", animal: "돌고래" },
  ]},
  { text: "스트레스를 받으면?", options: [
    { text: "혼자 조용히 해결한다", animal: "고양이" },
    { text: "누군가에게 하소연한다", animal: "강아지" },
    { text: "운동이나 활동으로 푼다", animal: "늑대" },
  ]},
  { text: "리더 역할을 맡으면?", options: [
    { text: "자연스럽게 잘 해낸다", animal: "사자" },
    { text: "부담스럽지만 해낸다", animal: "올빼미" },
    { text: "팀원들과 함께 이끈다", animal: "돌고래" },
  ]},
  { text: "야밤에 갑자기 배가 고프면?", options: [
    { text: "참고 잔다", animal: "올빼미" },
    { text: "냉장고를 뒤진다", animal: "여우" },
    { text: "배달 시킨다", animal: "강아지" },
  ]},
]

const animals: Record<string, { desc: string; traits: string }> = {
  '고양이': { desc: '독립적이고 자기만의 세계가 확실한 당신. 혼자만의 시간을 소중히 여기며, 신뢰하는 소수와 깊은 관계를 맺습니다.', traits: '독립적, 우아함, 직관적, 도도함' },
  '강아지': { desc: '사교적이고 충성스러운 당신. 사랑하는 사람들과 함께하는 것이 가장 행복하고, 진심 어린 애정을 줍니다.', traits: '충성심, 열정, 사교적, 순수함' },
  '여우': { desc: '영리하고 적응력 뛰어난 당신. 어떤 상황에서도 유연하게 대처하며, 호기심으로 가득 차 있습니다.', traits: '영리함, 적응력, 호기심, 재치' },
  '사자': { desc: '카리스마 있는 타고난 리더. 자신감 넘치고 주변을 이끄는 힘이 있습니다.', traits: '리더십, 자신감, 용기, 카리스마' },
  '올빼미': { desc: '지혜롭고 사려 깊은 관찰자. 조용하지만 깊은 통찰력으로 핵심을 꿰뚫습니다.', traits: '지혜, 관찰력, 신중함, 깊은 사고' },
  '돌고래': { desc: '밝고 사교적인 소통의 달인. 누구와도 잘 어울리며 긍정적인 에너지를 전파합니다.', traits: '사교성, 유쾌함, 공감력, 지능' },
  '늑대': { desc: '강인하고 독립적인 전사. 자신만의 원칙을 지키며 끈기 있게 목표를 추구합니다.', traits: '강인함, 독립심, 끈기, 의리' },
}

export default function AnimalTestPage() {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})

  const answer = (animal: string) => {
    setScores({ ...scores, [animal]: (scores[animal] || 0) + 1 })
    if (current + 1 < questions.length) setCurrent(current + 1)
    else setStep('result')
  }

  const getResult = () => {
    let max = 0, result = '고양이'
    Object.entries(scores).forEach(([animal, score]) => {
      if (score > max) { max = score; result = animal }
    })
    return result
  }

  if (step === 'intro') return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6 text-center">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-3">나와 닮은 동물</h1>
        <p className="text-sm text-baal-text-light mb-6">5개 질문으로 알아보는 나의 동물 유형</p>
        <button onClick={() => setStep('test')} className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors">시작하기</button>
      </div>
    </div>
  )

  if (step === 'result') {
    const animal = getResult()
    const info = animals[animal]
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <p className="text-sm text-baal-text-light mb-2">당신과 닮은 동물은</p>
          <h1 className="text-3xl font-bold text-baal-gold mb-4">{animal}</h1>
          <p className="text-sm text-baal-text mb-4">{info.desc}</p>
          <p className="text-xs text-baal-text-light mb-6">{info.traits}</p>
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
            <button key={i} onClick={() => answer(opt.animal)} className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">{opt.text}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
