'use client'

import { useState } from 'react'
import Link from 'next/link'

const questions = [
  { text: "새로운 사람들을 만날 때 나는", dim: "EI", a: "먼저 다가가서 인사한다", b: "상대가 먼저 말 걸기를 기다린다" },
  { text: "에너지를 충전하는 방법은", dim: "EI", a: "친구들과 만나서 수다를 떤다", b: "혼자만의 조용한 시간을 갖는다" },
  { text: "스트레스를 받을 때", dim: "EI", a: "사람들과 이야기하며 해소한다", b: "혼자 정리하며 해소한다" },
  { text: "정보를 받아들일 때", dim: "SN", a: "구체적인 사실과 세부사항에 집중한다", b: "전체적인 패턴과 가능성에 집중한다" },
  { text: "문제를 해결할 때", dim: "SN", a: "검증된 방법을 선호한다", b: "새로운 방법을 시도해본다" },
  { text: "일할 때 선호하는 방식은", dim: "SN", a: "단계별로 차근차근 진행한다", b: "큰 그림을 먼저 그리고 시작한다" },
  { text: "결정을 내릴 때", dim: "TF", a: "논리와 객관적 기준으로 판단한다", b: "사람들의 감정과 상황을 고려한다" },
  { text: "친구가 고민을 얘기하면", dim: "TF", a: "해결책을 제시하려고 한다", b: "공감하며 들어주려고 한다" },
  { text: "비판을 받았을 때", dim: "TF", a: "논리적으로 맞으면 수용한다", b: "말하는 방식이 더 중요하다" },
  { text: "여행 계획을 세울 때", dim: "JP", a: "세부 일정을 미리 짜놓는다", b: "대략적 방향만 정하고 즉흥적으로", },
  { text: "마감이 있는 일에서", dim: "JP", a: "여유있게 미리미리 한다", b: "마감 직전에 집중해서 한다" },
  { text: "일상에서 선호하는 것은", dim: "JP", a: "예측 가능하고 규칙적인 생활", b: "자유롭고 유연한 생활" },
]

const types: Record<string, { name: string; desc: string; match: string }> = {
  INTJ: { name: "전략가", desc: "독립적이고 분석적인 전략가. 복잡한 문제를 해결하는 데 탁월.", match: "ENFP" },
  INTP: { name: "논리술사", desc: "지적 호기심이 강한 사색가. 이론과 아이디어의 세계.", match: "ENTJ" },
  ENTJ: { name: "통솔자", desc: "단호하고 리더십 있는 지휘관. 효율과 성과를 중시.", match: "INTP" },
  ENTP: { name: "변론가", desc: "재치있고 도전적인 토론가. 새로운 가능성을 탐구.", match: "INFJ" },
  INFJ: { name: "옹호자", desc: "이상주의적이고 통찰력 있는 조언자. 깊은 공감 능력.", match: "ENTP" },
  INFP: { name: "중재자", desc: "상상력 풍부한 이상주의자. 내면의 가치를 중시.", match: "ENFJ" },
  ENFJ: { name: "선도자", desc: "카리스마 있는 리더. 타인의 성장을 돕는 것에 보람.", match: "INFP" },
  ENFP: { name: "활동가", desc: "열정적이고 창의적인 자유로운 영혼. 가능성의 탐험가.", match: "INTJ" },
  ISTJ: { name: "현실주의자", desc: "신뢰할 수 있고 책임감 강한 관리자. 원칙과 질서.", match: "ESFP" },
  ISFJ: { name: "수호자", desc: "따뜻하고 헌신적인 보호자. 조용히 타인을 돌봄.", match: "ESTP" },
  ESTJ: { name: "경영자", desc: "체계적이고 실용적인 관리자. 조직과 효율.", match: "ISFP" },
  ESFJ: { name: "집정관", desc: "사교적이고 배려심 깊은 돌봄이. 조화와 협력.", match: "ISTP" },
  ISTP: { name: "장인", desc: "논리적이고 실용적인 탐험가. 도구와 기계의 달인.", match: "ESFJ" },
  ISFP: { name: "모험가", desc: "유연하고 매력적인 예술가. 순간의 아름다움을 포착.", match: "ESTJ" },
  ESTP: { name: "사업가", desc: "에너지 넘치는 행동파. 즉각적인 결과를 추구.", match: "ISFJ" },
  ESFP: { name: "연예인", desc: "즐겁고 활기찬 즉흥 연기자. 지금 이 순간을 즐김.", match: "ISTJ" },
}

export default function MBTITest() {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 })

  const answer = (choice: 'a' | 'b') => {
    const q = questions[current]
    const newScores = { ...scores }
    if (choice === 'a') newScores[q.dim[0] as keyof typeof scores]++
    else newScores[q.dim[1] as keyof typeof scores]++
    setScores(newScores)

    if (current + 1 < questions.length) {
      setCurrent(current + 1)
    } else {
      setStep('result')
    }
  }

  const getType = () => {
    return (
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P')
    )
  }

  if (step === 'intro') {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-3">MBTI 성격 유형 테스트</h1>
          <p className="text-sm text-baal-text-light mb-6">12개 질문으로 알아보는 나의 성격 유형</p>
          <button onClick={() => setStep('test')}
            className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors">
            시작하기
          </button>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    const type = getType()
    const info = types[type] || { name: type, desc: '', match: '' }
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <p className="text-sm text-baal-text-light mb-2">당신의 MBTI는</p>
          <h1 className="text-4xl font-bold text-baal-gold mb-2">{type}</h1>
          <h2 className="text-xl font-semibold text-baal-text-dark mb-4">{info.name}</h2>
          <p className="text-sm text-baal-text mb-6 leading-relaxed">{info.desc}</p>
          <p className="text-sm text-baal-text-light mb-6">최고 궁합: <strong className="text-baal-gold">{info.match}</strong></p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('intro'); setCurrent(0); setScores({ E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0 }) }}
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
          <button onClick={() => answer('a')}
            className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">
            {q.a}
          </button>
          <button onClick={() => answer('b')}
            className="w-full text-left px-4 py-3 border border-baal-border rounded-lg text-sm hover:border-baal-gold hover:bg-baal-bg-light transition-all">
            {q.b}
          </button>
        </div>
      </div>
    </div>
  )
}
