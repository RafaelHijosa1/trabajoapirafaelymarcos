let todosLosPokemon = [];
let pokemonMostrados = 0;
const limit = 50;

function buscarPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    const pokemonFiltrados = todosLosPokemon.filter(pokemon => {
        return pokemon.nombre.toLowerCase().includes(pokemonName);
    });
    mostrarListaPokemon(pokemonFiltrados);
}

function filtrarPorTipo() {
    const tipoSeleccionado = document.getElementById('tipoFiltro').value;
    const pokemonFiltrados = todosLosPokemon.filter(pokemon => {
        return tipoSeleccionado === '' || pokemon.tipos.includes(tipoSeleccionado);
    });
    mostrarListaPokemon(pokemonFiltrados);
}

function cargarPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => {
            const promises = data.results.map(pokemon => {
                return fetch(pokemon.url)
                    .then(response => response.json());
            });
            return Promise.all(promises);
        })
        .then(pokemonData => {
            todosLosPokemon = pokemonData.map(pokemon => {
                return {
                    nombre: pokemon.name,
                    id: pokemon.id,
                    tipos: pokemon.types.map(type => type.type.name),
                    altura: pokemon.height,
                    peso: pokemon.weight,
                    habilidades: pokemon.abilities.map(ability => ability.ability.name),
                    stats: pokemon.stats.map(stat => ({ nombre: stat.stat.name, valor: stat.base_stat })),
                    movimientos: pokemon.moves.map(move => move.move.name),
                    imagen: pokemon.sprites.front_default
                };
            });
            llenarFiltroTipos();
            mostrarListaPokemon(todosLosPokemon.slice(0, limit));
            pokemonMostrados = limit;
        })
        .catch(error => {
            mostrarError('Error al cargar los Pokémon.');
        });
}

function cargarMasPokemon() {
    if (pokemonMostrados < todosLosPokemon.length) {
        const nuevosPokemon = todosLosPokemon.slice(pokemonMostrados, pokemonMostrados + limit);
        mostrarListaPokemon(nuevosPokemon);
        pokemonMostrados += limit;
    } else {
        mostrarError('¡Has alcanzado todos los Pokémon disponibles!');
    }
}

function mostrarListaPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemonContainer');
    pokemonContainer.innerHTML = '';
    pokemonList.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemonContainer', pokemon.tipos[0]);
        pokemonDiv.innerHTML = `
            <h2>${pokemon.nombre.toUpperCase()}</h2>
            <div>
                <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
            </div>
            <p><strong>ID:</strong> ${pokemon.id}</p>
            <p><strong>Tipo(s):</strong> ${pokemon.tipos.join(', ').toUpperCase()}</p>
            <p><strong>Altura:</strong> ${pokemon.altura / 10} m</p>
            <p><strong>Peso:</strong> ${pokemon.peso / 10} kg</p>
            <p><strong>Habilidades:</strong> ${pokemon.habilidades.join(', ')}</p>
            <p><strong>Estadísticas:</strong></p>
            <ul>
                ${pokemon.stats.map(stat => `<li>${stat.nombre}: ${stat.valor}</li>`).join('')}
            </ul>
            <p><strong>Movimientos:</strong></p>
            <ul>
                ${pokemon.movimientos.slice(0, 5).map(move => `<li>${move}</li>`).join('')}
            </ul>
        `;
        pokemonContainer.appendChild(pokemonDiv);
    });
}

function llenarFiltroTipos() {
    const tiposSet = new Set();
    todosLosPokemon.forEach(pokemon => {
        pokemon.tipos.forEach(tipo => {
            tiposSet.add(tipo);
        });
    });
    const tipoFiltro = document.getElementById('tipoFiltro');
    tiposSet.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        tipoFiltro.appendChild(option);
    });
}

function mostrarError(mensaje) {
    const pokemonContainer = document.getElementById('pokemonContainer');
    pokemonContainer.innerHTML = `<p>${mensaje}</p>`;
}

document.addEventListener('DOMContentLoaded', function() {
    cargarPokemon();
});
