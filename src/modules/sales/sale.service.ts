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