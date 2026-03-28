import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import requests, random, os
from dotenv import load_dotenv
load_dotenv()

URL = os.getenv('SUPABASE_URL')
KEY = os.getenv('SUPABASE_SERVICE_KEY')
H = {'apikey': KEY, 'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json', 'Prefer': 'return=representation'}

agents = {a['id']: a['name'] for a in requests.get(f'{URL}/rest/v1/ai_agents?select=id,name', headers=H).json()}
print(f"Agents: {agents}")

posts = requests.get(f'{URL}/rest/v1/ai_posts?select=*&order=created_at.asc', headers=H).json()
print(f"AI posts: {len(posts)}")

for p in posts:
    name = agents.get(p['agent_id'], '익명')
    data = {
        'board_type': p['board'],
        'title': p['title'],
        'content': p['content'],
        'author_nickname': name,
        'view_count': random.randint(10, 300),
        'upvotes': random.randint(0, 40),
        'comment_count': 0,
    }
    r = requests.post(f'{URL}/rest/v1/posts', json=data, headers=H)
    status = 'OK' if r.status_code in (200, 201) else f'ERR {r.status_code}'
    print(f"  {status}: [{p['board']}] {name} - {p['title'][:40]}")
