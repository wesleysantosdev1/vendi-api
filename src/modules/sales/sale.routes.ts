import { Router } from 'express';
import { SaleController } from './sale.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const saleController = new SaleController();

router.use(authMiddleware);

router.post('/', saleController.create);
router.get('/', saleController.index);

export default router;