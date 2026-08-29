import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    price: z.number().positive("Preço deve ser maior que zero"),
    stock: z.number().int().min(0, "Estoque não pode ser negativo").optional(),
});

export const updateProductSchema = createProductSchema.partial();
