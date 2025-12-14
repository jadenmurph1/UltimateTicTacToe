/*
const gameBoards = document.querySelectorAll('.grid');
//console.log(gameBoards);
gameBoards.forEach((board, boardIndex) => {
  const cells = board.querySelectorAll('.cell');
  const winnerbox = document.getElementById('winnerbox');
  let turn = 0;
  var cellplayed = 0;

  cells.forEach((cell,cellnum) => {
    cell.addEventListener('click', () => {

      if (cell.value !== "") return; // Prevent overwriting a filled cell

        if (turn === 0) {
          cell.value = "X";
          //console.log('cell:',cellnum );
          //console.log('board:', boardIndex);
          cellplayed = cellnum;
          turn = 1;
        } else {
          cell.value = "O";
          //console.log('cell:',cellnum );
          turn = 0;
          //cells[2].disabled = true;
          //cells.forEach(c => c.disabled = true);


        }
        console.log('cell:',cellplayed);
        const targetGrid = document.querySelector(`#game-${cellplayed}`);
        targetGrid.querySelectorAll(".cell").forEach(cell => {
            cell.disabled = false;
        });
    });
    
    //cells[2].disabled = true;
  });
});*/

// JavaScript for Ultimate Tic Tac Toe

const gameBoards = document.querySelectorAll(".grid");
const allCells = document.querySelectorAll(".cell");

let currentPlayer = "X";
let activeBoard = null; // null = free choice
let boardStates = Array(9).fill(null).map(() => Array(9).fill(""));
let localWinners = Array(9).fill(null);

function checkWin(cells) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let [a, b, c] of winPatterns) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

function updateBoardAvailability(nextBoard) {
  gameBoards.forEach((board, i) => {
    const enable = (localWinners[i] == null) && (nextBoard === null || nextBoard === i);
    const inputs = board.querySelectorAll(".cell");
    inputs.forEach((cell, idx) => {
      if (!cell.value && enable) {
        cell.disabled = false;
      } else {
        cell.disabled = true;
      }
    });
  });
}

function markBoardWin(boardIndex, winner) {
  const board = document.getElementById(`game-${boardIndex}`);
  board.style.backgroundColor = winner === "X" ? "darkgreen" : "darkred";
}

function checkGlobalWin() {
  const globalWinner = checkWin(localWinners);
  if (globalWinner) {
    document.getElementById("winnerbox").textContent = `${globalWinner} wins the game!`;
    allCells.forEach(c => c.disabled = true);
  }
}

// Add data attributes to identify positions
let boardCount = 0;
gameBoards.forEach((board, boardIndex) => {
  const cells = board.querySelectorAll(".cell");
  cells.forEach((cell, cellIndex) => {
    cell.dataset.local = boardIndex;
    cell.dataset.index = cellIndex;
  });
});

allCells.forEach(cell => {
  cell.addEventListener("click", () => {
    const local = parseInt(cell.dataset.local);
    const index = parseInt(cell.dataset.index);

    if (cell.value || (activeBoard !== null && local !== activeBoard)) return;

    cell.value = currentPlayer;
    boardStates[local][index] = currentPlayer;
    cell.disabled = true;

    const localWinner = checkWin(boardStates[local]);
    if (localWinner) {
      localWinners[local] = localWinner;
      markBoardWin(local, localWinner);
    }

    checkGlobalWin();

    activeBoard = boardStates[index].includes("") && !localWinners[index] ? index : null;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateBoardAvailability(activeBoard);
  });
});

updateBoardAvailability(null);
