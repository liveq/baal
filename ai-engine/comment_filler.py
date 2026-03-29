"""
베스트글 댓글 채우기 — 추천수 대비 댓글이 부족한 글에 Q로 댓글 생성
Q 순차 사용, 한 번에 조금씩
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import random
import time
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://pfgfxvgbnkrbvyzdaeel.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
LM_STUDIO_URL = "http://127.0.0.1:1234/v1/chat/completions"

H_AUTH = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
H_POST = {**H_AUTH, "Content-Type": "application/json", "Prefer": "return=minimal"}

NICKS = [
    '현자', '반역자', '분석가', '트롤', '사관', '과학자', '현실주의자', '꼬마',
    '닥터', '여행자', '요리사', '상병', '투자자', '해커', '시인', '신비주의자',
    '밤산책러', '퇴근전사', '야근개발자', '커피중독자', '자취고수', '직장인A',
    '대학생', '주식초보', '고양이집사', '새벽감성', '프롬프트장인', '절약왕',
]

REACTIONS = [
    '이 글에 동의하며 자기 경험 한마디 덧붙여.',
    '이 글에 공감하며 짧게 반응해.',
    '이 글 내용을 보충하는 추가 정보를 알려줘.',
    '이 글에 살짝 다른 의견을 부드럽게.',
    '이 글에 대해 궁금한 점을 질문해.',
    '이 글에 유머러스하게 반응해.',
    '이 글에 현실적인 조언을 던져.',
    '이 글에 짧은 한마디만 임팩트있게.',
    '이 글에 날카롭게 핵심을 지적해.',
    '자기 비슷한 경험을 공유해.',
]


def call_q(prompt):
    try:
        r = requests.post(LM_STUDIO_URL, json={
            "model": "qwen/qwen3.5-9b",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.85, "max_tokens": 200,
        }, timeout=30)
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"].strip()
    except:
        pass
    return None


def fill_best_comments(max_posts=5, max_per_post=10):
    """최근 글 중 댓글 부족한 글에 추가 댓글 — 오래된 글에는 안 달림"""
    from datetime import datetime, timedelta, timezone
    # 최근 1시간 이내 글만 대상 — 오래된 글은 자연스럽게 묻힘
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%SZ")
    posts = requests.get(
        f"{SUPABASE_URL}/rest/v1/posts?select=id,title,content,upvotes,comment_count"
        f"&is_deleted=eq.false&created_at=gte.{cutoff}&order=created_at.desc&limit=20",
        headers=H_AUTH, timeout=10,
    ).json()

    if not isinstance(posts, list):
        return

    # 눈덩이 효과 — 이미 댓글 많은 글에 더 달림 (현실 커뮤니티)
    # 댓글 적은 글은 그냥 묻히게 둠
    needy = []
    for p in posts:
        comments = p.get("comment_count", 0)
        # 댓글 5개 이상인 글만 추가 댓글 대상 (이미 관심 받은 글)
        if comments >= 5:
            # 30% 확률로 1~3개 추가
            if random.random() < 0.3:
                needy.append((p, random.randint(1, 3)))
        # 댓글 10개 이상이면 50% 확률로 2~5개 추가 (눈덩이)
        elif comments >= 10:
            if random.random() < 0.5:
                needy.append((p, random.randint(2, 5)))

    if not needy:
        print("  댓글 충분")
        return

    # 가장 부족한 것부터
    needy.sort(key=lambda x: -x[1])
    done = 0

    for post, need in needy[:max_posts]:
        need = min(need, max_per_post)
        used = set()

        for _ in range(need):
            nick = random.choice([n for n in NICKS if n not in used])
            used.add(nick)
            reaction = random.choice(REACTIONS)
            length = random.choice(["한 문장", "1~2문장", "2~3문장"])

            prompt = (
                f"{reaction} {length}. 구체적으로 내용 언급. "
                f"접두어 금지. 이모지 금지. 바로 댓글만.\n\n"
                f"{post['title']}\n{post.get('content', '')[:300]}"
            )

            text = call_q(prompt)
            if not text or len(text) < 5:
                continue

            requests.post(
                f"{SUPABASE_URL}/rest/v1/comments",
                json={
                    "post_id": post["id"], "content": text,
                    "author_nickname": nick, "upvotes": 0,
                    "downvotes": 0, "is_deleted": False,
                },
                headers=H_POST, timeout=10,
            )
            done += 1
            print(f"  [FILL] {nick} → {post['title'][:25]}")
            time.sleep(2)  # Q 순차 대기

        # comment_count 동기화
        all_c = requests.get(
            f"{SUPABASE_URL}/rest/v1/comments?select=id&post_id=eq.{post['id']}&is_deleted=eq.false",
            headers=H_AUTH, timeout=10,
        ).json()
        new_count = len(all_c) if isinstance(all_c, list) else 0
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post['id']}",
            json={"comment_count": new_count},
            headers=H_POST, timeout=10,
        )

    print(f"  [FILL] {done}개 댓글 추가")


if __name__ == "__main__":
    fill_best_comments(max_posts=10, max_per_post=5)
