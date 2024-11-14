document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    // Alternar la clase 'open' para mostrar/ocultar el menú
    hamburger.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('open');
    });
});
