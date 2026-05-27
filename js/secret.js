const POKEMON_DISPONIBLES = [
    { id: 1, name: "Bulbasaur", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { id: 4, name: "Charmander", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { id: 7, name: "Squirtle", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { id: 25, name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { id: 37, name: "Vulpix", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png" },
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
    { id: 495, name: "Snivy", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/495.png" },
    { id: 498, name: "Tepig", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/498.png" },
    { id: 501, name: "Oshawott", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/501.png" },
    { id: 571, name: "Zoroark", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/571.png" },
    { id: 587, name: "Emolga", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/587.png" },
    { id: 643, name: "Reshiram", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/643.png" },
    { id: 644, name: "Zekrom", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/644.png" },
    { id: 658, name: "Greninja", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png" },
    { id: 676, name: "Furfrou", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/676.png" },
    { id: 700, name: "Sylveon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png" },
    { id: 701, name: "Hawlucha", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/701.png" },
    { id: 717, name: "Yveltal", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/717.png" },
    { id: 722, name: "Rowlet", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/722.png" },
    { id: 724, name: "Decidueye", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/724.png" },
    { id: 725, name: "Litten", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/725.png" },
    { id: 726, name: "Torracat", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/726.png" },
    { id: 727, name: "Incineroar", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png" },
    { id: 728, name: "Popplio", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/728.png" },
    { id: 744, name: "Rockruff", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/744.png" },
    { id: 778, name: "Mimikyu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/778.png" },
    { id: 791, name: "Solgaleo", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/791.png" },
    { id: 792, name: "Lunala", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/792.png" },
    { id: 807, name: "Zeraora", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/807.png" },
    { id: 813, name: "Scorbunny", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/813.png" },
    { id: 814, name: "Raboot", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/814.png" },
    { id: 815, name: "Cinderace", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/815.png" },
    { id: 816, name: "Sobble", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/816.png" },
    { id: 817, name: "Drizzile", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/817.png" },
    { id: 818, name: "Inteleon", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/818.png" },
    { id: 877, name: "Morpeko", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/877.png" },
    { id: 887, name: "Dragapult", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/887.png" },
    { id: 888, name: "Zacian", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/888.png" },
    { id: 889, name: "Zamazenta", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/889.png" },
    { id: 906, name: "Sprigatito", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/906.png" },
    { id: 907, name: "Floragato", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/907.png" },
    { id: 908, name: "Meowscarada", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/908.png" },
    { id: 909, name: "Fuecoco", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/909.png" },
    { id: 910, name: "Crocalor", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/910.png" },
    { id: 912, name: "Quaxly", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/912.png" },
    { id: 913, name: "Quaxwell", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/913.png" },
    { id: 937, name: "Ceruledge", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/937.png" },
    { id: 957, name: "Tinkatink", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/957.png" },
    { id: 958, name: "Tinkatuff", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/958.png" },
    { id: 959, name: "Tinkaton", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/959.png" },
    { id: 971, name: "Greavard", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/971.png" },
    { id: 1000, name: "Gholdengo", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1000.png" },
    { id: 1020, name: "Flamariete / Gouging Fire", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1020.png" },
    { id: 1024, name: "Terapagos", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1024.png" }
];

let configDificultad = "facil";
let configModo = "absoluta";

let numOpcionesDisponibles = 6;
let numSlotsSecuencia = 4;

let codigoSecreto = [];
let seleccionUsuario = [];
let pokemonPartida = [];

document.getElementById("btn-configuracion").onclick = () => {
    document.getElementById("modal-configuracion").style.display = "flex";
};

document.getElementById("btn-cerrar-config").onclick = () => {
    document.getElementById("modal-configuracion").style.display = "none";
};

document.getElementById("btn-guardar-config").onclick = () => {
    const form = document.getElementById("form-configuracion");
    configDificultad = form.elements["dificultad"].value;
    configModo = form.elements["modo"].value;

    if (configDificultad === "facil") {
        numOpcionesDisponibles = 6;
        numSlotsSecuencia = 4;
    } else if (configDificultad === "medio") {
        numOpcionesDisponibles = 8;
        numSlotsSecuencia = 4;
    } else if (configDificultad === "dificil") {
        numOpcionesDisponibles = 12;
        numSlotsSecuencia = 6;
    } else if (configDificultad === "extremo") {
        numOpcionesDisponibles = POKEMON_DISPONIBLES.length;
        numSlotsSecuencia = 4;
    }

    document.getElementById("modal-configuracion").style.display = "none";
    reiniciarPartidaCompleta();
};

function reiniciarPartidaCompleta() {
    document.getElementById("intentos-historial").innerHTML = "";
    generarCodigo();
    inicializarInterfaz();
}

function elegirPokemonParaPartida() {
    if (configDificultad === "extremo") {
        pokemonPartida = [...POKEMON_DISPONIBLES];
        return;
    }
    const mezclados = [...POKEMON_DISPONIBLES].sort(() => 0.5 - Math.random());
    pokemonPartida = mezclados.slice(0, numOpcionesDisponibles); 
}

function generarCodigo() {
    elegirPokemonParaPartida();
    
    seleccionUsuario = Array(numSlotsSecuencia).fill(null);
    
    codigoSecreto = [];
    for (let i = 0; i < numSlotsSecuencia; i++) {
        const randomPoke = pokemonPartida[Math.floor(Math.random() * pokemonPartida.length)];
        codigoSecreto.push(randomPoke);
    }
    /* console.log("RESPUESTA:", codigoSecreto.map(p => p.name)); */
}

function inicializarInterfaz() {
    const contenedorSlots = document.getElementById("contenedor-slots");
    contenedorSlots.innerHTML = "";
    
    for (let i = 0; i < numSlotsSecuencia; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.id = `slot-${i}`;
        slot.dataset.index = i;
        contenedorSlots.appendChild(slot);
    }

    const listaSeleccion = document.getElementById("lista-seleccion");
    listaSeleccion.innerHTML = "";

    if (configDificultad === "extremo") {
        const select = document.createElement("select");
        select.className = "select-pokemon-extremo";
        
        const defaultOpt = document.createElement("option");
        defaultOpt.text = "-- Selecciona un Pokémon --";
        defaultOpt.value = "";
        select.appendChild(defaultOpt);

        const ordenados = [...pokemonPartida].sort((a, b) => a.name.localeCompare(b.name));

        ordenados.forEach(poke => {
            const opt = document.createElement("option");
            opt.value = poke.id;
            opt.text = poke.name;
            select.appendChild(opt);
        });

        select.onchange = (e) => {
            const idSeleccionado = parseInt(e.target.value);
            const poke = POKEMON_DISPONIBLES.find(p => p.id === idSeleccionado);
            if (poke) {
                seleccionarPokemon(poke);
                select.value = "";
            }
        };
        listaSeleccion.appendChild(select);
    } else {
        pokemonPartida.forEach(poke => {
            const img = document.createElement("img");
            img.src = poke.img;
            img.title = poke.name;
            img.className = "poke-opcion";
            img.onclick = () => seleccionarPokemon(poke);
            listaSeleccion.appendChild(img);
        });
    }

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
        document.getElementById("error-texto").innerText = `❌ ¡Debes elegir exactamente ${numSlotsSecuencia} Pokémon antes de comprobar!`;
        feedback.style.display = "block";
        errorBox.classList.remove('active-shake');
        void errorBox.offsetWidth; 
        errorBox.classList.add('active-shake');
        setTimeout(() => { feedback.style.display = "none"; }, 10000);
        return; 
    }

    feedback.style.display = "none";

    let plenos = 0;
    let parciales = 0;
    const resultadoColores = [];
    const copiaCodigo = [...codigoSecreto];
    const copiaUsuario = [...seleccionUsuario];

    copiaUsuario.forEach((poke, i) => {
        if (poke.id === copiaCodigo[i].id) {
            plenos++;
            resultadoColores[i] = "verde";
            copiaCodigo[i] = null;
            copiaUsuario[i] = "procesado";
        }
    });

    copiaUsuario.forEach((poke, i) => {
        if (poke !== "procesado") {
            const indexEnCodigo = copiaCodigo.findIndex(p => p && p.id === poke.id);
            if (indexEnCodigo !== -1) {
                parciales++;
                resultadoColores[i] = "naranja";
                copiaCodigo[indexEnCodigo] = null;
            } else {
                resultadoColores[i] = "blanco";
            }
        }
    });

    mostrarIntentoEnPantalla(resultadoColores, plenos, parciales);
}

function mostrarIntentoEnPantalla(colores, plenos, parciales) {
    const historial = document.getElementById("intentos-historial");
    const fila = document.createElement("div");
    fila.className = "intento-fila";
    fila.style.flexDirection = "column";

    const contenedorSprites = document.createElement("div");
    contenedorSprites.style.display = "flex";
    contenedorSprites.style.gap = "10px";
    contenedorSprites.style.justifyContent = "center";

    seleccionUsuario.forEach((poke, i) => {
        const div = document.createElement("div");
        
        if (configModo === "absoluta") {
            div.className = `slot-resultado ${colores[i]}`;
        } else {
            div.className = `slot-resultado`;
            div.style.borderColor = "#ccc";
        }
        
        div.innerHTML = `<img src="${poke.img}" width="40">`;
        contenedorSprites.appendChild(div);
    });
    fila.appendChild(contenedorSprites);

    if (configModo === "oculta") {
        const divResumen = document.createElement("div");
        divResumen.className = "resumen-oculto";
        divResumen.style.marginTop = "8px";
        divResumen.innerHTML = `
            <span class="pista-indicador" style="color: #28a745;">🟢 Plenos: ${plenos}</span>
            <span class="pista-indicador" style="color: #ffc107;">🟡 Parciales: ${parciales}</span>
        `;
        fila.appendChild(divResumen);
    }

    historial.prepend(fila);

    if (plenos === numSlotsSecuencia) {
        setTimeout(() => mostrarVictoria(true), 500);
    }

    seleccionUsuario = Array(numSlotsSecuencia).fill(null);
    for (let i = 0; i < numSlotsSecuencia; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            slot.innerHTML = "";
            slot.onclick = null;
        }
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
