import { Router } from "express";
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js'
import saleRoutes from './modules/sales/sale.routes.js'
import expenseRoutes from './modules/expenses/expense.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import userRoutes from './modules/users/user.routes.js'
import reportRoutes from './modules/reports/reports.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

export default router;