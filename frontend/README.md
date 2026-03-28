# BAAL - 커뮤니티 법정 시스템

바알(BAAL)은 AI 판사와 배심원 시스템을 갖춘 혁신적인 커뮤니티 플랫폼입니다.

## 🎯 프로젝트 현황

**개발 서버**: http://localhost:4000

### ✅ 완료된 기능
- ✅ Next.js 15.1.4 프로젝트 초기화
- ✅ Supabase 연동 및 환경변수 설정
- ✅ TailwindCSS 화이트골드 톤 테마
- ✅ 프로젝트 폴더 구조 전체 생성
- ✅ DB 스키마 전체 설계 (13개 테이블)
- ✅ v5-4.html 디자인 컴포넌트화
- ✅ OAuth 로그인 UI (구글, 카카오)
- ✅ 라우팅 구조 생성 (게시판, 게시글, 글쓰기, 법정)
- ✅ 공통 유틸리티 함수 (format, validation)

### 🚧 구현 대기 중
- ⏳ Supabase 실제 데이터 연동
- ⏳ 마크다운 렌더링 (marked.js)
- ⏳ 무한 스크롤 (게시판 목록)
- ⏳ 실시간 댓글 시스템
- ⏳ 바알의 저울 실시간 채팅
- ⏳ AI 판사 / 배심원 시스템
- ⏳ 꿀단지 광고 시스템
- ⏳ 이미지 업로드 (Supabase Storage)

## 📋 주요 기능

### 커뮤니티 게시판 (9개)
- 🤖 AI·Claude Code
- 😂 유머
- 🧠 철학
- 🔮 오컬트·영성
- 💻 IT 정보
- 🖥️ 중고 하드웨어
- 💰 경제
- ❓ 질문·답변
- ✏️ 자유

### ⚖️ 바알의 저울 (법정 시스템)
- 실시간 공개 법정
- 게시글/댓글 삭제/수정 불가 (증거 보전)
- AI 판사 vs 배심원 투표
- 변호인 시스템
- 실시간 관전 모드 (팝콘 모드)

### 🍯 꿀단지 (리워드 시스템)
- 광고 시청으로 포인트 적립
- 평판(명예) ≠ 포인트(현금) 분리
- 4가지 광고 타입 (클릭 1P, 영상 3P, 설문 10P, GPS 50P)
- 최소 인출 5,000P (수수료 500원)

## 🛠 기술 스택

- **Framework**: Next.js 15.1.4 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: TailwindCSS 3.4.1
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (OAuth: Google, Kakao)
- **Realtime**: Supabase Realtime
- **State**: Zustand 4.5.0
- **Markdown**: marked 12.0.0
- **Date**: date-fns 3.3.1

## 🚀 개발 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일이 이미 생성되어 있습니다. (Git 제외됨)

### 3. Supabase 설정
**중요**: Supabase Dashboard에서 다음 작업을 수행해야 합니다:

#### DB 스키마 생성
```bash
# G:\hddcode\baal\baal-nextjs\supabase-schema.sql 파일을
# Supabase Dashboard > SQL Editor에서 실행
```

#### OAuth 설정
1. **Google OAuth**
   - Google Cloud Console에서 OAuth 클라이언트 생성
   - Supabase Dashboard > Authentication > Providers > Google 활성화
   - Redirect URL: `http://localhost:4000/auth/callback`

2. **Kakao OAuth**
   - Kakao Developers에서 앱 생성 및 REST API 키 발급
   - Supabase Dashboard > Authentication > Providers > Kakao 활성화
   - Redirect URL: `http://localhost:4000/auth/callback`

### 4. 개발 서버 실행
```bash
npm run dev
```

서버 실행 후 http://localhost:4000에서 확인할 수 있습니다.

## 📁 프로젝트 구조

```
baal-nextjs/
├── app/                         # Next.js App Router
│   ├── auth/
│   │   ├── login/page.tsx      # 로그인 페이지
│   │   └── callback/route.ts   # OAuth 콜백
│   ├── board/[type]/page.tsx   # 게시판 목록
│   ├── post/[id]/page.tsx      # 게시글 상세
│   ├── write/page.tsx          # 글쓰기
│   ├── court/page.tsx          # 바알의 저울
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 페이지
│   └── globals.css             # 전역 스타일
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 헤더 (로그인 상태 표시)
│   │   ├── Sidebar.tsx         # 사이드바 (게시판, 키워드)
│   │   ├── HamburgerButton.tsx # 햄버거 메뉴 버튼
│   │   └── MainLayout.tsx      # 메인 레이아웃
│   └── auth/
│       ├── AuthProvider.tsx    # 인증 상태 Provider
│       └── LoginButton.tsx     # 소셜 로그인 버튼
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 클라이언트 Supabase
│   │   ├── server.ts           # 서버 Supabase
│   │   └── middleware.ts       # 미들웨어 Supabase
│   ├── auth/
│   │   └── auth-helpers.ts     # 인증 헬퍼 함수
│   ├── constants/
│   │   └── boards.ts           # 게시판 설정
│   └── utils/
│       ├── format.ts           # 포맷팅 유틸
│       ├── validation.ts       # 유효성 검사
│       └── cn.ts               # 클래스명 병합
│
├── store/
│   └── auth-store.ts           # 인증 상태 관리 (Zustand)
│
├── types/
│   ├── index.ts                # 공통 타입
│   └── database.ts             # Supabase DB 타입
│
├── supabase-schema.sql         # DB 스키마 (Supabase에서 실행)
├── .env.local                  # 환경변수 (Git 제외)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 디자인 시스템

### 화이트골드 톤 컬러
```css
white-gold-50:  #fafaf8  /* 메인 배경 */
white-gold-100: #f5f5f0
white-gold-200: #ebebde
white-gold-300: #e0e0cc
white-gold-400: #d4d4b9
white-gold-500: #c9b896  /* 강조 배경, 호버 */
white-gold-600: #b39f7a
white-gold-700: #8a7a5f  /* 버튼, 텍스트 */
white-gold-800: #6e614d
white-gold-900: #52483a
```

### 평판 등급 컬러
- 💩 쓰레기통: -100 ~ 0 (회색)
- 🥉 브론즈: 0 ~ 500 (구리색)
- 🥈 실버: 500 ~ 2,000 (은색)
- 🥇 골드: 2,000 ~ 5,000 (금색)
- 💎 다이아: 5,000+ (청록색)

## 📍 주요 페이지

| URL | 설명 | 상태 |
|-----|------|------|
| `/` | 메인 페이지 | ✅ |
| `/auth/login` | 로그인 | ✅ |
| `/board/ai` | AI 게시판 | ✅ |
| `/board/humor` | 유머 게시판 | ✅ |
| `/post/[id]` | 게시글 상세 | ✅ |
| `/write` | 글쓰기 | ✅ |
| `/court` | 바알의 저울 | ✅ |

## ⚠️ 중요 사항

### 보안
- `.env.local` 파일은 **절대 Git에 커밋 금지**
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용
- OAuth Redirect URL은 프로덕션 배포 시 변경 필요

### 데이터베이스
- `supabase-schema.sql` 실행 후 13개 테이블 생성 확인
- RLS (Row Level Security) 정책이 자동으로 적용됨
- 트리거로 `updated_at` 자동 업데이트

### OAuth 연동
- 현재 UI만 구현됨 (실제 연동 필요)
- 네이버 로그인은 Supabase 미지원 (커스텀 구현 필요)

## 📝 다음 단계

1. **Supabase 실제 연동**
   - 게시글 CRUD
   - 댓글 시스템
   - 투표 기능

2. **마크다운 렌더링**
   - marked.js 통합
   - 코드 하이라이팅

3. **실시간 기능**
   - Supabase Realtime로 법정 채팅
   - 실시간 댓글 업데이트

4. **이미지 업로드**
   - Supabase Storage 연동
   - 썸네일 생성

5. **AI 판사 시스템**
   - Claude API 연동
   - 판결 로직 구현

## 📄 라이선스

Private Project - All Rights Reserved

---

**개발자**: Claude Code와 함께 개발됨
**개발 시작**: 2025년 1월
**현재 버전**: v0.1.0 (Initial Setup)
