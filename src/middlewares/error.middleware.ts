import { Request, Response, NextFunction } from "express";
import { AppError, sendError } from "../utils/app.error.js";

export const notFoundMiddleware = (req: Request, res: Response) => {
    return res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` });
};

// Fallback para o que escapar dos controllers (ex.: erro do express.json()).
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err?.type === "entity.parse.failed") {
        return sendError(res, new AppError("O corpo da requisição não é um JSON válido. Confira vírgulas, aspas e chaves.", 400));
    }

    if (err?.type === "entity.too.large") {
        return sendError(res, new AppError("O corpo da requisição é grande demais (limite de 100kb).", 413));
    }

    return sendError(res, err);
};
