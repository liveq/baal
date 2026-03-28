-- BAAL 커뮤니티 법정 시스템 - 전체 DB 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- ============================================
-- 1. Users 테이블 (사용자 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  reputation INTEGER DEFAULT 0,  -- 평판 (명예)
  points INTEGER DEFAULT 0,      -- 포인트 (현금)
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  bio TEXT,
  is_banned BOOLEAN DEFAULT FALSE,
  banned_until TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON public.users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON public.users(reputation DESC);

-- ============================================
-- 2. Posts 테이블 (게시글)
-- ============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_type TEXT NOT NULL CHECK (board_type IN ('ai', 'humor', 'philosophy', 'occult', 'it', 'hardware', 'economy', 'qna', 'free')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_court_locked BOOLEAN DEFAULT FALSE,  -- 바알의 저울 게시글은 삭제/수정 불가
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_board_type ON public.posts(board_type);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_upvotes ON public.posts(upvotes DESC);

-- ============================================
-- 3. Comments 테이블 (댓글)
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,  -- 대댓글
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_court_locked BOOLEAN DEFAULT FALSE,  -- 바알의 저울 댓글은 삭제/수정 불가
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments 인덱스
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at ASC);

-- ============================================
-- 4. Votes 테이블 (추천/비추 기록)
-- ============================================
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)  -- 한 사용자는 같은 대상에 한 번만 투표
);

-- Votes 인덱스
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_target ON public.votes(target_type, target_id);

-- ============================================
-- 5. User Tags 테이블 (사용자 꼬리표)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,  -- 태그를 단 사람
  tagged_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,  -- 태그가 달린 사람
  tag TEXT NOT NULL,
  color TEXT DEFAULT '#c9b896',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tagged_user_id)  -- 한 사용자는 다른 사용자에게 하나의 태그만
);

-- User Tags 인덱스
CREATE INDEX IF NOT EXISTS idx_user_tags_tagged_user ON public.user_tags(tagged_user_id);

-- ============================================
-- 6. Court Cases 테이블 (법정 사건)
-- ============================================
CREATE TABLE IF NOT EXISTS public.court_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plaintiff_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,  -- 원고
  defendant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,  -- 피고
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,  -- 원인 게시글
  comment_id UUID REFERENCES public.comments(id) ON DELETE SET NULL,  -- 원인 댓글
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'judging', 'completed')),
  judge_type TEXT DEFAULT 'ai' CHECK (judge_type IN ('ai', 'jury')),
  verdict TEXT CHECK (verdict IN ('plaintiff_win', 'defendant_win', 'draw')),
  penalty_reputation INTEGER DEFAULT 0,  -- 평판 감소 벌칙
  ai_reasoning TEXT,  -- AI 판사의 판결 이유
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Court Cases 인덱스
CREATE INDEX IF NOT EXISTS idx_court_cases_plaintiff ON public.court_cases(plaintiff_id);
CREATE INDEX IF NOT EXISTS idx_court_cases_defendant ON public.court_cases(defendant_id);
CREATE INDEX IF NOT EXISTS idx_court_cases_status ON public.court_cases(status);
CREATE INDEX IF NOT EXISTS idx_court_cases_created_at ON public.court_cases(created_at DESC);

-- ============================================
-- 7. Court Messages 테이블 (법정 채팅)
-- ============================================
CREATE TABLE IF NOT EXISTS public.court_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.court_cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'evidence', 'argument')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Court Messages 인덱스
CREATE INDEX IF NOT EXISTS idx_court_messages_case_id ON public.court_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_court_messages_created_at ON public.court_messages(created_at ASC);

-- ============================================
-- 8. Jury Votes 테이블 (배심원 투표)
-- ============================================
CREATE TABLE IF NOT EXISTS public.jury_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.court_cases(id) ON DELETE CASCADE,
  juror_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL CHECK (verdict IN ('plaintiff_win', 'defendant_win')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(case_id, juror_id)  -- 한 배심원은 한 사건에 한 번만 투표
);

-- Jury Votes 인덱스
CREATE INDEX IF NOT EXISTS idx_jury_votes_case_id ON public.jury_votes(case_id);

-- ============================================
-- 9. Lawyers 테이블 (변호인)
-- ============================================
CREATE TABLE IF NOT EXISTS public.lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_cases INTEGER DEFAULT 0,
  won_cases INTEGER DEFAULT 0,
  lost_cases INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0.00,
  specialization TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lawyers 인덱스
CREATE INDEX IF NOT EXISTS idx_lawyers_user_id ON public.lawyers(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyers_win_rate ON public.lawyers(win_rate DESC);

-- ============================================
-- 10. Honey Ads 테이블 (꿀단지 광고)
-- ============================================
CREATE TABLE IF NOT EXISTS public.honey_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_type TEXT NOT NULL CHECK (ad_type IN ('click', 'video', 'survey', 'gps')),
  title TEXT NOT NULL,
  description TEXT,
  reward_points INTEGER NOT NULL,  -- 지급 포인트
  duration INTEGER,  -- 초 단위 (비디오의 경우)
  url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  daily_limit INTEGER,  -- 일일 제한 (null이면 무제한)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Honey Ads 인덱스
CREATE INDEX IF NOT EXISTS idx_honey_ads_ad_type ON public.honey_ads(ad_type);
CREATE INDEX IF NOT EXISTS idx_honey_ads_is_active ON public.honey_ads(is_active);

-- ============================================
-- 11. Honey History 테이블 (꿀단지 이력)
-- ============================================
CREATE TABLE IF NOT EXISTS public.honey_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.honey_ads(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  ip_address INET,  -- 부정 방지용
  user_agent TEXT,  -- 부정 방지용
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Honey History 인덱스
CREATE INDEX IF NOT EXISTS idx_honey_history_user_id ON public.honey_history(user_id);
CREATE INDEX IF NOT EXISTS idx_honey_history_completed_at ON public.honey_history(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_honey_history_ip ON public.honey_history(ip_address, completed_at);

-- ============================================
-- 12. Withdrawal Requests 테이블 (인출 요청)
-- ============================================
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,  -- 인출 금액 (포인트)
  fee INTEGER DEFAULT 500,  -- 수수료
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Withdrawal Requests 인덱스
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON public.withdrawal_requests(created_at DESC);

-- ============================================
-- 13. Notifications 테이블 (알림)
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment', 'reply', 'vote', 'court', 'point', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications 인덱스
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================
-- 트리거: updated_at 자동 업데이트
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Users 트리거
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Posts 트리거
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments 트리거
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User Tags 트리거
CREATE TRIGGER update_user_tags_updated_at BEFORE UPDATE ON public.user_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Court Cases 트리거
CREATE TRIGGER update_court_cases_updated_at BEFORE UPDATE ON public.court_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lawyers 트리거
CREATE TRIGGER update_lawyers_updated_at BEFORE UPDATE ON public.lawyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Honey Ads 트리거
CREATE TRIGGER update_honey_ads_updated_at BEFORE UPDATE ON public.honey_ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Withdrawal Requests 트리거
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 정책
-- ============================================

-- Users 테이블 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Posts 테이블 RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (NOT is_deleted OR author_id = auth.uid());

CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (author_id = auth.uid() AND NOT is_court_locked);

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (author_id = auth.uid() AND NOT is_court_locked);

-- Comments 테이블 RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (NOT is_deleted OR author_id = auth.uid());

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (author_id = auth.uid() AND NOT is_court_locked);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (author_id = auth.uid() AND NOT is_court_locked);

-- Votes 테이블 RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by owner" ON public.votes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can vote" ON public.votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User Tags 테이블 RLS
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User tags are viewable by everyone" ON public.user_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can create tags" ON public.user_tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON public.user_tags
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tags" ON public.user_tags
  FOR DELETE USING (user_id = auth.uid());

-- Court Cases 테이블 RLS
ALTER TABLE public.court_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Court cases are viewable by everyone" ON public.court_cases
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create court cases" ON public.court_cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Court Messages 테이블 RLS
ALTER TABLE public.court_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Court messages are viewable by everyone" ON public.court_messages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send court messages" ON public.court_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Jury Votes 테이블 RLS
ALTER TABLE public.jury_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jury votes are viewable after case completion" ON public.jury_votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.court_cases
      WHERE id = case_id AND status = 'completed'
    )
  );

CREATE POLICY "Authenticated users can vote as jury" ON public.jury_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Lawyers 테이블 RLS
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lawyers are viewable by everyone" ON public.lawyers
  FOR SELECT USING (true);

CREATE POLICY "Users can register as lawyer" ON public.lawyers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications 테이블 RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- 초기 데이터 (Optional)
-- ============================================

-- 기본 광고 데이터 (꿀단지)
INSERT INTO public.honey_ads (ad_type, title, description, reward_points, duration, is_active) VALUES
  ('click', '1P 광고 클릭', '간단한 광고 클릭으로 1포인트 획득', 1, NULL, true),
  ('video', '3P 광고 영상 시청', '15초 광고 영상 시청으로 3포인트 획득', 3, 15, true),
  ('survey', '10P 설문조사', '간단한 설문조사 참여로 10포인트 획득', 10, NULL, true),
  ('gps', '50P GPS 방문 인증', 'GPS로 특정 장소 방문 인증 후 50포인트 획득', 50, NULL, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 완료!
-- ============================================
-- 이 스크립트를 Supabase Dashboard > SQL Editor에서 실행하세요.
-- 모든 테이블, 인덱스, 트리거, RLS 정책이 생성됩니다.
