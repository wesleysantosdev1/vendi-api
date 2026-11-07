import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { sendError } from "../../utils/app.error.js";

const userService = new UserService();

export class UserController {
    async show(req: Request, res: Response) {
        try {
            const user = await userService.getProfile(req.user!.id);
            return res.json(user);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const user = await userService.updateProfile(req.user!.id, req.body);
            return res.json({ message: "Perfil atualizado!", user });
        } catch (error) {
            return sendError(res, error);
        }
    }
}