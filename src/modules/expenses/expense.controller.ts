import { Request, Response } from "express";
import { ExpenseService } from "./expense.service.js";

const expenseService = new ExpenseService();

export class ExpenseController {
    async create(req: Request, res: Response) {
        try{
            const expense = await expenseService.create(req.body.userId, req.body);
            return res.status(201).json(expense);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async index(req: Request, res: Response) {
        try {
            const expense = await expenseService.listAll(req.body.userId);
            return res.json(expense);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}