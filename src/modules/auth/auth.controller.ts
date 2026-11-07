import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { sendError } from "../../utils/app.error.js";

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async login(req: Request, res: Response ) {
        try {
            const data = await authService.login(req.body);
            return res.status(200).json(data);
        } catch (error) {
            return sendError(res, error);
        }
    }
};