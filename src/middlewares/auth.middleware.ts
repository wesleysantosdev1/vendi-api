import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
    const [, token ] = authHeader.split('');

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as {userId: string};
        req.body.userId = decoded.userId;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token não fornecido'});
    }
};