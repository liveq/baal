#!/usr/bin/env python3
"""
위키피디아 덤프 파서 — Windows 호환 (fork 없이 단일 프로세스)
bz2 XML을 스트리밍 파싱하여 카테고리별 문서를 추출한다.
"""

import bz2
import json
import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path

BASE_DIR = Path(__file__).parent
DUMP_PATH = BASE_DIR / "kowiki-dump.xml.bz2"
RAW_DIR = BASE_DIR / "wiki_raw"

# 카테고리별 키워드 (제목 + 본문 매칭)
CATEGORY_KEYWORDS = {
    "B_한국역사": [
        "조선", "고려", "백제", "신라", "고구려", "삼국시대", "발해", "가야",
        "한국 전쟁", "6·25", "임진왜란", "병자호란", "동학", "3·1 운동",
        "일제강점기", "일제 강점기", "광복", "대한민국 임시정부", "세종대왕", "이순신",
        "한국의 역사", "조선왕조", "한국사", "대한제국", "갑오개혁", "을사조약",
        "한일병합", "독립운동", "4·19 혁명", "5·18 광주", "제주 4·3",
        "고조선", "단군", "위만조선", "삼한", "통일신라", "후삼국",
        "경복궁", "창덕궁", "수원화성", "한양", "개성", "평양성",
        "왕건", "태조", "세종", "정조", "영조", "광해군",
        "임진왜란", "정유재란", "나당전쟁", "살수대첩", "한산도대첩",
        "안중근", "윤봉길", "김구", "유관순", "신채호",
    ],
    "D_과학기술": [
        "물리학", "화학", "생물학", "수학", "천문학", "우주", "의학",
        "양자역학", "상대성이론", "원자", "분자", "세포", "유전자", "DNA",
        "진화", "뉴턴", "아인슈타인", "주기율표", "원소", "화학 반응",
        "전자기", "열역학", "광학", "음향학", "핵물리학",
        "바이러스", "세균", "면역", "백신", "항생제", "질병",
        "태양계", "은하", "블랙홀", "빅뱅", "항성", "행성",
        "미적분", "확률", "통계", "기하학", "대수학",
        "노벨상", "과학자", "발명", "발견", "실험",
        "반도체", "나노기술", "생명공학", "로봇", "인공지능",
    ],
    "F_문화예술": [
        "한류", "K-pop", "케이팝", "한국 영화", "한국 드라마", "한국 음악",
        "BTS", "방탄소년단", "블랙핑크", "싸이", "강남스타일",
        "봉준호", "기생충", "박찬욱", "올드보이", "김기덕",
        "한국 문학", "소설가", "시인", "윤동주", "김소월", "이광수",
        "한국 미술", "도자기", "서예", "한복", "탈춤",
        "축구", "야구", "올림픽", "월드컵", "태권도", "e스포츠",
        "김연아", "손흥민", "류현진", "박지성", "이강인",
        "판소리", "사물놀이", "국악", "가야금", "아리랑",
        "유네스코", "문화유산", "종묘", "불국사", "석굴암", "해인사",
        "한식", "김치", "비빔밥", "불고기", "떡볶이",
        "웹툰", "만화", "애니메이션", "게임", "넷플릭스",
    ],
    "G_생활실용": [
        "부동산", "아파트", "전세", "월세", "매매", "주택",
        "세금", "소득세", "부가가치세", "종합소득세", "연말정산",
        "건강", "운동", "다이어트", "영양", "비타민", "수면",
        "요리", "레시피", "음식", "식재료", "조리법",
        "교통", "지하철", "버스", "KTX", "고속도로", "운전면허",
        "보험", "국민연금", "건강보험", "실업급여", "산재보험",
        "대출", "금리", "저축", "투자", "주식", "펀드",
        "취업", "이력서", "면접", "자격증", "공무원",
        "결혼", "출산", "육아", "교육", "입시", "수능",
        "이사", "인테리어", "리모델링", "청소", "정리",
    ],
    "H_IT디지털": [
        "프로그래밍", "소프트웨어", "하드웨어", "컴퓨터", "인터넷",
        "파이썬", "자바", "자바스크립트", "C언어", "프로그래밍 언어",
        "운영 체제", "리눅스", "윈도우", "맥OS", "안드로이드", "iOS",
        "웹 개발", "앱 개발", "데이터베이스", "SQL", "클라우드",
        "인공지능", "머신러닝", "딥러닝", "빅데이터", "블록체인",
        "사이버 보안", "해킹", "암호화", "네트워크", "서버",
        "스마트폰", "태블릿", "노트북", "GPU", "CPU", "메모리",
        "5G", "와이파이", "사물인터넷", "IoT", "가상현실", "VR",
        "삼성전자", "애플", "구글", "마이크로소프트", "네이버", "카카오",
        "유튜브", "페이스북", "인스타그램", "트위터", "틱톡",
    ],
    "I_군사안보": [
        "대한민국 국군", "국군", "육군", "해군", "공군", "해병대",
        "국방", "징병", "병역", "군사", "무기", "미사일",
        "한미동맹", "주한미군", "한미연합", "전시작전권",
        "북한 핵", "핵무기", "탄도미사일", "ICBM", "SLBM",
        "전쟁", "한국 전쟁", "6·25 전쟁", "휴전선", "DMZ", "판문점",
        "특수부대", "특전사", "해군특수전", "UDT", "SEAL",
        "전투기", "F-35", "KF-21", "K2 전차", "K9 자주포",
        "방위사업", "방산", "수출", "무기 체계",
        "NATO", "유엔군", "평화유지군", "해외파병",
        "사이버전", "전자전", "정보전", "군사정보",
    ],
    "J_신비오컬트": [
        "점술", "타로", "사주", "관상", "풍수", "궁합",
        "무속", "무당", "굿", "샤머니즘", "무교",
        "주역", "명리학", "사주팔자", "천간", "지지", "오행",
        "별자리", "점성술", "황도십이궁", "호로스코프",
        "꿈해몽", "해몽", "예지몽", "길몽", "흉몽",
        "초자연", "초능력", "텔레파시", "예언", "노스트라다무스",
        "UFO", "외계인", "미확인 비행 물체", "초자연 현상",
        "귀신", "유령", "심령", "오컬트", "마법",
        "타로 카드", "메이저 아르카나", "마이너 아르카나",
        "수비학", "카발라", "연금술", "신비주의",
    ],
}

# 위키 마크업 제거 정규식
RE_MARKUP = re.compile(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]')  # [[link|text]] → text
RE_REF = re.compile(r'<ref[^>]*>.*?</ref>', re.DOTALL)
RE_REF2 = re.compile(r'<ref[^/]*/>')
RE_TAG = re.compile(r'<[^>]+>')
RE_TEMPLATE = re.compile(r'\{\{[^}]*\}\}')
RE_COMMENT = re.compile(r'<!--.*?-->', re.DOTALL)
RE_HEADING = re.compile(r'^(={2,6})\s*(.+?)\s*\1\s*$', re.MULTILINE)
RE_BOLD_ITALIC = re.compile(r"'{2,5}")
RE_BULLET = re.compile(r'^\*+\s*', re.MULTILINE)
RE_NUMBERED = re.compile(r'^#+\s*', re.MULTILINE)
RE_INDENT = re.compile(r'^:+\s*', re.MULTILINE)
RE_TABLE = re.compile(r'\{\|.*?\|\}', re.DOTALL)
RE_FILE = re.compile(r'\[\[(파일|File|Image|이미지):[^\]]*\]\]', re.IGNORECASE)
RE_CATEGORY = re.compile(r'\[\[(분류|Category):[^\]]*\]\]', re.IGNORECASE)
RE_MULTI_NEWLINE = re.compile(r'\n{3,}')
RE_MULTI_SPACE = re.compile(r' {2,}')


def clean_wikitext(text: str) -> str:
    """위키 마크업을 제거하고 순수 텍스트를 반환."""
    text = RE_COMMENT.sub('', text)
    text = RE_REF.sub('', text)
    text = RE_REF2.sub('', text)
    text = RE_TABLE.sub('', text)
    text = RE_FILE.sub('', text)
    text = RE_CATEGORY.sub('', text)
    text = RE_TEMPLATE.sub('', text)
    text = RE_TAG.sub('', text)
    text = RE_BOLD_ITALIC.sub('', text)
    text = RE_MARKUP.sub(r'\1', text)
    text = RE_BULLET.sub('', text)
    text = RE_NUMBERED.sub('', text)
    text = RE_INDENT.sub('', text)
    text = RE_MULTI_NEWLINE.sub('\n\n', text)
    text = RE_MULTI_SPACE.sub(' ', text)
    return text.strip()


def split_sections(title: str, text: str) -> list[tuple[str, str]]:
    """위키텍스트를 섹션별로 분리. (section_title, section_text) 리스트 반환."""
    sections = []
    headings = list(RE_HEADING.finditer(text))

    if not headings:
        cleaned = clean_wikitext(text)
        if cleaned:
            sections.append(("개요", cleaned))
        return sections

    # 첫 번째 헤딩 전 내용 = 개요
    intro = text[:headings[0].start()]
    cleaned_intro = clean_wikitext(intro)
    if cleaned_intro and len(cleaned_intro) > 30:
        sections.append(("개요", cleaned_intro))

    for i, match in enumerate(headings):
        section_title = match.group(2).strip()
        start = match.end()
        end = headings[i + 1].start() if i + 1 < len(headings) else len(text)
        section_text = text[start:end]
        cleaned = clean_wikitext(section_text)
        if cleaned and len(cleaned) > 30:
            sections.append((section_title, cleaned))

    return sections


def classify_article(title: str, text: str) -> list[str]:
    """문서를 카테고리별로 분류. 여러 카테고리에 속할 수 있음."""
    combined = title + " " + text[:2000]  # 성능을 위해 앞부분만 검사
    categories = []
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in combined:
                categories.append(cat)
                break
    return categories


def parse_dump(max_articles: int = 0, progress_interval: int = 10000):
    """bz2 XML 덤프를 스트리밍 파싱하여 카테고리별 문서를 추출."""
    RAW_DIR.mkdir(exist_ok=True)

    # 카테고리별 파일 핸들
    cat_files = {}
    cat_counts = {}
    for cat in CATEGORY_KEYWORDS:
        fpath = RAW_DIR / f"{cat}.jsonl"
        cat_files[cat] = open(fpath, "w", encoding="utf-8")
        cat_counts[cat] = 0

    total = 0
    matched = 0
    skipped_redirect = 0

    print(f"위키 덤프 파싱 시작: {DUMP_PATH}")
    print(f"출력 디렉토리: {RAW_DIR}")

    with bz2.open(str(DUMP_PATH), "rt", encoding="utf-8") as f:
        # iterparse로 메모리 효율적 파싱
        context = ET.iterparse(f, events=("end",))
        for event, elem in context:
            if not elem.tag.endswith("}page") and elem.tag != "page":
                continue

            # namespace 처리
            ns_prefix = ""
            if "}" in elem.tag:
                ns_prefix = elem.tag.split("}")[0] + "}"

            title_elem = elem.find(f"{ns_prefix}title")
            text_elem = elem.find(f".//{ns_prefix}text")
            ns_elem = elem.find(f"{ns_prefix}ns")

            # ns=0 (일반 문서)만 처리
            if ns_elem is not None and ns_elem.text != "0":
                elem.clear()
                continue

            if title_elem is None or text_elem is None or text_elem.text is None:
                elem.clear()
                continue

            title = title_elem.text.strip()
            text = text_elem.text

            # 리다이렉트 스킵
            if text.startswith("#넘겨주기") or text.startswith("#REDIRECT"):
                skipped_redirect += 1
                elem.clear()
                continue

            total += 1

            # 카테고리 분류
            categories = classify_article(title, text)
            if categories:
                sections = split_sections(title, text)
                for cat in categories:
                    for sec_title, sec_text in sections:
                        doc = {
                            "title": title,
                            "section": sec_title,
                            "text": sec_text,
                            "category": cat,
                        }
                        cat_files[cat].write(json.dumps(doc, ensure_ascii=False) + "\n")
                        cat_counts[cat] += 1
                matched += 1

            if total % progress_interval == 0:
                print(f"  처리: {total:,}문서, 매칭: {matched:,}, 리다이렉트: {skipped_redirect:,}")
                for cat, cnt in sorted(cat_counts.items()):
                    print(f"    {cat}: {cnt:,} 섹션")

            if max_articles and total >= max_articles:
                print(f"  max_articles={max_articles} 도달, 중단")
                break

            elem.clear()

    # 파일 닫기
    for f in cat_files.values():
        f.close()

    print(f"\n파싱 완료!")
    print(f"  총 문서: {total:,}")
    print(f"  매칭 문서: {matched:,}")
    print(f"  리다이렉트 스킵: {skipped_redirect:,}")
    print(f"\n카테고리별 섹션 수:")
    for cat, cnt in sorted(cat_counts.items()):
        print(f"  {cat}: {cnt:,}")

    return cat_counts


if __name__ == "__main__":
    import sys
    max_arts = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    parse_dump(max_articles=max_arts)
