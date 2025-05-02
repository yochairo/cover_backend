import { Router } from 'express';
import * as personasController from '../controllers/personas.controller';



const router = Router();


router.get('/personas',personasController.getPersonas);



export default router;


