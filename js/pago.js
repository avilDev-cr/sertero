




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

   // Función para simular el pago al hacer clic en el botón "Realizar Pago"
   document.getElementById("checkout-btn").addEventListener("click", function () {
    if (cart.length > 0) {
      const totalAmount = document.getElementById("total-price").innerText;
      Swal.fire({
        title: "Monto a pagar",
        text: `El monto total de tu compra es: ₡${totalAmount}. ¿Deseas confirmar el pago?`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma el pago
          Swal.fire({
            title: "Pago exitoso",
            text: "¡Gracias por tu compra! Tu pago ha sido procesado.",
            icon: "success",
            confirmButtonText: "Aceptar"
          }).then(() => {
            // Vaciar el carrito después de confirmar el pago
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito vacío
            updateCart(); // Actualizar la vista del carrito
           
          });
        } else {
          // Si el usuario cancela el pago
          Swal.fire({
            title: "Pago pendiente",
            text: "Tu pago está pendiente. El carrito permanece con tus productos.",
            icon: "info",
            confirmButtonText: "Aceptar"
          });
        }
      });
    } else {
      // Si el carrito está vacío
      Swal.fire({
        title: "Tu carrito está vacío",
        text: "Agrega productos antes de proceder.",
        icon: "warning",
        confirmButtonText: "Aceptar"
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
  
    // Verificación de la marca de la tarjeta basada en el BIN (Bank Identification Number)
    const cardType = getCardType(cardNumber);

    if (cardType) {
      // Mostrar el logo de la tarjeta
      let cardLogo = '';
      switch (cardType) {
        case 'visa':
          cardLogo = '<img src="https://1000marcas.net/wp-content/uploads/2019/12/Visa-Logo-2005.jpg" alt="Visa" class="card-logo">';
          break;
        case 'mastercard':
          cardLogo = '<img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.elpoderdelasideas.com%2Fvale-la-pena-cambio-logo-mastercard-confia-plenamente-ello%2F&psig=AOvVaw0pIV_VRkN5ioOLCDjboScI&ust=1731119631368000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJjrk6fZy4kDFQAAAAAdAAAAABAE" alt="MasterCard" class="card-logo">';
          break;
        case 'amex':
          cardLogo = '<img src="https://1000marcas.net/wp-content/uploads/2020/03/logo-American-Express.png" alt="American Express" class="card-logo">';
          break;
        default:
          cardLogo = '<p>Marca de tarjeta no reconocida.</p>';
      }
    
    
  
      cardLogoContainer.innerHTML = cardLogo;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar la marca de la tarjeta.'
      });
    }
  });
  
  // Función para determinar la marca de la tarjeta según el BIN (primeros 6 dígitos)
  function getCardType(cardNumber) {
    const firstTwoDigits = cardNumber.substring(0, 2);
    const firstFourDigits = cardNumber.substring(0, 4);
  
    // Luhn Algorithm para verificar si el número es válido
    if (!luhnCheck(cardNumber)) {
      return null; // Si la tarjeta no pasa el algoritmo Luhn, es inválida
    }
  
    // Verificación por tipo de tarjeta basada en los primeros dígitos (BIN)
    if (/^4/.test(firstTwoDigits)) {
      return 'visa'; // Tarjetas Visa comienzan con 4
    } else if (/^5[1-5]/.test(firstTwoDigits)) {
      return 'mastercard'; // MasterCard comienza con 51-55
    } else if (/^3[47]/.test(firstTwoDigits)) {
      return 'amex'; // American Express comienza con 34 o 37
    } else {
      return null; // Si no es uno de los tipos conocidos, retornar null
    }
  }
  
  // Algoritmo de Luhn para validar el número de tarjeta
  function luhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
  
    // Empezamos desde el último dígito y vamos hacia atrás
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
  
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9; // Sumar los dígitos si el resultado es mayor que 9
      }
  
      sum += digit;
      shouldDouble = !shouldDouble; // Alternamos entre multiplicar por 2 y no
    }
  
    return (sum % 10 === 0); // El número es válido si la suma es múltiplo de 10
  }
  