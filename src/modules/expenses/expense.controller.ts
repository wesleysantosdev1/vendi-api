import { Request, Response } from "express";
import { ExpenseService } from "./expense.service.js";
import { sendError } from "../../utils/app.error.js";

const expenseService = new ExpenseService();

export class ExpenseController {
    async create(req: Request, res: Response) {
        try{
            const userId = req.user!.id;
            const expense = await expenseService.create(userId, req.body);
            return res.status(201).json(expense);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async index(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const expense = await expenseService.listAll(userId);

            const formattedExpenses = expense.map(exp => ({
                id: exp.id,
                title: exp.title,
                amount: exp.amount,
                type: exp.type, 
                date: exp.date, 
                quantity: exp.quantity, 
                productId: exp.productId, 
                linkedProductName: exp.product?.name || null
            }));
            
            return res.json(formattedExpenses);
        } catch (error) {
            return sendError(res, error);
        }
    }
}