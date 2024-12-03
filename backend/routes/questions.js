import express from "express";
import { db } from "../app.js"; // Cambiado a "../app.js"

const router = express.Router();

// Crear una nueva pregunta
router.post("/", (req, res) => {
  const { titulo, contenido } = req.body;

  db.query(
    "INSERT INTO preguntas (titulo, contenido) VALUES (?, ?)",
    [titulo, contenido],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error en el servidor" });
      }
      res.status(201).json({ message: "Pregunta creada con éxito" });
    }
  );
});

// Editar una pregunta
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, contenido } = req.body;

  db.query(
    "UPDATE preguntas SET titulo = ?, contenido = ? WHERE id = ?",
    [titulo, contenido, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error en el servidor" });
      }
      res.status(200).json({ message: "Pregunta actualizada con éxito" });
    }
  );
});

export default router;
// Obtener todas las preguntas
router.get("/", (req, res) => {
  db.query("SELECT * FROM preguntas", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    res.status(200).json(results);
  });
});

// Obtener una pregunta por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM preguntas WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }
    res.status(200).json(results[0]);
  });
});