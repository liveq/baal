// 띠 정보 데이터
const zodiac_data = {
    rat: { 
        name: '쥐띠', 
        icon: '🐭', 
        years: [1996, 1984, 1972, 1960, 1948],
        traits: ['지혜롭고', '민첩하며', '경제적 관념이 뛰어난']
    },
    ox: { 
        name: '소띠', 
        icon: '🐮', 
        years: [1997, 1985, 1973, 1961, 1949],
        traits: ['성실하고', '인내심이 강하며', '책임감이 있는']
    },
    tiger: { 
        name: '호랑이띠', 
        icon: '🐯', 
        years: [1998, 1986, 1974, 1962, 1950],
        traits: ['용감하고', '리더십이 있으며', '정의로운']
    },
    rabbit: { 
        name: '토끼띠', 
        icon: '🐰', 
        years: [1999, 1987, 1975, 1963, 1951],
        traits: ['온순하고', '예술적 감각이 있으며', '사교적인']
    },
    dragon: { 
        name: '용띠', 
        icon: '🐲', 
        years: [2000, 1988, 1976, 1964, 1952],
        traits: ['카리스마 있고', '야망이 크며', '행운이 따르는']
    },
    snake: { 
        name: '뱀띠', 
        icon: '🐍', 
        years: [2001, 1989, 1977, 1965, 1953],
        traits: ['지적이고', '직관력이 뛰어나며', '신중한']
    },
    horse: { 
        name: '말띠', 
        icon: '🐴', 
        years: [2002, 1990, 1978, 1966, 1954],
        traits: ['자유분방하고', '열정적이며', '독립적인']
    },
    sheep: { 
        name: '양띠', 
        icon: '🐑', 
        years: [2003, 1991, 1979, 1967, 1955],
        traits: ['예술적이고', '평화를 사랑하며', '창의적인']
    },
    monkey: { 
        name: '원숭이띠', 
        icon: '🐵', 
        years: [2004, 1992, 1980, 1968, 1956],
        traits: ['재치있고', '호기심이 많으며', '다재다능한']
    },
    rooster: { 
        name: '닭띠', 
        icon: '🐔', 
        years: [2005, 1993, 1981, 1969, 1957],
        traits: ['정확하고', '완벽주의적이며', '자신감 있는']
    },
    dog: { 
        name: '개띠', 
        icon: '🐶', 
        years: [2006, 1994, 1982, 1970, 1958],
        traits: ['충직하고', '정직하며', '의리가 있는']
    },
    pig: { 
        name: '돼지띠', 
        icon: '🐷', 
        years: [2007, 1995, 1983, 1971, 1959],
        traits: ['관대하고', '정이 많으며', '복이 많은']
    }
};

// 운세 템플릿
const fortune_templates = {
    daily: {
        intro: "오늘 {zodiac} {gender}분께는 {keyword}의 기운이 강하게 나타납니다.",
        detail: "{area}에서 {positive}한 변화가 예상되며, {advice}하시는 것이 좋겠습니다.",
        lucky: "행운의 숫자: {number}, 행운의 색: {color}"
    },
    weekly: {
        intro: "이번 주 {zodiac} {gender}분의 전체적인 운세는 {level} 수준입니다.",
        detail: "주 초반에는 {early}하지만, 주 후반으로 갈수록 {late}해질 것입니다.",
        advice: "특히 {day}요일에는 {caution}하시기 바랍니다."
    },
    monthly: {
        intro: "이번 달 {zodiac} {gender}분께는 {theme}가 중요한 시기입니다.",
        career: "직장/사업운: {career_fortune}",
        love: "애정운: {love_fortune}",
        health: "건강운: {health_fortune}",
        money: "재물운: {money_fortune}"
    },
    yearly: {
        intro: "2025년 을사년, {zodiac} {gender}분께는 {yearly_theme}의 해가 될 것입니다.",
        overall: "{season}에는 {seasonal_fortune}하며, 전반적으로 {overall_trend} 경향을 보입니다.",
        important: "올해 가장 중요한 것은 {key_point}입니다."
    },
    lifetime: {
        intro: "{zodiac}는 천성적으로 {traits}한 성격을 지니고 있습니다.",
        youth: "젊은 시절: {youth_fortune}",
        middle: "중년기: {middle_fortune}",
        senior: "노년기: {senior_fortune}",
        overall: "평생 운세: {lifetime_summary}"
    }
};

// 현재 상태 관리
let current_zodiac = null;
let current_period = 'daily';
let current_gender = 'male';

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 사이드바 띠 버튼 이벤트
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const zodiac = this.dataset.zodiac;
            showZodiacDetail(zodiac);
        });
    });
    
    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            current_period = this.dataset.period;
            updateFortuneContent();
        });
    });
    
    // 성별 버튼 이벤트
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            current_gender = this.dataset.gender;
            updateFortuneContent();
        });
    });
    
    // Tab 키 네비게이션
    setupTabNavigation();
    
    // 생년월일 입력 자동 포커스 이동
    setupAutoFocus();
    
    // 궁합 폼 성별 선택
    setupCompatibilityGender();
});

// Tab 키 네비게이션 설정
function setupTabNavigation() {
    const inputs = ['year', 'month', 'day'];
    inputs.forEach((id, index) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Tab' && !e.shiftKey && index < inputs.length - 1) {
                    e.preventDefault();
                    document.getElementById(inputs[index + 1]).focus();
                }
            });
            
            // 자동 이동 (년도 4자리, 월/일 2자리 입력시)
            input.addEventListener('input', function() {
                const maxLength = id === 'year' ? 4 : 2;
                if (this.value.length === maxLength && index < inputs.length - 1) {
                    document.getElementById(inputs[index + 1]).focus();
                }
            });
        }
    });
}

// 자동 포커스 설정
function setupAutoFocus() {
    // 메인 생년월일 입력
    ['my-year', 'my-month', 'my-day', 'partner-year', 'partner-month', 'partner-day'].forEach((id, index, arr) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const maxLength = id.includes('year') ? 4 : 2;
                if (this.value.length === maxLength && index < arr.length - 1) {
                    document.getElementById(arr[index + 1]).focus();
                }
                
                // 띠 자동 계산 및 표시
                if (id.includes('year') && this.value.length === 4) {
                    const zodiac = getZodiacByYear(parseInt(this.value));
                    const displayId = id.includes('my') ? 'my-zodiac-display' : 'partner-zodiac-display';
                    const display = document.getElementById(displayId);
                    if (display && zodiac) {
                        display.textContent = zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name;
                    }
                }
            });
        }
    });
}

// 궁합 성별 선택 설정
function setupCompatibilityGender() {
    document.querySelectorAll('.gender-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.gender-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 년도로 띠 계산
function getZodiacByYear(year) {
    const zodiac_order = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep'];
    return zodiac_order[year % 12];
}

// 메인 페이지 표시
function showMainPage() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('main-page').classList.add('active');
    
    // 사이드바 버튼 활성화 해제
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 스크롤 최상단
    window.scrollTo(0, 0);
}

// 띠별 상세 페이지 표시
function showZodiacDetail(zodiac) {
    current_zodiac = zodiac;
    
    // 페이지 전환
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('detail-page').classList.add('active');
    
    // 사이드바 활성화
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.zodiac-btn[data-zodiac="${zodiac}"]`).classList.add('active');
    
    // 제목 업데이트
    document.getElementById('zodiac-title').textContent = 
        zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name + ' 운세';
    
    // 운세 내용 업데이트
    updateFortuneContent();
    
    // 스크롤 최상단
    window.scrollTo(0, 0);
}

// 운세 내용 업데이트
function updateFortuneContent() {
    if (!current_zodiac) return;
    
    const content = generateFortuneContent(current_zodiac, current_period, current_gender);
    document.getElementById('fortune-content').innerHTML = content;
}

// 운세 내용 생성
function generateFortuneContent(zodiac, period, gender) {
    const zodiac_info = zodiac_data[zodiac];
    const gender_text = gender === 'male' ? '남성' : '여성';
    
    let content = '<div class="fortune-text">';
    
    switch(period) {
        case 'daily':
            content += `
                <h3>📅 ${new Date().toLocaleDateString('ko-KR')} 오늘의 운세</h3>
                <p class="intro">오늘 ${zodiac_info.name} ${gender_text}분께는 새로운 기회의 문이 열리는 날입니다.</p>
                
                <div class="fortune-detail">
                    <h4>종합운</h4>
                    <p>오전에는 다소 피곤함을 느낄 수 있으나, 오후부터는 활력이 넘치게 됩니다. 
                    ${gender === 'male' ? '직장에서의 성과' : '대인관계에서의 조화'}가 기대되는 날입니다.</p>
                    
                    <h4>재물운</h4>
                    <p>예상치 못한 수입이 있을 수 있습니다. 그러나 충동적인 소비는 자제하시기 바랍니다.</p>
                    
                    <h4>애정운</h4>
                    <p>${gender === 'male' ? '적극적인 표현이 좋은 결과를 가져올' : '상대방의 마음을 이해하려는 노력이 필요한'} 시기입니다.</p>
                    
                    <h4>건강운</h4>
                    <p>무리하지 않는 선에서 가벼운 운동을 하시면 좋겠습니다.</p>
                </div>
                
                <div class="lucky-items">
                    <p>🔢 행운의 숫자: ${Math.floor(Math.random() * 45) + 1}</p>
                    <p>🎨 행운의 색: ${['빨강', '파랑', '노랑', '초록', '보라'][Math.floor(Math.random() * 5)]}</p>
                    <p>🧭 행운의 방향: ${['동', '서', '남', '북'][Math.floor(Math.random() * 4)]}</p>
                </div>
            `;
            break;
            
        case 'weekly':
            content += `
                <h3>📅 이번 주 운세 (${getWeekPeriod()})</h3>
                <p class="intro">${zodiac_info.name} ${gender_text}분의 이번 주는 도전과 기회가 공존하는 시기입니다.</p>
                
                <div class="fortune-detail">
                    <h4>주간 흐름</h4>
                    <p>월요일과 화요일은 준비의 시간으로, 수요일부터 본격적인 활동이 시작됩니다.
                    주말에는 ${gender === 'male' ? '가족과의 시간' : '자기 계발'}에 집중하시면 좋겠습니다.</p>
                    
                    <h4>주의할 날</h4>
                    <p>목요일에는 중요한 결정을 미루는 것이 좋습니다. 감정적인 판단보다는 이성적인 접근이 필요합니다.</p>
                    
                    <h4>행운의 날</h4>
                    <p>금요일이 가장 운이 좋은 날입니다. 새로운 시도를 해보시기 바랍니다.</p>
                </div>
            `;
            break;
            
        case 'monthly':
            content += `
                <h3>📅 ${new Date().getMonth() + 1}월 운세</h3>
                <p class="intro">이번 달 ${zodiac_info.name} ${gender_text}분께는 성장과 발전의 기회가 찾아옵니다.</p>
                
                <div class="fortune-detail">
                    <h4>전체운</h4>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${70 + Math.random() * 20}%"></div>
                    </div>
                    
                    <h4>직장/사업운</h4>
                    <p>${gender === 'male' ? '승진이나 연봉 인상' : '새로운 프로젝트 참여'}의 기회가 있을 수 있습니다.
                    상사나 동료와의 관계를 원만하게 유지하시기 바랍니다.</p>
                    
                    <h4>금전운</h4>
                    <p>수입은 안정적이나, 예상치 못한 지출이 있을 수 있으니 미리 대비하시기 바랍니다.</p>
                    
                    <h4>애정운</h4>
                    <p>${gender === 'male' ? '솔직한 대화가 관계 개선의 열쇠' : '상대방을 배려하는 마음이 중요한'} 시기입니다.</p>
                    
                    <h4>건강운</h4>
                    <p>규칙적인 생활 습관을 유지하시고, 충분한 수면을 취하시기 바랍니다.</p>
                </div>
            `;
            break;
            
        case 'yearly':
            content += `
                <h3>🐍 2025년 을사년 운세</h3>
                <p class="intro">${zodiac_info.name} ${gender_text}분께 2025년은 '${['도약', '안정', '변화', '성취'][Math.floor(Math.random() * 4)]}'의 해가 될 것입니다.</p>
                
                <div class="fortune-detail">
                    <h4>연간 총운</h4>
                    <p>올해는 ${zodiac_info.traits[0]} 본연의 성격이 빛을 발하는 한 해가 될 것입니다.
                    ${gender === 'male' ? '사업과 직장에서 큰 성과' : '가정과 대인관계에서의 조화'}가 기대됩니다.</p>
                    
                    <h4>상반기 (1월~6월)</h4>
                    <p>준비와 계획의 시기입니다. 서두르지 말고 차근차근 기초를 다지시기 바랍니다.</p>
                    
                    <h4>하반기 (7월~12월)</h4>
                    <p>상반기에 준비한 것들이 결실을 맺는 시기입니다. 적극적으로 행동하시기 바랍니다.</p>
                    
                    <h4>올해의 조언</h4>
                    <p>"겸손은 최고의 미덕이다" - 자만하지 말고 늘 배우는 자세를 유지하시기 바랍니다.</p>
                </div>
            `;
            break;
            
        case 'lifetime':
            content += `
                <h3>🌟 평생 운세</h3>
                <p class="intro">${zodiac_info.name}는 ${zodiac_info.traits.join(', ')} 특성을 지닌 운명입니다.</p>
                
                <div class="fortune-detail">
                    <h4>성격과 기질</h4>
                    <p>${zodiac_info.name} ${gender_text}분은 타고난 ${zodiac_info.traits[0]} 성격으로 
                    주변 사람들에게 ${['신뢰', '존경', '사랑'][Math.floor(Math.random() * 3)]}를 받습니다.</p>
                    
                    <h4>청년기 (20~35세)</h4>
                    <p>열정과 도전의 시기입니다. 많은 시행착오를 겪겠지만, 그것이 모두 소중한 경험이 될 것입니다.</p>
                    
                    <h4>중년기 (36~55세)</h4>
                    <p>안정과 성취의 시기입니다. ${gender === 'male' ? '사회적 지위' : '가정의 행복'}가 절정에 달합니다.</p>
                    
                    <h4>노년기 (56세 이후)</h4>
                    <p>지혜와 여유의 시기입니다. 후대에게 좋은 본보기가 되며, 존경받는 어른이 됩니다.</p>
                    
                    <h4>인생의 전환점</h4>
                    <p>${[32, 38, 45, 51][Math.floor(Math.random() * 4)]}세 경에 인생의 큰 전환점이 찾아올 것입니다.</p>
                </div>
            `;
            break;
    }
    
    content += '</div>';
    return content;
}

// 주간 기간 텍스트 생성
function getWeekPeriod() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return `${monday.getMonth() + 1}/${monday.getDate()} ~ ${sunday.getMonth() + 1}/${sunday.getDate()}`;
}

// 다른 띠로 변경
function changeZodiac(zodiac) {
    if (zodiac) {
        showZodiacDetail(zodiac);
        document.getElementById('zodiac-selector').value = '';
    }
}

// 생년월일로 검색
function searchByBirth() {
    const year = document.getElementById('year').value;
    if (year && year.length === 4) {
        const zodiac = getZodiacByYear(parseInt(year));
        showZodiacDetail(zodiac);
    } else {
        alert('올바른 년도를 입력해주세요.');
    }
}

// 평생운세 모달 표시
function showLifetimeFortune(zodiac) {
    const modal = document.getElementById('lifetime-modal');
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('lifetime-title');
    const content = document.getElementById('lifetime-content');
    
    title.textContent = zodiac_data[zodiac].icon + ' ' + zodiac_data[zodiac].name + ' 평생 운세';
    content.innerHTML = generateFortuneContent(zodiac, 'lifetime', 'male');
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

// 궁합 모달 표시
function showCompatibilityModal() {
    const modal = document.getElementById('compatibility-modal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

// 특정 띠의 궁합 보기
function showCompatibilityForZodiac() {
    if (!current_zodiac) return;
    
    // 내 정보 자동 설정
    const zodiac_info = zodiac_data[current_zodiac];
    const year = zodiac_info.years[1]; // 대표 년도 선택
    
    document.getElementById('my-year').value = year;
    document.getElementById('my-zodiac-display').textContent = 
        zodiac_info.icon + ' ' + zodiac_info.name;
    
    showCompatibilityModal();
}

// 궁합 확인
function checkCompatibility() {
    const myYear = document.getElementById('my-year').value;
    const partnerYear = document.getElementById('partner-year').value;
    
    if (!myYear || !partnerYear) {
        alert('생년월일을 모두 입력해주세요.');
        return;
    }
    
    const myZodiac = getZodiacByYear(parseInt(myYear));
    const partnerZodiac = getZodiacByYear(parseInt(partnerYear));
    
    const myGender = document.querySelector('.person-input:first-child .gender-option.active').dataset.gender;
    const partnerGender = document.querySelector('.person-input:last-child .gender-option.active').dataset.gender;
    const relationshipType = document.getElementById('relationship-type').value;
    
    // 궁합 결과 생성
    const result = generateCompatibilityResult(
        myZodiac, partnerZodiac, 
        myGender, partnerGender, 
        relationshipType
    );
    
    // 결과 모달 표시
    document.getElementById('compatibility-result').innerHTML = result;
    document.getElementById('result-modal').classList.add('active');
    
    // 입력 모달 닫기
    closeModal('compatibility-modal');
}

// 궁합 결과 생성
function generateCompatibilityResult(zodiac1, zodiac2, gender1, gender2, relationship) {
    const info1 = zodiac_data[zodiac1];
    const info2 = zodiac_data[zodiac2];
    const gender1_text = gender1 === 'male' ? '남성' : '여성';
    const gender2_text = gender2 === 'male' ? '남성' : '여성';
    
    // 궁합 점수 계산 (간단한 로직)
    const score = calculateCompatibilityScore(zodiac1, zodiac2);
    const level = score >= 80 ? '최상' : score >= 60 ? '좋음' : score >= 40 ? '보통' : '노력 필요';
    
    let result = `
        <div class="compatibility-result">
            <div class="result-header">
                <div class="person">${info1.icon} ${info1.name} ${gender1_text}</div>
                <div class="vs">💕</div>
                <div class="person">${info2.icon} ${info2.name} ${gender2_text}</div>
            </div>
            
            <div class="score-section">
                <h3>궁합 점수</h3>
                <div class="score-circle">
                    <span class="score">${score}</span>
                    <span class="max">/100</span>
                </div>
                <p class="level">${level}</p>
            </div>
            
            <div class="analysis">
                <h3>${relationship === 'lover' ? '연인' : 
                     relationship === 'spouse' ? '부부' : 
                     relationship === 'friend' ? '친구' : 
                     relationship === 'business' ? '사업 파트너' : '부모-자녀'} 궁합 분석</h3>
                
                <div class="compatibility-detail">
                    <h4>👍 장점</h4>
                    <p>${info1.name}의 ${info1.traits[0]} 성격과 ${info2.name}의 ${info2.traits[0]} 성격이 
                    서로 ${score >= 60 ? '조화를 이루어' : '보완하여'} 좋은 관계를 만들 수 있습니다.</p>
                    
                    <h4>⚠️ 주의점</h4>
                    <p>${info1.name}는 때로 ${['고집스러울', '감정적일', '충동적일'][Math.floor(Math.random() * 3)]} 수 있고,
                    ${info2.name}는 ${['예민할', '소극적일', '완고할'][Math.floor(Math.random() * 3)]} 수 있으니 
                    서로를 이해하려는 노력이 필요합니다.</p>
                    
                    <h4>💡 조언</h4>
                    <p>${relationship === 'lover' || relationship === 'spouse' ? 
                        '서로의 다름을 인정하고 존중하는 것이 행복한 관계의 비결입니다.' :
                        '상호 신뢰를 바탕으로 서로의 장점을 살려나가시기 바랍니다.'}</p>
                </div>
            </div>
        </div>
    `;
    
    return result;
}

// 궁합 점수 계산
function calculateCompatibilityScore(zodiac1, zodiac2) {
    // 간단한 궁합 매트릭스 (실제로는 더 복잡한 로직 필요)
    const compatibility_matrix = {
        'rat': { rat: 85, ox: 90, tiger: 60, rabbit: 70, dragon: 95, snake: 80, horse: 40, sheep: 60, monkey: 90, rooster: 70, dog: 75, pig: 85 },
        'ox': { rat: 90, ox: 80, tiger: 50, rabbit: 75, dragon: 70, snake: 90, horse: 45, sheep: 55, monkey: 65, rooster: 90, dog: 70, pig: 80 },
        'tiger': { rat: 60, ox: 50, tiger: 75, rabbit: 65, dragon: 85, snake: 55, horse: 90, sheep: 70, monkey: 45, rooster: 60, dog: 95, pig: 75 },
        // ... 나머지 띠들도 추가 필요
    };
    
    // 매트릭스에 없으면 랜덤 점수
    if (compatibility_matrix[zodiac1] && compatibility_matrix[zodiac1][zodiac2]) {
        return compatibility_matrix[zodiac1][zodiac2];
    }
    
    // 기본 점수 계산
    return 50 + Math.floor(Math.random() * 40);
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// 오버레이 클릭시 모달 닫기
document.getElementById('overlay').addEventListener('click', function() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    this.classList.remove('active');
});