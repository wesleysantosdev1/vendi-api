import { z } from "zod";

// bcrypt só usa os primeiros 72 bytes da senha; acima disso o resto seria ignorado.
const PASSWORD_MAX_BYTES = 72;
const PASSWORD_MIN_LENGTH = 8;

function joinPt(items: string[]) {
    if (items.length <= 1) return items.join("");
    return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

// Senha forte: usada no cadastro (e em qualquer troca de senha futura).
// Não usar no login: quem já tem conta com senha antiga precisa continuar entrando.
// trim: o teclado do Android costuma pôr espaço depois de palavra sugerida; espaço
// nas pontas não conta nem vai para o hash. Espaço no meio é aceito, mas não vale como símbolo.
export const strongPasswordSchema = z
    .string({ error: "Senha é obrigatória" })
    .trim()
    .superRefine((value, ctx) => {
        if (Buffer.byteLength(value, "utf8") > PASSWORD_MAX_BYTES) {
            ctx.addIssue({ code: "custom", message: `Senha muito longa: use no máximo ${PASSWORD_MAX_BYTES} caracteres` });
            return;
        }

        const missing: string[] = [];
        if (value.length < PASSWORD_MIN_LENGTH) missing.push(`pelo menos ${PASSWORD_MIN_LENGTH} caracteres`);
        if (!/[a-z]/.test(value)) missing.push("uma letra minúscula");
        if (!/[A-Z]/.test(value)) missing.push("uma letra maiúscula");
        if (!/[0-9]/.test(value)) missing.push("um número");
        if (!/[^A-Za-z0-9\s]/.test(value)) missing.push("um símbolo (ex.: ! @ # $ %)");

        if (missing.length > 0) {
            ctx.addIssue({ code: "custom", message: `A senha precisa ter ${joinPt(missing)}` });
        }
    });

export const nameSchema = z
    .string({ error: "Nome é obrigatório" })
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres");

export const emailSchema = z
    .string({ error: "E-mail é obrigatório" })
    .trim()
    .toLowerCase()
    .max(254, "E-mail deve ter no máximo 254 caracteres")
    .email("E-mail inválido: confira se está no formato nome@exemplo.com");

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: strongPasswordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string({ error: "Senha é obrigatória" })
        .min(1, "Senha é obrigatória")
        .max(200, "Senha muito longa"),
});
