import { z } from "zod";

export const updateUserSchema = z
    .object({
        name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
        email: z.string().trim().email("E-mail inválido").optional(),
    })
    .refine((data) => data.name !== undefined || data.email !== undefined, {
        message: "Informe ao menos um campo para atualizar",
    });
