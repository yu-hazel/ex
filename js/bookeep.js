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

                $('#bookModal').css('display', 'block');
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

$(document).ready(function () {
    let books = [];

    $('#searchButton').click(function () {
        searchBooks();
    });

    $('#bookQuery').keyup(function (event) {
        if (event.key === "Enter") {
            searchBooks();
        }
    });

    // 모달 닫기
    $('.close').click(function () {
        $('#bookModal').css('display', 'none');
    });

    // 모달 밖을 클릭했을 때 닫기
    $(window).click(function (event) {
        if (event.target.id == 'bookModal') {
            $('#bookModal').css('display', 'none');
        }
    });
});