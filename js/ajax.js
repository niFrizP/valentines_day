/*********************************
 * Corazones animados
 *********************************/
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
setInterval(createHeart, 400);

/*********************************
 * Acción al hacer clic en la tarjeta
 *********************************/
const card = document.getElementById('card');
card.addEventListener('click', function () {
    this.classList.add('flipped');
    setTimeout(() => {
        document.getElementById('card-container').style.display = 'none';
        document.getElementById('scratch-card').style.display = 'block';
        initScratchCard();
    }, 1000);
});

/*********************************
 * Efecto scratch mejorado
 *********************************/
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const img = document.getElementById('scratch-photo');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;

    function getBrushPos(xRef, yRef) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((xRef - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.floor((yRef - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    function drawLine(x, y) {
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
    }

    let lastX, lastY;

    function scratchStart(e) {
        isDrawing = true;
        const pos = getBrushPos(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        lastX = pos.x;
        lastY = pos.y;
    }

    function scratchMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getBrushPos(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        drawLine(pos.x, pos.y);
        checkIfCleared();
    }

    function scratchEnd() {
        isDrawing = false;
    }

    canvas.addEventListener('mousedown', scratchStart);
    canvas.addEventListener('mousemove', scratchMove);
    canvas.addEventListener('mouseup', scratchEnd);
    canvas.addEventListener('touchstart', scratchStart);
    canvas.addEventListener('touchmove', scratchMove);
    canvas.addEventListener('touchend', scratchEnd);

    function checkIfCleared() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let cleared = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                cleared++;
            }
        }
        if (cleared / (canvas.width * canvas.height) > 0.5) {
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
 * Mostrar notificación y carta
 *********************************/
function showNotification() {
    document.getElementById('notification').style.display = 'block';
    notificationSound.play();
}

const notificationSound = new Audio('assets/sounds/notification.mp3');
notificationSound.volume = 0.5;

document.getElementById('notification').addEventListener('click', function () {
    document.getElementById('letter-card').style.display = 'block';
});

// Llamar a la función para cambiar la imagen cuando sea necesario
document.getElementById('close-letter').addEventListener('click', function () {
    // Ocultar la carta
    document.getElementById('letter-card').style.display = 'none';
    // Ocultar el scratch-card
    document.getElementById('scratch-card').style.display = 'none';
    // Mostrar el video
    document.getElementById('video-container').classList.remove('hidden');
    document.getElementById('valentine-video').src = "https://www.youtube.com/embed/qFh6AGHVInY?autoplay=1";
});



/*********************************
 * Movimiento del mouse y efectos de fondo
 *********************************/
document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--x', e.clientX / window.innerWidth);
    document.body.style.setProperty('--y', e.clientY / window.innerHeight);
});

/*********************************
 * Imágenes y rascar
 *********************************/


let currentImageIndex = 0;
let scratchedPixels = 0;
const totalPixels = 40000; // Aproximadamente el 50% de un canvas de 400x400

function setupCanvas() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('scratch-photo');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;
    let lastX, lastY;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const { offsetX, offsetY } = getEventCoords(e);
        lastX = offsetX;
        lastY = offsetY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getEventCoords(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.stroke();
        lastX = offsetX;
        lastY = offsetY;
        scratchedPixels += 1;
        checkScratchCompletion();
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    function getEventCoords(e) {
        const rect = canvas.getBoundingClientRect();
        return { offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    }

    function checkScratchCompletion() {
        if (scratchedPixels > totalPixels) {
            revealImage();
        }
    }

    console.log(images[currentImageIndex]); // Imprime la ruta de la imagen actual
}
