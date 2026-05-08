'use client'

import { useEffect, useRef, useState } from 'react'

const EMBED_URL = 'https://cookie.baal.co.kr/'
const EMBED_ORIGIN = 'https://cookie.baal.co.kr'

export default function FortuneCookiePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(720)
  const [src, setSrc] = useState<string>('')

  useEffect(() => {
    const isDarkNow = () =>
      document.body.classList.contains('dark-mode') ||
      document.body.classList.contains('dark') ||
      localStorage.getItem('baal-dark') === 'true'

    const dark = isDarkNow()
    const lang = localStorage.getItem('baal-lang') || 'ko'
    const params = new URLSearchParams({ embed: '1' })
    if (dark) params.set('dark', '1')
    if (lang === 'en') params.set('lang', 'en')
    setSrc(`${EMBED_URL}?${params.toString()}`)

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== EMBED_ORIGIN) return
      const data = e.data as { type?: string; height?: number } | null
      if (data?.type === 'fortune-cookie-height' && typeof data.height === 'number') {
        setHeight(Math.max(400, Math.ceil(data.height) + 10))
      }
    }
    window.addEventListener('message', onMessage)

    const relayDark = () => {
      const w = iframeRef.current?.contentWindow
      if (!w) return
      w.postMessage({ type: 'set-dark', dark: isDarkNow() }, EMBED_ORIGIN)
    }
    const mo = new MutationObserver(relayDark)
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    const onStorage = (e: StorageEvent) => {
      const w = iframeRef.current?.contentWindow
      if (!w) return
      if (e.key === 'baal-dark') {
        w.postMessage({ type: 'set-dark', dark: e.newValue === 'true' }, EMBED_ORIGIN)
      } else if (e.key === 'baal-lang') {
        w.postMessage({ type: 'set-lang', lang: e.newValue || 'ko' }, EMBED_ORIGIN)
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('message', onMessage)
      window.removeEventListener('storage', onStorage)
      mo.disconnect()
    }
  }, [])

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 85px)',
        padding: '30px 12px 60px',
        boxSizing: 'border-box',
      }}
    >
      {src && (
        <iframe
          ref={iframeRef}
          src={src}
          title="포춘쿠키"
          loading="eager"
          style={{
            display: 'block',
            margin: '0 auto',
            width: '100%',
            maxWidth: '900px',
            height: `${height}px`,
            border: 'none',
            transition: 'height 0.25s',
            background: 'transparent',
          }}
        />
      )}
    </div>
  )
}
