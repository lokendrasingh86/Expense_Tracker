import Router from "express";
import { protectRoute } from "../middleware/auth.middleware";

import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} from "../controllers/budget.controller";

const router = Router();

router.get("/", protectRoute, getBudgets);
router.post("/", protectRoute, createBudget);
router.put("/:id", protectRoute, updateBudget);
router.delete("/:id", protectRoute, deleteBudget);
router.get("/:id/summary", protectRoute, getBudgetSummary);

export default router;
