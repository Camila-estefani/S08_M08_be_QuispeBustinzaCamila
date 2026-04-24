const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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

// 1. GET: Listar todas las mascotas
app.get('/mascotas', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM Mascotas");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. POST: Agregar una mascota
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

// 3. DELETE: Eliminar una mascota
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
// 4. PUT: Editar una mascota
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