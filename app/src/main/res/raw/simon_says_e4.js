(function () {
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

  const title = document.createElement("h2");
  title.textContent = "Simon Says";
  title.style.margin = "0";
  app.appendChild(title);

  const info = document.createElement("div");
  info.style.color = "#9bb1ff";
  app.appendChild(info);

  const score = document.createElement("div");
  score.style.color = "#25b1ff";
  app.appendChild(score);

  const grid = document.createElement("div");
  grid.style.width = "100%";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr 1fr";
  grid.style.gap = "10px";
  app.appendChild(grid);

  const startBtn = document.createElement("button");
  startBtn.textContent = "Start";
  startBtn.style.padding = "10px 14px";
  startBtn.style.borderRadius = "10px";
  startBtn.style.border = "1px solid #2b2f3a";
  startBtn.style.background = "#151a24";
  startBtn.style.color = "white";
  app.appendChild(startBtn);

  const colors = [
    { name: "red", base: "#b33939", glow: "#ff6b6b" },
    { name: "green", base: "#218c54", glow: "#4cd137" },
    { name: "blue", base: "#227093", glow: "#34ace0" },
    { name: "yellow", base: "#bfa12a", glow: "#ffd32a" }
  ];

  const buttons = [];
  let sequence = [];
  let playerIndex = 0;
  let level = 0;
  let playingSequence = false;
  let gameOver = false;

  function draw() {
    score.textContent = "Level: " + level;
  }

  function makeColorButton(color, index) {
    const button = document.createElement("button");
    button.style.aspectRatio = "1";
    button.style.border = "none";
    button.style.borderRadius = "16px";
    button.style.background = color.base;
    button.style.cursor = "pointer";

    button.addEventListener("click", function () {
      playerClick(index);
    });

    grid.appendChild(button);
    buttons.push(button);
  }

  function flash(index) {
    buttons[index].style.background = colors[index].glow;
    setTimeout(function () {
      buttons[index].style.background = colors[index].base;
    }, 350);
  }

  function nextRound() {
    level++;
    sequence.push(Math.floor(Math.random() * 4));
    draw();
    info.textContent = "Watch the sequence";
    playSequence();
  }

  function playSequence() {
    playingSequence = true;

    let i = 0;
    const timer = setInterval(function () {
      flash(sequence[i]);
      i++;

      if (i >= sequence.length) {
        clearInterval(timer);
        playingSequence = false;
        info.textContent = "Your turn";
      }
    }, 700);
  }

  function playerClick(index) {
    if (playingSequence || gameOver) return;

    flash(index);

    if (index !== sequence[playerIndex]) {
      info.textContent = "Game over";
      gameOver = true;
      return;
    }

    playerIndex++;

    if (playerIndex === sequence.length) {
      info.textContent = "Good!";
      setTimeout(nextRound, 800);
    }
  }

  function startGame() {
    sequence = [];
    playerIndex = 0;
    level = 0;
    playingSequence = false;
    gameOver = false;
    info.textContent = "Get ready";
    draw();
    setTimeout(nextRound, 500);
  }

  for (let i = 0; i < colors.length; i++) {
    makeColorButton(colors[i], i);
  }

  startBtn.addEventListener("click", startGame);

  info.textContent = "Press Start";
  draw();
})();