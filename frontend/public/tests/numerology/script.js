// 수비학 테스트 시스템
class NumerologyTest {
    constructor() {
        this.currentSection = 'home-screen';
        this.userBirthdate = null;
        this.lifePathNumber = null;
        this.initializeEventListeners();
    }

    // 이벤트 리스너 초기화
    initializeEventListeners() {
        // 테스트 시작 버튼들
        document.querySelectorAll('.test-start-btn, .header-test-btn, .detail-test-btn, .intro-test').forEach(btn => {
            btn.addEventListener('click', () => this.showBirthModal());
        });

        // 숫자 버튼들 (사이드바 + 카드)
        document.querySelectorAll('.num-btn, .card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = e.currentTarget.dataset.number;
                if (number === 'home') {
                    this.showSection('home-screen');
                    this.updateActiveButton(null);
                } else if (number === 'compatibility') {
                    this.showSection('compatibility-screen');
                    this.updateActiveButton('compatibility');
                } else if (number) {
                    this.showNumberDetail(number);
                    this.updateActiveButton(number);
                }
            });
        });

        // 홈으로 돌아가기 버튼들
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showSection('home-screen');
                this.updateActiveButton(null);
            });
        });

        // 계산하기 버튼
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateLifePath());
        }

        // 모달 배경 클릭 (모달 외부 영역)
        const birthModal = document.getElementById('birth-modal');
        if (birthModal) {
            birthModal.addEventListener('click', (e) => {
                if (e.target === birthModal) {
                    this.closeBirthModal();
                }
            });
        }

        // 모달 닫기 버튼
        const modalCloseBtn = document.querySelector('.modal-close-btn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeBirthModal());
        }

        // 사이드바 토글 (모바일)
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }

        // 궁합 화면 이벤트
        const myBirthdate = document.getElementById('my-birthdate');
        const partnerBirthdate = document.getElementById('partner-birthdate');
        const compatibilityBtn = document.querySelector('.calculate-compatibility-btn');

        if (myBirthdate) {
            myBirthdate.addEventListener('input', () => {
                const number = this.calculateLifePathFromDate(myBirthdate.value);
                const display = document.getElementById('my-number-display');
                if (number) {
                    display.textContent = `생명경로수: ${number}`;
                    display.style.color = 'var(--accent-gold)';
                } else if (myBirthdate.value.length > 0) {
                    display.textContent = '올바른 형식으로 입력해주세요';
                    display.style.color = 'var(--text-light)';
                    display.style.fontSize = '0.9rem';
                } else {
                    display.textContent = '';
                }
            });
        }

        if (partnerBirthdate) {
            partnerBirthdate.addEventListener('input', () => {
                const number = this.calculateLifePathFromDate(partnerBirthdate.value);
                const display = document.getElementById('partner-number-display');
                if (number) {
                    display.textContent = `생명경로수: ${number}`;
                    display.style.color = 'var(--accent-gold)';
                } else if (partnerBirthdate.value.length > 0) {
                    display.textContent = '올바른 형식으로 입력해주세요';
                    display.style.color = 'var(--text-light)';
                    display.style.fontSize = '0.9rem';
                } else {
                    display.textContent = '';
                }
            });
        }

        if (compatibilityBtn) {
            compatibilityBtn.addEventListener('click', () => this.calculateCompatibility());
        }
    }

    // 생년월일 입력 모달 표시
    showBirthModal() {
        document.getElementById('birth-modal').classList.add('active');
        document.getElementById('overlay').classList.add('active');

        // 오늘 날짜를 최대값으로 설정
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('birthdate').max = today;
    }

    // 모달 닫기
    closeBirthModal() {
        document.getElementById('birth-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    }

    // 생명경로수 계산 (Life Path Number)
    calculateLifePath() {
        const birthdateInput = document.getElementById('birthdate');
        const birthdate = birthdateInput.value;

        if (!birthdate) {
            alert('생년월일을 입력해주세요.');
            return;
        }

        // 날짜 형식 정규화
        const normalized = this.normalizeDateFormat(birthdate);
        if (!normalized) {
            alert('올바른 형식으로 입력해주세요.\n예: 1987-07-03 또는 19870703');
            return;
        }

        this.userBirthdate = normalized;
        const [year, month, day] = normalized.split('-').map(Number);

        // 생명경로수 계산 로직
        // 월, 일, 연도를 각각 한자리로 줄인 후 합산
        const reducedMonth = this.reduceToSingleDigit(month);
        const reducedDay = this.reduceToSingleDigit(day);
        const reducedYear = this.reduceToSingleDigit(year);

        // 합산 후 최종 계산
        let sum = reducedMonth + reducedDay + reducedYear;

        // 마스터 넘버 체크 (11, 22, 33)
        if (sum === 11 || sum === 22 || sum === 33) {
            this.lifePathNumber = sum;
        } else {
            this.lifePathNumber = this.reduceToSingleDigit(sum);
        }

        this.closeBirthModal();
        this.showResult();
    }

    // 숫자를 한자리로 축약 (마스터 넘버 보존)
    reduceToSingleDigit(num) {
        while (num > 9) {
            // 중간에 마스터 넘버가 나오면 보존
            if (num === 11 || num === 22 || num === 33) {
                return num;
            }
            // 각 자릿수 합산
            num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }
        return num;
    }

    // 결과 화면 표시
    showResult() {
        const numberData = this.getNumberData(this.lifePathNumber);
        const resultContent = document.querySelector('.result-content');

        resultContent.innerHTML = `
            <div class="result-header">
                <h1>당신의 생명경로수</h1>
                <div class="result-number">${numberData.emoji} ${this.lifePathNumber}</div>
                <div class="result-nickname">${numberData.nickname}</div>
                <p class="result-description">${numberData.oneline}</p>
            </div>

            <div class="result-section">
                <h3>💫 핵심 특성</h3>
                <p>${numberData.description}</p>
            </div>

            <div class="result-section">
                <h3>✨ 강점</h3>
                ${numberData.strengths.map(s => `<p>• ${s}</p>`).join('')}
            </div>

            <div class="result-section">
                <h3>⚠️ 약점 & 성장 과제</h3>
                ${numberData.weaknesses.map(w => `<p>• ${w}</p>`).join('')}
            </div>

            <div class="result-section">
                <h3>💼 적합한 직업</h3>
                <p>${numberData.careers.join(', ')}</p>
            </div>

            <div class="result-section">
                <h3>❤️ 연애 & 인간관계</h3>
                <p>${numberData.relationships}</p>
            </div>

            <div class="result-section">
                <h3>🎯 인생의 목적</h3>
                <p>${numberData.lifePurpose}</p>
            </div>

            <div class="result-section">
                <h3>🔑 핵심 키워드</h3>
                <p>${numberData.keywords.join(' · ')}</p>
            </div>
        `;

        this.showSection('result-screen');
        document.querySelector('.main-content').scrollTo({top: 0, behavior: 'smooth'});
    }

    // 숫자별 상세 페이지 표시
    showNumberDetail(number) {
        const numberData = this.getNumberData(parseInt(number));
        const detailContent = document.querySelector('.number-detail-content');

        // 전체 숫자 목록
        const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

        detailContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="margin: 0;">${numberData.emoji} ${number}번 - ${numberData.nickname}</h2>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.9rem; color: var(--text-light);">💕 궁합 보기</span>
                    <select id="compatibility-select" style="padding: 8px 12px; font-size: 0.9rem; border-radius: 6px; border: 1px solid #D4AF37; background: white; color: #333; cursor: pointer; min-width: 150px;">
                        <option value="">선택</option>
                        ${allNumbers.map(num => {
                            const numData = this.getNumberData(num);
                            return `<option value="${num}">${numData.emoji} ${num}번</option>`;
                        }).join('')}
                    </select>
                </div>
            </div>
            <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 2rem;">
                ${numberData.oneline}
            </p>

            <h3>💫 핵심 특성</h3>
            <p>${numberData.description}</p>

            <h3>✨ 강점</h3>
            <div class="traits-list">
                ${numberData.strengths.map(s => `
                    <div class="trait-item">
                        <strong>✓</strong>
                        <span>${s}</span>
                    </div>
                `).join('')}
            </div>

            <h3>⚠️ 약점 & 성장 과제</h3>
            <div class="traits-list">
                ${numberData.weaknesses.map(w => `
                    <div class="trait-item">
                        <strong>!</strong>
                        <span>${w}</span>
                    </div>
                `).join('')}
            </div>

            <h3>💼 적합한 직업</h3>
            <p>${numberData.careers.join(', ')}</p>

            <h3>❤️ 연애 & 인간관계</h3>
            <p>${numberData.relationships}</p>

            <h3>🎯 인생의 목적</h3>
            <p>${numberData.lifePurpose}</p>

            <h3>🔑 핵심 키워드</h3>
            <div class="keywords-list">
                ${numberData.keywords.map(k => `
                    <div class="trait-item">
                        <span>${k}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // 궁합 보기 드롭다운 이벤트 리스너 추가
        const compatibilitySelect = document.getElementById('compatibility-select');
        if (compatibilitySelect) {
            compatibilitySelect.addEventListener('change', (e) => {
                const selectedNumber = parseInt(e.target.value);
                if (selectedNumber) {
                    // 궁합 결과 표시 및 궁합 화면으로 전환
                    this.showCompatibilityResult(parseInt(number), selectedNumber);
                    this.showSection('compatibility-screen');
                    document.querySelector('.main-content').scrollTo({top: 0, behavior: 'smooth'});
                }
            });
        }

        this.showSection('number-detail');
        document.querySelector('.main-content').scrollTo({top: 0, behavior: 'smooth'});
    }

    // 섹션 전환
    showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        this.currentSection = sectionId;
    }

    // 활성 버튼 업데이트
    updateActiveButton(number) {
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (number) {
            const activeBtn = document.querySelector(`.num-btn[data-number="${number}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
    }

    // 숫자별 데이터 반환
    getNumberData(number) {
        const data = {
            1: {
                emoji: '1️⃣',
                nickname: '리더',
                oneline: '독립적이고 창의적인 개척자',
                description: '1번 생명경로수를 가진 당신은 타고난 리더입니다. 독립심이 강하고 자신만의 길을 개척하는 능력이 뛰어납니다. 새로운 것을 시작하는 것을 두려워하지 않으며, 자신의 신념을 관철시키는 강한 의지를 가지고 있습니다. 당신은 다른 사람들이 따라오기를 기다리기보다는 먼저 나서서 길을 만들어가는 사람입니다. 창의적이고 혁신적인 아이디어로 세상에 변화를 만들어내는 것이 당신의 본능입니다.',
                strengths: [
                    '강한 리더십과 결단력으로 팀을 이끄는 능력',
                    '독창적인 아이디어와 창의적 사고방식',
                    '목표 달성을 위한 불굴의 의지와 추진력',
                    '독립적으로 문제를 해결하는 자립심',
                    '새로운 프로젝트를 시작하는 용기와 개척정신'
                ],
                weaknesses: [
                    '고집이 세서 다른 의견을 받아들이기 어려울 수 있음',
                    '독단적인 결정으로 주변 사람들과 갈등이 생길 수 있음',
                    '경쟁심이 지나쳐 협력이 필요한 상황에서 어려움',
                    '자존심이 강해 타인의 도움을 받기 꺼려함',
                    '완벽주의 성향으로 인한 스트레스와 번아웃'
                ],
                careers: ['CEO, 기업가, 정치인, 프로젝트 매니저, 독립 컨설턴트, 발명가, 건축가, 디자이너, 작가, 사업가'],
                relationships: '연애에서도 주도권을 잡는 경향이 있으며, 독립적이고 자신감 있는 파트너를 선호합니다. 상대방을 존중하고 균형잡힌 관계를 유지하려는 노력이 필요합니다. 때로는 파트너의 의견에 귀 기울이고 함께 결정을 내리는 연습이 관계를 더욱 단단하게 만듭니다.',
                lifePurpose: '당신의 인생 목적은 새로운 길을 개척하고 다른 사람들에게 영감을 주는 것입니다. 독창적인 아이디어로 세상에 긍정적인 변화를 만들어내고, 리더십을 발휘하여 사람들을 이끌어가는 것이 당신의 사명입니다.',
                keywords: ['리더십', '독립', '창의성', '개척자', '용기', '혁신', '자신감', '결단력']
            },
            2: {
                emoji: '2️⃣',
                nickname: '중재자',
                oneline: '조화롭고 섬세한 평화주의자',
                description: '2번 생명경로수를 가진 당신은 타고난 중재자이자 협력자입니다. 사람들 사이의 조화와 균형을 중시하며, 섬세한 감수성으로 타인의 감정을 깊이 이해합니다. 당신은 갈등을 해결하고 평화를 만들어내는 특별한 재능을 가지고 있습니다. 협력과 파트너십을 통해 더 큰 것을 이루어내는 능력이 뛰어나며, 주변 사람들에게 따뜻한 지지와 격려를 아끼지 않습니다. 직관적이고 공감능력이 뛰어나 사람들이 당신을 찾아와 마음을 터놓습니다.',
                strengths: [
                    '뛰어난 공감능력과 타인의 감정을 읽는 직관',
                    '갈등 상황에서 중재하고 조화를 만드는 능력',
                    '협력과 팀워크를 통해 목표를 달성하는 재능',
                    '섬세하고 배려심 깊은 성격',
                    '인내심이 강하고 끈기있게 관계를 유지함'
                ],
                weaknesses: [
                    '타인의 의견에 쉽게 휘둘려 자신의 의견을 잃을 수 있음',
                    '갈등을 피하려다 자신의 감정을 억누르는 경향',
                    '과도한 민감함으로 인한 상처와 스트레스',
                    '우유부단하여 결정을 내리기 어려워함',
                    '자신보다 타인을 우선시하여 번아웃 위험'
                ],
                careers: ['상담사, 중재자, 외교관, 인사 담당자, 사회복지사, 치료사, 교사, 팀 코디네이터, 고객 서비스 관리자'],
                relationships: '연애에서 헌신적이고 따뜻한 파트너입니다. 상대방의 감정을 세심하게 배려하며 조화로운 관계를 만들어갑니다. 다만 자신의 필요와 감정도 표현하는 것이 건강한 관계를 위해 중요합니다. 균형잡힌 주고받음이 당신의 관계를 더욱 풍요롭게 만듭니다.',
                lifePurpose: '당신의 인생 목적은 사람들 사이에 다리를 놓고 조화와 평화를 만들어내는 것입니다. 공감과 이해를 통해 세상을 더 따뜻하게 만들고, 협력의 힘으로 함께 성장하는 공동체를 만드는 것이 당신의 사명입니다.',
                keywords: ['조화', '협력', '공감', '섬세함', '중재', '파트너십', '직관', '평화']
            },
            3: {
                emoji: '3️⃣',
                nickname: '표현가',
                oneline: '창의적이고 매력적인 소통의 달인',
                description: '3번 생명경로수를 가진 당신은 타고난 표현가입니다. 창의성과 예술적 감각이 뛰어나며, 자신의 생각과 감정을 다양한 방식으로 표현하는 것을 즐깁니다. 밝고 긍정적인 에너지로 주변 사람들에게 기쁨과 영감을 주며, 뛰어난 커뮤니케이션 능력으로 사람들의 마음을 사로잡습니다. 당신은 삶을 예술작품처럼 여기며, 일상 속에서도 아름다움과 의미를 발견합니다. 사교적이고 매력적인 성격으로 어디서나 사람들의 주목을 받습니다.',
                strengths: [
                    '뛰어난 창의성과 예술적 재능',
                    '말과 글로 사람들의 마음을 움직이는 표현력',
                    '긍정적이고 밝은 에너지로 분위기를 살림',
                    '사교성이 뛰어나 다양한 사람들과 쉽게 친해짐',
                    '유머감각과 재치로 사람들을 즐겁게 함'
                ],
                weaknesses: [
                    '집중력이 부족하여 한 가지 일을 끝까지 하기 어려움',
                    '피상적인 관계에 머물러 깊은 유대감 형성이 어려울 수 있음',
                    '타인의 인정에 지나치게 의존하는 경향',
                    '감정 기복이 심하여 우울과 흥분을 반복함',
                    '산만하고 계획없이 행동하여 목표 달성이 어려울 수 있음'
                ],
                careers: ['작가, 배우, 가수, 예술가, 디자이너, 마케터, 방송인, 강사, 이벤트 기획자, 광고인, SNS 크리에이터'],
                relationships: '연애에서 로맨틱하고 표현적입니다. 사랑을 말과 행동으로 풍부하게 표현하며 파트너에게 즐거움을 선사합니다. 다만 관계의 깊이를 만들어가는 노력과 일관성 있는 태도가 필요합니다. 순간의 감정만이 아니라 지속적인 헌신이 사랑을 깊게 만듭니다.',
                lifePurpose: '당신의 인생 목적은 창의성과 표현을 통해 세상에 아름다움과 기쁨을 더하는 것입니다. 예술과 소통으로 사람들에게 영감을 주고, 긍정적인 메시지를 전파하여 세상을 더 밝게 만드는 것이 당신의 사명입니다.',
                keywords: ['창의성', '표현', '소통', '예술', '사교성', '유머', '낙관', '매력']
            },
            4: {
                emoji: '4️⃣',
                nickname: '건설자',
                oneline: '실용적이고 신뢰할 수 있는 기반 구축자',
                description: '4번 생명경로수를 가진 당신은 타고난 건설자입니다. 안정성과 질서를 중시하며, 견고한 기반 위에 무언가를 차근차근 쌓아올리는 것을 좋아합니다. 성실하고 근면한 태도로 목표를 향해 꾸준히 나아가며, 책임감이 강하여 주변 사람들의 신뢰를 받습니다. 당신은 현실적이고 실용적인 사고방식을 가지고 있으며, 체계적인 계획과 실행으로 확실한 결과를 만들어냅니다. 인내심이 강하고 끈기있게 일을 완수하는 능력이 뛰어납니다.',
                strengths: [
                    '강한 책임감과 신뢰성',
                    '체계적이고 조직적인 업무 처리 능력',
                    '현실적이고 실용적인 문제 해결 능력',
                    '인내심과 끈기로 목표를 달성함',
                    '성실하고 근면한 태도'
                ],
                weaknesses: [
                    '변화를 받아들이기 어려워 융통성이 부족함',
                    '지나친 완벽주의로 스트레스를 받음',
                    '경직된 사고방식으로 새로운 시도를 꺼림',
                    '일 중독 경향으로 삶의 균형을 잃을 수 있음',
                    '감정 표현이 서툴러 관계에서 오해가 생길 수 있음'
                ],
                careers: ['회계사, 엔지니어, 건축가, 프로젝트 매니저, 재무 관리자, 품질 관리자, 행정 담당자, 부동산 개발자, 시스템 분석가'],
                relationships: '연애에서 안정적이고 신뢰할 수 있는 파트너입니다. 헌신적이며 관계를 오래 유지하려고 노력합니다. 다만 감정을 표현하는 것에 서툴 수 있어 상대방과의 소통을 통해 마음을 열어가는 노력이 필요합니다. 사랑도 말과 행동으로 표현해야 전달됩니다.',
                lifePurpose: '당신의 인생 목적은 견고한 기반을 만들고 안정적인 구조를 세우는 것입니다. 성실함과 책임감으로 신뢰받는 시스템을 구축하고, 다른 사람들이 그 위에서 꿈을 펼칠 수 있도록 단단한 토대를 제공하는 것이 당신의 사명입니다.',
                keywords: ['안정성', '책임감', '성실', '체계', '신뢰', '인내', '실용성', '근면']
            },
            5: {
                emoji: '5️⃣',
                nickname: '자유인',
                oneline: '모험적이고 자유로운 변화의 촉매',
                description: '5번 생명경로수를 가진 당신은 타고난 자유인입니다. 변화와 모험을 갈망하며, 새로운 경험을 통해 삶의 의미를 발견합니다. 호기심이 왕성하고 다양한 것에 관심이 많아 한 곳에 오래 머물지 않습니다. 당신은 자유를 무엇보다 소중히 여기며, 제약과 규칙을 답답해합니다. 적응력이 뛰어나고 유연한 사고방식으로 어떤 상황에서도 빠르게 적응합니다. 에너지가 넘치고 활동적이며, 다채로운 인생을 살아가는 것을 즐깁니다.',
                strengths: [
                    '뛰어난 적응력과 유연성',
                    '새로운 경험을 두려워하지 않는 모험심',
                    '다양한 분야에 대한 폭넓은 지식과 관심',
                    '자유롭고 독립적인 사고방식',
                    '카리스마와 매력으로 사람들을 끌어당김'
                ],
                weaknesses: [
                    '충동적이고 계획없이 행동하는 경향',
                    '한 가지 일에 집중하지 못하고 쉽게 질림',
                    '책임을 회피하고 자유만을 추구함',
                    '불안정한 생활로 장기적인 목표 달성이 어려움',
                    '과도한 자극 추구로 위험한 선택을 할 수 있음'
                ],
                careers: ['여행 작가, 저널리스트, 사진작가, 마케터, 영업사원, 이벤트 기획자, 여행 가이드, 통역사, 프리랜서, 모험 스포츠 강사'],
                relationships: '연애에서 열정적이고 흥미진진한 파트너입니다. 다양한 경험을 함께 나누며 관계를 역동적으로 만들어갑니다. 다만 헌신과 안정성을 두려워할 수 있어, 자유를 존중하면서도 깊은 유대감을 만들어가는 균형이 필요합니다. 진정한 자유는 책임 있는 선택에서 옵니다.',
                lifePurpose: '당신의 인생 목적은 자유롭게 세상을 탐험하고 다양한 경험을 통해 성장하는 것입니다. 변화를 두려워하지 않고 새로운 가능성을 열어가며, 다른 사람들에게도 자유와 모험의 가치를 전하는 것이 당신의 사명입니다.',
                keywords: ['자유', '모험', '변화', '호기심', '유연성', '독립', '다양성', '활력']
            },
            6: {
                emoji: '6️⃣',
                nickname: '양육자',
                oneline: '사랑으로 돌보는 책임감 있는 보호자',
                description: '6번 생명경로수를 가진 당신은 타고난 양육자입니다. 타인을 돌보고 보호하는 것에서 큰 보람을 느끼며, 가족과 공동체에 대한 책임감이 강합니다. 따뜻하고 자비로운 마음으로 주변 사람들에게 안정감을 줍니다. 당신은 조화롭고 아름다운 환경을 만드는 것을 좋아하며, 사람들이 평화롭고 행복하게 지내기를 바랍니다. 이상주의적이며 정의감이 강해 옳지 않은 것을 보면 가만히 있지 못합니다. 헌신적이고 신뢰할 수 있는 사람으로 주변의 기둥 역할을 합니다.',
                strengths: [
                    '무조건적인 사랑과 헌신',
                    '강한 책임감과 의무감',
                    '타인의 필요를 민감하게 알아차리는 능력',
                    '조화롭고 아름다운 환경을 만드는 재능',
                    '정의감이 강하고 원칙을 지킴'
                ],
                weaknesses: [
                    '타인을 위해 자신을 희생하여 번아웃 위험',
                    '지나친 간섭으로 상대방을 통제하려 함',
                    '완벽주의와 높은 기준으로 자신과 타인을 힘들게 함',
                    '인정받지 못하면 상처받고 분노를 느낌',
                    '의존적인 관계를 만들어 상대방의 성장을 방해할 수 있음'
                ],
                careers: ['교사, 간호사, 상담사, 사회복지사, 요리사, 인테리어 디자이너, 육아 전문가, 가정 관리자, 비영리 단체 활동가'],
                relationships: '연애에서 헌신적이고 돌봄을 아끼지 않는 파트너입니다. 상대방을 위해 최선을 다하며 안정적인 관계를 만들어갑니다. 다만 자신의 필요도 챙기고 상대방에게 의존하지 않는 독립성을 유지하는 것이 건강한 관계를 위해 중요합니다. 진정한 사랑은 자유를 주는 것입니다.',
                lifePurpose: '당신의 인생 목적은 사랑과 돌봄으로 세상을 더 따뜻하게 만드는 것입니다. 가족, 친구, 공동체를 책임감 있게 보살피고, 조화롭고 아름다운 환경을 만들어 사람들이 행복하게 살 수 있도록 돕는 것이 당신의 사명입니다.',
                keywords: ['사랑', '책임', '돌봄', '헌신', '조화', '이상주의', '가족', '보호']
            },
            7: {
                emoji: '7️⃣',
                nickname: '탐구자',
                oneline: '깊은 사색과 진리를 추구하는 현자',
                description: '7번 생명경로수를 가진 당신은 타고난 탐구자입니다. 표면적인 것에 만족하지 않고 사물의 본질과 진리를 파고드는 것을 좋아합니다. 분석적이고 철학적인 사고방식을 가지고 있으며, 혼자만의 시간을 통해 깊이 사색합니다. 당신은 영적이고 신비로운 것에 관심이 많으며, 삶의 의미와 목적에 대해 끊임없이 질문합니다. 직관력이 뛰어나고 통찰력이 깊어 사람들이 당신에게 지혜를 구하러 옵니다. 독립적이고 내성적이며 자신만의 세계를 소중히 여깁니다.',
                strengths: [
                    '뛰어난 분석력과 논리적 사고',
                    '깊은 통찰력과 직관',
                    '끊임없이 배우고 성장하려는 지적 호기심',
                    '영적이고 철학적인 깊이',
                    '독립적이고 자기 성찰적인 태도'
                ],
                weaknesses: [
                    '지나치게 고립되어 사회적 관계가 부족함',
                    '냉소적이고 비판적인 태도로 타인을 멀리함',
                    '완벽주의와 분석 과잉으로 결정을 내리지 못함',
                    '감정 표현이 서툴러 오해를 받을 수 있음',
                    '현실과 동떨어진 이상만 추구하여 실행력이 부족함'
                ],
                careers: ['연구원, 과학자, 철학자, 작가, 심리학자, 교수, 데이터 분석가, 영적 지도자, 컨설턴트, 프로그래머'],
                relationships: '연애에서 깊이 있고 의미있는 관계를 추구합니다. 표면적인 대화보다는 영혼의 교감을 원하며, 파트너와 지적·영적으로 연결되기를 바랍니다. 다만 감정을 표현하고 친밀감을 나누는 것에 노력이 필요하며, 혼자만의 시간과 함께하는 시간의 균형을 맞춰야 합니다.',
                lifePurpose: '당신의 인생 목적은 진리를 탐구하고 지혜를 얻어 사람들에게 깊은 통찰을 제공하는 것입니다. 삶의 본질적인 질문에 답을 찾고, 영적 성장을 통해 자신과 타인을 깨우치는 것이 당신의 사명입니다.',
                keywords: ['지혜', '탐구', '분석', '직관', '영성', '철학', '성찰', '진리']
            },
            8: {
                emoji: '8️⃣',
                nickname: '권력자',
                oneline: '강력하고 야심찬 성취의 달인',
                description: '8번 생명경로수를 가진 당신은 타고난 권력자입니다. 물질적 성공과 권력을 추구하며, 큰 목표를 달성하는 능력이 뛰어납니다. 리더십이 강하고 결단력 있게 일을 추진하며, 비즈니스 감각이 탁월합니다. 당신은 부와 영향력을 통해 세상에 영향을 미치고자 하며, 성공을 위해 끊임없이 노력합니다. 자신감 넘치고 카리스마가 있어 사람들을 이끄는 힘이 있습니다. 현실적이고 실용적이며, 전략적 사고로 복잡한 문제를 해결합니다.',
                strengths: [
                    '강력한 리더십과 경영 능력',
                    '뛰어난 비즈니스 감각과 전략적 사고',
                    '목표 지향적이고 성취 의지가 강함',
                    '자신감과 카리스마로 사람들을 이끔',
                    '어려운 결정도 과감하게 내리는 결단력'
                ],
                weaknesses: [
                    '물질과 권력에 지나치게 집착할 수 있음',
                    '일 중독으로 가족과 건강을 소홀히 함',
                    '지배욕이 강해 타인을 통제하려 함',
                    '실패를 받아들이기 어려워 스트레스를 받음',
                    '냉정하고 무정해 보여 인간관계가 어려울 수 있음'
                ],
                careers: ['CEO, 사업가, 투자가, 금융 전문가, 경영 컨설턴트, 부동산 개발자, 변호사, 정치인, 임원'],
                relationships: '연애에서 헌신적이지만 일에 몰두하여 관계를 소홀히 할 수 있습니다. 파트너에게 안정감과 풍요를 제공하지만, 감정적인 교감과 시간 투자도 필요합니다. 성공만큼 관계도 중요하게 여기고 균형을 맞추는 노력이 필요합니다. 진정한 부는 사랑하는 사람들과 함께 있을 때 의미가 있습니다.',
                lifePurpose: '당신의 인생 목적은 물질적 성공을 이루고 그 힘을 선하게 사용하는 것입니다. 부와 권력을 통해 긍정적인 변화를 만들어내고, 다른 사람들에게도 풍요와 기회를 제공하는 것이 당신의 사명입니다.',
                keywords: ['권력', '성공', '야망', '리더십', '부', '전략', '결단력', '영향력']
            },
            9: {
                emoji: '9️⃣',
                nickname: '완성자',
                oneline: '자비롭고 이타적인 인도주의자',
                description: '9번 생명경로수를 가진 당신은 타고난 완성자입니다. 인류애가 깊고 세상을 더 나은 곳으로 만들고자 하는 이상주의자입니다. 자비롭고 이타적이며, 개인적인 이익보다 더 큰 선을 추구합니다. 당신은 포용력이 넓고 다양한 사람들을 이해하며, 차별 없이 모두를 받아들입니다. 예술적 감각이 뛰어나고 창의적이며, 영적으로 성숙한 영혼입니다. 완성과 끝맺음의 에너지를 가지고 있어, 한 사이클을 마무리하고 새로운 시작을 돕는 역할을 합니다.',
                strengths: [
                    '깊은 인류애와 자비로운 마음',
                    '포용력이 넓고 차별 없이 모두를 받아들임',
                    '이상주의적이고 세상을 변화시키려는 열정',
                    '예술적이고 창의적인 재능',
                    '영적으로 성숙하고 지혜로움'
                ],
                weaknesses: [
                    '자신을 돌보지 않고 타인을 위해 희생함',
                    '이상과 현실의 괴리로 좌절감을 느낌',
                    '감정적으로 지나치게 몰입하여 번아웃',
                    '끝맺음에 대한 두려움으로 집착함',
                    '세상의 고통을 모두 짊어지려 해서 힘들어함'
                ],
                careers: ['사회운동가, 자선단체 운영자, 예술가, 작가, 교사, 치유사, 영적 지도자, 국제기구 활동가, 환경운동가'],
                relationships: '연애에서 무조건적인 사랑을 주는 파트너입니다. 상대방을 있는 그대로 받아들이고 성장을 지지합니다. 다만 자신의 필요도 표현하고 건강한 경계를 유지하는 것이 중요합니다. 사랑은 자신을 잃어버리는 것이 아니라 함께 성장하는 것입니다.',
                lifePurpose: '당신의 인생 목적은 인류를 위해 봉사하고 세상에 사랑과 자비를 전파하는 것입니다. 개인의 이익을 넘어 모두의 행복과 평화를 위해 헌신하며, 영적 지혜로 사람들을 이끄는 것이 당신의 사명입니다.',
                keywords: ['인류애', '자비', '이상주의', '포용', '완성', '봉사', '영성', '창의성']
            },
            11: {
                emoji: '✨',
                nickname: '영감가',
                oneline: '직관적이고 영적인 빛의 전달자',
                description: '11번 마스터 넘버를 가진 당신은 타고난 영감가입니다. 강력한 직관과 영적 통찰력을 가지고 있으며, 사람들에게 깨달음과 영감을 전하는 특별한 사명을 가지고 있습니다. 당신은 보이지 않는 세계와 연결되어 있으며, 높은 차원의 지혜를 받아 현실 세계에 전달하는 메신저입니다. 민감하고 섬세한 감수성으로 타인의 에너지를 읽으며, 말과 행동으로 사람들의 의식을 깨웁니다. 이상주의적이고 비전을 가지고 있어 새로운 패러다임을 제시합니다. 마스터 넘버로서 높은 진동과 책임감을 가지고 있습니다.',
                strengths: [
                    '강력한 직관과 영적 통찰력',
                    '사람들에게 영감을 주는 카리스마',
                    '높은 이상과 비전을 제시하는 능력',
                    '창의적이고 혁신적인 사고',
                    '타인의 잠재력을 깨우는 재능'
                ],
                weaknesses: [
                    '지나치게 민감하여 에너지 소진이 빠름',
                    '현실과 이상의 괴리로 좌절감을 느낌',
                    '높은 기준으로 자신과 타인을 힘들게 함',
                    '내면의 불안과 두려움이 큼',
                    '영적 에너지를 다루는 것이 부담스러울 수 있음'
                ],
                careers: ['영적 교사, 작가, 예술가, 동기부여 강연자, 상담사, 치유사, 철학자, 발명가, 비전 전략가, 심리학자'],
                relationships: '연애에서 깊고 영적인 연결을 추구합니다. 단순한 육체적 관계를 넘어 영혼의 교감을 원하며, 파트너와 함께 성장하고자 합니다. 민감한 특성상 상처받기 쉬우므로 안전하고 이해받는 관계가 필요합니다. 진정으로 당신을 이해하는 영혼의 동반자를 만날 때 빛을 발합니다.',
                lifePurpose: '당신의 인생 목적은 높은 차원의 지혜를 받아 사람들에게 전하고 의식을 깨우는 것입니다. 영적 빛의 전달자로서 어둠 속에서 길을 잃은 사람들에게 희망과 방향을 제시하며, 새로운 시대의 비전을 실현하는 것이 당신의 사명입니다.',
                keywords: ['직관', '영감', '영성', '깨달음', '비전', '민감성', '빛', '메신저']
            },
            22: {
                emoji: '🌟',
                nickname: '마스터빌더',
                oneline: '비전을 현실로 만드는 위대한 건축가',
                description: '22번 마스터 넘버를 가진 당신은 타고난 마스터빌더입니다. 높은 이상과 비전을 가지고 있으면서도 그것을 현실에서 구체적으로 실현하는 특별한 능력을 가지고 있습니다. 당신은 꿈을 꾸는 동시에 그 꿈을 실제로 만들어내는 실행력을 겸비했습니다. 전략적이고 체계적인 사고로 큰 프로젝트를 성공적으로 완수하며, 리더십과 실무 능력을 모두 갖추었습니다. 당신의 작업은 개인을 넘어 사회와 인류 전체에 긍정적인 영향을 미칩니다. 마스터 넘버로서 위대한 업적을 이루어낼 잠재력과 책임을 가지고 있습니다.',
                strengths: [
                    '비전과 실행력을 모두 갖춘 균형잡힌 능력',
                    '큰 그림을 보면서도 디테일을 놓치지 않음',
                    '강력한 리더십으로 대규모 프로젝트를 이끎',
                    '체계적이고 전략적인 문제 해결 능력',
                    '인류에 기여하는 위대한 업적을 이룸'
                ],
                weaknesses: [
                    '지나친 완벽주의로 자신과 타인에게 가혹함',
                    '엄청난 압박감과 책임감으로 스트레스',
                    '실패에 대한 두려움이 클 수 있음',
                    '일 중독으로 건강과 관계를 소홀히 함',
                    '자신의 높은 기준을 충족하지 못할 때 좌절감'
                ],
                careers: ['CEO, 대규모 프로젝트 리더, 건축가, 국제기구 운영자, 사회적 기업가, 정치인, 도시 계획가, 혁신가'],
                relationships: '연애에서 헌신적이고 책임감 있는 파트너입니다. 관계에도 비전을 가지고 장기적으로 함께 성장하고자 합니다. 다만 일에 몰두하여 관계를 소홀히 할 수 있으므로, 사랑하는 사람과 보내는 시간의 중요성을 기억해야 합니다. 위대한 업적도 사랑하는 사람들과 함께할 때 의미가 있습니다.',
                lifePurpose: '당신의 인생 목적은 높은 이상을 현실에서 구현하여 세상에 지속적이고 긍정적인 변화를 만드는 것입니다. 개인의 성공을 넘어 인류 전체에 혜택을 주는 위대한 시스템과 구조를 만들어내는 것이 당신의 사명입니다.',
                keywords: ['마스터빌더', '실현', '비전', '건축', '리더십', '전략', '업적', '유산']
            },
            33: {
                emoji: '🎖️',
                nickname: '마스터교사',
                oneline: '무조건적 사랑으로 가르치는 영적 스승',
                description: '33번 마스터 넘버를 가진 당신은 타고난 마스터교사입니다. 가장 높은 수준의 영적 성숙함과 자비심을 가지고 있으며, 무조건적인 사랑으로 사람들을 가르치고 이끕니다. 당신은 개인의 성장을 넘어 인류의 집단적 의식 상승에 기여하는 특별한 사명을 가지고 있습니다. 치유와 돌봄의 에너지가 강하며, 사람들이 당신 곁에 있으면 위안과 평화를 느낍니다. 희생적이고 헌신적이며, 자신의 이익보다 더 큰 선을 위해 일합니다. 마스터 넘버 중 가장 높은 진동을 가지고 있어, 그만큼 큰 책임과 도전도 함께 짊어지고 있습니다.',
                strengths: [
                    '무조건적인 사랑과 자비심',
                    '영적으로 가장 성숙한 단계',
                    '치유와 가르침의 특별한 재능',
                    '깊은 공감능력과 이해심',
                    '인류의 의식 상승에 기여하는 능력'
                ],
                weaknesses: [
                    '자신을 돌보지 않고 타인을 위해 희생함',
                    '세상의 고통을 모두 짊어지려 해서 힘듦',
                    '높은 기준과 책임감으로 번아웃 위험',
                    '자신의 한계를 인정하지 못하고 과도하게 헌신',
                    '영적 에너지를 다루는 것이 때때로 버거움'
                ],
                careers: ['영적 스승, 치유사, 교사, 상담가, 인도주의 활동가, 평화운동가, 작가, 예술가, 자선단체 지도자'],
                relationships: '연애에서 무조건적인 사랑을 실천하는 파트너입니다. 상대방을 있는 그대로 받아들이고 성장을 지지하며, 깊은 영적 연결을 만들어갑니다. 다만 자신도 돌보고 건강한 경계를 유지하는 것이 중요합니다. 스스로를 사랑할 때 진정으로 타인을 사랑할 수 있습니다.',
                lifePurpose: '당신의 인생 목적은 무조건적인 사랑과 가르침으로 인류의 의식을 높이고 세상에 치유를 가져오는 것입니다. 영적 스승으로서 사람들이 자신의 신성함을 발견하도록 돕고, 사랑의 힘으로 세상을 변화시키는 것이 당신의 사명입니다.',
                keywords: ['마스터교사', '무조건적 사랑', '치유', '가르침', '자비', '희생', '영적 스승', '의식 상승']
            }
        };

        return data[number] || data[1];
    }

    // 날짜 형식 정규화 (다양한 입력 형식 지원)
    normalizeDateFormat(input) {
        if (!input) return null;

        // 공백 제거
        input = input.trim().replace(/\s/g, '');

        // 숫자만 추출
        const numbersOnly = input.replace(/\D/g, '');

        // 8자리 숫자인 경우 (예: 19870703)
        if (numbersOnly.length === 8) {
            const year = numbersOnly.substring(0, 4);
            const month = numbersOnly.substring(4, 6);
            const day = numbersOnly.substring(6, 8);
            return `${year}-${month}-${day}`;
        }

        // 구분자가 있는 경우 (예: 1987-07-03, 1987.07.03, 1987/07/03)
        const withSeparator = input.match(/(\d{4})[\-\.\/](\d{1,2})[\-\.\/](\d{1,2})/);
        if (withSeparator) {
            const year = withSeparator[1];
            const month = withSeparator[2].padStart(2, '0');
            const day = withSeparator[3].padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        return null;
    }

    // 날짜로부터 생명경로수 계산 (궁합용)
    calculateLifePathFromDate(birthdate) {
        if (!birthdate) return null;

        // 날짜 형식 정규화
        const normalized = this.normalizeDateFormat(birthdate);
        if (!normalized) return null;

        const [year, month, day] = normalized.split('-').map(Number);

        // 유효성 검사
        if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        const reducedMonth = this.reduceToSingleDigit(month);
        const reducedDay = this.reduceToSingleDigit(day);
        const reducedYear = this.reduceToSingleDigit(year);

        let sum = reducedMonth + reducedDay + reducedYear;

        if (sum === 11 || sum === 22 || sum === 33) {
            return sum;
        } else {
            return this.reduceToSingleDigit(sum);
        }
    }

    // 궁합 계산
    calculateCompatibility() {
        const myBirthdate = document.getElementById('my-birthdate').value;
        const partnerBirthdate = document.getElementById('partner-birthdate').value;

        if (!myBirthdate || !partnerBirthdate) {
            alert('두 사람의 생년월일을 모두 입력해주세요.');
            return;
        }

        const myNumber = this.calculateLifePathFromDate(myBirthdate);
        const partnerNumber = this.calculateLifePathFromDate(partnerBirthdate);

        this.showCompatibilityResult(myNumber, partnerNumber);
    }

    // 궁합 결과 표시
    showCompatibilityResult(num1, num2) {
        const compatData = this.getCompatibilityData(num1, num2);
        const resultDiv = document.querySelector('.compatibility-result');

        resultDiv.innerHTML = `
            <div class="compatibility-result-header">
                <h1>궁합 결과</h1>
                <div class="compatibility-numbers">${this.getNumberData(num1).emoji} ${num1} ❤️ ${this.getNumberData(num2).emoji} ${num2}</div>
                <div class="compatibility-score">전체 궁합 점수: ${compatData.score}점</div>
                <p class="compatibility-summary">${compatData.summary}</p>
                <span class="compatibility-type">${compatData.compatibilityType}</span>
            </div>

            <div class="compatibility-section">
                <h3>💫 전체 흐름</h3>
                <p>${compatData.overall}</p>
            </div>

            <div class="relationship-tabs">
                <button class="relationship-tab active" data-relationship="friend">친구</button>
                <button class="relationship-tab" data-relationship="family">가족</button>
                <button class="relationship-tab" data-relationship="romantic">연인</button>
                <button class="relationship-tab" data-relationship="spouse">배우자</button>
                <button class="relationship-tab" data-relationship="work">직장</button>
            </div>

            <div class="relationship-content">
                ${this.renderRelationshipContent(compatData, 'friend')}
            </div>

            <div class="compatibility-section">
                <h3>🔑 핵심 키워드</h3>
                <div class="compatibility-keywords">
                    ${compatData.keywords.map(k => `<span class="compatibility-keyword">${k}</span>`).join('')}
                </div>
            </div>
        `;

        // 탭 클릭 이벤트 추가
        resultDiv.querySelectorAll('.relationship-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const relationship = e.target.dataset.relationship;

                // 활성화 탭 변경
                resultDiv.querySelectorAll('.relationship-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                // 내용 변경
                const contentDiv = resultDiv.querySelector('.relationship-content');
                contentDiv.innerHTML = this.renderRelationshipContent(compatData, relationship);
            });
        });

        resultDiv.classList.add('active');
        document.querySelector('.main-content').scrollTo({top: 0, behavior: 'smooth'});
    }

    // 관계 유형별 내용 렌더링
    renderRelationshipContent(compatData, relationship) {
        const relationData = compatData[relationship];

        if (!relationData) {
            return `<p>해당 관계에 대한 데이터가 아직 준비되지 않았습니다.</p>`;
        }

        const relationshipNames = {
            friend: '👥 친구',
            family: '👨‍👩‍👧‍👦 가족',
            romantic: '💕 연인',
            spouse: '💍 배우자',
            work: '💼 직장'
        };

        return `
            <div class="relationship-header">
                <h2>${relationshipNames[relationship]} 궁합</h2>
                <div class="relationship-score">점수: ${relationData.score}점</div>
            </div>

            <div class="compatibility-section">
                <h3>📝 관계 설명</h3>
                <p>${relationData.description}</p>
            </div>

            <div class="compatibility-section">
                <h3>✨ 강점</h3>
                <ul>
                    ${relationData.strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>

            <div class="compatibility-section">
                <h3>⚠️ 도전 과제</h3>
                <ul>
                    ${relationData.challenges.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>

            <div class="compatibility-section">
                <h3>💡 조언</h3>
                <p>${relationData.advice}</p>
            </div>
        `;
    }

    // 궁합 데이터 가져오기
    getCompatibilityData(num1, num2) {
        // 작은 수를 먼저 오도록 정렬 (대칭 처리)
        const key = num1 <= num2 ? `${num1}-${num2}` : `${num2}-${num1}`;

        // 임시 데이터 (나중에 78개 조합으로 교체)
        const tempData = {
            score: 75,
            summary: `${num1}번과 ${num2}번의 만남`,
            overall: `${num1}번과 ${num2}번이 만나면 서로 다른 에너지가 조화를 이루는 관계예요. 각자의 특성을 이해하고 존중하면 좋은 관계를 만들어갈 수 있어요. 서로의 강점을 살리고 약점을 보완하면서 함께 성장하는 파트너십을 만들어보세요!`,
            strengths: [
                '서로의 차이점을 통해 배울 수 있어요',
                '다양한 관점으로 문제를 해결할 수 있어요',
                '서로를 보완하는 관계를 만들 수 있어요'
            ],
            challenges: [
                '서로 다른 방식으로 인한 오해가 생길 수 있어요',
                '소통이 부족하면 갈등이 생길 수 있어요',
                '상대의 특성을 이해하는 노력이 필요해요'
            ],
            advice: '주말에 함께 시간을 보내면서 서로의 가치관과 꿈에 대해 이야기해봐요. 차이점을 인정하고 존중하는 대화를 나누면 관계가 더욱 깊어질 거예요. 완벽한 조화보다 서로를 이해하는 과정이 더 중요하답니다!',
            compatibilityType: '조화로운 파트너십',
            keywords: ['이해', '존중', '성장', '조화']
        };

        return this.compatibilityDatabase[key] || tempData;
    }

    // 궁합 데이터베이스 (78개 조합 - 수동 작성 중)
get compatibilityDatabase() {
    return {
        '1-1': {
            score: 74,
            summary: '두 태양의 만남',
            overall: `1번과 1번이 만나는 건 두 개의 태양가 같은 공간에 있는 것과 같아요. 1번은 독립적, 리더십, 야심의 숫자예요. 태양의 에너지. 스스로 빛나고 중심이 되는 숫자.

수비학적으로 1+1=2이에요. 2은 달의 에너지. 반사하고 조화를 이루는 숫자. 두 개의 태양가 만나면 더 강력한 달 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

1번의 에너지는 불(火)이에요. 두 개의 불(火)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 독립적을 중요하게 생각하고, 리더십을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 1번의 어려움을 1번만큼 잘 아는 사람은 없으니까요. 독선이나 고집같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 야심을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 독선하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 독립적을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "리더십을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 독선하면 서로 말려주지 못해요", "경쟁심이 생기면 고집해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 야심, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 독선해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 독선한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 독립적을 함께 추구하고 리더십을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 야심을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 냉정하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 독선하면 관계가 폭발하거나. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "독립적을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 독선하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 독립적한 사람이 갑자기 독선해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 65,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 독립적을 중요하게 생각하니까 가족의 방향성이 명확해요. 리더십을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 체계적이고 안정적이에요. 야심을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 독립적을 가르치고 리더십을 중요하게 여겨요. 일관성이 있어서 아이가 혼란스러워하지 않아요.

하지만 둘 다 독선해지면 가정이 붕괴될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 커져요. 일중독 부부가 될 수 있어요.`,
                strengths: ["가치관이 일치해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 독선하면 위험해요", "감정 표현이 부족할 수 있어요", "일중독 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 독립적하려 할 때 한 사람은 반대로 독선을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 감정 나누기 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 85,
                description: `함께 일하면 두 사람은 체계적이고 효율적으로 일해요. 둘 다 독립적을 중요시하고 리더십한 방식을 선호해요. 업무 스타일이 맞아서 효율이 높아요.

역할 분담을 명확히 하면 시너지가 나요. 한 사람은 야심, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

마감일을 지키고 품질을 보장해요. 책임감이 강해서 프로젝트를 완수해요.

하지만 둘 다 독선해지면 문제가 커져요. 주도권 다툼이. 완고해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 일치해요", "효율이 높아요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 독선하면 충돌해요", "주도권 다툼이", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 전략, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 제3자의 조언을 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 독립적을 함께 중요시하고 리더십을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "독립적을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 새로운 관점이 부족해요", "둘 다 독선하면 가족이 어려워져요", "감정 표현이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 감정을 나누세요.`
            },

            karma: {
                tasks: ["독선 극복하기: 독립적의 어두운 면을 인식하세요", "협력 배우기: 2번의 에너지를 통해 성장하세요", "균형 잡기: 너무 리더십하지 말고 반대도 시도하세요"],
                pastLife: `함께 야심한 영혼들이에요. 아마 같은 목표를 추구했거나 거예요. 이번 생에서는 협력하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "독선 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "협력 추구하기: 2번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 달의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["독립적", "리더십", "협력", "이해", "변화", "유연성"]
        },

        '1-11': {
            score: 62,
            summary: '태양과 영감의 빛',
            overall: `1번과 11번이 만나는 건 태양과 영감의 빛예요. 1번은 독립적, 리더십, 야심의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 1+11=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

1번의 에너지는 불(火)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

1번이 리더십할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 1번은 11번에게 야심을 가르쳐주고, 11번은 1번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 11번의 직관에 매력을 느끼고, 11번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 11번에게서 직관을 배우고, 11번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 11번은 직관을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 11번의 불안이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 1번은 독립적하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 1번의 리더십과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 직관 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 직관 둘 다 맞아요", "번갈아 하기: 1번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["독립적", "직관", "균형", "성장", "존중", "조화"]
        },

        '1-2': {
            score: 80,
            summary: '태양과 달의 완벽한 균형',
            overall: `1번과 2번이 만나는 건 태양과 달의 완벽한 균형예요. 1번은 독립적, 리더십, 야심의 숫자이고, 2번은 협력, 조화, 민감함의 숫자예요.

수비학적으로 1+2=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

1번의 에너지는 불(火)이고, 2번의 에너지는 물(水)이에요. 이 두 원소가 만나면 조화를 이루거나. 1번의 독립적과 2번의 협력이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 1번은 독립적하고, 2번은 협력해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 2번은 조화해요. 함께 있으면 균형이 맞춰져요. 1번은 2번에게 야심을 가르쳐주고, 2번은 1번에게 민감함을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 2번이 균형을 맞춰주고, 2번이 우유부단할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 2번은 협력을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["1번의 독립적과 2번의 협력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["1번의 독선과 2번의 우유부단이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 2번은 협력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 2번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 2번의 협력에 매력을 느끼고, 2번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 2번은 조화을 원해요. 번갈아 하면 좋아요. 1번 스타일로 한 번, 2번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 2번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 2번은 우유부단해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 2번이 조화을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "1번의 독선과 2번의 우유부단이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 2번에게서 협력을 배우고, 2번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 2번은 협력을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 2번은 조화하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 2번은 협력을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 1번은 독선해지고 2번은 우유부단해져요. 서로 균형을 맞춰주면.`,
                strengths: ["1번의 독립적과 2번의 협력이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "1번의 독선과 2번의 우유부단이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 1번의 방식과 2번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 1번은 독립적하게 일하고 2번은 협력하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

1번이 리더십을 담당하고 2번이 조화을 맡으면 균형이 맞아요. 1번의 리더십과 2번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 1번은 야심하게 하고 싶지만 2번은 민감함하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["1번의 독립적과 2번의 협력이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "1번의 독선과 2번의 우유부단이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 2번은 조화을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 1번은 독립적하고 2번은 협력해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "1번의 독립적과 2번의 협력이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 2번의 우유부단이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 협력 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 1번이 야심하고 2번이 민감함하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 협력 둘 다 맞아요", "번갈아 하기: 1번 방식, 2번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 태양과 달처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["독립적", "협력", "균형", "성장", "존중", "조화"]
        },

        '1-22': {
            score: 62,
            summary: '태양과 건축가의 창조',
            overall: `1번과 22번이 만나는 건 태양과 건축가의 창조예요. 1번은 독립적, 리더십, 야심의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 1+22=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

1번의 에너지는 불(火)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

1번이 리더십할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 1번은 22번에게 야심을 가르쳐주고, 22번은 1번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 22번의 비전에 매력을 느끼고, 22번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 22번에게서 비전을 배우고, 22번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 1번은 독립적하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 1번의 리더십과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 비전 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 비전 둘 다 맞아요", "번갈아 하기: 1번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["독립적", "비전", "균형", "성장", "존중", "조화"]
        },

        '1-3': {
            score: 78,
            summary: '태양과 별의 빛나는 공연',
            overall: `1번과 3번이 만나는 건 태양과 별의 빛나는 공연예요. 1번은 독립적, 리더십, 야심의 숫자이고, 3번은 창의성, 표현력, 즐거움의 숫자예요.

수비학적으로 1+3=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

1번의 에너지는 불(火)이고, 3번의 에너지는 공기(風)이에요. 이 두 원소가 만나면 조화를 이루거나. 1번의 독립적과 3번의 창의성이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 1번은 독립적하고, 3번은 창의성해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 3번은 표현력해요. 함께 있으면 균형이 맞춰져요. 1번은 3번에게 야심을 가르쳐주고, 3번은 1번에게 즐거움을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 3번이 균형을 맞춰주고, 3번이 산만함할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 3번은 창의성을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["1번의 독립적과 3번의 창의성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["1번의 독선과 3번의 산만함이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 3번은 창의성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 3번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 1번은 3번의 창의성에 매력을 느끼고, 3번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 3번은 표현력을 원해요. 번갈아 하면 좋아요. 1번 스타일로 한 번, 3번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 3번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 3번은 산만함해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 3번이 표현력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "1번의 독선과 3번의 산만함이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 3번에게서 창의성을 배우고, 3번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 3번은 창의성을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 3번은 표현력하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 3번은 창의성을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 1번은 독선해지고 3번은 산만함해져요. 서로 균형을 맞춰주면.`,
                strengths: ["1번의 독립적과 3번의 창의성이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "1번의 독선과 3번의 산만함이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 1번의 방식과 3번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 1번은 독립적하게 일하고 3번은 창의성하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

1번이 리더십을 담당하고 3번이 표현력을 맡으면 균형이 맞아요. 1번의 리더십과 3번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 1번은 야심하게 하고 싶지만 3번은 즐거움하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["1번의 독립적과 3번의 창의성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "1번의 독선과 3번의 산만함이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 3번은 표현력을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 1번은 독립적하고 3번은 창의성해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "1번의 독립적과 3번의 창의성이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 3번의 산만함이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 창의성 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 1번이 야심하고 3번이 즐거움하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 창의성 둘 다 맞아요", "번갈아 하기: 1번 방식, 3번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 태양과 별처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["독립적", "창의성", "균형", "성장", "존중", "조화"]
        },

        '1-33': {
            score: 62,
            summary: '태양과 스승의 가르침',
            overall: `1번과 33번이 만나는 건 태양과 스승의 가르침예요. 1번은 독립적, 리더십, 야심의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 1+33=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

1번의 에너지는 불(火)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

1번이 리더십할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 1번은 33번에게 야심을 가르쳐주고, 33번은 1번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 33번의 봉사에 매력을 느끼고, 33번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 33번에게서 봉사을 배우고, 33번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 1번은 독립적하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 1번의 리더십과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 봉사 둘 다 맞아요", "번갈아 하기: 1번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["독립적", "봉사", "균형", "성장", "존중", "조화"]
        },

        '1-4': {
            score: 75,
            summary: '태양과 산의 영원한 관계',
            overall: `1번과 4번이 만나는 건 태양과 산의 영원한 관계예요. 1번은 독립적, 리더십, 야심의 숫자이고, 4번은 안정, 체계, 실용성의 숫자예요.

수비학적으로 1+4=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

1번의 에너지는 불(火)이고, 4번의 에너지는 땅(土)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 4번의 안정이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 4번은 안정해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 4번은 체계해요. 함께 있으면 균형이 맞춰져요. 1번은 4번에게 야심을 가르쳐주고, 4번은 1번에게 실용성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 4번이 균형을 맞춰주고, 4번이 경직성할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 4번은 안정을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["1번의 독립적과 4번의 안정이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 4번의 경직성이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 4번은 안정이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 4번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 1번은 4번의 안정에 매력을 느끼고, 4번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 4번은 체계을 원해요. 번갈아 하면 좋아요. 1번 스타일로 한 번, 4번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 4번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 4번은 경직성해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 4번이 체계을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "1번의 독선과 4번의 경직성이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 4번에게서 안정을 배우고, 4번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 4번은 안정을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 4번은 체계하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 4번은 안정을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 1번은 독선해지고 4번은 경직성해져요. 서로 균형을 맞춰주면.`,
                strengths: ["1번의 독립적과 4번의 안정이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "1번의 독선과 4번의 경직성이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 1번의 방식과 4번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 82,
                description: `함께 일할 때 1번은 독립적하게 일하고 4번은 안정하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

1번이 리더십을 담당하고 4번이 체계을 맡으면 완벽한 조합이에요. 1번의 리더십과 4번의 실행력이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 1번은 야심하게 하고 싶지만 4번은 실용성하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["1번의 독립적과 4번의 안정이 보완돼요", "리더와 실행자의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "1번의 독선과 4번의 경직성이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 4번은 체계을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 4번은 안정해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "1번의 독립적과 4번의 안정이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 4번의 경직성이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 안정 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 1번이 야심하고 4번이 실용성하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 안정 둘 다 맞아요", "번갈아 하기: 1번 방식, 4번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 자유을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["독립적", "안정", "균형", "성장", "존중", "조화"]
        },

        '1-5': {
            score: 73,
            summary: '태양과 바람의 역동적 춤',
            overall: `1번과 5번이 만나는 건 태양과 바람의 역동적 춤예요. 1번은 독립적, 리더십, 야심의 숫자이고, 5번은 자유, 변화, 모험의 숫자예요.

수비학적으로 1+5=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

1번의 에너지는 불(火)이고, 5번의 에너지는 바람(風)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 5번의 자유이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 5번은 자유해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 5번은 변화해요. 함께 있으면 긴장감이 있어요. 1번은 5번에게 야심을 가르쳐주고, 5번은 1번에게 모험을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 5번이 균형을 맞춰주고, 5번이 불안정할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 5번은 자유을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["1번의 독립적과 5번의 자유이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 5번의 불안정이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 5번은 자유이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 5번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 1번은 5번의 자유에 매력을 느끼고, 5번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 5번은 변화을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 5번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 5번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 5번은 불안정해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 5번이 변화을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 5번의 불안정이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 5번에게서 자유을 배우고, 5번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 5번은 자유을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 5번은 변화하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 5번은 자유을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 1번은 독선해지고 5번은 불안정해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 5번의 자유이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 5번의 불안정이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 5번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 1번은 독립적하게 일하고 5번은 자유하게 일해요. 이 차이가 조율이 필요하지만 좋은 팀이 돼요.

1번이 리더십을 담당하고 5번이 변화을 맡으면 균형이 맞아요. 1번의 리더십과 5번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 5번은 모험하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 5번의 자유이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 5번의 불안정이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 5번은 변화을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 5번은 자유해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 5번의 자유이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 5번의 불안정이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 자유 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 1번이 야심하고 5번이 모험하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 자유 둘 다 맞아요", "번갈아 하기: 1번 방식, 5번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 사랑을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["독립적", "자유", "균형", "성장", "존중", "조화"]
        },

        '1-6': {
            score: 75,
            summary: '태양과 대지의 생명 창조',
            overall: `1번과 6번이 만나는 건 태양과 대지의 생명 창조예요. 1번은 독립적, 리더십, 야심의 숫자이고, 6번은 사랑, 책임, 조화의 숫자예요.

수비학적으로 1+6=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

1번의 에너지는 불(火)이고, 6번의 에너지는 흙(土)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 6번의 사랑이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 6번은 사랑해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 6번은 책임해요. 함께 있으면 긴장감이 있어요. 1번은 6번에게 야심을 가르쳐주고, 6번은 1번에게 조화을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 6번이 균형을 맞춰주고, 6번이 간섭할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 6번은 사랑을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 6번의 사랑이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 6번의 간섭이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 6번은 사랑이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 6번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 6번의 사랑에 매력을 느끼고, 6번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 6번은 책임을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 6번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 6번은 감정적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 6번은 간섭해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 6번이 책임을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 6번의 간섭이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 6번에게서 사랑을 배우고, 6번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 6번은 사랑을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 6번은 책임하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 6번은 사랑을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 6번은 간섭해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 6번의 사랑이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 6번의 간섭이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 6번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 82,
                description: `함께 일할 때 1번은 독립적하게 일하고 6번은 사랑하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 6번이 책임을 맡으면 완벽한 조합이에요. 1번의 리더십과 6번의 실행력이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 6번은 조화하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 6번의 사랑이 보완돼요", "리더와 실행자의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 6번의 간섭이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 6번은 책임을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 6번은 사랑해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 6번의 사랑이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 6번의 간섭이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 사랑 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 6번이 조화하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 사랑 둘 다 맞아요", "번갈아 하기: 1번 방식, 6번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["독립적", "사랑", "균형", "성장", "존중", "조화"]
        },

        '1-7': {
            score: 68,
            summary: '태양과 현자의 깨달음',
            overall: `1번과 7번이 만나는 건 태양과 현자의 깨달음예요. 1번은 독립적, 리더십, 야심의 숫자이고, 7번은 지혜, 분석, 영성의 숫자예요.

수비학적으로 1+7=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

1번의 에너지는 불(火)이고, 7번의 에너지는 에테르(靈)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 7번의 지혜이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 7번은 지혜해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 7번은 분석해요. 함께 있으면 긴장감이 있어요. 1번은 7번에게 야심을 가르쳐주고, 7번은 1번에게 영성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 7번이 균형을 맞춰주고, 7번이 고립할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 7번은 지혜을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 7번의 지혜이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 7번의 고립이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 7번은 지혜이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 7번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 7번의 지혜에 매력을 느끼고, 7번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 7번은 분석을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 7번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 7번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 7번은 고립해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 7번이 분석을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 7번의 고립이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 7번에게서 지혜을 배우고, 7번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 7번은 지혜을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 7번은 분석하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 7번은 지혜을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 7번은 고립해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 7번의 지혜이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 7번의 고립이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 7번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 1번은 독립적하게 일하고 7번은 지혜하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 7번이 분석을 맡으면 균형이 맞아요. 1번의 리더십과 7번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 7번은 영성하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 7번의 지혜이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 7번의 고립이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 7번은 분석을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 7번은 지혜해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 7번의 지혜이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 7번의 고립이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 지혜 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 7번이 영성하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 지혜 둘 다 맞아요", "번갈아 하기: 1번 방식, 7번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["독립적", "지혜", "균형", "성장", "존중", "조화"]
        },

        '1-8': {
            score: 62,
            summary: '두 왕의 권력 투쟁',
            overall: `1번과 8번이 만나는 건 두 왕의 권력 투쟁예요. 1번은 독립적, 리더십, 야심의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 1+8=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

1번의 에너지는 불(火)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 8번의 권력이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 8번은 권력해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 8번은 성공해요. 함께 있으면 긴장감이 있어요. 1번은 8번에게 야심을 가르쳐주고, 8번은 1번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 8번의 탐욕이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 8번의 권력에 매력을 느끼고, 8번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 8번은 성공을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 8번은 탐욕해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 8번에게서 권력을 배우고, 8번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 8번은 성공하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 8번은 권력을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 8번은 탐욕해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 8번의 권력이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 8번의 탐욕이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 1번은 독립적하게 일하고 8번은 권력하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 8번이 성공을 맡으면 균형이 맞아요. 1번의 리더십과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 8번의 권력이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 8번의 탐욕이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 8번은 성공을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 8번은 권력해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 8번의 권력이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 8번의 탐욕이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 권력 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 8번이 물질하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 권력 둘 다 맞아요", "번갈아 하기: 1번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["독립적", "권력", "균형", "성장", "존중", "조화"]
        },

        '1-9': {
            score: 62,
            summary: '태양과 성자의 완성',
            overall: `1번과 9번이 만나는 건 태양과 성자의 완성예요. 1번은 독립적, 리더십, 야심의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 1+9=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

1번의 에너지는 불(火)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 긴장을 만들어요. 1번의 독립적과 9번의 완성이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 1번은 독립적하고, 9번은 완성해요. 이 차이가 서로를 보완해줘요.

1번이 리더십할 때 9번은 박애해요. 함께 있으면 긴장감이 있어요. 1번은 9번에게 야심을 가르쳐주고, 9번은 1번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 1번이 독선할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 1번이 도와줘요.

하지만 가치관이 다를 수 있어요. 1번은 독립적을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["1번의 독립적과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["1번의 독선과 9번의 이상주의이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 1번은 독립적이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 1번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 1번은 9번의 완성에 매력을 느끼고, 9번은 1번의 독립적에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 1번은 리더십을 원하고 9번은 박애을 원해요. 절충안을 찾아야 해요. 1번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 1번은 직접적으로 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 1번은 독선해지고 9번은 이상주의해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "1번이 리더십을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "1번의 독선과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 1번은 9번에게서 완성을 배우고, 9번은 1번에게서 독립적을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 1번은 독립적을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 1번은 리더십하게 하고 9번은 박애하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 1번은 아이에게 독립적을 가르치고 9번은 완성을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 1번은 독선해지고 9번은 이상주의해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["1번의 독립적과 9번의 완성이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "1번의 독선과 9번의 이상주의이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 1번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 1번은 독립적하게 일하고 9번은 완성하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

1번이 리더십을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 1번의 리더십과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 1번은 야심하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["1번의 독립적과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "1번의 독선과 9번의 이상주의이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 1번은 리더십, 9번은 박애을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 1번은 독립적하고 9번은 완성해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "1번의 독립적과 9번의 완성이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "1번의 독선과 9번의 이상주의이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["독립적과 완성 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 1번이 야심하고 9번이 지혜하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 독립적과 완성 둘 다 맞아요", "번갈아 하기: 1번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["독립적", "완성", "균형", "성장", "존중", "조화"]
        },

        '11-11': {
            score: 73,
            summary: '두 영감의 만남',
            overall: `11번과 11번이 만나는 건 두 개의 영감가 같은 공간에 있는 것과 같아요. 11번은 직관, 영감, 이상의 숫자예요. 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버.

수비학적으로 11+11=22이에요. 22은 마스터 건축가의 에너지. 큰 비전을 실현하는 마스터 넘버. 두 개의 영감가 만나면 더 강력한 건축가 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

11번의 에너지는 빛(光)이에요. 두 개의 빛(光)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 직관을 중요하게 생각하고, 영감을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 11번의 어려움을 11번만큼 잘 아는 사람은 없으니까요. 불안이나 과민같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 이상을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 불안하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 직관을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "영감을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 불안하면 서로 말려주지 못해요", "경쟁심이 생기면 과민해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 이상, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 불안해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 불안한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 직관을 함께 추구하고 영감을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 이상을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 불안하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "직관을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 불안하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 직관한 사람이 갑자기 불안해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 직관을 중요하게 생각하니까 가족의 방향성이 명확해요. 영감을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 이상을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 직관을 가르치고 영감을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 불안해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 불안하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 직관하려 할 때 한 사람은 반대로 불안을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 70,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 직관을 중요시하고 영감한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 이상, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 불안해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 불안하면 정체돼요", "방향 설정이 어려워요", "새로운 아이디어나 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 직관을 함께 중요시하고 영감을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "직관을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 불안하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["불안 극복하기: 직관의 어두운 면을 인식하세요", "비전 배우기: 22번의 에너지를 통해 성장하세요", "균형 잡기: 너무 영감하지 말고 반대도 시도하세요"],
                pastLife: `함께 이상한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "불안 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "비전 추구하기: 22번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 건축가의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["직관", "영감", "협력", "이해", "변화", "유연성"]
        },

        '11-22': {
            score: 62,
            summary: '영감과 건축가의 만남',
            overall: `11번과 22번이 만나는 건 영감과 건축가의 만남예요. 11번은 직관, 영감, 이상의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 11+22=33이에요. 33은 마스터 스승의 에너지. 무조건적 사랑과 봉사의 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 봉사과 가르침을 배워야 해요.

11번의 에너지는 빛(光)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 11번의 직관과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 11번은 직관하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

11번이 영감할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 11번은 22번에게 이상을 가르쳐주고, 22번은 11번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 11번이 불안할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 11번이 도와줘요.

하지만 가치관이 다를 수 있어요. 11번은 직관을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["11번의 직관과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["11번의 불안과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 11번은 직관이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 11번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 11번은 22번의 비전에 매력을 느끼고, 22번은 11번의 직관에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 11번은 영감을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 11번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 11번은 조용히 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 11번은 불안해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "11번이 영감을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "11번의 불안과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 11번은 22번에게서 비전을 배우고, 22번은 11번에게서 직관을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 11번은 직관을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 11번은 영감하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 11번은 아이에게 직관을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 11번은 불안해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["11번의 직관과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "11번의 불안과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 11번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 11번은 직관하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

11번이 영감을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 11번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 11번은 이상하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["11번의 직관과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "11번의 불안과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 11번은 영감, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 11번은 직관하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "11번의 직관과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "11번의 불안과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["직관과 비전 통합하기: 두 에너지의 균형을 찾으세요", "봉사 달성하기: 33번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 11번이 이상하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 직관과 비전 둘 다 맞아요", "번갈아 하기: 11번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "봉사 함께 배우기: 33번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["직관", "비전", "균형", "성장", "존중", "조화"]
        },

        '11-33': {
            score: 62,
            summary: '영감과 스승의 만남',
            overall: `11번과 33번이 만나는 건 영감과 스승의 만남예요. 11번은 직관, 영감, 이상의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 11+33=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

11번의 에너지는 빛(光)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 11번의 직관과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 11번은 직관하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

11번이 영감할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 11번은 33번에게 이상을 가르쳐주고, 33번은 11번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 11번이 불안할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 11번이 도와줘요.

하지만 가치관이 다를 수 있어요. 11번은 직관을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["11번의 직관과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["11번의 불안과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 11번은 직관이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 11번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 11번은 33번의 봉사에 매력을 느끼고, 33번은 11번의 직관에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 11번은 영감을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 11번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 11번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 11번은 불안해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "11번이 영감을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "11번의 불안과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 11번은 33번에게서 봉사을 배우고, 33번은 11번에게서 직관을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 11번은 직관을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 11번은 영감하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 11번은 아이에게 직관을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 11번은 불안해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["11번의 직관과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "11번의 불안과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 11번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 11번은 직관하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

11번이 영감을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 11번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 11번은 이상하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["11번의 직관과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "11번의 불안과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 11번은 영감, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 11번은 직관하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "11번의 직관과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "11번의 불안과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["직관과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 11번이 이상하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 직관과 봉사 둘 다 맞아요", "번갈아 하기: 11번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["직관", "봉사", "균형", "성장", "존중", "조화"]
        },

        '2-11': {
            score: 62,
            summary: '달과 영감의 만남',
            overall: `2번과 11번이 만나는 건 달과 영감의 만남예요. 2번은 협력, 조화, 민감함의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 2+11=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

2번의 에너지는 물(水)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

2번이 조화할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 2번은 11번에게 민감함을 가르쳐주고, 11번은 2번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["2번의 협력과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 11번의 직관에 매력을 느끼고, 11번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 11번에게서 직관을 배우고, 11번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 11번은 직관을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 2번은 우유부단해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 11번의 불안이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 2번은 협력하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

2번이 조화을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 2번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 직관 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 2번이 민감함하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 직관 둘 다 맞아요", "번갈아 하기: 2번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["협력", "직관", "균형", "성장", "존중", "조화"]
        },

        '2-2': {
            score: 77,
            summary: '두 달의 만남',
            overall: `2번과 2번이 만나는 건 두 개의 달가 같은 공간에 있는 것과 같아요. 2번은 협력, 조화, 민감함의 숫자예요. 달의 에너지. 반사하고 조화를 이루는 숫자.

수비학적으로 2+2=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 두 개의 달가 만나면 더 강력한 산 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

2번의 에너지는 물(水)이에요. 두 개의 물(水)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 협력을 중요하게 생각하고, 조화을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 2번의 어려움을 2번만큼 잘 아는 사람은 없으니까요. 우유부단이나 의존같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 민감함을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 우유부단하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 협력을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "조화을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 우유부단하면 서로 말려주지 못해요", "경쟁심이 생기면 의존해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 민감함, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 우유부단해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 우유부단한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 편안하지만 설렘은 적어요. 협력을 함께 추구하고 조화을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 민감함을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 감정적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 우유부단하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "협력을 공유해요. 같은 방향을 봐요", "다툼이 적고 평화로워요"],
                challenges: ["설렘이 부족해요. 너무 익숙해요", "둘 다 우유부단하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 협력한 사람이 갑자기 우유부단해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 85,
                description: `결혼하면 두 사람은 안정적인 가정을 꾸려요. 둘 다 협력을 중요하게 생각하니까 가족의 방향성이 명확해요. 조화을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 민감함을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 협력을 가르치고 조화을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 우유부단해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 우유부단하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 협력하려 할 때 한 사람은 반대로 우유부단을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 70,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 협력을 중요시하고 조화한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 민감함, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 우유부단해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 협업이 매끄러워요"],
                challenges: ["둘 다 우유부단하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 83,
                description: `가족으로서 두 사람은 안정적이고 든든해요. 부모-자식이든 형제자매든 협력을 함께 중요시하고 조화을 공유해요. 서로를 잘 이해하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "협력을 공유해서 가족의 유대가 강해요", "안정적이고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 우유부단하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 대화하고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["우유부단 극복하기: 협력의 어두운 면을 인식하세요", "안정 배우기: 4번의 에너지를 통해 성장하세요", "균형 잡기: 너무 조화하지 말고 반대도 시도하세요"],
                pastLife: `함께 민감함한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "우유부단 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "안정 추구하기: 4번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 산의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["협력", "조화", "협력", "이해", "변화", "유연성"]
        },

        '2-22': {
            score: 62,
            summary: '달과 건축가의 만남',
            overall: `2번과 22번이 만나는 건 달과 건축가의 만남예요. 2번은 협력, 조화, 민감함의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 2+22=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

2번의 에너지는 물(水)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

2번이 조화할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 2번은 22번에게 민감함을 가르쳐주고, 22번은 2번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["2번의 협력과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 22번의 비전에 매력을 느끼고, 22번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 22번에게서 비전을 배우고, 22번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 2번은 우유부단해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 2번은 협력하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

2번이 조화을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 2번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 비전 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 2번이 민감함하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 비전 둘 다 맞아요", "번갈아 하기: 2번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["협력", "비전", "균형", "성장", "존중", "조화"]
        },

        '2-3': {
            score: 80,
            summary: '달과 별의 로맨틱한 밤',
            overall: `2번과 3번이 만나는 건 달과 별의 로맨틱한 밤예요. 2번은 협력, 조화, 민감함의 숫자이고, 3번은 창의성, 표현력, 즐거움의 숫자예요.

수비학적으로 2+3=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

2번의 에너지는 물(水)이고, 3번의 에너지는 공기(風)이에요. 이 두 원소가 만나면 조화를 이루거나. 2번의 협력과 3번의 창의성이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 2번은 협력하고, 3번은 창의성해요. 이 차이가 서로를 보완해줘요.

2번이 조화할 때 3번은 표현력해요. 함께 있으면 균형이 맞춰져요. 2번은 3번에게 민감함을 가르쳐주고, 3번은 2번에게 즐거움을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 3번이 균형을 맞춰주고, 3번이 산만함할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 3번은 창의성을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["2번의 협력과 3번의 창의성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["2번의 우유부단과 3번의 산만함이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 3번은 창의성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 3번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 3번의 창의성에 매력을 느끼고, 3번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 3번은 표현력을 원해요. 번갈아 하면 좋아요. 2번 스타일로 한 번, 3번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 3번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 3번은 산만함해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 3번이 표현력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "2번의 우유부단과 3번의 산만함이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 3번에게서 창의성을 배우고, 3번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 2번은 협력을 중요하게 생각하고 3번은 창의성을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 3번은 표현력하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 3번은 창의성을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 2번은 우유부단해지고 3번은 산만함해져요. 서로 균형을 맞춰주면.`,
                strengths: ["2번의 협력과 3번의 창의성이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "2번의 우유부단과 3번의 산만함이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 2번의 방식과 3번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 2번은 협력하게 일하고 3번은 창의성하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

2번이 조화을 담당하고 3번이 표현력을 맡으면 균형이 맞아요. 2번의 전문성과 3번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 2번은 민감함하게 하고 싶지만 3번은 즐거움하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["2번의 협력과 3번의 창의성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "2번의 우유부단과 3번의 산만함이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 3번은 표현력을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 2번은 협력하고 3번은 창의성해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "2번의 협력과 3번의 창의성이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 3번의 산만함이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 창의성 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 2번이 민감함하고 3번이 즐거움하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 창의성 둘 다 맞아요", "번갈아 하기: 2번 방식, 3번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 달과 별처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["협력", "창의성", "균형", "성장", "존중", "조화"]
        },

        '2-33': {
            score: 62,
            summary: '달과 스승의 만남',
            overall: `2번과 33번이 만나는 건 달과 스승의 만남예요. 2번은 협력, 조화, 민감함의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 2+33=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

2번의 에너지는 물(水)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

2번이 조화할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 2번은 33번에게 민감함을 가르쳐주고, 33번은 2번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["2번의 협력과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 33번의 봉사에 매력을 느끼고, 33번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 33번에게서 봉사을 배우고, 33번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 2번은 우유부단해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 2번은 협력하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

2번이 조화을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 2번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 2번이 민감함하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 봉사 둘 다 맞아요", "번갈아 하기: 2번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["협력", "봉사", "균형", "성장", "존중", "조화"]
        },

        '2-4': {
            score: 78,
            summary: '물과 땅의 안정적 조화',
            overall: `2번과 4번이 만나는 건 물과 땅의 안정적 조화예요. 2번은 협력, 조화, 민감함의 숫자이고, 4번은 안정, 체계, 실용성의 숫자예요.

수비학적으로 2+4=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

2번의 에너지는 물(水)이고, 4번의 에너지는 땅(土)이에요. 이 두 원소가 만나면 조화를 이루거나. 2번의 협력과 4번의 안정이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 2번은 협력하고, 4번은 안정해요. 이 차이가 서로를 보완해줘요.

2번이 조화할 때 4번은 체계해요. 함께 있으면 균형이 맞춰져요. 2번은 4번에게 민감함을 가르쳐주고, 4번은 2번에게 실용성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 4번이 균형을 맞춰주고, 4번이 경직성할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 4번은 안정을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["2번의 협력과 4번의 안정이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["2번의 우유부단과 4번의 경직성이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 4번은 안정이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 4번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 2번은 4번의 안정에 매력을 느끼고, 4번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 4번은 체계을 원해요. 번갈아 하면 좋아요. 2번 스타일로 한 번, 4번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 4번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 4번은 경직성해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 4번이 체계을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "2번의 우유부단과 4번의 경직성이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 4번에게서 안정을 배우고, 4번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 2번은 협력을 중요하게 생각하고 4번은 안정을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 4번은 체계하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 4번은 안정을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 2번은 우유부단해지고 4번은 경직성해져요. 서로 균형을 맞춰주면.`,
                strengths: ["2번의 협력과 4번의 안정이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "2번의 우유부단과 4번의 경직성이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 2번의 방식과 4번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 2번은 협력하게 일하고 4번은 안정하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

2번이 조화을 담당하고 4번이 체계을 맡으면 균형이 맞아요. 2번의 전문성과 4번의 실행력이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 2번은 민감함하게 하고 싶지만 4번은 실용성하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["2번의 협력과 4번의 안정이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "2번의 우유부단과 4번의 경직성이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 4번은 체계을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 2번은 협력하고 4번은 안정해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "2번의 협력과 4번의 안정이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 4번의 경직성이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 안정 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 2번이 민감함하고 4번이 실용성하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 안정 둘 다 맞아요", "번갈아 하기: 2번 방식, 4번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 달과 산처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["협력", "안정", "균형", "성장", "존중", "조화"]
        },

        '2-5': {
            score: 73,
            summary: '물과 바람의 불안정한 춤',
            overall: `2번과 5번이 만나는 건 물과 바람의 불안정한 춤예요. 2번은 협력, 조화, 민감함의 숫자이고, 5번은 자유, 변화, 모험의 숫자예요.

수비학적으로 2+5=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

2번의 에너지는 물(水)이고, 5번의 에너지는 바람(風)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 5번의 자유이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 5번은 자유해요. 이 차이가 서로를 보완해줘요.

2번이 조화할 때 5번은 변화해요. 함께 있으면 균형이 맞춰져요. 2번은 5번에게 민감함을 가르쳐주고, 5번은 2번에게 모험을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 5번이 균형을 맞춰주고, 5번이 불안정할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 5번은 자유을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["2번의 협력과 5번의 자유이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 5번의 불안정이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 5번은 자유이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 5번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 2번은 5번의 자유에 매력을 느끼고, 5번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 5번은 변화을 원해요. 번갈아 하면 좋아요. 2번 스타일로 한 번, 5번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 5번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 5번은 불안정해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 5번이 변화을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "2번의 우유부단과 5번의 불안정이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 5번에게서 자유을 배우고, 5번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 5번은 자유을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 5번은 변화하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 5번은 자유을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 2번은 우유부단해지고 5번은 불안정해져요. 서로 균형을 맞춰주면.`,
                strengths: ["2번의 협력과 5번의 자유이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "2번의 우유부단과 5번의 불안정이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 2번의 방식과 5번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 2번은 협력하게 일하고 5번은 자유하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

2번이 조화을 담당하고 5번이 변화을 맡으면 균형이 맞아요. 2번의 전문성과 5번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 2번은 민감함하게 하고 싶지만 5번은 모험하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["2번의 협력과 5번의 자유이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "2번의 우유부단과 5번의 불안정이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 5번은 변화을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 5번은 자유해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "2번의 협력과 5번의 자유이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 5번의 불안정이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 자유 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 2번이 민감함하고 5번이 모험하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 자유 둘 다 맞아요", "번갈아 하기: 2번 방식, 5번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 지혜을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["협력", "자유", "균형", "성장", "존중", "조화"]
        },

        '2-6': {
            score: 73,
            summary: '두 어머니의 온화한 만남',
            overall: `2번과 6번이 만나는 건 두 어머니의 온화한 만남예요. 2번은 협력, 조화, 민감함의 숫자이고, 6번은 사랑, 책임, 조화의 숫자예요.

수비학적으로 2+6=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

2번의 에너지는 물(水)이고, 6번의 에너지는 흙(土)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 6번의 사랑이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 6번은 사랑해요. 이 차이가 서로를 보완해줘요.

2번이 조화할 때 6번은 책임해요. 함께 있으면 긴장감이 있어요. 2번은 6번에게 민감함을 가르쳐주고, 6번은 2번에게 조화을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 6번이 균형을 맞춰주고, 6번이 간섭할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 6번은 사랑을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["2번의 협력과 6번의 사랑이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 6번의 간섭이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 6번은 사랑이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 6번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 2번은 6번의 사랑에 매력을 느끼고, 6번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 6번은 책임을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 6번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 6번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 6번은 간섭해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 6번이 책임을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 6번의 간섭이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 6번에게서 사랑을 배우고, 6번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 6번은 사랑을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 6번은 책임하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 6번은 사랑을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 2번은 우유부단해지고 6번은 간섭해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 6번의 사랑이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 6번의 간섭이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 6번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 2번은 협력하게 일하고 6번은 사랑하게 일해요. 이 차이가 조율이 필요하지만 좋은 팀이 돼요.

2번이 조화을 담당하고 6번이 책임을 맡으면 균형이 맞아요. 2번의 전문성과 6번의 실행력이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 6번은 조화하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 6번의 사랑이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 6번의 간섭이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 6번은 책임을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 6번은 사랑해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 6번의 사랑이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 6번의 간섭이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 사랑 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 2번이 민감함하고 6번이 조화하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 사랑 둘 다 맞아요", "번갈아 하기: 2번 방식, 6번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 권력을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["협력", "사랑", "균형", "성장", "존중", "조화"]
        },

        '2-7': {
            score: 73,
            summary: '달과 현자의 신비로운 대화',
            overall: `2번과 7번이 만나는 건 달과 현자의 신비로운 대화예요. 2번은 협력, 조화, 민감함의 숫자이고, 7번은 지혜, 분석, 영성의 숫자예요.

수비학적으로 2+7=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

2번의 에너지는 물(水)이고, 7번의 에너지는 에테르(靈)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 7번의 지혜이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 7번은 지혜해요. 이 차이가 서로를 보완해줘요.

2번이 조화할 때 7번은 분석해요. 함께 있으면 긴장감이 있어요. 2번은 7번에게 민감함을 가르쳐주고, 7번은 2번에게 영성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 7번이 균형을 맞춰주고, 7번이 고립할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 7번은 지혜을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["2번의 협력과 7번의 지혜이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 7번의 고립이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 7번은 지혜이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 7번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 7번의 지혜에 매력을 느끼고, 7번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 7번은 분석을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 7번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 7번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 7번은 고립해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 7번이 분석을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 7번의 고립이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 7번에게서 지혜을 배우고, 7번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 7번은 지혜을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 7번은 분석하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 7번은 지혜을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 2번은 우유부단해지고 7번은 고립해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 7번의 지혜이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 7번의 고립이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 7번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 2번은 협력하게 일하고 7번은 지혜하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

2번이 조화을 담당하고 7번이 분석을 맡으면 균형이 맞아요. 2번의 전문성과 7번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 7번은 영성하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 7번의 지혜이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 7번의 고립이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 7번은 분석을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 7번은 지혜해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 7번의 지혜이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 7번의 고립이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 지혜 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 2번이 민감함하고 7번이 영성하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 지혜 둘 다 맞아요", "번갈아 하기: 2번 방식, 7번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["협력", "지혜", "균형", "성장", "존중", "조화"]
        },

        '2-8': {
            score: 68,
            summary: '달과 왕의 긴장감',
            overall: `2번과 8번이 만나는 건 달과 왕의 긴장감예요. 2번은 협력, 조화, 민감함의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 2+8=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

2번의 에너지는 물(水)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 8번의 권력이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 8번은 권력해요. 이 차이가 서로를 보완해줘요.

2번이 조화할 때 8번은 성공해요. 함께 있으면 긴장감이 있어요. 2번은 8번에게 민감함을 가르쳐주고, 8번은 2번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["2번의 협력과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 8번의 탐욕이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 8번의 권력에 매력을 느끼고, 8번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 8번은 성공을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 8번은 탐욕해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 8번에게서 권력을 배우고, 8번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 8번은 성공하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 8번은 권력을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 2번은 우유부단해지고 8번은 탐욕해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 8번의 권력이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 8번의 탐욕이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 2번은 협력하게 일하고 8번은 권력하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

2번이 조화을 담당하고 8번이 성공을 맡으면 균형이 맞아요. 2번의 전문성과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 8번의 권력이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 8번의 탐욕이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 8번은 성공을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 8번은 권력해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 8번의 권력이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 8번의 탐욕이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 권력 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 2번이 민감함하고 8번이 물질하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 권력 둘 다 맞아요", "번갈아 하기: 2번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["협력", "권력", "균형", "성장", "존중", "조화"]
        },

        '2-9': {
            score: 62,
            summary: '달과 성자의 깊은 공감',
            overall: `2번과 9번이 만나는 건 달과 성자의 깊은 공감예요. 2번은 협력, 조화, 민감함의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 2+9=11이에요. 11은 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 직관과 영감을 배워야 해요.

2번의 에너지는 물(水)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 긴장을 만들어요. 2번의 협력과 9번의 완성이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 2번은 협력하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

2번이 조화할 때 9번은 박애해요. 함께 있으면 긴장감이 있어요. 2번은 9번에게 민감함을 가르쳐주고, 9번은 2번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 2번이 우유부단할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 2번이 도와줘요.

하지만 가치관이 다를 수 있어요. 2번은 협력을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["2번의 협력과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["2번의 우유부단과 9번의 이상주의이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 2번은 협력이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 2번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 2번은 9번의 완성에 매력을 느끼고, 9번은 2번의 협력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 2번은 조화을 원하고 9번은 박애을 원해요. 절충안을 찾아야 해요. 2번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 2번은 조용히 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 2번은 우유부단해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "2번이 조화을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "2번의 우유부단과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 2번은 9번에게서 완성을 배우고, 9번은 2번에게서 협력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 2번은 협력을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 2번은 조화하게 하고 9번은 박애하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 2번은 아이에게 협력을 가르치고 9번은 완성을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 2번은 우유부단해지고 9번은 이상주의해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["2번의 협력과 9번의 완성이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "2번의 우유부단과 9번의 이상주의이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 2번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 2번은 협력하게 일하고 9번은 완성하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

2번이 조화을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 2번의 전문성과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 2번은 민감함하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["2번의 협력과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "2번의 우유부단과 9번의 이상주의이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 2번은 조화, 9번은 박애을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 2번은 협력하고 9번은 완성해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "2번의 협력과 9번의 완성이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "2번의 우유부단과 9번의 이상주의이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["협력과 완성 통합하기: 두 에너지의 균형을 찾으세요", "직관 달성하기: 11번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 2번이 민감함하고 9번이 지혜하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 협력과 완성 둘 다 맞아요", "번갈아 하기: 2번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "직관 함께 배우기: 11번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["협력", "완성", "균형", "성장", "존중", "조화"]
        },

        '22-22': {
            score: 73,
            summary: '두 건축가의 만남',
            overall: `22번과 22번이 만나는 건 두 개의 건축가가 같은 공간에 있는 것과 같아요. 22번은 비전, 실행력, 야심의 숫자예요. 마스터 건축가의 에너지. 큰 비전을 실현하는 마스터 넘버.

수비학적으로 22+22=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 두 개의 건축가가 만나면 더 강력한 왕 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

22번의 에너지는 창조(創)이에요. 두 개의 창조(創)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 비전을 중요하게 생각하고, 실행력을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 22번의 어려움을 22번만큼 잘 아는 사람은 없으니까요. 압박감이나 독재같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 야심을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 압박감하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 비전을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "실행력을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 압박감하면 서로 말려주지 못해요", "경쟁심이 생기면 독재해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 야심, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 압박감해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 압박감한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 비전을 함께 추구하고 실행력을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 야심을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 압박감하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "비전을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 압박감하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 비전한 사람이 갑자기 압박감해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 비전을 중요하게 생각하니까 가족의 방향성이 명확해요. 실행력을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 야심을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 비전을 가르치고 실행력을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 압박감해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 압박감하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 비전하려 할 때 한 사람은 반대로 압박감을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 70,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 비전을 중요시하고 실행력한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 야심, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 압박감해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 압박감하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 비전을 함께 중요시하고 실행력을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "비전을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 압박감하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["압박감 극복하기: 비전의 어두운 면을 인식하세요", "권력 배우기: 8번의 에너지를 통해 성장하세요", "균형 잡기: 너무 실행력하지 말고 반대도 시도하세요"],
                pastLife: `함께 야심한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "압박감 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "권력 추구하기: 8번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 왕의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["비전", "실행력", "협력", "이해", "변화", "유연성"]
        },

        '22-33': {
            score: 62,
            summary: '건축가과 스승의 만남',
            overall: `22번과 33번이 만나는 건 건축가과 스승의 만남예요. 22번은 비전, 실행력, 야심의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 22+33=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

22번의 에너지는 창조(創)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 22번의 비전과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 22번은 비전하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

22번이 실행력할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 22번은 33번에게 야심을 가르쳐주고, 33번은 22번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 22번이 압박감할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 22번이 도와줘요.

하지만 가치관이 다를 수 있어요. 22번은 비전을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["22번의 비전과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["22번의 압박감과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 22번은 비전이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 22번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 22번은 33번의 봉사에 매력을 느끼고, 33번은 22번의 비전에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 22번은 실행력을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 22번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 22번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 22번은 압박감해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "22번이 실행력을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "22번의 압박감과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 22번은 33번에게서 봉사을 배우고, 33번은 22번에게서 비전을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 22번은 비전을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 22번은 실행력하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 22번은 아이에게 비전을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 22번은 압박감해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["22번의 비전과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "22번의 압박감과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 22번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 22번은 비전하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

22번이 실행력을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 22번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 22번은 야심하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["22번의 비전과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "22번의 압박감과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 22번은 실행력, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 22번은 비전하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "22번의 비전과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "22번의 압박감과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["비전과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 22번이 야심하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 비전과 봉사 둘 다 맞아요", "번갈아 하기: 22번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["비전", "봉사", "균형", "성장", "존중", "조화"]
        },

        '3-11': {
            score: 62,
            summary: '별과 영감의 만남',
            overall: `3번과 11번이 만나는 건 별과 영감의 만남예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 3+11=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

3번의 에너지는 공기(風)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

3번이 표현력할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 3번은 11번에게 즐거움을 가르쳐주고, 11번은 3번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["3번의 창의성과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 3번은 11번의 직관에 매력을 느끼고, 11번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 3번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 11번에게서 직관을 배우고, 11번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 11번은 직관을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 3번은 산만함해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["3번의 창의성과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "3번의 산만함과 11번의 불안이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 3번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 3번은 창의성하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

3번이 표현력을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 3번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["3번의 창의성과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "3번의 산만함과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "3번의 창의성과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "3번의 산만함과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 직관 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 3번이 즐거움하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 직관 둘 다 맞아요", "번갈아 하기: 3번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["창의성", "직관", "균형", "성장", "존중", "조화"]
        },

        '3-22': {
            score: 62,
            summary: '별과 건축가의 만남',
            overall: `3번과 22번이 만나는 건 별과 건축가의 만남예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 3+22=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

3번의 에너지는 공기(風)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

3번이 표현력할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 3번은 22번에게 즐거움을 가르쳐주고, 22번은 3번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["3번의 창의성과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 3번은 22번의 비전에 매력을 느끼고, 22번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 3번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 22번에게서 비전을 배우고, 22번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 3번은 산만함해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["3번의 창의성과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "3번의 산만함과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 3번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 3번은 창의성하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

3번이 표현력을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 3번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["3번의 창의성과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "3번의 산만함과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "3번의 창의성과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "3번의 산만함과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 비전 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 3번이 즐거움하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 비전 둘 다 맞아요", "번갈아 하기: 3번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["창의성", "비전", "균형", "성장", "존중", "조화"]
        },

        '3-3': {
            score: 72,
            summary: '두 별의 만남',
            overall: `3번과 3번이 만나는 건 두 개의 별가 같은 공간에 있는 것과 같아요. 3번은 창의성, 표현력, 즐거움의 숫자예요. 별의 에너지. 반짝이고 표현하는 숫자.

수비학적으로 3+3=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 두 개의 별가 만나면 더 강력한 어머니 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

3번의 에너지는 공기(風)이에요. 두 개의 공기(風)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 창의성을 중요하게 생각하고, 표현력을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 3번의 어려움을 3번만큼 잘 아는 사람은 없으니까요. 산만함이나 피상성같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 즐거움을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 산만함하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 창의성을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "표현력을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 산만함하면 서로 말려주지 못해요", "경쟁심이 생기면 피상성해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 즐거움, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 산만함해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 산만함한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 창의성을 함께 추구하고 표현력을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 즐거움을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 감정적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 산만함하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "창의성을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 산만함하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 창의성한 사람이 갑자기 산만함해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 창의성을 중요하게 생각하니까 가족의 방향성이 명확해요. 표현력을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 즐거움을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 창의성을 가르치고 표현력을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 산만함해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 산만함하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 창의성하려 할 때 한 사람은 반대로 산만함을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 65,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 창의성을 중요시하고 표현력한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 즐거움, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 산만함해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 산만함하면 정체돼요", "방향 설정이 어려워요", "새로운 아이디어나 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 창의성을 함께 중요시하고 표현력을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "창의성을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 산만함하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 대화하고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["산만함 극복하기: 창의성의 어두운 면을 인식하세요", "사랑 배우기: 6번의 에너지를 통해 성장하세요", "균형 잡기: 너무 표현력하지 말고 반대도 시도하세요"],
                pastLife: `함께 즐거움한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "산만함 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "사랑 추구하기: 6번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 어머니의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["창의성", "표현력", "협력", "이해", "변화", "유연성"]
        },

        '3-33': {
            score: 62,
            summary: '별과 스승의 만남',
            overall: `3번과 33번이 만나는 건 별과 스승의 만남예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 3+33=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

3번의 에너지는 공기(風)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

3번이 표현력할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 3번은 33번에게 즐거움을 가르쳐주고, 33번은 3번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["3번의 창의성과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 3번은 33번의 봉사에 매력을 느끼고, 33번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 3번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 33번에게서 봉사을 배우고, 33번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 3번은 산만함해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["3번의 창의성과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "3번의 산만함과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 3번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 3번은 창의성하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

3번이 표현력을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 3번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["3번의 창의성과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "3번의 산만함과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "3번의 창의성과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "3번의 산만함과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 3번이 즐거움하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 봉사 둘 다 맞아요", "번갈아 하기: 3번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["창의성", "봉사", "균형", "성장", "존중", "조화"]
        },

        '3-4': {
            score: 80,
            summary: '별과 산의 대조',
            overall: `3번과 4번이 만나는 건 별과 산의 대조예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 4번은 안정, 체계, 실용성의 숫자예요.

수비학적으로 3+4=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

3번의 에너지는 공기(風)이고, 4번의 에너지는 땅(土)이에요. 이 두 원소가 만나면 조화를 이루거나. 3번의 창의성과 4번의 안정이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 3번은 창의성하고, 4번은 안정해요. 이 차이가 서로를 보완해줘요.

3번이 표현력할 때 4번은 체계해요. 함께 있으면 균형이 맞춰져요. 3번은 4번에게 즐거움을 가르쳐주고, 4번은 3번에게 실용성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 4번이 균형을 맞춰주고, 4번이 경직성할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 4번은 안정을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["3번의 창의성과 4번의 안정이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["3번의 산만함과 4번의 경직성이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 4번은 안정이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 4번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 3번은 4번의 안정에 매력을 느끼고, 4번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 4번은 체계을 원해요. 번갈아 하면 좋아요. 3번 스타일로 한 번, 4번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 4번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 4번은 경직성해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 4번이 체계을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "3번의 산만함과 4번의 경직성이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 4번에게서 안정을 배우고, 4번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 4번은 안정을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 4번은 체계하게 해요. 번갈아 하면 좋아요. 한 사람이 쓰려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 4번은 안정을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 3번은 산만함해지고 4번은 경직성해져요. 서로 균형을 맞춰주면.`,
                strengths: ["3번의 창의성과 4번의 안정이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "3번의 산만함과 4번의 경직성이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 3번의 방식과 4번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 3번은 창의성하게 일하고 4번은 안정하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

3번이 표현력을 담당하고 4번이 체계을 맡으면 균형이 맞아요. 3번의 전문성과 4번의 실행력이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 4번은 실용성하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["3번의 창의성과 4번의 안정이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "3번의 산만함과 4번의 경직성이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 4번은 체계을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 3번은 창의성하고 4번은 안정해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "3번의 창의성과 4번의 안정이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 4번의 경직성이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 안정 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 3번이 즐거움하고 4번이 실용성하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 안정 둘 다 맞아요", "번갈아 하기: 3번 방식, 4번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 별과 산처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["창의성", "안정", "균형", "성장", "존중", "조화"]
        },

        '3-5': {
            score: 78,
            summary: '별과 바람의 자유로운 여행',
            overall: `3번과 5번이 만나는 건 별과 바람의 자유로운 여행예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 5번은 자유, 변화, 모험의 숫자예요.

수비학적으로 3+5=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

3번의 에너지는 공기(風)이고, 5번의 에너지는 바람(風)이에요. 이 두 원소가 만나면 조화를 이루거나. 3번의 창의성과 5번의 자유이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 3번은 창의성하고, 5번은 자유해요. 이 차이가 서로를 보완해줘요.

3번이 표현력할 때 5번은 변화해요. 함께 있으면 균형이 맞춰져요. 3번은 5번에게 즐거움을 가르쳐주고, 5번은 3번에게 모험을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 5번이 균형을 맞춰주고, 5번이 불안정할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 5번은 자유을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["3번의 창의성과 5번의 자유이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["3번의 산만함과 5번의 불안정이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 5번은 자유이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 5번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 3번은 5번의 자유에 매력을 느끼고, 5번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 5번은 변화을 원해요. 번갈아 하면 좋아요. 3번 스타일로 한 번, 5번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 5번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 5번은 불안정해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 5번이 변화을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "3번의 산만함과 5번의 불안정이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 5번에게서 자유을 배우고, 5번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 5번은 자유을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 5번은 변화하게 해요. 번갈아 하면 좋아요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 5번은 자유을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 3번은 산만함해지고 5번은 불안정해져요. 서로 균형을 맞춰주면.`,
                strengths: ["3번의 창의성과 5번의 자유이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "3번의 산만함과 5번의 불안정이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 3번의 방식과 5번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 3번은 창의성하게 일하고 5번은 자유하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

3번이 표현력을 담당하고 5번이 변화을 맡으면 균형이 맞아요. 3번의 전문성과 5번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 5번은 모험하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["3번의 창의성과 5번의 자유이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "3번의 산만함과 5번의 불안정이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 5번은 변화을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 3번은 창의성하고 5번은 자유해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "3번의 창의성과 5번의 자유이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 5번의 불안정이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 자유 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 3번이 즐거움하고 5번이 모험하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 자유 둘 다 맞아요", "번갈아 하기: 3번 방식, 5번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 별과 바람처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["창의성", "자유", "균형", "성장", "존중", "조화"]
        },

        '3-6': {
            score: 73,
            summary: '별과 대지의 창조적 양육',
            overall: `3번과 6번이 만나는 건 별과 대지의 창조적 양육예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 6번은 사랑, 책임, 조화의 숫자예요.

수비학적으로 3+6=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

3번의 에너지는 공기(風)이고, 6번의 에너지는 흙(土)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 6번의 사랑이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 6번은 사랑해요. 이 차이가 서로를 보완해줘요.

3번이 표현력할 때 6번은 책임해요. 함께 있으면 균형이 맞춰져요. 3번은 6번에게 즐거움을 가르쳐주고, 6번은 3번에게 조화을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 6번이 균형을 맞춰주고, 6번이 간섭할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 6번은 사랑을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["3번의 창의성과 6번의 사랑이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 6번의 간섭이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 6번은 사랑이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 6번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 3번은 6번의 사랑에 매력을 느끼고, 6번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 6번은 책임을 원해요. 번갈아 하면 좋아요. 3번 스타일로 한 번, 6번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 6번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 6번은 간섭해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 6번이 책임을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "3번의 산만함과 6번의 간섭이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 6번에게서 사랑을 배우고, 6번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 6번은 사랑을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 6번은 책임하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 6번은 사랑을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 3번은 산만함해지고 6번은 간섭해져요. 서로 균형을 맞춰주면.`,
                strengths: ["3번의 창의성과 6번의 사랑이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "3번의 산만함과 6번의 간섭이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 3번의 방식과 6번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 3번은 창의성하게 일하고 6번은 사랑하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

3번이 표현력을 담당하고 6번이 책임을 맡으면 균형이 맞아요. 3번의 전문성과 6번의 실행력이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 6번은 조화하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["3번의 창의성과 6번의 사랑이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "3번의 산만함과 6번의 간섭이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 6번은 책임을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 6번은 사랑해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "3번의 창의성과 6번의 사랑이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 6번의 간섭이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 사랑 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 3번이 즐거움하고 6번이 조화하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 사랑 둘 다 맞아요", "번갈아 하기: 3번 방식, 6번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 완성을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["창의성", "사랑", "균형", "성장", "존중", "조화"]
        },

        '3-7': {
            score: 73,
            summary: '별과 현자의 이질적 만남',
            overall: `3번과 7번이 만나는 건 별과 현자의 이질적 만남예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 7번은 지혜, 분석, 영성의 숫자예요.

수비학적으로 3+7=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

3번의 에너지는 공기(風)이고, 7번의 에너지는 에테르(靈)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 7번의 지혜이 서로를 보완해요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 7번은 지혜해요. 이 차이가 서로를 보완해줘요.

3번이 표현력할 때 7번은 분석해요. 함께 있으면 긴장감이 있어요. 3번은 7번에게 즐거움을 가르쳐주고, 7번은 3번에게 영성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 7번이 균형을 맞춰주고, 7번이 고립할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 7번은 지혜을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["3번의 창의성과 7번의 지혜이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 7번의 고립이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 7번은 지혜이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 7번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 3번은 7번의 지혜에 매력을 느끼고, 7번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 7번은 분석을 원해요. 절충안을 찾아야 해요. 3번 스타일로 한 번, 7번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 7번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 7번은 고립해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 7번이 분석을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 7번의 고립이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 7번에게서 지혜을 배우고, 7번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 7번은 지혜을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 7번은 분석하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 7번은 지혜을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 3번은 산만함해지고 7번은 고립해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["3번의 창의성과 7번의 지혜이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "3번의 산만함과 7번의 고립이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 3번의 방식과 7번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 3번은 창의성하게 일하고 7번은 지혜하게 일해요. 이 차이가 조율이 필요하지만 좋은 팀이 돼요.

3번이 표현력을 담당하고 7번이 분석을 맡으면 균형이 맞아요. 3번의 전문성과 7번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 7번은 영성하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["3번의 창의성과 7번의 지혜이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "3번의 산만함과 7번의 고립이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 7번은 분석을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 7번은 지혜해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "3번의 창의성과 7번의 지혜이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "3번의 산만함과 7번의 고립이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 지혜 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 3번이 즐거움하고 7번이 영성하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 지혜 둘 다 맞아요", "번갈아 하기: 3번 방식, 7번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 독립적을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["창의성", "지혜", "균형", "성장", "존중", "조화"]
        },

        '3-8': {
            score: 73,
            summary: '별과 왕의 화려한 무대',
            overall: `3번과 8번이 만나는 건 별과 왕의 화려한 무대예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 3+8=11이에요. 11은 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 직관과 영감을 배워야 해요.

3번의 에너지는 공기(風)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 8번의 권력이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 8번은 권력해요. 이 차이가 때로 충돌해요.

3번이 표현력할 때 8번은 성공해요. 함께 있으면 긴장감이 있어요. 3번은 8번에게 즐거움을 가르쳐주고, 8번은 3번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["3번의 창의성과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 8번의 탐욕이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 3번은 8번의 권력에 매력을 느끼고, 8번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 8번은 성공을 원해요. 절충안을 찾아야 해요. 3번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 8번은 탐욕해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 8번에게서 권력을 배우고, 8번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 8번은 성공하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 모으려 하거나 싸워요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 8번은 권력을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 3번은 산만함해지고 8번은 탐욕해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["3번의 창의성과 8번의 권력이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "3번의 산만함과 8번의 탐욕이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 3번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 3번은 창의성하게 일하고 8번은 권력하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

3번이 표현력을 담당하고 8번이 성공을 맡으면 균형이 맞아요. 3번의 전문성과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["3번의 창의성과 8번의 권력이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "3번의 산만함과 8번의 탐욕이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 8번은 성공을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 8번은 권력해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "3번의 창의성과 8번의 권력이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "3번의 산만함과 8번의 탐욕이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 권력 통합하기: 두 에너지의 균형을 찾으세요", "직관 달성하기: 11번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 3번이 즐거움하고 8번이 물질하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 권력 둘 다 맞아요", "번갈아 하기: 3번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "직관 함께 배우기: 11번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["창의성", "권력", "균형", "성장", "존중", "조화"]
        },

        '3-9': {
            score: 68,
            summary: '별과 성자의 보편적 표현',
            overall: `3번과 9번이 만나는 건 별과 성자의 보편적 표현예요. 3번은 창의성, 표현력, 즐거움의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 3+9=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

3번의 에너지는 공기(風)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 긴장을 만들어요. 3번의 창의성과 9번의 완성이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 3번은 창의성하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

3번이 표현력할 때 9번은 박애해요. 함께 있으면 긴장감이 있어요. 3번은 9번에게 즐거움을 가르쳐주고, 9번은 3번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 3번이 산만함할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 3번이 도와줘요.

하지만 가치관이 다를 수 있어요. 3번은 창의성을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["3번의 창의성과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["3번의 산만함과 9번의 이상주의이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 3번은 창의성이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 3번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 3번은 9번의 완성에 매력을 느끼고, 9번은 3번의 창의성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 3번은 표현력을 원하고 9번은 박애을 원해요. 절충안을 찾아야 해요. 3번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 3번은 직접적으로 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 3번은 산만함해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "3번이 표현력을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "3번의 산만함과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 3번은 9번에게서 완성을 배우고, 9번은 3번에게서 창의성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 3번은 창의성을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 3번은 표현력하게 하고 9번은 박애하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 3번은 아이에게 창의성을 가르치고 9번은 완성을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 3번은 산만함해지고 9번은 이상주의해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["3번의 창의성과 9번의 완성이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "3번의 산만함과 9번의 이상주의이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 3번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 3번은 창의성하게 일하고 9번은 완성하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

3번이 표현력을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 3번의 전문성과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 3번은 즐거움하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["3번의 창의성과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "3번의 산만함과 9번의 이상주의이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 3번은 표현력, 9번은 박애을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 3번은 창의성하고 9번은 완성해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "3번의 창의성과 9번의 완성이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "3번의 산만함과 9번의 이상주의이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["창의성과 완성 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 3번이 즐거움하고 9번이 지혜하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 창의성과 완성 둘 다 맞아요", "번갈아 하기: 3번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["창의성", "완성", "균형", "성장", "존중", "조화"]
        },

        '33-33': {
            score: 73,
            summary: '두 스승의 만남',
            overall: `33번과 33번이 만나는 건 두 개의 스승가 같은 공간에 있는 것과 같아요. 33번은 봉사, 가르침, 사랑의 숫자예요. 마스터 스승의 에너지. 무조건적 사랑과 봉사의 마스터 넘버.

수비학적으로 33+33=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 두 개의 스승가 만나면 더 강력한 별 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

33번의 에너지는 사랑(愛)이에요. 두 개의 사랑(愛)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 봉사을 중요하게 생각하고, 가르침을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 33번의 어려움을 33번만큼 잘 아는 사람은 없으니까요. 순교이나 희생같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 사랑을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 순교하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 봉사을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "가르침을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 순교하면 서로 말려주지 못해요", "경쟁심이 생기면 희생해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 사랑, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 순교해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 순교한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 봉사을 함께 추구하고 가르침을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 사랑을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 순교하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "봉사을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 순교하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 봉사한 사람이 갑자기 순교해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 봉사을 중요하게 생각하니까 가족의 방향성이 명확해요. 가르침을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 사랑을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 봉사을 가르치고 가르침을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 순교해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 순교하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 봉사하려 할 때 한 사람은 반대로 순교을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 70,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 봉사을 중요시하고 가르침한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 사랑, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 순교해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 순교하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 봉사을 함께 중요시하고 가르침을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "봉사을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 순교하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["순교 극복하기: 봉사의 어두운 면을 인식하세요", "창의성 배우기: 3번의 에너지를 통해 성장하세요", "균형 잡기: 너무 가르침하지 말고 반대도 시도하세요"],
                pastLife: `함께 사랑한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "순교 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "창의성 추구하기: 3번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 별의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["봉사", "가르침", "협력", "이해", "변화", "유연성"]
        },

        '4-11': {
            score: 62,
            summary: '산과 영감의 만남',
            overall: `4번과 11번이 만나는 건 산과 영감의 만남예요. 4번은 안정, 체계, 실용성의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 4+11=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

4번의 에너지는 땅(土)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 4번의 안정과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 4번은 안정하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

4번이 체계할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 4번은 11번에게 실용성을 가르쳐주고, 11번은 4번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["4번의 안정과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["4번의 경직성과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 4번은 11번의 직관에 매력을 느끼고, 11번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 4번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 11번에게서 직관을 배우고, 11번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 4번은 안정을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 11번은 직관을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 4번은 경직성해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["4번의 안정과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "4번의 경직성과 11번의 불안이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 4번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 4번은 안정하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

4번이 체계을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 4번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 4번은 실용성하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["4번의 안정과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "4번의 경직성과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 4번은 안정하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "4번의 안정과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "4번의 경직성과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 직관 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 4번이 실용성하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 직관 둘 다 맞아요", "번갈아 하기: 4번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["안정", "직관", "균형", "성장", "존중", "조화"]
        },

        '4-22': {
            score: 62,
            summary: '산과 건축가의 만남',
            overall: `4번과 22번이 만나는 건 산과 건축가의 만남예요. 4번은 안정, 체계, 실용성의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 4+22=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

4번의 에너지는 땅(土)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 4번의 안정과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 4번은 안정하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

4번이 체계할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 4번은 22번에게 실용성을 가르쳐주고, 22번은 4번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["4번의 안정과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["4번의 경직성과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 4번은 22번의 비전에 매력을 느끼고, 22번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 4번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 22번에게서 비전을 배우고, 22번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 4번은 안정을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 4번은 경직성해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["4번의 안정과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "4번의 경직성과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 4번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 4번은 안정하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

4번이 체계을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 4번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 4번은 실용성하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["4번의 안정과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "4번의 경직성과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 4번은 안정하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "4번의 안정과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "4번의 경직성과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 비전 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 4번이 실용성하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 비전 둘 다 맞아요", "번갈아 하기: 4번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["안정", "비전", "균형", "성장", "존중", "조화"]
        },

        '4-33': {
            score: 62,
            summary: '산과 스승의 만남',
            overall: `4번과 33번이 만나는 건 산과 스승의 만남예요. 4번은 안정, 체계, 실용성의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 4+33=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

4번의 에너지는 땅(土)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 4번의 안정과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 4번은 안정하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

4번이 체계할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 4번은 33번에게 실용성을 가르쳐주고, 33번은 4번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["4번의 안정과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["4번의 경직성과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 4번은 33번의 봉사에 매력을 느끼고, 33번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 4번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 33번에게서 봉사을 배우고, 33번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 4번은 안정을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 4번은 경직성해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["4번의 안정과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "4번의 경직성과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 4번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 4번은 안정하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

4번이 체계을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 4번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 4번은 실용성하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["4번의 안정과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "4번의 경직성과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 4번은 안정하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "4번의 안정과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "4번의 경직성과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 4번이 실용성하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 봉사 둘 다 맞아요", "번갈아 하기: 4번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["안정", "봉사", "균형", "성장", "존중", "조화"]
        },

        '4-4': {
            score: 80,
            summary: '두 산의 만남',
            overall: `4번과 4번이 만나는 건 두 개의 산가 같은 공간에 있는 것과 같아요. 4번은 안정, 체계, 실용성의 숫자예요. 산의 에너지. 단단하고 움직이지 않는 숫자.

수비학적으로 4+4=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 두 개의 산가 만나면 더 강력한 왕 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

4번의 에너지는 땅(土)이에요. 두 개의 땅(土)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 안정을 중요하게 생각하고, 체계을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 4번의 어려움을 4번만큼 잘 아는 사람은 없으니까요. 경직성이나 완고함같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 실용성을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 경직성하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 안정을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "체계을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 경직성하면 서로 말려주지 못해요", "경쟁심이 생기면 완고함해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 실용성, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 경직성해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 경직성한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 편안하지만 설렘은 적어요. 안정을 함께 추구하고 체계을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 실용성을 좋아하니까 루틴이 생겨요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 냉정하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 경직성하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "안정을 공유해요. 같은 방향을 봐요", "다툼이 적고 평화로워요"],
                challenges: ["설렘이 부족해요. 너무 익숙해요", "둘 다 경직성하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 안정한 사람이 갑자기 경직성해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 85,
                description: `결혼하면 두 사람은 안정적인 가정을 꾸려요. 둘 다 안정을 중요하게 생각하니까 가족의 방향성이 명확해요. 체계을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 체계적이고 안정적이에요. 실용성을 중요시해서 저축을 잘하고 비슷해요. 재정 문제로 싸울 일이 적어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 안정을 가르치고 체계을 중요하게 여겨요. 일관성이 있어서 아이가 혼란스러워하지 않아요.

하지만 둘 다 경직성해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 일중독 부부가 될 수 있어요.`,
                strengths: ["가치관이 일치해요. 방향성이 명확해요", "경제적으로 안정적이에요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 경직성하면 정체돼요", "감정 표현이 부족할 수 있어요", "일중독 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 안정하려 할 때 한 사람은 반대로 경직성을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 감정 나누기 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 85,
                description: `함께 일하면 두 사람은 체계적이고 효율적으로 일해요. 둘 다 안정을 중요시하고 체계한 방식을 선호해요. 업무 스타일이 맞아서 효율이 높아요.

역할 분담을 명확히 하면 시너지가 나요. 한 사람은 실용성, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

마감일을 지키고 품질을 보장해요. 책임감이 강해서 프로젝트를 완수해요.

하지만 둘 다 경직성해지면 문제가 커져요. 방향성을 잃어요. 완고해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 일치해요", "효율이 높아요", "서로를 잘 이해해서 협업이 매끄러워요"],
                challenges: ["둘 다 경직성하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 실행... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 83,
                description: `가족으로서 두 사람은 안정적이고 든든해요. 부모-자식이든 형제자매든 안정을 함께 중요시하고 체계을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "안정을 공유해서 가족의 유대가 강해요", "안정적이고 예측 가능해요"],
                challenges: ["너무 비슷해서 새로운 관점이 부족해요", "둘 다 경직성하면 관계가 어려워져요", "감정 표현이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 감정을 나누세요.`
            },

            karma: {
                tasks: ["경직성 극복하기: 안정의 어두운 면을 인식하세요", "권력 배우기: 8번의 에너지를 통해 성장하세요", "균형 잡기: 너무 체계하지 말고 반대도 시도하세요"],
                pastLife: `함께 실용성한 영혼들이에요. 아마 같은 목표를 추구했거나 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "경직성 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "권력 추구하기: 8번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 왕의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["안정", "체계", "협력", "이해", "변화", "유연성"]
        },

        '4-5': {
            score: 80,
            summary: '산과 바람의 정반대',
            overall: `4번과 5번이 만나는 건 산과 바람의 정반대예요. 4번은 안정, 체계, 실용성의 숫자이고, 5번은 자유, 변화, 모험의 숫자예요.

수비학적으로 4+5=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

4번의 에너지는 땅(土)이고, 5번의 에너지는 바람(風)이에요. 이 두 원소가 만나면 조화를 이루거나. 4번의 안정과 5번의 자유이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 4번은 안정하고, 5번은 자유해요. 이 차이가 서로를 보완해줘요.

4번이 체계할 때 5번은 변화해요. 함께 있으면 균형이 맞춰져요. 4번은 5번에게 실용성을 가르쳐주고, 5번은 4번에게 모험을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 5번이 균형을 맞춰주고, 5번이 불안정할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 5번은 자유을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["4번의 안정과 5번의 자유이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["4번의 경직성과 5번의 불안정이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 5번은 자유이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 5번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 4번은 5번의 자유에 매력을 느끼고, 5번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 5번은 변화을 원해요. 번갈아 하면 좋아요. 4번 스타일로 한 번, 5번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 5번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 5번은 불안정해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 5번이 변화을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "4번의 경직성과 5번의 불안정이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 5번에게서 자유을 배우고, 5번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 4번은 안정을 중요하게 생각하고 5번은 자유을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 5번은 변화하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 5번은 자유을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 4번은 경직성해지고 5번은 불안정해져요. 서로 균형을 맞춰주면.`,
                strengths: ["4번의 안정과 5번의 자유이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "4번의 경직성과 5번의 불안정이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 4번의 방식과 5번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 4번은 안정하게 일하고 5번은 자유하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

4번이 체계을 담당하고 5번이 변화을 맡으면 균형이 맞아요. 4번의 전문성과 5번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 4번은 실용성하게 하고 싶지만 5번은 모험하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["4번의 안정과 5번의 자유이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "4번의 경직성과 5번의 불안정이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 5번은 변화을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 4번은 안정하고 5번은 자유해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "4번의 안정과 5번의 자유이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 5번의 불안정이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 자유 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 4번이 실용성하고 5번이 모험하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 자유 둘 다 맞아요", "번갈아 하기: 4번 방식, 5번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 산과 바람처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["안정", "자유", "균형", "성장", "존중", "조화"]
        },

        '4-6': {
            score: 78,
            summary: '두 대지의 견고한 기반',
            overall: `4번과 6번이 만나는 건 두 대지의 견고한 기반예요. 4번은 안정, 체계, 실용성의 숫자이고, 6번은 사랑, 책임, 조화의 숫자예요.

수비학적으로 4+6=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

4번의 에너지는 땅(土)이고, 6번의 에너지는 흙(土)이에요. 이 두 원소가 만나면 조화를 이루거나. 4번의 안정과 6번의 사랑이 서로를 보완해요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 4번은 안정하고, 6번은 사랑해요. 이 차이가 서로를 보완해줘요.

4번이 체계할 때 6번은 책임해요. 함께 있으면 균형이 맞춰져요. 4번은 6번에게 실용성을 가르쳐주고, 6번은 4번에게 조화을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 6번이 균형을 맞춰주고, 6번이 간섭할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 6번은 사랑을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["4번의 안정과 6번의 사랑이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["4번의 경직성과 6번의 간섭이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 6번은 사랑이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 6번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 4번은 6번의 사랑에 매력을 느끼고, 6번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 6번은 책임을 원해요. 번갈아 하면 좋아요. 4번 스타일로 한 번, 6번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 6번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 6번은 간섭해져요. 대화로 풀어야해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 6번이 책임을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "4번의 경직성과 6번의 간섭이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 6번에게서 사랑을 배우고, 6번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 4번은 안정을 중요하게 생각하고 6번은 사랑을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 6번은 책임하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 6번은 사랑을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 4번은 경직성해지고 6번은 간섭해져요. 서로 균형을 맞춰주면.`,
                strengths: ["4번의 안정과 6번의 사랑이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "4번의 경직성과 6번의 간섭이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 4번의 방식과 6번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 4번은 안정하게 일하고 6번은 사랑하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

4번이 체계을 담당하고 6번이 책임을 맡으면 균형이 맞아요. 4번의 전문성과 6번의 실행력이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 4번은 실용성하게 하고 싶지만 6번은 조화하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["4번의 안정과 6번의 사랑이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "4번의 경직성과 6번의 간섭이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 6번은 책임을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 4번은 안정하고 6번은 사랑해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "4번의 안정과 6번의 사랑이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 6번의 간섭이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 사랑 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 4번이 실용성하고 6번이 조화하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 사랑 둘 다 맞아요", "번갈아 하기: 4번 방식, 6번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 산과 어머니처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["안정", "사랑", "균형", "성장", "존중", "조화"]
        },

        '4-7': {
            score: 73,
            summary: '산과 현자의 고독한 만남',
            overall: `4번과 7번이 만나는 건 산과 현자의 고독한 만남예요. 4번은 안정, 체계, 실용성의 숫자이고, 7번은 지혜, 분석, 영성의 숫자예요.

수비학적으로 4+7=11이에요. 11은 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 직관과 영감을 배워야 해요.

4번의 에너지는 땅(土)이고, 7번의 에너지는 에테르(靈)이에요. 이 두 원소가 만나면 긴장을 만들어요. 4번의 안정과 7번의 지혜이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 4번은 안정하고, 7번은 지혜해요. 이 차이가 때로 충돌해요.

4번이 체계할 때 7번은 분석해요. 함께 있으면 균형이 맞춰져요. 4번은 7번에게 실용성을 가르쳐주고, 7번은 4번에게 영성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 7번이 균형을 맞춰주고, 7번이 고립할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 7번은 지혜을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["4번의 안정과 7번의 지혜이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["4번의 경직성과 7번의 고립이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 7번은 지혜이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 7번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 4번은 7번의 지혜에 매력을 느끼고, 7번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 7번은 분석을 원해요. 번갈아 하면 좋아요. 4번 스타일로 한 번, 7번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 7번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 7번은 고립해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 7번이 분석을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "4번의 경직성과 7번의 고립이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 7번에게서 지혜을 배우고, 7번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 4번은 안정을 중요하게 생각하고 7번은 지혜을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 7번은 분석하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 7번은 지혜을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 4번은 경직성해지고 7번은 고립해져요. 서로 균형을 맞춰주면.`,
                strengths: ["4번의 안정과 7번의 지혜이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "4번의 경직성과 7번의 고립이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 4번의 방식과 7번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 4번은 안정하게 일하고 7번은 지혜하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

4번이 체계을 담당하고 7번이 분석을 맡으면 균형이 맞아요. 4번의 전문성과 7번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 4번은 실용성하게 하고 싶지만 7번은 영성하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["4번의 안정과 7번의 지혜이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "4번의 경직성과 7번의 고립이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 7번은 분석을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 4번은 안정하고 7번은 지혜해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "4번의 안정과 7번의 지혜이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 7번의 고립이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 지혜 통합하기: 두 에너지의 균형을 찾으세요", "직관 달성하기: 11번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 4번이 실용성하고 7번이 영성하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 지혜 둘 다 맞아요", "번갈아 하기: 4번 방식, 7번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "직관 함께 배우기: 11번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 직관을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["안정", "지혜", "균형", "성장", "존중", "조화"]
        },

        '4-8': {
            score: 75,
            summary: '산과 왕의 견고한 제국',
            overall: `4번과 8번이 만나는 건 산과 왕의 견고한 제국예요. 4번은 안정, 체계, 실용성의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 4+8=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

4번의 에너지는 땅(土)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 긴장을 만들어요. 4번의 안정과 8번의 권력이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 4번은 안정하고, 8번은 권력해요. 이 차이가 때로 충돌해요.

4번이 체계할 때 8번은 성공해요. 함께 있으면 긴장감이 있어요. 4번은 8번에게 실용성을 가르쳐주고, 8번은 4번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["4번의 안정과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["4번의 경직성과 8번의 탐욕이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 4번은 8번의 권력에 매력을 느끼고, 8번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 8번은 성공을 원해요. 절충안을 찾아야 해요. 4번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 8번은 탐욕해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 8번에게서 권력을 배우고, 8번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 4번은 안정을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 8번은 성공하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 싸워요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 8번은 권력을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 4번은 경직성해지고 8번은 탐욕해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["4번의 안정과 8번의 권력이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "4번의 경직성과 8번의 탐욕이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 4번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 82,
                description: `함께 일할 때 4번은 안정하게 일하고 8번은 권력하게 일해요. 이 차이가 조율이 필요하지만 좋은 팀이 돼요.

4번이 체계을 담당하고 8번이 성공을 맡으면 완벽한 조합이에요. 4번의 전문성과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 4번은 실용성하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["4번의 안정과 8번의 권력이 보완돼요", "리더와 실행자의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "4번의 경직성과 8번의 탐욕이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 8번은 성공을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 4번은 안정하고 8번은 권력해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "4번의 안정과 8번의 권력이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "4번의 경직성과 8번의 탐욕이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 권력 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 4번이 실용성하고 8번이 물질하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 권력 둘 다 맞아요", "번갈아 하기: 4번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 창의성을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["안정", "권력", "균형", "성장", "존중", "조화"]
        },

        '4-9': {
            score: 73,
            summary: '산과 성자의 인내',
            overall: `4번과 9번이 만나는 건 산과 성자의 인내예요. 4번은 안정, 체계, 실용성의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 4+9=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

4번의 에너지는 땅(土)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 긴장을 만들어요. 4번의 안정과 9번의 완성이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 4번은 안정하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

4번이 체계할 때 9번은 박애해요. 함께 있으면 긴장감이 있어요. 4번은 9번에게 실용성을 가르쳐주고, 9번은 4번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 4번이 경직성할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 4번이 도와줘요.

하지만 가치관이 다를 수 있어요. 4번은 안정을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["4번의 안정과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["4번의 경직성과 9번의 이상주의이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 4번은 안정이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 4번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 4번은 9번의 완성에 매력을 느끼고, 9번은 4번의 안정에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 4번은 체계을 원하고 9번은 박애을 원해요. 절충안을 찾아야 해요. 4번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 4번은 조용히 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 4번은 경직성해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "4번이 체계을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "4번의 경직성과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 4번은 9번에게서 완성을 배우고, 9번은 4번에게서 안정을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 4번은 안정을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 4번은 체계하게 하고 9번은 박애하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 4번은 아이에게 안정을 가르치고 9번은 완성을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 4번은 경직성해지고 9번은 이상주의해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["4번의 안정과 9번의 완성이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "4번의 경직성과 9번의 이상주의이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 4번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 4번은 안정하게 일하고 9번은 완성하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

4번이 체계을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 4번의 전문성과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 4번은 실용성하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["4번의 안정과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "4번의 경직성과 9번의 이상주의이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 4번은 체계, 9번은 박애을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 4번은 안정하고 9번은 완성해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "4번의 안정과 9번의 완성이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "4번의 경직성과 9번의 이상주의이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["안정과 완성 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 4번이 실용성하고 9번이 지혜하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 안정과 완성 둘 다 맞아요", "번갈아 하기: 4번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["안정", "완성", "균형", "성장", "존중", "조화"]
        },

        '5-11': {
            score: 68,
            summary: '바람과 영감의 만남',
            overall: `5번과 11번이 만나는 건 바람과 영감의 만남예요. 5번은 자유, 변화, 모험의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 5+11=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

5번의 에너지는 바람(風)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 5번의 자유과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 5번은 자유하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 5번은 11번에게 모험을 가르쳐주고, 11번은 5번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["5번의 자유과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["5번의 불안정과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 5번은 11번의 직관에 매력을 느끼고, 11번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 5번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 11번에게서 직관을 배우고, 11번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 5번은 자유을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 11번은 직관을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 5번은 불안정해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["5번의 자유과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "5번의 불안정과 11번의 불안이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 5번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 5번은 자유하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

5번이 변화을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 5번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 5번은 모험하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["5번의 자유과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "5번의 불안정과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 5번은 자유하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "5번의 자유과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "5번의 불안정과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 직관 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 5번이 모험하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 직관 둘 다 맞아요", "번갈아 하기: 5번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["자유", "직관", "균형", "성장", "존중", "조화"]
        },

        '5-22': {
            score: 62,
            summary: '바람과 건축가의 만남',
            overall: `5번과 22번이 만나는 건 바람과 건축가의 만남예요. 5번은 자유, 변화, 모험의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 5+22=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

5번의 에너지는 바람(風)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 5번의 자유과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 5번은 자유하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 5번은 22번에게 모험을 가르쳐주고, 22번은 5번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["5번의 자유과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["5번의 불안정과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 5번은 22번의 비전에 매력을 느끼고, 22번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 5번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 22번에게서 비전을 배우고, 22번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 5번은 자유을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 5번은 불안정해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["5번의 자유과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "5번의 불안정과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 5번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 5번은 자유하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

5번이 변화을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 5번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 5번은 모험하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["5번의 자유과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "5번의 불안정과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 5번은 자유하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "5번의 자유과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "5번의 불안정과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 비전 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 5번이 모험하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 비전 둘 다 맞아요", "번갈아 하기: 5번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["자유", "비전", "균형", "성장", "존중", "조화"]
        },

        '5-33': {
            score: 62,
            summary: '바람과 스승의 만남',
            overall: `5번과 33번이 만나는 건 바람과 스승의 만남예요. 5번은 자유, 변화, 모험의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 5+33=11이에요. 11은 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 직관과 영감을 배워야 해요.

5번의 에너지는 바람(風)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 5번의 자유과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 5번은 자유하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 5번은 33번에게 모험을 가르쳐주고, 33번은 5번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["5번의 자유과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["5번의 불안정과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 5번은 33번의 봉사에 매력을 느끼고, 33번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 5번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 33번에게서 봉사을 배우고, 33번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 5번은 자유을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 5번은 불안정해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["5번의 자유과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "5번의 불안정과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 5번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 5번은 자유하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

5번이 변화을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 5번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 5번은 모험하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["5번의 자유과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "5번의 불안정과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 5번은 자유하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "5번의 자유과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "5번의 불안정과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "직관 달성하기: 11번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 5번이 모험하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 봉사 둘 다 맞아요", "번갈아 하기: 5번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "직관 함께 배우기: 11번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["자유", "봉사", "균형", "성장", "존중", "조화"]
        },

        '5-5': {
            score: 70,
            summary: '두 바람의 만남',
            overall: `5번과 5번이 만나는 건 두 개의 바람가 같은 공간에 있는 것과 같아요. 5번은 자유, 변화, 모험의 숫자예요. 바람의 에너지. 어디든 가고 변화하는 숫자.

수비학적으로 5+5=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 두 개의 바람가 만나면 더 강력한 태양 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

5번의 에너지는 바람(風)이에요. 두 개의 바람(風)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 자유을 중요하게 생각하고, 변화을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 5번의 어려움을 5번만큼 잘 아는 사람은 없으니까요. 불안정이나 무책임같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 모험을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 불안정하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 자유을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "변화을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 불안정하면 서로 말려주지 못해요", "경쟁심이 생기면 무책임해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 모험, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 불안정해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 불안정한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 자유을 함께 추구하고 변화을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 모험을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 불안정하면 관계가 폭발하거나. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "자유을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 불안정하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 자유한 사람이 갑자기 불안정해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 65,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 자유을 중요하게 생각하니까 가족의 방향성이 명확해요. 변화을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 모험을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 자유을 가르치고 변화을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 불안정해지면 가정이 붕괴될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 커져요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 불안정하면 위험해요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 자유하려 할 때 한 사람은 반대로 불안정을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 65,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 자유을 중요시하고 변화한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 모험, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 불안정해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 불안정하면 충돌해요", "방향 설정이 어려워요", "새로운 아이디어나 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 자유을 함께 중요시하고 변화을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "자유을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 불안정하면 가족이 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["불안정 극복하기: 자유의 어두운 면을 인식하세요", "독립적 배우기: 1번의 에너지를 통해 성장하세요", "균형 잡기: 너무 변화하지 말고 반대도 시도하세요"],
                pastLife: `함께 모험한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 협력하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "불안정 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "독립적 추구하기: 1번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 태양의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["자유", "변화", "협력", "이해", "변화", "유연성"]
        },

        '5-6': {
            score: 80,
            summary: '바람과 대지의 충돌',
            overall: `5번과 6번이 만나는 건 바람과 대지의 충돌예요. 5번은 자유, 변화, 모험의 숫자이고, 6번은 사랑, 책임, 조화의 숫자예요.

수비학적으로 5+6=11이에요. 11은 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 직관과 영감을 배워야 해요.

5번의 에너지는 바람(風)이고, 6번의 에너지는 흙(土)이에요. 이 두 원소가 만나면 조화를 이루거나. 5번의 자유과 6번의 사랑이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 5번은 자유하고, 6번은 사랑해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 6번은 책임해요. 함께 있으면 균형이 맞춰져요. 5번은 6번에게 모험을 가르쳐주고, 6번은 5번에게 조화을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 6번이 균형을 맞춰주고, 6번이 간섭할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 6번은 사랑을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["5번의 자유과 6번의 사랑이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["5번의 불안정과 6번의 간섭이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 6번은 사랑이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 6번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 5번은 6번의 사랑에 매력을 느끼고, 6번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 6번은 책임을 원해요. 번갈아 하면 좋아요. 5번 스타일로 한 번, 6번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 6번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 6번은 간섭해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 6번이 책임을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "5번의 불안정과 6번의 간섭이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 6번에게서 사랑을 배우고, 6번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 5번은 자유을 중요하게 생각하고 6번은 사랑을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 6번은 책임하게 해요. 번갈아 하면 좋아요. 한 사람이 쓰려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 6번은 사랑을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 5번은 불안정해지고 6번은 간섭해져요. 서로 균형을 맞춰주면.`,
                strengths: ["5번의 자유과 6번의 사랑이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "5번의 불안정과 6번의 간섭이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 5번의 방식과 6번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 5번은 자유하게 일하고 6번은 사랑하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

5번이 변화을 담당하고 6번이 책임을 맡으면 균형이 맞아요. 5번의 전문성과 6번의 실행력이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 5번은 모험하게 하고 싶지만 6번은 조화하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["5번의 자유과 6번의 사랑이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "5번의 불안정과 6번의 간섭이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 6번은 책임을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 5번은 자유하고 6번은 사랑해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "5번의 자유과 6번의 사랑이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 6번의 간섭이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 사랑 통합하기: 두 에너지의 균형을 찾으세요", "직관 달성하기: 11번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 5번이 모험하고 6번이 조화하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 사랑 둘 다 맞아요", "번갈아 하기: 5번 방식, 6번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "직관 함께 배우기: 11번이 당신들의 목표예요"],
            oneLine: `당신들은 바람과 어머니처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["자유", "사랑", "균형", "성장", "존중", "조화"]
        },

        '5-7': {
            score: 78,
            summary: '바람과 현자의 자유로운 탐구',
            overall: `5번과 7번이 만나는 건 바람과 현자의 자유로운 탐구예요. 5번은 자유, 변화, 모험의 숫자이고, 7번은 지혜, 분석, 영성의 숫자예요.

수비학적으로 5+7=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

5번의 에너지는 바람(風)이고, 7번의 에너지는 에테르(靈)이에요. 이 두 원소가 만나면 조화를 이루거나. 5번의 자유과 7번의 지혜이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 5번은 자유하고, 7번은 지혜해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 7번은 분석해요. 함께 있으면 균형이 맞춰져요. 5번은 7번에게 모험을 가르쳐주고, 7번은 5번에게 영성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 7번이 균형을 맞춰주고, 7번이 고립할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 7번은 지혜을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["5번의 자유과 7번의 지혜이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["5번의 불안정과 7번의 고립이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 7번은 지혜이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 7번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 5번은 7번의 지혜에 매력을 느끼고, 7번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 7번은 분석을 원해요. 번갈아 하면 좋아요. 5번 스타일로 한 번, 7번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 7번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 7번은 고립해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 7번이 분석을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "5번의 불안정과 7번의 고립이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 7번에게서 지혜을 배우고, 7번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 5번은 자유을 중요하게 생각하고 7번은 지혜을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 7번은 분석하게 해요. 번갈아 하면 좋아요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 7번은 지혜을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 5번은 불안정해지고 7번은 고립해져요. 서로 균형을 맞춰주면.`,
                strengths: ["5번의 자유과 7번의 지혜이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "5번의 불안정과 7번의 고립이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 5번의 방식과 7번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 5번은 자유하게 일하고 7번은 지혜하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

5번이 변화을 담당하고 7번이 분석을 맡으면 균형이 맞아요. 5번의 전문성과 7번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 5번은 모험하게 하고 싶지만 7번은 영성하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["5번의 자유과 7번의 지혜이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "5번의 불안정과 7번의 고립이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 7번은 분석을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 5번은 자유하고 7번은 지혜해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "5번의 자유과 7번의 지혜이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 7번의 고립이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 지혜 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 5번이 모험하고 7번이 영성하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 지혜 둘 다 맞아요", "번갈아 하기: 5번 방식, 7번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 바람과 현자처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["자유", "지혜", "균형", "성장", "존중", "조화"]
        },

        '5-8': {
            score: 73,
            summary: '바람과 왕의 긴장',
            overall: `5번과 8번이 만나는 건 바람과 왕의 긴장예요. 5번은 자유, 변화, 모험의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 5+8=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

5번의 에너지는 바람(風)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 긴장을 만들어요. 5번의 자유과 8번의 권력이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 5번은 자유하고, 8번은 권력해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 8번은 성공해요. 함께 있으면 균형이 맞춰져요. 5번은 8번에게 모험을 가르쳐주고, 8번은 5번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["5번의 자유과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["5번의 불안정과 8번의 탐욕이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 5번은 8번의 권력에 매력을 느끼고, 8번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 8번은 성공을 원해요. 번갈아 하면 좋아요. 5번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 8번은 탐욕해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "5번의 불안정과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 8번에게서 권력을 배우고, 8번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 5번은 자유을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 8번은 성공하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 8번은 권력을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 5번은 불안정해지고 8번은 탐욕해져요. 서로 균형을 맞춰주면.`,
                strengths: ["5번의 자유과 8번의 권력이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "5번의 불안정과 8번의 탐욕이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 5번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 5번은 자유하게 일하고 8번은 권력하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

5번이 변화을 담당하고 8번이 성공을 맡으면 균형이 맞아요. 5번의 전문성과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 5번은 모험하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["5번의 자유과 8번의 권력이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "5번의 불안정과 8번의 탐욕이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 8번은 성공을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 5번은 자유하고 8번은 권력해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "5번의 자유과 8번의 권력이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 8번의 탐욕이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 권력 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 5번이 모험하고 8번이 물질하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 권력 둘 다 맞아요", "번갈아 하기: 5번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 안정을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["자유", "권력", "균형", "성장", "존중", "조화"]
        },

        '5-9': {
            score: 73,
            summary: '바람과 성자의 보편적 여행',
            overall: `5번과 9번이 만나는 건 바람과 성자의 보편적 여행예요. 5번은 자유, 변화, 모험의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 5+9=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

5번의 에너지는 바람(風)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 긴장을 만들어요. 5번의 자유과 9번의 완성이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 5번은 자유하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

5번이 변화할 때 9번은 박애해요. 함께 있으면 긴장감이 있어요. 5번은 9번에게 모험을 가르쳐주고, 9번은 5번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 5번이 불안정할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 5번이 도와줘요.

하지만 가치관이 다를 수 있어요. 5번은 자유을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["5번의 자유과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["5번의 불안정과 9번의 이상주의이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 5번은 자유이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 5번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 5번은 9번의 완성에 매력을 느끼고, 9번은 5번의 자유에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 5번은 변화을 원하고 9번은 박애을 원해요. 절충안을 찾아야 해요. 5번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 5번은 직접적으로 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 5번은 불안정해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "5번이 변화을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "5번의 불안정과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 5번은 9번에게서 완성을 배우고, 9번은 5번에게서 자유을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 5번은 자유을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 5번은 변화하게 하고 9번은 박애하게 해요. 협의가 필요해요. 한 사람이 쓰려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 5번은 아이에게 자유을 가르치고 9번은 완성을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 5번은 불안정해지고 9번은 이상주의해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["5번의 자유과 9번의 완성이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "5번의 불안정과 9번의 이상주의이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 5번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 5번은 자유하게 일하고 9번은 완성하게 일해요. 이 차이가 조율이 필요하지만 좋은 팀이 돼요.

5번이 변화을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 5번의 전문성과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 5번은 모험하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["5번의 자유과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "5번의 불안정과 9번의 이상주의이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 5번은 변화, 9번은 박애을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 5번은 자유하고 9번은 완성해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "5번의 자유과 9번의 완성이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "5번의 불안정과 9번의 이상주의이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["자유과 완성 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 5번이 모험하고 9번이 지혜하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 자유과 완성 둘 다 맞아요", "번갈아 하기: 5번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 자유을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["자유", "완성", "균형", "성장", "존중", "조화"]
        },

        '6-11': {
            score: 73,
            summary: '어머니과 영감의 만남',
            overall: `6번과 11번이 만나는 건 어머니과 영감의 만남예요. 6번은 사랑, 책임, 조화의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 6+11=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

6번의 에너지는 흙(土)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 6번의 사랑과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 6번은 사랑하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

6번이 책임할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 6번은 11번에게 조화을 가르쳐주고, 11번은 6번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 6번이 간섭할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 6번이 도와줘요.

하지만 가치관이 다를 수 있어요. 6번은 사랑을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["6번의 사랑과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["6번의 간섭과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 6번은 사랑이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 6번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 있어요. 6번은 11번의 직관에 매력을 느끼고, 11번은 6번의 사랑에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 6번은 책임을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 6번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 6번은 조용히 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 6번은 간섭해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "6번이 책임을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "6번의 간섭과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 6번은 11번에게서 직관을 배우고, 11번은 6번에게서 사랑을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 6번은 사랑을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 6번은 책임하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 6번은 아이에게 사랑을 가르치고 11번은 직관을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 6번은 간섭해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["6번의 사랑과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "6번의 간섭과 11번의 불안이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 6번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 6번은 사랑하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

6번이 책임을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 6번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 6번은 조화하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["6번의 사랑과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "6번의 간섭과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 6번은 책임, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 6번은 사랑하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "6번의 사랑과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "6번의 간섭과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["사랑과 직관 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 6번이 조화하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 사랑과 직관 둘 다 맞아요", "번갈아 하기: 6번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["사랑", "직관", "균형", "성장", "존중", "조화"]
        },

        '6-22': {
            score: 62,
            summary: '어머니과 건축가의 만남',
            overall: `6번과 22번이 만나는 건 어머니과 건축가의 만남예요. 6번은 사랑, 책임, 조화의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 6+22=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

6번의 에너지는 흙(土)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 6번의 사랑과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 6번은 사랑하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

6번이 책임할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 6번은 22번에게 조화을 가르쳐주고, 22번은 6번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 6번이 간섭할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 6번이 도와줘요.

하지만 가치관이 다를 수 있어요. 6번은 사랑을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["6번의 사랑과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["6번의 간섭과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 6번은 사랑이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 6번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 6번은 22번의 비전에 매력을 느끼고, 22번은 6번의 사랑에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 6번은 책임을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 6번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 6번은 조용히 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 6번은 간섭해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "6번이 책임을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "6번의 간섭과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 6번은 22번에게서 비전을 배우고, 22번은 6번에게서 사랑을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 6번은 사랑을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 6번은 책임하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 6번은 아이에게 사랑을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 6번은 간섭해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["6번의 사랑과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "6번의 간섭과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 6번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 6번은 사랑하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

6번이 책임을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 6번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 6번은 조화하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["6번의 사랑과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "6번의 간섭과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 6번은 책임, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 6번은 사랑하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "6번의 사랑과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "6번의 간섭과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["사랑과 비전 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 6번이 조화하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 사랑과 비전 둘 다 맞아요", "번갈아 하기: 6번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["사랑", "비전", "균형", "성장", "존중", "조화"]
        },

        '6-33': {
            score: 62,
            summary: '어머니과 스승의 만남',
            overall: `6번과 33번이 만나는 건 어머니과 스승의 만남예요. 6번은 사랑, 책임, 조화의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 6+33=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

6번의 에너지는 흙(土)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 6번의 사랑과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 6번은 사랑하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

6번이 책임할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 6번은 33번에게 조화을 가르쳐주고, 33번은 6번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 6번이 간섭할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 6번이 도와줘요.

하지만 가치관이 다를 수 있어요. 6번은 사랑을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["6번의 사랑과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["6번의 간섭과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 6번은 사랑이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 6번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 6번은 33번의 봉사에 매력을 느끼고, 33번은 6번의 사랑에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 6번은 책임을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 6번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 6번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 6번은 간섭해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "6번이 책임을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "6번의 간섭과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 6번은 33번에게서 봉사을 배우고, 33번은 6번에게서 사랑을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 6번은 사랑을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 6번은 책임하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 6번은 아이에게 사랑을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 6번은 간섭해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["6번의 사랑과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "6번의 간섭과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 6번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 6번은 사랑하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

6번이 책임을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 6번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 6번은 조화하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["6번의 사랑과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "6번의 간섭과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 6번은 책임, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 6번은 사랑하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "6번의 사랑과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "6번의 간섭과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["사랑과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 6번이 조화하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 사랑과 봉사 둘 다 맞아요", "번갈아 하기: 6번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["사랑", "봉사", "균형", "성장", "존중", "조화"]
        },

        '6-6': {
            score: 77,
            summary: '두 어머니의 만남',
            overall: `6번과 6번이 만나는 건 두 개의 어머니가 같은 공간에 있는 것과 같아요. 6번은 사랑, 책임, 조화의 숫자예요. 어머니 대지의 에너지. 돌보고 양육하는 숫자.

수비학적으로 6+6=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 두 개의 어머니가 만나면 더 강력한 별 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

6번의 에너지는 흙(土)이에요. 두 개의 흙(土)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 사랑을 중요하게 생각하고, 책임을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 6번의 어려움을 6번만큼 잘 아는 사람은 없으니까요. 간섭이나 희생같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 조화을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 간섭하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 사랑을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "책임을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 간섭하면 서로 말려주지 못해요", "경쟁심이 생기면 희생해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 조화, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 간섭해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 간섭한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 편안하지만 설렘은 적어요. 사랑을 함께 추구하고 책임을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 조화을 좋아하니까 루틴이 생겨요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 감정적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 간섭하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "사랑을 공유해요. 같은 방향을 봐요", "다툼이 적고 평화로워요"],
                challenges: ["설렘이 부족해요. 너무 익숙해요", "둘 다 간섭하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 사랑한 사람이 갑자기 간섭해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 85,
                description: `결혼하면 두 사람은 안정적인 가정을 꾸려요. 둘 다 사랑을 중요하게 생각하니까 가족의 방향성이 명확해요. 책임을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 체계적이고 안정적이에요. 조화을 중요시해서 저축을 잘하고 비슷해요. 재정 문제로 싸울 일이 적어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 사랑을 가르치고 책임을 중요하게 여겨요. 일관성이 있어서 아이가 혼란스러워하지 않아요.

하지만 둘 다 간섭해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 일치해요. 방향성이 명확해요", "경제적으로 안정적이에요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 간섭하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 사랑하려 할 때 한 사람은 반대로 간섭을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 70,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 사랑을 중요시하고 책임한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 명확히 하면 시너지가 나요. 한 사람은 조화, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

마감일을 지키고 품질을 보장해요. 책임감이 강해서 프로젝트를 추진해요.

하지만 둘 다 간섭해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 협업이 매끄러워요"],
                challenges: ["둘 다 간섭하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 실행... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 83,
                description: `가족으로서 두 사람은 안정적이고 든든해요. 부모-자식이든 형제자매든 사랑을 함께 중요시하고 책임을 공유해요. 서로를 잘 이해하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "사랑을 공유해서 가족의 유대가 강해요", "안정적이고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 간섭하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 대화하고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["간섭 극복하기: 사랑의 어두운 면을 인식하세요", "창의성 배우기: 3번의 에너지를 통해 성장하세요", "균형 잡기: 너무 책임하지 말고 반대도 시도하세요"],
                pastLife: `함께 조화한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "간섭 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "창의성 추구하기: 3번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 별의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["사랑", "책임", "협력", "이해", "변화", "유연성"]
        },

        '6-7': {
            score: 80,
            summary: '어머니와 현자의 조용한 대화',
            overall: `6번과 7번이 만나는 건 어머니와 현자의 조용한 대화예요. 6번은 사랑, 책임, 조화의 숫자이고, 7번은 지혜, 분석, 영성의 숫자예요.

수비학적으로 6+7=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

6번의 에너지는 흙(土)이고, 7번의 에너지는 에테르(靈)이에요. 이 두 원소가 만나면 조화를 이루거나. 6번의 사랑과 7번의 지혜이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 6번은 사랑하고, 7번은 지혜해요. 이 차이가 때로 충돌해요.

6번이 책임할 때 7번은 분석해요. 함께 있으면 균형이 맞춰져요. 6번은 7번에게 조화을 가르쳐주고, 7번은 6번에게 영성을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 6번이 간섭할 때 7번이 균형을 맞춰주고, 7번이 고립할 때 6번이 도와줘요.

하지만 가치관이 다를 수 있어요. 6번은 사랑을 중요하게 생각하지만 7번은 지혜을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["6번의 사랑과 7번의 지혜이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["6번의 간섭과 7번의 고립이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 6번은 사랑이 맞고, 7번은 지혜이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 6번 방식으로, 때로는 7번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 6번은 7번의 지혜에 매력을 느끼고, 7번은 6번의 사랑에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 6번은 책임을 원하고 7번은 분석을 원해요. 번갈아 하면 좋아요. 6번 스타일로 한 번, 7번 스타일로 한 번...

감정 표현도 달라요. 6번은 조용히 사랑을 표현하고, 7번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 6번은 간섭해지고 7번은 고립해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "6번이 책임을 주고 7번이 분석을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "6번의 간섭과 7번의 고립이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 6번은 7번에게서 지혜을 배우고, 7번은 6번에게서 사랑을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 6번은 사랑을 중요하게 생각하고 7번은 지혜을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 6번은 책임하게 하고 7번은 분석하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 6번은 아이에게 사랑을 가르치고 7번은 지혜을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 6번은 간섭해지고 7번은 고립해져요. 서로 균형을 맞춰주면.`,
                strengths: ["6번의 사랑과 7번의 지혜이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "6번의 간섭과 7번의 고립이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 6번의 방식과 7번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 6번은 사랑하게 일하고 7번은 지혜하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

6번이 책임을 담당하고 7번이 분석을 맡으면 균형이 맞아요. 6번의 전문성과 7번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 6번은 조화하게 하고 싶지만 7번은 영성하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["6번의 사랑과 7번의 지혜이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "6번의 간섭과 7번의 고립이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 6번은 책임, 7번은 분석을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 6번은 사랑하고 7번은 지혜해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "6번의 사랑과 7번의 지혜이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "6번의 간섭과 7번의 고립이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["사랑과 지혜 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 6번이 조화하고 7번이 영성하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 사랑과 지혜 둘 다 맞아요", "번갈아 하기: 6번 방식, 7번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 어머니과 현자처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["사랑", "지혜", "균형", "성장", "존중", "조화"]
        },

        '6-8': {
            score: 80,
            summary: '어머니와 왕의 책임',
            overall: `6번과 8번이 만나는 건 어머니와 왕의 책임예요. 6번은 사랑, 책임, 조화의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 6+8=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

6번의 에너지는 흙(土)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 조화를 이루거나. 6번의 사랑과 8번의 권력이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 6번은 사랑하고, 8번은 권력해요. 이 차이가 때로 충돌해요.

6번이 책임할 때 8번은 성공해요. 함께 있으면 균형이 맞춰져요. 6번은 8번에게 조화을 가르쳐주고, 8번은 6번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 6번이 간섭할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 6번이 도와줘요.

하지만 가치관이 다를 수 있어요. 6번은 사랑을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["6번의 사랑과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["6번의 간섭과 8번의 탐욕이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 6번은 사랑이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 6번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 6번은 8번의 권력에 매력을 느끼고, 8번은 6번의 사랑에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 6번은 책임을 원하고 8번은 성공을 원해요. 번갈아 하면 좋아요. 6번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 6번은 조용히 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 6번은 간섭해지고 8번은 탐욕해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "6번이 책임을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "6번의 간섭과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 6번은 8번에게서 권력을 배우고, 8번은 6번에게서 사랑을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 6번은 사랑을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 6번은 책임하게 하고 8번은 성공하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 6번은 아이에게 사랑을 가르치고 8번은 권력을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 6번은 간섭해지고 8번은 탐욕해져요. 서로 균형을 맞춰주면.`,
                strengths: ["6번의 사랑과 8번의 권력이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "6번의 간섭과 8번의 탐욕이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 6번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 82,
                description: `함께 일할 때 6번은 사랑하게 일하고 8번은 권력하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

6번이 책임을 담당하고 8번이 성공을 맡으면 완벽한 조합이에요. 6번의 전문성과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 6번은 조화하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["6번의 사랑과 8번의 권력이 보완돼요", "리더와 실행자의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "6번의 간섭과 8번의 탐욕이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 6번은 책임, 8번은 성공을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 6번은 사랑하고 8번은 권력해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "6번의 사랑과 8번의 권력이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "6번의 간섭과 8번의 탐욕이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["사랑과 권력 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 6번이 조화하고 8번이 물질하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 사랑과 권력 둘 다 맞아요", "번갈아 하기: 6번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 어머니과 왕처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["사랑", "권력", "균형", "성장", "존중", "조화"]
        },

        '6-9': {
            score: 73,
            summary: '두 봉사자의 만남',
            overall: `6번과 9번이 만나는 건 두 봉사자의 만남예요. 6번은 사랑, 책임, 조화의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 6+9=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

6번의 에너지는 흙(土)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 긴장을 만들어요. 6번의 사랑과 9번의 완성이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 6번은 사랑하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

6번이 책임할 때 9번은 박애해요. 함께 있으면 균형이 맞춰져요. 6번은 9번에게 조화을 가르쳐주고, 9번은 6번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 6번이 간섭할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 6번이 도와줘요.

하지만 가치관이 다를 수 있어요. 6번은 사랑을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["6번의 사랑과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["6번의 간섭과 9번의 이상주의이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 6번은 사랑이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 6번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 6번은 9번의 완성에 매력을 느끼고, 9번은 6번의 사랑에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 6번은 책임을 원하고 9번은 박애을 원해요. 번갈아 하면 좋아요. 6번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 6번은 조용히 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 6번은 간섭해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "6번이 책임을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "6번의 간섭과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 6번은 9번에게서 완성을 배우고, 9번은 6번에게서 사랑을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 6번은 사랑을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 6번은 책임하게 하고 9번은 박애하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 6번은 아이에게 사랑을 가르치고 9번은 완성을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 6번은 간섭해지고 9번은 이상주의해져요. 서로 균형을 맞춰주면.`,
                strengths: ["6번의 사랑과 9번의 완성이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "6번의 간섭과 9번의 이상주의이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 6번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 6번은 사랑하게 일하고 9번은 완성하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

6번이 책임을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 6번의 전문성과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 6번은 조화하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["6번의 사랑과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "6번의 간섭과 9번의 이상주의이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 6번은 책임, 9번은 박애을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 6번은 사랑하고 9번은 완성해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "6번의 사랑과 9번의 완성이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "6번의 간섭과 9번의 이상주의이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["사랑과 완성 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 6번이 조화하고 9번이 지혜하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 사랑과 완성 둘 다 맞아요", "번갈아 하기: 6번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 사랑을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["사랑", "완성", "균형", "성장", "존중", "조화"]
        },

        '7-11': {
            score: 73,
            summary: '현자과 영감의 만남',
            overall: `7번과 11번이 만나는 건 현자과 영감의 만남예요. 7번은 지혜, 분석, 영성의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 7+11=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 완성과 박애을 배워야 해요.

7번의 에너지는 에테르(靈)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 7번의 지혜과 11번의 직관이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 7번은 지혜하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

7번이 분석할 때 11번은 영감해요. 함께 있으면 긴장감이 있어요. 7번은 11번에게 영성을 가르쳐주고, 11번은 7번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 7번이 고립할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 7번이 도와줘요.

하지만 가치관이 다를 수 있어요. 7번은 지혜을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["7번의 지혜과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["7번의 고립과 11번의 불안이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 7번은 지혜이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 7번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 7번은 11번의 직관에 매력을 느끼고, 11번은 7번의 지혜에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 7번은 분석을 원하고 11번은 영감을 원해요. 절충안을 찾아야 해요. 7번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 7번은 조용히 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 7번은 고립해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "7번이 분석을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "7번의 고립과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 7번은 11번에게서 직관을 배우고, 11번은 7번에게서 지혜을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 7번은 지혜을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 7번은 분석하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 7번은 아이에게 지혜을 가르치고 11번은 직관을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 7번은 고립해지고 11번은 불안해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["7번의 지혜과 11번의 직관이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "7번의 고립과 11번의 불안이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 7번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 7번은 지혜하게 일하고 11번은 직관하게 일해요. 이 차이가 조율이 필요하지만 좋은 팀이 돼요.

7번이 분석을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 7번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 7번은 영성하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 창의적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["7번의 지혜과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "7번의 고립과 11번의 불안이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 7번은 분석, 11번은 영감을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 7번은 지혜하고 11번은 직관해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "7번의 지혜과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "7번의 고립과 11번의 불안이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["지혜과 직관 통합하기: 두 에너지의 균형을 찾으세요", "완성 달성하기: 9번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 7번이 영성하고 11번이 이상하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 지혜과 직관 둘 다 맞아요", "번갈아 하기: 7번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "완성 함께 배우기: 9번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 완성을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["지혜", "직관", "균형", "성장", "존중", "조화"]
        },

        '7-22': {
            score: 62,
            summary: '현자과 건축가의 만남',
            overall: `7번과 22번이 만나는 건 현자과 건축가의 만남예요. 7번은 지혜, 분석, 영성의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 7+22=11이에요. 11은 영감의 에너지. 높은 차원의 통찰을 가진 마스터 넘버. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 직관과 영감을 배워야 해요.

7번의 에너지는 에테르(靈)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 7번의 지혜과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 7번은 지혜하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

7번이 분석할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 7번은 22번에게 영성을 가르쳐주고, 22번은 7번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 7번이 고립할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 7번이 도와줘요.

하지만 가치관이 다를 수 있어요. 7번은 지혜을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["7번의 지혜과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["7번의 고립과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 7번은 지혜이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 7번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 7번은 22번의 비전에 매력을 느끼고, 22번은 7번의 지혜에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 7번은 분석을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 7번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 7번은 조용히 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 7번은 고립해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "7번이 분석을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "7번의 고립과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 7번은 22번에게서 비전을 배우고, 22번은 7번에게서 지혜을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 7번은 지혜을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 7번은 분석하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 7번은 아이에게 지혜을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 7번은 고립해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["7번의 지혜과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "7번의 고립과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 7번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 7번은 지혜하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

7번이 분석을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 7번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 7번은 영성하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["7번의 지혜과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "7번의 고립과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 7번은 분석, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 7번은 지혜하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "7번의 지혜과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "7번의 고립과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["지혜과 비전 통합하기: 두 에너지의 균형을 찾으세요", "직관 달성하기: 11번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 7번이 영성하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 지혜과 비전 둘 다 맞아요", "번갈아 하기: 7번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "직관 함께 배우기: 11번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["지혜", "비전", "균형", "성장", "존중", "조화"]
        },

        '7-33': {
            score: 62,
            summary: '현자과 스승의 만남',
            overall: `7번과 33번이 만나는 건 현자과 스승의 만남예요. 7번은 지혜, 분석, 영성의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 7+33=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

7번의 에너지는 에테르(靈)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 7번의 지혜과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 7번은 지혜하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

7번이 분석할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 7번은 33번에게 영성을 가르쳐주고, 33번은 7번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 7번이 고립할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 7번이 도와줘요.

하지만 가치관이 다를 수 있어요. 7번은 지혜을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["7번의 지혜과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["7번의 고립과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 7번은 지혜이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 7번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 7번은 33번의 봉사에 매력을 느끼고, 33번은 7번의 지혜에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 7번은 분석을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 7번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 7번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 7번은 고립해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "7번이 분석을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "7번의 고립과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 7번은 33번에게서 봉사을 배우고, 33번은 7번에게서 지혜을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 7번은 지혜을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 7번은 분석하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 7번은 아이에게 지혜을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 7번은 고립해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["7번의 지혜과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "7번의 고립과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 7번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 7번은 지혜하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

7번이 분석을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 7번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 7번은 영성하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["7번의 지혜과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "7번의 고립과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 7번은 분석, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 7번은 지혜하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "7번의 지혜과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "7번의 고립과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["지혜과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 7번이 영성하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 지혜과 봉사 둘 다 맞아요", "번갈아 하기: 7번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["지혜", "봉사", "균형", "성장", "존중", "조화"]
        },

        '7-7': {
            score: 72,
            summary: '두 현자의 만남',
            overall: `7번과 7번이 만나는 건 두 개의 현자가 같은 공간에 있는 것과 같아요. 7번은 지혜, 분석, 영성의 숫자예요. 현자의 에너지. 깊이 탐구하고 이해하는 숫자.

수비학적으로 7+7=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 두 개의 현자가 만나면 더 강력한 바람 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

7번의 에너지는 에테르(靈)이에요. 두 개의 에테르(靈)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 지혜을 중요하게 생각하고, 분석을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 7번의 어려움을 7번만큼 잘 아는 사람은 없으니까요. 고립이나 냉소같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 영성을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 고립하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 지혜을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "분석을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 고립하면 서로 말려주지 못해요", "경쟁심이 생기면 냉소해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 영성, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 고립해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 고립한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 편안하지만 설렘은 적어요. 지혜을 함께 추구하고 분석을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 영성을 좋아하니까 루틴이 생겨요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 냉정하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 고립하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "지혜을 공유해요. 같은 방향을 봐요", "다툼이 적고 평화로워요"],
                challenges: ["설렘이 부족해요. 너무 익숙해요", "둘 다 고립하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 지혜한 사람이 갑자기 고립해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 안정적인 가정을 꾸려요. 둘 다 지혜을 중요하게 생각하니까 가족의 방향성이 명확해요. 분석을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 영성을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 지혜을 가르치고 분석을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 고립해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 고립하면 정체돼요", "감정 표현이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 지혜하려 할 때 한 사람은 반대로 고립을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 감정 나누기 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 65,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 지혜을 중요시하고 분석한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 영성, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 고립해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 고립하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 전략, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 지혜을 함께 중요시하고 분석을 공유해요. 서로를 잘 이해하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "지혜을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 고립하면 관계가 어려워져요", "감정 표현이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 감정을 나누세요.`
            },

            karma: {
                tasks: ["고립 극복하기: 지혜의 어두운 면을 인식하세요", "자유 배우기: 5번의 에너지를 통해 성장하세요", "균형 잡기: 너무 분석하지 말고 반대도 시도하세요"],
                pastLife: `함께 영성한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "고립 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "자유 추구하기: 5번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 바람의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["지혜", "분석", "협력", "이해", "변화", "유연성"]
        },

        '7-8': {
            score: 80,
            summary: '현자와 왕의 지혜로운 통치',
            overall: `7번과 8번이 만나는 건 현자와 왕의 지혜로운 통치예요. 7번은 지혜, 분석, 영성의 숫자이고, 8번은 권력, 성공, 물질의 숫자예요.

수비학적으로 7+8=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

7번의 에너지는 에테르(靈)이고, 8번의 에너지는 금속(金)이에요. 이 두 원소가 만나면 조화를 이루거나. 7번의 지혜과 8번의 권력이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 7번은 지혜하고, 8번은 권력해요. 이 차이가 때로 충돌해요.

7번이 분석할 때 8번은 성공해요. 함께 있으면 균형이 맞춰져요. 7번은 8번에게 영성을 가르쳐주고, 8번은 7번에게 물질을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 7번이 고립할 때 8번이 균형을 맞춰주고, 8번이 탐욕할 때 7번이 도와줘요.

하지만 가치관이 다를 수 있어요. 7번은 지혜을 중요하게 생각하지만 8번은 권력을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["7번의 지혜과 8번의 권력이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["7번의 고립과 8번의 탐욕이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 7번은 지혜이 맞고, 8번은 권력이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 7번 방식으로, 때로는 8번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 7번은 8번의 권력에 매력을 느끼고, 8번은 7번의 지혜에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 7번은 분석을 원하고 8번은 성공을 원해요. 번갈아 하면 좋아요. 7번 스타일로 한 번, 8번 스타일로 한 번...

감정 표현도 달라요. 7번은 조용히 사랑을 표현하고, 8번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 7번은 고립해지고 8번은 탐욕해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "7번이 분석을 주고 8번이 성공을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "7번의 고립과 8번의 탐욕이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 7번은 8번에게서 권력을 배우고, 8번은 7번에게서 지혜을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 7번은 지혜을 중요하게 생각하고 8번은 권력을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 7번은 분석하게 하고 8번은 성공하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 모으려 하거나 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 7번은 아이에게 지혜을 가르치고 8번은 권력을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 7번은 고립해지고 8번은 탐욕해져요. 서로 균형을 맞춰주면.`,
                strengths: ["7번의 지혜과 8번의 권력이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "7번의 고립과 8번의 탐욕이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 7번의 방식과 8번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 7번은 지혜하게 일하고 8번은 권력하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

7번이 분석을 담당하고 8번이 성공을 맡으면 균형이 맞아요. 7번의 전문성과 8번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 7번은 영성하게 하고 싶지만 8번은 물질하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["7번의 지혜과 8번의 권력이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "7번의 고립과 8번의 탐욕이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 7번은 분석, 8번은 성공을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 7번은 지혜하고 8번은 권력해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "7번의 지혜과 8번의 권력이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "7번의 고립과 8번의 탐욕이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["지혜과 권력 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 7번이 영성하고 8번이 물질하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 지혜과 권력 둘 다 맞아요", "번갈아 하기: 7번 방식, 8번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 현자과 왕처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["지혜", "권력", "균형", "성장", "존중", "조화"]
        },

        '7-9': {
            score: 78,
            summary: '현자와 성자의 완전한 이해',
            overall: `7번과 9번이 만나는 건 현자와 성자의 완전한 이해예요. 7번은 지혜, 분석, 영성의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 7+9=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 지혜과 분석을 배워야 해요.

7번의 에너지는 에테르(靈)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 조화를 이루거나. 7번의 지혜과 9번의 완성이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 7번은 지혜하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

7번이 분석할 때 9번은 박애해요. 함께 있으면 균형이 맞춰져요. 7번은 9번에게 영성을 가르쳐주고, 9번은 7번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 7번이 고립할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 7번이 도와줘요.

하지만 가치관이 다를 수 있어요. 7번은 지혜을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["7번의 지혜과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["7번의 고립과 9번의 이상주의이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 7번은 지혜이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 7번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 7번은 9번의 완성에 매력을 느끼고, 9번은 7번의 지혜에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 7번은 분석을 원하고 9번은 박애을 원해요. 번갈아 하면 좋아요. 7번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 7번은 조용히 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 7번은 고립해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "7번이 분석을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "7번의 고립과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 7번은 9번에게서 완성을 배우고, 9번은 7번에게서 지혜을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 7번은 지혜을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 7번은 분석하게 하고 9번은 박애하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 7번은 아이에게 지혜을 가르치고 9번은 완성을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 7번은 고립해지고 9번은 이상주의해져요. 서로 균형을 맞춰주면.`,
                strengths: ["7번의 지혜과 9번의 완성이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "7번의 고립과 9번의 이상주의이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 7번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 7번은 지혜하게 일하고 9번은 완성하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

7번이 분석을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 7번의 전문성과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 7번은 영성하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["7번의 지혜과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "7번의 고립과 9번의 이상주의이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 7번은 분석, 9번은 박애을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 7번은 지혜하고 9번은 완성해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "7번의 지혜과 9번의 완성이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "7번의 고립과 9번의 이상주의이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["지혜과 완성 통합하기: 두 에너지의 균형을 찾으세요", "지혜 달성하기: 7번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 7번이 영성하고 9번이 지혜하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 지혜과 완성 둘 다 맞아요", "번갈아 하기: 7번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "지혜 함께 배우기: 7번이 당신들의 목표예요"],
            oneLine: `당신들은 현자과 성자처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["지혜", "완성", "균형", "성장", "존중", "조화"]
        },

        '8-11': {
            score: 73,
            summary: '왕과 영감의 만남',
            overall: `8번과 11번이 만나는 건 왕과 영감의 만남예요. 8번은 권력, 성공, 물질의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 8+11=1이에요. 1은 태양의 에너지. 스스로 빛나고 중심이 되는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 독립적과 리더십을 배워야 해요.

8번의 에너지는 금속(金)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 긴장을 만들어요. 8번의 권력과 11번의 직관이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 8번은 권력하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

8번이 성공할 때 11번은 영감해요. 함께 있으면 균형이 맞춰져요. 8번은 11번에게 물질을 가르쳐주고, 11번은 8번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 8번이 탐욕할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 8번이 도와줘요.

하지만 가치관이 다를 수 있어요. 8번은 권력을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["8번의 권력과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["8번의 탐욕과 11번의 불안이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 8번은 권력이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 8번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 72,
                description: `연애할 때 두 사람의 끌림은 강해요. 8번은 11번의 직관에 매력을 느끼고, 11번은 8번의 권력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 8번은 성공을 원하고 11번은 영감을 원해요. 번갈아 하면 좋아요. 8번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 8번은 직접적으로 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 8번은 탐욕해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "8번이 성공을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "8번의 탐욕과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 8번은 11번에게서 직관을 배우고, 11번은 8번에게서 권력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 8번은 권력을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 서로를 보완해서 다양한 가정이 돼요.

경제 관리에서 8번은 성공하게 하고 11번은 영감하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 8번은 아이에게 권력을 가르치고 11번은 직관을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 8번은 탐욕해지고 11번은 불안해져요. 서로 균형을 맞춰주면.`,
                strengths: ["8번의 권력과 11번의 직관이 보완돼요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "8번의 탐욕과 11번의 불안이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 8번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 8번은 권력하게 일하고 11번은 직관하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

8번이 성공을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 8번의 리더십과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 8번은 물질하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["8번의 권력과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "8번의 탐욕과 11번의 불안이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 8번은 성공, 11번은 영감을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 8번은 권력하고 11번은 직관해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "8번의 권력과 11번의 직관이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "8번의 탐욕과 11번의 불안이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["권력과 직관 통합하기: 두 에너지의 균형을 찾으세요", "독립적 달성하기: 1번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 8번이 물질하고 11번이 이상하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 권력과 직관 둘 다 맞아요", "번갈아 하기: 8번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "독립적 함께 배우기: 1번이 당신들의 목표예요"],
            oneLine: `당신들은 다르지만 함께 독립적을 배울 수 있어요. 인내와 이해가 필요해요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["권력", "직관", "균형", "성장", "존중", "조화"]
        },

        '8-22': {
            score: 62,
            summary: '왕과 건축가의 만남',
            overall: `8번과 22번이 만나는 건 왕과 건축가의 만남예요. 8번은 권력, 성공, 물질의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 8+22=3이에요. 3은 별의 에너지. 반짝이고 표현하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 창의성과 표현력을 배워야 해요.

8번의 에너지는 금속(金)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 8번의 권력과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 8번은 권력하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

8번이 성공할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 8번은 22번에게 물질을 가르쳐주고, 22번은 8번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 8번이 탐욕할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 8번이 도와줘요.

하지만 가치관이 다를 수 있어요. 8번은 권력을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["8번의 권력과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["8번의 탐욕과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 8번은 권력이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 8번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 8번은 22번의 비전에 매력을 느끼고, 22번은 8번의 권력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 8번은 성공을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 8번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 8번은 직접적으로 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 8번은 탐욕해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "8번이 성공을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "8번의 탐욕과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 8번은 22번에게서 비전을 배우고, 22번은 8번에게서 권력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 8번은 권력을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 8번은 성공하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 8번은 아이에게 권력을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 8번은 탐욕해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["8번의 권력과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "8번의 탐욕과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 8번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 8번은 권력하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

8번이 성공을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 8번의 리더십과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 8번은 물질하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["8번의 권력과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "8번의 탐욕과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 8번은 성공, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 8번은 권력하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "8번의 권력과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "8번의 탐욕과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["권력과 비전 통합하기: 두 에너지의 균형을 찾으세요", "창의성 달성하기: 3번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 8번이 물질하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 권력과 비전 둘 다 맞아요", "번갈아 하기: 8번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "창의성 함께 배우기: 3번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["권력", "비전", "균형", "성장", "존중", "조화"]
        },

        '8-33': {
            score: 62,
            summary: '왕과 스승의 만남',
            overall: `8번과 33번이 만나는 건 왕과 스승의 만남예요. 8번은 권력, 성공, 물질의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 8+33=5이에요. 5은 바람의 에너지. 어디든 가고 변화하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 자유과 변화을 배워야 해요.

8번의 에너지는 금속(金)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 8번의 권력과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 8번은 권력하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

8번이 성공할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 8번은 33번에게 물질을 가르쳐주고, 33번은 8번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 8번이 탐욕할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 8번이 도와줘요.

하지만 가치관이 다를 수 있어요. 8번은 권력을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["8번의 권력과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["8번의 탐욕과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 8번은 권력이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 8번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 8번은 33번의 봉사에 매력을 느끼고, 33번은 8번의 권력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 8번은 성공을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 8번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 8번은 직접적으로 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 8번은 탐욕해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "8번이 성공을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "8번의 탐욕과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 8번은 33번에게서 봉사을 배우고, 33번은 8번에게서 권력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 8번은 권력을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 8번은 성공하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 8번은 아이에게 권력을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 8번은 탐욕해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["8번의 권력과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "8번의 탐욕과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 8번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 8번은 권력하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

8번이 성공을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 8번의 리더십과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 8번은 물질하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["8번의 권력과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "8번의 탐욕과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 8번은 성공, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 8번은 권력하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "8번의 권력과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "8번의 탐욕과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["권력과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "자유 달성하기: 5번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 8번이 물질하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 권력과 봉사 둘 다 맞아요", "번갈아 하기: 8번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "자유 함께 배우기: 5번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["권력", "봉사", "균형", "성장", "존중", "조화"]
        },

        '8-8': {
            score: 74,
            summary: '두 왕의 만남',
            overall: `8번과 8번이 만나는 건 두 개의 왕가 같은 공간에 있는 것과 같아요. 8번은 권력, 성공, 물질의 숫자예요. 왕의 에너지. 권력과 물질을 지배하는 숫자.

수비학적으로 8+8=7이에요. 7은 현자의 에너지. 깊이 탐구하고 이해하는 숫자. 두 개의 왕가 만나면 더 강력한 현자 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

8번의 에너지는 금속(金)이에요. 두 개의 금속(金)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 권력을 중요하게 생각하고, 성공을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 8번의 어려움을 8번만큼 잘 아는 사람은 없으니까요. 탐욕이나 권위주의같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 물질을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 탐욕하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 권력을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "성공을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 탐욕하면 서로 말려주지 못해요", "경쟁심이 생기면 권위주의해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 물질, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 탐욕해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 탐욕한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 권력을 함께 추구하고 성공을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 물질을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 이성적이면 드라마틱한 관계가 되고, 둘 다 냉정하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 탐욕하면 관계가 폭발하거나. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "권력을 공유해요. 같은 방향을 봐요", "열정이 넘쳐요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 탐욕하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 권력한 사람이 갑자기 탐욕해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 65,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 권력을 중요하게 생각하니까 가족의 방향성이 명확해요. 성공을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 체계적이고 안정적이에요. 물질을 중요시해서 저축을 잘하고 비슷해요. 재정 문제로 싸울 일이 적어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 권력을 가르치고 성공을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 탐욕해지면 가정이 붕괴될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 커져요. 일중독 부부가 될 수 있어요.`,
                strengths: ["가치관이 일치해요. 방향성이 명확해요", "경제적으로 안정적이에요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 탐욕하면 위험해요", "감정 표현이 부족할 수 있어요", "일중독 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 권력하려 할 때 한 사람은 반대로 탐욕을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 감정 나누기 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 85,
                description: `함께 일하면 두 사람은 체계적이고 효율적으로 일해요. 둘 다 권력을 중요시하고 성공한 방식을 선호해요. 업무 스타일이 맞아서 효율이 높아요.

역할 분담을 명확히 하면 시너지가 나요. 한 사람은 물질, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

마감일을 지키고 품질을 보장해요. 책임감이 강해서 프로젝트를 완수해요.

하지만 둘 다 탐욕해지면 문제가 커져요. 주도권 다툼이. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 일치해요", "효율이 높아요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 탐욕하면 충돌해요", "주도권 다툼이", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 전략, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 제3자의 조언을 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 권력을 함께 중요시하고 성공을 공유해요. 서로를 비슷한 방식으로 생각하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "권력을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 새로운 관점이 부족해요", "둘 다 탐욕하면 가족이 어려워져요", "감정 표현이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 함께 시간을 보내고 서로의 감정을 나누세요.`
            },

            karma: {
                tasks: ["탐욕 극복하기: 권력의 어두운 면을 인식하세요", "지혜 배우기: 7번의 에너지를 통해 성장하세요", "균형 잡기: 너무 성공하지 말고 반대도 시도하세요"],
                pastLife: `함께 물질한 영혼들이에요. 아마 같은 목표를 추구했거나 거예요. 이번 생에서는 협력하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "탐욕 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "지혜 추구하기: 7번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 현자의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["권력", "성공", "협력", "이해", "변화", "유연성"]
        },

        '8-9': {
            score: 80,
            summary: '왕과 성자의 이상적 통치',
            overall: `8번과 9번이 만나는 건 왕과 성자의 이상적 통치예요. 8번은 권력, 성공, 물질의 숫자이고, 9번은 완성, 박애, 지혜의 숫자예요.

수비학적으로 8+9=8이에요. 8은 왕의 에너지. 권력과 물질을 지배하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 권력과 성공을 배워야 해요.

8번의 에너지는 금속(金)이고, 9번의 에너지는 전체(全)이에요. 이 두 원소가 만나면 조화를 이루거나. 8번의 권력과 9번의 완성이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 85,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 8번은 권력하고, 9번은 완성해요. 이 차이가 때로 충돌해요.

8번이 성공할 때 9번은 박애해요. 함께 있으면 균형이 맞춰져요. 8번은 9번에게 물질을 가르쳐주고, 9번은 8번에게 지혜을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 8번이 탐욕할 때 9번이 균형을 맞춰주고, 9번이 이상주의할 때 8번이 도와줘요.

하지만 가치관이 다를 수 있어요. 8번은 권력을 중요하게 생각하지만 9번은 완성을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["8번의 권력과 9번의 완성이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["8번의 탐욕과 9번의 이상주의이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 8번은 권력이 맞고, 9번은 완성이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 8번 방식으로, 때로는 9번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 있어요. 8번은 9번의 완성에 매력을 느끼고, 9번은 8번의 권력에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 8번은 성공을 원하고 9번은 박애을 원해요. 번갈아 하면 좋아요. 8번 스타일로 한 번, 9번 스타일로 한 번...

감정 표현도 달라요. 8번은 직접적으로 사랑을 표현하고, 9번은 감정적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 8번은 탐욕해지고 9번은 이상주의해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "8번이 성공을 주고 9번이 박애을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "8번의 탐욕과 9번의 이상주의이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 8번은 9번에게서 완성을 배우고, 9번은 8번에게서 권력을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 8번은 권력을 중요하게 생각하고 9번은 완성을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 8번은 성공하게 하고 9번은 박애하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 8번은 아이에게 권력을 가르치고 9번은 완성을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 8번은 탐욕해지고 9번은 이상주의해져요. 서로 균형을 맞춰주면.`,
                strengths: ["8번의 권력과 9번의 완성이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "8번의 탐욕과 9번의 이상주의이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 8번의 방식과 9번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 8번은 권력하게 일하고 9번은 완성하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

8번이 성공을 담당하고 9번이 박애을 맡으면 균형이 맞아요. 8번의 리더십과 9번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 8번은 물질하게 하고 싶지만 9번은 지혜하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 체계적 프로젝트면 더 좋아요.`,
                strengths: ["8번의 권력과 9번의 완성이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "8번의 탐욕과 9번의 이상주의이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 8번은 성공, 9번은 박애을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 8번은 권력하고 9번은 완성해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "8번의 권력과 9번의 완성이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "8번의 탐욕과 9번의 이상주의이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["권력과 완성 통합하기: 두 에너지의 균형을 찾으세요", "권력 달성하기: 8번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 8번이 물질하고 9번이 지혜하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 권력과 완성 둘 다 맞아요", "번갈아 하기: 8번 방식, 9번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "권력 함께 배우기: 8번이 당신들의 목표예요"],
            oneLine: `당신들은 왕과 성자처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["권력", "완성", "균형", "성장", "존중", "조화"]
        },

        '9-11': {
            score: 78,
            summary: '성자과 영감의 만남',
            overall: `9번과 11번이 만나는 건 성자과 영감의 만남예요. 9번은 완성, 박애, 지혜의 숫자이고, 11번은 직관, 영감, 이상의 숫자예요.

수비학적으로 9+11=2이에요. 2은 달의 에너지. 반사하고 조화를 이루는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 협력과 조화을 배워야 해요.

9번의 에너지는 전체(全)이고, 11번의 에너지는 빛(光)이에요. 이 두 원소가 만나면 조화를 이루거나. 9번의 완성과 11번의 직관이 충돌할 수 있어요.

이 관계는 자연스럽고 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 75,
                description: `친구로서 두 사람은 잘 맞는 편이에요. 9번은 완성하고, 11번은 직관해요. 이 차이가 때로 충돌해요.

9번이 박애할 때 11번은 영감해요. 함께 있으면 균형이 맞춰져요. 9번은 11번에게 지혜을 가르쳐주고, 11번은 9번에게 이상을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 9번이 이상주의할 때 11번이 균형을 맞춰주고, 11번이 불안할 때 9번이 도와줘요.

하지만 가치관이 다를 수 있어요. 9번은 완성을 중요하게 생각하지만 11번은 직관을 우선시해요. 이 차이를 존중하면.`,
                strengths: ["9번의 완성과 11번의 직관이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "균형 잡힌 우정이에요"],
                challenges: ["9번의 이상주의과 11번의 불안이 충돌해요", "가치관이 달라서 가끔 이해 못 할 수 있어요", "속도 차이으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 9번은 완성이 맞고, 11번은 직관이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 9번 방식으로, 때로는 11번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 82,
                description: `연애할 때 두 사람의 끌림은 강해요. 9번은 11번의 직관에 매력을 느끼고, 11번은 9번의 완성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 9번은 박애을 원하고 11번은 영감을 원해요. 번갈아 하면 좋아요. 9번 스타일로 한 번, 11번 스타일로 한 번...

감정 표현도 달라요. 9번은 조용히 사랑을 표현하고, 11번은 실용적으로 표현해요. 이 차이를 이해하면.

갈등이 생길 때도 해결 방식이 달라요. 9번은 이상주의해지고 11번은 불안해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "9번이 박애을 주고 11번이 영감을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["데이트 스타일이 달라서 조율이 필요해요", "9번의 이상주의과 11번의 불안이 부딪혀요", "감정 표현 방식이 달라서 차이가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 9번은 11번에게서 직관을 배우고, 11번은 9번에게서 완성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 83,
                description: `결혼하면 두 사람은 조화로운 가정을 만들어요. 9번은 완성을 중요하게 생각하고 11번은 직관을 우선시해요. 이 차이가 서로를 보완해서 균형 잡힌 가정이 돼요.

경제 관리에서 9번은 박애하게 하고 11번은 영감하게 해요. 번갈아 하면 좋아요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 균형이 맞춰져요.

육아에서도 다른 접근을 해요. 9번은 아이에게 완성을 가르치고 11번은 직관을 가르쳐요. 다양한 가치를 배워요.

위기가 올 때 9번은 이상주의해지고 11번은 불안해져요. 서로 균형을 맞춰주면.`,
                strengths: ["9번의 완성과 11번의 직관이 보완돼요", "조화로운 가정을 만들어요", "아이에게 균형 잡힌 가치관을 줘요"],
                challenges: ["육아 방식에서 의견이 달라요", "9번의 이상주의과 11번의 불안이 충돌해요", "우선순위 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 절충안을 찾으세요. 9번의 방식과 11번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 70,
                description: `함께 일할 때 9번은 완성하게 일하고 11번은 직관하게 일해요. 이 차이가 서로를 보완해서 좋은 팀이 돼요.

9번이 박애을 담당하고 11번이 영감을 맡으면 균형이 맞아요. 9번의 전문성과 11번의 창의성이 시너지를 내요.

업무 스타일이 달라서 처음엔 마찰이 있어요. 9번은 지혜하게 하고 싶지만 11번은 이상하게 하고 싶어해요. 조율하면 해결돼요.

대부분의 프로젝트에서 잘 맞아요. 창의적 프로젝트면 더 좋아요.`,
                strengths: ["9번의 완성과 11번의 직관이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 균형 잡힌 결과를 내요"],
                challenges: ["업무 스타일이 달라서 조율이 필요해요", "9번의 이상주의과 11번의 불안이 부딪혀요", "속도 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 9번은 박애, 11번은 영감을 담당하면 좋아요. 정기적으로 의견을 나누고 조율하세요. 차이가 있을 때 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 80,
                description: `가족으로서 두 사람은 조화로운 관계예요. 9번은 완성하고 11번은 직관해요. 이 차이가 가족을 풍성하게 해요.`,
                strengths: ["서로 다른 강점으로 보완해요", "9번의 완성과 11번의 직관이 균형을 이뤄요", "풍부한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "9번의 이상주의과 11번의 불안이 충돌해요", "속도가 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 자연스럽게 어울리며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["완성과 직관 통합하기: 두 에너지의 균형을 찾으세요", "협력 달성하기: 2번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `함께 무언가를 이루려 했던 영혼들이에요. 9번이 지혜하고 11번이 이상하며 균형을 배워야 해요.`
            },

            successKeys: ["차이 존중하기: 완성과 직관 둘 다 맞아요", "번갈아 하기: 9번 방식, 11번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 정기적으로 대화하세요", "협력 함께 배우기: 2번이 당신들의 목표예요"],
            oneLine: `당신들은 성자과 영감처럼 서로를 빛나게 해요. 차이를 선물로 받으세요.`,
            compatibilityType: '조화로운 파트너십',
            keywords: ["완성", "직관", "균형", "성장", "존중", "조화"]
        },

        '9-22': {
            score: 62,
            summary: '성자과 건축가의 만남',
            overall: `9번과 22번이 만나는 건 성자과 건축가의 만남예요. 9번은 완성, 박애, 지혜의 숫자이고, 22번은 비전, 실행력, 야심의 숫자예요.

수비학적으로 9+22=4이에요. 4은 산의 에너지. 단단하고 움직이지 않는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 안정과 체계을 배워야 해요.

9번의 에너지는 전체(全)이고, 22번의 에너지는 창조(創)이에요. 이 두 원소가 만나면 긴장을 만들어요. 9번의 완성과 22번의 비전이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 9번은 완성하고, 22번은 비전해요. 이 차이가 때로 충돌해요.

9번이 박애할 때 22번은 실행력해요. 함께 있으면 긴장감이 있어요. 9번은 22번에게 지혜을 가르쳐주고, 22번은 9번에게 야심을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 9번이 이상주의할 때 22번이 균형을 맞춰주고, 22번이 압박감할 때 9번이 도와줘요.

하지만 가치관이 다를 수 있어요. 9번은 완성을 중요하게 생각하지만 22번은 비전을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["9번의 완성과 22번의 비전이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["9번의 이상주의과 22번의 압박감이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 9번은 완성이 맞고, 22번은 비전이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 9번 방식으로, 때로는 22번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 9번은 22번의 비전에 매력을 느끼고, 22번은 9번의 완성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 9번은 박애을 원하고 22번은 실행력을 원해요. 절충안을 찾아야 해요. 9번 스타일로 한 번, 22번 스타일로 한 번...

감정 표현도 달라요. 9번은 조용히 사랑을 표현하고, 22번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 9번은 이상주의해지고 22번은 압박감해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "9번이 박애을 주고 22번이 실행력을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "9번의 이상주의과 22번의 압박감이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 9번은 22번에게서 비전을 배우고, 22번은 9번에게서 완성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 9번은 완성을 중요하게 생각하고 22번은 비전을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 9번은 박애하게 하고 22번은 실행력하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 9번은 아이에게 완성을 가르치고 22번은 비전을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 9번은 이상주의해지고 22번은 압박감해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["9번의 완성과 22번의 비전이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "9번의 이상주의과 22번의 압박감이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 9번의 방식과 22번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 9번은 완성하게 일하고 22번은 비전하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

9번이 박애을 담당하고 22번이 실행력을 맡으면 균형이 맞아요. 9번의 전문성과 22번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 9번은 지혜하게 하고 싶지만 22번은 야심하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["9번의 완성과 22번의 비전이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "9번의 이상주의과 22번의 압박감이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 9번은 박애, 22번은 실행력을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 9번은 완성하고 22번은 비전해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "9번의 완성과 22번의 비전이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "9번의 이상주의과 22번의 압박감이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["완성과 비전 통합하기: 두 에너지의 균형을 찾으세요", "안정 달성하기: 4번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 9번이 지혜하고 22번이 야심하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 완성과 비전 둘 다 맞아요", "번갈아 하기: 9번 방식, 22번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "안정 함께 배우기: 4번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["완성", "비전", "균형", "성장", "존중", "조화"]
        },

        '9-33': {
            score: 62,
            summary: '성자과 스승의 만남',
            overall: `9번과 33번이 만나는 건 성자과 스승의 만남예요. 9번은 완성, 박애, 지혜의 숫자이고, 33번은 봉사, 가르침, 사랑의 숫자예요.

수비학적으로 9+33=6이에요. 6은 어머니 대지의 에너지. 돌보고 양육하는 숫자. 이 조합이 추구해야 할 방향성이에요. 두 사람이 함께하면 사랑과 책임을 배워야 해요.

9번의 에너지는 전체(全)이고, 33번의 에너지는 사랑(愛)이에요. 이 두 원소가 만나면 긴장을 만들어요. 9번의 완성과 33번의 봉사이 충돌할 수 있어요.

이 관계는 쉽지 않지만 배움이 많은 궁합이에요. 서로의 차이를 이해하고 존중하면 좋은 관계를 만들 수 있어요.`,

            friend: {
                score: 65,
                description: `친구로서 두 사람은 배울 점이 많은 관계예요. 9번은 완성하고, 33번은 봉사해요. 이 차이가 때로 충돌해요.

9번이 박애할 때 33번은 가르침해요. 함께 있으면 긴장감이 있어요. 9번은 33번에게 지혜을 가르쳐주고, 33번은 9번에게 사랑을 배우게 해줘요.

서로 다른 강점을 가져서 도움을 주고받아요. 9번이 이상주의할 때 33번이 균형을 맞춰주고, 33번이 순교할 때 9번이 도와줘요.

하지만 가치관이 다를 수 있어요. 9번은 완성을 중요하게 생각하지만 33번은 봉사을 우선시해요. 이 차이를 이해하기 어려울 수 있어요. 노력이 필요해요.`,
                strengths: ["9번의 완성과 33번의 봉사이 보완돼요", "서로 다른 관점을 배워요. 시야가 넓어져요", "다양한 우정이에요"],
                challenges: ["9번의 이상주의과 33번의 순교이 충돌해요", "가치관이 달라서 자주 이해 못 할 수 있어요", "다른 리듬으로 불편할 수 있어요"],
                advice: `서로의 차이를 인정하고 존중하세요. 9번은 완성이 맞고, 33번은 봉사이 맞아요. 둘 다 맞아요. 억지로 바꾸려 하지 말고 있는 그대로 받아들이세요. 때로는 9번 방식으로, 때로는 33번 방식으로 하면서 서로를 경험해보세요.`
            },

            romantic: {
                score: 57,
                description: `연애할 때 두 사람의 끌림은 있어요. 9번은 33번의 봉사에 매력을 느끼고, 33번은 9번의 완성에 끌려요. 서로에게 없는 것을 가졌기 때문이에요.

데이트할 때 9번은 박애을 원하고 33번은 가르침을 원해요. 절충안을 찾아야 해요. 9번 스타일로 한 번, 33번 스타일로 한 번...

감정 표현도 달라요. 9번은 조용히 사랑을 표현하고, 33번은 실용적으로 표현해요. 이 차이를 받아들이기 어려울 수 있어요. 노력이 필요해요.

갈등이 생길 때도 해결 방식이 달라요. 9번은 이상주의해지고 33번은 순교해져요. 시간과 노력이 필요해요.`,
                strengths: ["서로 다른 매력에 끌려요. 신선해요", "9번이 박애을 주고 33번이 가르침을 줘요", "서로를 통해 성장해요. 새로운 것을 배워요"],
                challenges: ["가치관이 달라서 조율이 필요해요", "9번의 이상주의과 33번의 순교이 부딪혀요", "감정 표현 방식이 달라서 오해가 있어요"],
                advice: `"다름"을 문제가 아니라 선물로 받아들이세요. 9번은 33번에게서 봉사을 배우고, 33번은 9번에게서 완성을 배워요. 서로를 바꾸려 하지 말고 있는 그대로 사랑하세요. "네 방식대로 사랑해줘"라고 말하세요.`
            },

            spouse: {
                score: 63,
                description: `결혼하면 두 사람은 도전적인 가정을 만들어요. 9번은 완성을 중요하게 생각하고 33번은 봉사을 우선시해요. 이 차이가 갈등을 만들지만 다양한 가정이 돼요.

경제 관리에서 9번은 박애하게 하고 33번은 가르침하게 해요. 협의가 필요해요. 한 사람이 모으려 하면 다른 사람이 쓰려 해서 싸워요.

육아에서도 다른 접근을 해요. 9번은 아이에게 완성을 가르치고 33번은 봉사을 가르쳐요. 아이가 혼란스러워할 수 있어요. 일관성이 필요해요.

위기가 올 때 9번은 이상주의해지고 33번은 순교해져요. 충돌이 커질 수 있어요. 대화가 중요해요.`,
                strengths: ["9번의 완성과 33번의 봉사이 균형을 이뤄요", "다양한 가정을 만들어요", "아이에게 풍부한 가치관을 줘요"],
                challenges: ["재정 관리에서 의견이 달라요", "9번의 이상주의과 33번의 순교이 충돌해요", "가치관 차이로 갈등이 있어요"],
                advice: `정기적으로 가족 회의를 하세요. 중요한 결정은 함께 내리고 타협점을 찾으세요. 9번의 방식과 33번의 방식을 번갈아 시도해보고 무엇이 가족에게 맞는지 함께 찾아가세요. 아이 앞에서는 통일된 모습을 보이되 부부끼리는 솔직하게 대화하세요.`
            },

            work: {
                score: 62,
                description: `함께 일할 때 9번은 완성하게 일하고 33번은 봉사하게 일해요. 이 차이가 조율이 필요하지만 협력하면 성과를 낼 수 있어요.

9번이 박애을 담당하고 33번이 가르침을 맡으면 균형이 맞아요. 9번의 전문성과 33번의 창의성이 시너지를 내요.

업무 스타일이 달라서 자주 마찰이 있어요. 9번은 지혜하게 하고 싶지만 33번은 사랑하게 하고 싶어해요. 시간이 걸리지만 해결돼요.

프로젝트 유형에 따라 성과가 달라요. 체계적 프로젝트면 한 사람이 주도해야 해요.`,
                strengths: ["9번의 완성과 33번의 봉사이 보완돼요", "다양한 강점의 조합이에요", "서로 다른 관점으로 다양한 결과를 내요"],
                challenges: ["업무 스타일이 달라서 충돌이 필요해요", "9번의 이상주의과 33번의 순교이 부딪혀요", "우선순위나 차이로 불편할 수 있어요"],
                advice: `역할을 명확히 나누세요. 9번은 박애, 33번은 가르침을 담당하면 좋아요. 정기적으로 진행 상황을 공유하고 조율하세요. 갈등이 생기면 프로젝트 목표로 돌아가서 판단하세요.`
            },

            family: {
                score: 65,
                description: `가족으로서 두 사람은 다양성 있는 관계예요. 9번은 완성하고 33번은 봉사해요. 이 차이가 때로 충돌을 만들지만 배움이 있게 해요.`,
                strengths: ["서로 다른 강점으로 배워요", "9번의 완성과 33번의 봉사이 균형을 이뤄요", "다양한 가족 문화를 만들어요"],
                challenges: ["가치관이 달라서 이해가 필요해요", "9번의 이상주의과 33번의 순교이 충돌해요", "생활 방식이 달라서 불편할 수 있어요"],
                advice: `서로의 다름을 인정하고 존중하세요. 정기적으로 대화하며 이해를 넓혀가세요. 가족이라고 같을 필요는 없어요. 다름 속에서 사랑하는 법을 배우세요.`
            },

            karma: {
                tasks: ["완성과 봉사 통합하기: 두 에너지의 균형을 찾으세요", "사랑 달성하기: 6번의 과제를 함께 이루세요", "차이 존중하기: 다름을 문제가 아니라 선물로 보세요"],
                pastLife: `전생에서 반대 역할을 했을 영혼들이에요. 9번이 지혜하고 33번이 사랑하며 화해해야 해요.`
            },

            successKeys: ["차이 존중하기: 완성과 봉사 둘 다 맞아요", "번갈아 하기: 9번 방식, 33번 방식을 모두 시도하세요", "대화하기: 오해가 생기기 전에 자주 대화하세요", "사랑 함께 배우기: 6번이 당신들의 목표예요"],
            oneLine: `당신들은 정반대지만 바로 그래서 완전해질 수 있어요. 통합의 여정을 시작하세요.`,
            compatibilityType: '도전적인 관계',
            keywords: ["완성", "봉사", "균형", "성장", "존중", "조화"]
        },

        '9-9': {
            score: 73,
            summary: '두 성자의 만남',
            overall: `9번과 9번이 만나는 건 두 개의 성자가 같은 공간에 있는 것과 같아요. 9번은 완성, 박애, 지혜의 숫자예요. 성자의 에너지. 모든 것을 포함하고 완성하는 숫자.

수비학적으로 9+9=9이에요. 9은 성자의 에너지. 모든 것을 포함하고 완성하는 숫자. 두 개의 성자가 만나면 더 강력한 성자 에너지가 되는 거예요. 함께하면 시너지를 낼 수 있지만, 너무 비슷해서 생기는 문제도 있어요.

9번의 에너지는 전체(全)이에요. 두 개의 전체(全)이 만나면 그 특성이 극대화돼요. 장점은 배가 되지만 단점도 배가 돼요. 서로를 잘 이해하지만 때로는 거울을 보는 것처럼 자신의 약점을 상대에게서 발견하고 불편해할 수 있어요.

이 관계의 핵심은 '협력'이에요. 경쟁하면 서로를 파괴하지만, 협력하면 놀라운 성과를 낼 수 있어요. 역할을 분담하고 서로의 영역을 존중하는 것이 중요해요.`,

            friend: {
                score: 80,
                description: `친구로서 두 사람은 서로를 정말 잘 이해해요. 같은 가치관, 같은 리듬, 같은 방식으로 살아가니까요. 완성을 중요하게 생각하고, 박애을 함께 즐겨요. 대화가 잘 통하고 편안해요.

서로의 고민을 이해해줘요. 9번의 어려움을 9번만큼 잘 아는 사람은 없으니까요. 이상주의이나 순교같은 약점도 공유하기 때문에 서로 위로가 돼요. "나만 그런 게 아니구나"를 느껴요.

함께 있으면 시너지가 나요. 지혜을 함께 추구하고, 비슷한 목표를 향해 나아가요. 경쟁이 아니라 협력하면 배로 강해져요.

하지만 너무 비슷해서 문제가 될 수도 있어요. 둘 다 이상주의하면 서로 말려주지 못하고 같이 빠져요. 새로운 관점이나 균형이 부족할 수 있어요. 가끔은 다른 성향의 친구들도 필요해요.`,
                strengths: ["서로를 완벽하게 이해해요. 완성을 공유해요", "편안하고 자연스러워요. 가식이 필요 없어요", "박애을 함께 즐겨요. 취향이 비슷해요"],
                challenges: ["너무 비슷해서 새로운 자극이 부족해요", "둘 다 이상주의하면 서로 말려주지 못해요", "경쟁심이 생기면 순교해질 수 있어요"],
                advice: `가끔은 의도적으로 다른 것을 시도해보세요. 한 사람은 지혜, 다른 사람은 정반대를 해보는 거예요. 서로에게 새로운 경험을 선물하세요. 그리고 이상주의해지려 할 때 서로 알려주기로 약속하세요. "우리 지금 너무 이상주의한 것 같아"라고 솔직하게 말해요.`
            },

            romantic: {
                score: 67,
                description: `연애할 때 두 사람은 열정적이지만 충돌도 많아요. 완성을 함께 추구하고 박애을 중요하게 생각해요. 서로를 이해하는 건 쉽지만 새로운 자극은 부족해요.

데이트 스타일이 비슷해요. 둘 다 지혜을 좋아하니까 항상 같은 걸 해요. 예측 가능하고 안정적이지만 서프라이즈는 없어요.

감정 표현도 비슷해요. 둘 다 감정적이면 드라마틱한 관계가 되고, 둘 다 차분하면 밋밋한 관계가 돼요.

하지만 서로의 약점도 닮아서 문제가 커질 수 있어요. 둘 다 이상주의하면 관계가 침체돼요. 균형을 맞춰줄 사람이 없어요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "완성을 공유해요. 같은 방향을 봐요", "다툼이 적고 평화로워요"],
                challenges: ["경쟁하고 충돌해요", "둘 다 이상주의하면 관계가 위험해져요", "새로운 자극이나 성장이 부족해요"],
                advice: `의도적으로 역할을 바꿔보세요. 한 사람은 평소와 반대로 행동해보는 거예요. 완성한 사람이 갑자기 이상주의해지거나, 반대로 해보세요. 새로운 면을 발견하고 설렘을 되찾을 수 있어요. 그리고 정기적으로 "새로운 것" 도전하기로 약속하세요.`
            },

            spouse: {
                score: 75,
                description: `결혼하면 두 사람은 역동적인 가정을 꾸려요. 둘 다 완성을 중요하게 생각하니까 가족의 방향성이 명확해요. 박애을 함께 추구하고 비슷한 가치관으로 아이를 키워요.

경제적으로는 둘 다 비슷한 패턴이에요. 지혜을 중요시해서 돈을 쓰는 방식이 비슷해요. 재정 문제로 싸울 일이 있어요.

육아도 비슷한 방식으로 해요. 둘 다 아이에게 완성을 가르치고 박애을 중요하게 여겨요. 둘 다 같은 성향이라 균형이 필요해요.

하지만 둘 다 이상주의해지면 가정이 침체될 수 있어요. 균형을 맞춰줄 사람이 없어서 문제가 고착화돼요. 감정적 소통이 부족한 가정이 될 수 있어요.`,
                strengths: ["가치관이 비슷해요. 방향성이 명확해요", "서로를 이해해요", "육아 방식이 일관돼요. 아이가 혼란스러워하지 않아요"],
                challenges: ["둘 다 이상주의하면 정체돼요", "현실 감각이 부족할 수 있어요", "루틴에 갇힌 가정이 될 수 있어요"],
                advice: `한 사람은 의도적으로 균형자 역할을 맡아보세요. 둘 다 완성하려 할 때 한 사람은 반대로 이상주의을 경계하세요. 역할을 명확히 나누되 정기적으로 바꿔보는 것도 좋아요. 그리고 현실 점검 시간을 정기적으로 가지세요.`
            },

            work: {
                score: 70,
                description: `함께 일하면 두 사람은 창의적으로 일해요. 둘 다 완성을 중요시하고 박애한 방식을 선호해요. 비슷한 접근을 해서 이해가 빨라요.

역할 분담을 하면 시너지가 나요. 한 사람은 지혜, 다른 사람은 실행... 이렇게 나누면 좋아요. 겹치는 일 없이 효율적이에요.

창의적인 아이디어가 많아요. 열정이 있어서 프로젝트를 추진해요.

하지만 둘 다 이상주의해지면 문제가 커져요. 방향성을 잃어요. 산만해서 진행이 막힐 수 있어요.`,
                strengths: ["업무 스타일이 비슷해요", "창의성이 풍부해요", "서로를 잘 이해해서 빠르게 진행돼요"],
                challenges: ["둘 다 이상주의하면 정체돼요", "방향 설정이 어려워요", "새로운 관점이 부족해요"],
                advice: `역할을 명확히 나누세요. 한 사람은 기획, 다른 사람은 운영... 겹치지 않게 하세요. 의견 충돌이 생기면 데이터를 기반으로 결정하세요.`
            },

            family: {
                score: 73,
                description: `가족으로서 두 사람은 비슷한 에너지를 가져요. 부모-자식이든 형제자매든 완성을 함께 중요시하고 박애을 공유해요. 서로를 잘 이해하고 편안한 관계예요.`,
                strengths: ["서로를 잘 이해해요. 설명이 필요 없어요", "완성을 공유해서 방향성이 같아요", "편안하고 예측 가능해요"],
                challenges: ["너무 비슷해서 균형이 부족해요", "둘 다 이상주의하면 관계가 어려워져요", "현실 감각이 부족할 수 있어요"],
                advice: `가족이지만 개인의 차이도 존중하세요. 비슷해도 다른 부분이 있어요. 정기적으로 대화하고 서로의 생각을 나누세요.`
            },

            karma: {
                tasks: ["이상주의 극복하기: 완성의 어두운 면을 인식하세요", "완성 배우기: 9번의 에너지를 통해 성장하세요", "균형 잡기: 너무 박애하지 말고 반대도 시도하세요"],
                pastLife: `함께 지혜한 영혼들이에요. 아마 비슷한 여정을 걸었을 거예요. 이번 생에서는 더 깊이 이해하는 법을 배워야 해요.`
            },

            successKeys: ["역할 분담하기: 경쟁하지 말고 협력하세요", "이상주의 경계하기: 둘 다 빠지지 않도록 서로 체크하세요", "새로운 것 시도하기: 익숙함에서 벗어나 변화를 연습하세요", "완성 추구하기: 9번의 에너지로 성장하세요"],
            oneLine: `당신들은 함께 성자의 힘을 배가시킬 수 있어요. 경쟁하지 말고 협력하세요.`,
            compatibilityType: '노력이 필요한 관계',
            keywords: ["완성", "박애", "협력", "이해", "변화", "유연성"]
        },

    };
}
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.numerologyTest = new NumerologyTest();
});
