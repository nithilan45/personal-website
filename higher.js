const currentEl = document.querySelector("#current");
const nextEl = document.querySelector("#next");
const statusLine = document.querySelector("#status");
const streakLine = document.querySelector("#streak");
const higherButton = document.querySelector("#higher");
const lowerButton = document.querySelector("#lower");
const againButton = document.querySelector("#again");

let deck = [];
let current = null;
let upcoming = null;
let streak = 0;
let best = 0;
let live = true;

function draw() {
  if (deck.length < 2) deck = freshDeck();
  return deck.pop();
}

function show(container, card, hidden) {
  container.replaceChildren(cardNode(hidden ? null : card, hidden));
}

function endRound(message) {
  live = false;
  best = Math.max(best, streak);
  show(nextEl, upcoming, false);
  statusLine.textContent = message;
  higherButton.disabled = true;
  lowerButton.disabled = true;
  againButton.hidden = false;
  streakLine.textContent = `streak ${streak} · best ${best}`;
}

function deal() {
  current = draw();
  upcoming = draw();
  live = true;
  show(currentEl, current, false);
  show(nextEl, upcoming, true);
  statusLine.textContent = "higher or lower?";
  higherButton.disabled = false;
  lowerButton.disabled = false;
  againButton.hidden = true;
  streakLine.textContent = `streak ${streak} · best ${best}`;
}

function advance(message) {
  current = upcoming;
  upcoming = draw();
  show(currentEl, current, false);
  show(nextEl, upcoming, true);
  statusLine.textContent = message;
  higherButton.disabled = false;
  lowerButton.disabled = false;
  streakLine.textContent = `streak ${streak} · best ${best}`;
}

function guess(direction) {
  if (!live) return;
  const now = rankValue(current);
  const next = rankValue(upcoming);
  show(nextEl, upcoming, false);
  higherButton.disabled = true;
  lowerButton.disabled = true;

  if (now === next) {
    window.setTimeout(() => advance("same rank. streak holds."), 420);
    return;
  }

  const correct = direction === "higher" ? next > now : next < now;
  if (!correct) {
    endRound(direction === "higher" ? "it was lower." : "it was higher.");
    return;
  }

  window.setTimeout(() => {
    streak += 1;
    best = Math.max(best, streak);
    advance("right. again.");
  }, 420);
}

higherButton.addEventListener("click", () => guess("higher"));
lowerButton.addEventListener("click", () => guess("lower"));
againButton.addEventListener("click", () => {
  streak = 0;
  deck = freshDeck();
  deal();
});

deck = freshDeck();
deal();
