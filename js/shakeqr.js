        // Función para solicitar permisos en iOS
        function requestMotionPermission() {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        // Iniciar la detección de movimiento si se otorgan los permisos
                        startMotionDetection();
                    } else {
                        alert("Permiso denegado. No se puede detectar el movimiento.");
                    }
                })
                .catch(console.error);
            } else {
                // Para navegadores que no requieren permisos (Android, Chrome, etc.)
                startMotionDetection();
            }
        }

        // Función para comenzar la detección de movimiento
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
                    alert("Agitación detectada, redirigiendo...");
                    window.location.href = "https://www.ejemplo.com";
                }

                lastX = acceleration.x;
                lastY = acceleration.y;
                lastZ = acceleration.z;
            });
        }

        // Detectar el sistema operativo y solicitar permisos si es iOS
        function detectOSAndRequestPermission() {
            var ua = navigator.userAgent || navigator.vendor || window.opera;
            
            // Detectar si es iOS (Safari)
            if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
                // Solicitar permiso en iOS al hacer clic en cualquier parte
                document.body.addEventListener('click', requestMotionPermission, { once: true });
                alert("Toca la pantalla para habilitar la detección de movimiento en iOS.");
            } else {
                // En Android y otros navegadores, no se necesitan permisos
                startMotionDetection();
            }
        }

        // Ejecutar la detección del sistema operativo al cargar la página
        window.onload = detectOSAndRequestPermission;