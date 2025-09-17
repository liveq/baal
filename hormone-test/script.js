// 호르몬 테스트 JavaScript

// 전역 변수
let current_question = 0;
let user_gender = '';
let test_answers = [];
let current_section = 'home';
let navigation_history = [];

// 테스트 문항 데이터
const test_questions = [
    {
        question: "친구가 실연당해서 울고 있을 때 나는?",
        answers: [
            { text: "같이 울면서 마음껏 울라고 토닥여준다", type: "egen" },
            { text: "그 사람은 널 받을 자격이 없어! 새로운 사람 소개시켜줄게", type: "teto" }
        ]
    },
    {
        question: "주말에 뭐할지 계획 세울 때 나는?",
        answers: [
            { text: "그때 기분 따라 즉흥적으로 정한다", type: "egen" },
            { text: "미리 시간대별로 계획을 다 짜놓는다", type: "teto" }
        ]
    },
    {
        question: "카톡 프로필 상태메시지는 주로?",
        answers: [
            { text: "감성적인 노래 가사나 시", type: "egen" },
            { text: "비워두거나 간단한 이모티콘", type: "teto" }
        ]
    },
    {
        question: "선호하는 영화 장르는?",
        answers: [
            { text: "로맨스, 드라마, 감동적인 영화", type: "egen" },
            { text: "액션, 스릴러, SF 영화", type: "teto" }
        ]
    },
    {
        question: "선물 받았을 때 나는?",
        answers: [
            { text: "감동해서 눈물이 날 것 같다", type: "egen" },
            { text: "고맙다고 쿨하게 인사한다", type: "teto" }
        ]
    },
    {
        question: "운동할 때 선호하는 스타일은?",
        answers: [
            { text: "요가, 필라테스 같은 정적인 운동", type: "egen" },
            { text: "웨이트, 크로스핏 같은 강한 운동", type: "teto" }
        ]
    },
    {
        question: "카페에서 주로 주문하는 메뉴는?",
        answers: [
            { text: "달달한 라떼나 프라푸치노", type: "egen" },
            { text: "아메리카노나 에스프레소", type: "teto" }
        ]
    },
    {
        question: "인스타그램 피드 스타일은?",
        answers: [
            { text: "감성적이고 따뜻한 색감", type: "egen" },
            { text: "심플하고 깔끔한 톤", type: "teto" }
        ]
    },
    {
        question: "싸웠을 때 화해하는 방법은?",
        answers: [
            { text: "편지 쓰거나 긴 대화로 풀어낸다", type: "egen" },
            { text: "시간이 지나면 자연스럽게 풀린다", type: "teto" }
        ]
    },
    {
        question: "일기 쓰는 스타일은?",
        answers: [
            { text: "오늘 있었던 일과 감정을 자세히 기록", type: "egen" },
            { text: "안 쓰거나 간단한 메모 정도", type: "teto" }
        ]
    },
    {
        question: "좋아하는 사람에게 고백할 때?",
        answers: [
            { text: "로맨틱한 분위기에서 진심을 담아", type: "egen" },
            { text: "쿨하고 직접적으로 마음을 전달", type: "teto" }
        ]
    },
    {
        question: "스트레스 받을 때 푸는 방법은?",
        answers: [
            { text: "친구와 수다 떨거나 감정을 표현", type: "egen" },
            { text: "혼자 운동하거나 게임으로 해소", type: "teto" }
        ]
    }
];

// 유형별 상세 정보
const type_details = {
    'egen-male': {
        title: '에겐남',
        subtitle: '감성 충만 소프트보이',
        description: '당신은 섬세하고 감성적인 에겐남이에요!',
        traits: [
            '🌸 플레이리스트 제목 짓는데 30분 고민',
            '☕ 카페 가서 분위기 즐기는 게 취미',
            '💌 기념일마다 편지 쓰는 로맨티시스트',
            '🎬 영화 보고 여운에 잠기는 타입',
            '📱 감성 사진 찍고 필터 고르는 재미',
            '🎵 노래 가사에 진심인 편',
            '🌙 밤에 감성 타서 일기 쓰기'
        ],
        stories: [
            "에겐남들은 '그냥 아무거나'라는 말을 못해요. 메뉴 하나도 신중하게 고민하죠.",
            "친구가 우울해하면 같이 울어주는 게 에겐남의 사랑법이에요.",
            "에겐남의 휴대폰 갤러리는 하늘 사진과 카페 사진으로 가득해요."
        ],
        match: '테토녀와 찰떡궁합! 서로의 부족한 부분을 채워줄 수 있어요.'
    },
    'teto-male': {
        title: '테토남',
        subtitle: '터프한 매력의 소유자',
        description: '당신은 강인하고 논리적인 테토남이에요!',
        traits: [
            '💪 헬스장이 제2의 집',
            '🎮 게임할 때 진심 모드',
            '⚡ 결정력 있고 추진력 만렙',
            '🏃 말보다 행동이 먼저',
            '🔥 승부욕 끝판왕',
            '💼 효율성과 실용성 추구',
            '🎯 목표 지향적 성격'
        ],
        stories: [
            "테토남들은 '괜찮아' '뭐 어때'가 입에 붙어있어요.",
            "감정 표현은 서툴지만 행동으로 보여주는 스타일이에요.",
            "테토남의 카톡은 'ㅇㅇ' 'ㄱㄱ' 같은 초간단 답변이 특징이죠."
        ],
        match: '에겐녀와 환상의 조합! 감성과 이성의 완벽한 밸런스를 만들어요.'
    },
    'egen-female': {
        title: '에겐녀',
        subtitle: '사랑스러운 감성퀸',
        description: '당신은 따뜻하고 섬세한 에겐녀예요!',
        traits: [
            '🌺 꽃과 향초를 사랑하는 감성파',
            '💕 공감 능력 만렙',
            '📔 다이어리 꾸미기 덕후',
            '🧸 인형과 파스텔톤 러버',
            '💐 기념일 챙기기 달인',
            '☁️ 구름 사진 찍는 취미',
            '🎀 디테일에 진심인 편'
        ],
        stories: [
            "에겐녀들은 친구 고민 상담이 특기예요. 3시간도 거뜬!",
            "감동적인 영화 보면 눈물이 자동으로 나와요.",
            "에겐녀의 방은 향초, 디퓨저, 룸스프레이로 가득해요."
        ],
        match: '테토남과 완벽한 케미! 서로를 성장시키는 관계가 될 수 있어요.'
    },
    'teto-female': {
        title: '테토녀',
        subtitle: '쿨한 걸크러쉬',
        description: '당신은 당당하고 독립적인 테토녀예요!',
        traits: [
            '🔥 카리스마 넘치는 리더십',
            '💯 직설적이고 시원시원한 성격',
            '🏋️ 운동으로 스트레스 해소',
            '🎯 목표 달성에 진심',
            '⚡ 추진력과 결단력 갑',
            '🎮 게임 실력 상위 1%',
            '💪 독립적이고 자립심 강함'
        ],
        stories: [
            "테토녀들은 '울지마' 보다 '때려줄까?'가 먼저 나와요.",
            "화장은 최소한으로, 편한 게 최고라고 생각해요.",
            "테토녀의 최애 답변은 '그래서?' '어쩌라고?'예요."
        ],
        match: '에겐남과 최강 조합! 서로의 다름이 매력이 되는 관계예요.'
    }
};

// DOM 요소들
const get_elements = () => ({
    sidebar: document.querySelector('.sidebar'),
    sidebar_toggle: document.querySelector('.sidebar-toggle'),
    type_buttons: document.querySelectorAll('.type-btn'),
    cards: document.querySelectorAll('.card'),
    test_start_buttons: document.querySelectorAll('.test-start-btn'),
    gender_modal: document.getElementById('gender-modal'),
    test_modal: document.getElementById('test-modal'),
    overlay: document.getElementById('overlay'),
    home_screen: document.getElementById('home-screen'),
    type_detail: document.getElementById('type-detail'),
    result_screen: document.getElementById('result-screen')
});

// 초기화 함수
function init() {
    const elements = get_elements();
    
    // 사이드바 토글
    elements.sidebar_toggle?.addEventListener('click', toggle_sidebar);
    
    // 사이드바 메뉴 버튼들
    elements.type_buttons.forEach(btn => {
        btn.addEventListener('click', () => handle_type_button(btn.dataset.type));
    });
    
    // 카드 클릭 이벤트
    elements.cards.forEach(card => {
        card.addEventListener('click', () => show_type_detail(card.dataset.type));
    });
    
    // 테스트 시작 버튼들
    elements.test_start_buttons.forEach(btn => {
        btn.addEventListener('click', start_test);
    });
    
    // 성별 선택 버튼들
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', () => select_gender(btn.dataset.gender));
    });
    
    // 오버레이 클릭시 모달 닫기
    elements.overlay?.addEventListener('click', close_all_modals);
}

// 사이드바 토글
function toggle_sidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// 유형 버튼 핸들러
function handle_type_button(type) {
    if (type === 'home') {
        show_home();
    } else {
        show_type_detail(type);
    }
    
    // 활성 버튼 표시
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
}

// 홈 화면 표시
function show_home(push_state = true) {
    hide_all_sections();
    document.getElementById('home-screen').classList.add('active');
    current_section = 'home';

    // 스크롤을 맨 위로 이동
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // 히스토리 관리
    if (push_state) {
        history.pushState({ section: 'home' }, '', '#home');
    }

    // 사이드바 버튼 활성화
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === 'home');
    });
}

// 유형 상세 페이지 표시
function show_type_detail(type, push_state = true) {
    if (!type_details[type]) return;

    hide_all_sections();
    const detail_section = document.getElementById('type-detail');
    const detail_content = detail_section.querySelector('.type-detail-content');

    const detail = type_details[type];
    detail_content.innerHTML = `
        <div class="detail-container">
            <div class="detail-header-compact">
                <button class="back-button" onclick="go_back()">←</button>
                <div class="title-compact">
                    <span class="type-symbol">${get_type_symbol(type)}</span>
                    <span class="detail-title">${detail.title}</span>
                    <span class="detail-subtitle">${detail.subtitle}</span>
                </div>
            </div>

            <div class="detail-content-grid-enhanced">
                <div class="traits-card">
                    <h3>✨ 특징</h3>
                    <div class="traits-grid">
                        ${detail.traits.map(trait => `<div class="trait-item">${trait}</div>`).join('')}
                    </div>
                </div>

                <div class="match-card">
                    <h3>💝 최고의 궁합</h3>
                    <p class="match-info">${detail.match}</p>
                </div>

                <div class="stories-card">
                    <h3>💭 재미있는 일화</h3>
                    <div class="stories-grid">
                        ${detail.stories.map((story, index) => `
                            <div class="story-item">
                                <div class="story-number">0${index + 1}</div>
                                <p class="story-text">${story}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    detail_section.classList.add('active');
    current_section = 'detail';

    // 히스토리 관리
    if (push_state) {
        history.pushState({ section: 'detail', type: type }, '', '#' + type);
    }

    // 사이드바 버튼 활성화
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
}

// 아바타 스타일 가져오기
function get_avatar_style(type) {
    const styles = {
        'egen-male': 'lorelei',
        'teto-male': 'adventurer',
        'egen-female': 'avataaars',
        'teto-female': 'personas'
    };
    return styles[type] || 'lorelei';
}

// 배경색 가져오기
function get_bg_color(type) {
    const colors = {
        'egen-male': 'ffdfba',
        'teto-male': 'c0d6e4',
        'egen-female': 'ffd5dc',
        'teto-female': 'b6e3f4'
    };
    return colors[type] || 'ffffff';
}

// 타입별 상징 아이콘 가져오기
function get_type_symbol(type) {
    const symbols = {
        'egen-male': '💝',
        'teto-male': '⚡',
        'egen-female': '🌸',
        'teto-female': '🔥'
    };
    return symbols[type] || '🎭';
}

// 테스트 시작
function start_test() {
    show_gender_modal();
}

// 성별 선택 모달 표시
function show_gender_modal() {
    document.getElementById('gender-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// 성별 선택
function select_gender(gender) {
    user_gender = gender;
    close_gender_modal();
    show_test_modal();
}

// 성별 모달 닫기
function close_gender_modal() {
    document.getElementById('gender-modal').classList.remove('active');
}

// 테스트 모달 표시
function show_test_modal() {
    document.getElementById('test-modal').classList.add('active');
    current_question = 0;
    test_answers = [];
    render_question();
}

// 문항 렌더링
function render_question() {
    const question = test_questions[current_question];
    const container = document.querySelector('.question-container');
    const progress_fill = document.querySelector('.progress-fill');
    const progress_text = document.querySelector('.progress-text');
    
    // 진행률 업데이트
    const progress = ((current_question + 1) / test_questions.length) * 100;
    progress_fill.style.width = `${progress}%`;
    progress_text.textContent = `${current_question + 1}/${test_questions.length}`;
    
    // 질문 텍스트
    container.querySelector('.question-text').textContent = question.question;
    
    // 답변 버튼들
    const answer_container = container.querySelector('.answer-buttons');
    answer_container.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer.text;
        btn.dataset.type = answer.type;
        btn.addEventListener('click', () => select_answer(index));
        answer_container.appendChild(btn);
    });
    
    // 네비게이션 버튼 상태
    update_nav_buttons();
}

// 답변 선택
function select_answer(index) {
    const answer_buttons = document.querySelectorAll('.answer-btn');
    answer_buttons.forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
    
    test_answers[current_question] = test_questions[current_question].answers[index].type;
    
    // 자동으로 다음 문항으로
    setTimeout(() => {
        if (current_question < test_questions.length - 1) {
            next_question();
        } else {
            show_result();
        }
    }, 500);
}

// 다음 문항
function next_question() {
    if (current_question < test_questions.length - 1) {
        current_question++;
        render_question();
    }
}

// 이전 문항
function prev_question() {
    if (current_question > 0) {
        current_question--;
        render_question();
    }
}

// 네비게이션 버튼 업데이트
function update_nav_buttons() {
    const prev_btn = document.querySelector('.prev-btn');
    const next_btn = document.querySelector('.next-btn');
    
    if (prev_btn) {
        prev_btn.disabled = current_question === 0;
        prev_btn.onclick = prev_question;
    }
    
    if (next_btn) {
        next_btn.disabled = !test_answers[current_question];
        next_btn.textContent = current_question === test_questions.length - 1 ? '결과 보기' : '다음';
        next_btn.onclick = () => {
            if (current_question === test_questions.length - 1) {
                show_result();
            } else {
                next_question();
            }
        };
    }
}

// 결과 계산 및 표시
function show_result() {
    close_test_modal();
    
    // 점수 계산
    const egen_count = test_answers.filter(a => a === 'egen').length;
    const teto_count = test_answers.filter(a => a === 'teto').length;
    const egen_percentage = Math.round((egen_count / test_answers.length) * 100);
    const teto_percentage = 100 - egen_percentage;
    
    // 유형 결정
    let result_type;
    if (user_gender === 'male') {
        result_type = egen_percentage >= 50 ? 'egen-male' : 'teto-male';
    } else {
        result_type = egen_percentage >= 50 ? 'egen-female' : 'teto-female';
    }
    
    // 결과 화면 표시
    hide_all_sections();
    const result_section = document.getElementById('result-screen');
    const result_content = result_section.querySelector('.result-content');
    const detail = type_details[result_type];
    
    result_content.innerHTML = `
        <div class="result-header">
            <h2 class="result-title">당신은 ${detail.title}!</h2>
            <img src="https://api.dicebear.com/7.x/${get_avatar_style(result_type)}/svg?seed=${result_type}&backgroundColor=${get_bg_color(result_type)}" 
                 alt="${detail.title}" class="result-avatar">
            <p class="result-subtitle">${detail.subtitle}</p>
        </div>
        
        <div class="hormone-meter">
            <div class="meter-bar">
                <div class="egen-bar" style="width: ${egen_percentage}%">
                    <span>에겐 ${egen_percentage}%</span>
                </div>
                <div class="teto-bar" style="width: ${teto_percentage}%">
                    <span>테토 ${teto_percentage}%</span>
                </div>
            </div>
        </div>
        
        <div class="result-traits">
            <h3>당신의 특징</h3>
            <ul class="traits-list">
                ${detail.traits.slice(0, 5).map(trait => `<li>${trait}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-match">
            <h3>최고의 궁합</h3>
            <p>${detail.match}</p>
        </div>
        
        <div class="result-actions">
            <button class="share-btn" onclick="share_result('${result_type}', ${egen_percentage}, ${teto_percentage})">
                📱 카톡으로 공유하기
            </button>
            <button class="retry-btn" onclick="start_test()">
                🔄 다시 테스트하기
            </button>
            <button class="home-btn" onclick="show_home()">
                🏠 홈으로 가기
            </button>
        </div>
    `;
    
    result_section.classList.add('active');
    
    // 로컬스토리지에 결과 저장
    save_result(result_type, egen_percentage, teto_percentage);
}

// 결과 저장
function save_result(type, egen, teto) {
    const result = {
        type: type,
        egen_percentage: egen,
        teto_percentage: teto,
        date: new Date().toISOString()
    };
    localStorage.setItem('hormone_test_result', JSON.stringify(result));
}

// 결과 공유
function share_result(type, egen, teto) {
    const detail = type_details[type];
    const text = `🧬 나의 호르몬 밸런스 테스트 결과!\n\n` +
                `나는 ${detail.title} (${detail.subtitle})\n` +
                `에겐 ${egen}% / 테토 ${teto}%\n\n` +
                `나도 테스트하기 👉 ${window.location.href}`;
    
    // 카카오톡 공유 또는 클립보드 복사
    if (navigator.share) {
        navigator.share({
            title: '호르몬 밸런스 테스트',
            text: text
        });
    } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(text).then(() => {
            alert('결과가 클립보드에 복사되었습니다!');
        });
    }
}

// 테스트 모달 닫기
function close_test_modal() {
    document.getElementById('test-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// 모든 모달 닫기
function close_all_modals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('overlay').classList.remove('active');
}

// 모든 섹션 숨기기
function hide_all_sections() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
}

// 스타일 추가 (결과 화면용)
const style = document.createElement('style');
style.textContent = `
    /* 상세 페이지 레이아웃 */
    .detail-container {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 2rem;
        height: calc(100vh - 120px);
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .detail-left {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .detail-right {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        overflow-y: auto;
    }
    
    .detail-header {
        text-align: center;
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .detail-avatar {
        width: 140px;
        height: 140px;
        margin: 0 auto 1rem;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--egen-light) 0%, var(--teto-light) 100%);
        padding: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .detail-title {
        font-size: 2.2rem;
        margin-bottom: 0.3rem;
        background: linear-gradient(135deg, var(--egen-pink) 0%, var(--teto-blue) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .detail-subtitle {
        font-size: 1.1rem;
        color: var(--text-light);
        margin-bottom: 0.8rem;
    }
    
    .detail-description {
        font-size: 1rem;
        color: var(--text-dark);
        line-height: 1.5;
    }
    
    .detail-match {
        background: linear-gradient(135deg, #FFE4E9 0%, #E4F0FF 100%);
        padding: 1.5rem;
        border-radius: 15px;
    }
    
    .detail-match h3 {
        font-size: 1.1rem;
        margin-bottom: 0.8rem;
        color: var(--text-dark);
    }
    
    .match-info {
        font-size: 0.95rem;
        color: var(--text-dark);
        line-height: 1.5;
    }
    
    .detail-traits {
        background: white;
        padding: 1.5rem;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .detail-traits h3, .detail-stories h3 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: var(--text-dark);
    }
    
    .traits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.8rem;
    }
    
    .trait-item {
        padding: 0.8rem;
        background: var(--bg-cream);
        border-radius: 12px;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .trait-item:hover {
        border-color: var(--egen-pink);
        transform: translateX(5px);
    }
    
    .detail-stories {
        background: white;
        padding: 1.5rem;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .stories-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .story-item {
        padding: 1rem;
        background: linear-gradient(135deg, var(--egen-light) 0%, var(--teto-light) 20%);
        border-radius: 12px;
        font-size: 0.95rem;
        line-height: 1.5;
        border-left: 4px solid var(--teto-blue);
    }
    
    
    /* 결과 화면 스타일 */
    .result-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .result-avatar {
        width: 150px;
        height: 150px;
        margin: 1rem auto;
        border-radius: 50%;
        background: white;
        padding: 10px;
        box-shadow: var(--shadow);
    }
    
    .result-title {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, var(--egen-pink) 0%, var(--teto-blue) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .result-subtitle {
        font-size: 1.2rem;
        color: var(--text-light);
    }
    
    .result-traits, .result-match {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .traits-list {
        list-style: none;
        padding: 0;
    }
    
    .traits-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .traits-list li:last-child {
        border-bottom: none;
    }
    
    /* 반응형 상세 페이지 */
    @media (max-width: 1200px) {
        .detail-container {
            grid-template-columns: 350px 1fr;
        }
    }
    
    @media (max-width: 968px) {
        .detail-container {
            grid-template-columns: 1fr;
            height: auto;
        }
        
        .detail-left {
            max-width: 500px;
            margin: 0 auto;
        }
        
        .traits-grid {
            grid-template-columns: 1fr;
        }
    }
    
    .hormone-meter {
        margin: 2rem 0;
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .meter-bar {
        display: flex;
        height: 50px;
        border-radius: 25px;
        overflow: hidden;
        background: var(--border-color);
    }
    
    .egen-bar {
        background: linear-gradient(90deg, var(--egen-pink) 0%, var(--egen-light) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        transition: width 1s ease;
    }
    
    .teto-bar {
        background: linear-gradient(90deg, var(--teto-light) 0%, var(--teto-blue) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        transition: width 1s ease;
    }
    
    .result-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .share-btn, .retry-btn, .home-btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .share-btn {
        background: #FEE500;
        color: #3C1E1E;
    }
    
    .retry-btn {
        background: linear-gradient(135deg, var(--egen-pink) 0%, var(--teto-blue) 100%);
        color: white;
    }
    
    .home-btn {
        background: white;
        border: 2px solid var(--border-color);
        color: var(--text-dark);
    }
    
    .share-btn:hover, .retry-btn:hover, .home-btn:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow);
    }
`;
document.head.appendChild(style);

// 뒤로가기 기능
function go_back() {
    window.history.back();
}

// 브라우저 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', function(event) {
    if (event.state) {
        if (event.state.section === 'home') {
            show_home(false);
        } else if (event.state.section === 'detail') {
            show_type_detail(event.state.type, false);
        }
    } else {
        show_home(false);
    }
});

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 초기 상태 설정
    history.replaceState({ section: 'home' }, '', '#home');
    init();
});