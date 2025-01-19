import { Router } from "express";
import { ProgressController } from "../controllers/progress.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const progressRouter = Router();

const progressController = new ProgressController();

progressRouter.put("/update-progress", verifyToken, verifyAdmin, progressController.updateProgress);
progressRouter.put("/update-progress-status/:ProgressId", verifyToken, verifyUser, progressController.updateProgressStatus);
progressRouter.put("/approve-progress/:ProgressId", verifyToken, verifyUser, progressController.approveProgress);
progressRouter.delete("/delete-progress/:ProgressId", verifyToken, verifyAdmin, progressController.deleteProgress);
progressRouter.get("/get-all-progresses", verifyToken, verifyAdmin, progressController.getAllProgresses);
progressRouter.get("/get-completed-progresses", verifyToken, verifyAdmin, progressController.getCompletedProgresses);
progressRouter.get("/get-user-progress", verifyToken, verifyUser, progressController.getProgressesByUserId);