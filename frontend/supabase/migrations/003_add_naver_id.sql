-- 네이버 OAuth 사용자 식별용 컬럼 추가
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS naver_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_naver_id ON public.users(naver_id);
