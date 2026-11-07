import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { apiRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();
const reportController = new ReportController();

router.get('/daily', authMiddleware, apiRateLimiter, reportController.index);

export default router;