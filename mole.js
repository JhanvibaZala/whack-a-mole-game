// Game state variables
let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;

// Interval IDs to manage repeated mole/plant appearance
let moleIntervalId;
let plantIntervalId;

// Timer countdown
let timeLeft = 30;
let timerId;

// Sound effects
const hitSound = new Audio('./Audios/hit.wav');
const boomSound = new Audio('./Audios/boom.mp3');

// Start Game
function startGame() {
  // Show game UI
  document.getElementById("board").style.display = "";
  document.getElementById("score").style.display = "block";
  document.getElementById("timer").style.display = "block";
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("resetBtn").style.display = "inline-block";

  setGame();
  startTimer();
}

// Create 3x3 board and set mole/plant intervals
function setGame() {
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  }

  // Default difficulty on start: medium
  moleIntervalId = setInterval(setMole, 700);
  plantIntervalId = setInterval(setPlant, 1500);
}

// Show mole at random position
function setMole() {
  if (gameOver) return;
  if (currMoleTile) currMoleTile.innerHTML = "";

  let mole = document.createElement("img");
  mole.src = "./Images/monty-mole.png";

  let num = getRandomTile();
  if (currPlantTile && currPlantTile.id === num) return;

  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(mole);
}

// Show plant at different tile
function setPlant() {
  if (gameOver) return;
  if (currPlantTile) currPlantTile.innerHTML = "";

  let plant = document.createElement("img");
  plant.src = "./Images/piranha-plant.png";

  let num = getRandomTile();
  if (currMoleTile && currMoleTile.id === num) return;

  currPlantTile = document.getElementById(num);
  currPlantTile.appendChild(plant);
}

// Return a random tile number from 0 to 8
function getRandomTile() {
  return Math.floor(Math.random() * 9).toString();
}

// Called when player clicks a tile
function selectTile() {
  if (gameOver) return;

  if (this === currMoleTile) {
    score += 10;
    hitSound.play(); // sound for hitting mole
    document.getElementById("score").innerText = "Score : " + score.toString();
  } else if (this === currPlantTile) {
    boomSound.play(); // sound for clicking plant
    gameOver = true;
    clearInterval(timerId);
    document.getElementById("score").innerText = "💥 GAME OVER: " + score;
  }
}

// Timer countdown logic
function startTimer() {
  timeLeft = 30;
  document.getElementById("timer").innerText = `⏳ Time Left: ${timeLeft} seconds`;

  timerId = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `⏳ Time Left: ${timeLeft} seconds`;

    if (timeLeft === 0) {
      clearInterval(timerId);
      clearInterval(moleIntervalId);
      clearInterval(plantIntervalId);
      gameOver = true;
      document.getElementById("score").innerText = "⏱ TIME'S UP: " + score;
    }
  }, 1000);
}

// Restart the game
function resetGame() {
  clearInterval(timerId);
  clearInterval(moleIntervalId);
  clearInterval(plantIntervalId);

  // Reset variables
  currMoleTile = null;
  currPlantTile = null;
  score = 0;
  gameOver = false;

  // Reset UI
  document.getElementById("score").innerText = "0";
  document.getElementById("timer").innerText = "⏳ Time Left: 30 seconds";

  // Clear board
  const board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  // Rebuild board and restart intervals
  setGame();
  startTimer();
}

// Change difficulty dynamically
function setDifficulty(moleSpeed, plantSpeed) {
  clearInterval(moleIntervalId);
  clearInterval(plantIntervalId);

  moleIntervalId = setInterval(setMole, moleSpeed);
  plantIntervalId = setInterval(setPlant, plantSpeed);
}
