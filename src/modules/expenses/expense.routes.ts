import { ExpenseController } from "./expense.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createExpenseSchema } from "./expense.schema.js";
import { Router } from "express";

const router = Router();
const expenseController = new ExpenseController();

router.use(authMiddleware);

router.post('/', validate(createExpenseSchema), expenseController.create);
router.get('/', expenseController.index);

export default router;