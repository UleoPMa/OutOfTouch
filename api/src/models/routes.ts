import express from "express";
import dbClient from "./dbClient.ts"; // Importar la conexión a la BD
import { ObjectId } from "mongodb";

const app = express();
app.use(express.json());

let db;

// Conectar a la base de datos `GreenFlow` antes de iniciar las rutas
(async () => {
  await dbClient.conectarBD();
  db = dbClient.getDB().collection("Data"); // Acceder a la colección `Data`
})();

// 🔹 Obtener todos los registros de sensores
app.get("/data", async (req, res) => {
  try {
    const sensorData = await db.find().toArray();
    res.status(200).json(sensorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Obtener un solo registro por ID
app.get("/data/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const sensor = await db.findOne({ _id: new ObjectId(id) });

    if (!sensor) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(sensor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Agregar un nuevo registro de sensor
app.post("/data", async (req, res) => {
  const { Date, Time, PM, TWA, HUMIDITY, PPM } = req.body;

  if (!Date || !Time || isNaN(PM) || isNaN(TWA) || isNaN(HUMIDITY) || isNaN(PPM)) {
    return res.status(400).json({ error: "Datos inválidos o incompletos" });
  }

  try {
    const newSensor = {
      Date,
      Time,
      PM: parseFloat(PM),
      TWA: parseFloat(TWA),
      HUMIDITY: parse
