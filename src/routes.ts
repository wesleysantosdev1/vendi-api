import { Router } from "express";
import { prisma } from './config/database.js';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js'
import saleRoutes from './modules/sales/sale.routes.js'
import expenseRoutes from './modules/expenses/expense.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import userRoutes from './modules/users/user.routes.js'
import reportRoutes from './modules/reports/reports.routes.js'

const router = Router();

router.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.json({ status: 'ok' });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ status: 'error', error: 'Banco de dados indisponível' });
    }
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

export default router;