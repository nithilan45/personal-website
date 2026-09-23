const dealerHand = document.querySelector("#dealer-cards");
const playerHand = document.querySelector("#player-cards");
const dealerMeta = document.querySelector("#dealer-meta");
const playerMeta = document.querySelector("#player-meta");
const statusLine = document.querySelector("#status");
const bankLine = document.querySelector("#bank");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const againButton = document.querySelector("#again");

const BET = 10;
let deck = [];
let player = [];
let dealer = [];
let bank = 100;
let locked = false;

function draw() {
  if (deck.length < 10) deck = freshDeck();
  return deck.pop();
}

function setControls(playing) {
  hitButton.disabled = !playing;
  standButton.disabled = !playing;
  againButton.hidden = playing;
}

function render(hideHole) {
  paintHand(dealerHand, dealer, hideHole);
  paintHand(playerHand, player, false);
  dealerMeta.textContent = hideHole ? "dealer" : `dealer ${handTotal(dealer)}`;
  playerMeta.textContent = `you ${handTotal(player)}`;
  bankLine.textContent = `bank ${bank}`;
}

function finish(message, delta) {
  locked = true;
  bank += delta;
  render(false);
  statusLine.textContent = message;
  setControls(false);
}

function dealerPlay() {
  while (handTotal(dealer) < 17) dealer.push(draw());
  const playerTotal = handTotal(player);
  const dealerTotal = handTotal(dealer);
  if (dealerTotal > 21) finish("dealer busts. you win.", BET);
  else if (dealerTotal > playerTotal) finish("dealer wins.", -BET);
  else if (dealerTotal < playerTotal) finish("you win.", BET);
  else finish("push.", 0);
}

function deal() {
  if (bank < BET) bank = 100;
  player = [draw(), draw()];
  dealer = [draw(), draw()];
  locked = false;
  setControls(true);
  render(true);

  const playerNatural = handTotal(player) === 21;
  const dealerNatural = handTotal(dealer) === 21;
  if (playerNatural || dealerNatural) {
    if (playerNatural && dealerNatural) finish("push. two blackjacks.", 0);
    else if (playerNatural) finish("blackjack.", BET + 5);
    else finish("dealer blackjack.", -BET);
    return;
  }
  statusLine.textContent = "hit or stand.";
}

hitButton.addEventListener("click", () => {
  if (locked) return;
  player.push(draw());
  render(true);
  if (handTotal(player) > 21) finish("bust.", -BET);
  else statusLine.textContent = "hit or stand.";
});

standButton.addEventListener("click", () => {
  if (locked) return;
  locked = true;
  setControls(false);
  againButton.hidden = true;
  dealerPlay();
});

againButton.addEventListener("click", deal);
deal();
