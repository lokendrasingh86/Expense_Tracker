import express from "express";
import dotenv from "dotenv";
import {Request,Response,NextFunction} from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes"
import transactionRoutes from "./routes/transaction.route";
import budgetRoutes from "./routes/budget.routes";
import categoriesRoutes from "./routes/categories.routes"
import analyticsRoutes from "./routes/analytics.routes"

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth",authRoutes);
app.use("/api/transaction",transactionRoutes);
app.use("/api/budgets",budgetRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/analytics", analyticsRoutes);

)

dotenv.config();

app.listen(PORT,()=>{
    console.log(`Server is runnig at ${PORT}`)
})