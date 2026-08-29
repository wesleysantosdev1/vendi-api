import { z } from "zod";

export const createExpenseSchema = z.object({
    title: z.string().trim().min(1, "Título é obrigatório"),
    amount: z.number().positive("Valor deve ser maior que zero"),
    type: z.preprocess(
        (val) => (typeof val === "string" ? val.toUpperCase() : val),
        z.enum(["COMPRA", "OPERACIONAL"], {
            error: "type deve ser 'COMPRA' ou 'OPERACIONAL'",
        })
    ),
    productId: z.string().min(1).optional().nullable(),
    quantity: z.number().int().positive("Quantidade deve ser maior que zero").optional(),
    date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "date deve estar no formato DD/MM/AAAA"),
});
