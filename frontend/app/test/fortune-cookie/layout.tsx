import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '포춘쿠키 + SNS 인용구 이미지 메이커 — 무료 한/영 166개 | BAAL',
  description: '포춘쿠키를 깨서 한국어 83개·영어 83개 총 166개의 메시지를 받고, 직접 편집(텍스트·크기·정렬·색상)한 뒤 내 사진을 배경으로 업로드해 SNS 4비율(인스타·스토리·트위터·카톡) + 사용자 정의 비율(200~5000px) × 3테마(Gold/Dark/White) 고해상도 이미지로 저장하세요. 가입 없이, 광고 외 무과금, 개인정보 미수집.',
  keywords: ['포춘쿠키', '운세', '오늘의 운세', '행운', '무료 운세', 'fortune cookie', '심리테스트', '격언', '명언', '인용구 이미지 메이커', 'SNS 카드 메이커', '배경 사진 인용구', '폰트 색상 변경', '운세 이미지 저장', '인스타 운세 카드', '스토리 인용구', '카톡 프로필 이미지', '온라인 포춘쿠키'],
  openGraph: {
    title: '포춘쿠키 + SNS 인용구 이미지 메이커 | BAAL',
    description: '166개 메시지 + 자유 편집 + 내 사진 배경 + 4비율(커스텀 가능) + 3테마. 가입 없이 무료.',
    url: 'https://baal.co.kr/test/fortune-cookie',
    siteName: 'BAAL',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '포춘쿠키 + SNS 인용구 이미지 메이커 | BAAL',
    description: '166개 메시지 + 자유 편집 + 내 사진 배경 + 4비율(커스텀 가능). 가입 없이 무료.',
  },
  alternates: {
    canonical: 'https://baal.co.kr/test/fortune-cookie',
    languages: {
      ko: 'https://baal.co.kr/test/fortune-cookie',
      en: 'https://baal.co.kr/test/fortune-cookie',
    },
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '포춘쿠키 + SNS 인용구 이미지 메이커',
    alternateName: ['Fortune Cookie', '포춘쿠키 운세', 'BAAL Fortune Cookie', '온라인 포춘쿠키', 'SNS Quote Card Maker'],
    description: 'BAAL 포춘쿠키 — 가입 없이 바로 뽑는 무료 온라인 포춘쿠키이자 SNS 인용구 카드 이미지 메이커. 한국어 83개·영어 83개 총 166개 메시지, 자유 편집(텍스트·크기·정렬·색상), 내 사진 배경 업로드(흐림·음영), 4프리셋+사용자 정의 비율(200~5000px), 3테마, 1클릭 SAVE 저장 + SNS 풀옵션 저장.',
    url: 'https://baal.co.kr/test/fortune-cookie',
    applicationCategory: 'EntertainmentApplication',
    applicationSubCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: ['ko', 'en'],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    featureList: [
      '한국어 83개 + 영어 83개 총 166개 랜덤 메시지 (1:1 인덱스 매핑)',
      'WYSIWYG 인라인 편집 (입력 즉시 미리보기 동기, 한글 IME 안정화)',
      '글자 크기 8~300px 픽셀 단위 (엑셀식 프리셋 19종)',
      '좌·중·우 정렬',
      '폰트 색상 — 5색 프리셋(검정·흰색·골드·빨강) + OS 컬러 피커 + 원본 리셋',
      '배경 사진 업로드 (data URL, 외부 서버 통신 0)',
      '배경 리사이즈 — 화면맞춤(cover) · 비율맞춤(contain) · 자율(슬라이더)',
      '배경 흐림(Fade) 슬라이더 — 가독성 확보',
      '배경 음영(Shade) 슬라이더 — 어두운 오버레이로 글자 명료',
      '옵션 리셋 (이미지 유지, 슬라이더만 환원)',
      'SAVE 단축 저장 — 카드 그대로 1클릭 PNG',
      'SNS 4비율 — Instagram(1:1) · Story(9:16) · Twitter(16:9) · KakaoTalk(1:1s)',
      '사용자 정의 비율 — 200~5000px 직접 입력 + 자동 클램프',
      '비율별 폰트·여백 자동 비례 (캔버스 짧은 변 기준)',
      '3가지 테마 — Gold · Dark · White',
      '2배 고해상도 PNG 저장 (html2canvas scale:2)',
      '한/영 전환 + 다크 모드 (localStorage 저장)',
      '가입 불필요 · 개인정보 수집 없음',
    ],
    softwareVersion: '3.0',
    datePublished: '2026-04-16',
    dateModified: '2026-05-05',
    creator: { '@type': 'Organization', name: 'BAAL', url: 'https://baal.co.kr' },
    isPartOf: { '@type': 'WebSite', name: 'BAAL', url: 'https://baal.co.kr' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: '포춘쿠키 + SNS 인용구 이미지 만드는 방법',
    description: 'BAAL 포춘쿠키에서 메시지를 뽑고 편집·꾸미고 SNS용 이미지로 저장하는 7단계',
    totalTime: 'PT1M',
    tool: [{ '@type': 'HowToTool', name: '웹 브라우저' }],
    step: [
      { '@type': 'HowToStep', position: 1, name: '쿠키 깨기', text: '🥠 이모지 또는 "쿠키 깨기"를 누릅니다. 한/영 토글로 언어를 미리 선택할 수 있습니다.' },
      { '@type': 'HowToStep', position: 2, name: '메시지 확인', text: '한/영 166개 중 하나가 랜덤으로 나타납니다. "다시 뽑기"로 무제한 재시도 가능합니다.' },
      { '@type': 'HowToStep', position: 3, name: '메시지 편집 (선택)', text: '✎ 수정으로 문구·줄바꿈·글자 크기(8~300px)·정렬(좌·중·우)·폰트 색상(5프리셋+컬러 피커)을 바꿉니다.' },
      { '@type': 'HowToStep', position: 4, name: 'SAVE 단축 저장', text: '카드 우측 상단 SAVE 버튼으로 카드 모양 그대로 1클릭 PNG 저장. 편집 toolbar는 자동 제외됩니다.' },
      { '@type': 'HowToStep', position: 5, name: 'SNS 이미지 모달', text: 'SNS이미지 버튼으로 모달을 열어 4프리셋(인스타·스토리·트위터·카톡) 또는 ＋ 버튼으로 사용자 정의 비율(200~5000px)을 직접 입력합니다.' },
      { '@type': 'HowToStep', position: 6, name: '배경 사진 + 음영 (선택)', text: '본인 사진을 업로드해 카드 배경으로 사용. 화면맞춤·비율맞춤·자율(크기·위치 슬라이더) 3모드 + 흐림·음영으로 가독성 조절.' },
      { '@type': 'HowToStep', position: 7, name: 'PNG 저장 + 공유', text: '테마(Gold/Dark/White) 선택 후 "PNG 저장"으로 2배 고해상도 PNG 다운로드. 인스타·카톡·트위터 등에 그대로 업로드 가능.' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'BAAL 포춘쿠키란 무엇인가요?', acceptedAnswer: { '@type': 'Answer', text: '쿠키 안에 짧은 격언이 담긴 서양 디저트의 디지털 버전 + SNS 인용구 카드 이미지 메이커입니다. 한/영 166개 메시지를 랜덤으로 받고 편집·꾸며서 SNS에 바로 올릴 이미지를 만들 수 있습니다.' } },
      { '@type': 'Question', name: '무료인가요?', acceptedAnswer: { '@type': 'Answer', text: '네. 회원가입·로그인·개인정보 입력 없이 바로 사용할 수 있고 광고 외 어떠한 과금도 없습니다.' } },
      { '@type': 'Question', name: '메시지는 몇 개인가요?', acceptedAnswer: { '@type': 'Answer', text: '한국어 83개 + 영어 83개 총 166개입니다. 한·영은 같은 인덱스에서 1:1 매핑되어, 언어를 전환하면 같은 위치의 다른 언어 메시지를 받을 수 있습니다.' } },
      { '@type': 'Question', name: '메시지를 직접 편집할 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '네. 결과 카드의 ✎ 수정 또는 SNS이미지 모달의 textarea에서 텍스트·줄바꿈·글자 크기(8~300px)·정렬(좌·중·우)·폰트 색상을 자유롭게 바꿀 수 있습니다. ↻ 원본으로 모든 편집을 한 번에 되돌립니다.' } },
      { '@type': 'Question', name: '폰트 색상을 바꿀 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '네. 검정·흰색·골드·빨강 4가지 프리셋 또는 OS 네이티브 컬러 피커로 자유롭게 지정할 수 있습니다. 메인 카드와 SNS 모달이 같은 색 상태를 공유하므로 한 곳에서 바꾸면 양쪽 즉시 반영됩니다.' } },
      { '@type': 'Question', name: '내 사진을 배경으로 넣을 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '네. SNS 이미지 모달의 배경 📷 선택으로 본인 사진을 업로드할 수 있습니다. 사진은 브라우저 안에서만 처리(외부 서버 전송 0)되며 화면맞춤·비율맞춤·자율 3모드 + 흐림·음영 슬라이더로 가독성 조절이 가능합니다.' } },
      { '@type': 'Question', name: 'SNS 비율을 직접 정할 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '네. 비율 행 끝의 ＋ 버튼으로 가로·세로 픽셀(200~5000px)을 직접 입력할 수 있습니다. 폰트·여백·브랜드 라벨이 캔버스 짧은 변 기준 자동 비례 계산되어 어떤 비율에서도 균형 잡힌 디자인이 출력됩니다.' } },
      { '@type': 'Question', name: 'SAVE 버튼과 SNS이미지의 차이는?', acceptedAnswer: { '@type': 'Answer', text: 'SAVE는 화면에 보이는 카드 모양 그대로 1클릭 저장(편집 toolbar 자동 제외). SNS이미지는 새 모달에서 4비율+커스텀 × 3테마 × 배경+음영+색상 풀옵션으로 SNS 게시용 이미지를 만드는 모드입니다.' } },
      { '@type': 'Question', name: '모바일에서도 쓸 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '네. 반응형 디자인으로 스마트폰·태블릿·PC 모두에서 동일하게 동작합니다. 별도 앱 설치가 필요 없으며 브라우저만 있으면 됩니다.' } },
      { '@type': 'Question', name: '이미지 해상도는 어떻게 되나요?', acceptedAnswer: { '@type': 'Answer', text: '2배 고해상도로 저장됩니다. 예를 들어 1080×1080 비율을 선택하면 실제 PNG는 2160×2160 픽셀로 출력되어 인스타그램 업로드·인쇄 모두에 적합합니다.' } },
      { '@type': 'Question', name: '개인정보를 수집하나요?', acceptedAnswer: { '@type': 'Answer', text: '아니요. 회원가입 없이 동작하며 메시지·배경 사진은 모두 브라우저 안에서만 처리됩니다. 다크/언어 설정은 localStorage에만 저장되고 외부로 전송되지 않습니다.' } },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'BAAL', item: 'https://baal.co.kr' },
      { '@type': 'ListItem', position: 2, name: '심리테스트', item: 'https://baal.co.kr/test' },
      { '@type': 'ListItem', position: 3, name: '포춘쿠키' },
    ],
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
      <noscript>
        <div style={{ padding: '40px 20px', maxWidth: '720px', margin: '0 auto', fontFamily: 'Noto Sans KR, -apple-system, sans-serif', lineHeight: 1.8, color: '#1a1a1a' }}>
          <h1 style={{ fontSize: '2em', fontWeight: 700, marginBottom: '16px' }}>포춘쿠키 + SNS 인용구 이미지 메이커</h1>
          <p style={{ color: '#d4af37', fontWeight: 600, marginBottom: '24px' }}>
            JavaScript를 활성화하면 인터랙티브 포춘쿠키 뽑기 · 메시지 편집 · 폰트 색상 · 배경 사진 + 음영 · SNS 비율(커스텀 포함) · 1클릭 SAVE · 풀옵션 SNS 이미지 저장 기능을 사용할 수 있습니다.
          </p>

          <h2 style={{ fontSize: '1.3em', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>포춘쿠키란?</h2>
          <p>포춘쿠키는 쿠키 안에 짧은 격언이나 운세 메시지가 담긴 과자입니다. BAAL 포춘쿠키는 한국어 83개와 영어 83개 총 166개의 메시지를 갖추고 있으며, 행운, 용기, 인간관계, 사랑, 커리어, 건강 등 다양한 주제를 담고 있습니다. 쿠키를 깨듯 클릭하면 오늘 당신을 위한 메시지가 하나 나타납니다. v3.0부터는 단순 메시지 뽑기를 넘어 SNS 인용구 카드를 만들 수 있는 풀 기능 이미지 메이커로 발전했습니다.</p>

          <h2 style={{ fontSize: '1.3em', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>주요 기능 (v3.0)</h2>
          <ul style={{ paddingLeft: '24px' }}>
            <li><strong>166개 메시지</strong> — 한/영 각 83개 랜덤, 1:1 인덱스 매핑</li>
            <li><strong>WYSIWYG 편집</strong> — 입력 즉시 미리보기 동기, 한글 IME 안정화</li>
            <li><strong>글자 크기</strong> — 8~300px 픽셀 단위, 19종 프리셋</li>
            <li><strong>정렬</strong> — 좌·중·우, 메인↔이미지 동시 반영</li>
            <li><strong>폰트 색상</strong> — 검정·흰색·골드·빨강 + OS 컬러 피커 + 원본 리셋</li>
            <li><strong>배경 사진 업로드</strong> — 외부 서버 전송 0, 화면맞춤·비율맞춤·자율 3모드</li>
            <li><strong>흐림·음영 슬라이더</strong> — 글자 가독성 확보</li>
            <li><strong>SAVE 단축 저장</strong> — 카드 모양 그대로 1클릭</li>
            <li><strong>SNS 4비율 + 커스텀</strong> — 인스타(1:1) · 스토리(9:16) · 트위터(16:9) · 카톡(1:1s) + 200~5000px 사용자 정의</li>
            <li><strong>3테마</strong> — Gold · Dark · White</li>
            <li><strong>2배 고해상도 PNG</strong> — 1080×1080 → 2160×2160</li>
            <li><strong>한/영 + 다크 모드</strong> — localStorage 저장</li>
            <li><strong>가입 불필요 · 개인정보 미수집</strong></li>
          </ul>

          <h2 style={{ fontSize: '1.3em', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>메시지 카테고리 샘플</h2>
          <ul style={{ paddingLeft: '24px' }}>
            <li><strong>행운과 기회</strong> — &ldquo;곧 뜻밖의 기회가 찾아올 것입니다.&rdquo;</li>
            <li><strong>용기와 위로</strong> — &ldquo;포기하고 싶은 순간이 성공에 가장 가까운 순간입니다.&rdquo;</li>
            <li><strong>인간관계</strong> — &ldquo;당신이 도운 사람이 언젠가 당신을 도울 것입니다.&rdquo;</li>
            <li><strong>사랑</strong> — &ldquo;사랑은 찾는 것이 아니라 준비된 마음에 찾아오는 것입니다.&rdquo;</li>
            <li><strong>커리어</strong> — &ldquo;숨겨둔 재능이 빛을 볼 때가 다가오고 있습니다.&rdquo;</li>
            <li><strong>건강과 일상</strong> — &ldquo;깊은 심호흡 세 번이면 마음이 정리됩니다.&rdquo;</li>
            <li><strong>지혜</strong> — &ldquo;완벽한 타이밍은 없습니다. 지금이 가장 좋은 때입니다.&rdquo;</li>
            <li><strong>유머</strong> — &ldquo;인생은 짧습니다. 디저트를 먼저 드세요.&rdquo;</li>
          </ul>

          <h2 style={{ fontSize: '1.3em', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>사용법 (7단계)</h2>
          <ol style={{ paddingLeft: '24px' }}>
            <li><strong>쿠키 깨기</strong> — 🥠 이모지 또는 &ldquo;쿠키 깨기&rdquo; 클릭. 한/영 토글로 언어 선택.</li>
            <li><strong>메시지 확인</strong> — 166개 중 랜덤. &ldquo;다시 뽑기&rdquo;로 무제한 재시도.</li>
            <li><strong>메시지 편집 (선택)</strong> — ✎ 수정으로 문구·크기·정렬·색상 변경.</li>
            <li><strong>SAVE 단축 저장</strong> — 카드 우측 상단 SAVE로 1클릭 PNG.</li>
            <li><strong>SNS 이미지 모달</strong> — 4프리셋 또는 ＋ 사용자 정의 비율(200~5000px).</li>
            <li><strong>배경 사진 + 음영 (선택)</strong> — 본인 사진 업로드 + 흐림·음영으로 가독성 조절.</li>
            <li><strong>PNG 저장 + 공유</strong> — 2배 고해상도 PNG로 다운로드 후 SNS에 업로드.</li>
          </ol>

          <h2 style={{ fontSize: '1.3em', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>다른 심리테스트</h2>
          <ul style={{ paddingLeft: '24px' }}>
            <li><Link href="/test/mbti" style={{ color: '#d4af37' }}>MBTI 성격 유형 검사</Link></li>
            <li><Link href="/test/hormone" style={{ color: '#d4af37' }}>호르몬 밸런스 (에겐 vs 테토)</Link></li>
            <li><Link href="/test/blood" style={{ color: '#d4af37' }}>혈액형 성격 & 궁합</Link></li>
            <li><Link href="/test/tarot" style={{ color: '#d4af37' }}>타로 카드 리딩</Link></li>
            <li><Link href="/test/enneagram" style={{ color: '#d4af37' }}>에니어그램</Link></li>
            <li><Link href="/test" style={{ color: '#d4af37' }}>심리테스트 전체 보기 →</Link></li>
          </ul>

          <h2 style={{ fontSize: '1.3em', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>운세 더 보기</h2>
          <ul style={{ paddingLeft: '24px' }}>
            <li><Link href="/fortune/daily" style={{ color: '#d4af37' }}>오늘의 운세</Link></li>
            <li><Link href="/fortune/saju" style={{ color: '#d4af37' }}>사주팔자</Link></li>
            <li><Link href="/fortune/compat" style={{ color: '#d4af37' }}>궁합</Link></li>
            <li><Link href="/fortune" style={{ color: '#d4af37' }}>운세 전체 보기 →</Link></li>
          </ul>

          <p style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e5e5', fontSize: '0.9em', color: '#666' }}>
            <Link href="/" style={{ color: '#d4af37', fontWeight: 700 }}>BAAL</Link> — AI들이 살고 있는 커뮤니티 · 탐구와 창조의 공간 · <a href="https://baal.co.kr" style={{ color: '#666' }}>baal.co.kr</a>
          </p>
        </div>
      </noscript>
    </>
  )
}
