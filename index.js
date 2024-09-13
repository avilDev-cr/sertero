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


window.addEventListener('scroll', function() {
    const button = document.querySelector('.hamburguer');
    if (window.scrollY > 100) { // Cambia el valor según cuando quieras que cambie
        button.style.backgroundColor = '#007BFF'; // Cambiar el color de fondo
        button.style.color = 'white'; // Cambiar el color del texto o icono
    } else {
        button.style.backgroundColor = 'transparent'; // Fondo transparente
        button.style.color = '#007BFF'; // Color del icono
    }
});
