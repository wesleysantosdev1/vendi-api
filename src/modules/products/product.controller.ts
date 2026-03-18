import { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import { prisma } from "../../config/database.js";

const productService = new ProductService();

export class ProductController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const product = await productService.create(req.body, userId);
            return res.status(201).json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message});
        }
    }

    async index(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const product = await productService.listAll(userId);
            return res.json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}