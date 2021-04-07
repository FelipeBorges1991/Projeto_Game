const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const intro = document.querySelector(".game-intro");
const board = document.getElementById("game-board");

const crashSound = new Audio();
crashSound.src = "./Sounds/Avada_kedrava.wav.wav";
crashSound.volume = 0.1;

const introSound = new Audio();
introSound.src = "./Sounds/01. John Williams - Prologue.mp3";
crashSound.volume = 0.1;

const voldemort = new Image();
voldemort.src = "./Images/Voldemort-removebg-preview.png";

class GameObj {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.speedY = 0;
    this.speedX = 0;
  }

  updatePosition() {
    this.x += this.speedX;

    if (this.y <= this.height - 90) {
      this.y = this.height - 90;
    }

    if (this.y >= canvas.height - (this.height + 110)) {
      this.y = canvas.height - (this.height + 110);
    }

    this.y += this.speedY;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

class Obstacle extends GameObj {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedX = -6;
  }

  updatePosition() {
    this.x += this.speedX;
  }
}

class BackgroundImage extends GameObj {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedX = -2;
  }

  updatePosition() {
    this.x += this.speedX;
    this.x %= canvas.width;
  }

  draw() {
    ctx.drawImage(this.img, this.x, 0, this.width, this.height);
    ctx.drawImage(
      this.img,
      this.x + canvas.width,
      this.y,
      this.width,
      this.height
    );
  }
}

class Game {
  constructor(background, player) {
    this.background = background;
    this.player = player;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.animationId;
  }

  start = () => {
    this.updateGame();
  };

  updateGame = () => {
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition();
    this.player.draw();

    this.updateObstacles();

    this.updateScore();

    this.animationId = requestAnimationFrame(this.updateGame);

    this.checkGameOver();
  };

  updateObstacles = () => {
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) {
      if (this.frames > 0 && this.frames < 1500) {
        this.obstacles[i].speedX = -6;
      }
      if (this.frames > 1500 && this.frames < 2500) {
        this.obstacles[i].speedX = -10;
      }
      if (this.frames > 2500) {
        this.obstacles[i].speedX = -12;
      }
      this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
    }

    if (this.frames % 120 === 0) {
      const obstacle = new Obstacle(
        800,
        Math.floor(Math.random() * 500),
        80,
        109,
        voldemort
      );

      this.obstacles.push(obstacle);

      this.score++;
    }
  };

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      return this.player.crashWith(obstacle);
    });

    if (crashed) {
      introSound.pause();
      crashSound.play();

      cancelAnimationFrame(this.animationId);

      this.gameOver();
    }
  };

  updateScore() {
    ctx.font = "30px 'Courgette'";
    ctx.fillStyle = "yellow";
    ctx.fillText(`Score: ${this.score}`, 80, 40);
  }

  gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "100px Stencil Std, fantasy";
    ctx.fillText("Game Over!", canvas.width / 5, 350);

    ctx.font = "50px 'Andale Mono, monospace'";
    ctx.fillStyle = "white";
    ctx.fillText(`Your Final Score: ${this.score}`, canvas.width / 4, 450);
  }

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  intro.style.display = "none";
  board.style.display = "block";

  this.introSound = introSound.play();

  const bgImg = new Image();
  bgImg.src = "./Images/night_forest2.jpg";

  const harryImg = new Image();
  harryImg.src = "./Images/HP.png";

  const backgroundImage = new BackgroundImage(
    0,
    0,
    canvas.width,
    canvas.height,
    bgImg
  );
  const player = new GameObj(30, 300, 75, 104, harryImg);

  const game = new Game(backgroundImage, player);

  game.start();

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
      game.player.speedY = -3;
    } else if (event.code === "ArrowDown") {
      game.player.speedY = 3;
    }
  });

  document.addEventListener("keyup", () => {
    game.player.speedY = 0;
  });
}

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
};
