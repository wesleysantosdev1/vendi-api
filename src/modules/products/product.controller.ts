import { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import { sendError } from "../../utils/app.error.js";

const productService = new ProductService();

export class ProductController {
    async create(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const product = await productService.create(req.body, userId);
            return res.status(201).json(product);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async index(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const product = await productService.listAll(userId);
            return res.json(product);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "ID do produto inválido ou ausente na URL" });
            }

            const product = await productService.update(id, req.body, userId);
            return res.json(product);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async disable(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "ID do produto inválido ou ausente na URL" });
            }

            await productService.disable(id, userId);

            return res.json({ message: "Produto desativado com sucesso" });
        } catch (error) {
            return sendError(res, error);
        }
    }
}