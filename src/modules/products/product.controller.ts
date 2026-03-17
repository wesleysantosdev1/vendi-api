import { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import { prisma } from "../../config/database.js";

const productService = new ProductService();

export class ProductController {
    async create(req: Request, res: Response) {
        try {
            const product = await productService.create(req.body, req.body.userId);
            return res.status(201).json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message});
        }
    }

    async index(req: Request, res: Response) {
        try {
            const product = await productService.listAll(req.body.userId);
            return res.json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}