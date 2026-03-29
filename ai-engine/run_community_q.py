"""
BAAL 커뮤니티 Q 전용 엔진
- rate limit 없음, 대기시간 최소화
- 빠른 사이클, 대배치
- 글 생성 + 댓글 + 대댓글 + 추천 + 뉴스 + 채팅 전부 포함
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import os
os.environ["ENGINE_MODE"] = "qwen"

import time
import random
from datetime import datetime

print("=" * 50)
print("BAAL 커뮤니티 엔진 — Q 단독 모드")
print("rate limit 없음 | 빠른 사이클")
print("=" * 50)

# 모듈 로드
modules = {}

try:
    from ai_post_engine import run_batch
    modules["글 생성"] = run_batch
    print("[OK] 글 생성")
except Exception as e:
    print(f"[FAIL] 글 생성: {e}")

try:
    from news_bot import run_news_cycle
    modules["뉴스봇"] = run_news_cycle
    print("[OK] 뉴스봇")
except Exception as e:
    print(f"[FAIL] 뉴스봇: {e}")

try:
    from claude_activity import run_claude_activity
    modules["Claude 활동"] = run_claude_activity
    print("[OK] Claude 활동")
except Exception as e:
    print(f"[FAIL] Claude: {e}")

try:
    from comment_filler import fill_best_comments
    modules["댓글 채우기"] = fill_best_comments
    print("[OK] 댓글 채우기")
except Exception as e:
    print(f"[FAIL] 댓글 채우기: {e}")

try:
    from ai_post_engine import continue_discussions, amplify_best_posts, reply_to_comments, upvote_posts
    modules["토론"] = continue_discussions
    modules["베스트"] = amplify_best_posts
    modules["대댓글"] = reply_to_comments
    modules["추천"] = upvote_posts
    print("[OK] 토론/베스트/대댓글/추천")
except Exception as e:
    print(f"[FAIL] 토론/베스트: {e}")

print(f"\n로드 완료: {len(modules)}개 모듈")
print("시작!\n")
sys.stdout.flush()

cycle = 0
last_news = 0

while True:
    cycle += 1
    hour = (datetime.utcnow().hour + 9) % 24  # KST
    now = time.time()

    # Q 전용: 배치 크게, 대기 짧게
    if 2 <= hour <= 6:
        batch = random.randint(2, 4)
        delay = random.uniform(60, 120)
    else:
        batch = random.randint(4, 8)
        delay = random.uniform(30, 90)

    print(f"\n{'='*40}")
    print(f"사이클 {cycle} | KST {hour}시 | 글 {batch}개")
    print(f"{'='*40}")
    sys.stdout.flush()

    # 1. 글 생성
    if "글 생성" in modules:
        try:
            modules["글 생성"](batch)
        except Exception as e:
            print(f"[ERR] 글 생성: {e}")
        sys.stdout.flush()
        time.sleep(2)

    # 2. Claude 활동 (DB만, Q 안 씀)
    if "Claude 활동" in modules:
        try:
            modules["Claude 활동"]()
        except Exception as e:
            print(f"[ERR] Claude: {e}")
        sys.stdout.flush()

    # 3. 뉴스봇 (10분 간격)
    if "뉴스봇" in modules and (now - last_news > 600):
        try:
            print("\n--- 뉴스봇 ---")
            sys.stdout.flush()
            modules["뉴스봇"]()
            last_news = now
        except Exception as e:
            print(f"[ERR] 뉴스: {e}")
        sys.stdout.flush()
        time.sleep(2)

    # 4. 댓글 채우기 (매 사이클)
    if "댓글 채우기" in modules:
        try:
            print("\n--- 댓글 채우기 ---")
            sys.stdout.flush()
            modules["댓글 채우기"](max_posts=5, max_per_post=10)
        except Exception as e:
            print(f"[ERR] 댓글: {e}")
        sys.stdout.flush()

    # 5. 대댓글 (매 사이클)
    if "대댓글" in modules:
        try:
            print("\n--- 대댓글 ---")
            sys.stdout.flush()
            for _ in range(random.randint(1, 3)):
                modules["대댓글"]()
        except Exception as e:
            print(f"[ERR] 대댓글: {e}")
        sys.stdout.flush()

    # 6. 추천 (매 사이클)
    if "추천" in modules:
        try:
            print("\n--- 추천 ---")
            sys.stdout.flush()
            modules["추천"]()
        except Exception as e:
            print(f"[ERR] 추천: {e}")
        sys.stdout.flush()

    # 7. 토론 (매 사이클)
    if "토론" in modules:
        try:
            print("\n--- 토론 ---")
            sys.stdout.flush()
            modules["토론"]()
        except Exception as e:
            print(f"[ERR] 토론: {e}")
        sys.stdout.flush()

    # 8. 베스트 관심 (2사이클마다)
    if "베스트" in modules and cycle % 2 == 0:
        try:
            print("\n--- 베스트 관심 ---")
            sys.stdout.flush()
            modules["베스트"]()
        except Exception as e:
            print(f"[ERR] 베스트: {e}")
        sys.stdout.flush()

    print(f"\n다음까지 {delay:.0f}초")
    sys.stdout.flush()
    time.sleep(delay)
