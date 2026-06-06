let POKEMON_DISPONIBLES = [];
async function loadDB() {
    try {
        const DB = await fetch('../json/pkmn.json');
        POKEMON_DISPONIBLES = await DB.json();

        generarCodigo();
        inicializarInterfaz(); 
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}
loadDB();

let configDificultad = "facil";
let configModo = "absoluta";
let permitirDuplicados = true;

let numOpcionesDisponibles = 6;
let numSlotsSecuencia = 4;

let codigoSecreto = [];
let seleccionUsuario = Array(4).fill(null);
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

    permitirDuplicados = form.elements["duplicados"] ? form.elements["duplicados"].checked : true;

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
    document.getElementById("modal-victoria").style.display = "none";
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
    pokemonPartida = [];
    let poolPokes = [...POKEMON_DISPONIBLES];
    
    while (pokemonPartida.length < numOpcionesDisponibles && poolPokes.length > 0) {
        const randomIndex = Math.floor(Math.random() * poolPokes.length);
        pokemonPartida.push(poolPokes.splice(randomIndex, 1)[0]);
    }

    codigoSecreto = [];
    while (codigoSecreto.length < numSlotsSecuencia) {
        const randomPoke = pokemonPartida[Math.floor(Math.random() * pokemonPartida.length)];
        
        if (permitirDuplicados || !codigoSecreto.includes(randomPoke)) {
            codigoSecreto.push(randomPoke);
        }
    }
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
