//Author: Thomas J. Claxton
//Man I love battleship

// ============================================
// GAME CONSTANTS
// ============================================

const MAX_WIDTH = 8;
const MAX_LENGTH = 8;

const HIT_TILE = '❌';
const MISS_TILE = '⭕️';
const EMPTY_TILE = '🌊';
const SHIP_TILE = '🚢';


// ============================================
// GAME STATE
// ============================================

let targetWord = '';
let currentRow = 0;
let currentTile = 0;
let gameOver = false;
let currentGuess = '';
let battleBoard = new Map();
let startTime = null;
let timerInterval = null;

// ============================================
// INITIALIZE GAME BOARD
// ============================================

function initialize() {
    targetWord = '';
    currentRow = 0;
    currentTile = 0;
    gameOver = false;
    currentGuess = '';
    battleBoard = new Map();

    createBoard();
    placeShips(5);
    placeShips(4);
    placeShips(3);
    placeShips(3);
    placeShips(2);

    startTimer();
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.replaceChildren();
    
    for (let i = 0; i < MAX_LENGTH; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for (let j = 0; j < MAX_WIDTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${i}-${j}`;
            tile.textContent = EMPTY_TILE;
            tile.addEventListener('click', () => {
                handleTileClick(tile.id);
            });
            row.appendChild(tile);

            battleBoard.set(tile.id, EMPTY_TILE);
        }
        
        board.appendChild(row);
    }
}

function isTileEmpty(row, column) {
    return (row < MAX_LENGTH && column < MAX_WIDTH && battleBoard.get(`tile-${row}-${column}`) === EMPTY_TILE);
}

function placeShips(shipLength) {
    // make a list of all valid placement combinations
    let valid_placements = [];
    for (let x = 0; x < MAX_LENGTH; x++) {
        for (let y = 0; y < MAX_WIDTH; y++) {
            console.log('');
            if(battleBoard.get(`tile-${x}-${y}`) != EMPTY_TILE)
                continue;                  

            let valid_coord_north = [];
            let valid_coord_south = [];
            let valid_coord_west = [];
            let valid_coord_east = [];
            console.log(x + ',' + y + ' starting point');
            for(let s = 0; s < shipLength; s++) {
                // check north
                let row = x - s;
                let column = y;
                console.log("valid_coord_north.length: " + valid_coord_north.length + " s: " + s);
                if(valid_coord_north.length === s) {
                    console.log(row + ',' + column + ' checking north...');
                    if (isTileEmpty(row, column)) {
                        console.log(`time empty adding tile-${row}-${column}`)
                        valid_coord_north.push(`tile-${row}-${column}`);
                    }
                }

                // check south
                if(valid_coord_south.length === s) {
                    row = x + s;
                    column = y;
                    console.log(row + ',' + column + ' checking south...');
                    if (isTileEmpty(row, column))
                        valid_coord_south.push(`tile-${row}-${column}`);
                }

                // check west
                if(valid_coord_west.length === s) {
                    row = x;
                    column = y - s;
                    console.log(row + ',' + column + ' checking west...');
                    if (isTileEmpty(row, column))
                        valid_coord_west.push(`tile-${row}-${column}`);
                }

                // check east
                if(valid_coord_east.length === s) {
                    row = x;
                    column = y + s;
                    console.log(row + ',' + column + ' checking east...');
                    if (isTileEmpty(row, column))
                        valid_coord_east.push(`tile-${row}-${column}`);
                }
            }

            // add valid placements
            if(valid_coord_north.length === shipLength) {
                console.log('valid north coords: ' + valid_coord_north);
                valid_placements.push(valid_coord_north);
            }
            if(valid_coord_south.length === shipLength) {
                console.log('valid south coords: ' + valid_coord_south);
                valid_placements.push(valid_coord_south);
            }
            if(valid_coord_west.length === shipLength) {
                console.log('valid west coords: ' + valid_coord_west);
                valid_placements.push(valid_coord_west);
            }
            if(valid_coord_east.length === shipLength) {
                console.log('valid east coords: ' + valid_coord_east);
                valid_placements.push(valid_coord_east);
            }

        }

    }

    console.log('valid placements: ' + valid_placements);
    console.log('sample valid placement: ' + valid_placements[0]);

    const randomPlacements = valid_placements[Math.floor(Math.random() * valid_placements.length)];

    // update the boardwith the placements
    randomPlacements.forEach((element) => {
        console.log('inserting: ' + element);
        battleBoard.set(element, SHIP_TILE);
    }); 

    console.log(battleBoard);
}



function startTimer() {
  if (timerInterval) return;

  startTime = performance.now();
  
  timerInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;

    const totalMs = Math.floor(elapsed);
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;

    document.getElementById("timer").textContent =
      `${mins}:${secs.toString().padStart(2, "0")}.${ms
        .toString()
        .padStart(3, "0")}`;
  }, 10); // update every 10ms
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  document.getElementById("timer").textContent = "0:00.000";
}


// ============================================
// GAME LOGIC
// ============================================

function getShareResults() {
    let shareable = '';
    let score = 0;
    let userBoard = '';
    const timerElement = document.getElementById("timer");
    shareable += timerElement.textContent + "\n";
    
    for(let row = 0; row < MAX_LENGTH; row++) {
        for(let column = 0; column < MAX_WIDTH; column++) {
            const tile = battleBoard.get(`tile-${row}-${column}`);
            if(tile === HIT_TILE) {
                score++;
                userBoard += SHIP_TILE;
            }
            else if(tile === MISS_TILE) {
                score++;
                userBoard += tile;
            }
            else {
                userBoard += tile;
            }
        }
        userBoard += '\n';
    }
    shareable += "Score: " + score + "/" + (MAX_LENGTH*MAX_WIDTH) + '\n';
    shareable += userBoard;
    console.log('share:\n'+shareable);
    return shareable;
}

function checkGameOver() {
    for (const value of battleBoard.values()) {
        if (value === SHIP_TILE) {
            return false;
        }
    }
    return true;
}

function handleTileClick(tile) {
    console.log('battle tile clicked ' + tile);

    const tempTileValue = battleBoard.get(tile);

    let element = document.getElementById(tile);

    if(battleBoard.get(tile) === SHIP_TILE) {
        console.log('HIT');
        battleBoard.set(tile, HIT_TILE);
        flipTile(tile, HIT_TILE);
    }
    else if(battleBoard.get(tile) === EMPTY_TILE) {
        console.log('MISS');
        battleBoard.set(tile, MISS_TILE);
        flipTile(tile, MISS_TILE);
    }

    if (checkGameOver()) {
        stopTimer();
        showShareMessage();
    }
}

function flipTile(tileFlip, newValue) {
    const tile = document.getElementById(tileFlip);
    tile.classList.add('flip'); 

    // change value halfway through flip
    setTimeout(() => {
        tile.textContent = newValue;
    }, 250);

    tile.addEventListener("animationend", () => {
        tile.classList.remove("flip");
    }, { once: true });
    
}

function showMessage(text, duration = 1500) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.classList.add('show');
    setTimeout(() => message.classList.remove('show'), duration);
}

function showShareMessage() {
    const score = getShareResults();
    const message = document.getElementById('message');
    const scoreBoardElement = document.getElementById('scoreboard');
    scoreBoardElement.textContent = score;
    message.classList.add('show');
}

// ============================================
// EVENT LISTENERS
// ============================================

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        handleTileClick(tile.dataset.key);
    });
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    const status = document.getElementById("copy-status");
    const score = getShareResults();
    console.log("Share score: " + score);
    try {
      await navigator.clipboard.writeText(score);
      status.textContent = "Copied score!";
      setTimeout(() => (status.textContent = ""), 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
      status.textContent = "Copy failed";
      setTimeout(() => (status.textContent = ""), 1500);
    }

  });

  document.getElementById("replay-btn").addEventListener("click", async () => {
    const message = document.getElementById('message');
    message.classList.remove('show');
    resetTimer();
    initialize();
  });


// ============================================
// INITIALIZE
// ============================================

initialize();
