let allPreguntas = [];
let preguntas = [];
let respondidas = 0;
let puntos = 0;
let puntosMaximosPosibles = 0;
let preguntaActual = null;
let canSkip = true;

fetch('../json/preguntas.json')
.then(response => response.json())
.then(data => {
    allPreguntas = data;
    aplicarFiltros(true);
});

function aplicarFiltros(esCargaInicial = false) {
    const catsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_categoria"]:checked')).map(cb => cb.value);
    const modsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_modalidad"]:checked')).map(cb => cb.value);
    const idiomaRadio = document.querySelector('input[name="f_idioma"]:checked');
    const idiomaSeleccionado = idiomaRadio ? idiomaRadio.value : "";

    if (!esCargaInicial && (catsSeleccionadas.length === 0 || modsSeleccionadas.length === 0)) {
        mostrarError("Debes seleccionar al menos una categoría y una modalidad.");
        return false;
    }

    const filtradas = allPreguntas.filter(p => {
        const coincideCat = Array.isArray(p.categoria) 
            ? p.categoria.some(c => catsSeleccionadas.includes(c))
            : catsSeleccionadas.includes(p.categoria);
        const coincideMod = modsSeleccionadas.includes(p.modalidad);
        const coincideIdioma = p.idioma === idiomaSeleccionado;
        return coincideCat && coincideMod && coincideIdioma;
    });

    if (filtradas.length === 0) {
        if (!esCargaInicial) mostrarError("No hay preguntas con esos filtros.");
        return false;
    }

    preguntas = [...filtradas];
    respondidas = 0;
    puntos = 0;
    puntosMaximosPosibles = 0;

    actualizarMarcadores(); 
    mostrarPreguntaAleatoria(); 
    return true;
}

function actualizarMarcadores() {
    const m = document.getElementById("marcadores");
    if (!m) return;
    
    if (respondidas === 0) {
        m.innerHTML = `
            <div class="marcador-box" style="min-width: 250px;">
                <span class="marcador-label"></span>
                <span class="marcador-value" style="font-style: italic; font-size: 1.1rem;">Responde para ver tu nota</span>
            </div>
        `;
        return;
    }
    
    const nota = puntosMaximosPosibles > 0 ? (puntos / puntosMaximosPosibles) * 10 : 0;
    
    m.innerHTML = `
        <div class="marcador-box">
            <span class="marcador-label">Respondidas:</span>
            <span class="marcador-value">${respondidas}</span>
        </div>
        <div class="marcador-box">
            <span class="marcador-label">Puntos:</span>
            <span class="marcador-value">${Number(puntos.toFixed(2))}</span>
        </div>
        <div class="marcador-box">
            <span class="marcador-label">Nota final:</span>
            <span class="marcador-value" style="color:${nota < 5 ? '#da1616' : '#2e7d32'}">
                ${Number(nota.toFixed(1))} / 10
            </span>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("modal-filtros");
    const btnAbrir = document.getElementById("btn-abrir-filtros");
    const btnCerrar = document.getElementById("btn-cerrar-filtros");
    const errorDiv = document.getElementById("error-filtro");
    const errorTexto = document.getElementById("error-texto");

    const btnAplicar = document.getElementById("btn-aplicar-filtros");
    const btnRestablecer = document.getElementById("btn-restablecer-filtros");

    function mostrarError(mensaje) {
        errorTexto.innerText = mensaje;
        errorDiv.style.display = "flex";
        setTimeout(() => { errorDiv.style.animation = "none"; }, 400);
    }

    btnAbrir.onclick = () => {
        errorDiv.style.display = "none";
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add("show"), 10);
    };

    const cerrarModal = () => {
        modal.classList.remove("show");
        setTimeout(() => modal.style.display = "none", 300);
    };
    btnCerrar.onclick = cerrarModal;

    btnRestablecer.addEventListener("click", () => {
        document.querySelectorAll('input[name="f_categoria"]').forEach(cb => cb.checked = true);
        document.querySelectorAll('input[name="f_modalidad"]').forEach(cb => cb.checked = true);
        const radioEs = document.querySelector('input[name="f_idioma"][value="Español europeo"]');
        if (radioEs) radioEs.checked = true;
        
        errorDiv.style.display = "none";
    });

    btnAplicar.addEventListener("click", () => {
        const catsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_categoria"]:checked')).map(cb => cb.value);
        const modsSeleccionadas = Array.from(document.querySelectorAll('input[name="f_modalidad"]:checked')).map(cb => cb.value);
        const idiomaRadio = document.querySelector('input[name="f_idioma"]:checked');
        const idiomaSeleccionado = idiomaRadio ? idiomaRadio.value : "";

        if (catsSeleccionadas.length === 0 || modsSeleccionadas.length === 0) {
            mostrarError("Debes seleccionar al menos una categoría y una modalidad.");
            return;
        }

        const filtradas = allPreguntas.filter(p => {
            const coincideCat = Array.isArray(p.categoria) 
                ? p.categoria.some(c => catsSeleccionadas.includes(c))
                : catsSeleccionadas.includes(p.categoria);
            const coincideMod = modsSeleccionadas.includes(p.modalidad);
            const coincideIdioma = p.idioma === idiomaSeleccionado;
            return coincideCat && coincideMod && coincideIdioma;
        });

        if (filtradas.length === 0) {
            mostrarError("No hay preguntas con esos filtros.");
            return;
        }

        preguntas = [...filtradas];
        respondidas = 0;
        puntos = 0;
        puntosMaximosPosibles = 0;

        actualizarMarcadores(); 
        mostrarPreguntaAleatoria(); 
        
        cerrarModal();
    });
});

function mostrarPreguntaAleatoria() {
    const cont = document.getElementById("contenedor-pregunta");
    cont.classList.remove("visible");
    cont.style.display = "none";
    canSkip = true;

    setTimeout(() => {
        const idx = Math.floor(Math.random() * preguntas.length);
        preguntaActual = preguntas[idx];

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

                item.addEventListener('click', function() {
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

            // 1. Renderizar columnas mezcladas
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

            // 2. Eventos de clic para los elementos
            inputDiv.querySelectorAll('.unir-item').forEach(item => {
                item.addEventListener('click', function() {
                    if (document.getElementById('btn-nueva').style.display !== "none") return;

                    // Si ya está unido, romper la unión al pulsar
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

                    // Manejo de selecciones y cancelaciones
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

                    // Crear unión válida
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
            inputDiv.innerHTML = `<div class="input-simple-container"><input type="text" id="main_input" autocomplete="off" placeholder="Escribe aquí..."></div>`;
        }

        cont.style.display = "block";
        void cont.offsetWidth; 
        cont.classList.add("visible");

        document.getElementById("btn-comprobar").style.display = "inline-block";
        document.getElementById("btn-saltar").style.display = "inline-block";
        document.getElementById("btn-abrir-filtros").style.display = "inline-block";
        document.getElementById("btn-nueva").style.display = "none";
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
            if (ordenUsuario[index] === idCorrecto) {
                notaP += puntosPorElemento;
            }
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
            const ok = Array.isArray(c.correcta) ? c.correcta.map(x=>x.toString().toLowerCase()) : [c.correcta.toString().toLowerCase()];
            
            if (ok.includes(v)) notaP += valorCampo;
            lineas.push(`• ${c.label}: <b>${Array.isArray(c.correcta) ? c.correcta[0] : c.correcta}</b>`);
        });
        solHTML = lineas.join("<br>");
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
        
        // Recorremos las respuestas correctas definidas en el JSON
        Object.keys(preguntaActual.correcta).forEach(izqKey => {
            const derCorrecto = preguntaActual.correcta[izqKey];
            
            // Buscamos si el usuario llegó a unir este elemento izquierdo en la interfaz
            const itemIzqElement = document.querySelector(`#unir-izq [data-val="${izqKey}"]`);
            
            // Para comprobar la respuesta de forma segura en el DOM tras jugar:
            if (itemIzqElement && itemIzqElement.classList.contains('paired')) {
                // Conseguimos el color o el estado verificando de forma dinámica con los elementos del DOM
                // Pero para asegurar la nota usamos la lógica del estado final de los elementos visuales
            }
            
            // Nota: Mapeamos los elementos emparejados visualmente para ver si coinciden con el JSON
            const itemsUnidos = Array.from(document.querySelectorAll('#unir-izq .unir-item.paired'));
            const tieneParejaCorrecta = itemsUnidos.some(el => {
                if (el.dataset.val === izqKey) {
                    // Encontrar qué elemento de la derecha comparte su mismo color de fondo
                    const colorIzq = el.style.backgroundColor;
                    const elDer = Array.from(document.querySelectorAll('#unir-der .unir-item.paired'))
                                       .find(d => d.style.backgroundColor === colorIzq);
                    return elDer && elDer.dataset.val === derCorrecto;
                }
                return false;
            });

            if (tieneParejaCorrecta) {
                notaP += puntosPorPareja;
            }
            lineasSolucion.push(`• ${izqKey} ↔ <b>${derCorrecto}</b>`);
        });

        solHTML = `Las uniones correctas eran:<br>${lineasSolucion.join('<br>')}`;
    }
    else {
        maxPuntosPregunta = preguntaActual.puntuacion?.total || 1;
        const v = document.getElementById("main_input").value.trim().toLowerCase();
        const ok = Array.isArray(preguntaActual.correcta) ? preguntaActual.correcta.map(x=>x.toString().toLowerCase()) : [preguntaActual.correcta.toString().toLowerCase()];
        if (ok.includes(v)) notaP = maxPuntosPregunta;
        solHTML = `La respuesta era: <b>${Array.isArray(preguntaActual.correcta) ? preguntaActual.correcta[0] : preguntaActual.correcta}</b>`;
    }

    if (notaP < 0) notaP = 0;
    if (notaP > maxPuntosPregunta) notaP = maxPuntosPregunta;

    respondidas++;
    puntos += notaP;
    puntosMaximosPosibles += maxPuntosPregunta;
    
    actualizarMarcadores();

    const esCorrecto = notaP >= maxPuntosPregunta;
    const esParcial = notaP > 0 && notaP < maxPuntosPregunta;

    document.getElementById("resultado").innerHTML = `
        <div class="feedback-header" style="color:${esCorrecto ? '#2e7d32' : (esParcial ? '#f39c12' : '#da1616')}">
            ${esCorrecto ? '¡CORRECTO!' : (esParcial ? 'ACERTADO DE FORMA PARCIAL' : 'INCORRECTO')} (+${notaP.toFixed(2)} pts)
        </div>
        <div class="solucion-box">${solHTML}</div>`;

    canSkip = false; 
    document.getElementById("btn-comprobar").style.display = "none";
    document.getElementById("btn-saltar").style.display = "none";
    document.getElementById("btn-abrir-filtros").style.display = "none";
    document.getElementById("btn-nueva").style.display = "inline-block";

    document.querySelectorAll(".drag-item").forEach(el => el.draggable = false);
    document.querySelectorAll("#input-dinamico input").forEach(i => i.disabled = true);
};

document.getElementById("btn-saltar").onclick = () => { if (canSkip) mostrarPreguntaAleatoria(); };
document.getElementById("btn-nueva").onclick = mostrarPreguntaAleatoria;
