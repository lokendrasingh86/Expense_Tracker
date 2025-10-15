import express from "express";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.route";
import budgetRoutes from "./routes/budget.routes";
import categoriesRoutes from "./routes/categories.routes";
import analyticsRoutes from "./routes/analytics.routes";
import cors from "cors";
// const [summaryRes, spendingRes, trendsRes, budgetRes, transactionsRes] = await Promise.all([
//         axiosInstance.get('/transaction/summary'),
//         axiosInstance.get('/analytics/spending-by-category'),
//         axiosInstance.get('/analytics/monthly-spending-trends'),
//         axiosInstance.get('/analytics/budget-vs-actuals'),
//         axiosInstance.get('/transaction')
//       ]);

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://expense-tracker-fhb67b09s-lokendra-singhs-projects-a38da751.vercel.app",
      "https://expense-tracker-7i2g.onrender.com",
      /^https:\/\/.*\.vercel\.app$/, // Allow any Vercel subdomain
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/analytics", analyticsRoutes);

dotenv.config();

app.listen(PORT, () => {
  console.log(`Server is runnig at ${PORT}`);
});
