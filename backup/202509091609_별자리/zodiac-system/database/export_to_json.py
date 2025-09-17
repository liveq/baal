import sqlite3
import json
from datetime import datetime

# 데이터베이스 연결
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

print("Exporting database to JSON...")

# Export structure
export_data = {
    "daily": {},
    "weekly": {},
    "monthly": {},
    "yearly": {},
    "compatibility": {}
}

# 1. Export daily fortunes
cursor.execute("""
    SELECT zodiac_id, date, overall, 
           love_fortune, love_score,
           money_fortune, money_score,
           work_fortune, work_score,
           health_fortune, health_score,
           lucky_color, lucky_number, lucky_time, advice
    FROM daily_fortunes_data
    ORDER BY date, zodiac_id
""")

daily_records = cursor.fetchall()
for record in daily_records:
    zodiac_id, date, overall, love_fortune, love_score, money_fortune, money_score, \
    work_fortune, work_score, health_fortune, health_score, \
    lucky_color, lucky_number, lucky_time, advice = record
    
    if date not in export_data["daily"]:
        export_data["daily"][date] = {}
    
    export_data["daily"][date][zodiac_id] = {
        "overall": overall,
        "fortunes": {
            "love": love_fortune,
            "money": money_fortune,
            "work": work_fortune,
            "health": health_fortune
        },
        "scores": {
            "love": love_score,
            "money": money_score,
            "work": work_score,
            "health": health_score
        },
        "lucky": {
            "color": lucky_color,
            "number": lucky_number,
            "time": lucky_time
        },
        "advice": advice
    }

print(f"Exported {len(export_data['daily'])} days of daily fortunes")

# 2. Export weekly fortunes
cursor.execute("""
    SELECT zodiac_id, week_number, week_start, week_end, theme, overall,
           love_fortune, money_fortune, work_fortune, health_fortune, key_days
    FROM weekly_fortunes_data
    WHERE year = 2025
    ORDER BY week_number, zodiac_id
""")

weekly_records = cursor.fetchall()
for record in weekly_records:
    zodiac_id, week_num, week_start, week_end, theme, overall, \
    love, money, work, health, key_days = record
    
    week_key = f"2025-W{week_num:02d}"
    if week_key not in export_data["weekly"]:
        export_data["weekly"][week_key] = {}
    
    export_data["weekly"][week_key][zodiac_id] = {
        "weekStart": week_start,
        "weekEnd": week_end,
        "theme": theme,
        "overall": overall,
        "fortunes": {
            "love": love,
            "money": money,
            "work": work,
            "health": health
        },
        "keyDays": key_days
    }

print(f"Exported {len(export_data['weekly'])} weeks of weekly fortunes")

# 3. Export monthly fortunes
cursor.execute("""
    SELECT zodiac_id, month, theme, overall,
           love_fortune, money_fortune, work_fortune, health_fortune, key_dates
    FROM monthly_fortunes_data
    WHERE year = 2025
    ORDER BY month, zodiac_id
""")

monthly_records = cursor.fetchall()
for record in monthly_records:
    zodiac_id, month, theme, overall, love, money, work, health, key_dates = record
    
    month_key = f"2025-{month:02d}"
    if month_key not in export_data["monthly"]:
        export_data["monthly"][month_key] = {}
    
    export_data["monthly"][month_key][zodiac_id] = {
        "theme": theme,
        "overall": overall,
        "fortunes": {
            "love": love,
            "money": money,
            "work": work,
            "health": health
        },
        "keyDates": key_dates
    }

print(f"Exported {len(export_data['monthly'])} months of monthly fortunes")

# 4. Export yearly fortunes
cursor.execute("""
    SELECT zodiac_id, year, theme, overall,
           love_fortune, money_fortune, work_fortune, health_fortune,
           best_months, challenging_months, key_advice
    FROM yearly_fortunes_data
    WHERE year = 2025
""")

yearly_records = cursor.fetchall()
for record in yearly_records:
    zodiac_id, year, theme, overall, love, money, work, health, \
    best_months, challenging_months, key_advice = record
    
    export_data["yearly"][zodiac_id] = {
        "year": year,
        "theme": theme,
        "overall": overall,
        "fortunes": {
            "love": love,
            "money": money,
            "work": work,
            "health": health
        },
        "bestMonths": best_months.split(", ") if best_months else [],
        "challengingMonths": challenging_months.split(", ") if challenging_months else [],
        "keyAdvice": key_advice
    }

print(f"Exported {len(export_data['yearly'])} yearly fortunes")

# 5. Export compatibility fortunes
cursor.execute("""
    SELECT zodiac1_id, zodiac2_id, overall_score, 
           love_score, friendship_score, work_score, advice
    FROM compatibility_fortunes_data
    ORDER BY zodiac1_id, zodiac2_id
""")

compat_records = cursor.fetchall()
for record in compat_records:
    z1, z2, overall, love, friend, work, advice = record
    
    compat_key = f"{z1}-{z2}"
    export_data["compatibility"][compat_key] = {
        "totalScore": overall,
        "scores": {
            "love": love,
            "friendship": friend,
            "work": work
        },
        "advice": advice
    }

print(f"Exported {len(export_data['compatibility'])} compatibility fortunes")

# Save to JSON file
with open('../api/fortune-data.json', 'w', encoding='utf-8') as f:
    json.dump(export_data, f, ensure_ascii=False, indent=2)

conn.close()

# Print summary
total_records = (
    len(export_data['daily']) * 12 +  # days × zodiac signs
    len(export_data['weekly']) * 12 +  # weeks × zodiac signs
    len(export_data['monthly']) * 12 +  # months × zodiac signs
    len(export_data['yearly']) +  # yearly fortunes
    len(export_data['compatibility'])  # compatibility pairs
)
print(f"\nExport complete! Total records: {total_records}")
print("Data saved to ../api/fortune-data.json")