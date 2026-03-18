import { Request, Response } from "express";
import { ReportService } from "./report.service.js";

const reportService = new ReportService();

export class ReportController {
    async index(req: Request, res: Response) {
        try {
            const stats = await reportService.getDailyStats(req.user!.id);
            return res.json(stats);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}