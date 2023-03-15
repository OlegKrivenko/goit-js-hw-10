import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener(
  'input',
  debounce(inputSearch, DEBOUNCE_DELAY, {
    leading: false,
    trailing: true,
  })
);

function inputSearch(event) {
  const country = searchBox.value.trim();
  if (!country) {
    cleancountryList();
    cleanCountryInfo();
    return;
  }

  fetchCountries(country)
    .then(countries => {
      console.log(countries);

      if (countries.length > 10) {
        cleancountryList();
        cleanCountryInfo();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length <= 10) {
        cleanCountryInfo();
        renderCountriesName(countries);
      }
      if (countries.length === 1) {
        cleancountryList();
        renderCountryInfo(countries);
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function renderCountriesName(arrayCountriesName) {
  const markup = arrayCountriesName
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${flags.alt}" width="25" height="15"><span>${name.common}</span></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(countryName) {
  const markup = countryName.map(
    ({ name, flags, capital, population, languages }) => {
      return `<h2><img src="${flags.svg}" alt="${
        flags.alt
      }" width="40" height="30"><span class="country-name">${
        name.common
      }</span></H2>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
    }
  );
  countryInfo.innerHTML = markup;
}

function cleancountryList() {
  countryList.innerHTML = '';
}

function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}
