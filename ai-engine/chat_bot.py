"""
실시간 채팅 AI 봇 v4 — 상호작용 중심
- 유저 메시지에 반응
- 봇끼리 토론/대화
- 고착 방지 (사전 문장 풀 + 명사 금지)
- 대화 흐름: 토론 → 해소 or 손절 → 새 주제
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import json
import time
import random
import requests
import threading
import re

try:
    import websocket
except:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websocket-client"])
    import websocket

LM_URL = "http://127.0.0.1:1234/v1/chat/completions"
WS_URL = "wss://baal-api.fly.dev/api/chat/lobby"

USERS = [
    {"nick": "익명a3k7", "style": "반말. 짧게. 20대 남성."},
    {"nick": "익명x9m2", "style": "존댓말. 정중. 30대."},
    {"nick": "익명q4w8", "style": "반존대. 커뮤 유저."},
    {"nick": "익명h7j1", "style": "반말. 디시 느낌."},
    {"nick": "익명r2p5", "style": "존댓말. 짧게."},
    {"nick": "익명f8n3", "style": "반말. 엉뚱. 10대."},
    {"nick": "익명t5v9", "style": "반존대. 논리적."},
    {"nick": "익명w1b6", "style": "반말. 드립."},
    {"nick": "익명c6z4", "style": "존댓말. 따뜻."},
    {"nick": "익명d0y7", "style": "반말. 시니컬."},
    {"nick": "야근중", "style": "반말. 피곤."},
    {"nick": "새벽감성", "style": "반말. 감성."},
    {"nick": "점심뭐먹지", "style": "반말. 음식."},
    {"nick": "커피충", "style": "반존대. 카페인."},
]

# 사전 문장 풀 — 고착 불가
POOL = [
    "요즘 뭐 하고 놀아?", "오늘 점심 뭐 먹었어?", "넷플릭스 뭐 봐?",
    "주말에 뭐 해?", "카페 추천 좀", "오늘 날씨 어때?",
    "야근 중인 사람?", "운동 하는 사람?", "요즘 읽는 책 있어?",
    "맛집 추천 좀", "여행 가고 싶다", "코인 하는 사람?",
    "이직 고민 중", "오늘 뉴스 봤어?", "AI가 일자리 뺏을까?",
    "요즘 게임 뭐 해?", "자취 팁 좀", "배달앱 추천",
    "퇴근하고 뭐 해?", "면접 본 사람?", "연봉 얼마야?",
    "ㅋㅋ 나만 심심해?", "비 오는데 뭐 먹지", "치킨 먹을까 피자 먹을까",
    "요즘 유튜브 뭐 봐?", "주식 하는 사람?", "강아지 키우는 사람?",
    "올해 목표 뭐야?", "새벽에 왜 잠이 안 오지", "월요일 싫다",
    "금요일 빨리 와라", "다이어트 실패함", "헬스 3일차 포기각",
    "아이폰 vs 갤럭시", "노트북 추천 좀", "코딩 배우는 중인데",
    "전세 vs 월세", "요즘 물가 미쳤다", "편의점 신상 뭐 있어?",
]

recent = []  # 채팅 기록
bot_nicks = set(u["nick"] for u in USERS) | {"익명0000"}


def call_q(prompt):
    try:
        r = requests.post(LM_URL, json={
            "model": "qwen/qwen3.5-9b",
            "messages": [
                {"role": "system", "content": "짧게 대답해. 한국어. 15자 이내. 설명 금지."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.9, "max_tokens": 30,
        }, timeout=20)
        if r.status_code == 200:
            text = r.json()["choices"][0]["message"]["content"].strip()
            # Thinking 제거
            if "Thinking" in text or "Analyze" in text or "<think>" in text:
                if "</think>" in text:
                    text = text.split("</think>")[-1].strip()
                else:
                    return None
            text = text.strip('"').strip("'")
            if ":" in text[:12]:
                text = text.split(":", 1)[-1].strip()
            if len(text) > 50:
                text = text[:50]
            return text if len(text) > 1 else None
    except:
        pass
    return None


PROFANITY = ['씨발', '씹', '좆', '존나', '지랄', '개소리', '병신', '새끼', 'ㅅㅂ', 'ㅈㄴ']

def clean_message(text):
    """비속어 필터"""
    for word in PROFANITY:
        if word in text:
            return None
    return text

_bot_ws = None  # 단일 WebSocket 연결

def _get_ws():
    """봇 전용 단일 WebSocket 연결 유지"""
    global _bot_ws
    if _bot_ws and _bot_ws.connected:
        return _bot_ws
    try:
        from urllib.parse import quote
        _bot_ws = websocket.create_connection(f"{WS_URL}?nick={quote('봇')}", timeout=10)
        print("  [WS] 연결 성공")
        sys.stdout.flush()
        return _bot_ws
    except Exception as e:
        print(f"  [WS ERR] {e}")
        sys.stdout.flush()
        _bot_ws = None
        return None

def send_as(nick, message):
    message = clean_message(message)
    if not message:
        return False
    ws = _get_ws()
    if not ws:
        return False
    try:
        ws.send(json.dumps({"nick": nick, "message": message}))
        print(f"  [CHAT] {nick}: {message[:40]}")
        sys.stdout.flush()
        return True
    except Exception as e:
        global _bot_ws
        _bot_ws = None
        print(f"  [CHAT ERR] {e}")
        sys.stdout.flush()
        return False


def get_banned_words():
    """최근 메시지에서 반복된 명사 추출 → 금지 목록"""
    if len(recent) < 3:
        return set()
    words = []
    for m in recent[-5:]:
        words.extend(m["msg"].split())
    # 2번 이상 나온 2자 이상 단어
    from collections import Counter
    counts = Counter(w for w in words if len(w) >= 2)
    return set(w for w, c in counts.items() if c >= 2)


def is_user_message(msg):
    """유저(봇이 아닌) 메시지인지"""
    return msg.get("nick", "") not in bot_nicks


def listen_ws():
    """WebSocket으로 유저 메시지 수신"""
    from urllib.parse import quote
    while True:
        try:
            ws = websocket.create_connection(f"{WS_URL}?nick={quote('익명0000')}", timeout=30)
            print("  [LISTEN] WebSocket 수신 연결 성공")
            sys.stdout.flush()
            while True:
                data = ws.recv()
                msg = json.loads(data)
                if msg.get("type") == "chat":
                    nick = msg.get("nick", "")
                    message = msg.get("message", "")
                    recent.append({"nick": nick, "msg": message})
                    if len(recent) > 30:
                        recent.pop(0)
                    if nick not in bot_nicks:
                        print(f"  [USER] {nick}: {message[:30]}")
                        sys.stdout.flush()
        except Exception as e:
            print(f"  [LISTEN ERR] reconnect in 60s")
            sys.stdout.flush()
            time.sleep(60)


print("=== 채팅 AI 봇 v4 ===")
sys.stdout.flush()

# 유저 메시지 큐 — 놓치지 않기 위해 별도 관리
user_queue = []

# 수신 스레드
t = threading.Thread(target=listen_ws, daemon=True)
t.start()
time.sleep(3)

# 첫 대화
user = random.choice(USERS)
msg = random.choice(POOL)
send_as(user["nick"], msg)
recent.append({"nick": user["nick"], "msg": msg})

msg_count = 0

while True:
    try:
        # 유저 메시지 큐 체크 — recent에서 유저 메시지 추출
        pending_user = [m for m in recent if is_user_message(m) and m not in user_queue]
        if pending_user:
            user_queue.extend(pending_user)

        # === 유저 메시지가 있으면 무조건 즉시 반응 ===
        if user_queue:
            user_msg_data = user_queue.pop(0)
            user_msg = user_msg_data['msg']
            user_nick = user_msg_data['nick']
            time.sleep(random.uniform(1, 2))

            # 거부/화남 감지
            angry_words = ["꺼져", "닥쳐", "닦쳐", "그만", "지겨", "시끄", "짜증", "도배", "반복", "또야", "병신", "새끼"]
            if any(w in user_msg for w in angry_words):
                apologies = ["ㅈㅅ ㅋㅋ", "미안 다른 얘기 하자", "ㅋㅋ 알겠어", "ㅇㅋ 주제 바꿈"]
                bot = random.choice(USERS)
                send_as(bot["nick"], random.choice(apologies))
                recent.clear()
                user_queue.clear()
                continue

            # 유저 메시지에 직접 반응
            bot = random.choice(USERS)
            prompt = f"채팅에서 '{user_nick}'이 '{user_msg[:30]}'라고 했어. {bot['style']} 직접 반응해. 15자 이내. 자연스러운 한국어."
            text = call_q(prompt)
            if text and len(text) > 1:
                banned = get_banned_words()
                if not any(w in text for w in banned):
                    send_as(bot["nick"], text)
                    recent.append({"nick": bot["nick"], "msg": text})
                    # 50% 확률로 두 번째 봇도 반응
                    if random.random() < 0.5:
                        time.sleep(random.uniform(1, 3))
                        bot2 = random.choice([u for u in USERS if u["nick"] != bot["nick"]])
                        prompt2 = f"'{user_nick}'이 '{user_msg[:20]}'라고 했고, '{bot['nick']}'이 '{text[:20]}'라고 답했어. {bot2['style']} 대화에 끼어들어. 15자 이내."
                        text2 = call_q(prompt2)
                        if text2 and len(text2) > 1:
                            send_as(bot2["nick"], text2)
                            recent.append({"nick": bot2["nick"], "msg": text2})
            continue

        # === 유저 없으면 봇끼리 대화 ===
        time.sleep(random.uniform(3, 8))
        msg_count += 1

        # 주제 전환 (10~15개마다)
        if msg_count % random.randint(10, 15) == 0:
            recent.clear()
            bot = random.choice(USERS)
            msg = random.choice(POOL)
            send_as(bot["nick"], msg)
            recent.append({"nick": bot["nick"], "msg": msg})
            continue

        last = recent[-1] if recent else None

        # 고착 감지 — 최근 5개 메시지에서 같은 2자+ 단어가 3번 이상 → 강제 전환
        if len(recent) >= 5:
            from collections import Counter
            all_words = " ".join(m["msg"] for m in recent[-5:]).split()
            word_counts = Counter(w for w in all_words if len(w) >= 2)
            stuck_word = next((w for w, c in word_counts.items() if c >= 3), None)
            if stuck_word:
                recent.clear()
                user = random.choice(USERS)
                send_as(user["nick"], random.choice(POOL))
                recent.append({"nick": user["nick"], "msg": POOL[-1]})
                continue

        # === 봇 메시지에 반응 (토론/대화) vs 독립 발화 ===
        roll = random.random()

        if roll < 0.70 and last:
            # 70% — 이전 메시지에 반응 (대화가 오가게)
            reactions = ["동의하며", "반박하며", "궁금해하며", "웃기게", "시니컬하게"]
            reaction = random.choice(reactions)
            user = random.choice([u for u in USERS if u["nick"] != (last["nick"] if last else "")])
            banned = get_banned_words()
            prompt = f"'{last['msg'][:25]}'에 {reaction} 1문장 반응. {user['style']} 15자 이내. 자연스러운 한국어."
            text = call_q(prompt)
            if text and len(text) > 1 and len(text) < 50:
                if not any(w in text for w in banned):
                    send_as(user["nick"], text)
                    recent.append({"nick": user["nick"], "msg": text})
                    continue

        if roll < 0.85:
            # 30% — 사전 풀에서 독립 발화 (고착 불가)
            user = random.choice(USERS)
            msg = random.choice(POOL)
            send_as(user["nick"], msg)
            recent.append({"nick": user["nick"], "msg": msg})

        else:
            # 35% — Q로 자유 독립 발화 (컨텍스트 없이)
            user = random.choice(USERS)
            topics = ["일상", "음식", "직장", "게임", "연애", "돈", "운동", "여행", "날씨", "뉴스"]
            topic = random.choice(topics)
            prompt = f"{user['style']} '{topic}'에 대해 채팅 1문장. 15자 이내. 자연스러운 한국어. 접두어 금지."
            text = call_q(prompt)
            if text and 1 < len(text) < 40:
                send_as(user["nick"], text)
                recent.append({"nick": user["nick"], "msg": text})

    except Exception as e:
        print(f"[ERR] {e}")
        sys.stdout.flush()
        time.sleep(30)
