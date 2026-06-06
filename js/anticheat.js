// Anti-cheat:
    (function() {
        const style = document.createElement('style');
        document.head.appendChild(style);

        const modalHTML = `
            <div id="modal-anticheat-fixed">
                <div id="anticheat-card-el" class="anticheat-card">
                    <h2 style="color: #333; margin-top: 0; font-size: clamp(1.2rem, 5vw, 1.8rem);">❌ Acción denegada</h2>
                    <div id="alert-box" class="error-vibrar">
                        Esta página contiene un anti-cheat, las funciones de desarrollador están deshabilitadas.
                    </div>
                    <p style="color: #444; margin-top: 15px; font-size: 0.95rem;">
                        Cierra las herramientas de desarrollador para continuar.
                    </p>
                    <button class="anticheat-btn" id="btn-final-close">Entendido</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('modal-anticheat-fixed');
        const card = document.getElementById('anticheat-card-el');
        const btn = document.getElementById('btn-final-close');
        const alertBox = document.getElementById('alert-box');

        function lockHTML() {
            if (modal.style.display === 'flex') {
                alertBox.classList.remove('active-shake');
                void alertBox.offsetWidth;
                alertBox.classList.add('active-shake');
            } else {
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                card.classList.remove('anim-salida');
                card.classList.add('anim-entrada');
                document.body.classList.add('anticheat-locked');
            }
            debugger; 
        }

        function unlockAntiCheat() {
            card.classList.remove('anim-entrada');
            card.classList.add('anim-salida');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('anticheat-locked');
            }, 300);
        }

        const touchScreen = 'ontouchstart' in window ||
                            navigator.maxTouchPoints > 0;
                            window.matchMedia("(pointer: coarse)").matches;

        function verify() {
            if (touchScreen) return;

            const zoomed = window.devicePixelRatio !== 1;
            if (zoomed) return;

            const threshold = 160;
            const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
            const heightDiff = Math.abs(window.outerHeight - window.innerHeight);

            let devToolsOpen = false;
            const devToolsDetector = /./;
            devToolsDetector.toString = function() {
                devToolsOpen = true;
            };

            if (widthDiff > threshold || heightDiff > threshold) {
                if (widthDiff > 500 || heightDiff > 500) return;
                lockHTML(); 
            }
        }

        window.addEventListener('dragstart', (e) => {
            if (e.target.closest('.drag-item')) {
                return; 
            }

            e.preventDefault(); 
        }, false);

        window.addEventListener('drop', (e) => {
            if (!e.target.closest('.drag-container')) {
                e.preventDefault();
            }
        }, false);

        window.addEventListener('dragover', (e) => {
            if (!e.target.closest('.drag-container')) {
                e.preventDefault;
            }
        }, false);

        btn.addEventListener('click', () => {
            unlockAntiCheat();
            setTimeout(verify, 400); 
        });

        // Bloqueo de teclas (F12, Ctrl+Shift+I, Ctrl+U...):
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                lockHTML();
            }
        });

        // Bloqueo de opciones con clic derecho:
        window.addEventListener('contextmenu', (e) => { e.preventDefault(); });
    })();
