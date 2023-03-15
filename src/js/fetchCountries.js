const BASE_URL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(name) {
  const urlSearchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages',
  });

  return fetch(`${BASE_URL}/${name}?${urlSearchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
