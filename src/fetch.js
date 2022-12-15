function fetchCountries() {
  const searchParams = 'name,capital,population,flags,languages';
  const url = `https://restcountries.com/v3.1/all?fields=${searchParams}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

export { fetchCountries };
