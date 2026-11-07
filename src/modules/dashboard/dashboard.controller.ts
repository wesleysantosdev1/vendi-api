import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service.js";
import { sendError } from "../../utils/app.error.js";

const dashboardService = new DashboardService();

export class DashboardController {
    async getHomeData(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const data = await dashboardService.getSummary(userId);
            return res.json(data);
        } catch (error) {
            return sendError(res, error);
        }
    }
}