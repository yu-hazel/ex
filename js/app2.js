// async function fetchBookData() {
//     const url = `https://openapi.naver.com/v1/search/book.json?query=자바스크립트&display=10`;
//     const options = {
//         method: "GET",
//         headers: {
//             "X-Naver-Client-Id": "LzQrQC8j5ue3yd04K9UB",
//             "X-Naver-Client-Secret": "9oJA3_nJSw"
//         }
//     };

//     try {
//         const response = await fetch(url, options);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log(data);
//         displayResults(data);
//     } catch (error) {
//         console.error('Fetch error:', error);
//     }
// }
// fetchBookData();