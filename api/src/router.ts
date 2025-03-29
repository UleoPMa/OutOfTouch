import { Router } from 'express';
import { helloWorld } from './controllers/index.js';

export const router = Router();

router.get('/', helloWorld);