let currentBloodType = null;
let currentGender = 'male';

window.selectBloodType = function(type) {
    currentBloodType = type;
    
    document.querySelectorAll('.blood-type-btn-nav').forEach(btn => {
        btn.classList.remove('active-a', 'active-b', 'active-o', 'active-ab');
    });
    
    const activeBtn = document.querySelector(`[data-blood="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add(`active-${type.toLowerCase()}`);
    }
    
    updateThemeColor(type);
    loadBloodTypeData();
};

window.selectGender = function(gender) {
    currentGender = gender;
    
    document.querySelectorAll('.blood-gender-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`gender-${gender}`).classList.add('active');
    
    if (currentBloodType) {
        loadBloodTypeData();
    }
};

window.showTab = function(tabName, sourceEvent) {
    document.querySelectorAll('.blood-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.blood-tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // 1. 매개변수로 전달된 이벤트 우선 사용
    // 2. 전역 event 객체 확인 (onclick 이벤트용)
    // 3. DOM 쿼리로 대체 (setTimeout 호출용)
    if (sourceEvent && sourceEvent.target) {
        sourceEvent.target.classList.add('active');
    } else if (typeof event !== 'undefined' && event && event.target) {
        event.target.classList.add('active');
    } else {
        // setTimeout 또는 프로그래밍 방식 호출을 위한 대체 방법
        const targetBtn = document.querySelector(`.blood-tab-btn[onclick*="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }
    
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    if (tabName === 'daily' && currentBloodType) {
        loadDailyFortune();
    } else if (tabName === 'figures' && currentBloodType) {
        loadHistoricalFigures();
    }
};

window.calculateCompatibility = function() {
    const myType = document.getElementById('myBloodType').value;
    const partnerType = document.getElementById('partnerBloodType').value;
    
    if (!myType || !partnerType) {
        document.getElementById('compatibilityResult').innerHTML = '';
        return;
    }
    
    const result = bloodTypeAPI.getCompatibility(myType, partnerType);
    displayCompatibilityResult(result);
};

window.closeModal = function() {
    document.getElementById('bloodModal').style.display = 'none';
};

function updateThemeColor(type) {
    const root = document.documentElement;
    const colors = {
        'A': '#0066cc',
        'B': '#ff9500',
        'O': '#dc3545',
        'AB': '#8b5cf6'
    };
    
    if (colors[type]) {
        root.style.setProperty('--blood-accent-color', colors[type]);
    }
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
}

function displayBasicTraits(data) {
    const panel = document.getElementById('basic-panel');
    const figures = bloodTypeAPI.getHistoricalFigures(currentBloodType, currentGender);
    
    panel.innerHTML = `
        <div class="blood-trait-content">
            <h3>${currentBloodType}형 ${currentGender === 'male' ? '남성' : '여성'}의 성격</h3>
            <p style="margin: 20px 0; line-height: 1.8;">${data.overall}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div>
                    <h4 style="color: var(--blood-accent-color); margin-bottom: 10px;">장점</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${data.strengths.map(s => `<li style="padding: 5px 0;">✓ ${s}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--blood-accent-color); margin-bottom: 10px;">약점</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${data.weaknesses.map(w => `<li style="padding: 5px 0;">• ${w}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: var(--blood-bg-secondary); border-radius: 10px;">
                <h4 style="margin-bottom: 15px;">같은 ${currentBloodType}형 유명인</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${data.famousPeople.map(p => `
                        <span style="padding: 8px 15px; background: white; border-radius: 20px; font-size: 0.95rem;">
                            ${p}
                        </span>
                    `).join('')}
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
    
    const categoryColors = {
        love: '#e91e63',
        health: '#4caf50',
        wealth: '#ff9800'
    };
    
    panel.innerHTML = `
        <div class="blood-category-content">
            <h3>${currentBloodType}형의 ${categoryNames[category]}</h3>
            
            <div style="text-align: center; margin: 30px 0;">
                <div style="position: relative; display: inline-block;">
                    <svg width="150" height="150">
                        <circle cx="75" cy="75" r="70" fill="none" stroke="#e0e0e0" stroke-width="10"/>
                        <circle cx="75" cy="75" r="70" fill="none" 
                                stroke="${categoryColors[category]}" 
                                stroke-width="10"
                                stroke-dasharray="${data.score * 4.4} 440"
                                stroke-dashoffset="0"
                                transform="rotate(-90 75 75)"
                                style="transition: stroke-dasharray 1s ease;"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.5rem; font-weight: 700; color: ${categoryColors[category]};">
                        ${data.score}
                    </div>
                </div>
            </div>
            
            <p style="margin: 20px 0; line-height: 1.8; color: var(--blood-text-secondary);">
                ${data.description}
            </p>
            
            <div style="padding: 20px; background: var(--blood-bg-secondary); border-radius: 10px; margin: 20px 0;">
                <h4 style="color: ${categoryColors[category]}; margin-bottom: 10px;">조언</h4>
                <p>${data.advice}</p>
            </div>
            
            <div style="margin-top: 20px;">
                <span style="font-weight: 600; margin-right: 10px;">행운 아이템:</span>
                ${data.luckyItems.map(item => `
                    <span style="padding: 6px 12px; background: ${categoryColors[category]}; color: white; border-radius: 15px; margin: 0 5px; font-size: 0.9rem;">
                        ${item}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function displayCompatibilityResult(data) {
    const resultDiv = document.getElementById('compatibilityResult');
    resultDiv.innerHTML = `
        <div class="blood-result-card">
            <h4>궁합 점수</h4>
            <div class="blood-score">${data.score}점</div>
            <div class="blood-score-bar">
                <div class="blood-score-fill" style="width: ${data.score}%"></div>
            </div>
            <p style="margin: 20px 0; line-height: 1.6;">${data.description}</p>
            <div style="padding: 15px; background: white; border-radius: 10px; margin-top: 20px;">
                <h5 style="color: var(--blood-accent-color); margin-bottom: 10px;">관계 개선 팁</h5>
                <p>${data.tips}</p>
            </div>
        </div>
    `;
}

async function loadDailyFortune() {
    const today = new Date().toISOString().split('T')[0];
    const fortune = await bloodTypeAPI.getDailyFortune(currentBloodType, today);
    
    const panel = document.getElementById('daily-panel');
    panel.innerHTML = `
        <div class="blood-daily-content">
            <h3>${currentBloodType}형의 오늘의 운세</h3>
            <p style="text-align: center; color: var(--blood-text-secondary); margin-bottom: 20px;">${today}</p>
            
            <div style="padding: 20px; background: var(--blood-bg-secondary); border-radius: 10px; margin-bottom: 30px;">
                <p style="font-size: 1.1rem; line-height: 1.8;">${fortune.message}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="text-align: center;">
                    <h5 style="color: #e91e63; margin-bottom: 10px;">애정운</h5>
                    <div style="font-size: 2rem; font-weight: 700; color: #e91e63;">${fortune.loveScore}</div>
                </div>
                <div style="text-align: center;">
                    <h5 style="color: #4caf50; margin-bottom: 10px;">건강운</h5>
                    <div style="font-size: 2rem; font-weight: 700; color: #4caf50;">${fortune.healthScore}</div>
                </div>
                <div style="text-align: center;">
                    <h5 style="color: #ff9800; margin-bottom: 10px;">재물운</h5>
                    <div style="font-size: 2rem; font-weight: 700; color: #ff9800;">${fortune.wealthScore}</div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
                <span>행운의 색상: <strong style="color: var(--blood-accent-color);">${fortune.luckyColor}</strong></span>
                <span>행운의 숫자: <strong style="color: var(--blood-accent-color);">${fortune.luckyNumber}</strong></span>
            </div>
            
            <div style="padding: 15px; background: white; border: 2px solid var(--blood-accent-color); border-radius: 10px;">
                <p>${fortune.advice}</p>
            </div>
        </div>
    `;
}

function loadHistoricalFigures() {
    if (!currentBloodType) return;
    
    const figures = bloodTypeAPI.getHistoricalFigures(currentBloodType, currentGender);
    const panel = document.getElementById('figures-panel');
    
    panel.innerHTML = `
        <div class="blood-figures-content">
            <h3>${currentBloodType}형의 역사적 인물들</h3>
            <p style="text-align: center; color: var(--blood-text-secondary); margin-bottom: 30px;">
                ${currentGender === 'male' ? '남성' : '여성'} 인물
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                ${figures.map(figure => `
                    <div style="padding: 20px; background: white; border: 1px solid var(--blood-border-color); border-radius: 10px;">
                        <h4 style="color: var(--blood-accent-color); margin-bottom: 10px;">${figure.name}</h4>
                        <p style="font-size: 0.9rem; color: var(--blood-text-secondary); margin-bottom: 5px;">${figure.era}</p>
                        <span style="display: inline-block; padding: 4px 10px; background: var(--blood-bg-secondary); border-radius: 15px; font-size: 0.85rem; margin-bottom: 10px;">
                            ${figure.field}
                        </span>
                        <p style="font-weight: 600; color: var(--blood-accent-color); margin: 10px 0;">${figure.trait}</p>
                        <p style="font-style: italic; line-height: 1.6; color: var(--blood-text-secondary);">
                            "${figure.story}"
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'compatibility') {
        document.querySelector('.blood-compatibility-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('bloodModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});