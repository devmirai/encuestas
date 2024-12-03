import express from "express";
import { db } from "../app.js";

const router = express.Router();

// Obtener todas las respuestas
router.get("/", (req, res) => {
  db.query("SELECT * FROM respuestas", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Crear una nueva respuesta
router.post("/", (req, res) => {
  const { usuario_id, pregunta_id, valor } = req.body;
  if (!usuario_id || !pregunta_id || !valor) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query = "INSERT INTO respuestas (usuario_id, pregunta_id, valor) VALUES (?, ?, ?)";
  db.query(query, [usuario_id, pregunta_id, valor], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, usuario_id, pregunta_id, valor });
  });
});

export default router;