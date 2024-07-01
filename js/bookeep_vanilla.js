document.addEventListener('DOMContentLoaded', function () {
    let books = [];

    // 페이지 로드 시 저장된 책 정보를 불러오기
    displaySavedBooks();

    // 초기 설정: '읽고 싶은 책' 탭 열기
    document.getElementById('wantToReadTab').style.display = 'flex';
    document.getElementById('readingTab').style.display = 'none';
    document.getElementById('finishedTab').style.display = 'none';
    let wantToReadTabLink = document.querySelector('.tablinks[data-tab="wantToReadTab"]');
    if (wantToReadTabLink) {
        wantToReadTabLink.classList.add('active');
    }

    document.getElementById('searchButton').addEventListener('click', function () {
        searchBooks();
    });

    document.getElementById('bookQuery').addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            searchBooks();
        }
    });

    function searchBooks() {
        let query = document.getElementById('bookQuery').value;

        fetch(`https://dapi.kakao.com/v3/search/book?target=title&size=50&query=${query}`, {
            method: "GET",
            headers: { Authorization: "KakaoAK bb155ac85c80a7efdc2647ef682e4fb0" }
        })
        .then(response => response.json())
        .then(data => {
            let results = document.getElementById('results');
            results.innerHTML = '';
            books = data.documents;
            console.log(books);

            if (books.length > 0) {
                books.forEach(function (book, index) {
                    let thumbnail = book.thumbnail === "" ? "<div class='placeholder'></div>" : `<img src='${book.thumbnail}' alt='${book.title}'/>`;
                    let bookHtml = `<div class='book' data-index='${index}'>
                                        <p class="bookTitle">${book.title}</p>
                                        ${thumbnail}
                                    </div>`;
                    results.insertAdjacentHTML('beforeend', bookHtml);
                });

                document.querySelectorAll('.book').forEach(function (bookElement) {
                    bookElement.addEventListener('click', function () {
                        let index = this.dataset.index;
                        let book = books[index];

                        document.getElementById('modalTitle').textContent = book.title;
                        document.getElementById('modalImage').setAttribute('src', book.thumbnail);
                        document.getElementById('modalAuthor').textContent = `저자 : ${book.authors.join(", ")}`;
                        document.getElementById('modalIsbn').textContent = `ISBN : ${book.isbn}`;
                        document.getElementById('modalPrice').textContent = `가격 : ${book.price}`;
                        document.getElementById('modalPages').value = "";
                        document.getElementById('modalComment').value = "";
                        document.getElementById('modalCategory').value = "wantToRead";

                        document.getElementById('bookModal').style.display = 'block';

                        document.getElementById('saveButton').onclick = function () {
                            saveBook(book);
                        };
                    });
                });
            } else {
                results.insertAdjacentHTML('beforeend', "<p>검색 결과가 없습니다.</p>");
            }
        })
        .catch(() => {
            let results = document.getElementById('results');
            results.innerHTML = '';
            results.insertAdjacentHTML('beforeend', "<p>API 호출에 실패했습니다.</p>");
        });
    }

    // 책 저장하기
    function saveBook(book) {
        let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };

        let pages = document.getElementById('modalPages').value;
        let comment = document.getElementById('modalComment').value;
        let category = document.getElementById('modalCategory').value;

        let bookData = {
            title: book.title,
            thumbnail: book.thumbnail,
            authors: book.authors,
            isbn: book.isbn,
            pages: pages,
            comment: comment
        };

        let bookExists = Object.keys(savedBooks).some(cat => {
            return savedBooks[cat].some(savedBook => savedBook.isbn === book.isbn);
        });

        if (!bookExists) {
            savedBooks[category].push(bookData);
            localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
            alert('책이 저장되었습니다.');
        } else {
            alert('이미 저장된 책입니다.');
        }

        document.getElementById('bookModal').style.display = 'none';
        displaySavedBooks();
    }

    document.querySelectorAll('.close').forEach(function (closeButton) {
        closeButton.addEventListener('click', function () {
            document.getElementById('bookModal').style.display = 'none';
            document.getElementById('savedBookModal').style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.id === 'bookModal') {
            document.getElementById('bookModal').style.display = 'none';
        }
        if (event.target.id === 'savedBookModal') {
            document.getElementById('savedBookModal').style.display = 'none';
        }
    });

    // 저장한 책 보여주기
    function displaySavedBooks() {
        let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };

        let wantToReadHtml = '';
        let readingHtml = '';
        let finishedHtml = '';

        if (savedBooks.wantToRead.length > 0 || savedBooks.reading.length > 0 || savedBooks.finished.length > 0) {
            savedBooks.wantToRead.forEach(function (book, index) {
                let bookHtml = `<div class='savedBook' data-index='${index}' data-category='wantToRead'>
                                    <p class="bookTitle">${book.title}</p>
                                    ${book.thumbnail ? `<img src='${book.thumbnail}' alt='${book.title}'/>` : "<div class='placeholder'></div>"}
                                </div>`;
                wantToReadHtml += bookHtml;
            });

            savedBooks.reading.forEach(function (book, index) {
                let bookHtml = `<div class='savedBook' data-index='${index}' data-category='reading'>
                                    <p class="bookTitle">${book.title}</p>
                                    ${book.thumbnail ? `<img src='${book.thumbnail}' alt='${book.title}'/>` : "<div class='placeholder'></div>"}
                                </div>`;
                readingHtml += bookHtml;
            });

            savedBooks.finished.forEach(function (book, index) {
                let bookHtml = `<div class='savedBook' data-index='${index}' data-category='finished'>
                                    <p class="bookTitle">${book.title}</p>
                                    ${book.thumbnail ? `<img src='${book.thumbnail}' alt='${book.title}'/>` : "<div class='placeholder'></div>"}
                                </div>`;
                finishedHtml += bookHtml;
            });
        } else {
            wantToReadHtml = "<p>저장된 책이 없습니다.</p>";
            readingHtml = "<p>저장된 책이 없습니다.</p>";
            finishedHtml = "<p>저장된 책이 없습니다.</p>";
        }

        document.getElementById('wantToReadTab').innerHTML = wantToReadHtml;
        document.getElementById('readingTab').innerHTML = readingHtml;
        document.getElementById('finishedTab').innerHTML = finishedHtml;

        document.querySelectorAll('.savedBook').forEach(function (savedBookElement) {
            savedBookElement.addEventListener('click', function () {
                let index = this.dataset.index;
                let category = this.dataset.category;
                let book = savedBooks[category][index];

                document.getElementById('savedModalTitle').textContent = book.title;
                document.getElementById('savedModalImage').setAttribute('src', book.thumbnail);
                document.getElementById('savedModalAuthor').textContent = `저자 : ${book.authors.join(", ")}`;
                document.getElementById('savedModalIsbn').textContent = `ISBN : ${book.isbn}`;

                // 현재 카테고리에 따라 저장 위치 한글로 보여주기
                document.getElementById('savedModalCategory').textContent = `현재 저장 위치 : ${getCategoryName(category)}`;

                document.getElementById('savedModalPages').textContent = `페이지 : ${book.pages}`;
                document.getElementById('savedModalComment').textContent = `나의 기록 : ${book.comment}`;
                document.getElementById('editModalCategory').style.display = 'none';
                document.getElementById('editModalPages').value = book.pages;
                document.getElementById('editModalComment').value = book.comment;
                document.getElementById('editModalPages').style.display = 'none';
                document.getElementById('editModalComment').style.display = 'none';
                document.getElementById('deleteButton').style.display = 'block';
                document.getElementById('editButton').style.display = 'block';
                document.getElementById('saveEditButton').style.display = 'none';

                document.getElementById('savedBookModal').style.display = 'block';

                // 삭제버튼 누르면 삭제됨
                document.getElementById('deleteButton').onclick = function () {
                    deleteBook(index, category);
                };

                // 수정버튼 클릭하면 수정
                document.getElementById('editButton').onclick = function () {
                    document.getElementById('savedModalPages').style.display = 'none';
                    document.getElementById('savedModalComment').style.display = 'none';
                    document.getElementById('editModalPages').style.display = 'block';
                    document.getElementById('editModalComment').style.display = 'block';
                    document.getElementById('editModalCategory').style.display = 'block';
                    document.getElementById('editModalCategory').value = category;
                    document.getElementById('deleteButton').style.display = 'none';
                    document.getElementById('editButton').style.display = 'none';
                    document.getElementById('saveEditButton').style.display = 'block';

                document.getElementById('saveEditButton').onclick = function () {
                    let pages = document.getElementById('editModalPages').value;
                    let comment = document.getElementById('editModalComment').value;
                    let newCategory = document.getElementById('editModalCategory').value;
                    let book = savedBooks[category].splice(index, 1)[0]; // 기존 카테고리에서 책을 제거
                    book.pages = pages;
                    book.comment = comment;
                    savedBooks[newCategory].push(book); // 새로운 카테고리에 책을 추가
                    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
                    alert('책이 수정되었습니다.');

                    // 바로 반영하기 위해 데이터 업데이트
                    document.getElementById('savedModalPages').textContent = pages;
                    document.getElementById('savedModalComment').textContent = comment;
                    document.getElementById('savedModalCategory').textContent = `현재 저장 위치 : ${getCategoryName(newCategory)}`;

                    // 모달창을 닫지 않음으로써 수정된 내용을 즉시 확인할 수 있게 함
                    document.getElementById('editModalPages').style.display = 'none';
                    document.getElementById('editModalComment').style.display = 'none';
                    document.getElementById('savedModalPages').style.display = 'block';
                    document.getElementById('savedModalComment').style.display = 'block';
                    document.getElementById('editModalCategory').style.display = 'none';
                    document.getElementById('deleteButton').style.display = 'block';
                    document.getElementById('editButton').style.display = 'block';
                    document.getElementById('saveEditButton').style.display = 'none';

                    displaySavedBooks();
                };
                };
            });
        });
    }

    function deleteBook(index, category) {
        let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };
        savedBooks[category].splice(index, 1);
        localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
        alert('책이 삭제되었습니다.');
        document.getElementById('savedBookModal').style.display = 'none';
        displaySavedBooks();
    }
});

// 카테고리에 따라 저장된 위치 보여주기
function getCategoryName(category){
    switch(category) {
        case 'wantToRead':
            return '읽고 싶은 책';
        case 'reading':
            return '읽는 중인 책';
        case 'finished':
            return '다 읽은 책';
        default:
            return '알 수 없음';
    }
}

// 탭 클릭 이벤트 설정
let tabLinks = document.querySelectorAll('.tablinks');
if (tabLinks.length > 0) {
    tabLinks.forEach(function(tabLink) {
        tabLink.addEventListener('click', function(evt) {
            openTab(evt, tabLink.getAttribute('data-tab'));
        });
    });
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}