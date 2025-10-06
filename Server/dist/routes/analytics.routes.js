"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
router.get('/spending-by-category', auth_middleware_1.protectRoute, analytics_controller_1.spendingByCategory);
router.get('/monthly-spending-trends', auth_middleware_1.protectRoute, analytics_controller_1.monthlySpendingTrends);
router.get("/budget-vs-actuals", auth_middleware_1.protectRoute, analytics_controller_1.budgetVsActual);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map