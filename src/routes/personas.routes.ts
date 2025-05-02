import { Router } from 'express';
import * as personasController from '../controllers/personas.controller';



const router = Router();


router.get('/personas',personasController.getPersonas);
router.get('/persona/:id',personasController.getPersona);
router.post('/createPersona', personasController.create);


export default router;


