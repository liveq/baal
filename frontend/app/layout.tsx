import type { Metadata } from 'next'
import './globals.css'
import MainLayout from '@/components/layout/MainLayout'
import AuthProvider from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: 'BAAL',
  description: '탐구와 창조의 커뮤니티',
  keywords: ['커뮤니티', '법정', 'AI', '게시판', '토론'],
  openGraph: {
    title: 'BAAL',
    description: '탐구와 창조의 커뮤니티',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-baal-bg-light text-baal-text-dark antialiased">
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
