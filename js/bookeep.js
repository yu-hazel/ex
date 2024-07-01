$(document).ready(function () {
    let books = [];

    // 페이지 로드 시 저장된 책 정보를 불러오기
    displaySavedBooks();

    $('#searchButton').click(function () {
        searchBooks();
    });

    $('#bookQuery').keyup(function (event) {
        if (event.key === "Enter") {
            searchBooks();
        }
    });

    function searchBooks() {
        let query = $('#bookQuery').val();

        $.ajax({
            method: "GET",
            url: "https://dapi.kakao.com/v3/search/book?target=title&size=50",
            data: { query: query },
            headers: { Authorization: "KakaoAK bb155ac85c80a7efdc2647ef682e4fb0" }
        })
        .done(function (msg) {
            $('#results').empty();
            books = msg.documents;
            console.log(books);

            if (books.length > 0) {
                books.forEach(function (book, index) {
                    let thumbnail = book.thumbnail === "" ? "<div class='placeholder'></div>" : `<img src='${book.thumbnail}' alt='${book.title}'/>`;
                    let bookHtml = `<div class='book' data-index='${index}'>
                                        <p class="bookTitle">${book.title}</p>
                                        ${thumbnail}
                                    </div>`;
                    $('#results').append(bookHtml);
                });

                // 책을 클릭했을 때 모달을 띄우는 이벤트 핸들러
                $('.book').click(function () {
                    let index = $(this).data('index');
                    let book = books[index];

                    $('#modalTitle').text(book.title);
                    $('#modalImage').attr('src', book.thumbnail);
                    $('#modalAuthor').text(`저자 : ${book.authors.join(", ")}`);
                    $('#modalIsbn').text(`ISBN : ${book.isbn}`);
                    $('#modalPrice').text(`가격 : ${book.price}`);
                    $('#modalPages').val("");
                    $('#modalComment').val("");
                    $('#modalCategory').val("wantToRead");

                    $('#bookModal').css('display', 'block');

                    $('#saveButton').off('click').on('click', function () {
                        saveBook(book);
                    });
                });
            } else {
                $('#results').append("<p>검색 결과가 없습니다.</p>");
            }
        })
        .fail(function () {
            $('#results').empty();
            $('#results').append("<p>API 호출에 실패했습니다.</p>");
        });
    }

    // 책 정보를 로컬 스토리지에 저장하는 함수
    function saveBook(book) {
        // 로컬 스토리지에서 savedBooks를 가져오고, 없는 경우 초기화
        let savedBooks = JSON.parse(localStorage.getItem('savedBooks'));
        
        // savedBooks가 없거나 구조가 잘못된 경우 초기화
        if (!savedBooks || typeof savedBooks !== 'object' || !savedBooks.wantToRead || !savedBooks.reading || !savedBooks.finished) {
            savedBooks = {
                wantToRead: [],
                reading: [],
                finished: []
            };
        }
    
        let pages = $('#modalPages').val();
        let comment = $('#modalComment').val();
        let category = $('#modalCategory').val();
    
        let bookData = {
            title: book.title,
            thumbnail: book.thumbnail,
            authors: book.authors,
            isbn: book.isbn,
            pages: pages,
            comment: comment
        };
    
        // 모든 카테고리에서 중복 검사
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

        $('#bookModal').css('display', 'none');
        displaySavedBooks();
    }

    // 모달 닫기
    $('.close').click(function () {
        $('#bookModal').css('display', 'none');
        $('#savedBookModal').css('display', 'none'); 
    });

    // 모달 밖을 클릭했을 때 닫기
    $(window).click(function (event) {
        if (event.target.id == 'bookModal') {
            $('#bookModal').css('display', 'none');
        }
        if (event.target.id == 'savedBookModal') {
            $('#savedBookModal').css('display', 'none');
        }
    });

    // 저장한 책 확인
    function displaySavedBooks() {
        // 로컬 스토리지에서 savedBooks를 가져오고, 없는 경우 초기화
        let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };
    
    // savedBooks가 없거나 구조가 잘못된 경우 초기화
    if (!savedBooks || typeof savedBooks !== 'object' || !savedBooks.wantToRead || !savedBooks.reading || !savedBooks.finished) {
        savedBooks = {
            wantToRead: [],
            reading: [],
            finished: []
        };
    }
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
    
        $('#wantToReadTab').html(wantToReadHtml);
        $('#readingTab').html(readingHtml);
        $('#finishedTab').html(finishedHtml);
    
        // 저장된 책 클릭 이벤트 핸들러
        $('.savedBook').click(function () {
            let index = $(this).data('index');
            let category = $(this).data('category');
            let book = savedBooks[category][index];
    
            $('#savedModalTitle').text(book.title);
            $('#savedModalImage').attr('src', book.thumbnail);
            $('#savedModalAuthor').text(`저자 : ${book.authors.join(", ")}`);
            $('#savedModalIsbn').text(`ISBN : ${book.isbn}`);
            $('#savedModalPages').text(book.pages);
            $('#savedModalComment').text(book.comment);
            $('#editModalCategory').val(category);
            $('#editModalPages').val(book.pages).hide();
            $('#editModalComment').val(book.comment).hide();
            $('#deleteButton').show();
            $('#editButton').show();
            $('#saveEditButton').hide();
    
            $('#savedBookModal').css('display', 'block');
    
            $('#deleteButton').off('click').on('click', function () {
                deleteBook(index, category);
            });
    
            $('#editButton').off('click').on('click', function () {
                $('#savedModalPages').hide();
                $('#savedModalComment').hide();
                $('#editModalPages').show();
                $('#editModalComment').show();
                $('#deleteButton').hide();
                $('#editButton').hide();
                $('#saveEditButton').show();
    
                $('#saveEditButton').off('click').on('click', function () {
                    let pages = $('#editModalPages').val();
                    let comment = $('#editModalComment').val();
                    let newCategory = $('#editModalCategory').val();
                    let book = savedBooks[category].splice(index, 1)[0]; // 기존 카테고리에서 책을 제거
                    book.pages = pages;
                    book.comment = comment;
                    savedBooks[newCategory].push(book); // 새로운 카테고리에 책을 추가
                    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
                    alert('책이 수정되었습니다.');
    
                    // 바로 반영하기 위해 데이터 업데이트
                    $('#savedModalPages').text(pages);
                    $('#savedModalComment').text(comment);
    
                    // 모달창을 닫지 않음으로써 수정된 내용을 즉시 확인할 수 있게 함
                    $('#editModalPages').hide();
                    $('#editModalComment').hide();
                    $('#savedModalPages').show();
                    $('#savedModalComment').show();
                    $('#deleteButton').show();
                    $('#editButton').show();
                    $('#saveEditButton').hide();
    
                    displaySavedBooks();
                });
            });
        });
    }

    // 책 삭제 함수
    function deleteBook(index, category) {
        let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };
        savedBooks[category].splice(index, 1);
        localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
        alert('책이 삭제되었습니다.');
        $('#savedBookModal').css('display', 'none');
        displaySavedBooks();
    }

    $('#viewSavedBooksButton').click(function () {
        displaySavedBooks();
    });
});
    // 초기 설정: 첫 번째 탭 열기
    document.getElementsByClassName("tablinks")[0].click();

    // 탭 열기
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