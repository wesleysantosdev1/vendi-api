import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app.error.js";

export class SaleService {
    async create(
        userId: string,
        customer: { name: string; phone?: string },
        items: { productId: string; quantity: number }[]
     ) {
        return await prisma.$transaction(async (tx) => {
            let totalValue = 0;
            const saleItemsData = [];

            for (const item of items) {
                const product = await tx.product.findFirst({
                    where: { id: item.productId, userId}
                });

                if (!product) throw new AppError("Um dos produtos da venda não foi encontrado. Ele pode ter sido excluído; atualize a lista e tente de novo.", 404);
                if (!product.active) throw new AppError(`O produto "${product.name}" está desativado e não pode ser vendido.`, 422);

                const subtotal = product.price * item.quantity;
                totalValue += subtotal;

                saleItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                });

                // Decremento condicional: só baixa se ainda houver estoque suficiente
                // (evita estoque negativo e corrida entre vendas simultâneas).
                const { count } = await tx.product.updateMany({
                    where: { id: product.id, userId, active: true, stock: { gte: item.quantity } },
                    data: { stock: { decrement: item.quantity } }
                });

                if (count === 0) {
                    throw new AppError(`Estoque insuficiente para "${product.name}": você tentou vender ${item.quantity}, mas há só ${product.stock} em estoque.`, 409);
                }
            }

            return await tx.sale.create({
                data: {
                    userId,
                    total: totalValue,
                    customerName: customer.name,
                    customerPhone: customer.phone,
                    items: {
                        create: saleItemsData
                    }
                },
                include: { 
                    items: {
                        include: { product: true }
                    }
                }
            });
        });
    }

    async listAll(userId: string) {
        return await prisma.sale.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
}