const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const port = 8000; // Mismo puerto que tu app.py

// Para leer body tipo form-data (como en request.form)
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET /students — obtener todos los estudiantes
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /students — crear un nuevo estudiante
app.post('/students', upload.none(), (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.send(`Student with id: ${this.lastID} created successfully`);
  });
});

// GET /student/:id — obtener un estudiante por ID
app.get('/student/:id', (req, res) => {
  const sql = `SELECT * FROM students WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) res.status(200).json(row);
    else res.status(404).send("Something went wrong");
  });
});

// PUT /student/:id — actualizar un estudiante
app.put('/student/:id', upload.none(), (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`;
  db.run(sql, [firstname, lastname, gender, age, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
        res.json({
        id: req.params.id,
        firstname,
        lastname,
        gender,
        age
        });
    });
});

// DELETE /student/:id — eliminar un estudiante
app.delete('/student/:id', (req, res) => {
  const sql = `DELETE FROM students WHERE id = ?`;
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.send(`The Student with id: ${req.params.id} has been deleted.`);
  });
});

app.listen(port, () => {
  console.log(`API corriendo en http://0.0.0.0:${port}`);
});
