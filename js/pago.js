
// Cargar el carrito desde el localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isPickup = false;

// Función para convertir los precios con formato "$1000" a números
function parsePrice(price) {
  return parseFloat(price.replace("$", "").replace(",", ""));
}

function updateCart() {
  let cartTableBody = document.getElementById("cart-items");
  cartTableBody.innerHTML = ""; // Limpiar la tabla antes de volver a llenarla
  let totalPrice = 0;

  cart.forEach((item, index) => {
    // Si la cantidad no está definida o es 0, la inicializamos en 1
    if (item.quantity <= 0 || !item.quantity) {
      item.quantity = 1;
    }

    // Convertir el precio y el costo de envío a números usando parsePrice
    const itemPrice = parsePrice(item.price); // Convierte el precio de string a número
    const itemShippingCost = parsePrice(item.shipping_cost); // Convierte el costo de envío de string a número

    // Calculando subtotal y total con el costo de envío
    const itemSubtotal = itemPrice * item.quantity;
    const itemTotal = isPickup
      ? itemSubtotal
      : itemSubtotal + itemShippingCost;

    cartTableBody.innerHTML += `
      <tr>
          <td><img src="${item.image}" alt="${item.name}" class="img-fluid" width="50"></td>
          <td>${item.name}</td>
          <td>${itemPrice} </td>
          <td><input type="number" value="${item.quantity}" min="1" class="form-control quantity-input" data-index="${index}"></td>
          <td class="item-subtotal">${itemSubtotal} </td>
          <td>${itemShippingCost} </td>
          <td class="item-total">${itemTotal} </td>
          <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Eliminar</button></td>
      </tr>
  `;

    totalPrice += itemTotal; // Sumar el total de cada producto
  });

  // Actualizar el total general en la tabla
  document.getElementById("total-price").innerText = totalPrice;

  // Aquí asignamos el total calculado al campo "Monto a pagar"
  document.getElementById(
    "amount-to-pay"
  ).value = `₡${totalPrice.toLocaleString()}`;

  document
    .getElementById("shipping-type")
    .addEventListener("change", updateCart);
}

// Escuchar cambios en el tipo de envío
document
  .getElementById("shipping-type")
  .addEventListener("change", function (event) {
    isPickup = event.target.value === "tienda";
    updateCart(); // Actualizar la vista del carrito con el nuevo tipo de envío
  });

// Función para eliminar un producto del carrito
function removeItem(index) {
  cart.splice(index, 1); // Eliminar el producto del carrito
  localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado
  updateCart(); // Actualizar la vista del carrito
}

// Escuchar cambios en las cantidades
document
  .getElementById("cart-items")
  .addEventListener("input", function (event) {
    if (event.target.classList.contains("quantity-input")) {
      const index = event.target.getAttribute("data-index");
      let newQuantity = parseInt(event.target.value);

      if (newQuantity <= 0) {
        // Si la cantidad es 0 o negativa, eliminamos el producto
        removeItem(index);
      } else {
        // Si la cantidad es válida, la actualizamos
        cart[index].quantity = newQuantity;

        // Convertir el precio y el costo de envío a números
        const itemPrice = parsePrice(cart[index].price);
        const itemShippingCost = parsePrice(cart[index].shipping_cost);

        // Calcular el subtotal y el total del producto
        const itemSubtotal = itemPrice * newQuantity;
        const itemTotal = itemSubtotal + itemShippingCost;

        // Actualizar la cantidad y los subtotales en la tabla
        const row = event.target.closest("tr");
        row.querySelector(".item-subtotal").innerText = itemSubtotal;
        row.querySelector(".item-total").innerText = itemTotal;

        // Actualizar el carrito y el total general
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart(); // Actualizar la vista del carrito
      }
    }
  });

// Función para proceder al pago (simulación)
document
  .getElementById("checkout-btn")
  .addEventListener("click", function () {
    if (cart.length > 0) {
      Swal.fire({
        title: "¡Gracias por tu compra!",
        text: "Estás siendo redirigido a la página de pago.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      // Redirigir a la página de pago (simulación)
      window.location.href = "/pago.html";
    } else {
      Swal.fire({
        title: "Tu carrito está vacío",
        text: "Agrega productos antes de proceder.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
  });

// Inicializar el carrito al cargar la página
updateCart();


//formulario


  // Evento de envío del formulario
  document.getElementById("payment-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario sin validación

    const cardNumber = document.getElementById("card-number").value.trim();
    const cardLogoContainer = document.getElementById("card-logo-container");

    // Limpiar cualquier logo previamente mostrado
    cardLogoContainer.innerHTML = '';

    // Validación de la tarjeta (solo 16 dígitos)
    if (!/^\d{16}$/.test(cardNumber)) {
      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un número de tarjeta válido (16 dígitos).'
      });
      return;
    }

    // Consultar a la API de Binlist para obtener el logo de la tarjeta
    fetch(`https://lookup.binlist.net/${cardNumber}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.scheme) {
          let cardLogo = '';

          if (data.scheme === "visa") {
            cardLogo = '<img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Visa_Logo.png" alt="Visa">';
          } else if (data.scheme === "mastercard") {
            cardLogo = '<img src="https://upload.wikimedia.org/wikipedia/commons/a/a3/MasterCard_logo.png" alt="MasterCard">';
          } else {
            cardLogo = '<p>Marca de tarjeta no reconocida.</p>';
          }

          // Mostrar el logo de la tarjeta
          cardLogoContainer.innerHTML = cardLogo;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la información de la tarjeta.'
          });
        }
      })
      .catch((error) => {
        console.error("Error al consultar la API", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al conectar con la API de verificación.'
        });
      });
  });

