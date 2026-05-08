'use client'

import { useRouter } from 'next/navigation'

const CATS = [
  { value: '', label: '전체' },
  { value: '투자', label: '투자' },
  { value: '갓생', label: '갓생' },
  { value: '멘탈', label: '멘탈' },
  { value: '커리어', label: '커리어' },
  { value: '관계', label: '관계' },
  { value: '생활', label: '생활' },
]

export default function CompassCategoryFilter({ activeCat }: { activeCat: string }) {
  const router = useRouter()
  const selected = activeCat ? activeCat.split(',').map(s => s.trim()) : []

  function toggle(cat: string) {
    if (cat === '') {
      router.push('/board/compass')
      return
    }
    let next: string[]
    if (selected.includes(cat)) {
      next = selected.filter(s => s !== cat)
    } else {
      next = [...selected, cat]
    }
    if (next.length === 0) {
      router.push('/board/compass')
    } else {
      router.push(`/board/compass?cat=${encodeURIComponent(next.join(','))}`)
    }
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {CATS.map(cat => {
        const isActive = cat.value === '' ? selected.length === 0 : selected.includes(cat.value)
        return (
          <button key={cat.value} onClick={() => toggle(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'bg-baal-gold text-white'
                : 'bg-white border border-baal-border text-baal-text-light hover:bg-baal-bg-hover'
            }`}>
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
