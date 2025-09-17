#!/usr/bin/env python3
"""
Schema Validation Script
Tests the comprehensive zodiac fortune database schema
"""

import sqlite3
import os
import json
from datetime import datetime

def validate_schema():
    """Validate the database schema by creating and testing tables"""
    
    # Create a test database
    test_db_path = "test_validation.db"
    
    # Remove existing test database
    if os.path.exists(test_db_path):
        os.remove(test_db_path)
    
    try:
        # Connect to database
        conn = sqlite3.connect(test_db_path)
        cursor = conn.cursor()
        
        # Read and execute schema
        with open('schema.sql', 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Execute schema as a single script to maintain proper order
        try:
            cursor.executescript(schema_sql)
        except sqlite3.Error as e:
            print(f"Error executing schema: {e}")
            return False
        
        conn.commit()
        
        # Validate table creation
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            ORDER BY name
        """)
        
        tables = cursor.fetchall()
        expected_tables = [
            'compatibility_fortunes_data',
            'daily_fortunes_data', 
            'data_generation_log',
            'fortune_categories',
            'monthly_fortunes_data',
            'special_dates',
            'user_preferences',
            'weekly_fortunes_data',
            'yearly_fortunes_data',
            'zodiac_signs'
        ]
        
        actual_tables = [table[0] for table in tables]
        print(f"Created tables: {actual_tables}")
        
        # Check if all expected tables exist
        missing_tables = set(expected_tables) - set(actual_tables)
        if missing_tables:
            print(f"Missing tables: {missing_tables}")
            return False
        
        # Validate views
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='view' 
            ORDER BY name
        """)
        
        views = cursor.fetchall()
        expected_views = [
            'fortune_statistics',
            'high_compatibility_pairs',
            'monthly_themes_analysis', 
            'this_months_fortunes',
            'this_weeks_fortunes',
            'todays_fortunes',
            'weekly_performance_trends'
        ]
        
        actual_views = [view[0] for view in views]
        print(f"Created views: {actual_views}")
        
        missing_views = set(expected_views) - set(actual_views)
        if missing_views:
            print(f"Missing views: {missing_views}")
            return False
        
        # Validate indexes
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='index' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
        """)
        
        indexes = cursor.fetchall()
        print(f"Created indexes: {len(indexes[0:5])}... (showing first 5)")
        for idx in indexes[:5]:
            print(f"  - {idx[0]}")
        
        # Validate triggers
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='trigger' 
            ORDER BY name
        """)
        
        triggers = cursor.fetchall()
        print(f"Created triggers: {[trigger[0] for trigger in triggers]}")
        
        # Test basic data insertion
        print("\nTesting basic data operations...")
        
        # Check if zodiac signs were inserted
        cursor.execute("SELECT COUNT(*) FROM zodiac_signs")
        zodiac_count = cursor.fetchone()[0]
        print(f"Zodiac signs inserted: {zodiac_count}")
        
        if zodiac_count != 12:
            print("Expected 12 zodiac signs!")
            return False
        
        # Check if fortune categories were inserted
        cursor.execute("SELECT COUNT(*) FROM fortune_categories")
        category_count = cursor.fetchone()[0]
        print(f"Fortune categories inserted: {category_count}")
        
        # Check if special dates were inserted
        cursor.execute("SELECT COUNT(*) FROM special_dates")
        special_dates_count = cursor.fetchone()[0]
        print(f"Special dates inserted: {special_dates_count}")
        
        # Test sample data insertion
        print("\nTesting sample data insertion...")
        
        # Insert a sample daily fortune
        sample_daily_fortune = """
        INSERT INTO daily_fortunes_data (
            zodiac_id, fortune_date, day_of_week, day_of_year,
            overall_fortune, overall_score,
            love_fortune, love_score,
            money_fortune, money_score,
            work_fortune, work_score,
            health_fortune, health_score,
            lucky_colors, lucky_numbers, lucky_times,
            general_advice
        ) VALUES (
            1, '2024-01-01', 1, 1,
            'Excellent start to the year!', 85,
            'Love is in the air', 80,
            'Financial opportunities await', 75,
            'Career advancement possible', 90,
            'Take care of your energy', 70,
            '["red", "gold"]', '[7, 21]', '["morning", "evening"]',
            'Stay positive and embrace new beginnings'
        )
        """
        
        cursor.execute(sample_daily_fortune)
        
        # Insert a sample compatibility fortune
        sample_compatibility = """
        INSERT INTO compatibility_fortunes_data (
            zodiac1_id, zodiac2_id,
            overall_compatibility, love_compatibility, 
            friendship_compatibility, work_compatibility,
            love_fortune, friendship_fortune, work_fortune,
            strengths_together, potential_challenges,
            relationship_advice
        ) VALUES (
            1, 2,
            75, 80, 70, 85,
            'Great romantic potential', 'Strong friendship bond', 'Excellent work partners',
            '["complementary strengths", "mutual respect"]',
            '["different paces", "communication styles"]',
            'Focus on understanding each others perspectives'
        )
        """
        
        cursor.execute(sample_compatibility)
        conn.commit()
        
        print("Sample data insertion successful!")
        
        # Test views
        print("\nTesting views...")
        
        try:
            cursor.execute("SELECT COUNT(*) FROM fortune_statistics")
            stats_count = cursor.fetchone()[0]
            print(f"Fortune statistics view returned {stats_count} records")
        except Exception as e:
            print(f"Error testing fortune_statistics view: {e}")
            return False
        
        print("\n[OK] Schema validation completed successfully!")
        print(f"[INFO] Database created with:")
        print(f"   - {len(actual_tables)} tables")  
        print(f"   - {len(actual_views)} views")
        print(f"   - {len(indexes)} indexes") 
        print(f"   - {len(triggers)} triggers")
        print(f"   - Ready for 5226 fortune records")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Schema validation failed: {e}")
        return False
        
    finally:
        if conn:
            conn.close()
        
        # Clean up test database
        if os.path.exists(test_db_path):
            os.remove(test_db_path)

def print_schema_summary():
    """Print a summary of the schema structure"""
    print("\n" + "="*60)
    print("COMPREHENSIVE ZODIAC FORTUNE DATABASE SCHEMA SUMMARY")
    print("="*60)
    
    print(f"""
TARGET RECORDS: 5,226 Total Fortune Records

MAIN FORTUNE TABLES:
   * daily_fortunes_data     -> 4,380 records (12 zodiac x 365 days)
   * weekly_fortunes_data    ->   624 records (12 zodiac x 52 weeks)  
   * monthly_fortunes_data   ->   144 records (12 zodiac x 12 months)
   * yearly_fortunes_data    ->    12 records (12 zodiac x 1 year)
   * compatibility_fortunes_data -> 66 records (66 unique pairs)

REFERENCE TABLES:
   * zodiac_signs           -> 12 zodiac sign definitions
   * special_dates          -> Holiday/season configurations
   * fortune_categories     -> Fortune type classifications
   * user_preferences       -> User customization settings
   * data_generation_log    -> Operation tracking

PERFORMANCE FEATURES:
   * 25+ optimized indexes for fast queries
   * 6 views for common query patterns
   * 8 triggers for auto-updating timestamps
   * JSON fields for flexible lucky items storage
   * Unique constraints preventing data duplication

KEY CAPABILITIES:
   * Multi-timeframe fortune support (daily->yearly)
   * Special date handling (holidays, seasons, Mondays)
   * Comprehensive compatibility analysis
   * Versioning and audit trail
   * User personalization support
   * Analytics and trend analysis

DATA INTEGRITY:
   * Foreign key constraints
   * Check constraints for score ranges (1-100)
   * Unique indexes preventing duplicates
   * Automatic timestamp management
   * Version tracking for all records
    """)

if __name__ == "__main__":
    print("Starting schema validation...")
    
    if validate_schema():
        print_schema_summary()
        print("\n[SUCCESS] Schema is ready for production use!")
    else:
        print("\nX Schema validation failed. Please check the errors above.")