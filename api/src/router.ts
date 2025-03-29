const { enviar } = require('./controllers/correo');
import { Router } from 'express';
import { helloWorld } from './controllers/index.js';

export const router = Router();

router.post('/enviar-correo', enviar);
router.get('/', helloWorld);