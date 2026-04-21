
const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;
const CELL_SIZE = 20;

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#10131a",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: { preload, create, update },
  banner: false
};

new Phaser.Game(config);

let cols, rows;
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };

let score = 0;
let scoreText;
let infoText;
let gameOverText;
let graphics;

let moveTimer = 0;
let moveDelay = 140;
let gameOver = false;

// touch
let touchStartX = 0;
let touchStartY = 0;

function preload() {}

function create() {
  graphics = this.add.graphics();

  cols = Math.floor(GAME_WIDTH / CELL_SIZE);
  rows = Math.floor(GAME_HEIGHT / CELL_SIZE);

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontFamily: "monospace",
    fontSize: "22px",
    color: "#ffffff"
  });

  infoText = this.add.text(16, 46, "Swipe to move", {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#9bb1ff"
  });

  this.input.on("pointerdown", function (pointer) {
    touchStartX = pointer.x;
    touchStartY = pointer.y;
  });

  this.input.on("pointerup", function (pointer) {
    const dx = pointer.x - touchStartX;
    const dy = pointer.y - touchStartY;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) changeDirection(-1, 0);
      else changeDirection(1, 0);
    } else {
      if (dy > 0) changeDirection(0, 1);
      else changeDirection(0, -1);
    }
  });

  resetGame.call(this);
}

function update(time, delta) {
  if (gameOver) return;

  moveTimer += delta;

  if (moveTimer >= moveDelay) {
    moveTimer = 0;
    step.call(this);
  }

  draw();
}

function changeDirection(x, y) {
  if (x === -direction.x && y === -direction.y) return;
  nextDirection = { x, y };
}

function step() {
  direction = nextDirection;

  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  // wall collision
  if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
    showGameOver.call(this);
    return;
  }

  // self collision
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
      showGameOver.call(this);
      return;
    }
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;
    scoreText.setText("Score: " + score);
    food = spawnFood();
    moveDelay = Math.max(90, moveDelay - 3);
  } else {
    snake.pop();
  }
}

function draw() {
  graphics.clear();

  // food
  graphics.fillStyle(0xffd54f, 1);
  graphics.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

  // snake
  for (let i = 0; i < snake.length; i++) {
    const part = snake[i];
    const color = i === 0 ? 0x25b1ff : 0x2b6cff;
    graphics.fillStyle(color, 1);
    graphics.fillRect(part.x * CELL_SIZE, part.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  if (gameOver) {
    graphics.fillStyle(0x000000, 0.55);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
}

function resetGame() {
  if (gameOverText) {
    gameOverText.destroy();
    gameOverText = null;
  }

  snake = [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 }
  ];

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };

  score = 0;
  scoreText.setText("Score: 0");

  moveTimer = 0;
  moveDelay = 140;
  gameOver = false;

  food = spawnFood();
  draw();
}

function showGameOver() {
  gameOver = true;

  gameOverText = this.add.text(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    "GAME OVER\nTap to restart",
    {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ffffff",
      align: "center"
    }
  ).setOrigin(0.5);

  this.input.once("pointerdown", () => {
    resetGame.call(this);
  });
}

function spawnFood() {
  let position;

  do {
    position = {
      x: Phaser.Math.Between(0, cols - 1),
      y: Phaser.Math.Between(3, rows - 1)
    };
  } while (snake.some(part => part.x === position.x && part.y === position.y));

  return position;
}