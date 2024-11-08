// Cargar el carrito desde el localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCart() {
  let cartTableBody = document.getElementById("cart-items");
  cartTableBody.innerHTML = ""; // Limpiar la tabla antes de volver a llenarla
  let totalPrice = 0;

  cart.forEach((item, index) => {
    // Si la cantidad no está definida o es 0, la inicializamos en 1
    if (item.quantity <= 0 || !item.quantity) {
      item.quantity = 1;
    }

    // Calculando subtotal y total con el costo de envío
    const itemSubtotal = item.price * item.quantity;
    const itemTotal = itemSubtotal + item.shipping_cost;

    cartTableBody.innerHTML += `
          <tr>
              <td><img src="${item.image}" alt="${item.name}" class="img-fluid" width="50"></td>
              <td>${item.name}</td>
              <td>${item.price} </td>
              <td><input type="number" value="${item.quantity}" min="1" class="form-control quantity-input" data-index="${index}"></td>
              <td class="item-subtotal">${itemSubtotal} </td>
              <td>${item.shipping_cost} </td>
              <td class="item-total">${itemTotal} </td>
              <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Eliminar</button></td>
          </tr>
      `;

    totalPrice += itemTotal; // Sumar el total de cada producto
  });

  // Actualizar el total general
  document.getElementById("total-price").innerText = totalPrice;
}

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
      const newQuantity = parseInt(event.target.value);
      if (newQuantity > 0) {
        // Actualizar la cantidad del producto
        cart[index].quantity = newQuantity;

        // Actualizar el subtotal del producto
        const itemSubtotal = cart[index].price * newQuantity;
        const itemTotal = itemSubtotal + cart[index].shipping_cost;

        // Actualizar el subtotal y el total del producto en la tabla
        const row = event.target.closest("tr");
        row.querySelector(".item-subtotal").innerText = itemSubtotal;
        row.querySelector(".item-total").innerText = itemTotal;

        // Actualizar el carrito y el total general
        localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado
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

     
    }
  });

// Inicializar el carrito al cargar la página
updateCart();


