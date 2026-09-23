const pads = [...document.querySelectorAll(".pad")];
const statusLine = document.querySelector("#status");
const scoreLine = document.querySelector("#score");
const againButton = document.querySelector("#again");

let sequence = [];
let step = 0;
let locked = true;
let best = 0;

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function flash(index) {
  const pad = pads[index];
  pad.classList.add("lit");
  await sleep(280);
  pad.classList.remove("lit");
  await sleep(140);
}

async function playback() {
  locked = true;
  pads.forEach((pad) => {
    pad.disabled = true;
  });
  statusLine.textContent = "watch.";
  await sleep(360);
  for (const index of sequence) await flash(index);
  locked = false;
  step = 0;
  pads.forEach((pad) => {
    pad.disabled = false;
  });
  statusLine.textContent = "your turn.";
}

function start() {
  sequence = [Math.floor(Math.random() * pads.length)];
  scoreLine.textContent = `round 1 · best ${best}`;
  againButton.hidden = true;
  playback();
}

function fail() {
  locked = true;
  best = Math.max(best, sequence.length - 1);
  pads.forEach((pad) => {
    pad.disabled = true;
  });
  statusLine.textContent = "missed.";
  scoreLine.textContent = `reached ${sequence.length - 1} · best ${best}`;
  againButton.hidden = false;
}

pads.forEach((pad, index) => {
  pad.addEventListener("click", async () => {
    if (locked) return;
    await flash(index);
    if (index !== sequence[step]) {
      fail();
      return;
    }
    step += 1;
    if (step < sequence.length) return;
    best = Math.max(best, sequence.length);
    sequence.push(Math.floor(Math.random() * pads.length));
    scoreLine.textContent = `round ${sequence.length} · best ${best}`;
    playback();
  });
});

againButton.addEventListener("click", start);
start();
