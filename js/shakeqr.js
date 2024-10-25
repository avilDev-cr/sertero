function requestMotionPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState === 'granted') {
                // Iniciar la detección de movimiento
                startMotionDetection();
            } else {
                alert("Permiso denegado. No se puede detectar el movimiento.");
            }
        })
        .catch(console.error);
    } else {
        // Para navegadores que no requieren permisos (otros dispositivos)
        startMotionDetection();
    }
}

function startMotionDetection() {
    let lastX = null;
    let lastY = null;
    let lastZ = null;
    let threshold = 15;

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
            window.location.href = "https://www.ejemplo.com";
        }

        lastX = acceleration.x;
        lastY = acceleration.y;
        lastZ = acceleration.z;
    });
}

// Botón para solicitar permiso
document.getElementById('requestPermission').addEventListener('click', requestMotionPermission);
