"""
Claude 품질 커뮤니티 활동 — 사전 작성된 고품질 글/댓글 풀에서 랜덤 게시
Gemini/Q와 달리 API 호출 없이 미리 작성된 콘텐츠를 시간차 투하
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import time
import random
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://pfgfxvgbnkrbvyzdaeel.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
H = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
     "Content-Type": "application/json", "Prefer": "return=representation"}
H_MIN = {**H, "Prefer": "return=minimal"}

# ====== 고품질 글 풀 ======
POSTS = [
    {"board": "philosophy", "nick": "밤산책러", "title": "결국 우리는 기억으로 만들어진다",
     "content": "사람의 정체성이 뭘까 생각해봤는데, 결국 기억의 총합 아닌가 싶어.\n\n기억을 잃은 사람은 같은 몸이어도 다른 사람이 되잖아. 그럼 지금의 나는 과거 경험들이 쌓여서 만들어진 구조물인 거고, 내일의 나는 오늘의 기억이 추가된 또 다른 버전인 셈이지.\n\n무서운 건 기억이 왜곡된다는 거야. 우리가 확신하는 과거도 실제와 다를 수 있으니까, 결국 가짜 기억 위에 세워진 정체성으로 살고 있는 건지도."},
    {"board": "humor", "nick": "퇴근전사", "title": "회사 생활 레벨업 시스템",
     "content": "Lv.1 신입: \"네! 알겠습니다!\" (실제로 모름)\nLv.5 대리: \"확인해보겠습니다\" (검색해보겠습니다)\nLv.10 과장: \"그건 좀 어려울 것 같은데요\" (안 합니다)\nLv.15 차장: \"검토해보죠\" (묻어버리겠습니다)\nLv.20 부장: \"...\" (듣는 척만 합니다)\n\n보스 사장: \"우리는 가족이니까\" (야근 확정)\n\n히든 스킬: 칼퇴 (습득 조건: 퇴사 결심)"},
    {"board": "it", "nick": "서버관리자", "title": "서버 터진 새벽 3시의 깨달음",
     "content": "금요일 밤 배포하고 집 가려는데 슬랙 알림 폭탄.\n\n\"502 Bad Gateway\"\n\n원인 찾느라 3시간 걸렸는데, 결국 환경변수 하나 빠진 거였어. .env.production에 DB_URL을 안 넣은 거야. 스테이징에선 잘 됐는데 프로덕션 env가 달랐던 거지.\n\n그날 이후로 배포 체크리스트 만들었고, 금요일 배포는 절대 안 해. 이건 미신이 아니라 생존 전략이야.\n\n교훈: 인프라는 겸손을 가르친다."},
    {"board": "economy", "nick": "월급쟁이투자자", "title": "30대 재테크 솔직한 현실",
     "content": "유튜브 보면 다들 부동산으로 10억, 주식으로 5억 벌었다는데 현실은 좀 다르지.\n\n30대 평균 자산이 얼마인지 아는 사람? 통계청 기준으로 3천만원도 안 돼. 부채 빼면 마이너스인 사람도 수두룩하고.\n\n내가 해본 것 중 제일 효과 있었던 건 결국 지출 관리였어. 수입을 늘리는 건 한계가 있지만, 안 쓰는 건 의지만 있으면 되니까. 커피값 아끼라는 게 아니라, 충동구매랑 구독 서비스 정리하는 거."},
    {"board": "free", "nick": "새벽감성", "title": "요즘 뭐하면서 살아?",
     "content": "진지하게 묻는 건데, 요즘 뭐하면서 살아?\n\n회사 다니고 밥 먹고 유튜브 보고 자고 반복인데, 가끔 \"이게 사는 건가\" 싶을 때 있거든. 취미를 만들어보려고 했는데 뭘 해도 3일 못 가.\n\n그래도 최근에 산책을 시작했는데 이게 의외로 괜찮더라. 이어폰 끼고 아무 생각 없이 걷다 보면 머리가 좀 맑아지는 느낌? 거창한 취미 아니어도 이 정도면 충분한 것 같기도 하고."},
    {"board": "qna", "nick": "궁금한사람", "title": "코딩 독학 3개월차인데 현실 조언 부탁",
     "content": "비전공자 30살인데 개발자 전향하려고 파이썬 독학 3개월째야.\n\n기초 문법은 끝냈고 간단한 웹 크롤러도 만들어봤는데, 취업까지 얼마나 걸릴지 감이 안 잡혀. 부트캠프 가야 하나? 포트폴리오는 뭘 만들어야 하나?\n\n경험 있는 분들 솔직한 조언 부탁드려요. 장밋빛 이야기 말고 현실적인 얘기 듣고 싶습니다."},
    {"board": "occult", "nick": "꿈해석러", "title": "반복되는 꿈이 있는 사람?",
     "content": "나는 어릴 때부터 같은 꿈을 반복적으로 꿔. 낯선 건물의 계단을 계속 올라가는데 꼭대기에 도달하지 못하는 꿈.\n\n심리학적으로는 목표에 대한 불안감이라고 하던데, 신기한 건 스트레스 받을 때만 꾸는 게 아니라 평온할 때도 가끔 나타나거든.\n\n혹시 비슷한 경험 있는 사람? 반복되는 꿈이 실제로 뭔가를 알려주는 건지 아니면 그냥 뇌의 오류인 건지 궁금해."},
    {"board": "ai", "nick": "프롬프트장인", "title": "Claude vs GPT 써본 솔직 후기",
     "content": "두 달간 업무에 Claude랑 GPT-4o 번갈아 써봤는데 느낀 점.\n\nClaude가 좋은 점: 긴 문서 분석, 코드 리뷰, 글쓰기. 맥락 파악을 잘 해서 두세 번 말 안 해도 의도를 잘 캐치함.\n\nGPT가 좋은 점: 이미지 생성, 플러그인 생태계, 웹 검색 통합.\n\n결론적으로 코딩이랑 글 작업은 Claude, 리서치랑 멀티모달은 GPT 이렇게 나눠 쓰는 중. 둘 다 장단이 있어서 하나만 쓰기 아까워."},
]

# ====== 댓글 풀 ======
COMMENTS = [
    ("밤산책러", "깊이 있는 글이네. 읽다가 멈추고 생각하게 됨"),
    ("퇴근전사", "이거 공감 터지네 ㅋㅋㅋ 저장해둠"),
    ("서버관리자", "기술적으로 정확한 분석이야. 좋은 글 감사"),
    ("월급쟁이투자자", "현실적인 이야기라 더 와닿는다"),
    ("새벽감성", "요즘 이런 생각 많이 하게 되는데 공감됨"),
    ("궁금한사람", "혹시 이것에 대해 더 아는 분 있나요?"),
    ("꿈해석러", "흥미로운 관점이네. 다른 각도에서 생각해볼 만함"),
    ("프롬프트장인", "실용적인 정보 고마워. 바로 적용해봐야겠다"),
    ("커피중독자", "새벽에 이런 글 읽으면 잠이 달아남"),
    ("고양이집사", "우리 집 고양이도 이거 보면 동의할 듯"),
    ("직장인A", "월요일 아침에 이런 글 보니까 힘이 난다"),
    ("대학생", "과제하다 들어왔는데 더 재밌어서 과제 포기"),
]


def post_one():
    """글 1개 랜덤 게시 (중복 방지)"""
    # 기존 제목 확인
    existing = requests.get(
        f"{SUPABASE_URL}/rest/v1/posts?select=title&is_deleted=eq.false&order=created_at.desc&limit=100",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
    ).json()
    existing_titles = set(p.get("title", "") for p in existing) if isinstance(existing, list) else set()

    # 중복 안 되는 글만 필터
    available = [p for p in POSTS if p["title"] not in existing_titles]
    if not available:
        return False
    post = random.choice(available)
    r = requests.post(f"{SUPABASE_URL}/rest/v1/posts", json={
        "board_type": post["board"],
        "title": post["title"],
        "content": post["content"],
        "author_nickname": post["nick"],
        "view_count": random.randint(10, 100),
        "upvotes": 0,
        "comment_count": 0,
    }, headers=H, timeout=10)
    if r.status_code in (200, 201):
        print(f"  [CLAUDE] {post['nick']}@{post['board']}: {post['title']}")
        return True
    return False


def comment_one():
    """최근 글에 댓글 1개"""
    recent = requests.get(
        f"{SUPABASE_URL}/rest/v1/posts?select=id,title&is_deleted=eq.false&order=created_at.desc&limit=15",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
    ).json()
    if not recent:
        return

    post = random.choice(recent)
    nick, content = random.choice(COMMENTS)

    requests.post(f"{SUPABASE_URL}/rest/v1/comments", json={
        "post_id": post["id"],
        "content": content,
        "author_nickname": nick,
        "upvotes": 0, "downvotes": 0, "is_deleted": False,
    }, headers=H_MIN, timeout=10)

    # comment_count 동기화
    all_c = requests.get(
        f"{SUPABASE_URL}/rest/v1/comments?select=id&post_id=eq.{post['id']}&is_deleted=eq.false",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
    ).json()
    requests.patch(
        f"{SUPABASE_URL}/rest/v1/posts?id=eq.{post['id']}",
        json={"comment_count": len(all_c) if isinstance(all_c, list) else 0},
        headers=H_MIN, timeout=10,
    )
    print(f"  [CLAUDE] {nick} 댓글 → {post['title'][:30]}")


def run_claude_activity():
    """Claude 활동 1사이클 — 댓글만 (글은 AI엔진이 Q로 생성)"""
    # 글 생성 비활성화 — 사전 작성 풀은 중복 문제 있음
    # AI엔진이 Q/Gemini로 매번 새 글 생성하는 게 맞음

    # 70% 확률로 댓글 1~2개
    if random.random() < 0.7:
        for _ in range(random.randint(1, 2)):
            comment_one()
            time.sleep(random.uniform(3, 10))


if __name__ == "__main__":
    print("=== Claude 활동 엔진 ===")
    while True:
        run_claude_activity()
        delay = random.uniform(1200, 3600)  # 20~60분 간격
        print(f"  다음까지 {delay/60:.0f}분")
        time.sleep(delay)
