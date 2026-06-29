let pokemonData = [];
let currentPokemon = null;
let targetHexColor = "#808080";
let isGameOver = false;

const pokeCanvas = document.getElementById('pokeCanvas');
const layerSkin = document.getElementById('layerSkin');
const layerDetails = document.getElementById('layerDetails');
const resultMessage = document.getElementById('resultMessage');
const actionBtn = document.getElementById('actionBtn');

const rSlider = document.getElementById('red'), gSlider = document.getElementById('green'), bSlider = document.getElementById('blue');
const rVal = document.getElementById('rVal'), gVal = document.getElementById('gVal'), bVal = document.getElementById('bVal');
const hexValue = document.getElementById('hexValue');

actionBtn.addEventListener('click', () => {
    /*if (isGameOver) {
        startNewRound();
    } else {
        checkColorAttempt();
    }*/

    if (!isGameOver) {
        checkColorAttempt();
    }
});

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function calculateSimilarity(hex1, hex2) {
    const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
    const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
    const distance = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    return ((1 - (distance / 441.67)) * 100).toFixed(1);
}

function updateLiveColor() {
    if (isGameOver) return;

    const r = parseInt(rSlider.value);
    const g = parseInt(gSlider.value);
    const b = parseInt(bSlider.value);

    rVal.textContent = r; gVal.textContent = g; bVal.textContent = b;
    const currentHex = rgbToHex(r, g, b);
    hexValue.textContent = currentHex;

    layerSkin.style.backgroundColor = currentHex;
}

function setSlidersDisabled(disabledState) {
    rSlider.disabled = disabledState;
    gSlider.disabled = disabledState;
    bSlider.disabled = disabledState;
}

async function initGame() {
    /*resultMessage.textContent = 'Cargando datos de pkmn.json...';*/
    try {
        const response = await fetch('../json/pkmn.json');
        /*if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
        }*/
        pokemonData = await response.json();

        [rSlider, gSlider, bSlider].forEach(slider => {
            slider.addEventListener('input', updateLiveColor);
        });
        
        startNewRound();
    } catch (error) {
        console.error(error);
        /*resultMessage.innerHTML = `<span style="color: #ff4a4a;">Error al cargar el archivo JSON.<br>Asegúrate de estar usando un servidor local (Live Server).</span>`;*/
    }
}

function startNewRound() {
    if (pokemonData.length === 0) return;

    const modal = document.getElementById('modal-anticheat-fixed');
    if (modal) modal.remove();

    isGameOver = false;
    /*resultMessage.textContent = 'Analizando escala HEX...';*/
    actionBtn.textContent = "COMPROBAR";
    actionBtn.disabled = true;

    setSlidersDisabled(false);

    rSlider.value = 128;
    gSlider.value = 128;
    bSlider.value = 128;

    pokeCanvas.classList.remove('revealed');

    const randomIndex = Math.floor(Math.random() * pokemonData.length);
    currentPokemon = pokemonData[randomIndex];

    layerSkin.style.webkitMaskImage = `url('${currentPokemon.img}')`;
    layerSkin.style.maskImage = `url('${currentPokemon.img}')`;

    layerDetails.src = currentPokemon.img;
    layerSkin.style.setProperty('--poke-img', `url('${currentPokemon.img}')`);

    layerDetails.onload = function () {
        extractDominantColor(layerDetails);

        updateLiveColor();

        resultMessage.textContent = '';
        actionBtn.disabled = false;
    };
}

function extractDominantColor(imgElement) {
    const canvas = document.getElementById('colorExtractorCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let rSum = 0, gSum = 0, bSum = 0, count = 0;

    for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2], a = imgData[i + 3];
        if (a > 200 && (r + g + b > 100) && (r + g + b < 700)) {
            rSum += r; gSum += g; bSum += b; count++;
        }
    }

    if (count > 0) {
        targetHexColor = rgbToHex(Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count));
    } else {
        targetHexColor = "#808080";
    }
}

function checkColorAttempt() {
    if (isGameOver) {
        startNewRound();
        return;
    }

    const userHex = hexValue.textContent;
    const accuracy = calculateSimilarity(userHex, targetHexColor);

    isGameOver = true;
    pokeCanvas.classList.add('revealed');
    setSlidersDisabled(true);

    let titulo, mensajeColor, mensajeTexto;
    if (accuracy >= 100) {
        titulo = "¡Perfecto!";
        mensajeColor = "#0db955";
        mensajeTexto = `¡Tu precisión (${accuracy}%) fue perfecta!<br>El color de <i>${currentPokemon.name}</i> es exactamente ${targetHexColor}. ¡Tú si te conoces a este Pokémon!`;
    } else if (accuracy >= 92) {
        titulo = "¡Increíble!";
        mensajeColor = "#099945";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    } else if (accuracy >= 75) {
        titulo = "¡Bien!";
        mensajeColor = "#21701a";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    } else if (accuracy >= 51) {
        titulo = "No está mal";
        mensajeColor = "#0d5310";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    } else if (accuracy >= 50) {
        titulo = "Por el medio...";
        mensajeColor = "#f18d3b";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    } else if (accuracy >= 49) {
        titulo = "Casi bien...";
        mensajeColor = "#c92508";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    } else if (accuracy >= 20) {
        titulo = "Algo lejos...";
        mensajeColor = "#b80000";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    } else {
        titulo = "Muy lejos...";
        mensajeColor = "#9c0000";
        mensajeTexto = `Tu precisión fue de un ${accuracy}%.<br>El color de <i>${currentPokemon.name}</i> es (${targetHexColor}).`;
    }

    const resultModalHTML = `
        <div id="modal-anticheat-fixed" style="display: flex;">
            <div class="anticheat-card anim-entrada">
                <h2 style="color: ${mensajeColor}; margin-top: 0; font-size: clamp(1.4rem, 5vw, 2rem); font-family: sans-serif;">${titulo}</h2>
                <div class="error-vibrar" style="background: #22222b; color: #fff; border-color: ${mensajeColor}; line-height: 1.5;">
                    ${mensajeTexto}
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="anticheat-btn" id="btn-modal-retry" style="margin-top: 0; background: linear-gradient(145deg, #3b4cca, #2a3a96);">
                        Siguiente Pokémon
                    </button>
                    <button class="anticheat-btn" id="btn-modal-home" style="margin-top: 0; background: #333; color: #ccc; border: 1px solid #444;">
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', resultModalHTML);

    document.getElementById('btn-modal-retry').addEventListener('click', () => {
        const modal = document.getElementById('modal-anticheat-fixed');
        startNewRound();
        modal.remove();

        /*window.location.href = '../color';*/
    });

    document.getElementById('btn-modal-home').addEventListener('click', () => {
        window.location.href = '../#games';
    });
}

window.onload = initGame; 