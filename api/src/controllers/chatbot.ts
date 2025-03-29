import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const postMessage = async (req: Request, res: Response) => {
    const { data } = req.body;
    
    if (!data) return res.status(400).json({ message: "No se ha proporcionado ningún dato." });
    
    try {
        const response = await analyzeWithAI(data);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Error al procesar la solicitud.", error });
    }
}

async function analyzeWithAI(data: any) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: data
    });
    return response.text;
}