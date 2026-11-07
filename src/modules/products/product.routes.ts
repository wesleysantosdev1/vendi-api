import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { apiRateLimiter } from "../../middlewares/rateLimit.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";

const router = Router();
const productController = new ProductController();

router.use(authMiddleware, apiRateLimiter);

router.post('/', validate(createProductSchema), productController.create);
router.get('/', productController.index);
router.put('/:id', validate(updateProductSchema), productController.update);
router.patch('/:id/disable', productController.disable);

export default router;