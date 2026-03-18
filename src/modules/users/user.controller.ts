import { Request, Response } from "express";
import { UserService } from "./user.service.js";

const userService = new UserService();

export class UserController {
    async show(req: Request, res: Response) {
        try {
            const user = await userService.getProfile(req.user!.id);
            return res.json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const user = await userService.updateProfile(req.user!.id, req.body);
            return res.json({ message: "Perfil atualizado!", user });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}