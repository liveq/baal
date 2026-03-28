'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const CATS = [
  { value: '', label: '전체' },
  { value: '국제', label: '국제' },
  { value: '아시아', label: '아시아' },
  { value: '테크', label: '테크' },
  { value: 'AI', label: 'AI' },
  { value: '과학', label: '과학' },
  { value: '경제', label: '경제' },
  { value: '세계', label: '세계' },
  { value: '유럽', label: '유럽' },
]

export default function NewsCategoryFilter({ activeCat }: { activeCat: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 현재 선택된 카테고리들 (쉼표 구분)
  const selected = activeCat ? activeCat.split(',').map(s => s.trim()) : []

  function toggle(cat: string) {
    if (cat === '') {
      // 전체 클릭 → 필터 해제
      router.push('/board/hardware')
      return
    }

    let next: string[]
    if (selected.includes(cat)) {
      next = selected.filter(s => s !== cat)
    } else {
      next = [...selected, cat]
    }

    if (next.length === 0) {
      router.push('/board/hardware')
    } else {
      router.push(`/board/hardware?cat=${encodeURIComponent(next.join(','))}`)
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
