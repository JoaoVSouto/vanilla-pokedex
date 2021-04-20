(function () {
  const elements = {
    pokemonsContainer: document.getElementById('pokemons-container'),
  };

  const template = {
    createPokemonCard({ name, height, weight, types, imageUrl }) {
      const cardTemplate = `
        <div class="col-12 col-md-6 col-lg-4 col-xl-3 d-flex">
          <div class="mw-full d-flex">
            <div class="card p-0 d-flex flex-column">
              <img
                src="${imageUrl}"
                class="img-fluid p-15 mx-auto d-block poke-img"
                alt="${name}"
              />
              <div class="content flex-grow-1 d-flex flex-column">
                <h2 class="content-title">${name}</h2>

                <div class="flex-grow-1">
                  <p>
                    <i class="fas fa-weight mr-5" aria-hidden="true"></i>
                    Weight: ${weight}hg
                  </p>
                  <p>
                    <i
                      class="fas fa-level-up-alt mr-5"
                      aria-hidden="true"
                    ></i>
                    Height: ${height}dm
                  </p>
                  <p class="d-flex align-items-center">
                    <i class="fab fa-typo3 mr-5" aria-hidden="true"></i>
                    Types:
                    ${types.reduce(
                      (acc, type) =>
                        `${acc}<span class="badge ml-5">${type}</span>`,
                      ''
                    )}
                  </p>
                </div>

                <button type="button" class="btn">
                  Add to Favorites
                  <i class="far fa-heart ml-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      elements.pokemonsContainer.insertAdjacentHTML('beforeend', cardTemplate);
    },
  };

  const utils = {
    string: {
      capitalize(string) {
        return `${string[0].toUpperCase()}${string.slice(1)}`;
      },
    },
  };

  const services = {
    async fetchPokemonsList() {
      const data = await fetch('https://pokeapi.co/api/v2/pokemon?limit=36');
      const json = await data.json();

      return json;
    },
    async fetch(url) {
      const data = await fetch(url);
      const json = await data.json();

      return json;
    },
  };

  const controllers = {
    async init() {
      const pokemons = await services.fetchPokemonsList();

      const pokemonsData = await Promise.all(
        pokemons.results.map(pokemon => this.mountPokemonData(pokemon.url))
      );

      pokemonsData.forEach(template.createPokemonCard);
    },
    async mountPokemonData(pokemonUrl) {
      const pokemonData = await services.fetch(pokemonUrl);

      return {
        name: utils.string.capitalize(pokemonData.name),
        height: pokemonData.height,
        weight: pokemonData.weight,
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
        types: pokemonData.types.map(({ type }) => type.name),
      };
    },
  };

  controllers.init();
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
