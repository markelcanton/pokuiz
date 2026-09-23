let allPreguntas = [];
let preguntas = [];
let pokemonList = [];

const JUGADOR_COLORES = [
    { classText: 'j-color-1', hex: '#2196F3' },
    { classText: 'j-color-2', hex: '#F44336' },
    { classText: 'j-color-3', hex: '#4CAF50' },
    { classText: 'j-color-4', hex: '#FFC107' }
];

let jugadores = [];
let numJugadoresSeleccionado = 1;
let jugadorActualIndex = 0;

let preguntaActual = null;
let canSkip = true;

let jugadorSeleccionandoAvatar = null;

Promise.all([
    fetch('json/pkmn.json').then(res => res.json()),
    fetch('json/quiz.json').then(res => res.json())
]).then(([pkmnData, quizData]) => {
    pokemonList = pkmnData;
    allPreguntas = quizData;
    inicializarSetupJugadores();
}).catch(err => console.error("Error al cargar datos JSON:", err));

function inicializarSetupJugadores() {
    const btns = document.querySelectorAll(".btn-num-j");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            btns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            numJugadoresSeleccionado = parseInt(btn.dataset.num);
            renderFormularioJugadores();
        });
    });

    renderFormularioJugadores();

    document.getElementById("btn-comenzar-juego").onclick = () => {
        jugadores = [];
        for (let i = 1; i <= numJugadoresSeleccionado; i++) {
            const nombreInput = document.getElementById(`nombre-j${i}`).value.trim();
            const avatarSelectedId = document.getElementById(`avatar-val-j${i}`).value;

            const nombre = nombreInput !== "" ? nombreInput : `Jugador ${i}`;

            let pkmnObj = pokemonList.find(p => p.id === (avatarSelectedId ? parseInt(avatarSelectedId) : 25));
            if (!pkmnObj) {
                pkmnObj = { name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" };
            }

            jugadores.push({
                nombre: nombre,
                avatar: pkmnObj.img,
                colorInfo: JUGADOR_COLORES[i - 1],
                respondidas: 0,
                puntos: 0,
                puntosMaximosPosibles: 0
            });
        }

        document.getElementById("modal-setup-jugadores").style.display = "none";
        jugadorActualIndex = 0;
        aplicarFiltros(true);
    };
}

function renderFormularioJugadores() {
    const container = document.getElementById("formulario-jugadores");
    let html = "";

    for (let i = 1; i <= numJugadoresSeleccionado; i++) {
        const colorClass = JUGADOR_COLORES[i - 1].classText;
        const defaultPkmn = pokemonList.find(p => p.id === 25) || { name: "Pikachu", img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" };

        html += `
            <div class="jugador-setup-card">
                <h4 class="${colorClass}">Jugador ${i}</h4>
                <div class="jugador-setup-fields">
                    <input type="text" id="nombre-j${i}" placeholder="Nombre del jugador" autocomplete="off">
                    
                    <input type="hidden" id="avatar-val-j${i}" value="25">
                    
                    <!-- Botón para abrir el submodal de selección de avatar -->
                    <button type="button" class="avatar-select-btn" onclick="abrirModalAvatar(${i})">
                        <span id="trigger-text-j${i}">${defaultPkmn.name}</span>
                        <img id="trigger-img-j${i}" src="${defaultPkmn.img}" alt="Avatar">
                    </button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function abrirModalAvatar(jugadorNum) {
    jugadorSeleccionandoAvatar = jugadorNum;

    const searchInput = document.getElementById("avatar-search-input");
    if (searchInput) searchInput.value = "";

    renderModalGridPokemon(pokemonList);

    const modal = document.getElementById("modal-selector-avatar");
    if (modal) {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add("show"), 10);
    }
}

function renderModalGridPokemon(lista) {
    const grid = document.getElementById("avatar-modal-grid");
    if (!grid) return;

    grid.innerHTML = lista.map(p => `
        <div class="pkmn-option" onclick="seleccionarAvatarModal(${p.id}, '${p.name.replace(/'/g, "\\'")}', '${p.img}')">
            <img src="${p.img}" alt="${p.name}">
            <span>${p.name}</span>
        </div>
    `).join('');
}

function seleccionarAvatarModal(id, name, img) {
    if (jugadorSeleccionandoAvatar !== null) {
        const valInput = document.getElementById(`avatar-val-j${jugadorSeleccionandoAvatar}`);
        const textSpan = document.getElementById(`trigger-text-j${jugadorSeleccionandoAvatar}`);
        const imgEl = document.getElementById(`trigger-img-j${jugadorSeleccionandoAvatar}`);

        if (valInput) valInput.value = id;
        if (textSpan) textSpan.innerText = name;
        if (imgEl) imgEl.src = img;
    }
    cerrarModalAvatar();
}

function cerrarModalAvatar() {
    const modal = document.getElementById("modal-selector-avatar");
    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.style.display = "none", 200);
    }
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById("error-filtro");
    const errorTexto = document.getElementById("error-texto");
    if (errorDiv && errorTexto) {
        errorTexto.innerText = mensaje;
        errorDiv.style.display = "flex";
        setTimeout(() => { errorDiv.style.animation = "none"; }, 400);
    }
}

function aplicarFiltros(esCargaInicial = false) {
    const catsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_categoria"]:checked')).map(cb => cb.value);
    const modsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_modalidad"]:checked')).map(cb => cb.value);
    const difsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_dificultad"]:checked')).map(cb => cb.value);
    const idiomaRadio = document.querySelector('input[name="f_idioma"]:checked');
    const idiomaSeleccionado = idiomaRadio ? idiomaRadio.value : "";

    if (!esCargaInicial && (catsSeleccionadas.length === 0 || modsSeleccionadas.length === 0 || difsSeleccionadas.length === 0)) {
        mostrarError("Debes seleccionar al menos una categoría, una modalidad y una dificultad.");
        return false;
    }

    const filtradas = allPreguntas.filter(p => {
        const coincideCat = Array.isArray(p.categoria)
            ? p.categoria.some(c => catsSeleccionadas.includes(c))
            : catsSeleccionadas.includes(p.categoria);
        const coincideMod = modsSeleccionadas.includes(p.modalidad);
        const coincideIdioma = p.idioma === idiomaSeleccionado;
        const coincideDificultad = difsSeleccionadas.includes(p.dificultad);

        return coincideCat && coincideMod && coincideIdioma && coincideDificultad;
    });

    if (filtradas.length === 0) {
        if (!esCargaInicial) mostrarError("No hay preguntas con esos filtros.");
        return false;
    }

    preguntas = [...filtradas];

    if (!esCargaInicial) {
        jugadores.forEach(j => {
            j.respondidas = 0;
            j.puntos = 0;
            j.puntosMaximosPosibles = 0;
        });
        jugadorActualIndex = 0;
    }

    actualizarMarcadores();
    mostrarPreguntaAleatoria();
    return true;
}

function actualizarMarcadores() {
    const mg = document.getElementById("marcadores-globales");
    const m = document.getElementById("marcadores");

    let catTexto = "—";
    let difTexto = "—";
    let difColorClass = "";

    if (preguntaActual) {
        if (Array.isArray(preguntaActual.categoria)) {
            catTexto = preguntaActual.categoria.join(", ");
        } else if (preguntaActual.categoria) {
            catTexto = preguntaActual.categoria;
        }

        if (preguntaActual.dificultad) {
            difTexto = preguntaActual.dificultad;
            const difLower = difTexto.toLowerCase().trim();

            if (difLower.includes("fácil") || difLower.includes("facil")) {
                difColorClass = "dif-facil";
            } else if (difLower.includes("normal") || difLower.includes("media")) {
                difColorClass = "dif-normal";
            } else if (difLower.includes("difícil") || difLower.includes("dificil")) {
                difColorClass = "dif-dificil";
            }
        }
    }

    if (mg) {
        mg.innerHTML = `
            <div class="marcador-card-individual">
                <div class="marcador-label">CATEGORÍA</div>
                <div class="marcador-value">${catTexto}</div>
            </div>
            <div class="marcador-card-individual">
                <div class="marcador-label">DIFICULTAD</div>
                <div class="marcador-value ${difColorClass}">${difTexto}</div>
            </div>
        `;
    }

    if (!m || !jugadores || jugadores.length === 0) return;

    m.innerHTML = jugadores.map((j, idx) => {
        const nota = j.puntosMaximosPosibles > 0 ? (j.puntos / j.puntosMaximosPosibles) * 10 : 0;
        const notaTexto = j.respondidas === 0 ? "—" : `${Number(nota.toFixed(1))} / 10`;
        const colorNota = j.respondidas === 0 ? '#333' : (nota < 5 ? '#da1616' : '#2e7d32');
        const esTurnoActivo = idx === jugadorActualIndex;

        return `
            <div class="jugador-card-marcador ${j.colorInfo.classText} ${esTurnoActivo ? 'turn-active' : ''}" 
                 style="--j-glow-color: ${j.colorInfo.hex};">
                <img src="${j.avatar}" class="jugador-avatar" alt="Avatar de ${j.nombre}">
                <div class="jugador-nombre ${j.colorInfo.classText}">${j.nombre}</div>
                <div class="jugador-stats">
                    <div class="jugador-stat-item">
                        <span>Respondidas</span>
                        <span>${j.respondidas}</span>
                    </div>
                    <div class="jugador-stat-item">
                        <span>Puntos</span>
                        <span>${Number(j.puntos.toFixed(2))}</span>
                    </div>
                    <div class="jugador-stat-item">
                        <span>Nota final</span>
                        <span style="color:${colorNota}">${notaTexto}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const modalFiltros = document.getElementById("modal-filtros");
    const btnAbrirFiltros = document.getElementById("btn-abrir-filtros");
    const btnCerrarFiltros = document.getElementById("btn-cerrar-filtros");
    const errorDiv = document.getElementById("error-filtro");

    const btnAplicarFiltros = document.getElementById("btn-aplicar-filtros");
    const btnRestablecerFiltros = document.getElementById("btn-restablecer-filtros");

    if (btnAbrirFiltros) {
        btnAbrirFiltros.onclick = () => {
            if (errorDiv) errorDiv.style.display = "none";
            modalFiltros.style.display = "flex";
            setTimeout(() => modalFiltros.classList.add("show"), 10);
        };
    }

    const cerrarModalFiltros = () => {
        if (modalFiltros) {
            modalFiltros.classList.remove("show");
            setTimeout(() => modalFiltros.style.display = "none", 300);
        }
    };

    if (btnCerrarFiltros) btnCerrarFiltros.onclick = cerrarModalFiltros;

    if (btnRestablecerFiltros) {
        btnRestablecerFiltros.addEventListener("click", () => {
            document.querySelectorAll('input[name="f_categoria"]').forEach(cb => cb.checked = true);
            document.querySelectorAll('input[name="f_modalidad"]').forEach(cb => cb.checked = true);
            document.querySelectorAll('input[name="f_dificultad"]').forEach(cb => cb.checked = true);

            const radioEs = document.querySelector('input[name="f_idioma"][value="Español-ES"]');
            if (radioEs) radioEs.checked = true;

            if (errorDiv) errorDiv.style.display = "none";
        });
    }

    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener("click", () => {
            const exito = aplicarFiltros(false);
            if (exito) cerrarModalFiltros();
        });
    }

    const btnCerrarAvatar = document.getElementById("btn-cerrar-avatar-modal");
    if (btnCerrarAvatar) {
        btnCerrarAvatar.onclick = cerrarModalAvatar;
    }

    const searchInputAvatar = document.getElementById("avatar-search-input");
    if (searchInputAvatar) {
        searchInputAvatar.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtrados = pokemonList.filter(p => p.name.toLowerCase().includes(term));
            renderModalGridPokemon(filtrados);
        });
    }
});

function mostrarPreguntaAleatoria() {
    const cont = document.getElementById("contenedor-pregunta");
    cont.classList.remove("visible");
    cont.style.display = "none";
    canSkip = true;

    setTimeout(() => {
        const idx = Math.floor(Math.random() * preguntas.length);
        preguntaActual = preguntas[idx];

        actualizarMarcadores();

        const jugadorActual = jugadores[jugadorActualIndex];

        const tituloTurno = document.getElementById("turno-jugador-titulo");
        if (tituloTurno) {
            tituloTurno.textContent = jugadorActual.nombre;
            tituloTurno.style.color = jugadorActual.colorInfo.hex;
        }

        document.getElementById("pregunta").textContent = preguntaActual.pregunta;
        document.getElementById("resultado").innerHTML = "";

        const imgCont = document.getElementById("contenedor-imagen");
        imgCont.innerHTML = preguntaActual.img ? `<img src="${preguntaActual.img}" style="width:140px; display:block; margin:0 auto 15px;">` : "";

        const inputDiv = document.getElementById("input-dinamico");
        inputDiv.innerHTML = "";
        inputDiv.className = "";

        if (preguntaActual.tipo === "clasificar") {
            const dragList = document.createElement("div");
            dragList.className = "drag-container";
            const opcionesMezcladas = [...preguntaActual.opciones].sort(() => Math.random() - 0.5);

            let firstSelected = null;

            opcionesMezcladas.forEach(opc => {
                const item = document.createElement("div");
                item.className = "drag-item";
                item.draggable = true;
                item.dataset.id = opc.id;
                item.innerHTML = `<img src="${opc.img}" draggable="false"> <span>${opc.nombre}</span>`;

                item.addEventListener('click', function () {
                    if (document.getElementById('btn-nueva').style.display !== "none") return;

                    if (!firstSelected) {
                        firstSelected = this;
                        this.classList.add('selected-for-swap');
                    } else if (firstSelected === this) {
                        this.classList.remove('selected-for-swap');
                        firstSelected = null;
                    } else {
                        const idAux = this.dataset.id;
                        const htmlAux = this.innerHTML;

                        this.dataset.id = firstSelected.dataset.id;
                        this.innerHTML = firstSelected.innerHTML;

                        firstSelected.dataset.id = idAux;
                        firstSelected.innerHTML = htmlAux;

                        firstSelected.classList.remove('selected-for-swap');
                        firstSelected = null;
                    }
                });

                item.addEventListener('dragstart', () => item.classList.add('dragging'));
                item.addEventListener('dragend', () => item.classList.remove('dragging'));
                dragList.appendChild(item);
            });

            dragList.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(dragList, e.clientY);
                const dragging = document.querySelector('.dragging');
                if (dragging) {
                    if (afterElement == null) dragList.appendChild(dragging);
                    else dragList.insertBefore(dragging, afterElement);
                }
            });
            inputDiv.appendChild(dragList);
        }
        else if (preguntaActual.tipo === "multi") {
            const wrap = document.createElement("div");
            const tieneImagenes = preguntaActual.campos.some(c => c.img);
            wrap.className = tieneImagenes ? "multi-grid-container" : "multi-container";

            preguntaActual.campos.forEach(c => {
                const imgHTML = c.img ? `<img src="${c.img}" style="width:80px; display:block; margin:0 auto;">` : "";
                wrap.innerHTML += `
                    <div class="multi-row">
                        <div class="multi-content">
                            ${imgHTML}
                            <span class="multi-label">${c.label}</span>
                        </div>
                        <input type="${c.tipo}" id="${c.id}" autocomplete="off">
                    </div>`;
            });
            inputDiv.appendChild(wrap);
        }
        else if (preguntaActual.tipo === "radio" || preguntaActual.tipo === "checkbox") {
            inputDiv.className = "grid-opciones";
            preguntaActual.opciones.forEach((op, i) => {
                const img = preguntaActual.opciones_img?.[i] ? `<img src="${preguntaActual.opciones_img[i]}" style="width:60px;"><br>` : "";
                inputDiv.innerHTML += `
                    <label class="opcion-box">
                        ${img}
                        <input type="${preguntaActual.tipo}" name="opt" value="${i}"> 
                        ${op}
                    </label>`;
            });
        } else if (preguntaActual.tipo === "unir") {
            inputDiv.className = "unir-container-wrapper";

            const paletaColores = ['#d5f5e3', '#d6eaf8', '#fcf3cf', '#f5eef8', '#fadbd8', '#e8f8f5', '#eaf2f8', '#fef9e7', '#f4ecf7', '#fdedec'];
            let itemSeleccionado = null;
            let conexiones = {};
            let colorIndex = 0;

            const mezclar = (arr) => [...arr].sort(() => Math.random() - 0.5);
            const generarColHTML = (id, items) => `
                <div class="unir-columna" id="${id}">
                    ${items.map(txt => `<div class="unir-item" data-col="${id === 'unir-izq' ? 'izq' : 'der'}" data-val="${txt}">${txt}</div>`).join('')}
                </div>
            `;

            inputDiv.innerHTML = `
                <div class="unir-columnas-flex">
                    ${generarColHTML('unir-izq', mezclar(preguntaActual.opciones_izq))}
                    ${generarColHTML('unir-der', mezclar(preguntaActual.opciones_der))}
                </div>
            `;

            inputDiv.querySelectorAll('.unir-item').forEach(item => {
                item.addEventListener('click', function () {
                    if (document.getElementById('btn-nueva').style.display !== "none") return;

                    if (this.classList.contains('paired')) {
                        const val = this.dataset.val;
                        const valIzq = this.dataset.col === 'izq'
                            ? val
                            : Object.keys(conexiones).find(k => conexiones[k].val_der === val);

                        if (!valIzq) return;

                        const elIzq = inputDiv.querySelector(`#unir-izq [data-val="${valIzq}"]`);
                        const elDer = inputDiv.querySelector(`#unir-der [data-val="${conexiones[valIzq].val_der}"]`);

                        [elIzq, elDer].forEach(el => {
                            if (el) {
                                el.classList.remove('paired');
                                el.style.removeProperty('background-color');
                            }
                        });
                        delete conexiones[valIzq];
                        return;
                    }

                    if (!itemSeleccionado || itemSeleccionado.dataset.col === this.dataset.col) {
                        if (itemSeleccionado) itemSeleccionado.classList.remove('selected');
                        if (itemSeleccionado === this) {
                            itemSeleccionado = null;
                        } else {
                            itemSeleccionado = this;
                            itemSeleccionado.classList.add('selected');
                        }
                        return;
                    }

                    const elIzq = itemSeleccionado.dataset.col === 'izq' ? itemSeleccionado : this;
                    const elDer = itemSeleccionado.dataset.col === 'der' ? itemSeleccionado : this;

                    const colorAsignado = paletaColores[colorIndex % paletaColores.length];
                    colorIndex++;

                    [elIzq, elDer].forEach(el => {
                        el.classList.remove('selected');
                        el.classList.add('paired');
                        el.style.backgroundColor = colorAsignado;
                    });

                    conexiones[elIzq.dataset.val] = { val_der: elDer.dataset.val };
                    itemSeleccionado = null;
                });
            });
        }
        else {
            inputDiv.innerHTML = `<div class="input-simple-container"><input type="text" id="main_input" autocomplete="off" placeholder="Introduce tu respuesta aquí"></div>`;
        }

        cont.style.display = "block";
        void cont.offsetWidth;
        cont.classList.add("visible");

        document.getElementById("btn-comprobar").style.display = "inline-block";
        document.getElementById("btn-saltar").style.display = "inline-block";
        document.getElementById("btn-abrir-filtros").style.display = "inline-block";
        document.getElementById("btn-nueva").style.display = "none";

        const modalRes = document.getElementById("modal-resultado");
        if (modalRes) {
            modalRes.classList.remove("show");
            modalRes.style.display = "none";
        }
    }, 50);
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.getElementById("btn-comprobar").onclick = () => {
    let notaP = 0;
    let solHTML = "";
    let maxPuntosPregunta = 0;

    if (preguntaActual.tipo === "clasificar") {
        maxPuntosPregunta = preguntaActual.puntuacion?.total || 1;
        const puntosPorElemento = preguntaActual.puntuacion?.por_elemento || (maxPuntosPregunta / preguntaActual.opciones.length);
        const ordenUsuario = [...document.querySelectorAll('.drag-item')].map(el => el.dataset.id);
        const esCorrecto = JSON.stringify(ordenUsuario) === JSON.stringify(preguntaActual.correcta);

        preguntaActual.correcta.forEach((idCorrecto, index) => {
            if (ordenUsuario[index] === idCorrecto) notaP += puntosPorElemento;
        });

        if (esCorrecto) notaP = maxPuntosPregunta;
        solHTML = `El orden correcto era: <br><b>${preguntaActual.correcta.join(" → ")}</b>`;
    }
    else if (preguntaActual.tipo === "multi") {
        let lineas = [];
        preguntaActual.campos.forEach(c => {
            const valorCampo = (preguntaActual.puntuacion?.por_campo || c.puntos || 0.25);
            maxPuntosPregunta += valorCampo;

            const v = document.getElementById(c.id).value.trim().toLowerCase();
            const ok = Array.isArray(c.correcta) ? c.correcta.map(x => x.toString().toLowerCase()) : [c.correcta.toString().toLowerCase()];

            if (ok.includes(v)) notaP += valorCampo;
            lineas.push(`• ${c.label}: <b>${Array.isArray(c.correcta) ? c.correcta[0] : c.correcta}</b>`);
        });
        solHTML = '<b>Las correctas eran:</b> <p></p>' + lineas.join("<br>");
    }
    else if (preguntaActual.tipo === "radio") {
        maxPuntosPregunta = preguntaActual.puntuacion?.total || 1;
        const s = document.querySelector('input[name="opt"]:checked');
        if (s && parseInt(s.value) === preguntaActual.correcta) notaP = maxPuntosPregunta;
        solHTML = `La respuesta correcta era: <b>${preguntaActual.opciones[preguntaActual.correcta]}</b>`;
    }
    else if (preguntaActual.tipo === "checkbox") {
        const valorPorOpcion = preguntaActual.puntuacion?.por_opcion || 0.33;
        maxPuntosPregunta = preguntaActual.correctas.length * valorPorOpcion;
        const seleccionados = Array.from(document.querySelectorAll('input[name="opt"]:checked')).map(e => parseInt(e.value));

        preguntaActual.opciones.forEach((_, i) => {
            if (preguntaActual.correctas.includes(i)) {
                if (seleccionados.includes(i)) notaP += valorPorOpcion;
            } else {
                if (seleccionados.includes(i)) notaP -= valorPorOpcion;
            }
        });
        solHTML = `Las correctas eran: <b>${preguntaActual.correctas.map(i => preguntaActual.opciones[i]).join(", ")}</b>`;
    } else if (preguntaActual.tipo === "unir") {
        maxPuntosPregunta = preguntaActual.puntuacion?.total || 1;
        const totalParejas = Object.keys(preguntaActual.correcta).length;
        const puntosPorPareja = maxPuntosPregunta / totalParejas;
        let lineasSolucion = [];

        Object.keys(preguntaActual.correcta).forEach(izqKey => {
            const derCorrecto = preguntaActual.correcta[izqKey];
            const itemsUnidos = Array.from(document.querySelectorAll('#unir-izq .unir-item.paired'));
            const tieneParejaCorrecta = itemsUnidos.some(el => {
                if (el.dataset.val === izqKey) {
                    const colorIzq = el.style.backgroundColor;
                    const elDer = Array.from(document.querySelectorAll('#unir-der .unir-item.paired'))
                        .find(d => d.style.backgroundColor === colorIzq);
                    return elDer && elDer.dataset.val === derCorrecto;
                }
                return false;
            });

            if (tieneParejaCorrecta) notaP += puntosPorPareja;
            lineasSolucion.push(`• ${izqKey} ↔ <b>${derCorrecto}</b>`);
        });

        solHTML = `Las uniones correctas eran:<br>${lineasSolucion.join('<br>')}`;
    }
    else {
        maxPuntosPregunta = preguntaActual.puntuacion?.total || 1;
        const v = document.getElementById("main_input").value.trim().toLowerCase();
        const ok = Array.isArray(preguntaActual.correcta) ? preguntaActual.correcta.map(x => x.toString().toLowerCase()) : [preguntaActual.correcta.toString().toLowerCase()];
        if (ok.includes(v)) notaP = maxPuntosPregunta;
        solHTML = `La respuesta era: <b>${Array.isArray(preguntaActual.correcta) ? preguntaActual.correcta[0] : preguntaActual.correcta}</b>`;
    }

    if (notaP < 0) notaP = 0;
    if (notaP > maxPuntosPregunta) notaP = maxPuntosPregunta;

    const jActual = jugadores[jugadorActualIndex];
    jActual.respondidas++;
    jActual.puntos += notaP;
    jActual.puntosMaximosPosibles += maxPuntosPregunta;

    actualizarMarcadores();

    const esCorrecto = notaP >= maxPuntosPregunta;
    const esParcial = notaP > 0 && notaP < maxPuntosPregunta;

    document.getElementById("resultado").innerHTML = `
        <div class="feedback-header" style="color:${esCorrecto ? '#2e7d32' : (esParcial ? '#f39c12' : '#da1616')}">
            ${esCorrecto ? '¡CORRECTO!' : (esParcial ? 'PARCIALMENTE CORRECTO' : 'INCORRECTO')} (+${notaP.toFixed(2)} pts)
        </div>
        <div class="solucion-box">${solHTML}</div>`;

    canSkip = false;
    document.getElementById("btn-comprobar").style.display = "none";
    document.getElementById("btn-saltar").style.display = "none";
    document.getElementById("btn-abrir-filtros").style.display = "none";
    document.getElementById("btn-nueva").style.display = "inline-block";

    document.querySelectorAll(".drag-item").forEach(el => el.draggable = false);
    document.querySelectorAll("#input-dinamico input").forEach(i => i.disabled = true);

    const modalRes = document.getElementById("modal-resultado");
    modalRes.style.display = "flex";
    setTimeout(() => modalRes.classList.add("show"), 10);
};

document.getElementById("btn-saltar").onclick = () => {
    if (canSkip) mostrarPreguntaAleatoria();
};

document.getElementById("btn-nueva").onclick = () => {
    jugadorActualIndex = (jugadorActualIndex + 1) % jugadores.length;
    mostrarPreguntaAleatoria();
};
