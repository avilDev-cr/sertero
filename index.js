
// Abrir/Cerrar menú hamburguesa
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('hamburgerMenu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});
