import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { apiRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();
const controller = new DashboardController();

router.get('/summary', authMiddleware, apiRateLimiter, controller.getHomeData);

export default router;