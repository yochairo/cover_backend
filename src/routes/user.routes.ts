import { Router } from 'express';
import { listUsers } from '../controllers/user.controller';

const router = Router();

router.get('/usuarios', listUsers);

export default router;