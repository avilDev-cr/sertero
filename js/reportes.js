
// Cedula permitida
const validID = "207760909";

// Definimos los gimnasios por provincia
const gymsByProvince = {
    "San Jose": [
        "CrossFit San Pedro",
        "Power Gym SJ",
        "O2 Fitness San José",
        "Arena Trek San José",
        "Multispa San Pedro",
        "World Gym San José",
        "Muscle Gym Escazú",
        "Titanium Fitness Center"
    ],
    "Alajuela": [
        "Fit Gym Alajuela",
        "Gold's Gym Alajuela",
        "Total Fitness Alajuela",
        "Power Fit Gym",
        "Extreme Fitness Alajuela",
        "CrossFit Alajuela",
        "24/7 Fitness Alajuela",
        "ViveFit Alajuela"
    ],
    "Heredia": [
        "Fit Heredia",
        "Body Factory Heredia",
        "O2 Fitness Heredia",
        "World Gym Heredia",
        "Gold's Gym Heredia",
        "CrossFit Heredia",
        "Smart Fit Heredia",
        "Iron House Gym"
    ]
};

// Referencia de elementos
const idInput = document.getElementById('id');
const provinceSelect = document.getElementById('province');
const gymsSelect = document.getElementById('gymsSelect');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('error-message');

// Función para validar la cédula
function validateID() {
    const id = idInput.value;
    
    // Si la cédula es correcta, mostramos los selects y activamos el botón
    if (id === validID) {
        provinceSelect.style.display = 'block';
        errorMessage.style.display = 'none';
        submitBtn.disabled = false;
    } else {
        // Si no es correcta, ocultamos los selects y mostramos el mensaje de error
        provinceSelect.style.display = 'none';
        gymsSelect.style.display = 'none';
        errorMessage.style.display = 'block';
        submitBtn.disabled = true;
    }
}

// Al cambiar la cédula, validamos
idInput.addEventListener('input', validateID);

// Al seleccionar la provincia, actualizar los gimnasios
provinceSelect.addEventListener('change', function () {
    const province = this.value;

    // Limpiamos las opciones anteriores
    gymsSelect.innerHTML = '';

    // Solo mostramos los gimnasios si la provincia es válida
    if (gymsByProvince[province]) {
        gymsSelect.style.display = 'block';

        // Creamos una opción por cada gimnasio
        gymsByProvince[province].forEach(gym => {
            const option = document.createElement('option');
            option.value = gym;
            option.textContent = gym;
            gymsSelect.appendChild(option);
        });
    } else {
        gymsSelect.style.display = 'none'; // Ocultamos el select si no hay gimnasios
    }
});

// Manejo del envío del formulario
document.getElementById('gymReportForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const id = idInput.value;
    const province = provinceSelect.value;
    const gym = gymsSelect.value;

    alert(`Reporte enviado:\nIdentificación: ${id}\nProvincia: ${province}\nGimnasio: ${gym}`);
});
