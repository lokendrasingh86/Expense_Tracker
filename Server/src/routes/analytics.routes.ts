import {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.get('/spending-by-category',protectRoutem,spendingByCategory);
router.get('/monthly-trends',protectRoute,monthlySpendingTrends);
router.get("/budget-vs-actuals",protectRoute,budgetVsActual)

export default router;