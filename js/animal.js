// const url = `https://openapi.gg.go.kr/Animalhosptl?Type=json&SIGUN_NM=${encodeURIComponent(query)}`;

//         fetch(url)
//             .then(result => result.json())   // json 파일을 객체로 변환
//             .then(json => {
//                 console.log(json);
//                 const data = json.Animalhosptl[1]; // 객체에서 실제 내용만 data로 저장   
//                 console.log(data.row[1].BIZPLC_NM);
//                 // console.log(data);
//             });

// function searchAnimalHospitals() {
//     const query = document.getElementById('input').value.trim();
//     if (!query) {
//         alert('검색어를 입력하세요.');
//         return;
//     }

//     const url = `https://openapi.gg.go.kr/Animalhosptl?Type=json&SIGUN_NM=${encodeURIComponent(query)}&pSize=100&KEY=0bf5088736ed466093558ec6ed402a33`;

//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('네트워크 상태가 좋지 않습니다.');
//             }
//             return response.json();
//         })
//         .then(json => {
//             console.log(json);
//             const hospitals = json.Animalhosptl[1].row;
//             if (hospitals) {
//                 const resultsDiv = document.getElementById('results');
//                 resultsDiv.innerHTML = '<h2>검색 결과</h2>';
                
//                 hospitals.forEach(hospital => {
//                     const hospitalName = hospital.BIZPLC_NM; // 동물병원 이름
//                     const hospitalAddress = hospital.REFINE_LOTNO_ADDR; // 동물병원 주소
                    
//                     resultsDiv.innerHTML += `<p><strong>병원명:</strong> ${hospitalName}</p>`;
//                     resultsDiv.innerHTML += `<p><strong>주소:</strong> ${hospitalAddress}</p>`;
//                     resultsDiv.innerHTML += '<hr>';
//                 });
//             } else {
//                 const resultsDiv = document.getElementById('results');
//                 resultsDiv.innerHTML = '해당 지역의 동물병원 정보가 없습니다.';
//             }
//         })
//         .catch(error => {
//             console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
//         });
// }

// // 지도에 표시하기

// // 학원을 기준으로 전국 동물병원 위치 클러스터러로 표시하기
// // 이지디자인컴퓨터학원 기준
// const 위도 = 36.634997,
//     경도 = 127.4577953;

// let 지도상자 = document.querySelector('#mapResults'), // 지도를 표시할 div 
//     지도옵션 = {
//         center: new kakao.maps.LatLng(위도, 경도), // 지도의 중심좌표
//         level: 12 // 지도의 확대 레벨
//     };

// const query = document.getElementById('input').value.trim();

// let url3 = `https://openapi.gg.go.kr/Animalhosptl?Type=json&SIGUN_NM=${encodeURIComponent(query)}&pSize=100&KEY=0bf5088736ed466093558ec6ed402a33`;

// fetch(url3)
//     .then(결과 => 결과.json())
//     .then(내용물 => {

//         let 동물병원들 = 내용물.Animalhosptl[1].row;
//         console.log(동물병원들);

//         // 지도 생성 new kakao.maps.Map(지도표시할곳, 지도옵션)
//         let 기준지도 = new kakao.maps.Map(지도상자, 지도옵션);
//         // 클러스터러 객체만들기 new kakao.maps.MarkerClusterer(옵션)
//         let 클러스터러옵션 = {
//             map: 기준지도, // 클러스터 표시할 지도
//             averageCenter: true, // 클러스터에 포함된 마커들의 평균 위도/경도 중심으로 클러스터의 중심위치설정
//             minLevel: 9 // 클러스터링 할 최소지도레벨
//         };
//         let 동물병원클러스터러 = new kakao.maps.MarkerClusterer(클러스터러옵션);

//         let 동물병원마커들 = []; // 빈배열 생성
//         for (const 동물병원 of 동물병원들) {
//             // 정보추출
//             let 이름 = 동물병원.BIZPLC_NM;
//             let 위도 = 동물병원.REFINE_WGS84_LAT;
//             let 경도 = 동물병원.REFINE_WGS84_LOGT;

//             // 마커생성
//             let 마커 = new kakao.maps.Marker({
//                 map: 기준지도,
//                 position: new kakao.maps.LatLng(위도, 경도)
//             });
//             // 정보창에 표시할 내용
//             let 정보창 = new kakao.maps.InfoWindow({
//                 content: `<div class="iw">동물병원명:${이름}</div>`
//             });
//             동물병원마커들.push(마커); // 동물병원정보를 이용해서 만든 마커를 마커들배열에 추가

//             // 마커에 이벤트를 등록합니다
//             // 마커에 마우스오버하면 makeOverListener() 실행
//             kakao.maps.event.addListener(마커, 'mouseover', 마우스오버시실행(기준지도, 마커, 정보창));
//             // 마커에서 마우스아웃하면 makeOutListener() 실행
//             kakao.maps.event.addListener(마커, 'mouseout', 마우스아웃시실행(정보창));
//         }
//         // 클로저: 함수의 리턴값이 익명함수인경우, 함수참조값을 익명함수가 땡겨쓰려할 때 사용한다.
//         // 이벤트 리스너로는 클로저를 만들어 등록합니다
//         // 이벤트 리스너로는 클로저를 만들어 등록, 클로저를 만들어 주지 않으면 마지막 마커에만 등록됨.
//         function 마우스오버시실행(기준지도, 마커, 정보창) {
//             return function () {
//                 정보창.open(기준지도, 마커);
//             };
//         }
//         // 정보창을 닫는 클로저를 만드는 함수입니다
//         function 마우스아웃시실행(정보창) {
//             return function () {
//                 정보창.close();
//             };
//         }

//         // 클러스터러 생성하기
//         동물병원클러스터러.addMarkers(동물병원마커들);
//     })
//     .catch(err => console.log(err))
//     .finally(
//     // () => { 지도상자.classList.add('on'); }
// );


// 통합

let currentPage = 1;
        const itemsPerPage = 10;
        let filteredHospitals = [];

        function searchAnimalHospitals() {
            const query = document.getElementById('input').value.trim();
            if (!query) {
                alert('검색어를 입력하세요.');
                return;
            }

            const url = `https://openapi.gg.go.kr/Animalhosptl?Type=json&SIGUN_NM=${encodeURIComponent(query)}&pSize=100&KEY=0bf5088736ed466093558ec6ed402a33`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('네트워크 상태가 좋지 않습니다.');
                    }
                    return response.json();
                })
                .then(json => {
                    const hospitals = json.Animalhosptl[1].row;
                    filteredHospitals = hospitals.filter(hospital => hospital.BSN_STATE_NM == "정상");
                    currentPage = 1;
                    displayResults();
                    displayPagination();
                })
                .catch(error => {
                    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
                });
        }

        function displayResults() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<h2>검색 결과</h2>';

            if (filteredHospitals.length === 0) {
                resultsDiv.innerHTML += '해당 지역의 운영 중인 동물병원 정보가 없습니다.';
                clearMap();
                return;
            }

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const hospitalsToShow = filteredHospitals.slice(startIndex, endIndex);

            hospitalsToShow.forEach(hospital => {
                const hospitalName = hospital.BIZPLC_NM; // 동물병원 이름
                const hospitalAddress = hospital.REFINE_LOTNO_ADDR; // 동물병원 주소

                resultsDiv.innerHTML += `<p><strong>병원명:</strong> ${hospitalName}</p>`;
                resultsDiv.innerHTML += `<p><strong>주소:</strong> ${hospitalAddress}</p>`;
                resultsDiv.innerHTML += '<hr>';
            });

            displayMap(hospitalsToShow);
        }

        function displayPagination() {
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);

            const prevButton = document.createElement('button');
            prevButton.innerText = '이전';
            prevButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayResults();
                    displayPagination();
                }
            };
            if (currentPage === 1) {
                prevButton.classList.add('disabled');
            }
            paginationDiv.appendChild(prevButton);

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.innerText = i;
                button.onclick = () => {
                    currentPage = i;
                    displayResults();
                    displayPagination();
                };
                if (i === currentPage) {
                    button.disabled = true;
                }
                paginationDiv.appendChild(button);
            }

            const nextButton = document.createElement('button');
            nextButton.innerText = '다음';
            nextButton.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayResults();
                    displayPagination();
                }
            };
            if (currentPage === totalPages) {
                nextButton.classList.add('disabled');
            }
            paginationDiv.appendChild(nextButton);
        }

        function displayMap(hospitals) {
            const 위도 = 37.2893525, 경도 = 127.0535312;
            let 지도상자 = document.querySelector('#mapResults');
            let 지도옵션 = {
                center: new kakao.maps.LatLng(위도, 경도),
                level: 10
            };
            let 기준지도 = new kakao.maps.Map(지도상자, 지도옵션);
            let 클러스터러옵션 = {
                map: 기준지도,
                averageCenter: true,
                minLevel: 5
            };
            let 동물병원클러스터러 = new kakao.maps.MarkerClusterer(클러스터러옵션);

            let 동물병원마커들 = [];
            for (const hospital of hospitals) {
                let 이름 = hospital.BIZPLC_NM;
                let 위도 = hospital.REFINE_WGS84_LAT;
                let 경도 = hospital.REFINE_WGS84_LOGT;

                let 마커 = new kakao.maps.Marker({
                    map: 기준지도,
                    position: new kakao.maps.LatLng(위도, 경도)
                });

                let 정보창 = new kakao.maps.InfoWindow({
                    content: `<div class="iw">${이름}</div>`
                });
                동물병원마커들.push(마커);

                kakao.maps.event.addListener(마커, 'mouseover', makeOverListener(기준지도, 마커, 정보창));
                kakao.maps.event.addListener(마커, 'mouseout', makeOutListener(정보창));
            }

            function makeOverListener(map, marker, infowindow) {
                return function () {
                    infowindow.open(map, marker);
                };
            }

            function makeOutListener(infowindow) {
                return function () {
                    infowindow.close();
                };
            }

            동물병원클러스터러.addMarkers(동물병원마커들);
        }

        function clearMap() {
            let mapDiv = document.getElementById('mapResults');
            mapDiv.innerHTML = ''; // 지도를 비우기
        }