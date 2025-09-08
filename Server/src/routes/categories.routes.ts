import {Router} from "express";
import {protectRoute} from "../middleware/auth.middleware";
import { getCategories,createCategory,updateCategory,deleteCategory } from "../controllers/categories.controller";

const router = Router();

router.get("/",protectRoute,getCategories);
router.post("/",protectRoute,createCategory);
router.put("/:id",protectRoute,updateCategory)
router.delete("/:id",protectRoute,deleteCategory);

export default router;

