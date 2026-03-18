import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
const reportController = new ReportController();

router.get('/daily', authMiddleware, reportController.index);

export default router;