import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { loginRateLimiter, registerRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();
const authController = new AuthController();

router.post('/register', registerRateLimiter, validate(registerSchema), authController.register);
router.post('/login', loginRateLimiter, validate(loginSchema), authController.login);

export default router;