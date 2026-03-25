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

    async update(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const product = await productService.update(id, req.body, userId);
            return res.json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async disable(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "ID inválido ou ausente" });
            }

            const product = await prisma.product.findFirst({
                where: { id, userId }
            });

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            await prisma.product.update({
                where: { id: id },
                data: { active: false }
            });

            return res.json({ message: "Produto desativado com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}