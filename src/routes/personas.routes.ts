import { Router } from "express";
import * as personasController from "../controllers/personas.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/registerCliente", personasController.registerCliente);
router.post("/loginCliente", personasController.loginCliente);

router.post("/registerPersonal", personasController.registerPersonalD);
router.post("/loginPersonal", personasController.loginPersonalD);

router.get("/", verifyAuth, personasController.getPersonas);
router.get("/:id", verifyAuth, personasController.getPersona);
router.put("/:id", verifyAuth, personasController.updatePersonaBasico);
router.post("/", verifyAuth, personasController.create); 

/* router.get("/", personasController.getPersonas);
router.get("/:id", personasController.getPersona);
router.put("/:id", personasController.updatePersonaBasico);
router.post("/", personasController.create); */

export default router;
