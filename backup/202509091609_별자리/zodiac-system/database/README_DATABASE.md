# Zodiac Fortune Database Schema

## Overview

This is a comprehensive SQLite database schema designed to store **5,226 fortune records** across multiple time periods and compatibility combinations for a zodiac fortune system.

## Database Structure

### Main Fortune Tables

| Table | Records | Description |
|-------|---------|-------------|
| `daily_fortunes_data` | 4,380 | Daily fortunes (12 zodiac × 365 days) |
| `weekly_fortunes_data` | 624 | Weekly fortunes (12 zodiac × 52 weeks) |
| `monthly_fortunes_data` | 144 | Monthly fortunes (12 zodiac × 12 months) |
| `yearly_fortunes_data` | 12 | Yearly fortunes (12 zodiac × 1 year) |
| `compatibility_fortunes_data` | 66 | Compatibility pairs (66 unique combinations) |

### Reference Tables

- **`zodiac_signs`** - Master table with 12 zodiac signs, elements, ruling planets
- **`special_dates`** - Holidays, seasons, and special occasions with fortune modifiers
- **`fortune_categories`** - Categories for organizing fortune types
- **`user_preferences`** - User customization and personalization settings
- **`data_generation_log`** - Audit trail for data operations

## Key Features

### Fortune Content Fields (per record)
- Overall, Love, Money, Work, Health fortunes with scores (1-100)
- Lucky items stored as JSON arrays (colors, numbers, times, items)
- Comprehensive advice and guidance text
- Metadata (timestamps, versions, data source)

### Special Date Support
- Automatic recognition of holidays, seasons, Mondays
- Fortune intensity modifiers for special occasions
- Cultural significance tracking

### Performance Optimizations
- **24+ indexes** for fast queries on dates, zodiacs, scores
- **7 views** for common query patterns:
  - `todays_fortunes` - Current day fortunes with zodiac info
  - `this_weeks_fortunes` - Current week overview
  - `this_months_fortunes` - Current month summary
  - `high_compatibility_pairs` - Best compatibility matches
  - `fortune_statistics` - Statistical analysis per zodiac
  - `weekly_performance_trends` - Trend analysis
  - `monthly_themes_analysis` - Monthly theme patterns

### Data Integrity
- **8 triggers** for automatic timestamp updates and versioning
- Foreign key constraints linking all fortune tables to zodiac_signs
- Check constraints ensuring scores are within 1-100 range
- Unique constraints preventing duplicate records
- Automatic logging of data generation activities

### Compatibility Analysis
Advanced relationship analysis including:
- Overall, love, friendship, work, communication compatibility scores
- Relationship dynamics and communication styles
- Element interactions and planetary influences
- Seasonal variations in compatibility
- Guidance for harmony and conflict resolution

## Usage Examples

### Query Today's Fortunes
```sql
SELECT * FROM todays_fortunes WHERE zodiac_name_en = 'Aries';
```

### Find High Compatibility Pairs
```sql
SELECT * FROM high_compatibility_pairs WHERE overall_compatibility > 85;
```

### Get Monthly Theme Analysis
```sql
SELECT * FROM monthly_themes_analysis WHERE month_name = 'January';
```

### Fortune Statistics by Zodiac
```sql
SELECT * FROM fortune_statistics ORDER BY avg_daily_score DESC;
```

## Schema Validation

Run the validation script to test the schema:

```bash
python validate_schema.py
```

The validation script creates a test database, verifies all tables/views/indexes are created correctly, tests sample data insertion, and confirms the schema is ready for production use.

## File Structure

- `schema.sql` - Complete database schema definition
- `validate_schema.py` - Schema validation and testing script
- `sample-data-generator.py` - Data generation utilities
- `zodiac.db` - Production database file

## Database Configuration

The schema includes optimized SQLite settings:
- **WAL mode** for better concurrency
- **Foreign keys enabled** for referential integrity
- **10,000 page cache** for improved performance
- **Memory temp storage** for faster operations

## Next Steps

1. Run `validate_schema.py` to confirm setup
2. Use `sample-data-generator.py` to populate with fortune data
3. Implement API endpoints to serve fortune data
4. Create data visualization and analytics features

---

**Total Capacity**: 5,226 fortune records across all time periods and compatibility combinations
**Database Type**: SQLite (local file-based)
**Schema Version**: 2024.001