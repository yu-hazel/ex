<script>
export default {
  name: "App",
  data() {
    return {
      isModalOpen: false,
      isViewModalOpen: false,
      isEditMode: false,
      editIndex: -1,
      records: JSON.parse(localStorage.getItem('records')) || [],
      record: {
        date: '',
        homeTeam: '',
        awayTeam: '',
        homeLineup: Array(10).fill(''),
        awayLineup: Array(10).fill(''),
        homeScores: Array(12).fill(0),
        awayScores: Array(12).fill(0),
        comments: ''
      },
      accordion: {
        home: false,
        away: false
      },
      viewedRecord: null
    };
  },
  computed: {
    finalScore() {
      if (this.viewedRecord) {
        const homeTotal = this.viewedRecord.homeScores.reduce((a, b) => a + b, 0);
        const awayTotal = this.viewedRecord.awayScores.reduce((a, b) => a + b, 0);
        return `${awayTotal}:${homeTotal}`;
      }
      return '';
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.resetRecord();
    },
    closeModal() {
      this.isModalOpen = false;
    },
    saveRecord() {
      if (this.isEditMode) {
        this.records[this.editIndex] = { ...this.record };
        this.isEditMode = false;
        this.editIndex = -1;
      } else {
        this.records.push({ ...this.record });
      }
      localStorage.setItem('records', JSON.stringify(this.records));
      this.closeModal();
    },
    openViewModal(index) {
      this.viewedRecord = this.records[index];
      this.isViewModalOpen = true;
    },
    closeViewModal() {
      this.isViewModalOpen = false;
    },
    editRecord(index) {
      this.record = { ...this.records[index] };
      this.editIndex = index;
      this.isEditMode = true;
      this.isModalOpen = true;
    },
    deleteRecord(index) {
      this.records.splice(index, 1);
      localStorage.setItem('records', JSON.stringify(this.records));
    },
    resetRecord() {
      this.record = {
        date: '',
        homeTeam: '',
        awayTeam: '',
        homeLineup: Array(10).fill(''),
        awayLineup: Array(10).fill(''),
        homeScores: Array(12).fill(0),
        awayScores: Array(12).fill(0),
        comments: ''
      };
    },
    toggleAccordion(section) {
      this.accordion[section] = !this.accordion[section];
    },
    recordTeamNameHome(e) {
      this.record.homeTeam = e.target.value;
    },
    recordTeamNameAway(e) {
      this.record.awayTeam = e.target.value;
    },
  },
}
</script>

<template>
  <div id="app">
    <button @click="openModal">경기 기록하기</button>
    <div v-if="isModalOpen" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <h2>경기 기록하기</h2>
        <form @submit.prevent="saveRecord">
          <label for="date">날짜:</label>
          <input type="date" v-model="record.date" required><br>
          <label for="homeTeam">홈 팀:</label>
          <input type="text" :value="record.homeTeam" @input="recordTeamNameHome" required><br>
          <label for="awayTeam">원정 팀:</label>
          <input type="text" :value="record.awayTeam" @input="recordTeamNameAway" required>

          <h3 @click="toggleAccordion('home')">홈 팀 라인업</h3>
          <div v-if="accordion.home">
            <div v-for="(player, index) in record.homeLineup" :key="index">
              <input type="text" v-model="record.homeLineup[index]" placeholder="선수 이름">
            </div>
          </div>

          <h3 @click="toggleAccordion('away')">원정 팀 라인업</h3>
          <div v-if="accordion.away">
            <div v-for="(player, index) in record.awayLineup" :key="index">
              <input type="text" v-model="record.awayLineup[index]" placeholder="선수 이름">
            </div>
          </div>

          <h3>스코어</h3>
          <div class="scoreboard">
            <div class="team-names">
              <span style="color: red;">{{ record.awayTeam }}</span>
              <span style="color: blue;">{{ record.homeTeam }}</span>
            </div>
            <div class="score-header">
              <div> </div>
              <div v-for="inning in 12" :key="inning">{{ inning }}</div>
            </div>
            <div class="score-row">
              <div style="color: red;">{{ record.awayTeam }}</div>
              <div v-for="inning in 12" :key="'away' + inning">
                <input type="number" v-model="record.awayScores[inning - 1]" min="0" required>
              </div>
            </div>
            <div class="score-row">
              <div style="color: blue;">{{ record.homeTeam }}</div>
              <div v-for="inning in 12" :key="'home' + inning">
                <input type="number" v-model="record.homeScores[inning - 1]" min="0" required>
              </div>
            </div>
          </div>
          <br>
          <label for="comments">경기 감상:</label>
          <textarea v-model="record.comments"></textarea><br>

          <button type="submit">저장</button>
        </form>
      </div>
    </div>

    <h2>경기 기록 목록</h2>
    <ul>
      <li v-for="(rec, index) in records" :key="index" class="record-item">
        <span @click="openViewModal(index)">{{ rec.date }}: {{ rec.homeTeam }} vs {{ rec.awayTeam }}</span>
        <button @click="editRecord(index)">수정</button>
        <button @click="deleteRecord(index)">삭제</button>
      </li>
    </ul>

    <div v-if="isViewModalOpen" class="modal" @click.self="closeViewModal">
      <div class="modal-content">
        <span @click="closeViewModal" class="close">&times;</span>
        <div v-if="viewedRecord">
          <h3>{{ viewedRecord.date }}: {{ viewedRecord.awayTeam }} vs {{ viewedRecord.homeTeam }}</h3>
          <p><strong>{{ viewedRecord.awayTeam }} 라인업:</strong> {{ viewedRecord.awayLineup.join(', ') }}</p>
          <p><strong>{{ viewedRecord.homeTeam }} 라인업:</strong> {{ viewedRecord.homeLineup.join(', ') }}</p>
          <!-- <p><strong>이닝별 점수</strong><br></p>
          <p>{{ viewedRecord.awayTeam }}: {{ viewedRecord.awayScores.join(' | ') }}</p>
          <p>{{ viewedRecord.homeTeam }}: {{ viewedRecord.homeScores.join(' | ') }}</p> -->
          <p><strong>최종 스코어</strong></p><br>
          <p>{{ finalScore }}</p>

          <p><strong>경기 감상:</strong> {{ viewedRecord.comments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

button {
  padding: 10px 20px;
  margin-bottom: 20px;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

div[v-for]>div {
  width: 45%;
}

div[v-for]>div label {
  display: block;
  margin-bottom: 5px;
}

div[v-for]>div input {
  width: 100%;
  box-sizing: border-box;
}

h2,
h3 {
  margin-top: 0;
}

.recordTeam {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  margin-bottom: 10px;
}

.recordInning {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-bottom: 10px;
}

.recordInning>div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 80px;
}

.recordInning input {
  width: 30px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-item button {
  margin-left: 10px;
}

.scoreboard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-names {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  display: none;
}

.score-header,
.score-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.score-header div,
.score-row div {
  flex: 1;
  text-align: center;
}

.score-header div {
  font-weight: bold;
}

.score-row div input {
  width: 30px;
  text-align: center;
}
</style>
