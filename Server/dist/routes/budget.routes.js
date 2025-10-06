"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const budget_controller_1 = require("../controllers/budget.controller");
const router = (0, express_1.default)();
router.get("/", auth_middleware_1.protectRoute, budget_controller_1.getBudgets);
router.post("/", auth_middleware_1.protectRoute, budget_controller_1.createBudget);
router.put("/:id", auth_middleware_1.protectRoute, budget_controller_1.updateBudget);
router.delete("/:id", auth_middleware_1.protectRoute, budget_controller_1.deleteBudget);
router.get("/:id/summary", auth_middleware_1.protectRoute, budget_controller_1.getBudgetSummary);
exports.default = router;
//# sourceMappingURL=budget.routes.js.map