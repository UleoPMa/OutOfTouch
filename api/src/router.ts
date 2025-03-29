import { Router } from 'express';
import { helloWorld } from './controllers/index.js';
const { enviar } = require('./controllers/correo');

export const router = Router();

router.get('/', helloWorld);
router.post('/enviar-correo', enviar);
