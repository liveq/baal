import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '도구 - BAAL',
  description: 'QR코드, OCR, 이미지 편집 등 무료 온라인 도구',
}

const tools = [
  { id: 'qr', name: 'QR 코드', desc: 'URL, 텍스트를 QR 코드로', category: '생성' },
  { id: 'barcode', name: '바코드', desc: '바코드 생성기', category: '생성' },
  { id: 'ocr', name: 'OCR', desc: '이미지에서 텍스트 추출', category: '이미지' },
  { id: 'resize', name: '리사이즈', desc: '이미지 크기 변경', category: '이미지' },
  { id: 'compress', name: '압축', desc: '이미지/파일 압축', category: '이미지' },
  { id: 'bg', name: '배경 제거', desc: '이미지 배경 자동 제거', category: '이미지' },
  { id: 'upscale', name: '업스케일', desc: '이미지 해상도 향상', category: '이미지' },
  { id: 'watermark', name: '워터마크', desc: '이미지에 워터마크 추가', category: '이미지' },
  { id: 'convert', name: '파일 변환', desc: '파일 포맷 변환', category: '파일' },
  { id: 'chart', name: '차트 생성', desc: '데이터로 차트 만들기', category: '생성' },
  { id: 'csv', name: 'CSV 에디터', desc: 'CSV 파일 편집', category: '텍스트' },
  { id: 'json', name: 'JSON 포맷터', desc: 'JSON 정리/검증', category: '텍스트' },
  { id: 'md', name: '마크다운', desc: '마크다운 편집/미리보기', category: '텍스트' },
  { id: 'hash', name: '해시 생성', desc: 'MD5, SHA-256 해시', category: '개발' },
  { id: 'base64', name: 'Base64', desc: '인코딩/디코딩', category: '개발' },
  { id: 'color', name: '컬러 피커', desc: '색상 선택/변환', category: '개발' },
  { id: 'regex', name: '정규식', desc: '정규식 테스트', category: '개발' },
]

const externalTools = [
  { name: 'CAD 뷰어', url: 'https://cad.baal.co.kr', desc: 'STL, STEP, DXF 등 CAD 파일 뷰어' },
  { name: '도면 배치', url: 'https://plan.baal.co.kr', desc: '평면도 그리기 + 가구 배치' },
  { name: '텍스트 분할', url: 'https://split.baal.co.kr', desc: '대용량 텍스트 파일 분할' },
  { name: 'PDF 도구', url: 'https://pdf.baal.co.kr', desc: 'PDF 변환/분할' },
]

export default function ToolsPage() {
  const categories = [...new Set(tools.map(t => t.category))]

  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-baal-text-dark mb-2">도구</h1>
      <p className="text-sm text-baal-text-light mb-6">브라우저에서 바로 사용하는 무료 도구</p>

      {/* 서브도메인 도구 */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-baal-text-gray mb-3">서비스</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {externalTools.map(t => (
            <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-baal p-4 hover:shadow-baal-md transition-shadow border-l-4 border-baal-gold">
              <h3 className="text-sm font-semibold text-baal-text-dark mb-1">{t.name}</h3>
              <p className="text-xs text-baal-text-light">{t.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* 카테고리별 도구 */}
      {categories.map(cat => (
        <div key={cat} className="mb-6">
          <h2 className="text-sm font-semibold text-baal-text-gray mb-3">{cat}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tools.filter(t => t.category === cat).map(t => (
              <a key={t.id} href={`/tools/${t.id}/index.html`}
                className="bg-white rounded-lg shadow-baal p-3 hover:shadow-baal-md transition-shadow">
                <h3 className="text-sm font-semibold text-baal-text-dark mb-1">{t.name}</h3>
                <p className="text-xs text-baal-text-light">{t.desc}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
