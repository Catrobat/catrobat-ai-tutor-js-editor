const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 360,
    height: 640,
    backgroundColor: "#10131a",
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
    scene: {
        preload,
        create,
        update
    },
    banner: false
};

let player;
let coins;
let scoreText;
let score = 0;
let target = null;

new Phaser.Game(config);

function preload() {}

function create() {
    function makeCircleTexture(key, radius, color) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(color, 1);
        g.fillCircle(radius, radius, radius);
        g.generateTexture(key, radius * 2, radius * 2);
        g.destroy();
    }

    makeCircleTexture.call(this, "player", 18, 0x25b1ff);
    makeCircleTexture.call(this, "coin", 10, 0xffd54f);

    player = this.physics.add.image(180, 320, "player");
    player.setCircle(18);
    player.setCollideWorldBounds(true);

    coins = this.physics.add.group();

    for (let i = 0; i < 8; i++) {
        const coin = coins.create(
            Phaser.Math.Between(30, 330),
            Phaser.Math.Between(80, 600),
            "coin"
        );

        coin.setCircle(10);
        coin.setBounce(1);
        coin.setVelocity(
            Phaser.Math.Between(-120, 120),
            Phaser.Math.Between(-120, 120)
        );
        coin.setCollideWorldBounds(true);
    }

    this.physics.add.overlap(player, coins, collectCoin, null, this);

    this.input.on("pointerdown", function (pointer) {
        target = { x: pointer.x, y: pointer.y };
    });

    this.input.on("pointermove", function (pointer) {
        if (pointer.isDown) {
            target = { x: pointer.x, y: pointer.y };
        }
    });

    this.input.on("pointerup", function () {
        target = null;
        player.setVelocity(0, 0);
    });

    scoreText = this.add.text(16, 16, "Score: 0", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ffffff"
    });

    this.add.text(16, 46, "Touch and hold to move", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#9bb1ff"
    });
}

function update() {
    const speed = 220;
    player.setVelocity(0);

    if (target) {
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            player.setVelocity((dx / distance) * speed, (dy / distance) * speed);
        }
    }
}

function collectCoin(player, coin) {
    score += 10;
    scoreText.setText("Score: " + score);

    this.time.delayedCall(600, () => {
        const x = Phaser.Math.Between(30, 330);
        const y = Phaser.Math.Between(80, 600);

        coin.enableBody(true, x, y, true, true);
        coin.setVelocity(
            Phaser.Math.Between(-120, 120),
            Phaser.Math.Between(-120, 120)
        );
        coin.setCollideWorldBounds(true);
    });
}