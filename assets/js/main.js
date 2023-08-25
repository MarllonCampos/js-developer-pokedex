const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById('pokemon_info');
const CLOSE_MODAL = `<svg width="32px" height="32px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#ccc" stroke-width="1.032" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#ccc" stroke-width="1.032" stroke-linecap="round"></path></g></svg>`;
const maxRecords = 151;
const limit = 10;
let offset = 0;
Object.assign(modal.style, {
  display: 'none',
});

closeModalButton = document.createElement('button');
closeModalButton.addEventListener('click', () => {
  modal.close();
});
closeModalButton.innerHTML = CLOSE_MODAL;
closeModalButton.classList.add('modal_close');

function statsList(stats) {
  return Object.keys(stats)
    .map(
      (key) =>
        `<p class="modal_stat_container"><span class="modal_stat">${titleize(
          key
        )}</span><span class="modal_stat-value">${stats[key]}${unitFormalizer(key)}</span></p>`
    )
    .join('');
}

function modalContent(pokemon) {
  modal.innerHTML = `
  <img src=${pokemon.photo} width="100px" class="modal_pokemon-photo" />
  <h4 class="modal_subtitle">${titleize(pokemon.name)}</h4>
  <div class="modal_stats">
  ${statsList(pokemon.stats)}
  </div>`;
  modal.appendChild(closeModalButton);
}

function convertPokemonToLi(pokemon) {
  const pokemonContainer = document.createElement('button');
  pokemonContainer.addEventListener('click', (event) => {
    modal.classList.add(pokemon.type);
    document.body.classList.add('hidden');
    modalContent(pokemon);
    Object.assign(modal.style, {
      display: 'grid',
    });
    modal.showModal();

    modal.addEventListener('click', (event) => {
      if (
        event.clientX < modal.getBoundingClientRect().left ||
        event.clientX > modal.getBoundingClientRect().right ||
        event.clientY < modal.getBoundingClientRect().top ||
        event.clientY > modal.getBoundingClientRect().bottom
      ) {
        document.body.classList.remove('hidden');
        modal.classList.remove(pokemon.type);
        Object.assign(modal.style, {
          display: 'none',
        });
        modal.close();
      }
    });
  });
  pokemonContainer.classList.add('pokemon');
  pokemonContainer.classList.add(pokemon.type);
  pokemonContainer.innerHTML = `
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>

    <div class="detail">
        <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>

        <img src="${pokemon.photo}"
            alt="${pokemon.name}">
    </div>
  `;
  return pokemonContainer;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemons.map(convertPokemonToLi).forEach((element) => pokemonList.appendChild(element));
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
