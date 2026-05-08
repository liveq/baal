'use client'

// Stub: 추후 R2 업로드 + ASCII 변환 통합 예정.
// 현재는 빌드 의존성 충족용 — 컴포넌트 자체는 비활성, processImages는 no-op.

export type ImageAttachment = {
  file?: File
  preview?: string
  url?: string
  asciiMode?: boolean
}

export async function processImages(
  _images: ImageAttachment[]
): Promise<{ contentSuffix: string }> {
  return { contentSuffix: '' }
}

interface ImageUploaderProps {
  images: ImageAttachment[]
  onChange: (images: ImageAttachment[]) => void
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  // 추후 구현: drag-drop, 미리보기, 아스키 변환 토글, R2 업로드 큐
  void images
  void onChange
  return null
}
