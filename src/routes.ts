import { Router } from "express";
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js'
import saleRouter from './modules/sales/sale.routes.js'
import expenseRouter from './modules/expenses/expense.routes.js'
import dashboardRouter from './modules/dashboard/dashboard.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRouter);
router.use('/expenses', expenseRouter);
router.use('/dashboard', dashboardRouter);

export default router;