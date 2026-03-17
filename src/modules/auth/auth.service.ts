import { prisma } from "../../config/database.js";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";


export class AuthService {
    async register(userData: any){
        const { name, email, password } = userData;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('E-mail ja cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);

        return await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true, 
                name: true, 
                email: true
            }
        });
    }

    async login(credentials: any) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({ where: {email } });
        if (!user) throw new Error('Credenciais inválidas');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Credenciais inválidas');

        const token = Jwt.sign(
            { userId: user.id},
            process.env.JWT_SECRET as string,
            { expiresIn: '1d'}
        );

        return {
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            },
            token
        };
    }
}