import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

const refs = {
  form: document.querySelector('form'),
  button: document.querySelector('button'),
};

refs.form.addEventListener('input', onFormInput);
refs.button.addEventListener('click', onClick);

let data = {};

function onFormInput(event) {
  data = { ...data, [event.target.name]: event.target.value };
}

function onClick(event) {
  event.preventDefault();

  let amount = 1;
  let time = Number(data.delay);

  while (amount <= data.amount) {
    createPromise(amount, time)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.warning(
          `❌ Rejected promise ${position} in ${delay}ms`
        );
      });
    amount += 1;
    time += Number(data.step);
  }
}
