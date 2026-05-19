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
  app.style.width = "min(92vw, 340px)";
  app.style.display = "flex";
  app.style.flexDirection = "column";
  app.style.alignItems = "center";
  app.style.gap = "12px";
  app.style.textAlign = "center";
  screen.appendChild(app);

  // ---------- Title ----------
  const title = document.createElement("h2");
  title.textContent = "Rock • Paper • Scissors";
  title.style.margin = "0";
  app.appendChild(title);

  const subtitle = document.createElement("div");
  subtitle.textContent = "First to 5 wins";
  subtitle.style.color = "#9bb1ff";
  app.appendChild(subtitle);

  // ---------- Score ----------
  const scoreText = document.createElement("div");
  scoreText.style.color = "#25b1ff";
  app.appendChild(scoreText);

  const roundText = document.createElement("div");
  roundText.style.color = "#ffd54f";
  app.appendChild(roundText);

  const message = document.createElement("div");
  message.style.color = "#9bb1ff";
  message.style.minHeight = "42px";
  app.appendChild(message);

  // ---------- Buttons ----------
  const buttons = document.createElement("div");
  buttons.style.display = "grid";
  buttons.style.gridTemplateColumns = "1fr 1fr";
  buttons.style.gap = "10px";
  buttons.style.width = "100%";
  app.appendChild(buttons);

  function makeButton(text, value) {
    const button = document.createElement("button");
    button.textContent = text;
    button.dataset.move = value;
    button.style.padding = "12px";
    button.style.fontSize = "16px";
    button.style.borderRadius = "10px";
    button.style.border = "1px solid #2b2f3a";
    button.style.background = "#151a24";
    button.style.color = "white";
    return button;
  }

  buttons.appendChild(makeButton("🪨 Rock", "rock"));
  buttons.appendChild(makeButton("📄 Paper", "paper"));
  buttons.appendChild(makeButton("✂️ Scissors", "scissors"));
  buttons.appendChild(makeButton("Reset", "reset"));

  // ---------- History ----------
  const history = document.createElement("div");
  history.style.width = "100%";
  history.style.background = "#0b0e14";
  history.style.borderRadius = "10px";
  history.style.padding = "10px";
  history.style.boxSizing = "border-box";
  history.style.fontSize = "13px";
  history.style.minHeight = "110px";
  history.style.whiteSpace = "pre-line";
  app.appendChild(history);

  // ---------- Game state ----------
  const moves = ["rock", "paper", "scissors"];
  const emoji = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
  };

  let playerScore = 0;
  let cpuScore = 0;
  let round = 0;
  let finished = false;
  let log = [];

  function getCpuMove() {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  function getResult(player, cpu) {
    if (player === cpu) return "draw";

    if (
      (player === "rock" && cpu === "scissors") ||
      (player === "paper" && cpu === "rock") ||
      (player === "scissors" && cpu === "paper")
    ) {
      return "win";
    }

    return "lose";
  }

  function draw() {
    scoreText.textContent = `You: ${playerScore}   CPU: ${cpuScore}`;
    roundText.textContent = `Round: ${round}`;
    history.textContent = log.length ? log.join("\n") : "History is empty";
  }

  function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    round = 0;
    finished = false;
    log = log;
    message.textContent = "Choose Rock, Paper or Scissors";
    draw();
  }

  function playRound(playerMove) {
    if (finished) return;

    const cpuMove = getCpuMove();
    const result = getResult(playerMove, cpuMove);

    round++;

    if (result === "win") playerScore++;
    if (result === "lose") cpuScore++;

    if (result === "win") {
      message.textContent = `${emoji[playerMove]} vs ${emoji[cpuMove]} — You win`;
    } else if (result === "lose") {
      message.textContent = `${emoji[playerMove]} vs ${emoji[cpuMove]} — You lose`;
    } else {
      message.textContent = `${emoji[playerMove]} vs ${emoji[cpuMove]} — Draw`;
    }

    log.unshift(
      `#${round}  You: ${playerMove} ${emoji[playerMove]} | CPU: ${cpuMove} ${emoji[cpuMove]}`
    );

    if (playerScore === 5 || cpuScore === 5) {
      finished = true;
      message.textContent += playerScore === 5 ? " — You reached 5 first" : " — CPU reached 5 first";
    }

    draw();
  }

  // ---------- Events ----------
  buttons.addEventListener("click", function (e) {
    const button = e.target.closest("button");
    if (!button) return;

    const move = button.dataset.move;

    if (move === "reset") {
      resetGame();
    } else {
      playRound(move);
    }
  });

  resetGame();
})();