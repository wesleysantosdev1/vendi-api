const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missingEnvVars.join(", ")}`);
}
