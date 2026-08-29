import { z } from "zod";

export const createSaleSchema = z.object({
    customer: z.object({
        name: z.string().trim().min(1, "Nome do cliente é obrigatório"),
        phone: z.string().trim().optional(),
    }),
    items: z
        .array(
            z.object({
                productId: z.string().min(1, "productId é obrigatório"),
                quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
            })
        )
        .min(1, "A venda precisa ter ao menos um item"),
});
