document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById("recordModal");
    const btn = document.getElementById("newRecordBtn");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById("recordForm").onsubmit = function(event) {
        event.preventDefault();
        // Here you can handle form submission, e.g., save the data
        alert("기록이 저장되었습니다!");
        modal.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const newRecordBtn = document.getElementById('newRecordBtn');
    const recordModal = document.getElementById('recordModal');
    const closeBtn = document.querySelector('.close');
    const recordForm = document.getElementById('recordForm');
    const recordsUl = document.getElementById('recordsUl');
    const modalContent = document.querySelector('.modal-content');

    // Show modal
    newRecordBtn.addEventListener('click', function() {
        recordModal.style.display = 'block';
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        recordModal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == recordModal) {
            recordModal.style.display = 'none';
        }
    });

    // Handle form submit
    recordForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(recordForm);

        // Construct record object
        const record = {
            date: formData.get('date'),
            team1: formData.get('team1'),
            team1Lineup: {
                player1: formData.get('team1Player1'),
                player2: formData.get('team1Player2'),
                player3: formData.get('team1Player3'),
                player4: formData.get('team1Player4'),
                player5: formData.get('team1Player5'),
                player6: formData.get('team1Player6'),
                player7: formData.get('team1Player7'),
                player8: formData.get('team1Player8'),
                player9: formData.get('team1Player9'),
                pitcher: formData.get('team1Pitcher')
            },
            team2: formData.get('team2'),
            team2Lineup: {
                player1: formData.get('team2Player1'),
                player2: formData.get('team2Player2'),
                player3: formData.get('team2Player3'),
                player4: formData.get('team2Player4'),
                player5: formData.get('team2Player5'),
                player6: formData.get('team2Player6'),
                player7: formData.get('team2Player7'),
                player8: formData.get('team2Player8'),
                player9: formData.get('team2Player9'),
                pitcher: formData.get('team2Pitcher')
            },
            score: {
                team1: [
                    formData.get('team1Score1'),
                    formData.get('team1Score2'),
                    formData.get('team1Score3'),
                    formData.get('team1Score4'),
                    formData.get('team1Score5'),
                    formData.get('team1Score6'),
                    formData.get('team1Score7'),
                    formData.get('team1Score8'),
                    formData.get('team1Score9'),
                    formData.get('team1Score10'),
                    formData.get('team1Score11'),
                    formData.get('team1Score12')
                ],
                team2: [
                    formData.get('team2Score1'),
                    formData.get('team2Score2'),
                    formData.get('team2Score3'),
                    formData.get('team2Score4'),
                    formData.get('team2Score5'),
                    formData.get('team2Score6'),
                    formData.get('team2Score7'),
                    formData.get('team2Score8'),
                    formData.get('team2Score9'),
                    formData.get('team2Score10'),
                    formData.get('team2Score11'),
                    formData.get('team2Score12')
                ]
            },
            comments: formData.get('comments')
        };

        // Save record to local storage
        saveRecord(record);

        // Show notification
        alert('기록이 저장되었습니다.');

        // Clear form fields
        recordForm.reset();

        // Refresh records list
        displayRecords();
    });

    // Function to save record to local storage
    function saveRecord(record) {
        let records = JSON.parse(localStorage.getItem('baseballRecords')) || [];
        records.push(record);
        localStorage.setItem('baseballRecords', JSON.stringify(records));
    }

    // Function to display saved records
    function displayRecords() {
        recordsUl.innerHTML = '';
        let records = JSON.parse(localStorage.getItem('baseballRecords')) || [];
        records.forEach((record, index) => {
            const li = document.createElement('li');
            li.textContent = `${record.date}: ${record.team1} vs ${record.team2}`;
            li.dataset.index = index; // Store index in dataset for easy access later
            recordsUl.appendChild(li);

            // Add click event to show modal with details
            li.addEventListener('click', function() {
                populateModal(record);
                recordModal.style.display = 'block';
            });

            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent li click event from firing
                deleteRecord(index);
            });
            li.appendChild(deleteBtn);
        });
    }

    // Function to delete record from local storage
    function deleteRecord(index) {
        let records = JSON.parse(localStorage.getItem('baseballRecords')) || [];
        records.splice(index, 1); // Remove record at index
        localStorage.setItem('baseballRecords', JSON.stringify(records));
        displayRecords(); // Refresh records list
    }

    // Function to populate modal with record details
    function populateModal(record) {
        modalContent.innerHTML = `
            <h2>${record.date}: ${record.team1} vs ${record.team2}</h2>
            <h3>팀 1 라인업</h3>
            <ul>
                <li>선발 투수: ${record.team1Lineup.pitcher}</li>
                <li>타자들: ${record.team1Lineup.player1}, ${record.team1Lineup.player2}, ..., ${record.team1Lineup.player9}</li>
            </ul>
            <h3>팀 2 라인업</h3>
            <ul>
                <li>선발 투수: ${record.team2Lineup.pitcher}</li>
                <li>타자들: ${record.team2Lineup.player1}, ${record.team2Lineup.player2}, ..., ${record.team2Lineup.player9}</li>
            </ul>
            <h3>스코어</h3>
            <table>
                <tr>
                    <th>회차</th>
                    <th>팀 1</th>
                    <th>팀 2</th>
                </tr>
                ${record.score.team1.map((score, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${score}</td>
                        <td>${record.score.team2[idx]}</td>
                    </tr>
                `).join('')}
            </table>
            <h3>감상</h3>
            <p>${record.comments}</p>
        `;
    }

    // Display existing records on page load
    displayRecords();
});