import { prisma } from "../../config/database.js";

export class ExpenseService {
    async create(userId: string, data: any) {
        const { title, amount, type, productId, quantity, date } = data;

        return await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    title,
                    amount,
                    type: type.toUpperCase(),
                    quantity,
                    userId,
                    date: new Date(date.split('/').reverse().join('-'))
                }
            });

            if (type.toUpperCase() === 'MERCHANDISE' && productId) {
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        stock: { increment: quantity || 0 }
                    }
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