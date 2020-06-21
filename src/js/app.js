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

let pieceChecked = false,
    pieceColumn = 0,
    pieceRow = 0,
    tileColumn = 0,
    tileRow = 0,
    playerTurn = 1,
    battleMode = false;

function restart() {
    board = [
        [0, 2, 0, 2, 0, 2, 0, 2],   //2 = player2
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]    //1 = player1
    ];
    pieceChecked = false;
    pieceColumn = 0;
    pieceRow = 0;
    tileColumn = 0;
    tileRow = 0;
    playerTurn = 1;
    battleMode = false;
    currentPlayer();
    updateBoard();

}

function updateBoard() {
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

restart();

function currentPlayer() {
    document.getElementById('turn').innerText = "Player " + playerTurn + " moves";
}

function swapPlayer() {
    pieceChecked = false;
    battleMode = false;
    playerTurn = (playerTurn === 1) ? 2 : 1;
    currentPlayer();
}

function otherPlayer() {
    return (playerTurn === 1) ? 2 : 1;
}

function checkPiece() {
    if (playerTurn === 1 && this.classList.value === 'piece player2') return false;
    if (playerTurn === 2 && this.classList.value === 'piece player1') return false;
    if (battleMode) return false;
    pieceChecked = true;
    [pieceRow, pieceColumn] = this.parentElement.id;
    pieceRow = parseInt(pieceRow); //TODO -- make it better
    pieceColumn = parseInt(pieceColumn);
}

function movePossible() {
    if (this.classList.value === 'tile white') return false;
    if (!pieceChecked) return false;
    if (this.hasChildNodes()) return false;

    [tileRow, tileColumn] = this.id;
    tileRow = parseInt(tileRow); //TODO -- make it better
    tileColumn = parseInt(tileColumn);

    if (playerTurn === 1 && pieceRow - tileRow === 1 && Math.abs(pieceColumn - tileColumn) === 1 && !battleMode) {
        move();
        swapPlayer();
    }
    if (playerTurn === 2 && pieceRow - tileRow === -1 && Math.abs(pieceColumn - tileColumn) === 1 && !battleMode) {
        move();
        swapPlayer();
    }

    //if beating is possible
    if (Math.abs(pieceRow - tileRow) === 2 &&
        Math.abs(pieceColumn - tileColumn) === 2 &&
        board[tileRow][tileColumn] === 0 &&
        ((playerTurn === 1 && board[(tileRow+pieceRow)/2][(tileColumn+pieceColumn)/2] === 2) || //try otherPlayer()
        (playerTurn === 2 && board[(tileRow+pieceRow)/2][(tileColumn+pieceColumn)/2] === 1))) {
        battleMode = true;
        board[(tileRow + pieceRow) / 2][(tileColumn + pieceColumn) / 2] = 0
        move();


        if ((pieceRow-2 < 0 || pieceColumn-2 < 0 || board[pieceRow-1][pieceColumn-1] !== otherPlayer() || board[pieceRow-2][pieceColumn-2] !== 0) &&
            (pieceRow-2 < 0 || pieceColumn+2 > 7 || board[pieceRow-1][pieceColumn+1] !== otherPlayer() || board[pieceRow-2][pieceColumn+2] !== 0) &&
            (pieceRow+2 > 7 || pieceColumn-2 < 0 || board[pieceRow+1][pieceColumn-1] !== otherPlayer() || board[pieceRow+2][pieceColumn-2] !== 0) &&
            (pieceRow+2 > 7 || pieceColumn+2 > 7 || board[pieceRow+1][pieceColumn+1] !== otherPlayer() || board[pieceRow+2][pieceColumn+2] !== 0)) {
            swapPlayer();
        }


    }
}

function move() {
    [board[pieceRow][pieceColumn], board[tileRow][tileColumn]] = [board[tileRow][tileColumn], board[pieceRow][pieceColumn]]; //swap places
    [pieceRow, pieceColumn] = [tileRow, tileColumn];
    updateBoard();
}

