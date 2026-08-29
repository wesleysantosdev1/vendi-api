import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateUserSchema } from "./user.schema.js";

const router = Router();
const useController = new UserController();

router.use(authMiddleware);

router.get('/me', useController.show);
router.post('/update', validate(updateUserSchema), useController.update);

export default router;