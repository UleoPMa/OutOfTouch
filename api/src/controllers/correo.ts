const nodemailer = require('nodemailer');
import { Request, Response } from 'express';
import dotenv = require ('dotenv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

dotenv.config();


export const enviar = async (req: Request, res: Response) => {
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const pdfPath = path.join(__dirname, 'documento.pdf'); 
    const doc = new PDFDocument();

    // Agregar título
    doc.font('Times-Roman').fontSize(20).text('Reporte sobre los Niveles de CO2', { align: 'center' });
    doc.moveDown();

    // Introducción
    doc.font('Times-Roman').fontSize(12).text('El dióxido de carbono (CO2) es un gas incoloro e inodoro que puede acumularse en espacios cerrados, afectando la calidad del aire y la salud de los trabajadores. En entornos industriales, donde la actividad operativa puede generar emisiones adicionales de CO2, es fundamental implementar medidas efectivas para controlar los niveles de CO2. El siguiente informe proporciona recomendaciones específicas para tu empresa.', { align: 'justify' });
    doc.moveDown();

    // Recomendaciones
    doc.font('Times-Roman').fontSize(12).text('Recomendaciones para Mantener un Buen Nivel de CO2');
    doc.moveDown();
    doc.font('Times-Roman').fontSize(12).text('1. Ventilación adecuada:');
    doc.font('Times-Roman').text('- Procura que puertas y ventanas permanezcan abiertas en áreas donde sea seguro hacerlo.');
    doc.font('Times-Roman').text('- Garantiza la adecuada circulación del aire en zonas de producción y almacenamiento.');
    doc.moveDown();

    doc.font('Times-Roman').text('2. Optimización del uso del espacio:');
    doc.font('Times-Roman').text('- Regula la cantidad de trabajadores en áreas cerradas y fomenta el uso de espacios abiertos cuando sea posible.');
    doc.moveDown();

    doc.font('Times-Roman').text('3. Sistemas de filtración de aire:');
    doc.font('Times-Roman').text('- Mantén en buen estado los sistemas de filtración y extracción de aire en áreas de producción.');
    doc.moveDown();

    // Prohibiciones
    doc.font('Times-Roman').fontSize(12).text('Prohibiciones para Prevenir la Acumulación de CO2');
    doc.moveDown();
    doc.font('Times-Roman').fontSize(12).text('- Queda estrictamente prohibido el uso de equipos de combustión interna en espacios cerrados sin un sistema de extracción eficiente.');
    doc.moveDown();

    // Síntomas y acción recomendada
    doc.font('Times-Roman').text('Si el personal presenta síntomas como fatiga, mareos o dificultades para respirar, es recomendable mejorar el sistema de ventilación de inmediato.');
    doc.moveDown();

    // Conclusión
    doc.font('Times-Roman').fontSize(16).text('Conclusión', { align: 'center' });
    doc.moveDown();
    doc.font('Times-Roman').fontSize(12).text('Mantener niveles adecuados de CO2 en entornos cerrados es esencial para garantizar la seguridad y el bienestar de tus trabajadores. Implementar estas estrategias de ventilación, monitoreo y control del aire te ayudará a prevenir la acumulación de este gas y a mejorar la productividad. Siguiendo estas recomendaciones, tu empresa puede asegurar una correcta optimización de la calidad del aire, además de cumplir con las normativas de seguridad ambiental correspondientes.', { align: 'justify' });
    doc.end();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.EMAIL_PASS 
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        text: message,
        attachments: [
            {
                filename: 'documento.pdf',
                path: pdfPath
            }
        ]
    };

    doc.pipe(fs.createWriteStream(pdfPath)).on('finish', async () => {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully!', info: info.response });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email. Please try again later.' });
        }
    });
};
