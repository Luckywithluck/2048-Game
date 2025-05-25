// Initialize and setup
const boxes = document.querySelectorAll(".box");
let grid = new Array(16).fill(0);

// Start the game initially
startGame();

// Start or reset the game
function startGame() {
  grid.fill(0);
  placeRandomTile();
  placeRandomTile();
  updateUI();
}

// Place a random 2 or 4 tile in an empty spot
function placeRandomTile() {
  const emptyTiles = [];
  grid.forEach((value, index) => {
    if (value === 0) emptyTiles.push(index);
  });
  if (emptyTiles.length === 0) return;
  const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  grid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
}

// Update the visual grid tiles
function updateUI() {
  for (let i = 0; i < 16; i++) {
    boxes[i].textContent = grid[i] === 0 ? "" : grid[i];
    boxes[i].setAttribute("data-value", grid[i]);
  }
}

// Merge helper - merges one row or column array for left/up moves
function mergeRow(row) {
  row = row.filter(val => val !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  row = row.filter(val => val !== 0);
  while (row.length < 4) row.push(0);
  return row;
}

// code for moving left
function moveLeft() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    const start = row * 4;
    const currentRow = grid.slice(start, start + 4);
    const newRow = mergeRow(currentRow);
    for (let i = 0; i < 4; i++) {
      if (grid[start + i] !== newRow[i]) {
        grid[start + i] = newRow[i];
        moved = true;
      }
    }
  }
  return moved;
}

// code for moving right
function moveRight() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    const start = row * 4;
    const currentRow = grid.slice(start, start + 4).reverse();
    const newRow = mergeRow(currentRow).reverse();
    for (let i = 0; i < 4; i++) {
      if (grid[start + i] !== newRow[i]) {
        grid[start + i] = newRow[i];
        moved = true;
      }
    }
  }
  return moved;
}

// code for moving up
function moveUp() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    const currentCol = [];
    for (let i = 0; i < 4; i++) currentCol.push(grid[i * 4 + col]);
    const newCol = mergeRow(currentCol);
    for (let i = 0; i < 4; i++) {
      if (grid[i * 4 + col] !== newCol[i]) {
        grid[i * 4 + col] = newCol[i];
        moved = true;
      }
    }
  }
  return moved;
}

// code for moving down
function moveDown() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    const currentCol = [];
    for (let i = 3; i >= 0; i--) currentCol.push(grid[i * 4 + col]);
    const newCol = mergeRow(currentCol);
    for (let i = 3, j = 0; i >= 0; i--, j++) {
      if (grid[i * 4 + col] !== newCol[j]) {
        grid[i * 4 + col] = newCol[j];
        moved = true;
      }
    }
  }
  return moved;
}

// Keyboard input handling for moves
document.addEventListener("keydown", function (event) {
  let didMove = false;
  switch (event.key) {
    case "ArrowLeft":
      didMove = moveLeft();
      break;
    case "ArrowRight":
      didMove = moveRight();
      break;
    case "ArrowUp":
      didMove = moveUp();
      break;
    case "ArrowDown":
      didMove = moveDown();
      break;
  }
  if (didMove) {
    placeRandomTile();
    updateUI();
  }
});

// New Game button handler
document.getElementById("new-game-btn").addEventListener("click", () => {
  startGame();
});
