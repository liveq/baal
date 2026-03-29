"""
월간 운세 데이터 생성기 — Q(Qwen)를 사용해서 138개 누락분 생성
기존 6개(zodiac 1~6, 1월) 데이터 품질을 참고
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import json
import time
import requests

SUPABASE_URL = "https://pfgfxvgbnkrbvyzdaeel.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZ2Z4dmdibmtyYnZ5emRhZWVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTEzMywiZXhwIjoyMDg5Njk1MTMzfQ.XrWoQs07kFxXdDEKODu0fzipIIRFfMX7hAwfx9dKnVc"
LM_URL = "http://127.0.0.1:1234/v1/chat/completions"
H = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}

ZODIAC_INFO = {
    1: {"name": "양자리", "en": "Aries", "element": "Fire", "figures": ["Leonardo da Vinci", "Joan of Arc", "진시황"]},
    2: {"name": "황소자리", "en": "Taurus", "element": "Earth", "figures": ["Shakespeare", "Cleopatra", "Karl Marx"]},
    3: {"name": "쌍둥이자리", "en": "Gemini", "element": "Air", "figures": ["Mozart", "Marie Curie", "이순신"]},
    4: {"name": "게자리", "en": "Cancer", "element": "Water", "figures": ["Rembrandt", "Florence Nightingale", "세종대왕"]},
    5: {"name": "사자자리", "en": "Leo", "element": "Fire", "figures": ["Napoleon", "Coco Chanel", "광개토대왕"]},
    6: {"name": "처녀자리", "en": "Virgo", "element": "Earth", "figures": ["Beethoven", "Mother Teresa", "율곡 이이"]},
    7: {"name": "천칭자리", "en": "Libra", "element": "Air", "figures": ["Gandhi", "Oscar Wilde", "신사임당"]},
    8: {"name": "전갈자리", "en": "Scorpio", "element": "Water", "figures": ["Picasso", "Marie Antoinette", "이성계"]},
    9: {"name": "사수자리", "en": "Sagittarius", "element": "Fire", "figures": ["Mark Twain", "Catherine the Great", "장보고"]},
    10: {"name": "염소자리", "en": "Capricorn", "element": "Earth", "figures": ["Isaac Newton", "Rosa Parks", "정약용"]},
    11: {"name": "물병자리", "en": "Aquarius", "element": "Air", "figures": ["Edison", "Amelia Earhart", "안창호"]},
    12: {"name": "물고기자리", "en": "Pisces", "element": "Water", "figures": ["Michelangelo", "Anne Frank", "원효대사"]},
}

MONTH_NAMES = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",
               7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}

MONTH_THEMES_KR = {
    1: "새해 시작", 2: "설날/발렌타인", 3: "봄의 시작/삼일절",
    4: "벚꽃/새학기", 5: "어린이날/어버이날", 6: "여름 시작/현충일",
    7: "여름 휴가/초복", 8: "말복/광복절", 9: "추석/가을",
    10: "단풍/한글날", 11: "수능/빼빼로데이", 12: "크리스마스/연말"
}


def call_q(prompt):
    try:
        r = requests.post(LM_URL, json={
            "model": "qwen/qwen3.5-9b",
            "messages": [
                {"role": "system", "content": "You are a JSON generator. Output ONLY valid JSON. No thinking, no explanation, no markdown. Just pure JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7, "max_tokens": 800,
        }, timeout=60)
        if r.status_code == 200:
            text = r.json()["choices"][0]["message"]["content"].strip()
            # Remove thinking tags/text
            if "<think>" in text:
                text = text.split("</think>")[-1].strip()
            if "Thinking Process" in text:
                # Find first { character
                idx = text.find("{")
                if idx >= 0:
                    text = text[idx:]
            # Extract JSON from markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            # Find JSON object
            if not text.startswith("{"):
                idx = text.find("{")
                if idx >= 0:
                    text = text[idx:]
            # Find closing brace
            depth = 0
            end = -1
            for i, c in enumerate(text):
                if c == "{": depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break
            if end > 0:
                text = text[:end]
            return text
    except Exception as e:
        print(f"  [Q ERROR] {e}")
    return None


def generate_fortune(zodiac_id, month):
    z = ZODIAC_INFO[zodiac_id]
    month_name = MONTH_NAMES[month]
    theme_kr = MONTH_THEMES_KR[month]
    figures = ", ".join(z["figures"])

    prompt = f"""한국어로 {z["name"]}({z["en"]})의 2025년 {month}월({month_name}) 월간 운세를 JSON으로 만들어.

참고할 역사적 인물: {figures}
원소: {z["element"]}
한국 문화 테마: {theme_kr}

다음 JSON 형식으로 정확히 출력해. 설명 없이 JSON만:
{{
  "overall_fortune": "역사적 인물 메타포를 활용한 종합운 (2~3문장, 한국어)",
  "overall_score": 60~95 사이 정수,
  "love_fortune": "애정운 (1~2문장)",
  "love_score": 60~95,
  "money_fortune": "금전운 (1~2문장)",
  "money_score": 60~95,
  "work_fortune": "직장운 (1~2문장)",
  "work_score": 60~95,
  "health_fortune": "건강운 (1~2문장)",
  "health_score": 60~95,
  "monthly_theme": "영어 테마 - 한국어 부제",
  "key_dates": ["2025-{month:02d}-xx", "2025-{month:02d}-xx", "2025-{month:02d}-xx"],
  "lucky_colors": ["색상1", "색상2", "색상3"],
  "lucky_numbers": [숫자1, 숫자2, 숫자3, 숫자4],
  "lucky_times": ["시간대1", "시간대2", "시간대3"],
  "lucky_stones": ["보석1", "보석2", "보석3"],
  "lucky_directions": ["방향1", "방향2"],
  "monthly_mantra": "이번 달의 모토 (한국어, 역사적 인물 언급)",
  "personal_growth_focus": "성장 포인트 (한 줄)",
  "relationship_outlook": "관계 전망 (한 줄)",
  "financial_forecast": "재정 전망 (한 줄)",
  "health_recommendations": "건강 조언 (한 줄)",
  "spiritual_guidance": "영적 안내 (한 줄)"
}}"""

    result = call_q(prompt)
    if not result:
        return None

    # JSON 파싱
    try:
        # JSON 블록 추출
        if "```json" in result:
            result = result.split("```json")[1].split("```")[0]
        elif "```" in result:
            result = result.split("```")[1].split("```")[0]

        data = json.loads(result)
        # 필수 필드 검증
        required = ["overall_fortune", "overall_score", "love_fortune", "monthly_theme"]
        if not all(k in data for k in required):
            print(f"  [SKIP] 필수 필드 누락")
            return None

        # DB 행 구성
        row = {
            "zodiac_id": zodiac_id,
            "year": 2025,
            "month": month,
            "month_name": month_name,
            **data
        }
        return row
    except json.JSONDecodeError as e:
        print(f"  [JSON ERROR] {e}")
        return None


def insert_to_db(row):
    r = requests.post(f"{SUPABASE_URL}/rest/v1/monthly_fortunes_data", json=row, headers=H, timeout=30)
    return r.status_code in (200, 201)


def main():
    # 이미 있는 데이터 확인
    existing = requests.get(
        f"{SUPABASE_URL}/rest/v1/monthly_fortunes_data?select=zodiac_id,month",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
        timeout=15
    ).json()
    existing_set = {(r["zodiac_id"], r["month"]) for r in existing}
    print(f"기존 데이터: {len(existing_set)}개")

    total = 0
    errors = 0

    for zodiac_id in range(1, 13):
        for month in range(1, 13):
            if (zodiac_id, month) in existing_set:
                continue

            z = ZODIAC_INFO[zodiac_id]
            print(f"[{zodiac_id}:{z['name']}] {month}월 생성 중...", end=" ")
            sys.stdout.flush()

            row = generate_fortune(zodiac_id, month)
            if row and insert_to_db(row):
                total += 1
                print(f"OK ({total}개)")
            else:
                errors += 1
                print(f"FAIL")

            # Q 과부하 방지 — 엔진과 Q 공유하므로 간격 두기
            time.sleep(3)

    print(f"\n완료: {total}개 생성, {errors}개 실패")


if __name__ == "__main__":
    main()
