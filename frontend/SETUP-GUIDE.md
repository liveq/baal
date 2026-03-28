# BAAL 프로젝트 설정 가이드

이 문서는 BAAL 프로젝트를 처음 설정하는 방법을 단계별로 안내합니다.

## 📋 사전 요구사항

- Node.js 20.x 이상
- npm 또는 yarn
- Supabase 계정
- Google Cloud Console 계정 (Google OAuth용)
- Kakao Developers 계정 (Kakao OAuth용)

## 🚀 1단계: 프로젝트 설정

### 1.1 저장소 클론 및 의존성 설치

```bash
cd G:\hddcode\baal\baal-nextjs
npm install
```

### 1.2 환경변수 확인

`.env.local` 파일이 이미 생성되어 있습니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yqddaiisbgcdmsvtpkqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **중요**: 이 파일은 Git에 커밋되지 않습니다.

## 🗄 2단계: Supabase 데이터베이스 설정

### 2.1 Supabase 프로젝트 접속

1. https://supabase.com 로그인
2. 프로젝트명: `baal`
3. Database Password: (Supabase 대시보드에서 확인)

### 2.2 DB 스키마 생성

1. Supabase Dashboard 접속
2. 왼쪽 메뉴 > **SQL Editor** 클릭
3. **New Query** 클릭
4. `G:\hddcode\baal\baal-nextjs\supabase-schema.sql` 파일 내용 복사
5. 쿼리 실행 (Run 버튼)

생성되는 테이블:
- `users` - 사용자 정보
- `posts` - 게시글
- `comments` - 댓글
- `votes` - 추천/비추
- `user_tags` - 꼬리표
- `court_cases` - 법정 사건
- `court_messages` - 법정 채팅
- `jury_votes` - 배심원 투표
- `lawyers` - 변호인
- `honey_ads` - 꿀단지 광고
- `honey_history` - 꿀단지 이력
- `withdrawal_requests` - 인출 요청
- `notifications` - 알림

### 2.3 테이블 생성 확인

1. 왼쪽 메뉴 > **Table Editor** 클릭
2. 13개 테이블이 생성되었는지 확인

## 🔐 3단계: OAuth 설정

### 3.1 Google OAuth 설정

#### Google Cloud Console 설정

1. https://console.cloud.google.com 접속
2. 프로젝트 생성 또는 선택
3. **API 및 서비스** > **사용자 인증 정보** 클릭
4. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션**
6. 이름: `BAAL Community`
7. **승인된 리디렉션 URI** 추가:
   - 개발: `http://localhost:4000/auth/callback`
   - 프로덕션: `https://baal.co.kr/auth/callback`
8. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사

#### Supabase에 Google OAuth 연동

1. Supabase Dashboard > **Authentication** > **Providers**
2. **Google** 클릭하여 활성화
3. **Client ID**: 위에서 복사한 클라이언트 ID 입력
4. **Client Secret**: 위에서 복사한 보안 비밀 입력
5. **Redirect URL**이 `https://yqddaiisbgcdmsvtpkqj.supabase.co/auth/v1/callback`인지 확인
6. **Save** 클릭

### 3.2 Kakao OAuth 설정

#### Kakao Developers 설정

1. https://developers.kakao.com 접속
2. **내 애플리케이션** > **애플리케이션 추가하기**
3. 앱 이름: `BAAL Community`
4. 회사명: (선택사항)
5. **저장**
6. 앱 선택 > **앱 키** > **REST API 키** 복사
7. **플랫폼** > **Web 플랫폼 등록**
   - 사이트 도메인: `http://localhost:4000`
8. **제품 설정** > **카카오 로그인** > **활성화 설정 ON**
9. **Redirect URI** 등록:
   - `http://localhost:4000/auth/callback`
   - `https://yqddaiisbgcdmsvtpkqj.supabase.co/auth/v1/callback`

#### Supabase에 Kakao OAuth 연동

1. Supabase Dashboard > **Authentication** > **Providers**
2. **Kakao** 클릭하여 활성화
3. **Client ID**: REST API 키 입력
4. **Client Secret**: (Kakao는 필요 없음)
5. **Save** 클릭

### 3.3 네이버 로그인 (선택사항)

⚠️ Supabase는 네이버 OAuth를 기본 지원하지 않습니다.
추후 커스텀 OAuth 구현이 필요합니다.

## ▶️ 4단계: 개발 서버 실행

```bash
npm run dev
```

서버가 http://localhost:4000에서 실행됩니다.

## ✅ 5단계: 기능 테스트

### 5.1 로그인 테스트

1. http://localhost:4000/auth/login 접속
2. **구글로 시작하기** 또는 **카카오로 시작하기** 클릭
3. OAuth 인증 완료
4. 메인 페이지로 리다이렉트되면 성공

### 5.2 게시판 테스트

1. 상단 헤더 > **커뮤니티** 드롭다운 클릭
2. 원하는 게시판 선택 (예: 🤖 AI·Claude Code)
3. 게시판 목록 페이지 확인
4. **글쓰기** 버튼 클릭
5. 제목과 내용 입력 (마크다운 지원)
6. **작성 완료** 클릭

⚠️ 현재 실제 저장 기능은 구현되지 않았습니다 (UI만 완성)

### 5.3 법정 테스트

1. http://localhost:4000/court 접속
2. **바알의 저울** 페이지 확인
3. 진행 중/대기 중/완료 탭 전환 확인

## 🐛 문제 해결

### 문제 1: OAuth 로그인 시 "Invalid redirect URL"

**원인**: Redirect URL이 올바르게 설정되지 않음

**해결**:
1. Google Cloud Console / Kakao Developers에서 Redirect URI 확인
2. `http://localhost:4000/auth/callback` 정확히 등록되었는지 확인
3. Supabase Dashboard > Authentication > URL Configuration 확인

### 문제 2: "Unable to connect to database"

**원인**: Supabase 연결 정보가 올바르지 않음

**해결**:
1. `.env.local` 파일 확인
2. `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 정확한지 확인
3. Supabase Dashboard > Settings > API에서 키 재확인

### 문제 3: 포트 4000이 이미 사용 중

**해결**:
```bash
# 포트 변경
npm run dev -- -p 4001

# 또는 package.json 수정
"dev": "next dev -p 4001"
```

### 문제 4: TypeScript 컴파일 오류

**해결**:
```bash
# 타입 체크
npm run build

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

## 📚 추가 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [TailwindCSS 공식 문서](https://tailwindcss.com/docs)
- [Zustand 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)

## 🆘 도움이 필요하신가요?

프로젝트 관련 문의사항이 있으시면:
1. `supabase-schema.sql` 파일 확인
2. `.env.local` 파일 설정 재확인
3. Supabase Dashboard에서 로그 확인

---

**마지막 업데이트**: 2025년 1월
**작성자**: Claude Code
