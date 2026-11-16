// ==========================================
// 1. CONFIGURACIÓN INICIAL (FECHA Y MÚSICA)
// ==========================================
const START_DATE = new Date("2026-11-04T14:41:00").getTime();

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
let isPlaying = false;

musicBtn.addEventListener("click", () => {
    if (isPlaying) {
        music.pause();
        musicBtn.textContent = "🎵 Play";
    } else {
        music.play();
        musicBtn.textContent = "⏸️ Pausa";
    }
    isPlaying = !isPlaying;
});

// ==========================================
// 2. NAVEGACIÓN ENTRE PANTALLAS
// ==========================================
function openSection(sectionId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
}

function goBack() {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    document.getElementById("menu-screen").classList.add("active");
}

// ==========================================
// 3. CONTADOR EN TIEMPO REAL
// ==========================================
function updateCounter() {
    const now = new Date().getTime();
    const diff = now - START_DATE;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
    }
}
setInterval(updateCounter, 1000);
updateCounter();

// ==========================================
// 4. CARTITA DESPLEGABLE (ARRANCA MÚSICA AL ABRIR)
// ==========================================
const envelopeTrigger = document.getElementById("envelope-trigger");
const letterBody = document.getElementById("letter-body");
const letterHint = document.getElementById("letter-hint");

envelopeTrigger.addEventListener("click", () => {
    letterBody.classList.toggle("open");
    if (letterBody.classList.contains("open")) {
        letterHint.textContent = "Toca arriba para cerrar la carta ✨";
        
        // Inicia la música SOLO cuando abre la cartita
        if (!isPlaying) {
            music.play().then(() => {
                isPlaying = true;
                musicBtn.textContent = "⏸️ Pausa";
            }).catch(() => {});
        }
    } else {
        letterHint.textContent = "Toca aquí para abrir la carta...";
    }
});

// ==========================================
// 5. VISOR DE IMÁGENES EN GRANDE (LIGHTBOX)
// ==========================================
const photoModal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");
const galleryImages = document.querySelectorAll(".photo-frame img");

galleryImages.forEach(img => {
    img.addEventListener("click", () => {
        modalImg.src = img.src;
        photoModal.classList.add("show");
    });
});

// Cerrar al tocar la X o el fondo oscuro
closeModal.addEventListener("click", () => {
    photoModal.classList.remove("show");
});

photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) {
        photoModal.classList.remove("show");
    }
});

// ==========================================
// 6. JUEGO ADAPTATIVO (CELULAR VS PC)
// ==========================================
const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const gameArea = document.getElementById("game-area");
const successMessage = document.getElementById("success-message");

const isMobileScreen = () => window.innerWidth <= 768;

function moveNoButtonRandomly() {
    const areaRect = gameArea.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = areaRect.width - btnRect.width - 30;
    const maxY = areaRect.height - btnRect.height - 30;

    const randomX = Math.max(15, Math.floor(Math.random() * maxX));
    const randomY = Math.max(15, Math.floor(Math.random() * maxY));

    noBtn.style.position = "absolute";
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}

// MODO CELULAR
noBtn.addEventListener("click", (e) => {
    if (isMobileScreen()) {
        e.preventDefault();
        moveNoButtonRandomly();
    }
});

// MODO PC
gameArea.addEventListener("mousemove", (e) => {
    if (!isMobileScreen() && successMessage.classList.contains("hidden")) {
        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (distance < 110) {
            moveNoButtonRandomly();
        }
    }
});

// Botón SÍ
yesBtn.addEventListener("click", () => {
    noBtn.style.display = "none";
    yesBtn.style.transform = "scale(1.15)";
    successMessage.classList.remove("hidden");
});