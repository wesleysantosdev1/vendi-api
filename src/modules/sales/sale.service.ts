import { prisma } from "../../config/database.js";

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

                if (!product) throw new Error("Produto não encontrado");
                if (!product.active) throw new Error(`Produto "${product.name}" está desativado`);

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
                    throw new Error(`Estoque insuficiente para "${product.name}"`);
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