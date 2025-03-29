import { Router } from 'express';
import { helloWorld } from './controllers/index';
import { carga } from './controllers/carga';

export const router = Router();

router.get('/', helloWorld);
router.post('/carga', carga);

