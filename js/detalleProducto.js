
    // Obtiene el producto seleccionado de localStorage
    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    // Verifica si el producto existe y muestra sus detalles
    if (product) {
        document.getElementById("product-detail").innerHTML = `
        <div class="image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="info-container">
            <h2>${product.name}</h2>
            <h3>Especificaciones:</h3>
            <ul>
                ${product.specs ? product.specs.map(spec => `<li>${spec}</li>`).join("") : "<li>No especificado</li>"}
            </ul>
            <p><strong>Descripción:</strong> ${product.description || "No disponible"}</p> 
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Cantidad disponible:</strong> ${product.quantity}</p>
            <p><strong>Categoría:</strong> ${product.category || "No especificado"}</p>
            <p><strong>Tiempo de entrega:</strong> ${product.delivery_time || "No especificado"}</p>
            <p><strong>Costo de envío:</strong> ${product.shipping_cost || "No especificado"}</p>
            <p><strong>Opciones de entrega:</strong> ${product.delivery_options && product.delivery_options.length > 0 
                ? product.delivery_options.join(", ") 
                : "No especificadas"}</p>
            <p><strong>Información de devolución:</strong> <a href="${product.return_info}" target="_blank">Ver información de cambios y devoluciones</a></p>
            <p><strong>Información de contacto:</strong> <a href="${product.contact_info}">Contactar</a></p>
            <p><strong>Garantía:</strong> ${product.warranty || "No especificada"}</p>

            <h3>Reseñas de usuarios:</h3>
            <ul>
                ${product.user_reviews && product.user_reviews.length > 0 
                    ? product.user_reviews.map(review => `
                        <li>
                            <p>"${review.review}" - Calificación: ${review.rating} estrellas</p>
                        </li>`).join("") 
                    : "<li>No hay reseñas disponibles.</li>"}
            </ul>
            <button>Agregar al carrito</button>
        </div>
        `;
    } else {
        // Si no hay producto, muestra un mensaje de error
        document.getElementById("product-detail").innerHTML = "<p>No se encontró el producto.</p>";
    }

