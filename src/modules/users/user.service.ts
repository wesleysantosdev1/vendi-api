import { tr } from "date-fns/locale";
import { prisma } from "../../config/database.js";
import bcrypt from 'bcrypt';

export class UserService {
    async getProfile(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId},
            select: { id: true, name: true, email: true, createdAt: true }
        });
    }

    async updateProfile(userId: string, data: { name?: string; email?: string }) {
        return await prisma.user.update({
            where: { id: userId },
            data
        });
    }
}