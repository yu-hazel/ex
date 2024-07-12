import json
import requests

# Supabase 설정
supabase_url = 'https://vovzpunshmcodmkletaw.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdnpwdW5zaG1jb2Rta2xldGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMDg5MzUsImV4cCI6MjAzMzY4NDkzNX0.aVXi_AbLx-AGNwWVa0MB-WiNrkht2Eq0ECnBwDds2Kc'
supabase_table = 'kbo'
headers = {
    'Content-Type': 'application/json',
    'apikey': supabase_key,
    'Authorization': f'Bearer {supabase_key}',
}

# JSON 파일 읽기
with open('kbo_schedule.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 데이터 삽입
for date, games in data.items():
    for game in games:
        game['date'] = date  # 날짜를 게임 데이터에 추가
        response = requests.post(f'{supabase_url}/rest/v1/{supabase_table}', headers=headers, json=game)
        if response.status_code == 201:
            print(f'Successfully inserted game data for {date}')
        else:
            print(f'Error inserting data: {response.json()}')

print('Data insertion complete.')