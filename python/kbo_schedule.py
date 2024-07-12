import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# 크롬 드라이버 설정
options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# 크롤링할 URL 설정
url = "https://www.koreabaseball.com/Schedule/Schedule.aspx"
driver.get(url)

# 페이지 로드 후 HTML 가져오기
html_content = driver.page_source
driver.quit()

# BeautifulSoup 객체 생성
soup = BeautifulSoup(html_content, "html.parser")

# 경기 일정이 포함된 테이블 찾기
schedule_table = soup.find('table', {'id': 'tblScheduleList'})

# 데이터 저장을 위한 딕셔너리
schedule_data = {}

if schedule_table:
    tbody = schedule_table.find('tbody')
    if tbody:
        rows = tbody.find_all('tr')
        current_date = ""
        for row in rows:
            cells = row.find_all('td')
            if len(cells) > 0:
                if len(cells) == 9:
                    current_date = cells[0].get_text().strip()
                    time = cells[1].get_text().strip()
                    match_details = cells[2]
                    teams = match_details.find_all('span')
                    result_em = match_details.find('em')
                    if result_em:
                        spans = result_em.find_all('span')
                        away_score = spans[0].get_text().strip() if len(spans) > 0 else ""
                        home_score = spans[-1].get_text().strip() if len(spans) > 2 else ""
                        away_team = teams[0].get_text().strip()
                        home_team = teams[-1].get_text().strip()
                    else:
                        away_team = teams[0].get_text().strip()
                        home_team = teams[-1].get_text().strip()
                        away_score = ""
                        home_score = ""
                    preview = cells[3].get_text().strip()
                    tv_channel = cells[5].get_text().strip()
                    location = cells[7].get_text().strip()
                    result = cells[8].get_text().strip()
                else:
                    time = cells[0].get_text().strip()
                    match_details = cells[1]
                    teams = match_details.find_all('span')
                    result_em = match_details.find('em')
                    if result_em:
                        spans = result_em.find_all('span')
                        away_score = spans[0].get_text().strip() if len(spans) > 0 else ""
                        home_score = spans[-1].get_text().strip() if len(spans) > 2 else ""
                        away_team = teams[0].get_text().strip()
                        home_team = teams[-1].get_text().strip()
                    else:
                        away_team = teams[0].get_text().strip()
                        home_team = teams[-1].get_text().strip()
                        away_score = ""
                        home_score = ""
                    preview = cells[2].get_text().strip()
                    tv_channel = cells[4].get_text().strip()
                    location = cells[6].get_text().strip()
                    result = cells[7].get_text().strip()

                if current_date not in schedule_data:
                    schedule_data[current_date] = []

                schedule_data[current_date].append({
                    'time': time,
                    'home_team': home_team,
                    'away_team': away_team,
                    'home_score': home_score,
                    'away_score': away_score,
                    'preview': preview,
                    'tv_channel': tv_channel,
                    'location': location,
                    'result': result
                })

        # JSON 파일 생성
        with open('kbo_schedule.json', 'w', encoding='utf-8') as json_file:
            json.dump(schedule_data, json_file, ensure_ascii=False, indent=4)
else:
    print("Could not find the schedule table.")