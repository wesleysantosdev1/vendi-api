import { z } from "zod";
import { MAX_MONEY, MAX_QUANTITY } from "../products/product.schema.js";

function isRealDate(value: string) {
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export const createExpenseSchema = z
    .object({
        title: z
            .string({ error: "Título é obrigatório" })
            .trim()
            .min(1, "Título é obrigatório")
            .max(120, "Título deve ter no máximo 120 caracteres"),
        amount: z
            .number({ error: "Valor é obrigatório e deve ser um número (ex.: 49.90)" })
            .positive("Valor deve ser maior que zero")
            .max(MAX_MONEY, `Valor deve ser no máximo ${MAX_MONEY.toLocaleString("pt-BR")}`),
        type: z.preprocess(
            (val) => (typeof val === "string" ? val.toUpperCase() : val),
            z.enum(["COMPRA", "OPERACIONAL"], {
                error: "Tipo de gasto deve ser 'COMPRA' (mercadoria) ou 'OPERACIONAL'",
            })
        ),
        productId: z.uuid("Produto inválido").optional().nullable(),
        quantity: z
            .number({ error: "Quantidade deve ser um número inteiro" })
            .int("Quantidade deve ser um número inteiro (sem casas decimais)")
            .positive("Quantidade deve ser maior que zero")
            .max(MAX_QUANTITY, `Quantidade deve ser no máximo ${MAX_QUANTITY.toLocaleString("pt-BR")}`)
            .optional(),
        date: z
            .string({ error: "Data é obrigatória" })
            .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato DD/MM/AAAA")
            .refine(isRealDate, "Data inválida: esse dia não existe no calendário"),
    })
    .refine((data) => !(data.type === "COMPRA" && data.productId && data.quantity === undefined), {
        message: "Informe a quantidade comprada para dar entrada no estoque do produto",
        path: ["quantity"],
    });
