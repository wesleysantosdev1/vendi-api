import { ExpenseController } from "./expense.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();
const expenseController = new ExpenseController();

router.use(authMiddleware);

router.post('/', expenseController.create);
router.get('/', expenseController.index);

export default router;