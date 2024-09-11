const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_password',
    database: 'sertero_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado como ID ' + connection.threadId);
});

app.get('/data', (req, res) => {
    connection.query('SELECT * FROM tabla', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
