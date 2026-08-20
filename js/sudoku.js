document.addEventListener("DOMContentLoaded", () => {
    let pokemonData = [];
    let activeList = [];
    let boardSolution = [];
    let boardInitial = [];
    let boardState = [];
    let boardNotes = [];
    
    let selectedCell = null;
    let noteMode = false;
    let currentDifficulty = "normal";

    let currentHintCell = null;

    const difficultyClues = {
        easy: 49,
        normal: 56,
        hard: 64,
        extreme: 70
    };

    const appContainer = document.getElementById("sudoku-app");

    if (appContainer) {
        appContainer.innerHTML = `
            <div id="board" class="sudoku-board"></div>
            <div class="controls-container">
                <div class="action-buttons">
                    <button id="btn-note" class="btn-action btn-action-purple">Notas: desactivado</button>
                    <button id="btn-erase" class="btn-action btn-action-blue">Borrar casilla</button>
                    <button id="btn-hint" class="btn-action btn-action-yellow">Pista</button>
                    <button id="btn-rules" class="btn-action btn-action-red">¿Cómo jugar?</button>
                </div>
                <div id="selector" class="selector-grid"></div>
            </div>
        `;
    }

    if (!document.getElementById("difficulty-modal")) {
        const diffModalHTML = `
            <div id="difficulty-modal" class="modal show">
                <div class="modal-content">
                    <h2 class="modal-title">Selecciona una dificultad:</h2>
                    <div class="modal-box">
                        <p>⚠️ Cuanto más difícil, más espacios para rellenar.</p>
                    </div>
                    <div class="difficulty-options">
                        <button class="btn-modal-diff btn-diff-easy" data-diff="easy">Fácil</button>
                        <button class="btn-modal-diff btn-diff-normal" data-diff="normal">Normal</button>
                        <button class="btn-modal-diff btn-diff-hard" data-diff="hard">Difícil</button>
                        <button class="btn-modal-diff btn-diff-extreme" data-diff="extreme">Extremo</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", diffModalHTML);
    }

    if (!document.getElementById("win-modal")) {
        const winModalHTML = `
            <div id="win-modal" class="modal">
                <div class="modal-content">
                    <h2 class="modal-title">¡Enhorabuena!</h2>
                    <div class="modal-box">
                        <p>&#8226; ¡Has resuelto el Sudoku correctamente!</p>
                    </div>
                    <div class="modal-actions">
                        <button id="btn-modal-restart" class="btn-modal btn-modal-green">Jugar de nuevo</button>
                        <a href="../#games" class="btn-modal btn-modal-secondary">Volver al Inicio</a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", winModalHTML);
    }

    if (!document.getElementById("rules-modal")) {
        const rulesModalHTML = `
            <div id="rules-modal" class="modal">
                <div class="modal-content">
                    <button id="btn-close-rules" class="modal-close">&times;</button>
                    <h2 class="modal-title">¿CÓMO JUGAR?</h2>
                    <div class="modal-box mb-rules">
                            <p>&#8226; <strong>Objetivo:</strong> Completa la cuadrícula de 9x9 con la lista de Pokémon de la barra inferior.</p>
                            <p>&#8226; <strong>Reglas básicas:</strong> Cada fila, columna y subcuadrícula de 3x3 debe contener los 9 Pokémon distintos sin repetir ninguno. Si uno se repite, significa que deberá ser reemplazado. De lo contrario, no se podrá ganar.</p>
                            <p>&#8226; <strong>Selección:</strong> Toca una casilla vacía y luego elige un Pokémon de la barra inferior para colocarlo.</p>
                            <p>&#8226; <strong>Notas:</strong> Activa el modo <em>Notas</em> para anotar posibles candidatos en una casilla.</p>
                            <p>&#8226; <strong>Pistas:</strong> Usa el botón <em>Pista</em> para destacar una casilla clave. Pulsa una segunda vez para <em>Revelar</em> la casilla. Si agregas el Pokémon correcto en la casilla, el botón volverá a mostrarse como <em>Pista</em>.</p>
                            <p>&#8226; <strong>¿Cómo ganar?</strong> Cuando un Pokémon se haya colocado 9 veces correctamente, ese botón quedará inhabilitado. Indicando de la misma manera que el Pokémon ya se ha agregado en los sitios correspondientes.</p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", rulesModalHTML);
    }

    fetch("../json/pkmn.json")
        .then(res => res.json())
        .then(data => {
            pokemonData = data;
            setupEventListeners();
        })
        .catch(err => console.error("Error cargando los datos:", err));

    function resetHintState() {
        currentHintCell = null;
        const btnHint = document.getElementById("btn-hint");
        if (btnHint) {
            btnHint.textContent = "Pista";
            btnHint.classList.remove("revealing");
        }
    }

    function initGame() {
        const winModal = document.getElementById("win-modal");
        if (winModal) winModal.classList.remove("show");

        resetHintState();

        const shuffled = [...pokemonData].sort(() => 0.5 - Math.random());
        activeList = shuffled.slice(0, 9).sort((a, b) => a.id - b.id);

        generateSudokuPuzzle();
        renderSelector();
        renderBoard();
    }

    function generateSudokuPuzzle() {
        boardSolution = Array.from({ length: 9 }, () => Array(9).fill(0));
        fillSudoku(boardSolution);

        boardInitial = boardSolution.map(row => [...row]);

        let removed = difficultyClues[currentDifficulty] || 42;
        while (removed > 0) {
            let r = Math.floor(Math.random() * 9);
            let c = Math.floor(Math.random() * 9);
            if (boardInitial[r][c] !== 0) {
                boardInitial[r][c] = 0;
                removed--;
            }
        }

        boardState = boardInitial.map(row => [...row]);
        boardNotes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    }

    function fillSudoku(grid) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
                    for (let num of nums) {
                        if (isValidPlacement(grid, r, c, num)) {
                            grid[r][c] = num;
                            if (fillSudoku(grid)) return true;
                            grid[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValidPlacement(grid, r, c, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[r][i] === num || grid[i][c] === num) return false;
            let boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3);
            let boxC = 3 * Math.floor(c / 3) + (i % 3);
            if (grid[boxR][boxC] === num) return false;
        }
        return true;
    }

    function renderSelector() {
        const selectorContainer = document.getElementById("selector");
        if (!selectorContainer) return;
        selectorContainer.innerHTML = "";
        
        activeList.forEach((pkmn, index) => {
            const btn = document.createElement("button");
            btn.className = "selector-btn";
            btn.dataset.value = index + 1;
            btn.innerHTML = `
                <img src="${pkmn.img}" alt="${pkmn.name}" title="${pkmn.name}">
                <span>${index + 1}</span>
            `;
            btn.addEventListener("click", () => handleInput(index + 1));
            selectorContainer.appendChild(btn);
        });

        updateSelectorStatus();
    }

    function updateSelectorStatus() {
        const counts = Array(10).fill(0);

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let val = boardState[r][c];
                if (val !== 0 && val === boardSolution[r][c]) {
                    counts[val]++;
                }
            }
        }

        const selectorBtns = document.querySelectorAll(".selector-btn");
        selectorBtns.forEach(btn => {
            const val = parseInt(btn.dataset.value);
            if (counts[val] >= 9) {
                btn.classList.add("disabled");
            } else {
                btn.classList.remove("disabled");
            }
        });
    }

    function renderBoard() {
        const boardContainer = document.getElementById("board");
        if (!boardContainer) return;
        boardContainer.innerHTML = "";

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement("div");
                cell.className = "sudoku-cell";
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (boardInitial[r][c] !== 0) {
                    cell.classList.add("fixed");
                }

                cell.addEventListener("click", () => selectCell(r, c));
                boardContainer.appendChild(cell);
            }
        }
        updateBoardUI();
    }

    function selectCell(r, c) {
        selectedCell = { r, c };
        
        if (currentHintCell && (currentHintCell.r !== r || currentHintCell.c !== c)) {
            resetHintState();
        }

        const cells = document.querySelectorAll(".sudoku-cell");
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            cell.classList.remove("selected", "highlighted", "hint-highlight");
            
            if (row === r && col === c) {
                cell.classList.add("selected");
                if (currentHintCell && currentHintCell.r === r && currentHintCell.c === c) {
                    cell.classList.add("hint-highlight");
                }
            } else if (row === r || col === c || 
                      (Math.floor(row / 3) === Math.floor(r / 3) && Math.floor(col / 3) === Math.floor(c / 3))) {
                cell.classList.add("highlighted");
            }
        });
    }

    function handleInput(val) {
        if (!selectedCell) return;
        const { r, c } = selectedCell;

        if (boardInitial[r][c] !== 0) return;

        const counts = Array(10).fill(0);
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let v = boardState[row][col];
                if (v !== 0 && v === boardSolution[row][col]) counts[v]++;
            }
        }
        if (counts[val] >= 9 && !noteMode) return;

        if (noteMode) {
            boardState[r][c] = 0;
            if (boardNotes[r][c].has(val)) {
                boardNotes[r][c].delete(val);
            } else {
                boardNotes[r][c].add(val);
            }
        } else {
            boardNotes[r][c].clear();
            boardState[r][c] = boardState[r][c] === val ? 0 : val;
        }

        resetHintState();
        updateBoardUI();
        updateSelectorStatus();
        checkCompletion();
    }

    function clearCell() {
        if (!selectedCell) return;
        const { r, c } = selectedCell;
        if (boardInitial[r][c] === 0) {
            boardState[r][c] = 0;
            boardNotes[r][c].clear();
            resetHintState();
            updateBoardUI();
            updateSelectorStatus();
        }
    }

    function handleHint() {
        const btnHint = document.getElementById("btn-hint");

        if (currentHintCell) {
            const { r, c } = currentHintCell;
            boardState[r][c] = boardSolution[r][c];
            boardNotes[r][c].clear();
            
            selectCell(r, c);
            resetHintState();
            
            updateBoardUI();
            updateSelectorStatus();
            checkCompletion();
            return;
        }

        let emptyOrErrorCells = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (boardState[r][c] === 0 || boardState[r][c] !== boardSolution[r][c]) {
                    emptyOrErrorCells.push({ r, c });
                }
            }
        }

        if (emptyOrErrorCells.length === 0) return;

        let bestTarget = null;
        for (let cell of emptyOrErrorCells) {
            let possibleValues = 0;
            for (let num = 1; num <= 9; num++) {
                if (isValidPlacement(boardState, cell.r, cell.c, num)) {
                    possibleValues++;
                }
            }
            if (possibleValues === 1) {
                bestTarget = cell;
                break;
            }
        }

        if (!bestTarget) {
            bestTarget = emptyOrErrorCells[Math.floor(Math.random() * emptyOrErrorCells.length)];
        }

        currentHintCell = bestTarget;
        selectCell(bestTarget.r, bestTarget.c);

        if (btnHint) {
            btnHint.textContent = "Revelar";
            btnHint.classList.add("revealing");
        }

        const targetElement = document.querySelector(`.sudoku-cell[data-row='${bestTarget.r}'][data-col='${bestTarget.c}']`);
        if (targetElement) {
            targetElement.classList.add("hint-highlight");
        }
    }

    function updateBoardUI() {
        const cells = document.querySelectorAll(".sudoku-cell");
        cells.forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            const val = boardState[r][c];

            cell.innerHTML = "";
            cell.classList.remove("error");

            if (!currentHintCell || currentHintCell.r !== r || currentHintCell.c !== c) {
                cell.classList.remove("hint-highlight");
            }

            if (val !== 0) {
                const pkmn = activeList[val - 1];
                const img = document.createElement("img");
                img.src = pkmn.img;
                img.alt = pkmn.name;
                cell.appendChild(img);

                if (val !== boardSolution[r][c]) {
                    cell.classList.add("error");
                }
            } else if (boardNotes[r][c].size > 0) {
                const notesGrid = document.createElement("div");
                notesGrid.className = "notes-grid";
                
                for (let i = 1; i <= 9; i++) {
                    const noteItem = document.createElement("div");
                    noteItem.className = "note-item";
                    if (boardNotes[r][c].has(i)) {
                        noteItem.textContent = i;
                    }
                    notesGrid.appendChild(noteItem);
                }
                cell.appendChild(notesGrid);
            }
        });
    }

    function setupEventListeners() {
        const diffButtons = document.querySelectorAll(".btn-modal-diff");
        diffButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentDifficulty = btn.dataset.diff;
                const diffModal = document.getElementById("difficulty-modal");
                if (diffModal) diffModal.classList.remove("show");
                initGame();
            });
        });

        const btnRules = document.getElementById("btn-rules");
        const rulesModal = document.getElementById("rules-modal");
        const btnCloseRules = document.getElementById("btn-close-rules");

        if (btnRules && rulesModal) {
            btnRules.onclick = () => {
                rulesModal.classList.add("show");
            };
        }

        if (btnCloseRules && rulesModal) {
            btnCloseRules.onclick = () => {
                rulesModal.classList.remove("show");
            };
        }

        window.addEventListener("click", (e) => {
            if (e.target === rulesModal) {
                rulesModal.classList.remove("show");
            }
        });

        const btnNote = document.getElementById("btn-note");
        if (btnNote) {
            btnNote.onclick = () => {
                noteMode = !noteMode;
                btnNote.classList.toggle("active", noteMode);
                btnNote.textContent = `Notas: ${noteMode ? "ACTIVADO" : "DESACTIVADO"}`;
            };
        }

        const btnErase = document.getElementById("btn-erase");
        if (btnErase) btnErase.onclick = clearCell;

        const btnHint = document.getElementById("btn-hint");
        if (btnHint) btnHint.onclick = handleHint;

        const btnModalRestart = document.getElementById("btn-modal-restart");
        if (btnModalRestart) {
            btnModalRestart.onclick = () => {
                const winModal = document.getElementById("win-modal");
                if (winModal) winModal.classList.remove("show");
                const diffModal = document.getElementById("difficulty-modal");
                if (diffModal) diffModal.classList.add("show");
            };
        }

        document.onkeydown = (e) => {
            if (e.key >= "1" && e.key <= "9") {
                handleInput(parseInt(e.key));
            } else if (e.key === "Backspace" || e.key === "Delete") {
                clearCell();
            }
        };
    }

    function checkCompletion() {
        let complete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (boardState[r][c] !== boardSolution[r][c]) {
                    complete = false;
                    break;
                }
            }
        }

        if (complete) {
            setTimeout(() => {
                const modal = document.getElementById("win-modal");
                if (modal) modal.classList.add("show");
            }, 150);
        }
    }
});