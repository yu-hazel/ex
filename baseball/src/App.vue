<script>
import hanwhaLogo from '@/assets/hanwha.png';
import DoosanLogo from '@/assets/doosan.png';
import kiaLogo from '@/assets/kia.png';
import kiwoomLogo from '@/assets/kiwoom.png';
import ktLogo from '@/assets/kt.png';
import lgLogo from '@/assets/lg.png';
import lotteLogo from '@/assets/lotte.png';
import ncLogo from '@/assets/nc.png';
import samsungLogo from '@/assets/samsung.png';
import ssgLogo from '@/assets/ssg.png';
import bg1 from '@/assets/IMG_5412.JPG';
import bg2 from '@/assets/IMG_5413.JPG';
import bg3 from '@/assets/IMG_5414.JPG';
import bg4 from '@/assets/IMG_5415.JPG';
import bg5 from '@/assets/IMG_5416.JPG';
import bg6 from '@/assets/IMG_5417.JPG';
import bg7 from '@/assets/IMG_5418.JPG';

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
        field: '',
        homeLineup: Array(10).fill(''),
        awayLineup: Array(10).fill(''),
        homeScores: Array(12).fill(0),
        awayScores: Array(12).fill(0),
        comments: '',
        backgroundImage: '',
      },
      selectedTeams: [],
      teams: [
        { name: '한화', logo: hanwhaLogo, field: '대전 한화생명 이글스파크' },
        { name: '두산', logo: DoosanLogo, field: '서울종합운동장 야구장' },
        { name: 'KIA', logo: kiaLogo, field: '광주 기아 챔피언스필드' },
        { name: '키움', logo: kiwoomLogo, field: '고척 스카이돔' },
        { name: 'kt', logo: ktLogo, field: '수원 케이티 위즈 파크' },
        { name: 'LG', logo: lgLogo, field: '서울종합운동장 야구장' },
        { name: '롯데', logo: lotteLogo, field: '사직 야구장' },
        { name: 'NC', logo: ncLogo, field: '창원 NC 파크' },
        { name: '삼성', logo: samsungLogo, field: '대구 삼성 라이온즈 파크' },
        { name: 'SSG', logo: ssgLogo, field: '인천 SSG 랜더스필드' },
      ],
      accordion: {
        home: false,
        away: false
      },
      viewedRecord: null,
      backgroundImages: [bg1, bg2, bg3, bg4, bg5, bg6, bg7]
    };
  },
  created() {  // created 훅 위치
    this.setBackgroundImage();
  },
  computed: {
    finalScore() {
      if (this.viewedRecord) {
        const homeTotal = this.viewedRecord.homeScores.reduce((a, b) => a + b, 0);
        const awayTotal = this.viewedRecord.awayScores.reduce((a, b) => a + b, 0);
        return `${awayTotal}:${homeTotal}`;
      }
      return '';
    },
    backgroundStyle() {
      return {
        backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5)), url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '80vw'
      };
    },
    homePitcher() {
      if (this.viewedRecord) {
        return this.viewedRecord.homeLineup[this.viewedRecord.homeLineup.length - 1] || '';
      }
      return '';
    },
    awayPitcher() {
      if (this.viewedRecord) {
        return this.viewedRecord.awayLineup[this.viewedRecord.awayLineup.length - 1] || '';
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
      this.selectedTeams = [];
      this.showWarning = false;
    },
    toggleAccordion(section) {
      this.accordion[section] = !this.accordion[section];
    },
    setTeams() {
      if (this.selectedTeams.length > 2) {
        this.showWarning = true;
        this.selectedTeams.pop(); // 팀 2개 이상 선택하면 마지막 선택을 취소
      } else {
        this.showWarning = false;
        if (this.selectedTeams.length === 2) {
          this.record.awayTeam = this.selectedTeams[0];
          this.record.homeTeam = this.selectedTeams[1];

          // 팀 선택시 두번째 팀(홈팀)의 field값을 홈구장으로 설정
          const homeTeam = this.teams.find(team => team.name === this.record.homeTeam);
          if (homeTeam) {
            this.record.field = homeTeam.field;
          }
        } else {
          this.record.awayTeam = '';
          this.record.homeTeam = '';
        }
      }
    },
    getLabel(index) {
      return index === this.record.homeLineup.length - 1 ? '선발 투수' : `${index + 1}번 타자`;
    },
    getPlaceholder(index) {
      if (index === this.record.homeLineup.length - 1) {
        return '선발 투수';
      }
      return `${index + 1}번 타자`;
    },
    setBackgroundImage() {
      const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
      this.backgroundImage = this.backgroundImages[randomIndex];
    },
  },
}
</script>

<template>
  <v-app :style="backgroundStyle">
    <v-main>
      <div class="contentContainer">
        <v-container>
          <h2>내 꿈은 승리요정⚾️</h2>
          <!-- Vuetify 버튼 -->
          <v-btn prepend-icon="mdi-plus" @click="openModal" class="recordBt">기록 추가하기</v-btn>

          <!-- 모달 -->
          <v-dialog v-model="isModalOpen" max-width="600px">
            <v-card>
              <v-card-title>
                <span>경기 기록하기</span>
                <v-btn density="compact" icon="mdi-close" @click="closeModal">
                  <v-icon size="x-small">mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <form @submit.prevent="saveRecord">
                  <v-text-field v-model="record.date" label="날짜" type="date" required></v-text-field>
                  <v-text-field v-model="record.field" label="홈 구장"></v-text-field>
                  <h3>팀 선택</h3>
                  <p>원정팀, 홈팀 순서로 선택해 주세요.</p>
                  <v-row>
                    <v-col v-for="(team, index) in teams" :key="index" cols="12" sm="6" md="4">
                      <v-checkbox :id="'team' + index" :value="team.name" v-model="selectedTeams" @change="setTeams">
                        <template v-slot:label>
                          <img :src="team.logo" :alt="team.name" class="team-logo" />
                          {{ team.name }}
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>

                  <v-expand-transition>
                    <div>
                      <div class="lineupTitle">
                        <h3 @click="toggleAccordion('away')">원정 팀 라인업</h3>
                        <v-btn size="x-small" icon @click="toggleAccordion('away')">
                          <v-icon x-small>{{ accordion.away ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-btn>
                      </div>
                      <v-card-text v-if="accordion.away">
                        <v-row>
                          <v-col v-for="(player, index) in record.awayLineup" :key="index" cols="12">
                            <v-text-field variant="underlined" v-model="record.awayLineup[index]"
                              :label="getLabel(index)" :placeholder="getPlaceholder(index)"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </div>
                  </v-expand-transition>

                  <v-expand-transition>
                    <div>
                      <div class="lineupTitle">
                        <h3 @click="toggleAccordion('home')">홈 팀 라인업</h3>
                        <v-btn size="x-small" icon @click="toggleAccordion('home')">
                          <v-icon x-small>{{ accordion.home ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                        </v-btn>
                      </div>
                      <v-card-text v-if="accordion.home">
                        <v-row>
                          <v-col v-for="(player, index) in record.homeLineup" :key="index" cols="12">
                            <v-text-field variant="underlined" v-model="record.homeLineup[index]"
                              :label="getLabel(index)" :placeholder="getPlaceholder(index)"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </div>
                  </v-expand-transition>

                  <h3>스코어</h3>
                  <div class="scoreboard">
                    <div class="teamNames">
                      <span>{{ record.awayTeam }}</span>
                      <span>{{ record.homeTeam }}</span>
                    </div>
                    <div class="scoreHeader">
                      <div>팀</div>
                      <div v-for="inning in 12" :key="inning">{{ inning }}</div>
                    </div>
                    <div class="scoreRow">
                      <div>{{ record.awayTeam }}</div>
                      <div v-for="inning in 12" :key="'away' + inning">
                        <input v-model="record.awayScores[inning - 1]" type="number" class="score-input" />
                      </div>
                    </div>
                    <div class="scoreRow">
                      <div>{{ record.homeTeam }}</div>
                      <div v-for="inning in 12" :key="'home' + inning">
                        <input v-model="record.homeScores[inning - 1]" type="number" class="score-input" />
                      </div>
                    </div>
                  </div>
                  <br>
                  <v-textarea v-model="record.comments" label="경기 감상" rows="3"></v-textarea>
                  <v-btn type="submit" color="primary">저장</v-btn>
                </form>
              </v-card-text>
            </v-card>
          </v-dialog>

          <h3>경기 기록 목록</h3>
          <v-list class="recordList">
            <v-list-item v-for="(rec, index) in records" :key="index" class="recordItem">
              <v-list-item-content @click="openViewModal(index)">
                <v-list-item-title>{{ rec.date }}: {{ rec.homeTeam }} vs {{ rec.awayTeam }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn size="small" icon @click="editRecord(index)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn size="small" icon @click="deleteRecord(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-dialog v-model="isViewModalOpen" max-width="600px">
            <v-card>
              <v-card-title>
                <span>{{ viewedRecord.date }}: {{ viewedRecord.awayTeam }} vs {{ viewedRecord.homeTeam }}</span>
                <v-btn size="x-small" icon @click="closeViewModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text v-if="viewedRecord">
                <p class="viewPitcher" v-if="awayPitcher && homePitcher">
                  <!-- 각 팀의 선발투수를 보여주는데, 사용자가 선발투수를 입력했을 때만 띄워줌 -->
                  {{ awayPitcher }} <b>vs</b> {{ homePitcher }}
                </p>
                <!-- <p class="viewLineup">
                  <strong>{{ viewedRecord.awayTeam }} 라인업:</strong>
                  {{ viewedRecord.awayLineup.join(', ') }}
                </p>
                <p class="viewLineup">
                  <strong>{{ viewedRecord.homeTeam }} 라인업:</strong>
                  {{ viewedRecord.homeLineup.join(', ') }}
                </p> -->
                <p><strong>최종 스코어</strong></p>
                <p>{{ finalScore }}</p>
                <p><strong>경기 감상:</strong> {{ viewedRecord.comments }}</p>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>


<style scoped>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

#app {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.v-application {
  height: 100%;
}

.contentContainer {
  max-height: 100vh;
  overflow-y: auto;
  padding: 20px;
  background-color: transparent;
  box-sizing: border-box;
}

.recordBt {
  margin: 20px 0;
}

.recordList {
  margin-top: 20px;
  background: #ffffff5d;
}

.recordItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #fff;
  padding-bottom: 10px;
  margin-bottom: 10px;
  background-color: transparent;
}

/* .modal, .modalContent, .close 스타일 유지 */
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

.modalContent {
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

/* div[v-for] 관련 스타일 유지 */
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

.teamSelection {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
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

.recordItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recordItem button {
  margin-left: 10px;
}

.scoreboard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.teamNames {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  display: none;
}

.scoreHeader,
.scoreRow {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.scoreHeader div,
.scoreRow div {
  flex: 1;
  text-align: center;
}

.scoreHeader div {
  font-weight: bold;
}

.scoreRow div input {
  width: 38px;
  text-align: center;
}

.v-theme--light {
  --v-medium-emphasis-opacity: 1;
}

.v-card {
  padding: 30px 20px;
}

.v-card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.viewLineup {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.v-card-title button {
  position: absolute;
  top: 30px;
  right: 20px;
}

.lineupTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>

<style>
.v-list-item__content {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  width: 100%;
}

.v-btn--icon.v-btn--density-default {
  margin: 5px;
}

.icon-btn .v-icon {
  font-size: 16px;
}
</style>
