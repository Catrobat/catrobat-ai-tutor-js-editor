
(function () {
  // ----- Basic styling -----
  document.body.style.margin = "0";
  document.body.style.fontFamily = "monospace";
  document.body.style.background = "#10131a";
  document.body.style.color = "#ffffff";

  const app = document.createElement("div");
  app.style.maxWidth = "720px";
  app.style.margin = "0 auto";
  app.style.padding = "24px";
  document.body.appendChild(app);

  const title = document.createElement("h2");
  title.textContent = "Guess the Number";
  app.appendChild(title);

  const subtitle = document.createElement("div");
  subtitle.textContent = "I'm thinking of a number between 1 and 100.";
  subtitle.style.color = "#9bb1ff";
  subtitle.style.marginBottom = "16px";
  app.appendChild(subtitle);

  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.gap = "10px";
  row.style.marginBottom = "12px";
  app.appendChild(row);

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Your guess";
  input.style.padding = "8px 10px";
  input.style.fontSize = "16px";
  input.style.borderRadius = "10px";
  input.style.border = "1px solid #2b2f3a";
  input.style.background = "#0b0e14";
  input.style.color = "#ffffff";
  row.appendChild(input);

  const guessBtn = document.createElement("button");
  guessBtn.textContent = "Guess";
  row.appendChild(guessBtn);

  const newBtn = document.createElement("button");
  newBtn.textContent = "New Game";
  row.appendChild(newBtn);

  [guessBtn, newBtn].forEach(b => {
    b.style.padding = "8px 12px";
    b.style.fontSize = "16px";
    b.style.borderRadius = "10px";
    b.style.border = "1px solid #2b2f3a";
    b.style.background = "#151a24";
    b.style.color = "#ffffff";
    b.style.cursor = "pointer";
  });

  const info = document.createElement("div");
  info.style.marginTop = "12px";
  info.style.minHeight = "22px";
  info.style.color = "#ffd54f";
  app.appendChild(info);

  const stats = document.createElement("div");
  stats.style.marginTop = "8px";
  stats.style.color = "#25b1ff";
  app.appendChild(stats);

  //  Game state
  let secret;
  let attempts;
  let finished;

  function pickNumber() {
    // integer in [1, 100]
    return Math.floor(Math.random() * 100) + 1;
  }

  function reset() {
    secret = pickNumber();
    attempts = 0;
    finished = false;
    info.textContent = "Make a guess!";
    stats.textContent = "Attempts: 0";
    input.value = "";
    input.focus();
  }

  function guess() {
    if (finished) return;

    const value = Number(input.value);

    if (!Number.isInteger(value)) {
      info.textContent = "Please enter a valid number.";
      return;
    }
    if (value < 1 || value > 100) {
      info.textContent = "Number must be between 1 and 100.";
      return;
    }

    attempts += 1;
    statss.textContent = `Attempts: ${attempts}`;

    if (value === secret) {
      info.textContent = `🎉 Correct! The number was ${secret}.`;
      finished = true;
    } else if (value < secret) {
      info.textContent = "Too low!";
    } else {
      info.textContent = "Too high!";
    }

    input.value = "";
    input.focus();
  }

  // Events
  guessBtn.addEventListener("click", guess);
  newBtn.addEventListener("click", reset);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") guess();
  });

  // Start
  reset();
})();
