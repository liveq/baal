'use client'

import { useState } from 'react'
import Link from 'next/link'

const majorArcana = [
  { id: 0, name: '바보', meaning: '새로운 시작, 순수함, 모험', reversed: '무모함, 경솔함, 방향 상실' },
  { id: 1, name: '마법사', meaning: '의지력, 창조, 능력 발휘', reversed: '속임수, 능력 낭비, 우유부단' },
  { id: 2, name: '여사제', meaning: '직관, 내면의 지혜, 신비', reversed: '비밀, 감춰진 의도, 혼란' },
  { id: 3, name: '여황제', meaning: '풍요, 모성, 자연의 축복', reversed: '의존, 공허함, 창의력 부족' },
  { id: 4, name: '황제', meaning: '권위, 안정, 리더십', reversed: '독재, 경직, 통제욕' },
  { id: 5, name: '교황', meaning: '전통, 지혜, 영적 가르침', reversed: '독단, 형식주의, 반항' },
  { id: 6, name: '연인', meaning: '사랑, 조화, 선택', reversed: '불균형, 갈등, 잘못된 선택' },
  { id: 7, name: '전차', meaning: '승리, 의지, 전진', reversed: '좌절, 통제 불능, 공격성' },
  { id: 8, name: '힘', meaning: '용기, 인내, 내면의 힘', reversed: '나약함, 자기 의심, 포기' },
  { id: 9, name: '은둔자', meaning: '내면 탐구, 지혜, 고독', reversed: '고립, 외로움, 현실 도피' },
  { id: 10, name: '운명의 수레바퀴', meaning: '변화, 운명, 전환점', reversed: '불운, 저항, 정체' },
  { id: 11, name: '정의', meaning: '공정, 진실, 균형', reversed: '불공정, 편견, 책임 회피' },
  { id: 12, name: '매달린 사람', meaning: '희생, 새로운 관점, 기다림', reversed: '무의미한 희생, 이기심' },
  { id: 13, name: '죽음', meaning: '끝과 시작, 변환, 해방', reversed: '변화 거부, 정체, 집착' },
  { id: 14, name: '절제', meaning: '균형, 조화, 인내', reversed: '과도함, 불균형, 성급함' },
  { id: 15, name: '악마', meaning: '유혹, 집착, 물질주의', reversed: '해방, 각성, 자유' },
  { id: 16, name: '탑', meaning: '갑작스러운 변화, 파괴, 각성', reversed: '재건, 두려움, 회피' },
  { id: 17, name: '별', meaning: '희망, 영감, 치유', reversed: '절망, 자신감 상실' },
  { id: 18, name: '달', meaning: '환상, 불안, 직관', reversed: '혼란 해소, 진실 발견' },
  { id: 19, name: '태양', meaning: '성공, 활력, 기쁨', reversed: '우울, 자만, 과신' },
  { id: 20, name: '심판', meaning: '부활, 결단, 자기 평가', reversed: '후회, 자기 비판, 지연' },
  { id: 21, name: '세계', meaning: '완성, 성취, 조화', reversed: '미완성, 지연, 목표 부재' },
]

export default function TarotTest() {
  const [drawn, setDrawn] = useState<{ card: typeof majorArcana[0]; reversed: boolean }[]>([])
  const [step, setStep] = useState<'intro' | 'result'>('intro')

  const draw = () => {
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5)
    const cards = shuffled.slice(0, 3).map(card => ({
      card,
      reversed: Math.random() > 0.5,
    }))
    setDrawn(cards)
    setStep('result')
  }

  if (step === 'intro') {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <div className="bg-white rounded-xl shadow-baal p-6 text-center">
          <h1 className="text-2xl font-bold text-baal-text-dark mb-3">타로 카드 리딩</h1>
          <p className="text-sm text-baal-text-light mb-2">메이저 아르카나 22장 중 3장을 뽑습니다</p>
          <p className="text-xs text-baal-text-light mb-6">과거 · 현재 · 미래</p>
          <button onClick={draw} className="px-6 py-3 bg-baal-gold text-white rounded-lg font-medium hover:bg-baal-gold-hover transition-colors">
            카드 뽑기
          </button>
        </div>
      </div>
    )
  }

  const labels = ['과거', '현재', '미래']

  return (
    <div className="max-w-[700px] mx-auto px-5 py-8">
      <h1 className="text-xl font-bold text-baal-text-dark mb-4 text-center">타로 리딩 결과</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {drawn.map((d, i) => (
          <div key={i} className="bg-white rounded-xl shadow-baal p-4 text-center">
            <p className="text-xs text-baal-gold font-semibold mb-2">{labels[i]}</p>
            <div className={`text-3xl font-bold mb-2 ${d.reversed ? 'text-red-500 rotate-180 inline-block' : 'text-baal-text-dark'}`}>
              {d.card.id}
            </div>
            <h3 className="text-base font-semibold text-baal-text-dark mb-1">
              {d.card.name} {d.reversed && '(역방향)'}
            </h3>
            <p className="text-xs text-baal-text leading-relaxed">
              {d.reversed ? d.card.reversed : d.card.meaning}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={draw} className="px-4 py-2 border border-baal-border rounded-lg text-sm hover:bg-baal-bg-gray">다시 뽑기</button>
        <Link href="/test" className="px-4 py-2 bg-baal-gold text-white rounded-lg text-sm hover:bg-baal-gold-hover">다른 테스트</Link>
      </div>
    </div>
  )
}
