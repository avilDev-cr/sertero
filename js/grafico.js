const productos = [
    { name: "Caminadora Profesional", ventas: 120, img: "/imgs/Bodytone-Caminadora-Profesional-EVOT4-110V-Motor-4HP-AC.jpg.webp" },
    { name: "Bicicleta Vertical", ventas: 98, img: "/imgs/BT-EVOU4-Bodytone-Bicicleta-Vertical-BT-EVOU4.jpg.webp" },
    { name: "Elíptica", ventas: 150, img: "/imgs/PWG-SF-RB4616_17.jpg.webp" },
    { name: "Elíptica Semiprofesional", ventas: 80, img: "/imgs/PWG-BT-EVOE4-ELIPTICA-SEMI-PROFESI0NAL-MARCA-BODYTONE.webp" },
    { name: "Aperturas  de Hombro", ventas: 130, img: "/imgs/BT-E23-Bodytone-Aperturas-y-deltoides-Pec-Fly-and-Rear-Delt-BT-E23.webp" }
];

const labels = productos.map(p => p.name);
const ventas = productos.map(p => p.ventas);

// Colores para las barras
const colors = [
    'rgba(54, 162, 235, 0.7)', 
    'rgba(255, 99, 132, 0.7)', 
    'rgba(75, 192, 192, 0.7)', 
    'rgba(153, 102, 255, 0.7)', 
    'rgba(255, 159, 64, 0.7)', 
    'rgba(255, 99, 71, 0.7)', 
    'rgba(34, 193, 195, 0.7)', 
    'rgba(253, 187, 45, 0.7)'
];

const ctx = document.getElementById('productosChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Ventas (Unidades)',
            data: ventas,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.7', '1')),
            borderWidth: 2,
            hoverBackgroundColor: colors.map(color => color.replace('0.7', '1')),
            hoverBorderColor: '#ffffff',
            hoverBorderWidth: 3
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    color: '#ffffff',
                    font: { size: 0 }
                }
            },
            y: {
                ticks: {
                    color: '#ffffff',
                    font: { size: 14 }
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#333333',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#444444',
                borderWidth: 1
            }
        }
    }
});

// Mostrar imagen al pasar el ratón por las barras
const productImage = document.getElementById('productImage');
ctx.canvas.addEventListener('mousemove', function(event) {
    const activePoint = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    if (activePoint.length) {
        const index = activePoint[0].index;
        const product = productos[index];
        productImage.src = product.img;
        productImage.style.display = 'block';
        productImage.style.left = `${event.clientX + 15}px`;
        productImage.style.top = `${event.clientY + 15}px`;
    } else {
        productImage.style.display = 'none';
    }
});


const legendDiv = document.getElementById('legend');
productos.forEach((producto, index) => {
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item');
    legendItem.innerHTML = `
        <span style="background-color: ${colors[index]}"></span>${producto.name}
    `;
    legendDiv.appendChild(legendItem);
});
