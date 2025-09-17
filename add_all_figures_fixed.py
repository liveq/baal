#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from collections import defaultdict

def count_current_figures(data):
    """현재 각 별자리별 인물 수 계산"""
    counts = {}
    total = 0
    
    for zodiac_name, zodiac_data in data['zodiacFigures'].items():
        if 'figures' in zodiac_data:
            count = len(zodiac_data['figures'])
            counts[zodiac_name] = count
            total += count
    
    return counts, total

def get_additional_figures():
    """추가할 인물 데이터"""
    return {
        'aries': [
            {
                "name": "넬슨 만델라",
                "nameEn": "Nelson Mandela",
                "period": "1918-2013",
                "country": "남아프리카공화국",
                "achievements": [
                    "아파르트헤이트 종식",
                    "남아공 최초 흑인 대통령",
                    "노벨 평화상 수상"
                ],
                "coreTraits": ["정의감", "용기", "화해"],
                "famousQuote": "불가능해 보이는 일도 그것이 이루어질 때까지는 불가능한 것이다.",
                "categoryTraits": {
                    "work": "불의에 맞서는 용기와 정의를 위한 투쟁",
                    "love": "화해와 용서를 통한 진정한 사랑의 실천",
                    "money": "권력보다 원칙을 중시하는 청렴한 리더십",
                    "health": "27년의 감옥생활을 견딘 강인한 정신력"
                },
                "naturalTemplates": {
                    "work": "아파르트헤이트에 맞선 넬슨 만델라처럼, 오늘 직장에서 불의한 상황에 당당히 맞서고 정의로운 결정을 내릴 수 있는 용기가 생길 것입니다",
                    "love": "화해를 이끈 넬슨 만델라처럼, 오래된 갈등을 용서와 이해로 풀어내며 관계에 새로운 평화와 사랑이 찾아올 것입니다",
                    "money": "청렴했던 넬슨 만델라처럼, 돈보다 원칙을 지키는 선택이 장기적으로 더 큰 신뢰와 경제적 안정을 가져다줄 것입니다",
                    "health": "강인했던 넬슨 만델라처럼, 어려운 환경에서도 정신력을 잃지 않고 건강한 마음가짐을 유지할 수 있을 것입니다"
                }
            },
            {
                "name": "마거릿 대처",
                "nameEn": "Margaret Thatcher",
                "period": "1925-2013",
                "country": "영국",
                "achievements": [
                    "영국 최초 여성 총리",
                    "철의 여인",
                    "영국 경제 개혁"
                ],
                "coreTraits": ["결단력", "강인함", "신념"],
                "famousQuote": "생각을 조심하라, 그것이 말이 된다. 말을 조심하라, 그것이 행동이 된다.",
                "categoryTraits": {
                    "work": "흔들리지 않는 신념과 강력한 리더십",
                    "love": "원칙을 지키며 보여주는 일관된 사랑",
                    "money": "과감한 개혁을 통한 경제적 성장",
                    "health": "철의 의지로 유지하는 건강 관리"
                },
                "naturalTemplates": {
                    "work": "철의 여인 마거릿 대처처럼, 오늘 중요한 결정 앞에서 흔들리지 않는 신념과 결단력으로 강력한 리더십을 발휘할 것입니다",
                    "love": "일관된 마거릿 대처처럼, 감정에 휘둘리지 않고 원칙을 지키며 상대방에게 신뢰받는 사랑을 보여줄 수 있을 것입니다",
                    "money": "개혁을 이끈 마거릿 대처처럼, 과감한 재정 결정과 투자 전략으로 경제적 성장의 전환점을 만들어낼 것입니다",
                    "health": "강인했던 마거릿 대처처럼, 철저한 자기관리와 규칙적인 생활로 건강을 지켜나갈 수 있을 것입니다"
                }
            }
        ],
        'taurus': [
            {
                "name": "오드리 헵번",
                "nameEn": "Audrey Hepburn",
                "period": "1929-1993",
                "country": "영국/벨기에",
                "achievements": [
                    "아카데미상 수상 배우",
                    "유니세프 친선대사",
                    "스타일 아이콘"
                ],
                "coreTraits": ["우아함", "선함", "겸손"],
                "famousQuote": "아름다운 입술을 갖고 싶으면 친절한 말을 하라.",
                "categoryTraits": {
                    "work": "우아함과 프로페셔널리즘의 조화",
                    "love": "진정성 있는 사랑과 헌신",
                    "money": "검소하면서도 품격 있는 소비",
                    "health": "내면의 아름다움을 가꾸는 건강한 삶"
                },
                "naturalTemplates": {
                    "work": "우아했던 오드리 헵번처럼, 오늘 직장에서 품격과 친절함으로 모든 사람에게 좋은 인상을 남기게 될 것입니다",
                    "love": "헌신적이었던 오드리 헵번처럼, 진정성 있는 마음과 따뜻한 배려로 사랑하는 사람과 더 깊은 유대를 형성할 것입니다",
                    "money": "검소했던 오드리 헵번처럼, 허영에 흔들리지 않고 진정한 가치에 투자하는 현명한 소비를 하게 될 것입니다",
                    "health": "아름다웠던 오드리 헵번처럼, 내면의 평화와 외면의 건강이 조화를 이루는 균형잡힌 하루가 될 것입니다"
                }
            },
            {
                "name": "데이비드 베컴",
                "nameEn": "David Beckham",
                "period": "1975-",
                "country": "영국",
                "achievements": [
                    "맨체스터 유나이티드 레전드",
                    "잉글랜드 대표팀 주장",
                    "글로벌 스포츠 아이콘"
                ],
                "coreTraits": ["끈기", "스타일", "가족애"],
                "famousQuote": "열심히 일하면 꿈은 이루어진다.",
                "categoryTraits": {
                    "work": "끊임없는 노력과 프로페셔널리즘",
                    "love": "가족을 최우선으로 하는 헌신적인 사랑",
                    "money": "재능을 브랜드로 만드는 비즈니스 감각",
                    "health": "철저한 자기관리와 운동"
                },
                "naturalTemplates": {
                    "work": "프로였던 데이비드 베컴처럼, 오늘 맡은 일에 최선을 다하며 완벽한 결과를 만들어낼 것입니다",
                    "love": "가족을 사랑한 데이비드 베컴처럼, 소중한 사람들과 함께하는 시간을 최우선으로 두는 하루가 될 것입니다",
                    "money": "사업가 데이비드 베컴처럼, 자신의 재능과 능력을 가치 있는 자산으로 전환시킬 기회를 발견할 것입니다",
                    "health": "운동선수 데이비드 베컴처럼, 규칙적인 운동과 건강한 식습관으로 최상의 컨디션을 유지할 것입니다"
                }
            }
        ],
        'gemini': [
            {
                "name": "마릴린 먼로",
                "nameEn": "Marilyn Monroe",
                "period": "1926-1962",
                "country": "미국",
                "achievements": [
                    "할리우드 황금기 아이콘",
                    "대중문화 영원한 상징",
                    "여성 해방의 선구자"
                ],
                "coreTraits": ["매력", "취약함", "이중성"],
                "famousQuote": "불완전함은 아름다움이고, 광기는 천재성이며, 지루한 것보다는 터무니없는 것이 낫다.",
                "categoryTraits": {
                    "work": "대중을 사로잡는 카리스마와 재능",
                    "love": "순수한 사랑에 대한 갈망과 추구",
                    "money": "화려함 속의 불안정한 재정 관리",
                    "health": "외면의 화려함과 내면의 연약함"
                },
                "naturalTemplates": {
                    "work": "카리스마 있던 마릴린 먼로처럼, 오늘 당신의 독특한 매력과 재능으로 모든 사람의 시선을 사로잡을 것입니다",
                    "love": "순수했던 마릴린 먼로처럼, 진정한 사랑을 갈망하는 마음이 예상치 못한 로맨틱한 순간을 만들어낼 것입니다",
                    "money": "화려했던 마릴린 먼로처럼, 오늘은 자신에게 작은 사치를 허락하되 미래를 위한 저축도 잊지 않을 것입니다",
                    "health": "섬세했던 마릴린 먼로처럼, 겉모습뿐 아니라 내면의 건강과 정신적 안정에도 관심을 기울이는 하루가 될 것입니다"
                }
            },
            {
                "name": "밥 딜런",
                "nameEn": "Bob Dylan",
                "period": "1941-",
                "country": "미국",
                "achievements": [
                    "노벨 문학상 수상",
                    "포크 록의 전설",
                    "시대를 대변한 음유시인"
                ],
                "coreTraits": ["시적감성", "변화", "자유"],
                "famousQuote": "답은 바람 속에 있다.",
                "categoryTraits": {
                    "work": "끊임없는 창작과 혁신",
                    "love": "자유로운 영혼의 사랑",
                    "money": "예술적 가치를 경제적 성공으로",
                    "health": "방랑자의 자유로운 삶"
                },
                "naturalTemplates": {
                    "work": "창의적인 밥 딜런처럼, 오늘 기존의 틀을 깨는 혁신적인 아이디어로 새로운 돌파구를 찾을 것입니다",
                    "love": "자유로운 밥 딜런처럼, 구속받지 않는 사랑 속에서 서로의 개성을 존중하는 관계를 만들어갈 것입니다",
                    "money": "예술가 밥 딜런처럼, 당신의 창의적 재능이 예상치 못한 경제적 기회로 연결될 것입니다",
                    "health": "방랑자 밥 딜런처럼, 일상의 스트레스에서 벗어나 자유로운 산책이나 여행이 건강에 활력을 줄 것입니다"
                }
            }
        ],
        'cancer': [
            {
                "name": "다이애나 왕세자비",
                "nameEn": "Princess Diana",
                "period": "1961-1997",
                "country": "영국",
                "achievements": [
                    "국민의 왕세자비",
                    "인도주의 활동가",
                    "지뢰 금지 운동"
                ],
                "coreTraits": ["자비", "공감", "진정성"],
                "famousQuote": "나는 사람들의 마음속 여왕이 되고 싶다.",
                "categoryTraits": {
                    "work": "진심 어린 봉사와 헌신",
                    "love": "깊은 사랑과 상처받기 쉬운 마음",
                    "money": "자선과 나눔을 실천하는 부",
                    "health": "정서적 상처와 치유의 여정"
                },
                "naturalTemplates": {
                    "work": "헌신적이었던 다이애나비처럼, 오늘 진심 어린 노력과 공감으로 동료들에게 긍정적인 영향을 미칠 것입니다",
                    "love": "사랑했던 다이애나비처럼, 깊고 진정한 감정을 표현하며 상대방과 더욱 가까워지는 하루가 될 것입니다",
                    "money": "나눔을 실천한 다이애나비처럼, 오늘 작은 기부나 나눔이 큰 기쁨과 복으로 돌아올 것입니다",
                    "health": "민감했던 다이애나비처럼, 정서적 안정을 위한 명상이나 상담이 전반적인 건강 개선에 도움이 될 것입니다"
                }
            },
            {
                "name": "톰 행크스",
                "nameEn": "Tom Hanks",
                "period": "1956-",
                "country": "미국",
                "achievements": [
                    "아카데미상 2회 수상",
                    "미국의 아빠",
                    "할리우드 신사"
                ],
                "coreTraits": ["따뜻함", "신뢰", "겸손"],
                "famousQuote": "인생은 초콜릿 상자와 같다. 무엇을 얻을지 모른다.",
                "categoryTraits": {
                    "work": "성실함과 프로페셔널리즘",
                    "love": "안정적이고 따뜻한 가정",
                    "money": "검소하고 현명한 투자",
                    "health": "긍정적 마인드와 건강한 생활"
                },
                "naturalTemplates": {
                    "work": "신뢰받는 톰 행크스처럼, 오늘 성실하고 진정성 있는 태도로 모든 사람의 존경을 받게 될 것입니다",
                    "love": "따뜻한 톰 행크스처럼, 가족과 함께하는 소소한 순간들이 큰 행복으로 다가올 것입니다",
                    "money": "현명한 톰 행크스처럼, 충동적 소비를 피하고 장기적 관점의 투자 결정을 내릴 것입니다",
                    "health": "긍정적인 톰 행크스처럼, 웃음과 유머가 스트레스를 해소하고 면역력을 높여줄 것입니다"
                }
            }
        ],
        'leo': [
            {
                "name": "코코 샤넬",
                "nameEn": "Coco Chanel",
                "period": "1883-1971",
                "country": "프랑스",
                "achievements": [
                    "샤넬 브랜드 창립",
                    "여성 패션 혁명",
                    "샤넬 No.5 향수"
                ],
                "coreTraits": ["독립성", "우아함", "혁신"],
                "famousQuote": "패션은 사라지지만 스타일은 영원하다.",
                "categoryTraits": {
                    "work": "독창적 비전과 완벽주의",
                    "love": "독립적이면서도 열정적인 사랑",
                    "money": "럭셔리 브랜드 제국 건설",
                    "health": "우아한 라이프스타일 유지"
                },
                "naturalTemplates": {
                    "work": "혁신적인 코코 샤넬처럼, 오늘 독창적인 아이디어로 업계의 판도를 바꿀 만한 성과를 이룰 것입니다",
                    "love": "독립적인 코코 샤넬처럼, 자신의 정체성을 지키면서도 열정적인 사랑을 추구하게 될 것입니다",
                    "money": "사업가 코코 샤넬처럼, 품질과 브랜드 가치에 대한 투자가 큰 수익으로 이어질 것입니다",
                    "health": "우아한 코코 샤넬처럼, 스타일과 건강을 동시에 챙기는 세련된 라이프스타일을 실천할 것입니다"
                }
            },
            {
                "name": "제니퍼 로렌스",
                "nameEn": "Jennifer Lawrence",
                "period": "1990-",
                "country": "미국",
                "achievements": [
                    "아카데미상 수상",
                    "헝거게임 주연",
                    "할리우드 최고 개런티 여배우"
                ],
                "coreTraits": ["자연스러움", "재치", "당당함"],
                "famousQuote": "나는 내가 좋아하는 일을 하며 살고 싶다.",
                "categoryTraits": {
                    "work": "타고난 재능과 노력의 조화",
                    "love": "솔직하고 자연스러운 관계",
                    "money": "젊은 나이의 큰 성공",
                    "health": "자연체로 살아가는 건강함"
                },
                "naturalTemplates": {
                    "work": "재능 있는 제니퍼 로렌스처럼, 오늘 당신의 실력이 빛을 발하며 큰 인정을 받게 될 것입니다",
                    "love": "솔직한 제니퍼 로렌스처럼, 꾸밈없는 진솔한 모습으로 상대방과 더 가까워질 것입니다",
                    "money": "성공한 제니퍼 로렌스처럼, 젊은 나이에도 큰 재정적 기회를 잡을 수 있을 것입니다",
                    "health": "자연스러운 제니퍼 로렌스처럼, 무리한 다이어트보다 건강한 식습관으로 활력을 유지할 것입니다"
                }
            }
        ],
        'virgo': [
            {
                "name": "마더 테레사",
                "nameEn": "Mother Teresa",
                "period": "1910-1997",
                "country": "알바니아/인도",
                "achievements": [
                    "노벨 평화상 수상",
                    "사랑의 선교회 설립",
                    "빈민 구호 활동"
                ],
                "coreTraits": ["봉사", "헌신", "겸손"],
                "famousQuote": "우리는 위대한 일을 할 수 없다. 다만 위대한 사랑으로 작은 일을 할 뿐이다.",
                "categoryTraits": {
                    "work": "끝없는 봉사와 희생정신",
                    "love": "무조건적 사랑의 실천",
                    "money": "물질보다 영적 가치 추구",
                    "health": "정신적 평화와 단순한 삶"
                },
                "naturalTemplates": {
                    "work": "헌신적인 마더 테레사처럼, 오늘 작은 일에도 최선을 다하며 큰 의미를 만들어낼 것입니다",
                    "love": "사랑을 실천한 마더 테레사처럼, 조건 없는 사랑과 배려로 주변을 따뜻하게 만들 것입니다",
                    "money": "검소했던 마더 테레사처럼, 물질적 욕심을 내려놓고 진정한 가치에 집중하게 될 것입니다",
                    "health": "평화로웠던 마더 테레사처럼, 마음의 평정을 유지하며 정신적 건강을 지킬 것입니다"
                }
            },
            {
                "name": "워런 버핏",
                "nameEn": "Warren Buffett",
                "period": "1930-",
                "country": "미국",
                "achievements": [
                    "오마하의 현인",
                    "버크셔 해서웨이 CEO",
                    "세계 최고 부자"
                ],
                "coreTraits": ["인내", "분석력", "검소함"],
                "famousQuote": "다른 사람이 탐욕스러울 때 두려워하고, 다른 사람이 두려워할 때 탐욕스러워라.",
                "categoryTraits": {
                    "work": "장기적 관점과 꾸준한 노력",
                    "love": "신뢰와 안정을 바탕으로 한 관계",
                    "money": "가치 투자와 복리의 마법",
                    "health": "규칙적이고 단순한 생활습관"
                },
                "naturalTemplates": {
                    "work": "분석적인 워런 버핏처럼, 오늘 신중한 판단과 장기적 관점으로 중요한 결정을 내릴 것입니다",
                    "love": "안정적인 워런 버핏처럼, 서두르지 않고 천천히 신뢰를 쌓아가는 관계를 만들어갈 것입니다",
                    "money": "투자의 귀재 워런 버핏처럼, 가치 있는 곳에 투자하여 장기적인 수익을 거둘 것입니다",
                    "health": "규칙적인 워런 버핏처럼, 단순하지만 꾸준한 생활습관이 건강의 비결이 될 것입니다"
                }
            }
        ],
        'libra': [
            {
                "name": "오스카 와일드",
                "nameEn": "Oscar Wilde",
                "period": "1854-1900",
                "country": "아일랜드",
                "achievements": [
                    "도리안 그레이의 초상",
                    "유미주의 운동 선도",
                    "위트 있는 희곡 작가"
                ],
                "coreTraits": ["재치", "탐미", "아이러니"],
                "famousQuote": "우리는 모두 시궁창에 있지만, 그중 일부는 별을 바라본다.",
                "categoryTraits": {
                    "work": "예술적 재능과 언어의 마술",
                    "love": "열정적이고 비극적인 사랑",
                    "money": "사치와 예술에 대한 투자",
                    "health": "쾌락과 절제 사이의 균형"
                },
                "naturalTemplates": {
                    "work": "재치 있는 오스카 와일드처럼, 오늘 번뜩이는 아이디어와 언변으로 모두를 매료시킬 것입니다",
                    "love": "열정적인 오스카 와일드처럼, 예술적 감성과 로맨틱한 제스처로 사랑을 표현하게 될 것입니다",
                    "money": "탐미적인 오스카 와일드처럼, 아름다운 것에 대한 투자가 정신적 만족을 가져다줄 것입니다",
                    "health": "균형을 추구한 오스카 와일드처럼, 즐거움과 절제 사이에서 적절한 조화를 찾을 것입니다"
                }
            },
            {
                "name": "세레나 윌리엄스",
                "nameEn": "Serena Williams",
                "period": "1981-",
                "country": "미국",
                "achievements": [
                    "그랜드슬램 23회 우승",
                    "여자 테니스 전설",
                    "스포츠 평등 운동가"
                ],
                "coreTraits": ["파워", "투지", "리더십"],
                "famousQuote": "챔피언이 되는 것은 단지 승리에 관한 것이 아니다.",
                "categoryTraits": {
                    "work": "압도적 실력과 불굴의 투지",
                    "love": "강인하면서도 따뜻한 모성애",
                    "money": "스포츠를 넘어선 비즈니스 성공",
                    "health": "최강의 체력과 정신력"
                },
                "naturalTemplates": {
                    "work": "챔피언 세레나 윌리엄스처럼, 오늘 강력한 의지와 실력으로 모든 경쟁에서 승리할 것입니다",
                    "love": "강인한 세레나 윌리엄스처럼, 사랑하는 사람을 지키는 든든한 보호자가 될 것입니다",
                    "money": "사업가 세레나 윌리엄스처럼, 본업을 넘어선 새로운 비즈니스 기회를 발견할 것입니다",
                    "health": "파워풀한 세레나 윌리엄스처럼, 강도 높은 운동으로 체력과 정신력을 동시에 강화할 것입니다"
                }
            }
        ],
        'scorpio': [
            {
                "name": "파블로 피카소",
                "nameEn": "Pablo Picasso",
                "period": "1881-1973",
                "country": "스페인",
                "achievements": [
                    "입체파 창시",
                    "게르니카 제작",
                    "20세기 최고의 화가"
                ],
                "coreTraits": ["혁신", "열정", "다작"],
                "famousQuote": "모든 어린이는 예술가다. 문제는 어른이 되어서도 예술가로 남는 것이다.",
                "categoryTraits": {
                    "work": "끊임없는 창작과 스타일 변화",
                    "love": "격정적이고 복잡한 관계",
                    "money": "예술 작품의 천문학적 가치",
                    "health": "창작 에너지와 장수"
                },
                "naturalTemplates": {
                    "work": "창의적인 피카소처럼, 오늘 기존의 틀을 완전히 깨는 혁신적인 아이디어를 창조할 것입니다",
                    "love": "열정적인 피카소처럼, 강렬하고 깊은 감정으로 관계에 새로운 활력을 불어넣을 것입니다",
                    "money": "다작왕 피카소처럼, 여러 프로젝트를 동시에 진행하며 다양한 수입원을 만들어낼 것입니다",
                    "health": "활력 넘친 피카소처럼, 창의적인 활동이 정신 건강과 장수의 비결이 될 것입니다"
                }
            },
            {
                "name": "힐러리 클린턴",
                "nameEn": "Hillary Clinton",
                "period": "1947-",
                "country": "미국",
                "achievements": [
                    "미국 국무장관",
                    "상원의원",
                    "여성 정치인의 선구자"
                ],
                "coreTraits": ["야망", "지성", "회복력"],
                "famousQuote": "인권은 여성의 권리이고, 여성의 권리는 인권이다.",
                "categoryTraits": {
                    "work": "철저한 준비와 전략적 사고",
                    "love": "파트너십과 정치적 동반자",
                    "money": "권력과 부의 네트워크",
                    "health": "스트레스 관리와 회복탄력성"
                },
                "naturalTemplates": {
                    "work": "전략적인 힐러리 클린턴처럼, 오늘 철저한 준비와 계획으로 중요한 목표를 달성할 것입니다",
                    "love": "파트너십을 중시한 힐러리처럼, 서로의 성장을 돕는 동반자적 관계를 발전시킬 것입니다",
                    "money": "네트워킹의 달인 힐러리처럼, 인맥을 통한 새로운 비즈니스 기회를 창출할 것입니다",
                    "health": "회복력 강한 힐러리처럼, 스트레스를 극복하고 더 강해지는 정신력을 기를 것입니다"
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
                    "2차 대전 영국 총리",
                    "노벨 문학상 수상",
                    "위대한 연설가"
                ],
                "coreTraits": ["용기", "웅변", "불굴"],
                "famousQuote": "절대 포기하지 마라. 절대, 절대, 절대로.",
                "categoryTraits": {
                    "work": "위기 속의 탁월한 리더십",
                    "love": "충성스럽고 헌신적인 관계",
                    "money": "글쓰기와 연설로 얻은 부",
                    "health": "스트레스 속에서도 유지한 활력"
                },
                "naturalTemplates": {
                    "work": "불굴의 처칠처럼, 오늘 어떤 어려움이 와도 포기하지 않고 끝까지 해낼 것입니다",
                    "love": "충성스러운 처칠처럼, 어려운 시기에도 변하지 않는 사랑과 지지를 보여줄 것입니다",
                    "money": "다재다능한 처칠처럼, 여러 재능을 활용해 다양한 수입원을 창출할 것입니다",
                    "health": "활력 넘친 처칠처럼, 스트레스를 유머와 취미로 해소하며 건강을 유지할 것입니다"
                }
            },
            {
                "name": "테일러 스위프트",
                "nameEn": "Taylor Swift",
                "period": "1989-",
                "country": "미국",
                "achievements": [
                    "그래미상 다수 수상",
                    "싱어송라이터",
                    "음반 재녹음 운동"
                ],
                "coreTraits": ["재능", "비즈니스감각", "진정성"],
                "famousQuote": "두려움 없는 것은 두려워하지 않는 게 아니라 두려움에도 불구하고 나아가는 것이다.",
                "categoryTraits": {
                    "work": "음악적 재능과 사업 수완",
                    "love": "경험을 예술로 승화시키는 능력",
                    "money": "음악 산업의 게임 체인저",
                    "health": "바쁜 일정 속 자기관리"
                },
                "naturalTemplates": {
                    "work": "재능 있는 테일러 스위프트처럼, 오늘 창의적 작업에서 놀라운 성과를 만들어낼 것입니다",
                    "love": "진솔한 테일러 스위프트처럼, 감정을 솔직하게 표현하며 더 깊은 관계를 만들 것입니다",
                    "money": "사업가 테일러 스위프트처럼, 자신의 권리를 지키며 공정한 대가를 받을 것입니다",
                    "health": "자기관리하는 테일러처럼, 바쁜 중에도 운동과 휴식의 균형을 찾을 것입니다"
                }
            }
        ],
        'capricorn': [
            {
                "name": "스티븐 호킹",
                "nameEn": "Stephen Hawking",
                "period": "1942-2018",
                "country": "영국",
                "achievements": [
                    "블랙홀 이론",
                    "시간의 역사 저자",
                    "루게릭병 극복"
                ],
                "coreTraits": ["지성", "인내", "유머"],
                "famousQuote": "삶이 있는 곳에 희망이 있다.",
                "categoryTraits": {
                    "work": "한계를 넘어선 지적 탐구",
                    "love": "정신적 교감과 깊은 유대",
                    "money": "지식을 통한 가치 창출",
                    "health": "불굴의 정신력으로 극복"
                },
                "naturalTemplates": {
                    "work": "천재 스티븐 호킹처럼, 오늘 복잡한 문제를 놀라운 통찰력으로 해결할 것입니다",
                    "love": "깊이 있는 호킹처럼, 지적 교감과 정신적 연결로 관계를 더욱 돈독히 할 것입니다",
                    "money": "지식인 호킹처럼, 당신의 전문 지식이 예상치 못한 수익으로 이어질 것입니다",
                    "health": "불굴의 호킹처럼, 어떤 신체적 한계도 정신력으로 극복해낼 것입니다"
                }
            },
            {
                "name": "미셸 오바마",
                "nameEn": "Michelle Obama",
                "period": "1964-",
                "country": "미국",
                "achievements": [
                    "미국 영부인",
                    "베스트셀러 작가",
                    "교육 운동가"
                ],
                "coreTraits": ["품격", "지성", "영향력"],
                "famousQuote": "성공은 얼마나 많은 돈을 버느냐가 아니라 얼마나 많은 삶을 변화시키느냐다.",
                "categoryTraits": {
                    "work": "교육과 공공 서비스에 대한 열정",
                    "love": "평등한 파트너십과 가족애",
                    "money": "가치 있는 일에 대한 투자",
                    "health": "건강한 생활습관 롤모델"
                },
                "naturalTemplates": {
                    "work": "영향력 있는 미셸 오바마처럼, 오늘 리더십으로 많은 사람들에게 긍정적 변화를 일으킬 것입니다",
                    "love": "파트너십을 중시한 미셸처럼, 서로를 존중하고 지지하는 평등한 관계를 만들 것입니다",
                    "money": "가치 투자자 미셸처럼, 교육과 성장에 대한 투자가 장기적 성과로 이어질 것입니다",
                    "health": "건강한 미셸처럼, 균형 잡힌 식단과 운동으로 온 가족의 건강을 챙길 것입니다"
                }
            }
        ],
        'aquarius': [
            {
                "name": "오프라 윈프리",
                "nameEn": "Oprah Winfrey",
                "period": "1954-",
                "country": "미국",
                "achievements": [
                    "미디어 제국 건설",
                    "토크쇼의 여왕",
                    "자선사업가"
                ],
                "coreTraits": ["공감", "영향력", "관대함"],
                "famousQuote": "당신이 될 수 있는 가장 위대한 모험은 당신의 꿈의 삶을 사는 것이다.",
                "categoryTraits": {
                    "work": "진정성으로 쌓은 미디어 제국",
                    "love": "자기 사랑과 타인에 대한 공감",
                    "money": "부를 나누는 기쁨",
                    "health": "정신적 성장과 자기계발"
                },
                "naturalTemplates": {
                    "work": "영향력 있는 오프라처럼, 오늘 진정성 있는 소통으로 많은 사람의 마음을 움직일 것입니다",
                    "love": "공감하는 오프라처럼, 상대방의 이야기를 깊이 들으며 진정한 연결을 만들 것입니다",
                    "money": "관대한 오프라처럼, 나눔을 통해 더 큰 풍요와 기쁨을 경험하게 될 것입니다",
                    "health": "성장하는 오프라처럼, 명상과 자기계발로 정신적 건강을 향상시킬 것입니다"
                }
            },
            {
                "name": "토마스 에디슨",
                "nameEn": "Thomas Edison",
                "period": "1847-1931",
                "country": "미국",
                "achievements": [
                    "전구 발명",
                    "1093개 특허",
                    "발명왕"
                ],
                "coreTraits": ["끈기", "창의성", "실용주의"],
                "famousQuote": "천재는 1%의 영감과 99%의 노력으로 이루어진다.",
                "categoryTraits": {
                    "work": "실패를 두려워하지 않는 혁신",
                    "love": "일과 사랑의 균형 찾기",
                    "money": "발명을 사업으로 전환",
                    "health": "과로와 휴식의 균형"
                },
                "naturalTemplates": {
                    "work": "끈기 있는 에디슨처럼, 오늘 실패를 두려워하지 않고 계속 도전하여 성공을 이룰 것입니다",
                    "love": "헌신적인 에디슨처럼, 일에 대한 열정만큼 사랑하는 사람에게도 시간을 투자할 것입니다",
                    "money": "사업가 에디슨처럼, 창의적 아이디어를 실용적인 수익 모델로 전환시킬 것입니다",
                    "health": "열정적인 에디슨처럼, 일에 몰두하되 적절한 휴식으로 에너지를 재충전할 것입니다"
                }
            },
            {
                "name": "앨런 튜링",
                "nameEn": "Alan Turing",
                "period": "1912-1954",
                "country": "영국",
                "achievements": [
                    "컴퓨터 과학의 아버지",
                    "에니그마 해독",
                    "튜링 테스트"
                ],
                "coreTraits": ["천재성", "논리", "선구자"],
                "famousQuote": "때때로 상상할 수 없는 사람들이 아무도 할 수 없는 일을 한다.",
                "categoryTraits": {
                    "work": "논리적 사고와 혁신적 문제해결",
                    "love": "이해받기 어려운 독특한 개성",
                    "money": "미래 기술에 대한 선견지명",
                    "health": "정신적 압박과 고독"
                },
                "naturalTemplates": {
                    "work": "천재 튜링처럼, 오늘 논리적 사고로 복잡한 문제의 혁신적 해결책을 찾을 것입니다",
                    "love": "독특한 튜링처럼, 당신의 개성을 이해하고 받아들이는 특별한 사람을 만날 것입니다",
                    "money": "선구자 튜링처럼, 미래 기술에 대한 투자가 장기적으로 큰 수익을 가져올 것입니다",
                    "health": "섬세한 튜링처럼, 정신적 스트레스를 해소할 수 있는 자신만의 방법을 찾을 것입니다"
                }
            }
        ],
        'pisces': [
            {
                "name": "알베르트 아인슈타인",
                "nameEn": "Albert Einstein",
                "period": "1879-1955",
                "country": "독일/미국",
                "achievements": [
                    "상대성 이론",
                    "노벨 물리학상",
                    "E=mc²"
                ],
                "coreTraits": ["상상력", "직관", "인도주의"],
                "famousQuote": "상상력은 지식보다 중요하다.",
                "categoryTraits": {
                    "work": "직관적 통찰과 혁명적 발견",
                    "love": "지적 교감과 정신적 연결",
                    "money": "명예보다 가치를 추구",
                    "health": "음악과 사색을 통한 정신 건강"
                },
                "naturalTemplates": {
                    "work": "직관적인 아인슈타인처럼, 오늘 복잡한 문제를 단순하고 우아한 방법으로 해결할 것입니다",
                    "love": "깊이 있는 아인슈타인처럼, 지적이고 정신적인 교감으로 관계가 더욱 깊어질 것입니다",
                    "money": "가치 중심적인 아인슈타인처럼, 돈보다 의미 있는 일에서 더 큰 만족을 얻을 것입니다",
                    "health": "사색하는 아인슈타인처럼, 음악 감상이나 명상이 정신 건강에 큰 도움이 될 것입니다"
                }
            },
            {
                "name": "리한나",
                "nameEn": "Rihanna",
                "period": "1988-",
                "country": "바베이도스",
                "achievements": [
                    "그래미상 9회 수상",
                    "펜티 뷰티 창업",
                    "억만장자 뮤지션"
                ],
                "coreTraits": ["창의성", "사업수완", "독립성"],
                "famousQuote": "내가 하고 싶은 일을 할 때 가장 창의적이 된다.",
                "categoryTraits": {
                    "work": "음악과 비즈니스의 완벽한 조화",
                    "love": "독립적이면서 열정적인 사랑",
                    "money": "예술을 비즈니스로 전환하는 능력",
                    "health": "자기 관리와 자신감"
                },
                "naturalTemplates": {
                    "work": "다재다능한 리한나처럼, 오늘 창의적 재능과 비즈니스 감각을 동시에 발휘할 것입니다",
                    "love": "독립적인 리한나처럼, 자신의 정체성을 지키면서도 열정적인 사랑을 즐길 것입니다",
                    "money": "사업가 리한나처럼, 창의적 아이디어를 수익성 있는 사업으로 발전시킬 것입니다",
                    "health": "자신감 있는 리한나처럼, 자기 사랑과 긍정적 에너지로 건강을 유지할 것입니다"
                }
            },
            {
                "name": "조지 워싱턴",
                "nameEn": "George Washington",
                "period": "1732-1799",
                "country": "미국",
                "achievements": [
                    "미국 초대 대통령",
                    "독립전쟁 총사령관",
                    "건국의 아버지"
                ],
                "coreTraits": ["리더십", "정직", "희생"],
                "famousQuote": "자유가 뿌리내릴 때, 성장은 빠르다.",
                "categoryTraits": {
                    "work": "원칙과 비전을 가진 리더십",
                    "love": "충실하고 헌신적인 관계",
                    "money": "공익을 위한 개인적 희생",
                    "health": "강인한 체력과 정신력"
                },
                "naturalTemplates": {
                    "work": "지도자 조지 워싱턴처럼, 오늘 원칙을 지키며 모두를 이끄는 리더십을 발휘할 것입니다",
                    "love": "충실한 워싱턴처럼, 변함없는 사랑과 신뢰로 관계의 기반을 더욱 단단히 할 것입니다",
                    "money": "희생적인 워싱턴처럼, 개인의 이익보다 공동의 선을 추구하며 더 큰 보상을 받을 것입니다",
                    "health": "강인한 워싱턴처럼, 규칙적인 운동과 절제된 생활로 건강을 유지할 것입니다"
                }
            }
        ]
    }

def add_figures_to_data(data, additional_figures):
    """데이터에 인물 추가"""
    added_count = 0
    
    for zodiac_name, figures in additional_figures.items():
        if zodiac_name in data['zodiacFigures']:
            current_count = len(data['zodiacFigures'][zodiac_name]['figures'])
            needed = 20 - current_count
            
            if needed > 0:
                # 필요한 만큼만 추가
                figures_to_add = figures[:needed]
                data['zodiacFigures'][zodiac_name]['figures'].extend(figures_to_add)
                added_count += len(figures_to_add)
                print(f"  {zodiac_name}: {len(figures_to_add)}명 추가 완료")
    
    return data, added_count

def main():
    """메인 실행 함수"""
    try:
        print("=" * 60)
        print("[실행] 240명 완성을 위한 인물 일괄 추가")
        print("=" * 60)
        
        # 1단계: 현재 데이터 로드
        print("\n[1단계] 현재 데이터 로드...")
        with open('C:/code/rheight/zodiac-system/historical-figures-enhanced.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 현재 상태 확인
        counts, total = count_current_figures(data)
        print(f"\n[현재 상태]")
        print(f"총 인물 수: {total}명")
        for zodiac, count in counts.items():
            needed = 20 - count
            status = "[O] 완료" if count >= 20 else f"[X] {needed}명 필요"
            print(f"  - {zodiac}: {count}명 {status}")
        
        # 추가할 인물 준비
        print(f"\n[2단계] 추가할 인물 준비...")
        additional = get_additional_figures()
        
        # 인물 추가
        print(f"\n[3단계] 인물 추가 중...")
        data, added_count = add_figures_to_data(data, additional)
        
        # 결과 저장
        print(f"\n[4단계] 파일 저장...")
        with open('C:/code/rheight/zodiac-system/historical-figures-enhanced.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # 최종 확인
        final_counts, final_total = count_current_figures(data)
        print(f"\n[완료 상태]")
        print(f"총 인물 수: {final_total}명 (추가된 인물: {added_count}명)")
        for zodiac, count in final_counts.items():
            status = "[O]" if count >= 20 else "[X]"
            print(f"  - {zodiac}: {count}명 {status}")
        
        print("\n" + "=" * 60)
        print("[성공] 인물 추가 완료!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n[오류] 처리 중 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()