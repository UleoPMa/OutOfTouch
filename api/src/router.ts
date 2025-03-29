import { Router } from 'express';
import { helloWorld } from './controllers/index.js';
import { postMessage } from './controllers/chatbot.js';

export const router = Router();

router.get('/', helloWorld);
router.post('/message', postMessage);