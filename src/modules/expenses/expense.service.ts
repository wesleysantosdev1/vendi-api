import { prisma } from "../../config/database.js";

export class ExpenseService {
    async create(userId: string, data: any) {
        const { title, amount, type, productId, quantity } = data;

        return await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    title, 
                    amount, 
                    type, 
                    userId, 
                    date: new Date()
                }
            });

            if (type === 'COMPRA' && productId && quantity) {
                await tx.product.update({
                    where: { id: productId }, 
                    data: { stock: { increment: quantity } }
                });
            }

            return expense;
        });
    }

    async listAll(userId: string) {
        return await prisma.expense.findMany({
            where: { userId },
            orderBy: { date: 'desc'}
        });
    }
}