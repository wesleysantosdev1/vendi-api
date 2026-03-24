import { prisma } from '../../config/database.js';
import { startOfMonth } from 'date-fns';

export class ReportService {
    async getDailyStats(userId: string) {
        const [sales, expenses] = await Promise.all([
            prisma.sale.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
            prisma.expense.findMany({ where: { userId }, orderBy: { date: 'asc' } })
        ]);

        const now = new Date();
        const startMonth = startOfMonth(now);

        const totalVendido = sales
            .filter(s => s.createdAt >= startMonth)
            .reduce((acc, curr) => acc + curr.total, 0);

        const totalGasto = expenses
            .filter(e => new Date(e.date) >= startMonth)
            .reduce((acc, curr) => acc + curr.amount, 0);

        return { 
            chartData: {
                dia: this.formatDaily(sales, expenses),
                mes: this.formatMonthly(sales, expenses)
            },
            summary: {
                totalVendido,
                totalGasto,
                lucro: totalVendido - totalGasto
            }
        };
    }

    private formatDaily(sales: any[], expenses: any[]) {
        return [];
    }

    private formatMonthly(sales: any[], expenses: any[]) {
        return [];
    }
}