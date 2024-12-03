import express from "express";
import { db } from "../app.js";

const router = express.Router();

// Inicio de sesión
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT id, correo, nombre, apellido, rol_id FROM usuarios WHERE correo = ? AND contraseña = ?",
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error en el servidor" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const user = results[0];
      return res.json({ message: "Inicio de sesión exitoso", user });
    }
  );
});

// Obtener todos los usuarios
router.get("/", (req, res) => {
  db.query("SELECT id, correo, nombre, apellido, rol_id FROM usuarios", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    res.json(results);
  });
});

export default router;
