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


document.addEventListener("DOMContentLoaded", function () {
    const services = document.querySelectorAll(".service");  // Cambiado para seleccionar elementos con clase 'service'

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("service-visible");
            }
        });
    }, {
        threshold: 0.1
    });

    services.forEach(service => {
        observer.observe(service);  // Observa cada servicio individualmente
    });
});


    document.addEventListener("DOMContentLoaded", function () {
        const articles = document.querySelectorAll("article");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("article-visible");
                }
            });
        }, {
            threshold: 0.1 
        });

        articles.forEach(article => {
            observer.observe(article);
        });
    });

