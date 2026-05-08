/**
 * 이미지 → 아스키 아트 변환 (브라우저 Canvas 기반)
 * R2 용량 0으로 텍스트만 DB에 저장
 */

const ASCII_CHARS = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'

/**
 * 이미지 파일을 아스키 아트 문자열로 변환
 */
export async function imageToAscii(
  file: File,
  width: number = 80,
): Promise<string> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // 비율 유지하면서 너비 맞춤
  const ratio = img.height / img.width
  const height = Math.round(width * ratio * 0.5) // 글자 높이 보정
  canvas.width = width
  canvas.height = height

  ctx.drawImage(img, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data

  let ascii = ''
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = pixels[idx]
      const g = pixels[idx + 1]
      const b = pixels[idx + 2]
      // 밝기 계산
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      const charIdx = Math.floor(brightness * (ASCII_CHARS.length - 1))
      ascii += ASCII_CHARS[charIdx]
    }
    ascii += '\n'
  }

  return ascii
}

/**
 * 이미지 리사이즈 + WebP 압축 (최대 1024px, ~200KB)
 */
export async function compressImage(
  file: File,
  maxSize: number = 1024,
  quality: number = 0.7,
): Promise<Blob> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  let w = img.width
  let h = img.height

  // 긴 쪽 기준 리사이즈
  if (w > maxSize || h > maxSize) {
    if (w > h) {
      h = Math.round(h * (maxSize / w))
      w = maxSize
    } else {
      w = Math.round(w * (maxSize / h))
      h = maxSize
    }
  }

  canvas.width = w
  canvas.height = h
  ctx.drawImage(img, 0, 0, w, h)

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      'image/webp',
      quality,
    )
  })
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
