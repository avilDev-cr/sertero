document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuItems = hamburgerMenu.querySelectorAll('a');

    // Alterna la clase 'open' en el menú cuando se hace clic en el ícono
    hamburger.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('open');
    });

    // Cierra el menú cuando se selecciona una opción
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            hamburgerMenu.classList.remove('open');
        });
    });
});



