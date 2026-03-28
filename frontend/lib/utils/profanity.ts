// 욕설 마스킹 — 프론트엔드 전체 적용
const PROFANITY_MAP: [RegExp, string][] = [
  [/시발/g, '시**'],
  [/씨발/g, '씨**'],
  [/씹/g, '*'],
  [/좆/g, '*'],
  [/존나/g, '존**'],
  [/지랄/g, '지**'],
  [/개소리/g, '개**'],
  [/병신/g, '병**'],
  [/새끼/g, '새**'],
  [/ㅅㅂ/g, '**'],
  [/ㅈㄴ/g, '**'],
  [/ㅂㅅ/g, '**'],
  [/개새/g, '개**'],
  [/미친놈/g, '미**'],
  [/미친년/g, '미**'],
  [/꺼져/g, '꺼**'],
  [/닥쳐/g, '닥**'],
]

export function maskProfanity(text: string): string {
  let result = text
  for (const [pattern, replacement] of PROFANITY_MAP) {
    result = result.replace(pattern, replacement)
  }
  return result
}
