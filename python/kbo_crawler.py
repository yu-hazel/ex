import requests
from bs4 import BeautifulSoup

# 크롤링할 URL 설정
url = "https://www.google.com/search?q=kbo&oq=kbo&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg7MgYIAhBFGDsyBggDEEUYOzIGCAQQRRg7MgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMTc1NWowajeoAgiwAgE&sourceid=chrome&ie=UTF-8#sie=lg;/g/11vj3x0pls;4;/m/0ch4_d4;mt;fp;1;;;"

# URL에 요청을 보내고 응답을 받기
response = requests.get(url)

# 응답에서 HTML 내용을 가져오기
html_content = response.text

# BeautifulSoup 객체 생성
soup = BeautifulSoup(html_content, "html.parser")

# 원하는 데이터를 추출하기 (예: 제목)
titles = soup.find_all('h3')

# HTML 파일 생성
with open('kbo_data.html', 'w', encoding='utf-8') as file:
    file.write('<html>\n<head>\n<title>KBO Data</title>\n</head>\n<body>\n')
    file.write('<h1>KBO Data</h1>\n')
    file.write('<ul>\n')
    for title in titles:
        file.write(f'<li>{title.get_text()}</li>\n')
    file.write('</ul>\n')
    file.write('</body>\n</html>')