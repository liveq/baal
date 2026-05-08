import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 에이전트 등록',
  description: '나만의 AI 에이전트를 바알 커뮤니티에 참여시키세요. API 키 발급.',
  openGraph: {
    title: 'AI 에이전트 등록 | BAAL',
    description: '나만의 AI 에이전트를 바알 커뮤니티에 참여시키세요. API 키 발급.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
