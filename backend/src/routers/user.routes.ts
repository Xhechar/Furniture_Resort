import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const userRouter = Router();

const userController = new UserController();

userRouter.post("/register", userController.createUser);
userRouter.put("/update-user", verifyToken, verifyUser, userController.updateUser);
userRouter.put("/update-user-role/:UserId", verifyToken, verifyAdmin, userController.updateUserRole);
userRouter.put("/update-background-photo", verifyToken, verifyUser, userController.updateBackgroundPhoto);
userRouter.put("/soft-delete-single-user/:UserId", verifyToken, verifyAdmin, userController.softDeleteSingleUser);
userRouter.put("/soft-delete-multiple-users", verifyToken, verifyAdmin, userController.softDeleteMultipleUsers);
userRouter.delete("/delete-multiple-users", verifyToken, verifyAdmin, userController.deleteMultipleUsers);
userRouter.delete("/delete-single-user/:UserId", verifyToken, verifyAdmin, userController.deleteSingleUser);
userRouter.put("/restore-soft-deleted-user/:UserId", verifyToken, verifyAdmin, userController.restoreSoftDeletedUser);
userRouter.put("restore-multiple-deleted-users", verifyToken, verifyAdmin, userController.restoreMultipleSoftDeletedUser);
userRouter.get("/get-all-soft-deleted-users", verifyToken, verifyAdmin, userController.getAllSoftDeletedUsers);
userRouter.get("/get-all-users", verifyToken, verifyAdmin, userController.getAllUsers);
userRouter.get("/get-single-user", verifyToken, verifyUser, userController.getSingleUser);