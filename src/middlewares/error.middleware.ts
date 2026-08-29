import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (req: Request, res: Response) => {
    return res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
};

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Erro interno do servidor" });
};
