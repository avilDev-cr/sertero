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
  doc.setFontSize(10);

  // --- HEADER ---
  const headerHeight = 40;

  doc.setFillColor(0, 0, 0); // Color negro
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');
  doc.setTextColor(255, 255, 255);

  doc.setFontSize(12);
  doc.text("SERTERO S.A", doc.internal.pageSize.width / 2, 10, { align: "center" });
  doc.setFontSize(10);
  doc.text("Avenida Central, Alajuela, Costa Rica", doc.internal.pageSize.width / 2, 15, { align: "center" });
  doc.text("Teléfono: +506 9040-8945", doc.internal.pageSize.width / 2, 20, { align: "center" });
  doc.text("Correo: sertero@gmail.com", doc.internal.pageSize.width / 2, 25, { align: "center" });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Número de Factura: ${generateRandomInvoiceNumber()}`, doc.internal.pageSize.width / 2, headerHeight + 10, { align: "center" });

  const clienteNombre = "Nombre del Cliente";
  doc.text(`Cliente: ${clienteNombre}`, doc.internal.pageSize.width / 2, headerHeight + 15, { align: "center" });

  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width / 2, headerHeight + 20, { align: "center" });

  // Espacio entre el encabezado y el contenido
  const contentStartY = headerHeight + 30;

  // --- TABLA DE PRODUCTOS ---
  const paddingLeft = 15;  // Padding lateral de 15 unidades
  const columnWidth = (doc.internal.pageSize.width - 2 * paddingLeft) / 6; // Ajustar el ancho de las columnas

  // Cabecera de la tabla
  doc.text("Imagen", paddingLeft, contentStartY + 5);
  doc.text("Nombre", paddingLeft + columnWidth, contentStartY + 5);
  doc.text("Precio", paddingLeft + 2 * columnWidth, contentStartY + 5);
  doc.text("Cantidad", paddingLeft + 3 * columnWidth, contentStartY + 5);
  doc.text("Subtotal", paddingLeft + 4 * columnWidth, contentStartY + 5);
  doc.text("Envío", paddingLeft + 5 * columnWidth, contentStartY + 5);
  doc.text("Total", paddingLeft + 6 * columnWidth, contentStartY + 5);

  let yPosition = contentStartY + 10;

  // Función para dividir texto largo en varias líneas
  function splitTextToFit(text, maxWidth) {
    const lines = [];
    let currentLine = "";
    const words = text.split(" ");

    words.forEach(word => {
      const testLine = currentLine ? currentLine + " " + word : word;
      const testWidth = doc.getTextWidth(testLine);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Iterar sobre los productos del carrito y agregar los datos a la tabla
  carrito.forEach((producto) => {
    const itemPrice = parsePrice(producto.price);
    const itemShippingCost = parsePrice(producto.shipping_cost);
    const itemSubtotal = itemPrice * producto.quantity;
    const itemTotal = itemSubtotal + itemShippingCost;

    // Agregar la imagen del producto (si está disponible)
    if (producto.image) {
      doc.addImage(producto.image, "JPEG", paddingLeft, yPosition, 15, 15);
    }

    // Dividir el nombre largo en varias líneas
    const nombreLines = splitTextToFit(producto.name, columnWidth);

    // Dibujar el nombre del producto, dividiéndolo en líneas si es necesario
    let nombreYPosition = yPosition;
    nombreLines.forEach((line, index) => {
      doc.text(line, paddingLeft + columnWidth, nombreYPosition + index * 5);
    });

    // Resto de la tabla
    doc.text(`${itemPrice.toLocaleString()}`, paddingLeft + 2 * columnWidth, yPosition + 4);
    doc.text(`${producto.quantity}`, paddingLeft + 3 * columnWidth, yPosition + 4);
    doc.text(`${itemSubtotal.toLocaleString()}`, paddingLeft + 4 * columnWidth, yPosition + 4);
    doc.text(`${itemShippingCost.toLocaleString()}`, paddingLeft + 5 * columnWidth, yPosition + 4);
    doc.text(`${itemTotal.toLocaleString()}`, paddingLeft + 6 * columnWidth, yPosition + 4);

    yPosition += 15 + (nombreLines.length - 1) * 5; // Aumentar la posición Y según las líneas del nombre
  });

  // Agregar el total al final de la factura
  const totalAmount = carrito.reduce((acc, item) => {
    const itemPrice = parsePrice(item.price);
    const itemShippingCost = parsePrice(item.shipping_cost);
    const itemSubtotal = itemPrice * item.quantity;
    const itemTotal = itemSubtotal + itemShippingCost;
    return acc + itemTotal;
  }, 0);

  // Ajustar la posición para el "Monto Total"
  const totalTextX = doc.internal.pageSize.width - 50;
  doc.text(`Monto Total: ${totalAmount.toLocaleString()}`, totalTextX, yPosition + 10, { align: "right" });

  // --- FOOTER ---
  doc.setFillColor(0, 0, 0);
  doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text("Gracias por su compra", doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });

  // Guardar el PDF
  doc.save("factura_compras.pdf");

  // Función para convertir los precios con formato "$1000" o "₡1000" a números
  function parsePrice(price) {
    return parseFloat(price.replace(/[₡$,]/g, ""));
  }

  // Función para generar un número de factura aleatorio
  function generateRandomInvoiceNumber() {
    return Math.floor(Math.random() * 1000000);
  }
}


// Inicializar el carrito al cargar la página
updateCart();
