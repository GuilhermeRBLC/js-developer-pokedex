const pokemonList = document.getElementById('pokemonList')
const loaderIndicator = document.getElementById('loader')

const maxRecords = 151
const limit = 10
let offset = 0
let enableLoadMore = true

/**
 * Exibe e oculta um indicador de carregamento para indicar oa usuário que algo está acontecendo
 * caso a conexão esteja lenta.
 * @param {boolean} status O estado atual do indicador verdadeiro para vísivel e falso para invisível.
 */
function toogleLoader(status) {
    loaderIndicator.style.display = status ? 'block' : 'none'
}

function convertPokemonToLi(pokemon) {
    return `
        <a href="details.html?name=${pokemon.name}" target="_blank">
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        </a>
    `
}

function loadPokemonItens(offset, limit) {
    toogleLoader(true)
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {

        pokemons.forEach( (pokemon, index) => {
            setTimeout(() => {
                const e = document.createElement('div')
                e.innerHTML = convertPokemonToLi(pokemon)
                pokemonList.append(e.childNodes[1])
            }, 100 * index);
        })

        /*const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml*/

        toogleLoader(false)
        enableLoadMore = true
    })
}

loadPokemonItens(offset, limit)

/**
 * Verifica se o usuário rolou a página até o fim, se sim, carrega novos pokemons.
 * Quando carregar o máximo de registros remove a escuta do evento de rolagem da pagina, para não
 * tentar carregar mais registros.
 */
function loadMoreListner() {
    if(window.scrollY + window.innerHeight > document.body.offsetHeight - 10 && enableLoadMore) {
        enableLoadMore = false
        offset += limit
        const qtdRecordsWithNexPage = offset + limit

        if (qtdRecordsWithNexPage >= maxRecords) {
            const newLimit = maxRecords - offset
            loadPokemonItens(offset, newLimit)

            window.removeEventListener('scroll', loadMoreListner)
        } else {
            loadPokemonItens(offset, limit)
        }
    }
}

window.addEventListener('scroll', loadMoreListner)