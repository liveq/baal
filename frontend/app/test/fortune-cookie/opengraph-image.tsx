import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Fortune Cookie — A Message Just For You | BAAL'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f2d478 0%, #d4af37 50%, #B8860B 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 장식 원 (좌상) */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
          }}
        />
        {/* 장식 원 (우하) */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)',
          }}
        />

        {/* 쿠키 이모지 */}
        <div style={{ fontSize: 180, marginBottom: 20, display: 'flex' }}>🥠</div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-2px',
            textShadow: '0 2px 12px rgba(0,0,0,0.25)',
            marginBottom: 8,
          }}
        >
          Fortune Cookie
        </div>

        {/* 서브 타이틀 */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 500,
            letterSpacing: '0.5px',
            marginBottom: 40,
          }}
        >
          A Message Just For You
        </div>

        {/* 하단 브랜드 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 28px',
            background: 'rgba(0,0,0,0.35)',
            borderRadius: 999,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '2px',
            }}
          >
            BAAL
          </div>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
            }}
          >
            baal.co.kr/test/fortune-cookie
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      emoji: 'twemoji',
    }
  )
}
