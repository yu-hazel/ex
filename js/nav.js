// nav04 js

// function toggleMenu() {
//     var menu = document.querySelector(".menu");
//     menu.classList.toggle("active");

//     var iconMenu = document.querySelector(".icoMenu");
//     var iconClose = document.querySelector(".icoClose");

//     // .icoMenu와 .icoClose 클래스를 각각 토글
//     if (iconMenu.classList.contains("hidden")) {
//         iconMenu.classList.remove("hidden");
//         iconClose.classList.add("hidden");
//     } else {
//         iconMenu.classList.add("hidden");
//         iconClose.classList.remove("hidden");
//     }
// }

function toggleMenu() {
    var menu = document.querySelector(".menu");
    menu.classList.toggle("active");

    var iconMenu = document.querySelector(".icoMenu");
    var iconClose = document.querySelector(".icoClose");

    // .icoMenu와 .icoClose 클래스를 번갈아가며 토글
    if (iconMenu.style.display === "none") {
        iconMenu.style.display = "flex";
        iconClose.style.display = "none";
    } else {
        iconMenu.style.display = "none";
        iconClose.style.display = "flex";
    }
}