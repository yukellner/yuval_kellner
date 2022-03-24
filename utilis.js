'use strict'





function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell-' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}





  function toggleGame(elBtn) {
    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elBtn.innerText = 'Play'
    } else {
        gGameInterval = setInterval(play, GAME_FREQ);
        elBtn.innerText = 'Pause'
    }

}

function cellClicked(elCell, cellI, cellJ) {

  if (gBoard[cellI][cellJ] === LIFE) {

      //update the model
      gBoard[cellI][cellJ] = SUPER_LIFE

      //update the dom
      elCell.innerText = SUPER_LIFE

      blowUpNegs(cellI, cellJ)

  }
  console.table(gBoard)
}

  // var elBoard = document.querySelector('.board')
  // elBoard.innerHTML = strHTML


function countNeighbors(cellI, cellJ, mat) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= mat.length) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
          if (i === cellI && j === cellJ) continue;
          if (j < 0 || j >= mat[i].length) continue;

          if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++;
      }
  }
  return neighborsCount;
}


// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function movePacman(ev) {
  // DONE: use getNextLocation(), nextCell
  if (!gGame.isOn) return
  var nextLocation = getNextLocation(ev.key)
  var nextCell = gBoard[nextLocation.i][nextLocation.j]


  // DONE: return if cannot move
  if (nextCell === WALL) return

  if(nextCell === CHERRY){
      updateScore(10)

  } 
  // if (nextCell === CHERRY){
  //   //  foodCount+=15
  // } return
  // DONE: hitting a ghost?  call gameOver
  if (nextCell === GHOST) {
      
      if (!gPacman.isSuper) gameOver()
      foodCount--
      for (var i = 0; i < gGhosts.length; i++) {
          
          console.log(gGhosts)
          
          if (gGhosts[i].location.i == nextLocation.i && gGhosts[i].location.j == nextLocation.j) gGhosts.splice(i)
          console.log(gGhosts)
      }


  }

  if (nextCell === FOOD) {
      updateScore(1)
  }
  if (nextCell === SUPERFOOD) {

      if(gPacman.isSuper)return

      foodCount--

      
      getSuper()
      clearTimeout()
      setTimeout(function(){
          gPacman.isSuper = false
          console.log('im here')
          for(var i=0; i<gGhosts.length; i++){
              gGhosts[i].color = getRandomColor()
          } 
      
      },5000)
     
      
  }


  function getSuper() {
      gPacman.isSuper = true
      updateAllGhostColor()

  }





  // DONE: moving from current position:
  // DONE: update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
  // DONE: update the DOM
  renderCell(gPacman.location, EMPTY)


  // DONE: Move the pacman to new location
  // DONE: update the model
  gPacman.location = nextLocation
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
  // DONE: update the DOM
  renderCell(gPacman.location, PACMAN)


  
  if(emptyCountTotal == foodCount)gameDone()


  
}


function buildBoard() {
  const SIZE = 10;
  var board = [];
  
  for (var i = 0; i < SIZE; i++) {
      board.push([]);
      for (var j = 0; j < SIZE; j++) {
          board[i][j] = FOOD;
          foodCount++
          if (i === 0 || i === SIZE - 1 ||
              j === 0 || j === SIZE - 1 ||
              (j === 3 && i > 4 && i < SIZE - 2)) {
              board[i][j] = WALL;
              foodCount--
          }
      }
  }
  foodCount--
  return board;
}

function updateDOM(board) {
  var elCells = document.querySelectorAll('.cell')
  for (var i = 0; i < board.length; i++){
    for (var j = 0; j < board.length; j++){
      elCells[i * board.length + j].style.opacity = board[i][j].isAlive ? '1' : '0'
      elCells[i * board.length + j].style.backgroundColor = getColor(gRunCount)
      elCells[i * board.length + j].style.transition = `all ${gSpeed / 2}s ease`
    }

  }
}

function getRandomColor() {
  var red = getRandomInt(0, 255)
  var green = getRandomInt(0, 255)
  var blue = getRandomInt(0, 255)
  return `rgb(${red},${green},${blue})`
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor((max - min + 1) * Math.random() + min)
}