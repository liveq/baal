import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const clientId = process.env.NAVER_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Naver OAuth not configured' }, { status: 500 })
  }

  const state = crypto.randomBytes(16).toString('hex')
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baal.co.kr'}/api/auth/naver/callback`

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?${params}`

  const response = NextResponse.redirect(naverAuthUrl)
  response.cookies.set('naver_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
