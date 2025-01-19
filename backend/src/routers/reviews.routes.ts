import { Router } from "express";
import { ReviewsController } from "../controllers/reviews.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verification.tokens";

export const reviewRouter = Router();

const reviewController = new ReviewsController();

reviewRouter.post("/create-review", verifyToken, verifyUser, reviewController.createReview);
reviewRouter.put("/update-review/:ReviewId", verifyToken, verifyUser, reviewController.updateReview);
reviewRouter.delete("/delete-review/:ReviewId", verifyToken, verifyUser, reviewController.deleteReview);
reviewRouter.get("/get-all-reviews", verifyToken, verifyAdmin, reviewController.getAllReviews);
reviewRouter.get("/get-reviews-by-user/", verifyToken, verifyUser, reviewController.getReviewsByUserId);