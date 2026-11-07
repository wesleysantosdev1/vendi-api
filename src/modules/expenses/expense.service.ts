import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app.error.js";

export class ExpenseService {
    async create(userId: string, data: any) {
        const { title, amount, type, productId, quantity, date } = data;

        const [day, month, year] = date.split('/');
        const now = new Date();
        const isoString = `${year}-${month}-${day}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
        const expenseDate = new Date(isoString);

        return await prisma.$transaction(async (tx) => {
            if (productId) {
                const product = await tx.product.findFirst({ where: { id: productId, userId } });
                if (!product) throw new AppError("Produto vinculado não encontrado. Ele pode ter sido excluído; escolha outro produto.", 404);
                if (!product.active) throw new AppError(`O produto "${product.name}" está desativado e não pode receber entrada de estoque.`, 422);
            }

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

            if (type.toUpperCase() === 'COMPRA' && productId) {
                await tx.product.update({
                    where: { id: productId, userId },
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