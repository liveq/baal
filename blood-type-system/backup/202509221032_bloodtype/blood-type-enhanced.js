let currentBloodType = null;
let currentGender = 'male';
let historicalFigures = null;

window.toggleBloodNav = function() {
    const nav = document.querySelector('.blood-nav');
    nav.classList.toggle('blood-nav-collapsed');
};

window.selectBloodType = function(type) {
    currentBloodType = type;
    
    document.querySelectorAll('.blood-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-blood="${type}"]`).classList.add('active');
    
    updateBloodTheme(type);
    loadBloodTypeStory(type);
    loadBloodTypeData();
};

window.selectGender = function(gender) {
    currentGender = gender;
    
    document.querySelectorAll('.blood-gender-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`blood-gender-${gender}`).classList.add('active');
    
    if (currentBloodType) {
        loadBloodTypeStory(currentBloodType);
        loadBloodTypeData();
    }
};

window.showBloodTab = function(tabName) {
    document.querySelectorAll('.blood-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.blood-tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    if (tabName === 'daily' && currentBloodType) {
        loadDailyFortune();
    }
};

window.calculateCompatibility = function() {
    const myType = document.getElementById('myBloodType').value;
    const partnerType = document.getElementById('partnerBloodType').value;
    
    if (!myType || !partnerType) return;
    
    const result = bloodTypeAPI.getCompatibility(myType, partnerType);
    displayCompatibilityResult(result);
};

window.showBloodToastMessage = function(message) {
    const toast = document.getElementById('bloodToast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

window.showHistoricalFigures = function() {
    if (!currentBloodType) {
        window.showBloodToastMessage('먼저 혈액형을 선택해주세요');
        return;
    }
    
    const modal = document.getElementById('bloodModal');
    const title = document.getElementById('blood-modal-title');
    const body = document.getElementById('blood-modal-body');
    
    title.textContent = `${currentBloodType}형의 역사적 인물들`;
    
    const figures = bloodTypeAPI.getHistoricalFigures(currentBloodType, currentGender);
    let html = '<div class="blood-figures-grid">';
    
    figures.forEach(figure => {
        html += `
            <div class="blood-figure-card">
                <h3>${figure.name}</h3>
                <span class="blood-figure-era">${figure.era}</span>
                <span class="blood-figure-field">${figure.field}</span>
                <p class="blood-figure-trait">${figure.trait}</p>
                <p class="blood-figure-story">"${figure.story}"</p>
            </div>
        `;
    });
    
    html += '</div>';
    body.innerHTML = html;
    modal.style.display = 'block';
};

window.closeBloodModal = function() {
    document.getElementById('bloodModal').style.display = 'none';
};

function updateBloodTheme(type) {
    const root = document.documentElement;
    const themes = {
        'A': { primary: '#3b82f6', secondary: '#60a5fa', bg: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' },
        'B': { primary: '#f59e0b', secondary: '#fbbf24', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        'O': { primary: '#ef4444', secondary: '#f87171', bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
        'AB': { primary: '#8b5cf6', secondary: '#a78bfa', bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
    };
    
    const theme = themes[type];
    if (theme) {
        root.style.setProperty('--blood-accent-color', theme.primary);
        root.style.setProperty('--blood-accent-secondary', theme.secondary);
        root.style.setProperty('--blood-accent-bg', theme.bg);
    }
}

async function loadBloodTypeStory(type) {
    const figures = await bloodTypeAPI.getHistoricalFigures(type, currentGender);
    const metaphor = await bloodTypeAPI.getMetaphor(type);
    
    const quoteDiv = document.getElementById('blood-story-quote');
    const quoteText = quoteDiv.querySelector('.blood-quote-text');
    const quoteAuthor = quoteDiv.querySelector('.blood-quote-author');
    
    if (figures && figures.length > 0) {
        const randomFigure = figures[Math.floor(Math.random() * figures.length)];
        quoteText.textContent = `"${randomFigure.story}"`;
        quoteAuthor.textContent = `- ${randomFigure.name}, ${type}형의 ${randomFigure.trait}`;
        quoteDiv.style.display = 'block';
    }
    
    const title = document.getElementById('blood-main-title');
    const subtitle = document.getElementById('blood-main-subtitle');
    
    title.textContent = `${type}형: ${metaphor.nature}`;
    subtitle.textContent = `${metaphor.season}의 ${metaphor.element}, ${metaphor.time}의 기운`;
}

async function loadBloodTypeData() {
    if (!currentBloodType) return;
    
    const basicData = await bloodTypeAPI.getBasicTraits(currentBloodType, currentGender);
    displayBasicTraits(basicData);
    
    const loveData = await bloodTypeAPI.getCategoryAnalysis(currentBloodType, 'love');
    displayCategoryData('love', loveData);
    
    const healthData = await bloodTypeAPI.getCategoryAnalysis(currentBloodType, 'health');
    displayCategoryData('health', healthData);
    
    const wealthData = await bloodTypeAPI.getCategoryAnalysis(currentBloodType, 'wealth');
    displayCategoryData('wealth', wealthData);
    
    window.showBloodToastMessage(`${currentBloodType}형 정보를 불러왔습니다.`);
}

function displayBasicTraits(data) {
    const panel = document.getElementById('basic-panel');
    const figures = bloodTypeAPI.getHistoricalFigures(currentBloodType, currentGender);
    const randomFigures = figures.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    panel.innerHTML = `
        <div class="blood-trait-card">
            <h2>${currentBloodType}형 ${currentGender === 'male' ? '남성' : '여성'}의 성격</h2>
            <div class="blood-trait-content">
                <div class="blood-trait-section">
                    <h3>전반적 성격</h3>
                    <p>${data.overall}</p>
                </div>
                <div class="blood-trait-figures">
                    <h3>당신과 같은 ${currentBloodType}형 인물들</h3>
                    <div class="blood-figure-cards">
                        ${randomFigures.map(f => `
                            <div class="blood-mini-figure">
                                <span class="blood-figure-name">${f.name}</span>
                                <span class="blood-figure-trait">${f.trait}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="blood-trait-section">
                    <h3>장점</h3>
                    <ul class="blood-trait-list">
                        ${data.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="blood-trait-section">
                    <h3>단점</h3>
                    <ul class="blood-trait-list">
                        ${data.weaknesses.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function displayCategoryData(category, data) {
    const panel = document.getElementById(`${category}-panel`);
    const categoryNames = {
        love: '애정운',
        health: '건강운',
        wealth: '재물운'
    };
    
    const metaphor = bloodTypeAPI.getMetaphor(currentBloodType);
    
    panel.innerHTML = `
        <div class="blood-category-card">
            <h2>${currentBloodType}형의 ${categoryNames[category]}</h2>
            <div class="blood-metaphor-badge">
                <span>${metaphor.nature}의 기운</span>
            </div>
            <div class="blood-score-display">
                <div class="blood-score-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="5"/>
                        <circle cx="50" cy="50" r="45" fill="none" 
                                stroke="var(--blood-accent-color)" 
                                stroke-width="5"
                                stroke-dasharray="${data.score * 2.83} 283"
                                stroke-dashoffset="0"
                                transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="blood-score-number">${data.score}</div>
                </div>
            </div>
            <div class="blood-category-content">
                <p>${data.description}</p>
                <div class="blood-advice-box">
                    <h3>조언</h3>
                    <p>${data.advice}</p>
                </div>
                <div class="blood-lucky-items">
                    <span class="blood-lucky-label">행운 아이템:</span>
                    ${data.luckyItems.map(item => `<span class="blood-lucky-item">${item}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function displayCompatibilityResult(data) {
    const resultDiv = document.getElementById('compatibilityResult');
    resultDiv.innerHTML = `
        <div class="blood-compatibility-result">
            <h3>궁합 점수</h3>
            <div class="blood-compatibility-score">${data.score}점</div>
            <div class="blood-compatibility-bar">
                <div class="blood-compatibility-fill" style="width: ${data.score}%"></div>
            </div>
            <p class="blood-compatibility-desc">${data.description}</p>
            <div class="blood-compatibility-tips">
                <h4>관계 개선 팁</h4>
                <p>${data.tips}</p>
            </div>
        </div>
    `;
}

async function loadDailyFortune() {
    const today = new Date().toISOString().split('T')[0];
    const fortune = await bloodTypeAPI.getDailyFortune(currentBloodType, today);
    const figures = bloodTypeAPI.getHistoricalFigures(currentBloodType, currentGender);
    const todaysFigure = figures[new Date().getDate() % figures.length];
    
    const panel = document.getElementById('daily-panel');
    panel.innerHTML = `
        <div class="blood-daily-card">
            <h2>${currentBloodType}형의 오늘의 운세</h2>
            <p class="blood-daily-date">${today}</p>
            <div class="blood-daily-figure">
                <p class="blood-daily-inspiration">오늘의 영감: ${todaysFigure.name}</p>
                <p class="blood-daily-quote">"${todaysFigure.story}"</p>
            </div>
            <div class="blood-daily-content">
                <p class="blood-daily-message">${fortune.message}</p>
                <div class="blood-daily-scores">
                    <div class="blood-daily-score-item">
                        <span class="blood-score-label">애정</span>
                        <div class="blood-score-bar">
                            <div class="blood-score-fill" style="width: ${fortune.loveScore}%; background: #ef4444;"></div>
                        </div>
                        <span class="blood-score-value">${fortune.loveScore}</span>
                    </div>
                    <div class="blood-daily-score-item">
                        <span class="blood-score-label">건강</span>
                        <div class="blood-score-bar">
                            <div class="blood-score-fill" style="width: ${fortune.healthScore}%; background: #10b981;"></div>
                        </div>
                        <span class="blood-score-value">${fortune.healthScore}</span>
                    </div>
                    <div class="blood-daily-score-item">
                        <span class="blood-score-label">재물</span>
                        <div class="blood-score-bar">
                            <div class="blood-score-fill" style="width: ${fortune.wealthScore}%; background: #f59e0b;"></div>
                        </div>
                        <span class="blood-score-value">${fortune.wealthScore}</span>
                    </div>
                </div>
                <div class="blood-daily-lucky">
                    <span>행운의 색상: <strong>${fortune.luckyColor}</strong></span>
                    <span>행운의 숫자: <strong>${fortune.luckyNumber}</strong></span>
                </div>
                <div class="blood-daily-advice">
                    <p>${fortune.advice}</p>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'compatibility') {
        setTimeout(() => {
            const compatBtn = document.querySelector('.blood-tab-btn:nth-child(6)');
            if (compatBtn) compatBtn.click();
        }, 100);
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('bloodModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});