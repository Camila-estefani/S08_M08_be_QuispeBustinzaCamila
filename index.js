const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());
app.use(cors());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'VeterinariaDB API', version: '1.0.0', description: 'API para gestión de mascotas' },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./index.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const dbConfig = {
    user: 'sa',
    password: 'Mascotas2026!',
    server: 'localhost',
    port: 1435,
    database: 'VeterinariaDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Listar todas las mascotas
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
app.get('/mascotas', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM Mascotas");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /mascotas:
 *   post:
 *     summary: Agregar una mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               especie: { type: string }
 *               edad: { type: integer }
 *               nombre_dueno: { type: string }
 *     responses:
 *       200:
 *         description: Mascota agregada
 */
app.post('/mascotas', async (req, res) => {
    const { nombre, especie, edad, nombre_dueno } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('especie', sql.VarChar, especie)
            .input('edad', sql.Int, edad)
            .input('dueno', sql.VarChar, nombre_dueno)
            .query("INSERT INTO Mascotas (nombre, especie, edad, nombre_dueno) VALUES (@nombre, @especie, @edad, @dueno)");
        res.json({ message: "Mascota agregada!" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mascota eliminada
 */
app.delete('/mascotas/:id', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query("DELETE FROM Mascotas WHERE id = @id");
        res.json({ message: "Mascota eliminada" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
/**
 * @swagger
 * /mascotas/update/{id}:
 *   post:
 *     summary: Actualizar una mascota
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               especie: { type: string }
 *               edad: { type: integer }
 *               nombre_dueno: { type: string }
 *     responses:
 *       200:
 *         description: Mascota actualizada
 */
app.post('/mascotas/update/:id', async (req, res) => {
    const { nombre, especie, edad, nombre_dueno } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('nombre', sql.VarChar, nombre)
            .input('especie', sql.VarChar, especie)
            .input('edad', sql.Int, edad)
            .input('dueno', sql.VarChar, nombre_dueno)
            .query("UPDATE Mascotas SET nombre=@nombre, especie=@especie, edad=@edad, nombre_dueno=@dueno WHERE id=@id");
        res.json({ message: "Mascota actualizada" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
    console.log('Backend listo en http://localhost:3000');
});