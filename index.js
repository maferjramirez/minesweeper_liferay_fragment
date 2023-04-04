const gameboard = document.getElementById('gameboard');
  const resetBtn = document.getElementById('reset');
	
  const ROWS = parseInt(configuration.dificultad.split('x')[0]);
  const COLS = parseInt(configuration.dificultad.split('x')[1]);
  const MINES = parseInt(configuration.dificultad.split('x')[2]);

  let squares = [];
  let isGameOver = false;
	
	function createBoard() {
    const minesArray = Array(MINES).fill('mine');
    const emptyArray = Array(ROWS * COLS - MINES).fill('valid');
    const gameArray = emptyArray.concat(minesArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < ROWS * COLS; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i]);
      square.classList.add('square');
      gameboard.appendChild(square);
      squares.push(square);

      square.addEventListener('click', function(e) {
        click(square);
      });

      square.oncontextmenu = function(e) {
        e.preventDefault();
        addFlag(square);
      }
    }
		
		for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % COLS === 0;
      const isRightEdge = i % COLS === COLS - 1;

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('mine')) total++;
        if (i > ROWS-1 && !isRightEdge && squares[i + 1 - ROWS].classList.contains('mine')) total++;
        if (i > ROWS && squares[i - ROWS].classList.contains('mine')) total++;
        if (i > ROWS+1 && !isLeftEdge && squares[i - 1 - ROWS].classList.contains('mine')) total++;
        if (i < ((ROWS*COLS-1)-1) && !isRightEdge && squares[i + 1].classList.contains('mine')) total++;
        if (i < ((ROWS*COLS-1)-ROWS+1) && !isLeftEdge && squares[i - 1 + ROWS].classList.contains('mine')) total++;
        if (i < ((ROWS*COLS-1)-ROWS-1) && !isRightEdge && squares[i + 1 + ROWS].classList.contains('mine')) total++;
        if (i < ((ROWS*COLS-1)-ROWS) && squares[i + ROWS].classList.contains('mine')) total++;
        squares[i].setAttribute('data', total);
      }
    }
  }

  createBoard();
	
	function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('clicked') && (document.querySelectorAll('.flag').length < MINES)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = ' '+configuration.iconoBandera+' ';
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
      }
    }
    checkForWin();
  }
	
	function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (square.classList.contains('clicked') || square.classList.contains('flag')) return;
    if (square.classList.contains('mine')) {
      gameOver(square);
    } else {
      let total = square.getAttribute('data');
      if (total != 0) {
        square.classList.add('clicked');
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add('clicked');
  }
	
	function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % COLS === 0);
    const isRightEdge = (currentId % COLS === COLS - 1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > ROWS-1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - ROWS].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > ROWS) {
        const newId = squares[parseInt(currentId) - ROWS].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > ROWS+1 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - ROWS].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < ((ROWS*COLS-1)-1) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < ((ROWS*COLS-1)-ROWS+1) && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + ROWS].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < ((ROWS*COLS-1)-ROWS-1) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + ROWS].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < ((ROWS*COLS-1)-ROWS)) {
        const newId = squares[parseInt(currentId) + ROWS].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10)
  }

	function gameOver(square) {
    console.log('BOOM! Game Over!');
    isGameOver = true;

    squares.forEach(square => {
      if (square.classList.contains('mine')) {
        square.innerHTML = configuration.iconoMina;
        square.classList.add("boomed");
      }
    })

    setTimeout(() => {
      alert('BOOM! Game Over!');
      reset();
    }, 500);
  }
	
	function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('mine')) {
        matches++;
      }
      if (matches === MINES) {
        console.log('You Win!');
        isGameOver = true;

        setTimeout(() => {
          alert('You Win!');
          reset();
        }, 500);
      }
    }
  }
	
	function reset() {
    gameboard.innerHTML = '';
    squares = [];
    isGameOver = false;
    createBoard();
  }

  resetBtn.addEventListener('click', reset);