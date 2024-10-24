document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuItems = hamburgerMenu.querySelectorAll('a');

   
    hamburger.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('open');
    });

    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            hamburgerMenu.classList.remove('open');
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const services = document.querySelectorAll(".service"); 

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
        observer.observe(service);
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

    function toggleFAQ(element) {
        const answer = element.nextElementSibling;
        answer.style.display = answer.style.display === "block" ? "none" : "block";
        element.classList.toggle("active");
      }
      