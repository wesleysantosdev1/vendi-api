import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

// Mensagens padrão do zod em português (para os casos sem mensagem própria no schema).
z.config(z.locales.pt());

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    // Sem body/Content-Type o Express 5 deixa req.body undefined: valida como objeto
    // vazio para o usuário ver quais campos faltam, e não "esperado objeto".
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
        const details = result.error.issues.map(issue => ({
            field: issue.path.join(".") || null,
            message: issue.message,
        }));
        // `error` é o texto que o app mostra; `details` aponta o campo de cada problema.
        const message = [...new Set(details.map(detail => detail.message))].join("; ");
        return res.status(400).json({ error: message, details });
    }
    req.body = result.data;
    return next();
};
