const POKEMON_DISPONIBLES = [
    { id: 1, name: "Bulbasaur", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { id: 4, name: "Charmander", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { id: 7, name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { id: 25, name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { id: 54, name: "Psyduck", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" },
    { id: 94, name: "Gengar", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" },
    { id: 132, name: "Ditto", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png" },
    { id: 133, name: "Eevee", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
    { id: 134, name: "Vaporeon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png" },
    { id: 135, name: "Jolteon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png" },
    { id: 136, name: "Flareon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png" },
    { id: 143, name: "Snorlax", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
    { id: 150, name: "Mewtwo", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" },
    { id: 151, name: "Mew", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png" },
    { id: 196, name: "Espeon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png" },
    { id: 197, name: "Umbreon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png" },
    { id: 201, name: "Unown", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png" },
    { id: 202, name: "Wobbuffet", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/202.png" },
    { id: 243, name: "Raikou", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png" },
    { id: 244, name: "Entei", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png" },
    { id: 245, name: "Suicune", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png" },
    { id: 251, name: "Celebi", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/251.png" },
    { id: 282, name: "Gardevoir", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png" },
    { id: 303, name: "Mawile", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/303.png" },
    { id: 315, name: "Roselia", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/315.png" },
    { id: 335, name: "Zangoose", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/335.png" },
    { id: 359, name: "Absol", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/359.png" },
    { id: 384, name: "Rayquaza", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png" },
    { id: 393, name: "Piplup", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png" },
    { id: 403, name: "Shinx", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/403.png" },
    { id: 404, name: "Luxio", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/404.png" },
    { id: 405, name: "Luxray", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/405.png" },
    { id: 406, name: "Budew", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/406.png" },
    { id: 418, name: "Buizel", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/418.png" },
    { id: 445, name: "Garchomp", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png" },
    { id: 446, name: "Munchlax", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/446.png" },
    { id: 447, name: "Riolu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/447.png" },
    { id: 448, name: "Lucario", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" },
    { id: 470, name: "Leafeon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/470.png" },
    { id: 471, name: "Glaceon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/471.png" },
    { id: 475, name: "Gallade", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/475.png" },
    { id: 479, name: "Rotom", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/479.png" },
    { id: 492, name: "Shaymin", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/492.png" },
    { id: 493, name: "Arceus", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/493.png" },
    { id: 494, name: "Victini", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/494.png" },

    { id: 807, name: "Zeraora", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/807.png" },
    { id: 906, name: "Sprigatito", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/906.png" },
];

let codigoSecreto = [];
let seleccionUsuario = [null, null, null, null];
let pokemonPartida = [];

function elegirPokemonParaPartida() {
    const mezclados = [...POKEMON_DISPONIBLES].sort(() => 0.5 - Math.random());
    pokemonPartida = mezclados.slice(0, 6);
}

function generarCodigo() {
    elegirPokemonParaPartida();
    
    codigoSecreto = [];
    for (let i = 0; i < 4; i++) {
        const randomPoke = pokemonPartida[Math.floor(Math.random() * pokemonPartida.length)];
        codigoSecreto.push(randomPoke);
    }
    /*console.log("RESPUESTA:", codigoSecreto.map(p => p.name));*/
}

function inicializarInterfaz() {
    const listaSeleccion = document.getElementById("lista-seleccion");
    listaSeleccion.innerHTML = "";

    pokemonPartida.forEach(poke => {
        const img = document.createElement("img");
        img.src = poke.img;
        img.title = poke.name;
        img.className = "poke-opcion";
        img.onclick = () => seleccionarPokemon(poke);
        listaSeleccion.appendChild(img);
    });

    document.getElementById("btn-comprobar-codigo").onclick = comprobarIntento;
}

function seleccionarPokemon(poke) {
    const indiceVacio = seleccionUsuario.indexOf(null);
    if (indiceVacio !== -1) {
        seleccionUsuario[indiceVacio] = poke;
        const slot = document.getElementById(`slot-${indiceVacio}`);
        slot.innerHTML = `<img src="${poke.img}" width="50" title="Haz clic para quitar">`;
        slot.onclick = () => deseleccionarSlot(indiceVacio);
    }
}

function deseleccionarSlot(index) {
    seleccionUsuario[index] = null;
    document.getElementById(`slot-${index}`).innerHTML = "";
    document.getElementById(`slot-${index}`).onclick = null;
}

function comprobarIntento() {
    const feedback = document.getElementById("error-feedback");
    const errorBox = feedback.querySelector('.error-vibrar');

    if (seleccionUsuario.includes(null)) {
        feedback.style.display = "block";
        errorBox.classList.remove('active-shake');
        void errorBox.offsetWidth; 
        errorBox.classList.add('active-shake');
        setTimeout(() => { feedback.style.display = "none"; }, 10000);
        return; 
    }

    feedback.style.display = "none";

    const resultadoColores = [];
    const copiaCodigo = [...codigoSecreto];
    const copiaUsuario = [...seleccionUsuario];

    copiaUsuario.forEach((poke, i) => {
        if (poke.id === copiaCodigo[i].id) {
            resultadoColores[i] = "verde";
            copiaCodigo[i] = null;
            copiaUsuario[i] = "procesado";
        }
    });

    copiaUsuario.forEach((poke, i) => {
        if (poke !== "procesado") {
            const indexEnCodigo = copiaCodigo.findIndex(p => p && p.id === poke.id);
            if (indexEnCodigo !== -1) {
                resultadoColores[i] = "naranja";
                copiaCodigo[indexEnCodigo] = null;
            } else {
                resultadoColores[i] = "blanco";
            }
        }
    });

    mostrarIntentoEnPantalla(resultadoColores);
}

function mostrarIntentoEnPantalla(colores) {
    const historial = document.getElementById("intentos-historial");
    const fila = document.createElement("div");
    fila.className = "intento-fila";

    seleccionUsuario.forEach((poke, i) => {
        const div = document.createElement("div");
        div.className = `slot-resultado ${colores[i]}`;
        div.innerHTML = `<img src="${poke.img}" width="40">`;
        fila.appendChild(div);
    });

    historial.prepend(fila);

    if (colores.every(c => c === "verde")) {
        setTimeout(() => mostrarVictoria(true), 500);
    }

    seleccionUsuario = [null, null, null, null];
    for (let i = 0; i < 4; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.innerHTML = "";
        slot.onclick = null;
    }
}

function mostrarVictoria(victoria = true) {
    const modal = document.getElementById("modal-victoria");
    const titulo = document.getElementById("modal-titulo");
    const contenedorCodigo = document.getElementById("revelar-codigo");

    titulo.innerText = victoria ? "¡Acertaste!" : "¡Se acabaron los intentos!";
    titulo.style.color = victoria ? "#2e7d32" : "#da1616";

    contenedorCodigo.innerHTML = "";
    codigoSecreto.forEach(poke => {
        const div = document.createElement("div");
        div.className = "slot";
        div.style.borderColor = "#2e7d32";
        div.innerHTML = `<img src="${poke.img}" width="50">`;
        contenedorCodigo.appendChild(div);
    });

    modal.style.display = "flex";
}

generarCodigo();
inicializarInterfaz();