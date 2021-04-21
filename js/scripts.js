(function () {
  const elements = {
    pokemonsContainer: document.getElementById('pokemons-container'),
    favoritesPokemonsContainer: document.getElementById(
      'favorites-pokemons-container'
    ),
    favoritesChartCanvas: document.getElementById('favorites-chart'),
    favoritesChart: new Chart(document.getElementById('favorites-chart'), {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Favorited pokémons types',
          },
        },
      },
    }),
    pokemonsCards: [],
  };

  const constants = {
    FAVORITES_POKEMONS_LOCAL_STORAGE_KEY: 'pokedex:favorites',
    ADD_TO_FAVORITES_LABEL: 'Add to Favorites',
    REMOVE_FROM_FAVORITES_LABEL: 'Remove from Favorites',
  };

  const template = {
    createPokemonCard({ id, name, height, weight, types, imageUrl }) {
      const cardTemplate = `
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
                      `${acc}<span class="badge ml-5 type-badge">${type}</span>`,
                    ''
                  )}
                </p>
              </div>

              <button type="button" class="btn btn-favorite" data-pokemon-id="${id}">
                <span>${constants.ADD_TO_FAVORITES_LABEL}</span>
                <i class="far fa-heart ml-5"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      const cardContainer = document.createElement('div');
      cardContainer.className = 'col-12 col-md-6 col-lg-4 col-xl-3 d-flex';

      cardContainer.insertAdjacentHTML('afterbegin', cardTemplate);

      elements.pokemonsCards.push(cardContainer);

      elements.pokemonsContainer.appendChild(cardContainer);
    },
    createFavoritePokemonCard({ name, avatarUrl }) {
      const cardTemplate = `
        <p
          class="shadow-sm border rounded d-flex justify-content-between align-items-center h-75 pl-20 mr-10"
        >
          ${name}
          <img
            src="${avatarUrl}"
            alt="${name}"
          />
        </p>
      `;

      elements.favoritesPokemonsContainer.insertAdjacentHTML(
        'beforeend',
        cardTemplate
      );
    },
    addNotFoundFavoritesPokemonsMessage() {
      const message = document.createElement('p');
      message.textContent =
        "Oops... You don't have any favorites pokémons yet.";

      elements.favoritesPokemonsContainer.appendChild(message);
    },
    clearFavoritePokemonCards() {
      elements.favoritesPokemonsContainer.innerHTML = '';
    },
    setFavoriteButtonsListener() {
      elements.pokemonsCards.forEach(pokemonCard => {
        const favoriteButton = pokemonCard.querySelector('button');

        favoriteButton.addEventListener('click', () =>
          controllers.handleToggleFavorite(favoriteButton)
        );
      });
    },
    isFavorited(favoriteButton) {
      return favoriteButton.classList.contains('btn-danger');
    },
    activateAddToFavoritesStyles(favoriteButton) {
      const favoriteButtonLabel = favoriteButton.querySelector('span');
      const favoriteButtonIcon = favoriteButton.querySelector('i');

      favoriteButton.classList.remove('btn-danger');
      favoriteButtonLabel.textContent = constants.ADD_TO_FAVORITES_LABEL;
      favoriteButtonIcon.classList.remove('fa');
      favoriteButtonIcon.classList.add('far');
    },
    activateRemoveFromFavoritesStyles(favoriteButton) {
      const favoriteButtonLabel = favoriteButton.querySelector('span');
      const favoriteButtonIcon = favoriteButton.querySelector('i');

      favoriteButton.classList.add('btn-danger');
      favoriteButtonLabel.textContent = constants.REMOVE_FROM_FAVORITES_LABEL;
      favoriteButtonIcon.classList.add('fa');
      favoriteButtonIcon.classList.remove('far');
    },
    getPokemonIdFromButton(favoriteButton) {
      const { pokemonId } = favoriteButton.dataset;

      return pokemonId;
    },
    activateFavoriteButtons(favorites) {
      const favoriteButtons = elements.pokemonsCards.map(pokemonCard =>
        pokemonCard.querySelector('button')
      );

      favoriteButtons.forEach(favoriteButton => {
        const { pokemonId } = favoriteButton.dataset;

        if (favorites.includes(pokemonId)) {
          this.activateRemoveFromFavoritesStyles(favoriteButton);
        }
      });
    },
    hideFavoritesChart() {
      elements.favoritesChartCanvas.style.display = 'none';
    },
    showFavoritesChart() {
      elements.favoritesChartCanvas.style.display = 'block';
    },
    clearChartData() {
      const chartData = elements.favoritesChart.data;

      chartData.labels = [];

      chartData.datasets[0].data = [];

      elements.favoritesChart.update();
    },
    addDataToChart(type, quantity) {
      const chartData = elements.favoritesChart.data;

      chartData.labels.push(type);

      chartData.datasets[0].data.push(quantity);

      elements.favoritesChart.update();
    },
  };

  const models = {
    pokemon: {
      _data: [],
      setData(pokemons) {
        this._data = pokemons;
      },
      index() {
        return this._data;
      },
      show(pokemonId) {
        const selectedPokemon = this._data.find(
          pokemon => pokemon.id === Number(pokemonId)
        );

        return selectedPokemon || null;
      },
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
    addPokemonToFavorites(pokemonId) {
      const favorites =
        JSON.parse(
          localStorage.getItem(constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY)
        ) || [];

      if (!Array.isArray(favorites)) {
        localStorage.setItem(
          constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY,
          JSON.stringify([pokemonId])
        );
        return;
      }

      favorites.push(pokemonId);
      const favoritesWithoutDuplicates = new Set(favorites);
      localStorage.setItem(
        constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY,
        JSON.stringify(Array.from(favoritesWithoutDuplicates))
      );
    },
    removePokemonFromFavorites(pokemonId) {
      const favorites =
        JSON.parse(
          localStorage.getItem(constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY)
        ) || [];

      if (!Array.isArray(favorites)) {
        localStorage.setItem(
          constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY,
          JSON.stringify([])
        );
        return;
      }

      const filteredFavorites = favorites.filter(
        favorite => String(favorite) !== String(pokemonId)
      );
      localStorage.setItem(
        constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY,
        JSON.stringify(filteredFavorites)
      );
    },
    fetchFavoritesPokemons() {
      const favorites =
        JSON.parse(
          localStorage.getItem(constants.FAVORITES_POKEMONS_LOCAL_STORAGE_KEY)
        ) || [];

      if (!Array.isArray(favorites)) {
        return [];
      }

      return favorites;
    },
  };

  const controllers = {
    async init() {
      const pokemons = await services.fetchPokemonsList();

      const pokemonsData = await Promise.all(
        pokemons.results.map(pokemon => this.mountPokemonData(pokemon.url))
      );

      models.pokemon.setData(pokemonsData);

      pokemonsData.forEach(template.createPokemonCard);

      template.setFavoriteButtonsListener();
      this.handleInitialFavorites();
      this.fillFavoritePokemonCards();
    },
    async mountPokemonData(pokemonUrl) {
      const pokemonData = await services.fetch(pokemonUrl);

      return {
        id: pokemonData.id,
        name: utils.string.capitalize(pokemonData.name),
        height: pokemonData.height,
        weight: pokemonData.weight,
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
        avatarUrl: pokemonData.sprites.front_default,
        types: pokemonData.types.map(({ type }) => type.name),
      };
    },
    handleToggleFavorite(favoriteButton) {
      const isFavorited = template.isFavorited(favoriteButton);
      const pokemonId = template.getPokemonIdFromButton(favoriteButton);

      if (isFavorited) {
        services.removePokemonFromFavorites(pokemonId);
        template.activateAddToFavoritesStyles(favoriteButton);
      } else {
        services.addPokemonToFavorites(pokemonId);
        template.activateRemoveFromFavoritesStyles(favoriteButton);
      }

      this.fillFavoritePokemonCards();
    },
    handleInitialFavorites() {
      const favorites = services.fetchFavoritesPokemons();
      template.activateFavoriteButtons(favorites);
    },
    fillFavoritePokemonCards() {
      template.clearFavoritePokemonCards();
      template.clearChartData();

      const favorites = services.fetchFavoritesPokemons();

      if (favorites.length === 0) {
        template.hideFavoritesChart();
        template.addNotFoundFavoritesPokemonsMessage();
        return;
      }

      const orderedFavorites = favorites.map(Number).sort((a, b) => a - b);
      const favoritesPokemons = orderedFavorites.map(favorite =>
        models.pokemon.show(favorite)
      );
      favoritesPokemons.forEach(template.createFavoritePokemonCard);

      const typesQuantity = favoritesPokemons.reduce((obj, pokemon) => {
        pokemon.types.forEach(type => {
          if (obj[type]) {
            obj[type] = obj[type] + 1;
            return;
          }

          obj[type] = 1;
        });

        return obj;
      }, {});

      template.showFavoritesChart();
      Object.keys(typesQuantity).forEach(type => {
        template.addDataToChart(type, typesQuantity[type]);
      });
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
