/*document.getElementById("submitButton").addEventListener("click", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores de los campos
    const name = document.getElementById("inputNombre").value;
    const email = document.getElementById("inputEmail").value;
    const comment = document.getElementById("inputComentario").value;
    const contactMethod = document.getElementById("selectContacto").value;
    const products = Array.from(
        document.getElementById("selectProductos").selectedOptions
    )
        .map((option) => option.text)
        .join(", ");
    const gender = document.querySelector(
        'input[name="radioGenero"]:checked'
    )
        ? document.querySelector('input[name="radioGenero"]:checked').value
        : "";
    const howMet = Array.from(
        document.querySelectorAll('input[name="checkOrigen"]:checked')
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

    if (!validateRequiredFields(name, email, comment, contactMethod, products, gender, howMet)) {
        errorMessage += "Todos los campos son obligatorios, excepto el de enviar archivo.\n";
    }

    // Validaciones para selecciones
    if (!validateSelections(contactMethod, products, gender, howMet)) {
        errorMessage += "Debes seleccionar al menos una opción de Método de contacto, Productos, Género y Cómo nos conociste.\n";
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
    localStorage.setItem("productos", products);
    localStorage.setItem("genero", gender);
    localStorage.setItem("comoConociste", howMet);

    // Imprimir los valores en la consola
    console.log("Nombre:", name);
    console.log("Email:", email);
    console.log("Comentario/Solicitud:", comment);
    console.log("Método de contacto:", contactMethod);
    console.log("Productos de interés:", products);
    console.log("Género:", gender);
    console.log("¿Cómo nos conociste?", howMet);
});*/


document.getElementById("submitButton").addEventListener("click", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores de los campos
    const name = document.getElementById("inputNombre").value;
    const email = document.getElementById("inputEmail").value;
    const comment = document.getElementById("inputComentario").value;
    const contactMethod = document.getElementById("selectContacto").value;
    const products = Array.from(
        document.getElementById("selectProductos").selectedOptions
    )
        .map((option) => option.text)
        .join(", ");
    const gender = document.querySelector(
        'input[name="radioGenero"]:checked'
    )
        ? document.querySelector('input[name="radioGenero"]:checked').value
        : "";
    const howMet = Array.from(
        document.querySelectorAll('input[name="checkOrigen"]:checked')
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

    if (!validateRequiredFields(name, email, comment, contactMethod, products, gender, howMet)) {
        errorMessage += "Todos los campos son obligatorios, excepto el de enviar archivo.\n";
    }

    if (!validateSelections(contactMethod, products, gender, howMet)) {
        errorMessage += "Debes seleccionar al menos una opción de Método de contacto, Productos, Género y Cómo nos conociste.\n";
    }

    if (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el formulario',
            text: errorMessage,
        });
        return; // Detener la ejecución si hay errores
    }

    // Almacenar los valores en localStorage
    localStorage.setItem("nombre", name);
    localStorage.setItem("email", email);
    localStorage.setItem("comentario", comment);
    localStorage.setItem("metodoContacto", contactMethod);
    localStorage.setItem("productos", products);
    localStorage.setItem("genero", gender);
    localStorage.setItem("comoConociste", howMet);

    // Mostrar el mensaje con SweetAlert2
    Swal.fire({
        title: 'Mensaje enviado',
        html: `
            <strong>Nombre:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Comentario/Solicitud:</strong> ${comment}<br>
            <strong>Método de contacto:</strong> ${contactMethod}<br>
            <strong>Productos de interés:</strong> ${products}<br>
            <strong>Género:</strong> ${gender}<br>
            <strong>¿Cómo nos conociste?:</strong> ${howMet}
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });

    // Imprimir los valores en la consola
    console.log("Nombre:", name);
    console.log("Email:", email);
    console.log("Comentario/Solicitud:", comment);
    console.log("Método de contacto:", contactMethod);
    console.log("Productos de interés:", products);
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
function validateRequiredFields(name, email, comment, contactMethod, products, gender) {
    return name.trim() !== "" && email.trim() !== "" && comment.trim() !== "";
}

// Función para validar selecciones
function validateSelections(contactMethod, products, gender, howMet) {
    return contactMethod !== "0" && products !== "" && gender !== "" && howMet !== "";
}

document.getElementById("redButton").addEventListener("click", function () {
    // Limpiar el formulario sin eliminar datos de localStorage
    document.getElementById("inputNombre").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputComentario").value = "";
    document.getElementById("selectContacto").value = "0";

    // Limpiar el select múltiple
    const selectProductos = document.getElementById("selectProductos");
    for (let option of selectProductos.options) {
        option.selected = false;
    }

    // Limpiar los radio buttons
    const radios = document.querySelectorAll('input[name="radioGenero"]');
    radios.forEach(radio => radio.checked = false);

    // Limpiar checkboxes
    const checkboxes = document.querySelectorAll('input[name="checkOrigen"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    console.log("Formulario ha sido limpiado, datos en localStorage permanecen.");
});

// Función para recuperar datos del localStorage (opcional)
function loadData() {
    document.getElementById("inputNombre").value = localStorage.getItem("nombre") || "";
    document.getElementById("inputEmail").value = localStorage.getItem("email") || "";
    document.getElementById("inputComentario").value = localStorage.getItem("comentario") || "";
    document.getElementById("selectContacto").value = localStorage.getItem("metodoContacto") || "0";

    // Rellenar el select múltiple
    const selectedProducts = localStorage.getItem("productos")
        ? localStorage.getItem("productos").split(", ")
        : [];
    const selectProductos = document.getElementById("selectProductos");
    for (let option of selectProductos.options) {
        option.selected = selectedProducts.includes(option.text);
    }

    // Rellenar el radio button
    const genderStored = localStorage.getItem("genero");
    if (genderStored) {
        document.querySelector(`input[name="radioGenero"][value="${genderStored}"]`).checked = true;
    }

    // Rellenar los checkboxes
    const howMetStored = localStorage.getItem("comoConociste");
    if (howMetStored) {
        const selectedHowMet = howMetStored.split(", ");
        document.querySelectorAll('input[name="checkOrigen"]').forEach(checkbox => {
            checkbox.checked = selectedHowMet.includes(checkbox.value);
        });
    }
}
