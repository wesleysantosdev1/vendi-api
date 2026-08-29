import { prisma } from '../../config/database.js';
import {
    startOfDay,
    endOfDay,
    subDays,
    startOfWeek,
    endOfWeek,
    subWeeks,
    startOfMonth,
    endOfMonth,
    subMonths,
    format,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Sale = { createdAt: Date; total: number };
type Expense = { date: Date; amount: number };

type ChartPoint = { label: string; vendas: number; gastos: number; lucro: number };

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
                semana: this.formatWeekly(sales, expenses),
                mes: this.formatMonthly(sales, expenses)
            },
            summary: {
                totalVendido,
                totalGasto,
                lucro: totalVendido - totalGasto
            }
        };
    }

    private formatDaily(sales: Sale[], expenses: Expense[]): ChartPoint[] {
        const points: ChartPoint[] = [];

        for (let i = 6; i >= 0; i--) {
            const day = subDays(new Date(), i);
            const rangeStart = startOfDay(day);
            const rangeEnd = endOfDay(day);

            points.push(this.buildPoint(
                format(day, 'dd/MM'),
                sales, expenses,
                rangeStart, rangeEnd
            ));
        }

        return points;
    }

    private formatWeekly(sales: Sale[], expenses: Expense[]): ChartPoint[] {
        const points: ChartPoint[] = [];

        for (let i = 5; i >= 0; i--) {
            const reference = subWeeks(new Date(), i);
            const rangeStart = startOfWeek(reference, { weekStartsOn: 0 });
            const rangeEnd = endOfWeek(reference, { weekStartsOn: 0 });

            points.push(this.buildPoint(
                `${format(rangeStart, 'dd/MM')} - ${format(rangeEnd, 'dd/MM')}`,
                sales, expenses,
                rangeStart, rangeEnd
            ));
        }

        return points;
    }

    private formatMonthly(sales: Sale[], expenses: Expense[]): ChartPoint[] {
        const points: ChartPoint[] = [];

        for (let i = 5; i >= 0; i--) {
            const reference = subMonths(new Date(), i);
            const rangeStart = startOfMonth(reference);
            const rangeEnd = endOfMonth(reference);

            points.push(this.buildPoint(
                format(rangeStart, 'MMM/yy', { locale: ptBR }),
                sales, expenses,
                rangeStart, rangeEnd
            ));
        }

        return points;
    }

    private buildPoint(
        label: string,
        sales: Sale[],
        expenses: Expense[],
        rangeStart: Date,
        rangeEnd: Date
    ): ChartPoint {
        const vendas = sales
            .filter(s => s.createdAt >= rangeStart && s.createdAt <= rangeEnd)
            .reduce((acc, s) => acc + s.total, 0);

        const gastos = expenses
            .filter(e => new Date(e.date) >= rangeStart && new Date(e.date) <= rangeEnd)
            .reduce((acc, e) => acc + e.amount, 0);

        return { label, vendas, gastos, lucro: vendas - gastos };
    }
}
