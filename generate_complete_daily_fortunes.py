#!/usr/bin/env python3
"""
Q1 2025 Daily Fortune Generator
Generates 1,080 unique daily fortune records for all zodiac signs

Usage: python generate_complete_daily_fortunes.py
Output: Three SQL files for January, February, March 2025
"""

import datetime
import random
from typing import Dict, List, Tuple

# Zodiac sign definitions
ZODIAC_SIGNS = {
    1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer",
    5: "Leo", 6: "Virgo", 7: "Libra", 8: "Scorpio", 
    9: "Sagittarius", 10: "Capricorn", 11: "Aquarius", 12: "Pisces"
}

# Historical metaphor patterns for each zodiac
METAPHOR_PATTERNS = {
    "Aries": ["fearless general", "triumphant conqueror", "brave warrior", "pioneering leader", "victorious commander"],
    "Taurus": ["master craftsman", "content artist", "devoted builder", "patient creator", "steadfast guardian"],
    "Gemini": ["brilliant orator", "eloquent speaker", "quick-witted diplomat", "clever communicator", "versatile messenger"],
    "Cancer": ["loving parent", "devoted caregiver", "wise family leader", "nurturing sovereign", "protective guardian"],
    "Leo": ["celebrated performer", "beloved entertainer", "charismatic leader", "radiant star", "royal presence"],
    "Virgo": ["dedicated scientist", "master craftsperson", "devoted reformer", "meticulous analyst", "healing humanitarian"],
    "Libra": ["skilled mediator", "diplomatic visionary", "artistic composer", "harmony creator", "peaceful negotiator"],
    "Scorpio": ["revolutionary artist", "master detective", "transformative phoenix", "penetrating investigator", "powerful alchemist"],
    "Sagittarius": ["bold explorer", "visionary philosopher", "adventurous pioneer", "wise teacher", "freedom seeker"],
    "Capricorn": ["mountain climber", "master builder", "strategic leader", "ambitious architect", "persistent achiever"],
    "Aquarius": ["visionary inventor", "revolutionary thinker", "innovative philanthropist", "progressive reformer", "humanitarian genius"],
    "Pisces": ["wise mystic", "brilliant artist", "spiritual guide", "intuitive healer", "compassionate dreamer"]
}

# Day of week energy patterns
DAY_ENERGY = {
    0: "Monday",  # Fresh start
    1: "Tuesday", # Building momentum  
    2: "Wednesday", # Mid-week balance
    3: "Thursday", # Achievement focus
    4: "Friday", # Completion energy
    5: "Saturday", # Reflection & relaxation
    6: "Sunday" # Spiritual & family focus
}

# Korean special dates
KOREAN_HOLIDAYS = {
    "2025-01-28": "설날_day1",
    "2025-01-29": "설날_day2", 
    "2025-01-30": "설날_day3",
    "2025-03-01": "삼일절"
}

# Universal special dates
SPECIAL_DATES = {
    "2025-01-01": "new_year",
    "2025-02-14": "valentines"
}

# Color pools by energy type
COLOR_POOLS = {
    "energy": ["Crimson Red", "Bright Orange", "Electric Yellow", "Victory Red", "Blazing Gold"],
    "nature": ["Forest Green", "Ocean Blue", "Earth Brown", "Sky Blue", "Moss Green"],
    "spiritual": ["Deep Purple", "Mystic White", "Silver Light", "Pearl White", "Lavender"],
    "creative": ["Rose Pink", "Turquoise", "Coral", "Sunset Orange", "Jade Green"],
    "power": ["Midnight Black", "Royal Navy", "Deep Crimson", "Charcoal Gray", "Steel Silver"]
}

# Score generation patterns
def generate_scores(zodiac_name: str, day_energy: str, is_special: bool) -> Tuple[int, int, int, int]:
    """Generate realistic score variations based on zodiac and day energy"""
    base_ranges = {
        "Monday": (75, 90, 70, 85, 65, 80, 70, 85),  # work higher
        "Tuesday": (70, 85, 75, 90, 70, 85, 70, 85), # balanced
        "Wednesday": (75, 90, 70, 85, 75, 90, 70, 85), # love/work higher
        "Thursday": (70, 85, 75, 90, 80, 95, 70, 85), # work/money higher
        "Friday": (75, 90, 80, 95, 85, 95, 75, 90), # completion high
        "Saturday": (80, 95, 65, 80, 60, 75, 80, 95), # work lower, health/love higher
        "Sunday": (75, 90, 70, 85, 65, 80, 80, 95) # health emphasized
    }
    
    love_min, love_max, money_min, money_max, work_min, work_max, health_min, health_max = base_ranges[day_energy]
    
    # Special date bonus
    if is_special:
        love_min += 5
        money_min += 3
        work_min += 3
        health_min += 5
    
    # Zodiac-specific adjustments
    zodiac_modifiers = {
        "Aries": (3, -2, 5, 0),     # love+, work++
        "Taurus": (-2, 5, 0, 3),    # money++, health+
        "Gemini": (3, -2, 3, -3),   # love+, work+, health-
        "Cancer": (5, 0, -3, 5),    # love++, health++, work-
        "Leo": (5, 0, 3, 0),        # love++, work+
        "Virgo": (-3, 3, 5, 3),     # money+, work++, health+
        "Libra": (3, 0, 0, 3),      # love+, health+
        "Scorpio": (0, 3, 3, 0),    # money+, work+
        "Sagittarius": (0, -2, 0, 5), # health++
        "Capricorn": (-3, 5, 5, 0), # money++, work++
        "Aquarius": (0, 0, 3, 3),   # work+, health+
        "Pisces": (3, -3, -3, 5)    # love+, health++
    }
    
    l_mod, m_mod, w_mod, h_mod = zodiac_modifiers.get(zodiac_name, (0, 0, 0, 0))
    
    love_score = max(60, min(95, random.randint(love_min + l_mod, love_max + l_mod)))
    money_score = max(60, min(95, random.randint(money_min + m_mod, money_max + m_mod)))
    work_score = max(60, min(95, random.randint(work_min + w_mod, work_max + w_mod)))
    health_score = max(60, min(95, random.randint(health_min + h_mod, health_max + h_mod)))
    
    return love_score, money_score, work_score, health_score

def select_color(day_energy: str, zodiac_name: str) -> str:
    """Select appropriate color based on day energy and zodiac"""
    energy_color_map = {
        "Monday": "energy",
        "Tuesday": "power", 
        "Wednesday": "creative",
        "Thursday": "power",
        "Friday": "energy",
        "Saturday": "creative",
        "Sunday": "spiritual"
    }
    
    color_type = energy_color_map[day_energy]
    return random.choice(COLOR_POOLS[color_type])

def generate_fortune_content(zodiac_name: str, date: str, day_energy: str, is_korean_holiday: bool, is_special: bool) -> Dict[str, str]:
    """Generate unique fortune content for the given parameters"""
    
    metaphor = random.choice(METAPHOR_PATTERNS[zodiac_name])
    
    # Base content templates with variations
    overall_templates = [
        f"Today's energy flows through you like a {metaphor} embracing new possibilities.",
        f"Your {zodiac_name.lower()} nature shines like a {metaphor} discovering hidden strengths.", 
        f"Cosmic forces align with your spirit like a {metaphor} achieving perfect balance."
    ]
    
    love_templates = [
        "Romantic connections deepen through authentic emotional expression and vulnerable sharing.",
        "Heart-centered communication creates meaningful bonds with potential for lasting love.",
        "Passionate energy attracts soulmate connections through magnetic personal authenticity."
    ]
    
    money_templates = [
        "Financial opportunities emerge through strategic thinking and calculated investment decisions.", 
        "Wealth-building activities gain momentum through disciplined saving and smart planning.",
        "Economic growth accelerates through diversified investments and practical money management."
    ]
    
    work_templates = [
        "Professional advancement comes through innovative solutions and collaborative team leadership.",
        "Career opportunities expand through networking excellence and demonstrated expertise.",
        "Workplace success flows from combining creative vision with practical implementation skills."
    ]
    
    health_templates = [
        "Physical vitality increases through balanced nutrition and energizing fitness activities.",
        "Wellness practices create harmony between mental clarity and physical strength.",
        "Healing energy accelerates through holistic approaches combining body, mind, and spirit."
    ]
    
    advice_templates = [
        "Trust your instincts today - your inner wisdom guides you toward authentic success.",
        "Embrace change boldly - transformation creates opportunities for extraordinary growth.",
        "Focus on connections - meaningful relationships provide the foundation for all achievement."
    ]
    
    # Select random templates and customize based on special dates
    content = {
        "overall": random.choice(overall_templates),
        "love": random.choice(love_templates),
        "money": random.choice(money_templates), 
        "work": random.choice(work_templates),
        "health": random.choice(health_templates),
        "advice": random.choice(advice_templates)
    }
    
    # Korean holiday customizations
    if is_korean_holiday:
        if "설날" in KOREAN_HOLIDAYS.get(date, ""):
            content["overall"] = f"설날의 새로운 시작 에너지가 당신의 {zodiac_name.lower()} 성격과 조화됩니다. Like a {metaphor} honoring tradition while embracing renewal, you blend ancestral wisdom with future vision."
        elif date == "2025-03-01":  # 삼일절
            content["overall"] = f"삼일절의 독립 정신이 당신의 {zodiac_name.lower()} 성격을 강화합니다. Like a {metaphor} fighting for freedom, you champion causes that liberate others from limitations."
    
    return content

def generate_daily_record(date_str: str, zodiac_id: int, zodiac_name: str) -> str:
    """Generate a complete daily fortune record"""
    
    date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    day_name = DAY_ENERGY[date_obj.weekday()]
    
    is_korean_holiday = date_str in KOREAN_HOLIDAYS
    is_special = date_str in SPECIAL_DATES or is_korean_holiday
    
    # Generate content
    content = generate_fortune_content(zodiac_name, date_str, day_name, is_korean_holiday, is_special)
    
    # Generate scores
    love_score, money_score, work_score, health_score = generate_scores(zodiac_name, day_name, is_special)
    
    # Generate lucky elements
    lucky_color = select_color(day_name, zodiac_name)
    lucky_number = random.randint(1, 99)
    
    # Generate lucky time
    hours = [f"{h:02d}" for h in range(24)]
    minutes = [f"{m:02d}" for m in [0, 15, 30, 45]]
    lucky_time = f"{random.choice(hours)}:{random.choice(minutes)}"
    
    # Format SQL INSERT statement
    sql = f"""('{date_str}', {zodiac_id}, '{zodiac_name}', '{content["overall"]}', '{content["love"]}', '{content["money"]}', '{content["work"]}', '{content["health"]}', {love_score}, {money_score}, {work_score}, {health_score}, '{lucky_color}', {lucky_number}, '{lucky_time}', '{content["advice"]}')"""
    
    return sql

def generate_month_file(year: int, month: int, output_file: str):
    """Generate complete month file with all zodiac records"""
    
    # Get all dates in the month
    if month == 2:
        days_in_month = 28  # 2025 is not a leap year
    elif month in [4, 6, 9, 11]:
        days_in_month = 30
    else:
        days_in_month = 31
    
    month_name = ["January", "February", "March"][month - 1]
    total_records = days_in_month * 12
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"""-- Daily Fortunes Q1 2025 - {month_name}
-- Total Records: {total_records} (12 zodiac signs × {days_in_month} days)
-- Generated with unique daily variations, Korean holidays, and historical figure metaphors

INSERT INTO daily_fortunes (date, zodiac_id, zodiac_name, overall_fortune, love_fortune, money_fortune, work_fortune, health_fortune, love_score, money_score, work_score, health_score, lucky_color, lucky_number, lucky_time, daily_advice) VALUES
""")
        
        records = []
        for day in range(1, days_in_month + 1):
            date_str = f"{year}-{month:02d}-{day:02d}"
            
            for zodiac_id, zodiac_name in ZODIAC_SIGNS.items():
                record = generate_daily_record(date_str, zodiac_id, zodiac_name)
                records.append(record)
        
        # Write all records with proper comma separation
        f.write(',\n'.join(records))
        f.write(';\n')
    
    print(f"Generated {output_file} with {total_records} records")

def main():
    """Generate all Q1 2025 daily fortune files"""
    print("Generating Q1 2025 Daily Fortune System - 1,080 unique records")
    print("=" * 60)
    
    # Set random seed for reproducible but varied results
    random.seed(2025)
    
    # Generate monthly files
    generate_month_file(2025, 1, "daily_fortunes_2025_january_complete.sql")
    generate_month_file(2025, 2, "daily_fortunes_2025_february_complete.sql") 
    generate_month_file(2025, 3, "daily_fortunes_2025_march_complete.sql")
    
    print("=" * 60)
    print("Complete Q1 2025 Daily Fortune System generated!")
    print("Total: 1,080 unique daily fortune records")
    print("\nFiles created:")
    print("- daily_fortunes_2025_january_complete.sql (372 records)")
    print("- daily_fortunes_2025_february_complete.sql (336 records)")
    print("- daily_fortunes_2025_march_complete.sql (372 records)")

if __name__ == "__main__":
    main()