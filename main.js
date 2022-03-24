'use strict'

const MINE = '💣'
const FLAG = '🚩'
var gBoard = []
var gMines = []
var gBoardSize = 4
var mizetotal = 2
var markedMinses = 0
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3, isHint: false, avilbleHints: 3 }
var gIntervalID;
var bestScore = 0




function init() {
    levelchoose()
    reasetClock()
    gGame.markedCount = 0
    gGame.avilbleHints = 3
    gGame.shownCount = 0
    var header = document.querySelector('.smile')
    header.innerText = '😃'
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard)
    creatMines(gBoard, mizetotal)
    updateMinesAround(gBoard)
    gGame.isOn = false
    gGame.lives = 3









}

function startGame() {

    gGame.isOn = true
    gIntervalID = setInterval(stopwatch, 1000)


}

function stopwatch() {
    var sectesxt = document.querySelector('.stoper')


    sectesxt.innerHTML = `⏱️ ${gGame.secsPassed}`
    gGame.secsPassed++
}

function reasetClock() {
    clearInterval(gIntervalID)
    var sectesxt = document.querySelector('.stoper')
    sectesxt.innerHTML = `⏱️ `
    gGame.secsPassed = 0

}



function levelchoose() {


    var Easy = document.querySelector('.Easy')
    var Medium = document.querySelector('.Medium')
    var Expert = document.querySelector('.Expert')


    if (Expert.checked) {
        gGame.isOn = false
        gBoardSize = 12
        mizetotal = 30
        // gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

    }
    if (Medium.checked) {
        gGame.isOn = false
        gBoardSize = 8
        mizetotal = 12
        //  gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
    }
    if (Easy.checked) {
        gGame.isOn = false
        gBoardSize = 4
        mizetotal = 2
        //  gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
    }


}


function creatMines(gBoard, num) {


    for (var i = 0; i < num; i++) {
        var temp = gBoard[randomInt(gBoard)][randomInt(gBoard)]
        temp = gBoard[randomInt(gBoard)][randomInt(gBoard)]
        while (temp.isMine == true) {
            temp = gBoard[randomInt(gBoard)][randomInt(gBoard)]

        }

        temp.isMine = true
        gMines.push(temp)
        renderBoard(gBoard)


    }


}

function randomInt(gBoard) {

    var getRand = Math.floor(Math.random() * gBoard.length)
    return getRand

}


function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, isHint: false }
            board[i][j] = cell
        }
    }
    return board;

}

function renderBoard(board) {
    var strHTML = ''

    var mineTotal = document.querySelector('.minescount')
    mineTotal.innerText = '💣X' + (mizetotal - gGame.markedCount)

    var mineTotal = document.querySelector('.lives')
    mineTotal.innerText = '❤️X' + gGame.lives

    var mineTotal = document.querySelector('.hintcount')
    mineTotal.innerText = gGame.avilbleHints + '🔦'





    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = (board[i][j].isMine) ? MINE : board[i][j].minesAroundCount
            var className = (board[i][j].isShown) ? 'shown' : 'hidden'
            className += (board[i][j].isHint) ? ' hit' : ''
            if (board[i][j].isMarked) cell = FLAG
            if (board[i][j].isShown && board[i][j].minesAroundCount == 0 && gGame.isOn && !board[i][j].isMine) cell = ''
            if (board[i][j].isMarked && board[i][j].minesAroundCount == 0 && board[i][j].isShown) cell = FLAG



            strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellClicked(event, this, ${i}, ${j})" class="${className}" >${cell}</td>`

        }
        strHTML += '</tr>'
    }

    var k = document.querySelector('.table')
    k.innerHTML = strHTML



    checkIfCompleted()



}

function checkIfCompleted() {

    if (!gGame.isOn) return

    if (gGame.shownCount == gBoard.length * gBoard.length) {
        var smile = document.querySelector('.smile')
        smile.innerText = ('😎')
        clearInterval(gIntervalID)
        if (bestScore == 0 || gGame.secsPassed < bestScore) bestScore = gGame.secsPassed
        var elBestScore = document.querySelector('h2')
        elBestScore.innerText = 'best score: ' + (bestScore -1)

    }


    //console.log('best score:',bestScore)
    //renderBoard(gBoard)

}

function gameover() {


    if (gGame.lives > 1) {
        gGame.lives--
        return
    }
    gGame.lives--
    if (gGame.secsPassed < bestScore) bestScore = gGame.secsPassed
    reasetClock()


    var header = document.querySelector('.smile')
    header.innerText = '😱'
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++)
            if (gBoard[i][j].isMine == true) {
                gBoard[i][j].isShown = true


            }

    }


    gGame.isOn = false

    renderBoard(gBoard)
}

function cellClicked(event, cell, iIdx, jIdx) {
    if (!gGame.isOn && gGame.shownCount != 0) return





    window.addEventListener('contextmenu', (event) => {
        event.preventDefault()

    })
    event.preventDefault()

    if (event.button === 2 && gBoard[iIdx][jIdx].isShown == false) {
        if (!gGame.isOn) startGame()
        if (gBoard[iIdx][jIdx].isMarked != true) {
            gBoard[iIdx][jIdx].isMarked = true
            gGame.markedCount++
        }



        gGame.shownCount++

        gBoard[iIdx][jIdx].isShown = true

    }





    if (event.button === 0) {
        //if(cell.innerText == '💣' || cell.innerText == '' ) game()

        if (gGame.isHint == true) {
            cellsAroundHit(iIdx, jIdx)

            setTimeout(cellsAroundNotHit, 1000, iIdx, jIdx)

            gGame.isHint = false
            return

        }


        if (!gGame.isOn) startGame()


        if (!gBoard[iIdx][jIdx].isShown) gGame.shownCount++
        if (gBoard[iIdx][jIdx].isShown && gBoard[iIdx][jIdx].isMarked) gGame.markedCount--


        gBoard[iIdx][jIdx].isShown = true
        if (gBoard[iIdx][jIdx].isMarked && gBoard[iIdx][jIdx].minesAroundCount == 0) cellsAroundVisible(iIdx, jIdx)
        if (gBoard[iIdx][jIdx].isMine) gameover()
        if (cell.innerText === '0') cellsAroundVisible(iIdx, jIdx)
        if (gBoard[iIdx][jIdx].isMarked = true) gBoard[iIdx][jIdx].isMarked = false
    }


    renderBoard(gBoard)






}

function cellsAroundVisible(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;





            if (gBoard[i][j].isShown == false) {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                if (elCell.innerText == '0') cellsAroundVisible(i, j)



            }


        }
    }

    renderBoard(gBoard)



}


function countNeighborsMines(cellI, cellJ, mat) {
    var neighborsCountMines = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j].isMine === true) neighborsCountMines++;
        }
    }
    return neighborsCountMines;
}


function updateMinesAround(gBoard) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = countNeighborsMines(i, j, gBoard)
        }
    }



    renderBoard(gBoard)
}

function hint() {



    if (gGame.avilbleHints > 1) {
        gGame.isHint = true
        gGame.avilbleHints--
        var elHint = document.querySelector('.hintcount')
        elHint.classList.add('light')
        console.log(elHint)

    }
}

function cellsAroundHit(cellI, cellJ) {

    gBoard[cellI][cellJ].isHint = true



    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            gBoard[i][j].isHint = true

        }
    }
    renderBoard(gBoard)



}

function cellsAroundNotHit(cellI, cellJ) {
    
    gBoard[cellI][cellJ].isHint = false


    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            gBoard[i][j].isHint = false

        }
    }
    var elHint = document.querySelector('.hintcount')
        elHint.classList.remove('light')

    renderBoard(gBoard)



}