import { prisma } from '../../config/database.js';

export class ReportService {
    async getDailyStats(userId: string) {
        const sales = await prisma.sale.findMany({
            where: { userId },
            select: { total: true, createdAt: true }
        });

        const expenses = await prisma.expense.findMany({
            where: { userId },
            select: { amount: true, date: true }
        });

        return { sales, expenses };
    }
}