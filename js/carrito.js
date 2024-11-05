// Agregar producto al carrito
function addToCart(productId) {
    // Obtener el carrito de localStorage o crear uno vacío
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productExists = cart.find(item => item.id === productId);
    
    if (productExists) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        productExists.quantity += 1;
    } else {
        // Agregar el nuevo producto con cantidad 1
        cart.push({ id: productId, quantity: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(); // Actualizar la interfaz si es necesario
}


// Cargar y mostrar los productos del carrito
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        // Aquí podrías hacer una consulta para obtener los detalles del producto desde tu JSON o API
        // y luego crear los elementos HTML correspondientes.
    });

    // Llama a updateTotal para mostrar el total actualizado
    updateTotal();
}

// Calcular y mostrar el total
function updateTotal() {
    let total = 0;
    // Recorre el carrito y calcula el total con base en las cantidades y precios de los productos
    // Actualiza el DOM con el total
}
