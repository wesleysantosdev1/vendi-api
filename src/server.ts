import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "API do Projeto 100% Back-end rodando com TypeScript!",
        status: "OK"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`✅ TypeScript configurado com sucesso!`);
    console.log(`-----------------------------------------`);
})