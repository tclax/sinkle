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

const CARRIER_KEY = "CARRIER";
const BATTLESHIP_KEY = "BATTLESHIP";
const SUBMARINE_KEY = "SUBMARINE";
const DESTROYER_KEY = "DESTROYER";
const SCOUT_KEY = "SCOUT";


// ============================================
// GAME STATE
// ============================================

let battleBoard = new Map();
let ships = new Map();
let startTime = null;
let timerInterval = null;

// ============================================
// INITIALIZE GAME BOARD
// ============================================

function initialize() {

    battleBoard.clear();
    ships.clear();

    // create the board
    createBoard();

    // get coordinates place ships
    const carrierCoordinates = placeShips(5);
    const battleshipCoordinates = placeShips(4);
    const subCoordinates = placeShips(3);
    const destroyerCoordinates = placeShips(3);
    const scoutCoordinates = placeShips(2);

    console.log('carrierCoordiantes type: ' + typeof(carrierCoordinates));

    // create a map of ships and their coordinates
    ships.set(CARRIER_KEY, carrierCoordinates);
    ships.set(BATTLESHIP_KEY, battleshipCoordinates);
    ships.set(SUBMARINE_KEY, subCoordinates);
    ships.set(DESTROYER_KEY, destroyerCoordinates);
    ships.set(SCOUT_KEY, scoutCoordinates);

    startTimer();
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.classList.remove('disable');
    board.innerHTML = '';
    board.replaceChildren();
    
    for (let rowIndex = 0; rowIndex < MAX_LENGTH; rowIndex++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for (let columnIndex = 0; columnIndex < MAX_WIDTH; columnIndex++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${rowIndex}-${columnIndex}`;
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
    console.log('random placemnt type: ' + typeof(randomPlacements));

    // update the boardwith the placements
    randomPlacements.forEach((element) => {
        console.log('inserting: ' + element);
        battleBoard.set(element, SHIP_TILE);
    }); 

    console.log(battleBoard);

    return randomPlacements;
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

    if(battleBoard.get(tile) === SHIP_TILE) {
        console.log('HIT');
        battleBoard.set(tile, HIT_TILE);
        flipTile(tile, HIT_TILE);

        // check if destroyed
        for (const [key, value] of ships) {
            console.log('checking ' + key + " " + value);
            console.log('value: ' + typeof(value));
            console.log('included? ' + value.includes(tile));
            console.log('every? ' + value.every(checkTile => battleBoard.get(checkTile) === HIT_TILE));
            if (value.includes(tile) && value.every(checkTile => battleBoard.get(checkTile) === HIT_TILE)) {
                console.log(key + " has sank!");
                const destroyedElement = document.getElementById("destroyed");
                destroyedElement.innerText += (" " + key);
                break;
            }
        }
    }
    else if(battleBoard.get(tile) === EMPTY_TILE) {
        console.log('MISS');
        battleBoard.set(tile, MISS_TILE);
        flipTile(tile, MISS_TILE);
    }

    if (checkGameOver()) {
        const gameBoard = document.getElementById("game-board");
        gameBoard.classList.add("disable");
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

function showMessage(text, duration=1500) {
    const info = document.getElementById('info');
    const message = document.getElementById('game-details');
    message.textContent = text;
    info.classList.add('show');
    setTimeout(() => { 
        info.classList.remove('show');
    }, duration);
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

showMessage(`Sink all the ships very quickly.\nYou will be graded on speed and accuracy.\nThink.\nAct.\nSinkle.\n${EMPTY_TILE}-OCEAN\n${HIT_TILE}-HIT\n${MISS_TILE}-MISS`, 3000);
setTimeout(() => { 
    initialize();
},  3000);

