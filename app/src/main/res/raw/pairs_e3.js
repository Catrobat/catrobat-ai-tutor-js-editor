// memory_pairs.js — simple version for teaching

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
  title.textContent = "Memory Pairs";
  title.style.margin = "0";
  app.appendChild(title);

  const info = document.createElement("div");
  info.style.color = "#9bb1ff";
  app.appendChild(info);

  const movesText = document.createElement("div");
  movesText.style.color = "#25b1ff";
  app.appendChild(movesText);

  // ---------- Grid ----------
  const grid = document.createElement("div");
  grid.style.width = "100%";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(4, 1fr)";
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
  const symbols = ["🍎", "🍌", "🍇", "🍒", "🍋", "🥝", "🍉", "🍓"];
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let pairsFound = 0;

  // ---------- Functions ----------
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function draw() {
    movesText.textContent = "Moves: " + moves;
  }

  function createCards() {
    grid.innerHTML = "";
    cards = [];

    const values = [...symbols, ...symbols];
    shuffle(values);

    for (let i = 0; i < values.length; i++) {
      const card = document.createElement("button");
      card.textContent = "?";
      card.dataset.value = values[i];
      card.dataset.open = "false";
      card.dataset.matched = "false";

      card.style.aspectRatio = "1";
      card.style.border = "1px solid #2b2f3a";
      card.style.borderRadius = "12px";
      card.style.background = "#151a24";
      card.style.color = "white";
      card.style.fontSize = "28px";
      card.style.cursor = "pointer";

      card.addEventListener("click", function () {
        flipCard(card);
      });

      grid.appendChild(card);
      cards.push(card);
    }
  }

  function openCard(card) {
    card.textContent = card.dataset.value;
    card.dataset.open = "true";
    card.style.background = "#0b0e14";
  }

  function closeCard(card) {
    card.textContent = "?";
    card.dataset.open = "false";
    card.style.background = "#151a24";
  }

  function markAsMatched(card) {
    card.dataset.matched = "true";
    card.style.background = "#1f3a2a";
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card.dataset.open === "true") return;
    if (card.dataset.matched === "true") return;

    openCard(card);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    draw();

    if (firstCard === secondCard) {
      markAsMatched(firstCard);
      markAsMatched(secondCard);

      firstCard = null;
      secondCard = null;
      pairsFound++;

      if (pairsFound === symbols.length) {
        info.textContent = "You won!";
      }
    } else {
      lockBoard = true;

      setTimeout(function () {
        closeCard(firstCard);
        closeCard(secondCard);

        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 700);
    }
  }

  function startGame() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    pairsFound = 0;

    info.textContent = "Find all the pairs";
    draw();
    createCards();
  }

  // ---------- Events ----------
  button.addEventListener("click", startGame);

  // ---------- Start ----------
  startGame();
})();