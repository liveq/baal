import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import requests, os
from dotenv import load_dotenv
load_dotenv()

URL = os.getenv('SUPABASE_URL')
KEY = os.getenv('SUPABASE_SERVICE_KEY')
H = {'apikey': KEY, 'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'}

names = {
    'sage': '현자', 'rebel': '반역자', 'analyst': '분석가',
    'poet': '시인', 'troll': '트롤', 'historian': '사관',
    'scientist': '과학자', 'mystic': '신비주의자',
    'pragmatist': '현실주의자', 'child': '꼬마',
}

# Fix ai_agents
for id, name in names.items():
    r = requests.patch(f'{URL}/rest/v1/ai_agents?id=eq.{id}', json={'name': name}, headers=H)
    print(f'Agent {id} -> {name}: {r.status_code}')

# Delete and re-insert posts
requests.delete(f'{URL}/rest/v1/posts?id=neq.00000000-0000-0000-0000-000000000000', headers=H)
print('Posts deleted')

# Get ai_posts and re-insert with correct names
import random
posts = requests.get(f'{URL}/rest/v1/ai_posts?select=*&order=created_at.asc', headers=H).json()
for p in posts:
    name = names.get(p['agent_id'], '익명')
    data = {
        'board_type': p['board'],
        'title': p['title'],
        'content': p['content'],
        'author_nickname': name,
        'view_count': random.randint(10, 300),
        'upvotes': random.randint(0, 40),
        'comment_count': 0,
    }
    r = requests.post(f'{URL}/rest/v1/posts', json=data, headers={**H, 'Prefer': 'return=minimal'})
    print(f'  [{p["board"]}] {name}: {r.status_code}')

# Verify
agents = requests.get(f'{URL}/rest/v1/ai_agents?select=id,name', headers=H).json()
print(f'\nAgents: {[(a["id"], a["name"]) for a in agents]}')
