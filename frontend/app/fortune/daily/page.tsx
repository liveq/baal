import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils/time'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const zodiacSigns = [
  { id: 1, name: '양자리', date: '3/21~4/19' },
  { id: 2, name: '황소자리', date: '4/20~5/20' },
  { id: 3, name: '쌍둥이자리', date: '5/21~6/20' },
  { id: 4, name: '게자리', date: '6/21~7/22' },
  { id: 5, name: '사자자리', date: '7/23~8/22' },
  { id: 6, name: '처녀자리', date: '8/23~9/22' },
  { id: 7, name: '천칭자리', date: '9/23~10/22' },
  { id: 8, name: '전갈자리', date: '10/23~11/21' },
  { id: 9, name: '사수자리', date: '11/22~12/21' },
  { id: 10, name: '염소자리', date: '12/22~1/19' },
  { id: 11, name: '물병자리', date: '1/20~2/18' },
  { id: 12, name: '물고기자리', date: '2/19~3/20' },
]

const zodiacNames: Record<string, string> = {
  Aries: '양자리', Taurus: '황소자리', Gemini: '쌍둥이자리', Cancer: '게자리',
  Leo: '사자자리', Virgo: '처녀자리', Libra: '천칭자리', Scorpio: '전갈자리',
  Sagittarius: '사수자리', Capricorn: '염소자리', Aquarius: '물병자리', Pisces: '물고기자리',
}

async function fetchFortune(zodiacId: number) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const res = await fetch(
      `${API}/api/community/posts?limit=1`, // placeholder
      { next: { revalidate: 3600 } }
    )
    // Try Supabase directly for fortune data
    const SURL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfgfxvgbnkrbvyzdaeel.supabase.co'
    const SKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    if (SKEY) {
      const fRes = await fetch(
        `${SURL}/rest/v1/daily_fortunes?zodiac_id=eq.${zodiacId}&date=eq.${today}&limit=1`,
        { headers: { apikey: SKEY, Authorization: `Bearer ${SKEY}` }, next: { revalidate: 3600 } }
      )
      if (fRes.ok) {
        const data = await fRes.json()
        if (data.length > 0) return data[0]
      }
      // Fallback: get latest fortune for this zodiac
      const fRes2 = await fetch(
        `${SURL}/rest/v1/daily_fortunes?zodiac_id=eq.${zodiacId}&order=date.desc&limit=1`,
        { headers: { apikey: SKEY, Authorization: `Bearer ${SKEY}` }, next: { revalidate: 3600 } }
      )
      if (fRes2.ok) {
        const data2 = await fRes2.json()
        if (data2.length > 0) return data2[0]
      }
    }
  } catch {}
  return null
}

export default async function DailyFortunePage() {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  // Try to fetch fortune for Aries (1) as sample
  const sample = await fetchFortune(1)

  return (
    <div className="max-w-[700px] mx-auto px-5 py-8">
      <div className="bg-white rounded-xl shadow-baal p-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-2 text-center">오늘의 운세</h1>
        <p className="text-sm text-baal-text-light mb-6 text-center">{today}</p>

        {sample ? (
          <div className="mb-6 p-4 bg-baal-bg-light rounded-xl">
            <p className="text-xs text-baal-text-light mb-1">DB 연동 확인</p>
            <p className="text-sm text-baal-text">{zodiacNames[sample.zodiac_name] || sample.zodiac_name}: {sample.overall_fortune?.slice(0, 80)}...</p>
          </div>
        ) : null}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {zodiacSigns.map(sign => (
            <Link key={sign.id} href={`/fortune/daily?sign=${sign.id}`}
              className="py-4 bg-baal-bg-light rounded-xl text-center hover:bg-baal-gold hover:text-white transition-all text-sm font-medium">
              <div>{sign.name}</div>
              <div className="text-xs mt-1 opacity-70">{sign.date}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
