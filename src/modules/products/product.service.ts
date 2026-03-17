import { prisma } from "../../config/database.js";

export class ProductService {
    async create(data: { name: string; price: number; stock: number; }, userId: string ) {
        return await prisma.product.create({
            data: {
                ...data,
                userId
            }
        });
    }

    async listAll(userId: string) {
        return await prisma.product.findMany({
            where: { userId }
        });
    }

    async getById(id: string, userId: string) {
        const product = await prisma.product.findFirst({
            where: { id, userId}
        });
        if (!product) throw new Error('Produto não encontrado');
        return product;
    }
}