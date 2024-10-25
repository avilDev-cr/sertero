let isBackTriggered = false; // Para evitar múltiples llamadas

window.addEventListener('deviceorientation', function(event) {
    const tilt = event.gamma; // Inclinación lateral

    // Ajusta el umbral de inclinación según sea necesario
    const threshold = -60; // Umbral para inclinación hacia la izquierda

    // Si el dispositivo se inclina hacia la izquierda lo suficiente
    if (tilt < threshold && !isBackTriggered) {
        isBackTriggered = true; // Evita volver múltiples veces
        window.history.back(); // Vuelve a la página anterior

        // Restablece el indicador después de un pequeño tiempo
        setTimeout(() => {
            isBackTriggered = false;
        }, 1000); // Ajusta el tiempo según sea necesario
    }
});