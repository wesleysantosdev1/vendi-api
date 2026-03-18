import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
const useController = new UserController();

router.use(authMiddleware);

router.get('/me', useController.show);
router.post('/update', useController.update);

export default router;