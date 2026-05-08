'use client'

import { useState } from 'react'

const FAITH_TEXT = '신앙을 증명하라'
const DEAL_TEXT = 'Deal with the BAAL'
const FAITH_TOTAL_MS = FAITH_TEXT.length * 200 + 2200

export default function BaalTribute() {
  const [show, setShow] = useState(false)

  return (
    <>
      <p className="text-center text-xs text-baal-text-light mt-3 pb-4">
        <span className="cursor-pointer hover:text-baal-gold transition-colors" onClick={() => setShow(true)}>BAAL</span> — 탐구와 창조의 공간
      </p>

      {show && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setShow(false) }}>
          <style>{`
            @keyframes revealCharFaith {
              0%   { color: #ffffff; }
              40%  { color: #b91c1c; }
              100% { color: #d4af37; }
            }
          `}</style>
          <div className="bg-white rounded-2xl p-10 max-w-sm mx-4 text-center shadow-2xl border border-[#d4af37]/40">
            <h2 className="text-2xl font-serif text-[#1e1e1e] mb-2 tracking-wide" style={{fontFamily: "'Playfair Display', 'Noto Serif KR', serif"}}>
              가치 있는 자만이<br/>가치를 얻는다
            </h2>
            <p
              className="text-xs text-white mb-6 cursor-text"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              어디까지가 네 한계인지 스스로 결정하라
            </p>
            <p className="text-[10px] uppercase tracking-[4px] mb-4 font-semibold">
              {Array.from(FAITH_TEXT).map((ch, i) => (
                <span
                  key={i}
                  style={{
                    color: '#ffffff',
                    animation: `revealCharFaith 2200ms ease-out ${i * 200}ms forwards`,
                    display: 'inline-block',
                    whiteSpace: 'pre',
                  }}
                >{ch}</span>
              ))}
            </p>
            <div className="bg-[#fafafa] p-4 rounded-xl inline-block mb-5 border border-[#e5e5e5]">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bitcoin:12xHw6nKomS6cruzBoKFkoEF78NJfWKRgn&bgcolor=ffffff&color=1a1a1a" alt="BAAL" className="mx-auto" width={160} height={160} />
            </div>
            <p className="text-sm font-medium tracking-wider mb-1" style={{fontFamily: "'Playfair Display', 'Noto Serif KR', serif"}}>
              {Array.from(DEAL_TEXT).map((ch, i) => (
                <span
                  key={i}
                  style={{
                    color: '#ffffff',
                    animation: `revealCharFaith 2200ms ease-out ${FAITH_TOTAL_MS + i * 120}ms forwards`,
                    display: 'inline-block',
                    whiteSpace: 'pre',
                  }}
                >{ch}</span>
              ))}
            </p>
            <p className="text-[10px] text-[#999999]">contact@baal.co.kr</p>
          </div>
        </div>
      )}
    </>
  )
}
