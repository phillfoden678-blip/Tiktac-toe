const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");
const difficultySelect = document.getElementById("difficulty");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let boardState = Array(9).fill("");
let vsComputer = false;
let difficulty = "easy";

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  currentPlayer = "X";
  statusText.textContent = "";
  restartBtn.style.display = "none";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleCellClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
  gameActive = true;
}

function handleCellClick(index) {
  if (!gameActive || boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  cells[index].textContent = currentPlayer;

  if (checkWinner()) {
    statusText.textContent = `${currentPlayer} wins! 🎉`;
    gameActive = false;
    restartBtn.style.display = "block";
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a draw 😐";
    gameActive = false;
    restartBtn.style.display = "block";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (vsComputer && currentPlayer === "O") {
    setTimeout(() => computerMove(), 500);
  }
}

function computerMove() {
  let available = boardState
    .map((val, index) => (val === "" ? index : null))
    .filter((v) => v !== null);

  if (available.length === 0) return;

  let moveIndex;
  if (difficulty === "easy") {
    moveIndex = available[Math.floor(Math.random() * available.length)];
  } else if (difficulty === "medium") {
    moveIndex = Math.random() < 0.6 ? bestMove() : available[Math.floor(Math.random() * available.length)];
  } else if (difficulty === "hard") {
    moveIndex = Math.random() < 0.8 ? bestMove() : available[Math.floor(Math.random() * available.length)];
  } else {
    moveIndex = bestMove(); // impossible
  }

  handleCellClick(moveIndex);
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      let score = minimax(boardState, 0, false);
      boardState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(state, depth, isMaximizing) {
  const winner = getWinner(state);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (!state.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "O";
        let score = minimax(state, depth + 1, false);
        state[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "X";
        let score = minimax(state, depth + 1, true);
        state[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getWinner(state) {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }
  return null;
}

function checkWinner() {
  return winningCombinations.some((combo) => {
    const [a, b, c] = combo;
    return (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    );
  });
}

restartBtn.addEventListener("click", createBoard);
difficultySelect.addEventListener("change", (e) => difficulty = e.target.value);

twoPlayerBtn.addEventListener("click", () => {
  vsComputer = false;
  createBoard();
  statusText.textContent = "2 Player Mode: X goes first!";
});

vsComputerBtn.addEventListener("click", () => {
  vsComputer = true;
  difficulty = difficultySelect.value;
  createBoard();
  statusText.textContent = `Vs Computer Mode (${difficulty.toUpperCase()}): You are X!`;
});

// Default
createBoard();
