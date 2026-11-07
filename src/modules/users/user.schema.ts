import { z } from "zod";
import { nameSchema, emailSchema } from "../auth/auth.schema.js";

export const updateUserSchema = z
    .object({
        name: nameSchema.optional(),
        email: emailSchema.optional(),
    })
    .refine((data) => data.name !== undefined || data.email !== undefined, {
        message: "Informe ao menos um campo para atualizar (nome ou e-mail)",
    });
