(function () {
  // ---------- Page ----------
  document.body.innerHTML = "";
  document.body.style.margin = "0";
  document.body.style.background = "#10131a";
  document.body.style.color = "white";
  document.body.style.fontFamily = "monospace";
  document.body.style.overflow = "hidden";

  const screen = document.createElement("div");
  screen.style.position = "fixed";
  screen.style.inset = "0";
  screen.style.display = "flex";
  screen.style.justifyContent = "center";
  screen.style.alignItems = "center";
  document.body.appendChild(screen);

  const app = document.createElement("div");
  app.style.width = "min(92vw, 360px)";
  app.style.display = "flex";
  app.style.flexDirection = "column";
  app.style.alignItems = "center";
  app.style.gap = "12px";
  app.style.textAlign = "center";
  screen.appendChild(app);

  // ---------- Title ----------
  const title = document.createElement("h2");
  title.textContent = "Tic-Tac-Toe";
  title.style.margin = "0";
  app.appendChild(title);

  const info = document.createElement("div");
  info.style.color = "#9bb1ff";
  app.appendChild(info);

  // ---------- Grid ----------
  const grid = document.createElement("div");
  grid.style.width = "100%";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3, 1fr)";
  grid.style.gap = "10px";
  app.appendChild(grid);

  // ---------- Button ----------
  const button = document.createElement("button");
  button.textContent = "New Game";
  button.style.padding = "10px 14px";
  button.style.borderRadius = "10px";
  button.style.border = "1px solid #2b2f3a";
  button.style.background = "#151a24";
  button.style.color = "white";
  app.appendChild(button);

  // ---------- Game state ----------
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameOver = false;
  let cells = [];

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // ---------- Functions ----------
  function drawBoard() {
    grid.innerHTML = "";
    cells = [];

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("button");
      cell.textContent = board[i];
      cell.style.aspectRatio = "1";
      cell.style.border = "1px solid #2b2f3a";
      cell.style.borderRadius = "12px";
      cell.style.background = "#151a24";
      cell.style.color = "white";
      cell.style.fontSize = "32px";
      cell.style.cursor = "pointer";

      cell.addEventListener("click", function () {
        playTurn(i);
      });

      grid.appendChild(cell);
      cells.push(cell);
    }
  }

  function checkWinner() {
    for (let i = 0; i < winningLines.length; i++) {
      const a = winningLines[i][0];
      const b = winningLines[i][1];
      const c = winningLines[i][2];

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return "";
  }

  function isBoardFull() {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") return false;
    }
    return true;
  }

  function playTurn(index) {
    if (gameOver) return;
    board[index] = currentPlayer;
    drawBoard();

    const winner = checkWinner();

    if (winner) {
      info.textContent = winner + " wins!";
      gameOver = true;
      return;
    }

    if (isBoardFull()) {
      info.textContent = "Draw!";
      gameOver = true;
      return;
    }

    if (currentPlayer === "X") {
      currentPlayer = "O";
    } else {
      currentPlayer = "X";
    }

    info.textContent = "Turn: " + currentPlayer;
  }

  function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    info.textContent = "Turn: X";
    drawBoard();
  }

  // ---------- Events ----------
  button.addEventListener("click", startGame);

  // ---------- Start ----------
  startGame();
})();