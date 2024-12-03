import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2";
import questionRoutes from "./routes/questions.js";
import userRoutes from "./routes/users.js";
import responseRoutes from "./routes/responses.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    process.exit(1);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

export { db };

app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/responses", responseRoutes);

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
