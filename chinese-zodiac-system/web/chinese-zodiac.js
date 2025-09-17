/**
 * 중국 12간지 띠별운세 메인 JavaScript
 */

// 전역 변수
let currentZodiacId = null;
// chineseZodiacAPI는 api 파일에서 전역으로 생성됨

// 모달 닫기 함수 (HTML onclick에서 즉시 접근 가능하도록 상단에 배치)
window.closeZodiacModal = function() {
    const modal = document.getElementById('zodiacModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// 모달 외부 클릭 시 닫기
window.closeModalOnOutside = function(event) {
    if (event.target.id === 'zodiacModal') {
        closeZodiacModal();
    }
};

// 12간지 정보 데이터
const chineseZodiacData = {
    1: { name: '쥐띠', symbol: '🐭', hanja: '자(子)', element: '물', trait: '지혜와 영리함' },
    2: { name: '소띠', symbol: '🐂', hanja: '축(丑)', element: '토', trait: '인내와 성실함' },
    3: { name: '범띠', symbol: '🐅', hanja: '인(寅)', element: '목', trait: '용기와 도전' },
    4: { name: '토끼띠', symbol: '🐰', hanja: '묘(卯)', element: '목', trait: '온화함과 평화' },
    5: { name: '용띠', symbol: '🐲', hanja: '진(辰)', element: '토', trait: '권위와 성공' },
    6: { name: '뱀띠', symbol: '🐍', hanja: '사(巳)', element: '화', trait: '지혜와 신비' },
    7: { name: '말띠', symbol: '🐎', hanja: '오(午)', element: '화', trait: '자유와 활력' },
    8: { name: '양띠', symbol: '🐑', hanja: '미(未)', element: '토', trait: '온순함과 예술' },
    9: { name: '원숭이띠', symbol: '🐵', hanja: '신(申)', element: '금', trait: '재치와 유머' },
    10: { name: '닭띠', symbol: '🐓', hanja: '유(酉)', element: '금', trait: '성실함과 정직' },
    11: { name: '개띠', symbol: '🐕', hanja: '술(戌)', element: '토', trait: '충성과 신뢰' },
    12: { name: '돼지띠', symbol: '🐷', hanja: '해(亥)', element: '물', trait: '풍요와 관대함' }
};

// 12간지 상세 설명 데이터
const chineseZodiacDescriptions = {
    1: {
        title: '쥐띠 (자 子)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐭</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">자(子) · 물의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        쥐띠는 12간지의 첫 번째로, <strong>지혜롭고 영리한</strong> 성격을 가집니다.
        적응력이 뛰어나고 새로운 환경에서도 빠르게 자리잡는 능력이 있습니다.
        작은 체구에도 불구하고 강인한 생명력과 끈질긴 의지를 보여줍니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>뛰어난 직감:</strong> 위험과 기회를 빠르게 감지하는 능력</li>
            <li><strong>높은 적응력:</strong> 어떤 환경에서도 생존하는 능력</li>
            <li><strong>경제 감각:</strong> 돈과 자원 관리에 능함</li>
            <li><strong>사교성:</strong> 다양한 사람들과 잘 어울리는 성격</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 물(水) · <strong>방향:</strong> 북쪽 · <strong>색상:</strong> 검정, 파랑
        <br><strong>행운의 숫자:</strong> 2, 3 · <strong>길한 방향:</strong> 동남, 동북
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 뛰어난 직감을 믿되, 때로는 다른 사람의 조언도 귀담아 들으세요.
        작은 기회도 소중히 여기며, 꾸준한 노력으로 큰 성공을 이룰 수 있습니다.
        </p>
        `
    },
    2: {
        title: '소띠 (축 丑)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐂</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">축(丑) · 토의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        소띠는 <strong>성실하고 인내심이 강한</strong> 성격의 소유자입니다.
        한번 시작한 일은 끝까지 해내는 끈기와 책임감이 뛰어나며,
        안정을 추구하고 전통을 중시하는 보수적인 성향을 보입니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>강한 의지력:</strong> 어떤 어려움도 참고 견디는 인내심</li>
            <li><strong>신뢰성:</strong> 약속을 지키고 믿을 수 있는 성격</li>
            <li><strong>근면함:</strong> 꾸준하고 성실한 노력으로 성과 달성</li>
            <li><strong>현실감각:</strong> 실용적이고 합리적인 판단력</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 토(土) · <strong>방향:</strong> 동북쪽 · <strong>색상:</strong> 황토색, 갈색
        <br><strong>행운의 숫자:</strong> 1, 9 · <strong>길한 방향:</strong> 남쪽, 동남쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 꾸준함은 큰 자산입니다. 급하게 결과를 얻으려 하지 말고,
        차근차근 기반을 다져나가면 반드시 큰 성취를 이룰 수 있습니다.
        </p>
        `
    },
    3: {
        title: '범띠 (인 寅)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐅</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">인(寅) · 목의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        범띠는 <strong>용기와 도전정신이 넘치는</strong> 성격입니다.
        강인한 의지와 리더십을 갖추고 있으며, 정의감이 강하고
        약자를 보호하려는 마음이 큽니다. 자유를 사랑하고 독립적인 성향이 강합니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>강한 리더십:</strong> 사람들을 이끄는 카리스마와 추진력</li>
            <li><strong>용기:</strong> 어려운 상황에서도 당당히 맞서는 용기</li>
            <li><strong>정의감:</strong> 옳고 그름을 명확히 구분하는 도덕성</li>
            <li><strong>독립성:</strong> 남에게 의존하지 않는 자주적인 성격</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 목(木) · <strong>방향:</strong> 동북쪽 · <strong>색상:</strong> 초록, 파랑
        <br><strong>행운의 숫자:</strong> 1, 3, 4 · <strong>길한 방향:</strong> 남쪽, 동쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 추진력은 훌륭하지만, 때로는 신중함도 필요합니다.
        계획을 세우고 주변 사람들의 의견도 들어보면 더 큰 성공을 거둘 수 있습니다.
        </p>
        `
    },
    4: {
        title: '토끼띠 (묘 卯)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐰</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">묘(卯) · 목의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        토끼띠는 <strong>온화하고 평화를 사랑하는</strong> 성격입니다.
        세련된 취향과 예술적 감각이 뛰어나며, 조화로운 인간관계를
        중시합니다. 신중하고 사려깊은 성격으로 갈등을 피하려 노력합니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>예술적 감각:</strong> 아름다움을 추구하는 세련된 취향</li>
            <li><strong>친화력:</strong> 상대방을 배려하는 따뜻한 마음</li>
            <li><strong>직감력:</strong> 상황을 빠르게 파악하는 센스</li>
            <li><strong>평화주의:</strong> 갈등을 조절하고 중재하는 능력</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 목(木) · <strong>방향:</strong> 동쪽 · <strong>색상:</strong> 초록, 분홍
        <br><strong>행운의 숫자:</strong> 3, 4, 9 · <strong>길한 방향:</strong> 동쪽, 동남쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 온화함은 큰 매력이지만, 때로는 자신의 의견을 당당히 표현하는
        것도 중요합니다. 균형잡힌 삶을 통해 진정한 행복을 찾으세요.
        </p>
        `
    },
    5: {
        title: '용띠 (진 辰)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐲</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">진(辰) · 토의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        용띠는 <strong>권위와 성공의 상징</strong>으로, 천성적인 리더의 자질을 갖춘
        성격입니다. 큰 꿈과 이상을 품고 있으며, 카리스마와 자신감이 넘칩니다.
        높은 이상과 원대한 포부를 가지고 살아갑니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>카리스마:</strong> 사람들을 이끄는 강력한 영향력</li>
            <li><strong>창의성:</strong> 독창적이고 혁신적인 아이디어</li>
            <li><strong>야망:</strong> 큰 목표를 향한 강한 의지력</li>
            <li><strong>관대함:</strong> 포용력 있고 너그러운 성격</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 토(土) · <strong>방향:</strong> 동남쪽 · <strong>색상:</strong> 금색, 황색
        <br><strong>행운의 숫자:</strong> 1, 6, 7 · <strong>길한 방향:</strong> 서쪽, 남쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 큰 꿈을 실현하기 위해서는 꾸준한 노력과 겸손함이 필요합니다.
        주변 사람들과의 협력을 통해 더 큰 성취를 이룰 수 있습니다.
        </p>
        `
    },
    6: {
        title: '뱀띠 (사 巳)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐍</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">사(巳) · 화의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        뱀띠는 <strong>지혜와 신비로운 매력</strong>을 가진 성격입니다.
        직감이 뛰어나고 통찰력이 깊으며, 신중하고 계획적인 성향을 보입니다.
        내적 깊이가 있고 철학적 사고를 즐기는 지적인 성격입니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>뛰어난 직감:</strong> 상황의 본질을 꿰뚫어 보는 능력</li>
            <li><strong>깊은 지혜:</strong> 경험을 통해 쌓은 풍부한 인생 철학</li>
            <li><strong>신중함:</strong> 성급하지 않고 신중하게 판단하는 능력</li>
            <li><strong>집중력:</strong> 한 가지 일에 깊이 몰입하는 능력</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 화(火) · <strong>방향:</strong> 남동쪽 · <strong>색상:</strong> 빨강, 금색
        <br><strong>행운의 숫자:</strong> 2, 8, 9 · <strong>길한 방향:</strong> 서남, 서쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 깊은 통찰력을 활용하되, 때로는 직관보다는 논리적 사고도
        병행해보세요. 신중함과 과감함의 균형을 맞추면 더 큰 성공을 거둘 수 있습니다.
        </p>
        `
    },
    7: {
        title: '말띠 (오 午)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐎</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">오(午) · 화의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        말띠는 <strong>자유와 활력이 넘치는</strong> 성격입니다.
        에너지가 풍부하고 모험을 좋아하며, 새로운 경험을 추구합니다.
        독립적이고 자유분방하며, 빠른 판단력과 행동력을 가지고 있습니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>활력:</strong> 넘치는 에너지와 열정적인 성격</li>
            <li><strong>자유로움:</strong> 구속받지 않는 독립적인 사고</li>
            <li><strong>빠른 적응력:</strong> 새로운 환경에 금방 적응하는 능력</li>
            <li><strong>솔직함:</strong> 진실되고 꾸밈없는 성격</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 화(火) · <strong>방향:</strong> 남쪽 · <strong>색상:</strong> 빨강, 주황
        <br><strong>행운의 숫자:</strong> 2, 3, 7 · <strong>길한 방향:</strong> 동쪽, 서쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 자유로운 영혼은 큰 자산이지만, 때로는 인내심을 가지고
        한 가지 일에 집중하는 것도 중요합니다. 계획성을 더하면 더 큰 성취를 이룰 수 있습니다.
        </p>
        `
    },
    8: {
        title: '양띠 (미 未)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐑</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">미(未) · 토의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        양띠는 <strong>온순하고 예술적 감각이 뛰어난</strong> 성격입니다.
        평화를 사랑하고 조화로운 관계를 중시하며, 창의적이고 감성적인
        면이 강합니다. 배려심이 깊고 동정심이 많은 따뜻한 성격을 가졌습니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>예술적 재능:</strong> 뛰어난 미적 감각과 창의력</li>
            <li><strong>온화함:</strong> 부드럽고 평화로운 성격</li>
            <li><strong>공감 능력:</strong> 타인의 마음을 이해하는 능력</li>
            <li><strong>인내심:</strong> 어려움을 묵묵히 견디는 인내력</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 토(土) · <strong>방향:</strong> 남서쪽 · <strong>색상:</strong> 녹색, 빨강
        <br><strong>행운의 숫자:</strong> 3, 4, 5 · <strong>길한 방향:</strong> 북쪽, 동쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 따뜻한 마음과 예술적 감각을 잘 활용하세요.
        때로는 자신감을 갖고 더 적극적으로 나서는 것도 필요합니다.
        </p>
        `
    },
    9: {
        title: '원숭이띠 (신 申)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐵</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">신(申) · 금의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        원숭이띠는 <strong>재치와 유머가 넘치는</strong> 성격입니다.
        뛰어난 지능과 창의력을 가지고 있으며, 호기심이 많고 새로운 것을
        좋아합니다. 사교적이고 활발하며, 어떤 상황에서도 유머를 잃지 않는 낙천적인 성격입니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>뛰어난 지능:</strong> 빠른 학습능력과 문제해결 능력</li>
            <li><strong>유머감각:</strong> 상황을 밝게 만드는 재치와 유머</li>
            <li><strong>적응력:</strong> 어떤 환경에서도 잘 적응하는 능력</li>
            <li><strong>사교성:</strong> 다양한 사람들과 쉽게 친해지는 능력</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 금(金) · <strong>방향:</strong> 서남쪽 · <strong>색상:</strong> 흰색, 금색
        <br><strong>행운의 숫자:</strong> 1, 7, 8 · <strong>길한 방향:</strong> 북쪽, 서북쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 재치와 창의력은 큰 자산입니다. 하지만 때로는 진지함도
        필요하니, 중요한 일에는 집중력을 발휘해 보세요.
        </p>
        `
    },
    10: {
        title: '닭띠 (유 酉)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐓</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">유(酉) · 금의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        닭띠는 <strong>성실하고 정직한</strong> 성격의 소유자입니다.
        책임감이 강하고 체계적이며, 완벽주의적 성향을 가지고 있습니다.
        시간을 잘 지키고 규칙을 중시하며, 정의감이 강한 성격입니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>성실함:</strong> 맡은 일을 끝까지 책임지는 성격</li>
            <li><strong>정확성:</strong> 세밀하고 정확한 일처리 능력</li>
            <li><strong>조직력:</strong> 체계적이고 계획적인 사고</li>
            <li><strong>정직함:</strong> 진실되고 솔직한 성격</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 금(金) · <strong>방향:</strong> 서쪽 · <strong>색상:</strong> 금색, 갈색
        <br><strong>행운의 숫자:</strong> 5, 7, 8 · <strong>길한 방향:</strong> 남쪽, 동남쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 성실함과 정확성은 큰 장점입니다. 하지만 때로는 완벽함보다
        유연함이 필요한 상황도 있으니, 융통성을 발휘해 보세요.
        </p>
        `
    },
    11: {
        title: '개띠 (술 戌)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐕</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">술(戌) · 토의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        개띠는 <strong>충성과 신뢰의 상징</strong>입니다.
        의리를 중시하고 친구와 가족을 위해서라면 무엇이든 할 수 있는
        헌신적인 성격입니다. 정직하고 성실하며, 공정함을 추구합니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>충성심:</strong> 믿을 수 있는 든든한 동반자</li>
            <li><strong>정의감:</strong> 옳고 그름을 명확히 구분하는 도덕성</li>
            <li><strong>보호본능:</strong> 소중한 사람들을 지키려는 강한 의지</li>
            <li><strong>신뢰성:</strong> 약속을 지키고 믿음직한 성격</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 토(土) · <strong>방향:</strong> 서북쪽 · <strong>색상:</strong> 빨강, 녹색
        <br><strong>행운의 숫자:</strong> 3, 4, 9 · <strong>길한 방향:</strong> 동쪽, 남쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 충성심과 신뢰성은 인생의 큰 자산입니다. 때로는 자신을 위한
        시간도 가져보세요. 균형잡힌 삶이 더 큰 행복을 가져다 줄 것입니다.
        </p>
        `
    },
    12: {
        title: '돼지띠 (해 亥)',
        description: `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🐷</div>
            <div style="font-size: 18px; color: #b91c1c; font-weight: bold;">해(亥) · 물의 기운</div>
        </div>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🌟 기본 특성</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        돼지띠는 <strong>풍요와 관대함의 상징</strong>입니다.
        너그럽고 포용력이 있으며, 물질적 풍요를 누리는 능력이 있습니다.
        순수하고 정직한 마음을 가지고 있으며, 타인을 위해 희생할 줄 아는 성격입니다.
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">💎 주요 장점</h3>
        <ul style="line-height: 1.8; margin-bottom: 20px;">
            <li><strong>관대함:</strong> 너그럽고 포용력 있는 성격</li>
            <li><strong>순수함:</strong> 꾸밈없고 진실된 마음</li>
            <li><strong>풍요로움:</strong> 물질적, 정신적 풍요를 누리는 능력</li>
            <li><strong>희생정신:</strong> 타인을 위해 기꺼이 나누는 마음</li>
        </ul>

        <h3 style="color: #dc2626; margin-bottom: 15px;">⚡ 오행과 방향</h3>
        <p style="line-height: 1.8; margin-bottom: 20px;">
        <strong>오행:</strong> 물(水) · <strong>방향:</strong> 북서쪽 · <strong>색상:</strong> 황색, 갈색
        <br><strong>행운의 숫자:</strong> 2, 5, 8 · <strong>길한 방향:</strong> 동남, 동북쪽
        </p>

        <h3 style="color: #dc2626; margin-bottom: 15px;">🎯 인생 조언</h3>
        <p style="line-height: 1.8;">
        당신의 관대함과 순수함은 큰 축복입니다. 하지만 때로는 자신을
        보호하는 지혜도 필요하니, 적당한 선을 지키는 것도 중요합니다.
        </p>
        `
    }
};

// 한국어 조사 보호 함수
window.protectKoreanParticles = function(text) {
    if (!text) return text;

    const particles = [
        '을', '를', '이', '가', '은', '는', '과', '와', '의', '로', '으로',
        '에', '에서', '에게', '에게서', '부터', '까지', '만', '도', '까지도',
        '라고', '이라고', '하고', '와', '과', '로써', '로서', '로부터'
    ];

    const pattern = new RegExp(
        `([가-힣]+)(${particles.join('|')})(?=\\s|$)`,
        'g'
    );

    return text.replace(pattern, '$1&nbsp;$2');
}

// 출생년도로 12간지 찾기 함수 (API 사용)
window.getChineseZodiacByYear = function(year) {
    if (chineseZodiacAPI) {
        return chineseZodiacAPI.getChineseZodiacByYear(year);
    } else {
        // API가 없는 경우 폴백
        const baseYear = 1900;
        let zodiacId = ((year - baseYear) % 12) + 1;
        return zodiacId <= 0 ? zodiacId + 12 : zodiacId;
    }
};

// 중국 12간지 선택 함수
window.selectChineseZodiac = function(zodiacId) {
    console.log('selectChineseZodiac called with zodiacId:', zodiacId);
    currentZodiacId = zodiacId;

    // 초기 화면 숨기기
    const introSection = document.getElementById('chineseZodiacIntro');
    if (introSection) {
        introSection.style.display = 'none';
    }

    // 네비게이션 아이템 활성화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.zodiac) === zodiacId) {
            item.classList.add('active');
        }
    });

    // 운세 디스플레이 표시
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    if (fortuneDisplay) {
        fortuneDisplay.style.display = 'block';

        // 12간지 정보 업데이트
        const zodiacInfo = chineseZodiacData[zodiacId];
        if (zodiacInfo) {
            const zodiacIcon = document.getElementById('zodiacIcon');
            const zodiacTitle = document.getElementById('zodiacTitle');
            const zodiacPeriod = document.getElementById('zodiacPeriod');

            if (zodiacIcon) zodiacIcon.textContent = zodiacInfo.symbol;
            if (zodiacTitle) zodiacTitle.textContent = zodiacInfo.name;
            if (zodiacPeriod) zodiacPeriod.textContent = `${zodiacInfo.hanja} | ${zodiacInfo.trait}`;
        }

        // 오늘 탭 표시
        showTab('today');

        // 궁합 상태 초기화
        const partnerZodiacSelect = document.getElementById('partnerZodiacTab');
        const compatibilityResult = document.getElementById('compatibilityResult');

        if (partnerZodiacSelect) {
            partnerZodiacSelect.value = '';
        }
        if (compatibilityResult) {
            compatibilityResult.style.display = 'none';
        }

        // 운세 데이터 로드
        loadDailyFortune(zodiacId);

        // 운세 섹션으로 스크롤
        fortuneDisplay.scrollIntoView({ behavior: 'smooth' });
    }
};

// 12간지 설명 모달 표시 함수
window.showZodiacModal = function(zodiacId) {
    console.log('showZodiacModal called with zodiacId:', zodiacId);

    const modal = document.getElementById('zodiacModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalTitle || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    const zodiacInfo = chineseZodiacDescriptions[zodiacId];
    if (zodiacInfo) {
        modalTitle.textContent = zodiacInfo.title;
        modalBody.innerHTML = zodiacInfo.description;
        modal.style.display = 'flex';
    } else {
        console.error('Zodiac description not found for ID:', zodiacId);
    }
};


// 생년으로 띠 찾기 함수
window.findChineseZodiac = function() {
    const yearInput = document.getElementById('birthYear');
    if (!yearInput || !yearInput.value) {
        showToastMessage('출생년도를 입력해주세요.');
        return;
    }

    const year = parseInt(yearInput.value);
    if (year < 1900 || year > 2025) {
        showToastMessage('올바른 출생년도를 입력해주세요. (1900-2025)');
        return;
    }

    const zodiacId = getChineseZodiacByYear(year);
    selectChineseZodiac(zodiacId);

    // 성공 메시지
    const zodiacInfo = chineseZodiacData[zodiacId];
    showToastMessage(`${year}년생은 ${zodiacInfo.name}입니다!`);
};

// 초기 화면 표시 함수
window.showIntroPage = function() {
    // 운세 디스플레이 숨기기
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    if (fortuneDisplay) {
        fortuneDisplay.style.display = 'none';
    }

    // 초기 화면 표시
    const introSection = document.getElementById('chineseZodiacIntro');
    if (introSection) {
        introSection.style.display = 'block';
    }

    // 네비게이션 활성화 해제
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // 궁합 입력 섹션 숨기기
    const compatSection = document.getElementById('compatSection');
    if (compatSection) {
        compatSection.style.display = 'none';
    }

    currentZodiacId = null;
};

// 탭 전환 함수
window.showTab = function(tabName) {
    // 모든 탭 패널 숨기기
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 선택된 탭 패널 표시
    const selectedPanel = document.getElementById(tabName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    // 선택된 탭 버튼 활성화
    event.target.classList.add('active');

    // 탭별 데이터 로드
    if (currentZodiacId) {
        switch(tabName) {
            case 'today':
                loadDailyFortune(currentZodiacId);
                break;
            case 'week':
                loadWeeklyFortune(currentZodiacId);
                break;
            case 'month':
                loadMonthlyFortune(currentZodiacId);
                break;
            case 'year':
                loadYearlyFortune(currentZodiacId);
                break;
            case 'compatibility':
                // 궁합 탭은 상대방 선택 후 로드
                break;
        }
    }
};

// 궁합 입력 토글 함수
window.toggleCompatibilityInput = function() {
    const compatSection = document.getElementById('compatSection');
    if (compatSection) {
        if (compatSection.style.display === 'none' || !compatSection.style.display) {
            compatSection.style.display = 'flex';
        } else {
            compatSection.style.display = 'none';
        }
    }
};

// 궁합 확인 함수
window.checkCompatibility = function() {
    const partnerSelect = document.getElementById('partnerZodiacTab');
    if (!partnerSelect || !partnerSelect.value) {
        showToastMessage('상대방의 띠를 선택해주세요.');
        return;
    }

    if (!currentZodiacId) {
        showToastMessage('먼저 내 띠를 선택해주세요.');
        return;
    }

    const partnerZodiacId = parseInt(partnerSelect.value);
    loadCompatibilityFortune(currentZodiacId, partnerZodiacId);
};

// 궁합 확인 함수 (상단 바에서)
window.checkZodiacCompatibility = function() {
    const partnerSelect = document.getElementById('partnerZodiac');
    if (!partnerSelect || !partnerSelect.value) {
        showToastMessage('상대방의 띠를 선택해주세요.');
        return;
    }

    if (!currentZodiacId) {
        showToastMessage('먼저 내 띠를 선택해주세요.');
        return;
    }

    const partnerZodiacId = parseInt(partnerSelect.value);

    // 궁합 탭으로 전환
    showTab('compatibility');

    // 탭 내 상대방 선택도 동기화
    const tabPartnerSelect = document.getElementById('partnerZodiacTab');
    if (tabPartnerSelect) {
        tabPartnerSelect.value = partnerZodiacId.toString();
    }

    loadCompatibilityFortune(currentZodiacId, partnerZodiacId);
};

// 네비게이션 토글 함수
window.toggleNav = function() {
    const nav = document.querySelector('.chinese-zodiac-nav');
    const navToggle = document.querySelector('.nav-toggle');

    if (nav && navToggle) {
        if (window.innerWidth <= 768) {
            nav.classList.toggle('mobile-open');
        } else {
            nav.classList.toggle('collapsed');
            navToggle.classList.toggle('collapsed');
        }
    }
};

// 마우스 오버 효과
window.showMagnifier = function(card, zodiacId) {
    const magnifier = card.querySelector('.magnifier-btn');
    if (magnifier) {
        magnifier.style.opacity = '1';
    }
};

window.hideMagnifier = function(card) {
    const magnifier = card.querySelector('.magnifier-btn');
    if (magnifier) {
        magnifier.style.opacity = '0';
    }
};

// 공유하기 함수
window.shareResult = function() {
    if (!currentZodiacId) {
        showToastMessage('먼저 띠를 선택해주세요.');
        return;
    }

    const zodiacInfo = chineseZodiacData[currentZodiacId];
    const shareText = `🐲 중국 12간지 띠별운세\n\n내 띠: ${zodiacInfo.name} ${zodiacInfo.hanja}\n${zodiacInfo.trait}\n\n지금 바로 확인해보세요!`;

    if (navigator.share) {
        navigator.share({
            title: '중국 12간지 띠별운세',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText + '\n' + window.location.href)
            .then(() => showToastMessage('링크가 클립보드에 복사되었습니다!'))
            .catch(() => showToastMessage('공유 기능을 지원하지 않는 브라우저입니다.'));
    }
};

// 토스트 메시지 표시 함수
window.showToastMessage = function(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        color: #ffd700;
        padding: 12px 20px;
        border-radius: 8px;
        border: 2px solid #fbbf24;
        font-weight: 600;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s forwards;
    `;

    // 애니메이션 정의
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    // 3초 후 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
};

// 운세 데이터 로드 함수들 (API 연동)
function loadDailyFortune(zodiacId) {
    if (!chineseZodiacAPI) {
        console.error('ChineseZodiacAPI가 로드되지 않았습니다.');
        return;
    }

    const dailyFortune = chineseZodiacAPI.getDailyFortune(zodiacId);
    if (dailyFortune) {
        const displayData = {
            overall: dailyFortune.overall,
            love: { score: dailyFortune.scores.love, text: dailyFortune.details.love },
            money: { score: dailyFortune.scores.money, text: dailyFortune.details.money },
            work: { score: dailyFortune.scores.work, text: dailyFortune.details.work },
            health: { score: dailyFortune.scores.health, text: dailyFortune.details.health },
            luckyColor: dailyFortune.lucky.color,
            luckyNumber: dailyFortune.lucky.number.toString(),
            luckyDirection: dailyFortune.lucky.direction,
            luckyTime: dailyFortune.lucky.time,
            advice: dailyFortune.advice
        };
        updateFortuneDisplay(displayData);
    } else {
        console.error('일간 운세 데이터를 불러올 수 없습니다.');
    }
}

function loadWeeklyFortune(zodiacId) {
    if (!chineseZodiacAPI) {
        console.error('ChineseZodiacAPI가 로드되지 않았습니다.');
        return;
    }

    const weeklyFortune = chineseZodiacAPI.getWeeklyFortune(zodiacId);
    if (weeklyFortune) {
        const weekData = Object.values(weeklyFortune)[0]; // 첫 번째 주간 데이터

        document.getElementById('weekPeriod').textContent = weekData.period;
        document.getElementById('weekTheme').textContent = weekData.theme;
        document.getElementById('weekKeyDays').textContent = weekData.keyDays;

        document.getElementById('weekOverall').innerHTML = window.protectKoreanParticles(weekData.overall);
        document.getElementById('weekLove').innerHTML = window.protectKoreanParticles(weekData.details.love);
        document.getElementById('weekMoney').innerHTML = window.protectKoreanParticles(weekData.details.money);
        document.getElementById('weekWork').innerHTML = window.protectKoreanParticles(weekData.details.work);
        document.getElementById('weekHealth').innerHTML = window.protectKoreanParticles(weekData.details.health);
    } else {
        console.error('주간 운세 데이터를 불러올 수 없습니다.');
    }
}

function loadMonthlyFortune(zodiacId) {
    if (!chineseZodiacAPI) {
        console.error('ChineseZodiacAPI가 로드되지 않았습니다.');
        return;
    }

    const monthlyFortune = chineseZodiacAPI.getMonthlyFortune(zodiacId);
    if (monthlyFortune) {
        const monthData = Object.values(monthlyFortune)[0]; // 첫 번째 월간 데이터

        document.getElementById('monthPeriod').textContent = monthData.period;
        document.getElementById('monthTheme').textContent = monthData.theme;
        document.getElementById('monthKeyDates').textContent = monthData.keyDates;

        document.getElementById('monthOverall').innerHTML = window.protectKoreanParticles(monthData.overall);
        document.getElementById('monthLove').innerHTML = window.protectKoreanParticles(monthData.details.love);
        document.getElementById('monthMoney').innerHTML = window.protectKoreanParticles(monthData.details.money);
        document.getElementById('monthWork').innerHTML = window.protectKoreanParticles(monthData.details.work);
        document.getElementById('monthHealth').innerHTML = window.protectKoreanParticles(monthData.details.health);
    } else {
        console.error('월간 운세 데이터를 불러올 수 없습니다.');
    }
}

function loadYearlyFortune(zodiacId) {
    if (!chineseZodiacAPI) {
        console.error('ChineseZodiacAPI가 로드되지 않았습니다.');
        return;
    }

    const yearlyFortune = chineseZodiacAPI.getYearlyFortune(zodiacId);
    if (yearlyFortune) {
        const yearData = Object.values(yearlyFortune)[0]; // 첫 번째 연간 데이터

        document.getElementById('yearPeriod').textContent = yearData.period;
        document.getElementById('yearTheme').textContent = yearData.theme;
        document.getElementById('yearBestMonths').textContent = yearData.bestMonths;
        document.getElementById('yearChallengingMonths').textContent = yearData.challengingMonths;

        document.getElementById('yearOverall').innerHTML = window.protectKoreanParticles(yearData.overall);
        document.getElementById('yearLove').innerHTML = window.protectKoreanParticles(yearData.details.love);
        document.getElementById('yearMoney').innerHTML = window.protectKoreanParticles(yearData.details.money);
        document.getElementById('yearWork').innerHTML = window.protectKoreanParticles(yearData.details.work);
        document.getElementById('yearHealth').innerHTML = window.protectKoreanParticles(yearData.details.health);
    } else {
        console.error('연간 운세 데이터를 불러올 수 없습니다.');
    }
}

function loadCompatibilityFortune(myZodiac, partnerZodiac) {
    if (!chineseZodiacAPI) {
        console.error('ChineseZodiacAPI가 로드되지 않았습니다.');
        return;
    }

    const compatibility = chineseZodiacAPI.getCompatibility(myZodiac, partnerZodiac);
    if (compatibility) {
        const resultDiv = document.getElementById('compatibilityResult');
        if (resultDiv) {
            resultDiv.style.display = 'block';

            document.getElementById('compatScore').textContent = compatibility.overall + '점';
            document.getElementById('compatLoveScore').textContent = compatibility.love + '점';
            document.getElementById('compatFriendScore').textContent = compatibility.friendship + '점';
            document.getElementById('compatWorkScore').textContent = compatibility.work + '점';

            document.getElementById('compatDescription').innerHTML = window.protectKoreanParticles(compatibility.description);
            document.getElementById('compatAdvice').innerHTML = window.protectKoreanParticles(compatibility.advice);
        }
    } else {
        console.error('궁합 데이터를 불러올 수 없습니다.');
    }
}

function updateFortuneDisplay(data) {
    // 전체 운세
    document.getElementById('todayOverall').innerHTML = window.protectKoreanParticles(data.overall);

    // 각 운세 점수와 텍스트 업데이트
    ['love', 'money', 'work', 'health'].forEach(category => {
        const scoreElement = document.getElementById(category + 'Score');
        const textElement = document.getElementById(category + 'Fortune');
        const progressElement = document.getElementById(category + 'Progress');

        if (scoreElement && data[category]) {
            scoreElement.textContent = data[category].score + '점';
        }

        if (textElement && data[category]) {
            textElement.innerHTML = window.protectKoreanParticles(data[category].text);
        }

        if (progressElement && data[category]) {
            progressElement.style.width = data[category].score + '%';
        }
    });

    // 행운 아이템들
    if (data.luckyColor) {
        document.getElementById('luckyColor').style.backgroundColor = data.luckyColor;
    }
    if (data.luckyNumber) {
        document.getElementById('luckyNumber').textContent = data.luckyNumber;
    }
    if (data.luckyDirection) {
        document.getElementById('luckyDirection').textContent = data.luckyDirection;
    }
    if (data.luckyTime) {
        document.getElementById('luckyTime').textContent = data.luckyTime;
    }
    if (data.advice) {
        document.getElementById('todayAdvice').innerHTML = window.protectKoreanParticles(data.advice);
    }
}

function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 현재 날짜 표시
    const today = new Date();
    const dateString = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const headerDate = document.getElementById('headerDate');
    if (headerDate) {
        headerDate.textContent = dateString;
    }

    console.log('중국 12간지 시스템이 로드되었습니다.');

    // 반응형 네비게이션 설정
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.chinese-zodiac-nav');
        if (nav) {
            nav.classList.add('collapsed');
        }
    }
});