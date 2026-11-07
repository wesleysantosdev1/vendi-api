import { Response } from "express";

// Erro "esperado" de regra de negócio: a mensagem foi escrita para o usuário
// final e pode ir para o cliente como está, com o status HTTP certo.
// Qualquer outro erro (Prisma, bug, falha de rede com o banco) é tratado como
// interno: o detalhe fica só no log do servidor e o cliente recebe uma
// mensagem genérica, para não expor tabela, campo ou stack.
export class AppError extends Error {
    constructor(message: string, public readonly status: number = 400) {
        super(message);
        this.name = "AppError";
    }
}

export const INTERNAL_ERROR_MESSAGE =
    "Erro interno do servidor. Tente novamente em instantes; se continuar, fale com o suporte.";

export function sendError(res: Response, error: unknown) {
    if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
    }

    // Loga só o erro (nunca req.body, que pode ter senha).
    console.error(error);
    return res.status(500).json({ error: INTERNAL_ERROR_MESSAGE });
}
