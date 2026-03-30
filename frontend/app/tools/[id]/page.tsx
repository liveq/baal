interface Props {
  params: Promise<{ id: string }>
}

const localTools = ['qr','barcode','ocr','resize','upscale','compress','convert','watermark','bg','chart','csv','json','md','hash','base64','color','regex']

const subdomainUrls: Record<string, string> = {
  plan: 'https://plan.baal.co.kr',
  split: 'https://split.baal.co.kr',
  pdf: 'https://pdf.baal.co.kr',
  music: 'https://music.baal.co.kr',
  cad: 'https://cad.baal.co.kr',
  doc: 'https://doc.baal.co.kr',
  hwp: 'https://hwp.baal.co.kr',
  sheet: 'https://sheet.baal.co.kr',
  slide: 'https://slide.baal.co.kr',
  code: 'https://code.baal.co.kr',
  docs: 'https://docs.baal.co.kr',
}

export default async function ToolPage({ params }: Props) {
  const { id } = await params

  const src = localTools.includes(id)
    ? `/tools-static/${id}/index.html`
    : subdomainUrls[id] ? `${subdomainUrls[id]}?embed=1` : null

  if (!src) {
    return <div className="p-8 text-center text-baal-text-light">도구를 찾을 수 없습니다</div>
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      <iframe
        src={src}
        title={id}
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  )
}
