function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
  body: document.querySelector('body'),
};

refs.startBtn.addEventListener('click', onStartClick);
refs.stopBtn.addEventListener('click', onStopClick);

let intervalId = null;

function onStartClick(event) {
  intervalId = setInterval(setStyles, 1000);
}

function setStyles() {
  refs.body.style.backgroundColor = getRandomHexColor();
  refs.startBtn.disabled = true;
}

function onStopClick() {
  clearInterval(intervalId);
  refs.startBtn.disabled = false;
}
