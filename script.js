const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const stageEl = document.getElementById("stage");
const gameOverText = document.getElementById("game-over");

let playerX = 140;
let score = 0;
let stage = 1;
let gameOver = false;

let moveLeft = false;
let moveRight = false;
let speed = 4; // Base movement speed

/* Key controls */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

/* Smooth movement loop with slight bouncing */
let bounceDirection = 1;
function movePlayer() {
  if (!gameOver) {
    // Move left/right
    if (moveLeft && playerX > 0) playerX -= speed;
    if (moveRight && playerX < 280) playerX += speed;

    // Slight bounce animation
    const bounce = Math.sin(Date.now() / 200) * 2 * bounceDirection;
    player.style.transform = `translateY(${bounce}px)`;
    player.style.left = playerX + "px";
  }
  requestAnimationFrame(movePlayer);
}
movePlayer();

/* Create falling arrows */
function createArrow() {
  if (gameOver) return;

  const arrow = document.createElement("div");
  arrow.classList.add("arrow");
  arrow.style.left = Math.random() * 290 + "px";
  game.appendChild(arrow);

  let y = 0;
  let fallSpeed = 3 + stage;

  const fall = setInterval(() => {
    if (gameOver) {
      clearInterval(fall);
      arrow.remove();
      return;
    }

    y += fallSpeed;
    arrow.style.top = y + "px";

    const a = arrow.getBoundingClientRect();
    const p = player.getBoundingClientRect();

    /* Collision detection */
    if (
      a.bottom > p.top &&
      a.left < p.right &&
      a.right > p.left
    ) {
      gameOver = true;
      gameOverText.hidden = false;
      game.style.animation = "shake 0.3s";
      clearInterval(fall);
    }

    /* Missed arrow */
    if (y > 420) {
      score++;
      scoreEl.textContent = score;

      if (score % 10 === 0) {
        stage++;
        stageEl.textContent = stage;
      }

      clearInterval(fall);
      arrow.remove();
    }
  }, 20);
}

/* Spawn arrows continuously */
setInterval(createArrow, 1000);

/* Background particles */
function createParticle() {
  if (gameOver) return;

  const particle = document.createElement("div");
  particle.classList.add("particle");
  particle.style.left = Math.random() * 320 + "px";
  particle.style.top = "0px";
  game.appendChild(particle);

  let y = 0;
  const speed = 1 + Math.random() * 2;

  const fall = setInterval(() => {
    if (gameOver) {
      clearInterval(fall);
      particle.remove();
      return;
    }

    y += speed;
    particle.style.top = y + "px";

    if (y > 420) {
      clearInterval(fall);
      particle.remove();
    }
  }, 30);
}

setInterval(createParticle, 200);
