#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import copy

def add_missing_figures():
    """부족한 별자리에 새로운 역사적 인물을 추가하는 함수"""
    
    # 정리된 데이터 로드
    with open('historical-figures-enhanced-cleaned.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 추가할 인물들 정의
    new_figures = {
        'scorpio': [
            {
                "name": "마리 퀴리",
                "nameEn": "Marie Curie",
                "period": "1867-1934",
                "country": "폴란드/프랑스",
                "achievements": [
                    "최초로 노벨상을 두 번 수상 - 물리학상(1903)과 화학상(1911)",
                    "방사능 연구의 선구자 - 라듐과 폴로늄 발견",
                    "여성 과학자의 상징 - 과학계 성차별을 극복한 위대한 인물"
                ],
                "coreTraits": ["탐구정신", "강인한 의지", "헌신"],
                "famousQuote": "인생에서 두려워할 것은 아무것도 없다. 단지 이해해야 할 뿐이다.",
                "categoryTraits": {
                    "work": "깊이 있는 연구와 끈질긴 탐구로 불가능을 가능하게 만드는 힘",
                    "love": "동등한 파트너십을 추구하며, 지적 교감을 중시하는 관계",
                    "money": "연구를 위해서는 기꺼이 투자하며, 물질보다는 가치 창조 중시",
                    "health": "강인한 정신력이 육체적 한계도 극복하게 해주는 원동력"
                }
            },
            {
                "name": "파블로 피카소",
                "nameEn": "Pablo Picasso",
                "period": "1881-1973",
                "country": "스페인",
                "achievements": [
                    "입체파 창시 - 20세기 현대 미술의 혁신적 전환점",
                    "게르니카 창작 - 전쟁의 참혹함을 고발한 20세기 최고 걸작",
                    "다양한 예술 양식 실험 - 청색시대, 장미시대 등 끊임없는 변신"
                ],
                "coreTraits": ["창조적 혁신", "강렬한 표현력", "예술적 열정"],
                "famousQuote": "나는 찾지 않는다. 나는 발견한다.",
                "categoryTraits": {
                    "work": "기존 틀을 파괴하고 새로운 창작 영역을 개척하는 혁신가",
                    "love": "열정적이고 강렬한 사랑을 추구하며, 예술적 영감을 주고받는 관계",
                    "money": "예술적 가치가 경제적 성공으로 이어지는 완벽한 조화 달성",
                    "health": "창작 활동 자체가 생명력의 원천이며, 표현할 때 가장 건강함"
                }
            },
            {
                "name": "시어도어 루스벨트",
                "nameEn": "Theodore Roosevelt",
                "period": "1858-1919",
                "country": "미국",
                "achievements": [
                    "미국 26대 대통령 - 최연소 대통령 기록(42세)",
                    "노벨평화상 수상 - 러일전쟁 중재로 평화 구축",
                    "국립공원 확장 - 자연보호 정책의 아버지"
                ],
                "coreTraits": ["모험정신", "강인한 리더십", "개혁 의지"],
                "famousQuote": "할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다.",
                "categoryTraits": {
                    "work": "강력한 추진력과 변화를 이끄는 리더십으로 조직 혁신 주도",
                    "love": "진실하고 깊은 사랑을 바탕으로 한 든든한 가정 구축",
                    "money": "공익을 우선시하며, 사회적 가치 창출을 위한 투자",
                    "health": "활동적인 생활과 강인한 정신력으로 건강한 몸과 마음 유지"
                }
            }
        ],
        'sagittarius': [
            {
                "name": "윈스턴 처칠",
                "nameEn": "Winston Churchill",
                "period": "1874-1965",
                "country": "영국",
                "achievements": [
                    "제2차 대전 영국 총리 - 나치 독일에 맞선 불굴의 지도자",
                    "노벨문학상 수상 - 뛰어난 연설문과 역사서 집필",
                    "철의 장막 연설 - 냉전 시대의 서막을 알린 역사적 연설"
                ],
                "coreTraits": ["불굴의 의지", "웅변술", "전략적 사고"],
                "famousQuote": "성공이란 실패에서 실패로 옮겨가되 열정을 잃지 않는 능력이다.",
                "categoryTraits": {
                    "work": "위기 상황에서 빛나는 리더십과 장기적 비전으로 조직 이끔",
                    "love": "평생 아내와의 깊은 사랑으로 든든한 내적 지지 기반 구축",
                    "money": "국가와 대의를 위한 투자를 아끼지 않는 공익 우선주의",
                    "health": "강한 정신력과 목적 의식이 신체 건강을 뒷받침하는 원동력"
                }
            },
            {
                "name": "베토벤",
                "nameEn": "Ludwig van Beethoven",
                "period": "1770-1827",
                "country": "독일",
                "achievements": [
                    "9번 교향곡 '환희의 송가' - 인류애를 노래한 불멸의 걸작",
                    "청각 장애 극복 - 들리지 않는 상황에서도 위대한 음악 창작",
                    "고전파에서 낭만파로 - 음악사의 전환점을 만든 혁신적 작곡가"
                ],
                "coreTraits": ["예술적 천재성", "불굴의 정신", "혁신적 창조력"],
                "famousQuote": "음악은 정신과 감각의 세계를 잇는 다리가 되어야 한다.",
                "categoryTraits": {
                    "work": "역경을 딛고 일어서는 불굴의 의지로 예술적 혁신을 이룸",
                    "love": "깊고 순수한 사랑을 추구하나 예술에 대한 헌신으로 복잡한 연애",
                    "money": "예술적 가치를 최우선시하며, 생계보다는 작품 완성에 집중",
                    "health": "신체적 한계를 정신력으로 극복하며, 음악이 치유의 원천"
                }
            }
        ],
        'aquarius': [
            {
                "name": "토마스 에디슨",
                "nameEn": "Thomas Edison",
                "period": "1847-1931",
                "country": "미국",
                "achievements": [
                    "전구 발명 - 인류의 밤을 밝힌 혁신적 발명품",
                    "1,093개 특허 보유 - 역사상 최다 특허 보유자",
                    "멘로파크 연구소 설립 - 현대적 연구개발의 모델 제시"
                ],
                "coreTraits": ["발명 천재", "실용주의", "끈기"],
                "famousQuote": "천재는 1%의 영감과 99%의 노력이다.",
                "categoryTraits": {
                    "work": "혁신적 아이디어와 실용적 접근으로 새로운 산업 분야 개척",
                    "love": "가정적인 면모와 배우자에 대한 깊은 사랑으로 안정된 결혼생활",
                    "money": "발명을 통한 가치 창출로 경제적 성공과 사회 발전 동시 달성",
                    "health": "규칙적인 생활과 지속적인 정신 활동이 건강 유지의 비결"
                }
            },
            {
                "name": "모차르트",
                "nameEn": "Wolfgang Amadeus Mozart",
                "period": "1756-1791",
                "country": "오스트리아",
                "achievements": [
                    "600여 곡 작곡 - 짧은 생애에도 불구하고 방대한 작품 완성",
                    "오페라 '마술피리' - 독일어 오페라의 최고 걸작",
                    "천재 음악가 - 5세부터 작곡을 시작한 신동"
                ],
                "coreTraits": ["음악적 천재성", "순수성", "자유로운 영혼"],
                "famousQuote": "음악은 침묵하는 순간에도 들려야 한다.",
                "categoryTraits": {
                    "work": "타고난 재능과 순수한 열정으로 예술의 경지를 극한까지 끌어올림",
                    "love": "순수하고 진실한 사랑을 추구하며, 음악적 교감을 중시",
                    "money": "예술적 완성도를 우선시하며, 경제적 현실과의 균형점 모색",
                    "health": "음악 창작이 생명력의 원천이나, 과도한 몰입으로 건강 관리 필요"
                }
            }
        ],
        'pisces': [
            {
                "name": "조지 워싱턴",
                "nameEn": "George Washington",
                "period": "1732-1799",
                "country": "미국",
                "achievements": [
                    "미국 초대 대통령 - 신생국 미국의 기초를 다진 건국의 아버지",
                    "독립전쟁 승리 - 대륙군 총사령관으로 영국과의 전쟁에서 승리",
                    "대통령직 자진 사퇴 - 권력의 평화적 이양을 실현한 민주주의 모범"
                ],
                "coreTraits": ["강인한 리더십", "희생정신", "도덕적 품격"],
                "famousQuote": "진실은 항상 승리하며, 거짓보다 강하다.",
                "categoryTraits": {
                    "work": "희생정신과 도덕적 리더십으로 조직과 국가의 토대를 구축",
                    "love": "평생 한 사람과의 깊은 사랑으로 안정된 가정 생활 유지",
                    "money": "개인적 이익보다는 공익을 우선시하는 무사무욕의 경제관",
                    "health": "강한 책임감과 사명감이 신체적 한계를 극복하게 하는 원동력"
                }
            }
        ]
    }
    
    # 데이터 추가
    added_count = 0
    for zodiac_id, figures in new_figures.items():
        for figure in figures:
            data['zodiacFigures'][zodiac_id]['figures'].append(figure)
            added_count += 1
            print(f"추가: {zodiac_id}에 {figure['name']} 추가됨")
    
    # 새로운 통계 계산
    new_total = sum([len(zodiac['figures']) for zodiac in data['zodiacFigures'].values()])
    
    # 메타데이터 업데이트
    data['metadata']['totalFigures'] = new_total
    data['metadata']['updated'] = '2025-01-11'
    data['metadata']['version'] = '5.0'
    
    # figuresByZodiac 업데이트
    zodiac_names = {
        'aries': '양자리', 'taurus': '황소자리', 'gemini': '쌍둥이자리',
        'cancer': '게자리', 'leo': '사자자리', 'virgo': '처녀자리',
        'libra': '천칭자리', 'scorpio': '전갈자리', 'sagittarius': '궁수자리',
        'capricorn': '염소자리', 'aquarius': '물병자리', 'pisces': '물고기자리'
    }
    
    print(f"\n=== 보강 후 별자리별 분포 ===")
    for zodiac_id, zodiac_data in data['zodiacFigures'].items():
        count = len(zodiac_data['figures'])
        data['metadata']['figuresByZodiac'][zodiac_id] = count
        print(f'{zodiac_names[zodiac_id]:8} | {count:2d}명')
    
    print(f"\n총 {added_count}명 추가됨")
    print(f"전체 인물 수: {new_total}명")
    
    # 최종 데이터 저장
    with open('historical-figures-enhanced-final.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n최종 데이터가 'historical-figures-enhanced-final.json'에 저장되었습니다.")
    return data

if __name__ == "__main__":
    add_missing_figures()