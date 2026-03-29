"""
자가 점검 + 개선 스크립트 — 백그라운드 상시 가동
1. 오탈자/제목 누락 점검 및 수정
2. 중복 글 정리
3. 중국어/깨진 문자 정리
4. 댓글 부족한 인기글 보충
5. 글 품질 점검 (너무 짧은 글, 빈 제목 등)
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import re
import time
import random
import requests
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://pfgfxvgbnkrbvyzdaeel.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
LM_URL = "http://127.0.0.1:1234/v1/chat/completions"
H_AUTH = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
H_POST = {**H_AUTH, "Content-Type": "application/json", "Prefer": "return=minimal"}


def query(table, params=""):
    try:
        r = requests.get(f"{SUPABASE_URL}/rest/v1/{table}?{params}", headers=H_AUTH, timeout=15)
        return r.json() if r.status_code == 200 else []
    except:
        return []


def patch(table, id, data):
    requests.patch(f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{id}",
        json=data, headers=H_POST, timeout=10)


def call_q(prompt):
    try:
        r = requests.post(LM_URL, json={
            "model": "qwen/qwen3.5-9b",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5, "max_tokens": 50,
        }, timeout=30)
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"].strip()
    except:
        pass
    return None


def check_empty_titles():
    """제목 없거나 카테고리만 있는 글 수정"""
    posts = query("posts", "select=id,title,content,board_type&is_deleted=eq.false&order=created_at.desc")
    fixed = 0
    for p in posts:
        title = p.get("title", "").strip()
        clean = re.sub(r'^\[.+?\]\s*', '', title).strip()
        if len(clean) < 3 and p.get("content"):
            content = p["content"][:150]
            new_title = call_q(f"이 글의 제목을 한국어 20~30자로 만들어. 제목만 출력.\n\n{content}")
            if new_title and len(new_title) > 3:
                new_title = new_title.replace('"','').replace("'","").split("\n")[0][:35]
                cat_match = re.match(r'^\[.+?\]', title)
                if cat_match:
                    new_title = f"{cat_match.group(0)} {new_title}"
                patch("posts", p["id"], {"title": new_title})
                fixed += 1
                print(f"  [FIX TITLE] {new_title[:30]}")
                time.sleep(2)
    if fixed:
        print(f"  제목 수정: {fixed}개")


def check_chinese_content():
    """중국어 포함 글 삭제"""
    posts = query("posts", "select=id,title,content&is_deleted=eq.false&order=created_at.desc")
    deleted = 0
    for p in posts:
        content = p.get("content", "") + p.get("title", "")
        if re.search(r'[\u4e00-\u9fff]{5,}', content):
            patch("posts", p["id"], {"is_deleted": True})
            deleted += 1
            print(f"  [DEL CHINESE] {p['title'][:25]}")
    if deleted:
        print(f"  중국어 글 삭제: {deleted}개")


def check_model_pollution():
    """모델 출력 오염 글 삭제 (Thinking Process 등)"""
    posts = query("posts", "select=id,title&is_deleted=eq.false&order=created_at.desc&limit=50")
    deleted = 0
    pollution = ['Thinking Process', 'thinking process', "Here's a", "I'll ", "Let me ", "Sure,"]
    for p in posts:
        title = p.get("title", "")
        if any(pol in title for pol in pollution):
            patch("posts", p["id"], {"is_deleted": True})
            deleted += 1
            print(f"  [DEL POLLUTION] {title[:30]}")
    if deleted:
        print(f"  모델 출력 오염 삭제: {deleted}개")


def check_duplicates():
    """중복 글 정리 (같은 게시판, 제목 앞 10자)"""
    posts = query("posts", "select=id,title,board_type,created_at&is_deleted=eq.false&order=created_at.desc")
    groups = defaultdict(list)
    for p in posts:
        key = (p["board_type"], p["title"][:10].strip())
        groups[key].append(p)

    deleted = 0
    for key, group in groups.items():
        if len(group) >= 2:
            sorted_g = sorted(group, key=lambda x: x["created_at"], reverse=True)
            for p in sorted_g[1:]:
                patch("posts", p["id"], {"is_deleted": True})
                deleted += 1
    if deleted:
        print(f"  중복 삭제: {deleted}개")


def check_short_content():
    """본문 30자 미만 글 삭제"""
    posts = query("posts", "select=id,title,content&is_deleted=eq.false&order=created_at.desc")
    deleted = 0
    for p in posts:
        content = p.get("content", "").strip()
        if len(content) < 30:
            patch("posts", p["id"], {"is_deleted": True})
            deleted += 1
            print(f"  [DEL SHORT] {p['title'][:25]}")
    if deleted:
        print(f"  짧은 글 삭제: {deleted}개")


def check_comment_count_sync():
    """댓글수 동기화"""
    posts = query("posts", "select=id,comment_count&is_deleted=eq.false&comment_count=gt.0&order=created_at.desc&limit=50")
    fixed = 0
    for p in posts:
        actual = query("comments", f"select=id&post_id=eq.{p['id']}&is_deleted=eq.false")
        actual_count = len(actual) if isinstance(actual, list) else 0
        if actual_count != p.get("comment_count", 0):
            patch("posts", p["id"], {"comment_count": actual_count})
            fixed += 1
    if fixed:
        print(f"  댓글수 동기화: {fixed}개")


def check_news_category():
    """뉴스 글 중 카테고리 없는 것 채우기"""
    posts = query("posts", "select=id,title,news_category&board_type=eq.hardware&is_deleted=eq.false&news_category=is.null&limit=20")
    fixed = 0
    for p in posts:
        m = re.match(r'^\[(.+?)\]', p.get("title", ""))
        if m:
            patch("posts", p["id"], {"news_category": m.group(1)})
            fixed += 1
    if fixed:
        print(f"  뉴스 카테고리 채움: {fixed}개")


def check_long_titles():
    """40자 초과 제목 자동 수정"""
    posts = query("posts", "select=id,title,content&is_deleted=eq.false&order=created_at.desc&limit=30")
    fixed = 0
    for p in posts:
        if len(p.get("title", "")) <= 40:
            continue
        new_title = call_q(f"제목을 15~20자로. 제목만 출력.\n\n{p.get('content','')[:100]}")
        if new_title and 5 <= len(new_title) <= 30:
            new_title = new_title.replace('"','').split('\n')[0]
            import re
            cat = re.match(r'^\[(.+?)\]', p['title'])
            cat = f'[{cat.group(1)}] ' if cat else ''
            patch("posts", p["id"], {"title": f"{cat}{new_title}"})
            fixed += 1
            time.sleep(1)
    if fixed:
        print(f"  긴 제목 자동 수정: {fixed}개")


def check_profanity_in_posts():
    """욕설 포함 글/댓글 마스킹"""
    import re
    profanity = {'시발':'시**','씨발':'씨**','좆':'*','존나':'존**','지랄':'지**','개소리':'개**','병신':'병**','새끼':'새**'}
    posts = query("posts", "select=id,title,content&is_deleted=eq.false&order=created_at.desc&limit=50")
    fixed = 0
    for p in posts:
        title = p.get("title","")
        content = p.get("content","")
        new_title = title
        new_content = content
        for word, mask in profanity.items():
            new_title = new_title.replace(word, mask)
            new_content = new_content.replace(word, mask)
        if new_title != title or new_content != content:
            update = {}
            if new_title != title: update["title"] = new_title
            if new_content != content: update["content"] = new_content
            patch("posts", p["id"], update)
            fixed += 1
    if fixed:
        print(f"  욕설 마스킹: {fixed}개")

    # 댓글도
    comments = query("comments", "select=id,content&is_deleted=eq.false&order=created_at.desc&limit=100")
    c_fixed = 0
    for c in comments:
        content = c.get("content","")
        new_content = content
        for word, mask in profanity.items():
            new_content = new_content.replace(word, mask)
        if new_content != content:
            patch("comments", c["id"], {"content": new_content})
            c_fixed += 1
    if c_fixed:
        print(f"  댓글 욕설 마스킹: {c_fixed}개")


def check_unrealistic_numbers():
    """비현실적 수치 글 감지 — 월 1000만 이상 등"""
    import re
    posts = query("posts", "select=id,title,content&is_deleted=eq.false&order=created_at.desc&limit=100")
    flagged = 0
    for p in posts:
        text = p.get("title","") + p.get("content","")
        if re.search(r'월\s*[1-9]\d{3,}만', text):
            patch("posts", p["id"], {"is_deleted": True})
            flagged += 1
            print(f"  [DEL] 비현실 수치: {p['title'][:25]}")
    if flagged:
        print(f"  비현실 수치 삭제: {flagged}개")


def write_report():
    """점검 결과 요약 파일 저장 — 상세 보고"""
    import datetime
    posts_total = len(query("posts", "select=id&is_deleted=eq.false"))

    # 최근 3시간 글 수
    from datetime import timezone, timedelta
    cutoff = (datetime.datetime.now(timezone.utc) - timedelta(hours=3)).strftime("%Y-%m-%dT%H:%M:%SZ")
    recent = query("posts", f"select=id,title,board_type,comment_count,author_nickname&is_deleted=eq.false&created_at=gte.{cutoff}&order=created_at.desc&limit=20")
    recent_count = len(recent)

    # 댓글 0개인 최근 글
    no_comments = [p for p in recent if p.get("comment_count", 0) == 0]

    # 게시판별 최근 활동
    board_counts = {}
    for p in recent:
        b = p.get("board_type", "?")
        board_counts[b] = board_counts.get(b, 0) + 1

    # 최근 글 제목 샘플 (품질 확인용)
    titles = [p.get("title", "")[:40] for p in recent[:5]]

    issues = []

    # 1. 댓글 없는 글 많으면
    if len(no_comments) > 3:
        issues.append(f"댓글 없는 최근 글 {len(no_comments)}개")

    # 2. 활동량 부족
    if recent_count < 3:
        issues.append(f"최근 3시간 글이 {recent_count}개로 적음")

    # 3. 게시판 편중 (뉴스만 많고 나머지 없으면)
    news_count = board_counts.get("hardware", 0)
    other_count = sum(v for k, v in board_counts.items() if k != "hardware")
    if news_count > 0 and other_count == 0:
        issues.append("뉴스만 생성되고 다른 게시판 활동 없음")

    # 4. 같은 작성자 연속 — 동일인이 최근 5개 중 3개 이상
    if recent:
        from collections import Counter
        author_counts = Counter(p.get("author_nickname", "") for p in recent[:10])
        for author, cnt in author_counts.items():
            if cnt >= 4:
                issues.append(f"'{author}'가 최근 글 {cnt}개 도배")

    # 5. 제목 품질 — ...으로 끝나거나 40자 초과
    long_titles = [p for p in recent if len(p.get("title", "")) > 40 or "..." in p.get("title", "")]
    if long_titles:
        issues.append(f"제목 길거나 잘린 글 {len(long_titles)}개")

    # 6. 중복 제목 (최근 글 중)
    title_prefixes = [p.get("title", "")[:10] for p in recent]
    dup_prefixes = [t for t in set(title_prefixes) if title_prefixes.count(t) >= 2]
    if dup_prefixes:
        issues.append(f"중복 의심 제목 {len(dup_prefixes)}그룹")

    # 7. 뉴스 원문 링크 누락
    news_recent = [p for p in recent if p.get("board_type") == "hardware"]
    # 본문 확인은 별도 쿼리 필요하므로 제목만 체크
    no_cat_news = [p for p in news_recent if not p.get("title", "").startswith("[")]
    if no_cat_news:
        issues.append(f"뉴스 카테고리 없는 글 {len(no_cat_news)}개")

    # 누적 패턴 통계 (auto_improve_log에서)
    pattern_stats = ""
    try:
        with open(os.path.join(os.path.dirname(__file__), "auto_improve_log.txt"), "r", encoding="utf-8") as f:
            log_lines = f.readlines()
        pattern_stats = f"\n[변경 이력: 최근 {min(5, len(log_lines))}줄]\n" + "".join(log_lines[-5:])
    except:
        pass

    status = "문제있음" if issues else "정상"

    report = f"""=== 자가 점검 보고서 ===
시각: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}
전체 글: {posts_total}개
최근 3시간 글: {recent_count}개
댓글 없는 최근 글: {len(no_comments)}개
상태: {status}

{"[이슈]" + chr(10) + chr(10).join("  - " + i for i in issues) if issues else "[이슈 없음]"}

[최근 글 샘플]
{chr(10).join("  - " + t for t in titles)}

[게시판별 최근 활동]
{chr(10).join(f"  {k}: {v}개" for k,v in board_counts.items())}
{pattern_stats}
"""
    with open("self_improve_report.txt", "w", encoding="utf-8") as f:
        f.write(report)


def run_check():
    """전체 점검 1사이클"""
    print("\n=== 자가 점검 ===")
    sys.stdout.flush()

    check_empty_titles()
    check_chinese_content()
    check_model_pollution()
    check_duplicates()
    check_short_content()
    check_comment_count_sync()
    check_news_category()
    check_long_titles()
    check_profanity_in_posts()
    check_unrealistic_numbers()
    write_report()

    print("=== 점검 완료 ===\n")
    sys.stdout.flush()


if __name__ == "__main__":
    print("=== 자가 점검 스크립트 시작 ===")
    sys.stdout.flush()

    while True:
        try:
            run_check()
        except Exception as e:
            print(f"[ERR] {e}")
            sys.stdout.flush()

        # 15분마다 점검
        delay = random.uniform(900, 1200)
        print(f"다음 점검까지 {delay/60:.0f}분")
        sys.stdout.flush()
        time.sleep(delay)
