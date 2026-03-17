import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();
const productController = new ProductController();

router.use(authMiddleware);

router.post('/', productController.create);
router.get('/', productController.index);

export default router;