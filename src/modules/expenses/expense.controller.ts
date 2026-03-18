import { Request, Response } from "express";
import { ExpenseService } from "./expense.service.js";

const expenseService = new ExpenseService();

export class ExpenseController {
    async create(req: Request, res: Response) {
        try{
            const userId = req.user!.id;
            const expense = await expenseService.create(userId, req.body);
            return res.status(201).json(expense);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async index(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const expense = await expenseService.listAll(userId);
            return res.json(expense);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}