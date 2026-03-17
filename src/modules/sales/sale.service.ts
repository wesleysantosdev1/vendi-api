import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";

export class SaleService {
    async create(userId: string, customer: string, items: { productId: string, quantity: number }[]) {
        return await prisma.$transaction(async (tx) => {
            let totalValue = 0;
            const saleItemsData = [];

            for (const item of items) {
                const product = await tx.product.findFirst({
                    where: { id: item.productId, userId}
                });

                if (!product) throw new Error(`Produto ${item.productId}não encontrado.`);
                if (product.stock < item.quantity) throw new Error(`Estoque insuficiente para: ${product.name}`);

                const subtotal = product.price * item.quantity;
                totalValue += subtotal;

                saleItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                });

                await tx.product.update({
                    where: { id: product.id},
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return await tx.sale.create({
                data: {
                    total: totalValue,
                    userId, 
                    items: {
                        create: saleItemsData
                    }
                },
                include: { items: true}
            });
        });
    }

    async listAll(userId: string) {
        return await prisma.sale.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc'}
        });
    }
}