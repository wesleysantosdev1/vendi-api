import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { notFoundMiddleware, errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim());

app.use(cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
}));
app.use(express.json());
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;