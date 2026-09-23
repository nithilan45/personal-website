const SUITS = [
  { symbol: "♠", red: false },
  { symbol: "♥", red: true },
  { symbol: "♦", red: true },
  { symbol: "♣", red: false },
];

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function freshDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, symbol: suit.symbol, red: suit.red });
    }
  }
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cardPoints(card) {
  if (card.rank === "A") return 11;
  if ("JQK".includes(card.rank)) return 10;
  return Number(card.rank);
}

function handTotal(cards) {
  let total = cards.reduce((sum, card) => sum + cardPoints(card), 0);
  let aces = cards.filter((card) => card.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function rankValue(card) {
  if (card.rank === "A") return 14;
  if (card.rank === "K") return 13;
  if (card.rank === "Q") return 12;
  if (card.rank === "J") return 11;
  return Number(card.rank);
}

function cardNode(card, faceDown = false) {
  const node = document.createElement("div");
  node.className = "card" + (card?.red ? " red" : "") + (faceDown ? " back" : "");
  node.innerHTML = faceDown
    ? ""
    : `<span class="rank">${card.rank}</span><span class="suit">${card.symbol}</span>`;
  return node;
}

function paintHand(container, cards, hideLast = false) {
  container.replaceChildren();
  cards.forEach((card, index) => {
    const hidden = hideLast && index === cards.length - 1;
    container.append(cardNode(hidden ? null : card, hidden));
  });
}
