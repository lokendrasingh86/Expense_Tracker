"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const cors_1 = __importDefault(require("cors"));
// const [summaryRes, spendingRes, trendsRes, budgetRes, transactionsRes] = await Promise.all([
//         axiosInstance.get('/transaction/summary'),
//         axiosInstance.get('/analytics/spending-by-category'),
//         axiosInstance.get('/analytics/monthly-spending-trends'),
//         axiosInstance.get('/analytics/budget-vs-actuals'),
//         axiosInstance.get('/transaction') 
//       ]);
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://expense-tracker-7i2g.onrender.com"],
    credentials: true,
}));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/transaction", transaction_route_1.default);
app.use("/api/budgets", budget_routes_1.default);
app.use("/api/categories", categories_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
dotenv_1.default.config();
app.listen(PORT, () => {
    console.log(`Server is runnig at ${PORT}`);
});
//# sourceMappingURL=index.js.map