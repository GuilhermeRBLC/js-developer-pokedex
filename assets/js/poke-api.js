
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function convertPokeApiDetailToPokemonExtra(pokeDetail) {
    const pokemon = new PokemonExtra()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    pokemon.abilities = pokeDetail.abilities.map((ability) => ability.ability.name)

    pokemon.moves = pokeDetail.moves.map((move) => move.move.name)

    pokemon.species = pokeDetail.species.name

    pokemon.stats = pokeDetail.stats.map((stat) => [stat.stat.name, stat.base_stat, 100])

    return pokemon
}

function convertPokeApiEvolutionToPokemonEvolution(pokeEvolution) {

    const getEvolutions = (root) => {
        let evolutions = []

        if(root.evolves_to.length == 0) return evolutions

        for(const ev of root.evolves_to) {
            const pokemon = new PokemonEvolution()
            pokemon.name = ev.species.name
            evolutions.push(pokemon)
            evolutions.push(...getEvolutions(ev))
        }
        return evolutions
    }

    let evol = []
    if(pokeEvolution.chain.evolves_to.length > 0) {
        const pokemon = new PokemonEvolution()
        pokemon.name = pokeEvolution.chain.species.name
        evol.push(pokemon)
    }
    evol.push(...getEvolutions(pokeEvolution.chain))

    return evol
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonEvolution = (pokemonName) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => fetch(data.evolution_chain.url))
        .then((response) => response.json())
        .then(convertPokeApiEvolutionToPokemonEvolution)
        .then((evolutions) => evolutions.map((poke) => pokeApi.getPokemonDetail({url: `https://pokeapi.co/api/v2/pokemon/${poke.name}`})))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonDetailExtra = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemonExtra)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
