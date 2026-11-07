import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app.error.js";

const PRODUCT_NOT_FOUND_MESSAGE = "Produto não encontrado. Ele pode ter sido excluído; atualize a lista.";

export class ProductService {
    async create(data: { name: string; price: number; stock?: number; }, userId: string ) {
        return await prisma.product.create({
            data: {
                ...data,
                userId
            }
        });
    }

    async listAll(userId: string) {
        return await prisma.product.findMany({
            where: {
                userId,
                active: true
            }
        });
    }

    async getById(id: string, userId: string) {
        const product = await prisma.product.findFirst({
            where: { id, userId}
        });
        if (!product) throw new AppError(PRODUCT_NOT_FOUND_MESSAGE, 404);
        return product;
    }

    async update(id: string, data: { name?: string; price?: number; stock?: number }, userId: string) {
        // updateMany com { id, userId }: só altera se o produto for do usuário do token.
        const { count } = await prisma.product.updateMany({
            where: { id, userId },
            data
        });

        if (count === 0) throw new AppError(PRODUCT_NOT_FOUND_MESSAGE, 404);

        return await this.getById(id, userId);
    }

    async disable(id: string, userId: string) {
        const { count } = await prisma.product.updateMany({
            where: { id, userId },
            data: { active: false }
        });

        if (count === 0) throw new AppError(PRODUCT_NOT_FOUND_MESSAGE, 404);
    }
}
