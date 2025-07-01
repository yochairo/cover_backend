import express from 'express';
import * as eventoController from '../controllers/eventos.controller';
import { verifyAuth } from "../middlewares/auth.middleware";

const router = express.Router();


router.post('/', verifyAuth, eventoController.crearEvento);
router.get('/discoteca/:discoteca_id', eventoController.obtenerEventosPorDiscoteca);
router.get('/', eventoController.obtenerEventos);
router.get('/:id', eventoController.obtenerEventoPorId);
router.put('/:id', verifyAuth, eventoController.actualizarEvento);
router.delete('/:id', verifyAuth, eventoController.eliminarEvento);



export default router;