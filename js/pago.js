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
    const itemTotal = isPickup ? itemSubtotal : itemSubtotal + itemShippingCost;

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

document.getElementById("checkout-btn").addEventListener("click", function () {
  // Validación de campos del formulario de pago
  const name = document.getElementById("name").value.trim();
  const cardNumber = document.getElementById("cardnumber").value.trim();
  const expirationDate = document.getElementById("expirationdate").value.trim();
  const securityCode = document.getElementById("securitycode").value.trim();

  // Verificar si todos los campos están completos
  if (!name || !cardNumber || !expirationDate || !securityCode) {
    Swal.fire({
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos del método de pago antes de continuar.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    return; // Detener la función si algún campo está vacío
  }

  // Proceder con el pago solo si el carrito tiene productos
  if (cart.length > 0) {
    const totalAmount = document.getElementById("total-price").innerText;
    Swal.fire({
      title: "Monto a pagar",
      text: `El monto total de tu compra es: ₡${totalAmount}. ¿Deseas confirmar el pago?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma el pago
        Swal.fire({
          title: "Pago exitoso",
          text: "¡Gracias por tu compra! Tu pago ha sido procesado.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          // Crear la factura en PDF antes de vaciar el carrito
          generateInvoicePDF();

          // Vaciar el carrito después de generar el PDF
          cart = [];
          localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito vacío
          updateCart(); // Actualizar la vista del carrito

          // Restablecer campos del formulario de pago después de la compra
          document.getElementById("name").value = "";
          document.getElementById("cardnumber").value = "";
          document.getElementById("expirationdate").value = "";
          document.getElementById("securitycode").value = "";
        });
      } else {
        // Si el usuario cancela el pago
        Swal.fire({
          title: "Pago pendiente",
          text: "Tu pago está pendiente. El carrito permanece con tus productos.",
          icon: "info",
          confirmButtonText: "Aceptar",
        });
      }
    });
  } else {
    // Si el carrito está vacío
    Swal.fire({
      title: "Tu carrito está vacío",
      text: "Agrega productos antes de proceder.",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
  }
});



function generateInvoicePDF() {
  // Obtener los productos desde localStorage
  let carrito = JSON.parse(localStorage.getItem("cart")) || [];

  // Crear el documento PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Establecer la fuente
  doc.setFontSize(10);  // Reducir el tamaño de la fuente

  // Agregar información de la empresa
  doc.text("SERTERO S.A", 10, 10);
  doc.text("Avenida Central, Alajuela, Costa Rica", 10, 15);
  doc.text("Teléfono: +506 9040-8945", 10, 20);
  doc.text("Correo: sertero@gmail.com", 10, 25);
  
  // Agregar el número de factura
  doc.text(`Número de Factura: ${generateRandomInvoiceNumber()}`, 10, 35);

  // Obtener el nombre del cliente (suponiendo que tienes esa información)
  const clienteNombre = "Nombre del Cliente"; // Cambiar por el nombre del cliente real
  doc.text(`Cliente: ${clienteNombre}`, 10, 40);

  // Agregar la fecha de la factura
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 45);

  // Crear el encabezado de la tabla
  doc.text("Imagen", 10, 55);
  doc.text("Nombre", 30, 55);
  doc.text("Precio", 80, 55);
  doc.text("Cantidad", 110, 55);
  doc.text("Subtotal", 140, 55);
  doc.text("Costo de Envío", 170, 55);
  doc.text("Total", 200, 55);

  let yPosition = 60;

  // Iterar sobre los productos del carrito y agregar los datos a la tabla del PDF
  carrito.forEach((producto) => {
    const itemPrice = parsePrice(producto.price); // Convertir el precio a número
    const itemShippingCost = parsePrice(producto.shipping_cost); // Convertir costo de envío a número
    const itemSubtotal = itemPrice * producto.quantity;
    const itemTotal = itemSubtotal + itemShippingCost;

    // Agregar la imagen del producto (si está disponible)
    if (producto.image) {
      doc.addImage(producto.image, "JPEG", 10, yPosition, 15, 15); // Ajustar tamaño y posición
    }

    // Ajustar la posición para que el nombre no tape las otras columnas
    doc.text(producto.name, 30, yPosition + 4, { maxWidth: 45, align: "left" });  // Ajuste automático de texto
    doc.text(`${itemPrice.toLocaleString()}`, 80, yPosition + 4); // Ajustar la posición vertical para evitar solapamientos
    doc.text(`${producto.quantity}`, 110, yPosition + 4); // Ajustar la posición vertical para evitar solapamientos
    doc.text(`${itemSubtotal.toLocaleString()}`, 140, yPosition + 4); // Ajustar la posición vertical para evitar solapamientos
    doc.text(`${itemShippingCost.toLocaleString()}`, 170, yPosition + 4); // Ajustar la posición vertical para evitar solapamientos
    doc.text(`${itemTotal.toLocaleString()}`, 200, yPosition + 4); // Ajustar la posición vertical para evitar solapamientos

    yPosition += 18; // Incrementar la posición vertical para la siguiente fila, más espacio para la imagen
  });

  // Agregar el total al final de la factura
  const totalAmount = carrito.reduce((acc, item) => {
    const itemPrice = parsePrice(item.price);
    const itemShippingCost = parsePrice(item.shipping_cost);
    const itemSubtotal = itemPrice * item.quantity;
    const itemTotal = itemSubtotal + itemShippingCost;
    return acc + itemTotal;
  }, 0);

  // Monto total
  doc.text(`Monto Total: ${totalAmount.toLocaleString()}`, 10, yPosition + 10);

  // Guardar el PDF
  doc.save("factura_compras.pdf");

  // Función para convertir los precios con formato "$1000" o "₡1000" a números
  function parsePrice(price) {
    // Eliminar símbolos de moneda y comas, luego convertir a número
    return parseFloat(price.replace(/[₡$,]/g, ""));
  }

  // Función para generar un número de factura aleatorio
  function generateRandomInvoiceNumber() {
    return Math.floor(Math.random() * 1000000);
  }
}

// Inicializar el carrito al cargar la página
updateCart();
