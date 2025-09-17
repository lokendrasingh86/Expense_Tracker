import {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { budgetVsActual, monthlySpendingTrends, spendingByCategory } from "../controllers/analytics.controller";

const router = Router();

router.get('/spending-by-category',protectRoute,spendingByCategory);
router.get('/monthly-spending-trends',protectRoute,monthlySpendingTrends);
router.get("/budget-vs-actuals",protectRoute,budgetVsActual)

export default router;