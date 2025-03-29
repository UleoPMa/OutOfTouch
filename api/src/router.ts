import express = require ('express');
const { enviar } = require('./controllers/correo');
import { Router } from 'express';
import dotenv = require ('dotenv');
import { helloWorld } from './controllers/index.js';

dotenv.config();

export const router = Router();

router.post('/enviar-correo', enviar);
router.get('/', helloWorld);