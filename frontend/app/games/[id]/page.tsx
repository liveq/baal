import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

const gameUrls: Record<string, string> = {
  puzzle: 'https://puzzle.baal.co.kr',
  jigsaw: 'https://jigsaw.baal.co.kr',
  assault: 'https://assault.baal.co.kr',
}

const gameMeta: Record<string, { title: string; description: string }> = {
  puzzle: { title: '이미지 퍼즐', description: '내 사진으로 슬라이딩/회전 퍼즐 만들기 — BAAL 게임' },
  jigsaw: { title: '직소 퍼즐', description: '베지어 곡선 직소 퍼즐 — 탭/홈/트레이/스냅 — BAAL 게임' },
  assault: { title: '어썰트', description: '코디넷 어썰트1 비영리 부활 프로젝트 — BAAL 게임' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const meta = gameMeta[id]
  if (!meta) return { title: '게임 — BAAL' }
  return {
    title: `${meta.title} — BAAL 게임`,
    description: meta.description,
    alternates: { canonical: `https://baal.co.kr/games/${id}` },
    openGraph: {
      title: `${meta.title} — BAAL`,
      description: meta.description,
      url: `https://baal.co.kr/games/${id}`,
      type: 'website',
    },
  }
}

export default async function GamePage({ params }: Props) {
  const { id } = await params
  const src = gameUrls[id]

  if (!src) {
    return <div className="p-8 text-center text-baal-text-light">게임을 찾을 수 없습니다</div>
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      <iframe
        src={`${src}/?embed=1`}
        title={id}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
      />
    </div>
  )
}
