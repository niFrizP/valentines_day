document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--x', e.clientX / window.innerWidth);
    document.body.style.setProperty('--y', e.clientY / window.innerHeight);
})

/********************
 * Corazones animados
 ********************/
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    document.getElementById('hearts-container').appendChild(heart);
    setTimeout(() => {
        heart.remove();
    }, parseFloat(heart.style.animationDuration) * 1000);
}
// Crea un corazón cada 500ms
setInterval(createHeart, 400);

/*********************************
 * Acción al hacer clic en la tarjeta
 *********************************/
const card = document.getElementById('card');
card.addEventListener('click', function () {
    // Gira la tarjeta
    this.classList.add('flipped');
    setTimeout(() => {
        document.getElementById('card-container').style.display = 'none';
        document.getElementById('scratch-card').style.display = 'block';
        initScratchCard();
    }, 1000); // 1 segundo (igual que la duración de la transición)
});

/*********************************
 * Efecto scratch (raspa para revelar foto)
 *********************************/
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const img = document.getElementById('scratch-photo');
    // Ajusta el tamaño del canvas al de la imagen
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    // Rellena el canvas con un color gris (la "capa" a raspar)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configura el modo para "borrar" con el pincel
    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;

    // Calcula la posición del pincel en relación al canvas
    function getBrushPos(xRef, yRef) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((xRef - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.floor((yRef - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    // Dibuja un círculo (pincel) en la posición dada
    function drawDot(x, y) {
        const brushRadius = 20;
        ctx.beginPath();
        ctx.arc(x, y, brushRadius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    // Funciones para manejar el "raspado"
    function scratchStart(e) {
        isDrawing = true;
        const pos = getBrushPos(e.clientX, e.clientY);
        drawDot(pos.x, pos.y);
        checkIfCleared();
    }

    function scratchMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getBrushPos(e.clientX, e.clientY);
        drawDot(pos.x, pos.y);
        checkIfCleared();
    }

    function scratchEnd() {
        isDrawing = false;
    }

    // Eventos para mouse
    canvas.addEventListener('mousedown', scratchStart);
    canvas.addEventListener('mousemove', scratchMove);
    canvas.addEventListener('mouseup', scratchEnd);
    // Eventos para pantalla táctil
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0];
        const pos = getBrushPos(touch.clientX, touch.clientY);
        drawDot(pos.x, pos.y);
        checkIfCleared();
    });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const pos = getBrushPos(touch.clientX, touch.clientY);
        drawDot(pos.x, pos.y);
        checkIfCleared();
    });
    canvas.addEventListener('touchend', function () {
        isDrawing = false;
    });

    // Comprueba si se ha raspado más del 50%
    function checkIfCleared() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let cleared = 0;
        // Recorre la información de píxeles (cada 4 valores representan RGBA)
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) { // canal alfa = 0, borrado
                cleared++;
            }
        }
        if (cleared / (canvas.width * canvas.height) > 0.5) {
            // Cuando se borre el 50%: desvanecer y quitar el canvas
            canvas.style.transition = 'opacity 1s';
            canvas.style.opacity = '0';
            setTimeout(() => {
                canvas.style.display = 'none';
                showNotification();
            }, 1000);
        }
    }
}

/*********************************
 * Mostrar notificación (ícono de carta)
 *********************************/
function showNotification() {
    document.getElementById('notification').style.display = 'block';
    notificationSound.play();
}

const notificationSound = new Audio('assets/sounds/notification.mp3');
notificationSound.volume = 0.5;

// Al hacer clic en la notificación se muestra la carta
document.getElementById('notification').addEventListener('click', function () {
    document.getElementById('letter-card').style.display = 'block';
});

// Botón para cerrar la carta
document.getElementById('close-letter').addEventListener('click', function () {
    document.getElementById('letter-card').style.display = 'none';
});

