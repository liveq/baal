#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def fix_zodiac_api():
    with open('zodiac-api-final-backup.js', 'r', encoding='utf-8') as f:
        content = f.read()
    print("백업 파일 읽기 완료")
    
    # 시드 로직 강화
    old_seed = '''        // 카테고리별 시드값 생성 (재현 가능한 랜덤성)
        const categorySeeds = {
            'overall': 1, 'love': 2, 'money': 3, 'work': 4, 'health': 5,
            'advice': 6, '애정운': 2, '금전운': 3, '직장운': 4, '건강운': 5
        };
        
        const categorySeed = categorySeeds[category] || 1;
        const seed = dayOfYear + (categorySeed * 1000) + zodiacId;
        
        // 시드 기반 랜덤 인덱스 생성 (Math.random() 대신 재현가능한 방식)
        const figureIndex = (seed * 7919) % zodiacData.figures.length;'''
    
    new_seed = '''        // 강화된 시드 기반 랜덤 (날짜 + 카테고리 + 시간)
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
    
    content = content.replace(old_seed, new_seed)
    print("시드 로직 강화 완료")
    
    # overall/advice 템플릿 수정
    old_template = '''            const safeOverall = overallFigure && overallFigure.naturalTemplates && overallFigure.naturalTemplates.work ? 
                overallFigure.naturalTemplates.work :  // 완전한 문장만 사용 (레거시 제거)
                this.ensureMessageQuality(fortuneData.overall);
                
            const adviceFigure = this.selectHistoricalFigure(zodiacId, today, 'advice');
            const safeAdvice = adviceFigure && adviceFigure.naturalTemplates && adviceFigure.naturalTemplates.work ? 
                adviceFigure.naturalTemplates.work :  // 완전한 문장만 사용 (레거시 제거)
                this.ensureMessageQuality(fortuneData.advice);'''
    
    new_template = '''            let safeOverall;
            if (overallFigure && overallFigure.naturalTemplates) {
                if (overallFigure.naturalTemplates.overall) {
                    safeOverall = overallFigure.naturalTemplates.overall;
                } else if (overallFigure.naturalTemplates.love) {
                    safeOverall = overallFigure.naturalTemplates.love;
                } else {
                    const availableCategories = Object.keys(overallFigure.naturalTemplates);
                    safeOverall = availableCategories.length > 0 ? 
                        overallFigure.naturalTemplates[availableCategories[0]] :
                        this.ensureMessageQuality(fortuneData.overall);
                }
                console.log(`Overall 메시지: ${overallFigure.name}의 템플릿 사용`);
            } else {
                safeOverall = this.ensureMessageQuality(fortuneData.overall);
            }
                
            const adviceFigure = this.selectHistoricalFigure(zodiacId, today, 'advice');
            let safeAdvice;
            if (adviceFigure && adviceFigure.naturalTemplates) {
                if (adviceFigure.naturalTemplates.health) {
                    safeAdvice = adviceFigure.naturalTemplates.health;
                } else if (adviceFigure.naturalTemplates.advice) {
                    safeAdvice = adviceFigure.naturalTemplates.advice;
                } else {
                    const availableCategories = Object.keys(adviceFigure.naturalTemplates);
                    safeAdvice = availableCategories.length > 0 ? 
                        adviceFigure.naturalTemplates[availableCategories[availableCategories.length - 1]] :
                        this.ensureMessageQuality(fortuneData.advice);
                }
                console.log(`Advice 메시지: ${adviceFigure.name}의 템플릿 사용`);
            } else {
                safeAdvice = this.ensureMessageQuality(fortuneData.advice);
            }'''
    
    content = content.replace(old_template, new_template)
    print("템플릿 참조 수정 완료")
    
    with open('zodiac-api-final.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("수정된 파일 저장 완료")

if __name__ == "__main__":
    fix_zodiac_api()
    print("인물 중복 문제 수정 완료!")