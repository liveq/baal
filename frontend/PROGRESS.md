# BAAL 커뮤니티 개발 진행 상황

## 📅 최종 업데이트: 2025년 1월 4일

---

## ✅ 완료된 작업

### 1. 기본 레이아웃 & 디자인 시스템
- [x] Header 컴포넌트 (고정 위치, fixed positioning)
- [x] MainLayout (헤더 고정을 위한 padding 처리)
- [x] RightSidebar (모든 페이지에 우측 사이드바 통일)
- [x] TailwindCSS 커스텀 컬러 시스템 (baal-gold: #d4af37)
- [x] 반응형 레이아웃 (max-w-[1200px], grid-cols-[1fr_300px])

### 2. 홈페이지
- [x] 실제 Supabase 데이터 연동
- [x] 게시판별 최신 게시글 표시
- [x] 베스트 게시글 (추천 50개 이상)
- [x] 우측 사이드바 (인기글, 통계)

### 3. 게시판 시스템 (완전 구현)
#### 게시판 목록 페이지 (`/board/[type]`)
- [x] 9개 게시판 지원 (AI, 유머, 철학, 오컬트, IT, 하드웨어, 경제, Q&A, 자유)
- [x] 베스트 게시판 (추천 50개 이상 자동 필터링)
- [x] 페이지네이션 (20개씩)
- [x] 실시간 조회수, 댓글 수, 추천/반대 표시

#### 게시글 작성 (`/post/new`)
- [x] **익명 작성 지원** (닉네임 + 비밀번호)
- [x] 로그인 사용자 작성
- [x] 게시판 선택
- [x] 제목/내용 유효성 검사
- [x] bcrypt 비밀번호 해싱 (10 rounds)

#### 게시글 상세 (`/post/[id]`)
- [x] 게시글 본문 표시
- [x] 조회수 자동 증가
- [x] 추천/반대 투표 시스템
- [x] 댓글 시스템 (대댓글 3단계)
- [x] 같은 게시판 다른 글 표시
- [x] 우측 사이드바

#### 게시글 수정 (`/post/[id]/edit`)
- [x] **익명 게시글 비밀번호 검증**
- [x] **댓글 있으면 수정 불가 (국룰)**
- [x] 로그인 사용자 작성자 확인
- [x] 제목/내용만 수정 가능
- [x] 게시판 변경 불가

#### 게시글 삭제
- [x] **익명 게시글 비밀번호 검증**
- [x] 소프트 삭제 (is_deleted = true)
- [x] 댓글 있어도 삭제 가능

### 4. 댓글 시스템
- [x] 댓글 작성 (로그인/익명)
- [x] 대댓글 3단계 지원
- [x] 댓글 투표 (추천/반대)
- [x] 계층 구조 렌더링
- [x] 익명 닉네임 표시

### 5. 투표 시스템
- [x] 게시글 추천/반대
- [x] 댓글 추천/반대
- [x] 토글 기능 (같은 투표 다시 누르면 취소)
- [x] 투표 변경 기능 (추천↔반대)
- [x] 실시간 카운트 업데이트

### 6. 익명 게시글 비밀번호 시스템 ⭐ (오늘 완성)
- [x] 게시글 작성 시 비밀번호 입력 및 해싱
- [x] 비밀번호 검증 API (`/api/posts/[id]/verify-password`)
- [x] PostActionButtons: 익명 게시글 수정/삭제 버튼 표시
- [x] 비밀번호 입력 모달
- [x] 수정 페이지 비밀번호 검증
- [x] **댓글 있으면 수정 불가 (국룰)** - 툴팁 표시
- [x] 삭제는 언제든지 가능
- [x] 데이터베이스 마이그레이션 자동화 (Supabase Management API)

### 7. 데이터베이스
- [x] Supabase 설정 (Project: yqddaiisbgcdmsvtpkqj)
- [x] 13개 테이블 구조
- [x] users, posts, comments, votes, user_tags
- [x] court_cases, court_messages, jury_votes, lawyers
- [x] honey_ads, honey_history, withdrawal_requests, notifications
- [x] **posts.anonymous_password 컬럼 추가**
- [x] **comments.anonymous_password 컬럼 추가**
- [x] 인덱스 최적화

### 8. API 엔드포인트
- [x] GET/POST `/api/posts` - 게시글 목록/작성
- [x] GET/PATCH/DELETE `/api/posts/[id]` - 게시글 조회/수정/삭제
- [x] POST `/api/posts/[id]/verify-password` - 비밀번호 검증
- [x] POST `/api/votes` - 투표 등록
- [x] GET `/api/votes/check` - 투표 확인

### 9. 바알의 저울 (법정) 페이지
- [x] 기본 레이아웃
- [x] 다른 페이지와 통일된 디자인 (max-w-[1200px])
- [x] 우측 사이드바 추가
- [ ] 실제 기능은 미구현 (추후 작업)

---

## 🚧 현재 상태

### 작동하는 기능
- ✅ 게시판 전체 CRUD
- ✅ 익명/로그인 게시글 작성
- ✅ 익명 게시글 비밀번호 보호
- ✅ 댓글 시스템
- ✅ 투표 시스템
- ✅ 댓글 있으면 수정 불가 (국룰)

### 아직 구현 안 된 기능
- ❌ 회원가입/로그인 (이메일)
- ❌ OAuth (Google, Kakao, Naver)
- ❌ 바알의 저울 실제 기능
- ❌ 사용자 프로필
- ❌ 꿀 적립 시스템
- ❌ 검색 기능
- ❌ 알림 시스템
- ❌ 관리자 페이지

---

## 📋 다음 작업 계획

### 1순위: 인증 시스템 구현 🔐
**이유**: 모든 회원 전용 기능의 기반

#### Todo:
1. **이메일 회원가입**
   - [ ] 회원가입 페이지 (`/auth/signup`)
   - [ ] 이메일 중복 체크
   - [ ] 비밀번호 강도 검사
   - [ ] 닉네임 설정
   - [ ] Supabase Auth 연동
   - [ ] 이메일 인증

2. **이메일 로그인**
   - [ ] 로그인 페이지 (`/auth/login`)
   - [ ] Supabase Auth 로그인
   - [ ] 세션 관리
   - [ ] 로그인 상태 전역 관리 (Zustand)
   - [ ] 자동 로그인 (Remember Me)

3. **비밀번호 찾기**
   - [ ] 비밀번호 재설정 페이지
   - [ ] 이메일로 재설정 링크 발송
   - [ ] 재설정 토큰 검증

4. **OAuth 로그인**
   - [ ] Google OAuth
   - [ ] Kakao OAuth
   - [ ] Naver OAuth
   - [ ] Supabase OAuth Provider 설정

5. **프로필 설정**
   - [ ] 프로필 이미지 업로드
   - [ ] 닉네임 변경
   - [ ] 자기소개(bio) 작성
   - [ ] 비밀번호 변경

### 2순위: 바알의 저울 (법정 시스템) ⚖️
**이유**: 사이트의 핵심 차별화 기능

#### Todo:
1. **소송 제기**
   - [ ] 게시글/댓글 신고 버튼
   - [ ] 소송 제기 폼 (원고/피고/사건 내용)
   - [ ] AI 판사 vs 배심원 선택
   - [ ] 소송 접수 API

2. **법정 페이지**
   - [ ] 진행 중인 재판 목록
   - [ ] 재판 상세 페이지
   - [ ] 실시간 채팅 (원고/피고/방청객)
   - [ ] 증거 제출 시스템
   - [ ] 변론 타임라인

3. **AI 판사 시스템**
   - [ ] Claude API 연동
   - [ ] 판결 프롬프트 작성
   - [ ] AI 판결문 생성
   - [ ] 평판(reputation) 차감

4. **배심원 시스템**
   - [ ] 배심원 모집 (평판 높은 사용자)
   - [ ] 투표 시스템
   - [ ] 다수결 판결
   - [ ] 배심원 보상

5. **변호사 시스템**
   - [ ] 변호사 등록
   - [ ] 변호사 프로필 (승률, 전문 분야)
   - [ ] 변호 요청
   - [ ] 변호 수락/거절

### 3순위: 사용자 프로필 & 활동 👤

#### Todo:
- [ ] 마이페이지 (`/profile/[id]`)
- [ ] 내 게시글 목록
- [ ] 내 댓글 목록
- [ ] 평판(reputation) 표시
- [ ] 포인트 내역
- [ ] 법정 참여 이력
- [ ] 사용자 태그 기능 (다른 유저에게 태그 달기)

### 4순위: 꿀 적립 시스템 🍯

#### Todo:
- [ ] 광고 목록 페이지 (`/honey`)
- [ ] 클릭형 광고
- [ ] 영상형 광고 (시청 완료 검증)
- [ ] 설문형 광고
- [ ] GPS 광고 (위치 인증)
- [ ] 일일 적립 한도 관리
- [ ] 포인트 적립 API
- [ ] 출금 신청 페이지
- [ ] 관리자 출금 승인 시스템

### 5순위: 추가 기능

#### Todo:
- [ ] 검색 기능 (제목/내용/작성자)
- [ ] 알림 시스템 (댓글, 답글, 투표, 법정)
- [ ] 실시간 알림 (Supabase Realtime)
- [ ] 관리자 페이지
- [ ] 사용자 차단/정지
- [ ] 게시글/댓글 신고
- [ ] 통계 대시보드

---

## 🗂️ 프로젝트 구조

```
baal-nextjs/
├── app/
│   ├── page.tsx                    # 홈페이지 ✅
│   ├── board/[type]/page.tsx       # 게시판 목록 ✅
│   ├── post/
│   │   ├── [id]/
│   │   │   ├── page.tsx           # 게시글 상세 ✅
│   │   │   └── edit/page.tsx      # 게시글 수정 ✅
│   │   └── new/page.tsx           # 게시글 작성 ✅
│   ├── court/page.tsx             # 바알의 저울 (껍데기만) ⚠️
│   ├── auth/                      # 인증 페이지 ❌ (다음 작업)
│   │   ├── login/
│   │   └── signup/
│   └── api/
│       ├── posts/
│       │   ├── route.ts           # 게시글 API ✅
│       │   └── [id]/
│       │       ├── route.ts       # 게시글 상세 API ✅
│       │       └── verify-password/route.ts ✅
│       └── votes/route.ts         # 투표 API ✅
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # 고정 헤더 ✅
│   │   └── MainLayout.tsx         # 메인 레이아웃 ✅
│   ├── home/
│   │   ├── RightSidebar.tsx       # 우측 사이드바 ✅
│   │   └── BoardSection.tsx       # 게시판 섹션 ✅
│   └── post/
│       ├── PostVoteButtons.tsx    # 투표 버튼 ✅
│       ├── PostActionButtons.tsx  # 수정/삭제 버튼 ✅
│       ├── CommentSection.tsx     # 댓글 섹션 ✅
│       └── EditPostForm.tsx       # 수정 폼 ✅
├── lib/
│   ├── supabase/
│   │   ├── server.ts              # 서버 클라이언트 ✅
│   │   └── client.ts              # 클라이언트 ✅
│   └── utils/
│       └── time.ts                # 시간 포맷 ✅
├── store/
│   └── auth-store.ts              # 인증 상태 관리 (Zustand) ✅
├── types/
│   └── database.ts                # DB 타입 정의 ✅
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql ✅
│       └── 002_add_anonymous_password.sql ✅
└── scripts/
    └── run-migration.js           # 자동 마이그레이션 ✅
```

---

## 🔧 기술 스택

- **Frontend**: Next.js 15.1.4 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: TailwindCSS 3.4.1
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Password Hashing**: bcryptjs
- **AI Integration**: Claude API (예정)

---

## 💾 데이터베이스 정보

### Supabase 프로젝트
- **Project ID**: yqddaiisbgcdmsvtpkqj
- **Database Password**: 1q2w3e4r1!
- **Access Token**: sbp_a9d1f5d99313b2b1d8a4f90f4b698c471f61fe49

### 주요 테이블
- `users` - 사용자 정보
- `posts` - 게시글 (author_id nullable, anonymous_password 포함)
- `comments` - 댓글 (anonymous_password 포함)
- `votes` - 투표 기록
- `court_cases` - 법정 사건
- `court_messages` - 법정 메시지
- `jury_votes` - 배심원 투표
- `lawyers` - 변호사 정보
- `honey_ads` - 꿀 광고
- `honey_history` - 꿀 적립 이력
- `withdrawal_requests` - 출금 신청
- `notifications` - 알림

---

## 📝 개발 가이드

### 마이그레이션 실행
```bash
node scripts/run-migration.js
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

---

## 🎯 다음 세션 시작할 때

1. **인증 시스템부터 시작 추천**
   - 회원가입/로그인 페이지 구현
   - Supabase Auth 연동
   - OAuth 설정

2. **또는 바알의 저울 먼저**
   - 소송 제기 기능
   - AI 판사 Claude API 연동
   - 실시간 채팅

3. **테스트 해볼 것**
   - 익명 게시글 작성 → 비밀번호로 수정/삭제
   - 댓글 달기 → 수정 버튼 비활성화 확인
   - 투표 시스템

---

## 💡 참고사항

### 커뮤니티 국룰 적용됨
- ✅ 댓글 있으면 수정 불가 (삭제는 가능)
- ✅ 익명 게시글 비밀번호 보호
- ✅ 게시판 변경 불가
- ✅ 소프트 삭제 (복구 가능)

### 보안
- bcrypt 해싱 (10 rounds)
- Supabase RLS (Row Level Security)
- CSRF 보호 (Next.js 내장)

### 성능 최적화
- 서버 컴포넌트 활용
- 데이터베이스 인덱스
- 페이지네이션

---

**마지막 업데이트**: 2025-01-04 (익명 게시글 비밀번호 시스템 완성)
**다음 작업**: 인증 시스템 구현

좋은 밤 되세요! 🌙
