
// 통합 (검색어 입력시 동물병원 리스트 + 지도)

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

