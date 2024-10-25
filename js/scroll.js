window.addEventListener('deviceorientation', function(event) {
    // Ajusta el factor de sensibilidad según sea necesario
    const sensitivity = 10;

    // Determina la dirección de inclinación vertical
    const tilt = event.beta; // Inclinación hacia adelante y atrás
    const scrollAmount = tilt / sensitivity;

    // Realiza el scroll
    window.scrollBy(0, scrollAmount);
});