import { prisma } from "../../config/database.js";

export class ExpenseService {
    async create(userId: string, data: any) {
        const { title, amount, type, productId, quantity } = data;

        return await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    title, 
                    amount, 
                    type: data.type.toUpperCase(),
                    userId, 
                    date: new Date(data.date.split('/').reverse().join('-'))
                }
            });

            if (data.type === 'MERCHANDISE' && data.linkedProductId) {
                await tx.product.update({
                    where: { id: data.linkedProductId },
                    data: { 
                        stock: { increment: data.quantity || 0 } 
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