import {Router} from "express";
import {protectRoute} from "../middleware/auth.middleware";
import {getTransactions,createTransaction,updateTransaction,deleteTransaction,getSummary} from "../controllers/transaction.controller"

const router = Router();

router.get("/",protectRoute,getTransactions)
router.post("/",protectRoute,createTransaction)
router.put("/:id",protectRoute,updateTransaction)
router.delete("/:id",protectRoute,deleteTransaction)
router.get("/summary",protectRoute,getSummary);


export default Router;

