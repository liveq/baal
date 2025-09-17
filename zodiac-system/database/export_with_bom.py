import sqlite3
import json
import codecs

# Connect to database
conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Create export data structure
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
    
    export_data["daily"][date][str(zodiac_id)] = {
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
    SELECT zodiac_id, week_start, week_end, theme, overall,
           love_fortune, money_fortune, work_fortune, health_fortune,
           key_days
    FROM weekly_fortunes_data
    ORDER BY week_start, zodiac_id
""")

weekly_records = cursor.fetchall()
for record in weekly_records:
    zodiac_id, week_start, week_end, theme, overall, \
    love_fortune, money_fortune, work_fortune, health_fortune, key_days = record
    
    week_key = f"{week_start}_to_{week_end}"
    if week_key not in export_data["weekly"]:
        export_data["weekly"][week_key] = {}
    
    export_data["weekly"][week_key][str(zodiac_id)] = {
        "weekStart": week_start,
        "weekEnd": week_end,
        "theme": theme,
        "overall": overall,
        "fortunes": {
            "love": love_fortune,
            "money": money_fortune,
            "work": work_fortune,
            "health": health_fortune
        },
        "keyDays": key_days
    }

print(f"Exported {len(export_data['weekly'])} weeks of weekly fortunes")

# 3. Export monthly fortunes
cursor.execute("""
    SELECT zodiac_id, month, theme, overall,
           love_fortune, money_fortune, work_fortune, health_fortune,
           key_dates
    FROM monthly_fortunes_data
    ORDER BY month, zodiac_id
""")

monthly_records = cursor.fetchall()
for record in monthly_records:
    zodiac_id, month, theme, overall, \
    love_fortune, money_fortune, work_fortune, health_fortune, key_dates = record
    
    if month not in export_data["monthly"]:
        export_data["monthly"][month] = {}
    
    export_data["monthly"][month][str(zodiac_id)] = {
        "month": month,
        "theme": theme,
        "overall": overall,
        "fortunes": {
            "love": love_fortune,
            "money": money_fortune,
            "work": work_fortune,
            "health": health_fortune
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
    ORDER BY zodiac_id
""")

yearly_records = cursor.fetchall()
for record in yearly_records:
    zodiac_id, year, theme, overall, love, money, work, health, \
    best_months, challenging_months, key_advice = record
    
    export_data["yearly"][str(zodiac_id)] = {
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
    SELECT zodiac1_id, zodiac2_id, total_score,
           love_score, friendship_score, work_score, advice
    FROM compatibility_fortunes_data
    ORDER BY zodiac1_id, zodiac2_id
""")

compat_records = cursor.fetchall()
for record in compat_records:
    zodiac1_id, zodiac2_id, total_score, \
    love_score, friendship_score, work_score, advice = record
    
    compat_key = f"{zodiac1_id}_{zodiac2_id}"
    export_data["compatibility"][compat_key] = {
        "zodiac1": zodiac1_id,
        "zodiac2": zodiac2_id,
        "totalScore": total_score,
        "scores": {
            "love": love_score,
            "friendship": friendship_score,
            "work": work_score
        },
        "advice": advice
    }

print(f"Exported {len(export_data['compatibility'])} compatibility fortunes")

# Calculate total
total_records = (len(export_data['daily']) * 12 +  # 365 days * 12 zodiacs
                len(export_data['weekly']) * 12 +  # 52 weeks * 12 zodiacs
                len(export_data['monthly']) * 12 +  # 12 months * 12 zodiacs
                len(export_data['yearly']) +  # 12 zodiacs
                len(export_data['compatibility']))  # 78 combinations

print(f"\nExport complete! Total records: {total_records}")

# Save to JSON file with UTF-8 BOM
with codecs.open('../api/fortune-data.json', 'w', encoding='utf-8-sig') as f:
    json.dump(export_data, f, ensure_ascii=False, indent=2)

print("Data saved to ../api/fortune-data.json with UTF-8 BOM")

conn.close()