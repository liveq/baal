import { MetadataRoute } from 'next'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 신규 사이트 crawl budget 절약 전략:
// - 고유 가치 페이지(도구/테스트/운세) → priority 0.9~1.0 (먼저 색인 받기)
// - AI 자동 글이 많은 게시판 자체 → priority 0.5~0.6 (낮춤)
// - 동적 게시글은 최근 30일+100편만 노출 (Vercel CPU 90% 도달 대응 — 봇 crawl budget 추가 절감)
async function fetchRecentPosts(): Promise<Array<{ id: string; updated_at: string; created_at: string; board_type: string; author_id: string | null }>> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return []
  try {
    // 2026-05-07 Vercel CPU 절감: 최근 30일 글만 sitemap 노출 (이전: 전체 14k+ 글 → 봇이 다 따라가며 SSR 재생성)
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    // anonymous_password는 anon SELECT 차단됨 (보안). author_id NULL 여부로 익명/회원 구분.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=id,updated_at,created_at,board_type,author_id&is_deleted=eq.false&created_at=gte.${since}&order=created_at.desc&limit=100`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

// 게시판별 priority — AI 자동 글 비중 따라 차등
const BOARD_PRIORITY: Record<string, number> = {
  free: 0.6, qna: 0.6, humor: 0.55, assault: 0.6,
  it: 0.5, hardware: 0.5, economy: 0.5,
  compass: 0.4, ai: 0.4, philosophy: 0.4, occult: 0.4,
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://baal.co.kr'
  const now = new Date().toISOString()

  // 최우선 색인 페이지 (고유 가치 — 도구/테스트/운세)
  const topPages = [
    { url: base, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${base}/tools`, changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${base}/test`, changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${base}/fortune`, changeFrequency: 'daily' as const, priority: 0.95 },
    { url: `${base}/board/best`, changeFrequency: 'hourly' as const, priority: 0.9 },
  ]

  // 게시판 — AI 자동 글 비중 따라 priority 차등
  const humanFirstBoards = [
    { type: 'free', priority: 0.7 },
    { type: 'qna', priority: 0.7 },
    { type: 'humor', priority: 0.65 },
    { type: 'assault', priority: 0.7 },
  ]
  const aiHeavyBoards = [
    { type: 'compass', priority: 0.5 },
    { type: 'ai', priority: 0.5 },
    { type: 'philosophy', priority: 0.5 },
    { type: 'occult', priority: 0.5 },
    { type: 'it', priority: 0.55 },
    { type: 'hardware', priority: 0.55 },
    { type: 'economy', priority: 0.55 },
  ]
  const boardPages = [...humanFirstBoards, ...aiHeavyBoards].map(b => ({
    url: `${base}/board/${b.type}`,
    changeFrequency: 'daily' as const,
    priority: b.priority,
  }))

  // 심리테스트 (고유 가치 페이지)
  const tests = [
    'mbti', 'blood', 'tarot', 'zodiac', 'hormone', 'numerology',
    'enneagram', 'palm', 'animal', 'fortune-cookie', 'chinese-zodiac',
  ]
  const testPages = tests.map(t => ({
    url: `${base}/test/${t}`,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // 운세 (고유 가치 페이지)
  const fortunes = ['daily', 'weekly', 'monthly', 'saju', 'compat']
  const fortunePages = fortunes.map(f => ({
    url: `${base}/fortune/${f}`,
    changeFrequency: f === 'daily' ? 'daily' as const : 'weekly' as const,
    priority: 0.85,
  }))

  // 도구 (고유 가치 페이지)
  const tools = [
    'qr', 'barcode', 'chart', 'ocr', 'resize', 'compress', 'bg',
    'upscale', 'watermark', 'convert', 'csv', 'json', 'md',
    'hash', 'base64', 'color', 'regex',
    'plan', 'split', 'pdf', 'comma', 'music',
    'doc', 'hwp', 'sheet', 'slide', 'code', 'docs',
    'ascii', 'puzzle', 'jigsaw',
  ]
  const toolPages = tools.map(t => ({
    url: `${base}/tools/${t}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 기타
  const miscPages = [
    { url: `${base}/court`, changeFrequency: 'daily' as const, priority: 0.6 },
    { url: `${base}/honeypot`, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${base}/agents`, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: 'monthly' as const, priority: 0.2 },
  ]

  // 동적 게시글 (최근 100편만) — 신규 사이트 crawl budget 절약
  // author_id NULL = 익명, NOT NULL = 회원/AI. 익명 인간 글 우선
  const posts = await fetchRecentPosts()
  const sortedPosts = [
    ...posts.filter(p => !p.author_id),  // 익명 인간 글 먼저
    ...posts.filter(p => p.author_id),
  ]
  const postPages = sortedPosts.map(p => ({
    url: `${base}/post/${p.id}`,
    lastModified: p.updated_at || p.created_at,
    changeFrequency: 'weekly' as const,
    priority: BOARD_PRIORITY[p.board_type] ?? 0.5,
  }))

  return [
    ...topPages.map(p => ({ ...p, lastModified: now })),
    ...testPages.map(p => ({ ...p, lastModified: now })),
    ...fortunePages.map(p => ({ ...p, lastModified: now })),
    ...toolPages.map(p => ({ ...p, lastModified: now })),
    ...boardPages.map(p => ({ ...p, lastModified: now })),
    ...miscPages.map(p => ({ ...p, lastModified: now })),
    ...postPages,
  ]
}
