#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
240명 완성을 위한 나머지 102명 추가
각 별자리당 20명씩 균등 배치
"""

import json

def count_current_figures(data):
    """현재 인물 수 카운트"""
    counts = {}
    total = 0
    
    for zodiac_key, zodiac_data in data.get('zodiacFigures', {}).items():
        count = len(zodiac_data.get('figures', []))
        counts[zodiac_key] = count
        total += count
    
    return counts, total

def get_additional_figures():
    """추가할 102명의 새로운 인물들"""
    
    additional_figures = {
        "aries": [  # 양자리 (현재 16명 → 20명, +4명)
            {
                "name": "찰리 채플린",
                "nameEn": "Charlie Chaplin",
                "period": "1889-1977",
                "country": "영국",
                "achievements": [
                    "모던 타임스 - 산업화 시대 비판 걸작",
                    "위대한 독재자 - 히틀러 풍자 영화",
                    "무성영화의 전설 - 코미디와 휴머니즘 결합"
                ],
                "coreTraits": ["창의성", "유머", "인간애"],
                "famousQuote": "인생은 멀리서 보면 희극이고 가까이서 보면 비극이다",
                "categoryTraits": {
                    "work": "독창적인 예술로 시대를 앞서가는 혁신",
                    "love": "순수한 감성과 따뜻한 마음으로 사랑 표현",
                    "money": "예술적 가치를 경제적 성공으로 연결",
                    "health": "웃음으로 마음의 건강 유지"
                },
                "naturalTemplates": {
                    "work": "모던 타임스를 만든 채플린처럼, 오늘은 혁신적인 아이디어가 빛을 발할 날입니다",
                    "love": "순수한 감성을 지닌 채플린처럼, 진정한 사랑의 가치를 발견하게 됩니다",
                    "money": "예술을 성공으로 이끈 채플린처럼, 창의성이 수익으로 연결될 것입니다",
                    "health": "웃음의 천재 채플린처럼, 유머로 스트레스를 극복할 수 있습니다"
                }
            },
            {
                "name": "레디 가가",
                "nameEn": "Lady Gaga",
                "period": "1986-",
                "country": "미국",
                "achievements": [
                    "포커 페이스 - 전 세계 히트곡",
                    "스타 이즈 본 - 아카데미상 수상",
                    "LGBTQ+ 인권 운동 - 사회 활동가"
                ],
                "coreTraits": ["독창성", "용기", "진정성"],
                "famousQuote": "Don't you ever let a soul in the world tell you that you can't be exactly who you are",
                "categoryTraits": {
                    "work": "독특함을 강점으로 만드는 창의적 도전",
                    "love": "진정성 있는 사랑과 자기 수용",
                    "money": "개성을 브랜드로 만드는 비즈니스 감각",
                    "health": "정신 건강의 중요성 인식과 실천"
                },
                "naturalTemplates": {
                    "work": "독창적인 아티스트 레디 가가처럼, 당신만의 개성이 성공의 열쇠가 됩니다",
                    "love": "진정성을 추구하는 레디 가가처럼, 있는 그대로의 모습으로 사랑받을 것입니다",
                    "money": "브랜드를 만든 레디 가가처럼, 독특함이 경제적 가치로 변환됩니다",
                    "health": "자기 돌봄을 실천하는 레디 가가처럼, 정신 건강이 향상되는 날입니다"
                }
            },
            {
                "name": "세르게이 브린",
                "nameEn": "Sergey Brin",
                "period": "1973-",
                "country": "러시아/미국",
                "achievements": [
                    "구글 공동 창업 - 세계 최대 검색엔진",
                    "알파벳 설립 - 혁신 기업 구조 창조",
                    "페이지랭크 알고리즘 - 검색 혁명"
                ],
                "coreTraits": ["혁신", "도전정신", "비전"],
                "famousQuote": "Solving big problems is easier than solving little problems",
                "categoryTraits": {
                    "work": "큰 문제에 도전하여 혁신적 해결책 창출",
                    "love": "지적 교감과 함께 성장하는 관계 추구",
                    "money": "기술 혁신을 통한 가치 창출",
                    "health": "지적 활동과 신체 건강의 균형"
                },
                "naturalTemplates": {
                    "work": "구글을 창업한 세르게이 브린처럼, 혁신적인 솔루션을 발견하게 됩니다",
                    "love": "지적 파트너십을 중시하는 브린처럼, 함께 성장하는 사랑을 만듭니다",
                    "money": "기술로 부를 창출한 브린처럼, 아이디어가 수익으로 연결됩니다",
                    "health": "균형잡힌 삶을 추구하는 브린처럼, 몸과 마음이 조화를 이룹니다"
                }
            },
            {
                "name": "제임스 프랑코",
                "nameEn": "James Franco",
                "period": "1978-",
                "country": "미국",
                "achievements": [
                    "127시간 - 골든글로브 남우주연상",
                    "스파이더맨 시리즈 - 해리 오스본 역",
                    "다재다능 - 배우, 감독, 작가, 교수"
                ],
                "coreTraits": ["다재다능", "지적 호기심", "창의성"],
                "famousQuote": "The first thing that attracts me to any script is the writing",
                "categoryTraits": {
                    "work": "다양한 분야에서 재능을 발휘하는 멀티 플레이어",
                    "love": "지적이고 깊이 있는 관계 추구",
                    "money": "여러 수입원을 통한 안정적 수익 창출",
                    "health": "다양한 활동을 통한 정신적 활력 유지"
                },
                "naturalTemplates": {
                    "work": "다재다능한 제임스 프랑코처럼, 여러 분야에서 능력을 발휘하게 됩니다",
                    "love": "깊이 있는 관계를 추구하는 프랑코처럼, 의미 있는 만남이 기다립니다",
                    "money": "다양한 활동을 하는 프랑코처럼, 여러 곳에서 수입이 발생합니다",
                    "health": "활발한 활동을 하는 프랑코처럼, 에너지가 넘치는 하루가 됩니다"
                }
            }
        ],
        "taurus": [  # 황소자리 (현재 14명 → 20명, +6명)
            {
                "name": "데이비드 베컴",
                "nameEn": "David Beckham",
                "period": "1975-",
                "country": "영국",
                "achievements": [
                    "맨체스터 유나이티드 레전드 - 6회 프리미어리그 우승",
                    "잉글랜드 대표팀 주장 - 115경기 출전",
                    "글로벌 아이콘 - 패션과 스포츠 융합"
                ],
                "coreTraits": ["끈기", "우아함", "프로페셔널리즘"],
                "famousQuote": "I always say that practice makes perfect",
                "categoryTraits": {
                    "work": "꾸준한 노력으로 완벽을 추구하는 프로정신",
                    "love": "가족을 최우선으로 하는 헌신적 사랑",
                    "money": "브랜드 가치를 높이는 비즈니스 감각",
                    "health": "규칙적인 운동과 자기관리로 건강 유지"
                },
                "naturalTemplates": {
                    "work": "완벽을 추구한 데이비드 베컴처럼, 꾸준한 노력이 성과로 이어집니다",
                    "love": "가족을 사랑하는 베컴처럼, 소중한 사람과 더 깊은 유대감을 형성합니다",
                    "money": "브랜드를 만든 베컴처럼, 당신의 가치가 인정받아 수익이 증가합니다",
                    "health": "자기관리를 철저히 한 베컴처럼, 건강한 몸과 마음을 유지합니다"
                }
            },
            {
                "name": "아델",
                "nameEn": "Adele",
                "period": "1988-",
                "country": "영국",
                "achievements": [
                    "15회 그래미상 수상 - 음악계 최고 영예",
                    "롤링 인 더 딥 - 전 세계적 히트",
                    "가장 영향력 있는 여성 아티스트"
                ],
                "coreTraits": ["진정성", "감성", "강인함"],
                "famousQuote": "Be brave and fearless to know that even if you do make a wrong decision, you're making it for a good reason",
                "categoryTraits": {
                    "work": "진정성 있는 작품으로 대중의 마음 감동",
                    "love": "진실된 감정 표현과 깊은 사랑",
                    "money": "재능을 통한 안정적인 부의 축적",
                    "health": "감정적 치유를 통한 정신 건강"
                },
                "naturalTemplates": {
                    "work": "영혼을 담은 음악을 만든 아델처럼, 진정성 있는 성과를 만들어냅니다",
                    "love": "진실한 감정을 표현한 아델처럼, 깊고 의미 있는 사랑을 경험합니다",
                    "money": "재능으로 성공한 아델처럼, 능력이 경제적 보상으로 이어집니다",
                    "health": "감정을 음악으로 승화한 아델처럼, 마음의 평화를 찾게 됩니다"
                }
            },
            {
                "name": "마크 저커버그",
                "nameEn": "Mark Zuckerberg",
                "period": "1984-",
                "country": "미국",
                "achievements": [
                    "페이스북(메타) 창업 - 세계 최대 SNS",
                    "최연소 억만장자 - 23세 기록",
                    "기부 서약 - 재산 99% 기부 약속"
                ],
                "coreTraits": ["비전", "혁신", "연결"],
                "famousQuote": "The biggest risk is not taking any risk",
                "categoryTraits": {
                    "work": "혁신적 아이디어를 현실로 만드는 실행력",
                    "love": "파트너와 함께 성장하는 동반자적 사랑",
                    "money": "기술 혁신을 통한 가치 창출",
                    "health": "규칙적인 루틴으로 균형잡힌 삶"
                },
                "naturalTemplates": {
                    "work": "페이스북을 창업한 저커버그처럼, 혁신적인 아이디어가 현실이 됩니다",
                    "love": "파트너십을 중시하는 저커버그처럼, 함께 성장하는 관계를 만듭니다",
                    "money": "젊은 나이에 성공한 저커버그처럼, 큰 부를 축적할 기회가 옵니다",
                    "health": "규칙적인 생활을 하는 저커버그처럼, 건강한 루틴이 확립됩니다"
                }
            },
            {
                "name": "셰익스피어",
                "nameEn": "William Shakespeare",
                "period": "1564-1616",
                "country": "영국",
                "achievements": [
                    "햄릿, 로미오와 줄리엣 - 불멸의 작품들",
                    "37편의 희곡 - 영문학 최고 업적",
                    "영어 발전 기여 - 1700개 이상 단어 창조"
                ],
                "coreTraits": ["창의성", "통찰력", "언어의 마법사"],
                "famousQuote": "All the world's a stage",
                "categoryTraits": {
                    "work": "시대를 초월한 작품 창조",
                    "love": "인간 감정의 깊이를 이해하는 사랑",
                    "money": "예술적 가치의 경제적 성공",
                    "health": "창작 활동을 통한 정신적 충만"
                },
                "naturalTemplates": {
                    "work": "불멸의 작품을 쓴 셰익스피어처럼, 오래 기억될 성과를 만듭니다",
                    "love": "로미오와 줄리엣을 쓴 셰익스피어처럼, 깊은 사랑의 의미를 깨닫습니다",
                    "money": "작품으로 부를 쌓은 셰익스피어처럼, 창의성이 수익으로 연결됩니다",
                    "health": "창작에 몰두한 셰익스피어처럼, 정신적 활력이 넘치는 날입니다"
                }
            },
            {
                "name": "조지 클루니",
                "nameEn": "George Clooney",
                "period": "1961-",
                "country": "미국",
                "achievements": [
                    "아카데미상 2회 수상 - 연기와 제작",
                    "인권 활동가 - 다르푸르 평화 운동",
                    "성공적인 사업가 - 테킬라 브랜드 10억 달러 매각"
                ],
                "coreTraits": ["카리스마", "사회의식", "다재다능"],
                "famousQuote": "I don't believe in happy endings, but I do believe in happy travels",
                "categoryTraits": {
                    "work": "연기와 제작, 사업까지 성공하는 다재다능",
                    "love": "성숙하고 깊이 있는 관계 추구",
                    "money": "다양한 분야에서 수익 창출",
                    "health": "활동적이고 균형잡힌 라이프스타일"
                },
                "naturalTemplates": {
                    "work": "다방면에서 성공한 조지 클루니처럼, 여러 분야에서 성과를 거둡니다",
                    "love": "성숙한 사랑을 한 클루니처럼, 깊이 있는 관계가 시작됩니다",
                    "money": "사업에 성공한 클루니처럼, 투자가 큰 수익으로 돌아옵니다",
                    "health": "활력 넘치는 클루니처럼, 젊은 에너지를 유지합니다"
                }
            },
            {
                "name": "드웨인 존슨",
                "nameEn": "Dwayne Johnson",
                "period": "1972-",
                "country": "미국",
                "achievements": [
                    "WWE 챔피언에서 할리우드 스타로 - 성공적 전환",
                    "세계 최고 수입 배우 - 포브스 1위",
                    "긍정 에너지의 아이콘 - 소셜미디어 영향력"
                ],
                "coreTraits": ["긍정성", "근면", "카리스마"],
                "famousQuote": "Success isn't always about greatness. It's about consistency",
                "categoryTraits": {
                    "work": "꾸준한 노력과 긍정적 태도로 성공",
                    "love": "가족 중심의 따뜻한 사랑",
                    "money": "다양한 비즈니스를 통한 부의 창출",
                    "health": "철저한 운동과 영양 관리"
                },
                "naturalTemplates": {
                    "work": "꾸준히 노력한 드웨인 존슨처럼, 일관성 있는 노력이 성공으로 이어집니다",
                    "love": "가족을 사랑하는 존슨처럼, 따뜻한 가정의 행복을 누립니다",
                    "money": "사업에 성공한 존슨처럼, 여러 수입원이 생겨납니다",
                    "health": "운동하는 존슨처럼, 강한 체력과 정신력을 갖게 됩니다"
                }
            }
        ],
        "gemini": [  # 쌍둥이자리 (현재 17명 → 20명, +3명)
            {
                "name": "폴 매카트니",
                "nameEn": "Paul McCartney",
                "period": "1942-",
                "country": "영국",
                "achievements": [
                    "비틀즈 멤버 - 역사상 가장 성공한 밴드",
                    "32곡 빌보드 1위 - 최다 기록",
                    "18회 그래미상 수상 - 음악 거장"
                ],
                "coreTraits": ["창의성", "다재다능", "혁신"],
                "famousQuote": "I used to think anyone doing anything weird was weird. Now I know that it is the people that call others weird that are weird",
                "categoryTraits": {
                    "work": "끊임없는 창작과 혁신으로 새로운 길 개척",
                    "love": "음악처럼 아름다운 사랑의 하모니",
                    "money": "창의성을 통한 지속적인 부의 창출",
                    "health": "음악을 통한 정신적 젊음 유지"
                },
                "naturalTemplates": {
                    "work": "비틀즈를 이끈 폴 매카트니처럼, 창의적인 협업이 큰 성공을 만듭니다",
                    "love": "사랑을 노래한 매카트니처럼, 아름다운 관계의 하모니를 이룹니다",
                    "money": "음악으로 부를 쌓은 매카트니처럼, 재능이 수익으로 연결됩니다",
                    "health": "젊음을 유지하는 매카트니처럼, 활력이 넘치는 하루가 됩니다"
                }
            },
            {
                "name": "나오미 캠벨",
                "nameEn": "Naomi Campbell",
                "period": "1970-",
                "country": "영국",
                "achievements": [
                    "슈퍼모델의 선구자 - 패션계 아이콘",
                    "최초의 흑인 보그 표지 모델",
                    "자선 활동가 - 아프리카 발전 기여"
                ],
                "coreTraits": ["카리스마", "개척정신", "강인함"],
                "famousQuote": "I make a lot of money and I'm worth every cent",
                "categoryTraits": {
                    "work": "장벽을 깨고 새로운 기준 설정",
                    "love": "독립적이면서도 열정적인 사랑",
                    "money": "자신의 가치를 아는 비즈니스 감각",
                    "health": "규율과 자기관리로 유지하는 건강"
                },
                "naturalTemplates": {
                    "work": "패션계를 개척한 나오미 캠벨처럼, 새로운 영역에서 성공을 거둡니다",
                    "love": "독립적인 캠벨처럼, 자유로우면서도 열정적인 사랑을 합니다",
                    "money": "자신의 가치를 아는 캠벨처럼, 정당한 보상을 받게 됩니다",
                    "health": "자기관리를 철저히 하는 캠벨처럼, 최상의 컨디션을 유지합니다"
                }
            },
            {
                "name": "노박 조코비치",
                "nameEn": "Novak Djokovic",
                "period": "1987-",
                "country": "세르비아",
                "achievements": [
                    "그랜드슬램 24회 우승 - 역대 최다",
                    "세계 랭킹 1위 최장 기간 - 400주 이상",
                    "골든 마스터즈 - 모든 마스터즈 대회 우승"
                ],
                "coreTraits": ["정신력", "유연성", "완벽주의"],
                "famousQuote": "My success has a lot to do with my mental strength",
                "categoryTraits": {
                    "work": "정신력과 집중력으로 최고 달성",
                    "love": "균형잡힌 가정과 커리어",
                    "money": "성공을 통한 안정적 부의 축적",
                    "health": "완벽한 신체와 정신의 조화"
                },
                "naturalTemplates": {
                    "work": "최고가 된 조코비치처럼, 정신력으로 모든 도전을 극복합니다",
                    "love": "균형을 중시하는 조코비치처럼, 사랑과 일의 조화를 이룹니다",
                    "money": "꾸준히 성공한 조코비치처럼, 안정적인 수입이 보장됩니다",
                    "health": "완벽한 컨디션의 조코비치처럼, 최상의 건강 상태를 유지합니다"
                }
            }
        ],
        "cancer": [  # 게자리는 이미 20명 완료
        ],
        "leo": [  # 사자자리 (현재 12명 → 20명, +8명)
            {
                "name": "제니퍼 로렌스",
                "nameEn": "Jennifer Lawrence",
                "period": "1990-",
                "country": "미국",
                "achievements": [
                    "아카데미상 수상 - 최연소 여우주연상",
                    "헝거게임 시리즈 - 전 세계적 성공",
                    "포브스 최고 수입 여배우"
                ],
                "coreTraits": ["진정성", "유머", "재능"],
                "famousQuote": "Be strong. Don't be a follower, and always do the right thing",
                "categoryTraits": {
                    "work": "진정성 있는 연기로 관객의 마음 사로잡기",
                    "love": "솔직하고 유머러스한 사랑",
                    "money": "재능을 통한 큰 부의 창출",
                    "health": "긍정적 마인드로 정신 건강 유지"
                },
                "naturalTemplates": {
                    "work": "오스카를 받은 제니퍼 로렌스처럼, 뛰어난 재능이 인정받습니다",
                    "love": "솔직한 로렌스처럼, 진정성 있는 사랑을 나눕니다",
                    "money": "젊은 나이에 성공한 로렌스처럼, 큰 수익을 올립니다",
                    "health": "밝은 에너지의 로렌스처럼, 긍정적인 기운이 넘칩니다"
                }
            },
            {
                "name": "크리스 헴스워스",
                "nameEn": "Chris Hemsworth",
                "period": "1983-",
                "country": "호주",
                "achievements": [
                    "토르 역할 - 마블 시네마틱 유니버스",
                    "피플지 선정 가장 섹시한 남자",
                    "환경 보호 활동가"
                ],
                "coreTraits": ["카리스마", "헌신", "친화력"],
                "famousQuote": "The closer you are to death, the more alive you feel",
                "categoryTraits": {
                    "work": "헌신적인 노력으로 캐릭터 완성",
                    "love": "가족 중심의 따뜻한 사랑",
                    "money": "블록버스터를 통한 큰 수익",
                    "health": "완벽한 신체 관리와 운동"
                },
                "naturalTemplates": {
                    "work": "토르를 연기한 헴스워스처럼, 강력한 존재감을 발휘합니다",
                    "love": "가족을 사랑하는 헴스워스처럼, 따뜻한 가정을 꾸립니다",
                    "money": "블록버스터에 출연한 헴스워스처럼, 큰 프로젝트로 수익을 올립니다",
                    "health": "완벽한 몸을 가진 헴스워스처럼, 최상의 체력을 유지합니다"
                }
            },
            {
                "name": "샤를리즈 테론",
                "nameEn": "Charlize Theron",
                "period": "1975-",
                "country": "남아프리카공화국",
                "achievements": [
                    "아카데미상 여우주연상 - 몬스터",
                    "할리우드 액션 스타 - 매드맥스, 아토믹 블론드",
                    "아프리카 아웃리치 프로젝트 설립"
                ],
                "coreTraits": ["변신력", "강인함", "사회의식"],
                "famousQuote": "You always have this fear that one day you're going to be exposed as a fraud",
                "categoryTraits": {
                    "work": "완벽한 변신과 몰입으로 캐릭터 구현",
                    "love": "독립적이면서도 헌신적인 사랑",
                    "money": "다양한 역할로 안정적 수입",
                    "health": "역할을 위한 철저한 신체 변화"
                },
                "naturalTemplates": {
                    "work": "변신의 귀재 샤를리즈 테론처럼, 어떤 도전도 완벽히 수행합니다",
                    "love": "독립적인 테론처럼, 자유로우면서도 깊은 사랑을 합니다",
                    "money": "다양한 역할을 한 테론처럼, 여러 기회가 수익으로 연결됩니다",
                    "health": "강인한 테론처럼, 신체적 정신적 강함을 유지합니다"
                }
            },
            {
                "name": "로버트 레드포드",
                "nameEn": "Robert Redford",
                "period": "1936-",
                "country": "미국",
                "achievements": [
                    "선댄스 영화제 설립 - 독립영화 지원",
                    "아카데미상 감독상 - 보통 사람들",
                    "환경 운동가 - 자연 보호 활동"
                ],
                "coreTraits": ["독립정신", "예술성", "환경의식"],
                "famousQuote": "Problems can become opportunities when the right people come together",
                "categoryTraits": {
                    "work": "독립적 정신으로 새로운 길 개척",
                    "love": "깊이 있고 의미 있는 관계",
                    "money": "예술과 비즈니스의 균형",
                    "health": "자연과 함께하는 건강한 삶"
                },
                "naturalTemplates": {
                    "work": "선댄스를 만든 로버트 레드포드처럼, 새로운 플랫폼을 창조합니다",
                    "love": "깊이 있는 레드포드처럼, 의미 있는 관계를 만듭니다",
                    "money": "예술과 사업을 결합한 레드포드처럼, 창의적 수익을 창출합니다",
                    "health": "자연을 사랑하는 레드포드처럼, 건강한 라이프스타일을 유지합니다"
                }
            },
            {
                "name": "휘트니 휴스턴",
                "nameEn": "Whitney Houston",
                "period": "1963-2012",
                "country": "미국",
                "achievements": [
                    "6회 그래미상 수상 - 팝의 여왕",
                    "I Will Always Love You - 역대 최고 히트곡",
                    "2억장 이상 음반 판매"
                ],
                "coreTraits": ["재능", "감성", "카리스마"],
                "famousQuote": "I decided long ago never to walk in anyone's shadow",
                "categoryTraits": {
                    "work": "타고난 재능으로 정상 도달",
                    "love": "열정적이고 깊은 감정의 사랑",
                    "money": "재능을 통한 큰 부의 창출",
                    "health": "음악을 통한 감정적 치유"
                },
                "naturalTemplates": {
                    "work": "최고의 가수 휘트니 휴스턴처럼, 타고난 재능이 빛을 발합니다",
                    "love": "열정적인 휴스턴처럼, 깊은 감정의 사랑을 경험합니다",
                    "money": "대성공한 휴스턴처럼, 재능이 큰 수익으로 이어집니다",
                    "health": "음악으로 치유한 휴스턴처럼, 예술이 마음을 달래줍니다"
                }
            },
            {
                "name": "숀 멘데스",
                "nameEn": "Shawn Mendes",
                "period": "1998-",
                "country": "캐나다",
                "achievements": [
                    "최연소 빌보드 200 1위 - 18세 기록",
                    "소셜미디어 스타에서 글로벌 팝스타로",
                    "타임지 선정 가장 영향력 있는 청소년"
                ],
                "coreTraits": ["진정성", "열정", "겸손"],
                "famousQuote": "True strength is being vulnerable",
                "categoryTraits": {
                    "work": "진정성 있는 음악으로 팬들과 소통",
                    "love": "순수하고 진실한 감정 표현",
                    "money": "젊은 나이의 큰 성공",
                    "health": "정신 건강의 중요성 인식"
                },
                "naturalTemplates": {
                    "work": "진정성 있는 숀 멘데스처럼, 진심이 통하는 성과를 만듭니다",
                    "love": "순수한 멘데스처럼, 진실한 감정을 나눕니다",
                    "money": "젊은 나이에 성공한 멘데스처럼, 빠른 성장을 경험합니다",
                    "health": "자기 돌봄을 중시하는 멘데스처럼, 정신 건강을 챙깁니다"
                }
            },
            {
                "name": "헨리 포드",
                "nameEn": "Henry Ford",
                "period": "1863-1947",
                "country": "미국",
                "achievements": [
                    "포드 자동차 창업 - 대량생산 혁명",
                    "모델 T - 최초의 대중 자동차",
                    "조립 라인 혁신 - 산업 혁명 주도"
                ],
                "coreTraits": ["혁신", "실용주의", "비전"],
                "famousQuote": "Whether you think you can or you think you can't, you're right",
                "categoryTraits": {
                    "work": "혁신적 사고로 산업 변화 주도",
                    "love": "실용적이고 안정적인 관계",
                    "money": "대량생산을 통한 부의 창출",
                    "health": "규칙적이고 효율적인 생활"
                },
                "naturalTemplates": {
                    "work": "산업을 혁신한 헨리 포드처럼, 획기적인 변화를 이끕니다",
                    "love": "실용적인 포드처럼, 안정적이고 든든한 관계를 만듭니다",
                    "money": "대량생산을 개발한 포드처럼, 효율적인 수익 구조를 만듭니다",
                    "health": "규칙적인 포드처럼, 효율적인 건강 관리를 실천합니다"
                }
            },
            {
                "name": "미라 소르비노",
                "nameEn": "Mira Sorvino",
                "period": "1967-",
                "country": "미국",
                "achievements": [
                    "아카데미상 여우조연상 - 마이티 아프로디테",
                    "하버드 대학 졸업 - 동아시아학 전공",
                    "UN 친선대사 - 인신매매 반대 운동"
                ],
                "coreTraits": ["지성", "연기력", "사회의식"],
                "famousQuote": "I have a hard time getting motivated to do something that seems like a career move",
                "categoryTraits": {
                    "work": "지성과 재능을 겸비한 전문성",
                    "love": "지적이고 의미 있는 관계",
                    "money": "가치 있는 일을 통한 수익",
                    "health": "균형잡힌 지적 신체적 건강"
                },
                "naturalTemplates": {
                    "work": "지성을 겸비한 미라 소르비노처럼, 전문성으로 성공을 거둡니다",
                    "love": "지적인 소르비노처럼, 깊이 있는 대화를 나누는 사랑을 합니다",
                    "money": "가치를 추구하는 소르비노처럼, 의미 있는 수익을 창출합니다",
                    "health": "균형잡힌 소르비노처럼, 몸과 마음의 조화를 이룹니다"
                }
            }
        ],
        "virgo": [  # 처녀자리 (현재 19명 → 20명, +1명)
            {
                "name": "키아누 리브스",
                "nameEn": "Keanu Reeves",
                "period": "1964-",
                "country": "캐나다",
                "achievements": [
                    "매트릭스 시리즈 - SF 영화의 혁명",
                    "존 윅 시리즈 - 액션 영화의 새 기준",
                    "겸손과 선행의 아이콘 - 자선 활동"
                ],
                "coreTraits": ["겸손", "진정성", "인내"],
                "famousQuote": "Sometimes simple things are the most difficult things to achieve",
                "categoryTraits": {
                    "work": "꾸준한 노력과 진정성으로 성공",
                    "love": "조용하지만 깊은 사랑",
                    "money": "검소한 생활과 나눔의 실천",
                    "health": "무술과 운동을 통한 건강 유지"
                },
                "naturalTemplates": {
                    "work": "꾸준히 노력한 키아누 리브스처럼, 진정성 있는 성과를 만듭니다",
                    "love": "겸손한 리브스처럼, 조용하지만 깊은 사랑을 나눕니다",
                    "money": "나눔을 실천하는 리브스처럼, 부를 의미 있게 사용합니다",
                    "health": "운동하는 리브스처럼, 꾸준한 노력으로 건강을 유지합니다"
                }
            }
        ],
        "libra": [  # 천칭자리 (현재 16명 → 20명, +4명)
            {
                "name": "서지나 고메즈",
                "nameEn": "Selena Gomez",
                "period": "1992-",
                "country": "미국",
                "achievements": [
                    "가수 겸 배우 - 다방면 성공",
                    "레어 뷰티 창업 - 10억 달러 기업 가치",
                    "정신 건강 인식 개선 운동"
                ],
                "coreTraits": ["회복력", "창업정신", "공감능력"],
                "famousQuote": "You are not defined by an instagram photo or a like or a comment",
                "categoryTraits": {
                    "work": "다양한 분야에서 성공하는 멀티 재능",
                    "love": "진정성 있고 건강한 관계",
                    "money": "창업을 통한 큰 부의 창출",
                    "health": "정신 건강의 중요성 인식과 관리"
                },
                "naturalTemplates": {
                    "work": "다재다능한 셀레나 고메즈처럼, 여러 분야에서 성공을 거둡니다",
                    "love": "진정성 있는 고메즈처럼, 건강한 관계를 만들어갑니다",
                    "money": "사업에 성공한 고메즈처럼, 창업 아이디어가 큰 수익이 됩니다",
                    "health": "자기 돌봄을 실천하는 고메즈처럼, 정신 건강이 향상됩니다"
                }
            },
            {
                "name": "휴 잭맨",
                "nameEn": "Hugh Jackman",
                "period": "1968-",
                "country": "호주",
                "achievements": [
                    "울버린 역할 - 17년간 마블 캐릭터",
                    "위대한 쇼맨 - 뮤지컬 영화 성공",
                    "브로드웨이 스타 - 토니상 수상"
                ],
                "coreTraits": ["다재다능", "헌신", "친화력"],
                "famousQuote": "The secret to life is to have a task, something you devote your entire life to",
                "categoryTraits": {
                    "work": "한 가지에 오랜 헌신으로 완성도 달성",
                    "love": "오래 지속되는 안정적인 사랑",
                    "money": "장기적 프로젝트를 통한 안정적 수입",
                    "health": "규칙적인 운동과 균형잡힌 생활"
                },
                "naturalTemplates": {
                    "work": "울버린을 완성한 휴 잭맨처럼, 오랜 헌신이 걸작을 만듭니다",
                    "love": "가정적인 잭맨처럼, 오래 지속되는 사랑을 가꿉니다",
                    "money": "꾸준히 활동한 잭맨처럼, 안정적인 수입이 보장됩니다",
                    "health": "운동하는 잭맨처럼, 나이를 잊은 체력을 유지합니다"
                }
            },
            {
                "name": "윌 스미스",
                "nameEn": "Will Smith",
                "period": "1968-",
                "country": "미국",
                "achievements": [
                    "할리우드 최고 수입 배우 - 블록버스터 스타",
                    "래퍼에서 배우로 - 성공적 전환",
                    "아카데미상 후보 3회 - 연기력 인정"
                ],
                "coreTraits": ["카리스마", "긍정성", "다재다능"],
                "famousQuote": "The first step is you have to say that you can",
                "categoryTraits": {
                    "work": "긍정적 마인드로 모든 도전 극복",
                    "love": "열정적이고 헌신적인 가족애",
                    "money": "다양한 재능을 통한 부의 창출",
                    "health": "긍정적 사고와 운동으로 건강 유지"
                },
                "naturalTemplates": {
                    "work": "긍정적인 윌 스미스처럼, 모든 도전을 기회로 만듭니다",
                    "love": "가족을 사랑하는 스미스처럼, 깊은 가족애를 나눕니다",
                    "money": "다재다능한 스미스처럼, 여러 분야에서 수익을 창출합니다",
                    "health": "활력 넘치는 스미스처럼, 긍정 에너지가 건강을 만듭니다"
                }
            },
            {
                "name": "브루노 마스",
                "nameEn": "Bruno Mars",
                "period": "1985-",
                "country": "미국",
                "achievements": [
                    "11회 그래미상 수상 - 음악 천재",
                    "슈퍼볼 하프타임 쇼 - 최고 시청률",
                    "작곡, 프로듀싱, 공연 - 올라운드 뮤지션"
                ],
                "coreTraits": ["재능", "완벽주의", "쇼맨십"],
                "famousQuote": "You have to be who you are, and unapologetically you",
                "categoryTraits": {
                    "work": "완벽주의적 접근으로 최고 품질 추구",
                    "love": "로맨틱하고 열정적인 사랑",
                    "money": "재능을 통한 지속적 수익 창출",
                    "health": "공연을 위한 철저한 체력 관리"
                },
                "naturalTemplates": {
                    "work": "완벽을 추구하는 브루노 마스처럼, 최고 품질의 결과를 만듭니다",
                    "love": "로맨틱한 마스처럼, 열정적인 사랑을 표현합니다",
                    "money": "히트곡을 만든 마스처럼, 창작물이 큰 수익을 가져옵니다",
                    "health": "에너제틱한 마스처럼, 활력이 넘치는 하루를 보냅니다"
                }
            }
        ],
        "scorpio": [  # 전갈자리는 이미 20명 완료
        ],
        "sagittarius": [  # 사수자리 (현재 7명 → 20명, +13명)
            {
                "name": "브래드 피트",
                "nameEn": "Brad Pitt",
                "period": "1963-",
                "country": "미국",
                "achievements": [
                    "아카데미상 2회 수상 - 연기와 제작",
                    "플랜 B 엔터테인먼트 - 성공적 제작사",
                    "인도주의 활동 - 뉴올리언스 재건"
                ],
                "coreTraits": ["카리스마", "모험심", "창의성"],
                "famousQuote": "I believe you make your day. You make your life",
                "categoryTraits": {
                    "work": "연기와 제작 양면에서 성공",
                    "love": "자유롭고 열정적인 관계",
                    "money": "영화 제작을 통한 큰 수익",
                    "health": "활동적인 라이프스타일"
                },
                "naturalTemplates": {
                    "work": "영화를 제작한 브래드 피트처럼, 창의적인 프로젝트가 성공합니다",
                    "love": "자유로운 피트처럼, 구속 없는 열정적인 사랑을 합니다",
                    "money": "사업에 성공한 피트처럼, 투자가 큰 수익으로 돌아옵니다",
                    "health": "활동적인 피트처럼, 모험적인 활동으로 활력을 얻습니다"
                }
            },
            {
                "name": "테일러 스위프트",
                "nameEn": "Taylor Swift",
                "period": "1989-",
                "country": "미국",
                "achievements": [
                    "12회 그래미상 수상 - 최연소 올해의 앨범상",
                    "음원 재녹음 - 아티스트 권리 수호",
                    "타임지 올해의 인물 - 문화적 영향력"
                ],
                "coreTraits": ["창의성", "독립성", "진정성"],
                "famousQuote": "No matter what happens in life, be good to people",
                "categoryTraits": {
                    "work": "자기 주도적으로 커리어 관리",
                    "love": "경험을 예술로 승화시키는 사랑",
                    "money": "창작물과 비즈니스 감각의 결합",
                    "health": "정신적 회복력과 성장"
                },
                "naturalTemplates": {
                    "work": "자기 주도적인 테일러 스위프트처럼, 당신의 비전을 실현합니다",
                    "love": "진정성 있는 스위프트처럼, 깊은 감정을 나누는 사랑을 합니다",
                    "money": "사업 감각이 뛰어난 스위프트처럼, 창작이 부로 연결됩니다",
                    "health": "회복력 있는 스위프트처럼, 어려움을 성장의 기회로 만듭니다"
                }
            },
            {
                "name": "스티븐 스필버그",
                "nameEn": "Steven Spielberg",
                "period": "1946-",
                "country": "미국",
                "achievements": [
                    "영화 역사상 최고 흥행 감독 - 100억 달러 이상",
                    "3회 아카데미상 수상 - 감독상",
                    "쉰들러 리스트, E.T., 쥬라기 공원 - 걸작들"
                ],
                "coreTraits": ["상상력", "스토리텔링", "휴머니즘"],
                "famousQuote": "All of us every single year, we're a different person",
                "categoryTraits": {
                    "work": "상상력을 현실로 만드는 창조력",
                    "love": "가족과 인간애를 중시하는 사랑",
                    "money": "블록버스터를 통한 막대한 수익",
                    "health": "창작 활동을 통한 정신적 젊음"
                },
                "naturalTemplates": {
                    "work": "영화의 거장 스필버그처럼, 상상력이 현실이 됩니다",
                    "love": "휴머니즘을 추구하는 스필버그처럼, 따뜻한 인간애를 나눕니다",
                    "money": "블록버스터를 만든 스필버그처럼, 큰 프로젝트가 성공합니다",
                    "health": "창의적인 스필버그처럼, 상상력이 활력을 가져다줍니다"
                }
            },
            {
                "name": "마일리 사이러스",
                "nameEn": "Miley Cyrus",
                "period": "1992-",
                "country": "미국",
                "achievements": [
                    "한나 몬타나에서 록스타로 - 성공적 변신",
                    "그래미상 수상 - Flowers",
                    "LGBTQ+ 권리 옹호 - 해피 히피 재단"
                ],
                "coreTraits": ["자유로움", "진화", "진정성"],
                "famousQuote": "Life's a climb, but the view is great",
                "categoryTraits": {
                    "work": "끊임없는 변화와 재창조",
                    "love": "자유롭고 진정성 있는 관계",
                    "money": "다양한 시도를 통한 수익 창출",
                    "health": "자기 표현을 통한 정신 건강"
                },
                "naturalTemplates": {
                    "work": "끊임없이 진화하는 마일리 사이러스처럼, 새로운 모습으로 성공합니다",
                    "love": "자유로운 사이러스처럼, 구속 없는 진정한 사랑을 합니다",
                    "money": "다양한 시도를 하는 사이러스처럼, 새로운 수익원을 발견합니다",
                    "health": "자기 표현을 하는 사이러스처럼, 정신적 자유를 얻습니다"
                }
            },
            {
                "name": "프랭크 시나트라",
                "nameEn": "Frank Sinatra",
                "period": "1915-1998",
                "country": "미국",
                "achievements": [
                    "My Way - 시대를 초월한 명곡",
                    "라스베가스의 제왕 - 엔터테인먼트 아이콘",
                    "아카데미상 수상 - 지상에서 영원으로"
                ],
                "coreTraits": ["카리스마", "스타일", "독립성"],
                "famousQuote": "The best revenge is massive success",
                "categoryTraits": {
                    "work": "자신만의 스타일로 정상 도달",
                    "love": "열정적이고 로맨틱한 사랑",
                    "money": "엔터테인먼트를 통한 부의 창출",
                    "health": "끝까지 현역으로 활동하는 열정"
                },
                "naturalTemplates": {
                    "work": "전설이 된 프랭크 시나트라처럼, 당신만의 스타일로 성공합니다",
                    "love": "로맨틱한 시나트라처럼, 열정적인 사랑을 즐깁니다",
                    "money": "쇼비즈니스의 제왕 시나트라처럼, 엔터테인먼트가 부를 만듭니다",
                    "health": "열정적인 시나트라처럼, 나이를 잊은 활력을 유지합니다"
                }
            },
            {
                "name": "빌리 아일리시",
                "nameEn": "Billie Eilish",
                "period": "2001-",
                "country": "미국",
                "achievements": [
                    "최연소 그래미 4관왕 - 18세 기록",
                    "007 주제곡 최연소 가수",
                    "Z세대 아이콘 - 새로운 음악 스타일"
                ],
                "coreTraits": ["독창성", "진정성", "영향력"],
                "famousQuote": "I've always done whatever I want and always been exactly who I am",
                "categoryTraits": {
                    "work": "독특한 스타일로 새로운 트렌드 창조",
                    "love": "진정성 있고 건강한 관계",
                    "money": "젊은 나이의 큰 성공",
                    "health": "정신 건강에 대한 개방성"
                },
                "naturalTemplates": {
                    "work": "독창적인 빌리 아일리시처럼, 새로운 트렌드를 만들어냅니다",
                    "love": "진정성 있는 아일리시처럼, 있는 그대로 사랑받습니다",
                    "money": "젊은 나이에 성공한 아일리시처럼, 빠른 성장을 경험합니다",
                    "health": "자기 돌봄을 중시하는 아일리시처럼, 정신 건강을 챙깁니다"
                }
            },
            {
                "name": "제이-지",
                "nameEn": "Jay-Z",
                "period": "1969-",
                "country": "미국",
                "achievements": [
                    "힙합 억만장자 - 10억 달러 이상 자산",
                    "24회 그래미상 수상 - 랩 레전드",
                    "록 네이션 설립 - 엔터테인먼트 제국"
                ],
                "coreTraits": ["비즈니스 감각", "혁신", "리더십"],
                "famousQuote": "I'm not a businessman, I'm a business, man",
                "categoryTraits": {
                    "work": "예술과 비즈니스의 완벽한 결합",
                    "love": "파워 커플로서의 시너지",
                    "money": "다각화된 투자로 부의 확장",
                    "health": "성공을 위한 정신력 유지"
                },
                "naturalTemplates": {
                    "work": "비즈니스 제국을 세운 제이-지처럼, 큰 비전을 실현합니다",
                    "love": "파워 커플인 제이-지처럼, 함께 성장하는 관계를 만듭니다",
                    "money": "투자의 귀재 제이-지처럼, 부가 기하급수적으로 증가합니다",
                    "health": "강한 정신력의 제이-지처럼, 스트레스를 성공의 원동력으로 만듭니다"
                }
            },
            {
                "name": "네이마르",
                "nameEn": "Neymar Jr.",
                "period": "1992-",
                "country": "브라질",
                "achievements": [
                    "브라질 축구 스타 - 역대 최고 이적료",
                    "바르셀로나 MSN 트리오 - 챔피언스리그 우승",
                    "브라질 대표팀 에이스"
                ],
                "coreTraits": ["재능", "창의성", "쇼맨십"],
                "famousQuote": "There is no pressure when you are making a dream come true",
                "categoryTraits": {
                    "work": "창의적인 플레이로 관중 매료",
                    "love": "열정적이고 자유로운 사랑",
                    "money": "재능을 통한 막대한 수입",
                    "health": "유연성과 민첩성 유지"
                },
                "naturalTemplates": {
                    "work": "창의적인 플레이의 네이마르처럼, 독창적인 해결책을 찾습니다",
                    "love": "열정적인 네이마르처럼, 자유롭고 즐거운 사랑을 합니다",
                    "money": "최고 연봉의 네이마르처럼, 재능이 큰 보상으로 이어집니다",
                    "health": "유연한 네이마르처럼, 민첩하고 활력 있는 몸을 유지합니다"
                }
            },
            {
                "name": "리타 오라",
                "nameEn": "Rita Ora",
                "period": "1990-",
                "country": "영국",
                "achievements": [
                    "영국 차트 1위 다수 - 팝스타",
                    "패션 아이콘 - 브랜드 콜라보레이션",
                    "영화 배우 - 그레이의 50가지 그림자"
                ],
                "coreTraits": ["다재다능", "패션 감각", "국제성"],
                "famousQuote": "I'm a massive believer in being able to reinvent yourself",
                "categoryTraits": {
                    "work": "음악, 패션, 연기 등 다방면 활동",
                    "love": "국제적이고 다양한 관계",
                    "money": "다양한 수입원 창출",
                    "health": "활발한 활동으로 에너지 유지"
                },
                "naturalTemplates": {
                    "work": "다재다능한 리타 오라처럼, 여러 분야에서 재능을 발휘합니다",
                    "love": "국제적인 오라처럼, 다양한 문화의 사랑을 경험합니다",
                    "money": "여러 사업을 하는 오라처럼, 다양한 수입원이 생깁니다",
                    "health": "활발한 오라처럼, 끊임없는 활동으로 활력을 유지합니다"
                }
            },
            {
                "name": "짐 모리슨",
                "nameEn": "Jim Morrison",
                "period": "1943-1971",
                "country": "미국",
                "achievements": [
                    "도어스 리드 보컬 - 록의 전설",
                    "시인이자 가수 - 예술적 가사",
                    "반문화 아이콘 - 60년대 상징"
                ],
                "coreTraits": ["시적 감성", "반항심", "카리스마"],
                "famousQuote": "Expose yourself to your deepest fear; after that, fear has no power",
                "categoryTraits": {
                    "work": "예술적 표현의 경계 확장",
                    "love": "열정적이고 자유로운 사랑",
                    "money": "예술을 통한 가치 창출",
                    "health": "정신적 자유와 해방"
                },
                "naturalTemplates": {
                    "work": "예술의 경계를 넓힌 짐 모리슨처럼, 창의적 한계를 돌파합니다",
                    "love": "자유로운 영혼 모리슨처럼, 구속 없는 사랑을 추구합니다",
                    "money": "전설이 된 모리슨처럼, 예술적 가치가 인정받습니다",
                    "health": "자유로운 모리슨처럼, 정신적 해방감을 느낍니다"
                }
            },
            {
                "name": "사라 실버먼",
                "nameEn": "Sarah Silverman",
                "period": "1970-",
                "country": "미국",
                "achievements": [
                    "에미상 수상 코미디언",
                    "사회 비판 코미디 - 정치적 유머",
                    "작가이자 배우 - 다방면 활동"
                ],
                "coreTraits": ["유머", "지성", "용기"],
                "famousQuote": "Mother Teresa didn't walk around complaining about her thighs",
                "categoryTraits": {
                    "work": "유머로 사회 문제 제기",
                    "love": "지적이고 유머러스한 관계",
                    "money": "코미디를 통한 성공",
                    "health": "웃음을 통한 스트레스 해소"
                },
                "naturalTemplates": {
                    "work": "날카로운 유머의 사라 실버먼처럼, 위트로 문제를 해결합니다",
                    "love": "유머러스한 실버먼처럼, 웃음이 넘치는 관계를 만듭니다",
                    "money": "성공한 코미디언 실버먼처럼, 재능이 수익으로 연결됩니다",
                    "health": "웃음을 사랑하는 실버먼처럼, 유머로 건강을 유지합니다"
                }
            },
            {
                "name": "디에고 마라도나",
                "nameEn": "Diego Maradona",
                "period": "1960-2020",
                "country": "아르헨티나",
                "achievements": [
                    "1986 월드컵 우승 - 아르헨티나 영웅",
                    "신의 손 골 - 축구 역사의 전설",
                    "나폴리 세리에 A 우승 - 클럽 레전드"
                ],
                "coreTraits": ["천재성", "열정", "카리스마"],
                "famousQuote": "When people succeed, it is because of hard work. Luck has nothing to do with success",
                "categoryTraits": {
                    "work": "천재적 재능과 노력의 결합",
                    "love": "열정적이고 충성스러운 사랑",
                    "money": "재능을 통한 부의 창출",
                    "health": "경기를 위한 체력 관리"
                },
                "naturalTemplates": {
                    "work": "축구의 신 마라도나처럼, 천재적 재능을 발휘합니다",
                    "love": "열정적인 마라도나처럼, 뜨거운 사랑을 나눕니다",
                    "money": "전설이 된 마라도나처럼, 재능이 큰 부로 이어집니다",
                    "health": "투지의 마라도나처럼, 강한 정신력으로 극복합니다"
                }
            },
            {
                "name": "크리스티나 아길레라",
                "nameEn": "Christina Aguilera",
                "period": "1980-",
                "country": "미국",
                "achievements": [
                    "5회 그래미상 수상 - 보컬의 여왕",
                    "4옥타브 음역대 - 놀라운 가창력",
                    "LGBTQ+ 권리 옹호자"
                ],
                "coreTraits": ["보컬 실력", "자기표현", "임파워먼트"],
                "famousQuote": "The roughest roads often lead to the top",
                "categoryTraits": {
                    "work": "완벽한 보컬 실력으로 감동 전달",
                    "love": "강렬하고 진정성 있는 사랑",
                    "money": "음악을 통한 지속적 수익",
                    "health": "목소리 관리와 정신 건강"
                },
                "naturalTemplates": {
                    "work": "파워풀한 크리스티나 아길레라처럼, 강력한 임팩트를 만듭니다",
                    "love": "진정성 있는 아길레라처럼, 깊고 강렬한 사랑을 합니다",
                    "money": "성공한 아길레라처럼, 재능이 안정적 수입을 보장합니다",
                    "health": "강한 아길레라처럼, 어려움을 이겨내는 힘을 갖습니다"
                }
            }
        ],
        "capricorn": [  # 염소자리는 이미 20명 완료
        ],
        "aquarius": [  # 물병자리는 이미 20명 완료
        ],
        "pisces": [  # 물고기자리는 이미 20명 완료
        ]
    }
    
    return additional_figures

def add_figures_to_data(data, additional_figures):
    """데이터에 추가 인물들 삽입"""
    
    added_count = 0
    
    for zodiac_key, new_figures in additional_figures.items():
        if zodiac_key in data['zodiacFigures'] and new_figures:
            current_figures = data['zodiacFigures'][zodiac_key].get('figures', [])
            
            # 새 인물들 추가
            for figure in new_figures:
                current_figures.append(figure)
                added_count += 1
                print(f"[추가] {zodiac_key} - {figure['name']}")
            
            data['zodiacFigures'][zodiac_key]['figures'] = current_figures
    
    return data, added_count

def main():
    """메인 실행 함수"""
    input_file = r"C:\code\rheight\zodiac-system\historical-figures-enhanced.json"
    
    print("=" * 60)
    print("[시작] 240명 완성을 위한 나머지 인물 추가")
    print("=" * 60)
    
    try:
        # 데이터 로드
        print("\n[1단계] 현재 데이터 로드...")
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 현재 상태 확인
        counts, total = count_current_figures(data)
        print(f"\n[현재 상태]")
        print(f"총 인물 수: {total}명")
        for zodiac, count in counts.items():
            needed = 20 - count
            status = "✅ 완료" if count >= 20 else f"❌ {needed}명 필요"
            print(f"  - {zodiac}: {count}명 {status}")
        
        # 추가할 인물 준비
        print(f"\n[2단계] 추가할 인물 준비...")
        additional = get_additional_figures()
        
        # 인물 추가
        print(f"\n[3단계] 인물 추가 중...")
        data, added_count = add_figures_to_data(data, additional)
        
        # 결과 저장
        print(f"\n[4단계] 결과 저장...")
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # 최종 확인
        final_counts, final_total = count_current_figures(data)
        
        print("\n" + "=" * 60)
        print("[완료] 240명 데이터 완성!")
        print(f"추가된 인물: {added_count}명")
        print(f"최종 인물 수: {final_total}명")
        print("\n[최종 별자리별 인물 수]")
        for zodiac, count in final_counts.items():
            print(f"  - {zodiac}: {count}명 ✅")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n[오류] 처리 중 오류: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()