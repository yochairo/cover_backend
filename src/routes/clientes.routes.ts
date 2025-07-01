import { Router } from "express";
import * as clientesController from "../controllers/clientes.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/registerCliente", clientesController.createCliente);
router.post("/loginCliente", clientesController.loginCliente);

router.get("/", verifyAuth, clientesController.getClientes);
router.get("/:id", verifyAuth, clientesController.getClienteById);
router.put("/:id", verifyAuth, clientesController.updateCliente);

export default router;