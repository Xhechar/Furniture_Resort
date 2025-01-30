import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAdmin, verifyToken } from "../middlewares/verification.tokens";

export let authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.loginUser);
authRouter.post("/change-password", authController.changePassword);
authRouter.get("/recoveries", verifyToken, verifyAdmin, authController.getAllRecoveries);
authRouter.post('/verify-mail', authController.verifyMail);