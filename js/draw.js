let POKEMON_DISPONIBLES = [];

async function loadDB() {
    try {
        const DB = await fetch('../json/pkmn.json');
        POKEMON_DISPONIBLES = await DB.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const timerElement = document.getElementById('timer');
const pokemonRef = document.getElementById('pokemonRef');
const placeholder = document.getElementById('placeholder');

const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

let isDrawing = false;
let timeLeft = 45;
let timerInterval;
let gameActive = false;

function startPosition(e) {
    if (!gameActive) return;
    isDrawing = true;
    draw(e);
}

function endPosition() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing || !gameActive) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const posicionVisualX = clientX - rect.left;
    const posicionVisualY = clientY - rect.top;

    const x = posicionVisualX * (canvas.width / rect.width);
    const y = posicionVisualY * (canvas.height / rect.height);

    ctx.lineWidth = brushSize?.value || 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker?.value || '#000000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const randomPoke = POKEMON_DISPONIBLES[Math.floor(Math.random() * POKEMON_DISPONIBLES.length)];
    pokemonRef.src = randomPoke.img;
    pokemonRef.style.display = 'block';
    placeholder.style.display = 'none';

    timeLeft = 45;
    gameActive = true;
    startBtn.disabled = true;
    clearBtn.disabled = false;
    colorPicker.disabled = false;
    brushSize.disabled = false;
    
    saveBtn.disabled = true;
    shareBtn.disabled = true;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `${timeLeft}s`;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    gameActive = false;
    
    startBtn.disabled = false;
    startBtn.innerText = "Jugar de nuevo";
    
    clearBtn.disabled = true;
    colorPicker.disabled = true;
    brushSize.disabled = true;
    
    saveBtn.disabled = false;
    shareBtn.disabled = false;
}

function generarCanvasFinal() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const fecha = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const urlWeb = "https://markelcanton.github.io/pokuiz/draw/";

    tempCtx.font = "bold italic 14px Arial";
    tempCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
    
    tempCtx.textAlign = "left";
    tempCtx.fillText(fecha, 15, tempCanvas.height - 15);

    tempCtx.textAlign = "right";
    tempCtx.fillText(urlWeb, tempCanvas.width - 15, tempCanvas.height - 15);
    
    return tempCanvas;
}

function guardarComoPNG() {
    const finalCanvas = generarCanvasFinal();
    const link = document.createElement('a');
    
    const timestamp = Date.now();
    link.download = `pokuiz-draw-${timestamp}.png`;
    
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
}

async function compartirCreacion() {
    const finalCanvas = generarCanvasFinal();
    
    finalCanvas.toBlob(async (blob) => {
        if (!blob) return;

        const timestamp = Date.now();

        const archivo = new File([blob], `pokuiz-draw-${timestamp}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
            try {
                await navigator.share({
                    files: [archivo],
                    title: '¡Mira mi dibujo en PoKuiz!',
                    text: '¿Qué te parece este Pokémon que he dibujado? Crea el tuyo en PoKuiz Draw: https://markelcanton.github.io/pokuiz/draw/'
                });
            } catch (error) {
                console.log("Compartir cancelado");
            }
        } else {
            alert("Tu navegador o dispositivo no soporta el compartir directamente. Usa 'Guardar como PNG' y compártelo manualmente.");
        }
    }, 'image/png');
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e); });
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

clearBtn.onclick = () => { 
    if(gameActive || confirm("¿Seguro que quieres borrar el lienzo?")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

saveBtn.onclick = guardarComoPNG;
shareBtn.onclick = compartirCreacion;

startBtn.onclick = async () => {
    if (POKEMON_DISPONIBLES.length === 0) {
        startBtn.innerText = "Cargando...";
        await loadDB();
    }
    startGame();
};
