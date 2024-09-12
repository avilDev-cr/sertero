const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware para parsear datos JSON
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',       // Cambia esto según tu configuración
    user: 'root',            // Cambia esto según tu configuración
    password: '',            // Cambia esto según tu configuración
    database: 'sertero_db'   // Nombre de la base de datos
});

// Promisify para usar async/await
const promisePool = pool.promise();

// Ruta para recibir reportes de averías
app.post('/api/reportes', async (req, res) => {
    const { nombre, email, descripcion } = req.body;

    try {
        const [result] = await promisePool.query('INSERT INTO reportes (nombre, email, descripcion) VALUES (?, ?, ?)', [nombre, email, descripcion]);
        res.status(200).json({ message: 'Reporte recibido y guardado correctamente', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al guardar el reporte' });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Reportes de Averías');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
