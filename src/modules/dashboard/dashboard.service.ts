import { prisma } from "../../config/database.js";
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';

export class DashboardService {
    async getSummary(userId: string) {
        const now = new Date();

        const today = startOfDay(now);
        const week = startOfWeek(now);
        const month = startOfMonth(now);

        const [salesToday, salesWeek, salesMonth, expensesMonth] = await Promise.all([
            prisma.sale.aggregate({ _sum: { total: true }, where: { userId, createdAt: { gte: today } } }),
            prisma.sale.aggregate({ _sum: { total: true }, where: { userId, createdAt: { gte: week } } }),
            prisma.sale.aggregate({ _sum: { total: true }, where: { userId, createdAt: { gte: month } } }),
            prisma.expense.aggregate({ _sum: { amount: true }, where: { userId, date: { gte: month } } }),
        ]);

        const totalSalesMonth = salesMonth._sum.total || 0;
        const totalExpenseMonth = expensesMonth._sum.amount || 0;

        return {
            today: salesToday._sum.total || 0,
            week: salesWeek._sum.total || 0, 
            month: totalSalesMonth,
            expensesMonth: totalExpenseMonth, 
            profitMonth: totalSalesMonth - totalExpenseMonth
        };
    }
}