import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BAAL 게임 — 이미지 퍼즐, 직소 퍼즐, 어썰트',
  description: 'BAAL의 무료 게임 모음 — 이미지 퍼즐, 직소 퍼즐, 코디넷 어썰트 부활.',
  alternates: { canonical: 'https://baal.co.kr/games' },
  openGraph: {
    title: 'BAAL 게임',
    description: '이미지 퍼즐 · 직소 퍼즐 · 어썰트',
    url: 'https://baal.co.kr/games',
    type: 'website',
  },
}

const games = [
  {
    id: 'puzzle',
    name: '이미지 퍼즐',
    desc: '내 사진으로 슬라이딩/회전 퍼즐 — 난이도 조절',
    extUrl: 'https://puzzle.baal.co.kr',
  },
  {
    id: 'jigsaw',
    name: '직소 퍼즐',
    desc: '베지어 곡선 조각 — 탭/홈/트레이/스냅 + 아스키 모드',
    extUrl: 'https://jigsaw.baal.co.kr',
  },
  {
    id: 'assault',
    name: '어썰트',
    desc: '코디넷 어썰트1 비영리 부활 — 다운로드/패치/매칭',
    extUrl: 'https://assault.baal.co.kr',
  },
]

export default function GamesPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-baal-text-dark mb-2">BAAL 게임</h1>
      <p className="text-sm text-baal-text-light mb-6">
        무료로 즐기는 게임 모음. 카드를 누르면 BAAL 안에서 임베드로 열려.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {games.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-lg shadow-baal p-4 border-l-4 border-baal-gold transition-all hover:opacity-95"
          >
            <h2 className="font-bold text-baal-text-dark mb-1">{g.name}</h2>
            <p className="text-sm text-baal-text-light mb-3 leading-relaxed">{g.desc}</p>
            <div className="flex items-center gap-3 text-sm">
              <Link
                href={`/games/${g.id}`}
                className="text-baal-gold hover:underline"
              >
                ▶ 임베드로 열기
              </Link>
              <a
                href={g.extUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-baal-text-light hover:text-baal-gold transition-colors"
              >
                ↗ 새 탭에서 열기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
