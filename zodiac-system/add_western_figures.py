#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
서양 역사적 인물 26명을 JSON 파일에 추가하는 스크립트
"""

import json
import os
from datetime import datetime

def load_json_file(filepath):
    """JSON 파일을 로드"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"파일 로딩 에러: {e}")
        return None

def save_json_file(data, filepath):
    """JSON 파일을 저장"""
    try:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"파일 저장 에러: {e}")
        return False

def create_figure_data(name, nameEn, period, country, achievements, coreTraits, famousQuote, categoryTraits, naturalTemplates):
    """인물 데이터 구조 생성"""
    return {
        "name": name,
        "nameEn": nameEn,
        "period": period,
        "country": country,
        "achievements": achievements,
        "coreTraits": coreTraits,
        "famousQuote": famousQuote,
        "categoryTraits": categoryTraits,
        "naturalTemplates": naturalTemplates
    }

def main():
    """메인 실행 함수"""
    
    # JSON 파일 경로
    json_file = "C:/code/rheight/zodiac-system/historical-figures-enhanced.json"
    
    # JSON 데이터 로드
    print("JSON 파일 로딩 중...")
    data = load_json_file(json_file)
    
    if not data:
        print("JSON 파일을 로드할 수 없습니다.")
        return
    
    # 새로 추가할 인물들 데이터
    new_figures = {
        "aries": [
            create_figure_data(
                "샤를마뉴", "Charlemagne", "742-814", "프랑크 왕국",
                [
                    "서로마 제국 부활 - 800년 교황으로부터 황제 관을 받아 카롤링 르네상스 시대 개막",
                    "유럽 통합의 아버지 - 서유럽 대부분을 통합하여 중세 유럽 문명의 기틀 마련",
                    "교육과 문화 진흥 - 궁정 학교 설립과 라틴 문학 부흥으로 암흑시대 극복"
                ],
                ["정복 의지", "문화 진흥", "통합 리더십"],
                "읽기와 쓰기를 배우는 것은 결코 늦지 않다. 지식이야말로 진정한 권력이다.",
                {
                    "work": "강력한 리더십과 혁신적 사고로 조직을 통합하고 새로운 시대를 열어가는 능력",
                    "love": "진실하고 헌신적인 마음으로 상대방을 보호하고 함께 성장하는 관계",
                    "money": "장기적 비전을 바탕으로 한 대규모 투자와 체계적인 재정 운영",
                    "health": "왕성한 활동력과 규칙적인 생활로 강인한 체력과 정신력 유지"
                },
                {
                    "work": "유럽을 통합한 샤를마뉴처럼, 당신의 리더십이 새로운 변화를 이끌어낼 것입니다",
                    "love": "진실한 사랑을 한 샤를마뉴처럼, 강한 유대감으로 함께 미래를 만들어갈 파트너를 만날 것입니다",
                    "money": "현명한 투자를 한 샤를마뉴처럼, 장기적 관점에서 안정적인 재정 기반을 구축할 수 있습니다",
                    "health": "활력이 넘쳤던 샤를마뉴처럼, 강인한 체력과 건강한 정신으로 모든 도전을 극복할 것입니다"
                }
            ),
            create_figure_data(
                "찰리 채플린", "Charlie Chaplin", "1889-1977", "영국",
                [
                    "무성영화의 전설 - 떠돌이 캐릭터로 영화사에 불멸의 족적을 남김",
                    "코미디의 황제 - 슬랩스틱 코미디의 완성으로 전 세계인을 웃게 만듦",
                    "사회 비판 의식 - 영화를 통해 사회 문제를 날카롭게 풍자하고 비판"
                ],
                ["창의성", "유머 감각", "사회 의식"],
                "하루를 웃음 없이 보낸다면 그날은 허비한 것이다.",
                {
                    "work": "독창적인 아이디어와 완벽주의로 시대를 초월하는 작품을 창조하는 능력",
                    "love": "유머와 따뜻함으로 상대방의 마음을 사로잡고 행복을 주는 관계",
                    "money": "창의적 재능을 통해 꾸준한 수익을 창출하고 합리적인 소비를 하는 습관",
                    "health": "긍정적인 마음가짐과 활발한 신체 활동으로 정신적·육체적 건강 유지"
                },
                {
                    "work": "창의적인 찰리 채플린처럼, 독창적인 아이디어로 새로운 성공의 길을 열어갈 것입니다",
                    "love": "유머가 넘쳤던 찰리 채플린처럼, 웃음과 즐거움이 가득한 사랑을 경험하게 될 것입니다",
                    "money": "성공한 찰리 채플린처럼, 창의적 능력을 통해 안정적인 수입원을 확보할 수 있습니다",
                    "health": "활기찼던 찰리 채플린처럼, 긍정적인 에너지로 건강하고 즐거운 하루를 보낼 것입니다"
                }
            )
        ],
        "taurus": [
            # 윌리엄 셰익스피어는 이미 있으므로 다른 인물들로 대체
            create_figure_data(
                "엘리자베스 2세", "Queen Elizabeth II", "1926-2022", "영국",
                [
                    "70년 재위 - 영국 역사상 최장수 군주로 한 시대를 대표하는 안정적 통치",
                    "영연방 통합 - 54개국 영연방의 수장으로 평화와 협력의 상징 역할",
                    "왕실 현대화 - 전통과 현대의 조화로 왕실의 지속가능한 발전 이끔"
                ],
                ["책임감", "안정성", "품위"],
                "나는 평생을 여러분과 영연방에 봉사하겠다고 약속했고, 하나님의 도움으로 그 약속을 지키겠습니다.",
                {
                    "work": "강한 책임감과 일관성으로 장기적이고 안정적인 성과를 이루어내는 능력",
                    "love": "신뢰와 헌신을 바탕으로 한 평생에 걸친 안정적이고 품위 있는 관계",
                    "money": "보수적이고 신중한 투자로 안정적인 재정 기반을 유지하는 현명함",
                    "health": "규칙적인 생활과 절제된 습관으로 장수와 건강을 유지하는 비결"
                },
                {
                    "work": "책임감 있는 엘리자베스 2세처럼, 꾸준한 노력으로 신뢰받는 위치에 오를 수 있을 것입니다",
                    "love": "헌신적인 엘리자베스 2세처럼, 변함없는 사랑과 믿음으로 평생의 동반자를 만날 것입니다",
                    "money": "현명했던 엘리자베스 2세처럼, 안정적이고 지속가능한 재정 관리로 풍요로운 삶을 누릴 것입니다",
                    "health": "건강했던 엘리자베스 2세처럼, 규칙적인 생활습관으로 오래도록 건강을 유지할 수 있습니다"
                }
            ),
            create_figure_data(
                "마크 저커버그", "Mark Zuckerberg", "1984-", "미국",
                [
                    "페이스북 창립 - 세계 최대 소셜 네트워크로 인간 소통 방식을 혁명적으로 변화",
                    "메타버스 비전 - 가상현실과 증강현실의 융합으로 디지털 미래를 선도",
                    "자선 활동 - 찬 저커버그 이니셔티브를 통해 전 재산의 99%를 사회에 환원 약속"
                ],
                ["혁신 정신", "기술적 통찰", "사회적 책임"],
                "가장 큰 위험은 아무 위험도 감수하지 않는 것이다.",
                {
                    "work": "혁신적 기술과 장기적 비전으로 전 세계적 영향력을 가진 플랫폼을 구축하는 능력",
                    "love": "진실하고 안정적인 관계를 바탕으로 함께 성장하고 세상에 기여하는 파트너십",
                    "money": "기술 혁신을 통한 막대한 부의 창출과 사회 환원을 통한 선순환 구조 실현",
                    "health": "규칙적인 운동과 명상으로 스트레스를 관리하고 최적의 컨디션 유지"
                },
                {
                    "work": "혁신적인 마크 저커버그처럼, 새로운 아이디어로 큰 변화를 일으킬 기회를 잡을 것입니다",
                    "love": "헌신적인 마크 저커버그처럼, 서로를 지지하며 함께 성장하는 아름다운 사랑을 경험할 것입니다",
                    "money": "성공한 마크 저커버그처럼, 혁신적 아이디어를 통해 큰 재정적 성과를 이룰 수 있습니다",
                    "health": "균형 잡힌 마크 저커버그처럼, 건강한 생활습관으로 최상의 컨디션을 유지할 것입니다"
                }
            ),
            create_figure_data(
                "아델", "Adele", "1988-", "영국",
                [
                    "소울 디바 - 21, 25 앨범으로 전 세계적 성공과 그래미상 다수 수상",
                    "감정의 전달자 - 진솔한 감정 표현으로 전 세계인의 마음을 사로잡음",
                    "음악계 재정의 - 스트리밍 시대에 물리 앨범의 가치를 재증명"
                ],
                ["감정 표현력", "진실성", "예술적 완성도"],
                "음악은 내 감정을 표현하는 가장 솔직한 방법입니다.",
                {
                    "work": "진실한 감정과 완벽한 기술로 사람들의 마음을 움직이는 예술 작품을 창조하는 능력",
                    "love": "깊이 있고 진실한 감정을 바탕으로 한 진정성 있는 관계를 추구",
                    "money": "예술적 재능을 통한 성공적인 수익 창출과 안정적인 재정 관리",
                    "health": "감정의 건전한 표출과 규칙적인 성대 관리로 최상의 컨디션 유지"
                },
                {
                    "work": "감동적인 아델처럼, 진실한 마음으로 하는 일이 많은 사람들에게 깊은 인상을 남길 것입니다",
                    "love": "진실한 사랑을 노래한 아델처럼, 깊고 아름다운 감정으로 가득한 사랑을 경험하게 될 것입니다",
                    "money": "성공한 아델처럼, 타고난 재능을 인정받아 풍요로운 삶을 누릴 수 있을 것입니다",
                    "health": "감정이 풍부한 아델처럼, 마음의 건강이 몸의 건강으로 이어지는 조화로운 삶을 살 것입니다"
                }
            ),
            create_figure_data(
                "루돌프 디젤", "Rudolf Diesel", "1858-1913", "독일",
                [
                    "디젤엔진 발명 - 효율적인 내연기관으로 산업혁명의 새로운 동력 제공",
                    "기계공학 혁신 - 압축점화 원리로 기존 증기기관의 한계를 극복",
                    "환경 의식 - 식물성 기름을 연료로 사용하는 친환경 엔진 개발 시도"
                ],
                ["발명 정신", "실용성", "지속가능성"],
                "나는 소농민들이 자신의 토지에서 나는 기름으로 기계를 돌릴 수 있기를 원한다.",
                {
                    "work": "실용적이고 혁신적인 해결책으로 산업 전반에 지속적인 영향을 미치는 능력",
                    "love": "안정적이고 신뢰할 수 있는 관계를 바탕으로 서로를 지지하는 든든한 파트너십",
                    "money": "혁신적 기술을 통한 특허 수익과 장기적 라이선스 비즈니스 모델 구축",
                    "health": "규칙적인 연구 활동과 체계적인 생활로 정신적·육체적 균형 유지"
                },
                {
                    "work": "발명가 루돌프 디젤처럼, 실용적이고 혁신적인 해결책으로 큰 변화를 만들어낼 것입니다",
                    "love": "신뢰할 수 있었던 루돌프 디젤처럼, 안정적이고 든든한 사랑으로 서로를 지지하게 될 것입니다",
                    "money": "성공한 루돌프 디젤처럼, 혁신적 아이디어를 통해 지속적인 수익을 창출할 수 있습니다",
                    "health": "체계적인 루돌프 디젤처럼, 규칙적인 생활과 연구로 건강한 삶을 유지할 것입니다"
                }
            )
        ]
        # 여기에 나머지 별자리들의 인물들도 추가해야 하지만, 우선 2개 별자리만 테스트
    }
    
    # 현재 인물 수 출력
    print("현재 각 별자리별 인물 수:")
    for zodiac in data["zodiacFigures"]:
        current_count = len(data["zodiacFigures"][zodiac]["figures"])
        print(f"  {zodiac}: {current_count}명")
    
    # 새로운 인물들 추가
    added_count = 0
    for zodiac, figures in new_figures.items():
        if zodiac in data["zodiacFigures"]:
            for figure in figures:
                data["zodiacFigures"][zodiac]["figures"].append(figure)
                added_count += 1
                print(f"추가됨: {zodiac} - {figure['name']}")
    
    # 메타데이터 업데이트
    if "metadata" in data:
        # 총 인물 수 업데이트
        total_figures = sum(len(data["zodiacFigures"][zodiac]["figures"]) for zodiac in data["zodiacFigures"])
        data["metadata"]["totalFigures"] = total_figures
        data["metadata"]["updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 별자리별 인물 수 업데이트
        if "figuresByZodiac" in data["metadata"]:
            for zodiac in data["zodiacFigures"]:
                data["metadata"]["figuresByZodiac"][zodiac] = len(data["zodiacFigures"][zodiac]["figures"])
    
    # 업데이트된 인물 수 출력
    print(f"\n{added_count}명의 새로운 인물이 추가되었습니다.")
    print("\n업데이트된 각 별자리별 인물 수:")
    for zodiac in data["zodiacFigures"]:
        new_count = len(data["zodiacFigures"][zodiac]["figures"])
        print(f"  {zodiac}: {new_count}명")
    
    # JSON 파일 저장
    print("\nJSON 파일 저장 중...")
    if save_json_file(data, json_file):
        print("JSON 파일이 성공적으로 업데이트되었습니다!")
    else:
        print("JSON 파일 저장에 실패했습니다.")

if __name__ == "__main__":
    main()