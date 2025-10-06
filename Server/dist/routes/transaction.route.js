"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const transaction_controller_1 = require("../controllers/transaction.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.protectRoute, transaction_controller_1.getTransactions);
router.post("/", auth_middleware_1.protectRoute, transaction_controller_1.createTransaction);
router.put("/:id", auth_middleware_1.protectRoute, transaction_controller_1.updateTransaction);
router.delete("/:id", auth_middleware_1.protectRoute, transaction_controller_1.deleteTransaction);
router.get("/summary", auth_middleware_1.protectRoute, transaction_controller_1.getSummary);
exports.default = router;
//# sourceMappingURL=transaction.route.js.map