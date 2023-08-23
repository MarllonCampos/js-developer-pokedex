const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = titleize(pokeDetail.name);

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;
  pokemon.abilities = pokeDetail.abilities.map(({ ability }) => titleize(ability.name));

  pokemon.stats.total = pokeDetail.stats.reduce((accumulator, currentValue) => accumulator + currentValue.base_stat, 0);
  pokeDetail.stats.forEach((statInfo) => {
    statName = statFormalizer(statInfo.stat.name);
    pokemon.stats[statName] = statInfo.base_stat;
  });
  pokemon.stats.weight = formalizeHeightAndWeight(pokeDetail.weight);
  pokemon.stats.height = formalizeHeightAndWeight(pokeDetail.height);
  pokemon.photo = pokeDetail.sprites.other.home.front_default;
  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};
