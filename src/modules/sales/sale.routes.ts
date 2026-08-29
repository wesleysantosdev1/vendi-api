import { Router } from 'express';
import { SaleController } from './sale.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createSaleSchema } from './sale.schema.js';

const router = Router();
const saleController = new SaleController();

router.use(authMiddleware);

router.post('/', validate(createSaleSchema), saleController.create);
router.get('/', saleController.index);

export default router;