
// 입력받은 검색어로 자료 추출

async function fetchBookData(query) {
    const url = `https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=30`;
    const options = {
        method: "GET",
        headers: {
            // 'x-cors-api-key': 'temp_2f05150817e20d1175ae9fbe69a8f84c',
            "X-Naver-Client-Id": "LzQrQC8j5ue3yd04K9UB",
            "X-Naver-Client-Secret": "9oJA3_nJSw",
            "Origin": "http://127.0.0.1:5500"
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        displayResults(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.items.length > 0) {
        data.items.forEach(item => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';

            const bookImage = document.createElement('img');
            bookImage.src = item.image;
            bookImage.alt = item.title;

            const bookTitle = document.createElement('div');
            bookTitle.textContent = item.title;

            bookItem.appendChild(bookImage);
            bookItem.appendChild(bookTitle);
            resultsDiv.appendChild(bookItem);
        });
    } else {
        resultsDiv.textContent = '검색어에 해당하는 책이 없습니다.';
    }
}

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('input').value;
    console.log('Search query:', query);
    fetchBookData(query);
});

document.getElementById('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // 기본 폼 제출 막기
        const query = document.getElementById('input').value;
        console.log('Search query:', query);
        fetchBookData(query);
    }
});