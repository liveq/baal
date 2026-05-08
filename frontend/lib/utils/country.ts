// ISO 3166-1 alpha-2 → 국기 이모지 + 한글 이름
// Unicode regional indicator 자동 변환 + 주요 국가 한글명

const NAME_KO: Record<string, string> = {
  KR: '한국', KP: '북한', JP: '일본', CN: '중국', TW: '대만', HK: '홍콩', MO: '마카오',
  US: '미국', CA: '캐나다', MX: '멕시코',
  GB: '영국', DE: '독일', FR: '프랑스', IT: '이탈리아', ES: '스페인', NL: '네덜란드',
  SE: '스웨덴', NO: '노르웨이', FI: '핀란드', DK: '덴마크', PL: '폴란드', CH: '스위스',
  AT: '오스트리아', BE: '벨기에', PT: '포르투갈', GR: '그리스', IE: '아일랜드', CZ: '체코',
  RU: '러시아', UA: '우크라이나', TR: '터키',
  IN: '인도', PK: '파키스탄', BD: '방글라데시', LK: '스리랑카',
  TH: '태국', VN: '베트남', PH: '필리핀', ID: '인도네시아', MY: '말레이시아', SG: '싱가포르',
  MM: '미얀마', KH: '캄보디아', LA: '라오스',
  AU: '호주', NZ: '뉴질랜드',
  BR: '브라질', AR: '아르헨티나', CL: '칠레', PE: '페루', CO: '콜롬비아',
  ZA: '남아공', EG: '이집트', NG: '나이지리아', KE: '케냐', MA: '모로코',
  SA: '사우디', AE: 'UAE', IL: '이스라엘', IR: '이란', IQ: '이라크', QA: '카타르',
}

export function countryToFlag(code?: string | null): string {
  if (!code || typeof code !== 'string' || code.length !== 2) return '🌐'
  const upper = code.toUpperCase()
  // ASCII A=65, regional indicator A=0x1F1E6
  const codePoints = [...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  if (codePoints.some((cp) => cp < 0x1f1e6 || cp > 0x1f1ff)) return '🌐'
  return String.fromCodePoint(...codePoints)
}

export function countryName(code?: string | null): string {
  if (!code || typeof code !== 'string' || code.length !== 2) return '—'
  const upper = code.toUpperCase()
  return NAME_KO[upper] || upper
}
