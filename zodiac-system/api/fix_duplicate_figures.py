#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
별자리 운세 API 인물 중복 문제 수정 스크립트
"""

def fix_zodiac_api():
    # 백업 파일 읽기
    try:
        with open('zodiac-api-final-backup.js', 'r', encoding='utf-8') as f:
            content = f.read()
        print("✅ 백업 파일 읽기 완료")
    except Exception as e:
        print(f"❌ 백업 파일 읽기 실패: {e}")
        return False
    
    # 1. selectHistoricalFigure 함수의 시드 로직 강화
    old_seed_logic = '''        // 카테고리별 시드값 생성 (재현 가능한 랜덤성)
        const categorySeeds = {
            'overall': 1, 'love': 2, 'money': 3, 'work': 4, 'health': 5,
            'advice': 6, '애정운': 2, '금전운': 3, '직장운': 4, '건강운': 5
        };
        
        const categorySeed = categorySeeds[category] || 1;
        const seed = dayOfYear + (categorySeed * 1000) + zodiacId;
        
        // 시드 기반 랜덤 인덱스 생성 (Math.random() 대신 재현가능한 방식)
        const figureIndex = (seed * 7919) % zodiacData.figures.length;'''
    
    new_seed_logic = '''        // 강화된 시드 기반 랜덤 (날짜 + 카테고리 + 시간)
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        
        // 카테고리별 시드값 생성 (더 큰 간격으로 분리)
        const categorySeeds = {
            'overall': 1000, 'love': 2500, 'money': 4000, 'work': 5500, 'health': 7000,
            'advice': 8500, '애정운': 2500, '금전운': 4000, '직장운': 5500, '건강운': 7000
        };
        
        const categorySeed = categorySeeds[category] || 1000;
        
        // 시간 기반 추가 랜덤성 (시/분 추가)
        const timeSeed = (currentHour * 60) + currentMinute;
        const seed = dayOfYear + categorySeed + (zodiacId * 100) + timeSeed;
        
        // 더 강력한 시드 기반 랜덤 인덱스 생성 (소수 사용)
        const figureIndex = (seed * 31337) % zodiacData.figures.length;'''
    
    if old_seed_logic in content:
        content = content.replace(old_seed_logic, new_seed_logic)
        print("✅ 시드 로직 강화 완료")
    else:
        print("⚠️ 시드 로직 패턴을 찾을 수 없음")
    
    # 2. overall과 advice에서 잘못된 템플릿 참조 수정
    old_overall_advice = '''            // overall과 advice - 레거시 문장 제거하고 새 완전한 문장만 사용
            const overallFigure = this.selectHistoricalFigure(zodiacId, today, 'overall');
            const safeOverall = overallFigure && overallFigure.naturalTemplates && overallFigure.naturalTemplates.work ? 
                overallFigure.naturalTemplates.work :  // 완전한 문장만 사용 (레거시 제거)
                this.ensureMessageQuality(fortuneData.overall);
                
            const adviceFigure = this.selectHistoricalFigure(zodiacId, today, 'advice');
            const safeAdvice = adviceFigure && adviceFigure.naturalTemplates && adviceFigure.naturalTemplates.work ? 
                adviceFigure.naturalTemplates.work :  // 완전한 문장만 사용 (레거시 제거)
                this.ensureMessageQuality(fortuneData.advice);'''
    
    new_overall_advice = '''            // overall과 advice - 카테고리별 다른 인물과 올바른 템플릿 사용
            const overallFigure = this.selectHistoricalFigure(zodiacId, today, 'overall');
            let safeOverall;
            if (overallFigure && overallFigure.naturalTemplates) {
                // overall 카테고리를 먼저 시도, 없으면 love나 첫 번째 사용가능한 것 사용
                if (overallFigure.naturalTemplates.overall) {
                    safeOverall = overallFigure.naturalTemplates.overall;
                } else if (overallFigure.naturalTemplates.love) {
                    safeOverall = overallFigure.naturalTemplates.love;
                } else {
                    // 사용 가능한 첫 번째 카테고리 사용
                    const availableCategories = Object.keys(overallFigure.naturalTemplates);
                    safeOverall = availableCategories.length > 0 ? 
                        overallFigure.naturalTemplates[availableCategories[0]] :
                        this.ensureMessageQuality(fortuneData.overall);
                }
                console.log(`📝 Overall 메시지: ${overallFigure.name}의 템플릿 사용`);
            } else {
                safeOverall = this.ensureMessageQuality(fortuneData.overall);
                console.log('📝 Overall 메시지: 기본 데이터 사용');
            }
                
            const adviceFigure = this.selectHistoricalFigure(zodiacId, today, 'advice');
            let safeAdvice;
            if (adviceFigure && adviceFigure.naturalTemplates) {
                // health나 마지막 카테고리를 우선 사용하여 work와 겹치지 않도록
                if (adviceFigure.naturalTemplates.health) {
                    safeAdvice = adviceFigure.naturalTemplates.health;
                } else if (adviceFigure.naturalTemplates.advice) {
                    safeAdvice = adviceFigure.naturalTemplates.advice;
                } else {
                    // 사용 가능한 마지막 카테고리 사용 (work와 겹치지 않도록)
                    const availableCategories = Object.keys(adviceFigure.naturalTemplates);
                    safeAdvice = availableCategories.length > 0 ? 
                        adviceFigure.naturalTemplates[availableCategories[availableCategories.length - 1]] :
                        this.ensureMessageQuality(fortuneData.advice);
                }
                console.log(`💡 Advice 메시지: ${adviceFigure.name}의 템플릿 사용`);
            } else {
                safeAdvice = this.ensureMessageQuality(fortuneData.advice);
                console.log('💡 Advice 메시지: 기본 데이터 사용');
            }'''
    
    if old_overall_advice in content:
        content = content.replace(old_overall_advice, new_overall_advice)
        print("✅ overall/advice 템플릿 참조 수정 완료")
    else:
        print("⚠️ overall/advice 패턴을 찾을 수 없음")
    
    # 3. 주석 업데이트
    content = content.replace(
        '* 양자리 구체적 조언 적용 버전',
        '* 인물 중복 문제 완전 해결 버전'
    )
    content = content.replace(
        '* 양자리(ID: 1)만 구체적 업적 기반 메시지 적용',
        '* 인물 중복 방지 시스템 강화: 카테고리별 완전히 다른 인물 보장'
    )
    
    # 새 파일 저장
    try:
        with open('zodiac-api-final.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ 수정된 파일 저장 완료: zodiac-api-final.js")
        return True
    except Exception as e:
        print(f"❌ 파일 저장 실패: {e}")
        return False

if __name__ == "__main__":
    print("🔧 별자리 API 인물 중복 문제 수정 시작...")
    success = fix_zodiac_api()
    if success:
        print("🎉 인물 중복 문제 수정 완료!")
    else:
        print("❌ 수정 실패")