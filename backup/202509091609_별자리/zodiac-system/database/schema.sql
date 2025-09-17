-- ===============================================================
-- COMPREHENSIVE ZODIAC FORTUNE DATABASE SCHEMA
-- SQLite Database for 5,226 Fortune Records
-- ===============================================================

-- ===============================================================
-- CORE REFERENCE TABLES
-- ===============================================================

-- Zodiac Signs Master Table
CREATE TABLE IF NOT EXISTS zodiac_signs (
    id INTEGER PRIMARY KEY,
    name_kr VARCHAR(20) NOT NULL,
    name_en VARCHAR(20) NOT NULL,
    symbol VARCHAR(10),
    date_start VARCHAR(5) NOT NULL,  -- MM-DD format
    date_end VARCHAR(5) NOT NULL,    -- MM-DD format
    element VARCHAR(10) NOT NULL,    -- Fire, Earth, Air, Water
    ruling_planet VARCHAR(20) NOT NULL,
    traits TEXT,
    strengths TEXT,
    weaknesses TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

-- Special Dates Configuration Table
CREATE TABLE IF NOT EXISTS special_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_value DATE NOT NULL UNIQUE,
    date_type VARCHAR(50) NOT NULL, -- 'holiday', 'season_start', 'moon_phase', 'monday', 'weekend'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cultural_significance TEXT,
    fortune_modifier REAL DEFAULT 1.0, -- Multiplier for fortune intensity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fortune Categories for better organization
CREATE TABLE IF NOT EXISTS fortune_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    weight REAL DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================================
-- MAIN FORTUNE DATA TABLES
-- ===============================================================

-- Daily Fortunes Table (4,380 records - 12 zodiac × 365 days)
CREATE TABLE IF NOT EXISTS daily_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    fortune_date DATE NOT NULL,
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    day_of_year INTEGER NOT NULL, -- 1-365/366
    is_special_date BOOLEAN DEFAULT FALSE,
    special_date_id INTEGER,
    
    -- Fortune Content Fields
    overall_fortune TEXT NOT NULL,
    overall_score INTEGER CHECK(overall_score >= 1 AND overall_score <= 100),
    love_fortune TEXT NOT NULL,
    love_score INTEGER CHECK(love_score >= 1 AND love_score <= 100),
    money_fortune TEXT NOT NULL,
    money_score INTEGER CHECK(money_score >= 1 AND money_score <= 100),
    work_fortune TEXT NOT NULL,
    work_score INTEGER CHECK(work_score >= 1 AND work_score <= 100),
    health_fortune TEXT NOT NULL,
    health_score INTEGER CHECK(health_score >= 1 AND health_score <= 100),
    
    -- Lucky Items
    lucky_colors JSON NOT NULL, -- Array of colors
    lucky_numbers JSON NOT NULL, -- Array of numbers
    lucky_times JSON NOT NULL, -- Array of time periods
    lucky_items JSON, -- Array of lucky items/objects
    
    -- Advice and Guidance
    general_advice TEXT NOT NULL,
    love_advice TEXT,
    work_advice TEXT,
    health_advice TEXT,
    financial_advice TEXT,
    caution_advice TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    data_source VARCHAR(100) DEFAULT 'system_generated',
    
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    FOREIGN KEY (special_date_id) REFERENCES special_dates(id),
    UNIQUE(zodiac_id, fortune_date)
);

-- Weekly Fortunes Table (624 records - 12 zodiac × 52 weeks)
CREATE TABLE IF NOT EXISTS weekly_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    week_number INTEGER NOT NULL CHECK(week_number >= 1 AND week_number <= 53),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    
    -- Fortune Content Fields
    overall_fortune TEXT NOT NULL,
    overall_score INTEGER CHECK(overall_score >= 1 AND overall_score <= 100),
    love_fortune TEXT NOT NULL,
    love_score INTEGER CHECK(love_score >= 1 AND love_score <= 100),
    money_fortune TEXT NOT NULL,
    money_score INTEGER CHECK(money_score >= 1 AND money_score <= 100),
    work_fortune TEXT NOT NULL,
    work_score INTEGER CHECK(work_score >= 1 AND work_score <= 100),
    health_fortune TEXT NOT NULL,
    health_score INTEGER CHECK(health_score >= 1 AND health_score <= 100),
    
    -- Weekly Specific Fields
    weekly_theme VARCHAR(200),
    key_days JSON, -- Days of the week that are especially important
    peak_energy_day INTEGER CHECK(peak_energy_day >= 1 AND peak_energy_day <= 7),
    
    -- Lucky Items
    lucky_colors JSON NOT NULL,
    lucky_numbers JSON NOT NULL,
    lucky_times JSON NOT NULL,
    lucky_activities JSON,
    
    -- Advice and Guidance
    weekly_focus TEXT NOT NULL,
    opportunities TEXT,
    challenges TEXT,
    relationship_advice TEXT,
    career_guidance TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    data_source VARCHAR(100) DEFAULT 'system_generated',
    
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, year, week_number)
);

-- Monthly Fortunes Table (144 records - 12 zodiac × 12 months)
CREATE TABLE IF NOT EXISTS monthly_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK(month >= 1 AND month <= 12),
    month_name VARCHAR(20) NOT NULL,
    
    -- Fortune Content Fields
    overall_fortune TEXT NOT NULL,
    overall_score INTEGER CHECK(overall_score >= 1 AND overall_score <= 100),
    love_fortune TEXT NOT NULL,
    love_score INTEGER CHECK(love_score >= 1 AND love_score <= 100),
    money_fortune TEXT NOT NULL,
    money_score INTEGER CHECK(money_score >= 1 AND money_score <= 100),
    work_fortune TEXT NOT NULL,
    work_score INTEGER CHECK(work_score >= 1 AND work_score <= 100),
    health_fortune TEXT NOT NULL,
    health_score INTEGER CHECK(health_score >= 1 AND health_score <= 100),
    
    -- Monthly Specific Fields
    monthly_theme VARCHAR(200) NOT NULL,
    moon_phases_impact TEXT,
    seasonal_influence TEXT,
    key_dates JSON, -- Important dates in the month
    best_weeks JSON, -- Week numbers that are most favorable
    challenging_periods JSON,
    
    -- Lucky Items
    lucky_colors JSON NOT NULL,
    lucky_numbers JSON NOT NULL,
    lucky_times JSON NOT NULL,
    lucky_stones JSON,
    lucky_directions JSON,
    
    -- Advice and Guidance
    monthly_mantra VARCHAR(500),
    personal_growth_focus TEXT,
    relationship_outlook TEXT,
    financial_forecast TEXT,
    health_recommendations TEXT,
    spiritual_guidance TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    data_source VARCHAR(100) DEFAULT 'system_generated',
    
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, year, month)
);

-- Yearly Fortunes Table (12 records - 12 zodiac × 1 year)
CREATE TABLE IF NOT EXISTS yearly_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    
    -- Fortune Content Fields
    overall_fortune TEXT NOT NULL,
    overall_score INTEGER CHECK(overall_score >= 1 AND overall_score <= 100),
    love_fortune TEXT NOT NULL,
    love_score INTEGER CHECK(love_score >= 1 AND love_score <= 100),
    money_fortune TEXT NOT NULL,
    money_score INTEGER CHECK(money_score >= 1 AND money_score <= 100),
    work_fortune TEXT NOT NULL,
    work_score INTEGER CHECK(work_score >= 1 AND work_score <= 100),
    health_fortune TEXT NOT NULL,
    health_score INTEGER CHECK(health_score >= 1 AND health_score <= 100),
    
    -- Yearly Specific Fields
    yearly_theme VARCHAR(300) NOT NULL,
    life_lesson TEXT NOT NULL,
    major_transits TEXT,
    eclipse_impacts TEXT,
    
    -- Temporal Analysis
    best_months JSON NOT NULL, -- Array of month numbers
    challenging_months JSON NOT NULL,
    transformation_periods JSON,
    peak_success_timeframe VARCHAR(100),
    
    -- Life Areas Focus
    primary_focus_area VARCHAR(100) NOT NULL,
    secondary_focus_area VARCHAR(100),
    areas_of_growth JSON,
    areas_needing_attention JSON,
    
    -- Lucky Items
    lucky_colors JSON NOT NULL,
    lucky_numbers JSON NOT NULL,
    power_colors JSON,
    sacred_symbols JSON,
    
    -- Comprehensive Guidance
    yearly_mantra VARCHAR(500) NOT NULL,
    life_philosophy_guidance TEXT,
    relationship_evolution TEXT,
    career_trajectory TEXT,
    wealth_building_advice TEXT,
    health_priorities TEXT,
    spiritual_development TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    data_source VARCHAR(100) DEFAULT 'system_generated',
    
    FOREIGN KEY (zodiac_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac_id, year)
);

-- Compatibility Fortunes Table (66 unique pairs - 12×11/2)
CREATE TABLE IF NOT EXISTS compatibility_fortunes_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zodiac1_id INTEGER NOT NULL,
    zodiac2_id INTEGER NOT NULL,
    
    -- Compatibility Scores
    overall_compatibility INTEGER CHECK(overall_compatibility >= 1 AND overall_compatibility <= 100),
    love_compatibility INTEGER CHECK(love_compatibility >= 1 AND love_compatibility <= 100),
    friendship_compatibility INTEGER CHECK(friendship_compatibility >= 1 AND friendship_compatibility <= 100),
    work_compatibility INTEGER CHECK(work_compatibility >= 1 AND work_compatibility <= 100),
    communication_compatibility INTEGER CHECK(communication_compatibility >= 1 AND communication_compatibility <= 100),
    
    -- Detailed Compatibility Analysis
    love_fortune TEXT NOT NULL,
    friendship_fortune TEXT NOT NULL,
    work_fortune TEXT NOT NULL,
    family_compatibility TEXT,
    
    -- Relationship Dynamics
    strengths_together JSON NOT NULL,
    potential_challenges JSON NOT NULL,
    communication_style TEXT,
    conflict_resolution_style TEXT,
    shared_interests JSON,
    complementary_traits JSON,
    
    -- Guidance and Advice
    relationship_advice TEXT NOT NULL,
    tips_for_harmony JSON,
    warning_signs JSON,
    growth_opportunities TEXT,
    
    -- Element Interaction
    element_harmony VARCHAR(100),
    planetary_influence TEXT,
    seasonal_variations TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    data_source VARCHAR(100) DEFAULT 'system_generated',
    
    FOREIGN KEY (zodiac1_id) REFERENCES zodiac_signs(id),
    FOREIGN KEY (zodiac2_id) REFERENCES zodiac_signs(id),
    UNIQUE(zodiac1_id, zodiac2_id),
    CHECK(zodiac1_id < zodiac2_id) -- Ensure unique pairs without duplication
);

-- ===============================================================
-- UTILITY AND LOGGING TABLES
-- ===============================================================

-- Data Generation and Update Log
CREATE TABLE IF NOT EXISTS data_generation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name VARCHAR(100) NOT NULL,
    operation_type VARCHAR(50) NOT NULL, -- 'insert', 'update', 'delete', 'bulk_generate'
    records_affected INTEGER DEFAULT 0,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds REAL,
    parameters JSON,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    error_message TEXT,
    created_by VARCHAR(100) DEFAULT 'system'
);

-- User Preferences for Personalized Fortunes
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    primary_zodiac_id INTEGER NOT NULL,
    birth_date DATE,
    birth_time TIME,
    birth_location VARCHAR(200),
    preferred_language VARCHAR(10) DEFAULT 'en',
    fortune_frequency VARCHAR(20) DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
    notification_settings JSON,
    lucky_preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (primary_zodiac_id) REFERENCES zodiac_signs(id)
);

-- ===============================================================
-- PERFORMANCE INDEXES
-- ===============================================================

-- Daily Fortunes Indexes
CREATE INDEX IF NOT EXISTS idx_daily_zodiac_date ON daily_fortunes_data(zodiac_id, fortune_date);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_fortunes_data(fortune_date);
CREATE INDEX IF NOT EXISTS idx_daily_zodiac ON daily_fortunes_data(zodiac_id);
CREATE INDEX IF NOT EXISTS idx_daily_day_week ON daily_fortunes_data(day_of_week);
CREATE INDEX IF NOT EXISTS idx_daily_special ON daily_fortunes_data(is_special_date);
CREATE INDEX IF NOT EXISTS idx_daily_scores ON daily_fortunes_data(overall_score, love_score, money_score);

-- Weekly Fortunes Indexes
CREATE INDEX IF NOT EXISTS idx_weekly_zodiac_year_week ON weekly_fortunes_data(zodiac_id, year, week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_dates ON weekly_fortunes_data(week_start_date, week_end_date);
CREATE INDEX IF NOT EXISTS idx_weekly_zodiac ON weekly_fortunes_data(zodiac_id);

-- Monthly Fortunes Indexes
CREATE INDEX IF NOT EXISTS idx_monthly_zodiac_year_month ON monthly_fortunes_data(zodiac_id, year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_zodiac ON monthly_fortunes_data(zodiac_id);
CREATE INDEX IF NOT EXISTS idx_monthly_year_month ON monthly_fortunes_data(year, month);

-- Yearly Fortunes Indexes
CREATE INDEX IF NOT EXISTS idx_yearly_zodiac_year ON yearly_fortunes_data(zodiac_id, year);
CREATE INDEX IF NOT EXISTS idx_yearly_zodiac ON yearly_fortunes_data(zodiac_id);
CREATE INDEX IF NOT EXISTS idx_yearly_year ON yearly_fortunes_data(year);

-- Compatibility Indexes
CREATE INDEX IF NOT EXISTS idx_compatibility_zodiacs ON compatibility_fortunes_data(zodiac1_id, zodiac2_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_scores ON compatibility_fortunes_data(overall_compatibility, love_compatibility);

-- Special Dates Indexes
CREATE INDEX IF NOT EXISTS idx_special_dates_date ON special_dates(date_value);
CREATE INDEX IF NOT EXISTS idx_special_dates_type ON special_dates(date_type);

-- ===============================================================
-- DATABASE VIEWS FOR COMMON QUERIES
-- ===============================================================

-- View for Today's Fortunes with Zodiac Info
CREATE VIEW IF NOT EXISTS todays_fortunes AS
SELECT 
    df.id,
    zs.name_kr as zodiac_name_kr,
    zs.name_en as zodiac_name_en,
    zs.symbol,
    df.fortune_date,
    df.overall_fortune,
    df.overall_score,
    df.love_fortune,
    df.love_score,
    df.money_fortune,
    df.money_score,
    df.work_fortune,
    df.work_score,
    df.health_fortune,
    df.health_score,
    df.lucky_colors,
    df.lucky_numbers,
    df.lucky_times,
    df.general_advice
FROM daily_fortunes_data df
JOIN zodiac_signs zs ON df.zodiac_id = zs.id
WHERE df.fortune_date = DATE('now');

-- View for This Week's Fortunes
CREATE VIEW IF NOT EXISTS this_weeks_fortunes AS
SELECT 
    wf.id,
    zs.name_kr as zodiac_name_kr,
    zs.name_en as zodiac_name_en,
    wf.week_start_date,
    wf.week_end_date,
    wf.overall_fortune,
    wf.weekly_theme,
    wf.weekly_focus,
    wf.lucky_colors,
    wf.lucky_numbers
FROM weekly_fortunes_data wf
JOIN zodiac_signs zs ON wf.zodiac_id = zs.id
WHERE DATE('now') BETWEEN wf.week_start_date AND wf.week_end_date;

-- View for Current Month's Fortunes
CREATE VIEW IF NOT EXISTS this_months_fortunes AS
SELECT 
    mf.id,
    zs.name_kr as zodiac_name_kr,
    zs.name_en as zodiac_name_en,
    mf.year,
    mf.month,
    mf.month_name,
    mf.overall_fortune,
    mf.monthly_theme,
    mf.monthly_mantra,
    mf.lucky_colors,
    mf.lucky_numbers
FROM monthly_fortunes_data mf
JOIN zodiac_signs zs ON mf.zodiac_id = zs.id
WHERE mf.year = CAST(strftime('%Y', 'now') AS INTEGER)
  AND mf.month = CAST(strftime('%m', 'now') AS INTEGER);

-- View for High Compatibility Pairs
CREATE VIEW IF NOT EXISTS high_compatibility_pairs AS
SELECT 
    z1.name_kr as zodiac1_name,
    z2.name_kr as zodiac2_name,
    cf.overall_compatibility,
    cf.love_compatibility,
    cf.friendship_compatibility,
    cf.work_compatibility,
    cf.relationship_advice
FROM compatibility_fortunes_data cf
JOIN zodiac_signs z1 ON cf.zodiac1_id = z1.id
JOIN zodiac_signs z2 ON cf.zodiac2_id = z2.id
WHERE cf.overall_compatibility >= 80
ORDER BY cf.overall_compatibility DESC;

-- View for Fortune Statistics
CREATE VIEW IF NOT EXISTS fortune_statistics AS
SELECT 
    zs.name_kr as zodiac_name,
    COUNT(df.id) as daily_records,
    AVG(df.overall_score) as avg_daily_score,
    AVG(df.love_score) as avg_love_score,
    AVG(df.money_score) as avg_money_score,
    AVG(df.work_score) as avg_work_score,
    AVG(df.health_score) as avg_health_score,
    MAX(df.overall_score) as best_day_score,
    MIN(df.overall_score) as lowest_day_score
FROM zodiac_signs zs
LEFT JOIN daily_fortunes_data df ON zs.id = df.zodiac_id
GROUP BY zs.id, zs.name_kr;

-- ===============================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ===============================================================

-- Trigger for daily_fortunes_data updates
CREATE TRIGGER IF NOT EXISTS update_daily_fortunes_timestamp 
    AFTER UPDATE ON daily_fortunes_data
    FOR EACH ROW
BEGIN
    UPDATE daily_fortunes_data 
    SET updated_at = CURRENT_TIMESTAMP,
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- Trigger for weekly_fortunes_data updates
CREATE TRIGGER IF NOT EXISTS update_weekly_fortunes_timestamp 
    AFTER UPDATE ON weekly_fortunes_data
    FOR EACH ROW
BEGIN
    UPDATE weekly_fortunes_data 
    SET updated_at = CURRENT_TIMESTAMP,
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- Trigger for monthly_fortunes_data updates
CREATE TRIGGER IF NOT EXISTS update_monthly_fortunes_timestamp 
    AFTER UPDATE ON monthly_fortunes_data
    FOR EACH ROW
BEGIN
    UPDATE monthly_fortunes_data 
    SET updated_at = CURRENT_TIMESTAMP,
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- Trigger for yearly_fortunes_data updates
CREATE TRIGGER IF NOT EXISTS update_yearly_fortunes_timestamp 
    AFTER UPDATE ON yearly_fortunes_data
    FOR EACH ROW
BEGIN
    UPDATE yearly_fortunes_data 
    SET updated_at = CURRENT_TIMESTAMP,
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- Trigger for compatibility_fortunes_data updates
CREATE TRIGGER IF NOT EXISTS update_compatibility_fortunes_timestamp 
    AFTER UPDATE ON compatibility_fortunes_data
    FOR EACH ROW
BEGIN
    UPDATE compatibility_fortunes_data 
    SET updated_at = CURRENT_TIMESTAMP,
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- Trigger for zodiac_signs updates
CREATE TRIGGER IF NOT EXISTS update_zodiac_signs_timestamp 
    AFTER UPDATE ON zodiac_signs
    FOR EACH ROW
BEGIN
    UPDATE zodiac_signs 
    SET updated_at = CURRENT_TIMESTAMP,
        version = OLD.version + 1
    WHERE id = NEW.id;
END;

-- Trigger for special_dates updates
CREATE TRIGGER IF NOT EXISTS update_special_dates_timestamp 
    AFTER UPDATE ON special_dates
    FOR EACH ROW
BEGIN
    UPDATE special_dates 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

-- Trigger for logging data generation activities
CREATE TRIGGER IF NOT EXISTS log_daily_fortune_insert 
    AFTER INSERT ON daily_fortunes_data
    FOR EACH ROW
BEGIN
    INSERT INTO data_generation_log (table_name, operation_type, records_affected, status)
    VALUES ('daily_fortunes_data', 'insert', 1, 'completed');
END;

-- ===============================================================
-- INITIAL DATA INSERTION
-- ===============================================================

-- Insert Zodiac Signs Master Data
INSERT OR REPLACE INTO zodiac_signs (id, name_kr, name_en, symbol, date_start, date_end, element, ruling_planet, strengths, weaknesses) VALUES
(1, '양자리', 'Aries', '♈', '03-21', '04-19', 'Fire', 'Mars', 'Courageous, determined, confident, enthusiastic', 'Impatient, moody, short-tempered, impulsive'),
(2, '황소자리', 'Taurus', '♉', '04-20', '05-20', 'Earth', 'Venus', 'Reliable, patient, practical, devoted', 'Stubborn, possessive, uncompromising'),
(3, '쌍둥이자리', 'Gemini', '♊', '05-21', '06-20', 'Air', 'Mercury', 'Gentle, affectionate, curious, adaptable', 'Nervous, inconsistent, indecisive'),
(4, '게자리', 'Cancer', '♋', '06-21', '07-22', 'Water', 'Moon', 'Tenacious, imaginative, loyal, sympathetic', 'Moody, pessimistic, suspicious, manipulative'),
(5, '사자자리', 'Leo', '♌', '07-23', '08-22', 'Fire', 'Sun', 'Creative, passionate, generous, warm-hearted', 'Arrogant, stubborn, self-centered, lazy'),
(6, '처녀자리', 'Virgo', '♍', '08-23', '09-22', 'Earth', 'Mercury', 'Loyal, analytical, kind, hardworking', 'Shyness, worry, overly critical, harsh'),
(7, '천칭자리', 'Libra', '♎', '09-23', '10-22', 'Air', 'Venus', 'Cooperative, diplomatic, gracious, fair-minded', 'Indecisive, avoids confrontations, self-pity'),
(8, '전갈자리', 'Scorpio', '♏', '10-23', '11-21', 'Water', 'Pluto', 'Resourceful, brave, passionate, stubborn', 'Distrusting, jealous, secretive, violent'),
(9, '사수자리', 'Sagittarius', '♐', '11-22', '12-21', 'Fire', 'Jupiter', 'Generous, idealistic, great sense of humor', 'Promises more than can deliver, impatient'),
(10, '염소자리', 'Capricorn', '♑', '12-22', '01-19', 'Earth', 'Saturn', 'Responsible, disciplined, self-control', 'Know-it-all, unforgiving, condescending'),
(11, '물병자리', 'Aquarius', '♒', '01-20', '02-18', 'Air', 'Uranus', 'Progressive, original, independent, humanitarian', 'Runs from emotional expression, uncompromising'),
(12, '물고기자리', 'Pisces', '♓', '02-19', '03-20', 'Water', 'Neptune', 'Compassionate, artistic, intuitive, gentle', 'Fearful, overly trusting, sad, victim mentality');

-- Insert Fortune Categories
INSERT OR REPLACE INTO fortune_categories (category_name, display_name, description, weight) VALUES
('overall', 'Overall Fortune', 'General life outlook and energy', 1.0),
('love', 'Love & Relationships', 'Romantic relationships and emotional connections', 0.9),
('money', 'Money & Finance', 'Financial opportunities and wealth management', 0.85),
('work', 'Work & Career', 'Professional growth and workplace dynamics', 0.8),
('health', 'Health & Wellness', 'Physical and mental well-being', 0.75);

-- Insert Common Special Dates (expandable)
INSERT OR REPLACE INTO special_dates (date_value, date_type, name, description, fortune_modifier) VALUES
('2024-01-01', 'holiday', 'New Year''s Day', 'Beginning of new cycle, fresh starts', 1.2),
('2024-02-14', 'holiday', 'Valentine''s Day', 'Day of love and romance', 1.3),
('2024-03-20', 'season_start', 'Spring Equinox', 'Balance of light and dark, renewal', 1.1),
('2024-06-21', 'season_start', 'Summer Solstice', 'Peak energy, longest day', 1.2),
('2024-09-23', 'season_start', 'Autumn Equinox', 'Harvest time, balance restoration', 1.1),
('2024-12-21', 'season_start', 'Winter Solstice', 'Introspection, shortest day', 0.9),
('2024-12-25', 'holiday', 'Christmas', 'Joy, giving, family connections', 1.2);

-- ===============================================================
-- ANALYTICS AND REPORTING FUNCTIONS
-- ===============================================================

-- View for Weekly Performance Trends
CREATE VIEW IF NOT EXISTS weekly_performance_trends AS
SELECT 
    zs.name_kr as zodiac_name,
    wf.year,
    wf.week_number,
    wf.overall_score,
    LAG(wf.overall_score, 1) OVER (PARTITION BY wf.zodiac_id ORDER BY wf.year, wf.week_number) as previous_week_score,
    wf.overall_score - LAG(wf.overall_score, 1) OVER (PARTITION BY wf.zodiac_id ORDER BY wf.year, wf.week_number) as score_change
FROM weekly_fortunes_data wf
JOIN zodiac_signs zs ON wf.zodiac_id = zs.id
ORDER BY zs.id, wf.year, wf.week_number;

-- View for Monthly Themes Analysis
CREATE VIEW IF NOT EXISTS monthly_themes_analysis AS
SELECT 
    month_name,
    COUNT(*) as theme_count,
    GROUP_CONCAT(DISTINCT monthly_theme) as common_themes
FROM monthly_fortunes_data
GROUP BY month
ORDER BY month;

-- ===============================================================
-- DATA VALIDATION CONSTRAINTS
-- ===============================================================

-- Ensure daily fortunes don't have duplicate date-zodiac combinations
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_unique_zodiac_date 
ON daily_fortunes_data(zodiac_id, fortune_date);

-- Ensure weekly fortunes don't overlap for the same zodiac
CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_unique_zodiac_period 
ON weekly_fortunes_data(zodiac_id, year, week_number);

-- Ensure monthly fortunes are unique per zodiac-month-year
CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_unique_zodiac_period 
ON monthly_fortunes_data(zodiac_id, year, month);

-- Ensure yearly fortunes are unique per zodiac-year
CREATE UNIQUE INDEX IF NOT EXISTS idx_yearly_unique_zodiac_year 
ON yearly_fortunes_data(zodiac_id, year);

-- Ensure compatibility pairs are unique and properly ordered
CREATE UNIQUE INDEX IF NOT EXISTS idx_compatibility_unique_pair 
ON compatibility_fortunes_data(zodiac1_id, zodiac2_id);

-- ===============================================================
-- SCHEMA COMPLETION CONFIRMATION
-- ===============================================================

INSERT INTO data_generation_log (table_name, operation_type, records_affected, status, parameters)
VALUES (
    'schema_initialization', 
    'create_complete_schema', 
    0, 
    'completed',
    '{"total_tables": 11, "total_indexes": 25, "total_views": 6, "total_triggers": 8, "target_records": 5226}'
);

-- Schema version and metadata
PRAGMA user_version = 2024001; -- Version 2024.001
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = MEMORY;

-- ===============================================================
-- END OF COMPREHENSIVE ZODIAC FORTUNE DATABASE SCHEMA
-- Total Expected Records: 5,226
-- - Daily: 4,380 (12 × 365)
-- - Weekly: 624 (12 × 52) 
-- - Monthly: 144 (12 × 12)
-- - Yearly: 12 (12 × 1)
-- - Compatibility: 66 (12 × 11 / 2)
-- ===============================================================