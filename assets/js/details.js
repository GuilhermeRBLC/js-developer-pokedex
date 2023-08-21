
const sectionsList = document.querySelectorAll('.sections a')
sectionsList.forEach((obj) => obj.addEventListener('click', sectionClick))

const overlay = document.querySelector('#overlay')
const details = document.querySelector('.details')

const fields = {}
fields.name = document.querySelector('#name')
fields.number = document.querySelector('.number')
fields.types = document.querySelector('.types')
fields.photo = document.querySelector('#photo')
fields.aboutData = document.querySelector('#about-data')
fields.baseStatsData = document.querySelector('#base-stats-data')
fields.movesData = document.querySelector('#moves-data')
fields.evolutionData = document.querySelector('#evolution-data')

/**
 * Quando um dos seletores de seção (About, Base Stats etc) é clicado
 * move a decoração que indica a seleção do que estava anteriormente
 * selecionado para o atual.
 */
function sectionClick() {
    const actived = document.querySelector('.sections a.actived')
    actived.classList.remove('actived')
    this.classList.add('actived')
}

/**
 * Pega o nome do pokemon na url para encontrar os detalhes.
 * @returns O nome do pokemon na url.
 */
function getPokemonFromURL() {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search)
    return urlParams.get('name')
}

/**
 * Deixa a primeira letra da string em maiuscula.
 * @param {string} str Uma palavra ou frase com caracteres minusculos.
 * @returns Sentença com a primeira letra em maiusculo.
 */
function stringCaptilized(str) {
    return str[0].toUpperCase() + str.substring(1)
}

/**
 * Esta função melhora o texto dos movimentos
 * @param {string} str Uma string que vem da pokeapi que descreve um movimento do pokemon
 * @returns Texto melhorado.
 */
function moveImprovePresent(str) {
    str = str.replace('-', ' ')
    return stringCaptilized(str)
}

/**
 * Esta função obtém qual pokemon deve ser detalhado e faz uma requisição para o pokeapi
 * para obter as informações. Além disso ela também faz uma requisição para encontrar
 * as evoluções do pokemon.
 */
function loadPokemonDetails() {
    const pokemonName = getPokemonFromURL()

    pokeApi.getPokemonDetailExtra({url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`}).then((pokemon) => {
        document.body.classList.add(pokemon.type)
        fields.name.innerText = pokemon.name
        fields.number.innerText = `#${pokemon.number}`
        fields.types.innerHTML = pokemon.types.map((type) => `<li>${stringCaptilized(type)}</li>`).join('')
        fields.photo.src = pokemon.photo

        const abilities = pokemon.abilities.map((ability) => stringCaptilized(ability)).join(', ')
        const aboutData = [
            {"title": "Species", "value": stringCaptilized(pokemon.species)},
            {"title": "Height", "value": `${pokemon.height / 10} cm` },
            {"title": "Weight", "value": `${pokemon.weight / 10} kg`},
            {"title": "Abilities", "value": abilities}
        ]
        fields.aboutData.innerHTML = aboutData.map((info) => `<li><span class="title">${info.title}</span><span>${info.value}</span></li>`).join('')

        let total = 0
        for(const st of pokemon.stats) { total += st[1] }
        pokemon.stats.push(['total', total, pokemon.stats.length * 100])

        const remapStatus = {'hp': 'HP', 'attack': 'Attack', 'defense': 'Defense', 'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', 'speed': 'Speed', 'total': 'Total'}
        fields.baseStatsData.innerHTML = pokemon.stats.map((stat) => `<li><span class="title">${remapStatus[stat[0]]}</span><span>${stat[1]}</span><span class="bar"><span style="width: ${(stat[1]/stat[2]) * 100}%" ${ stat[1] >= stat[2] / 2 ? 'data-green="true"' : '' } ></span></span></li>`).join('')

        fields.movesData.innerHTML = pokemon.moves.map((move) => `<li><span>${moveImprovePresent(move)}</span></li>`).join('')
        
        pokeApi.getPokemonEvolution(pokemon.number).then((evolutions) => {
            fields.evolutionData.innerHTML = evolutions.map( (evolution) => `<li><span>${stringCaptilized(evolution.name)}</span><span><img src="${evolution.photo}" alt="${evolution.name}"></span></li>` ).join('')
        })

        details.style.display = 'flex'
        overlay.style.display = 'none'
    })
}

loadPokemonDetails()

/**
 * Se a pagina é carregada esta função adiciona o efeito de seleção
 * ao indicador de seção correta.
 */
function selectCorrectSection() {
    const url = window.location.href
    const idIdx = url.lastIndexOf("#")
    if(idIdx > -1) {
        const currentId = url.substring(idIdx)

        const actived = document.querySelector('.sections a.actived')
        actived.classList.remove('actived')

        const toActive = document.querySelector(`a[href="${currentId}"]`)
        toActive.classList.add('actived')
    }
}

selectCorrectSection()
