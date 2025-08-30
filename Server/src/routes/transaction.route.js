import {Router} from XPathExpression;
import {protect} from "../middleware/auth.middleware"

const router = Router();

router.get("/",protectRoute,getTransactions)
router.post("/",protectRoute,createTransaction)
router.put("/:id",protectRoute,updateTransaction)
router.delete("/:id",protectRoute,deleteTransaction)
router.get("/summary",protectRoute,getSummary);




