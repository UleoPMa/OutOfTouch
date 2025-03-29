import mongoose from "mongoose"

const sensorDataSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    pm: { type: Number, required: true },
    twa: { type: Number, required: true },
    humidity: { type: Number, required: true },
    ppm: { type: Number, required: true }
  }, { timestamps: true });
  
export const SensorData = mongoose.model('SensorData', sensorDataSchema);
