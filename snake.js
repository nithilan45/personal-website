const board = document.querySelector("#board");
const statusLine = document.querySelector("#status");
const scoreLine = document.querySelector("#score");
const againButton = document.querySelector("#again");

const SIZE = 16;
const cells = [];
for (let i = 0; i < SIZE * SIZE; i += 1) {
  const cell = document.createElement("div");
  cell.className = "cell";
  board.append(cell);
  cells.push(cell);
}

let snake = [];
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = { x: 8, y: 8 };
let score = 0;
let best = 0;
let alive = false;
let timer = 0;
let started = false;

function placeFood() {
  const open = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) open.push({ x, y });
    }
  }
  food = open[Math.floor(Math.random() * open.length)] || { x: 0, y: 0 };
}

function paint() {
  for (const cell of cells) cell.className = "cell";
  const foodIndex = food.y * SIZE + food.x;
  if (cells[foodIndex]) cells[foodIndex].className = "cell food";
  for (const part of snake) {
    cells[part.y * SIZE + part.x].className = "cell on";
  }
}

function stop(message) {
  alive = false;
  window.clearInterval(timer);
  best = Math.max(best, score);
  statusLine.textContent = message;
  scoreLine.textContent = `score ${score} · best ${best}`;
  againButton.hidden = false;
}

function step() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE) {
    stop("hit the wall.");
    return;
  }
  if (snake.some((part) => part.x === head.x && part.y === head.y)) {
    stop("hit yourself.");
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreLine.textContent = `score ${score} · best ${best}`;
    placeFood();
  } else {
    snake.pop();
  }
  paint();
}

function begin() {
  snake = [
    { x: 4, y: 8 },
    { x: 3, y: 8 },
    { x: 2, y: 8 },
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  alive = true;
  started = false;
  placeFood();
  paint();
  statusLine.textContent = "arrows to move.";
  scoreLine.textContent = `score 0 · best ${best}`;
  againButton.hidden = true;
  window.clearInterval(timer);
}

function turn(x, y) {
  if (!alive) return;
  if (x === -dir.x && y === -dir.y) return;
  nextDir = { x, y };
  if (!started) {
    started = true;
    statusLine.textContent = "go.";
    timer = window.setInterval(step, 120);
  }
}

const keys = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

window.addEventListener("keydown", (event) => {
  const move = keys[event.key];
  if (!move) return;
  event.preventDefault();
  turn(move[0], move[1]);
});

document.querySelectorAll(".dir").forEach((button) => {
  button.addEventListener("click", () => {
    turn(Number(button.dataset.x), Number(button.dataset.y));
  });
});

againButton.addEventListener("click", begin);
begin();
