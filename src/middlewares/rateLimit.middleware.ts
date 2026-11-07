import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas tentativas de login. Tente novamente em alguns minutos." },
});

export const registerRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas tentativas de cadastro. Tente novamente mais tarde." },
});

// Rotas autenticadas: limite por usuário (id do token), não por IP — vários
// clientes atrás do mesmo IP de operadora não se bloqueiam entre si.
// Deve vir DEPOIS do authMiddleware, que preenche req.user.
// 300 a cada 15 min (~20/min) sobra para o uso normal do app.
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user:${req.user!.id}`,
    message: { error: "Muitas requisições em pouco tempo. Aguarde alguns minutos e tente novamente." },
});
