// RHEIGHT 메인 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // 팔괘 테스트 링크 설정
    const baguaTests = {
        'astrology': 'tests/astrology.html',
        'blood-type': 'tests/blood-type.html',
        'tarot': 'tests/tarot.html',
        'saju': 'tests/saju.html',
        'zodiac': 'tests/zodiac.html',
        'fortune-cookie': 'tests/fortune-cookie.html',
        'enneagram': 'tests/enneagram.html',
        'palmistry': 'tests/palmistry.html',
        'mbti': 'tests/mbti.html'
    };

    // 배경 애니메이션 효과
    createStarfield();
});

// 팔괘 테스트 열기 함수 (HTML onclick에서 호출)
function openTest(testType) {
    const baguaTests = {
        'astrology': 'zodiac-system/web/zodiac.html',  // 서양 별자리 시스템
        'blood-type': 'tests/blood-type.html',
        'tarot': 'tarot-system/web/tarot.html',  // 타로카드 시스템 연결
        'saju': 'tests/saju.html',
        'zodiac': 'chinese-zodiac-system/web/chinese-zodiac.html',  // 중국 12간지 시스템
        'fortune-cookie': 'tests/fortune-cookie.html',
        'enneagram': 'tests/enneagram.html',
        'palmistry': 'tests/palmistry.html',
        'hormone': 'hormone-test/index.html'  // 호르몬 테스트 경로 수정
    };

    if (baguaTests[testType]) {
        window.open(baguaTests[testType], '_blank');
    }
}

// MBTI 테스트 열기 (HTML onclick에서 호출)
function openMBTI() {
    // MBTI 테스트 직접 열기 (팝업 없이)
    window.open('mbti-test/index.html', '_blank');
}

// 브랜드 정보 팝업 표시
function showBrandInfo() {
    const popup = document.createElement('div');
    popup.className = 'brand-popup';
    popup.innerHTML = `
        <div class="brand-popup-content">
            <button class="close-brand-popup" onclick="closeBrandPopup()">&times;</button>
            
            <div class="brand-header">
                <div class="brand-logo">
                    BAAL <span class="korean-name">바알</span>
                </div>
            </div>
            
            <div class="brand-section">
                <div class="brand-mission">
                    <p>사람은 무엇으로 갈증을 채우는가</p>
                    <p>잃어야 얻고, 끝나야 시작된다</p>
                    <p>가치 있는 자만이 가치를 얻는 법</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    addBrandPopupStyles();
    
    // 팝업 외부 클릭 시 닫기
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closeBrandPopup();
        }
    });
}

// 브랜드 팝업 닫기
function closeBrandPopup() {
    const popup = document.querySelector('.brand-popup');
    if (popup) {
        popup.remove();
    }
}

// 브랜드 팝업 스타일 동적 추가
function addBrandPopupStyles() {
    if (!document.querySelector('#brand-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'brand-popup-styles';
        style.textContent = `
            .brand-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                backdrop-filter: blur(8px);
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .brand-popup-content {
                background: #ffffff;
                padding: 30px;
                border-radius: 20px;
                position: relative;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
                max-width: 650px;
                width: 90%;
                max-height: 92vh;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .brand-popup-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(90deg, #e74c3c, #f39c12, #3498db);
                border-radius: 20px 20px 0 0;
            }
            
            .close-brand-popup {
                position: absolute;
                top: 20px;
                right: 25px;
                background: none;
                border: none;
                color: #95a5a6;
                font-size: 28px;
                cursor: pointer;
                font-weight: 300;
                line-height: 1;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 10;
            }
            
            .close-brand-popup:hover {
                color: #e74c3c;
                transform: rotate(90deg);
            }
            
            .brand-header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 2px solid #ecf0f1;
            }
            
            .brand-logo {
                font-size: 2.8rem;
                font-weight: 800;
                color: #2c3e50;
                letter-spacing: 5px;
                margin-bottom: 10px;
                font-family: 'Arial', sans-serif;
                display: inline-flex;
                align-items: baseline;
            }
            
            .korean-name {
                font-size: 0.9rem;
                color: #7f8c8d;
                letter-spacing: 2px;
                margin-left: 12px;
                font-weight: 400;
                display: inline-block;
            }
            
            .brand-section {
                margin-bottom: 15px;
            }
            
            .brand-section h3 {
                color: #2c3e50;
                font-size: 1.02rem;
                font-weight: 700;
                margin-bottom: 10px;
                letter-spacing: 0.5px;
                position: relative;
                padding-left: 12px;
            }
            
            .brand-section h3::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 18px;
                background: linear-gradient(to bottom, #e74c3c, #3498db);
                border-radius: 2px;
            }
            
            .brand-fullname {
                background: linear-gradient(135deg, #f8f9fa, #ffffff);
                padding: 10px 15px;
                border-radius: 10px;
                border-left: 4px solid #3498db;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                margin-bottom: 12px;
            }
            
            .fullname-line {
                font-family: 'Georgia', serif;
                font-size: 1rem;
                line-height: 1.6;
                color: #34495e;
                white-space: nowrap;
                display: block;
                text-align: center;
            }
            
            .fullname-line .letter {
                font-weight: 800;
                color: #e74c3c;
                font-size: 1.1rem;
                text-shadow: 0 1px 2px rgba(231, 76, 60, 0.2);
            }
            
            .fullname-korean {
                font-family: 'Arial', sans-serif;
                font-size: 0.9rem;
                line-height: 1.4;
                color: #2c3e50;
                margin-top: 8px;
                text-align: center;
                font-weight: 600;
            }
            
            .brand-meaning,
            .brand-mission {
                background: #f8f9fa;
                padding: 12px 15px;
                border-radius: 8px;
                line-height: 1.6;
                word-break: keep-all;
                word-wrap: break-word;
            }
            
            .brand-meaning p,
            .brand-mission p {
                color: #2c3e50;
                font-size: 0.9rem;
                margin: 6px 0;
                font-family: 'Arial', sans-serif;
                word-break: keep-all;
                word-wrap: break-word;
            }
            
            .brand-meaning p:first-child,
            .brand-mission p:first-child {
                margin-top: 0;
            }
            
            .brand-meaning p:last-child,
            .brand-mission p:last-child {
                margin-bottom: 0;
            }
            
            .brand-meaning strong {
                color: #3498db;
                font-weight: 700;
                font-size: 0.95rem;
            }
            
            .brand-mission em {
                color: #e74c3c;
                font-style: normal;
                font-weight: 600;
                background: rgba(231, 76, 60, 0.08);
                padding: 3px 6px;
                border-radius: 4px;
                white-space: nowrap;
            }
            
            /* 스크롤바 스타일링 */
            .brand-popup-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .brand-popup-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            
            .brand-popup-content::-webkit-scrollbar-thumb {
                background: #bdc3c7;
                border-radius: 10px;
            }
            
            .brand-popup-content::-webkit-scrollbar-thumb:hover {
                background: #95a5a6;
            }
            
            /* 태블릿 반응형 */
            @media (max-width: 768px) {
                .brand-popup-content {
                    margin: 20px;
                    padding: 35px 25px;
                    max-width: none;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .brand-logo {
                    font-size: 2.2rem;
                    letter-spacing: 3px;
                }
                
                .korean-name {
                    font-size: 0.75rem;
                    display: block;
                    margin: 8px 0 0 0;
                }
                
                .fullname-line {
                    font-size: 0.85rem;
                }
                
                .fullname-line .letter {
                    font-size: 1rem;
                }
                
                .brand-section h3 {
                    font-size: 0.98rem;
                }
                
                .brand-meaning p,
                .brand-mission p {
                    font-size: 0.88rem;
                }
            }
            
            /* 모바일 반응형 */
            @media (max-width: 480px) {
                .brand-popup-content {
                    margin: 10px;
                    padding: 30px 20px;
                    border-radius: 15px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .brand-header {
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                }
                
                .brand-logo {
                    font-size: 1.8rem;
                    letter-spacing: 2px;
                }
                
                .korean-name {
                    font-size: 0.7rem;
                }
                
                .brand-fullname {
                    padding: 12px 15px;
                }
                
                .fullname-line {
                    font-size: 0.75rem;
                    white-space: normal;
                    word-break: keep-all;
                    line-height: 1.8;
                }
                
                .fullname-line .letter {
                    font-size: 0.9rem;
                }
                
                .brand-section {
                    margin-bottom: 22px;
                }
                
                .brand-section h3 {
                    font-size: 0.92rem;
                    margin-bottom: 10px;
                }
                
                .brand-meaning,
                .brand-mission {
                    padding: 12px 15px;
                }
                
                .brand-meaning p,
                .brand-mission p {
                    font-size: 0.82rem;
                    line-height: 1.6;
                }
                
                .close-brand-popup {
                    font-size: 24px;
                    top: 15px;
                    right: 15px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 필요없는 MBTI 팝업 함수들 제거됨

// 별 배경 효과
function createStarfield() {
    const starContainer = document.createElement('div');
    starContainer.className = 'starfield';
    starContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
        `;
        starContainer.appendChild(star);
    }
    
    // 별 깜빡임 애니메이션
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(starContainer);
}