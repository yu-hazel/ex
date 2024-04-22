// 네이버랩스 script
// DOMContentLoaded 이벤트를 이용하여 HTML 문서가 모두 로드된 후에 실행될 코드를 작성합니다.
document.addEventListener('DOMContentLoaded', function () {
    // Swiper 초기화 코드를 작성합니다.
    var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});