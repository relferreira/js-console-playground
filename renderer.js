// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const babel = require('babel-core');

const KEY_ENTER = 13;

let resultsContainer = document.querySelector('.container');
let submitButton = document.querySelector('.form__btn');
let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', submitForm);
input.addEventListener('keypress', inputKeyPress);

function submitForm(e) {
  e.preventDefault();
  let value = input.value;
  if (checkForShortCuts(value)) {
    clearInput();
    return;
  }

  let transpiledCode = babel.transform(value, {
    presets: ['env'],
    plugins: ['transform-remove-strict-mode']
  });

  resultsContainer.innerHTML += `<p class="results__input">> ${value}</p>`;
  try {
    let result = window.eval(transpiledCode.code);
    resultsContainer.innerHTML += `<p class="results__output">< ${JSON.stringify(
      result
    )}</p>`;
  } catch (e) {
    resultsContainer.innerHTML += `<p class="results__output results__output--error">< ${JSON.stringify(
      e.message
    )}</p>`;
  }

  clearInput();
}

function inputKeyPress(e) {
  if (e.charCode === KEY_ENTER && !e.shiftKey) {
    e.preventDefault();
    submitButton.click();
    return false;
  }
}

function clearInput() {
  input.value = '';
}

function checkForShortCuts(value) {
  if (value === 'clear') {
    resultsContainer.innerHTML = '';
    input.value = '';
    return true;
  }
  return false;
}
