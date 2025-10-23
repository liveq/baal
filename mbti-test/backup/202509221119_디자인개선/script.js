// MBTI 테스트 데이터와 로직
class MBTITest {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.userInfo = {};
        this.testType = null; // 'quick' or 'full'
        this.questions = this.generateQuestions();
        this.quickQuestions = this.generateQuickQuestions();
        this.typeDetails = this.getTypeDetails();
        this.compatibilityData = this.getCompatibilityData();
        
        this.initializeEventListeners();
    }

    // 70개 질문 생성 (정식 MBTI 수준)
    generateQuestions() {
        return [
            // E/I 차원 (18개)
            { text: "새로운 환경에서 처음 사람들을 만날 때 나는", dimension: "EI", options: ["먼저 다가가서 자연스럽게 인사한다", "상대방이 먼저 말을 걸기를 기다린다"], scores: [1, -1] },
            { text: "파티나 모임에서 나는", dimension: "EI", options: ["여러 사람들과 활발하게 대화를 나눈다", "친한 몇 명과 깊이 있는 대화를 나눈다"], scores: [1, -1] },
            { text: "힘든 일을 마친 후 에너지를 충전하는 방법은", dimension: "EI", options: ["친구들과 만나서 수다를 떨거나 활동한다", "혼자만의 조용한 시간을 갖는다"], scores: [1, -1] },
            { text: "새로운 프로젝트 팀에서 나는", dimension: "EI", options: ["적극적으로 의견을 제시하며 토론에 참여한다", "충분히 생각한 후 신중하게 발언한다"], scores: [1, -1] },
            { text: "회의나 토론에서 나는", dimension: "EI", options: ["즉석에서 떠오르는 아이디어를 바로 말한다", "미리 정리한 생각을 체계적으로 발표한다"], scores: [1, -1] },
            { text: "친구들과 함께 있을 때", dimension: "EI", options: ["대화하며 에너지가 생기고 활기차진다", "즐겁지만 시간이 지나면 피곤해진다"], scores: [1, -1] },
            { text: "새로운 아이디어가 떠올랐을 때", dimension: "EI", options: ["바로 다른 사람들과 공유하고 싶어한다", "혼자 충분히 다듬은 후에 공유한다"], scores: [1, -1] },
            { text: "스트레스를 받을 때 나는", dimension: "EI", options: ["사람들과 이야기하며 해결책을 찾는다", "혼자만의 시간을 가지며 정리한다"], scores: [1, -1] },
            { text: "전화 통화를 할 때", dimension: "EI", options: ["길게 이야기하는 것을 좋아한다", "용건만 간단히 말하고 끝내고 싶다"], scores: [1, -1] },
            { text: "새로운 사람들이 많은 행사에서", dimension: "EI", options: ["흥미롭고 에너지가 생긴다", "부담스럽고 피곤하다"], scores: [1, -1] },
            { text: "생각을 정리할 때", dimension: "EI", options: ["말하면서 생각이 더 명확해진다", "조용히 혼자 생각할 때 잘 정리된다"], scores: [1, -1] },
            { text: "휴식시간에 나는", dimension: "EI", options: ["동료들과 대화하며 시간을 보낸다", "혼자서 조용히 시간을 보낸다"], scores: [1, -1] },
            { text: "새로운 취미를 배울 때", dimension: "EI", options: ["다른 사람들과 함께 배우는 것을 선호한다", "혼자서 차근차근 익히는 것을 선호한다"], scores: [1, -1] },
            { text: "문제가 생겼을 때", dimension: "EI", options: ["바로 다른 사람들과 상의한다", "혼자서 먼저 생각해본 후 상의한다"], scores: [1, -1] },
            { text: "주말에 이상적인 시간 보내기는", dimension: "EI", options: ["친구들과 만나거나 활동에 참여하기", "집에서 혼자만의 시간 갖기"], scores: [1, -1] },
            { text: "새로운 환경에 적응할 때", dimension: "EI", options: ["사람들과 빨리 친해지려고 노력한다", "시간을 두고 천천히 적응한다"], scores: [1, -1] },
            { text: "업무 중 집중이 흐트러질 때", dimension: "EI", options: ["동료와 잠깐 대화하면 다시 집중된다", "혼자만의 공간에서 정리하면 집중된다"], scores: [1, -1] },
            { text: "감정이 복잡할 때", dimension: "EI", options: ["믿을 만한 사람과 이야기한다", "일기를 쓰거나 혼자 정리한다"], scores: [1, -1] },

            // S/N 차원 (18개)
            { text: "새로운 정보를 받을 때", dimension: "SN", options: ["구체적인 사실과 세부사항을 중요시한다", "전체적인 의미와 가능성을 중요시한다"], scores: [-1, 1] },
            { text: "업무를 처리할 때", dimension: "SN", options: ["단계별로 차근차근 정확하게 한다", "전체적인 틀을 먼저 잡고 진행한다"], scores: [-1, 1] },
            { text: "문제를 해결할 때 나는", dimension: "SN", options: ["과거 경험과 검증된 방법을 활용한다", "새로운 관점과 창의적 방법을 시도한다"], scores: [-1, 1] },
            { text: "책을 읽을 때", dimension: "SN", options: ["실용적이고 구체적인 내용을 선호한다", "이론적이고 추상적인 내용을 선호한다"], scores: [-1, 1] },
            { text: "대화를 할 때 나는", dimension: "SN", options: ["구체적인 사실과 경험담을 말한다", "가능성과 아이디어에 대해 말한다"], scores: [-1, 1] },
            { text: "새로운 프로젝트를 시작할 때", dimension: "SN", options: ["기존의 검증된 방법을 먼저 조사한다", "혁신적이고 창의적인 방법을 먼저 탐색한다"], scores: [-1, 1] },
            { text: "계획을 세울 때", dimension: "SN", options: ["현실적이고 달성 가능한 목표를 세운다", "이상적이고 도전적인 비전을 그린다"], scores: [-1, 1] },
            { text: "정보를 기억할 때", dimension: "SN", options: ["세부사항과 구체적 내용을 잘 기억한다", "전체적 맥락과 의미를 잘 기억한다"], scores: [-1, 1] },
            { text: "새로운 기술을 배울 때", dimension: "SN", options: ["실습과 경험을 통해 단계적으로 익힌다", "원리와 개념을 먼저 이해하고 응용한다"], scores: [-1, 1] },
            { text: "예술 작품을 감상할 때", dimension: "SN", options: ["색채, 구도 등 구체적 요소에 주목한다", "작품이 전달하는 메시지와 의미에 주목한다"], scores: [-1, 1] },
            { text: "미래를 생각할 때", dimension: "SN", options: ["현실적으로 가능한 일들을 계획한다", "무한한 가능성과 잠재력을 상상한다"], scores: [-1, 1] },
            { text: "설명을 할 때", dimension: "SN", options: ["구체적인 예시와 사례를 들어 설명한다", "큰 그림과 개념을 중심으로 설명한다"], scores: [-1, 1] },
            { text: "관심사를 선택할 때", dimension: "SN", options: ["실용적이고 현실에 적용 가능한 것", "창의적이고 상상력을 자극하는 것"], scores: [-1, 1] },
            { text: "일의 우선순위를 정할 때", dimension: "SN", options: ["현재 당장 필요한 일부터 한다", "미래에 중요할 일을 먼저 고려한다"], scores: [-1, 1] },
            { text: "변화에 대해서", dimension: "SN", options: ["검증된 것이 안전하다고 생각한다", "변화와 새로운 시도가 필요하다고 생각한다"], scores: [-1, 1] },
            { text: "디테일에 대해", dimension: "SN", options: ["세부사항까지 꼼꼼히 챙기는 편이다", "큰 틀이 맞으면 세부사항은 유연하게 본다"], scores: [-1, 1] },
            { text: "아이디어를 평가할 때", dimension: "SN", options: ["실현 가능성과 실용성을 먼저 본다", "창의성과 혁신성을 먼저 본다"], scores: [-1, 1] },
            { text: "학습할 때", dimension: "SN", options: ["사례와 실습을 통해 배우는 것이 효과적이다", "이론과 원리를 이해하는 것이 효과적이다"], scores: [-1, 1] },

            // T/F 차원 (17개)
            { text: "중요한 결정을 내릴 때", dimension: "TF", options: ["논리적 분석과 객관적 사실을 중시한다", "관련된 사람들의 감정과 가치를 중시한다"], scores: [1, -1] },
            { text: "다른 사람을 비판할 때", dimension: "TF", options: ["사실에 근거해서 직접적으로 말한다", "상대방의 기분을 고려해서 조심스럽게 말한다"], scores: [1, -1] },
            { text: "갈등이 생겼을 때", dimension: "TF", options: ["논리적 근거로 합리적 해결책을 찾는다", "서로의 감정을 이해하고 화합을 추구한다"], scores: [1, -1] },
            { text: "친구가 고민 상담을 할 때", dimension: "TF", options: ["문제를 분석하고 해결책을 제시한다", "감정에 공감하고 위로해준다"], scores: [1, -1] },
            { text: "팀에서 의견이 나뉠 때", dimension: "TF", options: ["객관적 기준으로 최선의 방안을 선택한다", "모든 팀원이 수용할 수 있는 방안을 찾는다"], scores: [1, -1] },
            { text: "업무 평가를 할 때", dimension: "TF", options: ["성과와 결과를 객관적으로 평가한다", "노력과 성장 과정을 종합적으로 고려한다"], scores: [1, -1] },
            { text: "옳고 그름을 판단할 때", dimension: "TF", options: ["일관된 원칙과 기준이 중요하다", "상황과 맥락을 고려하는 것이 중요하다"], scores: [1, -1] },
            { text: "다른 사람의 실수를 볼 때", dimension: "TF", options: ["무엇이 잘못되었는지 명확히 지적한다", "실수한 사람의 마음을 먼저 살핀다"], scores: [1, -1] },
            { text: "리더십을 발휘할 때", dimension: "TF", options: ["효율성과 성과 달성에 집중한다", "팀원들의 동기부여와 성장에 집중한다"], scores: [1, -1] },
            { text: "규칙에 대해서", dimension: "TF", options: ["공정성을 위해 일관되게 적용되어야 한다", "상황에 따라 유연하게 적용할 수 있다"], scores: [1, -1] },
            { text: "선택의 기준은", dimension: "TF", options: ["합리적이고 효율적인 것이 최선이다", "사람들에게 도움이 되는 것이 최선이다"], scores: [1, -1] },
            { text: "비판을 받았을 때", dimension: "TF", options: ["내용이 타당한지 논리적으로 검토한다", "상대방의 의도와 감정을 먼저 파악한다"], scores: [1, -1] },
            { text: "조직의 문제를 해결할 때", dimension: "TF", options: ["시스템과 프로세스 개선에 집중한다", "사람들 간의 관계와 소통 개선에 집중한다"], scores: [1, -1] },
            { text: "성공의 척도는", dimension: "TF", options: ["목표 달성과 성과 지표가 중요하다", "구성원들의 만족도와 성장이 중요하다"], scores: [1, -1] },
            { text: "동료와의 관계에서", dimension: "TF", options: ["업무적 역량과 전문성을 중시한다", "인간적 신뢰와 배려를 중시한다"], scores: [1, -1] },
            { text: "피드백을 줄 때", dimension: "TF", options: ["개선점을 구체적이고 직접적으로 전달한다", "격려와 함께 부드럽게 전달한다"], scores: [1, -1] },
            { text: "의사결정 시 고려사항은", dimension: "TF", options: ["데이터와 분석 결과가 가장 중요하다", "관련된 사람들에게 미치는 영향이 중요하다"], scores: [1, -1] },

            // J/P 차원 (17개)
            { text: "계획을 세울 때", dimension: "JP", options: ["상세한 일정과 목표를 미리 정한다", "큰 틀만 정하고 상황에 따라 조정한다"], scores: [1, -1] },
            { text: "업무 마감일에 대해", dimension: "JP", options: ["미리 여유를 두고 완성한다", "마감 압박을 받을 때 더 집중한다"], scores: [1, -1] },
            { text: "예상치 못한 일이 생겼을 때", dimension: "JP", options: ["기존 계획을 수정해서 체계적으로 대응한다", "즉흥적으로 유연하게 상황에 맞춰 대응한다"], scores: [1, -1] },
            { text: "일상생활에서", dimension: "JP", options: ["규칙적인 루틴과 스케줄을 선호한다", "그때그때 기분에 따라 자유롭게 생활한다"], scores: [1, -1] },
            { text: "여행 계획을 세울 때", dimension: "JP", options: ["미리 상세한 일정표를 만든다", "대략적인 계획만 세우고 현지에서 결정한다"], scores: [1, -1] },
            { text: "결정을 내려야 할 때", dimension: "JP", options: ["빨리 결정하고 추진하는 것을 선호한다", "여러 가능성을 두고 계속 고민하는 것을 선호한다"], scores: [1, -1] },
            { text: "업무 환경에서", dimension: "JP", options: ["명확한 지침과 체계가 있는 것이 편하다", "자율성과 융통성이 있는 것이 편하다"], scores: [1, -1] },
            { text: "프로젝트를 진행할 때", dimension: "JP", options: ["단계별 계획에 따라 순서대로 진행한다", "상황에 맞춰 우선순위를 바꿔가며 진행한다"], scores: [1, -1] },
            { text: "새로운 기회가 생겼을 때", dimension: "JP", options: ["신중하게 계획을 세운 후 시작한다", "일단 시작해보고 진행하면서 배운다"], scores: [1, -1] },
            { text: "시간 관리에 대해", dimension: "JP", options: ["정해진 시간에 맞춰 행동하는 것이 중요하다", "시간에 얽매이지 않고 유연하게 하는 것이 좋다"], scores: [1, -1] },
            { text: "일의 마무리에 대해", dimension: "JP", options: ["완전히 끝낼 때까지 계속 신경 쓴다", "어느 정도 되면 다른 일로 관심이 옮겨간다"], scores: [1, -1] },
            { text: "변화에 대해서", dimension: "JP", options: ["안정적이고 예측 가능한 것을 선호한다", "변화와 새로운 경험을 즐긴다"], scores: [1, -1] },
            { text: "목표 설정에 대해", dimension: "JP", options: ["구체적이고 달성 가능한 목표를 세운다", "유연하고 상황에 따라 조정 가능한 목표를 세운다"], scores: [1, -1] },
            { text: "회의나 모임에서", dimension: "JP", options: ["미리 준비한 안건에 따라 진행하는 것이 좋다", "자유롭게 의견을 나누며 진행하는 것이 좋다"], scores: [1, -1] },
            { text: "새로운 도전에 대해", dimension: "JP", options: ["충분히 준비하고 계획을 세운 후 시작한다", "우선 해보고 경험하면서 배워나간다"], scores: [1, -1] },
            { text: "업무 우선순위를 정할 때", dimension: "JP", options: ["미리 정해둔 기준에 따라 일관되게 한다", "그때그때 상황을 보고 유연하게 조정한다"], scores: [1, -1] },
            { text: "의사결정 과정에서", dimension: "JP", options: ["충분한 정보 수집 후 신속하게 결정한다", "다양한 옵션을 계속 열어두고 천천히 결정한다"], scores: [1, -1] }
        ];
    }

    // 20개 약식 질문 생성 (각 차원별 5개씩)
    generateQuickQuestions() {
        return [
            // E/I 차원 (5개) - 핵심 상황만
            { text: "힘든 일을 마친 후 에너지를 충전하는 방법은", dimension: "EI", options: ["친구들과 만나서 이야기하며 활동한다", "혼자만의 조용한 시간을 갖는다"], scores: [1, -1] },
            { text: "파티나 모임에서 나는", dimension: "EI", options: ["여러 사람들과 활발하게 대화를 나눈다", "친한 몇 명과 깊이 있는 대화를 나눈다"], scores: [1, -1] },
            { text: "새로운 아이디어가 떠올랐을 때", dimension: "EI", options: ["바로 다른 사람들과 공유하고 싶어한다", "혼자 충분히 다듬은 후에 공유한다"], scores: [1, -1] },
            { text: "회의나 토론에서 나는", dimension: "EI", options: ["즉석에서 떠오르는 아이디어를 바로 말한다", "미리 정리한 생각을 체계적으로 발표한다"], scores: [1, -1] },
            { text: "스트레스를 받을 때 나는", dimension: "EI", options: ["사람들과 이야기하며 해결책을 찾는다", "혼자만의 시간을 가지며 정리한다"], scores: [1, -1] },

            // S/N 차원 (5개) - 정보 처리의 핵심
            { text: "새로운 정보를 받을 때", dimension: "SN", options: ["구체적인 사실과 세부사항을 중요시한다", "전체적인 의미와 가능성을 중요시한다"], scores: [-1, 1] },
            { text: "문제를 해결할 때 나는", dimension: "SN", options: ["과거 경험과 검증된 방법을 활용한다", "새로운 관점과 창의적 방법을 시도한다"], scores: [-1, 1] },
            { text: "미래를 생각할 때", dimension: "SN", options: ["현실적으로 가능한 일들을 계획한다", "무한한 가능성과 잠재력을 상상한다"], scores: [-1, 1] },
            { text: "업무를 처리할 때", dimension: "SN", options: ["단계별로 차근차근 정확하게 한다", "전체적인 틀을 먼저 잡고 진행한다"], scores: [-1, 1] },
            { text: "새로운 기술을 배울 때", dimension: "SN", options: ["실습과 경험을 통해 단계적으로 익힌다", "원리와 개념을 먼저 이해하고 응용한다"], scores: [-1, 1] },

            // T/F 차원 (5개) - 의사결정의 핵심
            { text: "중요한 결정을 내릴 때", dimension: "TF", options: ["논리적 분석과 객관적 사실을 중시한다", "관련된 사람들의 감정과 가치를 중시한다"], scores: [1, -1] },
            { text: "갈등이 생겼을 때", dimension: "TF", options: ["논리적 근거로 합리적 해결책을 찾는다", "서로의 감정을 이해하고 화합을 추구한다"], scores: [1, -1] },
            { text: "친구가 고민 상담을 할 때", dimension: "TF", options: ["문제를 분석하고 해결책을 제시한다", "감정에 공감하고 위로해준다"], scores: [1, -1] },
            { text: "다른 사람을 비판할 때", dimension: "TF", options: ["사실에 근거해서 직접적으로 말한다", "상대방의 기분을 고려해서 조심스럽게 말한다"], scores: [1, -1] },
            { text: "선택의 기준은", dimension: "TF", options: ["합리적이고 효율적인 것이 최선이다", "사람들에게 도움이 되는 것이 최선이다"], scores: [1, -1] },

            // J/P 차원 (5개) - 생활양식의 핵심
            { text: "계획을 세울 때", dimension: "JP", options: ["상세한 일정과 목표를 미리 정한다", "큰 틀만 정하고 상황에 따라 조정한다"], scores: [1, -1] },
            { text: "업무 마감일에 대해", dimension: "JP", options: ["미리 여유를 두고 완성한다", "마감 압박을 받을 때 더 집중한다"], scores: [1, -1] },
            { text: "예상치 못한 일이 생겼을 때", dimension: "JP", options: ["기존 계획을 수정해서 체계적으로 대응한다", "즉흥적으로 유연하게 상황에 맞춰 대응한다"], scores: [1, -1] },
            { text: "일상생활에서", dimension: "JP", options: ["규칙적인 루틴과 스케줄을 선호한다", "그때그때 기분에 따라 자유롭게 생활한다"], scores: [1, -1] },
            { text: "결정을 내려야 할 때", dimension: "JP", options: ["빨리 결정하고 추진하는 것을 선호한다", "여러 가능성을 두고 계속 고민하는 것을 선호한다"], scores: [1, -1] }
        ];
    }

    // MBTI 16가지 유형 상세 정보
    getTypeDetails() {
        return {
            "INTJ": {
                nickname: "전략가",
                description: "상상력이 풍부하고 전략적 사고를 하며, 모든 일에 계획을 세우는 사람입니다.",
                traits: [
                    { title: "독립적", desc: "혼자서도 잘 해나가며 자기 주도적" },
                    { title: "분석적", desc: "복잡한 문제를 논리적으로 분석" },
                    { title: "미래지향적", desc: "장기적 관점에서 계획을 수립" },
                    { title: "완벽주의", desc: "높은 기준을 설정하고 추구" }
                ],
                stories: [
                    { title: "직장에서", content: "회의에서 모든 사람이 감정적으로 논의할 때, 데이터와 논리로 최적의 해결책을 제시합니다." },
                    { title: "연애할 때", content: "진지하고 깊이 있는 관계를 추구하며, 상대방과의 미래를 구체적으로 계획합니다." },
                    { title: "취미생활", content: "전략 게임이나 복잡한 퍼즐을 좋아하며, 새로운 기술이나 지식 습득에 몰두합니다." }
                ],
                matches: ["ENFP", "ENTP", "INFJ", "INFP"]
            },
            "INTP": {
                nickname: "논리술사",
                description: "혁신적인 아이디어로 가득한 조용한 철학자입니다.",
                traits: [
                    { title: "논리적", desc: "모든 것을 논리적으로 분석하고 이해" },
                    { title: "창의적", desc: "독창적인 아이디어와 해결책 제시" },
                    { title: "유연한", desc: "새로운 정보에 따라 생각을 바꿀 수 있음" },
                    { title: "독립적", desc: "자유로운 사고와 행동을 중시" }
                ],
                stories: [
                    { title: "직장에서", content: "복잡한 시스템의 문제점을 찾아내어 혁신적인 해결방안을 제시합니다." },
                    { title: "연애할 때", content: "지적인 대화를 즐기며, 상대방의 생각과 아이디어에 진정한 관심을 보입니다." },
                    { title: "취미생활", content: "새로운 이론을 연구하거나 복잡한 개념을 탐구하는 것을 즐깁니다." }
                ],
                matches: ["ENTJ", "ESTJ", "INFJ", "INTJ"]
            },
            "ENTJ": {
                nickname: "통솔자",
                description: "대담하고 상상력이 풍부한 강력한 의지의 지도자입니다.",
                traits: [
                    { title: "리더십", desc: "타고난 리더로서 팀을 이끄는 능력" },
                    { title: "효율적", desc: "목표 달성을 위한 최적의 방법 추구" },
                    { title: "자신감", desc: "강한 자신감과 추진력 보유" },
                    { title: "전략적", desc: "장기적 비전과 전략 수립" }
                ],
                stories: [
                    { title: "직장에서", content: "프로젝트를 총괄하며 팀원들의 능력을 최대한 발휘시켜 목표를 달성합니다." },
                    { title: "연애할 때", content: "관계에서도 주도권을 잡으며, 두 사람의 미래를 적극적으로 계획합니다." },
                    { title: "취미생활", content: "경쟁적인 스포츠나 도전적인 활동을 즐기며 성취감을 추구합니다." }
                ],
                matches: ["INTP", "INFP", "ENFJ", "ENTP"]
            },
            "ENTP": {
                nickname: "변론가",
                description: "똑똑하고 호기심이 많은 사색가로, 어떤 도전도 마다하지 않습니다.",
                traits: [
                    { title: "창의적", desc: "무한한 아이디어와 가능성을 탐구" },
                    { title: "논쟁적", desc: "토론과 논쟁을 통해 진실 추구" },
                    { title: "적응적", desc: "변화하는 상황에 빠르게 적응" },
                    { title: "카리스마틱", desc: "사람들을 설득하고 영감을 주는 능력" }
                ],
                stories: [
                    { title: "직장에서", content: "브레인스토밍 회의에서 창의적인 아이디어를 쏟아내며 팀에 활력을 불어넣습니다." },
                    { title: "연애할 때", content: "상대방과의 지적인 대화를 즐기며, 예측할 수 없는 로맨틱한 이벤트를 기획합니다." },
                    { title: "취미생활", content: "새로운 분야에 끊임없이 도전하며, 다양한 사람들과의 네트워킹을 즐깁니다." }
                ],
                matches: ["INTJ", "INFJ", "ESTJ", "ESFJ"]
            },
            "INFJ": {
                nickname: "옹호자",
                description: "선의의 옹호자이며, 성실하고 양심이 바르며 이상주의적입니다.",
                traits: [
                    { title: "이상주의적", desc: "더 나은 세상을 만들고자 하는 신념" },
                    { title: "통찰력", desc: "사람과 상황을 깊이 이해하는 능력" },
                    { title: "공감능력", desc: "타인의 감정을 깊이 이해하고 공감" },
                    { title: "결단력", desc: "신념에 따라 행동하는 강한 의지" }
                ],
                stories: [
                    { title: "직장에서", content: "동료들의 고민을 들어주며, 팀의 화합과 발전을 위해 노력합니다." },
                    { title: "연애할 때", content: "상대방을 깊이 이해하려 하며, 진정한 소울메이트를 찾고자 합니다." },
                    { title: "취미생활", content: "봉사활동이나 사회적 의미가 있는 일에 참여하며 보람을 느낍니다." }
                ],
                matches: ["ENTP", "ENFP", "INTJ", "INTP"]
            },
            "INFP": {
                nickname: "중재자",
                description: "항상 선을 행할 준비가 되어 있는 부드럽고 친근한 사람입니다.",
                traits: [
                    { title: "이상주의적", desc: "가치와 신념에 따라 행동하는 성향" },
                    { title: "창의적", desc: "독창적인 표현과 아이디어 추구" },
                    { title: "공감적", desc: "타인의 감정을 깊이 이해하고 배려" },
                    { title: "개방적", desc: "다양성을 받아들이고 존중" }
                ],
                stories: [
                    { title: "직장에서", content: "팀원들의 개성을 존중하며, 창의적인 프로젝트에서 독특한 아이디어를 제공합니다." },
                    { title: "연애할 때", content: "상대방의 진정한 모습을 사랑하며, 깊고 의미 있는 관계를 추구합니다." },
                    { title: "취미생활", content: "예술 활동이나 글쓰기를 통해 내면의 세계를 표현합니다." }
                ],
                matches: ["ENFJ", "ENTJ", "INFJ", "ISFJ"]
            },
            "ENFJ": {
                nickname: "선도자",
                description: "카리스마 넘치고 영감을 불어넣는 지도자입니다.",
                traits: [
                    { title: "카리스마", desc: "사람들을 이끌고 영감을 주는 능력" },
                    { title: "이타적", desc: "다른 사람의 성장과 행복을 돕고자 함" },
                    { title: "소통능력", desc: "뛰어난 커뮤니케이션과 설득력" },
                    { title: "책임감", desc: "맡은 일에 대한 강한 책임감" }
                ],
                stories: [
                    { title: "직장에서", content: "팀원들의 잠재력을 발견하고 개발시키며, 모두가 함께 성장할 수 있도록 돕습니다." },
                    { title: "연애할 때", content: "상대방의 꿈을 응원하고 지지하며, 함께 성장하는 관계를 만들어갑니다." },
                    { title: "취미생활", content: "멘토링이나 코칭 활동을 통해 다른 사람들을 도우며 보람을 느낍니다." }
                ],
                matches: ["INFP", "ISFP", "ENTJ", "INTJ"]
            },
            "ENFP": {
                nickname: "활동가",
                description: "열정적이고 창의적인 사교적인 자유로운 정신의 소유자입니다.",
                traits: [
                    { title: "열정적", desc: "새로운 일에 대한 무한한 열정" },
                    { title: "창의적", desc: "독창적인 아이디어와 해결책 제시" },
                    { title: "사교적", desc: "사람들과의 관계를 중시하고 즐김" },
                    { title: "낙관적", desc: "긍정적이고 희망적인 시각 유지" }
                ],
                stories: [
                    { title: "직장에서", content: "새로운 프로젝트에 열정을 쏟으며, 팀 분위기를 밝게 만들고 창의적 아이디어를 제공합니다." },
                    { title: "연애할 때", content: "상대방에게 끊임없는 관심과 애정을 보이며, 함께하는 모든 순간을 특별하게 만듭니다." },
                    { title: "취미생활", content: "다양한 활동에 참여하며 새로운 사람들을 만나는 것을 즐깁니다." }
                ],
                matches: ["INTJ", "INFJ", "ESTJ", "ESFJ"]
            },
            "ISTJ": {
                nickname: "현실주의자", 
                description: "사실을 중시하고 신뢰할 수 있는 실무적이며 현실적인 사람입니다.",
                traits: [
                    { title: "체계적", desc: "질서와 체계를 중시하며 계획적" },
                    { title: "신뢰성", desc: "약속과 책임을 반드시 지키는 신뢰감" },
                    { title: "현실적", desc: "실용적이고 현실적인 접근 방식" },
                    { title: "성실함", desc: "맡은 일을 끝까지 해내는 성실성" }
                ],
                stories: [
                    { title: "직장에서", content: "정해진 절차와 규칙을 철저히 따르며, 동료들이 가장 믿고 의지하는 사람입니다." },
                    { title: "연애할 때", content: "진실하고 일관된 사랑을 보여주며, 안정적이고 든든한 관계를 만들어갑니다." },
                    { title: "취미생활", content: "수집이나 정리 활동을 즐기며, 전통적인 취미를 선호합니다." }
                ],
                matches: ["ESFP", "ESTP", "ISFJ", "ISFP"]
            },
            "ISFJ": {
                nickname: "수호자",
                description: "매우 헌신적이고 따뜻한 마음을 지닌 수호자입니다.",
                traits: [
                    { title: "배려심", desc: "타인의 필요와 감정을 세심하게 배려" },
                    { title: "헌신적", desc: "사랑하는 사람들을 위해 자신을 희생" },
                    { title: "협조적", desc: "갈등을 피하고 화합을 추구" },
                    { title: "책임감", desc: "맡은 역할에 대한 강한 책임감" }
                ],
                stories: [
                    { title: "직장에서", content: "동료들의 생일을 챙기고, 힘들어하는 팀원을 위해 조용히 도움의 손길을 내밉니다." },
                    { title: "연애할 때", content: "상대방의 작은 기호까지 기억하며, 세심한 배려와 관심으로 사랑을 표현합니다." },
                    { title: "취미생활", content: "요리나 공예 등 다른 사람을 위한 정성이 담긴 활동을 즐깁니다." }
                ],
                matches: ["ESFP", "ESTP", "INFP", "ISFP"]
            },
            "ESTJ": {
                nickname: "경영자",
                description: "훌륭한 관리자로서 사람과 일을 관리하는 데 타고난 재능이 있습니다.",
                traits: [
                    { title: "리더십", desc: "조직을 효율적으로 이끄는 리더십" },
                    { title: "조직력", desc: "체계적이고 질서 있는 조직 운영" },
                    { title: "현실적", desc: "실용적이고 결과 중심적 사고" },
                    { title: "결단력", desc: "빠른 의사결정과 추진력" }
                ],
                stories: [
                    { title: "직장에서", content: "프로젝트를 체계적으로 관리하며, 팀의 목표 달성을 위해 효율적인 시스템을 구축합니다." },
                    { title: "연애할 때", content: "관계에서도 계획적이고 안정적인 미래를 구상하며, 파트너를 든든하게 지지합니다." },
                    { title: "취미생활", content: "골프나 등산 등 목표가 있는 활동을 선호하며, 동호회 활동을 즐깁니다." }
                ],
                matches: ["ISFP", "ISTP", "ENFP", "ENTP"]
            },
            "ESFJ": {
                nickname: "집정관",
                description: "매우 사교적이고 친근하며 인기가 많은 사람들의 보살핌을 담당하는 사람입니다.",
                traits: [
                    { title: "사교적", desc: "사람들과 어울리는 것을 좋아함" },
                    { title: "협조적", desc: "팀워크와 화합을 중시" },
                    { title: "세심함", desc: "다른 사람의 필요를 잘 파악" },
                    { title: "책임감", desc: "사회적 의무와 전통을 중시" }
                ],
                stories: [
                    { title: "직장에서", content: "팀 분위기 메이커 역할을 하며, 모든 동료들이 편안하게 일할 수 있는 환경을 만듭니다." },
                    { title: "연애할 때", content: "상대방의 가족과 친구들과도 좋은 관계를 유지하며, 따뜻한 가정을 꿈꿉니다." },
                    { title: "취미생활", content: "친구들과의 모임을 기획하고, 봉사활동을 통해 사회에 기여하는 것을 좋아합니다." }
                ],
                matches: ["ISFP", "ISTP", "ENFP", "ENTP"]
            },
            "ISTP": {
                nickname: "만능재주꾼",
                description: "대담하면서도 현실적인 사색가로, 모든 종류의 도구 사용에 능합니다.",
                traits: [
                    { title: "실용적", desc: "실제적이고 유용한 것을 중시" },
                    { title: "독립적", desc: "자유로운 행동과 사고를 선호" },
                    { title: "분석적", desc: "문제의 원리와 구조를 파악" },
                    { title: "적응적", desc: "상황에 따라 유연하게 대처" }
                ],
                stories: [
                    { title: "직장에서", content: "복잡한 기계나 시스템의 문제를 진단하고 해결하는 데 탁월한 능력을 보입니다." },
                    { title: "연애할 때", content: "말보다는 행동으로 사랑을 표현하며, 상대방의 독립성을 존중합니다." },
                    { title: "취미생활", content: "자동차 정비나 목공예 등 손으로 만드는 활동을 즐깁니다." }
                ],
                matches: ["ESFJ", "ESTJ", "ISFJ", "INFJ"]
            },
            "ISFP": {
                nickname: "모험가",
                description: "유연하고 매력적인 예술가로, 언제나 새로운 가능성을 탐험할 준비가 되어 있습니다.",
                traits: [
                    { title: "예술적", desc: "아름다움과 예술을 사랑하는 감성" },
                    { title: "유연함", desc: "열린 마음으로 새로운 경험 수용" },
                    { title: "개성적", desc: "자신만의 독특한 개성과 가치관" },
                    { title: "온화함", desc: "부드럽고 친근한 성격" }
                ],
                stories: [
                    { title: "직장에서", content: "창의적인 프로젝트에서 독특한 관점과 아이디어를 제공하며, 동료들과 조화롭게 협력합니다." },
                    { title: "연애할 때", content: "상대방을 있는 그대로 받아들이며, 로맨틱하고 감성적인 순간들을 만들어갑니다." },
                    { title: "취미생활", content: "사진 촬영이나 그림 그리기 등 자신의 감성을 표현하는 활동을 즐깁니다." }
                ],
                matches: ["ESFJ", "ESTJ", "ENFJ", "INFJ"]
            },
            "ESTP": {
                nickname: "사업가",
                description: "똑똑하고 에너지 넘치며 매우 예리한 관찰력을 가진 사람입니다.",
                traits: [
                    { title: "활동적", desc: "에너지 넘치고 역동적인 활동 선호" },
                    { title: "현실적", desc: "지금 당장의 상황에 집중" },
                    { title: "사교적", desc: "사람들과 어울리는 것을 즐김" },
                    { title: "순발력", desc: "빠른 판단력과 대응 능력" }
                ],
                stories: [
                    { title: "직장에서", content: "위기 상황에서 빠른 판단력을 발휘하며, 팀의 분위기를 활기차게 만듭니다." },
                    { title: "연애할 때", content: "즉흥적이고 재미있는 데이트를 기획하며, 상대방과 함께하는 순간을 만끽합니다." },
                    { title: "취미생활", content: "익스트림 스포츠나 파티 등 스릴 넘치는 활동을 좋아합니다." }
                ],
                matches: ["ISFJ", "ISTJ", "INFJ", "INTJ"]
            },
            "ESFP": {
                nickname: "연예인",
                description: "자발적이고 열정적이며 사교적인 사람입니다.",
                traits: [
                    { title: "활기참", desc: "밝고 에너지 넘치는 성격" },
                    { title: "친근함", desc: "누구와도 쉽게 친해지는 능력" },
                    { title: "감정적", desc: "감정 표현이 풍부하고 솔직함" },
                    { title: "즉흥적", desc: "순간의 영감을 따르는 자유로운 정신" }
                ],
                stories: [
                    { title: "직장에서", content: "팀의 무드메이커 역할을 하며, 어려운 상황에서도 긍정적인 에너지로 분위기를 바꿉니다." },
                    { title: "연애할 때", content: "상대방에게 아낌없는 애정을 표현하며, 매일매일을 축제처럼 즐겁게 만듭니다." },
                    { title: "취미생활", content: "춤이나 노래 등 자신을 표현하는 활동을 좋아하며, 사람들과 함께하는 행사를 즐깁니다." }
                ],
                matches: ["ISFJ", "ISTJ", "INFJ", "INTJ"]
            }
        };
    }

    // 이벤트 리스너 초기화
    initializeEventListeners() {
        // 홈 버튼
        document.querySelector('[data-type="home"]').addEventListener('click', () => {
            this.showSection('home');
            this.setActiveButton(document.querySelector('[data-type="home"]'));
        });

        // 유형 버튼들
        document.querySelectorAll('.type-btn[data-type]:not([data-type="home"])').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.showTypeDetail(type);
                this.setActiveButton(btn);
            });
        });

        // 카드 클릭
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                this.showTypeDetail(type);
                this.setActiveButton(document.querySelector(`[data-type="${type}"]`));
            });
        });

        // 테스트 시작 버튼들
        document.querySelectorAll('.test-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showInfoModal();
            });
        });

        // 헤더 테스트 버튼
        document.querySelector('.header-test-btn').addEventListener('click', () => {
            this.showInfoModal();
        });

        // 상세페이지 테스트 버튼 (이벤트 위임)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('detail-test-btn')) {
                this.showInfoModal();
            }
            
            // 궁합 유형 버튼 클릭
            if (e.target.classList.contains('match-type-btn')) {
                const currentType = e.target.dataset.type;
                const matchType = e.target.dataset.match;
                this.showCompatibilityModal(currentType, matchType);
            }
            
            // 더보기 버튼 클릭
            if (e.target.classList.contains('more-compatibility-btn')) {
                const currentType = e.target.dataset.currentType;
                this.showTypeSelectorModal(currentType);
            }
            
            // 유형 선택 버튼 클릭
            if (e.target.classList.contains('type-selector-btn') || e.target.closest('.type-selector-btn')) {
                const btn = e.target.classList.contains('type-selector-btn') ? e.target : e.target.closest('.type-selector-btn');
                const selectedType = btn.dataset.type;
                const currentType = this.currentTypeForComparison;
                this.closeTypeSelectorModal();
                this.showCompatibilityModal(currentType, selectedType);
            }
        });

        // 개인정보 입력 관련
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            radio.addEventListener('change', this.validateInfoForm.bind(this));
        });
        
        document.querySelectorAll('input[name="age"]').forEach(radio => {
            radio.addEventListener('change', this.validateInfoForm.bind(this));
        });
        
        document.querySelector('.next-step-btn').addEventListener('click', () => {
            this.showTestTypeModal();
        });

        // 테스트 유형 선택
        document.querySelectorAll('.select-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectTestType(btn.dataset.type);
            });
        });

        // 테스트 네비게이션
        document.querySelector('.prev-btn').addEventListener('click', () => {
            this.previousQuestion();
        });

        // 사이드바 토글 (모바일)
        document.querySelector('.sidebar-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // 오버레이 클릭
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeModals();
        });

        // 뒤로가기 버튼
        document.querySelector('.back-btn').addEventListener('click', () => {
            this.goToHome();
        });

        // 상세 페이지 테스트 버튼
        document.querySelector('.detail-test-btn').addEventListener('click', () => {
            this.showInfoModal();
        });

        // Top 버튼
        document.querySelector('.top-btn').addEventListener('click', () => {
            this.scrollToTop();
        });

        // 브라우저 뒤로가기 이벤트
        window.addEventListener('popstate', (event) => {
            this.handleBrowserBack(event);
        });

        // 페이지 로드 시 초기 히스토리 설정
        this.pushHistoryState('home');
    }

    // 히스토리 상태 추가
    pushHistoryState(state, data = {}) {
        const stateData = { page: state, ...data };
        history.pushState(stateData, '', '');
    }

    // 홈으로 이동
    goToHome() {
        this.showSection('home');
        this.setActiveButton(document.querySelector('[data-type="home"]'));
        this.pushHistoryState('home');
    }

    // 브라우저 뒤로가기 처리
    handleBrowserBack(event) {
        if (event.state) {
            const { page } = event.state;
            
            switch (page) {
                case 'home':
                    this.showSection('home');
                    this.setActiveButton(document.querySelector('[data-type="home"]'));
                    break;
                case 'type-detail':
                    this.showSection('type-detail');
                    break;
                default:
                    this.showSection('home');
                    this.setActiveButton(document.querySelector('[data-type="home"]'));
            }
        } else {
            this.showSection('home');
            this.setActiveButton(document.querySelector('[data-type="home"]'));
        }
    }

    // 맨 위로 스크롤
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 섹션 표시
    showSection(sectionName) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = sectionName === 'home' ? 'home-screen' : sectionName;
        document.getElementById(targetSection).classList.add('active');
    }

    // 활성 버튼 설정
    setActiveButton(activeBtn) {
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // 유형 상세 페이지 표시
    showTypeDetail(type) {
        const detail = this.typeDetails[type];
        if (!detail) return;

        // 히스토리에 추가
        this.pushHistoryState('type-detail', { type });

        const content = `
            <div class="detail-left">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${type}&backgroundColor=${this.getTypeColor(type)}" alt="${type}" class="detail-avatar">
                <div class="detail-type-row">
                    <div class="detail-type">${type}</div>
                    <button class="test-start-btn detail-test-btn" title="테스트 시작">Test</button>
                </div>
                <div class="detail-nickname">${detail.nickname}</div>
                <div class="detail-description">${detail.description}</div>
                <div class="detail-match">
                    <h4>잘 맞는 유형</h4>
                    <div class="match-types">
                        ${detail.matches.map(match => `<button class="match-type-btn" data-type="${type}" data-match="${match}">${match}</button>`).join('')}
                    </div>
                    <button class="more-compatibility-btn" data-current-type="${type}">더보기...</button>
                </div>
            </div>
            <div class="detail-right">
                <div class="detail-section">
                    <h3>주요 특성</h3>
                    <div class="traits-grid">
                        ${detail.traits.map(trait => `
                            <div class="trait-item">
                                <strong>${trait.title}</strong>
                                <p>${trait.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="detail-section">
                    <h3>이런 모습이에요</h3>
                    <div class="stories-list">
                        ${detail.stories.map(story => `
                            <div class="story-item">
                                <h4>${story.title}</h4>
                                <p>${story.content}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.querySelector('.type-detail-content').innerHTML = content;
        this.showSection('type-detail');
    }

    // 유형별 색상 반환
    getTypeColor(type) {
        if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(type)) return 'c8b5d1';
        if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(type)) return 'b8d4b8';
        if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(type)) return 'd4a574';
        if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(type)) return '86c5da';
        return 'ffffff';
    }

    // 개인정보 입력 모달 표시
    showInfoModal() {
        document.getElementById('info-modal').classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }

    // 개인정보 입력 폼 유효성 검사
    validateInfoForm() {
        const gender = document.querySelector('input[name="gender"]:checked');
        const age = document.querySelector('input[name="age"]:checked');
        const nextBtn = document.querySelector('.next-step-btn');
        
        if (gender && age) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
    }

    // 테스트 유형 선택 모달 표시
    showTestTypeModal() {
        // 사용자 정보 저장
        this.userInfo.gender = document.querySelector('input[name="gender"]:checked').value;
        this.userInfo.age = document.querySelector('input[name="age"]:checked').value;
        
        // 모달 전환
        this.closeModals();
        setTimeout(() => {
            document.getElementById('test-type-modal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }, 300);
    }

    // 테스트 유형 선택
    selectTestType(type) {
        this.testType = type;
        this.currentQuestion = 0;
        this.answers = [];
        
        this.closeModals();
        setTimeout(() => {
            this.showTestModal();
            this.displayQuestion();
        }, 300);
    }

    // 테스트 시작 (기존 함수는 제거하고 selectTestType으로 대체됨)

    // 테스트 모달 표시
    showTestModal() {
        document.getElementById('test-modal').classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }

    // 질문 표시
    displayQuestion() {
        const currentQuestions = this.testType === 'quick' ? this.quickQuestions : this.questions;
        const question = currentQuestions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / currentQuestions.length) * 100;
        
        // 진행률 업데이트
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = `${this.currentQuestion + 1}/${currentQuestions.length}`;
        
        // 질문 텍스트
        document.querySelector('.question-text').textContent = question.text;
        
        // 답변 버튼들
        const answerButtons = document.querySelector('.answer-buttons');
        answerButtons.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            answerButtons.appendChild(button);
        });
        
        // 네비게이션 버튼 상태
        document.querySelector('.prev-btn').disabled = this.currentQuestion === 0;
    }

    // 답변 선택
    selectAnswer(answerIndex) {
        // 기존 선택 제거
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 새로운 선택 적용
        const selectedBtn = document.querySelectorAll('.answer-btn')[answerIndex];
        selectedBtn.classList.add('selected');
        
        // 답변 저장
        this.answers[this.currentQuestion] = answerIndex;
        
        // 0.5초 후 자동으로 다음 질문으로 이동
        setTimeout(() => {
            this.nextQuestion();
        }, 500);
    }

    // 이전 질문
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
            
            // 이전 답변이 있다면 선택 상태 복원
            if (this.answers[this.currentQuestion] !== undefined) {
                const prevAnswer = this.answers[this.currentQuestion];
                document.querySelectorAll('.answer-btn')[prevAnswer].classList.add('selected');
            }
        }
    }

    // 다음 질문
    nextQuestion() {
        const currentQuestions = this.testType === 'quick' ? this.quickQuestions : this.questions;
        
        if (this.currentQuestion < currentQuestions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
            
            // 이전 답변이 있다면 선택 상태 복원
            if (this.answers[this.currentQuestion] !== undefined) {
                const prevAnswer = this.answers[this.currentQuestion];
                document.querySelectorAll('.answer-btn')[prevAnswer].classList.add('selected');
            }
        } else {
            // 테스트 완료
            this.calculateResult();
        }
    }

    // 결과 계산
    calculateResult() {
        let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        const currentQuestions = this.testType === 'quick' ? this.quickQuestions : this.questions;
        
        currentQuestions.forEach((question, index) => {
            const answerIndex = this.answers[index];
            const score = question.scores[answerIndex];
            
            switch (question.dimension) {
                case 'EI':
                    if (score > 0) scores.E += score;
                    else scores.I += Math.abs(score);
                    break;
                case 'SN':
                    if (score > 0) scores.N += score;
                    else scores.S += Math.abs(score);
                    break;
                case 'TF':
                    if (score > 0) scores.T += score;
                    else scores.F += Math.abs(score);
                    break;
                case 'JP':
                    if (score > 0) scores.J += score;
                    else scores.P += Math.abs(score);
                    break;
            }
        });

        // 성별/나이 보정 적용
        this.applyDemographicCorrection(scores);
        
        // MBTI 유형 결정
        const type = (scores.E > scores.I ? 'E' : 'I') +
                    (scores.S > scores.N ? 'S' : 'N') +
                    (scores.T > scores.F ? 'T' : 'F') +
                    (scores.J > scores.P ? 'J' : 'P');
        
        this.showResult(type, scores);
    }

    // 인구통계학적 보정 적용
    applyDemographicCorrection(scores) {
        // 모든 점수를 0 이상으로 보장
        const ensurePositive = (score) => Math.max(0, score || 0);
        
        // 성별 보정
        if (this.userInfo.gender === 'male') {
            scores.T = ensurePositive(scores.T + 3);
            scores.F = ensurePositive(scores.F - 3);
        } else if (this.userInfo.gender === 'female') {
            scores.F = ensurePositive(scores.F + 2);
            scores.T = ensurePositive(scores.T - 2);
        }
        
        // 나이 보정
        if (this.userInfo.age === '20s') {
            scores.N = ensurePositive(scores.N + 1);
            scores.P = ensurePositive(scores.P + 1);
        } else if (this.userInfo.age === '50s') {
            scores.S = ensurePositive(scores.S + 2);
            scores.J = ensurePositive(scores.J + 2);
        }
        
        // 모든 점수 최종 확인
        Object.keys(scores).forEach(key => {
            scores[key] = ensurePositive(scores[key]);
        });
        
        console.log('After demographic correction:', scores);
    }

    // 결과 표시
    showResult(type, scores) {
        const detail = this.typeDetails[type];
        
        // 디버깅: 점수 확인
        console.log('Final scores:', scores);
        
        // 0으로 나누기 방지 및 NaN 체크
        const safeCalculate = (a, b) => {
            const sum = a + b;
            if (sum === 0 || isNaN(a) || isNaN(b)) return 50; // 중간값으로 설정
            return Math.round((a / sum) * 100);
        };
        
        // 차원별 선호도 계산
        const preferences = {
            EI: safeCalculate(scores.E, scores.I),
            SN: safeCalculate(scores.S, scores.N), 
            TF: safeCalculate(scores.T, scores.F),
            JP: safeCalculate(scores.J, scores.P)
        };
        
        console.log('Calculated preferences:', preferences);
        
        const resultContent = `
            <div class="result-header">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${type}&backgroundColor=${this.getTypeColor(type)}" alt="${type}" class="result-avatar">
                <h2>당신의 MBTI는</h2>
                <div class="result-type">${type}</div>
                <div class="result-nickname">${detail.nickname}</div>
                <div class="result-description">${detail.description}</div>
            </div>
            
            <div class="result-details">
                <div class="result-section">
                    <h3>선호도 분석</h3>
                    <div class="preferences">
                        <div class="pref-item">
                            <span class="pref-label">외향(E) vs 내향(I)</span>
                            <div class="pref-bar">
                                <div class="pref-fill" style="width: ${preferences.EI}%; background: ${preferences.EI > 50 ? '#e74c3c' : '#3498db'}"></div>
                                <span class="pref-percent">${preferences.EI > 50 ? 'E' : 'I'} ${Math.max(preferences.EI, 100-preferences.EI)}%</span>
                            </div>
                        </div>
                        <div class="pref-item">
                            <span class="pref-label">감각(S) vs 직관(N)</span>
                            <div class="pref-bar">
                                <div class="pref-fill" style="width: ${preferences.SN}%; background: ${preferences.SN > 50 ? '#f39c12' : '#9b59b6'}"></div>
                                <span class="pref-percent">${preferences.SN > 50 ? 'S' : 'N'} ${Math.max(preferences.SN, 100-preferences.SN)}%</span>
                            </div>
                        </div>
                        <div class="pref-item">
                            <span class="pref-label">사고(T) vs 감정(F)</span>
                            <div class="pref-bar">
                                <div class="pref-fill" style="width: ${preferences.TF}%; background: ${preferences.TF > 50 ? '#2c3e50' : '#e91e63'}"></div>
                                <span class="pref-percent">${preferences.TF > 50 ? 'T' : 'F'} ${Math.max(preferences.TF, 100-preferences.TF)}%</span>
                            </div>
                        </div>
                        <div class="pref-item">
                            <span class="pref-label">판단(J) vs 인식(P)</span>
                            <div class="pref-bar">
                                <div class="pref-fill" style="width: ${preferences.JP}%; background: ${preferences.JP > 50 ? '#27ae60' : '#ff9800'}"></div>
                                <span class="pref-percent">${preferences.JP > 50 ? 'J' : 'P'} ${Math.max(preferences.JP, 100-preferences.JP)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="result-section">
                    <h3>주요 특성</h3>
                    <div class="traits-grid">
                        ${detail.traits.map(trait => `
                            <div class="trait-item">
                                <strong>${trait.title}</strong>
                                ${trait.desc}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="result-section">
                    <h3>잘 맞는 유형</h3>
                    <div class="match-types">
                        ${detail.matches.map(match => `<span class="match-type" data-type="${match}">${match}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="result-actions">
                <button class="action-btn primary" onclick="location.reload()">다시 테스트하기</button>
                <button class="action-btn secondary" onclick="mbtiTest.shareResult('${type}')">결과 공유하기</button>
            </div>
        `;
        
        // 결과 표시 스타일 추가 (CSS에 추가해야 함)
        document.querySelector('.result-content').innerHTML = resultContent;
        
        // 궁합 유형 클릭 이벤트 추가
        document.querySelectorAll('.match-type').forEach(matchEl => {
            matchEl.addEventListener('click', () => {
                const matchType = matchEl.getAttribute('data-type');
                this.showCompatibilityModal(type, matchType);
            });
        });
        
        this.closeModals();
        this.showSection('result-screen');
    }

    // 결과 공유
    shareResult(type) {
        const detail = this.typeDetails[type];
        const shareText = `나의 MBTI 결과는 ${type} (${detail.nickname})! 바알에서 정식 MBTI 테스트를 받아보세요!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'MBTI 테스트 결과',
                text: shareText,
                url: window.location.href
            });
        } else {
            // 클립보드에 복사
            navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
                alert('결과가 클립보드에 복사되었습니다!');
            });
        }
    }

    // 궁합 데이터 가져오기
    getCompatibilityData() {
        // 궁합 키 생성 함수 (알파벳 순으로 정렬하여 중복 방지)
        const getKey = (type1, type2) => [type1, type2].sort().join('-');
        
        return {
            // 최고 궁합 (9-10점)
            [getKey('INTJ', 'ENFP')]: {
                score: 9.2,
                title: '이상적인 파트너십',
                strengths: [
                    '서로 다른 강점으로 완벽한 균형',
                    'ENFP의 창의성과 INTJ의 계획성 조화',
                    '깊이 있는 대화와 지적 자극'
                ],
                challenges: [
                    '표현 방식의 차이',
                    '사회적 에너지 소모 패턴 차이'
                ],
                advice: 'ENFP는 INTJ의 독립성을 존중하고, INTJ는 ENFP의 열정을 지지해주세요.'
            },
            
            [getKey('ENTP', 'INFJ')]: {
                score: 8.5,
                title: '황금 궁합',
                strengths: [
                    '지적 연결성과 높은 지능',
                    '직관적 이해와 깊은 소통',
                    '창의적 시너지와 통찰력'
                ],
                challenges: [
                    '에너지 충전 방식의 차이',
                    '갈등 해결 방식의 차이'
                ],
                advice: '서로의 에너지 충전 방식을 인정하고, 건설적 토론의 가치를 받아들이세요.'
            },
            
            [getKey('ENFJ', 'ENFP')]: {
                score: 9.0,
                title: '완벽한 에너지 매칭',
                strengths: [
                    '외향적이고 직관적인 성향의 조화',
                    '서로의 잠재력 발견과 격려',
                    '사회적 영향력과 긍정적 변화 추구'
                ],
                challenges: [
                    '과도한 이상주의 성향',
                    '감정적 과부하 위험'
                ],
                advice: '현실적 판단을 우선시하고 개인의 경계를 설정하세요.'
            },
            
            [getKey('ISFP', 'INFP')]: {
                score: 9.0,
                title: '깊은 가치관 공유',
                strengths: [
                    '진정성과 도덕성을 중시하는 깊은 유대감',
                    'INFP의 아이디어와 ISFP의 실행력',
                    '서로의 복잡한 감정 이해와 지지'
                ],
                challenges: [
                    '갈등 회피로 인한 문제 축적',
                    '가치관 충돌 시 완고함'
                ],
                advice: '갈등을 건설적으로 다루는 방법을 배우고 직접적인 의사소통을 연습하세요.'
            },
            
            // 좋은 궁합 (7-8점)
            [getKey('ISTJ', 'ISFJ')]: {
                score: 8.0,
                title: '안정적인 파트너십',
                strengths: [
                    '가족 전통과 안정된 관계 추구',
                    '체계적인 생활 방식의 일치',
                    '상호 신뢰와 일관된 행동'
                ],
                challenges: [
                    '감정 표현 방식의 차이',
                    '성장 자극 부족'
                ],
                advice: '서로의 의사결정 방식을 이해하고 새로운 경험을 함께 탐구하세요.'
            },
            
            [getKey('ESTP', 'ESFP')]: {
                score: 9.0,
                title: '역동적이고 재미있는 관계',
                strengths: [
                    '모험과 자발성을 통한 활기찬 파트너십',
                    '현재 중심적 삶과 감각적 경험 공유',
                    '열린 소통과 빠른 갈등 해결'
                ],
                challenges: [
                    '감정 vs 논리의 의사결정 차이',
                    '관계 깊이 발전의 한계'
                ],
                advice: '서로의 의사결정 방식을 존중하고 관계 깊이 발전을 위한 의식적 노력이 필요하세요.'
            },
            
            [getKey('ENTJ', 'ENTP')]: {
                score: 8.0,
                title: '지적 역동성',
                strengths: [
                    '혁신적 아이디어와 전략적 사고의 결합',
                    'ENTJ의 실행력과 ENTP의 창의성',
                    '카리스마와 사회적 영향력'
                ],
                challenges: [
                    '권력 투쟁 가능성',
                    '감정적 측면 소홀'
                ],
                advice: 'work-life balance를 중시하고 가족 시간을 의식적으로 확보하세요.'
            },
            
            // 보통 궁합 (5-6점) - 일부 대표적인 것들만 포함
            [getKey('INTJ', 'ISTJ')]: {
                score: 6.0,
                title: '체계적 협력',
                strengths: [
                    '공유된 체계성과 Te 기능',
                    '상호 보완적 시각',
                    '전문적 파트너십'
                ],
                challenges: [
                    '정보 처리 방식의 차이',
                    '변화에 대한 태도 차이'
                ],
                advice: 'INTJ는 세부사항에 주의하고, ISTJ는 새로운 아이디어에 개방적 자세를 가지세요.'
            },
            
            // 도전적 궁합 (1-4점) - 주요 대립 관계들
            [getKey('INTJ', 'ESFP')]: {
                score: 3.0,
                title: '극단적 대립',
                strengths: [
                    '상호보완적 성장 기회',
                    '새로운 관점 확장',
                    '도전을 통한 개인 성장'
                ],
                challenges: [
                    '의사소통 격차',
                    '생활 방식의 근본적 충돌'
                ],
                advice: 'INTJ는 감정적 소통을, ESFP는 독립적인 사회활동을 개발하며 상당한 노력과 이해가 필요합니다.'
            },
            
            [getKey('ESTP', 'INFJ')]: {
                score: 1.0,
                title: '화재와 물의 관계',
                strengths: [
                    '업무적 시너지 가능성',
                    '상호 학습 기회',
                    '예외적 매력'
                ],
                challenges: [
                    '인지 기능의 완전 대립',
                    '의사소통 스타일 충돌'
                ],
                advice: '전문가들이 "절대적으로 최악의 매치"로 평가하는 만큼 극도로 신중한 접근이 필요합니다.'
            },

            // === INTP 궁합 시리즈 (15개) ===
            [getKey('INTP', 'ENTJ')]: {
                score: 7.5,
                title: '전략가와 논리술사',
                strengths: [
                    'NT 기질로 인한 지적 연결감',
                    'INTP의 혁신성과 ENTJ의 실행력',
                    '목표 지향적 파트너십 가능'
                ],
                challenges: [
                    'J vs P 생활방식 차이',
                    '감정 표현 방식의 격차'
                ],
                advice: 'ENTJ는 INTP의 속도를 존중하고, INTP는 실행력 강화에 노력하세요.'
            },
            
            [getKey('INTP', 'ESTJ')]: {
                score: 4.5,
                title: '도전적 조화',
                strengths: [
                    'T 성향으로 논리적 소통 가능',
                    '상호 보완적 관점',
                    '체계성과 창의성의 결합'
                ],
                challenges: [
                    '모든 다른 차원으로 인한 갈등',
                    '의사결정 속도의 차이'
                ],
                advice: '서로의 강점을 인정하며 천천히 이해해 나가는 것이 중요합니다.'
            },
            
            [getKey('INTP', 'INFJ')]: {
                score: 8.0,
                title: '깊이 있는 지적 동반자',
                strengths: [
                    '직관적 사고의 깊은 공유',
                    '철학적 대화와 통찰력',
                    '서로의 독립성 존중'
                ],
                challenges: [
                    'T vs F 의사결정 방식 차이',
                    '사회적 활동 선호도 차이'
                ],
                advice: 'INTP는 감정적 지원을, INFJ는 논리적 분석을 배우며 성장하세요.'
            },
            
            [getKey('INTP', 'INTJ')]: {
                score: 7.8,
                title: '동류 의식의 파트너',
                strengths: [
                    'INT 조합의 강력한 지적 연결',
                    '독립적 성향과 깊이 있는 대화',
                    '미래 지향적 사고 공유'
                ],
                challenges: [
                    'J vs P 계획성 차이',
                    '감정 표현 부족'
                ],
                advice: '계획과 자유로움의 균형을 찾고, 감정적 소통을 의식적으로 늘리세요.'
            },
            
            [getKey('INTP', 'ENFJ')]: {
                score: 6.5,
                title: '성장 촉진 관계',
                strengths: [
                    'N 직관 공유로 창의적 시너지',
                    'ENFJ의 사회성이 INTP의 성장 도움',
                    '상호 보완적 강점'
                ],
                challenges: [
                    'E vs I 에너지 방향 차이',
                    'T vs F 가치관 충돌'
                ],
                advice: 'ENFJ는 INTP의 혼자 시간을 존중하고, INTP는 사회적 참여에 노력하세요.'
            },
            
            [getKey('INTP', 'ENTP')]: {
                score: 8.5,
                title: 'NT 파워 커플',
                strengths: [
                    '동일한 NTP 조합의 완벽한 이해',
                    '끝없는 아이디어 교환과 토론',
                    '지적 자극과 창의적 시너지'
                ],
                challenges: [
                    '실행력 부족의 공통점',
                    'E vs I 사회적 에너지 차이'
                ],
                advice: '아이디어를 현실로 만드는 실행 시스템을 함께 구축하세요.'
            },
            
            [getKey('INTP', 'ENFP')]: {
                score: 7.2,
                title: '활기찬 지적 동반자',
                strengths: [
                    'NP 조합의 창의성과 유연함',
                    'ENFP의 열정이 INTP에게 동기 부여',
                    '새로운 아이디어에 대한 개방성'
                ],
                challenges: [
                    'T vs F 의사결정 차이',
                    '감정적 필요도의 격차'
                ],
                advice: 'INTP는 감정 표현을, ENFP는 논리적 접근을 배워 균형을 맞추세요.'
            },
            
            [getKey('INTP', 'INFP')]: {
                score: 7.0,
                title: '조용한 이해자들',
                strengths: [
                    'INP 조합의 깊은 내적 연결',
                    '창의성과 독립성 공유',
                    '서로의 개성을 존중하는 관계'
                ],
                challenges: [
                    'T vs F 갈등 해결 방식 차이',
                    '둘 다 내향적이라 소통 부족 위험'
                ],
                advice: '의식적인 감정 소통과 외부 활동을 함께 늘려나가세요.'
            },
            
            [getKey('INTP', 'ISTJ')]: {
                score: 5.0,
                title: '체계 vs 자유의 만남',
                strengths: [
                    'IT 조합의 조용하고 신중한 접근',
                    '서로 다른 관점으로 균형 제공',
                    '깊이 있는 전문 분야 공유 가능'
                ],
                challenges: [
                    'S vs N 정보 처리 방식 차이',
                    'J vs P 생활 패턴 충돌'
                ],
                advice: 'ISTJ는 새로운 아이디어에 열린 마음을, INTP는 일상의 체계성을 배우세요.'
            },
            
            [getKey('INTP', 'ISFJ')]: {
                score: 4.8,
                title: '배려와 분석의 조합',
                strengths: [
                    '서로 다른 강점으로 성장 기회',
                    'ISFJ의 배려가 INTP의 실생활 도움',
                    '조용하고 평화로운 관계'
                ],
                challenges: [
                    'S vs N, T vs F, J vs P 모든 차이점',
                    '의사소통과 관심사의 격차'
                ],
                advice: '인내심을 갖고 서로의 세계를 천천히 이해해 나가는 것이 중요합니다.'
            },
            
            [getKey('INTP', 'ISTP')]: {
                score: 6.8,
                title: '조용한 사색가들',
                strengths: [
                    'ITP 조합의 독립성과 유연함',
                    '논리적 사고와 실용적 해결책',
                    '서로의 개인 공간 존중'
                ],
                challenges: [
                    'S vs N 관심사 차이',
                    '감정 표현의 어려움'
                ],
                advice: '공통 관심사를 찾고, 감정적 소통을 늘려 관계를 깊게 발전시키세요.'
            },
            
            [getKey('INTP', 'ISFP')]: {
                score: 5.5,
                title: '조용한 창의성',
                strengths: [
                    'IP 조합의 유연성과 개방성',
                    '창의적 영역에서의 시너지',
                    '서로의 독특함을 인정하는 관계'
                ],
                challenges: [
                    'S vs N, T vs F 인식과 판단 차이',
                    '깊은 소통의 어려움'
                ],
                advice: '예술이나 창작 활동을 통해 교감하며 서로를 이해해 나가세요.'
            },
            
            [getKey('INTP', 'ESTP')]: {
                score: 4.2,
                title: '사색과 행동의 대비',
                strengths: [
                    'TP 조합의 논리적 유연성',
                    '상호 보완적 에너지',
                    '새로운 관점 제공'
                ],
                challenges: [
                    'E vs I, S vs N 근본적 차이',
                    '생활 패턴과 관심사 충돌'
                ],
                advice: 'ESTP는 INTP의 사색 시간을, INTP는 활동적 경험을 받아들여보세요.'
            },
            
            [getKey('INTP', 'ESFP')]: {
                score: 3.8,
                title: '분석과 감성의 만남',
                strengths: [
                    'P 성향의 자유로움 공유',
                    '서로의 부족한 면을 채워줄 가능성',
                    '새로운 세계 경험 기회'
                ],
                challenges: [
                    'E vs I, S vs N, T vs F 모든 차이',
                    '의사소통 방식의 근본적 차이'
                ],
                advice: '많은 이해와 노력이 필요하지만, 성장 잠재력이 큰 관계입니다.'
            },
            
            [getKey('INTP', 'ESFJ')]: {
                score: 3.5,
                title: '논리와 조화의 충돌',
                strengths: [
                    '극단적으로 다른 관점으로 성장 자극',
                    '사회적 기술과 분석력 교환',
                    '도전을 통한 개인 발전'
                ],
                challenges: [
                    '모든 MBTI 차원에서 반대',
                    '가치관과 생활방식의 근본적 차이'
                ],
                advice: '상당한 노력과 상호 존중이 필요한 극도로 도전적인 관계입니다.'
            },

            // === 나머지 주요 궁합들 추가 (선별적으로 중요한 것들) ===
            [getKey('ENFJ', 'ISTJ')]: {
                score: 5.2,
                title: '이상과 현실의 만남',
                strengths: [
                    '서로 다른 강점으로 균형 제공',
                    'ENFJ의 비전과 ISTJ의 실행력',
                    '상호 성장 기회'
                ],
                challenges: [
                    'E vs I, N vs S, F vs T 차이점',
                    '의사결정과 소통 방식 차이'
                ],
                advice: 'ENFJ는 현실적 접근을, ISTJ는 새로운 관점을 배우며 성장하세요.'
            },
            
            [getKey('ISFP', 'ESTJ')]: {
                score: 4.0,
                title: '자유와 질서의 대립',
                strengths: [
                    '상호 보완적 성장 가능성',
                    '균형잡힌 관점 개발',
                    '도전을 통한 개인 성장'
                ],
                challenges: [
                    'I vs E, S vs S, F vs T, P vs J 대부분 차이',
                    '생활 방식과 가치관 충돌'
                ],
                advice: '서로의 장점을 인정하고 점진적 이해를 통해 관계를 발전시키세요.'
            },
            
            [getKey('ENFP', 'ISTJ')]: {
                score: 4.3,
                title: '열정과 안정의 조합',
                strengths: [
                    '극단적 차이로 인한 성장 기회',
                    'ENFP의 창의성과 ISTJ의 체계성',
                    '새로운 관점 학습'
                ],
                challenges: [
                    '모든 MBTI 차원에서 정반대',
                    '의사소통과 생활패턴 충돌'
                ],
                advice: '많은 인내와 이해가 필요하지만, 성공시 매우 균형잡힌 관계가 됩니다.'
            },
            
            [getKey('ISFJ', 'ENTP')]: {
                score: 4.1,
                title: '안정과 변화의 만남',
                strengths: [
                    '상호 보완적 성장 자극',
                    'ISFJ의 배려와 ENTP의 창의성',
                    '균형잡힌 관점 개발'
                ],
                challenges: [
                    'I vs E, S vs N, F vs T 주요 차이점',
                    '변화에 대한 태도 차이'
                ],
                advice: 'ISFJ는 새로운 경험에, ENTP는 안정성에 대해 열린 마음을 가지세요.'
            }
        };
    }

    // 궁합 정보 가져오기
    getCompatibility(type1, type2) {
        const key = [type1, type2].sort().join('-');
        if (this.compatibilityData[key]) {
            return this.compatibilityData[key];
        }
        
        // 정의되지 않은 궁합은 동적으로 계산
        return this.calculateCompatibility(type1, type2);
    }

    // 동적 궁합 계산 시스템
    calculateCompatibility(type1, type2) {
        // 같은 유형인 경우
        if (type1 === type2) {
            return {
                score: 8.5,
                title: '완벽한 동질감',
                strengths: [
                    '완전한 상호 이해와 공감',
                    '같은 관심사와 가치관 공유',
                    '편안하고 자연스러운 소통'
                ],
                challenges: [
                    '성장 자극 부족으로 정체 위험',
                    '같은 약점을 공유하여 상호 보완 어려움'
                ],
                advice: '편안함에 안주하지 말고 새로운 도전과 경험을 함께 추구하세요.'
            };
        }

        // MBTI 차원별 점수 계산
        const dimensions1 = [type1[0], type1[1], type1[2], type1[3]];
        const dimensions2 = [type2[0], type2[1], type2[2], type2[3]];
        
        let score = 5.0;
        let sameCount = 0;
        let oppositeCount = 0;
        
        // 각 차원 비교
        for (let i = 0; i < 4; i++) {
            if (dimensions1[i] === dimensions2[i]) {
                score += 1.0;
                sameCount++;
            } else {
                // 보완 관계인지 대립 관계인지 판단
                if ((i === 0 && 'EI'.includes(dimensions1[i]) && 'EI'.includes(dimensions2[i])) ||
                    (i === 3 && 'JP'.includes(dimensions1[i]) && 'JP'.includes(dimensions2[i]))) {
                    score += 0.3; // E-I, J-P는 보완 관계로 약간 플러스
                } else {
                    score -= 0.2; // S-N, T-F 차이는 약간 마이너스
                }
                oppositeCount++;
            }
        }

        // 점수에 따른 궁합 레벨 결정
        let title, strengths, challenges, advice;
        
        if (score >= 7.5) {
            title = '훌륭한 궁합';
            strengths = [
                `${sameCount}개 공통점으로 깊은 이해`,
                '자연스러운 소통과 공감대',
                '서로의 강점을 잘 살려주는 관계'
            ];
            challenges = [
                '너무 비슷해서 성장 자극 부족 가능',
                '갈등 해결 경험 부족'
            ];
            advice = '공통점을 바탕으로 서로 다른 영역에서 도전해보세요.';
        } else if (score >= 6.0) {
            title = '좋은 궁합';
            strengths = [
                '적절한 공통점과 차이점의 균형',
                '상호 성장을 도와주는 관계',
                '서로 다른 관점으로 시야 확장'
            ];
            challenges = [
                '의사소통 방식 조율 필요',
                '서로 다른 우선순위 인정 필요'
            ];
            advice = '차이점을 단점이 아닌 성장 기회로 받아들이세요.';
        } else if (score >= 4.5) {
            title = '보통 궁합';
            strengths = [
                '서로 다른 관점을 통한 학습 기회',
                '균형잡힌 시각 개발',
                '도전을 통한 개인 성장'
            ];
            challenges = [
                '의사소통 방식의 근본적 차이',
                '가치관과 생활 패턴 조율 필요'
            ];
            advice = '서로의 차이를 존중하며 인내심을 갖고 관계를 발전시키세요.';
        } else {
            title = '도전적인 관계';
            strengths = [
                '극단적 차이로 인한 강한 성장 자극',
                '전혀 다른 세계관 경험 기회',
                '성공시 매우 균형잡힌 관계 가능'
            ];
            challenges = [
                `${oppositeCount}개 차원에서 근본적 차이`,
                '의사소통과 이해에 상당한 노력 필요'
            ];
            advice = '많은 이해와 노력이 필요하지만, 성공시 큰 성장을 얻을 수 있습니다.';
        }

        return { score: Math.round(score * 10) / 10, title, strengths, challenges, advice };
    }

    // 유형 선택 모달 표시
    showTypeSelectorModal(currentType) {
        this.currentTypeForComparison = currentType;
        document.getElementById('type-selector-modal').classList.add('active');
        document.getElementById('overlay').classList.add('active');
    }

    // 유형 선택 모달 닫기
    closeTypeSelectorModal() {
        document.getElementById('type-selector-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }

    // 궁합 모달 표시
    showCompatibilityModal(userType, matchType) {
        const compatibility = this.getCompatibility(userType, matchType);
        
        const modalContent = `
            <div class="compatibility-modal-content">
                <h2>${userType} ❤️ ${matchType}</h2>
                <div class="compatibility-score">
                    <span class="score">${compatibility.score}</span>
                    <span class="score-label">/ 10</span>
                </div>
                <h3 class="compatibility-title">${compatibility.title}</h3>
                
                <div class="compatibility-section">
                    <h4>💪 관계의 강점</h4>
                    <ul>
                        ${compatibility.strengths.map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="compatibility-section">
                    <h4>⚠️ 주의할 점</h4>
                    <ul>
                        ${compatibility.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="compatibility-section">
                    <h4>💡 관계 개선 조언</h4>
                    <p>${compatibility.advice}</p>
                </div>
                
                <button class="close-compatibility-btn">닫기</button>
            </div>
        `;
        
        // 궁합 모달이 없으면 생성
        let modal = document.getElementById('compatibility-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'compatibility-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = modalContent;
        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
        
        // 닫기 버튼 이벤트
        modal.querySelector('.close-compatibility-btn').addEventListener('click', () => {
            this.closeModals();
        });
    }

    // 모달 닫기
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.getElementById('overlay').classList.remove('active');
    }
}

// 페이지 로드 시 MBTI 테스트 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.mbtiTest = new MBTITest();
    
    // 사이드바 토글 기능 추가
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    // 토글 버튼 클릭 시
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });
    }
    
    // 오버레이 클릭 시 사이드바 닫기
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
    
    // ESC 키로 사이드바 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
    
    // 윈도우 리사이즈 시 태블릿/데스크톱에서는 사이드바 초기화
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        if (windowWidth <= 768 && newWidth > 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
        windowWidth = newWidth;
    });
});