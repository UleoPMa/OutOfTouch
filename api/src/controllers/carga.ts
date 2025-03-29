import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import { SensorData } from '../models/Data.js';

const app = express();

// Middleware para parsear el cuerpo de la solicitud en JSON
app.use(express.json());

interface SensorDataFormat {
  Date: string;
  Time: string;
  PM: number;
  TWA: number;
  HUMIDITY: number;
  PPM: number;
}

// Función para convertir el archivo TXT a JSON
const extraerValores = (nombreArchivo: string): SensorDataFormat[] => {
  const datos: SensorDataFormat[] = [];
  let contadorFilas = 0;

  try {
    const contenidoArchivo = fs.readFileSync(nombreArchivo, 'utf-8');
    const lineas = contenidoArchivo.split('\n');  // Dividir el archivo en líneas
    lineas.shift();  // Ignorar la primera línea (encabezados)

    lineas.forEach((linea: string) => {
      contadorFilas++;
      const valores = linea.trim().split('\t');  // Dividir cada línea por tabulaciones

      if (valores.length >= 17) {
        try {
          // Extraer y convertir los valores relevantes
          datos.push({
            Date: valores[1],
            Time: valores[2],
            PM: parseFloat(valores[3]),
            TWA: parseFloat(valores[8]),
            HUMIDITY: parseFloat(valores[10]),
            PPM: parseFloat(valores[16]),
          });
        } catch (error) {
          console.error(`Error de conversión en línea ${contadorFilas}: ${error}`);
        }
      }
    });

    console.log(`Se procesaron ${contadorFilas} filas.`);
    return datos;  // Retorna los datos en formato JSON
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: El archivo '${nombreArchivo}' no se encontró.`);
    } else {
      console.error(`Ocurrió un error inesperado: ${error.message}`);
    }
    throw new Error('No se pudo procesar el archivo');
  }
};

// Ruta para manejar la carga de datos
export const carga = async (req: Request, res: Response) => {
  const { filePath } = req.body;  // Suponiendo que el archivo se pasa a través del cuerpo de la solicitud

  try {
    // Convertir el archivo TXT a JSON
    const jsonData = extraerValores(filePath);

    // Insertar los datos convertidos en MongoDB
    await SensorData.insertMany(jsonData);

    res.json({ message: 'Carga exitosa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
