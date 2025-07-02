import express from 'express';
import * as personalController from '../controllers/personal.controller';
import { verifyAuth } from "../middlewares/auth.middleware";

const router = express.Router();

// REGISTRO Y AUTENTICACIÓN (Sin auth requerido)
router.post('/register', personalController.registerPersonal);
router.post('/login', personalController.loginPersonalD);
//router.post('/setup-admin', personalController.setupInitialAdmin);
router.post('/create-from-persona', personalController.createPersonalFromPersona);

// SETUP Y ESTADO (Requiere auth)
//router.get('/setup/status/:personaId', verifyAuth, personalController.checkSetupStatus);
//router.put('/:id/setup/complete', verifyAuth, personalController.markSetupComplete);
router.put('/:id/complete-profile', verifyAuth, personalController.completePersonalProfile);

// CRUD BÁSICO (Requiere auth)
//router.get('/', verifyAuth, personalController.getPersonalList);
//router.get('/search', verifyAuth, personalController.searchPersonal);
router.get('/:id', verifyAuth, personalController.getPersonalById);
//router.get('/persona/:personaId', verifyAuth, personalController.getPersonalByPersonaId);
router.put('/:id', verifyAuth, personalController.updatePersonal);
router.delete('/:id', verifyAuth, personalController.deletePersonal);


// RELACIONES CON DISCOTECAS (Requiere auth)
router.get('/discoteca/:discotecaId', verifyAuth, personalController.getPersonalByDiscoteca);
// router.post('/:id/assign-discoteca', verifyAuth, personalController.assignToDiscoteca);
// router.delete('/:id/discoteca/:discotecaId', verifyAuth, personalController.removeFromDiscoteca);
// router.get('/:id/discotecas', verifyAuth, personalController.getPersonalDiscotecas);
// router.put('/:id/discoteca/:discotecaId/role', verifyAuth, personalController.updateRoleInDiscoteca);

// VALIDACIONES (Requiere auth)
//router.get('/validate/:personaId', verifyAuth, personalController.validatePersonalExists);

export default router;