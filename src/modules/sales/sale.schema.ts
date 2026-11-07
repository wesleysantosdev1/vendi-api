import { z } from "zod";
import { MAX_QUANTITY } from "../products/product.schema.js";

export const createSaleSchema = z.object({
    customer: z.object(
        {
            name: z
                .string({ error: "Nome do cliente é obrigatório" })
                .trim()
                .min(1, "Nome do cliente é obrigatório")
                .max(100, "Nome do cliente deve ter no máximo 100 caracteres"),
            phone: z
                .string({ error: "Telefone deve ser um texto" })
                .trim()
                .max(20, "Telefone deve ter no máximo 20 caracteres")
                .regex(/^[0-9()+\-.\s]*$/, "Telefone deve ter só números, espaços, parênteses, + ou -")
                .optional(),
        },
        { error: "Dados do cliente são obrigatórios" }
    ),
    items: z
        .array(
            z.object({
                productId: z.uuid("Produto inválido"),
                quantity: z
                    .number({ error: "Quantidade deve ser um número inteiro" })
                    .int("Quantidade deve ser um número inteiro (sem casas decimais)")
                    .positive("Quantidade deve ser maior que zero")
                    .max(MAX_QUANTITY, `Quantidade deve ser no máximo ${MAX_QUANTITY.toLocaleString("pt-BR")}`),
            }),
            { error: "Itens da venda são obrigatórios" }
        )
        .min(1, "A venda precisa ter ao menos um item")
        .max(100, "A venda pode ter no máximo 100 itens diferentes"),
});
