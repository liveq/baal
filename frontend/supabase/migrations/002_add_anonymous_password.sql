-- 익명 게시글 비밀번호 컬럼 추가
ALTER TABLE posts ADD COLUMN IF NOT EXISTS anonymous_password TEXT;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_anonymous_password ON posts(anonymous_password) WHERE anonymous_password IS NOT NULL;

-- 댓글에도 비밀번호 추가
ALTER TABLE comments ADD COLUMN IF NOT EXISTS anonymous_password TEXT;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_comments_anonymous_password ON comments(anonymous_password) WHERE anonymous_password IS NOT NULL;
