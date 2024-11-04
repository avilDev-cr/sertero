//Funcion que filtre productos por categoria
function filterProductos(){
    
}


// Función para crear la lista de productos
function loadProducts() {
    fetch('/json/products.json') // Cambia la ruta según la ubicación del archivo
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos de los productos");
            }
            return response.json();
        })
        .then(data => {
            const productListElement = document.getElementById('product-list');
            
            data.forEach(product => {
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
                title.className = 'mt-2';
                title.textContent = product.name;


               
                const precio = document.createElement('h3');
                precio.className = 'text-primary ';
                precio.textContent = `${product.price}`;

                const buttonadd = document.createElement('button');
                buttonadd.className = ' btn-add';
                buttonadd.textContent = 'Ver detalles';

                
                button.appendChild(img);
                button.appendChild(title);
                button.appendChild(precio);
                button.appendChild(buttonadd)
                cardDiv.appendChild(button);
                colDiv.appendChild(cardDiv);
                productListElement.appendChild(colDiv);
            });
        })
        .catch(error => console.error("Hubo un problema al cargar los productos:", error));
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
