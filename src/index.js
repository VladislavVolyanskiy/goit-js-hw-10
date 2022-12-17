import { fetchCountries } from './fetch.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const countriesTaken = [];
let searchQuery = '';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  searchQuery = e.target.value.trim();
  countriesTaken.length = 0;
  if (!searchQuery) {
    clearMarkup();
    return;
  }
  fetchCountries(searchQuery).then(takeRelevantCountries).catch(error);
}

function takeRelevantCountries(countries) {
  countries.map(country => {
    countriesTaken.push(country);
  });
  clearMarkup();
  renderSort();
}

function renderSort() {
  if (countriesTaken.length > 10) {
    tooMany();
  } else if (1 < countriesTaken.length && countriesTaken.length < 10) {
    refs.list.innerHTML = createListMarkup(countriesTaken);
  } else if (countriesTaken.length === 1) {
    refs.countryInfo.innerHTML = createMarkup(countriesTaken);
  } else {
    error();
  }
}

function createListMarkup(country) {
  return country
    .map(({ flags, name }) => {
      return `
                <li class='list-item'><img class="flag-img" src=${flags.svg} alt=${name.official} width = "60" height = "auto" />
                    ${name.official}
                </li>`;
    })
    .join('');
}

function createMarkup(country) {
  return country
    .map(({ flags, name, capital, population, languages }) => {
      return `
                <div class='country-info'><img class="flag-img" src=${
                  flags.svg
                } alt=${name.official} width = "60" height = "auto" />
                    <h1 class ='country-name'>${name.official}</h1>
                </div>
                    <ul class='country-list'>
                        <li><b>Capital:</b> ${capital}</li>
                        <li><b>Population:</b> ${population}</li>
                        <li><b>Languages:</b> ${Object.values(languages)}</li>
                    </ul>`;
    })
    .join('');
}

function clearMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.list.innerHTML = '';
}

function tooMany() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function error() {
  Notify.failure('Oops, there is no country with that name');
  clearMarkup();
}
