import { Router } from 'express';
import { carga } from './controllers/carga';
import { helloWorld } from './controllers/index.js';
const { enviar } = require('./controllers/correo');

export const router = Router();

router.get('/', helloWorld);
router.post('/carga', carga);
router.post('/enviar-correo', enviar);