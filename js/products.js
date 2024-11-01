 // Datos de productos
 const products = [
    {
        id: 0,
        name: "Caminadora Profesional PWG-EVOT4",
        specs: ["Uso doméstico / profesional.", "Potencia de 4 CV", "Peso máximo de usuario 180 kg"],
        description: "Descripción del producto 1",
        price: "$10",
        quantity: 5,
        image: "../imgs/Bodytone-Caminadora-Profesional-EVOT4-110V-Motor-4HP-AC.jpg.webp"
    },
    { id: 1, name: "BICICLETA VERTICAL PWG-EVOU4", description: "Descripción del producto 2", price: "$20", quantity: 5,image: "../imgs/BT-EVOU4-Bodytone-Bicicleta-Vertical-BT-EVOU4.jpg.webp" },
    { id: 2, name: "Producto 3", description: "Descripción del producto 3", price: "$30", quantity: 5 },
    { id: 3, name: "Producto 4", description: "Descripción del producto 4", price: "$10", quantity: 5 },
    { id: 4, name: "Producto 5", description: "Descripción del producto 5", price: "$20", quantity: 5 },
    { id: 5, name: "Producto 6", description: "Descripción del producto 6", price: "$30", quantity: 5 },
    { id: 6, name: "Producto 7", description: "Descripción del producto 7", price: "$10", quantity: 5 },
    { id: 7, name: "Producto 8", description: "Descripción del producto 8", price: "$20", quantity: 5 }
];

// Función para crear la lista de productos
function loadProducts() {
    const productListElement = document.getElementById('product-list');
    products.forEach(product => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-3 col-sm-6 col-12 mb-4';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'product-card p-2 border bg-light text-center';

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

        button.appendChild(img);
        button.appendChild(title);
        cardDiv.appendChild(button);
        colDiv.appendChild(cardDiv);
        productListElement.appendChild(colDiv);
    });
}

// Función para redirigir al detalle del producto
function viewProductDetail(index) {
    // Guarda el ID en localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(products[index]));
    // Redirige a la página de detalles
    window.location.href = "detalleProducto.html";
}

// Cargar productos al cargar la página
window.onload = loadProducts;