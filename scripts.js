(async function () {
  // const data = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
  // const json = await data.json();
  // console.log(json);
})();

(function () {
  const DARK_MODE_LOCAL_STORAGE_KEY = 'pokedex:darkModeOn';

  const darkModeToggler = document.getElementById('darkmode-toggler');
  const darkModeTogglerIcon = darkModeToggler.querySelector('i');

  const setSunIcon = () => {
    darkModeTogglerIcon.className = '';
    darkModeTogglerIcon.classList.add('fas', 'fa-sun');
  };

  const setMoonIcon = () => {
    darkModeTogglerIcon.className = '';
    darkModeTogglerIcon.classList.add('far', 'fa-moon');
  };

  darkModeToggler.addEventListener('click', () => {
    halfmoon.toggleDarkMode();

    localStorage.setItem(DARK_MODE_LOCAL_STORAGE_KEY, halfmoon.darkModeOn);

    if (halfmoon.darkModeOn) {
      setMoonIcon();
    } else {
      setSunIcon();
    }
  });

  const darkModeSelection = localStorage.getItem(DARK_MODE_LOCAL_STORAGE_KEY);

  if (darkModeSelection === 'true' || darkModeSelection === null) {
    halfmoon.toggleDarkMode();
    setMoonIcon();
  } else {
    setSunIcon();
  }
})();
