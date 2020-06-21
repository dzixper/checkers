'use strict';

let board = [
    [0, 2, 0, 2, 0, 2, 0, 2],   //2 = player2
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]    //1 = player1
];

function initBoard() {
    document.getElementById('board').innerHTML = ''; //clear div
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = i + "" + j;
            if (i % 2 === 0)
                j % 2 === 0 ? tile.classList.add('white') : tile.classList.add('black');
            else
                j % 2 === 0 ? tile.classList.add('black') : tile.classList.add('white');
            if (board[i][j] !== 0) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                board[i][j] === 1 ? piece.classList.add('player1') : piece.classList.add('player2');
                tile.appendChild(piece).addEventListener('click', checkPiece);
            }
            document.querySelector('#board').appendChild(tile).addEventListener('click', movePossible);
        }
    }
}

initBoard();

let pieceChecked = false,
    pieceColumn = 0,
    pieceRow = 0,
    tileColumn = 0,
    tileRow = 0,
    playerTurn = 1;

function currentPlayer() {
    document.getElementById('turn').innerText = "Player " + playerTurn + " moves";
}

function swapPlayer() {
    pieceChecked = false;
    playerTurn = (playerTurn === 1) ? 2 : 1;
    currentPlayer();
}

function checkPiece() {
    if (playerTurn === 1 && this.classList.value === 'piece player2') return false;
    if (playerTurn === 2 && this.classList.value === 'piece player1') return false;
    pieceColumn, pieceRow = 0; //TODO -- czy to jest potrzebne?
    pieceChecked = true;
    [pieceRow, pieceColumn] = this.parentElement.id;
    pieceRow = parseInt(pieceRow); //TODO -- zrobic to lepiej
    pieceColumn = parseInt(pieceColumn);
}

function movePossible() {
    if (this.classList.value === 'tile white') return false;
    if (!pieceChecked) return false; //TODO -- czy to jest potrzebne?
    if (this.hasChildNodes()) return false;

    tileRow, tileColumn = 0; //TODO -- czy to jest potrzebne?
    [tileRow, tileColumn] = this.id;
    tileRow = parseInt(tileRow); //TODO -- zrobic to lepiej
    tileColumn = parseInt(tileColumn);

    if (Math.abs(pieceRow - tileRow) === 2 &&
        Math.abs(pieceColumn - tileColumn) === 2 &&
        board[tileRow][tileColumn] === 0 &&
        board[(tileRow+pieceRow)/2][(tileColumn+pieceColumn)/2] !== 0) {
        board[(tileRow + pieceRow) / 2][(tileColumn + pieceColumn) / 2] = 0
        move();

    }

    if (playerTurn === 1 && pieceRow - tileRow === 1 && Math.abs(pieceColumn - tileColumn) === 1) {
        move();
        swapPlayer();
    }
    if (playerTurn === 2 && pieceRow - tileRow === -1 && Math.abs(pieceColumn - tileColumn) === 1) {
        move();
        swapPlayer();
    }
}

function move() {
    [board[pieceRow][pieceColumn], board[tileRow][tileColumn]] = [board[tileRow][tileColumn], board[pieceRow][pieceColumn]]; //swap places
    [pieceRow, pieceColumn] = [tileRow, tileColumn];
    initBoard();
}

