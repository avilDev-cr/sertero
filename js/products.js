// Variable global para almacenar los productos
let allProducts = [];

// Función que filtra productos por categoría
function filterProductos(category) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = ''; // Limpiar la lista de productos

    let filteredProducts;

    if (category === "") {
        // Si la categoría es vacía (todas), muestra todos los productos
        filteredProducts = allProducts;
    } else {
        // Filtra los productos por la categoría seleccionada
        filteredProducts = allProducts.filter(product => product.category === category);
    }

    // Muestra los productos filtrados
    displayProducts(filteredProducts);
}


function loadProducts() {
    fetch('/json/products.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos de los productos");
            }
            return response.json();
        })
        .then(data => {
            allProducts = data; // Almacena todos los productos
            displayProducts(allProducts); // Muestra todos los productos al cargar
        })
        .catch(error => console.error("Hubo un problema al cargar los productos:", error));
}

// Nueva función para mostrar productos
function displayProducts(products) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = ''; // Limpiar la lista de productos

    products.forEach(product => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-3 col-sm-6 col-12 mb-4';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'product-card border bg-light text-center';

        const button = document.createElement('button');
        button.onclick = () => viewProductDetail(product.id);
        button.className = 'btn btn-link';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.width = 100;

        const title = document.createElement('h2');
        title.className = 'mt-2 text-uppercase ';
        title.textContent = product.name;

        const precio = document.createElement('h3');
        precio.className = 'text-primary ';
        precio.textContent = `${product.price}`;

        button.appendChild(img);
        button.appendChild(title);
        button.appendChild(precio);

        /*const buttonAdd = document.createElement('button');
        buttonAdd.className = 'btn-add mb-2';
        buttonAdd.textContent = 'Agregar al carrito';
        buttonAdd.onclick = () => addToCart(product.id);

        cardDiv.appendChild(button);
        cardDiv.appendChild(buttonAdd);
        colDiv.appendChild(cardDiv);
        productListElement.appendChild(colDiv);*/

         // Cambia el texto del botón y acción
         const buttonAdd = document.createElement('button');
         buttonAdd.className = 'btn-add mb-2';
         buttonAdd.textContent = 'Más detalles'; // Cambiado de "Agregar al carrito" a "Más detalles"
         buttonAdd.onclick = () => viewProductDetail(product.id); // Redirigir al detalle del producto
 
         cardDiv.appendChild(button);
         cardDiv.appendChild(buttonAdd);
         colDiv.appendChild(cardDiv);
         productListElement.appendChild(colDiv);
    });
}



// Función para redirigir al detalle del producto
function viewProductDetail(index) {
    fetch('/json/products.json')
        .then(response => response.json())
        .then(products => {
            const selectedProduct = products.find(product => product.id === index);
            if (selectedProduct) {
                localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
                window.location.href = "detalleProducto.html";
            }
        })
        .catch(error => console.error("Hubo un problema al cargar el producto:", error));
}

// Cargar productos al cargar la página
window.onload = loadProducts;
