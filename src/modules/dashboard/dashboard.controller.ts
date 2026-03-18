import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service.js";

const dashboardService = new DashboardService();

export class DashboardController {
    async getHomeData(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const data = await dashboardService.getSummary(userId);
            return res.json(data);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}