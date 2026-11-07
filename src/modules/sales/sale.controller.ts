import { Request, Response } from "express";
import { SaleService } from "./sale.service.js";
import { sendError } from "../../utils/app.error.js";

const saleService = new SaleService();

export class SaleController {
    async create(req: Request, res: Response) {
        try{
            const userId = req.user!.id;
            const { customer, items } = req.body;

            const sale = await saleService.create(userId, customer, items);
            return res.status(201).json(sale);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async index(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const sales = await saleService.listAll(userId);
            return res.json(sales);
        } catch (error) {
            return sendError(res, error);
        }
    }
}