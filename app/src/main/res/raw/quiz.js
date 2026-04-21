// quiz_app.js — simple version for teaching

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
  app.style.width = "min(92vw, 380px)";
  app.style.display = "flex";
  app.style.flexDirection = "column";
  app.style.gap = "12px";
  app.style.textAlign = "center";
  screen.appendChild(app);

  const title = document.createElement("h2");
  title.textContent = "Quiz App";
  title.style.margin = "0";
  app.appendChild(title);

  const questionText = document.createElement("div");
  questionText.style.color = "#9bb1ff";
  app.appendChild(questionText);

  const scoreText = document.createElement("div");
  scoreText.style.color = "#25b1ff";
  app.appendChild(scoreText);

  const answers = document.createElement("div");
  answers.style.display = "flex";
  answers.style.flexDirection = "column";
  answers.style.gap = "10px";
  app.appendChild(answers);

  const message = document.createElement("div");
  message.style.minHeight = "24px";
  app.appendChild(message);

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.style.padding = "10px 14px";
  nextBtn.style.borderRadius = "10px";
  nextBtn.style.border = "1px solid #2b2f3a";
  nextBtn.style.background = "#151a24";
  nextBtn.style.color = "white";
  app.appendChild(nextBtn);

  const questions = [
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyper Transfer Main Language"],
      answer: 0
    },
    {
      question: "Which one is a loop?",
      options: ["if", "for", "color"],
      answer: 1
    },
    {
      question: "Which symbol is used for assignment in JavaScript?",
      options: ["=", "==", "!="],
      answer: 0
    }
  ];

  let index = 0;
  let score = 0;
  let answered = false;

  function drawQuestion() {
    const q = questions[index];
    questionText.textContent = q.question;
    scoreText.textContent = "Score: " + score;
    message.textContent = "";
    answers.innerHTML = "";
    answered = false;

    for (let i = 0; i < q.options.length; i++) {
      const button = document.createElement("button");
      button.textContent = q.options[i];
      button.style.padding = "12px";
      button.style.borderRadius = "10px";
      button.style.border = "1px solid #2b2f3a";
      button.style.background = "#151a24";
      button.style.color = "white";

      button.addEventListener("click", function () {
        checkAnswer(i);
      });

      answers.appendChild(button);
    }
  }

  function checkAnswer(optionIndex) {
    if (answered) return;
    answered = true;

    if (optionIndex === questions[index].answer) {
      score++;
      message.textContent = "Correct";
    } else {
      message.textContent = "Wrong";
    }

    scoreText.textContent = "Score: " + score;
  }

  function nextQuestion() {
    index++;

    if (index >= questions.length) {
      questionText.textContent = "Quiz finished";
      answers.innerHTML = "";
      message.textContent = "Final score: " + score + " / " + questions.length;
      nextBtn.textContent = "Restart";
      index = questions.length;
      return;
    }

    drawQuestion();
  }

  nextBtn.addEventListener("click", function () {
    if (index >= questions.length) {
      index = 0;
      score = 0;
      nextBtn.textContent = "Next";
      drawQuestion();
    } else {
      nextQuestion();
    }
  });

  drawQuestion();
})();