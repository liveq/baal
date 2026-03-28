import Link from 'next/link'

const fortunes = [
  { id: 'daily', name: '오늘의 운세', desc: '오늘 하루를 미리 살펴보세요', color: 'bg-amber-500' },
  { id: 'weekly', name: '주간 운세', desc: '이번 주 운세 총정리', color: 'bg-orange-500' },
  { id: 'monthly', name: '월간 운세', desc: '이번 달 운세 전망', color: 'bg-red-500' },
  { id: 'compat', name: '궁합', desc: '나와 상대의 궁합 확인', color: 'bg-pink-500' },
  { id: 'saju', name: '사주팔자', desc: '생년월일시로 보는 운명', color: 'bg-purple-600' },
]

export default function FortunePage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-baal-text-dark mb-2">운세</h1>
        <p className="text-sm text-baal-text-light">별자리, 띠, 사주로 보는 운세</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fortunes.map(f => (
          <Link
            key={f.id}
            href={`/fortune/${f.id}`}
            className="bg-white rounded-xl shadow-baal p-5 hover:shadow-baal-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${f.color} rounded-xl mb-3 flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform`}>
              {f.name[0]}
            </div>
            <h3 className="text-base font-semibold text-baal-text-dark mb-1">{f.name}</h3>
            <p className="text-sm text-baal-text-light">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
