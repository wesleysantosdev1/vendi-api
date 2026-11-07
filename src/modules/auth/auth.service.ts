import { prisma } from "../../config/database.js";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/app.error.js";


const EMAIL_TAKEN_MESSAGE = "Este e-mail já está cadastrado. Faça login ou use outro e-mail.";
// Mesma mensagem para e-mail inexistente e senha errada: não revela se a conta existe.
const INVALID_CREDENTIALS_MESSAGE = "Credenciais inválidas. Confira e tente novamente.";
// Hash descartável: quando o e-mail não existe, ainda rodamos um bcrypt.compare
// para a resposta levar o mesmo tempo e não denunciar quais e-mails têm conta.
const DUMMY_HASH = bcrypt.hashSync("vendi-dummy-password", 10);

export class AuthService {
    async register(userData: any){
        const { name, email, password } = userData;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new AppError(EMAIL_TAKEN_MESSAGE, 409);

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
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
        } catch (error) {
            // Dois cadastros simultâneos com o mesmo e-mail: o unique do banco barra o segundo.
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError(EMAIL_TAKEN_MESSAGE, 409);
            }
            throw error;
        }
    }

    // O cadastro grava o hash da senha "trimada". Contas antigas podem ter sido
    // criadas com espaço nas pontas, então se a versão trimada falhar e for diferente
    // da crua, tenta a crua. Roda igual com DUMMY_HASH (e-mail inexistente), para o
    // tempo de resposta não revelar se a conta existe.
    private async checkPassword(rawPassword: string, hash: string) {
        const trimmed = rawPassword.trim();
        if (await bcrypt.compare(trimmed, hash)) return true;
        if (trimmed !== rawPassword) return bcrypt.compare(rawPassword, hash);
        return false;
    }

    async login(credentials: any) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({ where: {email } });

        const isPasswordValid = await this.checkPassword(password, user?.password ?? DUMMY_HASH);
        if (!user || !isPasswordValid) throw new AppError(INVALID_CREDENTIALS_MESSAGE, 401);

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