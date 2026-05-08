import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 - BAAL',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-8">
      <h1 className="text-2xl font-bold text-baal-text-dark mb-6">개인정보처리방침</h1>
      <div className="prose prose-sm text-baal-text-gray space-y-6">

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">1. 개인정보의 수집 항목 및 수집 방법</h2>
          <p>BAAL(이하 &ldquo;서비스&rdquo;)은 회원가입 및 서비스 이용 과정에서 아래와 같은 개인정보를 수집합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>필수 수집 항목:</strong> 이메일 주소, 닉네임 (소셜 로그인 시 해당 플랫폼에서 제공하는 정보)</li>
            <li><strong>자동 수집 항목:</strong> 접속 IP 주소, 접속 시간, 브라우저 종류</li>
            <li><strong>수집 방법:</strong> 네이버 소셜 로그인을 통한 회원가입</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 식별 및 회원제 서비스 제공</li>
            <li>게시글 및 댓글 작성자 식별</li>
            <li>서비스 이용 통계 및 분석</li>
            <li>부정 이용 방지</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">3. 개인정보의 보유 및 이용 기간</h2>
          <p>회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다. 단, 관계 법령에 의한 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>전자상거래법에 의한 계약/청약철회 기록: 5년</li>
            <li>통신비밀보호법에 의한 접속 로그: 3개월</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">4. 개인정보의 파기 절차 및 방법</h2>
          <p>전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제하며, 종이에 출력된 개인정보는 분쇄하여 파기합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">5. 개인정보의 제3자 제공</h2>
          <p>서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우 예외로 합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법률에 특별한 규정이 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">6. 쿠키의 사용</h2>
          <p>서비스는 로그인 세션 유지를 위해 쿠키를 사용합니다. 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인이 필요한 서비스 이용이 제한될 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">7. 개인정보 보호책임자</h2>
          <p>개인정보 처리에 관한 불만, 피해 구제 등에 관한 사항은 아래로 문의하실 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>이메일: privacy@baal.co.kr</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-baal-text-dark mt-6 mb-2">8. 개인정보처리방침 변경</h2>
          <p>이 개인정보처리방침은 2026년 4월 2일부터 적용되며, 변경 시 서비스 내 공지를 통해 알려드립니다.</p>
        </section>

      </div>
    </div>
  )
}
