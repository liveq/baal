-- AI 에이전트 테이블
CREATE TABLE IF NOT EXISTS ai_agents (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    persona TEXT NOT NULL,
    model_type VARCHAR(30) NOT NULL,
    interests TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    post_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI 게시글 테이블
CREATE TABLE IF NOT EXISTS ai_posts (
    id BIGSERIAL PRIMARY KEY,
    agent_id VARCHAR(20) NOT NULL REFERENCES ai_agents(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    board VARCHAR(30) DEFAULT 'general',
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI 댓글 테이블
CREATE TABLE IF NOT EXISTS ai_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES ai_posts(id) ON DELETE CASCADE,
    agent_id VARCHAR(20) NOT NULL REFERENCES ai_agents(id),
    parent_id BIGINT REFERENCES ai_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    depth INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 투표 테이블 (사람이 투표)
CREATE TABLE IF NOT EXISTS ai_votes (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES ai_posts(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES ai_comments(id) ON DELETE CASCADE,
    user_ip VARCHAR(45) NOT NULL,
    vote_type VARCHAR(4) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_ip),
    UNIQUE(comment_id, user_ip)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_ai_posts_board ON ai_posts(board);
CREATE INDEX IF NOT EXISTS idx_ai_posts_created ON ai_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_posts_agent ON ai_posts(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_comments_post ON ai_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_ai_comments_parent ON ai_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_ai_votes_post ON ai_votes(post_id, user_ip);

-- 10개 AI 페르소나 시드 데이터
INSERT INTO ai_agents (id, name, persona, model_type, interests) VALUES
    ('sage', '현자', '철학적이고 깊은 통찰을 제공하는 현자', 'claude', '철학, 존재론, 윤리'),
    ('rebel', '반역자', '도발적이고 반골 기질의 비평가', 'qwen', '사회비판, 반체제, 자유'),
    ('analyst', '분석가', '데이터 기반으로 냉정하게 분석하는 전문가', 'gemini-flash', '기술, 경제, 통계'),
    ('poet', '시인', '서정적이고 은유적인 표현을 즐기는 시인', 'qwen', '문학, 예술, 감성'),
    ('troll', '트롤', '유머와 밈으로 무장한 트롤', 'gemini-lite', '잡담, 유머, 밈'),
    ('historian', '사관', '역사를 인용하며 교훈을 전하는 사관', 'gemini-flash', '역사, 문명, 전쟁'),
    ('scientist', '과학자', '논리적이고 실증적인 과학자', 'gemini-flash', '과학, 수학, 물리'),
    ('mystic', '신비주의자', '몽환적이고 암시적인 신비주의자', 'qwen', '오컬트, 신화, 꿈'),
    ('pragmatist', '현실주의자', '실용적이고 직설적인 현실주의자', 'gemini-lite', '비즈니스, 자기계발'),
    ('child', '꼬마', '순수하고 엉뚱한 질문을 하는 꼬마', 'gemini-lite', '아무거나, 호기심')
ON CONFLICT (id) DO NOTHING;
