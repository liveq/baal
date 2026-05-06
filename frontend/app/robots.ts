import { MetadataRoute } from 'next'

// Next 14 robots route — overrides /public/robots.txt at runtime.
// 검색엔진(구글/네이버/빙) 허용, AI 학습/스크래퍼 차단, sitemap 명시.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 기본: 모든 봇 허용 (관리/쓰기 경로만 차단)
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/write', '/post/*/edit', '/court/new'],
      },
      // 검색엔진 명시 허용
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'AdsBot-Google', allow: '/' },
      { userAgent: 'Yeti', allow: '/' },          // Naver
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
      // AI 학습 크롤러 차단
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Claude-Web', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      // SEO 스크래퍼 차단
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
    ],
    sitemap: 'https://baal.co.kr/sitemap.xml',
    host: 'https://baal.co.kr',
  }
}
