"""
글로벌 뉴스 봇 — 세계 주요 매체에서 뉴스 수집, Q(로컬) 번역 후 게시
소스: Hacker News, Reddit(다수 서브), RSS(주요 매체), 세계 이슈
번역: Q(Qwen 로컬) 우선 → Gemini 폴백
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import re
import time
import random
import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEYS = [k.strip() for k in os.getenv("GEMINI_KEYS", "").split(",") if k.strip()]
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://pfgfxvgbnkrbvyzdaeel.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
LM_STUDIO_URL = "http://127.0.0.1:1234/v1/chat/completions"

# 외래어 표기 교정 사전 — Q가 틀리게 쓰는 것 → 한국 표준/관용 표기
PROPER_NAMES = {
    # 기업/서비스
    "팔란타르": "팔란티어", "팔란티르": "팔란티어", "팔란타이어": "팔란티어", "팔린타르": "팔란티어",
    "침전": "침공",  # 우크라이나 침공 오역 방지
    "테슬러": "테슬라", "아마죤": "아마존", "메타": "메타",
    "구굴": "구글", "구글": "구글", "마이크로소프트": "마이크로소프트",
    "엔비디아": "엔비디아", "엔비다아": "엔비디아",
    "오픈이앤아이": "오픈AI", "오픈에이아이": "오픈AI", "오픈아이": "오픈AI",
    "앤트로픽": "앤스로픽", "안트로픽": "앤스로픽",
    "스페이스엑스": "스페이스X", "스페이스 엑스": "스페이스X",
    "틱톡": "틱톡", "넷플릭스": "넷플릭스",
    "온리팬즈": "온리팬스", "온니팬스": "온리팬스",
    # 인물 (2026년 기준)
    "이명박 대통령": "이재명 대통령", "이명박": "이재명",  # Q 오역 방지
    "문재인 대통령": "이재명 대통령",
    "트럼프": "트럼프", "바이든": "바이든", "일론 머스크": "일론 머스크",
    "젤렌스키": "젤렌스키", "젤렌스키이": "젤렌스키", "제렌스키": "젤렌스키",
    "제린스키": "젤렌스키", "젤렌스키야": "젤렌스키",
    "카르파티": "카파시", "카파스키": "카파시", "카르파시": "카파시",
    # 지명
    "우크라이나": "우크라이나", "유크레인": "우크라이나",
    "이스라엘": "이스라엘", "이즈라엘": "이스라엘",
    "테헤란": "테헤란", "타이완": "대만",
    "벵갈루루": "벵갈루루", "방갈로": "벵갈루루", "방갈로르": "벵갈루루",
    # 기술 용어
    "타이스크립트": "타입스크립트", "타입 스크립트": "타입스크립트",
    "러스트": "러스트", "파이썬": "파이썬",
    "깃허브": "깃허브", "깃헙": "깃허브",
    "닉스오에스": "NixOS", "닉스OS": "NixOS",
    # 기관
    "펜타곤": "펜타곤", "팬타곤": "펜타곤",
    "나사": "NASA", "에프비아이": "FBI",
    "호르무즈": "호르무즈", "霍尔木兹": "호르무즈", "霍尔무즈": "호르무즈",
}


def fix_proper_names(text):
    """외래어 표기 교정"""
    for wrong, right in PROPER_NAMES.items():
        if wrong != right and wrong in text:
            text = text.replace(wrong, right)
    return text

_key_idx = 0


# ====== LLM 호출 ======

def call_qwen(prompt, temp=0.7):
    try:
        r = requests.post(LM_STUDIO_URL, json={
            "model": "qwen/qwen3.5-9b",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temp, "max_tokens": 600,
        }, timeout=90)
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"]
    except:
        pass
    return None


def call_gemini(prompt, temp=0.5):
    global _key_idx
    for _ in range(len(GEMINI_KEYS)):
        key = GEMINI_KEYS[_key_idx % len(GEMINI_KEYS)]
        _key_idx += 1
        try:
            r = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={key}",
                json={"contents": [{"parts": [{"text": prompt}]}],
                      "generationConfig": {"temperature": temp, "maxOutputTokens": 1500}},
                timeout=60,
            )
            if r.status_code == 200:
                return r.json()["candidates"][0]["content"]["parts"][0]["text"]
            if r.status_code == 429:
                continue
        except:
            continue
    return None


def translate(prompt):
    """Q 우선, Gemini 폴백"""
    result = call_qwen(prompt)
    if result and len(result.strip()) > 30:
        print("    [Q]", end=" ")
        return result
    result = call_gemini(prompt)
    if result:
        print("    [GEMINI]", end=" ")
    return result


# ====== 뉴스 소스 ======

def fetch_hackernews(limit=3):
    """Hacker News 인기글"""
    try:
        ids = requests.get("https://hacker-news.firebaseio.com/v0/topstories.json", timeout=10).json()[:30]
        stories = []
        for sid in random.sample(ids, min(limit * 3, len(ids))):
            s = requests.get(f"https://hacker-news.firebaseio.com/v0/item/{sid}.json", timeout=5).json()
            if s and s.get("type") == "story" and s.get("score", 0) > 50:
                stories.append({
                    "title": s.get("title", ""),
                    "url": s.get("url", f"https://news.ycombinator.com/item?id={sid}"),
                    "score": s.get("score", 0),
                    "source": "Hacker News",
                })
            if len(stories) >= limit:
                break
        return stories
    except:
        return []


def fetch_reddit(subreddit, limit=3):
    """Reddit 서브레딧 인기글"""
    try:
        r = requests.get(
            f"https://www.reddit.com/r/{subreddit}/hot.json?limit=20",
            headers={"User-Agent": "BAAL-NewsBot/2.0"}, timeout=10,
        )
        if r.status_code != 200:
            return []
        stories = []
        for p in r.json().get("data", {}).get("children", []):
            d = p.get("data", {})
            if d.get("score", 0) > 50 and d.get("title"):
                url = d.get("url", "")
                if not url or url.startswith("/r/"):
                    url = f"https://reddit.com{d.get('permalink', '')}"
                stories.append({
                    "title": d["title"],
                    "url": url,
                    "score": d.get("score", 0),
                    "source": f"Reddit r/{subreddit}",
                })
            if len(stories) >= limit:
                break
        return stories
    except:
        return []


def fetch_rss(feed_url, source_name, limit=3):
    """RSS 피드에서 뉴스 가져오기"""
    try:
        r = requests.get(feed_url, timeout=15, headers={"User-Agent": "BAAL-NewsBot/2.0"})
        if r.status_code != 200:
            return []
        root = ET.fromstring(r.content)
        stories = []
        # RSS 2.0 format
        for item in root.iter("item"):
            title = item.findtext("title", "")
            link = item.findtext("link", "")
            if title and link:
                stories.append({
                    "title": title.strip(),
                    "url": link.strip(),
                    "score": 0,
                    "source": source_name,
                })
            if len(stories) >= limit:
                break
        # Atom format
        if not stories:
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            for entry in root.findall(".//atom:entry", ns):
                title = entry.findtext("atom:title", "", ns)
                link_el = entry.find("atom:link", ns)
                link = link_el.get("href", "") if link_el is not None else ""
                if title and link:
                    stories.append({
                        "title": title.strip(),
                        "url": link.strip(),
                        "score": 0,
                        "source": source_name,
                    })
                if len(stories) >= limit:
                    break
        return stories
    except:
        return []


# ====== 소스 목록 ======

SOURCES = {
    # === 세계/국제 ===
    "bbc_world": lambda: fetch_rss("https://feeds.bbci.co.uk/news/world/rss.xml", "BBC", 3),
    "aljazeera": lambda: fetch_rss("https://www.aljazeera.com/xml/rss/all.xml", "Al Jazeera", 3),
    "npr_world": lambda: fetch_rss("https://feeds.npr.org/1004/rss.xml", "NPR", 2),
    "france24": lambda: fetch_rss("https://www.france24.com/en/rss", "France24", 2),
    "dw": lambda: fetch_rss("https://rss.dw.com/rdf/rss-en-all", "DW", 2),
    "abc_au": lambda: fetch_rss("https://www.abc.net.au/news/feed/2942460/rss.xml", "ABC Australia", 2),
    "reddit_world": lambda: fetch_reddit("worldnews", 2),
    "reddit_geopolitics": lambda: fetch_reddit("geopolitics", 2),
    # === 전쟁/분쟁 ===
    "ukrinform": lambda: fetch_rss("https://www.ukrinform.net/rss/block-lastnews", "Ukrinform", 2),
    "moscow_times": lambda: fetch_rss("https://www.themoscowtimes.com/rss/news", "Moscow Times", 2),
    # === 아시아 ===
    "japan_times": lambda: fetch_rss("https://www.japantimes.co.jp/feed/", "Japan Times", 2),
    "ndtv": lambda: fetch_rss("https://feeds.feedburner.com/ndtvnews-world-news", "NDTV India", 2),
    "yonhap_en": lambda: fetch_rss("https://en.yna.co.kr/RSS/news.xml", "Yonhap EN", 2),
    # === 테크/IT ===
    "bbc_tech": lambda: fetch_rss("https://feeds.bbci.co.uk/news/technology/rss.xml", "BBC Tech", 2),
    "verge": lambda: fetch_rss("https://www.theverge.com/rss/index.xml", "The Verge", 2),
    "ars": lambda: fetch_rss("https://feeds.arstechnica.com/arstechnica/index", "Ars Technica", 2),
    "techcrunch": lambda: fetch_rss("https://techcrunch.com/feed/", "TechCrunch", 2),
    "hn": lambda: fetch_hackernews(3),
    # === AI ===
    "reddit_ai": lambda: fetch_reddit("artificial", 2),
    # === 과학 ===
    "reddit_science": lambda: fetch_reddit("science", 2),
    "reddit_space": lambda: fetch_reddit("space", 2),
}


# ====== 기사 본문 스크래핑 ======

PAYWALL_INDICATORS = [
    "subscribe", "subscription", "sign in to read", "premium content",
    "members only", "create a free account", "register to continue",
    "paywall", "unlock this article", "already a subscriber",
]

def fetch_article_content(url):
    """원문 URL에서 기사 본문 텍스트 추출. 실패/페이월 시 None 반환."""
    try:
        r = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        })
        if r.status_code != 200:
            return None

        soup = BeautifulSoup(r.text, "html.parser")

        # script, style, nav, footer, header 등 제거
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "iframe", "noscript"]):
            tag.decompose()

        # article 태그 우선, 없으면 본문 전체
        article = soup.find("article")
        if article:
            paragraphs = article.find_all("p")
        else:
            paragraphs = soup.find_all("p")

        text = "\n".join(p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 20)

        # 페이월 감지
        text_lower = text.lower()
        paywall_count = sum(1 for kw in PAYWALL_INDICATORS if kw in text_lower)
        if paywall_count >= 2:
            print(f"    [PAYWALL] {url[:50]}")
            return None

        # 본문 너무 짧으면 페이월이거나 접근 불가
        if len(text) < 200:
            print(f"    [SHORT] 본문 {len(text)}자 — 스킵")
            return None

        # 3000자 제한 (Q 토큰 절약)
        return text[:3000]

    except Exception as e:
        print(f"    [FETCH ERR] {e}")
        return None


# ====== 번역 + 게시 ======

def classify_category(story):
    """소스 기반 카테고리 분류"""
    src = story["source"].lower()
    title_lower = story["title"].lower()
    if any(k in src for k in ["ukrinform", "moscow times", "ukraine", "geopolitic"]) or \
       any(k in title_lower for k in ["war", "military", "nato", "missile", "iran", "russia", "ukraine"]):
        return "[국제]"
    elif any(k in src for k in ["japan times", "ndtv", "india", "yonhap", "korea", "asia"]):
        return "[아시아]"
    elif any(k in src for k in ["france24", "dw", "europe"]):
        return "[유럽]"
    elif any(k in src for k in ["abc australia"]):
        return "[세계]"
    elif any(k in src for k in ["hacker", "ars", "techcrunch", "verge", "bbc tech"]):
        return "[테크]"
    elif any(k in src for k in ["artificial", "ai"]) or \
         any(k in title_lower for k in ["ai ", "gpt", "llm", "openai", "anthropic", "gemini"]):
        return "[AI]"
    elif any(k in src for k in ["science", "space"]):
        return "[과학]"
    elif any(k in src for k in ["bbc", "aljazeera", "npr", "world"]):
        return "[세계]"
    return "[뉴스]"


def translate_story(story):
    """원문 기사를 가져와서 번역 + 요약. 원문 접근 불가 시 None 반환."""
    cat = classify_category(story)

    # 1단계: 원문 기사 본문 가져오기
    article_text = fetch_article_content(story.get("url", ""))
    if not article_text:
        print(f"    [SKIP] 원문 접근 불가: {story['title'][:30]}")
        return None, cat

    # 2단계: 실제 기사 내용 기반으로 번역 + 요약
    prompt = f"""다음 영어 뉴스 기사를 한국어로 번역·요약해.

원문 제목: {story['title']}

원문 본문:
{article_text[:2000]}

규칙:
- 첫 줄: {cat} + 한국어 제목 (20자 이내, 핵심만)
- 줄바꿈 후 본문: 기사 내용을 3~5문장으로 정확하게 요약. 원문에 없는 내용 추가 금지.
- 마지막 줄: 출처: {story['source']} | 원문: {story['url']}
- 고유명사는 한국식 표기 (Pentagon→펜타곤)
- 자연스러운 한국어. 번역투 금지. 숫자 띄어쓰기 하지 마 (10조, 1년 O / 10 조, 1 년 X)
- 이모지 금지
- 중국어/일본어 표현 절대 금지
[중요 - 2026년 현재 정보]
- 한국 대통령: 이재명 (Lee Jae Myung). 이명박/박근혜/윤석열은 전직 대통령.
- 미국 대통령: 트럼프 (2기)
- 우크라이나 대통령: 젤렌스키
- 원문의 인명을 정확히 음역할 것. 모르면 영어 그대로 표기.
"""
    result = translate(prompt)
    if result:
        result = fix_proper_names(result)
    return result, cat


def post_to_board(title, content, board="hardware", category=""):
    H = {
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json", "Prefer": "return=minimal",
    }
    import re
    # 제목에서 카테고리 자동 추출
    if not category:
        m = re.match(r'^\[(.+?)\]', title)
        if m:
            category = m.group(1)
    data = {
        "board_type": board,
        "title": title,
        "content": content,
        "author_nickname": "뉴스봇",
        "view_count": random.randint(20, 150),
        "upvotes": 0,
        "comment_count": 0,
    }
    if category:
        data["news_category"] = category
    r = requests.post(f"{SUPABASE_URL}/rest/v1/posts", json=data, headers=H)
    return r.status_code in (200, 201)


def get_existing_urls():
    """기존 뉴스 본문에서 URL 추출 — URL 기준 중복 체크"""
    H = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    try:
        existing = requests.get(
            f"{SUPABASE_URL}/rest/v1/posts?select=content&author_nickname=eq.뉴스봇&order=created_at.desc&limit=200",
            headers=H, timeout=10,
        ).json()
        urls = set()
        import re
        for p in (existing if isinstance(existing, list) else []):
            found = re.findall(r'https?://[^\s<>"]+', p.get("content", ""))
            urls.update(found)
        return urls
    except:
        return set()


def run_news_cycle():
    """뉴스 한 사이클 — 랜덤 소스에서 수집"""
    # 매 사이클마다 3~5개 소스 랜덤 선택
    source_keys = random.sample(list(SOURCES.keys()), min(random.randint(5, 8), len(SOURCES)))
    print(f"  소스: {', '.join(source_keys)}")

    all_stories = []
    for key in source_keys:
        try:
            stories = SOURCES[key]()
            all_stories.extend(stories)
            if stories:
                print(f"    {key}: {len(stories)}개")
        except Exception as e:
            print(f"    {key}: 실패 ({e})")

    if not all_stories:
        print("  [NEWS] 뉴스 없음")
        return

    random.shuffle(all_stories)
    existing_urls = get_existing_urls()

    posted = 0
    for story in all_stories:
        if posted >= 1:  # 사이클당 최대 1개 (페르소나 글 비율 유지)
            break

        # 중복 체크 — URL 기반 (같은 기사 URL이면 스킵)
        if story.get("url") and story["url"] in existing_urls:
            continue

        # 광고/할인/쿠폰 필터
        ad_words = ["deal", "discount", "coupon", "sale", "promo", "off ", "% off", "cheapest", "lowest price",
                     "할인", "혜택", "쿠폰", "세일", "특가", "최저가"]
        if any(w in story["title"].lower() for w in ad_words):
            continue

        import re

        result = translate_story(story)
        if not result or not result[0] or len(result[0]) < 80:
            continue
        text, cat = result

        # 중국어 포함 → 버림
        if re.search(r'[\u4e00-\u9fff]{3,}', text):
            print(f"  [SKIP] 중국어 포함")
            continue

        # 첫 줄 = 제목, 나머지 = 본문 (한번에 끝)
        lines = text.strip().split("\n", 1)
        title = lines[0].replace("제목:", "").replace("**", "").replace("#", "").strip()
        content = lines[1].strip() if len(lines) > 1 else text

        # 카테고리 태그 처리
        if not title.startswith("["):
            title = f"{cat} {title}"

        # 검증 게이트
        clean = re.sub(r'^\[.+?\]\s*', '', title).strip()
        if len(clean) < 5:
            print(f"  [SKIP] 제목 짧음")
            continue
        # 제목 길면 Q에게 축약 재시도
        if len(title) > 40:
            retry = call_qwen(f"이 뉴스 제목을 15자 이내로 줄여. 핵심만. 카테고리 태그 빼고 제목만 출력.\n\n{title}", temp=0.3)
            if retry and 5 <= len(retry.strip()) <= 25:
                short = retry.strip().replace('"','').replace("'","").split('\n')[0]
                title = f"{cat} {short}"
                print(f"  [RETRY] 제목 축약: {title}")
            else:
                print(f"  [SKIP] 제목 길음({len(title)}자)")
                continue
        if re.search(r'[\u4e00-\u9fff]', title):
            print(f"  [SKIP] 중국어 포함")
            continue
        # 모델 출력 오염 필터
        pollution = ['Thinking Process', 'thinking process', "Here's", "I'll", "Let me", "Sure,"]
        if any(p in title for p in pollution) or any(p in content for p in pollution):
            print(f"  [SKIP] 모델 출력 오염")
            continue

        # 원문 링크 보장 — Q가 빼먹어도 코드에서 강제 추가
        if "원문:" not in content and story.get("url"):
            content += f"\n\n출처: {story['source']} | 원문: {story['url']}"

        if post_to_board(title, content):
            posted += 1
            print(f"  [NEWS] {story['source']} → {title[:35]}")
            existing_urls.add(story.get("url", ""))

            # 뉴스 글에 즉시 댓글 1~2개 — 댓글 0개 방지
            try:
                import requests as _req
                KEY = SUPABASE_KEY
                # 방금 올린 글 ID 가져오기
                recent = _req.get(f"{SUPABASE_URL}/rest/v1/posts?select=id&author_nickname=eq.뉴스봇&order=created_at.desc&limit=1",
                    headers={"apikey":KEY,"Authorization":f"Bearer {KEY}"}, timeout=5).json()
                if recent:
                    post_id = recent[0]["id"]
                    nicks = ["지나가던시민","ㅇㅇ","공감러","읽었다","커피충","직장인A","대학생"]
                    reactions = ["ㄹㅇ 이거 심각하네","오 이런 일이","흥미롭다","이건 좀 충격적","와 진짜?","기사 잘 봤습니다"]
                    for _ in range(random.randint(1, 2)):
                        _req.post(f"{SUPABASE_URL}/rest/v1/comments", json={
                            "post_id": post_id, "content": random.choice(reactions),
                            "author_nickname": random.choice(nicks),
                            "upvotes":0, "downvotes":0, "is_deleted":False,
                        }, headers={"apikey":KEY,"Authorization":f"Bearer {KEY}",
                                    "Content-Type":"application/json","Prefer":"return=minimal"}, timeout=5)
                    # comment_count 업데이트
                    cc = _req.get(f"{SUPABASE_URL}/rest/v1/comments?select=id&post_id=eq.{post_id}&is_deleted=eq.false",
                        headers={"apikey":KEY,"Authorization":f"Bearer {KEY}"}, timeout=5).json()
                    _req.patch(f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post_id}",
                        json={"comment_count": len(cc) if isinstance(cc,list) else 0},
                        headers={"apikey":KEY,"Authorization":f"Bearer {KEY}",
                                 "Content-Type":"application/json"}, timeout=5)
            except:
                pass

        time.sleep(random.uniform(3, 10))

    print(f"  [NEWS] {posted}개 게시 완료")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true")
    parser.add_argument("--loop", action="store_true")
    args = parser.parse_args()

    print("=== 글로벌 뉴스봇 ===")
    print(f"소스: {len(SOURCES)}개 채널")

    if args.once:
        run_news_cycle()
    elif args.loop:
        while True:
            run_news_cycle()
            delay = random.uniform(3600, 7200)
            print(f"  다음까지 {delay/60:.0f}분")
            time.sleep(delay)
    else:
        run_news_cycle()
