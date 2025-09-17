#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sqlite3

conn = sqlite3.connect('zodiac_fortunes.db')
cursor = conn.cursor()

# Check table structure
cursor.execute('PRAGMA table_info(compatibility_fortunes_data)')
cols = [col[1] for col in cursor.fetchall()]
print('Columns:', cols)

# Get sample data
cursor.execute('SELECT zodiac1_id, zodiac2_id, overall_score, description, advice FROM compatibility_fortunes_data LIMIT 5')
rows = cursor.fetchall()
print('\nSample compatibility data:')
for i, row in enumerate(rows, 1):
    print(f'{i}. Zodiac {row[0]}-{row[1]}: Score {row[2]}')
    print(f'   Description: {row[3] if row[3] else "NULL"}')
    print(f'   Advice: {row[4] if row[4] else "NULL"}')
    print()

# Count total records
cursor.execute('SELECT COUNT(*) FROM compatibility_fortunes_data')
count = cursor.fetchone()[0]
print(f'Total compatibility records: {count}')

# Count records with descriptions
cursor.execute('SELECT COUNT(*) FROM compatibility_fortunes_data WHERE description IS NOT NULL')
desc_count = cursor.fetchone()[0]
print(f'Records with descriptions: {desc_count}')

conn.close()