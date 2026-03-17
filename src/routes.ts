import { Router } from "express";
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js'
import saleRouter from './modules/sales/sale.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRouter);

export default router;