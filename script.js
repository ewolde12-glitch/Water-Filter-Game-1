const GAME_TIME = 30;
const GOAL_SCORE = 300;
const ITEM_TYPES = ['water', 'germ', 'trash'];

let score = 0;
let timeLeft = GAME_TIME;
let gameInterval = null;
let spawnInterval = null;
let gameActive = false;

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const waterProgressEl = document.getElementById('water-progress');
const messageEl = document.getElementById('message');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again');
const gameArea = document.getElementById('game-area');
const winScreen = document.getElementById('winScreen');
const restartButton = document.getElementById('restart-button');

function updateScoreDisplay() {
  scoreEl.textContent = score;
  const progress = Math.min((score / GOAL_SCORE) * 100, 100);
  waterProgressEl.style.width = `${progress}%`;
}

function updateTimerDisplay() {
  timerEl.textContent = timeLeft;
}

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#c0392b' : '#17324d';
}

function clearBoard() {
  gameArea.innerHTML = '';
}

function clearWinScreen() {
  winScreen.querySelectorAll('.splash').forEach((splash) => splash.remove());
}

function createGameItem(type, x, y) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = `game-icon ${type}`;
  item.textContent = type === 'water' ? '💧' : type === 'germ' ? '🦠' : '🗑️';
  item.setAttribute('data-type', type);
  item.style.left = `${x}%`;
  item.style.top = `${y}%`;

  item.addEventListener('click', () => {
    if (!gameActive) return;

    if (type === 'water') {
      score += 25;
      setMessage('Clean water collected!');
    } else if (type === 'germ') {
      score = Math.max(0, score - 20);
      setMessage('Germ! Water got contaminated!', true);
    } else if (type === 'trash') {
      score = Math.max(0, score - 30);
      setMessage('Trash! You lost points!', true);
    }

    updateScoreDisplay();
    item.remove();

    if (score >= GOAL_SCORE) {
      winGame();
    }
  });

  gameArea.appendChild(item);
}

function spawnRandomItem() {
  const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
  const x = Math.random() * 72 + 6;
  const y = Math.random() * 58 + 10;

  createGameItem(type, x, y);

  const itemList = [...gameArea.querySelectorAll('.game-icon')];
  if (itemList.length > 10) {
    itemList[0].remove();
  }
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  clearBoard();
  playAgainButton.classList.remove('hidden');
  setMessage(score >= GOAL_SCORE ? 'You cleaned the water!' : 'Time is up! Try again!');
}

function winGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  clearBoard();
  clearWinScreen();
  winScreen.style.display = 'flex';

  for (let i = 0; i < 30; i++) {
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.textContent = '💧';
    splash.style.left = `${Math.random() * 100}%`;
    splash.style.bottom = '0px';
    splash.style.fontSize = `${15 + Math.random() * 30}px`;
    splash.style.animationDuration = `${1 + Math.random() * 1.5}s`;
    winScreen.appendChild(splash);

    setTimeout(() => splash.remove(), 2200);
  }
}

function restartGame() {
  score = 0;
  timeLeft = GAME_TIME;
  gameActive = true;

  clearBoard();
  clearWinScreen();
  winScreen.style.display = 'none';
  playAgainButton.classList.add('hidden');
  updateScoreDisplay();
  updateTimerDisplay();
  setMessage('Game started! Catch the water drops.');

  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  gameInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnInterval = setInterval(spawnRandomItem, 800);

  for (let i = 0; i < 4; i++) {
    spawnRandomItem();
  }
}

startButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', restartGame);
restartButton.addEventListener('click', restartGame);

updateScoreDisplay();
updateTimerDisplay();
setMessage('Press Start Game to begin!');
