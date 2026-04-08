import { prisma } from "../../config/database.js";

export class ExpenseService {
    async create(userId: string, data: any) {
        const { title, amount, type, productId, quantity, date } = data;

        const [day, month, year] = date.split('/');
        const now = new Date();
        const isoString = `${year}-${month}-${day}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
        const expenseDate = new Date(isoString);

        return await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    title,
                    amount,
                    type: type.toUpperCase(),
                    quantity,
                    userId,
                    date: expenseDate,
                    productId: productId || null,
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
            orderBy: { date: 'desc'},
            include: {
                product: {
                    select: {name: true}
                }
            }
        });
    }
}