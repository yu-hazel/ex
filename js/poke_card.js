// scripts.js

let pokemonData = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadPokemons();
});

async function loadPokemons() {
  const offset = Math.floor(Math.random() * 1000); // 1000 이내의 랜덤 오프셋 설정
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=10`);
  const data = await response.json();
  const pokemons = data.results;

  // 10쌍의 포켓몬을 가져와서 중복된 배열 만들기
  pokemonData = [...pokemons, ...pokemons].map(pokemon => ({
    ...pokemon,
    id: Math.random()
  }));

  // 카드를 섞는다
  pokemonData.sort(() => Math.random() - 0.5);

  // 카드를 그린다
  const cardGrid = document.querySelector(".cardGrid");
  cardGrid.innerHTML = ''; // 기존 카드 초기화
  pokemonData.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = pokemon.name;
    card.innerHTML = `
      <div class="front"></div>
      <div class="back">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" alt="${pokemon.name}">
      </div>
    `;
    card.addEventListener("click", flipCard);
    cardGrid.appendChild(card);
  });

  matches = 0; // 매치 초기화
  document.querySelector(".gameComplete").style.display = 'none'; // 완료 메시지 숨기기
}

function getPokemonId(url) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  resetBoard();
  matches++;

  if (matches === 10) {
    setTimeout(showGameComplete, 500);
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function showGameComplete() {
  const gameCompleteElement = document.querySelector(".gameComplete");
  gameCompleteElement.style.display = 'block';
}

// "다시 하기" 버튼 클릭 이벤트 리스너 추가
document.querySelector(".restartButton").addEventListener("click", () => {
  loadPokemons();
});