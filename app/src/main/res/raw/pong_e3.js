// pong.js — simple touch version

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 12;
const MARGIN = 24;

const WIN_SCORE = 5;

let playerPaddle, cpuPaddle, ball;
let scoreText, messageText;

let playerScore = 0;
let cpuScore = 0;
let gameOver = false;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#070b14",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: { create, update },
  banner: false
});

function create() {
  // Create the two paddles and the ball as rectangles
  playerPaddle = this.add.rectangle(MARGIN, GAME_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, 0x29b6ff);
  cpuPaddle = this.add.rectangle(GAME_WIDTH - MARGIN, GAME_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, 0x29b6ff);
  ball = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, BALL_SIZE, BALL_SIZE, 0xffd54f);

  // Add physics to them
  this.physics.add.existing(playerPaddle);
  this.physics.add.existing(cpuPaddle);
  this.physics.add.existing(ball);

  playerPaddle.body.setImmovable(true);
  playerPaddle.body.setAllowGravity(false);
  playerPaddle.body.setCollideWorldBounds(true);

  cpuPaddle.body.setImmovable(true);
  cpuPaddle.body.setAllowGravity(false);
  cpuPaddle.body.setCollideWorldBounds(true);

  ball.body.setAllowGravity(false);
  ball.body.setBounce(1, 1);
  ball.body.setCollideWorldBounds(true);

  // The ball only bounces on the top and bottom walls
  this.physics.world.setBoundsCollision(false, false, true, true);

  // Ball collisions with paddles
  this.physics.add.collider(ball, playerPaddle, bounceBall);
  this.physics.add.collider(ball, cpuPaddle, bounceBall);

  // Score text
  scoreText = this.add.text(GAME_WIDTH / 2, 18, "0 : 0", {
    fontFamily: "monospace",
    fontSize: "24px",
    color: "#ffffff"
  }).setOrigin(0.5, 0);

  // Message text
  messageText = this.add.text(GAME_WIDTH / 2, 50, "Tap to start", {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#9bb1ff",
    align: "center"
  }).setOrigin(0.5, 0);

  // Touch controls
  this.input.on("pointerdown", onTouch);

  this.input.on("pointermove", function (pointer) {
    if (pointer.isDown) {
      movePlayer(pointer);
    }
  });

  resetGame();
}

function update() {
  // Stop here if the game is over or the ball is not moving
  if (gameOver || ball.body.velocity.x === 0) return;

  moveCPU();

  // Prevent the ball from moving almost vertically forever
  if (Math.abs(ball.body.velocity.x) < 120) {
    if (ball.body.velocity.x < 0) {
      ball.body.setVelocityX(-120);
    } else {
      ball.body.setVelocityX(120);
    }
  }

  // Check if someone scored
  if (ball.x < -BALL_SIZE) givePoint("cpu");
  if (ball.x > GAME_WIDTH + BALL_SIZE) givePoint("player");
}

function onTouch(pointer) {
  movePlayer(pointer);

  if (gameOver) {
    resetGame();
    launchBall();
  } else if (ball.body.velocity.x === 0) {
    launchBall();
  }
}

function movePlayer(pointer) {
  playerPaddle.y = Phaser.Math.Clamp(
    pointer.y,
    PADDLE_HEIGHT / 2,
    GAME_HEIGHT - PADDLE_HEIGHT / 2
  );
}

// This is the only "special" part: the computer paddle
// You can explain it very briefly if you want
function moveCPU() {
  if (ball.body.velocity.x > 0) {
    const targetY = ball.y + Phaser.Math.Between(-30, 30);
    cpuPaddle.y += Phaser.Math.Clamp(targetY - cpuPaddle.y, -2, 2);
  }

  cpuPaddle.y = Phaser.Math.Clamp(
    cpuPaddle.y,
    PADDLE_HEIGHT / 2,
    GAME_HEIGHT - PADDLE_HEIGHT / 2
  );
}

function launchBall() {
  messageText.setText("Drag to move");

  ball.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2);

  const speedX = Phaser.Math.Between(0, 1) ? 220 : -220;
  const speedY = Phaser.Math.Between(-160, 160);

  ball.body.setVelocity(speedX, speedY);
}

function bounceBall(ball, paddle) {
  // The ball angle depends on where it hits the paddle
  const hitPosition = (ball.y - paddle.y) / (PADDLE_HEIGHT / 2);

  const newSpeedY = Phaser.Math.Clamp(hitPosition * 220, -220, 220);
  const directionX = ball.x < GAME_WIDTH / 2 ? -1 : 1;
  const newSpeedX = directionX * Math.max(180, Math.abs(ball.body.velocity.x));

  ball.body.setVelocity(newSpeedX, newSpeedY);
}

function givePoint(who) {
  if (who === "player") {
    playerScore++;
  } else {
    cpuScore++;
  }

  scoreText.setText(`${playerScore} : ${cpuScore}`);

  ball.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2);
  ball.body.setVelocity(0, 0);

  if (playerScore >= WIN_SCORE || cpuScore >= WIN_SCORE) {
    gameOver = true;

    if (playerScore > cpuScore) {
      messageText.setText("You win\nTap to restart");
    } else {
      messageText.setText("You lose\nTap to restart");
    }
  } else {
    messageText.setText("Tap to continue");
  }
}

function resetGame() {
  playerScore = 0;
  cpuScore = 0;
  gameOver = false;

  scoreText.setText("0 : 0");
  messageText.setText("Tap to start");

  playerPaddle.setPosition(MARGIN, GAME_HEIGHT / 2);
  cpuPaddle.setPosition(GAME_WIDTH - MARGIN, GAME_HEIGHT / 2);
  ball.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2);

  playerPaddle.body.setVelocity(0, 0);
  cpuPaddle.body.setVelocity(0, 0);
  ball.body.setVelocity(0, 0);
}