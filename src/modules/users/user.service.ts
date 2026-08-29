import { prisma } from "../../config/database.js";
import bcrypt from 'bcrypt';

export class UserService {
    async getProfile(userId: string) {
        const [user, salesCount, productsCount, uniqueClient] = await Promise.all([
            prisma.user.findUnique({
                where: {id: userId},
                select: {id: true, name: true, email: true, createdAt: true}
            }),

            prisma.sale.count({
                where: {userId}
            }), 

            prisma.product.count({
                where: { userId, active: true}
            }), 

            prisma.sale.findMany({
                where: {
                    userId, 
                    customerPhone: { notIn: null, not: "" } 
                }, 
                distinct: ['customerPhone'],
                select: { customerPhone: true }
            })
        ]);

        if (!user) throw new Error("Usuário não encontrado");

        return {
            ...user,
            stats: {
                sales: salesCount, 
                products: productsCount, 
                clients: uniqueClient.length
            }
        };
    }

    async updateProfile(userId: string, data: { name?: string; email?: string }) {
        return await prisma.user.update({
            where: { id: userId },
            data
        });
    }
}