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
               <li>${product.specs}</li></ul>

           <p>${product.description}</p>
           <p>Precio: ${product.price}</p>
           <button>Agregar al carrito</button>
       </div>
       `;
   } else {
       // Si no hay producto, muestra un mensaje de error
       document.getElementById("product-detail").innerHTML = "<p>No se encontró el producto.</p>";
   }