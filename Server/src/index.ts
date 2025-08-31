
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import transactionRoutes from "./routes/transaction.route.js";
import budgetRoutes from "./routes/budget.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use("/api/auth",authRoutes);
app.use("/api/transaction",transactionRoutes);

dotenv.config();
app.listen(PORT,()=>{
    console.log(`Server is runnig at ${PORT}`)
})