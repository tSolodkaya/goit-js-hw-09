import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  buttonStart: document.querySelector('[data-start]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

let userDate = null;
refs.buttonStart.disabled = true;
refs.input.disabled = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userDate = selectedDates[0].getTime();
    dateInFuture(userDate);
  },
};

flatpickr('#datetime-picker', options);

class Timer {
  constructor({ updateUI, isTimeOver, disabledInput, intervalId = null }) {
    this.isTimeOver = isTimeOver;
    this.updateUI = updateUI;
    this.intervalId = intervalId;
    this.disabledInput = disabledInput;
  }

  start() {
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = convertMs(userDate - currentTime);
      updateUI(deltaTime);
      disabledInput();
      if (isTimeOver(this.intervalId)) {
        clearInterval(this.intervalId);
        return;
      }
    }, 1000);
  }
}

const timer = new Timer({
  updateUI: updateUI,
  isTimeOver: isTimeOver,
  disabledInput: disabledInput,
});

refs.buttonStart.addEventListener('click', timer.start);

function dateInFuture(userDate) {
  if (userDate < Date.now()) {
    Notiflix.Notify.warning('Please choose a date in the future');
    return;
  }
  refs.buttonStart.disabled = false;
}

function disabledInput() {
  refs.buttonStart.disabled = true;
  refs.input.disabled = true;
}
function updateUI(data) {
  refs.dataDays.textContent = addLeadingZero(data.days);
  refs.dataHours.textContent = addLeadingZero(data.hours);
  refs.dataMinutes.textContent = addLeadingZero(data.minutes);
  refs.dataSeconds.textContent = addLeadingZero(data.seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function isTimeOver() {
  if (
    refs.dataDays.textContent === '00' &&
    refs.dataHours.textContent === '00' &&
    refs.dataMinutes.textContent === '00' &&
    refs.dataSeconds.textContent === '00'
  ) {
    Notiflix.Notify.warning('Time is over!');
    return true;
  }
  return false;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
