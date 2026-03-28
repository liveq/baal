-- BAAL Community Database Schema
-- 익명 게시 지원 + OAuth 인증 지원

-- Enable UUID extension


-- =====================================================
-- 1. Users Table (Supabase Auth와 연동)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  reputation INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  bio TEXT,
  is_banned BOOLEAN DEFAULT FALSE,
  banned_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. Posts Table (익명 게시 지원)
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_type TEXT NOT NULL CHECK (board_type IN ('ai', 'humor', 'philosophy', 'occult', 'it', 'hardware', 'economy', 'qna', 'free')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL이면 익명
  author_nickname TEXT, -- 익명일 경우 "익명123" 저장
  view_count INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_court_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. Comments Table (익명 댓글 지원)
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL이면 익명
  author_nickname TEXT, -- 익명일 경우 "익명456" 저장
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_court_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. Votes Table (추천/반대 투표)
-- =====================================================
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- =====================================================
-- 5. User Tags Table (사용자 태그)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tagged_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  color TEXT DEFAULT '#666666',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tagged_user_id)
);

-- =====================================================
-- 6. Court Cases Table (바알의 저울)
-- =====================================================
CREATE TABLE IF NOT EXISTS court_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plaintiff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  defendant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  comment_id UUID REFERENCES comments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'judging', 'completed')),
  judge_type TEXT DEFAULT 'ai' CHECK (judge_type IN ('ai', 'jury')),
  verdict TEXT CHECK (verdict IN ('plaintiff_win', 'defendant_win', 'draw')),
  penalty_reputation INTEGER DEFAULT 0,
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- 7. Court Messages Table (법정 채팅)
-- =====================================================
CREATE TABLE IF NOT EXISTS court_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES court_cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'evidence', 'argument')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. Jury Votes Table (배심원 투표)
-- =====================================================
CREATE TABLE IF NOT EXISTS jury_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES court_cases(id) ON DELETE CASCADE,
  juror_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL CHECK (verdict IN ('plaintiff_win', 'defendant_win')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(case_id, juror_id)
);

-- =====================================================
-- 9. Lawyers Table (변호사)
-- =====================================================
CREATE TABLE IF NOT EXISTS lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_cases INTEGER DEFAULT 0,
  won_cases INTEGER DEFAULT 0,
  lost_cases INTEGER DEFAULT 0,
  win_rate NUMERIC(5,2) DEFAULT 0.00,
  specialization TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. Honey Ads Table (꿀단지 광고)
-- =====================================================
CREATE TABLE IF NOT EXISTS honey_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_type TEXT NOT NULL CHECK (ad_type IN ('click', 'video', 'survey', 'gps')),
  title TEXT NOT NULL,
  description TEXT,
  reward_points INTEGER NOT NULL,
  duration INTEGER, -- 영상 길이(초) 또는 서베이 예상 소요시간
  url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  daily_limit INTEGER, -- 하루 최대 완료 가능 횟수
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. Honey History Table (꿀단지 이력)
-- =====================================================
CREATE TABLE IF NOT EXISTS honey_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES honey_ads(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. Withdrawal Requests Table (출금 신청)
-- =====================================================
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  fee INTEGER DEFAULT 0,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- 13. Notifications Table (알림)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment', 'reply', 'vote', 'court', 'point', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_posts_board_type ON posts(board_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_target ON votes(user_id, target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_honey_history_user_id ON honey_history(user_id);

-- =====================================================
-- Triggers for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_tags_updated_at BEFORE UPDATE ON user_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER court_cases_updated_at BEFORE UPDATE ON court_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER lawyers_updated_at BEFORE UPDATE ON lawyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER honey_ads_updated_at BEFORE UPDATE ON honey_ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE jury_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE honey_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE honey_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users: 모두 읽기 가능, 자신만 수정 가능
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Posts: 모두 읽기/쓰기 가능 (익명 지원)
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (NOT is_deleted OR author_id = auth.uid());
CREATE POLICY "Anyone can create posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update own posts" ON posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete own posts" ON posts FOR DELETE USING (author_id = auth.uid());

-- Comments: 모두 읽기/쓰기 가능 (익명 지원)
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (NOT is_deleted OR author_id = auth.uid());
CREATE POLICY "Anyone can create comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update own comments" ON comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete own comments" ON comments FOR DELETE USING (author_id = auth.uid());

-- Votes: 로그인 사용자만 투표 가능
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON votes FOR DELETE USING (auth.uid() = user_id);

-- User Tags: 자신의 태그만 조회/수정 가능
CREATE POLICY "Users can view own tags" ON user_tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tags" ON user_tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON user_tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON user_tags FOR DELETE USING (auth.uid() = user_id);

-- Court Cases: 참여자만 조회 가능
CREATE POLICY "Court cases viewable by participants" ON court_cases FOR SELECT
  USING (auth.uid() IN (plaintiff_id, defendant_id) OR status = 'completed');
CREATE POLICY "Users can create court cases" ON court_cases FOR INSERT WITH CHECK (auth.uid() = plaintiff_id);

-- Court Messages: 해당 케이스 참여자만 조회/작성 가능
CREATE POLICY "Court messages viewable by case participants" ON court_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM court_cases
    WHERE id = case_id AND auth.uid() IN (plaintiff_id, defendant_id)
  ));
CREATE POLICY "Case participants can send messages" ON court_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM court_cases
    WHERE id = case_id AND auth.uid() IN (plaintiff_id, defendant_id)
  ));

-- Jury Votes: 배심원만 투표 가능
CREATE POLICY "Jury votes viewable by all" ON jury_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote as jury" ON jury_votes FOR INSERT
  WITH CHECK (auth.uid() = juror_id);

-- Lawyers: 모두 읽기 가능
CREATE POLICY "Lawyers viewable by all" ON lawyers FOR SELECT USING (true);
CREATE POLICY "Users can create lawyer profile" ON lawyers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lawyers can update own profile" ON lawyers FOR UPDATE USING (auth.uid() = user_id);

-- Honey Ads: 모두 읽기 가능
CREATE POLICY "Active ads viewable by all" ON honey_ads FOR SELECT USING (is_active = true);

-- Honey History: 자신의 이력만 조회 가능
CREATE POLICY "Users can view own honey history" ON honey_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create honey history" ON honey_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawal Requests: 자신의 요청만 조회/생성 가능
CREATE POLICY "Users can view own withdrawal requests" ON withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create withdrawal requests" ON withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: 자신의 알림만 조회/수정 가능
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- Functions
-- =====================================================

-- 익명 닉네임 생성 함수 (예: "익명123")
CREATE OR REPLACE FUNCTION generate_anonymous_nickname()
RETURNS TEXT AS $$
BEGIN
  RETURN '익명' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- 게시글 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_post_views(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Sample Data (Optional)
-- =====================================================

-- 샘플 익명 게시글 (테스트용)
INSERT INTO posts (board_type, title, content, author_nickname) VALUES
('ai', 'Claude Code Agentic Mode 사용 후기', '정말 유용하네요! 코딩이 훨씬 빨라졌어요.', '익명101'),
('ai', 'MCP 서버 설정 방법 정리', 'MCP 서버 설정하는 법을 정리해봤습니다.', '익명202'),
('philosophy', '칸트의 정언명령 쉽게 설명해주세요', '철학 초보인데 이해하기 어렵네요.', '익명111'),
('occult', '타로 초보인데 어떤 덱 추천하시나요?', '처음 시작하는데 추천 부탁드립니다.', '익명555'),
('humor', 'GPT한테 물어봤더니 웃긴 답변ㅋㅋㅋ', 'ㅋㅋㅋㅋ진짜 웃겨서 공유합니다', '익명701')
ON CONFLICT DO NOTHING;
