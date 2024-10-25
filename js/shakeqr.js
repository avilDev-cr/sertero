
let lastX = null;
let lastY = null;
let lastZ = null;
let threshold = 10;  // Sensibilidad del "shake" (ajusta este valor según sea necesario)

window.addEventListener('devicemotion', function(event) {
    let acceleration = event.accelerationIncludingGravity;

    if (!lastX && !lastY && !lastZ) {
        lastX = acceleration.x;
        lastY = acceleration.y;
        lastZ = acceleration.z;
        return;
    }

    let deltaX = Math.abs(lastX - acceleration.x);
    let deltaY = Math.abs(lastY - acceleration.y);
    let deltaZ = Math.abs(lastZ - acceleration.z);

    if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        // Redirige a otra página cuando detecta un movimiento brusco (agitación)
        window.location.href = "https://sertero.netlify.app/pag/qr";
    }

    lastX = acceleration.x;
    lastY = acceleration.y;
    lastZ = acceleration.z;
});
