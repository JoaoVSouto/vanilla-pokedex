(async function () {
  // const data = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
  // const json = await data.json();
  // console.log(json);
})();

(function () {
  const DARK_MODE_LOCAL_STORAGE_KEY = 'pokedex:darkModeOn';

  const darkModeToggler = document.getElementById('darkmode-toggler');

  darkModeToggler.addEventListener('click', () => {
    halfmoon.toggleDarkMode();

    localStorage.setItem(DARK_MODE_LOCAL_STORAGE_KEY, halfmoon.darkModeOn);
  });

  const darkModeSelection = localStorage.getItem(DARK_MODE_LOCAL_STORAGE_KEY);

  if (darkModeSelection === 'true') {
    halfmoon.toggleDarkMode();
  }
})();
