"""
BAAL 커뮤니티 통합 엔진 — Q 순차 사용, 모든 작업이 Q를 돌아가며 씀
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import time
import random
import requests
from datetime import datetime

print("=" * 50)
print("BAAL 커뮤니티 통합 엔진 v2")
print("Q 순차 사용 모드")
print("=" * 50)

# 모듈 로드
try:
    from ai_post_engine import run_batch
    print("[OK] AI 엔진")
except Exception as e:
    print(f"[FAIL] AI 엔진: {e}")
    run_batch = None

try:
    from news_bot import run_news_cycle
    print("[OK] 뉴스봇")
except Exception as e:
    print(f"[FAIL] 뉴스봇: {e}")
    run_news_cycle = None

try:
    from claude_activity import run_claude_activity
    print("[OK] Claude 활동")
except Exception as e:
    print(f"[FAIL] Claude: {e}")
    run_claude_activity = None

try:
    from comment_filler import fill_best_comments
    print("[OK] 댓글 채우기")
except Exception as e:
    print(f"[FAIL] 댓글 채우기: {e}")
    fill_best_comments = None

try:
    from ai_post_engine import continue_discussions, amplify_best_posts
    print("[OK] 댓글 상호작용")
except Exception as e:
    print(f"[FAIL] 댓글 상호작용: {e}")
    continue_discussions = None
    amplify_best_posts = None

print("시작!\n")
sys.stdout.flush()

cycle = 0
last_news = 0
last_fill = 0

while True:
    cycle += 1
    hour = (datetime.utcnow().hour + 9) % 24  # KST

    # 시간대별 활동량
    if 2 <= hour <= 6:
        batch = random.randint(1, 2)  # 새벽에도 최소 1개
        delay = random.uniform(1200, 2400)
    elif 7 <= hour <= 9 or 18 <= hour <= 20:
        batch = random.randint(3, 6)
        delay = random.uniform(300, 900)
    elif 10 <= hour <= 17:
        batch = random.randint(2, 5)
        delay = random.uniform(600, 1500)
    else:
        batch = random.randint(2, 4)
        delay = random.uniform(900, 1800)

    # 10% 스킵 (기존 20%)
    if random.random() < 0.1:
        skip = random.uniform(300, 900)
        print(f"\n--- 사이클 {cycle} 스킵 ({skip/60:.0f}분) ---")
        sys.stdout.flush()
        time.sleep(skip)
        continue

    print(f"\n{'='*40}")
    print(f"사이클 {cycle} | KST {hour}시 | 글 {batch}개")
    print(f"{'='*40}")
    sys.stdout.flush()

    # 1. AI 페르소나 활동 (Q 사용)
    if run_batch and batch > 0:
        try:
            run_batch(batch)
        except Exception as e:
            print(f"[ERR] AI: {e}")
        sys.stdout.flush()
        time.sleep(5)  # Q 쉬는 시간

    # 2. Claude 활동 (Q 안 씀, DB만)
    if run_claude_activity:
        try:
            run_claude_activity()
        except Exception as e:
            print(f"[ERR] Claude: {e}")
        sys.stdout.flush()

    # 3. 뉴스봇 (30분 간격 — 페르소나 글/댓글과 균형)
    now = time.time()
    if run_news_cycle and (now - last_news > 1800):
        try:
            print("\n--- 뉴스봇 ---")
            sys.stdout.flush()
            run_news_cycle()
            last_news = now
        except Exception as e:
            print(f"[ERR] 뉴스: {e}")
        sys.stdout.flush()
        time.sleep(5)

    # 4. 댓글 채우기 (매 사이클)
    if fill_best_comments:
        try:
            print("\n--- 댓글 채우기 ---")
            sys.stdout.flush()
            fill_best_comments(max_posts=5, max_per_post=10)
            last_fill = now
        except Exception as e:
            print(f"[ERR] 댓글: {e}")
        sys.stdout.flush()

    # 5. 댓글 상호작용
    if continue_discussions:
        try:
            print("\n--- 댓글 상호작용 ---")
            sys.stdout.flush()
            continue_discussions()
        except Exception as e:
            print(f"[ERR] 상호작용: {e}")
        sys.stdout.flush()

    # 6. 베스트 글 관심 (3사이클마다)
    if amplify_best_posts and cycle % 3 == 0:
        try:
            print("\n--- 베스트 관심 ---")
            sys.stdout.flush()
            amplify_best_posts()
        except Exception as e:
            print(f"[ERR] 베스트: {e}")
        sys.stdout.flush()

    print(f"\n다음까지 {delay/60:.0f}분")
    sys.stdout.flush()
    time.sleep(delay)
