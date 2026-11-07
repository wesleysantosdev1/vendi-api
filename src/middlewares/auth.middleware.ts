import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Você precisa estar logado para acessar isso. Faça login novamente." });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Token em formato inválido. Use o cabeçalho 'Authorization: Bearer <token>'." });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] }) as { userId?: string };
        if (!decoded.userId) {
            return res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
        }
        req.user = { id: decoded.userId };
        return next();
    } catch (err) {
        if (err instanceof Jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Sua sessão expirou. Faça login novamente." });
        }
        return res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
    }
};
