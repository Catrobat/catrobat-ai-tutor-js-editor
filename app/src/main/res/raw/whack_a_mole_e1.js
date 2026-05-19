
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
  app.style.width = "min(90vw, 340px)";
  app.style.display = "flex";
  app.style.flexDirection = "column";
  app.style.alignItems = "center";
  app.style.gap = "10px";
  screen.appendChild(app);

  // ---------- Title ----------
  const title = document.createElement("h2");
  title.textContent = "Whack-a-Mole";
  title.style.margin = "0";
  app.appendChild(title);

  const info = document.createElement("div");
  info.style.color = "#9bb1ff";
  app.appendChild(info);

  const stats = document.createElement("div");
  stats.style.display = "flex";
  stats.style.gap = "16px";
  app.appendChild(stats);

  const scoreText = document.createElement("div");
  scoreText.style.color = "#25b1ff";

  const timeText = document.createElement("div");
  timeText.style.color = "#ffd54f";

  stats.appendChild(scoreText);
  stats.appendChild(timeText);

  // ---------- Grid ----------
  const grid = document.createElement("div");
  grid.style.width = "100%";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3, 1fr)";
  grid.style.gap = "10px";
  app.appendChild(grid);

  const holes = [];

  for (let i = 0; i < 9; i++) {
    const hole = document.createElement("div");
    hole.style.aspectRatio = "1";
    hole.style.background = "#0b0e14";
    hole.style.borderRadius = "12px";
    hole.style.display = "flex";
    hole.style.justifyContent = "center";
    hole.style.alignItems = "center";
    hole.style.fontSize = "36px";
    hole.style.cursor = "pointer";
    hole.style.userSelect = "none";
    grid.appendChild(hole);
    holes.push(hole);
  }

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
  let score = 0;
  let time = 30;
  let mole = -1;
  let gameOver = false;

  let gameTimer;
  let moleTimer;
  let hideTimer;

  // ---------- Functions ----------
  function draw() {
    scoreText.textContent = "Score: " + score;
    timeText.textContent = "Time: " + time + "s";

    for (let i = 0; i < hole.length; i++) {
      holes[i].textContent = i === mole ? "🐹" : "";
    }
  }

  function showMole() {
    if (gameOver) return;

    mole = Math.floor(Math.random() * holes.length);
    draw();

    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      mole = -1;
      draw();
    }, 700);
  }

  function stopGame() {
    clearInterval(gameTimer);
    clearInterval(moleTimer);
    clearTimeout(hideTimer);
  }

  function startGame() {
    stopGame();

    score = 0;
    time = 30;
    mole = -1;
    gameOver = false;

    info.textContent = "Click the mole!";
    draw();

    gameTimer = setInterval(function () {
      time--;
      draw();

      if (time <= 0) {
        gameOver = true;
        info.textContent = "Time's up! Final score: " + score;
        stopGame();
      }
    }, 1000);

    showMoles();
    moleTimer = setInterval(showMole, 900);
  }

  // ---------- Events ----------
  for (let i = 0; i < holes.length; i++) {
    holes[i].addEventListener("click", function () {
      if (gameOver) return;

      if (i === mole) {
        score++;
        mole = -1;
        draw();
      }
    });
  }

  button.addEventListener("click", startGame);

  // ---------- Start ----------
  startGame();
})();