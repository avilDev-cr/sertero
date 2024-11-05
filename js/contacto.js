document.getElementById("submitButton").addEventListener("click", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores de los campos
    const name = document.getElementById("text-input").value;
    const email = document.getElementById("email-input").value;
    const comment = document.getElementById("textarea-input").value;
    const contactMethod = document.getElementById("select").value;
    const clothing = Array.from(
        document.getElementById("multiple-select").selectedOptions
    )
        .map((option) => option.text)
        .join(", ");
    const gender = document.querySelector(
        'input[name="inline-radios"]:checked'
    )
        ? document.querySelector('input[name="inline-radios"]:checked').value
        : "";
    const howMet = Array.from(
        document.querySelectorAll('input[type="checkbox"]:checked')
    )
        .map((checkbox) => checkbox.parentNode.innerText.trim())
        .join(", ");

    // Validaciones
    let errorMessage = "";

    if (!validateName(name)) {
        errorMessage += "El nombre solo debe contener letras.\n";
    }

    if (!validateEmail(email)) {
        errorMessage += "Por favor, introduce un email válido.\n";
    }

    if (!validateRequiredFields(name, email, comment, contactMethod, clothing, gender, howMet)) {
        errorMessage += "Todos los campos son obligatorios, excepto el de enviar archivo.\n";
    }

    // Validaciones para selecciones
    if (!validateSelections(contactMethod, clothing, gender, howMet)) {
        errorMessage += "Debes seleccionar al menos una opción de Método de contacto, Tipo de ropa, Género y Cómo nos conociste.\n";
    }

    if (errorMessage) {
        alert(errorMessage); // Muestra todos los mensajes de error acumulados
        return; // Detener la ejecución si hay errores
    }

    // Almacenar los valores en localStorage
    localStorage.setItem("nombre", name);
    localStorage.setItem("email", email);
    localStorage.setItem("comentario", comment);
    localStorage.setItem("metodoContacto", contactMethod);
    localStorage.setItem("tipoRopa", clothing);
    localStorage.setItem("genero", gender);
    localStorage.setItem("comoConociste", howMet);

    // Imprimir los valores en la consola
    console.log("Nombre:", name);
    console.log("Email:", email);
    console.log("Comentario/Solicitud:", comment);
    console.log("Método de contacto:", contactMethod);
    console.log("Tipo de ropa:", clothing);
    console.log("Género:", gender);
    console.log("¿Cómo nos conociste?", howMet);
});

// Función para validar que el nombre solo contenga letras
function validateName(name) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/; // Acepta letras y espacios
    return regex.test(name);
}

// Función para validar el formato del email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para validar un email
    return regex.test(email);
}

// Función para validar que todos los campos requeridos estén llenos
function validateRequiredFields(name, email, comment, contactMethod, clothing, gender) {
    return name.trim() !== "" && email.trim() !== "" && comment.trim() !== "";
}

// Función para validar selecciones
function validateSelections(contactMethod, clothing, gender, howMet) {
    return contactMethod !== "0" && clothing !== "" && gender !== "" && howMet !== "";
}

document.getElementById("redButton").addEventListener("click", function () {
    // Limpiar el formulario sin eliminar datos de localStorage
    document.getElementById("text-input").value = "";
    document.getElementById("email-input").value = "";
    document.getElementById("textarea-input").value = "";
    document.getElementById("select").value = "0";

    // Limpiar el select múltiple
    const multipleSelect = document.getElementById("multiple-select");
    for (let option of multipleSelect.options) {
        option.selected = false;
    }

    // Limpiar los radio buttons
    const radios = document.querySelectorAll('input[name="inline-radios"]');
    radios.forEach(radio => radio.checked = false);

    // Limpiar checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    console.log("Formulario ha sido limpiado, datos en localStorage permanecen.");
});

// Función para recuperar datos del localStorage (opcional)
function loadData() {
    document.getElementById("text-input").value = localStorage.getItem("nombre") || "";
    document.getElementById("email-input").value = localStorage.getItem("email") || "";
    document.getElementById("textarea-input").value = localStorage.getItem("comentario") || "";
    document.getElementById("select").value = localStorage.getItem("metodoContacto") || "0";

    // Rellenar el select múltiple
    const selectedClothes = localStorage.getItem("tipoRopa")
        ? localStorage.getItem("tipoRopa").split(", ")
        : [];
    const multipleSelect = document.getElementById("multiple-select");
    for (let option of multipleSelect.options) {
        option.selected = selectedClothes.includes(option.text);
    }

    // Rellenar el radio button
    const genderStored = localStorage.getItem("genero");
    if (genderStored) {
        document.querySelector(`input[name="inline-radios"][value="${genderStored}"]`).checked = true;
    }

    // Rellenar checkboxes
    const howMet = localStorage.getItem("comoConociste")
        ? localStorage.getItem("comoConociste").split(", ")
        : [];
    for (let checkbox of document.querySelectorAll('input[type="checkbox"]')) {
        checkbox.checked = howMet.includes(checkbox.parentNode.innerText.trim());
    }
}

// Cargar datos al cargar la página
window.onload = loadData;


<div id="map" style="height: 400px; width: 100%;"></div>


  function initMap() {
    const start = { lat: 10.0121159, lng: -84.2259853 }; // Punto de inicio
    const end = { lat: 10.015, lng: -84.230 }; // Punto de destino

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: start,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
  }

