'use client'

import { useState } from 'react'
import Link from 'next/link'

const bloodTypes = {
  A: {
    personality: "꼼꼼하고 신중한 완벽주의자",
    traits: ["섬세하고 배려심 깊음", "계획적이고 책임감 강함", "내성적이지만 깊은 관계 선호", "스트레스에 민감한 편"],
    love: "진지하고 헌신적인 연애 스타일. 상대를 깊이 이해하려 함.",
    match: { best: "O형", good: "A형", bad: "B형" },
  },
  B: {
    personality: "자유롭고 창의적인 마이웨이",
    traits: ["호기심 많고 모험적", "솔직하고 직설적", "자기만의 세계가 뚜렷", "규칙에 얽매이기 싫어함"],
    love: "자유로운 연애 스타일. 독립적이면서도 열정적.",
    match: { best: "AB형", good: "B형", bad: "A형" },
  },
  O: {
    personality: "리더십 있는 사교적 행동파",
    traits: ["목표 지향적이고 추진력 강함", "대범하고 포용력 있음", "경쟁심이 강하고 승부욕", "의리 있고 인간관계 넓음"],
    love: "적극적이고 직진형. 상대에게 올인하는 스타일.",
    match: { best: "A형", good: "O형", bad: "AB형" },
  },
  AB: {
    personality: "이성적이고 다재다능한 천재형",
    traits: ["냉철한 분석력과 감성 공존", "적응력 뛰어나고 다재다능", "예측 불가한 매력", "독특한 사고방식"],
    love: "지적인 연애를 선호. 감정보다 이성적으로 접근.",
    match: { best: "B형", good: "AB형", bad: "O형" },
  },
}

export default function BloodTypeTest() {
  const [selected, setSelected] = useState<string | null>(null)

  if (!selected) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-3">혈액형 성격 분석</h1>
          <p className="text-sm text-baal-text-light mb-6">당신의 혈액형을 선택하세요</p>
          <div className="grid grid-cols-2 gap-4">
            {['A', 'B', 'O', 'AB'].map(type => (
              <button key={type} onClick={() => setSelected(type)}
                className="py-6 bg-baal-bg-light rounded-xl text-2xl font-bold text-baal-text-dark hover:bg-baal-gold hover:text-white transition-all">
                {type}형
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const info = bloodTypes[selected as keyof typeof bloodTypes]

  return (
    <div className="max-w-[600px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-baal-gold">{selected}형</span>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-2">{info.personality}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-baal-text-dark mb-2">성격 특징</h3>
            <ul className="space-y-1">
              {info.traits.map((t, i) => (
                <li key={i} className="text-sm text-baal-text pl-3 border-l-2 border-baal-gold">{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-baal-text-dark mb-1">연애 스타일</h3>
            <p className="text-sm text-baal-text">{info.love}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-baal-text-dark mb-2">궁합</h3>
            <div className="flex gap-3 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded">최고: {info.match.best}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">좋음: {info.match.good}</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded">주의: {info.match.bad}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => setSelected(null)} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다른 혈액형</button>
          <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
        </div>
      </div>
    </div>
  )
}
