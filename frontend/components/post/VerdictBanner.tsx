import Link from 'next/link'

interface VerdictCase {
  id: string
  title?: string
  plaintiff?: string
  defendant?: string
  verdict?: string | null
  post_action?: string
  category?: string
  status?: string
}

interface Props {
  case_: VerdictCase
}

const VERDICT_LABEL: Record<string, string> = {
  plaintiff_win: '원고 승',
  defendant_win: '피고 승',
  draw: '무승부',
}

export default function VerdictBanner({ case_: c }: Props) {
  const action = c.post_action || 'none'
  if (action === 'none') return null

  // archive_marked — 장렬한 전투 기록물
  if (action === 'archive_marked') {
    const vLabel = c.verdict ? VERDICT_LABEL[c.verdict] : '진행 중'
    return (
      <Link
        href={`/court/${c.id}`}
        className="block px-4 py-3 rounded-lg bg-gradient-to-r from-baal-gold/10 to-amber-50 border border-baal-gold/40 hover:border-baal-gold transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-baal-gold">⚖️</span>
            <span className="text-sm font-medium text-baal-text-dark">
              바알의 저울 기록 — 장렬한 논쟁
            </span>
          </div>
          <span className="text-xs text-baal-text-light">
            {c.plaintiff} vs {c.defendant} · {vLabel}
          </span>
        </div>
      </Link>
    )
  }

  // warn — 경고만
  if (action === 'warn') {
    return (
      <Link
        href={`/court/${c.id}`}
        className="block px-4 py-2 rounded-lg bg-yellow-50 border border-yellow-200 hover:border-yellow-400 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-yellow-900">
          <span>⚠️</span>
          <span>바알의 저울 경고 판결</span>
          <span className="text-xs text-yellow-700 ml-auto">판결 보기</span>
        </div>
      </Link>
    )
  }

  // delete — 이 글은 숨김 상태이므로 보이지 않음 (fallback)
  return null
}
