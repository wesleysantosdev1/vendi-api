import { z } from "zod";

export const MAX_MONEY = 1_000_000;
export const MAX_QUANTITY = 1_000_000;

export const createProductSchema = z.object({
    name: z
        .string({ error: "Nome do produto é obrigatório" })
        .trim()
        .min(1, "Nome do produto é obrigatório")
        .max(120, "Nome do produto deve ter no máximo 120 caracteres"),
    price: z
        .number({ error: "Preço é obrigatório e deve ser um número (ex.: 19.90)" })
        .positive("Preço deve ser maior que zero")
        .max(MAX_MONEY, `Preço deve ser no máximo ${MAX_MONEY.toLocaleString("pt-BR")}`),
    stock: z
        .number({ error: "Estoque deve ser um número inteiro" })
        .int("Estoque deve ser um número inteiro (sem casas decimais)")
        .min(0, "Estoque não pode ser negativo")
        .max(MAX_QUANTITY, `Estoque deve ser no máximo ${MAX_QUANTITY.toLocaleString("pt-BR")}`)
        .optional(),
});

export const updateProductSchema = createProductSchema
    .partial()
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Informe ao menos um campo para atualizar (nome, preço ou estoque)",
    });
