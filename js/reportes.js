
// Cedula permitida
const validID = "207760909";

// Inicializamos un objeto vacío para almacenar los gimnasios cargados desde el JSON
let gymsByProvince = {};

// Referencias de los elementos del DOM
const idInput = document.getElementById('id');
const provinceSelect = document.getElementById('province');
const gymsSelect = document.getElementById('gymsSelect');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('error-message');
const provinceLabel = document.querySelector('label[for="province"]');
const gymsLabel = document.querySelector('label[for="gymsSelect"]');

// Cargar los gimnasios desde el archivo JSON
fetch('/json/gyms.json')
    .then(response => response.json())
    .then(data => {
        // Guardamos los gimnasios cargados en gymsByProvince
        gymsByProvince = data;

        // Llenamos el select de provincias con las claves del JSON
        for (const province in gymsByProvince) {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        }
    })
    .catch(error => console.error('Error al cargar el JSON:', error));

// Función para validar la cédula
function validateID() {
    const id = idInput.value.trim();

    // Si la cédula es correcta, mostramos los selects y activamos el botón
    if (id === validID) {
        provinceSelect.style.display = 'block';
        gymsSelect.style.display = 'none'; // Ocultamos el select de gimnasios hasta seleccionar provincia
        errorMessage.style.display = 'none';
        submitBtn.disabled = false;
        provinceLabel.style.display = 'block'; // Mostramos el label de provincia
    } else {
        // Si no es correcta, ocultamos los selects y mostramos el mensaje de error
        provinceSelect.style.display = 'none';
        gymsSelect.style.display = 'none';
        errorMessage.style.display = 'block';
        submitBtn.disabled = true;
        provinceLabel.style.display = 'none'; // Ocultamos el label de provincia
        gymsLabel.style.display = 'none'; // Ocultamos el label de gimnasios
    }
}

// Al cambiar la cédula, validamos
idInput.addEventListener('input', validateID);

// Al seleccionar la provincia, actualizar los gimnasios
provinceSelect.addEventListener('change', function () {
    const province = this.value;

    // Limpiamos las opciones anteriores de gimnasios
    gymsSelect.innerHTML = '';

    // Si la provincia es válida, llenamos el select con gimnasios y mostramos el label
    if (gymsByProvince[province]) {
        gymsSelect.style.display = 'block';
        gymsLabel.style.display = 'block';

        gymsByProvince[province].forEach(gym => {
            const option = document.createElement('option');
            option.value = gym;
            option.textContent = gym;
            gymsSelect.appendChild(option);
        });
    } else {
        gymsSelect.style.display = 'none';
        gymsLabel.style.display = 'none';
    }
});

// Manejo del envío del formulario
document.getElementById('gymReportForm').addEventListener('submit', function (event) {
    const id = idInput.value;
    const province = provinceSelect.value;
    const gym = gymsSelect.value;

    if (!id || !province || !gym) {
        alert("Por favor, completa todos los campos antes de enviar.");
        event.preventDefault();
    }
});



// Referencia al modal y botón de cerrar
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close');

// Manejo del envío del formulario
document.getElementById('gymReportForm').addEventListener('submit', function (event) {
    const id = idInput.value;
    const province = provinceSelect.value;
    const gym = gymsSelect.value;

    // Si todos los campos están completos, mostramos el modal
    if (id && province && gym) {
        event.preventDefault(); // Prevenir el envío inmediato del formulario para mostrar el modal

        // Muestra el modal de éxito
        successModal.style.display = 'block';
        
        // Luego de un corto retraso (para que el usuario vea el modal), enviamos el formulario
        setTimeout(() => {
            this.submit(); // Enviar el formulario
        }, 2000); // Esperar 2 segundos antes de enviar
    } else {
        alert("Por favor, completa todos los campos antes de enviar.");
        event.preventDefault();
    }
});

// Cerrar el modal cuando se hace clic en el botón de cerrar
closeModal.addEventListener('click', function () {
    successModal.style.display = 'none';
});

// Cerrar el modal si el usuario hace clic fuera de la ventana modal
window.onclick = function (event) {
    if (event.target == successModal) {
        successModal.style.display = 'none';
    }
};
