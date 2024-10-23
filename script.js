const ROWS = 6;
const COLS = 7;
let currentPlayer = 'player1';
let board = [];
let gameOver = false;
const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart');

function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  gameBoard.innerHTML = '';

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      gameBoard.appendChild(cell);
    }
  }
  addClickHandlers();
}

function addClickHandlers() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
}

function handleCellClick(event) {
  if (gameOver) return;

  const col = parseInt(event.target.dataset.col);
  const row = findEmptyRow(col);

  if (row !== null) {
    // Animate the piece falling into the right place
    animatePieceFall(col, row);

    // Update the game board data after the animation is done
    setTimeout(() => {
      board[row][col] = currentPlayer;
      if (checkWin(row, col)) {
        setTimeout(() => alert(`${currentPlayer === 'player1' ? 'Player 1 (Mossy Green)' : 'Player 2 (Mystical Purple)'} wins!`), 10);
        gameOver = true;
      } else {
        switchPlayer();
      }
    }, 300); // Match animation duration
  }
}

function animatePieceFall(col, row) {
  const startY = -1 * (row + 1) * 85; // Calculate the starting y position based on row
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  const piece = document.createElement('div');
  piece.classList.add('piece', currentPlayer);
  piece.style.transform = `translateY(${startY}px)`; // Start off above the board

  // Append the piece to the target cell but with an initial position outside the board
  cell.appendChild(piece);

  // Use CSS transition to animate the piece falling
  setTimeout(() => {
    piece.style.transition = 'transform 0.3s ease-in';
    piece.style.transform = 'translateY(0)'; // Move to the correct position
  }, 10);
}

function findEmptyRow(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      return row;
    }
  }
  return null;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
}

function checkWin(row, col) {
  return checkDirection(row, col, 1, 0) || // horizontal
    checkDirection(row, col, 0, 1) ||     // vertical
    checkDirection(row, col, 1, 1) ||     // diagonal \
    checkDirection(row, col, 1, -1);      // diagonal /
}

function checkDirection(row, col, rowDelta, colDelta) {
  let count = 1;

  for (let i = 1; i < 4; i++) {
    const newRow = row + i * rowDelta;
    const newCol = col + i * colDelta;
    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === currentPlayer) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 4; i++) {
    const newRow = row - i * rowDelta;
    const newCol = col - i * colDelta;
    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === currentPlayer) {
      count++;
    } else {
      break;
    }
  }

  return count >= 4;
}

restartButton.addEventListener('click', () => {
  createBoard();
  currentPlayer = 'player1';
  gameOver = false;
});

createBoard();
