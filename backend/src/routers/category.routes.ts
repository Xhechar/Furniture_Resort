import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const categoryRouter = Router();

const categoryController = new CategoryController();

categoryRouter.post("/create-category", verifyToken, verifyAdmin, categoryController.createCategory);
categoryRouter.put("/update-category/:CategoryId", verifyToken, verifyAdmin, categoryController.updateCategory);
categoryRouter.delete("/delete-category/:CategoryId", verifyToken, verifyAdmin, categoryController.deleteCategory);
categoryRouter.get("/get-all-categories", verifyToken, verifyUser, categoryController.getAllCategories);