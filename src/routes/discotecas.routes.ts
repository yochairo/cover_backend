import express from 'express';
import * as discotecaController from '../controllers/discotecas.controller';
import { verifyAuth } from "../middlewares/auth.middleware";
/* import { 
  validateCreateDiscoteca, 
  validateUpdateDiscoteca, 
  validateChangeStatus 
} from '../middlewares/discotecas.validation';
 */
const router = express.Router();

//Rutas públicas (sin autenticación)
router.get('/activas', discotecaController.obtenerDiscotecasActivas);
//router.get('/buscar', discotecaController.buscarDiscotecas);
router.get('/', discotecaController.obtenerDiscotecas);
router.get('/:id', discotecaController.obtenerDiscotecaPorId);

// Rutas protegidas (requieren autenticación y validación)
router.post('/', verifyAuth, discotecaController.crearDiscoteca);
router.put('/:id', verifyAuth, discotecaController.actualizarDiscoteca);
router.delete('/:id', verifyAuth, discotecaController.eliminarDiscoteca);

export default router;